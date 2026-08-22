(function registerEditableTargetDetector(global) {
  "use strict";

  const TEXT_INPUT_TYPES = new Set(["text", "search", "email", "url", "tel", "password"]);
  const EDITOR_SELECTOR = [
    "textarea",
    "input",
    "[contenteditable]:not([contenteditable='false'])",
    "[role='textbox']",
    "[role='searchbox']",
    "[role='combobox']",
    "[data-lexical-editor='true']",
    "[data-slate-editor='true']",
    ".ProseMirror"
  ].join(",");
  const MAX_VISUAL_SURFACE_HEIGHT = 320;
  const MAX_TOP_EXPANSION = 56;
  const MAX_BOTTOM_EXPANSION = 200;
  const MAX_SIDE_EXPANSION = 180;

  function isUsableEditable(element) {
    if (!(element instanceof Element)) return false;
    if (element.matches("[disabled],[aria-disabled='true'],[aria-readonly='true']")) return false;
    if (element instanceof HTMLInputElement) {
      return !element.readOnly && TEXT_INPUT_TYPES.has(String(element.type || "text").toLowerCase());
    }
    if (element instanceof HTMLTextAreaElement) return !element.readOnly;
    if (element.isContentEditable || element.contentEditable === "true" || element.contentEditable === "plaintext-only") return true;
    if (element.matches("[data-lexical-editor='true'],[data-slate-editor='true'],.ProseMirror")) return true;
    if (element.matches("[role='textbox'],[role='searchbox']")) return element.tabIndex >= 0;
    return element.matches("[role='combobox']")
      && element.tabIndex >= 0
      && (element.hasAttribute("aria-autocomplete") || element.hasAttribute("aria-expanded"));
  }

  function closestEditable(element) {
    if (!(element instanceof Element)) return null;
    const direct = element.closest(EDITOR_SELECTOR);
    if (isUsableEditable(direct)) {
      if (direct.matches("[role='textbox'],[role='searchbox'],[role='combobox']") && !direct.isContentEditable) {
        const nestedEditor = direct.querySelector([
          "textarea",
          "input",
          "[contenteditable]:not([contenteditable='false'])",
          "[data-lexical-editor='true']",
          "[data-slate-editor='true']",
          ".ProseMirror"
        ].join(","));
        if (isUsableEditable(nestedEditor)) return nestedEditor;
      }
      return direct;
    }
    const nested = element.querySelector?.(EDITOR_SELECTOR);
    return isUsableEditable(nested) ? nested : null;
  }

  function findEditableTarget(source) {
    const hasComposedPath = typeof source?.composedPath === "function";
    const path = hasComposedPath ? source.composedPath() : [source];
    for (const node of path) {
      const candidate = closestEditable(node);
      if (candidate) return candidate;
    }
    const direct = closestEditable(source?.target || source);
    if (direct) return direct;
    // An event outside a field must not inherit a previously focused editor.
    // Deferred focus resolution is handled explicitly by the interaction layer.
    if (hasComposedPath) return null;
    const active = getDeepActiveElement();
    const focused = closestEditable(active);
    if (focused) return focused;
    const selection = global.getSelection?.();
    const selectionElement = selection?.anchorNode?.nodeType === Node.ELEMENT_NODE
      ? selection.anchorNode
      : selection?.anchorNode?.parentElement;
    return closestEditable(selectionElement);
  }

  function getDeepActiveElement(root = document) {
    let active = root?.activeElement || null;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
  }

  function parentAcrossShadowBoundary(element) {
    if (element?.parentElement) return element.parentElement;
    const root = element?.getRootNode?.();
    return root instanceof ShadowRoot ? root.host : null;
  }

  function getEditableVisualSurface(editable) {
    const ownRect = editable?.getBoundingClientRect?.();
    if (!ownRect) return null;
    let bestElement = editable;
    let bestRect = ownRect;
    let ancestor = parentAcrossShadowBoundary(editable);
    for (let depth = 0; ancestor && depth < 9; depth += 1, ancestor = parentAcrossShadowBoundary(ancestor)) {
      if (ancestor === document.body || ancestor === document.documentElement) break;
      const rect = ancestor.getBoundingClientRect();
      const topExpansion = ownRect.top - rect.top;
      const bottomExpansion = rect.bottom - ownRect.bottom;
      const leftExpansion = ownRect.left - rect.left;
      const rightExpansion = rect.right - ownRect.right;
      const widthLimit = Math.max(ownRect.width * 1.8, ownRect.width + 320);
      const escapedFieldSurface = rect.height > MAX_VISUAL_SURFACE_HEIGHT
        || topExpansion > MAX_TOP_EXPANSION
        || bottomExpansion > MAX_BOTTOM_EXPANSION
        || leftExpansion > MAX_SIDE_EXPANSION
        || rightExpansion > MAX_SIDE_EXPANSION
        || rect.width > widthLimit;
      if (escapedFieldSurface) break;
      const containsEditable = rect.top <= ownRect.top
        && rect.bottom >= ownRect.bottom
        && rect.left <= ownRect.left
        && rect.right >= ownRect.right;
      const isFieldSurface = containsEditable
        && rect.height >= Math.max(32, ownRect.height)
        && rect.width >= ownRect.width;
      if (isFieldSurface && rect.height > bestRect.height) {
        bestElement = ancestor;
        bestRect = rect;
      }
    }
    return bestElement;
  }

  function getEditableVisualRect(editable) {
    return getEditableVisualSurface(editable)?.getBoundingClientRect?.() || null;
  }

  global.MCP = global.MCP || {};
  global.MCP.findEditableTarget = findEditableTarget;
  global.MCP.getDeepActiveEditable = () => findEditableTarget(getDeepActiveElement());
  global.MCP.getEditableVisualSurface = getEditableVisualSurface;
  global.MCP.getEditableVisualRect = getEditableVisualRect;
})(globalThis);
