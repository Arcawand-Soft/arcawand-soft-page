(function initExtensionPageImageTextCapture(global) {
  const MCP = global.MCP = global.MCP || {};

  function isManagerExtensionPage(url, extensionOrigin = "") {
    if (!url || !extensionOrigin || !String(url).startsWith(extensionOrigin)) return false;
    try {
      const parsed = new URL(url);
      return parsed.pathname === "/sidepanel/sidepanel.html";
    } catch (error) {
      return false;
    }
  }

  function nextPaint() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function selectRegion({ accentColor, selectingLabel }) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      const box = document.createElement("div");
      const label = document.createElement("div");
      Object.assign(overlay.style, {
        position: "fixed", inset: "0", zIndex: "2147483647", cursor: "crosshair",
        background: "rgba(5, 9, 16, 0.18)", touchAction: "none", userSelect: "none"
      });
      Object.assign(box.style, {
        position: "fixed", display: "none", border: `2px solid ${accentColor}`,
        borderRadius: "8px", background: "rgba(255,255,255,0.05)",
        boxShadow: `0 0 0 9999px rgba(5,9,16,0.38), 0 0 22px ${accentColor}`,
        pointerEvents: "none"
      });
      Object.assign(label.style, {
        position: "fixed", top: "18px", left: "50%", transform: "translateX(-50%)",
        maxWidth: "calc(100vw - 40px)", padding: "10px 16px", borderRadius: "999px",
        color: "#fff", background: "rgba(17,24,39,0.92)", font: "700 14px/1.25 Inter,system-ui,sans-serif",
        boxShadow: "0 8px 28px rgba(0,0,0,0.28)", pointerEvents: "none"
      });
      label.textContent = selectingLabel;
      overlay.append(box, label);
      document.documentElement.appendChild(overlay);

      let start = null;
      const finish = (result) => {
        document.removeEventListener("keydown", cancel, true);
        overlay.remove();
        resolve(result);
      };
      overlay.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        start = { x: event.clientX, y: event.clientY };
        overlay.setPointerCapture(event.pointerId);
        box.style.display = "block";
      });
      overlay.addEventListener("pointermove", (event) => {
        if (!start) return;
        const left = Math.min(start.x, event.clientX);
        const top = Math.min(start.y, event.clientY);
        const width = Math.abs(event.clientX - start.x);
        const height = Math.abs(event.clientY - start.y);
        Object.assign(box.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
      });
      overlay.addEventListener("pointerup", (event) => {
        if (!start) return;
        const rect = {
          left: Math.min(start.x, event.clientX),
          top: Math.min(start.y, event.clientY),
          width: Math.abs(event.clientX - start.x),
          height: Math.abs(event.clientY - start.y)
        };
        finish(rect.width >= 8 && rect.height >= 8 ? rect : null);
      });
      overlay.addEventListener("contextmenu", (event) => { event.preventDefault(); finish(null); });
      function cancel(event) {
        if (event.key !== "Escape") return;
        event.preventDefault();
        finish(null);
      }
      document.addEventListener("keydown", cancel, true);
    });
  }

  function showProcessingOverlay(label) {
    const node = document.createElement("div");
    Object.assign(node.style, {
      position: "fixed", left: "50%", top: "18px", zIndex: "2147483647",
      transform: "translateX(-50%)", maxWidth: "calc(100vw - 40px)",
      padding: "10px 16px", borderRadius: "999px", color: "#fff",
      background: "rgba(17,24,39,0.92)", font: "700 14px/1.25 Inter,system-ui,sans-serif",
      boxShadow: "0 8px 28px rgba(0,0,0,0.28)", pointerEvents: "none"
    });
    node.setAttribute("role", "status");
    node.setAttribute("aria-live", "polite");
    node.textContent = label;
    document.documentElement.appendChild(node);
    return node;
  }

  async function cropDataUrl(dataUrl, rect) {
    const image = await new Promise((resolve, reject) => {
      const node = new Image();
      node.onload = () => resolve(node);
      node.onerror = reject;
      node.src = dataUrl;
    });
    const scaleX = image.naturalWidth / Math.max(1, window.innerWidth);
    const scaleY = image.naturalHeight / Math.max(1, window.innerHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(rect.width * scaleX));
    canvas.height = Math.max(1, Math.round(rect.height * scaleY));
    canvas.getContext("2d", { alpha: false }).drawImage(
      image,
      Math.round(rect.left * scaleX), Math.round(rect.top * scaleY), canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    );
    return canvas.toDataURL("image/png");
  }

  async function captureTextFromExtensionPage(options = {}) {
    const rect = await selectRegion({
      accentColor: options.accentColor || "#e50914",
      selectingLabel: options.selectingLabel || ""
    });
    if (!rect) return { cancelled: true, text: "" };
    await nextPaint();
    const capture = await chrome.runtime.sendMessage({ type: MCP.MESSAGE_TYPES?.CAPTURE_VISIBLE_TAB || "MCP_CAPTURE_VISIBLE_TAB" });
    if (!capture?.ok || !capture?.data?.dataUrl) return { cancelled: false, text: "" };
    const cropped = await cropDataUrl(capture.data.dataUrl, rect);
    const processing = showProcessingOverlay(options.processingLabel || "");
    try {
      const ocr = await chrome.runtime.sendMessage({
        type: MCP.MESSAGE_TYPES?.RUN_OCR || "MCP_RUN_OCR",
        dataUrl: cropped,
        language: "eng"
      });
      return { cancelled: false, text: String(ocr?.data?.text || ocr?.text || "").trim() };
    } finally {
      processing.remove();
    }
  }

  MCP.isManagerExtensionPage = isManagerExtensionPage;
  MCP.captureTextFromExtensionPage = captureTextFromExtensionPage;
})(globalThis);
