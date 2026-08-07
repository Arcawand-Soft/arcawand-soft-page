(() => {
  "use strict";

  const header = document.querySelector(".ucp-landing-header");
  const nav = document.querySelector(".ucp-landing-nav");
  const navToggle = document.querySelector(".ucp-nav-toggle");
  const languageMenu = document.querySelector(".arcawand-product-language-menu");
  const languageButton = languageMenu?.querySelector(".language-menu-button");

  function setHeaderState() {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function closeNavigation() {
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }

  function closeLanguageMenu() {
    languageMenu?.classList.remove("is-open");
    languageButton?.setAttribute("aria-expanded", "false");
  }

  navToggle?.addEventListener("click", () => {
    const willOpen = !nav?.classList.contains("is-open");
    closeLanguageMenu();
    nav?.classList.toggle("is-open", willOpen);
    navToggle.setAttribute("aria-expanded", String(willOpen));
  });

  languageButton?.addEventListener("click", () => {
    const willOpen = !languageMenu.classList.contains("is-open");
    closeNavigation();
    languageMenu.classList.toggle("is-open", willOpen);
    languageButton.setAttribute("aria-expanded", String(willOpen));
  });

  languageMenu?.querySelectorAll(".language-menu-option").forEach((option) => {
    option.addEventListener("click", () => {
      const language = option.dataset.lang;
      const destination = option.dataset.targetUrl;
      try {
        localStorage.setItem("arcawand-lang", language);
        localStorage.setItem("ucp-lang", language);
      } catch (_) {
        // Navigation still works when storage is unavailable.
      }
      if (destination) window.location.assign(destination);
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".ucp-landing-nav, .ucp-nav-toggle")) closeNavigation();
    if (!event.target.closest(".arcawand-product-language-menu")) closeLanguageMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeNavigation();
    closeLanguageMenu();
  });

  document.querySelectorAll(".ucp-faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".ucp-faq-item[open]").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.animate(
          [
            { opacity: .35, transform: "translateY(18px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 520, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
        );
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: .08 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });
})();
