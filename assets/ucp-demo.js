(() => {
  const root = document.querySelector(".ucp-demo-root");
  if (!root || !window.location.pathname.includes("/ultimate-clipboard-pro/demo")) return;

  const supported = ["en", "fr", "es", "it", "de"];
  const pathLang = window.location.pathname.split("/").filter(Boolean)[0];
  const lang = supported.includes(pathLang) ? pathLang : "en";
  const icon = "/assets/ultimate_clipboard_pro_icon_96.webp";
  const images = Array.from({ length: 15 }, (_, index) => `/assets/demo/${index + 1}.jpg`);

  const i18n = {
    en: {
      text: "Text", code: "Code", image: "Images", searchText: "Search texts", searchCode: "Search code", searchImage: "Search images",
      allText: "All texts", allCode: "All code", allImage: "All images", general: "General", favorites: "Favorites", pinned: "Pinned", vault: "Vault",
      copy: "Use", classify: "Classify", reverse: "Reverse", manager: "Manager", tools: "Tools", close: "Close", menu: "Menu",
      demoBlockedTitle: "Demo mode", demoBlocked: "This action is disabled in the visual demo. Install the extension to use it for real.",
      toolsBlocked: "Tools are visible in the demo, but each tool opens only inside the real extension.",
      sideCount: "sample captures", managerTitle: "Ultimate Clipboard Pro Manager", toolsTitle: "Tools", collapse: "Collapse launcher", open: "Open launcher"
    },
    fr: {
      text: "Texte", code: "Code", image: "Images", searchText: "Rechercher des textes", searchCode: "Rechercher du code", searchImage: "Rechercher des images",
      allText: "Tous les textes", allCode: "Tous les codes", allImage: "Toutes les images", general: "Général", favorites: "Favoris", pinned: "Épinglés", vault: "Coffre-fort",
      copy: "Utiliser", classify: "Classer", reverse: "Reverse", manager: "Gestionnaire", tools: "Outils", close: "Fermer", menu: "Menu",
      demoBlockedTitle: "Mode Démo", demoBlocked: "Cette action est désactivée dans la démo visuelle. Installez l’extension pour l’utiliser réellement.",
      toolsBlocked: "Les outils sont visibles dans la démo, mais chaque outil s’ouvre uniquement dans la vraie extension.",
      sideCount: "captures d’exemple", managerTitle: "Gestionnaire Ultimate Clipboard Pro", toolsTitle: "Outils", collapse: "Réduire le launcher", open: "Ouvrir le launcher"
    },
    es: {
      text: "Texto", code: "Código", image: "Imágenes", searchText: "Buscar textos", searchCode: "Buscar código", searchImage: "Buscar imágenes",
      allText: "Todos los textos", allCode: "Todo el código", allImage: "Todas las imágenes", general: "General", favorites: "Favoritos", pinned: "Fijados", vault: "Bóveda",
      copy: "Usar", classify: "Clasificar", reverse: "Reverse", manager: "Gestor", tools: "Herramientas", close: "Cerrar", menu: "Menú",
      demoBlockedTitle: "Modo Demo", demoBlocked: "Esta acción está desactivada en la demo visual. Instala la extensión para usarla de verdad.",
      toolsBlocked: "Las herramientas son visibles en la demo, pero cada herramienta solo se abre en la extensión real.",
      sideCount: "capturas de ejemplo", managerTitle: "Gestor Ultimate Clipboard Pro", toolsTitle: "Herramientas", collapse: "Reducir launcher", open: "Abrir launcher"
    },
    it: {
      text: "Testo", code: "Codice", image: "Immagini", searchText: "Cerca testi", searchCode: "Cerca codice", searchImage: "Cerca immagini",
      allText: "Tutti i testi", allCode: "Tutto il codice", allImage: "Tutte le immagini", general: "Generale", favorites: "Preferiti", pinned: "Fissati", vault: "Vault",
      copy: "Usa", classify: "Classifica", reverse: "Reverse", manager: "Gestore", tools: "Strumenti", close: "Chiudi", menu: "Menu",
      demoBlockedTitle: "Modalità Demo", demoBlocked: "Questa azione è disattivata nella demo visiva. Installa l’estensione per usarla davvero.",
      toolsBlocked: "Gli strumenti sono visibili nella demo, ma si aprono solo nell’estensione reale.",
      sideCount: "catture di esempio", managerTitle: "Gestore Ultimate Clipboard Pro", toolsTitle: "Strumenti", collapse: "Riduci launcher", open: "Apri launcher"
    },
    de: {
      text: "Text", code: "Code", image: "Bilder", searchText: "Texte suchen", searchCode: "Code suchen", searchImage: "Bilder suchen",
      allText: "Alle Texte", allCode: "Alle Codes", allImage: "Alle Bilder", general: "Allgemein", favorites: "Favoriten", pinned: "Angeheftet", vault: "Vault",
      copy: "Nutzen", classify: "Einordnen", reverse: "Reverse", manager: "Manager", tools: "Tools", close: "Schließen", menu: "Menü",
      demoBlockedTitle: "Demo-Modus", demoBlocked: "Diese Aktion ist in der visuellen Demo deaktiviert. Installieren Sie die Erweiterung, um sie wirklich zu nutzen.",
      toolsBlocked: "Die Tools sind in der Demo sichtbar, öffnen sich aber nur in der echten Erweiterung.",
      sideCount: "Beispiel-Captures", managerTitle: "Ultimate Clipboard Pro Manager", toolsTitle: "Tools", collapse: "Launcher reduzieren", open: "Launcher öffnen"
    }
  };
  const t = i18n[lang] || i18n.en;

  const data = {
    text: [
      {
        id: "t1", category: "AI", source: "chatgpt.com", title: "Reusable launch prompt",
        versions: [
          "Create a premium launch announcement with a direct hook, practical benefits, short proof points and a concise call to action.",
          "Create a premium launch announcement for a Chrome extension. Keep it useful, credible and focused on real workflows.",
          "Write a launch post for Ultimate Clipboard Pro that explains capture, organization, search, versioning and local-first control."
        ]
      },
      { id: "t2", category: "Research", source: "docs.example.com", title: "Research summary", versions: ["Summarize this source into decisions, risks, open questions and next actions with owners.", "Turn this source into a reusable research note with context, assumptions and verification points."] },
      { id: "t3", category: "Marketing", source: "workspace.example", title: "Product positioning", versions: ["Position the product for demanding users who copy text, code and images all day and need structure instead of history."] },
      { id: "t4", category: "Support", source: "helpdesk.example", title: "Support reply", versions: ["Prepare a calm support reply that acknowledges the issue, explains the likely cause and gives clear next steps."] }
    ],
    code: [
      { id: "c1", category: "JavaScript", source: "github.com", title: "Debounce helper", versions: ["function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}", "export function debounce(fn, delay = 250) {\n  let timerId;\n  return function debounced(...args) {\n    window.clearTimeout(timerId);\n    timerId = window.setTimeout(() => fn.apply(this, args), delay);\n  };\n}"] },
      { id: "c2", category: "TypeScript", source: "docs.example.com", title: "Safe JSON", versions: ["type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };\n\nasync function safeJson<T>(response: Response): Promise<ApiResult<T>> {\n  if (!response.ok) return { ok: false, error: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"] },
      { id: "c3", category: "React", source: "workspace.example", title: "Icon button", versions: ["export function IconButton({ label, children, ...props }) {\n  return <button aria-label={label} title={label} {...props}>{children}</button>;\n}"] }
    ],
    image: images.map((src, index) => ({ id: `i${index + 1}`, category: index % 3 === 0 ? "AI images" : index % 3 === 1 ? "Design" : "Web images", source: "istockphoto.com", title: `Captured image ${index + 1}`, src }))
  };

  const state = { dockCollapsed: false, sideOpen: false, managerOpen: false, toolsOpen: false, tab: "text", managerTab: "text", versions: {}, pinned: new Set(["t1"]), favorite: new Set(["c2"]) };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(className, text, action, label) {
    const node = el("button", className, text);
    node.type = "button";
    if (action) node.dataset.demoAction = action;
    if (label) node.setAttribute("aria-label", label);
    return node;
  }

  function activeVersion(item) {
    const index = state.versions[item.id] || 0;
    return { index, text: item.versions[index] || item.versions[0] };
  }

  function showBlocked(message = t.demoBlocked) {
    const dialog = document.querySelector(".ucp-demo-dialog");
    dialog.querySelector("h3").textContent = t.demoBlockedTitle;
    dialog.querySelector("p").textContent = message;
    dialog.classList.add("is-open");
    window.clearTimeout(showBlocked.timer);
    showBlocked.timer = window.setTimeout(() => dialog.classList.remove("is-open"), 2600);
  }

  function renderLauncher() {
    const dock = el("div", `ucp-demo-launcher${state.dockCollapsed ? " is-collapsed" : ""}`);
    dock.append(button("ucp-demo-launcher-button is-muted", state.dockCollapsed ? "›" : "‹", "toggle-dock", state.dockCollapsed ? t.open : t.collapse));
    const main = button("ucp-demo-launcher-button", "", "toggle-side", "Ultimate Clipboard Pro");
    const img = el("img");
    img.src = icon;
    img.alt = "";
    main.append(img);
    dock.append(main);
    dock.append(button("ucp-demo-launcher-button", "▦", "open-manager", t.manager));
    dock.append(button("ucp-demo-launcher-button", "⌘", "open-tools", t.tools));
    return dock;
  }

  function renderTabs(current, action) {
    const wrap = el("div", "ucp-demo-tabs");
    [["text", t.text], ["code", t.code], ["image", t.image]].forEach(([key, label]) => {
      const tab = button(`ucp-demo-tab${current === key ? " is-active" : ""}`, label, action);
      tab.dataset.tab = key;
      wrap.append(tab);
    });
    return wrap;
  }

  function renderCard(item, type, manager = false) {
    const card = el("article", `ucp-demo-card${state.pinned.has(item.id) ? " is-pinned" : ""}`);
    const title = el("h3", "ucp-demo-card-title", item.title);
    card.append(title);
    if (type !== "image" && item.versions.length > 1) {
      const version = activeVersion(item);
      const v = button("ucp-demo-version", `V${version.index + 1}`, "next-version", "Next version");
      v.dataset.id = item.id;
      card.append(v);
    }
    if (type === "image") {
      const image = el("img", "ucp-demo-image");
      image.src = item.src;
      image.alt = item.title;
      image.loading = "lazy";
      image.decoding = "async";
      card.append(image);
    } else {
      card.append(el("div", "ucp-demo-card-text", activeVersion(item).text));
    }
    card.append(el("div", "ucp-demo-card-meta", `${item.category} · ${item.source}`));
    const actions = el("div", "ucp-demo-card-actions");
    actions.append(button("ucp-demo-card-button is-accent", t.copy, "blocked"));
    actions.append(button("ucp-demo-card-button", t.classify, "blocked"));
    actions.append(button("ucp-demo-card-button", t.reverse, "blocked"));
    if (!manager || type !== "image") actions.append(button("ucp-demo-card-button", "+V", "blocked"));
    actions.append(button("ucp-demo-card-button", state.favorite.has(item.id) ? "★" : "☆", "favorite", t.favorites));
    actions.lastChild.dataset.id = item.id;
    actions.append(button("ucp-demo-card-button", state.pinned.has(item.id) ? "◆" : "◇", "pin", t.pinned));
    actions.lastChild.dataset.id = item.id;
    card.append(actions);
    return card;
  }

  function renderSidePanel() {
    const panel = el("section", `ucp-demo-panel${state.sideOpen ? " is-open" : ""}`);
    const header = el("div", "ucp-demo-panel-header");
    const brand = el("div", "ucp-demo-brand");
    const logo = el("img");
    logo.src = icon;
    logo.alt = "";
    brand.append(logo, el("div", "", ""));
    brand.lastChild.append(el("strong", "", "Ultimate Clipboard Pro"), el("span", "", `${data[state.tab].length} ${t.sideCount}`));
    const controls = el("div", "ucp-demo-icon-row");
    controls.append(button("ucp-demo-icon-button", "▦", "open-manager", t.manager));
    controls.append(button("ucp-demo-icon-button", "☰", "blocked", t.menu));
    controls.append(button("ucp-demo-icon-button", "↗", "open-manager", t.manager));
    controls.append(button("ucp-demo-close", "×", "close-side", t.close));
    header.append(brand, controls);
    panel.append(header, renderTabs(state.tab, "side-tab"));
    const input = el("input", "ucp-demo-search");
    input.type = "search";
    input.placeholder = state.tab === "text" ? t.searchText : state.tab === "code" ? t.searchCode : t.searchImage;
    input.disabled = true;
    panel.append(input);
    const list = el("div", "ucp-demo-list");
    data[state.tab].slice(0, state.tab === "image" ? 6 : 4).forEach((item) => list.append(renderCard(item, state.tab)));
    panel.append(list);
    return panel;
  }

  function renderManager() {
    const manager = el("section", `ucp-demo-manager${state.managerOpen ? " is-open" : ""}`);
    const header = el("div", "ucp-demo-manager-header");
    header.append(el("h2", "", t.managerTitle));
    const controls = el("div", "ucp-demo-icon-row");
    controls.append(button("ucp-demo-icon-button", "⌘", "open-tools", t.tools));
    controls.append(button("ucp-demo-close", "×", "close-manager", t.close));
    header.append(controls);
    manager.append(header);
    const layout = el("div", "ucp-demo-manager-layout");
    const sidebar = el("aside", "ucp-demo-sidebar");
    const catLabels = state.managerTab === "text" ? [t.allText, t.general, "AI", "AI > Prompts", "Research", "Research > Quotes", "Marketing", t.favorites, t.pinned, t.vault] : state.managerTab === "code" ? [t.allCode, t.general, "JavaScript", "JavaScript > Utilities", "TypeScript", "React", t.favorites, t.pinned, t.vault] : [t.allImage, t.general, "AI images", "Design", "Design > Inspiration", "Web images", t.favorites, t.pinned, t.vault];
    catLabels.forEach((label, index) => sidebar.append(button(`ucp-demo-category${index === 0 ? " is-active" : ""}`, label, "blocked")));
    const content = el("main", "ucp-demo-manager-content");
    content.append(renderTabs(state.managerTab, "manager-tab"));
    const grid = el("div", "ucp-demo-manager-grid");
    data[state.managerTab].forEach((item) => grid.append(renderCard(item, state.managerTab, true)));
    content.append(grid);
    layout.append(sidebar, content);
    manager.append(layout);
    return manager;
  }

  function renderTools() {
    const tools = el("section", `ucp-demo-tools${state.toolsOpen ? " is-open" : ""}`);
    const header = el("div", "ucp-demo-tools-header");
    header.append(el("h2", "", t.toolsTitle), button("ucp-demo-close", "×", "close-tools", t.close));
    tools.append(header);
    const grid = el("div", "ucp-demo-tools-grid");
    ["Screen To Text", "Image Prompt", "Prompt Architect", "Emojis", "Duplicate Detector", "Special Characters", "Case Converter", "Advanced Counter", "Color Picker", "Markdown Toolbox", "JSON Formatter", "Text Cleaner", "List Transformer", "Text Comparator", "Word Replacer"].forEach((name) => {
      const card = button("ucp-demo-tool-card", "", "tool-blocked");
      card.append(el("span", "ucp-demo-tool-icon", "□"), el("span", "", name));
      grid.append(card);
    });
    tools.append(grid);
    return tools;
  }

  function render() {
    root.replaceChildren(renderLauncher(), renderSidePanel(), renderManager(), renderTools());
    const dialog = el("section", "ucp-demo-dialog");
    dialog.append(el("h3", "", t.demoBlockedTitle), el("p", "", t.demoBlocked));
    root.append(dialog);
  }

  root.addEventListener("click", (event) => {
    const actionNode = event.target.closest("[data-demo-action]");
    if (!actionNode) return;
    const action = actionNode.dataset.demoAction;
    if (action === "toggle-dock") state.dockCollapsed = !state.dockCollapsed;
    else if (action === "toggle-side") state.sideOpen = !state.sideOpen;
    else if (action === "close-side") state.sideOpen = false;
    else if (action === "open-manager") state.managerOpen = true;
    else if (action === "close-manager") state.managerOpen = false;
    else if (action === "open-tools") state.toolsOpen = true;
    else if (action === "close-tools") state.toolsOpen = false;
    else if (action === "side-tab") state.tab = actionNode.dataset.tab || "text";
    else if (action === "manager-tab") state.managerTab = actionNode.dataset.tab || "text";
    else if (action === "next-version") {
      const item = [...data.text, ...data.code].find((entry) => entry.id === actionNode.dataset.id);
      if (item) state.versions[item.id] = ((state.versions[item.id] || 0) + 1) % item.versions.length;
    } else if (action === "favorite") {
      const id = actionNode.dataset.id;
      if (state.favorite.has(id)) state.favorite.delete(id);
      else state.favorite.add(id);
    } else if (action === "pin") {
      const id = actionNode.dataset.id;
      if (state.pinned.has(id)) state.pinned.delete(id);
      else state.pinned.add(id);
    } else if (action === "tool-blocked") {
      showBlocked(t.toolsBlocked);
      return;
    } else {
      showBlocked();
      return;
    }
    render();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    state.managerOpen = false;
    state.toolsOpen = false;
    state.sideOpen = false;
    render();
  });

  render();
})();
