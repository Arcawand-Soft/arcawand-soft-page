(() => {
  const COPY = {
    en: {
      badge: "Launch price",
      oldPrice: "$69",
      currentPrice: "$49",
      lifetime: "Lifetime",
      note: "Limited launch offer. One payment, lifetime access."
    },
    fr: {
      badge: "Prix de lancement",
      oldPrice: "$69",
      currentPrice: "$49",
      lifetime: "\u00c0 vie",
      note: "Offre de lancement limit\u00e9e. Un paiement, acc\u00e8s \u00e0 vie."
    },
    es: {
      badge: "Precio de lanzamiento",
      oldPrice: "$69",
      currentPrice: "$49",
      lifetime: "De por vida",
      note: "Oferta de lanzamiento limitada. Un pago, acceso de por vida."
    },
    it: {
      badge: "Prezzo di lancio",
      oldPrice: "$69",
      currentPrice: "$49",
      lifetime: "A vita",
      note: "Offerta di lancio limitata. Un pagamento, accesso a vita."
    },
    de: {
      badge: "Einf\u00fchrungspreis",
      oldPrice: "$69",
      currentPrice: "$49",
      lifetime: "Lebenslang",
      note: "Begrenztes Einf\u00fchrungsangebot. Eine Zahlung, lebenslanger Zugriff."
    }
  };

  function currentLang() {
    const lang = window.__ARCAWAND_LANG__ || document.documentElement.lang || localStorage.getItem("ucp-lang") || "en";
    return COPY[lang] ? lang : "en";
  }

  function findProPriceBlock(pricingSection) {
    const priceNodes = Array.from(pricingSection.querySelectorAll("span"))
      .filter((node) => !node.closest(".ucp-launch-pricing"))
      .filter((node) => /\$?\s*49|49\s*\$/.test((node.textContent || "").trim()));

    return priceNodes
      .map((node) => node.parentElement)
      .find((node) => node && !node.querySelector(".ucp-launch-pricing"));
  }

  function patchLaunchPricing() {
    const pricingSection = document.getElementById("pricing");
    if (!pricingSection || pricingSection.dataset.launchPricingPatched === "true") return Boolean(pricingSection);

    const priceBlock = findProPriceBlock(pricingSection);
    if (!priceBlock) return false;

    const copy = COPY[currentLang()];
    const launch = document.createElement("div");
    launch.className = "ucp-launch-pricing";
    launch.setAttribute("aria-label", `${copy.badge}: ${copy.currentPrice}`);
    launch.innerHTML = [
      `<span class="ucp-launch-pricing__badge">${copy.badge}</span>`,
      "<div class=\"ucp-launch-pricing__row\">",
      `<span class="ucp-launch-pricing__old">${copy.oldPrice}</span>`,
      `<span class="ucp-launch-pricing__current">${copy.currentPrice}</span>`,
      `<span class="ucp-launch-pricing__period">${copy.lifetime}</span>`,
      "</div>",
      `<span class="ucp-launch-pricing__note">${copy.note}</span>`
    ].join("");

    priceBlock.replaceChildren(launch);
    pricingSection.dataset.launchPricingPatched = "true";
    return true;
  }

  if (!patchLaunchPricing()) {
    const observer = new MutationObserver(() => {
      if (patchLaunchPricing()) observer.disconnect();
    });
    observer.observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
    window.addEventListener("load", patchLaunchPricing, { once: true });
  }
})();
