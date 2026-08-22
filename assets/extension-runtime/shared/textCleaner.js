(function initTextCleaner(global) {
  function basicCleanText(content) {
    return String(content || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  global.MCP = Object.assign(global.MCP || {}, { basicCleanText });
})(globalThis);
