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
      blocked: "This is a visual demo of the extension. Please install the extension to access all features.",
      desktopOnlyTitle: "Demo available on PC only",
      desktopOnly: "Demo mode is available on PC only. Please open this page on a computer to try the visual demo.",
      closeLabel: "Close demo message",
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
      blocked: "Ceci est une démo visuelle de l'extension. Merci d'installer l'extension pour accéder à l'intégralité des fonctionnalités.",
      desktopOnlyTitle: "Démo disponible sur PC uniquement",
      desktopOnly: "Le mode démo est disponible sur PC uniquement. Ouvrez cette page sur un ordinateur pour essayer la démo visuelle.",
      closeLabel: "Fermer le message de démonstration",
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
      blocked: "Esta es una demo visual de la extensión. Instala la extensión para acceder a todas las funciones.",
      desktopOnlyTitle: "Demo disponible solo en PC",
      desktopOnly: "El modo demo está disponible solo en PC. Abre esta página en un ordenador para probar la demo visual.",
      closeLabel: "Cerrar el mensaje de demostración",
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
      blocked: "Questa è una demo visiva dell'estensione. Installa l'estensione per accedere a tutte le funzionalità.",
      desktopOnlyTitle: "Demo disponibile solo su PC",
      desktopOnly: "La modalità demo è disponibile solo su PC. Apri questa pagina su un computer per provare la demo visiva.",
      closeLabel: "Chiudi il messaggio demo",
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
      blocked: "Dies ist eine visuelle Demo der Erweiterung. Bitte installieren Sie die Erweiterung, um auf alle Funktionen zuzugreifen.",
      desktopOnlyTitle: "Demo nur auf PC verfügbar",
      desktopOnly: "Der Demo-Modus ist nur auf PC verfügbar. Öffnen Sie diese Seite auf einem Computer, um die visuelle Demo zu testen.",
      closeLabel: "Demo-Hinweis schließen",
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

  const extraTextSamples = {
    en: [
      ["Marketing idea", "Write a short social post that presents one practical productivity idea without hype.", "Make the post more concrete with an example from daily browser work.", "Add a softer ending that invites a simple reply from readers."],
      ["Product feedback", "Group these product requests by user pain, frequency, revenue impact and implementation effort.", "Add a recommendation section that separates quick wins from deep product bets.", "Turn it into a roadmap note for a founder who needs to decide what ships next."],
      ["Legal checklist", "Build a legal review checklist for privacy, user consent, data retention and third-party services.", "Add a Chrome extension angle: permissions, local storage, optional cloud sync and payment provider.", "Make the checklist easier to reuse before every release."],
      ["Training note", "Prepare an onboarding note for a new support teammate explaining the capture workflow.", "Add common mistakes, quality standards and when to escalate a case.", "Make it concise enough to paste into an internal knowledge base."],
      ["Prompt cleanup", "Rewrite this rough AI prompt so it has role, context, constraints, examples and output format.", "Add verification criteria and a final self-check section.", "Make the prompt reusable for several customer support scenarios."],
      ["Sales objection", "Answer the objection: I already use the normal clipboard, why would I need this?", "Make the answer benefit-led with examples: research, code, screenshots and source history.", "Add a concise version for a pricing page FAQ."],
      ["Vault note", "Store this sensitive onboarding token note in the vault and keep the source context attached.", "Rewrite as a private operations note with minimal exposure."],
      ["Deleted draft", "This old campaign draft should be kept in the trash for review before permanent deletion.", "Add a short reason explaining why the draft was retired."]
    ],
    fr: [
      ["Idée marketing", "Écris un post court qui présente une idée de productivité pratique sans exagération.", "Rends le post plus concret avec un exemple de travail quotidien dans le navigateur.", "Ajoute une fin plus douce qui invite à une réponse simple."],
      ["Retour produit", "Regroupe ces demandes produit par douleur utilisateur, fréquence, impact revenu et effort d’implémentation.", "Ajoute une recommandation qui sépare les gains rapides des paris produit plus profonds.", "Transforme-le en note roadmap pour décider quoi livrer ensuite."],
      ["Checklist juridique", "Construis une checklist juridique pour confidentialité, consentement utilisateur, conservation des données et services tiers.", "Ajoute l’angle extension Chrome : permissions, stockage local, synchro cloud optionnelle et paiement.", "Rends la checklist plus facile à réutiliser avant chaque sortie."],
      ["Note de formation", "Prépare une note d’accueil pour un nouveau membre support qui explique le flux de capture.", "Ajoute les erreurs courantes, les standards de qualité et les cas d’escalade.", "Rends-la assez concise pour une base de connaissance interne."],
      ["Nettoyage de prompt", "Réécris ce prompt brut avec rôle, contexte, contraintes, exemples et format de sortie.", "Ajoute des critères de vérification et une section finale d’auto-contrôle.", "Rends le prompt réutilisable pour plusieurs scénarios de support client."],
      ["Objection commerciale", "Réponds à l’objection : j’utilise déjà le presse-papiers normal, pourquoi aurais-je besoin de ça ?", "Réponds par les bénéfices avec exemples : recherche, code, captures d’écran et historique des sources.", "Ajoute une version concise pour une FAQ tarifaire."],
      ["Note coffre-fort", "Range cette note de jeton sensible dans le coffre-fort et garde le contexte source attaché.", "Réécris en note privée d’opérations avec exposition minimale."],
      ["Brouillon supprimé", "Cet ancien brouillon de campagne doit rester dans la corbeille avant suppression définitive.", "Ajoute une courte raison expliquant pourquoi le brouillon a été retiré."]
    ],
    es: [
      ["Idea de marketing", "Escribe una publicación corta con una idea práctica de productividad sin exageraciones.", "Hazla más concreta con un ejemplo de trabajo diario en el navegador.", "Añade un cierre suave que invite a responder fácilmente."],
      ["Feedback de producto", "Agrupa estas solicitudes por dolor de usuario, frecuencia, impacto en ingresos y esfuerzo técnico.", "Añade una recomendación separando victorias rápidas y apuestas profundas.", "Conviértelo en una nota de roadmap para decidir qué lanzar después."],
      ["Checklist legal", "Crea una checklist para privacidad, consentimiento, retención de datos y servicios externos.", "Añade el ángulo de extensión Chrome: permisos, almacenamiento local, nube opcional y pagos.", "Haz que sea reutilizable antes de cada lanzamiento."],
      ["Nota de formación", "Prepara una nota para un nuevo agente de soporte explicando el flujo de capturas.", "Añade errores comunes, estándares de calidad y cuándo escalar un caso.", "Hazla breve para una base de conocimiento interna."],
      ["Limpieza de prompt", "Reescribe este prompt con rol, contexto, restricciones, ejemplos y formato de salida.", "Añade criterios de verificación y una sección final de auto-revisión.", "Hazlo reutilizable para varios escenarios de soporte."],
      ["Objeción comercial", "Responde: ya uso el portapapeles normal, ¿por qué necesitaría esto?", "Responde con beneficios y ejemplos: investigación, código, capturas e historial de fuentes.", "Añade una versión breve para una FAQ de precios."],
      ["Nota de caja fuerte", "Guarda esta nota sensible en la caja fuerte con su contexto de origen.", "Reescríbela como nota privada de operaciones con exposición mínima."],
      ["Borrador eliminado", "Este antiguo borrador de campaña debe permanecer en la papelera antes de eliminarse definitivamente.", "Añade una razón breve de por qué se retiró el borrador."]
    ],
    it: [
      ["Idea marketing", "Scrivi un post breve con un’idea pratica di produttività senza enfasi inutile.", "Rendilo più concreto con un esempio di lavoro quotidiano nel browser.", "Aggiungi una chiusura morbida che inviti a una risposta semplice."],
      ["Feedback prodotto", "Raggruppa queste richieste per dolore utente, frequenza, impatto ricavi e sforzo tecnico.", "Aggiungi una raccomandazione che separi quick win e scommesse prodotto.", "Trasformalo in una nota roadmap per decidere cosa rilasciare dopo."],
      ["Checklist legale", "Costruisci una checklist per privacy, consenso utente, conservazione dati e servizi terzi.", "Aggiungi l’angolo estensione Chrome: permessi, storage locale, cloud opzionale e pagamenti.", "Rendila facile da riutilizzare prima di ogni rilascio."],
      ["Nota formazione", "Prepara una nota per un nuovo membro supporto che spieghi il flusso di cattura.", "Aggiungi errori comuni, standard qualità e quando escalare un caso.", "Rendila breve per una knowledge base interna."],
      ["Pulizia prompt", "Riscrivi questo prompt con ruolo, contesto, vincoli, esempi e formato output.", "Aggiungi criteri di verifica e una sezione finale di auto-controllo.", "Rendilo riutilizzabile per diversi scenari di supporto cliente."],
      ["Obiezione commerciale", "Rispondi: uso già gli appunti normali, perché dovrei averne bisogno?", "Rispondi con benefici ed esempi: ricerca, codice, screenshot e cronologia fonti.", "Aggiungi una versione breve per una FAQ prezzi."],
      ["Nota cassaforte", "Salva questa nota sensibile nella cassaforte con il contesto sorgente.", "Riscrivila come nota operativa privata con esposizione minima."],
      ["Bozza eliminata", "Questa vecchia bozza campagna deve restare nel cestino prima della cancellazione definitiva.", "Aggiungi una breve ragione per cui è stata ritirata."]
    ],
    de: [
      ["Marketing-Idee", "Schreibe einen kurzen Social Post mit einer praktischen Produktivitätsidee ohne Hype.", "Mach ihn konkreter mit einem Beispiel aus der täglichen Browserarbeit.", "Füge einen weicheren Abschluss hinzu, der zu einer einfachen Antwort einlädt."],
      ["Produktfeedback", "Gruppiere diese Anfragen nach Nutzerschmerz, Häufigkeit, Umsatzwirkung und Umsetzungsaufwand.", "Ergänze eine Empfehlung mit Quick Wins und tieferen Produktwetten.", "Wandle es in eine Roadmap-Notiz für die nächste Release-Entscheidung um."],
      ["Rechtscheckliste", "Erstelle eine Checkliste für Datenschutz, Nutzereinwilligung, Datenaufbewahrung und Drittanbieter.", "Ergänze den Chrome-Erweiterungswinkel: Berechtigungen, lokaler Speicher, optionale Cloud und Zahlungen.", "Mach sie vor jedem Release leicht wiederverwendbar."],
      ["Schulungsnotiz", "Bereite eine Onboarding-Notiz für ein neues Support-Teammitglied zum Capture-Workflow vor.", "Ergänze häufige Fehler, Qualitätsstandards und Eskalationsfälle.", "Kürze sie für eine interne Wissensdatenbank."],
      ["Prompt-Bereinigung", "Schreibe diesen Prompt mit Rolle, Kontext, Einschränkungen, Beispielen und Ausgabeformat neu.", "Ergänze Prüfkriterien und eine finale Selbstkontrolle.", "Mach ihn für mehrere Support-Szenarien wiederverwendbar."],
      ["Vertriebs-Einwand", "Beantworte: Ich nutze schon die normale Zwischenablage, warum brauche ich das?", "Antworte nutzenorientiert mit Beispielen: Recherche, Code, Screenshots und Quellenverlauf.", "Ergänze eine Kurzversion für eine Preis-FAQ."],
      ["Tresor-Notiz", "Lege diese sensible Token-Notiz im Tresor ab und behalte den Quellenkontext.", "Schreibe sie als private Operations-Notiz mit minimaler Sichtbarkeit um."],
      ["Gelöschter Entwurf", "Dieser alte Kampagnenentwurf soll vor endgültigem Löschen im Papierkorb bleiben.", "Ergänze kurz, warum der Entwurf zurückgezogen wurde."]
    ]
  };

  Object.keys(extraTextSamples).forEach((language) => {
    textSamples[language] = [...(textSamples[language] || []), ...extraTextSamples[language]];
  });

  const extraCodeSamples = {
    en: [
      ["Accessible icon button", "export function IconButton({ label, children, ...props }) {\n  return <button aria-label={label} title={label} {...props}>{children}</button>;\n}", "export function IconButton({ label, children, ...props }) {\n  return <button type=\"button\" aria-label={label} title={label} {...props}>{children}</button>;\n}"],
      ["Clipboard write guard", "async function writeClipboard(text) {\n  await navigator.clipboard.writeText(text);\n  return true;\n}", "async function writeClipboard(text) {\n  if (!navigator.clipboard?.writeText) return false;\n  await navigator.clipboard.writeText(String(text || \"\"));\n  return true;\n}"],
      ["Search predicate", "const matches = item.title.includes(query) || item.content.includes(query);", "const normalized = query.trim().toLowerCase();\nconst matches = [item.title, item.content, item.note, item.sourceUrl]\n  .filter(Boolean)\n  .some((value) => String(value).toLowerCase().includes(normalized));"],
      ["Version label", "const label = `V${index + 1}`;", "const label = version.title?.trim() || `V${index + 1}`;\nconst ariaLabel = `${label} - ${version.createdAt}`;"],
      ["Vault check", "if (!settings.vaultEnabled) throw new Error(\"vault-disabled\");", "if (!canUseFeature(\"vault\", settings)) {\n  throw new Error(\"pro-vault-required\");\n}"],
      ["Trash restore", "item.categoryId = previousCategoryId || \"general\";", "const restoreCategoryId = item.previousCategoryId || \"general\";\nreturn { ...item, categoryId: restoreCategoryId, trashedAt: null };"]
    ],
    fr: [
      ["Bouton icône accessible", "export function BoutonIcone({ libelle, children, ...props }) {\n  return <button aria-label={libelle} title={libelle} {...props}>{children}</button>;\n}", "export function BoutonIcone({ libelle, children, ...props }) {\n  return <button type=\"button\" aria-label={libelle} title={libelle} {...props}>{children}</button>;\n}"],
      ["Écriture presse-papiers", "async function ecrirePressePapiers(texte) {\n  await navigator.clipboard.writeText(texte);\n  return true;\n}", "async function ecrirePressePapiers(texte) {\n  if (!navigator.clipboard?.writeText) return false;\n  await navigator.clipboard.writeText(String(texte || \"\"));\n  return true;\n}"],
      ["Prédicat de recherche", "const correspond = item.title.includes(requete) || item.content.includes(requete);", "const normalise = requete.trim().toLowerCase();\nconst correspond = [item.title, item.content, item.note, item.sourceUrl]\n  .filter(Boolean)\n  .some((valeur) => String(valeur).toLowerCase().includes(normalise));"],
      ["Libellé version", "const libelle = `V${index + 1}`;", "const libelle = version.title?.trim() || `V${index + 1}`;\nconst ariaLabel = `${libelle} - ${version.createdAt}`;"],
      ["Contrôle coffre-fort", "if (!settings.vaultEnabled) throw new Error(\"vault-disabled\");", "if (!canUseFeature(\"vault\", settings)) {\n  throw new Error(\"pro-vault-required\");\n}"],
      ["Restauration corbeille", "item.categoryId = previousCategoryId || \"general\";", "const categorieRestauree = item.previousCategoryId || \"general\";\nreturn { ...item, categoryId: categorieRestauree, trashedAt: null };"]
    ],
    es: [
      ["Botón con icono accesible", "export function IconButton({ label, children, ...props }) {\n  return <button aria-label={label} title={label} {...props}>{children}</button>;\n}", "export function IconButton({ label, children, ...props }) {\n  return <button type=\"button\" aria-label={label} title={label} {...props}>{children}</button>;\n}"],
      ["Escritura al portapapeles", "async function escribirPortapapeles(texto) {\n  await navigator.clipboard.writeText(texto);\n  return true;\n}", "async function escribirPortapapeles(texto) {\n  if (!navigator.clipboard?.writeText) return false;\n  await navigator.clipboard.writeText(String(texto || \"\"));\n  return true;\n}"],
      ["Predicado de búsqueda", "const coincide = item.title.includes(query) || item.content.includes(query);", "const normalizado = query.trim().toLowerCase();\nconst coincide = [item.title, item.content, item.note, item.sourceUrl]\n  .filter(Boolean)\n  .some((valor) => String(valor).toLowerCase().includes(normalizado));"],
      ["Etiqueta de versión", "const etiqueta = `V${index + 1}`;", "const etiqueta = version.title?.trim() || `V${index + 1}`;\nconst ariaLabel = `${etiqueta} - ${version.createdAt}`;"],
      ["Control de caja fuerte", "if (!settings.vaultEnabled) throw new Error(\"vault-disabled\");", "if (!canUseFeature(\"vault\", settings)) {\n  throw new Error(\"pro-vault-required\");\n}"],
      ["Restaurar papelera", "item.categoryId = previousCategoryId || \"general\";", "const categoria = item.previousCategoryId || \"general\";\nreturn { ...item, categoryId: categoria, trashedAt: null };"]
    ],
    it: [
      ["Pulsante icona accessibile", "export function IconButton({ label, children, ...props }) {\n  return <button aria-label={label} title={label} {...props}>{children}</button>;\n}", "export function IconButton({ label, children, ...props }) {\n  return <button type=\"button\" aria-label={label} title={label} {...props}>{children}</button>;\n}"],
      ["Scrittura appunti", "async function scriviAppunti(testo) {\n  await navigator.clipboard.writeText(testo);\n  return true;\n}", "async function scriviAppunti(testo) {\n  if (!navigator.clipboard?.writeText) return false;\n  await navigator.clipboard.writeText(String(testo || \"\"));\n  return true;\n}"],
      ["Predicato ricerca", "const coincide = item.title.includes(query) || item.content.includes(query);", "const normalizzato = query.trim().toLowerCase();\nconst coincide = [item.title, item.content, item.note, item.sourceUrl]\n  .filter(Boolean)\n  .some((valore) => String(valore).toLowerCase().includes(normalizzato));"],
      ["Etichetta versione", "const etichetta = `V${index + 1}`;", "const etichetta = version.title?.trim() || `V${index + 1}`;\nconst ariaLabel = `${etichetta} - ${version.createdAt}`;"],
      ["Controllo cassaforte", "if (!settings.vaultEnabled) throw new Error(\"vault-disabled\");", "if (!canUseFeature(\"vault\", settings)) {\n  throw new Error(\"pro-vault-required\");\n}"],
      ["Ripristino cestino", "item.categoryId = previousCategoryId || \"general\";", "const categoria = item.previousCategoryId || \"general\";\nreturn { ...item, categoryId: categoria, trashedAt: null };"]
    ],
    de: [
      ["Zugänglicher Icon-Button", "export function IconButton({ label, children, ...props }) {\n  return <button aria-label={label} title={label} {...props}>{children}</button>;\n}", "export function IconButton({ label, children, ...props }) {\n  return <button type=\"button\" aria-label={label} title={label} {...props}>{children}</button>;\n}"],
      ["Zwischenablage schreiben", "async function schreibeZwischenablage(text) {\n  await navigator.clipboard.writeText(text);\n  return true;\n}", "async function schreibeZwischenablage(text) {\n  if (!navigator.clipboard?.writeText) return false;\n  await navigator.clipboard.writeText(String(text || \"\"));\n  return true;\n}"],
      ["Suchprädikat", "const passt = item.title.includes(query) || item.content.includes(query);", "const normalisiert = query.trim().toLowerCase();\nconst passt = [item.title, item.content, item.note, item.sourceUrl]\n  .filter(Boolean)\n  .some((wert) => String(wert).toLowerCase().includes(normalisiert));"],
      ["Versionslabel", "const label = `V${index + 1}`;", "const label = version.title?.trim() || `V${index + 1}`;\nconst ariaLabel = `${label} - ${version.createdAt}`;"],
      ["Tresorprüfung", "if (!settings.vaultEnabled) throw new Error(\"vault-disabled\");", "if (!canUseFeature(\"vault\", settings)) {\n  throw new Error(\"pro-vault-required\");\n}"],
      ["Papierkorb wiederherstellen", "item.categoryId = previousCategoryId || \"general\";", "const kategorie = item.previousCategoryId || \"general\";\nreturn { ...item, categoryId: kategorie, trashedAt: null };"]
    ]
  };

  Object.keys(extraCodeSamples).forEach((language) => {
    codeSamples[language] = [...(codeSamples[language] || []), ...extraCodeSamples[language]];
  });

  function resolveLanguage() {
    const queryLang = new URLSearchParams(global.location.search).get("lang");
    if (supportedLanguages.includes(queryLang)) return queryLang;
    const first = global.location.pathname.split("/").filter(Boolean)[0];
    return supportedLanguages.includes(first) ? first : "en";
  }

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function enforceDemoProSettings(settings = {}) {
    const now = Date.now();
    return Object.assign({}, settings, {
      demoMode: true,
      dodoEnv: "live",
      plan: "pro",
      licenseStatus: "active",
      licenseKey: settings.licenseKey || "DEMO-LIFETIME-PRO",
      licenseKeyLast4: settings.licenseKeyLast4 || "PRO",
      licenseKeyInstanceId: settings.licenseKeyInstanceId || "demo-instance",
      licenseActivatedAt: settings.licenseActivatedAt || now - 86400000,
      licenseLastVerifiedAt: now,
      licenseLastSuccessfulVerifiedAt: now,
      licenseDodoEnv: "live",
      licenseProductName: "Ultimate Clipboard Pro - Lifetime License",
      licensePlanId: "pro_lifetime",
      licenseProof: settings.licenseProof || "demo-proof",
      licenseProofVersion: "v1",
      licenseIntegrityLastCheckedAt: now
    });
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
    const categoryIds = ["general", "research-sources", "support-macros", "operations-weekly", "marketing-social", "product-roadmap", "legal-privacy", "people-training", "ai-prompts", "sales-objections", "vault", "trash"];
    return textSamples[language].map(([title, ...versions], index) => {
      const id = `demo-text-${index + 1}`;
      const captureVersions = makeVersions(id, title, versions, now - (index + 1) * 86400000);
      const l = copyByLang[language];
      const categoryId = categoryIds[index] || "general";
      const trashed = categoryId === "trash";
      return {
        id,
        title,
        content: versions[0],
        preview: versions[0].slice(0, 260),
        note: index === 0 ? "Demo Pro workspace" : "",
        categoryId,
        categoryName: categoryId === "vault" ? l.vault : categoryId === "trash" ? l.trash : l.general,
        sourceUrl: index === 0 ? "https://chatgpt.com/" : "https://docs.example.com/",
        sourceDomain: index === 0 ? "chatgpt.com" : "docs.example.com",
        sourceFaviconUrl: iconUrl("favicon_generic.png"),
        sourceTitle: title,
        createdAt: captureVersions[0].createdAt,
        updatedAt: captureVersions[captureVersions.length - 1].updatedAt,
        isFavorite: [1, 4, 7, 10].includes(index),
        isPinned: [0, 5, 8].includes(index),
        trashedAt: trashed ? now - 3600000 : null,
        previousCategoryId: trashed ? "marketing-social" : null,
        captureVersions,
        activeVersionId: captureVersions[0].id,
        tags: []
      };
    });
  }

  function devItems(language) {
    const now = Date.now();
    const categoryIds = ["dev-general", "typescript-api", "react-components", "javascript-dom", "typescript-api", "react-components", "dev-vault", "dev-trash"];
    return codeSamples[language].map(([title, ...versions], index) => {
      const id = `demo-code-${index + 1}`;
      const captureVersions = makeVersions(id, title, versions, now - (index + 6) * 86400000);
      const categoryId = categoryIds[index] || "dev-general";
      const trashed = categoryId === "dev-trash";
      return {
        id,
        title,
        content: versions[0],
        preview: versions[0].slice(0, 260),
        note: "",
        categoryId,
        categoryName: categoryId.includes("typescript") ? "TypeScript" : categoryId.includes("react") ? "React" : categoryId === "dev-vault" ? (copyByLang[language]?.vault || "Vault") : categoryId === "dev-trash" ? (copyByLang[language]?.trash || "Trash") : "JavaScript",
        languageId: categoryId.includes("typescript") ? "typescript" : categoryId.includes("react") ? "react" : "javascript",
        languageName: categoryId.includes("typescript") ? "TypeScript" : categoryId.includes("react") ? "React" : "JavaScript",
        sourceUrl: "https://github.com/",
        sourceDomain: "github.com",
        sourceFaviconUrl: iconUrl("favicon_generic.png"),
        sourceTitle: title,
        createdAt: captureVersions[0].createdAt,
        updatedAt: captureVersions[captureVersions.length - 1].updatedAt,
        isFavorite: [1, 3, 6].includes(index),
        isPinned: [0, 2, 5].includes(index),
        trashedAt: trashed ? now - 5400000 : null,
        previousCategoryId: trashed ? "javascript-dom" : null,
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
      { id: "ai-prompts", name: "Prompts", parentId: "ai", icon: "dot", color: "#7c3aed", createdAt: 1, order: 101 },
      { id: "research", name: l.research, parentId: null, icon: "dot", color: "#22c55e", createdAt: 1, order: 11 },
      { id: "research-sources", name: "Sources", parentId: "research", icon: "dot", color: "#22c55e", createdAt: 1, order: 111 },
      { id: "support", name: l.support, parentId: null, icon: "dot", color: "#0ea5e9", createdAt: 1, order: 12 },
      { id: "support-macros", name: "Macros", parentId: "support", icon: "dot", color: "#0ea5e9", createdAt: 1, order: 121 },
      { id: "operations", name: l.operations, parentId: null, icon: "dot", color: "#f97316", createdAt: 1, order: 13 },
      { id: "operations-weekly", name: "Weekly", parentId: "operations", icon: "dot", color: "#f97316", createdAt: 1, order: 131 },
      { id: "marketing-social", name: "Social", parentId: null, icon: "dot", color: "#ec4899", createdAt: 1, order: 14 },
      { id: "product-roadmap", name: "Roadmap", parentId: null, icon: "dot", color: "#06b6d4", createdAt: 1, order: 15 },
      { id: "legal-privacy", name: "Privacy", parentId: null, icon: "dot", color: "#64748b", createdAt: 1, order: 16 },
      { id: "people-training", name: "Training", parentId: null, icon: "dot", color: "#84cc16", createdAt: 1, order: 17 },
      { id: "sales-objections", name: "Objections", parentId: null, icon: "dot", color: "#f59e0b", createdAt: 1, order: 18 }
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
      { id: "javascript-dom", name: "DOM", parentId: "javascript", icon: "dot", color: "#f7df1e", createdAt: 1, order: 101 },
      { id: "typescript", name: "TypeScript", parentId: null, icon: "dot", color: "#3178c6", createdAt: 1, order: 11 },
      { id: "typescript-api", name: "API", parentId: "typescript", icon: "dot", color: "#3178c6", createdAt: 1, order: 111 },
      { id: "react", name: "React", parentId: null, icon: "dot", color: "#61dafb", createdAt: 1, order: 12 },
      { id: "react-components", name: "Components", parentId: "react", icon: "dot", color: "#61dafb", createdAt: 1, order: 121 }
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
    const settings = enforceDemoProSettings({
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
    });
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
      state.settings = enforceDemoProSettings(store.mcp_settings);
      store.mcp_settings = state.settings;
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
        result.mcp_settings = enforceDemoProSettings(result.mcp_settings);
      } else if (typeof keys === "string") {
        result[keys] = clone(keys === "mcp_settings" ? enforceDemoProSettings(store[keys]) : store[keys]);
      } else if (Array.isArray(keys)) {
        keys.forEach((key) => {
          result[key] = clone(key === "mcp_settings" ? enforceDemoProSettings(store[key]) : store[key]);
        });
      } else if (typeof keys === "object") {
        Object.keys(keys).forEach((key) => {
          const value = store[key] === undefined ? keys[key] : store[key];
          result[key] = key === "mcp_settings" ? enforceDemoProSettings(value) : clone(value);
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
        const nextValue = key === "mcp_settings" ? enforceDemoProSettings(value) : value;
        changes[key] = { oldValue: clone(store[key]), newValue: clone(nextValue) };
        store[key] = clone(nextValue);
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
    await loadScript(`${runtimeBase}shared/constants.js`);
    await loadScript(`${runtimeBase}shared/utils.js`);
    await Promise.all([
      "shared/locales/en.js",
      "shared/locales/fr.js",
      "shared/locales/de.js",
      "shared/locales/es.js",
      "shared/locales/it.js"
    ].map((script) => loadScript(`${runtimeBase}${script}`)));
    const scripts = [
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
