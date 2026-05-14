(function initUcpDemoRuntime(global) {
  "use strict";

  const runtimeBase = "/assets/extension-runtime/";
  const supportedLanguages = ["en", "fr", "es", "it", "de"];
  const storageArea = "local";

  const copyByLang = {
    en: {
      general: "General",
      favorites: "Favorites",
      trash: "Trash",
      vault: "Vault",
      ai: "AI",
      research: "Research",
      support: "Support",
      product: "Product",
      operations: "Operations",
      design: "Design",
      web: "Web images",
      blockedTitle: "Demo mode",
      blocked: "This is the real Ultimate Clipboard Pro interface running in demo mode. This action is disabled on the website demo. Please install the extension.",
      imagePrefix: "Demo image"
    },
    fr: {
      general: "Général",
      favorites: "Favoris",
      trash: "Corbeille",
      vault: "Coffre-fort",
      ai: "IA",
      research: "Recherche",
      support: "Support",
      product: "Produit",
      operations: "Opérations",
      design: "Design",
      web: "Images web",
      blockedTitle: "Mode démo",
      blocked: "Ceci est la vraie interface Ultimate Clipboard Pro exécutée en mode démo. Cette action est désactivée sur la démo du site. Merci d'installer l'extension.",
      imagePrefix: "Image de démo"
    },
    es: {
      general: "General",
      favorites: "Favoritos",
      trash: "Papelera",
      vault: "Caja fuerte",
      ai: "IA",
      research: "Investigación",
      support: "Soporte",
      product: "Producto",
      operations: "Operaciones",
      design: "Diseño",
      web: "Imágenes web",
      blockedTitle: "Modo demo",
      blocked: "Esta es la interfaz real de Ultimate Clipboard Pro ejecutándose en modo demo. Esta acción está desactivada en la demo del sitio. Instala la extensión.",
      imagePrefix: "Imagen de demo"
    },
    it: {
      general: "Generale",
      favorites: "Preferiti",
      trash: "Cestino",
      vault: "Cassaforte",
      ai: "IA",
      research: "Ricerca",
      support: "Supporto",
      product: "Prodotto",
      operations: "Operazioni",
      design: "Design",
      web: "Immagini web",
      blockedTitle: "Modalità demo",
      blocked: "Questa è la vera interfaccia di Ultimate Clipboard Pro eseguita in modalità demo. Questa azione è disattivata nella demo del sito. Installa l'estensione.",
      imagePrefix: "Immagine demo"
    },
    de: {
      general: "Allgemein",
      favorites: "Favoriten",
      trash: "Papierkorb",
      vault: "Tresor",
      ai: "KI",
      research: "Recherche",
      support: "Support",
      product: "Produkt",
      operations: "Abläufe",
      design: "Design",
      web: "Webbilder",
      blockedTitle: "Demo-Modus",
      blocked: "Dies ist die echte Ultimate Clipboard Pro Oberfläche im Demo-Modus. Diese Aktion ist in der Website-Demo deaktiviert. Bitte installieren Sie die Erweiterung.",
      imagePrefix: "Demo-Bild"
    }
  };

  const textSamples = {
    en: [
      ["Launch promise", "Write a concise launch message for Ultimate Clipboard Pro: a Chrome extension that captures text, code and images without interrupting deep work.", "Turn the message into a sharper promise for demanding users who copy important material all day.", "Make it concrete: capture everything, organize instantly, and find the exact source again when work gets serious."],
      ["Research brief", "Summarize this source into decisions, risks, useful quotes, open questions and next actions with owners.", "Create a reusable research note with context, assumptions, verification points and a short conclusion."],
      ["Support reply", "Prepare a calm customer reply that acknowledges the issue, explains the likely cause and gives clear next steps."],
      ["Meeting follow-up", "Create a weekly operations update with progress, incidents, metrics, priorities and blockers for the next cycle."]
    ],
    fr: [
      ["Promesse de lancement", "Rédige un message de lancement concis pour Ultimate Clipboard Pro : une extension Chrome qui capture textes, codes et images sans interrompre le travail profond.", "Transforme le message en promesse plus directe pour les utilisateurs exigeants qui copient des informations importantes toute la journée.", "Rends la promesse concrète : tout capturer, organiser immédiatement et retrouver la source exacte quand le travail devient sérieux."],
      ["Note de recherche", "Résume cette source en décisions, risques, citations utiles, questions ouvertes et prochaines actions avec responsables.", "Crée une note de recherche réutilisable avec contexte, hypothèses, points de vérification et conclusion courte."],
      ["Réponse support", "Prépare une réponse client calme qui reconnaît le problème, explique la cause probable et donne des étapes claires."],
      ["Suivi d'équipe", "Crée une mise à jour hebdomadaire avec progrès, incidents, indicateurs, priorités et blocages pour le prochain cycle."]
    ],
    es: [
      ["Promesa de lanzamiento", "Escribe un mensaje breve para Ultimate Clipboard Pro: una extensión de Chrome que captura textos, códigos e imágenes sin interrumpir el trabajo profundo.", "Convierte el mensaje en una promesa más directa para usuarios exigentes que copian información importante durante todo el día.", "Hazlo concreto: capturar todo, organizar al instante y volver a encontrar la fuente exacta cuando el trabajo importa."],
      ["Informe de investigación", "Resume esta fuente en decisiones, riesgos, citas útiles, preguntas abiertas y próximas acciones con responsables.", "Crea una nota reutilizable con contexto, supuestos, puntos de verificación y una conclusión breve."],
      ["Respuesta de soporte", "Prepara una respuesta tranquila que reconozca el problema, explique la causa probable y proponga pasos claros."],
      ["Seguimiento semanal", "Crea una actualización semanal con avances, incidentes, métricas, prioridades y bloqueos para el próximo ciclo."]
    ],
    it: [
      ["Promessa di lancio", "Scrivi un messaggio conciso per Ultimate Clipboard Pro: un'estensione Chrome che cattura testi, codici e immagini senza interrompere il lavoro profondo.", "Trasforma il messaggio in una promessa più diretta per utenti esigenti che copiano informazioni importanti tutto il giorno.", "Rendila concreta: cattura tutto, organizza subito e ritrova la fonte esatta quando il lavoro diventa serio."],
      ["Sintesi di ricerca", "Riassumi questa fonte in decisioni, rischi, citazioni utili, domande aperte e prossime azioni con responsabili.", "Crea una nota riutilizzabile con contesto, ipotesi, punti di verifica e una conclusione breve."],
      ["Risposta supporto", "Prepara una risposta calma che riconosca il problema, spieghi la causa probabile e proponga passaggi chiari."],
      ["Aggiornamento settimanale", "Crea un aggiornamento settimanale con progressi, incidenti, metriche, priorità e blocchi per il prossimo ciclo."]
    ],
    de: [
      ["Launch-Versprechen", "Schreibe eine kurze Botschaft für Ultimate Clipboard Pro: eine Chrome-Erweiterung, die Texte, Code und Bilder erfasst, ohne konzentrierte Arbeit zu stören.", "Formuliere daraus ein stärkeres Versprechen für anspruchsvolle Nutzer, die den ganzen Tag wichtige Inhalte kopieren.", "Mach es konkret: alles erfassen, sofort ordnen und die genaue Quelle wiederfinden, wenn es darauf ankommt."],
      ["Recherche-Briefing", "Fasse diese Quelle in Entscheidungen, Risiken, nützliche Zitate, offene Fragen und nächste Schritte mit Verantwortlichen zusammen.", "Erstelle eine wiederverwendbare Notiz mit Kontext, Annahmen, Prüfpunkten und kurzer Schlussfolgerung."],
      ["Support-Antwort", "Bereite eine ruhige Antwort vor, die das Problem anerkennt, die wahrscheinliche Ursache erklärt und klare Schritte nennt."],
      ["Wochenupdate", "Erstelle ein wöchentliches Update mit Fortschritt, Vorfällen, Kennzahlen, Prioritäten und Blockern für den nächsten Zyklus."]
    ]
  };

  const codeSamples = {
    en: [
      ["Debounce helper", "function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}", "export function debounce(fn, delay = 250) {\n  let timerId;\n  return function debounced(...args) {\n    window.clearTimeout(timerId);\n    timerId = window.setTimeout(() => fn.apply(this, args), delay);\n  };\n}"],
      ["Safe JSON", "type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };\n\nasync function safeJson<T>(response: Response): Promise<ApiResult<T>> {\n  if (!response.ok) return { ok: false, error: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
    ],
    fr: [
      ["Fonction debounce", "function debounce(fn, delai = 250) {\n  let minuteur;\n  return (...args) => {\n    clearTimeout(minuteur);\n    minuteur = setTimeout(() => fn(...args), delai);\n  };\n}", "export function debounce(fn, delai = 250) {\n  let idMinuteur;\n  return function avecDebounce(...args) {\n    window.clearTimeout(idMinuteur);\n    idMinuteur = window.setTimeout(() => fn.apply(this, args), delai);\n  };\n}"],
      ["JSON sécurisé", "type ResultatApi<T> = { ok: true; data: T } | { ok: false; erreur: string };\n\nasync function jsonSur<T>(response: Response): Promise<ResultatApi<T>> {\n  if (!response.ok) return { ok: false, erreur: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
    ],
    es: [
      ["Ayudante debounce", "function debounce(fn, retraso = 250) {\n  let temporizador;\n  return (...args) => {\n    clearTimeout(temporizador);\n    temporizador = setTimeout(() => fn(...args), retraso);\n  };\n}", "export function debounce(fn, retraso = 250) {\n  let idTemporizador;\n  return function conDebounce(...args) {\n    window.clearTimeout(idTemporizador);\n    idTemporizador = window.setTimeout(() => fn.apply(this, args), retraso);\n  };\n}"],
      ["JSON seguro", "type ResultadoApi<T> = { ok: true; data: T } | { ok: false; error: string };\n\nasync function jsonSeguro<T>(response: Response): Promise<ResultadoApi<T>> {\n  if (!response.ok) return { ok: false, error: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
    ],
    it: [
      ["Helper debounce", "function debounce(fn, ritardo = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ritardo);\n  };\n}", "export function debounce(fn, ritardo = 250) {\n  let idTimer;\n  return function conDebounce(...args) {\n    window.clearTimeout(idTimer);\n    idTimer = window.setTimeout(() => fn.apply(this, args), ritardo);\n  };\n}"],
      ["JSON sicuro", "type RisultatoApi<T> = { ok: true; data: T } | { ok: false; errore: string };\n\nasync function jsonSicuro<T>(response: Response): Promise<RisultatoApi<T>> {\n  if (!response.ok) return { ok: false, errore: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
    ],
    de: [
      ["Debounce-Helfer", "function debounce(fn, verzoegerung = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), verzoegerung);\n  };\n}", "export function debounce(fn, verzoegerung = 250) {\n  let timerId;\n  return function mitDebounce(...args) {\n    window.clearTimeout(timerId);\n    timerId = window.setTimeout(() => fn.apply(this, args), verzoegerung);\n  };\n}"],
      ["Sicheres JSON", "type ApiErgebnis<T> = { ok: true; data: T } | { ok: false; fehler: string };\n\nasync function sicheresJson<T>(response: Response): Promise<ApiErgebnis<T>> {\n  if (!response.ok) return { ok: false, fehler: response.statusText };\n  return { ok: true, data: await response.json() as T };\n}"]
    ]
  };

  function resolveLanguage() {
    const queryLang = new URLSearchParams(global.location.search).get("lang");
    if (supportedLanguages.includes(queryLang)) return queryLang;
    const first = global.location.pathname.split("/").filter(Boolean)[0];
    return supportedLanguages.includes(first) ? first : "en";
  }

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function iconUrl(name) {
    return `${runtimeBase}assets/icons/${name}`;
  }

  function makeVersions(id, title, versions, baseTime) {
    return versions.map((content, index) => ({
      id: `${id}-v${index + 1}`,
      title: index === 0 ? title : `${title} V${index + 1}`,
      content,
      preview: content.slice(0, 260),
      note: "",
      createdAt: baseTime + index * 3600000,
      updatedAt: baseTime + index * 3600000
    }));
  }

  function textItems(language) {
    const now = Date.now();
    return textSamples[language].map(([title, ...versions], index) => {
      const id = `demo-text-${index + 1}`;
      const captureVersions = makeVersions(id, title, versions, now - (index + 1) * 86400000);
      const categoryIds = ["ai", "research", "support", "operations"];
      const l = copyByLang[language];
      return {
        id,
        title,
        content: versions[0],
        preview: versions[0].slice(0, 260),
        note: index === 0 ? "Demo Pro workspace" : "",
        categoryId: categoryIds[index] || "general",
        categoryName: [l.ai, l.research, l.support, l.operations][index] || l.general,
        sourceUrl: index === 0 ? "https://chatgpt.com/" : "https://docs.example.com/",
        sourceDomain: index === 0 ? "chatgpt.com" : "docs.example.com",
        sourceFaviconUrl: iconUrl("favicon_generic.png"),
        sourceTitle: title,
        createdAt: captureVersions[0].createdAt,
        updatedAt: captureVersions[captureVersions.length - 1].updatedAt,
        isFavorite: index === 1,
        isPinned: index === 0,
        captureVersions,
        activeVersionId: captureVersions[0].id,
        tags: []
      };
    });
  }

  function devItems(language) {
    const now = Date.now();
    return codeSamples[language].map(([title, ...versions], index) => {
      const id = `demo-code-${index + 1}`;
      const captureVersions = makeVersions(id, title, versions, now - (index + 6) * 86400000);
      return {
        id,
        title,
        content: versions[0],
        preview: versions[0].slice(0, 260),
        note: "",
        categoryId: index === 0 ? "javascript" : "typescript",
        categoryName: index === 0 ? "JavaScript" : "TypeScript",
        languageId: index === 0 ? "javascript" : "typescript",
        languageName: index === 0 ? "JavaScript" : "TypeScript",
        sourceUrl: "https://github.com/",
        sourceDomain: "github.com",
        sourceFaviconUrl: iconUrl("favicon_generic.png"),
        sourceTitle: title,
        createdAt: captureVersions[0].createdAt,
        updatedAt: captureVersions[captureVersions.length - 1].updatedAt,
        isFavorite: index === 1,
        isPinned: index === 0,
        captureVersions,
        activeVersionId: captureVersions[0].id,
        tags: []
      };
    });
  }

  function imageItems(language) {
    const now = Date.now();
    const l = copyByLang[language];
    return Array.from({ length: 15 }, (_, index) => {
      const imageUrl = `/assets/demo/${index + 1}.jpg`;
      return {
        id: `demo-image-${index + 1}`,
        title: `${l.imagePrefix} ${index + 1}`,
        altText: `${l.imagePrefix} ${index + 1}`,
        categoryId: index % 3 === 0 ? "image-ai" : index % 3 === 1 ? "image-design" : "image-web",
        categoryName: index % 3 === 0 ? "AI images" : index % 3 === 1 ? l.design : l.web,
        imageUrl,
        thumbnailUrl: imageUrl,
        originalImageUrl: imageUrl,
        sourceUrl: "https://istockphoto.com/",
        sourceDomain: "istockphoto.com",
        sourceFaviconUrl: iconUrl("favicon_generic.png"),
        createdAt: now - (index + 1) * 4200000,
        updatedAt: now - (index + 1) * 4200000,
        isFavorite: index === 2,
        isPinned: index === 0,
        isScreenshot: index % 5 === 0,
        tags: []
      };
    });
  }

  function categories(language) {
    const l = copyByLang[language];
    return [
      { id: "general", name: l.general, parentId: null, icon: "inbox", color: "#64748b", isSystem: true, isDefault: true, createdAt: 0, order: 1 },
      { id: "favorites", name: l.favorites, parentId: null, icon: "heart", color: "#a855f7", isSystem: true, createdAt: 0, order: 2 },
      { id: "trash", name: l.trash, parentId: null, icon: "trash", color: "#ef4444", isSystem: true, createdAt: 0, order: 3 },
      { id: "vault", name: l.vault, parentId: null, icon: "vault", color: "#f59e0b", isSystem: true, createdAt: 0, order: 4 },
      { id: "ai", name: l.ai, parentId: null, icon: "dot", color: "#7c3aed", createdAt: 1, order: 10 },
      { id: "research", name: l.research, parentId: null, icon: "dot", color: "#22c55e", createdAt: 1, order: 11 },
      { id: "support", name: l.support, parentId: null, icon: "dot", color: "#0ea5e9", createdAt: 1, order: 12 },
      { id: "operations", name: l.operations, parentId: null, icon: "dot", color: "#f97316", createdAt: 1, order: 13 }
    ];
  }

  function devCategories(language) {
    const l = copyByLang[language];
    return [
      { id: "dev-general", name: l.general, parentId: null, icon: "inbox", color: "#64748b", isSystem: true, isDefault: true, createdAt: 0, order: 1 },
      { id: "dev-favorites", name: l.favorites, parentId: null, icon: "heart", color: "#a855f7", isSystem: true, createdAt: 0, order: 2 },
      { id: "dev-trash", name: l.trash, parentId: null, icon: "trash", color: "#ef4444", isSystem: true, createdAt: 0, order: 3 },
      { id: "dev-vault", name: l.vault, parentId: null, icon: "vault", color: "#f59e0b", isSystem: true, createdAt: 0, order: 4 },
      { id: "javascript", name: "JavaScript", parentId: null, icon: "dot", color: "#f7df1e", createdAt: 1, order: 10 },
      { id: "typescript", name: "TypeScript", parentId: null, icon: "dot", color: "#3178c6", createdAt: 1, order: 11 },
      { id: "react", name: "React", parentId: null, icon: "dot", color: "#61dafb", createdAt: 1, order: 12 }
    ];
  }

  function imageCategories(language) {
    const l = copyByLang[language];
    return [
      { id: "image-general", name: l.general, parentId: null, icon: "inbox", color: "#64748b", isSystem: true, isDefault: true, createdAt: 0, order: 1 },
      { id: "image-favorites", name: l.favorites, parentId: null, icon: "heart", color: "#a855f7", isSystem: true, createdAt: 0, order: 2 },
      { id: "image-trash", name: l.trash, parentId: null, icon: "trash", color: "#ef4444", isSystem: true, createdAt: 0, order: 3 },
      { id: "image-vault", name: l.vault, parentId: null, icon: "vault", color: "#f59e0b", isSystem: true, createdAt: 0, order: 4 },
      { id: "image-ai", name: "AI images", parentId: null, icon: "dot", color: "#7c3aed", createdAt: 1, order: 10 },
      { id: "image-design", name: l.design, parentId: null, icon: "dot", color: "#ec4899", createdAt: 1, order: 11 },
      { id: "image-web", name: l.web, parentId: null, icon: "dot", color: "#06b6d4", createdAt: 1, order: 12 }
    ];
  }

  function createDemoState(language = resolveLanguage()) {
    const settings = {
      captureEnabled: true,
      imageCaptureEnabled: true,
      devCaptureEnabled: true,
      privateMode: false,
      askCategoryAfterCopy: false,
      classificationMode: "generalByDefault",
      language,
      languageSource: "manual",
      excludedDomains: [],
      theme: "dark",
      accentColor: "#7c3aed",
      showScreenshotFloatingButton: true,
      keepFavoritesOnClear: true,
      keepImageFavoritesOnClear: true,
      searchFavoritesFirst: true,
      searchMaxResults: 80,
      confirmBeforeDelete: true,
      confirmUnsavedEdits: true,
      copyAfterSave: false,
      captureAiCopyButtons: true,
      activeDisplayIds: [],
      settingsUpdatedAt: Date.now(),
      onboardingCompleted: true,
      floatingLauncherOpenedOnce: true,
      managerOpenedOnce: true,
      floatingLauncherBottom: 94,
      floatingLauncherCollapsed: false,
      managerImageViewMode: "medium",
      managerTextViewMode: "card",
      managerDevViewMode: "card",
      demoMode: true,
      driveSyncEnabled: false,
      driveSyncFrequency: "manual",
      dodoEnv: "live",
      licenseKey: "DEMO-LIFETIME-PRO",
      licenseKeyLast4: "PRO",
      licenseKeyInstanceId: "demo-instance",
      licenseStatus: "active",
      licenseActivatedAt: Date.now() - 86400000,
      licenseLastVerifiedAt: Date.now(),
      licenseLastSuccessfulVerifiedAt: Date.now(),
      licenseDodoEnv: "live",
      licenseProductName: "Ultimate Clipboard Pro - Lifetime License",
      licensePlanId: "pro_lifetime",
      licenseProof: "demo-proof",
      licenseProofVersion: "v1",
      licenseIntegrityLastCheckedAt: Date.now(),
      plan: "pro"
    };
    return {
      settings,
      items: textItems(language),
      categories: categories(language),
      imageItems: imageItems(language),
      imageCategories: imageCategories(language),
      devItems: devItems(language),
      devCategories: devCategories(language),
      snippets: [],
      templates: [],
      license: { plan: "pro", status: "active" }
    };
  }

  function makeStateBridge(language, callbacks = {}) {
    const state = createDemoState(language);
    const listeners = [];
    const changeListeners = [];
    const store = {
      mcp_settings: state.settings,
      mcp_clipboard_items: state.items,
      mcp_categories: state.categories,
      mcp_image_items: state.imageItems,
      mcp_image_categories: state.imageCategories,
      mcp_dev_items: state.devItems,
      mcp_dev_categories: state.devCategories,
      mcp_snippets: [],
      mcp_templates: [],
      mcp_manager_view_state: {},
      mcp_vault_auth: {
        version: 1,
        algorithm: "PBKDF2-SHA-256",
        iterations: 250000,
        salt: "AAAAAAAAAAAAAAAAAAAAAA==",
        hash: "demo-vault-hash",
        recovery: {
          questionId: "1",
          iterations: 250000,
          salt: "AAAAAAAAAAAAAAAAAAAAAA==",
          hash: "demo-vault-recovery"
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };

    function showBlocked() {
      callbacks.showBlocked?.();
      return { ok: false, error: "Demo mode" };
    }

    function isDemoDisplayOnlyUpdate(updates = {}) {
      const allowedKeys = new Set(["activeVersionId", "lastViewedVersionId"]);
      const keys = Object.keys(updates || {});
      return keys.length > 0 && keys.every((key) => allowedKeys.has(key));
    }

    function currentState() {
      state.settings = store.mcp_settings;
      state.items = store.mcp_clipboard_items;
      state.categories = store.mcp_categories;
      state.imageItems = store.mcp_image_items;
      state.imageCategories = store.mcp_image_categories;
      state.devItems = store.mcp_dev_items;
      state.devCategories = store.mcp_dev_categories;
      state.snippets = store.mcp_snippets || [];
      state.templates = store.mcp_templates || [];
      return clone(state);
    }

    function storageGet(keys, callback) {
      let result = {};
      if (!keys) {
        result = clone(store);
      } else if (typeof keys === "string") {
        result[keys] = clone(store[keys]);
      } else if (Array.isArray(keys)) {
        keys.forEach((key) => {
          result[key] = clone(store[key]);
        });
      } else if (typeof keys === "object") {
        Object.keys(keys).forEach((key) => {
          result[key] = store[key] === undefined ? keys[key] : clone(store[key]);
        });
      }
      if (typeof callback === "function") {
        queueMicrotask(() => callback(result));
        return undefined;
      }
      return Promise.resolve(result);
    }

    function storageSet(data = {}, callback) {
      const changes = {};
      Object.entries(data).forEach(([key, value]) => {
        changes[key] = { oldValue: clone(store[key]), newValue: clone(value) };
        store[key] = clone(value);
      });
      changeListeners.slice().forEach((listener) => listener(changes, storageArea));
      if (typeof callback === "function") queueMicrotask(callback);
      return Promise.resolve();
    }

    function storageRemove(keys, callback) {
      const list = Array.isArray(keys) ? keys : [keys];
      const changes = {};
      list.filter(Boolean).forEach((key) => {
        changes[key] = { oldValue: clone(store[key]), newValue: undefined };
        delete store[key];
      });
      changeListeners.slice().forEach((listener) => listener(changes, storageArea));
      if (typeof callback === "function") queueMicrotask(callback);
      return Promise.resolve();
    }

    function dispatch(type, payload = {}) {
      listeners.slice().forEach((listener) => {
        try {
          listener(Object.assign({ type }, payload), {}, () => {});
        } catch (error) {
          console.warn("[UCP demo listener]", error);
        }
      });
    }

    function updateItemList(key, itemId, updates) {
      store[key] = (store[key] || []).map((item) => item.id === itemId ? Object.assign({}, item, updates || {}) : item);
    }

    async function sendMessage(message = {}) {
      const type = String(message.type || "");
      if (type === "MCP_GET_STATE") return { ok: true, data: currentState() };
      if (type === "MCP_GET_DISPLAY_INFO") return { ok: true, data: { displays: [{ id: "demo-display", name: "Demo display", isPrimary: true }] } };
      if (type === "MCP_CHECK_DISPLAY_ALLOWED") return { ok: true, data: { allowed: true } };
      if (type === "MCP_DODO_GET_LICENSE_STATUS") return { ok: true, data: { isPro: true, licenseStatus: "active", dodoEnv: "live", plan: "pro" } };
      if (type === "MCP_DRIVE_GET_STATUS") return { ok: true, data: { connected: false, syncEnabled: false } };
      if (type === "MCP_OPEN_MANAGER") {
        callbacks.openManager?.(message);
        return { ok: true };
      }
      if (type === "MCP_CLOSE_FLOATING_PANEL") {
        callbacks.closeManager?.();
        return { ok: true };
      }
      if (type === "MCP_CLOSE_FLOATING_PANEL") {
        callbacks.closeManager?.();
        return { ok: true };
      }
      if (type === "MCP_DEMO_BLOCKED") return showBlocked();
      if (type === "MCP_UPDATE_ITEM") {
        if (!isDemoDisplayOnlyUpdate(message.updates || {})) return showBlocked();
        updateItemList("mcp_clipboard_items", message.itemId, message.updates);
        dispatch("ITEM_UPDATED", { itemId: message.itemId, updates: message.updates || {} });
        return { ok: true };
      }
      if (type === "MCP_UPDATE_DEV_ITEM") {
        if (!isDemoDisplayOnlyUpdate(message.updates || {})) return showBlocked();
        updateItemList("mcp_dev_items", message.itemId, message.updates);
        dispatch("DEV_UPDATED", { itemId: message.itemId, updates: message.updates || {} });
        return { ok: true };
      }
      if (type === "MCP_UPDATE_IMAGE_ITEM") {
        if (!isDemoDisplayOnlyUpdate(message.updates || {})) return showBlocked();
        updateItemList("mcp_image_items", message.itemId, message.updates);
        dispatch("IMAGE_UPDATED", { itemId: message.itemId, updates: message.updates || {} });
        return { ok: true };
      }
      if (type === "MCP_FETCH_IMAGE_AS_DATA_URL") return { ok: true, dataUrl: message.url || "", data: { dataUrl: message.url || "" } };
      if (type === "MCP_OPEN_TOOLS_OVERLAY") {
        return { ok: false, error: "Demo manager should open its local tools window." };
      }
      if (/COPY|CREATE|DELETE|OPEN_OPTIONS|OPEN_SOURCE|CAPTURE|DRIVE|DODO|RUN_OCR|START_|CLEAR|RESTORE|ACTIVATE|VALIDATE|RESET|SEARCH_OVERLAY/.test(type)) {
        return showBlocked();
      }
      return { ok: true };
    }

    function installChromeMock() {
      global.chrome = {
        runtime: {
          id: "ultimate-clipboard-pro-demo",
          getManifest: () => ({ name: "Ultimate Clipboard Pro Demo", version: "demo" }),
          getURL: (path) => `${runtimeBase}${String(path || "").replace(/^\/+/, "")}`,
          sendMessage,
          onMessage: {
            addListener: (listener) => listeners.push(listener),
            removeListener: (listener) => {
              const index = listeners.indexOf(listener);
              if (index >= 0) listeners.splice(index, 1);
            }
          }
        },
        storage: {
          local: { get: storageGet, set: storageSet, remove: storageRemove },
          onChanged: {
            addListener: (listener) => changeListeners.push(listener),
            removeListener: (listener) => {
              const index = changeListeners.indexOf(listener);
              if (index >= 0) changeListeners.splice(index, 1);
            }
          }
        },
        i18n: {
          getMessage: (key) => key,
          getAcceptLanguages: (callback) => {
            const values = [language, "en"];
            if (typeof callback === "function") {
              queueMicrotask(() => callback(values));
              return undefined;
            }
            return Promise.resolve(values);
          }
        },
        tabs: { query: () => Promise.resolve([]), create: () => Promise.resolve(null) },
        windows: { getCurrent: () => Promise.resolve({ id: 1 }) }
      };
    }

    return { state, store, currentState, storageGet, storageSet, dispatch, installChromeMock };
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadSharedScripts() {
    const scripts = [
      "shared/constants.js",
      "shared/utils.js",
      "shared/locales/en.js",
      "shared/locales/fr.js",
      "shared/locales/de.js",
      "shared/locales/es.js",
      "shared/locales/it.js",
      "shared/i18n.js",
      "shared/dodoConfig.js",
      "shared/featureGate.js",
      "shared/search.js",
      "shared/defaultCategories.js",
      "shared/defaultImageCategories.js",
      "shared/defaultDevCategories.js",
      "shared/codeDetector.js",
      "shared/tools.js",
      "shared/classifier.js",
      "shared/storage.js",
      "shared/licenseManager.js",
      "shared/clipboard.js"
    ];
    for (const script of scripts) await loadScript(`${runtimeBase}${script}`);
  }

  global.UCP_DEMO_RUNTIME = {
    runtimeBase,
    supportedLanguages,
    resolveLanguage,
    createDemoState,
    makeStateBridge,
    loadSharedScripts,
    loadScript,
    copyByLang
  };
})(window);
