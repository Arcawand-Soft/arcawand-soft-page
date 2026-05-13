const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const langs = {
  en: {
    dir: "",
    html: "en",
    home: "/",
    navSofts: "Our apps",
    desc: "The ultimate clipboard manager",
    back: "Back to ArcaWand Soft",
    presentation: "Presentation",
    faq: "FAQ",
    privacy: "Privacy policy",
    footer: "ArcaWand Soft. Premium apps for demanding users.",
    sideTitle: "Product pages",
    sideText: "Navigate the Ultimate Clipboard Pro product area.",
    updated: "Last updated: May 13, 2026",
    faqTitle: "Ultimate Clipboard Pro FAQ",
    faqDesc: "Answers about Ultimate Clipboard Pro features, privacy, Pro licensing, captures, Google Drive sync and Chrome extension usage.",
    faqKicker: "Product support",
    faqLead: "Everything a demanding user should understand before installing Ultimate Clipboard Pro: what it captures, what stays local, what Pro unlocks and how daily workflows are protected.",
    privacyTitle: "Ultimate Clipboard Pro Privacy Policy",
    privacyDesc: "Detailed privacy policy for Ultimate Clipboard Pro, covering local storage, browser permissions, Google Drive sync, payments, analytics and user control.",
    privacyKicker: "Product privacy",
    privacyLead: "Ultimate Clipboard Pro is designed as a local-first browser extension. This page explains what data is handled, where it stays, which optional services may be contacted, and how users remain in control.",
    faqItems: [
      ["What is Ultimate Clipboard Pro?", "Ultimate Clipboard Pro is a Chrome extension that captures, organizes and helps reuse text, code, images, screenshots and web page captures while you browse."],
      ["Does it replace my normal clipboard?", "No. It complements the browser and system clipboard. You can still copy and paste normally while selected captures are stored, organized and searchable."],
      ["What can I capture?", "The extension supports text captures, code captures, image captures, one-click screenshots and full web page capture as Markdown when available."],
      ["Where is my content stored?", "By default, captures and settings are stored locally in the browser extension storage on your device."],
      ["Is Google Drive required?", "No. Google Drive sync is optional. Local export and restore remain available for users who prefer local backups."],
      ["What does Pro unlock?", "Pro unlocks unlimited captures, the vault, trash management, capture montage, versioning, advanced workflows, more tools and optional Google Drive sync."],
      ["Can I use it without Pro?", "Yes. The free version is useful with storage limits and access to fewer tools. Pro is for heavier daily use."],
      ["How does versioning work?", "Pro users can create up to 10 versions inside the same text or code capture, without creating confusing duplicate items."],
      ["Does search include titles, notes and source URLs?", "Yes. Search is designed to include capture content and useful metadata such as titles, notes and source URLs when available."],
      ["Are my captures sent to ArcaWand Soft servers?", "Normal local use does not require an ArcaWand Soft capture server. Optional third-party services are contacted only for the features they provide."],
      ["What permissions are needed?", "Permissions depend on enabled features: storage, clipboard workflows, capture interfaces, source access and optional synchronization."],
      ["How can I contact the developer?", "Contact ArcaWand Soft at contact@arcawand-soft.com for support, privacy questions or business requests."]
    ],
    privacySections: [
      ["Overview", ["Ultimate Clipboard Pro is a Chrome extension built by ArcaWand Soft to help users capture, organize, search, edit and reuse text, code and images while browsing.", "The product is designed with a local-first philosophy: normal capture management happens inside the browser extension environment on the user device."]],
      ["Data handled by the extension", ["Depending on the features used, the extension may store captured text, code, image data, screenshots, page metadata, titles, notes, categories, favorites, pinned states, source URLs, favicons, version history, display preferences and user settings."]],
      ["Local storage", ["By default, captured content and settings are stored locally through browser extension storage. Removing the extension or clearing browser extension data may remove local captures unless the user has exported or synchronized a backup."]],
      ["Optional Google Drive synchronization", ["If the user connects Google Drive, the extension may create or update an Ultimate Clipboard Pro folder in the user Drive account to back up and restore extension data.", "Google Drive sync is optional and controlled by the user."]],
      ["Payments and licensing", ["Pro licensing and payment flows may use third-party payment and license providers. Payment details are handled by those providers, not by a public ArcaWand Soft capture database.", "The extension may verify license state to unlock Pro functionality."]],
      ["No sale of captured content", ["ArcaWand Soft does not sell captured clipboard content. The extension is intended for private productivity, organization and reuse by the user."]],
      ["Browser permissions", ["The extension requests permissions needed for capture, storage, clipboard, interface and optional synchronization workflows. Users can review extension permissions in Chrome before installing or updating."]],
      ["Backups and exports", ["Local JSON or ZIP exports are created at the user request and should be stored carefully. Anyone with access to an exported backup may be able to read its contents."]],
      ["Security expectations", ["Users should keep Chrome updated, protect their operating system account, avoid untrusted extensions and store backups in trusted locations. Vault access reduces casual exposure but does not replace operating-system security."]],
      ["Contact", ["For privacy questions, contact ArcaWand Soft at contact@arcawand-soft.com."]]
    ]
  },
  fr: {
    dir: "fr",
    html: "fr",
    home: "/fr/",
    navSofts: "Nos apps",
    desc: "Le gestionnaire de presse-papiers ultime",
    back: "Retour vers ArcaWand Soft",
    presentation: "Présentation",
    faq: "FAQ",
    privacy: "Politique de confidentialité",
    footer: "ArcaWand Soft. Apps premium pour utilisateurs exigeants.",
    sideTitle: "Pages produit",
    sideText: "Naviguez dans l’espace produit Ultimate Clipboard Pro.",
    updated: "Dernière mise à jour : 13 mai 2026",
    faqTitle: "FAQ Ultimate Clipboard Pro",
    faqDesc: "Réponses sur les fonctionnalités, la confidentialité, la licence Pro, les captures, la synchronisation Google Drive et l’utilisation de l’extension Chrome Ultimate Clipboard Pro.",
    faqKicker: "Support produit",
    faqLead: "Tout ce qu’un utilisateur exigeant doit comprendre avant d’installer Ultimate Clipboard Pro : ce qui est capturé, ce qui reste local, ce que Pro débloque et comment les flux de travail quotidiens sont protégés.",
    privacyTitle: "Politique de confidentialité Ultimate Clipboard Pro",
    privacyDesc: "Politique de confidentialité détaillée pour Ultimate Clipboard Pro : stockage local, permissions navigateur, synchronisation Google Drive, paiements, analytics et contrôle utilisateur.",
    privacyKicker: "Confidentialité produit",
    privacyLead: "Ultimate Clipboard Pro est conçu comme une extension navigateur local-first. Cette page explique quelles données sont traitées, où elles restent, quels services optionnels peuvent être contactés et comment l’utilisateur garde le contrôle.",
    faqItems: [
      ["Qu’est-ce qu’Ultimate Clipboard Pro ?", "Ultimate Clipboard Pro est une extension Chrome qui capture, organise et aide à réutiliser les textes, codes, images, captures d’écran et captures de pages web pendant la navigation."],
      ["L’extension remplace-t-elle mon presse-papier normal ?", "Non. Elle complète le presse-papier du navigateur et du système. Vous pouvez toujours copier-coller normalement, tout en conservant les captures utiles."],
      ["Que puis-je capturer ?", "L’extension prend en charge les textes, codes, images, captures d’écran en un clic et captures de pages web en Markdown lorsque disponible."],
      ["Où sont stockées mes captures ?", "Par défaut, les captures et réglages sont stockés localement dans le stockage de l’extension sur votre appareil."],
      ["Google Drive est-il obligatoire ?", "Non. La synchronisation Google Drive est optionnelle. L’export et la restauration locale restent disponibles."],
      ["Que débloque la licence Pro ?", "Pro débloque les captures illimitées, le coffre-fort, la corbeille, le montage, le versioning, des workflows avancés, davantage d’outils et la synchronisation Drive optionnelle."],
      ["Puis-je utiliser l’extension sans Pro ?", "Oui. La version gratuite reste utile avec des limites de stockage et un accès à une partie des outils."],
      ["Comment fonctionne le versioning ?", "Les utilisateurs Pro peuvent créer jusqu’à 10 versions dans une même capture de texte ou de code, sans générer de doublons confus."],
      ["La recherche inclut-elle les titres, notes et URLs sources ?", "Oui. La recherche inclut le contenu des captures et les métadonnées utiles comme les titres, notes et URLs sources lorsque disponibles."],
      ["L’extension envoie-t-elle mes captures aux serveurs ArcaWand Soft ?", "Non pour l’usage local normal. Les services tiers optionnels, comme Google Drive ou les fournisseurs de paiement et licence, sont contactés seulement pour leur fonction."],
      ["Quelles permissions sont nécessaires ?", "Les permissions dépendent des fonctions activées : stockage, presse-papier, capture, interface, accès source et synchronisation optionnelle."],
      ["Comment contacter le développeur ?", "Vous pouvez contacter ArcaWand Soft à contact@arcawand-soft.com pour le support, la confidentialité ou les demandes professionnelles."]
    ],
    privacySections: [
      ["Vue d’ensemble", ["Ultimate Clipboard Pro est une extension Chrome créée par ArcaWand Soft pour aider les utilisateurs à capturer, organiser, rechercher, éditer et réutiliser textes, codes et images pendant la navigation.", "Le produit suit une philosophie local-first : la gestion courante des captures se fait dans l’environnement de l’extension sur l’appareil de l’utilisateur."]],
      ["Données traitées par l’extension", ["Selon les fonctions utilisées, l’extension peut stocker textes capturés, codes, données d’images, captures d’écran, métadonnées de pages, titres, notes, catégories, favoris, épingles, URLs sources, favicons, historique des versions, préférences d’affichage et réglages utilisateur."]],
      ["Stockage local", ["Par défaut, les captures et réglages sont stockés localement via le stockage d’extension du navigateur. La suppression de l’extension ou des données associées peut supprimer les captures locales sans export ou synchronisation préalable."]],
      ["Synchronisation Google Drive optionnelle", ["Si l’utilisateur connecte Google Drive, l’extension peut créer ou mettre à jour un dossier Ultimate Clipboard Pro dans son compte Drive afin de sauvegarder et restaurer les données.", "La synchronisation Google Drive est optionnelle et contrôlée par l’utilisateur."]],
      ["Paiements et licence", ["Les paiements et licences Pro peuvent utiliser des prestataires tiers. Les informations de paiement sont traitées par ces prestataires, pas par une base de captures publique ArcaWand Soft.", "L’extension peut vérifier l’état de licence afin de débloquer les fonctions Pro."]],
      ["Aucune vente du contenu capturé", ["ArcaWand Soft ne vend pas le contenu capturé. L’objectif de l’extension est la productivité privée, l’organisation et la réutilisation par l’utilisateur."]],
      ["Permissions navigateur", ["L’extension demande les permissions nécessaires aux workflows de capture, stockage, presse-papier, interface et synchronisation optionnelle. Les utilisateurs peuvent consulter les permissions dans Chrome."]],
      ["Sauvegardes et exports", ["Les exports locaux JSON ou ZIP sont créés à la demande de l’utilisateur et doivent être stockés avec prudence. Toute personne ayant accès à un export peut potentiellement lire son contenu."]],
      ["Sécurité attendue", ["Les utilisateurs doivent garder Chrome à jour, protéger leur session système, éviter les extensions non fiables et stocker les sauvegardes dans des emplacements sûrs. Le coffre-fort réduit l’exposition occasionnelle mais ne remplace pas la sécurité du système."]],
      ["Contact", ["Pour toute question de confidentialité, contactez ArcaWand Soft à contact@arcawand-soft.com."]]
    ]
  },
  es: {
    dir: "es", html: "es", home: "/es/", navSofts: "Nuestras apps", desc: "El gestor de portapapeles definitivo", back: "Volver a ArcaWand Soft", presentation: "Presentación", faq: "FAQ", privacy: "Política de privacidad", footer: "ArcaWand Soft. Apps premium para usuarios exigentes.", sideTitle: "Páginas del producto", sideText: "Navega por el espacio de producto Ultimate Clipboard Pro.", updated: "Última actualización: 13 de mayo de 2026",
    faqTitle: "FAQ de Ultimate Clipboard Pro", faqDesc: "Respuestas sobre funciones, privacidad, licencia Pro, capturas, sincronización con Google Drive y uso de la extensión Chrome Ultimate Clipboard Pro.", faqKicker: "Soporte del producto", faqLead: "Todo lo que un usuario exigente debe entender antes de instalar Ultimate Clipboard Pro: qué captura, qué permanece local, qué desbloquea Pro y cómo se protegen los flujos diarios.",
    privacyTitle: "Política de privacidad de Ultimate Clipboard Pro", privacyDesc: "Política de privacidad detallada de Ultimate Clipboard Pro: almacenamiento local, permisos del navegador, sincronización con Google Drive, pagos, analítica y control del usuario.", privacyKicker: "Privacidad del producto", privacyLead: "Ultimate Clipboard Pro está diseñado como una extensión local-first. Esta página explica qué datos se tratan, dónde permanecen, qué servicios opcionales pueden contactarse y cómo el usuario conserva el control.",
    faqItems: [
      ["¿Qué es Ultimate Clipboard Pro?", "Es una extensión de Chrome que captura, organiza y ayuda a reutilizar textos, código, imágenes, capturas de pantalla y páginas web mientras navegas."],
      ["¿Reemplaza mi portapapeles normal?", "No. Complementa el portapapeles del navegador y del sistema, manteniendo el copiado y pegado normal."],
      ["¿Qué puedo capturar?", "Textos, código, imágenes, capturas de pantalla en un clic y páginas web en Markdown cuando esté disponible."],
      ["¿Dónde se guardan mis capturas?", "Por defecto, localmente en el almacenamiento de la extensión del navegador."],
      ["¿Google Drive es obligatorio?", "No. La sincronización con Google Drive es opcional y también existen exportación y restauración locales."],
      ["¿Qué desbloquea Pro?", "Capturas ilimitadas, bóveda, papelera, montaje, versionado, flujos avanzados, más herramientas y sincronización opcional con Google Drive."],
      ["¿Puedo usarla sin Pro?", "Sí. La versión gratuita es útil con límites de almacenamiento y menos herramientas."],
      ["¿Cómo funciona el versionado?", "Los usuarios Pro pueden crear hasta 10 versiones dentro de una misma captura de texto o código."],
      ["¿La búsqueda incluye títulos, notas y URLs?", "Sí. La búsqueda incluye contenido y metadatos útiles cuando están disponibles."],
      ["¿Mis capturas se envían a servidores de ArcaWand Soft?", "No para el uso local normal. Los servicios opcionales se contactan solo para su función."],
      ["¿Qué permisos necesita?", "Depende de las funciones activadas: almacenamiento, portapapeles, captura, interfaz, origen y sincronización opcional."],
      ["¿Cómo contacto con el desarrollador?", "Escribe a contact@arcawand-soft.com para soporte, privacidad o solicitudes profesionales."]
    ],
    privacySections: [
      ["Resumen", ["Ultimate Clipboard Pro es una extensión de Chrome creada por ArcaWand Soft para capturar, organizar, buscar, editar y reutilizar textos, código e imágenes durante la navegación.", "El producto sigue una filosofía local-first: la gestión normal ocurre en el entorno de la extensión en el dispositivo del usuario."]],
      ["Datos tratados", ["La extensión puede almacenar textos, código, imágenes, capturas, metadatos, títulos, notas, categorías, favoritos, URLs de origen, favicons, versiones, preferencias y ajustes."]],
      ["Almacenamiento local", ["Por defecto, capturas y ajustes se guardan localmente mediante el almacenamiento de la extensión."]],
      ["Google Drive opcional", ["Si el usuario conecta Google Drive, la extensión puede crear o actualizar una carpeta Ultimate Clipboard Pro para copia y restauración."]],
      ["Pagos y licencia", ["Los pagos y licencias Pro pueden usar proveedores externos. La extensión puede verificar la licencia para desbloquear Pro."]],
      ["No vendemos capturas", ["ArcaWand Soft no vende el contenido capturado."]],
      ["Permisos del navegador", ["La extensión solicita permisos necesarios para captura, almacenamiento, portapapeles, interfaz y sincronización opcional."]],
      ["Copias y exportaciones", ["Los archivos JSON o ZIP exportados deben guardarse de forma segura."]],
      ["Seguridad", ["Mantén Chrome actualizado, protege tu sesión y evita extensiones no confiables."]],
      ["Contacto", ["Para privacidad, escribe a contact@arcawand-soft.com."]]
    ]
  },
  it: {
    dir: "it", html: "it", home: "/it/", navSofts: "Le nostre app", desc: "Il gestore degli appunti definitivo", back: "Torna ad ArcaWand Soft", presentation: "Presentazione", faq: "FAQ", privacy: "Informativa privacy", footer: "ArcaWand Soft. App premium per utenti esigenti.", sideTitle: "Pagine prodotto", sideText: "Naviga nello spazio prodotto Ultimate Clipboard Pro.", updated: "Ultimo aggiornamento: 13 maggio 2026",
    faqTitle: "FAQ di Ultimate Clipboard Pro", faqDesc: "Risposte su funzioni, privacy, licenza Pro, acquisizioni, sincronizzazione Google Drive e uso dell’estensione Chrome Ultimate Clipboard Pro.", faqKicker: "Supporto prodotto", faqLead: "Tutto ciò che un utente esigente deve sapere prima di installare Ultimate Clipboard Pro: cosa cattura, cosa resta locale, cosa sblocca Pro e come protegge i flussi quotidiani.",
    privacyTitle: "Informativa privacy di Ultimate Clipboard Pro", privacyDesc: "Informativa privacy dettagliata per Ultimate Clipboard Pro: archiviazione locale, permessi browser, sincronizzazione Google Drive, pagamenti, analytics e controllo utente.", privacyKicker: "Privacy prodotto", privacyLead: "Ultimate Clipboard Pro è progettata come estensione local-first. Questa pagina spiega quali dati vengono trattati, dove restano, quali servizi opzionali possono essere contattati e come l’utente mantiene il controllo.",
    faqItems: [
      ["Che cos’è Ultimate Clipboard Pro?", "È un’estensione Chrome che cattura, organizza e aiuta a riutilizzare testi, codice, immagini, screenshot e pagine web durante la navigazione."],
      ["Sostituisce gli appunti normali?", "No. Integra gli appunti del browser e del sistema, lasciando invariato copia e incolla."],
      ["Cosa posso catturare?", "Testi, codice, immagini, screenshot in un clic e pagine web in Markdown quando disponibile."],
      ["Dove vengono salvate le catture?", "Di default, localmente nello storage dell’estensione."],
      ["Google Drive è obbligatorio?", "No. La sincronizzazione Google Drive è opzionale; export e ripristino locali restano disponibili."],
      ["Cosa sblocca Pro?", "Catture illimitate, vault, cestino, montaggio, versioning, flussi avanzati, più strumenti e Google Drive opzionale."],
      ["Posso usarla senza Pro?", "Sì. La versione gratuita è utile con limiti di archiviazione e meno strumenti."],
      ["Come funziona il versioning?", "Gli utenti Pro possono creare fino a 10 versioni nella stessa cattura di testo o codice."],
      ["La ricerca include titoli, note e URL?", "Sì. La ricerca include contenuto e metadati utili quando disponibili."],
      ["Le catture vengono inviate ai server ArcaWand Soft?", "No per l’uso locale normale. I servizi opzionali sono contattati solo per la loro funzione."],
      ["Quali permessi servono?", "Dipende dalle funzioni attive: storage, appunti, cattura, interfaccia, sorgente e sincronizzazione opzionale."],
      ["Come contatto lo sviluppatore?", "Scrivi a contact@arcawand-soft.com per supporto, privacy o richieste professionali."]
    ],
    privacySections: [
      ["Panoramica", ["Ultimate Clipboard Pro è un’estensione Chrome creata da ArcaWand Soft per catturare, organizzare, cercare, modificare e riutilizzare testi, codice e immagini durante la navigazione.", "Il prodotto segue una filosofia local-first."]],
      ["Dati trattati", ["L’estensione può salvare testi, codice, immagini, screenshot, metadati, titoli, note, categorie, preferiti, URL sorgente, favicon, versioni, preferenze e impostazioni."]],
      ["Archiviazione locale", ["Di default, catture e impostazioni vengono archiviate localmente tramite lo storage dell’estensione."]],
      ["Google Drive opzionale", ["Se l’utente collega Google Drive, l’estensione può creare o aggiornare una cartella Ultimate Clipboard Pro per backup e ripristino."]],
      ["Pagamenti e licenza", ["Pagamenti e licenze Pro possono usare provider terzi. L’estensione può verificare la licenza per sbloccare Pro."]],
      ["Nessuna vendita", ["ArcaWand Soft non vende il contenuto catturato."]],
      ["Permessi browser", ["L’estensione richiede i permessi necessari per cattura, storage, appunti, interfaccia e sincronizzazione opzionale."]],
      ["Backup ed export", ["Gli export JSON o ZIP devono essere conservati con attenzione."]],
      ["Sicurezza", ["Mantieni Chrome aggiornato, proteggi l’account del sistema operativo ed evita estensioni non affidabili."]],
      ["Contatto", ["Per domande sulla privacy, scrivi a contact@arcawand-soft.com."]]
    ]
  },
  de: {
    dir: "de", html: "de", home: "/de/", navSofts: "Unsere Apps", desc: "Der ultimative Zwischenablage-Manager", back: "Zurück zu ArcaWand Soft", presentation: "Präsentation", faq: "FAQ", privacy: "Datenschutz", footer: "ArcaWand Soft. Premium-Apps für anspruchsvolle Nutzer.", sideTitle: "Produktseiten", sideText: "Navigieren Sie im Produktbereich von Ultimate Clipboard Pro.", updated: "Zuletzt aktualisiert: 13. Mai 2026",
    faqTitle: "FAQ zu Ultimate Clipboard Pro", faqDesc: "Antworten zu Funktionen, Datenschutz, Pro-Lizenz, Captures, Google-Drive-Synchronisierung und Nutzung der Chrome-Erweiterung Ultimate Clipboard Pro.", faqKicker: "Produktsupport", faqLead: "Alles, was anspruchsvolle Nutzer vor der Installation von Ultimate Clipboard Pro wissen sollten: was erfasst wird, was lokal bleibt, was Pro freischaltet und wie tägliche Workflows geschützt werden.",
    privacyTitle: "Datenschutz für Ultimate Clipboard Pro", privacyDesc: "Detaillierte Datenschutzhinweise für Ultimate Clipboard Pro: lokaler Speicher, Browser-Berechtigungen, Google-Drive-Sync, Zahlungen, Analytics und Nutzerkontrolle.", privacyKicker: "Produktdatenschutz", privacyLead: "Ultimate Clipboard Pro ist als local-first Browser-Erweiterung konzipiert. Diese Seite erklärt, welche Daten verarbeitet werden, wo sie bleiben, welche optionalen Dienste kontaktiert werden können und wie Nutzer die Kontrolle behalten.",
    faqItems: [
      ["Was ist Ultimate Clipboard Pro?", "Eine Chrome-Erweiterung, die Texte, Code, Bilder, Screenshots und Webseiten beim Browsen erfasst, organisiert und wiederverwendbar macht."],
      ["Ersetzt sie meine normale Zwischenablage?", "Nein. Sie ergänzt die Browser- und System-Zwischenablage."],
      ["Was kann ich erfassen?", "Texte, Code, Bilder, One-Click-Screenshots und Webseiten als Markdown, wenn verfügbar."],
      ["Wo werden Captures gespeichert?", "Standardmäßig lokal im Speicher der Browser-Erweiterung."],
      ["Ist Google Drive erforderlich?", "Nein. Google-Drive-Sync ist optional; lokaler Export und Wiederherstellung bleiben verfügbar."],
      ["Was schaltet Pro frei?", "Unbegrenzte Captures, Vault, Papierkorb, Montage, Versionierung, erweiterte Workflows, mehr Tools und optionaler Drive-Sync."],
      ["Kann ich sie ohne Pro nutzen?", "Ja. Die kostenlose Version ist mit Speicherlimits und weniger Tools nutzbar."],
      ["Wie funktioniert Versionierung?", "Pro-Nutzer können bis zu 10 Versionen innerhalb derselben Text- oder Code-Capture erstellen."],
      ["Umfasst Suche Titel, Notizen und URLs?", "Ja. Die Suche umfasst Inhalte und nützliche Metadaten, sofern verfügbar."],
      ["Werden Captures an ArcaWand Soft gesendet?", "Nicht bei normaler lokaler Nutzung. Optionale Dienste werden nur für ihre Funktion kontaktiert."],
      ["Welche Berechtigungen sind nötig?", "Das hängt von aktiven Funktionen ab: Speicher, Zwischenablage, Capture, Oberfläche, Quelle und optionaler Sync."],
      ["Wie kontaktiere ich den Entwickler?", "Schreiben Sie an contact@arcawand-soft.com."]
    ],
    privacySections: [
      ["Überblick", ["Ultimate Clipboard Pro ist eine Chrome-Erweiterung von ArcaWand Soft zum Erfassen, Organisieren, Suchen, Bearbeiten und Wiederverwenden von Texten, Code und Bildern beim Browsen.", "Das Produkt folgt einer local-first Philosophie."]],
      ["Verarbeitete Daten", ["Die Erweiterung kann Texte, Code, Bilder, Screenshots, Metadaten, Titel, Notizen, Kategorien, Favoriten, Quell-URLs, Favicons, Versionen, Anzeigeeinstellungen und Nutzereinstellungen speichern."]],
      ["Lokaler Speicher", ["Standardmäßig werden Captures und Einstellungen lokal im Erweiterungsspeicher gespeichert."]],
      ["Optionaler Google-Drive-Sync", ["Wenn der Nutzer Google Drive verbindet, kann die Erweiterung einen Ultimate Clipboard Pro Ordner für Backup und Wiederherstellung erstellen."]],
      ["Zahlungen und Lizenz", ["Pro-Zahlungen und Lizenzen können Drittanbieter nutzen. Die Erweiterung kann den Lizenzstatus prüfen."]],
      ["Kein Verkauf von Captures", ["ArcaWand Soft verkauft erfasste Inhalte nicht."]],
      ["Browser-Berechtigungen", ["Die Erweiterung fordert Berechtigungen an, die für Capture, Speicherung, Zwischenablage, Oberfläche und optionalen Sync erforderlich sind."]],
      ["Backups und Exporte", ["JSON- oder ZIP-Exporte sollten sicher aufbewahrt werden."]],
      ["Sicherheit", ["Halten Sie Chrome aktuell, schützen Sie Ihr Betriebssystemkonto und vermeiden Sie nicht vertrauenswürdige Erweiterungen."]],
      ["Kontakt", ["Bei Datenschutzfragen schreiben Sie an contact@arcawand-soft.com."]]
    ]
  }
};

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}
function langBase(lang) {
  return lang === "en" ? "" : `${langs[lang].dir}/`;
}
function productBase(lang) {
  return `${langBase(lang)}ultimate-clipboard-pro/`;
}
function absProduct(lang, page = "presentation") {
  const prefix = lang === "en" ? "" : `${lang}/`;
  const suffix = page === "presentation" ? "" : `${page}/`;
  return `https://arcawand-soft.com/${prefix}ultimate-clipboard-pro/${suffix}`;
}
function relFromProductPage(page) {
  return page === "presentation"
    ? { presentation: "./", faq: "faq/", privacy: "privacy/" }
    : { presentation: "../", faq: "../faq/", privacy: "../privacy/" };
}
function homeHrefs(depth) {
  const prefix = depth === 0 ? "" : "../".repeat(depth);
  return {
    presentation: `${prefix}ultimate-clipboard-pro/`,
    faq: `${prefix}ultimate-clipboard-pro/faq/`,
    privacy: `${prefix}ultimate-clipboard-pro/privacy/`
  };
}
function languageMenu(current) {
  const flag = { en: "english", fr: "french", es: "spanish", it: "italian", de: "german" };
  const name = { en: "English", fr: "Français", es: "Español", it: "Italiano", de: "Deutsch" };
  const options = Object.keys(langs).map((code) => `<button class="language-menu-option" type="button" role="option" data-lang="${code}"${code === current ? ' aria-selected="true"' : ""}><img src="/assets/flags/${flag[code]}.webp" alt="" width="28" height="28" loading="lazy" decoding="async"><span>${name[code]}</span></button>`).join("");
  return `<div class="language-menu arcawand-product-language-menu" data-current-lang="${current}"><button class="language-menu-button" type="button" aria-haspopup="listbox" aria-expanded="false"><img src="/assets/flags/${flag[current]}.webp" alt="" width="28" height="28" loading="lazy" decoding="async"><span>${name[current]}</span><span class="language-menu-chevron" aria-hidden="true"></span></button><div class="language-menu-panel" role="listbox" aria-label="Language">${options}</div></div>`;
}
function productNav(lang, active, rel) {
  const l = langs[lang];
  return `<nav class="ucp-product-nav" aria-label="Ultimate Clipboard Pro"><a href="${rel.presentation}" data-ucp-nav="presentation"${active === "presentation" ? ' aria-current="page"' : ""}>${esc(l.presentation)}</a><a href="${rel.faq}" data-ucp-nav="faq"${active === "faq" ? ' aria-current="page"' : ""}>${esc(l.faq)}</a><a href="${rel.privacy}" data-ucp-nav="privacy"${active === "privacy" ? ' aria-current="page"' : ""}>${esc(l.privacy)}</a></nav>`;
}
function staticProductPage(lang, page) {
  const l = langs[lang];
  const rel = relFromProductPage(page);
  const title = page === "faq" ? l.faqTitle : l.privacyTitle;
  const desc = page === "faq" ? l.faqDesc : l.privacyDesc;
  const kicker = page === "faq" ? l.faqKicker : l.privacyKicker;
  const lead = page === "faq" ? l.faqLead : l.privacyLead;
  const canonical = absProduct(lang, page);
  const main = page === "faq"
    ? `<div class="ucp-faq-list">${l.faqItems.map(([q, a]) => `<article class="ucp-faq-item"><h2>${esc(q)}</h2><p>${esc(a)}</p></article>`).join("\n")}</div>`
    : `<article class="ucp-page-content"><p>${esc(l.updated)}</p>${l.privacySections.map(([h, ps]) => `<h2>${esc(h)}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("\n")}</article>`;
  return `<!doctype html>
<html lang="${l.html}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#8b5cf6">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow">
<meta name="author" content="ArcaWand Soft">
<link rel="canonical" href="${canonical}">
${Object.keys(langs).map((code) => `<link rel="alternate" hreflang="${code}" href="${absProduct(code, page)}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${absProduct("en", page)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ArcaWand Soft">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://arcawand-soft.com/assets/ultimate-keyboard-pro-preview-social-networks.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="https://arcawand-soft.com/assets/ultimate-keyboard-pro-preview-social-networks.png">
<link rel="icon" type="image/png" href="/assets/Arcawand_Soft_Favicon.png">
<link rel="stylesheet" href="/assets/ucp-product-pages.css">
<script defer src="/assets/analytics.js"></script>
<script defer src="/assets/ucp-product-pages.js"></script>
<script defer src="/assets/install-extension-modal.js"></script>
</head>
<body class="ucp-static-page">
<a class="arcawand-root-return" href="${l.home}" aria-label="${esc(l.back)}">&larr; ArcaWand Soft</a>
<div class="ucp-product-mark"><img src="/assets/ultimate_clipboard_pro_icon_96.webp" alt="" width="48" height="48" decoding="async"><span class="ucp-product-title">Ultimate Clipboard Pro</span></div>
${languageMenu(lang)}
${productNav(lang, page, rel)}
<main class="ucp-static-main">
<section class="ucp-static-hero"><span class="ucp-static-kicker">${esc(kicker)}</span><h1>${esc(title)}</h1><p>${esc(lead)}</p></section>
<section class="ucp-page-grid"><div>${main}</div><aside class="ucp-side-card"><h2>${esc(l.sideTitle)}</h2><p>${esc(l.sideText)}</p><nav><a href="${rel.presentation}">${esc(l.presentation)}</a><a href="${rel.faq}">${esc(l.faq)}</a><a href="${rel.privacy}">${esc(l.privacy)}</a></nav></aside></section>
</main>
<footer class="ucp-static-footer"><span>${esc(l.footer)}</span><span><a href="mailto:contact@arcawand-soft.com">contact@arcawand-soft.com</a></span></footer>
</body>
</html>
`;
}
function navDrop(lang, depth) {
  const l = langs[lang];
  const href = homeHrefs(depth);
  return `<div class="nav-drop"><button class="nav-drop-button" type="button" data-i18n="navSofts">${esc(l.navSofts)}</button><div class="nav-drop-menu nav-apps-menu"><div class="nav-app-card"><a class="nav-drop-item nav-app-main" href="${href.presentation}"><strong data-i18n="navUcpTitle">Ultimate Clipboard Pro</strong><span data-i18n="navUcpDesc">${esc(l.desc)}</span></a><div class="nav-app-links"><a href="${href.presentation}">${esc(l.presentation)}</a><a href="${href.faq}">${esc(l.faq)}</a><a href="${href.privacy}">${esc(l.privacy)}</a></div></div></div></div>`;
}
function patchSiteNav(file, lang, depth) {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(/<div class="nav-drop">[\s\S]*?<\/div>\s*<\/div>\s*<a class="nav-link"/, `${navDrop(lang, depth)}<a class="nav-link"`);
  fs.writeFileSync(file, content, "utf8");
}
function patchProductIndex(lang) {
  const file = path.join(root, productBase(lang), "index.html");
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("/assets/ucp-product-pages.css")) {
    content = content.replace('<link rel="stylesheet" href="/assets/ucp-email-floating.css">', '<link rel="stylesheet" href="/assets/ucp-email-floating.css">\n<link rel="stylesheet" href="/assets/ucp-product-pages.css">');
  }
  content = content.replace(/Fran\u00c3\u00a7ais/g, "Français").replace(/Espa\u00c3\u00b1ol/g, "Español");
  content = content.replace(/<nav class="ucp-product-nav"[\s\S]*?<\/nav>\s*/g, "");
  content = content.replace(/(<div id="root"><\/div>)/, `${productNav(lang, "presentation", relFromProductPage("presentation"))}\n  $1`);
  fs.writeFileSync(file, content, "utf8");
}
function patchSiteJs() {
  const file = path.join(root, "assets/site.js");
  let content = fs.readFileSync(file, "utf8");
  for (const [lang, l] of Object.entries(langs)) {
    content = content.replace(new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?navSofts:\\s*")[^"]+(")`), `$1${l.navSofts}$2`);
    content = content.replace(new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?navUcpDesc:\\s*")[^"]+(")`), `$1${l.desc}$2`);
  }
  fs.writeFileSync(file, content, "utf8");
}
function writeProductPages() {
  for (const lang of Object.keys(langs)) {
    patchProductIndex(lang);
    for (const page of ["faq", "privacy"]) {
      const dir = path.join(root, productBase(lang), page);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), staticProductPage(lang, page), "utf8");
    }
  }
}
function patchSitemap() {
  const file = path.join(root, "sitemap.xml");
  let content = fs.readFileSync(file, "utf8");
  const urls = Object.keys(langs).flatMap((lang) => [absProduct(lang, "faq"), absProduct(lang, "privacy")]);
  const additions = urls.filter((url) => !content.includes(`<loc>${url}</loc>`)).map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join("\n");
  if (additions) content = content.replace("</urlset>", `${additions}\n</urlset>`);
  fs.writeFileSync(file, content, "utf8");
}

writeProductPages();
[
  ["index.html", "en", 0], ["contact/index.html", "en", 1], ["privacy/index.html", "en", 1],
  ["fr/index.html", "fr", 0], ["fr/contact/index.html", "fr", 1], ["fr/privacy/index.html", "fr", 1],
  ["es/index.html", "es", 0], ["es/contact/index.html", "es", 1], ["es/privacy/index.html", "es", 1],
  ["it/index.html", "it", 0], ["it/contact/index.html", "it", 1], ["it/privacy/index.html", "it", 1],
  ["de/index.html", "de", 0], ["de/contact/index.html", "de", 1], ["de/privacy/index.html", "de", 1]
].forEach(([file, lang, depth]) => patchSiteNav(path.join(root, file), lang, depth));
patchSiteJs();
patchSitemap();
