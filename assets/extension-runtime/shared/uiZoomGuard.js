(function initUltimateClipboardUiZoomGuard() {
  "use strict";

  if (globalThis.__UCP_UI_ZOOM_GUARD__) return;
  globalThis.__UCP_UI_ZOOM_GUARD__ = true;

  const MESSAGE_GET_ZOOM = "MCP_GET_PAGE_ZOOM";
  const MESSAGE_ZOOM_CHANGED = "MCP_PAGE_ZOOM_CHANGED";
  const SESSION_ZOOM_KEY = "mcp_ui_zoom_factor";
  const root = document.documentElement;
  const isPopup = location.pathname.endsWith("/popup/popup.html");
  const isNativeSidePanel = location.pathname.endsWith("/panel/nativePanel.html");
  let zoomRefreshRevision = 0;

  const style = document.createElement("style");
  style.dataset.ucpUiZoomGuard = "true";
  style.textContent = `
    html.ucp-ui-zoom-guard {
      width: 100%;
      height: 100%;
      overflow: hidden !important;
    }
    html.ucp-ui-zoom-guard body {
      ${isPopup ? "" : "width: var(--ucp-ui-viewport-width, 100vw) !important;\n      height: var(--ucp-ui-viewport-height, 100vh) !important;"}
      transform: scale(var(--ucp-ui-zoom-inverse, 1)) !important;
      transform-origin: 0 0 !important;
      container: ucp-ui / size;
    }
    html.ucp-ui-zoom-guard.ucp-ui-zoom-scroll body {
      overflow: auto !important;
    }
  `;
  document.head.appendChild(style);
  root.classList.add("ucp-ui-zoom-guard");
  if (location.pathname.endsWith("/options/options.html")) root.classList.add("ucp-ui-zoom-scroll");
  root.style.visibility = "hidden";

  function normalizeZoom(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.min(5, Math.max(0.25, numeric));
  }

  function applyZoom(value) {
    const factor = isPopup ? 1 : normalizeZoom(value);
    root.dataset.ucpUiZoom = String(factor);
    root.style.setProperty("--ucp-ui-zoom", String(factor));
    root.style.setProperty("--ucp-ui-zoom-inverse", String(1 / factor));
    root.style.setProperty("--ucp-ui-viewport-width", `calc(100vw * ${factor})`);
    root.style.setProperty("--ucp-ui-viewport-height", `calc(100vh * ${factor})`);
    root.style.visibility = "";
    window.dispatchEvent(new CustomEvent("ucp:ui-zoom-changed", { detail: { zoomFactor: factor } }));
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === MESSAGE_ZOOM_CHANGED && message.extensionUi === true) {
      if (isNativeSidePanel) {
        refreshEffectiveZoom();
      } else {
        applyZoom(message.zoomFactor);
      }
    }
  });

  async function readNativeSidePanelZoom() {
    const pixelRatio = Number(window.devicePixelRatio) || 1;
    try {
      const displays = await chrome.system?.display?.getInfo?.();
      if (Array.isArray(displays) && displays.length) {
        const centerX = Number(window.screenX || window.screenLeft || 0) + (Number(window.outerWidth) || 0) / 2;
        const centerY = Number(window.screenY || window.screenTop || 0) + (Number(window.outerHeight) || 0) / 2;
        const display = displays.find((entry) => {
          const bounds = entry?.bounds || {};
          const left = Number(bounds.left) || 0;
          const top = Number(bounds.top) || 0;
          const width = Number(bounds.width) || 0;
          const height = Number(bounds.height) || 0;
          return centerX >= left && centerX < left + width && centerY >= top && centerY < top + height;
        }) || displays.find((entry) => entry?.isPrimary) || displays[0];
        const displayScale = Number(display?.deviceScaleFactor) || 1;
        return pixelRatio / displayScale;
      }
    } catch (_error) {
      // The extension-origin zoom cache remains a compatibility fallback.
    }
    const response = await chrome.runtime.sendMessage({ type: MESSAGE_GET_ZOOM, extensionUi: true });
    return response?.data?.zoomFactor ?? response?.zoomFactor ?? 1;
  }

  async function readEffectiveZoom() {
    if (isNativeSidePanel) return readNativeSidePanelZoom();
    try {
      const currentTab = await chrome.tabs?.getCurrent?.();
      if (Number.isInteger(currentTab?.id)) {
        const directZoom = await chrome.tabs?.getZoom?.(currentTab.id);
        if (Number.isFinite(Number(directZoom)) && Number(directZoom) > 0) return directZoom;
      }
    } catch (_error) {
      // Non-tab extension views use the extension-origin zoom cached by the
      // service worker. Never fall back to the active web tab: its zoom is an
      // independent value and would make the side panel jump between scales.
    }
    const response = await chrome.runtime.sendMessage({ type: MESSAGE_GET_ZOOM, extensionUi: true });
    return response?.data?.zoomFactor ?? response?.zoomFactor ?? 1;
  }

  function refreshEffectiveZoom() {
    const revision = ++zoomRefreshRevision;
    readEffectiveZoom().then((zoomFactor) => {
      if (revision === zoomRefreshRevision) applyZoom(zoomFactor);
    }).catch(() => {
      if (revision === zoomRefreshRevision) applyZoom(1);
    });
  }

  chrome.tabs?.onZoomChange?.addListener?.(() => refreshEffectiveZoom());
  if (isNativeSidePanel) window.addEventListener("resize", refreshEffectiveZoom, { passive: true });

  const revealTimer = window.setTimeout(() => applyZoom(1), 500);
  if (!isNativeSidePanel) {
    chrome.storage.session?.get(SESSION_ZOOM_KEY).then((stored) => {
      if (stored?.[SESSION_ZOOM_KEY]) applyZoom(stored[SESSION_ZOOM_KEY]);
    }).catch(() => {});
  }

  const initialRevision = ++zoomRefreshRevision;
  readEffectiveZoom().then((zoomFactor) => {
    window.clearTimeout(revealTimer);
    if (initialRevision === zoomRefreshRevision) applyZoom(zoomFactor);
  }).catch(() => {
    window.clearTimeout(revealTimer);
    if (initialRevision === zoomRefreshRevision) applyZoom(1);
  });
})();
