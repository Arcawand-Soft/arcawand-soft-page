(function initWelcomePreview(global) {
  "use strict";

  function buildWelcomePreviewItemVersions(baseId, title, contents) {
    const now = Date.now();
    return contents.map((content, index) => ({
      id: `${baseId}-v${index + 1}`,
      title: index === 0 ? title : `${title} V${index + 1}`,
      content,
      note: "",
      createdAt: now - (contents.length - index) * 420000,
      updatedAt: now - (contents.length - index) * 240000
    }));
  }

  function welcomePreviewStrings(language = "en") {
    const strings = {
      fr: {
        textTitle: "Compte rendu produit",
        textVersions: [
          "Synthétiser la décision produit, noter les risques et garder les prochaines actions visibles pour l'équipe design.",
          "Synthétiser la décision produit, noter les risques, ajouter les propriétaires et garder les prochaines actions visibles.",
          "Résumer la décision produit, garder les prochaines actions visibles et conserver la source originale pour retrouver la page exacte plus tard."
        ],
        codeTitle: "Debounce partagé",
        codeVersions: [
          "function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
          "export function debounce(fn, delay = 250) {\n  let timer = 0;\n  return (...args) => {\n    window.clearTimeout(timer);\n    timer = window.setTimeout(() => fn(...args), delay);\n  };\n}"
        ],
        product: "Produit",
        roadmap: "Feuille de route",
        javascript: "JavaScript",
        extension: "Extension",
        imageTitle: "Capture d'interface"
      },
      es: {
        textTitle: "Resumen de producto",
        textVersions: [
          "Sintetizar la decisión de producto, anotar los riesgos y mantener visibles las próximas acciones para el equipo de diseño.",
          "Sintetizar la decisión de producto, añadir responsables y mantener visibles las próximas acciones.",
          "Resumir la decisión de producto, mantener visibles las próximas acciones y conservar la fuente original para volver a la página exacta."
        ],
        codeTitle: "Debounce compartido",
        codeVersions: [
          "function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
          "export function debounce(fn, delay = 250) {\n  let timer = 0;\n  return (...args) => {\n    window.clearTimeout(timer);\n    timer = window.setTimeout(() => fn(...args), delay);\n  };\n}"
        ],
        product: "Producto",
        roadmap: "Hoja de ruta",
        javascript: "JavaScript",
        extension: "Extensión",
        imageTitle: "Captura de interfaz"
      },
      it: {
        textTitle: "Sintesi prodotto",
        textVersions: [
          "Sintetizzare la decisione di prodotto, annotare i rischi e mantenere visibili le prossime azioni per il team design.",
          "Sintetizzare la decisione di prodotto, aggiungere i responsabili e mantenere visibili le prossime azioni.",
          "Riassumere la decisione di prodotto, mantenere visibili le prossime azioni e conservare la fonte originale per ritrovare la pagina esatta."
        ],
        codeTitle: "Debounce condiviso",
        codeVersions: [
          "function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
          "export function debounce(fn, delay = 250) {\n  let timer = 0;\n  return (...args) => {\n    window.clearTimeout(timer);\n    timer = window.setTimeout(() => fn(...args), delay);\n  };\n}"
        ],
        product: "Prodotto",
        roadmap: "Roadmap",
        javascript: "JavaScript",
        extension: "Estensione",
        imageTitle: "Cattura interfaccia"
      },
      de: {
        textTitle: "Produktnotiz",
        textVersions: [
          "Produktentscheidung zusammenfassen, Risiken notieren und die nächsten Schritte für das Designteam sichtbar halten.",
          "Produktentscheidung zusammenfassen, Verantwortliche ergänzen und die nächsten Schritte sichtbar halten.",
          "Produktentscheidung zusammenfassen, nächste Schritte sichtbar halten und die Originalquelle bewahren, um die exakte Seite später wiederzufinden."
        ],
        codeTitle: "Gemeinsames Debounce",
        codeVersions: [
          "function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
          "export function debounce(fn, delay = 250) {\n  let timer = 0;\n  return (...args) => {\n    window.clearTimeout(timer);\n    timer = window.setTimeout(() => fn(...args), delay);\n  };\n}"
        ],
        product: "Produkt",
        roadmap: "Roadmap",
        javascript: "JavaScript",
        extension: "Erweiterung",
        imageTitle: "Interface-Screenshot"
      },
      en: {
        textTitle: "Product decision note",
        textVersions: [
          "Summarize the product decision, note the risks and keep next actions visible for the design team.",
          "Summarize the product decision, add owners and keep next actions visible for the team.",
          "Summarize the product decision, keep next actions visible and preserve the original source so the team can return to the exact page later."
        ],
        codeTitle: "Shared debounce",
        codeVersions: [
          "function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
          "export function debounce(fn, delay = 250) {\n  let timer = 0;\n  return (...args) => {\n    window.clearTimeout(timer);\n    timer = window.setTimeout(() => fn(...args), delay);\n  };\n}"
        ],
        product: "Product",
        roadmap: "Roadmap",
        javascript: "JavaScript",
        extension: "Extension",
        imageTitle: "Interface capture"
      }
    };
    return strings[language] || strings.en;
  }

  function welcomePreviewDataset(language = "en") {
    const codeSamples = [
      {
        id: "debounce",
        categoryId: "javascript",
        domain: "workspace.example.com",
        url: "https://workspace.example.com/snippets/debounce",
        versions: [
          "function debounce(fn, delay = 250) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
          "export function debounce(fn, delay = 250) {\n  let timer = 0;\n  return (...args) => {\n    window.clearTimeout(timer);\n    timer = window.setTimeout(() => fn(...args), delay);\n  };\n}"
        ]
      },
      {
        id: "retry",
        categoryId: "network",
        domain: "github.com",
        url: "https://github.com/arcawand/retry-helper",
        favorite: true,
        versions: [
          "async function fetchWithRetry(url, options = {}, retries = 3) {\n  let lastError;\n  for (let attempt = 1; attempt <= retries; attempt += 1) {\n    try {\n      const response = await fetch(url, options);\n      if (response.ok) return response.json();\n      lastError = new Error(`HTTP ${response.status}`);\n    } catch (error) {\n      lastError = error;\n    }\n    await new Promise((resolve) => setTimeout(resolve, attempt * 350));\n  }\n  throw lastError;\n}",
          "async function fetchWithRetry(url, options = {}, retries = 3) {\n  let lastError;\n  for (let attempt = 1; attempt <= retries; attempt += 1) {\n    try {\n      const response = await fetch(url, options);\n      if (response.ok) return await response.json();\n      if (response.status < 500) throw new Error(`HTTP ${response.status}`);\n      lastError = new Error(`HTTP ${response.status}`);\n    } catch (error) {\n      lastError = error;\n    }\n    await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** (attempt - 1)));\n  }\n  throw lastError;\n}"
        ]
      },
      {
        id: "search-hook",
        categoryId: "react",
        domain: "github.com",
        url: "https://github.com/arcawand/use-clipboard-search",
        pinned: true,
        versions: [
          "function useClipboardSearch(items, query) {\n  return useMemo(() => {\n    const term = query.trim().toLowerCase();\n    if (!term) return items;\n    return items.filter((item) => [item.title, item.content, item.note, item.sourceUrl]\n      .join(' ')\n      .toLowerCase()\n      .includes(term));\n  }, [items, query]);\n}",
          "function useClipboardSearch(items, query) {\n  return useMemo(() => {\n    const term = query.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().trim();\n    if (!term) return items;\n    return items.filter((item) => [item.title, item.content, item.note, item.sourceUrl]\n      .join(' ')\n      .normalize('NFD')\n      .replace(/[\\u0300-\\u036f]/g, '')\n      .toLowerCase()\n      .includes(term));\n  }, [items, query]);\n}"
        ]
      },
      {
        id: "card-css",
        categoryId: "css",
        domain: "codepen.io",
        url: "https://codepen.io/arcawand/capture-card",
        versions: [
          ".capture-card {\n  display: grid;\n  gap: 10px;\n  min-height: 168px;\n  border-radius: 14px;\n  background: var(--surface);\n}\n\n.capture-card__content {\n  overflow: hidden;\n  mask-image: linear-gradient(to bottom, transparent 0, #000 18px, #000 calc(100% - 28px), transparent 100%);\n}",
          ".capture-card {\n  display: grid;\n  gap: 10px;\n  min-height: clamp(168px, 24vh, 240px);\n  border-radius: 14px;\n  background: var(--surface);\n}\n\n.capture-card__content {\n  overflow: hidden;\n  padding-block: 18px 28px;\n  mask-image: linear-gradient(to bottom, transparent 0, #000 18px, #000 calc(100% - 28px), transparent 100%);\n}"
        ]
      },
      {
        id: "calendar",
        categoryId: "automation",
        domain: "github.com",
        url: "https://github.com/arcawand/calendar-reducer",
        versions: [
          "function calendarReducer(days, capture) {\n  const key = new Date(capture.createdAt).toISOString().slice(0, 10);\n  return {\n    ...days,\n    [key]: {\n      count: (days[key]?.count || 0) + 1,\n      latestAt: Math.max(days[key]?.latestAt || 0, capture.createdAt)\n    }\n  };\n}",
          "function calendarReducer(days, capture) {\n  const date = new Date(capture.createdAt);\n  const key = new Intl.DateTimeFormat('en-CA').format(date);\n  const bucket = days[key] || { count: 0, latestAt: 0, types: {} };\n  return {\n    ...days,\n    [key]: {\n      count: bucket.count + 1,\n      latestAt: Math.max(bucket.latestAt, capture.createdAt),\n      types: { ...bucket.types, [capture.type]: (bucket.types[capture.type] || 0) + 1 }\n    }\n  };\n}"
        ]
      }
    ];
    const datasets = {
      fr: {
        general: "Général",
        imageTitle: "Capture d'interface",
        categories: [
          { id: "general", name: "Général" },
          { id: "product", name: "Produit" },
          { id: "roadmap", parentId: "product", name: "Feuille de route" },
          { id: "research", parentId: "product", name: "Recherche utilisateur" },
          { id: "meetings", name: "Réunions" },
          { id: "support", name: "Support client" },
          { id: "ai", name: "IA" },
          { id: "prompts", parentId: "ai", name: "Prompts" }
        ],
        devCategories: [
          { id: "dev-general", name: "Général" },
          { id: "javascript", name: "JavaScript" },
          { id: "react", parentId: "javascript", name: "React" },
          { id: "network", parentId: "javascript", name: "API réseau" },
          { id: "css", name: "CSS" },
          { id: "automation", name: "Automatisation" }
        ],
        textItems: [
          { id: "launch-plan", title: "Plan de lancement", categoryId: "roadmap", domain: "notion.so", url: "https://notion.so/arcawand/lancement", pinned: true, favorite: true, versions: ["Préparer le lancement avec une séquence en trois temps : finaliser la page produit, vérifier les captures de démonstration et rédiger un message court pour les premiers utilisateurs.", "Préparer le lancement avec une séquence en trois temps : finaliser la page produit, vérifier les captures de démonstration, préparer la FAQ et rédiger un message court pour les premiers utilisateurs.", "Préparer le lancement avec une séquence en trois temps : finaliser la page produit, vérifier les captures de démonstration, préparer la FAQ, puis programmer un rappel pour relancer les utilisateurs qui ont laissé leur email."] },
          { id: "meeting-summary", title: "Résumé réunion UX", categoryId: "meetings", domain: "meet.google.com", url: "https://meet.google.com/ucp-demo", versions: ["Décision : garder le flux de capture très direct. Les utilisateurs veulent retrouver rapidement un texte, un code ou une image sans devoir organiser chaque élément manuellement.", "Décision : garder le flux de capture très direct. Ajouter un rappel visuel après capture et rendre les titres modifiables sans ouvrir de fenêtre lourde."] },
          { id: "support-reply", title: "Réponse support Drive", categoryId: "support", domain: "help.arcawand-soft.com", url: "https://help.arcawand-soft.com/drive-sync", favorite: true, versions: ["Bonjour, si le dossier Drive a été supprimé, l'extension garde vos données locales. Reconnectez Drive ou lancez une nouvelle synchronisation pour recréer une sauvegarde propre.", "Bonjour, si le dossier Drive a été supprimé, l'extension garde vos données locales. Ouvrez Paramètres > Sauvegarde locale et restauration, puis lancez une synchronisation pour recréer le dossier Drive proprement."] },
          { id: "prompt-saas", title: "Prompt vidéo SaaS", categoryId: "prompts", domain: "chatgpt.com", url: "https://chatgpt.com/c/video-script", versions: ["Crée un script vidéo court pour présenter une extension Chrome premium qui capture textes, codes et images, avec un ton clair, moderne et orienté productivité.", "Crée un script vidéo court pour présenter Ultimate Clipboard Pro : montrer le problème des copies perdues, la capture automatique, la recherche avancée, les versions et la synchronisation Drive."] },
          { id: "research-note", title: "Note recherche utilisateur", categoryId: "research", domain: "docs.google.com", url: "https://docs.google.com/document/d/research", versions: ["Les utilisateurs intensifs copient surtout des blocs réutilisables : prompts, réponses client, extraits de code, liens de référence et captures d'écran. Leur douleur principale n'est pas la copie, mais la perte du contexte source.", "Les utilisateurs intensifs copient surtout des blocs réutilisables. Leur douleur principale n'est pas la copie, mais la perte du contexte source, d'où l'importance du reverse et des URLs dans la recherche."] },
          { id: "sales-note", title: "Argumentaire Pro", categoryId: "product", domain: "arcawand-soft.com", url: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/", pinned: true, versions: ["Ultimate Clipboard Pro devient précieux dès que l'utilisateur copie plusieurs fois par jour. Les versions, le coffre-fort, la recherche par calendrier et Drive transforment un simple historique en espace de travail.", "Ultimate Clipboard Pro devient précieux dès que l'utilisateur copie plusieurs fois par jour. Les versions, le coffre-fort, la recherche par calendrier, le montage de texte et Drive transforment un simple historique en espace de travail."] },
          { id: "checklist", title: "Checklist QA release", categoryId: "roadmap", domain: "linear.app", url: "https://linear.app/arcawand/release", versions: ["Vérifier light mode, dark mode, langue française, anglais, espagnol, italien et allemand. Tester copie, classement, recherche, versioning, import JSON, restauration Drive et exclusions de domaines."] }
        ]
      },
      en: {
        general: "General",
        imageTitle: "Interface capture",
        categories: [
          { id: "general", name: "General" },
          { id: "product", name: "Product" },
          { id: "roadmap", parentId: "product", name: "Roadmap" },
          { id: "research", parentId: "product", name: "User research" },
          { id: "meetings", name: "Meetings" },
          { id: "support", name: "Customer support" },
          { id: "ai", name: "AI" },
          { id: "prompts", parentId: "ai", name: "Prompts" }
        ],
        devCategories: [
          { id: "dev-general", name: "General" },
          { id: "javascript", name: "JavaScript" },
          { id: "react", parentId: "javascript", name: "React" },
          { id: "network", parentId: "javascript", name: "Network API" },
          { id: "css", name: "CSS" },
          { id: "automation", name: "Automation" }
        ],
        textItems: [
          { id: "launch-plan", title: "Launch plan", categoryId: "roadmap", domain: "notion.so", url: "https://notion.so/arcawand/launch", pinned: true, favorite: true, versions: ["Prepare the launch in three steps: finalize the product page, verify the demo captures and write a short message for early users.", "Prepare the launch in three steps: finalize the product page, verify the demo captures, prepare the FAQ and write a short message for early users.", "Prepare the launch in three steps: finalize the product page, verify the demo captures, prepare the FAQ and schedule a follow-up for users who left their email."] },
          { id: "meeting-summary", title: "UX meeting summary", categoryId: "meetings", domain: "meet.google.com", url: "https://meet.google.com/ucp-demo", versions: ["Decision: keep the capture flow direct. Users want to recover text, code or images quickly without organizing every item manually.", "Decision: keep the capture flow direct. Add a visual confirmation after capture and allow titles to be edited without opening a heavy dialog."] },
          { id: "support-reply", title: "Drive support reply", categoryId: "support", domain: "help.arcawand-soft.com", url: "https://help.arcawand-soft.com/drive-sync", favorite: true, versions: ["Hello, if the Drive folder was deleted, the extension keeps your local data. Reconnect Drive or start a new sync to recreate a clean backup.", "Hello, if the Drive folder was deleted, the extension keeps your local data. Open Settings > Local backup and restore, then start a sync to recreate the Drive folder cleanly."] },
          { id: "prompt-saas", title: "SaaS video prompt", categoryId: "prompts", domain: "chatgpt.com", url: "https://chatgpt.com/c/video-script", versions: ["Create a short video script for a premium Chrome extension that captures text, code and images with a clear, modern, productivity-focused tone.", "Create a short video script for Ultimate Clipboard Pro: show the problem of lost copies, automatic capture, advanced search, versions and Drive sync."] },
          { id: "research-note", title: "User research note", categoryId: "research", domain: "docs.google.com", url: "https://docs.google.com/document/d/research", versions: ["Power users mostly copy reusable blocks: prompts, customer replies, code snippets, reference links and screenshots. Their main pain is not copying, but losing source context.", "Power users mostly copy reusable blocks. Their main pain is not copying, but losing source context, which makes reverse lookup and URL search essential."] },
          { id: "sales-note", title: "Pro positioning", categoryId: "product", domain: "arcawand-soft.com", url: "https://arcawand-soft.com/ultimate-clipboard-pro/", pinned: true, versions: ["Ultimate Clipboard Pro becomes valuable as soon as someone copies several times a day. Versions, vault, calendar search and Drive turn a simple history into a workspace.", "Ultimate Clipboard Pro becomes valuable as soon as someone copies several times a day. Versions, vault, calendar search, text montage and Drive turn a simple history into a workspace."] },
          { id: "checklist", title: "Release QA checklist", categoryId: "roadmap", domain: "linear.app", url: "https://linear.app/arcawand/release", versions: ["Check light mode, dark mode, French, English, Spanish, Italian and German. Test copy, classify, search, versioning, JSON import, Drive restore and domain exclusions."] }
        ]
      },
      es: {
        general: "General",
        imageTitle: "Captura de interfaz",
        categories: [
          { id: "general", name: "General" },
          { id: "product", name: "Producto" },
          { id: "roadmap", parentId: "product", name: "Hoja de ruta" },
          { id: "research", parentId: "product", name: "Investigación de usuarios" },
          { id: "meetings", name: "Reuniones" },
          { id: "support", name: "Soporte al cliente" },
          { id: "ai", name: "IA" },
          { id: "prompts", parentId: "ai", name: "Prompts" }
        ],
        devCategories: [
          { id: "dev-general", name: "General" },
          { id: "javascript", name: "JavaScript" },
          { id: "react", parentId: "javascript", name: "React" },
          { id: "network", parentId: "javascript", name: "API de red" },
          { id: "css", name: "CSS" },
          { id: "automation", name: "Automatización" }
        ],
        textItems: [
          { id: "launch-plan", title: "Plan de lanzamiento", categoryId: "roadmap", domain: "notion.so", url: "https://notion.so/arcawand/lanzamiento", pinned: true, favorite: true, versions: ["Preparar el lanzamiento en tres pasos: finalizar la página de producto, revisar las capturas de demostración y escribir un mensaje breve para los primeros usuarios.", "Preparar el lanzamiento en tres pasos: finalizar la página de producto, revisar las capturas de demostración, preparar la FAQ y escribir un mensaje breve para los primeros usuarios.", "Preparar el lanzamiento en tres pasos: finalizar la página de producto, revisar las capturas de demostración, preparar la FAQ y programar un seguimiento para quienes dejaron su email."] },
          { id: "meeting-summary", title: "Resumen reunión UX", categoryId: "meetings", domain: "meet.google.com", url: "https://meet.google.com/ucp-demo", versions: ["Decisión: mantener el flujo de captura muy directo. Los usuarios quieren recuperar texto, código o imágenes sin organizar cada elemento manualmente.", "Decisión: mantener el flujo de captura muy directo. Añadir confirmación visual después de capturar y permitir editar títulos sin abrir una ventana pesada."] },
          { id: "support-reply", title: "Respuesta soporte Drive", categoryId: "support", domain: "help.arcawand-soft.com", url: "https://help.arcawand-soft.com/drive-sync", favorite: true, versions: ["Hola, si se eliminó la carpeta de Drive, la extensión conserva tus datos locales. Reconecta Drive o inicia una nueva sincronización para recrear una copia limpia.", "Hola, si se eliminó la carpeta de Drive, la extensión conserva tus datos locales. Abre Ajustes > Copia local y restauración, luego inicia una sincronización para recrear la carpeta Drive correctamente."] },
          { id: "prompt-saas", title: "Prompt vídeo SaaS", categoryId: "prompts", domain: "chatgpt.com", url: "https://chatgpt.com/c/video-script", versions: ["Crea un guion de vídeo corto para una extensión Chrome premium que captura textos, códigos e imágenes con un tono claro, moderno y productivo.", "Crea un guion de vídeo corto para Ultimate Clipboard Pro: muestra el problema de las copias perdidas, la captura automática, la búsqueda avanzada, las versiones y Drive."] },
          { id: "research-note", title: "Nota investigación usuario", categoryId: "research", domain: "docs.google.com", url: "https://docs.google.com/document/d/research", versions: ["Los usuarios avanzados copian sobre todo bloques reutilizables: prompts, respuestas a clientes, fragmentos de código, enlaces de referencia y capturas. El dolor principal no es copiar, sino perder el contexto.", "Los usuarios avanzados copian sobre todo bloques reutilizables. El dolor principal no es copiar, sino perder el contexto de origen, por eso el reverse y la búsqueda por URL son esenciales."] },
          { id: "sales-note", title: "Argumentario Pro", categoryId: "product", domain: "arcawand-soft.com", url: "https://arcawand-soft.com/es/ultimate-clipboard-pro/", pinned: true, versions: ["Ultimate Clipboard Pro aporta valor desde que alguien copia varias veces al día. Versiones, caja fuerte, calendario de búsqueda y Drive convierten un historial simple en un espacio de trabajo.", "Ultimate Clipboard Pro aporta valor desde que alguien copia varias veces al día. Versiones, caja fuerte, calendario de búsqueda, montaje de texto y Drive convierten un historial simple en un espacio de trabajo."] },
          { id: "checklist", title: "Checklist QA release", categoryId: "roadmap", domain: "linear.app", url: "https://linear.app/arcawand/release", versions: ["Comprobar modo claro, modo oscuro, francés, inglés, español, italiano y alemán. Probar copia, clasificación, búsqueda, versiones, importación JSON, restauración Drive y dominios excluidos."] }
        ]
      },
      it: {
        general: "Generale",
        imageTitle: "Cattura interfaccia",
        categories: [
          { id: "general", name: "Generale" },
          { id: "product", name: "Prodotto" },
          { id: "roadmap", parentId: "product", name: "Roadmap" },
          { id: "research", parentId: "product", name: "Ricerca utenti" },
          { id: "meetings", name: "Riunioni" },
          { id: "support", name: "Supporto clienti" },
          { id: "ai", name: "IA" },
          { id: "prompts", parentId: "ai", name: "Prompt" }
        ],
        devCategories: [
          { id: "dev-general", name: "Generale" },
          { id: "javascript", name: "JavaScript" },
          { id: "react", parentId: "javascript", name: "React" },
          { id: "network", parentId: "javascript", name: "API rete" },
          { id: "css", name: "CSS" },
          { id: "automation", name: "Automazione" }
        ],
        textItems: [
          { id: "launch-plan", title: "Piano di lancio", categoryId: "roadmap", domain: "notion.so", url: "https://notion.so/arcawand/lancio", pinned: true, favorite: true, versions: ["Preparare il lancio in tre fasi: finalizzare la pagina prodotto, verificare le catture demo e scrivere un messaggio breve per i primi utenti.", "Preparare il lancio in tre fasi: finalizzare la pagina prodotto, verificare le catture demo, preparare la FAQ e scrivere un messaggio breve per i primi utenti.", "Preparare il lancio in tre fasi: finalizzare la pagina prodotto, verificare le catture demo, preparare la FAQ e programmare un follow-up per chi ha lasciato l'email."] },
          { id: "meeting-summary", title: "Sintesi riunione UX", categoryId: "meetings", domain: "meet.google.com", url: "https://meet.google.com/ucp-demo", versions: ["Decisione: mantenere il flusso di cattura molto diretto. Gli utenti vogliono ritrovare testo, codice o immagini senza organizzare ogni elemento manualmente.", "Decisione: mantenere il flusso di cattura molto diretto. Aggiungere una conferma visiva dopo la cattura e rendere modificabili i titoli senza aprire finestre pesanti."] },
          { id: "support-reply", title: "Risposta supporto Drive", categoryId: "support", domain: "help.arcawand-soft.com", url: "https://help.arcawand-soft.com/drive-sync", favorite: true, versions: ["Ciao, se la cartella Drive è stata eliminata, l'estensione conserva i dati locali. Riconnetti Drive o avvia una nuova sincronizzazione per ricreare un backup pulito.", "Ciao, se la cartella Drive è stata eliminata, l'estensione conserva i dati locali. Apri Impostazioni > Backup locale e ripristino, poi avvia una sincronizzazione per ricreare correttamente la cartella Drive."] },
          { id: "prompt-saas", title: "Prompt video SaaS", categoryId: "prompts", domain: "chatgpt.com", url: "https://chatgpt.com/c/video-script", versions: ["Crea uno script video breve per un'estensione Chrome premium che cattura testi, codici e immagini con tono chiaro, moderno e orientato alla produttività.", "Crea uno script video breve per Ultimate Clipboard Pro: mostra il problema delle copie perse, la cattura automatica, la ricerca avanzata, le versioni e Drive."] },
          { id: "research-note", title: "Nota ricerca utenti", categoryId: "research", domain: "docs.google.com", url: "https://docs.google.com/document/d/research", versions: ["Gli utenti intensivi copiano soprattutto blocchi riutilizzabili: prompt, risposte clienti, snippet di codice, link di riferimento e screenshot. Il problema principale non è copiare, ma perdere il contesto.", "Gli utenti intensivi copiano soprattutto blocchi riutilizzabili. Il problema principale non è copiare, ma perdere il contesto di origine, perciò reverse e ricerca URL sono essenziali."] },
          { id: "sales-note", title: "Argomento Pro", categoryId: "product", domain: "arcawand-soft.com", url: "https://arcawand-soft.com/it/ultimate-clipboard-pro/", pinned: true, versions: ["Ultimate Clipboard Pro diventa prezioso appena una persona copia più volte al giorno. Versioni, cassaforte, calendario di ricerca e Drive trasformano una semplice cronologia in uno spazio di lavoro.", "Ultimate Clipboard Pro diventa prezioso appena una persona copia più volte al giorno. Versioni, cassaforte, calendario di ricerca, montaggio testo e Drive trasformano una semplice cronologia in uno spazio di lavoro."] },
          { id: "checklist", title: "Checklist QA release", categoryId: "roadmap", domain: "linear.app", url: "https://linear.app/arcawand/release", versions: ["Verificare modalità chiara, scura, francese, inglese, spagnolo, italiano e tedesco. Testare copia, classificazione, ricerca, versioning, import JSON, ripristino Drive ed esclusioni dominio."] }
        ]
      },
      de: {
        general: "Allgemein",
        imageTitle: "Interface-Screenshot",
        categories: [
          { id: "general", name: "Allgemein" },
          { id: "product", name: "Produkt" },
          { id: "roadmap", parentId: "product", name: "Roadmap" },
          { id: "research", parentId: "product", name: "Nutzerforschung" },
          { id: "meetings", name: "Meetings" },
          { id: "support", name: "Kundensupport" },
          { id: "ai", name: "KI" },
          { id: "prompts", parentId: "ai", name: "Prompts" }
        ],
        devCategories: [
          { id: "dev-general", name: "Allgemein" },
          { id: "javascript", name: "JavaScript" },
          { id: "react", parentId: "javascript", name: "React" },
          { id: "network", parentId: "javascript", name: "Netzwerk-API" },
          { id: "css", name: "CSS" },
          { id: "automation", name: "Automatisierung" }
        ],
        textItems: [
          { id: "launch-plan", title: "Launch-Plan", categoryId: "roadmap", domain: "notion.so", url: "https://notion.so/arcawand/launch", pinned: true, favorite: true, versions: ["Den Launch in drei Schritten vorbereiten: Produktseite finalisieren, Demo-Captures prüfen und eine kurze Nachricht für erste Nutzer schreiben.", "Den Launch in drei Schritten vorbereiten: Produktseite finalisieren, Demo-Captures prüfen, FAQ vorbereiten und eine kurze Nachricht für erste Nutzer schreiben.", "Den Launch in drei Schritten vorbereiten: Produktseite finalisieren, Demo-Captures prüfen, FAQ vorbereiten und einen Follow-up für Nutzer planen, die ihre E-Mail hinterlassen haben."] },
          { id: "meeting-summary", title: "UX-Meeting-Zusammenfassung", categoryId: "meetings", domain: "meet.google.com", url: "https://meet.google.com/ucp-demo", versions: ["Entscheidung: Der Capture-Flow bleibt sehr direkt. Nutzer möchten Text, Code oder Bilder schnell wiederfinden, ohne jedes Element manuell zu organisieren.", "Entscheidung: Der Capture-Flow bleibt sehr direkt. Eine visuelle Bestätigung nach der Erfassung hinzufügen und Titel ohne schweres Dialogfenster bearbeitbar machen."] },
          { id: "support-reply", title: "Drive-Support-Antwort", categoryId: "support", domain: "help.arcawand-soft.com", url: "https://help.arcawand-soft.com/drive-sync", favorite: true, versions: ["Hallo, wenn der Drive-Ordner gelöscht wurde, behält die Erweiterung Ihre lokalen Daten. Verbinden Sie Drive erneut oder starten Sie eine neue Synchronisierung, um ein sauberes Backup zu erstellen.", "Hallo, wenn der Drive-Ordner gelöscht wurde, behält die Erweiterung Ihre lokalen Daten. Öffnen Sie Einstellungen > Lokales Backup und Wiederherstellung und starten Sie eine Synchronisierung, um den Drive-Ordner sauber neu zu erstellen."] },
          { id: "prompt-saas", title: "SaaS-Video-Prompt", categoryId: "prompts", domain: "chatgpt.com", url: "https://chatgpt.com/c/video-script", versions: ["Erstelle ein kurzes Videoskript für eine Premium-Chrome-Erweiterung, die Texte, Codes und Bilder mit klarem, modernem Produktivitätston erfasst.", "Erstelle ein kurzes Videoskript für Ultimate Clipboard Pro: zeige das Problem verlorener Kopien, automatische Erfassung, erweiterte Suche, Versionen und Drive-Synchronisierung."] },
          { id: "research-note", title: "Nutzerforschungsnotiz", categoryId: "research", domain: "docs.google.com", url: "https://docs.google.com/document/d/research", versions: ["Power-User kopieren vor allem wiederverwendbare Blöcke: Prompts, Kundenantworten, Code-Snippets, Referenzlinks und Screenshots. Das Hauptproblem ist nicht das Kopieren, sondern der Verlust des Quellenkontexts.", "Power-User kopieren vor allem wiederverwendbare Blöcke. Das Hauptproblem ist der Verlust des Quellenkontexts, deshalb sind Reverse-Suche und URL-Suche entscheidend."] },
          { id: "sales-note", title: "Pro-Positionierung", categoryId: "product", domain: "arcawand-soft.com", url: "https://arcawand-soft.com/de/ultimate-clipboard-pro/", pinned: true, versions: ["Ultimate Clipboard Pro wird wertvoll, sobald jemand mehrmals täglich kopiert. Versionen, Tresor, Kalendersuche und Drive verwandeln einen einfachen Verlauf in einen Arbeitsbereich.", "Ultimate Clipboard Pro wird wertvoll, sobald jemand mehrmals täglich kopiert. Versionen, Tresor, Kalendersuche, Textmontage und Drive verwandeln einen einfachen Verlauf in einen Arbeitsbereich."] },
          { id: "checklist", title: "Release-QA-Checkliste", categoryId: "roadmap", domain: "linear.app", url: "https://linear.app/arcawand/release", versions: ["Light Mode, Dark Mode, Französisch, Englisch, Spanisch, Italienisch und Deutsch prüfen. Kopieren, Einordnen, Suche, Versionierung, JSON-Import, Drive-Wiederherstellung und Domain-Ausschlüsse testen."] }
        ]
      }
    };
    const fallback = datasets.en;
    const translated = datasets[language] || fallback;
    const extras = welcomePreviewHumorExtras(language, translated);
    return Object.assign({}, translated, {
      categories: [...(translated.categories || []), ...(extras.categories || [])],
      devCategories: extras.devCategories || translated.devCategories || [],
      textItems: extras.textItems || [],
      codeItems: extras.codeItems || []
    });
  }

  function welcomePreviewTextStyleBuilders(language = "en") {
    const packs = {
      fr: [
        (title, n) => `${title}. Mini-dialogue : "Tu te souviens de ce que tu viens de copier ?" demande le navigateur. "Oui", répond l'utilisateur avec une confiance excessive. Heureusement, Ultimate Clipboard Pro a pris des notes.`,
        (title, n) => `${title}. Mémo officiel : cette capture a été retrouvée vivante, légèrement décoiffée, mais parfaitement prête à être recollée au bon moment.`,
        (title, n) => `${title}. Carte postale du futur : la phrase que tu pensais perdre est rangée, titrée, versionnée et elle bronze tranquillement dans l'onglet Texte.`,
        (title, n) => `${title}. Alerte douce : l'IA a proposé trois idées, le cerveau en a gardé une seule, et l'extension garde les trois parce qu'elle est plus diplomate que nous.`,
        (title, n) => `${title}. Recette rapide : une bonne idée, un Ctrl+C, une pincée de recherche avancée, puis repos en catégorie jusqu'à réutilisation.`,
        (title, n) => `${title}. Note de réunion : quelqu'un a dit "on le garde quelque part". Pour une fois, ce quelque part a un titre, une URL et un bouton Copier.`,
        (title, n) => `${title}. Bulletin météo : risque élevé de copier trop de choses, visibilité excellente grâce aux versions, aucune disparition prévue.`,
        (title, n) => `${title}. Message à l'ancien presse-papiers : merci, mais ton concept de mémoire instantanément amnésique était audacieux.`,
        (title, n) => `${title}. Pensée de café froid : si cette phrase était une chaussette, elle aurait déjà disparu. Heureusement, c'est une capture.`,
        (title, n) => `${title}. Rapport de mission : copier atteint, ne pas oublier atteint, avoir l'air organisé devant soi-même en très bonne voie.`,
        (title, n) => `${title}. Confession de navigateur : j'ai vu beaucoup d'onglets et un prompt interminable. Celui-ci, au moins, est en sécurité.`,
        (title, n) => `${title}. Philosophie express : une copie non sauvegardée est-elle vraiment copiée ? L'extension évite le débat et l'enregistre.`,
        (title, n) => `${title}. Note anti-panique : quand le texte compte vraiment, on évite de le confier uniquement à la mémoire héroïque d'un mardi.`,
        (title, n) => `${title}. Micro-liste : copier, sourire, retrouver plus tard, puis prétendre que cette organisation était prévue depuis le début.`,
        (title, n) => `${title}. Message pour l'IA : merci pour l'idée brillante. Elle dort maintenant dans une boîte confortable avec une étiquette.`,
        (title, n) => `${title}. Scène dramatique : le texte avançait vers l'oubli, musique intense. La capture automatique est arrivée avec une cape imaginaire.`,
        (title, n) => `${title}. Journal de bord : phrase copiée à une heure raisonnable, ce qui est suspect. Disponible pour enquête ultérieure.`,
        (title, n) => `${title}. Étiquette de musée : fragment rare de pensée productive, capturé avant évaporation dans un océan d'onglets.`,
        (title, n) => `${title}. Protocole de survie : si le cerveau dit "je m'en souviendrai", sauvegarder immédiatement. Il est gentil, mais optimiste.`,
        (title, n) => `${title}. Dernière révision : plus claire, plus drôle, moins perdue. La capture passe officiellement du chaos au confort.`
      ],
      en: [
        (title, n) => `${title}. Tiny dialogue: "Do you remember what you just copied?" asks the browser. "Absolutely," says the user with reckless confidence. Ultimate Clipboard Pro quietly takes notes.`,
        (title, n) => `${title}. Official memo: this capture has been found alive, slightly ruffled, and fully prepared to be pasted at the perfect moment.`,
        (title, n) => `${title}. Postcard from future-you: the sentence you expected to lose is titled, versioned, and relaxing safely in the Text tab.`,
        (title, n) => `${title}. Gentle alert: AI suggested three ideas, the brain kept one, and the extension kept all three because it has manners.`,
        (title, n) => `${title}. Quick recipe: one good idea, one Ctrl+C, a pinch of advanced search, then let it rest in a category until needed.`,
        (title, n) => `${title}. Meeting note: someone said "let's keep it somewhere." For once, somewhere has a title, a source URL, and a Copy button.`,
        (title, n) => `${title}. Clipboard forecast: heavy copying expected, excellent visibility thanks to versions, zero disappearances scheduled.`,
        (title, n) => `${title}. Message to the old clipboard: thank you, but the instant-amnesia memory model was a bold product choice.`,
        (title, n) => `${title}. Cold coffee thought: if this sentence were a sock, it would be gone. Luckily, it is a capture.`,
        (title, n) => `${title}. Mission report: copy achieved, forgetting avoided, looking organized in front of yourself is progressing nicely.`,
        (title, n) => `${title}. Browser confession: I saw too many tabs and one endless prompt. This one, at least, is safe.`,
        (title, n) => `${title}. Tiny philosophy: is an unsaved copy truly copied? The extension avoids the debate and saves it.`,
        (title, n) => `${title}. Anti-panic note: when text matters, do not entrust it only to the heroic memory of a Tuesday afternoon.`,
        (title, n) => `${title}. Micro-list: copy, smile, find it later, then pretend this level of organization was the plan all along.`,
        (title, n) => `${title}. Message to AI: thanks for the bright idea. It now lives in a labeled box with excellent ventilation.`,
        (title, n) => `${title}. Dramatic scene: the text walked toward oblivion, soundtrack rising. Automatic capture arrived wearing an imaginary cape.`,
        (title, n) => `${title}. Logbook: sentence copied at a suspiciously reasonable hour. Preserved for future investigation.`,
        (title, n) => `${title}. Museum label: rare fragment of productive thought, captured before natural evaporation in a sea of tabs.`,
        (title, n) => `${title}. Survival protocol: when the brain says "I'll remember," save immediately. The brain means well, but it freelances.`,
        (title, n) => `${title}. Final polish: clearer, funnier, less lost. This capture has officially moved from chaos to comfort.`
      ],
      es: [
        (title, n) => `${title}. Mini diálogo: "¿Recuerdas lo que acabas de copiar?", pregunta el navegador. "Claro", responde el usuario con una fe peligrosa. La extensión toma nota.`,
        (title, n) => `${title}. Memo oficial: esta captura fue encontrada viva, un poco despeinada y lista para pegarse cuando llegue su gran momento.`,
        (title, n) => `${title}. Postal del futuro: la frase que ibas a perder está titulada, versionada y descansando en la pestaña Texto.`,
        (title, n) => `${title}. Alerta suave: la IA propuso tres ideas, el cerebro guardó una y la extensión guardó las tres porque es diplomática.`,
        (title, n) => `${title}. Receta rápida: una buena idea, Ctrl+C, una pizca de búsqueda avanzada y reposo en categoría hasta nuevo aviso.`,
        (title, n) => `${title}. Nota de reunión: alguien dijo "lo guardamos en algún sitio". Esta vez ese sitio tiene título, URL y botón de copia.`,
        (title, n) => `${title}. Parte meteorológico: muchas copias, buena visibilidad gracias a versiones y ninguna desaparición prevista.`,
        (title, n) => `${title}. Mensaje al viejo portapapeles: gracias, pero lo de olvidar todo al instante era una apuesta muy arriesgada.`,
        (title, n) => `${title}. Pensamiento con café frío: si esta frase fuera un calcetín, ya no existiría. Por suerte es una captura.`,
        (title, n) => `${title}. Informe de misión: copiar completado, olvido evitado, apariencia de persona organizada en progreso.`,
        (title, n) => `${title}. Confesión del navegador: vi muchas pestañas y un prompt eterno. Este, al menos, está a salvo.`,
        (title, n) => `${title}. Filosofía breve: ¿una copia no guardada fue realmente copiada? La extensión no discute y la guarda.`,
        (title, n) => `${title}. Nota antipánico: si el texto importa, no lo dejes solo en la memoria heroica de un martes.`,
        (title, n) => `${title}. Microlista: copiar, sonreír, encontrar luego y fingir que tanta organización estaba prevista.`,
        (title, n) => `${title}. Mensaje a la IA: gracias por la idea brillante. Ahora vive en una caja con etiqueta y buena ventilación.`,
        (title, n) => `${title}. Escena dramática: el texto caminaba hacia el olvido. La captura automática llegó con capa imaginaria.`,
        (title, n) => `${title}. Diario de bordo: frase copiada a una hora sospechosamente razonable. Conservada para investigación futura.`,
        (title, n) => `${title}. Etiqueta de museo: fragmento raro de pensamiento productivo, capturado antes de evaporarse entre pestañas.`,
        (title, n) => `${title}. Protocolo de supervivencia: si el cerebro dice "me acordaré", guarda ya. El cerebro promete mucho.`,
        (title, n) => `${title}. Pulido final: más claro, más divertido y menos perdido. La captura pasa del caos al confort.`
      ],
      it: [
        (title, n) => `${title}. Mini dialogo: "Ricordi cosa hai appena copiato?", chiede il browser. "Certo", risponde l'utente con fiducia pericolosa. L'estensione prende appunti.`,
        (title, n) => `${title}. Memo ufficiale: questa cattura è stata trovata viva, un po' spettinata e pronta per essere incollata al momento giusto.`,
        (title, n) => `${title}. Cartolina dal futuro: la frase che pensavi di perdere è titolata, versionata e al sicuro nella scheda Testo.`,
        (title, n) => `${title}. Avviso gentile: l'IA ha proposto tre idee, il cervello ne ha tenuta una e l'estensione le conserva tutte con eleganza.`,
        (title, n) => `${title}. Ricetta rapida: una buona idea, Ctrl+C, un pizzico di ricerca avanzata e riposo in categoria fino all'uso.`,
        (title, n) => `${title}. Nota riunione: qualcuno ha detto "mettiamolo da qualche parte". Stavolta quel posto ha titolo, URL e pulsante Copia.`,
        (title, n) => `${title}. Meteo appunti: molte copie in arrivo, visibilità ottima grazie alle versioni, nessuna sparizione prevista.`,
        (title, n) => `${title}. Messaggio ai vecchi appunti: grazie, ma dimenticare tutto subito era una scelta di prodotto coraggiosa.`,
        (title, n) => `${title}. Pensiero col caffè freddo: se questa frase fosse un calzino, sarebbe già sparita. Per fortuna è una cattura.`,
        (title, n) => `${title}. Rapporto missione: copia riuscita, oblio evitato, sembrare organizzati con se stessi procede bene.`,
        (title, n) => `${title}. Confessione del browser: ho visto troppe schede e un prompt infinito. Questo almeno è salvo.`,
        (title, n) => `${title}. Filosofia veloce: una copia non salvata è davvero copiata? L'estensione evita il dibattito e salva.`,
        (title, n) => `${title}. Nota antipanico: se il testo conta, non affidarlo solo alla memoria eroica di un martedì.`,
        (title, n) => `${title}. Microlista: copia, sorridi, ritrova dopo e fingi che fosse tutto pianificato.`,
        (title, n) => `${title}. Messaggio all'IA: grazie per l'idea brillante. Ora vive in una scatola etichettata e comoda.`,
        (title, n) => `${title}. Scena drammatica: il testo camminava verso l'oblio. La cattura automatica è arrivata con mantello immaginario.`,
        (title, n) => `${title}. Diario di bordo: frase copiata a un'ora stranamente ragionevole. Conservata per indagini future.`,
        (title, n) => `${title}. Etichetta da museo: raro frammento di pensiero produttivo, salvato prima dell'evaporazione tra schede.`,
        (title, n) => `${title}. Protocollo di sopravvivenza: se il cervello dice "me lo ricordo", salva subito. È gentile, ma ottimista.`,
        (title, n) => `${title}. Revisione finale: più chiara, più simpatica, meno persa. Dal caos al comfort.`
      ],
      de: [
        (title, n) => `${title}. Mini-Dialog: "Weißt du noch, was du kopiert hast?", fragt der Browser. "Natürlich", sagt der Nutzer mutig. Die Erweiterung notiert es lieber.`,
        (title, n) => `${title}. Offizielles Memo: Diese Capture wurde lebend gefunden, leicht zerzaust und bereit für den perfekten Einfüge-Moment.`,
        (title, n) => `${title}. Postkarte aus der Zukunft: Der Satz, den du verlieren wolltest, ist betitelt, versioniert und sicher im Text-Tab.`,
        (title, n) => `${title}. Sanfte Warnung: Die KI hatte drei Ideen, das Gehirn behielt eine, die Erweiterung speichert alle drei höflich.`,
        (title, n) => `${title}. Schnellrezept: gute Idee, Ctrl+C, etwas erweiterte Suche und in einer Kategorie ruhen lassen.`,
        (title, n) => `${title}. Meeting-Notiz: Jemand sagte "das speichern wir irgendwo". Diesmal hat irgendwo Titel, URL und Kopierknopf.`,
        (title, n) => `${title}. Zwischenablage-Wetter: viele Kopien, gute Sicht dank Versionen, keine Verluste erwartet.`,
        (title, n) => `${title}. Nachricht an die alte Zwischenablage: Danke, aber sofortiges Vergessen war ein mutiges Produktkonzept.`,
        (title, n) => `${title}. Gedanke mit kaltem Kaffee: Wäre dieser Satz eine Socke, wäre er weg. Zum Glück ist er eine Capture.`,
        (title, n) => `${title}. Missionsbericht: kopiert, nicht vergessen, organisierter Eindruck vor sich selbst nimmt Form an.`,
        (title, n) => `${title}. Browser-Beichte: Ich sah zu viele Tabs und einen endlosen Prompt. Dieser hier ist sicher.`,
        (title, n) => `${title}. Kurzphilosophie: Ist eine ungespeicherte Kopie wirklich kopiert? Die Erweiterung speichert und schweigt.`,
        (title, n) => `${title}. Anti-Panik-Notiz: Wichtige Texte gehören nicht nur in das heldenhafte Gedächtnis eines Dienstags.`,
        (title, n) => `${title}. Mikroliste: kopieren, lächeln, später finden und so tun, als wäre diese Ordnung geplant gewesen.`,
        (title, n) => `${title}. Nachricht an die KI: Danke für die helle Idee. Sie wohnt jetzt beschriftet und gut belüftet.`,
        (title, n) => `${title}. Dramatische Szene: Der Text lief Richtung Vergessen. Die automatische Erfassung kam mit imaginärem Umhang.`,
        (title, n) => `${title}. Logbuch: Satz zu verdächtig vernünftiger Uhrzeit kopiert. Für spätere Ermittlungen gesichert.`,
        (title, n) => `${title}. Museumsschild: seltenes Fragment produktiven Denkens, gerettet vor Verdunstung im Tab-Meer.`,
        (title, n) => `${title}. Überlebensprotokoll: Wenn das Gehirn "merk ich mir" sagt, sofort speichern. Es meint es gut.`,
        (title, n) => `${title}. Finale Politur: klarer, lustiger, weniger verloren. Von Chaos zu Komfort.`
      ]
    };
    return packs[language] || packs.en;
  }

  function welcomePreviewCodeCategoryMeta(language = "en") {
    const languageRoots = [
      ["dev-javascript", "JavaScript"], ["dev-typescript", "TypeScript"], ["dev-react", "React / JSX"], ["dev-css", "CSS"],
      ["dev-python", "Python"], ["dev-sql", "SQL"], ["dev-shell", "Shell / Bash"], ["dev-json", "JSON"], ["dev-yaml", "YAML"]
    ];
    const subcategoryLabels = {
      fr: {
        "js-extension": "Extension Chrome", "js-search": "Recherche locale", "ts-storage": "Stockage typé", "ts-sync": "Synchronisation Drive",
        "react-ui": "Interface flottante", "js-dates": "Dates locales", "js-a11y": "Accessibilité", "ts-tests": "Tests automatisés",
        "ts-versioning": "Versioning", "js-throttle": "Performance UI", "python-classifier": "Classification", "react-toast": "Notifications",
        "json-backup": "Backup JSON", "js-shortcuts": "Raccourcis clavier", "sql-calendar": "Calendrier", "shell-cleanup": "Maintenance"
      },
      en: {
        "js-extension": "Chrome extension", "js-search": "Local search", "ts-storage": "Typed storage", "ts-sync": "Drive sync",
        "react-ui": "Floating interface", "js-dates": "Local dates", "js-a11y": "Accessibility", "ts-tests": "Automated tests",
        "ts-versioning": "Versioning", "js-throttle": "UI performance", "python-classifier": "Classification", "react-toast": "Notifications",
        "json-backup": "JSON backup", "js-shortcuts": "Keyboard shortcuts", "sql-calendar": "Calendar", "shell-cleanup": "Maintenance"
      },
      es: {
        "js-extension": "Extensión Chrome", "js-search": "Búsqueda local", "ts-storage": "Storage tipado", "ts-sync": "Sincronización Drive",
        "react-ui": "Interfaz flotante", "js-dates": "Fechas locales", "js-a11y": "Accesibilidad", "ts-tests": "Pruebas automáticas",
        "ts-versioning": "Versionado", "js-throttle": "Rendimiento UI", "python-classifier": "Clasificación", "react-toast": "Notificaciones",
        "json-backup": "Backup JSON", "js-shortcuts": "Atajos de teclado", "sql-calendar": "Calendario", "shell-cleanup": "Mantenimiento"
      },
      it: {
        "js-extension": "Estensione Chrome", "js-search": "Ricerca locale", "ts-storage": "Storage tipizzato", "ts-sync": "Sincronizzazione Drive",
        "react-ui": "Interfaccia flottante", "js-dates": "Date locali", "js-a11y": "Accessibilità", "ts-tests": "Test automatici",
        "ts-versioning": "Versioning", "js-throttle": "Performance UI", "python-classifier": "Classificazione", "react-toast": "Notifiche",
        "json-backup": "Backup JSON", "js-shortcuts": "Scorciatoie tastiera", "sql-calendar": "Calendario", "shell-cleanup": "Manutenzione"
      },
      de: {
        "js-extension": "Chrome-Erweiterung", "js-search": "Lokale Suche", "ts-storage": "Typisierter Speicher", "ts-sync": "Drive-Sync",
        "react-ui": "Floating-Oberfläche", "js-dates": "Lokale Daten", "js-a11y": "Barrierefreiheit", "ts-tests": "Automatisierte Tests",
        "ts-versioning": "Versionierung", "js-throttle": "UI-Performance", "python-classifier": "Klassifizierung", "react-toast": "Benachrichtigungen",
        "json-backup": "JSON-Backup", "js-shortcuts": "Tastaturkürzel", "sql-calendar": "Kalender", "shell-cleanup": "Wartung"
      }
    };
    const subcategories = subcategoryLabels[language] || subcategoryLabels.en;
    const parentBySubcategory = {
      "js-extension": "dev-javascript", "js-search": "dev-javascript", "js-dates": "dev-javascript", "js-a11y": "dev-javascript", "js-throttle": "dev-javascript", "js-shortcuts": "dev-javascript",
      "ts-storage": "dev-typescript", "ts-sync": "dev-typescript", "ts-tests": "dev-typescript", "ts-versioning": "dev-typescript",
      "react-ui": "dev-react", "react-toast": "dev-react",
      "python-classifier": "dev-python",
      "json-backup": "dev-json",
      "sql-calendar": "dev-sql",
      "shell-cleanup": "dev-shell"
    };
    return [
      ...languageRoots.map(([id, name]) => ({ id, name, parentId: null })),
      ...Object.entries(subcategories).map(([id, name]) => ({ id, name, parentId: parentBySubcategory[id] || null }))
    ];
  }

  function welcomePreviewCodeLexicon(language = "en") {
    const lexicon = {
      fr: {
        suffix: "variante",
        titles: {
          queue: "File d'attente de captures",
          search: "Index de recherche accent-proof",
          storage: "Migration storage prudente",
          sync: "Fusion Drive sans panique",
          ui: "État de fenêtre flottante",
          dates: "Formatage local des dates",
          a11y: "Boutons avec vrais labels",
          test: "Test de non-disparition",
          version: "Gestionnaire de versions",
          throttle: "Throttle de scroll calme",
          classifier: "Classement automatique poli",
          toast: "Toast qui ne crie pas",
          import: "Import JSON avec parachute",
          shortcut: "Raccourci clavier civilisé",
          calendar: "Calendrier de captures",
          cleanup: "Nettoyage sans casse"
        }
      },
      en: {
        suffix: "variant",
        titles: {
          queue: "Capture queue",
          search: "Accent-proof search index",
          storage: "Careful storage migration",
          sync: "Drive merge without panic",
          ui: "Floating window state",
          dates: "Local date formatting",
          a11y: "Buttons with real labels",
          test: "Non-disappearance test",
          version: "Version manager",
          throttle: "Calm scroll throttle",
          classifier: "Polite auto-classifier",
          toast: "Toast that does not yell",
          import: "JSON import with parachute",
          shortcut: "Civilized keyboard shortcut",
          calendar: "Capture calendar",
          cleanup: "Cleanup without breakage"
        }
      },
      es: {
        suffix: "variante",
        titles: {
          queue: "Cola de capturas",
          search: "Índice de búsqueda sin acentos",
          storage: "Migración storage prudente",
          sync: "Fusión Drive sin pánico",
          ui: "Estado de ventana flotante",
          dates: "Formato local de fechas",
          a11y: "Botones con etiquetas reales",
          test: "Test anti-desaparición",
          version: "Gestor de versiones",
          throttle: "Throttle de scroll tranquilo",
          classifier: "Clasificador automático educado",
          toast: "Toast que no grita",
          import: "Import JSON con paracaídas",
          shortcut: "Atajo de teclado civilizado",
          calendar: "Calendario de capturas",
          cleanup: "Limpieza sin romper nada"
        }
      },
      it: {
        suffix: "variante",
        titles: {
          queue: "Coda di catture",
          search: "Indice ricerca senza accenti",
          storage: "Migrazione storage prudente",
          sync: "Merge Drive senza panico",
          ui: "Stato finestra flottante",
          dates: "Formattazione date locale",
          a11y: "Bottoni con label vere",
          test: "Test anti-sparizione",
          version: "Gestore versioni",
          throttle: "Throttle scroll tranquillo",
          classifier: "Classificatore automatico gentile",
          toast: "Toast che non urla",
          import: "Import JSON col paracadute",
          shortcut: "Scorciatoia tastiera civile",
          calendar: "Calendario catture",
          cleanup: "Pulizia senza rompere"
        }
      },
      de: {
        suffix: "Variante",
        titles: {
          queue: "Capture-Warteschlange",
          search: "Akzentfester Suchindex",
          storage: "Vorsichtige Storage-Migration",
          sync: "Drive-Merge ohne Panik",
          ui: "Floating-Window-Status",
          dates: "Lokale Datumsformatierung",
          a11y: "Buttons mit echten Labels",
          test: "Nicht-Verschwinden-Test",
          version: "Versionsmanager",
          throttle: "Ruhiger Scroll-Throttle",
          classifier: "Höflicher Auto-Klassifizierer",
          toast: "Toast ohne Geschrei",
          import: "JSON-Import mit Fallschirm",
          shortcut: "Ziviler Tastaturkurzbefehl",
          calendar: "Capture-Kalender",
          cleanup: "Aufräumen ohne Bruch"
        }
      }
    };
    return lexicon[language] || lexicon.en;
  }

  function welcomePreviewCodeItems(language = "en") {
    const copy = welcomePreviewCodeLexicon(language);
    const blueprints = [
      {
        key: "queue",
        languageId: "dev-javascript",
        categoryId: "js-extension",
        domain: "github.com",
        versions: (name) => [
          `export class ${name} {\n  #items = [];\n  #flushing = false;\n\n  push(capture) {\n    this.#items.push({ ...capture, queuedAt: Date.now() });\n    if (!this.#flushing) queueMicrotask(() => this.flush());\n  }\n\n  async flush() {\n    this.#flushing = true;\n    while (this.#items.length) {\n      const next = this.#items.shift();\n      await chrome.runtime.sendMessage({ type: "SAVE_CAPTURE", payload: next });\n    }\n    this.#flushing = false;\n  }\n}`,
          `export class ${name} {\n  #items = [];\n  #flushing = false;\n  #maxBatch = 12;\n\n  push(capture) {\n    this.#items.push({ ...capture, queuedAt: Date.now(), source: "welcome-preview" });\n    if (!this.#flushing) queueMicrotask(() => this.flush());\n  }\n\n  async flush() {\n    this.#flushing = true;\n    const batch = this.#items.splice(0, this.#maxBatch);\n    if (batch.length) await chrome.runtime.sendMessage({ type: "SAVE_CAPTURE_BATCH", payload: batch });\n    this.#flushing = false;\n    if (this.#items.length) queueMicrotask(() => this.flush());\n  }\n}`,
          `export class ${name} {\n  #items = [];\n  #flushing = false;\n\n  push(capture) {\n    this.#items.push({ ...capture, queuedAt: Date.now() });\n    if (!this.#flushing) queueMicrotask(() => this.flush());\n  }\n\n  async flush() {\n    this.#flushing = true;\n    try {\n      while (this.#items.length) {\n        const next = this.#items.shift();\n        await chrome.runtime.sendMessage({ type: "SAVE_CAPTURE", payload: next });\n      }\n    } finally {\n      this.#flushing = false;\n    }\n  }\n}`
        ]
      },
      {
        key: "search",
        languageId: "dev-javascript",
        categoryId: "js-search",
        domain: "stackblitz.com",
        versions: (name) => [
          `const normalize = (value = "") => value\n  .normalize("NFD")\n  .replace(/[\\u0300-\\u036f]/g, "")\n  .toLowerCase()\n  .trim();\n\nexport function ${name}(capture) {\n  return normalize([\n    capture.title,\n    capture.content,\n    capture.note,\n    capture.sourceUrl,\n    capture.categoryName\n  ].filter(Boolean).join(" "));\n}`,
          `const normalize = (value = "") => value\n  .normalize("NFD")\n  .replace(/[\\u0300-\\u036f]/g, "")\n  .toLowerCase()\n  .trim();\n\nexport function ${name}(capture) {\n  const versions = capture.captureVersions || [];\n  return normalize([\n    capture.title,\n    capture.content,\n    capture.note,\n    capture.sourceUrl,\n    ...versions.map((version) => [version.title, version.content, version.note].join(" "))\n  ].filter(Boolean).join(" "));\n}`,
          `const normalize = (value = "") => value\n  .normalize("NFD")\n  .replace(/[\\u0300-\\u036f]/g, "")\n  .toLowerCase()\n  .trim();\n\nexport function ${name}(capture) {\n  const haystack = [capture.title, capture.content, capture.note, capture.sourceUrl, capture.categoryName];\n  for (const version of capture.captureVersions || []) haystack.push(version.title, version.content, version.note);\n  return normalize(haystack.filter(Boolean).join(" "));\n}`
        ]
      },
      {
        key: "storage",
        languageId: "dev-typescript",
        categoryId: "ts-storage",
        domain: "developer.chrome.com",
        versions: (name) => [
          `export async function ${name}(storage, defaults) {\n  const current = await storage.get(defaults);\n  const next = { ...defaults, ...current, migratedAt: Date.now() };\n  await storage.set(next);\n  return next;\n}`,
          `export async function ${name}(storage, defaults, migrations = []) {\n  let current = await storage.get(defaults);\n  for (const migrate of migrations) current = await migrate(current);\n  const next = { ...defaults, ...current, migratedAt: Date.now() };\n  await storage.set(next);\n  return next;\n}`,
          `export async function ${name}(storage, defaults, migrations = []) {\n  const before = await storage.get(defaults);\n  const after = migrations.reduce((state, migrate) => migrate(state), before);\n  const next = { ...defaults, ...after, migratedAt: Date.now() };\n  await storage.set(next);\n  return { before, after: next };\n}`
        ]
      },
      {
        key: "sync",
        languageId: "dev-typescript",
        categoryId: "ts-sync",
        domain: "developers.google.com",
        versions: (name) => [
          `export function ${name}(localItems, remoteItems) {\n  const byId = new Map(localItems.map((item) => [item.id, item]));\n  for (const remote of remoteItems) {\n    const local = byId.get(remote.id);\n    if (!local || (remote.updatedAt || 0) > (local.updatedAt || 0)) byId.set(remote.id, remote);\n  }\n  return [...byId.values()].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));\n}`,
          `export function ${name}(localItems, remoteItems) {\n  const byId = new Map();\n  for (const item of [...localItems, ...remoteItems]) {\n    const previous = byId.get(item.id);\n    const winner = !previous || (item.updatedAt || 0) >= (previous.updatedAt || 0) ? item : previous;\n    byId.set(item.id, winner);\n  }\n  return [...byId.values()].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));\n}`,
          `export function ${name}(localItems, remoteItems) {\n  const merged = new Map(localItems.map((item) => [item.id, { ...item, source: "local" }]));\n  for (const remote of remoteItems) {\n    const local = merged.get(remote.id);\n    if (!local || (remote.updatedAt || 0) > (local.updatedAt || 0)) merged.set(remote.id, { ...remote, source: "drive" });\n  }\n  return [...merged.values()];\n}`
        ]
      },
      {
        key: "ui",
        languageId: "dev-react",
        categoryId: "react-ui",
        domain: "localhost.dev",
        versions: (name) => [
          `export function ${name}(state, patch) {\n  return {\n    ...state,\n    floatingPanelOpen: patch.open ?? state.floatingPanelOpen,\n    activeTab: patch.activeTab || state.activeTab,\n    updatedAt: Date.now()\n  };\n}`,
          `export function ${name}(state, patch) {\n  const next = { ...state, ...patch, updatedAt: Date.now() };\n  next.scroll = { ...state.scroll, ...patch.scroll };\n  next.versionTabs = { ...state.versionTabs, ...patch.versionTabs };\n  return next;\n}`,
          `export function ${name}(state, patch) {\n  const next = structuredClone(state);\n  Object.assign(next, patch, { updatedAt: Date.now() });\n  next.lastReason = patch.reason || "user-clicked-with-purpose";\n  return next;\n}`
        ]
      },
      {
        key: "dates",
        languageId: "dev-javascript",
        categoryId: "js-dates",
        domain: "mdn.dev",
        versions: (name) => [
          `export function ${name}(timestamp, locale = navigator.language) {\n  return new Intl.DateTimeFormat(locale, {\n    dateStyle: "short",\n    timeStyle: "short"\n  }).format(new Date(timestamp));\n}`,
          `export function ${name}(timestamp, locale = navigator.language) {\n  const date = new Date(timestamp);\n  return new Intl.DateTimeFormat(locale, {\n    year: "numeric", month: "2-digit", day: "2-digit",\n    hour: "numeric", minute: "2-digit"\n  }).format(date);\n}`,
          `export function ${name}(timestamp, locale = navigator.language, timeZone) {\n  return new Intl.DateTimeFormat(locale, {\n    dateStyle: "medium",\n    timeStyle: "short",\n    ...(timeZone ? { timeZone } : {})\n  }).format(new Date(timestamp));\n}`
        ]
      },
      {
        key: "a11y",
        languageId: "dev-javascript",
        categoryId: "js-a11y",
        domain: "web.dev",
        versions: (name) => [
          `export function ${name}(button, label) {\n  button.type = "button";\n  button.title = label;\n  button.setAttribute("aria-label", label);\n  return button;\n}`,
          `export function ${name}(button, label, shortcut) {\n  button.type = "button";\n  button.title = shortcut ? \`\${label} (\${shortcut})\` : label;\n  button.setAttribute("aria-label", label);\n  if (shortcut) button.dataset.shortcut = shortcut;\n  return button;\n}`,
          `export function ${name}(button, { label, pressed = false }) {\n  button.type = "button";\n  button.title = label;\n  button.setAttribute("aria-label", label);\n  button.setAttribute("aria-pressed", String(pressed));\n  return button;\n}`
        ]
      },
      {
        key: "test",
        languageId: "dev-typescript",
        categoryId: "ts-tests",
        domain: "playwright.dev",
        versions: (name) => [
          `test("${name} keeps the capture visible", async ({ page }) => {\n  await page.goto("/welcome.html");\n  await page.getByText("Ultimate Clipboard Pro").waitFor();\n  await expect(page.locator("[data-role='track']")).toBeVisible();\n});`,
          `test("${name} does not eat the button labels", async ({ page }) => {\n  await page.goto("/welcome.html");\n  await expect(page.getByRole("button", { name: /next|suivant|siguiente/i })).toBeVisible();\n  await expect(page.locator("text=app.name")).toHaveCount(0);\n});`,
          `test("${name} remembers the user's dignity", async ({ page }) => {\n  await page.goto("/welcome.html");\n  await page.keyboard.press("Control+C");\n  await expect(page.locator("[data-role='toast']")).not.toContainText("undefined");\n});`
        ]
      },
      {
        key: "version",
        languageId: "dev-typescript",
        categoryId: "ts-versioning",
        domain: "github.com",
        versions: (name) => [
          `export function ${name}(item, draft) {\n  const versions = item.captureVersions || [{ id: item.id + "-v1", content: item.content }];\n  return {\n    ...item,\n    captureVersions: [...versions, { id: crypto.randomUUID(), ...draft, createdAt: Date.now() }]\n  };\n}`,
          `export function ${name}(item, draft, max = 10) {\n  const versions = item.captureVersions || [{ id: item.id + "-v1", content: item.content }];\n  if (versions.length >= max) return { ...item, content: draft.content, title: draft.title || item.title };\n  return { ...item, captureVersions: [...versions, { id: crypto.randomUUID(), ...draft, createdAt: Date.now() }] };\n}`,
          `export function ${name}(item, draft, max = 10) {\n  const versions = item.captureVersions?.length ? item.captureVersions : [{ id: item.id + "-v1", content: item.content, title: item.title }];\n  const nextVersion = { id: crypto.randomUUID(), ...draft, createdAt: Date.now() };\n  return { ...item, activeVersionId: nextVersion.id, captureVersions: [...versions, nextVersion].slice(-max) };\n}`
        ]
      },
      {
        key: "throttle",
        languageId: "dev-javascript",
        categoryId: "js-throttle",
        domain: "mdn.dev",
        versions: (name) => [
          `export function ${name}(fn, wait = 120) {\n  let last = 0;\n  return (...args) => {\n    const now = performance.now();\n    if (now - last < wait) return;\n    last = now;\n    fn(...args);\n  };\n}`,
          `export function ${name}(fn, wait = 120) {\n  let last = 0;\n  let trailing;\n  return (...args) => {\n    const now = performance.now();\n    clearTimeout(trailing);\n    if (now - last >= wait) {\n      last = now;\n      fn(...args);\n    } else {\n      trailing = setTimeout(() => fn(...args), wait);\n    }\n  };\n}`,
          `export function ${name}(fn, wait = 120) {\n  let frame = 0;\n  return (...args) => {\n    if (frame) return;\n    frame = requestAnimationFrame(() => {\n      frame = 0;\n      fn(...args);\n    });\n  };\n}`
        ]
      },
      {
        key: "classifier",
        languageId: "dev-python",
        categoryId: "python-classifier",
        domain: "localhost.dev",
        versions: (name) => [
          `def ${name}(capture):\n    text = " ".join(str(capture.get(key, "")) for key in ("title", "content", "sourceUrl")).lower()\n    if any(token in text for token in ("function", "const", "return", "import")):\n        return "code"\n    if any(token in text for token in ("invoice", "receipt", "payment")):\n        return "finance"\n    if any(token in text for token in ("prompt", "chatgpt", "gemini", "claude")):\n        return "ai"\n    return "general"`,
          `def ${name}(capture, rules):\n    text = " ".join(str(capture.get(key, "")) for key in ("title", "content", "sourceUrl")).lower()\n    for rule in rules:\n        if rule["pattern"].search(text):\n            return rule["category_id"]\n    return "general"`,
          `def ${name}(capture, rules=None):\n    rules = rules or []\n    text = " ".join(str(capture.get(key, "")) for key in ("title", "content", "note", "sourceUrl")).lower()\n    for rule in rules:\n        if rule["pattern"].search(text):\n            return {"category_id": rule["category_id"], "confidence": 0.88}\n    return {"category_id": "general", "confidence": 0.42}`
        ]
      },
      {
        key: "toast",
        languageId: "dev-react",
        categoryId: "react-toast",
        domain: "localhost.dev",
        versions: (name) => [
          `export function ${name}(root, message) {\n  const toast = root.querySelector("[data-role='toast']");\n  toast.textContent = message;\n  toast.hidden = false;\n  toast.classList.add("is-visible");\n}`,
          `export function ${name}(root, message, timeout = 2200) {\n  const toast = root.querySelector("[data-role='toast']");\n  toast.textContent = message;\n  toast.hidden = false;\n  toast.classList.add("is-visible");\n  clearTimeout(toast._timer);\n  toast._timer = setTimeout(() => toast.classList.remove("is-visible"), timeout);\n}`,
          `export function ${name}(root, { message, tone = "success" }) {\n  const toast = root.querySelector("[data-role='toast']");\n  toast.textContent = message;\n  toast.dataset.tone = tone;\n  toast.hidden = false;\n  toast.classList.add("is-visible");\n}`
        ]
      },
      {
        key: "import",
        languageId: "dev-json",
        categoryId: "json-backup",
        domain: "github.com",
        versions: (name) => [
          `{\n  "backupName": "${name}",\n  "schemaVersion": 3,\n  "createdAt": "2026-05-15T08:30:00.000Z",\n  "items": [],\n  "settings": {\n    "theme": "system",\n    "accentColor": "#ef1740",\n    "textViewMode": "card",\n    "codeViewMode": "card"\n  }\n}`,
          `{\n  "backupName": "${name}",\n  "schemaVersion": 3,\n  "createdAt": "2026-05-15T08:45:00.000Z",\n  "drive": {\n    "folderName": "Ultimate Clipboard Pro",\n    "strategy": "local-first",\n    "missingFolderPolicy": "recreate-on-demand"\n  },\n  "items": [],\n  "settings": {}\n}`,
          `{\n  "backupName": "${name}",\n  "schemaVersion": 3,\n  "createdAt": "2026-05-15T09:00:00.000Z",\n  "restore": {\n    "mergeMode": "keep-newest",\n    "includeVersions": true,\n    "includeFavorites": true,\n    "includeVault": true\n  },\n  "items": [],\n  "settings": {}\n}`
        ]
      },
      {
        key: "shortcut",
        languageId: "dev-javascript",
        categoryId: "js-shortcuts",
        domain: "developer.chrome.com",
        versions: (name) => [
          `export function ${name}(event) {\n  return [event.ctrlKey && "Ctrl", event.altKey && "Alt", event.shiftKey && "Shift", event.key.toUpperCase()]\n    .filter(Boolean)\n    .join(" + ");\n}`,
          `export function ${name}(event) {\n  const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;\n  return [event.metaKey && "Meta", event.ctrlKey && "Ctrl", event.altKey && "Alt", event.shiftKey && "Shift", key]\n    .filter(Boolean)\n    .join(" + ");\n}`,
          `export function ${name}(event) {\n  const parts = [];\n  if (event.metaKey) parts.push("Meta");\n  if (event.ctrlKey) parts.push("Ctrl");\n  if (event.altKey) parts.push("Alt");\n  if (event.shiftKey) parts.push("Shift");\n  parts.push(event.key.length === 1 ? event.key.toUpperCase() : event.key);\n  return parts.join(" + ");\n}`
        ]
      },
      {
        key: "calendar",
        languageId: "dev-sql",
        categoryId: "sql-calendar",
        domain: "github.com",
        versions: (name) => [
          `SELECT\n  DATE(created_at) AS capture_day,\n  COUNT(*) AS total_captures\nFROM captures\nWHERE deleted_at IS NULL\nGROUP BY DATE(created_at)\nORDER BY capture_day DESC;`,
          `SELECT\n  DATE(created_at) AS capture_day,\n  type,\n  COUNT(*) AS total_captures,\n  MAX(updated_at) AS latest_update\nFROM captures\nWHERE deleted_at IS NULL\nGROUP BY DATE(created_at), type\nORDER BY capture_day DESC, type ASC;`,
          `SELECT\n  DATE(created_at) AS capture_day,\n  SUM(CASE WHEN type = 'text' THEN 1 ELSE 0 END) AS text_count,\n  SUM(CASE WHEN type = 'code' THEN 1 ELSE 0 END) AS code_count,\n  SUM(CASE WHEN type = 'image' THEN 1 ELSE 0 END) AS image_count\nFROM captures\nWHERE deleted_at IS NULL\nGROUP BY DATE(created_at)\nHAVING COUNT(*) > 0\nORDER BY capture_day DESC;`
        ]
      },
      {
        key: "cleanup",
        languageId: "dev-shell",
        categoryId: "shell-cleanup",
        domain: "localhost.dev",
        versions: (name) => [
          `#!/usr/bin/env bash\nset -euo pipefail\n\nbackup_dir="\${HOME}/Ultimate Clipboard Pro/backups"\nfind "$backup_dir" -type f -name "*.tmp" -mtime +2 -print -delete\nfind "$backup_dir" -type f -name "*.json" -size 0 -print -delete`,
          `#!/usr/bin/env bash\nset -euo pipefail\n\nbackup_dir="\${HOME}/Ultimate Clipboard Pro/backups"\narchive_dir="\${backup_dir}/archive"\nmkdir -p "$archive_dir"\nfind "$backup_dir" -maxdepth 1 -type f -name "*.json" -mtime +30 -exec mv {} "$archive_dir" \\;`,
          `#!/usr/bin/env bash\nset -euo pipefail\n\nbackup_dir="\${HOME}/Ultimate Clipboard Pro/backups"\nlog_file="\${backup_dir}/cleanup.log"\n{\n  date\n  find "$backup_dir" -type f -name "*.tmp" -mtime +2 -print -delete\n  find "$backup_dir" -type f -name "*.json" -size 0 -print -delete\n} >> "$log_file"`
        ]
      }
    ];
    return blueprints.flatMap((blueprint, blueprintIndex) => Array.from({ length: 4 }, (_, variantIndex) => {
      const name = `Preview${blueprint.key.replace(/(^|-)([a-z])/g, (_, __, char) => char.toUpperCase())}${variantIndex + 1}`;
      const titleBase = copy.titles[blueprint.key] || blueprint.key;
      return {
        id: `real-code-${blueprint.key}-${variantIndex + 1}`,
        title: variantIndex ? `${titleBase} ${copy.suffix} ${variantIndex + 1}` : titleBase,
        categoryId: blueprint.categoryId,
        languageId: blueprint.languageId,
        domain: blueprint.domain,
        url: `https://${blueprint.domain}/arcawand/ultimate-clipboard-pro/${blueprint.key}-${variantIndex + 1}`,
        pinned: blueprintIndex === 0 && variantIndex < 2,
        favorite: (blueprintIndex + variantIndex) % 7 === 0,
        versions: blueprint.versions(name)
      };
    }));
  }

  function welcomePreviewHumorExtras(language = "en", base = {}) {
    const i18n = {
      fr: {
        general: "Général",
        categories: [
          { id: "onboarding-smiles", name: "Sourires de bienvenue" },
          { id: "daily-chaos", name: "Chaos du quotidien" },
          { id: "tiny-victories", name: "Petites victoires" },
          { id: "clipboard-magic", name: "Magie du presse-papiers" },
          { id: "coffee-notes", parentId: "daily-chaos", name: "Notes caféinées" },
          { id: "keyboard-life", parentId: "tiny-victories", name: "Vie au clavier" }
        ],
        textTitles: [
          "Bienvenue, chasseur de copies perdues", "Note pour mon futur moi", "Le presse-papiers respire enfin", "Sauvetage de phrase fragile", "Copie numéro beaucoup trop importante", "Prompt qui refuse de disparaître", "Réponse client anti-panique", "Mémo café avant réunion", "Le code était là il y a deux secondes", "Rappel : respirer avant de coller", "Phrase brillante de 02h13", "Le copier-coller avec ceinture de sécurité", "Mini victoire du clavier", "Texte retrouvé, dignité sauvée", "La capture qui évite le drame", "Post-it numérique civilisé", "Idée brillante sous surveillance", "Brouillon qui mérite une cape", "Message poli mais pas mou", "Liste de choses à ne pas perdre", "Plan B du presse-papiers", "Le Ctrl+C a enfin une mémoire", "Petite archive pour grand cerveau", "Note de réunion presque sage", "Prompt premium pour lundi matin", "Citation à ressortir fièrement", "Réponse rapide sans sueur froide", "Fragment sauvé du néant", "Copie importante, ambiance calme", "Texte qui fait coucou"
        ],
        textVersions: [
          (title, n) => `${title}. Première version : l'utilisateur vient d'installer l'extension, tout va bien, aucun texte ne tombera plus dans le trou noir du presse-papiers. C'est presque émouvant, mais on garde une posture professionnelle.`,
          (title, n) => `${title}. Version ${n} : ajout d'un rappel essentiel : si cette phrase disparaît encore, ce sera probablement la faute d'un lundi matin trop ambitieux, pas de l'extension.`,
          (title, n) => `${title}. Version ${n} : reformulation plus élégante, avec juste assez d'humour pour faire sourire sans transformer le navigateur en spectacle de stand-up.`,
          (title, n) => `${title}. Version ${n} : précision ajoutée pour le futur moi qui cherchera cette capture dans trois jours avec un café froid et beaucoup de détermination.`,
          (title, n) => `${title}. Version finale provisoire : tout est classé, titré, versionné et prêt à être retrouvé. Le presse-papiers vient officiellement d'obtenir une promotion.`
        ],
        urlLang: "fr"
      },
      en: {
        general: "General",
        categories: [
          { id: "onboarding-smiles", name: "Welcome smiles" },
          { id: "daily-chaos", name: "Daily chaos" },
          { id: "tiny-victories", name: "Tiny victories" },
          { id: "clipboard-magic", name: "Clipboard magic" },
          { id: "coffee-notes", parentId: "daily-chaos", name: "Coffee notes" },
          { id: "keyboard-life", parentId: "tiny-victories", name: "Keyboard life" }
        ],
        textTitles: [
          "Welcome, lost-copy hunter", "Note to future me", "The clipboard can breathe now", "Rescue of a fragile sentence", "Copy number far too important", "Prompt that refuses to vanish", "Customer reply without panic", "Coffee memo before meeting", "The code was here two seconds ago", "Reminder: breathe before pasting", "Brilliant sentence from 2:13 AM", "Copy-paste with a seatbelt", "Tiny keyboard victory", "Text found, dignity saved", "The capture that prevents drama", "Civilized digital sticky note", "Bright idea under supervision", "Draft wearing a tiny cape", "Polite message with a spine", "List of things not to lose", "Clipboard plan B", "Ctrl+C finally has a memory", "Small archive for a busy brain", "Almost-wise meeting note", "Premium prompt for Monday morning", "Quote to reuse proudly", "Fast reply without cold sweat", "Fragment saved from the void", "Important copy, calm atmosphere", "Text waving hello"
        ],
        textVersions: [
          (title, n) => `${title}. First version: the user just installed the extension, everything is fine, and no sentence should fall into the clipboard black hole anymore. Slightly emotional, still professional.`,
          (title, n) => `${title}. Version ${n}: important reminder added. If this sentence disappears again, it is probably because Monday morning got overconfident, not because of the extension.`,
          (title, n) => `${title}. Version ${n}: smoother wording, with enough humor to cause a smile without turning the browser into a comedy club.`,
          (title, n) => `${title}. Version ${n}: extra note for future me, who will search for this capture in three days with cold coffee and heroic determination.`,
          (title, n) => `${title}. Temporary final version: sorted, titled, versioned and ready to be found again. The clipboard has officially been promoted.`
        ],
        urlLang: "en"
      },
      es: {
        general: "General",
        categories: [
          { id: "onboarding-smiles", name: "Sonrisas de bienvenida" },
          { id: "daily-chaos", name: "Caos diario" },
          { id: "tiny-victories", name: "Pequeñas victorias" },
          { id: "clipboard-magic", name: "Magia del portapapeles" },
          { id: "coffee-notes", parentId: "daily-chaos", name: "Notas con café" },
          { id: "keyboard-life", parentId: "tiny-victories", name: "Vida de teclado" }
        ],
        textTitles: [
          "Bienvenido, cazador de copias perdidas", "Nota para mi yo futuro", "El portapapeles respira", "Rescate de frase frágil", "Copia demasiado importante", "Prompt que no quiere desaparecer", "Respuesta cliente sin pánico", "Memo con café antes de la reunión", "El código estaba aquí hace dos segundos", "Respira antes de pegar", "Frase brillante de las 02:13", "Copiar y pegar con cinturón", "Pequeña victoria del teclado", "Texto encontrado, dignidad salvada", "La captura que evita el drama", "Post-it digital civilizado", "Idea brillante vigilada", "Borrador con capa imaginaria", "Mensaje educado pero firme", "Lista de cosas que no perder", "Plan B del portapapeles", "Ctrl+C por fin tiene memoria", "Archivo pequeño para mente ocupada", "Nota de reunión casi sabia", "Prompt premium de lunes", "Cita para reutilizar con orgullo", "Respuesta rápida sin sudor frío", "Fragmento salvado del vacío", "Copia importante, calma total", "Texto saludando"
        ],
        textVersions: [
          (title, n) => `${title}. Primera versión: el usuario acaba de instalar la extensión, todo va bien y ninguna frase debería caer ya en el agujero negro del portapapeles.`,
          (title, n) => `${title}. Versión ${n}: recordatorio importante añadido. Si esta frase desaparece otra vez, probablemente sea culpa de un lunes demasiado ambicioso.`,
          (title, n) => `${title}. Versión ${n}: redacción más elegante, con humor suficiente para sonreír sin convertir el navegador en un monólogo.`,
          (title, n) => `${title}. Versión ${n}: nota para mi yo futuro, que buscará esta captura dentro de tres días con café frío y mucha determinación.`,
          (title, n) => `${title}. Versión final provisional: ordenado, titulado, versionado y listo para encontrarse. El portapapeles acaba de ascender.`
        ],
        urlLang: "es"
      },
      it: {
        general: "Generale",
        categories: [
          { id: "onboarding-smiles", name: "Sorrisi di benvenuto" },
          { id: "daily-chaos", name: "Caos quotidiano" },
          { id: "tiny-victories", name: "Piccole vittorie" },
          { id: "clipboard-magic", name: "Magia degli appunti" },
          { id: "coffee-notes", parentId: "daily-chaos", name: "Note al caffè" },
          { id: "keyboard-life", parentId: "tiny-victories", name: "Vita da tastiera" }
        ],
        textTitles: [
          "Benvenuto, cacciatore di copie perse", "Nota per il mio io futuro", "Gli appunti respirano", "Salvataggio di frase fragile", "Copia troppo importante", "Prompt che non vuole sparire", "Risposta cliente senza panico", "Memo al caffè prima della riunione", "Il codice era qui due secondi fa", "Respira prima di incollare", "Frase brillante delle 02:13", "Copia-incolla con cintura", "Piccola vittoria da tastiera", "Testo trovato, dignità salvata", "La cattura che evita il dramma", "Post-it digitale civile", "Idea brillante sorvegliata", "Bozza con mantello immaginario", "Messaggio gentile ma deciso", "Lista di cose da non perdere", "Piano B degli appunti", "Ctrl+C ha finalmente memoria", "Piccolo archivio per mente occupata", "Nota riunione quasi saggia", "Prompt premium del lunedì", "Citazione da riusare con orgoglio", "Risposta rapida senza sudori freddi", "Frammento salvato dal vuoto", "Copia importante, calma totale", "Testo che saluta"
        ],
        textVersions: [
          (title, n) => `${title}. Prima versione: l'utente ha appena installato l'estensione, va tutto bene e nessuna frase dovrebbe più cadere nel buco nero degli appunti.`,
          (title, n) => `${title}. Versione ${n}: promemoria essenziale aggiunto. Se questa frase sparisce ancora, probabilmente è colpa di un lunedì troppo ambizioso.`,
          (title, n) => `${title}. Versione ${n}: formulazione più elegante, con abbastanza umorismo da far sorridere senza trasformare il browser in uno spettacolo.`,
          (title, n) => `${title}. Versione ${n}: nota per il mio io futuro, che cercherà questa cattura tra tre giorni con caffè freddo e determinazione eroica.`,
          (title, n) => `${title}. Versione finale provvisoria: ordinata, titolata, versionata e pronta da ritrovare. Gli appunti hanno appena ricevuto una promozione.`
        ],
        urlLang: "it"
      },
      de: {
        general: "Allgemein",
        categories: [
          { id: "onboarding-smiles", name: "Willkommenslächeln" },
          { id: "daily-chaos", name: "Alltagschaos" },
          { id: "tiny-victories", name: "Kleine Siege" },
          { id: "clipboard-magic", name: "Zwischenablage-Magie" },
          { id: "coffee-notes", parentId: "daily-chaos", name: "Kaffeenotizen" },
          { id: "keyboard-life", parentId: "tiny-victories", name: "Tastaturleben" }
        ],
        textTitles: [
          "Willkommen, Jäger verlorener Kopien", "Notiz an mein Zukunfts-Ich", "Die Zwischenablage atmet auf", "Rettung eines fragilen Satzes", "Viel zu wichtige Kopie", "Prompt, der nicht verschwinden will", "Kundenantwort ohne Panik", "Kaffee-Memo vor dem Meeting", "Der Code war eben noch da", "Erst atmen, dann einfügen", "Genialer Satz von 02:13 Uhr", "Copy-Paste mit Sicherheitsgurt", "Kleiner Tastatursieg", "Text gefunden, Würde gerettet", "Die Capture gegen das Drama", "Zivilisierter digitaler Klebezettel", "Glänzende Idee unter Aufsicht", "Entwurf mit Mini-Umhang", "Höfliche Nachricht mit Haltung", "Liste der Dinge, die bleiben sollen", "Plan B der Zwischenablage", "Ctrl+C hat endlich Gedächtnis", "Kleines Archiv für volle Köpfe", "Fast weise Meeting-Notiz", "Premium-Prompt für Montagmorgen", "Zitat zum stolzen Wiederverwenden", "Schnelle Antwort ohne kalten Schweiß", "Fragment aus dem Nichts gerettet", "Wichtige Kopie, ruhige Stimmung", "Text winkt freundlich"
        ],
        textVersions: [
          (title, n) => `${title}. Erste Version: Der Nutzer hat die Erweiterung gerade installiert, alles ist gut, und kein Satz sollte mehr im schwarzen Loch der Zwischenablage verschwinden.`,
          (title, n) => `${title}. Version ${n}: Wichtige Erinnerung ergänzt. Wenn dieser Satz wieder verschwindet, war vermutlich ein Montagmorgen zu selbstbewusst.`,
          (title, n) => `${title}. Version ${n}: eleganter formuliert, mit genug Humor für ein Lächeln, aber ohne den Browser zur Comedy-Bühne zu machen.`,
          (title, n) => `${title}. Version ${n}: Zusatznotiz für mein Zukunfts-Ich, das diese Capture in drei Tagen mit kaltem Kaffee und großer Entschlossenheit sucht.`,
          (title, n) => `${title}. Vorläufig finale Version: sortiert, betitelt, versioniert und auffindbar. Die Zwischenablage wurde offiziell befördert.`
        ],
        urlLang: "de"
      }
    };
    const copy = i18n[language] || i18n.en;
    const codeCategories = welcomePreviewCodeCategoryMeta(language);
    const textCategoryIds = ["onboarding-smiles", "daily-chaos", "tiny-victories", "clipboard-magic", "coffee-notes", "keyboard-life", "prompts", "meetings", "support", "roadmap"];
    const textStyleBuilders = [
      (title, n) => `${title}. Mini-dialogue : "Tu te souviens de ce que tu viens de copier ?" demande le navigateur. "Oui", répond l'utilisateur avec une confiance excessive. Heureusement, Ultimate Clipboard Pro a pris des notes.`,
      (title, n) => `${title}. Mémo officiel du service des phrases sauvées : cette capture a été retrouvée vivante, légèrement décoiffée, mais parfaitement prête à être recollée au bon moment.`,
      (title, n) => `${title}. Version carte postale : salut du futur, ici tout va bien. La phrase que tu pensais perdre est rangée, titrée, versionnée et elle bronze tranquillement dans l'onglet Texte.`,
      (title, n) => `${title}. Alerte douce : l'IA a proposé trois idées, le cerveau en a gardé une seule, et l'extension garde les trois parce qu'elle est plus diplomate que nous.`,
      (title, n) => `${title}. Recette rapide : prenez une bonne idée, ajoutez un Ctrl+C, saupoudrez de recherche avancée, puis laissez reposer dans une catégorie jusqu'à utilisation.`,
      (title, n) => `${title}. Note de réunion : quelqu'un a dit "on le garde quelque part". Pour une fois, ce "quelque part" possède un titre, une URL source et une chance réelle d'être retrouvé.`,
      (title, n) => `${title}. Bulletin météo du presse-papiers : risque élevé de copier beaucoup trop de choses, visibilité excellente grâce aux versions, aucune disparition prévue.`,
      (title, n) => `${title}. Message à l'ancien presse-papiers : merci pour les services rendus, mais ton concept de mémoire instantanément amnésique était un peu audacieux.`,
      (title, n) => `${title}. Pensée de café froid : si cette phrase était une chaussette, elle aurait déjà disparu. Heureusement, c'est une capture, donc elle reste ici.`,
      (title, n) => `${title}. Rapport de mission : objectif copier atteint, objectif ne pas oublier atteint, objectif avoir l'air organisé devant soi-même en très bonne voie.`,
      (title, n) => `${title}. Confession de navigateur : j'ai vu passer beaucoup d'onglets, quelques promesses et un prompt interminable. Celui-ci, au moins, est en sécurité.`,
      (title, n) => `${title}. Mode philosophe : une copie non sauvegardée est-elle vraiment copiée ? L'extension préfère éviter le débat et l'enregistre tout de suite.`,
      (title, n) => `${title}. Note anti-panique : quand le texte compte vraiment, on évite de le confier uniquement à la mémoire héroïque d'un mardi après-midi.`,
      (title, n) => `${title}. Micro-liste : 1. Copier. 2. Sourire. 3. Retrouver plus tard. 4. Prétendre que cette organisation était prévue depuis le début.`,
      (title, n) => `${title}. Message pour l'IA : merci pour l'idée brillante. Nous l'avons placée dans une boîte confortable avec une étiquette, de l'eau fraîche et un bouton Copier.`,
      (title, n) => `${title}. Note dramatique : le texte avançait vers l'oubli, musique intense en arrière-plan. Puis la capture automatique est arrivée avec une cape imaginaire.`,
      (title, n) => `${title}. Journal de bord : la phrase a été copiée à une heure raisonnable, ce qui est déjà suspect. Elle restera disponible pour enquête ultérieure.`,
      (title, n) => `${title}. Étiquette de musée : fragment rare de pensée productive, capturé avant évaporation naturelle dans un océan d'onglets ouverts.`,
      (title, n) => `${title}. Protocole de survie : si le cerveau dit "je m'en souviendrai", sauvegarder immédiatement. Le cerveau est sympathique, mais optimiste.`,
      (title, n) => `${title}. Dernière révision : plus claire, plus drôle, moins perdue. Cette capture vient officiellement de passer du chaos au confort.`
    ];
    textStyleBuilders.splice(0, textStyleBuilders.length, ...welcomePreviewTextStyleBuilders(language));
    const textItems = Array.from({ length: 70 }, (_, index) => {
      const title = copy.textTitles[index % copy.textTitles.length];
      const itemNumber = index + 1;
      const styleOffset = index % textStyleBuilders.length;
      return {
        id: `wink-text-${itemNumber}`,
        title: itemNumber > copy.textTitles.length ? `${title} ${Math.floor(index / copy.textTitles.length) + 1}` : title,
        categoryId: textCategoryIds[index % textCategoryIds.length],
        domain: ["welcome.local", "coffee.example.com", "keyboard.example.com", "smile.example.com", "copy.example.com"][index % 5],
        url: `https://welcome.local/${copy.urlLang}/smile-${itemNumber}`,
        pinned: index === 0 || index === 1,
        favorite: index % 9 === 0,
        versions: Array.from({ length: 5 }, (_, versionIndex) => textStyleBuilders[(styleOffset + versionIndex) % textStyleBuilders.length](title, versionIndex + 1))
      };
    });
    const codeItems = welcomePreviewCodeItems(language);
    return { categories: copy.categories, devCategories: codeCategories, textItems, codeItems };
  }

  function welcomePreviewCategoryName(categories, categoryId, fallback = "General") {
    return categories.find((category) => category.id === categoryId)?.name || fallback;
  }

  function buildWelcomeFloatingPreviewState(settingsPatch = {}) {
    const previewData = window.__UCP_WELCOME_FLOATING_PREVIEW_DATA__;
    const settings = Object.assign({}, globalThis.MCP?.DEFAULT_SETTINGS || {}, window.__UCP_WELCOME_FLOATING_PREVIEW_SETTINGS__ || {}, settingsPatch || {}, {
      floatingPanelOpen: true,
      floatingLauncherCollapsed: false,
      showScreenshotFloatingButton: false,
      plan: "pro",
      proStatus: "active"
    });
    const language = settings.language || "en";
    const copy = welcomePreviewDataset(language);
    const now = Date.now();
    const categories = copy.categories || [];
    const devCategories = copy.devCategories || [];
    const defaultState = {
      settings,
      categories,
      devCategories,
      imageCategories: [
        { id: "image-general", name: copy.general || "General" },
        { id: "image-design", name: welcomePreviewCategoryName(categories, "product", "Product") }
      ],
      items: (copy.textItems || []).map((item, index) => {
        const versions = buildWelcomePreviewItemVersions(`welcome-preview-text-${item.id}`, item.title, item.versions || []);
        return {
          id: `welcome-preview-text-${item.id}`,
          title: item.title,
          content: versions[0]?.content || "",
          preview: versions[0]?.content || "",
          categoryId: item.categoryId || "general",
          categoryName: welcomePreviewCategoryName(categories, item.categoryId, copy.general || "General"),
          sourceDomain: item.domain || "docs.example.com",
          sourceUrl: item.url || "https://docs.example.com",
          createdAt: now - (index + 6) * 430000,
          updatedAt: now - (index + 2) * 210000,
          isPinned: Boolean(item.pinned),
          isFavorite: Boolean(item.favorite),
          activeVersionId: versions[Math.max(0, versions.length - 1)]?.id,
          captureVersions: versions
        };
      }),
      devItems: (copy.codeItems || []).map((item, index) => {
      const versions = buildWelcomePreviewItemVersions(`welcome-preview-code-${item.id}`, item.title, item.versions || []);
      const categoryName = welcomePreviewCategoryName(devCategories, item.categoryId, copy.general || "General");
      const languageName = welcomePreviewCategoryName(devCategories, item.languageId || item.categoryId, categoryName);
      return {
        id: `welcome-preview-code-${item.id}`,
          title: item.title,
          content: versions[0]?.content || "",
          preview: versions[0]?.content || "",
          categoryId: item.categoryId || "dev-general",
          languageId: item.languageId || item.categoryId || "dev-general",
          categoryName,
          languageName,
          sourceDomain: item.domain || "workspace.example.com",
          sourceUrl: item.url || "https://workspace.example.com/snippets",
          createdAt: now - (index + 5) * 390000,
          updatedAt: now - (index + 1) * 180000,
          isPinned: Boolean(item.pinned),
          isFavorite: Boolean(item.favorite),
          activeVersionId: versions[Math.max(0, versions.length - 1)]?.id,
          captureVersions: versions
        };
      }),
      imageItems: [1, 2, 3].map((number, index) => ({
        id: `welcome-preview-image-${number}`,
        title: `${copy.imageTitle} ${number}`,
        altText: `${copy.imageTitle} ${number}`,
        categoryId: "image-design",
        categoryName: welcomePreviewCategoryName(categories, "product", "Product"),
        imageUrl: chrome.runtime.getURL(`assets/demo/${number}.jpg`),
        thumbnailUrl: chrome.runtime.getURL(`assets/demo/${number}.jpg`),
        sourceDomain: "image.example.com",
        sourceUrl: "https://image.example.com/gallery",
        createdAt: now - (index + 1) * 180000,
        updatedAt: now - (index + 1) * 120000,
        isPinned: index === 0,
        isFavorite: index === 1,
        isScreenshot: index === 0
      }))
    };
    if (previewData && typeof previewData === "object") {
      return Object.assign({}, defaultState, {
        categories: Array.isArray(previewData.categories) ? previewData.categories : defaultState.categories,
        devCategories: Array.isArray(previewData.devCategories) ? previewData.devCategories : defaultState.devCategories,
        imageCategories: Array.isArray(previewData.imageCategories) ? previewData.imageCategories : defaultState.imageCategories,
        items: Array.isArray(previewData.items) ? previewData.items : defaultState.items,
        devItems: Array.isArray(previewData.devItems) ? previewData.devItems : defaultState.devItems,
        imageItems: Array.isArray(previewData.imageItems) ? previewData.imageItems : defaultState.imageItems
      });
    }
    return defaultState;
  }

  global.MCP = Object.assign(global.MCP || {}, {
    buildWelcomeFloatingPreviewState
  });
})(globalThis);
