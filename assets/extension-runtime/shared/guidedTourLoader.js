(function initGuidedTourLoader(global) {
  const STORAGE_KEY = "ucp_guided_tours_v2";
  const RUNTIME_SCRIPTS = [
    "shared/guidedTourLocales.js",
    "shared/guidedTourTitleLocales.js",
    "shared/guidedTourInfoLocales.js",
    "shared/guidedTour.js"
  ];
  const completedSurfaces = new Set();
  const startTasks = new Map();
  let runtimePromise = null;
  let resourceNodes = [];

  const extensionUrl = (path) => chrome.runtime.getURL(path);

  async function isCompleted(surface) {
    if (completedSurfaces.has(surface)) return true;
    const stored = await chrome.storage.local.get(STORAGE_KEY).catch(() => ({}));
    const completed = Boolean(stored?.[STORAGE_KEY]?.completed?.[surface]);
    if (completed) completedSurfaces.add(surface);
    return completed;
  }

  function loadStylesheet() {
    return new Promise((resolve, reject) => {
      const node = document.createElement("link");
      node.rel = "stylesheet";
      node.href = extensionUrl("shared/guidedTour.css");
      node.dataset.ucpGuidedTourResource = "style";
      node.addEventListener("load", resolve, { once: true });
      node.addEventListener("error", () => reject(new Error("Unable to load guidedTour.css")), { once: true });
      resourceNodes.push(node);
      document.head.appendChild(node);
    });
  }

  function loadRuntimeScript(path) {
    return new Promise((resolve, reject) => {
      const node = document.createElement("script");
      node.src = extensionUrl(path);
      node.async = false;
      node.dataset.ucpGuidedTourResource = "script";
      node.addEventListener("load", resolve, { once: true });
      node.addEventListener("error", () => reject(new Error(`Unable to load ${path}`)), { once: true });
      resourceNodes.push(node);
      document.head.appendChild(node);
    });
  }

  async function ensureGuidedTourRuntime() {
    if (typeof global.MCP?.__startGuidedTourRuntime === "function") return global.MCP.__startGuidedTourRuntime;
    if (runtimePromise) return runtimePromise;
    runtimePromise = (async () => {
      const styleTask = loadStylesheet();
      for (const path of RUNTIME_SCRIPTS) await loadRuntimeScript(path);
      await styleTask;
      if (typeof global.MCP?.__startGuidedTourRuntime !== "function") {
        throw new Error("Guided tour runtime did not initialize");
      }
      return global.MCP.__startGuidedTourRuntime;
    })().catch((error) => {
      releaseGuidedTourRuntime();
      throw error;
    });
    return runtimePromise;
  }

  function releaseGuidedTourRuntime(completedSurface = "") {
    if (completedSurface) completedSurfaces.add(completedSurface);
    for (const node of resourceNodes) node.remove();
    resourceNodes = [];
    runtimePromise = null;
    if (!global.MCP) return;
    delete global.MCP.__startGuidedTourRuntime;
    delete global.MCP.guidedTourLocale;
    delete global.MCP.guidedTourExitLabel;
    delete global.MCP.guidedTourTitleLocale;
    delete global.MCP.guidedTourInfoLocale;
    delete global.MCP.GUIDED_TOUR_TITLE_KEYS;
  }

  async function startGuidedTourInternal(surface) {
    if (!surface || document.documentElement.dataset.guidedTourActive) return null;
    if (await isCompleted(surface)) return null;
    const startRuntimeTour = await ensureGuidedTourRuntime();
    const tour = await startRuntimeTour(surface);
    if (!tour && !document.documentElement.dataset.guidedTourActive) releaseGuidedTourRuntime();
    return tour;
  }

  function startGuidedTour(surface) {
    if (startTasks.has(surface)) return startTasks.get(surface);
    const task = startGuidedTourInternal(surface).finally(() => startTasks.delete(surface));
    startTasks.set(surface, task);
    return task;
  }

  global.MCP = global.MCP || {};
  global.MCP.startGuidedTour = startGuidedTour;
  global.MCP.startContextualGuidedTour = startGuidedTour;
  global.MCP.ensureGuidedTourRuntime = ensureGuidedTourRuntime;
  global.MCP.releaseGuidedTourRuntime = releaseGuidedTourRuntime;
  global.MCP.GUIDED_TOUR_STORAGE_KEY = STORAGE_KEY;
})(globalThis);
