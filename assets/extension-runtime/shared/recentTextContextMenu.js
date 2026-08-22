(function initRecentTextContextMenu(global) {
  const SLOT_COUNT = 10;
  const MENU_ITEM_PREFIX = "ucp-paste-recent-";
  const EXCLUDED_CATEGORY_IDS = new Set(["vault", "text-vault", "trash", "text-trash"]);

  function captureTimestamp(item = {}) {
    return Number(item.createdAt || item.capturedAt || item.savedAt || 0);
  }

  function isEligibleRecentText(item) {
    if (!item || item.trashedAt || item.languageId) return false;
    if (EXCLUDED_CATEGORY_IDS.has(String(item.categoryId || ""))) return false;
    if (EXCLUDED_CATEGORY_IDS.has(String(item.languageId || ""))) return false;
    return Boolean(getContextMenuTextContent(item).trim());
  }

  function getRecentContextMenuTexts(items, limit = SLOT_COUNT) {
    return (Array.isArray(items) ? items : [])
      .filter(isEligibleRecentText)
      .sort((left, right) => captureTimestamp(right) - captureTimestamp(left) || String(right.id || "").localeCompare(String(left.id || "")))
      .slice(0, Math.max(0, Number(limit) || 0));
  }

  function normalizedRecentHttpUrl(value) {
    const candidate = String(value || "").trim();
    if (!candidate || /[\u0000-\u0020\u007f]/.test(candidate)) return "";
    try {
      const parsed = new URL(candidate);
      if (!/^https?:$/.test(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) return "";
      return parsed.href;
    } catch {
      return "";
    }
  }

  function getRecentOmniboxUrls(items, limit = SLOT_COUNT) {
    const itemCount = Array.isArray(items) ? items.length : 0;
    return getRecentContextMenuTexts(items, itemCount)
      .map((item) => ({ item, url: normalizedRecentHttpUrl(getContextMenuTextContent(item)) }))
      .filter((entry) => Boolean(entry.url))
      .slice(0, Math.max(0, Number(limit) || 0));
  }

  function escapeOmniboxMarkup(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    })[character]);
  }

  function buildRecentUrlOmniboxSuggestions(items, query = "", limit = SLOT_COUNT) {
    const needle = String(query || "").trim().toLocaleLowerCase();
    return getRecentOmniboxUrls(items, limit)
      .filter(({ url }) => !needle || url.toLocaleLowerCase().includes(needle))
      .map(({ url }) => ({
        content: url,
        description: `<url>${escapeOmniboxMarkup(url)}</url>`
      }));
  }

  function resolveRecentOmniboxUrl(input, recentUrls) {
    const entries = Array.isArray(recentUrls) ? recentUrls : [];
    const candidate = normalizedRecentHttpUrl(input);
    if (candidate && entries.some(({ url }) => url === candidate)) return candidate;
    const needle = String(input || "").trim().toLocaleLowerCase();
    const match = entries.find(({ url }) => !needle || url.toLocaleLowerCase().includes(needle));
    return match?.url || "";
  }

  function getContextMenuTextContent(item) {
    const versions = Array.isArray(item?.captureVersions)
      ? item.captureVersions
        .filter((version) => version && version.id && typeof version.content === "string")
        .sort((left, right) => Number(left.createdAt || 0) - Number(right.createdAt || 0) || String(left.id).localeCompare(String(right.id)))
      : [];
    if (!versions.length) return String(item?.content || "");
    const active = versions.find((version) => version.id === item.activeVersionId);
    return String((active || versions[versions.length - 1])?.content || "");
  }

  function formatRecentTextMenuTitle(content, maxLength = 72) {
    const singleLine = String(content || "").replace(/\s+/g, " ").trim();
    const limit = Math.max(2, Number(maxLength) || 72);
    return singleLine.length > limit ? `${singleLine.slice(0, limit - 1).trimEnd()}…` : singleLine;
  }

  function contextMenuRecentTextIndex(menuItemId) {
    const value = String(menuItemId || "");
    if (!value.startsWith(MENU_ITEM_PREFIX)) return -1;
    const index = Number(value.slice(MENU_ITEM_PREFIX.length));
    return Number.isInteger(index) && index >= 0 && index < SLOT_COUNT ? index : -1;
  }

  function insertRecentTextIntoEditableField(value) {
    const selection = globalThis.getSelection?.();
    const selectionElement = selection?.anchorNode?.nodeType === Node.ELEMENT_NODE
      ? selection.anchorNode
      : selection?.anchorNode?.parentElement;
    const focused = document.activeElement;
    const editable = focused?.isContentEditable
      ? focused
      : selectionElement?.closest?.("[contenteditable]:not([contenteditable='false'])") || focused;

    if (editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement) {
      if (editable.disabled || editable.readOnly) return false;
      const supportsSelection = Number.isInteger(editable.selectionStart) && Number.isInteger(editable.selectionEnd);
      const start = supportsSelection ? editable.selectionStart : editable.value.length;
      const end = supportsSelection ? editable.selectionEnd : start;
      const beforeInput = new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        composed: true,
        inputType: "insertText",
        data: value
      });
      if (!editable.dispatchEvent(beforeInput)) return false;
      if (supportsSelection) {
        editable.setRangeText(value, start, end, "end");
      } else {
        const prototype = editable instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
        const nextValue = `${editable.value || ""}${value}`;
        if (valueSetter) valueSetter.call(editable, nextValue);
        else editable.value = nextValue;
      }
      editable.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        composed: true,
        inputType: "insertText",
        data: value
      }));
      return true;
    }

    if (!editable?.isContentEditable) return false;
    editable.focus();
    const beforeInput = new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      composed: true,
      inputType: "insertText",
      data: value
    });
    if (!editable.dispatchEvent(beforeInput)) return false;
    if (document.execCommand("insertText", false, value)) return true;
    const range = selection?.rangeCount ? selection.getRangeAt(0) : document.createRange();
    if (!selection?.rangeCount) range.selectNodeContents(editable);
    range.deleteContents();
    const node = document.createTextNode(value);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    editable.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      composed: true,
      inputType: "insertText",
      data: value
    }));
    return true;
  }

  global.MCP = Object.assign(global.MCP || {}, {
    RECENT_TEXT_CONTEXT_MENU_SLOT_COUNT: SLOT_COUNT,
    RECENT_TEXT_CONTEXT_MENU_PREFIX: MENU_ITEM_PREFIX,
    getRecentContextMenuTexts,
    getRecentOmniboxUrls,
    buildRecentUrlOmniboxSuggestions,
    resolveRecentOmniboxUrl,
    getContextMenuTextContent,
    formatRecentTextMenuTitle,
    contextMenuRecentTextIndex,
    insertRecentTextIntoEditableField
  });
})(globalThis);
