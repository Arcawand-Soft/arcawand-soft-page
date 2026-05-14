(function bootUltimateClipboardTheme(global) {
  const SETTINGS_KEY = "mcp_settings";
  const CACHE_KEY = "ucp_theme_boot_v1";
  const FALLBACK_SETTINGS = {
    theme: "system",
    accentColor: "#e50914"
  };

  function normalizeHexColor(value, fallback = "#e50914") {
    const raw = String(value || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(raw)) {
      return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toLowerCase();
    }
    return fallback;
  }

  function hexToRgbParts(value) {
    const hex = normalizeHexColor(value).slice(1);
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ].join(", ");
  }

  function resolveTheme(theme = "system") {
    if (theme === "light" || theme === "dark") return theme;
    try {
      return global.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "light" : "dark";
    } catch (error) {
      return "dark";
    }
  }

  function readCachedSettings() {
    try {
      const raw = global.localStorage?.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function cacheSettings(settings) {
    try {
      const value = {
        theme: settings?.theme || "system",
        accentColor: normalizeHexColor(settings?.accentColor || "#e50914")
      };
      global.localStorage?.setItem(CACHE_KEY, JSON.stringify(value));
    } catch (error) {
      // The UI should never fail because boot cache storage is unavailable.
    }
  }

  function applyTheme(settings = {}, ready = true) {
    const root = global.document?.documentElement;
    if (!root) return;
    const next = Object.assign({}, FALLBACK_SETTINGS, settings || {});
    const accent = normalizeHexColor(next.accentColor || "#e50914");
    const requestedTheme = next.theme || "system";
    const resolvedTheme = resolveTheme(requestedTheme);
    root.dataset.theme = requestedTheme;
    root.dataset.resolvedTheme = resolvedTheme;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-rgb", hexToRgbParts(accent));
    root.style.colorScheme = resolvedTheme;
    if (ready) {
      root.dataset.themeReady = "true";
      root.removeAttribute("data-theme-pending");
    }
  }

  const root = global.document?.documentElement;
  if (root) root.dataset.themePending = "true";

  const cached = readCachedSettings();
  if (cached) {
    applyTheme(cached, true);
  }

  try {
    global.chrome?.storage?.local?.get?.(SETTINGS_KEY, (stored) => {
      const settings = stored?.[SETTINGS_KEY] || cached || FALLBACK_SETTINGS;
      applyTheme(settings, true);
      cacheSettings(settings);
    });
  } catch (error) {
    applyTheme(cached || FALLBACK_SETTINGS, true);
  }

  global.setTimeout(() => {
    if (!root?.dataset.themeReady) {
      applyTheme(cached || FALLBACK_SETTINGS, true);
    }
  }, 900);

  try {
    global.matchMedia?.("(prefers-color-scheme: light)")?.addEventListener?.("change", () => {
      const currentTheme = root?.dataset.theme || cached?.theme || "system";
      if (currentTheme === "system") applyTheme(readCachedSettings() || FALLBACK_SETTINGS, true);
    });
  } catch (error) {
    // Older browser builds can miss addEventListener on MediaQueryList.
  }
})(globalThis);
