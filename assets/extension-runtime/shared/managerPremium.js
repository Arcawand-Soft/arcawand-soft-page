(function initManagerPremium(global) {
  "use strict";

  function createManagerPremiumController(options = {}) {
    const {
      t = (key) => key,
      getSettings = () => ({}),
      getModal = () => null,
      openTextModal = () => {},
      captureModalReturn = () => null,
      rememberModalReturn = () => {},
      showToast = () => {},
      wireLogoLink = () => {},
      themedIconName = (name) => name,
      requestCheckout = async () => null,
      premiumApi = global.MCP || {}
    } = options;

    async function renderManagerProUpgradeModal(context = "pro") {
      rememberModalReturn(captureModalReturn());
      openTextModal("popup.proTitle", []);
      const card = getModal()?.querySelector(".manager-text-card");
      const content = getModal()?.querySelector("[data-role='manager-text-content']");
      if (!card || !content) return null;
      card.classList.add("is-pro-upgrade");
      renderManagerProModalBrand();

      const contextNode = createManagerProContextNode(context);
      const intro = document.createElement("p");
      intro.className = "manager-pro-intro";
      appendEmphasizedText(intro, t("popup.proIntro"));
      const pitch = document.createElement("section");
      pitch.className = "manager-pro-pitch";
      pitch.append(...[contextNode, intro].filter(Boolean));
      const plans = createManagerProPlanComparison();
      plans.dataset.premiumPlans = "";
      const actions = document.createElement("div");
      actions.className = "manager-pro-actions";
      const checkout = document.createElement("button");
      checkout.type = "button";
      checkout.className = "primary";
      checkout.dataset.premiumCheckout = "";
      checkout.textContent = t("license.chooseOffer");
      checkout.addEventListener("click", openManagerProCheckout);
      actions.appendChild(checkout);
      content.replaceChildren(pitch, plans, createManagerProUpgradeFooter(actions));
      getModal().hidden = false;

      premiumApi.mountPremiumPricing?.(getModal(), {
        language: getSettings()?.language || "en",
        anchor: plans,
        currencyHost: plans.querySelector(".manager-pro-plan-card.is-pro .manager-pro-plan-price"),
        isPro: Boolean(premiumApi.isProPlan?.(getSettings())),
        chooseOffer: t("license.chooseOffer"),
        currentOffer: t("license.currentOffer")
      });
      getModal().querySelector("[data-role='manager-text-close']")?.focus?.();
      return { opened: true };
    }

    async function openManagerProCheckout() {
      const response = await requestCheckout({
        currency: premiumApi.getPremiumCurrency?.(getModal()),
        language: getSettings()?.language || "en"
      }).catch(() => null);
      showToast(response?.ok ? t("license.checkoutOpened") : t("common.error"), response?.ok ? "success" : "error");
    }

    function createManagerProContextNode(context = "pro") {
      const resolved = resolveManagerProUpgradeContext(context);
      if (!resolved) return null;
      const text = t(resolved.key, resolved.params);
      if (!text) return null;
      const paragraph = document.createElement("p");
      paragraph.className = "manager-pro-context";
      appendEmphasizedText(paragraph, text);
      return paragraph;
    }

    function resolveManagerProUpgradeContext(context = "pro") {
      const value = typeof context === "string" ? { reason: context } : (context && typeof context === "object" && !("target" in context) ? context : {});
      const reason = value.reason || "pro";
      if (reason === "tool") {
        const localizedToolName = value.toolId ? t(`tools.${value.toolId}.title`) : "";
        const toolName = localizedToolName || value.toolName || "";
        if (toolName) return { key: "pro.context.tool", params: { tool: toolName } };
        return { key: "pro.context.allTools", params: {} };
      }
      const keys = {
        imageCapture: "pro.context.imageCapture",
        pageMarkdownCapture: "pro.context.pageMarkdownCapture",
        driveSync: "pro.context.driveSync",
        itemComposition: "pro.context.itemComposition",
        trashManagement: "pro.context.trashManagement",
        vault: "pro.context.vault",
        captureVersioning: "pro.context.captureVersioning",
        textLimit: "pro.context.textLimit",
        codeLimit: "pro.context.codeLimit",
        imageLimit: "pro.context.imageLimit",
        allTools: "pro.context.allTools"
      };
      return keys[reason] ? { key: keys[reason], params: {} } : null;
    }

    function appendEmphasizedText(node, text) {
      const parts = String(text || "").split("**");
      parts.forEach((part, index) => {
        if (!part) return;
        if (index % 2 === 0) {
          node.appendChild(document.createTextNode(part));
          return;
        }
        const strong = document.createElement("strong");
        strong.textContent = part;
        node.appendChild(strong);
      });
    }

    function renderManagerProModalBrand() {
      const title = getModal()?.querySelector("[data-role='manager-text-title']");
      if (!title) return;
      title.replaceChildren(createManagerProModalBrand());
    }

    function createManagerProModalBrand() {
      const brand = document.createElement("span");
      brand.className = "pro-modal-brand";
      const icon = createProModalAppIcon("../assets/icons/icon128.png", "../assets/icons/pro-icon.png");
      const copy = document.createElement("span");
      copy.className = "pro-modal-brand-copy";
      const name = document.createElement("strong");
      name.textContent = t("app.name");
      const signature = document.createElement("span");
      signature.className = "pro-modal-brand-signature";
      const by = document.createElement("span");
      by.textContent = t("brand.by");
      const logo = document.createElement("img");
      logo.src = "../assets/icons/Arcawand_Soft_Logo.png";
      logo.alt = "Arcawand Soft";
      wireLogoLink(logo);
      signature.append(by, logo);
      copy.append(name, signature);
      brand.append(icon, copy);
      return brand;
    }

    function createProModalAppIcon(iconSrc, badgeSrc) {
      const wrap = document.createElement("span");
      wrap.className = "pro-modal-app-icon-wrap";
      const icon = document.createElement("img");
      icon.className = "pro-modal-app-icon";
      icon.src = iconSrc;
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      const badge = document.createElement("span");
      badge.className = "brand-pro-badge";
      badge.setAttribute("aria-hidden", "true");
      const badgeIcon = document.createElement("img");
      badgeIcon.src = badgeSrc;
      badgeIcon.alt = "";
      badge.appendChild(badgeIcon);
      wrap.append(icon, badge);
      return wrap;
    }

    function createManagerProUpgradeFooter(actions) {
      const footer = document.createElement("div");
      footer.className = "manager-pro-upgrade-footer";
      const payment = document.createElement("img");
      payment.className = "manager-pro-payment-methods";
      payment.src = "../assets/icons/way-pay.png";
      payment.alt = "";
      payment.setAttribute("aria-hidden", "true");
      footer.append(payment, actions);
      return footer;
    }

    function createManagerProPlanComparison() {
      const wrap = document.createElement("div");
      wrap.className = "manager-pro-plans";
      wrap.append(
        createManagerProPlanCard("free", "pro.freeTitle", [
          ["text_icon.png", "pro.freeTextLimit"],
          ["dev.png", "pro.freeCodeLimit"],
          ["images_icon.png", "pro.freeImageLimit"],
          ["locker-darkmod.png", "pro.proVault", false],
          ["screen_full_page_png.png", "pro.proScreenshotCapture"],
          ["webpage-markdown.png", "pro.proMarkdownCapture", false],
          ["erase.png", "pro.proTrash", false],
          ["montage-lightmod.png", "pro.proMontage", false],
          ["versioning-darkmode.png", "pro.proVersioning", false],
          ["tootls.png", "pro.freeToolsLimit"],
          ["computer.png", "pro.freeLocalBackup"]
        ]),
        createManagerProPlanCard("pro", "pro.proTitle", [
          ["text_icon.png", "pro.proTextUnlimited"],
          ["dev.png", "pro.proCodeUnlimited"],
          ["images_icon.png", "pro.proImageUnlimited"],
          ["locker-darkmod.png", "pro.proVault"],
          ["screen_full_page_png.png", "pro.proScreenshotCapture"],
          ["webpage-markdown.png", "pro.proMarkdownCapture"],
          ["erase.png", "pro.proTrash"],
          ["montage-lightmod.png", "pro.proMontage"],
          ["versioning-darkmode.png", "pro.proVersioning"],
          ["tootls.png", "pro.proToolsLimit"],
          ["drive-logo.png", "pro.proDriveSync"]
        ])
      );
      return wrap;
    }

    function createManagerProPlanCard(variant, titleKey, rows) {
      const card = document.createElement("section");
      card.className = `manager-pro-plan-card is-${variant}`;
      const head = document.createElement("div");
      head.className = "manager-pro-plan-head";
      const title = document.createElement("strong");
      if (variant === "pro") {
        const titleIcon = document.createElement("img");
        titleIcon.className = "manager-pro-plan-title-icon";
        titleIcon.src = "../assets/icons/pro-icon.png";
        titleIcon.alt = "";
        titleIcon.setAttribute("aria-hidden", "true");
        const titleText = document.createElement("span");
        titleText.textContent = t(titleKey);
        const titleCopy = document.createElement("span");
        titleCopy.className = "manager-pro-plan-title-copy";
        const lifetime = document.createElement("small");
        lifetime.textContent = t("pro.lifetime");
        titleCopy.append(titleText, lifetime);
        title.append(titleIcon, titleCopy);
      } else {
        title.textContent = t(titleKey);
      }
      const price = document.createElement("div");
      price.className = "manager-pro-plan-price";
      const amount = document.createElement("strong");
      if (variant === "pro") {
        const badge = document.createElement("span");
        badge.className = "manager-pro-launch-badge";
        badge.textContent = t("pro.launchPriceBadge");
        amount.dataset.premiumLifetimePrice = "";
        amount.textContent = t("pro.proPrice");
        price.append(badge, amount);
      } else {
        amount.dataset.premiumFreePrice = "";
        amount.textContent = t("pro.freePrice");
        price.appendChild(amount);
      }
      head.append(title, price);
      const list = document.createElement("ul");
      rows.forEach(([iconName, key, isAvailable = true]) => {
        const item = document.createElement("li");
        item.classList.toggle("is-unavailable", !isAvailable);
        if (!isAvailable) item.setAttribute("aria-disabled", "true");
        const icon = document.createElement("img");
        icon.src = `../assets/icons/${themedIconName(iconName, { forceDarkIcon: key === "pro.proTrash" || key === "pro.proVault" || key === "pro.proVersioning" })}`;
        icon.alt = "";
        icon.setAttribute("aria-hidden", "true");
        if (key === "pro.proTrash" || key === "pro.proVault" || key === "pro.proScreenshotCapture" || key === "pro.proMarkdownCapture" || key === "pro.proMontage" || key === "pro.proVersioning") icon.classList.add("is-compact-benefit-icon");
        const label = document.createElement("span");
        appendProBenefitLabel(label, t(key));
        item.append(icon, label);
        list.appendChild(item);
      });
      card.append(head, list);
      return card;
    }

    function appendProBenefitLabel(label, text) {
      const patterns = [
        /Unlimited|Unbegrenzte|illimit[\w\u00e0-\u017f]*|ilimitad[\w\u00e0-\u017f]*/i,
        /20\s+(?:outils|tools|Werkzeuge|herramientas|strumenti)/i,
        /(?:Synchro Google Drive|Google Drive Sync|Google-Drive-Sync|Sincronizaci\u00f3n Google Drive|Sincronizzazione Google Drive)/i
      ];
      appendHighlightedText(label, text, patterns);
    }

    function appendHighlightedText(node, text, patterns) {
      const value = String(text || "");
      const matches = [];
      patterns.forEach((pattern) => {
        const match = pattern.exec(value);
        if (match) matches.push({ start: match.index, end: match.index + match[0].length });
      });
      matches.sort((left, right) => left.start - right.start);
      const ranges = [];
      matches.forEach((match) => {
        const previous = ranges.at(-1);
        if (previous && match.start < previous.end) return;
        ranges.push(match);
      });
      let cursor = 0;
      ranges.forEach((range) => {
        if (range.start > cursor) node.appendChild(document.createTextNode(value.slice(cursor, range.start)));
        const strong = document.createElement("strong");
        strong.className = "pro-benefit-highlight";
        strong.textContent = value.slice(range.start, range.end);
        node.appendChild(strong);
        cursor = range.end;
      });
      if (cursor < value.length) node.appendChild(document.createTextNode(value.slice(cursor)));
    }

    return {
      render: renderManagerProUpgradeModal,
      openCheckout: openManagerProCheckout,
      resolveContext: resolveManagerProUpgradeContext
    };
  }

  global.MCP = Object.assign(global.MCP || {}, {
    createManagerPremiumController
  });
})(globalThis);
