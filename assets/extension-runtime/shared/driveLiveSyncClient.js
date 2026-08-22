(function initDriveLiveSyncClient(global) {
  if (global.__mcpDriveLiveSyncStarted) return;
  global.__mcpDriveLiveSyncStarted = true;
  // The worker globally throttles Drive metadata checks, so every visible
  // surface may request this cadence without multiplying Google API traffic.
  const intervalMs = 6000;
  let timer = null;
  let requestPending = false;
  let eligible = false;
  let stopped = false;

  function getExtensionApi() {
    try {
      const extensionApi = global.chrome;
      if (!extensionApi?.runtime?.id || !extensionApi.storage?.local) return null;
      return extensionApi;
    } catch (_) {
      return null;
    }
  }

  function cleanup() {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
    timer = null;
    document.removeEventListener("visibilitychange", schedule);
    global.removeEventListener("focus", check);
    const extensionApi = getExtensionApi();
    extensionApi?.storage?.onChanged?.removeListener?.(handleStorageChange);
  }

  function isEligible(settings = {}) {
    return settings.driveSyncEnabled === true
      && String(settings.plan || "").toLowerCase() === "pro"
      && ["active", "valid", "licensed"].includes(String(settings.licenseStatus || "").toLowerCase());
  }

  async function check() {
    if (stopped || !eligible || document.visibilityState !== "visible" || requestPending) return;
    const extensionApi = getExtensionApi();
    if (!extensionApi) {
      cleanup();
      return;
    }
    requestPending = true;
    try {
      await extensionApi.runtime.sendMessage({
        type: global.MCP?.MESSAGE_TYPES?.DRIVE_LIVE_CHECK || "MCP_DRIVE_LIVE_CHECK",
        surface: document.documentElement?.dataset?.surface || location.pathname
      });
    } catch (_) {
      // A suspended or reloading worker is retried on the next visible tick.
    } finally {
      requestPending = false;
    }
  }

  async function schedule() {
    if (stopped) return;
    clearInterval(timer);
    timer = null;
    const extensionApi = getExtensionApi();
    if (!extensionApi) {
      cleanup();
      return;
    }
    let stored;
    try {
      stored = await extensionApi.storage.local.get("mcp_settings");
    } catch (_) {
      if (!getExtensionApi()) cleanup();
      return;
    }
    eligible = isEligible(stored?.mcp_settings || {});
    if (document.visibilityState !== "visible") return;
    check();
    timer = setInterval(check, intervalMs);
  }

  function handleStorageChange(changes, areaName) {
    if (areaName !== "local" || !changes.mcp_settings) return;
    eligible = isEligible(changes.mcp_settings.newValue || {});
    schedule();
  }

  const extensionApi = getExtensionApi();
  if (!extensionApi) return;
  document.addEventListener("visibilitychange", schedule, { passive: true });
  extensionApi.storage.onChanged?.addListener?.(handleStorageChange);
  global.addEventListener("focus", check, { passive: true });
  global.addEventListener("pagehide", cleanup, { once: true });
  schedule();
})(globalThis);
