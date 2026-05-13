(() => {
  const supportedLangs = ["en", "fr", "es", "it", "de"];
  const labels = {
    en: { presentation: "Presentation", faq: "FAQ", privacy: "Privacy policy", terms: "Terms of use" },
    fr: { presentation: "Présentation", faq: "FAQ", privacy: "Politique de confidentialité", terms: "CGU" },
    es: { presentation: "Presentación", faq: "FAQ", privacy: "Política de privacidad", terms: "Términos de uso" },
    it: { presentation: "Presentazione", faq: "FAQ", privacy: "Informativa privacy", terms: "Termini d’uso" },
    de: { presentation: "Präsentation", faq: "FAQ", privacy: "Datenschutz", terms: "Nutzungsbedingungen" }
  };
  const languageButtonLabels = {
    en: "Change language",
    fr: "Changer de langue",
    es: "Cambiar idioma",
    it: "Cambia lingua",
    de: "Sprache wechseln"
  };
  const routes = {
    en: {
      presentation: "https://arcawand-soft.com/ultimate-clipboard-pro/",
      faq: "https://arcawand-soft.com/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/ultimate-clipboard-pro/terms/"
    },
    fr: {
      presentation: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/",
      faq: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/terms/"
    },
    es: {
      presentation: "https://arcawand-soft.com/es/ultimate-clipboard-pro/",
      faq: "https://arcawand-soft.com/es/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/es/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/es/ultimate-clipboard-pro/terms/"
    },
    it: {
      presentation: "https://arcawand-soft.com/it/ultimate-clipboard-pro/",
      faq: "https://arcawand-soft.com/it/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/it/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/it/ultimate-clipboard-pro/terms/"
    },
    de: {
      presentation: "https://arcawand-soft.com/de/ultimate-clipboard-pro/",
      faq: "https://arcawand-soft.com/de/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/de/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/de/ultimate-clipboard-pro/terms/"
    }
  };

  function getLangFromPath() {
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    return supportedLangs.includes(first) ? first : "en";
  }

  function getProductPage() {
    const path = window.location.pathname;
    if (path.includes("/ultimate-clipboard-pro/faq")) return "faq";
    if (path.includes("/ultimate-clipboard-pro/privacy")) return "privacy";
    if (path.includes("/ultimate-clipboard-pro/terms")) return "terms";
    return "presentation";
  }

  function setupLanguageMenu() {
    const menu = document.querySelector(".arcawand-product-language-menu");
    if (!menu) return;
    const button = menu.querySelector(".language-menu-button");
    const panel = menu.querySelector(".language-menu-panel");
    const lang = getLangFromPath();
    const languageLabel = languageButtonLabels[lang] || languageButtonLabels.en;
    if (button && !button.getAttribute("aria-label")) button.setAttribute("aria-label", languageLabel);
    if (panel && (!panel.getAttribute("aria-label") || panel.getAttribute("aria-label") === "Language")) {
      panel.setAttribute("aria-label", languageLabel);
    }
    const close = () => {
      menu.classList.remove("is-open");
      button?.setAttribute("aria-expanded", "false");
    };

    button?.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = !menu.classList.contains("is-open");
      document.querySelectorAll(".language-menu.is-open").forEach((node) => node.classList.remove("is-open"));
      menu.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });

    panel?.addEventListener("click", (event) => {
      const option = event.target.closest("[data-lang]");
      if (!option) return;
      const next = option.dataset.lang;
      const page = getProductPage();
      try {
        localStorage.setItem("arcawand-lang", next);
        localStorage.setItem("ucp-lang", next);
      } catch (error) {}
      window.location.href = routes[next]?.[page] || routes.en.presentation;
    });

    document.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function setupProductNav() {
    const lang = getLangFromPath();
    const page = getProductPage();
    document.querySelectorAll("[data-ucp-nav]").forEach((link) => {
      const key = link.dataset.ucpNav;
      link.textContent = labels[lang]?.[key] || labels.en[key] || link.textContent;
      if (key === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function setupProductHeaderScroll() {
    const mark = document.querySelector(".ucp-product-mark");
    const nav = document.querySelector(".ucp-product-nav");
    if (!mark || !nav) return;
    let ticking = false;
    const update = () => {
      const scrolled = window.scrollY > 36;
      document.body.classList.toggle("ucp-product-scrolled", scrolled);
      mark.classList.toggle("is-hidden", scrolled);
      ticking = false;
    };
    update();
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const lang = getLangFromPath();
    document.documentElement.lang = lang;
    setupLanguageMenu();
    setupProductNav();
    setupProductHeaderScroll();
  });
})();
