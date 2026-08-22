(function initAiCopyAdapters(global) {
  "use strict";

  function createAiCopyController(options = {}) {
    const {
      getSettings = () => ({}),
      isSensitiveTarget = () => false,
      runSafeAsync = (callback) => Promise.resolve().then(callback).catch(() => {}),
      sendTextCapture = async () => {},
      readClipboardText = async () => "",
      delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      markCopyEvent = () => {}
    } = options;
    const aiCopyControlsInFlight = new WeakSet();
    let lastAiCopyCapture = { signature: "", at: 0 };

    function handleAiCopyControlClick(event) {
      if (!isKnownAiClipboardPage()) return;
      if (getSettings()?.captureAiCopyButtons === false) return;
      if (isSensitiveTarget(event.target) || isMediaPlaybackInteraction(event.target)) return;
      const control = closestInteractiveControl(event.target);
      const action = resolveAiCopyAction(control);
      if (!action || aiCopyControlsInFlight.has(action.control)) return;
      if (control.closest?.("#mcp-floating-host, .mcp-search-overlay, .mcp-editor-modal")) return;
      const domTextBeforeClick = action.text || extractAiCopyText(action.control);
      const clipboardBeforePromise = readAiClipboardTextSafe();
      aiCopyControlsInFlight.add(action.control);
      markCopyEvent();
      runSafeAsync(async () => {
        try {
          const clipboardBefore = await clipboardBeforePromise;
          const domTextAfterClick = action.extractText?.() || extractAiCopyText(action.control);
          const clipboardText = await waitForAiClipboardText(clipboardBefore, [domTextBeforeClick, domTextAfterClick]);
          const content = chooseAiCopyContent(domTextBeforeClick, domTextAfterClick, clipboardText, clipboardBefore, action.kind);
          const signature = `${location.hostname}\n${content}`;
          const now = Date.now();
          if (content && (signature !== lastAiCopyCapture.signature || now - lastAiCopyCapture.at > 900)) {
            lastAiCopyCapture = { signature, at: now };
            await sendTextCapture(content, {
              sourceUrl: location.href,
              sourceDomain: location.hostname.replace(/^www\./, ""),
              sourceTitle: document.title,
              sourceElement: action.sourceElement || findAiMessageContainer(action.control) || action.control
            });
          }
        } finally {
          aiCopyControlsInFlight.delete(action.control);
        }
      });
    }

    function resolveAiCopyAction(control) {
      if (!control) return null;
      const codeAction = resolveAiCodeCopyAction(control);
      if (codeAction) return codeAction;
      const host = location.hostname.replace(/^www\./, "").toLowerCase();
      if (host === "chatgpt.com") return resolveChatGptCopyAction(control);
      if (host === "gemini.google.com") return resolveGeminiCopyAction(control);
      if (host === "claude.ai") return resolveClaudeCopyAction(control);
      if (host === "x.com" || host === "grok.com") return resolveGrokCopyAction(control);
      if (!isLikelyCopyControl(control) || isShareCopyControl(control)) return null;
      return createAiCopyAction(control, findAiMessageContainer(control));
    }

    function resolveAiCodeCopyAction(control) {
      if (!isLikelyCopyControl(control) || isShareCopyControl(control)) return null;
      const button = control.closest?.("button") || control;
      const host = location.hostname.replace(/^www\./, "").toLowerCase();
      if (host === "chatgpt.com" && (
        button.matches?.("button[data-testid='copy-turn-action-button']")
        || !/^(?:copier|copy)$/i.test(aiControlLabel(button))
      )) return null;
      const source = host === "chatgpt.com"
        ? findAiCodeCopyContainer(button)
        : button.closest?.("pre, code-block, [class~='code-block'], [data-testid='writing-block-container'], [data-testid='markdown-code-block']");
      if (!source) return null;
      return createAiCodeCopyAction(button, source);
    }

    function findAiCodeCopyContainer(control) {
      let current = control;
      for (let depth = 0; current && depth < 10; depth += 1, current = current.parentElement) {
        const code = extractAiCodeContent(current);
        if (code && !isBareCodeLanguageLabel(code)) return current;
      }
      return null;
    }

    function extractAiCodeContent(root) {
      if (!root) return "";
      const preferred = ["pre code", ".code-block-content", "pre", "code"];
      for (const selector of preferred) {
        const candidates = root.matches?.(selector) ? [root] : [...root.querySelectorAll?.(selector) || []];
        for (const candidate of candidates) {
          const text = normalizeAiCapturedText(candidate.textContent || candidate.innerText || "");
          if (looksLikeAiCopyCandidate(text) && !isBareCodeLanguageLabel(text)) return text;
        }
      }
      return "";
    }

    function createAiCodeCopyAction(control, sourceElement, extractor) {
      const action = createAiCopyAction(control, sourceElement, extractor || (() => extractAiCodeContent(sourceElement)));
      action.kind = "code";
      return action;
    }

    function createAiCopyAction(control, sourceElement, extractor) {
      const extractText = extractor || (() => textFromNode(sourceElement));
      return {
        control,
        sourceElement: sourceElement || control,
        extractText,
        text: normalizeAiCapturedText(extractText())
      };
    }

    function resolveChatGptCopyAction(control) {
      const button = control.closest?.("button") || control;
      const turnButton = button.matches?.("button[data-testid='copy-turn-action-button']");
      const label = aiControlLabel(button);
      if (!turnButton && !/^copier(?: le message| la r(?:\u00e9|e)ponse)?$|^copy(?: message| response)?$/i.test(label)) return null;
      const block = !turnButton
        ? button.closest?.("[data-testid='writing-block-container'], pre, [class*='code-block']")
          || button.closest?.("[data-testid='writing-block-header-surface']")?.closest?.("[data-testid='writing-block-container']")
        : null;
      const turn = button.closest?.("section[data-testid^='conversation-turn-'], [data-turn-id]");
      const source = block || turn;
      if (!source) return null;
      return createAiCopyAction(button, source, () => {
        if (block) return textFromPreferredAiContent(block, [".ProseMirror", "pre code", "pre", "[data-testid*='content']", ".markdown"]);
        return textFromPreferredAiContent(turn, ["[data-message-author-role]", ".markdown", "[class*='message-content']"]);
      });
    }

    function resolveGeminiCopyAction(control) {
      const button = control.closest?.("button") || control;
      const label = aiControlLabel(button);
      const promptButton = button.matches?.("button[aria-label='Copier le prompt'], button[aria-label='Copy prompt']");
      const codeHost = button.closest?.("[data-test-id='gem-copy-button'], gem-icon-button[data-test-id='gem-copy-button']");
      const responseButton = button.closest?.("message-actions") && /^(copier|copy)$/i.test(label);
      if (!promptButton && !codeHost && !responseButton) return null;
      if (promptButton) {
        const controlledId = button.getAttribute("aria-controls");
        const source = (controlledId && document.getElementById(controlledId))
          || button.closest("user-query-content, user-query, .user-query-container");
        return source ? createAiCopyAction(button, source, () => textFromPreferredAiContent(source, ["[id^='user-query-content']", ".query-text", ".user-query-content"])) : null;
      }
      if (codeHost) {
        const source = button.closest("code-block, .code-block");
        return source ? createAiCopyAction(button, source, () => textFromPreferredAiContent(source, ["pre code", "pre", "code", ".code-block-content"])) : null;
      }
      const response = button.closest("model-response, response-container, .response-container");
      return response ? createAiCopyAction(button, response, () => textFromPreferredAiContent(response, ["message-content .markdown", "message-content", ".markdown", "[id^='model-response-message-content']"])) : null;
    }

    function resolveClaudeCopyAction(control) {
      const button = control.closest?.("button");
      if (!button) return null;

      const codeBlock = button.closest("[aria-label^='Code'], [aria-label^='code']");
      if (codeBlock && isLikelyCopyControl(button)) {
        return createAiCopyAction(button, codeBlock, () => extractClaudeCodeContent(codeBlock));
      }

      const splitCopyGroup = button.closest("[data-cds='SplitDropdownButton'][role='group']");
      const isSplitCopyButton = splitCopyGroup
        && !button.hasAttribute("aria-haspopup")
        && /^(copier|copy)$/i.test(normalizeAiCapturedText(button.innerText || button.textContent));
      if (isSplitCopyButton) {
        const artifactPanel = splitCopyGroup.closest("[tabindex='-1']") || splitCopyGroup.parentElement?.parentElement?.parentElement;
        const artifactContent = extractClaudeCodeContent(artifactPanel);
        return artifactPanel && artifactContent
          ? createAiCopyAction(button, artifactPanel, () => extractClaudeCodeContent(artifactPanel))
          : null;
      }

      if (!button.matches("button[data-testid='action-bar-copy']")) return null;
      const row = button.closest("[class~='group/message-row']");
      if (!row) return null;
      return createAiCopyAction(button, row, () => textFromPreferredAiContent(row, ["[data-testid='user-message']", ".standard-markdown", ".font-claude-response"]));
    }

    function extractClaudeCodeContent(root) {
      if (!root) return "";
      const pre = root.querySelector?.("pre");
      if (pre) {
        const code = pre.querySelector("code") || pre;
        return normalizeAiCapturedText(code.textContent || code.innerText || "");
      }
      const lines = [...root.querySelectorAll?.("code") || []].map((line) => (
        String(line.textContent || line.innerText || "").replace(/\u00a0/g, " ")
      ));
      if (lines.length) return normalizeAiCapturedText(lines.join("\n"));
      return "";
    }

    function resolveGrokCopyAction(control) {
      const button = control.closest?.("button");
      const label = aiControlLabel(button);
      if (!button || !/^(?:copier(?: le texte| la r(?:e|\u00e9)ponse)?|copy(?: text| response)?)$/i.test(label)) return null;
      let messageRoot = button.parentElement;
      for (let depth = 0; messageRoot && depth < 7; depth += 1, messageRoot = messageRoot.parentElement) {
        const messages = [...messageRoot.querySelectorAll?.("[data-testid='user-message'], [data-testid='assistant-message']") || []];
        if (messages.length === 1) {
          const source = messages[0];
          return createAiCopyAction(button, source, () => textFromPreferredAiContent(source, [".response-content-markdown", "[data-testid='user-message']", "[data-testid='assistant-message']"]));
        }
      }
      let current = button;
      for (let depth = 0; current && depth < 9; depth += 1, current = current.parentElement) {
        const sibling = current.previousElementSibling;
        const text = textFromNode(sibling);
        if (sibling && looksLikeAiCopyCandidate(text)) {
          return createAiCopyAction(button, sibling);
        }
      }
      return createAiCopyAction(button, button.parentElement);
    }

    function textFromPreferredAiContent(root, selectors = []) {
      if (!root) return "";
      for (const selector of selectors) {
        const candidate = root.matches?.(selector) ? root : root.querySelector?.(selector);
        const text = textFromNode(candidate);
        if (looksLikeAiCopyCandidate(text)) return text;
      }
      return textFromNode(root);
    }

    function aiControlLabel(control) {
      return normalizeAiCapturedText([
        control?.getAttribute?.("aria-label"),
        control?.getAttribute?.("title"),
        control?.getAttribute?.("data-testid"),
        control?.getAttribute?.("data-test-id"),
        control?.textContent
      ].filter(Boolean).join(" "));
    }

    function isShareCopyControl(control) {
      return /(?:share|partag|lien|link|url)/i.test(aiControlLabel(control));
    }

    function extractAiCopyText(control) {
      return normalizeAiCapturedText(
        extractTextFromAiMessageContainer(control)
        || extractNearbyCodeText(control)
        || ""
      );
    }

    function extractNearbyCodeText(control) {
      const message = findAiMessageContainer(control);
      if (message) {
        const blocks = [...message.querySelectorAll?.("pre, pre code, code, [class*='code-block'], [data-language], [data-lang]") || []]
          .map(textFromNode)
          .filter(looksLikeAiCopyCandidate);
        return bestAiTextCandidate(blocks);
      }
      const blocks = [];
      let current = control;
      for (let depth = 0; current && depth < 3; depth += 1, current = current.parentElement) {
        current.querySelectorAll?.("pre, pre code, code, [class*='code-block'], [data-language], [data-lang]").forEach((node) => {
          const text = textFromNode(node);
          if (looksLikeAiCopyCandidate(text)) blocks.push(text);
        });
        if (blocks.length) break;
      }
      return bestAiTextCandidate(blocks);
    }

    function extractTextFromAiMessageContainer(control) {
      const direct = findAiMessageContainer(control);
      const candidates = [];
      if (direct) candidates.push(textFromNode(direct));
      let current = direct ? null : control.parentElement;
      for (let depth = 0; current && depth < 4; depth += 1, current = current.parentElement) {
        const text = textFromNode(current);
        if (looksLikeAiCopyCandidate(text)) candidates.push(text);
        if (text.length > 12000) break;
      }
      return bestAiTextCandidate(candidates);
    }

    function findAiMessageContainer(control) {
      return control.closest?.([
        "[data-message-author-role]",
        "article[data-testid*='conversation-turn']",
        "[data-testid*='conversation-turn']",
        "[data-testid*='message']",
        "[data-test-id*='message']",
        "[data-turn-id]",
        "[data-message-id]",
        "[class*='conversation-turn']",
        "[class*='chat-message']",
        "[class*='message-content']",
        "article"
      ].join(",")) || null;
    }

    function textFromNode(node) {
      if (!node) return "";
      const clone = node.cloneNode(true);
      clone.querySelectorAll?.([
        "button",
        "[role='button']",
        "svg",
        "input",
        "textarea",
        "select",
        "nav",
        "menu",
        "[role='toolbar']",
        "message-actions",
        "style",
        "script",
        ".sr-only",
        "[class*='visually-hidden']",
        "[class*='screen-reader']",
        "[contenteditable='true']",
        "[aria-label*='copy' i]",
        "[title*='copy' i]",
        "[aria-label*='copier' i]",
        "[title*='copier' i]"
      ].join(",")).forEach((child) => child.remove());
      return normalizeAiCapturedText(clone.innerText || clone.textContent || "");
    }

    function looksLikeAiCopyCandidate(text) {
      const clean = normalizeAiCapturedText(text);
      if (!clean.length) return false;
      if (clean.length > 60000) return false;
      if (/^(copy|copied|copier|copie|copié|copiée|clipboard|presse-papiers)$/i.test(clean)) return false;
      if (looksLikeInternalExtensionText(clean)) return false;
      return true;
    }

    function bestAiTextCandidate(candidates = []) {
      const clean = candidates.map(normalizeAiCapturedText).filter(looksLikeAiCopyCandidate);
      if (!clean.length) return "";
      return clean
        .sort((left, right) => scoreAiCandidate(right) - scoreAiCandidate(left))[0] || "";
    }

    function scoreAiCandidate(text) {
      const length = Math.min(12000, text.length);
      const codeBonus = /```|^\s*(function|const|let|def|class|import|export|SELECT|FROM|<\w+)/m.test(text) ? 1800 : 0;
      const pagePenalty = text.length > 25000 ? 6000 : 0;
      return length + codeBonus - pagePenalty;
    }

    async function readAiClipboardTextSafe() {
      try {
        const text = await readClipboardText();
        return normalizeAiCapturedText(text);
      } catch (error) {
        return "";
      }
    }

    async function waitForAiClipboardText(previous = "", domCandidates = []) {
      const baseline = normalizeAiCapturedText(previous);
      const expected = domCandidates.map(normalizeAiCapturedText).filter(Boolean);
      const delays = [24, 48, 80, 120, 180];
      for (const wait of delays) {
        await delay(wait);
        const current = await readAiClipboardTextSafe();
        if (!looksLikeAiCopyCandidate(current)) continue;
        if (current !== baseline || expected.some((candidate) => aiTextsCorrespond(current, candidate))) return current;
      }
      return "";
    }

    function aiTextsCorrespond(left = "", right = "") {
      const a = normalizeAiCapturedText(left);
      const b = normalizeAiCapturedText(right);
      if (!a || !b) return false;
      return a === b || (a.length >= 24 && b.includes(a)) || (b.length >= 24 && a.includes(b));
    }

    function chooseAiCopyContent(before = "", after = "", clipboard = "", clipboardBefore = "", kind = "text") {
      const clipboardClean = normalizeAiCapturedText(clipboard);
      const isAllowed = (value) => looksLikeAiCopyCandidate(value) && (kind !== "code" || !isBareCodeLanguageLabel(value));
      const candidates = [before, after].map(normalizeAiCapturedText).filter(isAllowed);
      const clipboardChanged = clipboardClean && clipboardClean !== normalizeAiCapturedText(clipboardBefore);
      const clipboardMatchesDom = candidates.some((candidate) => aiTextsCorrespond(clipboardClean, candidate));
      if (isAllowed(clipboardClean) && (clipboardChanged || clipboardMatchesDom)) return clipboardClean;
      if (!candidates.length) return "";
      const unique = [...new Map(candidates.map((value) => [value, value])).values()];
      return unique.sort((left, right) => scoreAiCandidate(right) - scoreAiCandidate(left))[0] || "";
    }

    function isBareCodeLanguageLabel(text) {
      const clean = normalizeAiCapturedText(text).toLowerCase().replace(/[.#_+-]/g, "");
      return /^(?:abap|bash|c|csharp|cpp|css|dart|go|graphql|groovy|html|java|javascript|json|jsx|kotlin|lua|markdown|matlab|objectivec|perl|php|plaintext|powershell|python|r|ruby|rust|sass|scala|scss|shell|sql|swift|text|tsx|typescript|vb|xml|yaml)$/.test(clean);
    }

    function normalizeAiCapturedText(text) {
      return String(text || "")
        .replace(/\u00a0/g, " ")
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{4,}/g, "\n\n\n")
        .trim();
    }

    function closestInteractiveControl(target) {
      return target?.closest?.("button, [role='button'], a[role='button'], input[type='button'], input[type='submit'], [data-testid*='copy' i], [data-test-id*='copy' i], [data-qa*='copy' i], [aria-label*='copy' i], [title*='copy' i], [aria-label*='copier' i], [title*='copier' i]");
    }

    function isMediaPlaybackInteraction(target) {
      const element = target?.closest?.("video, audio, [aria-label], [title], [data-testid], [data-test-id], [class], button, [role='button']");
      if (!element) return false;
      if (target?.closest?.("video, audio")) return true;
      const values = [
        element.getAttribute?.("aria-label"),
        element.getAttribute?.("title"),
        element.getAttribute?.("data-testid"),
        element.getAttribute?.("data-test-id"),
        element.getAttribute?.("class"),
        element.textContent
      ].filter(Boolean).join(" ").toLowerCase();
      return /\b(play|pause|replay|mute|unmute|volume|fullscreen|picture[-\s]?in[-\s]?picture|lecture|pause|reprendre|muet|plein écran|pantalla completa|wiedergabe|stumm|riproduci|pausa)\b/i.test(values);
    }

    function isLikelyCopyControl(control) {
      const attrValues = [
        control.getAttribute?.("aria-label"),
        control.getAttribute?.("title"),
        control.getAttribute?.("data-testid"),
        control.getAttribute?.("data-test-id"),
        control.getAttribute?.("data-qa"),
        control.getAttribute?.("class")
      ].filter(Boolean).join(" ").toLowerCase();
      const shortText = String(control.textContent || "").trim().toLowerCase();
      const textLooksLikeCopy = shortText.length <= 48
        && /\b(copy|copied|clipboard|kopieren|copier|copi(?:e|er|\u00e9|\u00e9e)|copiar|copia|appunti|zwischenablage|presse[-\s]?papiers|portapapeles)\b/i.test(shortText);
      const attrLooksLikeCopy = /\b(copy|copied|clipboard|copy-response|copy_turn|copy-turn|copy_message|copy-message|kopieren|zwischenablage|copier|presse-papiers|copiar|portapapeles|copia|appunti)\b/i.test(attrValues)
        || /copi(?:e|er|\u00e9|\u00e9e)|presse[-\s]?papiers|r\u00e9ponse|respuesta|risposta|antwort/.test(attrValues);
      return attrLooksLikeCopy || textLooksLikeCopy;
    }

    function isKnownAiClipboardPage() {
      const host = location.hostname.replace(/^www\./, "").toLowerCase();
      return [
        "chatgpt.com",
        "claude.ai",
        "gemini.google.com",
        "aistudio.google.com",
        "notebooklm.google.com",
        "deepseek.com",
        "chat.deepseek.com",
        "chat.qwen.ai",
        "grok.com",
        "x.com",
        "perplexity.ai",
        "poe.com",
        "copilot.microsoft.com",
        "m365.cloud.microsoft",
        "lechat.mistral.ai",
        "chat.mistral.ai",
        "meta.ai",
        "you.com",
        "huggingface.co",
        "phind.com",
        "blackbox.ai",
        "kimi.com",
        "chat.moonshot.cn"
      ].some((domain) => host === domain || host.endsWith(`.${domain}`));
    }

    function looksLikeInternalExtensionText(text) {
      return false;
    }

    return {
      handleClick: handleAiCopyControlClick,
      resolveAction: resolveAiCopyAction,
      normalizeText: normalizeAiCapturedText,
      chooseContent: chooseAiCopyContent,
      isKnownPage: isKnownAiClipboardPage
    };
  }

  global.MCP = Object.assign(global.MCP || {}, {
    createAiCopyController
  });
})(globalThis);
