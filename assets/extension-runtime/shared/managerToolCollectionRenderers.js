(function initManagerToolCollectionRenderers(global) {
  "use strict";
  const EMOJI_RENDER_BATCH = 144;
  const emojiRenderStates = new WeakMap();
  function createManagerToolCollectionRenderers(options = {}) {
    const { getLanguage = () => "en", onLanguageChange = () => {}, t = (key, values) => String(values?.count ?? key), toolApi = global.MCP || {} } = options;
    const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
    function render(modal, type) {
      const browser = modal.querySelector("[data-role='emoji-browser']"), grid = modal.querySelector("[data-role='emoji-grid']");
      const search = modal.querySelector("[data-role='emoji-search']"), categoriesNode = modal.querySelector("[data-role='emoji-categories']");
      const languageNode = modal.querySelector("[data-role='special-language-list']");
      const countNode = modal.querySelector("[data-role='emoji-count']"), emptyNode = modal.querySelector("[data-role='emoji-empty']");
      const locale = String(getLanguage()).slice(0, 2).toLowerCase(), query = normalize(search?.value || ""), emojiMode = type === "emoji";
      const languages = emojiMode ? [] : toolApi.getSpecialCharacterLanguages?.() || [];
      const selectedLanguage = languages.some((item) => item.id === browser?.dataset.specialLanguage) ? browser.dataset.specialLanguage : locale;
      if (browser && !emojiMode) browser.dataset.specialLanguage = selectedLanguage;
      const library = emojiMode ? toolApi.getEmojiLibrary?.() : toolApi.getSpecialCharacterLibrary?.(selectedLanguage);
      if (!browser || !grid || !library) return;
      const specialGroups = emojiMode ? [] : toolApi.getSpecialCharacterGroups?.(selectedLanguage, locale) || [];
      const activeSpecialGroup = specialGroups.some((group) => group.id === browser.dataset.specialGroup) ? browser.dataset.specialGroup : "";
      if (!emojiMode) browser.dataset.specialGroup = activeSpecialGroup;
      browser.classList.toggle("is-emoji-mode", emojiMode);
      const categories = emojiMode ? toolApi.getEmojiCategories?.() || [] : [];
      const activeCategory = categories.some((item) => item.id === browser.dataset.emojiCategory) ? browser.dataset.emojiCategory : "all";
      browser.dataset.emojiCategory = activeCategory;
      const searchMatches = library.filter((item) => {
        const categoryLabel = emojiMode ? t(categories.find((category) => category.id === item.category)?.labelKey || "") : "";
        const localizedGroup = emojiMode ? "" : toolApi.getSpecialCharacterGroupLabel?.(locale, item.group) || item.groupLabel;
        return !query || normalize([emojiMode ? item.emoji : item.symbol, item.names?.[selectedLanguage], item.names?.[locale], item.names?.en, item.search, localizedGroup, item.unicode, item.htmlDecimal, item.htmlHex, categoryLabel].join(" ")).includes(query);
      });
      const items = searchMatches.filter((item) => emojiMode ? activeCategory === "all" || item.category === activeCategory : !activeSpecialGroup || item.group === activeSpecialGroup);
      const categoryCounts = searchMatches.reduce((counts, item) => {
        counts.set(item.category, (counts.get(item.category) || 0) + 1);
        return counts;
      }, new Map());
      if (categoriesNode) {
        categoriesNode.hidden = !emojiMode;
        categoriesNode.setAttribute("aria-label", t("tools.emojiCategories"));
        categoriesNode.replaceChildren(...categories.map((category) => {
          const count = category.id === "all" ? searchMatches.length : categoryCounts.get(category.id) || 0;
          return createCategoryButton(category, activeCategory, modal, count);
        }));
      }
      if (languageNode) {
        languageNode.hidden = emojiMode;
        if (!emojiMode) {
          languageNode.setAttribute("aria-label", t("tools.specialCharacters.languages"));
          const specialGroupCounts = searchMatches.reduce((counts, item) => {
            counts.set(item.group, (counts.get(item.group) || 0) + 1);
            return counts;
          }, new Map());
          languageNode.replaceChildren(...languages.map((language) => createLanguageBranch(
            language,
            selectedLanguage,
            specialGroups.map((group) => ({ ...group, count: specialGroupCounts.get(group.id) || 0 })),
            activeSpecialGroup,
            library.length,
            modal
          )));
        }
      }
      if (countNode) {
        countNode.hidden = false;
        countNode.textContent = emojiMode ? t("tools.emojiResults", { count: items.length }) : t("tools.specialCharacters.results", { count: items.length });
      }
      if (emptyNode) {
        emptyNode.hidden = items.length > 0;
        const message = emptyNode.querySelector("strong");
        if (message) message.textContent = emojiMode ? t("tools.emojiNoResults") : t("tools.specialCharacters.noResults");
      }
      grid.hidden = items.length === 0;
      renderProgressively(grid, items, locale, emojiMode, modal);
    }
    function createLanguageBranch(language, selectedLanguage, groups, activeGroup, totalCount, modal) {
      const branch = document.createElement("div"), selected = language.id === selectedLanguage;
      branch.className = "manager-special-language-branch";
      const button = createLanguageButton(language, selected, totalCount, modal);
      branch.append(button);
      if (selected) {
        const children = document.createElement("div"); children.className = "manager-special-subcategories"; children.setAttribute("role", "group");
        children.setAttribute("aria-label", language.name);
        children.append(...groups.map((group) => createSpecialSubcategoryButton(group, activeGroup, modal)));
        branch.append(children);
      }
      return branch;
    }
    function createLanguageButton(language, selected, totalCount, modal) {
      const button = document.createElement("button");
      button.type = "button"; button.className = "manager-special-language"; button.dataset.specialLanguage = language.id;
      button.setAttribute("aria-pressed", String(selected)); button.setAttribute("aria-expanded", String(selected)); button.title = language.name;
      const badge = document.createElement("span"); badge.className = "manager-special-language-badge"; badge.textContent = language.badge; badge.setAttribute("aria-hidden", "true");
      const name = document.createElement("strong"); name.textContent = language.name;
      const count = document.createElement("span"); count.className = "manager-special-language-count"; count.textContent = selected ? String(totalCount) : "";
      button.append(badge, name, count);
      button.addEventListener("click", () => {
        const browser = modal.querySelector("[data-role='emoji-browser']");
        if (browser) { browser.dataset.specialLanguage = language.id; browser.dataset.specialGroup = ""; }
        onLanguageChange(modal, language.id);
        render(modal, "special");
      });
      return button;
    }
    function createSpecialSubcategoryButton(group, activeGroup, modal) {
      const button = document.createElement("button"), selected = group.id === activeGroup;
      button.type = "button"; button.className = "manager-special-subcategory"; button.dataset.specialGroup = group.id;
      button.setAttribute("aria-pressed", String(selected)); button.title = group.label;
      const icon = document.createElement("span"); icon.className = "manager-special-subcategory-icon"; icon.textContent = group.icon; icon.setAttribute("aria-hidden", "true");
      const label = document.createElement("strong"); label.textContent = group.label;
      const count = document.createElement("span"); count.className = "manager-special-subcategory-count"; count.textContent = String(group.count);
      button.append(icon, label, count);
      button.addEventListener("click", () => {
        const browser = modal.querySelector("[data-role='emoji-browser']");
        if (browser) browser.dataset.specialGroup = selected ? "" : group.id;
        onLanguageChange(modal);
        render(modal, "special");
      });
      return button;
    }
    function createCategoryButton(category, activeCategory, modal, count) {
      const button = document.createElement("button"), selected = category.id === activeCategory;
      button.type = "button"; button.className = "manager-emoji-category"; button.dataset.emojiCategory = category.id;
      button.setAttribute("aria-pressed", String(selected)); button.title = t(category.labelKey);
      const icon = document.createElement("span"); icon.setAttribute("aria-hidden", "true"); icon.textContent = category.icon;
      const label = document.createElement("strong"); label.textContent = t(category.labelKey);
      const countNode = document.createElement("span"); countNode.className = "manager-emoji-category-count"; countNode.textContent = String(count);
      button.append(icon, label, countNode);
      button.addEventListener("click", () => {
        const browser = modal.querySelector("[data-role='emoji-browser']");
        if (browser) browser.dataset.emojiCategory = category.id;
        render(modal, "emoji");
      });
      return button;
    }
    function createItem(item, locale, emojiMode, modal) {
      const value = emojiMode ? item.emoji : item.symbol;
      const localizedGroup = emojiMode ? "" : toolApi.getSpecialCharacterGroupLabel?.(locale, item.group) || item.groupLabel;
      const nameValue = emojiMode ? item.names?.[locale] || item.names?.en || value : `${localizedGroup} · ${item.unicode}`;
      if (!emojiMode) return createSpecialCharacterItem(item, nameValue, localizedGroup, modal);
      const button = document.createElement("button");
      button.type = "button"; button.className = `manager-emoji-item${emojiMode ? "" : " manager-special-character-item"}`;
      button.dataset.managerAction = emojiMode ? "copy-emoji" : "copy-special-character";
      button.dataset[emojiMode ? "emoji" : "symbol"] = value; button.title = nameValue; button.setAttribute("aria-label", `${nameValue}: ${value}`);
      const symbol = document.createElement("span"); symbol.className = `manager-emoji-symbol${emojiMode ? "" : " manager-special-character-symbol"}`; symbol.setAttribute("aria-hidden", "true");
      if (emojiMode && item.flagAsset) {
        const flag = document.createElement("img");
        flag.className = "manager-emoji-flag"; flag.alt = ""; flag.decoding = "async"; flag.draggable = false;
        try { flag.src = global.chrome?.runtime?.getURL?.(item.flagAsset) || item.flagAsset; } catch (_) { flag.src = item.flagAsset; }
        symbol.append(flag);
      } else {
        symbol.textContent = value;
      }
      const name = document.createElement("strong"); name.textContent = nameValue;
      button.append(symbol, name); return button;
    }
    function createSpecialCharacterItem(item, nameValue, localizedGroup, modal) {
      const card = document.createElement("article"); card.className = "manager-special-character-item";
      const character = document.createElement("button");
      character.type = "button"; character.className = "manager-special-character-main"; character.dataset.managerAction = "copy-special-character";
      character.dataset.symbol = item.symbol; character.title = nameValue; character.setAttribute("aria-label", `${nameValue}: ${item.symbol}`);
      const identity = document.createElement("span"); identity.className = "manager-special-character-identity";
      const symbol = document.createElement("span"); symbol.className = "manager-special-character-symbol"; symbol.textContent = item.symbol; symbol.setAttribute("aria-hidden", "true");
      const metadata = document.createElement("span"); metadata.className = "manager-special-character-metadata";
      const group = document.createElement("strong"); group.textContent = localizedGroup || item.groupLabel || nameValue;
      const unicode = document.createElement("code"); unicode.className = "manager-special-character-code"; unicode.textContent = item.unicode;
      metadata.append(group, unicode); identity.append(symbol, metadata); character.append(identity);
      const encodings = document.createElement("div"); encodings.className = "manager-special-character-encodings";
      [["HTML", item.htmlDecimal], ["HEX", item.htmlHex]].forEach(([label, encoding]) => {
        const button = document.createElement("button"); button.type = "button"; button.dataset.managerAction = "copy-special-encoding"; button.dataset.encoding = encoding;
        button.title = encoding; button.setAttribute("aria-label", `${label}: ${encoding}`);
        const labelNode = document.createElement("span"); labelNode.className = "manager-special-encoding-label"; labelNode.textContent = label;
        const valueNode = document.createElement("code"); valueNode.className = "manager-special-encoding-value"; valueNode.textContent = encoding;
        button.append(labelNode, valueNode); encodings.append(button);
      });
      const updateDetails = () => {
        const details = modal?.querySelector("[data-role='special-character-details']");
        if (!details) return;
        details.hidden = false;
        details.textContent = `${item.symbol} · ${item.unicode} · ${item.htmlDecimal} · ${item.htmlHex}`;
      };
      card.addEventListener("mouseenter", updateDetails); card.addEventListener("focusin", updateDetails);
      card.append(character, encodings); return card;
    }
    function renderProgressively(grid, items, locale, emojiMode, modal) {
      emojiRenderStates.get(grid)?.observer?.disconnect();
      if (items.length <= EMOJI_RENDER_BATCH) {
        grid.replaceChildren(...items.map((item) => createItem(item, locale, emojiMode, modal)));
        emojiRenderStates.delete(grid);
        return;
      }
      const state = { rendered: 0, observer: null };
      const sentinel = document.createElement("span");
      sentinel.className = "manager-emoji-render-sentinel";
      sentinel.setAttribute("aria-hidden", "true");
      const appendBatch = () => {
        const next = items.slice(state.rendered, state.rendered + EMOJI_RENDER_BATCH);
        if (!next.length) { state.observer?.disconnect(); sentinel.remove(); return; }
        sentinel.before(...next.map((item) => createItem(item, locale, emojiMode, modal)));
        state.rendered += next.length;
        if (state.rendered >= items.length) { state.observer?.disconnect(); sentinel.remove(); }
      };
      grid.replaceChildren(sentinel);
      appendBatch();
      if (state.rendered < items.length && typeof IntersectionObserver === "function") {
        state.observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) appendBatch();
        }, { root: grid.closest(".manager-emoji-atlas-body"), rootMargin: "600px 0px" });
        state.observer.observe(sentinel);
      } else {
        while (state.rendered < items.length) appendBatch();
      }
      emojiRenderStates.set(grid, state);
    }
    return { renderEmoji: (modal) => render(modal, "emoji"), renderSpecialCharacters: (modal) => render(modal, "special"), normalize };
  }
  global.MCP = global.MCP || {};
  global.MCP.createManagerToolCollectionRenderers = createManagerToolCollectionRenderers;
})(globalThis);
