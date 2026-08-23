(function installUltimateClipboardDemoZoom(global) {
  "use strict";

  if (global.UCP_DEMO_ZOOM) return;

  const chromeZoomSteps = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.6, 1.75, 2, 2.5, 3, 4, 5];
  const listeners = new Set();
  let currentFactor = 1;
  let refreshScheduled = false;

  function normalize(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.min(5, Math.max(0.25, numeric));
  }

  function snap(value) {
    const measured = normalize(value);
    const closest = chromeZoomSteps.reduce((best, candidate) => (
      Math.abs(candidate - measured) < Math.abs(best - measured) ? candidate : best
    ), 1);
    return Math.abs(closest - measured) / closest <= 0.045 ? closest : 1;
  }

  function measure() {
    try {
      const extensionZoom = global.document?.getElementById?.("mcp-floating-host")?.dataset?.pageZoom;
      if (Number.isFinite(Number(extensionZoom)) && Number(extensionZoom) > 0) return normalize(extensionZoom);
    } catch (_error) {
      // The public demo remains standalone when Ultimate Clipboard Pro is not installed.
    }
    const outerWidth = Number(global.outerWidth);
    const innerWidth = Number(global.innerWidth);
    return outerWidth > 0 && innerWidth > 0 ? snap(outerWidth / innerWidth) : 1;
  }

  function apply(nextFactor) {
    const factor = normalize(nextFactor);
    currentFactor = factor;
    const root = global.document?.documentElement;
    root?.style.setProperty("--ucp-demo-page-zoom", String(factor));
    root?.style.setProperty("--ucp-demo-page-zoom-inverse", String(1 / factor));
    root?.style.setProperty("--ucp-demo-native-vw", `calc(100vw * ${factor})`);
    root?.style.setProperty("--ucp-demo-native-vh", `calc(100vh * ${factor})`);
  }

  function refresh() {
    refreshScheduled = false;
    const nextFactor = measure();
    if (nextFactor === currentFactor) return;
    const previousFactor = currentFactor;
    apply(nextFactor);
    listeners.forEach((listener) => listener(nextFactor, previousFactor));
  }

  function scheduleRefresh() {
    if (refreshScheduled) return;
    refreshScheduled = true;
    if (typeof global.requestAnimationFrame === "function") global.requestAnimationFrame(refresh);
    else global.setTimeout(refresh, 0);
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  apply(measure());
  global.addEventListener?.("resize", scheduleRefresh, { passive: true });
  global.visualViewport?.addEventListener?.("resize", scheduleRefresh, { passive: true });
  global.UCP_DEMO_ZOOM = { getFactor: () => currentFactor, measure, normalize, snap, subscribe, refresh: scheduleRefresh };
})(window);
