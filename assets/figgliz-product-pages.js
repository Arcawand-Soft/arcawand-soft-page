(() => {
  const supportedLangs = ["en", "fr", "es", "it", "de"];
  const labels = {
    en: { presentation: "Presentation", faq: "FAQ", privacy: "Privacy policy", terms: "Terms of use" },
    fr: { presentation: "Présentation", faq: "FAQ", privacy: "Politique de confidentialité", terms: "CGU" },
    es: { presentation: "Presentación", faq: "FAQ", privacy: "Política de privacidad", terms: "Términos de uso" },
    it: { presentation: "Presentazione", faq: "FAQ", privacy: "Informativa privacy", terms: "Termini d'uso" },
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
    en: { presentation: "https://arcawand-soft.com/figgliz/", faq: "https://arcawand-soft.com/figgliz/faq/", privacy: "https://arcawand-soft.com/figgliz/privacy/", terms: "https://arcawand-soft.com/figgliz/terms/" },
    fr: { presentation: "https://arcawand-soft.com/fr/figgliz/", faq: "https://arcawand-soft.com/fr/figgliz/faq/", privacy: "https://arcawand-soft.com/fr/figgliz/privacy/", terms: "https://arcawand-soft.com/fr/figgliz/terms/" },
    es: { presentation: "https://arcawand-soft.com/es/figgliz/", faq: "https://arcawand-soft.com/es/figgliz/faq/", privacy: "https://arcawand-soft.com/es/figgliz/privacy/", terms: "https://arcawand-soft.com/es/figgliz/terms/" },
    it: { presentation: "https://arcawand-soft.com/it/figgliz/", faq: "https://arcawand-soft.com/it/figgliz/faq/", privacy: "https://arcawand-soft.com/it/figgliz/privacy/", terms: "https://arcawand-soft.com/it/figgliz/terms/" },
    de: { presentation: "https://arcawand-soft.com/de/figgliz/", faq: "https://arcawand-soft.com/de/figgliz/faq/", privacy: "https://arcawand-soft.com/de/figgliz/privacy/", terms: "https://arcawand-soft.com/de/figgliz/terms/" }
  };

  function getLangFromPath() {
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    return supportedLangs.includes(first) ? first : "en";
  }

  function getProductPage() {
    const path = window.location.pathname;
    if (path.includes("/faq")) return "faq";
    if (path.includes("/privacy")) return "privacy";
    if (path.includes("/terms")) return "terms";
    return "presentation";
  }

  function closeLanguageMenus() {
    document.querySelectorAll(".language-menu.is-open").forEach((menu) => {
      menu.classList.remove("is-open");
      menu.querySelector(".language-menu-button")?.setAttribute("aria-expanded", "false");
    });
  }

  function setupLanguageMenu() {
    const menu = document.querySelector(".arcawand-product-language-menu");
    if (!menu || menu.dataset.languageMenuReady === "true") return;
    menu.dataset.languageMenuReady = "true";
    const button = menu.querySelector(".language-menu-button");
    const panel = menu.querySelector(".language-menu-panel");
    const lang = getLangFromPath();
    const languageLabel = languageButtonLabels[lang] || languageButtonLabels.en;
    button?.setAttribute("aria-label", languageLabel);
    panel?.setAttribute("aria-label", languageLabel);

    button?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = !menu.classList.contains("is-open");
      closeLanguageMenus();
      menu.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });

    panel?.addEventListener("click", (event) => {
      event.stopPropagation();
      const option = event.target.closest("[data-lang]");
      if (!option) return;
      event.preventDefault();
      const next = option.dataset.lang;
      const page = getProductPage();
      try {
        localStorage.setItem("arcawand-lang", next);
        localStorage.setItem("ucp-lang", next);
      } catch (error) {}
      window.location.href = routes[next]?.[page] || routes.en.presentation;
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".arcawand-product-language-menu")) closeLanguageMenus();
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLanguageMenus();
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

  function init() {
    const lang = getLangFromPath();
    document.documentElement.lang = lang;
    setupLanguageMenu();
    setupProductNav();
    setupProductHeaderScroll();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
