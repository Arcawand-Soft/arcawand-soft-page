(function initToolMetadata(global) {
  "use strict";

  const TOOL_IDS = Object.freeze([
    "imageText", "snippetLibrary", "promptTemplateManager", "emojiPicker",
    "informationExtractor", "duplicateDetector", "longTextSplitter", "textCleaner",
    "typographyNormalizer", "caseConverter", "advancedCounter", "universalEncoder",
    "colorPicker", "listTransformer", "localAnonymizer", "variableInjector",
    "loremGenerator", "jsonFormatter", "markdownToolkit", "textComparator"
  ]);

  const PRIORITY_TOOL_IDS = Object.freeze([
    "imageText", "snippetLibrary", "promptTemplateManager", "emojiPicker",
    "informationExtractor", "duplicateDetector", "longTextSplitter", "caseConverter",
    "advancedCounter", "variableInjector"
  ]);

  const TOOL_ICON_FILES = Object.freeze({
    textCleaner: "nettoyeur.png",
    typographyNormalizer: "normalisateur.png",
    caseConverter: "casse.png",
    advancedCounter: "compteurs.png",
    longTextSplitter: "assets/icons/special-characters.png",
    duplicateDetector: "doublons.png",
    promptTemplateManager: "archi-prompt.png",
    variableInjector: "assets/icons/replace-word.png",
    snippetLibrary: "prompt-images.png",
    listTransformer: "listes.png",
    informationExtractor: "extracteur.png",
    localAnonymizer: "anonymiseur.png",
    emojiPicker: "emojis.png",
    colorPicker: "assets/icons/color.png",
    universalEncoder: "encodeur-decodeur.png",
    jsonFormatter: "json.png",
    loremGenerator: "lorem-ipsum.png",
    markdownToolkit: "markdown.png",
    textComparator: "comparateur.png",
    imageText: "assets/icons/screen-to-text.png"
  });

  function toolIconPath(id) {
    const file = TOOL_ICON_FILES[id];
    if (!file) return "";
    return file.includes("/") ? file : `assets/icons/tools-icons/${file}`;
  }

  const TOOL_ICON_URLS = Object.freeze(Object.fromEntries(
    Object.values(TOOL_ICON_FILES).map((file) => {
      const path = file.includes("/") ? file : `assets/icons/tools-icons/${file}`;
      try {
        return [path, global.chrome?.runtime?.getURL?.(path) || path];
      } catch (_error) {
        return [path, path];
      }
    })
  ));

  function normalizeRecentToolIds(ids = [], limit = 3) {
    const known = new Set(TOOL_IDS);
    return [...new Set(Array.isArray(ids) ? ids : [])]
      .filter((id) => known.has(id))
      .slice(0, Math.max(0, Number(limit) || 0));
  }

  function renderRecentToolButton(button, settings = {}, options = {}) {
    if (!button || !hasLiveExtensionContext()) return { toolId: "", title: "", locked: false };
    const toolId = normalizeRecentToolIds(settings.recentToolIds, 1)[0] || "";
    const iconPath = toolId ? toolIconPath(toolId) : "";
    button.hidden = !toolId || !iconPath;
    button.dataset.toolId = toolId;
    if (!toolId || !iconPath) return { toolId: "", title: "", locked: false };
    const title = options.t?.(`tools.${toolId}.title`) || toolId;
    const locked = options.canUseTool ? !options.canUseTool(toolId, settings) : false;
    const lockedLabel = options.t?.("pro.toolsLocked") || title;
    button.classList?.toggle("is-pro-locked", locked);
    button.setAttribute?.("aria-label", locked ? `${title} — ${lockedLabel}` : title);
    button.title = locked ? lockedLabel : title;
    const icon = button.querySelector?.("[data-role='launcher-recent-tool-icon'], img");
    if (icon) icon.src = options.iconUrl?.(iconPath) || iconPath;
    const badge = button.querySelector?.("[data-role='launcher-recent-tool-pro']");
    if (badge) badge.hidden = !locked;
    return { toolId, title, locked };
  }

  function hasLiveExtensionContext() {
    const runtime = global.chrome?.runtime;
    if (!runtime) return true;
    try { return Boolean(runtime.id); } catch (_error) { return false; }
  }

  const renderLauncherRecentTool = (button, settings, t) => renderRecentToolButton(button, settings, {
    t,
    canUseTool: global.MCP?.canUseTool,
    iconUrl: (path) => TOOL_ICON_URLS[path] || path
  });

  global.MCP = Object.assign(global.MCP || {}, {
    TOOL_IDS,
    PRIORITY_TOOL_IDS,
    TOOL_ICON_FILES,
    toolIconPath,
    normalizeRecentToolIds,
    hasLiveExtensionContext,
    renderRecentToolButton,
    renderLauncherRecentTool
  });
})(globalThis);
