(function initUtils(global) {
  function createId(prefix = "mcp") {
    const randomPart = Math.random().toString(36).slice(2, 10);
    return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
  }

  function normalizeContent(content) {
    return String(content || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  function createPreview(content, length = 180) {
    const clean = String(content || "").replace(/\s+/g, " ").trim();
    return clean.length > length ? `${clean.slice(0, length - 1)}\u2026` : clean;
  }

  function getDomain(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (error) {
      return "";
    }
  }

  function createSourceFaviconUrl(sourceUrl = "", explicitFaviconUrl = "", sourceDomain = "") {
    const explicit = String(explicitFaviconUrl || "").trim();
    if (/^(https?:|data:image\/|chrome-extension:)/i.test(explicit)) return explicit;
    const legacyChromePageUrl = /^chrome:\/\/favicon2\?/i.test(explicit) ? extractQueryParam(explicit, "page_url") : "";
    const url = String(sourceUrl || legacyChromePageUrl || "").trim();
    const domain = String(sourceDomain || getDomain(url) || "").trim().replace(/^www\./, "");
    try {
      if (/^https?:\/\//i.test(url)) return `${new URL(url).origin}/favicon.ico`;
    } catch (error) {
      // Fall back to the normalized domain below.
    }
    return domain && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain) ? `https://${domain}/favicon.ico` : "";
  }

  function createGenericFaviconUrl() {
    try {
      if (global.chrome?.runtime?.getURL) return global.chrome.runtime.getURL("assets/icons/favicon_generic.png");
    } catch (error) {
      // The generic favicon is only a visual fallback; keep rendering even if extension APIs are unavailable.
    }
    return "../assets/icons/favicon_generic.png";
  }

  let genericFaviconDataUrlPromise = null;

  function readGenericFaviconDataUrl() {
    if (genericFaviconDataUrlPromise) return genericFaviconDataUrlPromise;
    genericFaviconDataUrlPromise = (async () => {
      const response = await fetch(createGenericFaviconUrl());
      if (!response.ok) throw new Error("Generic favicon unavailable");
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("Unable to read generic favicon"));
        reader.readAsDataURL(blob);
      });
    })().catch(() => "");
    return genericFaviconDataUrlPromise;
  }

  function sourceOriginKey(url = "") {
    try {
      return new URL(url).origin;
    } catch (error) {
      return "";
    }
  }

  async function persistGenericFaviconForItem(item = {}, failedSrc = "") {
    if (!item?.id || !global.chrome?.storage?.local) return;
    const genericDataUrl = await readGenericFaviconDataUrl();
    if (!genericDataUrl) return;
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const collectionKeys = [
      storageKeys.ITEMS || "mcp_clipboard_items",
      storageKeys.DEV_ITEMS || "mcp_dev_items",
      storageKeys.IMAGE_ITEMS || "mcp_image_items"
    ];
    const domain = String(item.sourceDomain || item.domain || "").replace(/^www\./, "");
    const origin = sourceOriginKey(item.sourceUrl || item.url || "");
    const store = await global.chrome.storage.local.get(collectionKeys).catch(() => ({}));
    const patch = {};
    collectionKeys.forEach((key) => {
      const list = Array.isArray(store?.[key]) ? store[key] : [];
      let changed = false;
      const next = list.map((current) => {
        const currentDomain = String(current?.sourceDomain || "").replace(/^www\./, "");
        const currentOrigin = sourceOriginKey(current?.sourceUrl || "");
        const sameItem = current?.id === item.id;
        const sameSource = Boolean(domain && currentDomain === domain) || Boolean(origin && currentOrigin === origin);
        const sameFailedFavicon = failedSrc && current?.sourceFaviconUrl === failedSrc;
        if (!sameItem && !sameSource && !sameFailedFavicon) return current;
        if (current?.sourceFaviconUrl === genericDataUrl) return current;
        changed = true;
        return Object.assign({}, current, { sourceFaviconUrl: genericDataUrl });
      });
      if (changed) patch[key] = next;
    });
    if (Object.keys(patch).length) await global.chrome.storage.local.set(patch).catch(() => {});
  }

  function extractQueryParam(url = "", key = "") {
    try {
      return new URL(url).searchParams.get(key) || "";
    } catch (error) {
      const match = new RegExp(`[?&]${key}=([^&]+)`).exec(String(url || ""));
      return match ? decodeURIComponent(match[1]) : "";
    }
  }

  function createSourceFaviconImage(itemOrUrl = {}, className = "source-favicon") {
    const item = typeof itemOrUrl === "string" ? { sourceUrl: itemOrUrl } : itemOrUrl || {};
    const src = createSourceFaviconUrl(item.sourceUrl || item.url || "", item.sourceFaviconUrl || item.faviconUrl || "", item.sourceDomain || item.domain || "");
    const fallbackSrc = createGenericFaviconUrl();
    if (!global.document?.createElement) return null;
    const image = global.document.createElement("img");
    image.className = className;
    image.src = src || fallbackSrc;
    image.dataset.fallbackSrc = fallbackSrc;
    image.alt = "";
    image.width = 16;
    image.height = 16;
    image.loading = "eager";
    image.decoding = "async";
    image.setAttribute("aria-hidden", "true");
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied === "true") return;
      image.dataset.fallbackApplied = "true";
      const failedSrc = image.src;
      image.src = fallbackSrc;
      persistGenericFaviconForItem(item, failedSrc).catch(() => {});
    });
    return image;
  }

  function isDomainExcluded(domain, excludedDomains = []) {
    const current = String(domain || "").toLowerCase();
    return excludedDomains.some((entry) => {
      const blocked = String(entry || "").trim().toLowerCase().replace(/^www\./, "");
      return blocked && (current === blocked || current.endsWith(`.${blocked}`));
    });
  }

  function formatDateTime(timestamp) {
    if (!timestamp) return global.MCP?.t ? global.MCP.t("dates.unknown") : "Unknown date";
    try {
      return new Intl.DateTimeFormat(global.MCP?.resolveDateLocale?.() || undefined, {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: global.MCP?.resolveLocalTimeZone?.()
      }).format(new Date(timestamp));
    } catch (error) {
      return new Date(timestamp).toLocaleString();
    }
  }

  function sortItems(items) {
    return [...items].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return (b.lastCopiedAt || b.createdAt || 0) - (a.lastCopiedAt || a.createdAt || 0);
    });
  }

  function filterItems(items, query) {
    const q = normalizeContent(query);
    if (!q) return sortItems(items);
    return sortItems(items).filter((item) => {
      const haystack = [
        item.content,
        item.preview,
        item.categoryName,
        item.sourceDomain,
        ...(item.tags || [])
      ].join(" ");
      return normalizeContent(haystack).includes(q);
    });
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function isMacPlatform() {
    const brands = navigator?.userAgentData?.platform || "";
    const platform = brands || navigator?.platform || navigator?.userAgent || "";
    return /mac|iphone|ipad|ipod/i.test(String(platform));
  }

  function normalizeShortcutKey(key = "") {
    const value = String(key || "").trim();
    if (!value) return "";
    const lower = value.toLowerCase();
    if (lower === " ") return "space";
    if (lower === "escape") return "esc";
    if (lower === "control") return "ctrl";
    if (lower === "command" || lower === "cmd" || lower === "os") return "meta";
    if (lower === "option") return "alt";
    if (lower.length === 1) return lower;
    return lower.replace(/\s+/g, "");
  }

  function shortcutModifierFromKey(key = "") {
    const normalized = normalizeShortcutKey(key);
    return ["ctrl", "meta", "alt", "shift"].includes(normalized) ? normalized : "";
  }

  function normalizeShortcutValue(shortcut = "ctrl_alt_c") {
    const value = String(shortcut || "ctrl_alt_c").trim();
    if (!value.startsWith("custom:")) return value || "ctrl_alt_c";
    const rawParts = value.slice(7).split("+").map((part) => part.trim()).filter(Boolean);
    const modifiers = [];
    let key = "";
    rawParts.forEach((part) => {
      const modifier = shortcutModifierFromKey(part);
      if (modifier) {
        if (!modifiers.includes(modifier)) modifiers.push(modifier);
        return;
      }
      key = normalizeShortcutKey(part);
    });
    return modifiers.length && key ? `custom:${[...modifiers, key].join("+")}` : "ctrl_alt_c";
  }

  function shortcutFromEvent(event, modifierOrder = []) {
    if (!event) return "";
    const key = normalizeShortcutKey(event.key || "");
    if (!key || ["ctrl", "shift", "alt", "meta"].includes(key)) return "";
    if (key === "esc" || key === "tab") return "";
    const pressed = [];
    if (event.ctrlKey) pressed.push("ctrl");
    if (event.metaKey) pressed.push("meta");
    if (event.altKey) pressed.push("alt");
    if (event.shiftKey) pressed.push("shift");
    const modifiers = [];
    [...modifierOrder, ...pressed].forEach((modifier) => {
      if (pressed.includes(modifier) && !modifiers.includes(modifier)) modifiers.push(modifier);
    });
    if (!modifiers.length) return "";
    return `custom:${[...modifiers, key].join("+")}`;
  }

  function shortcutParts(shortcut = "ctrl_alt_c") {
    const normalized = normalizeShortcutValue(shortcut);
    if (normalized === "ctrl_alt_c") {
      const order = isMacPlatform() ? ["ctrl", "meta", "c"] : ["ctrl", "alt", "c"];
      return { ctrl: true, meta: isMacPlatform(), alt: !isMacPlatform(), shift: false, key: "c", order, preset: normalized };
    }
    if (normalized === "ctrl_shift_c") {
      const order = isMacPlatform() ? ["shift", "meta", "c"] : ["shift", "ctrl", "c"];
      return { ctrl: !isMacPlatform(), meta: isMacPlatform(), alt: false, shift: true, key: "c", order, preset: normalized };
    }
    const parts = normalized.startsWith("custom:") ? normalized.slice(7).split("+") : [];
    return {
      ctrl: parts.includes("ctrl"),
      meta: parts.includes("meta"),
      alt: parts.includes("alt"),
      shift: parts.includes("shift"),
      key: parts.find((part) => !["ctrl", "meta", "alt", "shift"].includes(part)) || "",
      order: parts,
      preset: normalized
    };
  }

  function shortcutPartLabel(part = "") {
    const isMac = isMacPlatform();
    const normalized = normalizeShortcutKey(part);
    const modifierLabels = {
      ctrl: isMac ? "\u2303" : "Ctrl",
      meta: isMac ? "\u2318" : "Win",
      alt: isMac ? "\u2325" : "Alt",
      shift: "\u21e7"
    };
    return modifierLabels[normalized] || formatShortcutKey(normalized);
  }

  function formatShortcutKey(key = "") {
    const value = normalizeShortcutKey(key);
    const labels = {
      esc: "\u238b",
      space: "\u2423",
      arrowup: "\u2191",
      arrowdown: "\u2193",
      arrowleft: "\u2190",
      arrowright: "\u2192"
    };
    return labels[value] || (value.length === 1 ? value.toUpperCase() : value.replace(/^f(\d+)$/, "F$1"));
  }

  function shortcutLabel(shortcut = "ctrl_alt_c") {
    const normalized = normalizeShortcutValue(shortcut);
    const parts = shortcutParts(normalized);
    const labels = (parts.order || []).map(shortcutPartLabel).filter(Boolean);
    return labels.join(" + ") || shortcutLabel("ctrl_alt_c");
  }

  function eventMatchesShortcut(event, shortcut = "ctrl_alt_c") {
    if (!event) return false;
    const normalized = normalizeShortcutValue(shortcut);
    if (normalized === "ctrl_alt_c") {
      if (isMacPlatform()) return event.ctrlKey && event.metaKey && !event.shiftKey && !event.altKey && normalizeShortcutKey(event.key) === "c";
      return event.ctrlKey && !event.metaKey && event.altKey && !event.shiftKey && normalizeShortcutKey(event.key) === "c";
    }
    if (normalized === "ctrl_shift_c") {
      if (isMacPlatform()) return !event.ctrlKey && event.metaKey && !event.altKey && event.shiftKey && normalizeShortcutKey(event.key) === "c";
      return event.ctrlKey && !event.metaKey && !event.altKey && event.shiftKey && normalizeShortcutKey(event.key) === "c";
    }
    const parts = shortcutParts(normalized);
    return Boolean(parts.key)
      && event.ctrlKey === parts.ctrl
      && event.metaKey === parts.meta
      && event.altKey === parts.alt
      && event.shiftKey === parts.shift
      && normalizeShortcutKey(event.key) === parts.key;
  }
  function getCategoryPath(categoryId, categories = [], language = "en") {
    const byId = new Map(categories.map((category) => [category.id, category]));
    const category = byId.get(categoryId);
    if (!category) return "";
    const translateCategory = global.MCP?.translateCategoryName
      ? (value) => global.MCP.translateCategoryName(value, language)
      : (value) => value?.name || "";
    const parts = [translateCategory(category)];
    let parent = byId.get(category.parentId);
    while (parent) {
      parts.unshift(translateCategory(parent));
      parent = byId.get(parent.parentId);
    }
    return parts.join(" > ");
  }

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

  function applyThemeSettings(settings = {}, root = global.document?.documentElement) {
    if (!root) return;
    const accent = normalizeHexColor(settings.accentColor || "#e50914");
    const requestedTheme = settings.theme || "system";
    const resolvedTheme = resolveTheme(requestedTheme);
    root.dataset.theme = requestedTheme;
    root.dataset.resolvedTheme = resolvedTheme;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-rgb", hexToRgbParts(accent));
    root.style.colorScheme = resolvedTheme;
    root.dataset.themeReady = "true";
    root.removeAttribute("data-theme-pending");
    cacheThemeSettings(settings);
  }

  function createCategoryItemCountMap(categories = [], items = []) {
    const childrenByParent = new Map();
    const directCounts = new Map();
    let favoriteCount = 0;
    categories.forEach((category) => {
      const parentId = category.parentId || "";
      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
      childrenByParent.get(parentId).push(category.id);
      directCounts.set(category.id, 0);
    });
    items.forEach((item) => {
      if (item?.isFavorite) favoriteCount += 1;
      const categoryId = item?.categoryId;
      if (categoryId) directCounts.set(categoryId, (directCounts.get(categoryId) || 0) + 1);
    });
    const totals = new Map();
    const totalFor = (categoryId) => {
      if (totals.has(categoryId)) return totals.get(categoryId);
      const total = (directCounts.get(categoryId) || 0)
        + (childrenByParent.get(categoryId) || []).reduce((sum, childId) => sum + totalFor(childId), 0);
      totals.set(categoryId, total);
      return total;
    };
    categories.forEach((category) => totalFor(category.id));
    totals.set("favorites", favoriteCount);
    totals.set("image-favorites", favoriteCount);
    totals.set("dev-favorites", favoriteCount);
    totals.set("favorite", favoriteCount);
    return totals;
  }

  function appendCategoryCount(target, count, className = "category-count") {
    const value = Number(count || 0);
    if (!target || value <= 0) return null;
    const node = global.document?.createElement("span");
    if (!node) return null;
    node.className = className;
    node.textContent = `(${value})`;
    target.appendChild(node);
    return node;
  }

  function cacheThemeSettings(settings = {}) {
    try {
      if (global.location?.protocol !== "chrome-extension:") return;
      const value = {
        theme: settings.theme || "system",
        accentColor: normalizeHexColor(settings.accentColor || "#e50914")
      };
      global.localStorage?.setItem("ucp_theme_boot_v1", JSON.stringify(value));
    } catch (error) {
      // Best-effort cache only; theme application itself already succeeded.
    }
  }

  global.MCP = Object.assign(global.MCP || {}, {
    createId,
    normalizeContent,
    createPreview,
    getDomain,
    createSourceFaviconUrl,
    createSourceFaviconImage,
    isDomainExcluded,
    formatDateTime,
    sortItems,
    filterItems,
    escapeRegExp,
    getCategoryPath,
    isMacPlatform,
    normalizeShortcutValue,
    shortcutModifierFromKey,
    shortcutFromEvent,
    shortcutPartLabel,
    eventMatchesShortcut,
    shortcutLabel,
    normalizeHexColor,
    hexToRgbParts,
    resolveTheme,
    applyThemeSettings,
    cacheThemeSettings,
    createCategoryItemCountMap,
    appendCategoryCount
  });
})(globalThis);
