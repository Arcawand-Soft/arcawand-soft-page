(() => {
  const supportedLangs = ["en", "fr", "es", "it", "de"];
  const labels = {
    en: { presentation: "Presentation", faq: "FAQ", stats: "Statistics", privacy: "Privacy policy", terms: "Terms of use" },
    fr: { presentation: "Pr\u00e9sentation", faq: "FAQ", stats: "Statistiques", privacy: "Politique de confidentialité", terms: "CGU" },
    es: { presentation: "Presentaci\u00f3n", faq: "FAQ", stats: "Estad\u00edsticas", privacy: "Política de privacidad", terms: "Términos de uso" },
    it: { presentation: "Presentazione", faq: "FAQ", stats: "Statistiche", privacy: "Informativa privacy", terms: "Termini d'uso" },
    de: { presentation: "Pr\u00e4sentation", faq: "FAQ", stats: "Statistiken", privacy: "Datenschutz", terms: "Nutzungsbedingungen" }
  };
  const languageButtonLabels = {
    en: "Change language",
    fr: "Changer de langue",
    es: "Cambiar idioma",
    it: "Cambia lingua",
    de: "Sprache wechseln"
  };
  const routes = {
    en: { presentation: "https://arcawand-soft.com/figgliz/", faq: "https://arcawand-soft.com/figgliz/faq/", stats: "https://arcawand-soft.com/figgliz/stats/", privacy: "https://arcawand-soft.com/figgliz/privacy/", terms: "https://arcawand-soft.com/figgliz/terms/" },
    fr: { presentation: "https://arcawand-soft.com/fr/figgliz/", faq: "https://arcawand-soft.com/fr/figgliz/faq/", stats: "https://arcawand-soft.com/fr/figgliz/stats/", privacy: "https://arcawand-soft.com/fr/figgliz/privacy/", terms: "https://arcawand-soft.com/fr/figgliz/terms/" },
    es: { presentation: "https://arcawand-soft.com/es/figgliz/", faq: "https://arcawand-soft.com/es/figgliz/faq/", stats: "https://arcawand-soft.com/es/figgliz/stats/", privacy: "https://arcawand-soft.com/es/figgliz/privacy/", terms: "https://arcawand-soft.com/es/figgliz/terms/" },
    it: { presentation: "https://arcawand-soft.com/it/figgliz/", faq: "https://arcawand-soft.com/it/figgliz/faq/", stats: "https://arcawand-soft.com/it/figgliz/stats/", privacy: "https://arcawand-soft.com/it/figgliz/privacy/", terms: "https://arcawand-soft.com/it/figgliz/terms/" },
    de: { presentation: "https://arcawand-soft.com/de/figgliz/", faq: "https://arcawand-soft.com/de/figgliz/faq/", stats: "https://arcawand-soft.com/de/figgliz/stats/", privacy: "https://arcawand-soft.com/de/figgliz/privacy/", terms: "https://arcawand-soft.com/de/figgliz/terms/" }
  };

  function getLangFromPath() {
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    return supportedLangs.includes(first) ? first : "en";
  }

  function getProductPage() {
    const path = window.location.pathname;
    if (path.includes("/faq")) return "faq";
    if (path.includes("/stats")) return "stats";
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

  function setupPricingTabs() {
    document.querySelectorAll(".figgliz-plan-box").forEach((box) => {
      if (box.dataset.pricingTabsReady === "true") return;
      box.dataset.pricingTabsReady = "true";
      const tabs = Array.from(box.querySelectorAll("[data-plan-tab]"));
      if (!tabs.length) return;
      const setPlan = (plan) => {
        const beforeX = window.scrollX;
        const beforeY = window.scrollY;
        box.dataset.plan = plan;
        tabs.forEach((tab) => {
          tab.setAttribute("aria-selected", String(tab.dataset.planTab === plan));
        });
        window.requestAnimationFrame(() => window.scrollTo(beforeX, beforeY));
      };
      tabs.forEach((tab) => {
        tab.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          setPlan(tab.dataset.planTab || "monthly");
        });
      });
      setPlan(box.dataset.plan || "monthly");
    });
  }

  const statsMessages = {
    en: { ready: "Live counters refreshed from Figgliz.", error: "Statistics are temporarily unavailable." },
    fr: { ready: "Compteurs mis \u00e0 jour depuis Figgliz.", error: "Les statistiques sont temporairement indisponibles." },
    es: { ready: "Contadores actualizados desde Figgliz.", error: "Las estad\u00edsticas no est\u00e1n disponibles temporalmente." },
    it: { ready: "Contatori aggiornati da Figgliz.", error: "Le statistiche sono temporaneamente non disponibili." },
    de: { ready: "Z\u00e4hler von Figgliz aktualisiert.", error: "Statistiken sind vor\u00fcbergehend nicht verf\u00fcgbar." }
  };

  function setupStatsPage() {
    const root = document.querySelector("[data-figgliz-stats]");
    if (!root || root.dataset.statsReady === "true") return;
    root.dataset.statsReady = "true";
    const lang = getLangFromPath();
    const messages = statsMessages[lang] || statsMessages.en;
    const endpoint = root.dataset.statsEndpoint || "https://figgliz.arcawand-soft.com/stats.json";
    const status = root.querySelector("[data-figgliz-stat-status]");
    const updated = root.querySelector("[data-figgliz-stat-updated]");
    const format = new Intl.NumberFormat(lang);
    const formatDate = new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short" });
    const setValue = (key, value) => {
      const node = root.querySelector('[data-figgliz-stat="' + key + '"]');
      if (!node) return;
      const next = Number.isFinite(Number(value)) ? format.format(Math.max(0, Number(value))) : "--";
      if (node.textContent === next) return;
      node.textContent = next;
      node.animate?.([
        { transform: "translateY(5px)", opacity: 0.52 },
        { transform: "translateY(0)", opacity: 1 }
      ], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" });
    };
    const render = (payload = {}) => {
      const totals = payload.totals || {};
      const games = payload.games || {};
      setValue("discussions", totals.discussions);
      setValue("videoSessions", totals.videoSessions);
      setValue("gamesPlayed", totals.games);
      setValue("chess", games.chess);
      setValue("checkers", games.checkers);
      setValue("connect4", games.connect4);
      setValue("pingpong", games.pingpong);
      setValue("doublesnake", games.doublesnake);
      setValue("airhockey", games.airhockey);
      const stamp = payload.updatedAt || payload.startedAt;
      if (updated && stamp) updated.textContent = formatDate.format(new Date(stamp));
      if (status) {
        status.textContent = messages.ready;
        status.dataset.state = "ready";
      }
    };
    const refresh = async () => {
      try {
        const response = await fetch(endpoint, { cache: "no-store" });
        if (!response.ok) throw new Error("stats unavailable");
        render(await response.json());
      } catch (error) {
        if (status) {
          status.textContent = messages.error;
          status.dataset.state = "error";
        }
      }
    };
    refresh();
    window.setInterval(refresh, 30000);
  }

  function init() {
    const lang = getLangFromPath();
    document.documentElement.lang = lang;
    setupLanguageMenu();
    setupProductNav();
    setupProductHeaderScroll();
    setupPricingTabs();
    setupStatsPage();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
