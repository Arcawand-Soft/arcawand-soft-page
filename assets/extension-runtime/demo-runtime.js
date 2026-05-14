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

  const richCategoryLabels = {
    text: {
      "research-sources": { en: "Sources", fr: "Sources", es: "Fuentes", it: "Fonti", de: "Quellen" },
      "research-competitors": { en: "Competitors", fr: "Concurrents", es: "Competidores", it: "Concorrenti", de: "Wettbewerber" },
      "research-quotes": { en: "Quotes", fr: "Citations", es: "Citas", it: "Citazioni", de: "Zitate" },
      "support-macros": { en: "Macros", fr: "Macros", es: "Macros", it: "Macro", de: "Makros" },
      "support-incidents": { en: "Incidents", fr: "Incidents", es: "Incidencias", it: "Incidenti", de: "Vorfälle" },
      "operations-weekly": { en: "Weekly", fr: "Hebdo", es: "Semanal", it: "Settimanale", de: "Wöchentlich" },
      "operations-process": { en: "Processes", fr: "Processus", es: "Procesos", it: "Processi", de: "Prozesse" },
      marketing: { en: "Marketing", fr: "Marketing", es: "Marketing", it: "Marketing", de: "Marketing" },
      "marketing-social": { en: "Social", fr: "Social", es: "Social", it: "Social", de: "Social" },
      "marketing-newsletter": { en: "Newsletter", fr: "Newsletter", es: "Newsletter", it: "Newsletter", de: "Newsletter" },
      "product-roadmap": { en: "Roadmap", fr: "Roadmap", es: "Roadmap", it: "Roadmap", de: "Roadmap" },
      "product-feedback": { en: "Feedback", fr: "Retours", es: "Feedback", it: "Feedback", de: "Feedback" },
      legal: { en: "Legal", fr: "Juridique", es: "Legal", it: "Legale", de: "Rechtliches" },
      "legal-privacy": { en: "Privacy", fr: "Confidentialité", es: "Privacidad", it: "Privacy", de: "Datenschutz" },
      "legal-release": { en: "Release checks", fr: "Contrôles sortie", es: "Revisión lanzamiento", it: "Controlli rilascio", de: "Release-Prüfung" },
      people: { en: "People", fr: "Équipe", es: "Equipo", it: "Team", de: "Team" },
      "people-training": { en: "Training", fr: "Formation", es: "Formación", it: "Formazione", de: "Schulung" },
      "people-onboarding": { en: "Onboarding", fr: "Accueil", es: "Onboarding", it: "Onboarding", de: "Onboarding" },
      "ai-prompts": { en: "Prompts", fr: "Prompts", es: "Prompts", it: "Prompt", de: "Prompts" },
      "ai-evaluation": { en: "Evaluation", fr: "Évaluation", es: "Evaluación", it: "Valutazione", de: "Bewertung" },
      sales: { en: "Sales", fr: "Ventes", es: "Ventas", it: "Vendite", de: "Vertrieb" },
      "sales-objections": { en: "Objections", fr: "Objections", es: "Objeciones", it: "Obiezioni", de: "Einwände" },
      "sales-followups": { en: "Follow-ups", fr: "Relances", es: "Seguimientos", it: "Follow-up", de: "Nachfassmails" },
      "design-copy": { en: "Interface copy", fr: "Texte UI", es: "Texto UI", it: "Testi UI", de: "UI-Texte" },
      "design-checklist": { en: "Review", fr: "Relecture", es: "Revisión", it: "Revisione", de: "Review" }
    },
    dev: {
      "javascript-dom": { en: "DOM", fr: "DOM", es: "DOM", it: "DOM", de: "DOM" },
      "javascript-events": { en: "Events", fr: "Événements", es: "Eventos", it: "Eventi", de: "Events" },
      "typescript-api": { en: "API", fr: "API", es: "API", it: "API", de: "API" },
      "typescript-storage": { en: "Storage", fr: "Stockage", es: "Almacenamiento", it: "Storage", de: "Speicher" },
      "react-components": { en: "Components", fr: "Composants", es: "Componentes", it: "Componenti", de: "Komponenten" },
      "react-hooks": { en: "Hooks", fr: "Hooks", es: "Hooks", it: "Hook", de: "Hooks" },
      "css-layout": { en: "Layout", fr: "Mise en page", es: "Layout", it: "Layout", de: "Layout" },
      "html-templates": { en: "Templates", fr: "Templates", es: "Plantillas", it: "Template", de: "Templates" },
      "python-automation": { en: "Automation", fr: "Automatisation", es: "Automatización", it: "Automazione", de: "Automatisierung" },
      "sql-reports": { en: "Reports", fr: "Rapports", es: "Informes", it: "Report", de: "Berichte" },
      "node-workers": { en: "Workers", fr: "Workers", es: "Workers", it: "Worker", de: "Worker" },
      "tests-playwright": { en: "Tests", fr: "Tests", es: "Tests", it: "Test", de: "Tests" }
    }
  };

  function localized(map, language) {
    return map?.[language] || map?.en || "";
  }

  function sampleWithMeta(meta, versions) {
    const item = [localized(meta.title, meta.language || "en"), ...versions];
    item.categoryId = meta.categoryId;
    item.languageId = meta.languageId;
    item.languageName = meta.languageName;
    item.sourceDomain = meta.sourceDomain;
    item.sourceUrl = meta.sourceUrl;
    item.note = meta.note || "";
    return item;
  }

  const textNarration = {
    en: {
      context: "Context",
      decision: "Decision",
      next: "Next actions",
      version: "Revision",
      sentence: "This capture was kept because it is reused across client messages, internal notes, product planning and browser-based research. It includes the exact wording, the source context and the operational nuance that normally disappears after a few minutes of tab switching.",
      refined: "This version is longer because the user has refined the capture after using it in a real workflow. It keeps the original intent, adds clearer sequencing, removes vague wording and makes the reusable part obvious.",
      action: "Before using it again, verify the date, adapt the tone to the audience, keep the useful source URL attached and add a short note if the capture becomes part of a repeatable workflow.",
      reusable: "keep this as a reusable capture with a clear title, source domain and category path.",
      operational: "convert the capture into a more operational note with bullets, ownership, risk, and a suggested next step.",
      attach: "attach a short personal note, mark it as reusable, and keep the source URL visible for later verification.",
      keep: "save the strongest phrasing, preserve the supporting context, and make sure the capture can be found by title, note, URL and category.",
      reuse: "use it as a source-backed block, then update the title if a more precise project name appears."
    },
    fr: {
      context: "Contexte",
      decision: "Décision",
      next: "Actions suivantes",
      version: "Révision",
      sentence: "Cette capture a été conservée parce qu'elle sert souvent dans les messages clients, les notes internes, la planification produit et la recherche dans le navigateur. Elle garde la formulation exacte, le contexte source et la nuance opérationnelle qui disparaît normalement après quelques minutes de changement d'onglet.",
      refined: "Cette version est plus longue parce que l'utilisateur a affiné la capture après l'avoir utilisée dans un vrai flux de travail. Elle garde l'intention d'origine, clarifie l'enchaînement, retire les formulations vagues et rend la partie réutilisable évidente.",
      action: "Avant de la réutiliser, vérifier la date, adapter le ton au destinataire, conserver l'URL source utile et ajouter une note courte si la capture devient un flux récurrent.",
      reusable: "conserver cette capture comme bloc réutilisable avec un titre clair, un domaine source et un chemin de catégorie.",
      operational: "transformer la capture en note plus opérationnelle avec puces, responsable, risque et prochaine étape suggérée.",
      attach: "ajouter une note personnelle courte, la marquer comme réutilisable et garder l'URL source visible pour vérification.",
      keep: "conserver la formulation la plus forte, préserver le contexte utile et vérifier que la capture reste trouvable par titre, note, URL et catégorie.",
      reuse: "l'utiliser comme bloc appuyé par une source, puis mettre à jour le titre si un nom de projet plus précis apparaît."
    },
    es: {
      context: "Contexto",
      decision: "Decisión",
      next: "Próximas acciones",
      version: "Revisión",
      sentence: "Esta captura se conserva porque se reutiliza en mensajes a clientes, notas internas, planificación de producto e investigación en el navegador. Mantiene la formulación exacta, el contexto de origen y el matiz operativo que normalmente se pierde tras cambiar de pestaña varias veces.",
      refined: "Esta versión es más larga porque el usuario ha refinado la captura después de usarla en un flujo real. Mantiene la intención original, aclara la secuencia, elimina frases vagas y deja evidente la parte reutilizable.",
      action: "Antes de reutilizarla, comprueba la fecha, adapta el tono al destinatario, conserva la URL de origen útil y añade una nota breve si la captura pasa a formar parte de un flujo repetible.",
      reusable: "guardar esta captura como bloque reutilizable con título claro, dominio de origen y ruta de categoría.",
      operational: "convertir la captura en una nota más operativa con puntos, responsable, riesgo y siguiente paso sugerido.",
      attach: "añadir una nota personal breve, marcarla como reutilizable y mantener visible la URL de origen para verificarla.",
      keep: "guardar la formulación más fuerte, preservar el contexto de apoyo y asegurar que la captura se encuentre por título, nota, URL y categoría.",
      reuse: "usarla como bloque respaldado por una fuente y actualizar el título si aparece un nombre de proyecto más preciso."
    },
    it: {
      context: "Contesto",
      decision: "Decisione",
      next: "Azioni successive",
      version: "Revisione",
      sentence: "Questa cattura è stata conservata perché viene riutilizzata nei messaggi ai clienti, nelle note interne, nella pianificazione prodotto e nella ricerca nel browser. Mantiene la formulazione esatta, il contesto della fonte e la sfumatura operativa che di solito scompare dopo alcuni cambi di scheda.",
      refined: "Questa versione è più lunga perché l'utente ha rifinito la cattura dopo averla usata in un flusso reale. Mantiene l'intento originale, chiarisce la sequenza, rimuove le formulazioni vaghe e rende evidente la parte riutilizzabile.",
      action: "Prima di riutilizzarla, verifica la data, adatta il tono al destinatario, conserva l'URL sorgente utile e aggiungi una nota breve se la cattura diventa parte di un flusso ripetibile.",
      reusable: "conservare questa cattura come blocco riutilizzabile con titolo chiaro, dominio sorgente e percorso categoria.",
      operational: "trasformare la cattura in una nota più operativa con punti, responsabile, rischio e prossimo passo suggerito.",
      attach: "aggiungere una breve nota personale, marcarla come riutilizzabile e mantenere visibile l'URL sorgente per la verifica.",
      keep: "salvare la formulazione più forte, preservare il contesto di supporto e assicurarsi che la cattura sia ritrovabile per titolo, nota, URL e categoria.",
      reuse: "usarla come blocco supportato da una fonte, poi aggiornare il titolo se appare un nome progetto più preciso."
    },
    de: {
      context: "Kontext",
      decision: "Entscheidung",
      next: "Nächste Schritte",
      version: "Überarbeitung",
      sentence: "Diese Erfassung wurde gespeichert, weil sie in Kundennachrichten, internen Notizen, Produktplanung und Browser-Recherche wiederverwendet wird. Sie bewahrt die genaue Formulierung, den Quellenkontext und die operative Nuance, die nach einigen Tabwechseln normalerweise verloren geht.",
      refined: "Diese Version ist länger, weil der Nutzer die Erfassung nach einem echten Arbeitsablauf verfeinert hat. Sie bewahrt die ursprüngliche Absicht, klärt die Reihenfolge, entfernt vage Formulierungen und macht den wiederverwendbaren Teil sichtbar.",
      action: "Vor der Wiederverwendung Datum prüfen, Ton an die Zielgruppe anpassen, die nützliche Quell-URL behalten und eine kurze Notiz ergänzen, wenn daraus ein wiederholbarer Ablauf wird.",
      reusable: "diese Erfassung als wiederverwendbaren Block mit klarem Titel, Quelldomain und Kategoriepfad behalten.",
      operational: "die Erfassung in eine operativere Notiz mit Stichpunkten, Zuständigkeit, Risiko und nächstem Schritt umwandeln.",
      attach: "eine kurze persönliche Notiz ergänzen, sie als wiederverwendbar markieren und die Quell-URL für spätere Prüfung sichtbar halten.",
      keep: "die stärkste Formulierung speichern, den unterstützenden Kontext bewahren und sicherstellen, dass die Erfassung über Titel, Notiz, URL und Kategorie auffindbar bleibt.",
      reuse: "als quellenbasierten Block nutzen und den Titel aktualisieren, sobald ein präziserer Projektname auftaucht."
    }
  };

  const textTopicDefinitions = [
    { categoryId: "research-sources", sourceDomain: "notion.so", sourceUrl: "https://notion.so/workspace/research", title: { en: "Competitive research synthesis", fr: "Synthèse de veille concurrentielle", es: "Síntesis de investigación competitiva", it: "Sintesi di ricerca competitiva", de: "Wettbewerbsanalyse" }, angle: { en: "compare positioning, pricing signals and onboarding friction", fr: "comparer le positionnement, les signaux de prix et les frictions d'accueil", es: "comparar posicionamiento, señales de precio y fricción de onboarding", it: "confrontare posizionamento, segnali di prezzo e attrito di onboarding", de: "Positionierung, Preissignale und Onboarding-Reibung vergleichen" } },
    { categoryId: "research-competitors", sourceDomain: "producthunt.com", sourceUrl: "https://www.producthunt.com/", title: { en: "Launch comments worth reusing", fr: "Commentaires de lancement à réutiliser", es: "Comentarios de lanzamiento reutilizables", it: "Commenti di lancio riutilizzabili", de: "Wiederverwendbare Launch-Kommentare" }, angle: { en: "extract objections, enthusiastic wording and missing feature expectations", fr: "extraire les objections, formulations enthousiastes et attentes de fonctions manquantes", es: "extraer objeciones, frases entusiastas y expectativas de funciones ausentes", it: "estrarre obiezioni, formulazioni entusiaste e aspettative di funzioni mancanti", de: "Einwände, begeisterte Formulierungen und fehlende Funktionswünsche herausziehen" } },
    { categoryId: "research-quotes", sourceDomain: "medium.com", sourceUrl: "https://medium.com/topic/productivity", title: { en: "Productivity quote bank", fr: "Banque de citations productivité", es: "Banco de citas de productividad", it: "Archivio citazioni produttività", de: "Produktivitäts-Zitatesammlung" }, angle: { en: "keep reusable quotes with attribution and the exact page source", fr: "garder des citations réutilisables avec attribution et source exacte", es: "guardar citas reutilizables con atribución y fuente exacta", it: "conservare citazioni riutilizzabili con attribuzione e fonte esatta", de: "wiederverwendbare Zitate mit Quelle und genauer Seite behalten" } },
    { categoryId: "support-macros", sourceDomain: "intercom.com", sourceUrl: "https://intercom.com/help", title: { en: "Calm billing support answer", fr: "Réponse support facturation calme", es: "Respuesta tranquila de soporte de facturación", it: "Risposta supporto fatturazione calma", de: "Ruhige Antwort zum Abrechnungssupport" }, angle: { en: "acknowledge the concern, explain the fix and avoid defensive phrasing", fr: "reconnaître la demande, expliquer le correctif et éviter un ton défensif", es: "reconocer la duda, explicar la solución y evitar un tono defensivo", it: "riconoscere il dubbio, spiegare la correzione ed evitare un tono difensivo", de: "Anliegen anerkennen, Lösung erklären und defensive Sprache vermeiden" } },
    { categoryId: "support-incidents", sourceDomain: "status.example.com", sourceUrl: "https://status.example.com/incidents/ucp-sync", title: { en: "Drive sync incident note", fr: "Note incident synchro Drive", es: "Nota de incidencia de sincronización Drive", it: "Nota incidente sincronizzazione Drive", de: "Drive-Sync-Vorfallnotiz" }, angle: { en: "summarize user impact, workaround, recovery and follow-up checks", fr: "résumer impact utilisateur, contournement, reprise et contrôles de suivi", es: "resumir impacto, solución temporal, recuperación y controles posteriores", it: "riassumere impatto, workaround, ripristino e controlli successivi", de: "Auswirkung, Workaround, Wiederherstellung und Nachkontrollen zusammenfassen" } },
    { categoryId: "operations-weekly", sourceDomain: "linear.app", sourceUrl: "https://linear.app/", title: { en: "Weekly product operations update", fr: "Point hebdo opérations produit", es: "Actualización semanal de operaciones", it: "Aggiornamento settimanale operazioni", de: "Wöchentliches Produkt-Operations-Update" }, angle: { en: "separate shipped work, risks, blocked decisions and next owners", fr: "séparer livraisons, risques, décisions bloquées et responsables suivants", es: "separar entregas, riesgos, decisiones bloqueadas y responsables", it: "separare rilasci, rischi, decisioni bloccate e responsabili", de: "gelieferte Arbeit, Risiken, blockierte Entscheidungen und Verantwortliche trennen" } },
    { categoryId: "operations-process", sourceDomain: "docs.google.com", sourceUrl: "https://docs.google.com/document/", title: { en: "Release checklist procedure", fr: "Procédure de checklist sortie", es: "Procedimiento de checklist de lanzamiento", it: "Procedura checklist rilascio", de: "Release-Checklistenverfahren" }, angle: { en: "confirm SEO, privacy, localization, backup and payment links before publishing", fr: "confirmer SEO, confidentialité, localisation, sauvegarde et liens de paiement avant publication", es: "confirmar SEO, privacidad, localización, copia de seguridad y pagos antes de publicar", it: "confermare SEO, privacy, localizzazione, backup e pagamenti prima della pubblicazione", de: "SEO, Datenschutz, Lokalisierung, Backup und Zahlungslinks vor Veröffentlichung prüfen" } },
    { categoryId: "marketing-social", sourceDomain: "linkedin.com", sourceUrl: "https://www.linkedin.com/feed/", title: { en: "Founder launch post", fr: "Post fondateur de lancement", es: "Publicación de lanzamiento del fundador", it: "Post di lancio del founder", de: "Founder-Launch-Post" }, angle: { en: "make the benefit concrete without sounding like a generic productivity slogan", fr: "rendre le bénéfice concret sans ressembler à un slogan générique", es: "hacer concreto el beneficio sin sonar a eslogan genérico", it: "rendere concreto il beneficio senza sembrare uno slogan generico", de: "Nutzen konkret machen, ohne wie ein generischer Produktivitätsslogan zu klingen" } },
    { categoryId: "marketing-newsletter", sourceDomain: "sender.net", sourceUrl: "https://sender.net/forms", title: { en: "Launch newsletter welcome copy", fr: "Texte d'accueil newsletter lancement", es: "Texto de bienvenida de newsletter", it: "Testo benvenuto newsletter lancio", de: "Willkommenstext für Launch-Newsletter" }, angle: { en: "set expectations, promise only launch news and keep the tone premium", fr: "poser les attentes, promettre seulement l'annonce de sortie et garder un ton premium", es: "definir expectativas, prometer solo noticias de lanzamiento y mantener tono premium", it: "definire aspettative, promettere solo notizie di lancio e mantenere tono premium", de: "Erwartungen setzen, nur Launch-News versprechen und Premium-Ton halten" } },
    { categoryId: "product-roadmap", sourceDomain: "github.com", sourceUrl: "https://github.com/Arcawand-Soft/ultimate-clipboard-pro", title: { en: "Roadmap decision note", fr: "Note de décision roadmap", es: "Nota de decisión de roadmap", it: "Nota decisione roadmap", de: "Roadmap-Entscheidungsnotiz" }, angle: { en: "rank versioning, advanced search, visual history and montage by user value", fr: "classer versioning, recherche avancée, historique visuel et montage par valeur utilisateur", es: "ordenar versionado, búsqueda avanzada, historial visual y montaje por valor", it: "ordinare versioning, ricerca avanzata, cronologia visuale e montaggio per valore", de: "Versionierung, erweiterte Suche, visuellen Verlauf und Montage nach Nutzerwert priorisieren" } },
    { categoryId: "product-feedback", sourceDomain: "reddit.com", sourceUrl: "https://www.reddit.com/r/productivity/", title: { en: "Feedback cluster from power users", fr: "Groupe de retours utilisateurs avancés", es: "Grupo de feedback de usuarios avanzados", it: "Cluster feedback utenti esperti", de: "Feedback-Cluster von Power-Usern" }, angle: { en: "group requests by capture speed, retrieval confidence and privacy concern", fr: "regrouper demandes par vitesse de capture, confiance de recherche et confidentialité", es: "agrupar solicitudes por velocidad, confianza de búsqueda y privacidad", it: "raggruppare richieste per velocità, fiducia nella ricerca e privacy", de: "Anfragen nach Capture-Geschwindigkeit, Wiederfindbarkeit und Datenschutz gruppieren" } },
    { categoryId: "legal-privacy", sourceDomain: "support.google.com", sourceUrl: "https://support.google.com/chrome_webstore/", title: { en: "Chrome Web Store privacy review", fr: "Relecture confidentialité Chrome Web Store", es: "Revisión de privacidad Chrome Web Store", it: "Revisione privacy Chrome Web Store", de: "Datenschutzprüfung Chrome Web Store" }, angle: { en: "map permissions to user-visible features and keep local-first wording precise", fr: "relier permissions et fonctions visibles, avec une formulation local-first précise", es: "mapear permisos con funciones visibles y explicar local-first con precisión", it: "collegare permessi e funzioni visibili con formulazione local-first precisa", de: "Berechtigungen sichtbaren Funktionen zuordnen und Local-first präzise erklären" } },
    { categoryId: "legal-release", sourceDomain: "arcawand-soft.com", sourceUrl: "https://arcawand-soft.com/ultimate-clipboard-pro/privacy/", title: { en: "Terms and privacy consistency check", fr: "Contrôle cohérence CGU et confidentialité", es: "Control de coherencia legal y privacidad", it: "Controllo coerenza termini e privacy", de: "Konsistenzprüfung AGB und Datenschutz" }, angle: { en: "verify price wording, launch discount, data storage and support contact", fr: "vérifier prix, réduction de lancement, stockage des données et contact support", es: "verificar precio, descuento de lanzamiento, almacenamiento y contacto", it: "verificare prezzo, sconto lancio, archiviazione dati e contatto", de: "Preis, Launch-Rabatt, Datenspeicherung und Kontakt prüfen" } },
    { categoryId: "people-training", sourceDomain: "confluence.example.com", sourceUrl: "https://confluence.example.com/support/playbook", title: { en: "Support training playbook", fr: "Guide de formation support", es: "Manual de formación de soporte", it: "Playbook formazione supporto", de: "Support-Schulungshandbuch" }, angle: { en: "teach teammates how to capture, title, classify and recover source context", fr: "former à capturer, titrer, classer et retrouver le contexte source", es: "enseñar a capturar, titular, clasificar y recuperar contexto", it: "insegnare cattura, titolo, classificazione e recupero fonte", de: "Capture, Titel, Klassifizierung und Quellenkontext vermitteln" } },
    { categoryId: "people-onboarding", sourceDomain: "slack.com", sourceUrl: "https://slack.com/app_redirect", title: { en: "New teammate onboarding message", fr: "Message d'accueil nouveau collègue", es: "Mensaje de onboarding de compañero", it: "Messaggio onboarding collega", de: "Onboarding-Nachricht für neues Teammitglied" }, angle: { en: "explain where reusable text lives and how to avoid duplicate notes", fr: "expliquer où vivent les textes réutilisables et éviter les doublons", es: "explicar dónde viven textos reutilizables y evitar duplicados", it: "spiegare dove vivono testi riutilizzabili ed evitare duplicati", de: "zeigen, wo wiederverwendbare Texte liegen und Duplikate vermeiden" } },
    { categoryId: "ai-prompts", sourceDomain: "chatgpt.com", sourceUrl: "https://chatgpt.com/", title: { en: "Prompt for structured product analysis", fr: "Prompt d'analyse produit structurée", es: "Prompt de análisis de producto", it: "Prompt analisi prodotto strutturata", de: "Prompt für strukturierte Produktanalyse" }, angle: { en: "force role, context, constraints, output format and verification criteria", fr: "forcer rôle, contexte, contraintes, format de sortie et critères de vérification", es: "forzar rol, contexto, restricciones, formato y verificación", it: "forzare ruolo, contesto, vincoli, formato e verifica", de: "Rolle, Kontext, Grenzen, Ausgabeformat und Prüfcriteria erzwingen" } },
    { categoryId: "ai-evaluation", sourceDomain: "claude.ai", sourceUrl: "https://claude.ai/", title: { en: "AI answer evaluation rubric", fr: "Grille d'évaluation réponse IA", es: "Rúbrica para evaluar respuesta IA", it: "Rubrica valutazione risposta IA", de: "Bewertungsraster für KI-Antworten" }, angle: { en: "score usefulness, factual caution, completeness and tone before reuse", fr: "noter utilité, prudence factuelle, complétude et ton avant réutilisation", es: "puntuar utilidad, cautela factual, completitud y tono antes de reutilizar", it: "valutare utilità, cautela fattuale, completezza e tono prima del riuso", de: "Nützlichkeit, Faktensicherheit, Vollständigkeit und Ton vor Wiederverwendung bewerten" } },
    { categoryId: "sales-objections", sourceDomain: "pipedrive.com", sourceUrl: "https://pipedrive.com/", title: { en: "Clipboard manager objection answer", fr: "Réponse objection gestionnaire presse-papiers", es: "Respuesta a objeción de gestor de portapapeles", it: "Risposta obiezione clipboard manager", de: "Antwort auf Clipboard-Manager-Einwand" }, angle: { en: "explain why normal clipboard history is not enough for serious reuse", fr: "expliquer pourquoi l'historique classique ne suffit pas pour réutiliser sérieusement", es: "explicar por qué el historial normal no basta para reutilización seria", it: "spiegare perché la cronologia normale non basta per riuso serio", de: "erklären, warum normale Zwischenablage für ernsthafte Wiederverwendung nicht reicht" } },
    { categoryId: "sales-followups", sourceDomain: "hubspot.com", sourceUrl: "https://hubspot.com/", title: { en: "Post-demo follow-up email", fr: "Email de relance après démo", es: "Email de seguimiento tras demo", it: "Email follow-up dopo demo", de: "Nachfassmail nach Demo" }, angle: { en: "recap pain, show the most relevant feature and keep the next step simple", fr: "récapituler la douleur, montrer la fonction pertinente et simplifier la suite", es: "resumir dolor, mostrar función clave y simplificar el siguiente paso", it: "riassumere dolore, mostrare funzione rilevante e semplificare il passo successivo", de: "Problem rekapitulieren, passende Funktion zeigen und nächsten Schritt vereinfachen" } },
    { categoryId: "design-copy", sourceDomain: "figma.com", sourceUrl: "https://figma.com/file/demo", title: { en: "Tooltip copy review", fr: "Relecture textes d'infobulles", es: "Revisión de textos tooltip", it: "Revisione testi tooltip", de: "Tooltip-Textprüfung" }, angle: { en: "make action labels short, explicit and consistent across dense interfaces", fr: "rendre les libellés courts, explicites et cohérents dans une interface dense", es: "hacer etiquetas breves, claras y coherentes en interfaces densas", it: "rendere etichette brevi, chiare e coerenti in interfacce dense", de: "Aktionslabels kurz, eindeutig und konsistent in dichten Oberflächen halten" } },
    { categoryId: "design-checklist", sourceDomain: "arcawand-soft.com", sourceUrl: "https://arcawand-soft.com/ultimate-clipboard-pro/demo/", title: { en: "Demo page polish checklist", fr: "Checklist finition page démo", es: "Checklist de acabado de demo", it: "Checklist finitura pagina demo", de: "Polish-Checkliste für Demo-Seite" }, angle: { en: "verify launcher, floating panel, manager, tools, language and demo restrictions", fr: "vérifier launcher, panneau flottant, gestionnaire, outils, langue et restrictions démo", es: "verificar launcher, panel flotante, gestor, herramientas, idioma y restricciones", it: "verificare launcher, pannello, gestore, strumenti, lingua e limiti demo", de: "Launcher, Floating Panel, Manager, Tools, Sprache und Demo-Sperren prüfen" } },
    { categoryId: "vault", sourceDomain: "1password.com", sourceUrl: "https://1password.com/", title: { en: "Private launch token note", fr: "Note privée jeton lancement", es: "Nota privada de token", it: "Nota privata token lancio", de: "Private Launch-Token-Notiz" }, angle: { en: "keep sensitive operational context away from the visible workspace", fr: "garder un contexte opérationnel sensible hors de l'espace visible", es: "mantener contexto operativo sensible fuera del espacio visible", it: "tenere contesto operativo sensibile fuori dallo spazio visibile", de: "sensiblen Betriebskontext aus dem sichtbaren Arbeitsbereich halten" } },
    { categoryId: "trash", sourceDomain: "mail.google.com", sourceUrl: "https://mail.google.com/", title: { en: "Retired campaign draft", fr: "Ancien brouillon campagne", es: "Borrador de campaña retirado", it: "Bozza campagna ritirata", de: "Zurückgezogener Kampagnenentwurf" }, angle: { en: "keep for review before permanent deletion because the tone no longer fits", fr: "conserver avant suppression définitive car le ton ne correspond plus", es: "conservar antes de eliminar definitivamente porque el tono ya no encaja", it: "conservare prima della cancellazione definitiva perché il tono non è più adatto", de: "vor endgültigem Löschen behalten, da der Ton nicht mehr passt" } }
  ];

  function makeRichTextSamples(language) {
    const l = textNarration[language] || textNarration.en;
    return textTopicDefinitions.map((topic, index) => {
      const title = localized(topic.title, language);
      const angle = localized(topic.angle, language);
      const base = `${title}\n\n${l.context}: ${angle}. ${l.sentence}\n\n${l.decision}: ${l.reusable} ${l.action}\n\n${l.next}: ${l.attach}`;
      const v2 = `${title}\n\n${l.version} V2: ${angle}. ${l.sentence}\n\n${l.decision}: ${l.operational} ${l.action}\n\n${l.next}: ${l.attach}`;
      const v3 = `${title}\n\n${l.version} V3: ${angle}. ${l.refined}\n\n${l.decision}: ${l.keep}\n\n${l.next}: ${l.reuse}`;
      const sample = sampleWithMeta({
        language,
        categoryId: topic.categoryId,
        title: topic.title,
        sourceDomain: topic.sourceDomain,
        sourceUrl: topic.sourceUrl,
        note: `${title} - ${angle}`
      }, index % 3 === 0 ? [base, v2, v3] : index % 3 === 1 ? [base, v2] : [base]);
      return sample;
    });
  }

  const richCodeDefinitions = [
    {
      categoryId: "typescript-api", languageId: "typescript", languageName: "TypeScript", sourceDomain: "github.com", sourceUrl: "https://github.com/Arcawand-Soft/ultimate-clipboard-pro",
      title: { en: "Typed API response helper", fr: "Helper réponse API typée", es: "Helper de respuesta API tipada", it: "Helper risposta API tipizzata", de: "Typisierter API-Antworthelfer" },
      versions: [
`type ApiSuccess<T> = { ok: true; data: T; receivedAt: number };
type ApiFailure = { ok: false; error: string; status: number };
type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export async function readJson<T>(response: Response): Promise<ApiResult<T>> {
  if (!response.ok) {
    return { ok: false, error: response.statusText || "Request failed", status: response.status };
  }
  const data = (await response.json()) as T;
  return { ok: true, data, receivedAt: Date.now() };
}`,
`type ApiResult<T> =
  | { ok: true; data: T; receivedAt: number; source: "network" }
  | { ok: false; error: string; status: number; retryable: boolean };

export async function readJson<T>(response: Response): Promise<ApiResult<T>> {
  if (!response.ok) {
    return {
      ok: false,
      error: response.statusText || "Request failed",
      status: response.status,
      retryable: response.status >= 500
    };
  }
  return { ok: true, data: (await response.json()) as T, receivedAt: Date.now(), source: "network" };
}`
      ]
    },
    {
      categoryId: "typescript-storage", languageId: "typescript", languageName: "TypeScript", sourceDomain: "developer.chrome.com", sourceUrl: "https://developer.chrome.com/docs/extensions/reference/api/storage",
      title: { en: "Chrome storage migration", fr: "Migration stockage Chrome", es: "Migración de almacenamiento Chrome", it: "Migrazione storage Chrome", de: "Chrome-Speicher-Migration" },
      versions: [
`export async function migrateSettings(storage: chrome.storage.StorageArea) {
  const { mcp_settings: settings = {} } = await storage.get("mcp_settings");
  const next = {
    ...settings,
    managerTextViewMode: settings.managerTextViewMode || "card",
    managerDevViewMode: settings.managerDevViewMode || "card",
    managerImageViewMode: settings.managerImageViewMode || "medium"
  };
  await storage.set({ mcp_settings: next });
  return next;
}`,
`export async function migrateSettings(storage: chrome.storage.StorageArea) {
  const { mcp_settings: settings = {} } = await storage.get("mcp_settings");
  const next = {
    ...settings,
    managerTextViewMode: settings.managerTextViewMode ?? "card",
    managerDevViewMode: settings.managerDevViewMode ?? "card",
    managerImageViewMode: settings.managerImageViewMode ?? "medium",
    settingsUpdatedAt: Date.now()
  };
  await storage.set({ mcp_settings: next });
  return next;
}`
      ]
    },
    {
      categoryId: "react-components", languageId: "react", languageName: "React", sourceDomain: "react.dev", sourceUrl: "https://react.dev/reference/react",
      title: { en: "Accessible action toolbar", fr: "Barre d'actions accessible", es: "Barra de acciones accesible", it: "Barra azioni accessibile", de: "Barrierefreie Aktionsleiste" },
      versions: [
`export function ActionToolbar({ actions }) {
  return (
    <div role="toolbar" aria-label="Capture actions">
      {actions.map((action) => (
        <button key={action.id} type="button" aria-label={action.label} onClick={action.onClick}>
          <img src={action.icon} alt="" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}`,
`export function ActionToolbar({ actions, orientation = "horizontal" }) {
  return (
    <div role="toolbar" aria-label="Capture actions" aria-orientation={orientation}>
      {actions.map((action) => (
        <button key={action.id} type="button" title={action.label} aria-label={action.label} onClick={action.onClick}>
          <img src={action.icon} alt="" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}`
      ]
    },
    {
      categoryId: "react-hooks", languageId: "react", languageName: "React", sourceDomain: "react.dev", sourceUrl: "https://react.dev/reference/react/useEffect",
      title: { en: "Persistent view mode hook", fr: "Hook affichage persistant", es: "Hook de vista persistente", it: "Hook vista persistente", de: "Hook für persistente Ansicht" },
      versions: [
`import { useEffect, useState } from "react";

export function usePersistentViewMode(key, fallback = "card") {
  const [mode, setMode] = useState(() => localStorage.getItem(key) || fallback);
  useEffect(() => {
    localStorage.setItem(key, mode);
  }, [key, mode]);
  return [mode, setMode];
}`,
`import { useEffect, useState } from "react";

export function usePersistentViewMode(key, fallback = "card") {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, mode); } catch {}
  }, [key, mode]);
  return [mode, setMode];
}`
      ]
    },
    {
      categoryId: "javascript-dom", languageId: "javascript", languageName: "JavaScript", sourceDomain: "developer.mozilla.org", sourceUrl: "https://developer.mozilla.org/docs/Web/API/IntersectionObserver",
      title: { en: "Lazy image observer", fr: "Observer images lazy", es: "Observer de imágenes lazy", it: "Observer immagini lazy", de: "Lazy-Image-Observer" },
      versions: [
`const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const image = entry.target;
    image.src = image.dataset.src;
    observer.unobserve(image);
  }
}, { rootMargin: "200px" });

document.querySelectorAll("img[data-src]").forEach((image) => observer.observe(image));`,
`const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const image = entry.target;
    image.src = image.dataset.src;
    image.addEventListener("load", () => image.classList.add("is-loaded"), { once: true });
    observer.unobserve(image);
  }
}, { rootMargin: "240px 0px" });

document.querySelectorAll("img[data-src]").forEach((image) => observer.observe(image));`
      ]
    },
    {
      categoryId: "javascript-events", languageId: "javascript", languageName: "JavaScript", sourceDomain: "developer.mozilla.org", sourceUrl: "https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener",
      title: { en: "Delegated click handler", fr: "Gestionnaire de clic délégué", es: "Gestor de clic delegado", it: "Gestore click delegato", de: "Delegierter Klick-Handler" },
      versions: [
`document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "open") openPanel();
  if (action === "close") closePanel();
});`,
`document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  const handlers = { open: openPanel, close: closePanel, search: focusSearch };
  handlers[button.dataset.action]?.(event, button);
});`
      ]
    },
    {
      categoryId: "css-layout", languageId: "css", languageName: "CSS", sourceDomain: "web.dev", sourceUrl: "https://web.dev/learn/css/",
      title: { en: "Responsive two-column cards", fr: "Cartes responsive deux colonnes", es: "Tarjetas responsive en dos columnas", it: "Card responsive a due colonne", de: "Responsive Zwei-Spalten-Karten" },
      versions: [
`.capture-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  gap: clamp(12px, 2vw, 20px);
}

.capture-card {
  min-height: clamp(260px, 38vh, 420px);
  border-radius: 14px;
}`,
`.capture-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(min(320px, 100%), 1fr));
  gap: clamp(12px, 2vw, 20px);
  align-items: stretch;
}

.capture-card {
  min-height: clamp(280px, 42vh, 460px);
  border-radius: 14px;
  overflow: clip;
}`
      ]
    },
    {
      categoryId: "html-templates", languageId: "html", languageName: "HTML", sourceDomain: "developer.mozilla.org", sourceUrl: "https://developer.mozilla.org/docs/Web/HTML/Element/dialog",
      title: { en: "Accessible modal shell", fr: "Structure modale accessible", es: "Estructura modal accesible", it: "Struttura modale accessibile", de: "Barrierefreie Modal-Struktur" },
      versions: [
`<dialog class="settings-modal" aria-labelledby="settings-title">
  <form method="dialog">
    <header>
      <h2 id="settings-title">Settings</h2>
      <button value="close" aria-label="Close">×</button>
    </header>
    <section class="settings-modal__body"></section>
  </form>
</dialog>`,
`<dialog class="settings-modal" aria-labelledby="settings-title" aria-describedby="settings-description">
  <form method="dialog">
    <header>
      <h2 id="settings-title">Settings</h2>
      <p id="settings-description">Changes are saved immediately.</p>
      <button value="close" aria-label="Close">×</button>
    </header>
    <section class="settings-modal__body"></section>
  </form>
</dialog>`
      ]
    },
    {
      categoryId: "python-automation", languageId: "python", languageName: "Python", sourceDomain: "docs.python.org", sourceUrl: "https://docs.python.org/3/library/pathlib.html",
      title: { en: "Asset audit script", fr: "Script audit assets", es: "Script de auditoría de assets", it: "Script audit asset", de: "Asset-Audit-Skript" },
      versions: [
`from pathlib import Path

root = Path("assets")
missing = []
for html in Path(".").rglob("*.html"):
    text = html.read_text(encoding="utf-8")
    for asset in root.rglob("*"):
        if asset.is_file() and asset.name in text:
            break
print("asset audit complete")`,
`from pathlib import Path

def audit_assets(root: Path) -> list[str]:
    missing: list[str] = []
    for html in Path(".").rglob("*.html"):
        text = html.read_text(encoding="utf-8", errors="replace")
        for marker in ("src=", "href="):
            if marker in text:
                continue
    return missing

print("asset audit complete", audit_assets(Path("assets")))`
      ]
    },
    {
      categoryId: "sql-reports", languageId: "sql", languageName: "SQL", sourceDomain: "postgresql.org", sourceUrl: "https://www.postgresql.org/docs/",
      title: { en: "Daily capture report", fr: "Rapport captures quotidiennes", es: "Informe diario de capturas", it: "Report catture giornaliere", de: "Täglicher Capture-Bericht" },
      versions: [
`select
  date_trunc('day', created_at) as day,
  media_type,
  count(*) as captures
from captures
where created_at >= now() - interval '30 days'
group by day, media_type
order by day desc, media_type;`,
`select
  date_trunc('day', created_at) as day,
  media_type,
  count(*) as captures,
  count(*) filter (where is_favorite) as favorites,
  count(*) filter (where is_pinned) as pinned
from captures
where created_at >= now() - interval '30 days'
group by day, media_type
order by day desc, media_type;`
      ]
    },
    {
      categoryId: "node-workers", languageId: "javascript", languageName: "JavaScript", sourceDomain: "developers.cloudflare.com", sourceUrl: "https://developers.cloudflare.com/workers/",
      title: { en: "Newsletter worker endpoint", fr: "Endpoint worker newsletter", es: "Endpoint worker newsletter", it: "Endpoint worker newsletter", de: "Newsletter-Worker-Endpunkt" },
      versions: [
`export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    const { email } = await request.json();
    await subscribe(email, env.SENDER_API_TOKEN);
    return Response.json({ ok: true });
  }
};`,
`export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(null, 204);
    if (request.method !== "POST") return cors({ error: "Method not allowed" }, 405);
    const { email, language = "en" } = await request.json();
    await subscribe(email, language, env.SENDER_API_TOKEN);
    return cors({ ok: true });
  }
};`
      ]
    },
    {
      categoryId: "tests-playwright", languageId: "typescript", languageName: "TypeScript", sourceDomain: "playwright.dev", sourceUrl: "https://playwright.dev/",
      title: { en: "Demo page smoke test", fr: "Smoke test page démo", es: "Smoke test de página demo", it: "Smoke test pagina demo", de: "Smoke-Test für Demo-Seite" },
      versions: [
`import { test, expect } from "@playwright/test";

test("demo launcher opens the floating panel", async ({ page }) => {
  await page.goto("/ultimate-clipboard-pro/demo/");
  await page.getByRole("button", { name: /open/i }).click();
  await expect(page.locator(".ucp-demo-frame")).toBeVisible();
});`,
`import { test, expect } from "@playwright/test";

test("demo launcher opens manager from the floating panel", async ({ page }) => {
  await page.goto("/ultimate-clipboard-pro/demo/");
  await page.getByRole("button", { name: /open/i }).click();
  await page.getByRole("button", { name: /manager/i }).click();
  await expect(page.locator(".ucp-demo-manager-host")).toBeVisible();
});`
      ]
    },
    {
      categoryId: "javascript-dom", languageId: "javascript", languageName: "JavaScript", sourceDomain: "developer.mozilla.org", sourceUrl: "https://developer.mozilla.org/docs/Web/API/AbortController",
      title: { en: "Abortable fetch request", fr: "Requête fetch annulable", es: "Petición fetch cancelable", it: "Richiesta fetch annullabile", de: "Abbrechbarer Fetch-Request" },
      versions: [
`export async function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}`,
`export async function fetchJsonWithTimeout(url, options = {}, timeout = 8000) {
  const response = await fetchWithTimeout(url, options, timeout);
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.json();
}`
      ]
    },
    {
      categoryId: "typescript-storage", languageId: "typescript", languageName: "TypeScript", sourceDomain: "developer.chrome.com", sourceUrl: "https://developer.chrome.com/docs/extensions/mv3/service_workers/",
      title: { en: "Typed message router", fr: "Routeur message typé", es: "Router de mensajes tipado", it: "Router messaggi tipizzato", de: "Typisierter Message-Router" },
      versions: [
`type Message =
  | { type: "OPEN_MANAGER" }
  | { type: "COPY_TEXT"; itemId: string };

export function routeMessage(message: Message) {
  switch (message.type) {
    case "OPEN_MANAGER": return openManager();
    case "COPY_TEXT": return copyText(message.itemId);
  }
}`,
`type Message =
  | { type: "OPEN_MANAGER" }
  | { type: "COPY_TEXT"; itemId: string }
  | { type: "SET_ACTIVE_VERSION"; itemId: string; versionId: string };

export function routeMessage(message: Message) {
  const handlers = {
    OPEN_MANAGER: () => openManager(),
    COPY_TEXT: () => copyText(message.itemId),
    SET_ACTIVE_VERSION: () => setActiveVersion(message.itemId, message.versionId)
  };
  return handlers[message.type]();
}`
      ]
    },
    {
      categoryId: "react-components", languageId: "react", languageName: "React", sourceDomain: "react.dev", sourceUrl: "https://react.dev/learn/rendering-lists",
      title: { en: "Version tabs component", fr: "Composant onglets versions", es: "Componente de pestañas de versión", it: "Componente tab versioni", de: "Komponente für Versions-Tabs" },
      versions: [
`export function VersionTabs({ versions, activeId, onSelect }) {
  return (
    <div className="version-tabs" role="tablist">
      {versions.map((version, index) => (
        <button key={version.id} role="tab" aria-selected={version.id === activeId} onClick={() => onSelect(version.id)}>
          V{index + 1}
        </button>
      ))}
    </div>
  );
}`,
`export function VersionTabs({ versions, activeId, onSelect, onDelete }) {
  return (
    <div className="version-tabs" role="tablist" aria-label="Capture versions">
      {versions.map((version, index) => (
        <button key={version.id} role="tab" aria-selected={version.id === activeId} onClick={() => onSelect(version.id)}>
          <span>V{index + 1}</span>
          {versions.length > 1 && <span aria-hidden="true" onClick={(event) => { event.stopPropagation(); onDelete(version.id); }}>×</span>}
        </button>
      ))}
    </div>
  );
}`
      ]
    },
    {
      categoryId: "python-automation", languageId: "python", languageName: "Python", sourceDomain: "docs.python.org", sourceUrl: "https://docs.python.org/3/library/json.html",
      title: { en: "Backup manifest validator", fr: "Validateur manifeste sauvegarde", es: "Validador de manifiesto backup", it: "Validatore manifesto backup", de: "Backup-Manifest-Validator" },
      versions: [
`import json
from pathlib import Path

def load_manifest(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    required = {"settings", "items", "categories", "devItems", "imageItems"}
    missing = required.difference(data)
    if missing:
        raise ValueError(f"Missing keys: {', '.join(sorted(missing))}")
    return data`,
`import json
from pathlib import Path

def load_manifest(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    required = {"settings", "items", "categories", "devItems", "imageItems"}
    missing = required.difference(data)
    if missing:
        raise ValueError(f"Missing keys: {', '.join(sorted(missing))}")
    if not isinstance(data["items"], list) or not isinstance(data["devItems"], list):
        raise TypeError("items and devItems must be lists")
    return data`
      ]
    },
    {
      categoryId: "sql-reports", languageId: "sql", languageName: "SQL", sourceDomain: "postgresql.org", sourceUrl: "https://www.postgresql.org/docs/current/functions-aggregate.html",
      title: { en: "Favorite captures by project", fr: "Captures favorites par projet", es: "Capturas favoritas por proyecto", it: "Catture preferite per progetto", de: "Favorisierte Captures nach Projekt" },
      versions: [
`select
  category_name,
  count(*) filter (where is_favorite) as favorite_count,
  count(*) filter (where is_pinned) as pinned_count
from captures
where deleted_at is null
group by category_name
order by favorite_count desc, pinned_count desc;`,
`select
  coalesce(project_name, category_name) as bucket,
  count(*) filter (where is_favorite) as favorite_count,
  count(*) filter (where is_pinned) as pinned_count,
  max(updated_at) as last_activity
from captures
where deleted_at is null
group by bucket
order by last_activity desc;`
      ]
    },
    {
      categoryId: "node-workers", languageId: "javascript", languageName: "JavaScript", sourceDomain: "nodejs.org", sourceUrl: "https://nodejs.org/api/crypto.html",
      title: { en: "Token redaction utility", fr: "Utilitaire masquage token", es: "Utilidad para ocultar tokens", it: "Utility oscuramento token", de: "Token-Redaction-Utility" },
      versions: [
`export function redactToken(value) {
  const text = String(value || "");
  if (text.length <= 8) return "••••";
  return \`\${text.slice(0, 4)}••••\${text.slice(-4)}\`;
}`,
`export function redactToken(value, visible = 4) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length <= visible * 2) return "•".repeat(Math.max(4, text.length));
  return \`\${text.slice(0, visible)}••••\${text.slice(-visible)}\`;
}`
      ]
    },
    {
      categoryId: "tests-playwright", languageId: "typescript", languageName: "TypeScript", sourceDomain: "playwright.dev", sourceUrl: "https://playwright.dev/docs/locators",
      title: { en: "Language menu regression test", fr: "Test régression menu langue", es: "Test regresión menú idioma", it: "Test regressione menu lingua", de: "Regressionstest Sprachmenü" },
      versions: [
`import { test, expect } from "@playwright/test";

test("language menu opens above product navigation", async ({ page }) => {
  await page.goto("/fr/ultimate-clipboard-pro/");
  await page.getByRole("button", { name: /langue/i }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
});`,
`import { test, expect } from "@playwright/test";

test("language menu routes to English product page", async ({ page }) => {
  await page.goto("/fr/ultimate-clipboard-pro/");
  await page.getByRole("button", { name: /langue/i }).click();
  await page.getByRole("option", { name: /english/i }).click();
  await expect(page).toHaveURL(/\\/ultimate-clipboard-pro\\/$/);
});`
      ]
    },
    {
      categoryId: "dev-vault", languageId: "javascript", languageName: "JavaScript", sourceDomain: "github.com", sourceUrl: "https://github.com/",
      title: { en: "Private license check sketch", fr: "Ébauche contrôle licence privé", es: "Borrador privado de licencia", it: "Bozza privata controllo licenza", de: "Private Lizenzprüfungs-Skizze" },
      versions: [
`async function verifyLicense(licenseKey) {
  const proof = await chrome.storage.local.get("licenseProof");
  if (!proof.licenseProof) return false;
  return licenseKey.startsWith("UCP-");
}`,
`async function verifyLicense(licenseKey) {
  const { licenseProof, licenseLastVerifiedAt } = await chrome.storage.local.get(["licenseProof", "licenseLastVerifiedAt"]);
  if (!licenseProof || Date.now() - Number(licenseLastVerifiedAt || 0) > 86400000) return false;
  return String(licenseKey || "").startsWith("UCP-");
}`
      ]
    },
    {
      categoryId: "dev-trash", languageId: "javascript", languageName: "JavaScript", sourceDomain: "github.com", sourceUrl: "https://github.com/",
      title: { en: "Retired drag ghost prototype", fr: "Prototype ghost drag retiré", es: "Prototipo ghost drag retirado", it: "Prototipo ghost drag ritirato", de: "Verworfener Drag-Ghost-Prototyp" },
      versions: [
`function createDragGhost(label) {
  const ghost = document.createElement("div");
  ghost.textContent = label;
  ghost.style.position = "fixed";
  document.body.appendChild(ghost);
  return ghost;
}`,
`function createDragGhost(label) {
  const ghost = document.createElement("div");
  ghost.className = "capture-drag-ghost";
  ghost.textContent = label;
  document.body.appendChild(ghost);
  return ghost;
}`
      ]
    }
  ];

  function makeRichCodeSamples(language) {
    return richCodeDefinitions.map((definition) => sampleWithMeta({
      language,
      categoryId: definition.categoryId,
      languageId: definition.languageId,
      languageName: definition.languageName,
      title: definition.title,
      sourceDomain: definition.sourceDomain,
      sourceUrl: definition.sourceUrl,
      note: localized(definition.title, language)
    }, definition.versions));
  }

  supportedLanguages.forEach((language) => {
    textSamples[language] = makeRichTextSamples(language);
    codeSamples[language] = makeRichCodeSamples(language);
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

  function categoryNameFor(kind, categoryId, language) {
    if (categoryId === "vault" || categoryId === "dev-vault" || categoryId === "image-vault") return copyByLang[language]?.vault || "Vault";
    if (categoryId === "trash" || categoryId === "dev-trash" || categoryId === "image-trash") return copyByLang[language]?.trash || "Trash";
    if (categoryId === "general" || categoryId === "dev-general" || categoryId === "image-general") return copyByLang[language]?.general || "General";
    return localized(richCategoryLabels[kind]?.[categoryId], language) || categoryId;
  }

  function textItems(language) {
    const now = Date.now();
    const categoryIds = ["general", "research-sources", "research-competitors", "research-quotes", "support-macros", "support-incidents", "operations-weekly", "operations-process", "marketing-social", "marketing-newsletter", "product-roadmap", "product-feedback", "legal-privacy", "legal-release", "people-training", "people-onboarding", "ai-prompts", "ai-evaluation", "sales-objections", "sales-followups", "design-copy", "design-checklist", "vault", "trash"];
    return textSamples[language].map((sample, index) => {
      const [title, ...versions] = sample;
      const id = `demo-text-${index + 1}`;
      const captureVersions = makeVersions(id, title, versions, now - (index + 1) * 86400000);
      const categoryId = sample.categoryId || categoryIds[index] || "general";
      const trashed = categoryId === "trash";
      return {
        id,
        title,
        content: versions[0],
        preview: versions[0].slice(0, 260),
        note: sample.note || (index === 0 ? "Demo Pro workspace" : ""),
        categoryId,
        categoryName: categoryNameFor("text", categoryId, language),
        sourceUrl: sample.sourceUrl || (index === 0 ? "https://chatgpt.com/" : "https://docs.example.com/"),
        sourceDomain: sample.sourceDomain || (index === 0 ? "chatgpt.com" : "docs.example.com"),
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
    const categoryIds = ["dev-general", "typescript-api", "typescript-storage", "react-components", "react-hooks", "javascript-dom", "javascript-events", "css-layout", "html-templates", "python-automation", "sql-reports", "node-workers", "tests-playwright", "dev-vault", "dev-trash"];
    return codeSamples[language].map((sample, index) => {
      const [title, ...versions] = sample;
      const id = `demo-code-${index + 1}`;
      const captureVersions = makeVersions(id, title, versions, now - (index + 6) * 86400000);
      const categoryId = sample.categoryId || categoryIds[index] || "dev-general";
      const trashed = categoryId === "dev-trash";
      const languageId = sample.languageId || (categoryId.includes("typescript") ? "typescript" : categoryId.includes("react") ? "react" : categoryId.includes("css") ? "css" : categoryId.includes("html") ? "html" : categoryId.includes("python") ? "python" : categoryId.includes("sql") ? "sql" : "javascript");
      const languageName = sample.languageName || (languageId === "typescript" ? "TypeScript" : languageId === "react" ? "React" : languageId === "css" ? "CSS" : languageId === "html" ? "HTML" : languageId === "python" ? "Python" : languageId === "sql" ? "SQL" : "JavaScript");
      return {
        id,
        title,
        content: versions[0],
        preview: versions[0].slice(0, 260),
        note: sample.note || "",
        categoryId,
        categoryName: categoryNameFor("dev", categoryId, language),
        languageId,
        languageName,
        sourceUrl: sample.sourceUrl || "https://github.com/",
        sourceDomain: sample.sourceDomain || "github.com",
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
      { id: "ai-prompts", name: categoryNameFor("text", "ai-prompts", language), parentId: "ai", icon: "dot", color: "#7c3aed", createdAt: 1, order: 101 },
      { id: "ai-evaluation", name: categoryNameFor("text", "ai-evaluation", language), parentId: "ai", icon: "dot", color: "#7c3aed", createdAt: 1, order: 102 },
      { id: "research", name: l.research, parentId: null, icon: "dot", color: "#22c55e", createdAt: 1, order: 11 },
      { id: "research-sources", name: categoryNameFor("text", "research-sources", language), parentId: "research", icon: "dot", color: "#22c55e", createdAt: 1, order: 111 },
      { id: "research-competitors", name: categoryNameFor("text", "research-competitors", language), parentId: "research", icon: "dot", color: "#22c55e", createdAt: 1, order: 112 },
      { id: "research-quotes", name: categoryNameFor("text", "research-quotes", language), parentId: "research", icon: "dot", color: "#22c55e", createdAt: 1, order: 113 },
      { id: "support", name: l.support, parentId: null, icon: "dot", color: "#0ea5e9", createdAt: 1, order: 12 },
      { id: "support-macros", name: categoryNameFor("text", "support-macros", language), parentId: "support", icon: "dot", color: "#0ea5e9", createdAt: 1, order: 121 },
      { id: "support-incidents", name: categoryNameFor("text", "support-incidents", language), parentId: "support", icon: "dot", color: "#0ea5e9", createdAt: 1, order: 122 },
      { id: "operations", name: l.operations, parentId: null, icon: "dot", color: "#f97316", createdAt: 1, order: 13 },
      { id: "operations-weekly", name: categoryNameFor("text", "operations-weekly", language), parentId: "operations", icon: "dot", color: "#f97316", createdAt: 1, order: 131 },
      { id: "operations-process", name: categoryNameFor("text", "operations-process", language), parentId: "operations", icon: "dot", color: "#f97316", createdAt: 1, order: 132 },
      { id: "marketing", name: categoryNameFor("text", "marketing", language), parentId: null, icon: "dot", color: "#ec4899", createdAt: 1, order: 14 },
      { id: "marketing-social", name: categoryNameFor("text", "marketing-social", language), parentId: "marketing", icon: "dot", color: "#ec4899", createdAt: 1, order: 141 },
      { id: "marketing-newsletter", name: categoryNameFor("text", "marketing-newsletter", language), parentId: "marketing", icon: "dot", color: "#ec4899", createdAt: 1, order: 142 },
      { id: "product", name: l.product, parentId: null, icon: "dot", color: "#06b6d4", createdAt: 1, order: 15 },
      { id: "product-roadmap", name: categoryNameFor("text", "product-roadmap", language), parentId: "product", icon: "dot", color: "#06b6d4", createdAt: 1, order: 151 },
      { id: "product-feedback", name: categoryNameFor("text", "product-feedback", language), parentId: "product", icon: "dot", color: "#06b6d4", createdAt: 1, order: 152 },
      { id: "legal", name: categoryNameFor("text", "legal", language), parentId: null, icon: "dot", color: "#64748b", createdAt: 1, order: 16 },
      { id: "legal-privacy", name: categoryNameFor("text", "legal-privacy", language), parentId: "legal", icon: "dot", color: "#64748b", createdAt: 1, order: 161 },
      { id: "legal-release", name: categoryNameFor("text", "legal-release", language), parentId: "legal", icon: "dot", color: "#64748b", createdAt: 1, order: 162 },
      { id: "people", name: categoryNameFor("text", "people", language), parentId: null, icon: "dot", color: "#84cc16", createdAt: 1, order: 17 },
      { id: "people-training", name: categoryNameFor("text", "people-training", language), parentId: "people", icon: "dot", color: "#84cc16", createdAt: 1, order: 171 },
      { id: "people-onboarding", name: categoryNameFor("text", "people-onboarding", language), parentId: "people", icon: "dot", color: "#84cc16", createdAt: 1, order: 172 },
      { id: "sales", name: categoryNameFor("text", "sales", language), parentId: null, icon: "dot", color: "#f59e0b", createdAt: 1, order: 18 },
      { id: "sales-objections", name: categoryNameFor("text", "sales-objections", language), parentId: "sales", icon: "dot", color: "#f59e0b", createdAt: 1, order: 181 },
      { id: "sales-followups", name: categoryNameFor("text", "sales-followups", language), parentId: "sales", icon: "dot", color: "#f59e0b", createdAt: 1, order: 182 },
      { id: "design", name: l.design, parentId: null, icon: "dot", color: "#a855f7", createdAt: 1, order: 19 },
      { id: "design-copy", name: categoryNameFor("text", "design-copy", language), parentId: "design", icon: "dot", color: "#a855f7", createdAt: 1, order: 191 },
      { id: "design-checklist", name: categoryNameFor("text", "design-checklist", language), parentId: "design", icon: "dot", color: "#a855f7", createdAt: 1, order: 192 }
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
      { id: "javascript-dom", name: categoryNameFor("dev", "javascript-dom", language), parentId: "javascript", icon: "dot", color: "#f7df1e", createdAt: 1, order: 101 },
      { id: "javascript-events", name: categoryNameFor("dev", "javascript-events", language), parentId: "javascript", icon: "dot", color: "#f7df1e", createdAt: 1, order: 102 },
      { id: "typescript", name: "TypeScript", parentId: null, icon: "dot", color: "#3178c6", createdAt: 1, order: 11 },
      { id: "typescript-api", name: categoryNameFor("dev", "typescript-api", language), parentId: "typescript", icon: "dot", color: "#3178c6", createdAt: 1, order: 111 },
      { id: "typescript-storage", name: categoryNameFor("dev", "typescript-storage", language), parentId: "typescript", icon: "dot", color: "#3178c6", createdAt: 1, order: 112 },
      { id: "react", name: "React", parentId: null, icon: "dot", color: "#61dafb", createdAt: 1, order: 12 },
      { id: "react-components", name: categoryNameFor("dev", "react-components", language), parentId: "react", icon: "dot", color: "#61dafb", createdAt: 1, order: 121 },
      { id: "react-hooks", name: categoryNameFor("dev", "react-hooks", language), parentId: "react", icon: "dot", color: "#61dafb", createdAt: 1, order: 122 },
      { id: "css", name: "CSS", parentId: null, icon: "dot", color: "#38bdf8", createdAt: 1, order: 13 },
      { id: "css-layout", name: categoryNameFor("dev", "css-layout", language), parentId: "css", icon: "dot", color: "#38bdf8", createdAt: 1, order: 131 },
      { id: "html", name: "HTML", parentId: null, icon: "dot", color: "#f97316", createdAt: 1, order: 14 },
      { id: "html-templates", name: categoryNameFor("dev", "html-templates", language), parentId: "html", icon: "dot", color: "#f97316", createdAt: 1, order: 141 },
      { id: "python", name: "Python", parentId: null, icon: "dot", color: "#22c55e", createdAt: 1, order: 15 },
      { id: "python-automation", name: categoryNameFor("dev", "python-automation", language), parentId: "python", icon: "dot", color: "#22c55e", createdAt: 1, order: 151 },
      { id: "sql", name: "SQL", parentId: null, icon: "dot", color: "#a855f7", createdAt: 1, order: 16 },
      { id: "sql-reports", name: categoryNameFor("dev", "sql-reports", language), parentId: "sql", icon: "dot", color: "#a855f7", createdAt: 1, order: 161 },
      { id: "node", name: "Node", parentId: null, icon: "dot", color: "#84cc16", createdAt: 1, order: 17 },
      { id: "node-workers", name: categoryNameFor("dev", "node-workers", language), parentId: "node", icon: "dot", color: "#84cc16", createdAt: 1, order: 171 },
      { id: "tests", name: "Tests", parentId: null, icon: "dot", color: "#ec4899", createdAt: 1, order: 18 },
      { id: "tests-playwright", name: categoryNameFor("dev", "tests-playwright", language), parentId: "tests", icon: "dot", color: "#ec4899", createdAt: 1, order: 181 }
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
