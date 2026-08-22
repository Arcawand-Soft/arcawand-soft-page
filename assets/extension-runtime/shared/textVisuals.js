(function initTextVisuals(global) {
  function escapeRegularExpression(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildReplacementHighlightHtml(text, needle, options = {}) {
    const source = String(text || "");
    const search = String(needle || "");
    const escape = global.MCP.escapeHtml;
    if (!source) return "&nbsp;";
    if (!search) return escape(source);
    let matcher;
    try {
      const pattern = options.replaceRegex === true || options.replaceRegex === "true"
        ? search
        : escapeRegularExpression(search);
      const bounded = options.replaceWholeWord === true || options.replaceWholeWord === "true"
        ? `\\b(?:${pattern})\\b`
        : pattern;
      matcher = new RegExp(bounded, options.replaceCaseSensitive === true || options.replaceCaseSensitive === "true" ? "g" : "gi");
    } catch {
      return escape(source);
    }
    let cursor = 0;
    let html = "";
    let match;
    while ((match = matcher.exec(source))) {
      if (match.index > cursor) html += escape(source.slice(cursor, match.index));
      html += `<mark>${escape(match[0])}</mark>`;
      cursor = match.index + match[0].length;
      if (match[0].length === 0) matcher.lastIndex += 1;
    }
    if (cursor < source.length) html += escape(source.slice(cursor));
    return html || "&nbsp;";
  }

  function wordDiff(leftLine, rightLine) {
    const escape = global.MCP.escapeHtml;
    const leftTokens = String(leftLine || "").split(/(\s+)/);
    const rightTokens = String(rightLine || "").split(/(\s+)/);
    const commonRight = new Set(rightTokens.filter((token) => token.trim()));
    let removed = 0;
    const left = leftTokens.map((token) => {
      if (!token.trim() || commonRight.has(token)) return escape(token);
      removed += 1;
      return `<span class="removed">${escape(token)}</span>`;
    }).join("");
    const commonLeft = new Set(leftTokens.filter((token) => token.trim()));
    let added = 0;
    const right = rightTokens.map((token) => {
      if (!token.trim() || commonLeft.has(token)) return escape(token);
      added += 1;
      return `<span class="added">${escape(token)}</span>`;
    }).join("");
    return { left, right, added, removed };
  }

  function buildTextCompareVisual(leftText, rightText) {
    const escape = global.MCP.escapeHtml;
    const leftLines = String(leftText || "").split("\n");
    const rightLines = String(rightText || "").split("\n");
    const leftHtml = [];
    const rightHtml = [];
    const stats = { addedTokens: 0, removedTokens: 0, changedLines: 0, sameLines: 0 };
    for (let index = 0; index < Math.max(leftLines.length, rightLines.length); index += 1) {
      const left = leftLines[index] ?? "";
      const right = rightLines[index] ?? "";
      if (left === right) {
        stats.sameLines += 1;
        leftHtml.push(`<div class="same">${escape(left) || "&nbsp;"}</div>`);
        rightHtml.push(`<div class="same">${escape(right) || "&nbsp;"}</div>`);
        continue;
      }
      stats.changedLines += 1;
      const diff = wordDiff(left, right);
      stats.removedTokens += diff.removed;
      stats.addedTokens += diff.added;
      leftHtml.push(`<div class="changed">${diff.left}</div>`);
      rightHtml.push(`<div class="changed">${diff.right}</div>`);
    }
    return { leftHtml: leftHtml.join(""), rightHtml: rightHtml.join(""), stats };
  }

  global.MCP = Object.assign(global.MCP || {}, {
    buildReplacementHighlightHtml,
    buildTextCompareVisual
  });
})(globalThis);
