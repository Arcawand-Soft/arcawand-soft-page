(() => {
  const root = document.querySelector(".ucp-demo-root");
  if (!root || !window.location.pathname.includes("/ultimate-clipboard-pro/demo")) return;

  const supported = ["en", "fr", "es", "it", "de"];
  const pathLang = window.location.pathname.split("/").filter(Boolean)[0];
  const lang = supported.includes(pathLang) ? pathLang : "en";
  const icon = "/assets/ultimate_clipboard_pro_icon_96.webp";
  const copyIcon = "/assets/copy.png";
  const images = Array.from({ length: 15 }, (_, index) => `/assets/demo/${index + 1}.jpg`);

  const i18n = {
    en: {
      text: "Text",
      code: "Code",
      image: "Images",
      searchText: "Search texts",
      searchCode: "Search code",
      searchImage: "Search images",
      allText: "All texts",
      allCode: "All code",
      allImage: "All images",
      general: "General",
      favorites: "Favorites",
      pinned: "Pinned",
      vault: "Vault",
      copy: "Use capture",
      classify: "Classify",
      reverse: "Reverse",
      manager: "Manager",
      tools: "Tools",
      close: "Close",
      menu: "Menu",
      nextVersion: "Show next version",
      sideCount: "sample captures",
      managerTitle: "Ultimate Clipboard Pro Manager",
      toolsTitle: "Tools",
      collapse: "Collapse launcher",
      open: "Open launcher",
      blockedTitle: "Demo mode",
      blocked: "This action is disabled in the visual demo. Install the extension to use it for real.",
      toolsBlocked: "Tools are visible in the demo, but each tool opens only inside the real extension.",
      titleAllText: "All texts",
      titleAllCode: "All code",
      titleAllImage: "All images",
      screen: "Screenshot"
    },
    fr: {
      text: "Texte",
      code: "Code",
      image: "Images",
      searchText: "Rechercher un texte",
      searchCode: "Rechercher un code",
      searchImage: "Rechercher une image",
      allText: "Tous les textes",
      allCode: "Tous les codes",
      allImage: "Toutes les images",
      general: "Général",
      favorites: "Favoris",
      pinned: "Épinglés",
      vault: "Coffre-fort",
      copy: "Utiliser la capture",
      classify: "Classer",
      reverse: "Reverse",
      manager: "Gestionnaire",
      tools: "Outils",
      close: "Fermer",
      menu: "Menu",
      nextVersion: "Afficher la version suivante",
      sideCount: "captures d'exemple",
      managerTitle: "Gestionnaire Ultimate Clipboard Pro",
      toolsTitle: "Outils",
      collapse: "Réduire le lanceur",
      open: "Ouvrir le lanceur",
      blockedTitle: "Mode démo",
      blocked: "Cette action est désactivée dans la démo visuelle. Installez l'extension pour l'utiliser réellement.",
      toolsBlocked: "Les outils sont visibles dans la démo, mais chaque outil s'ouvre uniquement dans la vraie extension.",
      titleAllText: "Tous les textes",
      titleAllCode: "Tous les codes",
      titleAllImage: "Toutes les images",
      screen: "Capture écran"
    },
    es: {
      text: "Texto",
      code: "Código",
      image: "Imágenes",
      searchText: "Buscar un texto",
      searchCode: "Buscar código",
      searchImage: "Buscar una imagen",
      allText: "Todos los textos",
      allCode: "Todo el código",
      allImage: "Todas las imágenes",
      general: "General",
      favorites: "Favoritos",
      pinned: "Fijados",
      vault: "Caja fuerte",
      copy: "Usar captura",
      classify: "Clasificar",
      reverse: "Reverse",
      manager: "Gestor",
      tools: "Herramientas",
      close: "Cerrar",
      menu: "Menú",
      nextVersion: "Mostrar la siguiente versión",
      sideCount: "capturas de ejemplo",
      managerTitle: "Gestor Ultimate Clipboard Pro",
      toolsTitle: "Herramientas",
      collapse: "Reducir el lanzador",
      open: "Abrir el lanzador",
      blockedTitle: "Modo demo",
      blocked: "Esta acción está desactivada en la demo visual. Instala la extensión para usarla de verdad.",
      toolsBlocked: "Las herramientas son visibles en la demo, pero cada herramienta solo se abre dentro de la extensión real.",
      titleAllText: "Todos los textos",
      titleAllCode: "Todo el código",
      titleAllImage: "Todas las imágenes",
      screen: "Captura"
    },
    it: {
      text: "Testo",
      code: "Codice",
      image: "Immagini",
      searchText: "Cerca un testo",
      searchCode: "Cerca codice",
      searchImage: "Cerca un'immagine",
      allText: "Tutti i testi",
      allCode: "Tutto il codice",
      allImage: "Tutte le immagini",
      general: "Generale",
      favorites: "Preferiti",
      pinned: "Fissati",
      vault: "Cassaforte",
      copy: "Usa cattura",
      classify: "Classifica",
      reverse: "Reverse",
      manager: "Gestore",
      tools: "Strumenti",
      close: "Chiudi",
      menu: "Menu",
      nextVersion: "Mostra la versione successiva",
      sideCount: "catture di esempio",
      managerTitle: "Gestore Ultimate Clipboard Pro",
      toolsTitle: "Strumenti",
      collapse: "Riduci il launcher",
      open: "Apri il launcher",
      blockedTitle: "Modalità demo",
      blocked: "Questa azione è disattivata nella demo visiva. Installa l'estensione per usarla davvero.",
      toolsBlocked: "Gli strumenti sono visibili nella demo, ma ogni strumento si apre solo nell'estensione reale.",
      titleAllText: "Tutti i testi",
      titleAllCode: "Tutto il codice",
      titleAllImage: "Tutte le immagini",
      screen: "Schermata"
    },
    de: {
      text: "Text",
      code: "Code",
      image: "Bilder",
      searchText: "Text suchen",
      searchCode: "Code suchen",
      searchImage: "Bild suchen",
      allText: "Alle Texte",
      allCode: "Alle Codes",
      allImage: "Alle Bilder",
      general: "Allgemein",
      favorites: "Favoriten",
      pinned: "Angeheftet",
      vault: "Tresor",
      copy: "Capture nutzen",
      classify: "Einordnen",
      reverse: "Reverse",
      manager: "Manager",
      tools: "Tools",
      close: "Schließen",
      menu: "Menü",
      nextVersion: "Nächste Version anzeigen",
      sideCount: "Beispiel-Captures",
      managerTitle: "Ultimate Clipboard Pro Manager",
      toolsTitle: "Tools",
      collapse: "Launcher reduzieren",
      open: "Launcher öffnen",
      blockedTitle: "Demo-Modus",
      blocked: "Diese Aktion ist in der visuellen Demo deaktiviert. Installieren Sie die Erweiterung, um sie wirklich zu nutzen.",
      toolsBlocked: "Die Tools sind in der Demo sichtbar, öffnen sich aber nur in der echten Erweiterung.",
      titleAllText: "Alle Texte",
      titleAllCode: "Alle Codes",
      titleAllImage: "Alle Bilder",
      screen: "Screenshot"
    }
  };

  const samples = {
    en: {
      text: [
        {
          id: "t1",
          category: "AI > Prompts",
          source: "chatgpt.com",
          title: "Launch message",
          versions: [
            "Create a practical launch message for a Chrome extension that captures text, code and images without breaking the user's workflow.",
            "Write a sharper launch message for demanding users who copy important information all day and need a workspace, not a basic history.",
            "Turn Ultimate Clipboard Pro into a clear promise: capture everything, organize instantly, find it again when the work gets serious."
          ]
        },
        {
          id: "t2",
          category: "Research > Notes",
          source: "docs.example.com",
          title: "Research summary",
          versions: [
            "Summarize this source into decisions, risks, useful quotes, open questions and next actions with owners.",
            "Create a reusable research note with source context, assumptions, verification points and a short conclusion."
          ]
        },
        {
          id: "t3",
          category: "Support",
          source: "helpdesk.example",
          title: "Support reply",
          versions: ["Prepare a calm reply that acknowledges the issue, explains the likely cause and gives concrete next steps."]
        }
      ],
      code: [
        {
          id: "c1",
          category: "JavaScript",
          source: "github.com",
          title: "Debounce helper",
          versions: [
            "function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
            "export function debounce(fn, delay = 250) {\n  let timerId;\n  return function debounced(...args) {\n    window.clearTimeout(timerId);\n    timerId = window.setTimeout(() => fn.apply(this, args), delay);\n  };\n}"
          ]
        },
        {
          id: "c2",
          category: "TypeScript",
          source: "docs.example.com",
          title: "Safe JSON",
          versions: ["type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };\n\nasync function safeJson<T>(response: Response): Promise<ApiResult<T>> {\n  if (!response.ok) return { ok: false, error: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
        }
      ]
    },
    fr: {
      text: [
        {
          id: "t1",
          category: "IA > Prompts",
          source: "chatgpt.com",
          title: "Message de lancement",
          versions: [
            "Crée un message de lancement concret pour une extension Chrome qui capture textes, codes et images sans casser le flux de travail.",
            "Rédige un message plus direct pour les utilisateurs exigeants qui copient des informations importantes toute la journée.",
            "Transforme Ultimate Clipboard Pro en promesse claire : tout capturer, organiser immédiatement, retrouver au bon moment."
          ]
        },
        {
          id: "t2",
          category: "Recherche > Notes",
          source: "docs.example.com",
          title: "Synthèse de recherche",
          versions: [
            "Résume cette source en décisions, risques, citations utiles, questions ouvertes et prochaines actions avec responsables.",
            "Crée une note de recherche réutilisable avec contexte de source, hypothèses, points de vérification et conclusion courte."
          ]
        },
        {
          id: "t3",
          category: "Support",
          source: "helpdesk.example",
          title: "Réponse support",
          versions: ["Prépare une réponse calme qui reconnaît le problème, explique la cause probable et donne des étapes concrètes."]
        }
      ],
      code: [
        {
          id: "c1",
          category: "JavaScript",
          source: "github.com",
          title: "Fonction debounce",
          versions: [
            "function debounce(fn, delai = 250) {\n  let minuteur;\n  return (...args) => {\n    clearTimeout(minuteur);\n    minuteur = setTimeout(() => fn(...args), delai);\n  };\n}",
            "export function debounce(fn, delai = 250) {\n  let idMinuteur;\n  return function fonctionDebounce(...args) {\n    window.clearTimeout(idMinuteur);\n    idMinuteur = window.setTimeout(() => fn.apply(this, args), delai);\n  };\n}"
          ]
        },
        {
          id: "c2",
          category: "TypeScript",
          source: "docs.example.com",
          title: "JSON sécurisé",
          versions: ["type ResultatApi<T> = { ok: true; data: T } | { ok: false; erreur: string };\n\nasync function jsonSur<T>(response: Response): Promise<ResultatApi<T>> {\n  if (!response.ok) return { ok: false, erreur: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
        }
      ]
    },
    es: {
      text: [
        {
          id: "t1",
          category: "IA > Prompts",
          source: "chatgpt.com",
          title: "Mensaje de lanzamiento",
          versions: [
            "Crea un mensaje de lanzamiento práctico para una extensión de Chrome que captura textos, códigos e imágenes sin interrumpir el trabajo.",
            "Escribe un mensaje más directo para usuarios exigentes que copian información importante durante todo el día.",
            "Convierte Ultimate Clipboard Pro en una promesa clara: capturar todo, organizar al instante y encontrarlo cuando importa."
          ]
        },
        {
          id: "t2",
          category: "Investigación > Notas",
          source: "docs.example.com",
          title: "Resumen de investigación",
          versions: [
            "Resume esta fuente en decisiones, riesgos, citas útiles, preguntas abiertas y próximas acciones con responsables.",
            "Crea una nota reutilizable con contexto de la fuente, supuestos, puntos de verificación y una conclusión breve."
          ]
        },
        {
          id: "t3",
          category: "Soporte",
          source: "helpdesk.example",
          title: "Respuesta de soporte",
          versions: ["Prepara una respuesta tranquila que reconozca el problema, explique la causa probable y dé pasos concretos."]
        }
      ],
      code: [
        {
          id: "c1",
          category: "JavaScript",
          source: "github.com",
          title: "Ayudante debounce",
          versions: [
            "function debounce(fn, retraso = 250) {\n  let temporizador;\n  return (...args) => {\n    clearTimeout(temporizador);\n    temporizador = setTimeout(() => fn(...args), retraso);\n  };\n}",
            "export function debounce(fn, retraso = 250) {\n  let idTemporizador;\n  return function conDebounce(...args) {\n    window.clearTimeout(idTemporizador);\n    idTemporizador = window.setTimeout(() => fn.apply(this, args), retraso);\n  };\n}"
          ]
        },
        {
          id: "c2",
          category: "TypeScript",
          source: "docs.example.com",
          title: "JSON seguro",
          versions: ["type ResultadoApi<T> = { ok: true; data: T } | { ok: false; error: string };\n\nasync function jsonSeguro<T>(response: Response): Promise<ResultadoApi<T>> {\n  if (!response.ok) return { ok: false, error: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
        }
      ]
    },
    it: {
      text: [
        {
          id: "t1",
          category: "IA > Prompt",
          source: "chatgpt.com",
          title: "Messaggio di lancio",
          versions: [
            "Crea un messaggio di lancio concreto per un'estensione Chrome che cattura testi, codici e immagini senza interrompere il lavoro.",
            "Scrivi un messaggio più diretto per utenti esigenti che copiano informazioni importanti tutto il giorno.",
            "Trasforma Ultimate Clipboard Pro in una promessa chiara: cattura tutto, organizza subito, ritrova quando serve."
          ]
        },
        {
          id: "t2",
          category: "Ricerca > Note",
          source: "docs.example.com",
          title: "Sintesi di ricerca",
          versions: [
            "Riassumi questa fonte in decisioni, rischi, citazioni utili, domande aperte e prossime azioni con responsabili.",
            "Crea una nota riutilizzabile con contesto della fonte, ipotesi, punti di verifica e una conclusione breve."
          ]
        },
        {
          id: "t3",
          category: "Supporto",
          source: "helpdesk.example",
          title: "Risposta supporto",
          versions: ["Prepara una risposta calma che riconosca il problema, spieghi la causa probabile e proponga passaggi concreti."]
        }
      ],
      code: [
        {
          id: "c1",
          category: "JavaScript",
          source: "github.com",
          title: "Helper debounce",
          versions: [
            "function debounce(fn, ritardo = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ritardo);\n  };\n}",
            "export function debounce(fn, ritardo = 250) {\n  let idTimer;\n  return function conDebounce(...args) {\n    window.clearTimeout(idTimer);\n    idTimer = window.setTimeout(() => fn.apply(this, args), ritardo);\n  };\n}"
          ]
        },
        {
          id: "c2",
          category: "TypeScript",
          source: "docs.example.com",
          title: "JSON sicuro",
          versions: ["type RisultatoApi<T> = { ok: true; data: T } | { ok: false; errore: string };\n\nasync function jsonSicuro<T>(response: Response): Promise<RisultatoApi<T>> {\n  if (!response.ok) return { ok: false, errore: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
        }
      ]
    },
    de: {
      text: [
        {
          id: "t1",
          category: "KI > Prompts",
          source: "chatgpt.com",
          title: "Launch-Text",
          versions: [
            "Erstelle einen praktischen Launch-Text für eine Chrome-Erweiterung, die Texte, Code und Bilder erfasst, ohne den Arbeitsfluss zu stören.",
            "Schreibe eine direktere Botschaft für anspruchsvolle Nutzer, die den ganzen Tag wichtige Informationen kopieren.",
            "Formuliere Ultimate Clipboard Pro als klares Versprechen: alles erfassen, sofort ordnen und im richtigen Moment wiederfinden."
          ]
        },
        {
          id: "t2",
          category: "Recherche > Notizen",
          source: "docs.example.com",
          title: "Recherche-Zusammenfassung",
          versions: [
            "Fasse diese Quelle in Entscheidungen, Risiken, nützliche Zitate, offene Fragen und nächste Schritte mit Verantwortlichen zusammen.",
            "Erstelle eine wiederverwendbare Notiz mit Quellenkontext, Annahmen, Prüfpunkten und kurzer Schlussfolgerung."
          ]
        },
        {
          id: "t3",
          category: "Support",
          source: "helpdesk.example",
          title: "Support-Antwort",
          versions: ["Bereite eine ruhige Antwort vor, die das Problem anerkennt, die wahrscheinliche Ursache erklärt und konkrete Schritte nennt."]
        }
      ],
      code: [
        {
          id: "c1",
          category: "JavaScript",
          source: "github.com",
          title: "Debounce-Helfer",
          versions: [
            "function debounce(fn, verzoegerung = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), verzoegerung);\n  };\n}",
            "export function debounce(fn, verzoegerung = 250) {\n  let timerId;\n  return function mitDebounce(...args) {\n    window.clearTimeout(timerId);\n    timerId = window.setTimeout(() => fn.apply(this, args), verzoegerung);\n  };\n}"
          ]
        },
        {
          id: "c2",
          category: "TypeScript",
          source: "docs.example.com",
          title: "Sicheres JSON",
          versions: ["type ApiErgebnis<T> = { ok: true; data: T } | { ok: false; fehler: string };\n\nasync function sicheresJson<T>(response: Response): Promise<ApiErgebnis<T>> {\n  if (!response.ok) return { ok: false, fehler: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
        }
      ]
    }
  };

  const t = i18n[lang] || i18n.en;
  const localized = samples[lang] || samples.en;
  const data = {
    text: localized.text,
    code: localized.code,
    image: images.map((src, index) => ({
      id: `i${index + 1}`,
      category: index % 3 === 0 ? "AI images" : index % 3 === 1 ? "Design" : "Web images",
      source: "istockphoto.com",
      title: `${t.screen} ${index + 1}`,
      src
    }))
  };

  const state = {
    dockCollapsed: false,
    sideOpen: false,
    managerOpen: false,
    toolsOpen: false,
    tab: "text",
    managerTab: "text",
    versions: {},
    pinned: new Set(["t1"]),
    favorite: new Set(["c2"])
  };

  const allTextCode = () => [...data.text, ...data.code];

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
    if (label) {
      node.setAttribute("aria-label", label);
      node.title = label;
    }
    return node;
  }

  function activeVersion(item) {
    const index = state.versions[item.id] || 0;
    return { index, value: item.versions[index] || item.versions[0] };
  }

  function iconButton(label) {
    const map = { text: "Tt", code: "</>", image: "▧" };
    return el("span", "ucp-demo-tab__icon", map[label] || label);
  }

  function copyButton() {
    const node = button("ucp-demo-action ucp-demo-action--copy", "", "blocked", t.copy);
    const image = el("img");
    image.src = copyIcon;
    image.alt = "";
    node.append(image);
    return node;
  }

  function showBlocked(message = t.blocked) {
    const dialog = root.querySelector(".ucp-demo-dialog");
    if (!dialog) return;
    dialog.querySelector("h3").textContent = t.blockedTitle;
    dialog.querySelector("p").textContent = message;
    dialog.classList.add("is-open");
    window.clearTimeout(showBlocked.timer);
    showBlocked.timer = window.setTimeout(() => dialog.classList.remove("is-open"), 2600);
  }

  function renderLauncher() {
    const dock = el("section", `ucp-demo-launcher${state.dockCollapsed ? " is-collapsed" : ""}`);
    const stack = el("div", "ucp-demo-launcher__stack");
    stack.append(button("ucp-demo-launcher__tab", "", "toggle-dock", state.dockCollapsed ? t.open : t.collapse));
    const main = button("ucp-demo-launcher__button", "", "toggle-side", "Ultimate Clipboard Pro");
    const logo = el("img");
    logo.src = icon;
    logo.alt = "";
    main.append(logo);
    stack.append(main);
    stack.append(button("ucp-demo-launcher__button", "▦", "open-manager", t.manager));
    stack.append(button("ucp-demo-launcher__button is-muted", "⌘", "open-tools", t.tools));
    dock.append(stack);
    return dock;
  }

  function renderTabs(current, action) {
    const wrap = el("div", "ucp-demo-tabs");
    [["text", t.text], ["code", t.code], ["image", t.image]].forEach(([key, label]) => {
      const tab = button(`ucp-demo-tab${current === key ? " is-active" : ""}`, "", action, label);
      tab.dataset.tab = key;
      tab.append(iconButton(key));
      wrap.append(tab);
    });
    return wrap;
  }

  function renderTextCodeItem(item, type) {
    const version = activeVersion(item);
    const card = el("article", `ucp-demo-item${state.pinned.has(item.id) ? " is-pinned" : ""}`);
    card.append(el("h3", "ucp-demo-item__title", item.title));
    if (item.versions.length > 1) {
      const v = button("ucp-demo-version-badge", `V${version.index + 1}`, "next-version", t.nextVersion);
      v.dataset.id = item.id;
      card.append(v);
    }
    const textWrap = el("div", "ucp-demo-item__text-wrap");
    textWrap.append(el("p", "ucp-demo-item__text", version.value));
    card.append(textWrap);
    card.append(el("div", "ucp-demo-item__meta", `${item.category} · ${item.source}`));

    const actions = el("div", "ucp-demo-item__actions");
    const main = el("div", "ucp-demo-main-actions");
    main.append(copyButton());
    main.append(button("ucp-demo-action ucp-demo-action--classify", t.classify, "blocked", t.classify));
    main.append(button("ucp-demo-action ucp-demo-action--mini", "↻", "blocked", t.reverse));
    main.append(button("ucp-demo-action ucp-demo-action--mini", "+V", "blocked", "+V"));
    const quick = el("div", "ucp-demo-quick-actions");
    const fav = button("ucp-demo-action ucp-demo-action--mini", state.favorite.has(item.id) ? "♥" : "♡", "favorite", t.favorites);
    fav.dataset.id = item.id;
    const pin = button("ucp-demo-action ucp-demo-action--mini", state.pinned.has(item.id) ? "◆" : "◇", "pin", t.pinned);
    pin.dataset.id = item.id;
    quick.append(fav, pin, button("ucp-demo-action ucp-demo-action--mini", "■", "blocked", "Trash"));
    actions.append(main, quick);
    card.append(actions);
    card.dataset.type = type;
    return card;
  }

  function renderImageItem(item) {
    const card = el("article", `ucp-demo-item ucp-demo-item--image${state.pinned.has(item.id) ? " is-pinned" : ""}`);
    card.append(el("div", "ucp-demo-image-title", item.title));
    const area = el("button", "ucp-demo-image-copy-area");
    area.type = "button";
    area.dataset.demoAction = "blocked";
    area.setAttribute("aria-label", t.copy);
    const image = el("img");
    image.src = item.src;
    image.alt = item.title;
    image.loading = "lazy";
    image.decoding = "async";
    area.append(image);
    card.append(area);
    const overlay = el("div", "ucp-demo-image-overlay");
    overlay.append(button("ucp-demo-action", "i", "blocked", "Info"));
    overlay.append(button("ucp-demo-action", "♥", "favorite", t.favorites));
    overlay.lastChild.dataset.id = item.id;
    overlay.append(button("ucp-demo-action", "■", "blocked", "Trash"));
    card.append(overlay);
    card.append(el("div", "ucp-demo-image-meta", `${item.category} · ${item.source}`));
    const actions = el("div", "ucp-demo-image-actions");
    actions.append(copyButton());
    actions.append(button("ucp-demo-action ucp-demo-action--classify", t.classify, "blocked", t.classify));
    actions.append(button("ucp-demo-action ucp-demo-action--mini", "↻", "blocked", t.reverse));
    card.append(actions);
    return card;
  }

  function renderItem(item, type) {
    return type === "image" ? renderImageItem(item) : renderTextCodeItem(item, type);
  }

  function renderSidePanel() {
    const panel = el("section", `ucp-demo-panel${state.sideOpen ? " is-open" : ""}`);
    const header = el("div", "ucp-demo-panel__header");
    const brand = el("div", "ucp-demo-brand");
    const logo = el("img");
    logo.src = icon;
    logo.alt = "";
    const copy = el("div");
    copy.append(el("strong", "", "Ultimate Clipboard Pro"), el("span", "", `${data[state.tab].length} ${t.sideCount}`));
    brand.append(logo, copy);
    const controls = el("div", "ucp-demo-header-actions");
    controls.append(button("ucp-demo-icon-button is-active", "▦", "open-manager", t.manager));
    controls.append(button("ucp-demo-icon-button", "☰", "blocked", t.menu));
    controls.append(button("ucp-demo-icon-button", "↗", "open-manager", t.manager));
    controls.append(button("ucp-demo-close", "", "close-side", t.close));
    header.append(brand, controls);
    panel.append(header);
    panel.append(renderTabs(state.tab, "side-tab"));
    const search = el("input", "ucp-demo-search");
    search.type = "search";
    search.disabled = true;
    search.placeholder = state.tab === "text" ? t.searchText : state.tab === "code" ? t.searchCode : t.searchImage;
    panel.append(search);
    const list = el("div", "ucp-demo-list");
    data[state.tab].slice(0, state.tab === "image" ? 8 : 5).forEach((item) => list.append(renderItem(item, state.tab)));
    panel.append(list);
    return panel;
  }

  function managerTitle() {
    if (state.managerTab === "text") return t.titleAllText;
    if (state.managerTab === "code") return t.titleAllCode;
    return t.titleAllImage;
  }

  function renderCategory(label, count, active) {
    const node = button(`ucp-demo-category${active ? " is-active" : ""}`, "", "blocked", label);
    node.append(el("span", "ucp-demo-category__dot"));
    node.append(el("span", "", label));
    node.append(el("span", "ucp-demo-category__count", String(count)));
    return node;
  }

  function renderManager() {
    const manager = el("section", `ucp-demo-manager${state.managerOpen ? " is-open" : ""}`);
    const header = el("div", "ucp-demo-manager__header");
    header.append(el("h2", "", t.managerTitle));
    const controls = el("div", "ucp-demo-header-actions");
    controls.append(button("ucp-demo-icon-button", "⌘", "open-tools", t.tools));
    controls.append(button("ucp-demo-close", "", "close-manager", t.close));
    header.append(controls);
    manager.append(header);

    const layout = el("div", "ucp-demo-manager__layout");
    const sidebar = el("aside", "ucp-demo-sidebar");
    const sideSearch = el("input", "ucp-demo-sidebar__search");
    sideSearch.type = "search";
    sideSearch.disabled = true;
    sideSearch.placeholder = state.managerTab === "image" ? t.searchImage : state.managerTab === "code" ? t.searchCode : t.searchText;
    sidebar.append(sideSearch);
    const categories = state.managerTab === "text"
      ? [[t.allText, 318], [t.general, 28], ["IA", 18], ["IA > Prompts", 12], ["Recherche", 26], ["Marketing", 21], [t.favorites, 36], [t.pinned, 14], [t.vault, 6]]
      : state.managerTab === "code"
        ? [[t.allCode, 298], [t.general, 18], ["JavaScript", 10], ["TypeScript", 11], ["React", 10], ["HTML", 10], ["CSS", 9], [t.favorites, 38], [t.vault, 6]]
        : [[t.allImage, 25], [t.general, 8], ["AI images", 6], ["Design", 5], ["Web images", 7], [t.favorites, 3], [t.vault, 2]];
    categories.forEach(([label, count], index) => sidebar.append(renderCategory(label, count, index === 0)));

    const content = el("main", "ucp-demo-manager__content");
    const top = el("div", "ucp-demo-manager__topline");
    top.append(renderTabs(state.managerTab, "manager-tab"));
    top.append(el("h3", "ucp-demo-manager__title", managerTitle()));
    const search = el("input", "ucp-demo-manager__search");
    search.type = "search";
    search.disabled = true;
    search.placeholder = state.managerTab === "image" ? t.searchImage : state.managerTab === "code" ? t.searchCode : t.searchText;
    top.append(search);
    content.append(top);

    const grid = el("div", `ucp-demo-manager-grid${state.managerTab === "image" ? " is-image" : ""}`);
    data[state.managerTab].forEach((item) => grid.append(renderItem(item, state.managerTab)));
    content.append(grid);
    layout.append(sidebar, content);
    manager.append(layout);
    return manager;
  }

  function renderTools() {
    const tools = el("section", `ucp-demo-tools${state.toolsOpen ? " is-open" : ""}`);
    const header = el("div", "ucp-demo-tools__header");
    header.append(el("h2", "", t.toolsTitle), button("ucp-demo-close", "", "close-tools", t.close));
    tools.append(header);
    const grid = el("div", "ucp-demo-tools-grid");
    [
      "Screen To Text",
      "Image Prompt",
      "Prompt Architect",
      "Emojis",
      "Information Extractor",
      "Duplicate Detector",
      "Special Characters",
      "Case Converter",
      "Advanced Counter",
      "Word Replacer",
      "Text Cleaner",
      "Typography Normalizer",
      "Universal Encoder",
      "Color Picker",
      "Markdown Toolbox"
    ].forEach((name) => {
      const card = button("ucp-demo-tool-card", "", "tool-blocked", name);
      card.append(el("span", "ucp-demo-tool-icon", "□"), el("span", "", name));
      grid.append(card);
    });
    tools.append(grid);
    return tools;
  }

  function renderDialog() {
    const dialog = el("section", "ucp-demo-dialog");
    dialog.append(el("h3", "", t.blockedTitle), el("p", "", t.blocked));
    return dialog;
  }

  function render() {
    root.replaceChildren(renderLauncher(), renderSidePanel(), renderManager(), renderTools(), renderDialog());
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
      const item = allTextCode().find((entry) => entry.id === actionNode.dataset.id);
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
