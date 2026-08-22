(function initManagerToolCollectionRenderers(global) {
  "use strict";
  const EMOJI_RENDER_BATCH = 144;
  const emojiRenderStates = new WeakMap();
  function createManagerToolCollectionRenderers(options = {}) {
    const { getLanguage = () => "en", t = (key, values) => String(values?.count ?? key), toolApi = global.MCP || {} } = options;
    const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
    function render(modal, type) {
      const browser = modal.querySelector("[data-role='emoji-browser']"), grid = modal.querySelector("[data-role='emoji-grid']");
      const search = modal.querySelector("[data-role='emoji-search']"), categoriesNode = modal.querySelector("[data-role='emoji-categories']");
      const countNode = modal.querySelector("[data-role='emoji-count']"), emptyNode = modal.querySelector("[data-role='emoji-empty']");
      const locale = String(getLanguage()).slice(0, 2).toLowerCase(), query = normalize(search?.value || ""), emojiMode = type === "emoji";
      const library = emojiMode ? toolApi.getEmojiLibrary?.() : toolApi.getSpecialCharacterLibrary?.(locale);
      if (!browser || !grid || !library) return;
      browser.classList.toggle("is-emoji-mode", emojiMode);
      const categories = emojiMode ? toolApi.getEmojiCategories?.() || [] : [];
      const activeCategory = categories.some((item) => item.id === browser.dataset.emojiCategory) ? browser.dataset.emojiCategory : "all";
      browser.dataset.emojiCategory = activeCategory;
      const searchMatches = library.filter((item) => {
        const categoryLabel = emojiMode ? t(categories.find((category) => category.id === item.category)?.labelKey || "") : "";
        return !query || normalize([emojiMode ? item.emoji : item.symbol, item.names?.[locale], item.names?.en, item.search, categoryLabel].join(" ")).includes(query);
      });
      const items = searchMatches.filter((item) => !emojiMode || activeCategory === "all" || item.category === activeCategory);
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
      if (countNode) {
        countNode.hidden = !emojiMode;
        countNode.textContent = emojiMode ? t("tools.emojiResults", { count: items.length }) : "";
      }
      if (emptyNode) {
        emptyNode.hidden = !emojiMode || items.length > 0;
        const message = emptyNode.querySelector("strong");
        if (message) message.textContent = t("tools.emojiNoResults");
      }
      grid.hidden = items.length === 0;
      renderProgressively(grid, items, locale, emojiMode);
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
    function createItem(item, locale, emojiMode) {
      const value = emojiMode ? item.emoji : item.symbol, nameValue = item.names?.[locale] || item.names?.en || value;
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
    function renderProgressively(grid, items, locale, emojiMode) {
      emojiRenderStates.get(grid)?.observer?.disconnect();
      if (!emojiMode || items.length <= EMOJI_RENDER_BATCH) {
        grid.replaceChildren(...items.map((item) => createItem(item, locale, emojiMode)));
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
        sentinel.before(...next.map((item) => createItem(item, locale, true)));
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
