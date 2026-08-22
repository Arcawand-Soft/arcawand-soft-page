(function initDialogKeyboardSupport(global) {
  if (global.MCP?.installDialogKeyboardSupport) return;

  const ENHANCED_ATTRIBUTE = "data-ucp-dialog-close";
  const ICON_CLOSE_TEXT = new Set(["x", "×", "✕", "✖"]);

  function iconCloseText(button) {
    return Array.from(button?.childNodes || [])
      .map((node) => node.textContent || "")
      .join("")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  function isHeaderGlyphButton(button) {
    if (!(button instanceof Element) || button.tagName !== "BUTTON") return false;
    const text = iconCloseText(button);
    if (!ICON_CLOSE_TEXT.has(text)) return false;
    return Boolean(button.closest("header, [class*='-head'], [class*='__head']"));
  }

  function isHeaderIconClose(button) {
    if (!isHeaderGlyphButton(button)) return false;
    const isInClosableSurface = Boolean(button.closest("dialog, [role='dialog'], [aria-modal='true'], [class*='modal'], [class*='overlay']"));
    return isInClosableSurface;
  }

  function isHeaderCloseControl(button) {
    if (!(button instanceof Element) || button.tagName !== "BUTTON") return false;
    const isInHeader = Boolean(button.closest("header, [class*='-head'], [class*='__head']"));
    const isInClosableSurface = Boolean(button.closest("dialog, [role='dialog'], [aria-modal='true'], [class*='modal'], [class*='overlay']"));
    return isInHeader && isInClosableSurface;
  }

  function isExplicitIconClose(button) {
    if (!(button instanceof Element) || button.tagName !== "BUTTON") return false;
    const id = String(button.id || "").toLowerCase();
    const className = String(button.className || "").toLowerCase();
    const action = String(button.dataset?.action || button.dataset?.managerAction || "").toLowerCase();
    const role = String(button.dataset?.role || "").toLowerCase();
    if (["closemanager", "closeoptions"].includes(id)) return true;
    if (action === "close-panel") return true;
    if (/(^|[-_])close($|[-_])/.test(className) && ICON_CLOSE_TEXT.has(iconCloseText(button))) return true;
    if ((action.startsWith("close-") || role.startsWith("close-")) && isHeaderCloseControl(button)) return true;
    return isHeaderIconClose(button);
  }

  function isVisible(element) {
    if (!element?.isConnected || element.hidden || element.disabled) return false;
    if (!element.getClientRects().length) return false;
    for (let current = element; current && current.nodeType === 1; current = current.parentElement) {
      if (current.hidden || current.getAttribute("aria-hidden") === "true") return false;
      const style = getComputedStyle(current);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    }
    return true;
  }

  function stackingScore(button, order) {
    let depth = 0;
    let zIndex = 0;
    let fixedLayer = 0;
    let dialogLayers = 0;
    for (let current = button; current && current.nodeType === 1; current = current.parentElement) {
      depth += 1;
      const style = getComputedStyle(current);
      const parsed = Number.parseInt(style.zIndex, 10);
      if (Number.isFinite(parsed)) zIndex = Math.max(zIndex, parsed);
      if (style.position === "fixed") fixedLayer = 1;
      if (current.matches("dialog, [role='dialog'], [aria-modal='true'], [class*='modal'], [class*='overlay']")) dialogLayers += 1;
    }
    return (dialogLayers * 1e12) + (fixedLayer * 1e9) + (zIndex * 1e5) + (depth * 100) + order;
  }

  function topmostCloseButton(root) {
    const visibleButtons = Array.from(root.querySelectorAll(`button[${ENHANCED_ATTRIBUTE}]`)).filter(isVisible);
    const dialogButtons = visibleButtons.filter((button) => button.closest("dialog, [role='dialog'], [aria-modal='true'], [class*='modal'], [class*='overlay']"));
    return (dialogButtons.length ? dialogButtons : visibleButtons)
      .map((button, order) => ({ button, score: stackingScore(button, order) }))
      .sort((a, b) => b.score - a.score)[0]?.button || null;
  }

  function installDialogKeyboardSupport(root = document) {
    if (!root?.querySelectorAll || !root?.addEventListener) return null;
    if (root.__ucpDialogKeyboardController) {
      root.__ucpDialogKeyboardController.refresh();
      return root.__ucpDialogKeyboardController;
    }

    let destroyed = false;

    const enhance = (button) => {
      if (!isExplicitIconClose(button)) return;
      button.setAttribute(ENHANCED_ATTRIBUTE, "true");
    };

    const refresh = () => {
      if (destroyed) return;
      root.querySelectorAll(`button[${ENHANCED_ATTRIBUTE}]`).forEach((button) => {
        if (isExplicitIconClose(button)) return;
        button.removeAttribute(ENHANCED_ATTRIBUTE);
      });
      root.querySelectorAll("button").forEach(enhance);
    };

    const onKeydown = (event) => {
      if (event.key !== "Escape" || event.repeat || event.defaultPrevented) return;
      const button = topmostCloseButton(root);
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      button.click();
    };

    const observer = new MutationObserver(refresh);
    observer.observe(root, { childList: true, subtree: true });
    root.addEventListener("keydown", onKeydown, true);

    const controller = {
      refresh,
      setLanguage() {
        refresh();
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        observer.disconnect();
        root.removeEventListener("keydown", onKeydown, true);
        delete root.__ucpDialogKeyboardController;
      }
    };
    root.__ucpDialogKeyboardController = controller;
    refresh();
    return controller;
  }

  global.MCP = Object.assign(global.MCP || {}, {
    installDialogKeyboardSupport,
    topmostCloseButton
  });
})(globalThis);
