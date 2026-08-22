(function initSettingsRepository(global) {
  "use strict";

  function createSettingsRepository({ storageKey, defaults, read, write, now = Date.now }) {
    if (!storageKey || typeof read !== "function" || typeof write !== "function") {
      throw new TypeError("Settings repository requires a storage key and read/write adapters.");
    }

    async function getSettings() {
      const data = await read(storageKey);
      const persisted = data?.[storageKey] || {};
      const settings = Object.assign({}, defaults, persisted, { dodoEnv: "live" });
      Object.assign(settings, global.MCP?.normalizeDateTimePreferences?.(settings) || {});
      global.MCP?.configureDateTimeFormatting?.(settings);
      if ((persisted.excludedDomainsDefaultsVersion || 0) < 1) {
        const demoUrls = Array.isArray(global.MCP?.DEFAULT_EXCLUDED_DEMO_URLS) ? global.MCP.DEFAULT_EXCLUDED_DEMO_URLS : [];
        const excludedDomains = Array.isArray(settings.excludedDomains) ? settings.excludedDomains : [];
        settings.excludedDomains = [...new Set([...excludedDomains, ...demoUrls].map((entry) => String(entry || "").trim()).filter(Boolean))];
        settings.excludedDomainsDefaultsVersion = 1;
        await saveSettings(settings);
      }
      removeRetiredSettings(settings);
      if (!persisted.accentColor || persisted.accentColor === "#6366f1") settings.accentColor = defaults.accentColor;
      if (settings.privateModeUntil && now() > settings.privateModeUntil) {
        settings.privateMode = false;
        settings.privateModeUntil = null;
        await saveSettings(settings);
      }
      if (!global.MCP?.normalizeLicenseSettings) return settings;
      const normalized = await global.MCP.normalizeLicenseSettings(settings);
      if (!normalized) return settings;
      if (JSON.stringify(normalized) === JSON.stringify(settings)) return normalized;
      const stamped = Object.assign({}, normalized, { settingsUpdatedAt: now() });
      await write({ [storageKey]: stamped });
      global.MCP?.cacheThemeSettings?.(stamped);
      return stamped;
    }

    async function saveSettings(settings) {
      const stored = await read(storageKey).catch(() => ({}));
      const previous = stored?.[storageKey] || {};
      const merged = Object.assign({}, defaults, settings || {}, { dodoEnv: "live", settingsUpdatedAt: now() });
      Object.assign(merged, global.MCP?.normalizeDateTimePreferences?.(merged) || {});
      preserveNewerLauncherState(previous, merged);
      removeRetiredSettings(merged);
      await write({ [storageKey]: merged });
      global.MCP?.cacheThemeSettings?.(merged);
      global.MCP?.configureDateTimeFormatting?.(merged);
      return merged;
    }

    return Object.freeze({ getSettings, saveSettings });
  }

  function preserveNewerLauncherState(previous, merged) {
    const modeAt = Math.max(0, Number(previous.floatingLauncherModeUpdatedAt) || 0);
    if (modeAt > Math.max(0, Number(merged.floatingLauncherModeUpdatedAt) || 0)) {
      merged.floatingLauncherCollapsed = previous.floatingLauncherCollapsed === true;
      merged.floatingLauncherModeUpdatedAt = modeAt;
    }
    const positionAt = Math.max(0, Number(previous.floatingLauncherPositionUpdatedAt) || 0);
    if (positionAt > Math.max(0, Number(merged.floatingLauncherPositionUpdatedAt) || 0)) {
      merged.floatingLauncherBottom = previous.floatingLauncherBottom;
      merged.floatingLauncherPositionUpdatedAt = positionAt;
    }
    const closedAt = Number(previous.floatingPanelManualClosedAt) || 0;
    const openedAt = Number(previous.floatingPanelOpenedAt) || 0;
    if (closedAt > 0 && closedAt >= openedAt && merged.floatingPanelOpen === true && (Number(merged.floatingPanelOpenedAt) || 0) <= closedAt) {
      merged.floatingPanelOpen = false;
      merged.floatingPanelOpenedAt = openedAt;
      merged.floatingPanelManualClosedAt = closedAt;
    }
  }

  function removeRetiredSettings(settings) {
    ["searchOpenAsOverlay", "searchIncludeNotes", "searchIncludeSourceUrls", "searchFavoritesFirst", "searchMaxResults", "askCategoryAfterCopy"].forEach((key) => delete settings[key]);
  }

  global.MCP = global.MCP || {};
  global.MCP.createSettingsRepository = createSettingsRepository;
})(globalThis);
