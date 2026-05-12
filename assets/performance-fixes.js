(function () {
  const IMAGE_DIMENSIONS = new Map([
    ["/assets/ultimate_clipboard_pro_icon_96.webp", [96, 96]],
    ["/assets/Arcawand_Soft_Logo_320.webp", [320, 88]],
    ["/assets/ultimate_clipboard_pro_main_picture_720.webp", [720, 720]],
    ["/assets/products/image-big-panel-rectangular.webp", [1400, 788]],
    ["/assets/products/rightside_panel.webp", [1400, 788]],
    ["/assets/products/text-big-panel-rectangular.webp", [1400, 788]],
    ["/assets/products/code-big-panel-rectangular.webp", [1400, 788]],
    ["/assets/products/all_tools_panel_menu.webp", [1400, 788]],
    ["/assets/item_text_capture.webp", [820, 366]],
    ["/assets/item_code_capture.webp", [823, 358]],
    ["/assets/item_image_capture.webp", [722, 522]],
    ["/assets/menu_tabs_text_code_image.webp", [678, 316]],
    ["/assets/advanced_search.webp", [953, 500]],
    ["/assets/source_history_2.webp", [1400, 702]],
    ["/assets/launcher.webp", [1400, 788]]
  ]);

  const ALT_FALLBACKS = new Map([
    ["Ultimate Clipboard Pro code capture manager", "/assets/products/code-big-panel-rectangular.webp"],
    ["Ultimate Clipboard Pro tools panel", "/assets/products/all_tools_panel_menu.webp"]
  ]);

  function normalizePath(src) {
    try {
      return new URL(src || "", window.location.href).pathname;
    } catch (_) {
      return src || "";
    }
  }

  function patchImage(img) {
    if (!img || img.dataset.perfPatched === "true") return;

    const fallback = ALT_FALLBACKS.get(img.getAttribute("alt") || "");
    if ((!img.getAttribute("src") || img.getAttribute("src") === "") && fallback) {
      img.setAttribute("src", fallback);
    }

    const path = normalizePath(img.currentSrc || img.getAttribute("src"));
    const dimensions = IMAGE_DIMENSIONS.get(path);
    if (dimensions) {
      if (!img.hasAttribute("width")) img.setAttribute("width", String(dimensions[0]));
      if (!img.hasAttribute("height")) img.setAttribute("height", String(dimensions[1]));
      img.style.aspectRatio ||= `${dimensions[0]} / ${dimensions[1]}`;
    }

    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    img.dataset.perfPatched = "true";
  }

  function patchControls() {
    document.querySelectorAll(".language-menu-button").forEach((button) => {
      if (!button.getAttribute("aria-label")) {
        const label = (button.textContent || "").trim();
        button.setAttribute("aria-label", label ? `Select language: ${label}` : "Select language");
      }
    });

    document.querySelectorAll(".ucp-product-mark[aria-label]").forEach((mark) => {
      mark.removeAttribute("aria-label");
    });
  }

  function patchAll() {
    document.querySelectorAll("img").forEach(patchImage);
    patchControls();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", patchAll, { once: true });
  } else {
    patchAll();
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches("img")) patchImage(node);
        node.querySelectorAll?.("img").forEach(patchImage);
      });
    }
    patchControls();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
