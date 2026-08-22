(function initPremiumPricing(global) {
  const API_BASE = "https://api.arcawand-soft.com";
  const CATALOG = "ultimate-clipboard-pro";
  const CURRENCY_KEY = "premiumCheckoutCurrency";
  const DETECTION_KEY = "premiumCheckoutCurrencyDetection";
  const PRICE_CACHE_KEY = "premiumCheckoutPriceCache";
  const DETECTION_TTL_MS = 24 * 60 * 60 * 1000;
  const PRICE_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
  const PRICE_CACHE_STALE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
  const SUPPORTED_CURRENCIES = Object.freeze([
    "AED", "ALL", "AMD", "AUD", "AWG", "AZN", "BAM", "BDT", "BIF", "BMD", "BND", "BOB",
    "BRL", "BSD", "BWP", "BZD", "CAD", "CHF", "CLP", "CNY", "CRC", "CZK", "DJF", "DKK",
    "DOP", "EGP", "ETB", "EUR", "FJD", "GBP", "GEL", "GMD", "GNF", "GTQ", "GYD", "HKD",
    "HNL", "HUF", "IDR", "ILS", "INR", "JPY", "KMF", "KRW", "KZT", "LKR", "LRD", "LSL",
    "MAD", "MGA", "MKD", "MOP", "MUR", "MVR", "MWK", "MXN", "MYR", "NGN", "NOK", "NPR",
    "NZD", "PEN", "PGK", "PHP", "PLN", "PYG", "QAR", "RON", "RSD", "RWF", "SAR", "SBD",
    "SCR", "SEK", "SGD", "SZL", "THB", "TOP", "TRY", "TWD", "TZS", "USD", "UYU", "VND",
    "VUV", "WST", "XAF", "XOF", "XPF", "ZAR", "ZMW"
  ]);
  const PRIORITY_CURRENCIES = Object.freeze([
    "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL", "MXN", "SGD",
    "AED", "SAR", "SEK", "NOK", "DKK", "PLN", "RON", "TRY", "HKD", "NZD", "KRW", "ZAR"
  ]);
  const CURRENCY_BY_REGION = Object.freeze({
    AT: "EUR", BE: "EUR", CY: "EUR", DE: "EUR", EE: "EUR", ES: "EUR", FI: "EUR", FR: "EUR",
    GR: "EUR", HR: "EUR", IE: "EUR", IT: "EUR", LT: "EUR", LU: "EUR", LV: "EUR", MT: "EUR",
    NL: "EUR", PT: "EUR", SI: "EUR", SK: "EUR", US: "USD", GB: "GBP", UK: "GBP", AU: "AUD",
    CA: "CAD", CH: "CHF", JP: "JPY", SG: "SGD", NZ: "NZD", SE: "SEK", NO: "NOK", DK: "DKK",
    PL: "PLN", RO: "RON", BR: "BRL", MX: "MXN", IN: "INR", CN: "CNY", KR: "KRW", TR: "TRY",
    AE: "AED", SA: "SAR", UY: "UYU", AL: "ALL", AM: "AMD", AW: "AWG", AZ: "AZN", BS: "BSD",
    BD: "BDT", BZ: "BZD", BM: "BMD", BO: "BOB", BA: "BAM", BW: "BWP", BN: "BND", CL: "CLP",
    CR: "CRC", CZ: "CZK", DO: "DOP", EG: "EGP", ET: "ETB", FJ: "FJD", GM: "GMD", GE: "GEL",
    GT: "GTQ", GY: "GYD", HN: "HNL", HK: "HKD", HU: "HUF", ID: "IDR", IL: "ILS", KZ: "KZT",
    LS: "LSL", LR: "LRD", MO: "MOP", MK: "MKD", MW: "MWK", MY: "MYR", MV: "MVR", MU: "MUR",
    MA: "MAD", NP: "NPR", TW: "TWD", NG: "NGN", PG: "PGK", PE: "PEN", PH: "PHP", QA: "QAR",
    WS: "WST", RS: "RSD", SC: "SCR", SB: "SBD", ZA: "ZAR", LK: "LKR", SZ: "SZL", TZ: "TZS",
    TH: "THB", TO: "TOP", ZM: "ZMW"
  });
  const REGION_BY_TIMEZONE = Object.freeze({
    "Europe/Paris": "FR", "Europe/Brussels": "BE", "Europe/Berlin": "DE", "Europe/Madrid": "ES",
    "Europe/Rome": "IT", "Europe/Amsterdam": "NL", "Europe/Lisbon": "PT", "Europe/Warsaw": "PL",
    "Europe/Bucharest": "RO", "Europe/London": "GB", "Europe/Zurich": "CH", "Europe/Stockholm": "SE",
    "Europe/Oslo": "NO", "Europe/Copenhagen": "DK", "Europe/Istanbul": "TR", "America/New_York": "US",
    "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US", "America/Toronto": "CA",
    "America/Vancouver": "CA", "America/Mexico_City": "MX", "America/Sao_Paulo": "BR",
    "America/Montevideo": "UY", "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Shanghai": "CN",
    "Asia/Hong_Kong": "HK", "Asia/Singapore": "SG", "Asia/Kolkata": "IN", "Asia/Dubai": "AE",
    "Asia/Riyadh": "SA", "Asia/Bangkok": "TH", "Asia/Taipei": "TW", "Australia/Sydney": "AU",
    "Australia/Melbourne": "AU", "Pacific/Auckland": "NZ", "Africa/Johannesburg": "ZA",
    "Africa/Casablanca": "MA"
  });
  const DEFAULT_REGION_BY_LANGUAGE = Object.freeze({
    en: "US", fr: "FR", es: "ES", it: "IT", de: "DE", ro: "RO", pt: "PT", ar: "AE", zh: "CN",
    ja: "JP", ru: "RU", nl: "NL", pl: "PL", tr: "TR", ko: "KR", hi: "IN"
  });
  const COPY = Object.freeze({
    en: { priceIn: "Price in {currency}", currency: "Currency", loading: "Updating price" },
    fr: { priceIn: "Prix en {currency}", currency: "Devise", loading: "Mise à jour du prix" },
    es: { priceIn: "Precio en {currency}", currency: "Divisa", loading: "Actualizando el precio" },
    it: { priceIn: "Prezzo in {currency}", currency: "Valuta", loading: "Aggiornamento del prezzo" },
    de: { priceIn: "Preis in {currency}", currency: "Währung", loading: "Preis wird aktualisiert" },
    ro: { priceIn: "Preț în {currency}", currency: "Monedă", loading: "Se actualizează prețul" },
    pt: { priceIn: "Preço em {currency}", currency: "Moeda", loading: "A atualizar o preço" },
    ar: { priceIn: "السعر بـ {currency}", currency: "العملة", loading: "جاري تحديث السعر" },
    zh: { priceIn: "{currency} 价格", currency: "货币", loading: "正在更新价格" },
    ja: { priceIn: "{currency} での価格", currency: "通貨", loading: "価格を更新中" },
    ru: { priceIn: "Цена в {currency}", currency: "Валюта", loading: "Обновляем цену" },
    nl: { priceIn: "Prijs in {currency}", currency: "Valuta", loading: "Prijs bijwerken" },
    pl: { priceIn: "Cena w {currency}", currency: "Waluta", loading: "Aktualizacja ceny" },
    tr: { priceIn: "{currency} cinsinden fiyat", currency: "Para birimi", loading: "Fiyat güncelleniyor" },
    ko: { priceIn: "{currency} 가격", currency: "통화", loading: "가격 업데이트 중" },
    hi: { priceIn: "{currency} में कीमत", currency: "मुद्रा", loading: "कीमत अपडेट हो रही है" }
  });

  function normalizeLanguage(value) {
    const language = String(value || "en").toLowerCase().split(/[-_]/)[0];
    return COPY[language] ? language : "en";
  }

  function normalizeCurrency(value) {
    const currency = String(value || "").trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    return SUPPORTED_CURRENCIES.includes(currency) ? currency : "EUR";
  }

  function optionalCurrency(value) {
    const currency = String(value || "").trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    return SUPPORTED_CURRENCIES.includes(currency) ? currency : "";
  }

  function browserLocale(language) {
    const preferred = Array.isArray(navigator.languages) && navigator.languages[0]
      ? navigator.languages[0]
      : navigator.language;
    return String(preferred || language || "en").replace(/_/g, "-").slice(0, 32);
  }

  function extractRegion(locale) {
    try {
      return String(new Intl.Locale(String(locale || "")).maximize().region || "").toUpperCase();
    } catch {
      return String(locale || "").match(/[-_]([A-Za-z]{2})(?:$|[-_])/)?.[1]?.toUpperCase() || "";
    }
  }

  function detectCurrency(language, geo = null) {
    const scores = new Map();
    const add = (currency, score) => {
      const normalized = optionalCurrency(currency);
      if (normalized) scores.set(normalized, (scores.get(normalized) || 0) + score);
    };
    add(CURRENCY_BY_REGION[DEFAULT_REGION_BY_LANGUAGE[normalizeLanguage(language)]], 40);
    add(geo?.currency, 10);
    add(CURRENCY_BY_REGION[String(geo?.country || "").toUpperCase()], 8);
    const locales = [
      ...(Array.isArray(navigator.languages) ? navigator.languages : []),
      navigator.language,
      browserLocale(language)
    ].filter(Boolean);
    locales.forEach((locale, index) => add(CURRENCY_BY_REGION[extractRegion(locale)], index === 0 ? 5 : 2));
    add(CURRENCY_BY_REGION[REGION_BY_TIMEZONE[Intl.DateTimeFormat().resolvedOptions().timeZone]], 4);
    if (!scores.size) add("EUR", 1);
    return [...scores].sort((left, right) => right[1] - left[1] || currencyRank(left[0]) - currencyRank(right[0]))[0][0];
  }

  function currencyRank(currency) {
    const preferred = PRIORITY_CURRENCIES.indexOf(currency);
    return preferred >= 0 ? preferred : PRIORITY_CURRENCIES.length + SUPPORTED_CURRENCIES.indexOf(currency);
  }

  function orderedCurrencies(preferred) {
    const first = normalizeCurrency(preferred);
    const seen = new Set();
    const ordered = [];
    for (const currency of [first, ...PRIORITY_CURRENCIES, ...[...SUPPORTED_CURRENCIES].sort()]) {
      if (!SUPPORTED_CURRENCIES.includes(currency) || seen.has(currency)) continue;
      seen.add(currency);
      ordered.push(currency);
    }
    return ordered;
  }

  function interpolate(template, currency) {
    return String(template || "").replace("{currency}", currency);
  }

  function flagUrl(currency) {
    return chrome.runtime.getURL(`assets/flags/currency/${currency.toLowerCase()}.png`);
  }

  function fallbackFlagUrl(currency) {
    const code = normalizeCurrency(currency);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="38" viewBox="0 0 52 38"><rect width="52" height="38" rx="8" fill="#343a46"/><text x="26" y="24" fill="#fff" font-family="Arial,sans-serif" font-size="13" font-weight="700" text-anchor="middle">${code}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  function createFlag(currency, className = "") {
    const image = document.createElement("img");
    image.className = className;
    image.dataset.currency = currency;
    image.src = flagUrl(currency);
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.addEventListener("error", () => {
      if (image.dataset.fallback === "true") return;
      image.dataset.fallback = "true";
      image.classList.add("is-fallback");
      image.src = fallbackFlagUrl(image.dataset.currency);
    });
    return image;
  }

  function createWidget(language, currency) {
    const copy = COPY[normalizeLanguage(language)];
    const widget = document.createElement("div");
    widget.className = "premium-currency";
    widget.dataset.premiumCurrencyControl = "";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "premium-currency-button";
    toggle.setAttribute("aria-haspopup", "listbox");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", copy.currency);
    const label = document.createElement("span");
    label.dataset.premiumCurrencyLabel = "";
    const caret = document.createElement("span");
    caret.className = "premium-currency-caret";
    caret.setAttribute("aria-hidden", "true");
    const caretIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    caretIcon.setAttribute("viewBox", "0 0 20 20");
    caretIcon.setAttribute("focusable", "false");
    const caretPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    caretPath.setAttribute("d", "M4.5 7.25 10 12.75l5.5-5.5");
    caretIcon.appendChild(caretPath);
    caret.appendChild(caretIcon);
    toggle.append(createFlag(currency, "premium-currency-flag"), label, caret);
    const menu = document.createElement("div");
    menu.className = "premium-currency-menu";
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", copy.currency);
    menu.hidden = true;
    widget.append(toggle, menu);
    return widget;
  }

  function updateWidget(controller) {
    const { root, widget, language, currency } = controller;
    const copy = COPY[normalizeLanguage(language)];
    root.dataset.premiumCurrency = currency;
    const label = widget.querySelector("[data-premium-currency-label]");
    if (label) label.textContent = interpolate(copy.priceIn, currency);
    const currentFlag = widget.querySelector(".premium-currency-flag");
    if (currentFlag) {
      currentFlag.dataset.currency = currency;
      delete currentFlag.dataset.fallback;
      currentFlag.src = flagUrl(currency);
      currentFlag.classList.remove("is-fallback");
    }
    const menu = widget.querySelector(".premium-currency-menu");
    menu.replaceChildren(...orderedCurrencies(currency).map((code) => {
      const option = document.createElement("button");
      option.type = "button";
      option.setAttribute("role", "option");
      option.dataset.premiumCurrencyOption = code;
      option.setAttribute("aria-selected", String(code === currency));
      const strong = document.createElement("strong");
      strong.textContent = code;
      option.append(createFlag(code), strong);
      return option;
    }));
    renderFreePrice(controller);
  }

  async function storageGet(key) {
    try {
      const result = await chrome.storage.local.get(key);
      return result?.[key];
    } catch {
      return null;
    }
  }

  async function storageSet(value) {
    try {
      await chrome.storage.local.set(value);
    } catch {
      // Pricing remains functional without its optional local cache.
    }
  }

  async function fetchGeo() {
    const cached = await storageGet(DETECTION_KEY);
    if (cached?.savedAt && Date.now() - Number(cached.savedAt) < DETECTION_TTL_MS) return cached;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    try {
      const response = await fetch("https://ipapi.co/json/", { cache: "no-store", signal: controller.signal });
      const data = await response.json();
      if (!response.ok) return null;
      const clean = {
        country: String(data.country_code || data.country || "").toUpperCase().slice(0, 3),
        currency: optionalCurrency(data.currency || data.currency_code),
        savedAt: Date.now()
      };
      await storageSet({ [DETECTION_KEY]: clean });
      return clean;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  function cacheId(currency, locale) {
    return `${CATALOG}:${normalizeCurrency(currency)}:${String(locale || "en").replace(/[^A-Za-z0-9-]/g, "")}`;
  }

  async function readCachedPrice(currency, locale) {
    const cache = await storageGet(PRICE_CACHE_KEY);
    const entry = cache?.[cacheId(currency, locale)];
    if (!entry?.price?.formatted || !entry.savedAt) return null;
    const age = Date.now() - Number(entry.savedAt);
    if (!Number.isFinite(age) || age > PRICE_CACHE_STALE_TTL_MS) return null;
    return { ...entry, fresh: age <= PRICE_CACHE_TTL_MS };
  }

  async function writeCachedPrice(currency, locale, data) {
    const cache = await storageGet(PRICE_CACHE_KEY) || {};
    cache[cacheId(currency, locale)] = {
      currency: normalizeCurrency(data.currency || currency),
      price: data.prices?.pro?.lifetime,
      savedAt: Date.now()
    };
    const retained = Object.fromEntries(Object.entries(cache)
      .sort((left, right) => Number(right[1]?.savedAt || 0) - Number(left[1]?.savedAt || 0))
      .slice(0, 120));
    await storageSet({ [PRICE_CACHE_KEY]: retained });
  }

  function renderFreePrice(controller) {
    const paidDensity = controller.root.querySelector("[data-premium-lifetime-price]")?.dataset.priceDensity;
    controller.root.querySelectorAll("[data-premium-free-price]").forEach((node) => {
      const amount = document.createElement("span");
      amount.className = "premium-free-price-amount";
      amount.textContent = "0";
      const currency = document.createElement("span");
      currency.className = "premium-free-price-currency";
      currency.textContent = controller.currency;
      node.replaceChildren(amount, document.createTextNode(" "), currency);
      node.dataset.priceCurrency = controller.currency;
      node.dataset.priceDensity = paidDensity || priceDensity("0", controller.currency);
    });
  }

  function syncFreePriceDensity(controller, density) {
    controller.root.querySelectorAll("[data-premium-free-price]").forEach((node) => {
      node.dataset.priceDensity = density;
    });
  }

  function renderPrice(controller, price) {
    if (!price?.formatted || !controller.root.isConnected) return;
    const parts = formatPriceParts(price, browserLocale(controller.language));
    const density = priceDensity(parts.amount, parts.currency);
    controller.root.querySelectorAll("[data-premium-lifetime-price]").forEach((node) => {
      const amount = document.createElement("span");
      amount.className = "premium-price-amount";
      amount.textContent = parts.amount;
      const currency = document.createElement("span");
      currency.className = "premium-price-currency";
      currency.textContent = parts.currency;
      node.replaceChildren(amount);
      if (parts.currency) node.append(currency);
      node.dataset.priceDensity = density;
      node.dataset.priceCurrency = controller.currency;
      node.removeAttribute("aria-busy");
    });
    syncFreePriceDensity(controller, density);
  }

  function formatPriceParts(price, locale) {
    const numericAmount = Number(price?.amount);
    const currencyCode = normalizeCurrency(price?.currency || "");
    if (!Number.isFinite(numericAmount)) return { amount: String(price?.formatted || ""), currency: "" };
    try {
      const parts = new Intl.NumberFormat(locale || "en", {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "code",
        maximumFractionDigits: ["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "VND", "VUV", "XAF", "XOF", "XPF"].includes(currencyCode) ? 0 : 2,
        minimumFractionDigits: ["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "VND", "VUV", "XAF", "XOF", "XPF"].includes(currencyCode) ? 0 : 2
      }).formatToParts(numericAmount);
      return {
        amount: parts.filter((part) => part.type !== "currency" && part.type !== "literal").map((part) => part.value).join(""),
        currency: parts.find((part) => part.type === "currency")?.value || currencyCode
      };
    } catch {
      return { amount: String(numericAmount), currency: currencyCode };
    }
  }

  function priceDensity(amount, currency) {
    const digits = String(amount || "").replace(/\D/g, "").length;
    if (digits >= 7) return "tight";
    if (digits >= 5 || String(currency || "").length >= 3) return "compact";
    return "normal";
  }

  function renderPlanState(controller) {
    const card = controller.root.querySelector("[data-premium-plans] .is-pro");
    const freeCard = controller.root.querySelector("[data-premium-plans] .is-free");
    const action = controller.root.querySelector("[data-premium-checkout]");
    if (!card || !freeCard || !action) return;
    let freeStatus = freeCard.querySelector("[data-premium-free-status]");
    if (!freeStatus) {
      freeStatus = document.createElement("div");
      freeStatus.className = "premium-plan-free-status";
      freeStatus.dataset.premiumFreeStatus = "";
      freeCard.appendChild(freeStatus);
    }
    freeStatus.classList.toggle("is-placeholder", controller.isPro);
    freeStatus.toggleAttribute("aria-hidden", controller.isPro);
    freeStatus.textContent = controller.isPro ? "" : controller.currentOffer;
    card.classList.toggle("is-current", controller.isPro);
    action.classList.add("premium-plan-action");
    action.disabled = controller.isPro;
    action.setAttribute("aria-disabled", String(controller.isPro));
    action.textContent = controller.isPro ? controller.currentOffer : controller.chooseOffer;
    card.appendChild(action);
  }

  function renderStaticPrices(controller) {
    controller.root.querySelectorAll("[data-premium-lifetime-price]").forEach((node) => {
      if (node.querySelector(".premium-price-amount")) return;
      const text = String(node.textContent || "").trim();
      const match = text.match(/^([€$£¥₹])\s*(.+)$/) || text.match(/^(.+?)\s*([A-Z]{3}|[€$£¥₹])$/);
      if (!match) return;
      const prefixCurrency = /^[€$£¥₹]$/.test(match[1]);
      const amountText = prefixCurrency ? match[2] : match[1];
      const currencyText = prefixCurrency ? match[1] : match[2];
      const amount = document.createElement("span");
      amount.className = "premium-price-amount";
      amount.textContent = amountText.trim();
      const currency = document.createElement("span");
      currency.className = "premium-price-currency";
      currency.textContent = currencyText.trim();
      node.replaceChildren(amount, currency);
      node.dataset.priceDensity = priceDensity(amount.textContent, currency.textContent);
    });
  }

  function setLoading(controller, loading) {
    const copy = COPY[normalizeLanguage(controller.language)];
    controller.widget.classList.toggle("is-loading", loading);
    controller.root.querySelectorAll("[data-premium-lifetime-price]").forEach((node) => {
      if (loading) {
        node.setAttribute("aria-busy", "true");
        node.setAttribute("aria-label", copy.loading);
      } else {
        node.removeAttribute("aria-busy");
        node.removeAttribute("aria-label");
      }
    });
  }

  async function refreshPrice(controller) {
    const requestId = ++controller.requestId;
    const locale = browserLocale(controller.language);
    const cached = await readCachedPrice(controller.currency, locale);
    if (requestId !== controller.requestId || !controller.root.isConnected) return;
    if (cached?.price) renderPrice(controller, cached.price);
    if (cached?.fresh) return;
    setLoading(controller, true);
    try {
      const response = await fetch(`${API_BASE}/billing/checkout-prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ catalog: CATALOG, currency: controller.currency, locale })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.prices?.pro?.lifetime?.formatted) throw new Error("price_unavailable");
      if (requestId !== controller.requestId || !controller.root.isConnected) return;
      controller.currency = normalizeCurrency(data.currency || controller.currency);
      updateWidget(controller);
      renderPrice(controller, data.prices.pro.lifetime);
      await writeCachedPrice(controller.currency, locale, data);
    } catch {
      // Keep the cached or static product price visible when the network is unavailable.
    } finally {
      if (requestId === controller.requestId) setLoading(controller, false);
    }
  }

  async function selectCurrency(controller, currency, persist = true) {
    const next = normalizeCurrency(currency);
    if (next === controller.currency && persist) return;
    controller.currency = next;
    updateWidget(controller);
    if (persist) await storageSet({ [CURRENCY_KEY]: next });
    await refreshPrice(controller);
  }

  function bindWidget(controller) {
    const toggle = controller.widget.querySelector(".premium-currency-button");
    const menu = controller.widget.querySelector(".premium-currency-menu");
    const caretPath = controller.widget.querySelector(".premium-currency-caret path");
    const setOpen = (open, focus = "") => {
      menu.hidden = !open;
      controller.widget.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      caretPath?.setAttribute("d", open ? "M4.5 12.75 10 7.25l5.5 5.5" : "M4.5 7.25 10 12.75l5.5-5.5");
      if (!open) return;
      const options = [...menu.querySelectorAll("[data-premium-currency-option]")];
      const target = focus === "last"
        ? options.at(-1)
        : options.find((option) => option.getAttribute("aria-selected") === "true") || options[0];
      target?.focus();
    };
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(menu.hidden);
    });
    toggle.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      setOpen(true, event.key === "ArrowUp" ? "last" : "selected");
    });
    menu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-premium-currency-option]");
      if (!option) return;
      setOpen(false);
      selectCurrency(controller, option.dataset.premiumCurrencyOption);
      toggle.focus();
    });
    menu.addEventListener("keydown", (event) => {
      const options = [...menu.querySelectorAll("[data-premium-currency-option]")];
      const activeElement = controller.widget.getRootNode()?.activeElement || document.activeElement;
      const index = options.indexOf(activeElement);
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        toggle.focus();
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : event.key === "ArrowDown"
            ? (index + 1 + options.length) % options.length
            : (index - 1 + options.length) % options.length;
      options[nextIndex]?.focus();
    });
    const closeMenu = (event) => {
      if (!controller.root.isConnected) {
        document.removeEventListener("click", closeMenu, true);
        return;
      }
      if (controller.widget.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("click", closeMenu, true);
    controller.destroy = () => {
      controller.requestId += 1;
      document.removeEventListener("click", closeMenu, true);
    };
  }

  async function mountPremiumPricing(root, options = {}) {
    if (!root) return null;
    root._premiumPricingController?.destroy?.();
    root.querySelector("[data-premium-currency-control]")?.remove();
    const language = normalizeLanguage(options.language || document.documentElement.lang);
    const initialCurrency = detectCurrency(language);
    const widget = createWidget(language, initialCurrency);
    const anchor = options.anchor || root.querySelector("[data-premium-plans]");
    if (options.currencyHost) options.currencyHost.appendChild(widget);
    else if (anchor?.parentNode) anchor.before(widget);
    else root.prepend(widget);
    const controller = {
      root,
      widget,
      language,
      currency: initialCurrency,
      requestId: 0,
      isPro: Boolean(options.isPro),
      chooseOffer: String(options.chooseOffer || "Choose this plan"),
      currentOffer: String(options.currentOffer || "Current plan")
    };
    root._premiumPricingController = controller;
    renderPlanState(controller);
    renderStaticPrices(controller);
    updateWidget(controller);
    bindWidget(controller);
    const stored = optionalCurrency(await storageGet(CURRENCY_KEY));
    if (stored) await selectCurrency(controller, stored, false);
    else {
      const recommended = detectCurrency(language, await fetchGeo());
      await selectCurrency(controller, recommended, false);
    }
    return controller;
  }

  function getPremiumCurrency(root) {
    return normalizeCurrency(root?._premiumPricingController?.currency || root?.dataset?.premiumCurrency || "EUR");
  }

  global.MCP = Object.assign(global.MCP || {}, {
    PREMIUM_CHECKOUT_CATALOG: CATALOG,
    PREMIUM_CURRENCIES: SUPPORTED_CURRENCIES,
    mountPremiumPricing,
    getPremiumCurrency
  });
})(globalThis);
