const LANGUAGES = [
  { code: "en", dir: "", html: "en", short: "GB", name: "English" },
  { code: "fr", dir: "fr", html: "fr", short: "FR", name: "Français" },
  { code: "es", dir: "es", html: "es", short: "ES", name: "Español" },
  { code: "it", dir: "it", html: "it", short: "IT", name: "Italiano" },
  { code: "de", dir: "de", html: "de", short: "DE", name: "Deutsch" },
  { code: "ro", dir: "ro", html: "ro", short: "RO", name: "Română" },
  { code: "pt", dir: "pt", html: "pt", short: "PT", name: "Português" },
  { code: "ar", dir: "ar", html: "ar", short: "SA", name: "العربية", rtl: true },
  { code: "zh", dir: "zh", html: "zh", short: "CN", name: "中文" },
  { code: "ja", dir: "ja", html: "ja", short: "JP", name: "日本語" },
  { code: "ru", dir: "ru", html: "ru", short: "RU", name: "Русский" },
  { code: "nl", dir: "nl", html: "nl", short: "NL", name: "Nederlands" },
  { code: "pl", dir: "pl", html: "pl", short: "PL", name: "Polski" },
  { code: "tr", dir: "tr", html: "tr", short: "TR", name: "Türkçe" },
  { code: "ko", dir: "ko", html: "ko", short: "KR", name: "한국어" },
  { code: "hi", dir: "hi", html: "hi", short: "IN", name: "हिन्दी" }
];

const LANGUAGE_CODES = LANGUAGES.map((language) => language.code);

function languageByCode(code) {
  return LANGUAGES.find((language) => language.code === code) || LANGUAGES[0];
}

function localizedUrl(code, pageKey = "home") {
  const prefix = code === "en" ? "" : `${code}/`;
  const paths = {
    home: "",
    contact: "contact/",
    privacy: "privacy/",
    ucp: "ultimate-clipboard-pro/",
    ucpDemo: "ultimate-clipboard-pro/demo/",
    ucpFaq: "ultimate-clipboard-pro/faq/",
    ucpPrivacy: "ultimate-clipboard-pro/privacy/",
    ucpTerms: "ultimate-clipboard-pro/terms/",
    figgliz: "figgliz/",
    figglizFaq: "figgliz/faq/",
    figglizStats: "figgliz/stats/",
    figglizPrivacy: "figgliz/privacy/",
    figglizTerms: "figgliz/terms/"
  };
  return `https://arcawand-soft.com/${prefix}${paths[pageKey] || ""}`;
}

function localizedPath(code, pageKey = "home") {
  const url = localizedUrl(code, pageKey);
  const path = new URL(url).pathname.replace(/^\//, "");
  return path || "";
}

function languageMenu(current, pageKey, label = "Change language") {
  const currentLanguage = languageByCode(current);
  const options = LANGUAGES.map((language) => {
    const selected = language.code === current ? ' aria-selected="true"' : "";
    return `<button class="language-menu-option" type="button" role="option" data-lang="${language.code}" data-target-url="${localizedUrl(language.code, pageKey)}"${selected}><span class="language-code-badge" aria-hidden="true">${language.short}</span><span>${language.name}</span></button>`;
  }).join("");
  return `<div class="language-menu arcawand-product-language-menu" data-current-lang="${current}"><button class="language-menu-button" type="button" aria-label="${label}" aria-haspopup="listbox" aria-expanded="false"><span class="language-code-badge" aria-hidden="true">${currentLanguage.short}</span><span>${currentLanguage.name}</span><span class="language-menu-chevron" aria-hidden="true"></span></button><div class="language-menu-panel" role="listbox" aria-label="${label}">${options}</div></div>`;
}

module.exports = {
  LANGUAGES,
  LANGUAGE_CODES,
  languageByCode,
  languageMenu,
  localizedPath,
  localizedUrl
};
