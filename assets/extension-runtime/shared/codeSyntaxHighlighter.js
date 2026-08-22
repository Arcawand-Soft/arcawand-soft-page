(function initCodeSyntaxHighlighter(global) {
  const MAX_HIGHLIGHT_LENGTH = 20000;
  const CACHE_LIMIT = 240;
  const tokenCache = new Map();
  const editorBindings = new WeakMap();

  const COMMON_KEYWORDS = new Set((
    "abstract as async await break case catch class const continue debugger default delete do else enum export extends false finally for from function get if implements import in instanceof interface let new null of package private protected public return set static super switch this throw true try typeof undefined var void while with yield"
  ).split(" "));
  const LANGUAGE_KEYWORDS = {
    python: "and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield",
    sql: "ADD ALL ALTER AND AS ASC BETWEEN BY CASE CHECK COLUMN CREATE DATABASE DEFAULT DELETE DESC DISTINCT DROP ELSE END EXISTS FALSE FOREIGN FROM FULL GROUP HAVING IN INDEX INNER INSERT INTO IS JOIN KEY LEFT LIKE LIMIT NOT NULL ON OR ORDER OUTER PRIMARY REFERENCES RIGHT ROWS SELECT SET TABLE THEN TRUE UNION UNIQUE UPDATE VALUES VIEW WHEN WHERE",
    shell: "case do done elif else esac export fi for function if in local readonly return then until while",
    powershell: "begin break catch class continue data do dynamicparam else elseif end enum exit filter finally for foreach from function if in param process return switch throw trap try until using var while workflow",
    java: "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while",
    kotlin: "as break class continue do else false for fun if in interface is null object package return super this throw true try typealias typeof val var when while",
    swift: "associatedtype break case catch class continue default defer deinit do else enum extension fallthrough false fileprivate for func guard if import in init inout internal is let nil open operator private protocol public repeat rethrows return self static struct subscript super switch throw throws true try typealias var where while",
    cpp: "alignas alignof asm auto bool break case catch char class const constexpr continue default delete do double else enum explicit export extern false float for friend if inline int long mutable namespace new noexcept nullptr operator private protected public register reinterpret_cast return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile wchar_t while",
    csharp: "abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while",
    go: "break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var",
    rust: "as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while",
    ruby: "alias and begin break case class def defined do else elsif end ensure false for if in module next nil not or redo rescue retry return self super then true undef unless until when while yield",
    php: "abstract and array as break callable case catch class clone const continue declare default die do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval exit extends final finally fn for foreach function global goto if implements include include_once instanceof insteadof interface isset list match namespace new null or print private protected public require require_once return static switch throw trait true try unset use var while xor yield",
    css: "important inherit initial revert unset var calc auto none block inline flex grid absolute relative fixed sticky transparent currentColor",
    general: ""
  };
  const keywordCache = new Map();

  function normalizedLanguage(language) {
    return String(language || "general").toLowerCase().replace(/^dev-/, "").replace(/[^a-z0-9+#]+/g, "");
  }

  function keywordsFor(language) {
    const id = normalizedLanguage(language);
    if (keywordCache.has(id)) return keywordCache.get(id);
    const aliases = { javascript: "javascript", typescript: "javascript", react: "javascript", vue: "javascript", svelte: "javascript", bash: "shell", sh: "shell", c: "cpp", objectivec: "cpp", scala: "java", groovy: "java", dart: "java" };
    const key = aliases[id] || id;
    const words = new Set(COMMON_KEYWORDS);
    String(LANGUAGE_KEYWORDS[key] || "").split(/\s+/).filter(Boolean).forEach((word) => {
      words.add(word);
      words.add(word.toLowerCase());
    });
    keywordCache.set(id, words);
    return words;
  }

  function token(type, value) {
    return { type, value };
  }

  function tokenizeMarkup(source) {
    const tokens = [];
    let cursor = 0;
    const matcher = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g;
    let match;
    while ((match = matcher.exec(source))) {
      if (match.index > cursor) tokens.push(token("plain", source.slice(cursor, match.index)));
      if (match[0].startsWith("<!--")) {
        tokens.push(token("comment", match[0]));
      } else {
        const tag = match[0];
        let tagCursor = 0;
        const partMatcher = /(<\/?)([A-Za-z][\w:-]*)|([A-Za-z_:][\w:.-]*)(\s*=\s*)("[^"]*"|'[^']*')/g;
        let part;
        while ((part = partMatcher.exec(tag))) {
          if (part.index > tagCursor) tokens.push(token("punctuation", tag.slice(tagCursor, part.index)));
          if (part[1]) {
            tokens.push(token("punctuation", part[1]), token("tag", part[2]));
          } else {
            tokens.push(token("attribute", part[3]), token("operator", part[4]), token("string", part[5]));
          }
          tagCursor = part.index + part[0].length;
        }
        if (tagCursor < tag.length) tokens.push(token("punctuation", tag.slice(tagCursor)));
      }
      cursor = match.index + match[0].length;
    }
    if (cursor < source.length) tokens.push(token("plain", source.slice(cursor)));
    return tokens;
  }

  function tokenizeSegment(source, language) {
    const id = normalizedLanguage(language);
    if (["html", "xml"].includes(id)) return tokenizeMarkup(source);
    const words = keywordsFor(id);
    const tokens = [];
    const lineComment = id === "python" || id === "ruby" || id === "shell" || id === "powershell" || id === "yaml" || id === "r" ? "#" : id === "sql" ? "--" : "//";
    let i = 0;
    while (i < source.length) {
      const start = i;
      const char = source[i];
      const pair = source.slice(i, i + 2);
      if (pair === "/*") {
        i = source.indexOf("*/", i + 2);
        i = i < 0 ? source.length : i + 2;
        tokens.push(token("comment", source.slice(start, i)));
        continue;
      }
      if (source.startsWith(lineComment, i)) {
        i = source.indexOf("\n", i + lineComment.length);
        if (i < 0) i = source.length;
        tokens.push(token("comment", source.slice(start, i)));
        continue;
      }
      if (char === "\"" || char === "'" || char === "`") {
        const quote = char;
        i += 1;
        while (i < source.length) {
          if (source[i] === "\\") i += 2;
          else if (source[i++] === quote) break;
        }
        tokens.push(token("string", source.slice(start, i)));
        continue;
      }
      if (/\d/.test(char) && (i === 0 || !/[\w$]/.test(source[i - 1]))) {
        const match = /^(?:0[xob][\da-f]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/i.exec(source.slice(i));
        i += match?.[0].length || 1;
        tokens.push(token("number", source.slice(start, i)));
        continue;
      }
      if (/[A-Za-z_$\u00C0-\uFFFF]/.test(char)) {
        i += 1;
        while (i < source.length && /[\w$\u00C0-\uFFFF]/.test(source[i])) i += 1;
        const value = source.slice(start, i);
        const lower = value.toLowerCase();
        let type = ["true", "false", "null", "none", "nil", "undefined"].includes(lower) ? "boolean" : words.has(value) || words.has(lower) ? "keyword" : "plain";
        if (type === "plain" && /^\s*\(/.test(source.slice(i))) type = "function";
        else if (type === "plain" && /^[A-Z][\w$]*$/.test(value)) type = "type";
        tokens.push(token(type, value));
        continue;
      }
      if (/[+\-*\/%=&|!<>?:~^]/.test(char)) {
        i += 1;
        while (i < source.length && /[+\-*\/%=&|!<>?:~^]/.test(source[i])) i += 1;
        tokens.push(token("operator", source.slice(start, i)));
        continue;
      }
      if (/[{}[\]();,.]/.test(char)) {
        i += 1;
        tokens.push(token("punctuation", char));
        continue;
      }
      i += 1;
      while (i < source.length && !/[\w$\u00C0-\uFFFF\d#"'`+\-*\/%=&|!<>?:~^{}[\]();,.]/.test(source[i])) i += 1;
      tokens.push(token("plain", source.slice(start, i)));
    }
    return tokens;
  }

  function tokenizeCodeSyntax(value, language) {
    const source = String(value ?? "");
    const cacheKey = `${normalizedLanguage(language)}\u0000${source}`;
    if (source.length <= MAX_HIGHLIGHT_LENGTH && tokenCache.has(cacheKey)) {
      const cached = tokenCache.get(cacheKey);
      tokenCache.delete(cacheKey);
      tokenCache.set(cacheKey, cached);
      return cached;
    }
    const highlighted = source.slice(0, MAX_HIGHLIGHT_LENGTH);
    const tokens = tokenizeSegment(highlighted, language);
    if (highlighted.length < source.length) tokens.push(token("plain", source.slice(highlighted.length)));
    if (source.length <= MAX_HIGHLIGHT_LENGTH) {
      tokenCache.set(cacheKey, tokens);
      if (tokenCache.size > CACHE_LIMIT) tokenCache.delete(tokenCache.keys().next().value);
    }
    return tokens;
  }

  function renderCodeSyntax(element, value, language) {
    if (!element?.replaceChildren || !global.document?.createDocumentFragment) return false;
    const fragment = global.document.createDocumentFragment();
    tokenizeCodeSyntax(value, language).forEach(({ type, value: part }) => {
      if (type === "plain") fragment.appendChild(global.document.createTextNode(part));
      else {
        const span = global.document.createElement("span");
        span.className = `ucp-syntax-token ucp-syntax-${type}`;
        span.textContent = part;
        fragment.appendChild(span);
      }
    });
    element.replaceChildren(fragment);
    element.classList.add("ucp-code-syntax");
    return true;
  }

  function bindCodeSyntaxEditor(textarea) {
    if (!textarea || !global.document) return null;
    if (editorBindings.has(textarea)) return editorBindings.get(textarea);
    textarea.spellcheck = false;
    textarea.autocomplete = "off";
    textarea.autocorrect = "off";
    textarea.autocapitalize = "off";
    textarea.setAttribute("data-gramm", "false");
    textarea.setAttribute("data-gramm_editor", "false");
    textarea.setAttribute("data-enable-grammarly", "false");
    let host = textarea.parentElement;
    if (!host?.classList.contains("manager-editor-code-wrap") && !host?.classList.contains("ucp-code-editor-shell")) {
      const shell = global.document.createElement("div");
      shell.className = "ucp-code-editor-shell";
      host?.insertBefore(shell, textarea);
      shell.appendChild(textarea);
      host = shell;
    }
    if (!host) return null;
    host.classList.add("ucp-code-editor-shell");
    const highlight = global.document.createElement("pre");
    highlight.className = "ucp-code-editor-highlight ucp-code-syntax";
    highlight.setAttribute("aria-hidden", "true");
    host.insertBefore(highlight, textarea);
    const binding = { textarea, host, highlight, enabled: false, language: "dev-general" };
    const syncScroll = () => {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    };
    const render = () => {
      if (!binding.enabled) return;
      try {
        renderCodeSyntax(highlight, textarea.value, binding.language);
        syncScroll();
      } catch (_) {
        binding.enabled = false;
        binding.host.classList.remove("is-syntax-editor");
        binding.highlight.hidden = true;
      }
    };
    textarea.addEventListener("input", render);
    textarea.addEventListener("scroll", syncScroll, { passive: true });
    binding.render = render;
    editorBindings.set(textarea, binding);
    return binding;
  }

  function setCodeSyntaxEditor(textarea, options = {}) {
    const binding = bindCodeSyntaxEditor(textarea);
    if (!binding) return false;
    binding.enabled = options.enabled !== false;
    binding.language = options.language || "dev-general";
    binding.host.classList.toggle("is-syntax-editor", binding.enabled);
    binding.highlight.hidden = !binding.enabled;
    if (binding.enabled) binding.render();
    else binding.highlight.replaceChildren();
    return true;
  }

  global.MCP = Object.assign(global.MCP || {}, { tokenizeCodeSyntax, renderCodeSyntax, setCodeSyntaxEditor });
})(globalThis);
