(function initLocalStorageInsights(global) {
  "use strict";

  const GROUPS = Object.freeze([
    { id: "texts", keys: ["mcp_clipboard_items"] },
    { id: "codes", keys: ["mcp_dev_items"] },
    { id: "images", keys: ["mcp_image_items"] },
    { id: "categories", keys: ["mcp_categories", "mcp_dev_categories", "mcp_image_categories"] },
    { id: "tools", keys: ["mcp_snippets", "mcp_templates"] },
    { id: "settings", keys: ["mcp_settings"] }
  ]);

  function utf8Bytes(value) {
    return new TextEncoder().encode(JSON.stringify(value ?? null)).byteLength;
  }

  function analyzeLocalStorage(storage = {}) {
    const accounted = new Set();
    const groups = GROUPS.map((group) => {
      const keys = group.keys.filter((key) => Object.prototype.hasOwnProperty.call(storage, key));
      keys.forEach((key) => accounted.add(key));
      const bytes = keys.reduce((sum, key) => sum + utf8Bytes(storage[key]), 0);
      const records = keys.reduce((sum, key) => sum + (Array.isArray(storage[key]) ? storage[key].length : 1), 0);
      return { id: group.id, keys, bytes, records };
    });
    const otherKeys = Object.keys(storage).filter((key) => !accounted.has(key));
    groups.push({
      id: "other",
      keys: otherKeys,
      bytes: otherKeys.reduce((sum, key) => sum + utf8Bytes(storage[key]), 0),
      records: otherKeys.length
    });
    const totalBytes = groups.reduce((sum, group) => sum + group.bytes, 0);
    return {
      totalBytes,
      keyCount: Object.keys(storage).length,
      generatedAt: Date.now(),
      groups: groups.map((group) => Object.assign({}, group, {
        ratio: totalBytes ? group.bytes / totalBytes : 0
      })).sort((left, right) => right.bytes - left.bytes)
    };
  }

  global.MCP = Object.assign(global.MCP || {}, { analyzeLocalStorage });
})(globalThis);
