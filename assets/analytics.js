(function () {
  const GA_ID = "G-5NLFMS9275";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  let analyticsStarted = false;
  const startAnalytics = () => {
    if (analyticsStarted) return;
    analyticsStarted = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      language: pageLanguage,
      page_type: pageType,
      transport_type: "beacon"
    });

    window.gtag("event", "page_context", {
      language: pageLanguage,
      page_type: pageType
    });
  };

  const getLanguage = () => {
    const path = window.location.pathname;
    const match = path.match(/^\/(fr|es|it|de)(\/|$)/);
    return match ? match[1] : "en";
  };

  const getPageType = () => {
    const path = window.location.pathname;
    if (path.includes("/ultimate-clipboard-pro")) return "product";
    if (path.includes("/contact")) return "contact";
    if (path.includes("/privacy")) return "privacy";
    return "home";
  };

  const pageLanguage = getLanguage();
  const pageType = getPageType();

  window.addEventListener("load", () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startAnalytics, { timeout: 2500 });
    } else {
      window.setTimeout(startAnalytics, 1200);
    }
  }, { once: true });

  const sendEvent = (name, params) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, {
      language: pageLanguage,
      page_type: pageType,
      ...params
    });
  };

  document.addEventListener("click", (event) => {
    const languageOption = event.target.closest("[data-lang]");
    if (languageOption) {
      sendEvent("click_language_selector", {
        selected_language: languageOption.getAttribute("data-lang")
      });
      return;
    }

    const carouselOpen = event.target.closest(".ucp-hero-carousel__image-button, .ucp-hero-carousel__expand");
    if (carouselOpen) {
      sendEvent("click_product_carousel_open", {
        product: "ultimate_clipboard_pro"
      });
      return;
    }

    const carouselPrev = event.target.closest(".ucp-hero-carousel__arrow--prev, .ucp-lightbox__arrow--prev");
    if (carouselPrev) {
      sendEvent("click_product_carousel_previous", {
        product: "ultimate_clipboard_pro"
      });
      return;
    }

    const carouselNext = event.target.closest(".ucp-hero-carousel__arrow--next, .ucp-lightbox__arrow--next");
    if (carouselNext) {
      sendEvent("click_product_carousel_next", {
        product: "ultimate_clipboard_pro"
      });
      return;
    }

    const faqTrigger = event.target.closest("[data-state][aria-controls], button");
    if (faqTrigger && /faq|item-/i.test(`${faqTrigger.getAttribute("aria-controls") || ""} ${faqTrigger.textContent || ""}`)) {
      sendEvent("click_faq_item", {
        item_text: (faqTrigger.textContent || "").trim().slice(0, 120)
      });
      return;
    }

    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.href || "";
    const text = (link.textContent || "").trim().slice(0, 120);

    if (href.includes("checkout.dodopayments.com")) {
      sendEvent("begin_checkout", {
        product: "ultimate_clipboard_pro",
        currency: "USD",
        value: 49,
        link_text: text
      });
      sendEvent("click_get_pro", {
        product: "ultimate_clipboard_pro",
        destination: "dodo_checkout",
        link_text: text
      });
      return;
    }

    if (href.startsWith("mailto:")) {
      sendEvent("click_contact", {
        destination: href.replace(/^mailto:/, ""),
        link_text: text
      });
      return;
    }

    if (/chrome|extension|webstore/i.test(href + " " + text)) {
      sendEvent("click_install_extension", {
        product: "ultimate_clipboard_pro",
        destination: href,
        link_text: text
      });
    }
  }, true);
})();
