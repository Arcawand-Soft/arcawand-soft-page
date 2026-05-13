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

const enhancedFaq = {
  en: [
    ["Why is Ultimate Clipboard Pro different from a classic clipboard manager?", "Most clipboard tools simply keep a chronological history. Ultimate Clipboard Pro separates text, code and images into dedicated workspaces, adds categories, source context, titles, notes, versioning, montage, advanced search and local tools. It is designed for people who copy valuable information all day and need to find it again fast."],
    ["Why is it useful for AI users, developers and creators?", "AI users can keep prompts, answers and sources organized; developers can preserve code snippets with language context; creators, researchers and marketers can reuse structured text and image references without rebuilding the same material repeatedly."],
    ["What makes the Pro version worth it?", "Pro removes the capture limits and unlocks the workflows that matter when the extension becomes part of daily work: unlimited captures, vault access, trash recovery, versioning, montage, more tools and optional Google Drive synchronization."],
    ["Can Ultimate Clipboard Pro help me stop losing important copied content?", "Yes. The product is built around that exact problem. Instead of copying something, losing it and searching again, you keep reusable captures in a structured, searchable workspace."],
    ["Is the extension designed for privacy-conscious users?", "Yes. The normal capture workflow is local-first. Optional services are clearly separated: Google Drive sync, licensing and payment flows are used only when the user chooses the related feature."],
    ["What should I try first after installing it?", "Start by capturing a few text snippets, a code block and an image, then open the manager to test categories, search, source history and copy-ready reuse. The value becomes clear when your captures stop disappearing into a linear clipboard history."]
  ],
  fr: [
    ["Pourquoi Ultimate Clipboard Pro est différent d’un gestionnaire de presse-papiers classique ?", "La plupart des outils gardent seulement un historique chronologique. Ultimate Clipboard Pro sépare textes, codes et images dans des espaces dédiés, ajoute catégories, sources, titres, notes, versioning, montage, recherche avancée et outils locaux. Il est pensé pour ceux qui copient des informations importantes toute la journée."],
    ["Pourquoi est-ce utile pour les utilisateurs d’IA, développeurs et créateurs ?", "Les utilisateurs d’IA peuvent garder prompts, réponses et sources organisés ; les développeurs conservent leurs extraits de code avec contexte ; créateurs, chercheurs et marketeurs réutilisent textes et références sans tout reconstruire."],
    ["Pourquoi passer à Pro ?", "Pro supprime les limites de capture et débloque les workflows essentiels : captures illimitées, coffre-fort, corbeille, versioning, montage, davantage d’outils et synchronisation Google Drive optionnelle."],
    ["Ultimate Clipboard Pro peut-il vraiment éviter de perdre ce que je copie ?", "Oui. Le produit répond précisément à ce problème : au lieu de copier une information, la perdre puis la rechercher à nouveau, vous la gardez dans un espace structuré et retrouvable."],
    ["L’extension est-elle adaptée aux utilisateurs soucieux de confidentialité ?", "Oui. Le flux normal est local-first. Les services optionnels restent séparés : Google Drive, licence et paiement ne sont utilisés que lorsque l’utilisateur active la fonction concernée."],
    ["Que tester en premier après l’installation ?", "Capturez quelques textes, un bloc de code et une image, puis ouvrez le gestionnaire pour tester catégories, recherche, historique des sources et réutilisation prête à coller."]
  ],
  es: [
    ["¿Por qué Ultimate Clipboard Pro es diferente de un gestor de portapapeles clásico?", "La mayoría de herramientas solo guardan un historial cronológico. Ultimate Clipboard Pro separa texto, código e imágenes, añade categorías, fuentes, títulos, notas, versionado, montaje, búsqueda avanzada y herramientas locales."],
    ["¿Por qué es útil para usuarios de IA, desarrolladores y creadores?", "Los usuarios de IA organizan prompts, respuestas y fuentes; los desarrolladores conservan snippets con contexto; creadores, investigadores y marketers reutilizan material sin rehacerlo."],
    ["¿Por qué merece la pena Pro?", "Pro elimina límites y desbloquea capturas ilimitadas, bóveda, papelera, versionado, montaje, más herramientas y sincronización opcional con Google Drive."],
    ["¿Puede evitar que pierda contenido copiado importante?", "Sí. La extensión está diseñada para que lo que copias no desaparezca en un historial lineal, sino que quede estructurado y fácil de encontrar."],
    ["¿Está pensada para usuarios sensibles a la privacidad?", "Sí. El flujo normal es local-first. Los servicios opcionales, como Drive, licencia o pagos, solo se usan cuando activas la función relacionada."],
    ["¿Qué debería probar primero?", "Captura textos, un bloque de código y una imagen; luego prueba categorías, búsqueda, historial visual de fuentes y reutilización lista para pegar."]
  ],
  it: [
    ["Perché Ultimate Clipboard Pro è diverso da un classico gestore degli appunti?", "Molti strumenti mantengono solo una cronologia. Ultimate Clipboard Pro separa testi, codice e immagini, aggiunge categorie, fonti, titoli, note, versioning, montaggio, ricerca avanzata e strumenti locali."],
    ["Perché è utile per utenti AI, sviluppatori e creator?", "Gli utenti AI organizzano prompt, risposte e fonti; gli sviluppatori conservano snippet con contesto; creator, ricercatori e marketer riutilizzano materiale senza ricostruirlo."],
    ["Perché scegliere Pro?", "Pro rimuove i limiti e sblocca catture illimitate, vault, cestino, versioning, montaggio, più strumenti e sincronizzazione Google Drive opzionale."],
    ["Può aiutarmi a non perdere contenuti copiati importanti?", "Sì. Il prodotto nasce per trasformare copie sparse in uno spazio strutturato e ricercabile."],
    ["È adatta a utenti attenti alla privacy?", "Sì. Il flusso normale è local-first. I servizi opzionali, come Drive, licenza o pagamenti, vengono usati solo quando attivi la funzione collegata."],
    ["Cosa provare subito?", "Cattura testi, un blocco di codice e un’immagine; poi prova categorie, ricerca, cronologia visiva delle fonti e riutilizzo pronto da incollare."]
  ],
  de: [
    ["Warum ist Ultimate Clipboard Pro anders als ein klassischer Zwischenablage-Manager?", "Viele Tools speichern nur eine chronologische Historie. Ultimate Clipboard Pro trennt Text, Code und Bilder, ergänzt Kategorien, Quellen, Titel, Notizen, Versionierung, Montage, erweiterte Suche und lokale Werkzeuge."],
    ["Warum ist es für KI-Nutzer, Entwickler und Creator nützlich?", "KI-Nutzer organisieren Prompts, Antworten und Quellen; Entwickler behalten Code-Snippets mit Kontext; Creator, Forscher und Marketer verwenden Material erneut, ohne es neu aufzubauen."],
    ["Warum lohnt sich Pro?", "Pro entfernt Limits und schaltet unbegrenzte Captures, Vault, Papierkorb, Versionierung, Montage, mehr Tools und optionalen Google-Drive-Sync frei."],
    ["Hilft es, wichtige kopierte Inhalte nicht mehr zu verlieren?", "Ja. Das Produkt ist darauf ausgelegt, kopierte Inhalte in einen strukturierten, durchsuchbaren Arbeitsbereich zu bringen."],
    ["Ist es für datenschutzbewusste Nutzer geeignet?", "Ja. Der normale Workflow ist local-first. Optionale Dienste wie Drive, Lizenz oder Zahlung werden nur für die jeweilige Funktion genutzt."],
    ["Was sollte ich zuerst ausprobieren?", "Erfassen Sie Texte, einen Codeblock und ein Bild; testen Sie danach Kategorien, Suche, visuelle Quellenhistorie und wiederverwendbares Einfügen."]
  ]
};

const enhancedPrivacySections = {
  en: [
    ["Developer and contact", ["Ultimate Clipboard Pro is published by ArcaWand Soft. For privacy, support or Chrome Web Store compliance questions, contact contact@arcawand-soft.com."]],
    ["Chrome Web Store user data commitment", ["This policy is intended to match the behavior of the extension and the privacy disclosures provided in the Chrome Web Store Developer Dashboard. If a disclosure, permission or feature changes, this policy should be updated accordingly.", "The extension uses requested permissions only to provide or improve clearly described product features. It does not use permissions to collect unrelated browsing data."]],
    ["Google API Limited Use statement", ["If the user enables Google Drive synchronization, the extension may receive information from Google APIs to create, read, update or restore the user’s Ultimate Clipboard Pro backup files.", "The use and transfer of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements. Google API data is used only to provide user-facing backup and synchronization features, is not sold, and is not used for advertising."]],
    ["Detailed data categories", ["User-provided content may include captured text, code, images, screenshots, notes, manually written titles, categories and montage content.", "Source and usage metadata may include page title, source URL, favicon, capture date, version creation date, favorites, pinned state, trash state, vault state, display preferences, language, theme, accent color and other settings selected by the user.", "License and payment status may include the minimum information required to verify Pro access through the selected license or payment provider. ArcaWand Soft does not process card numbers inside the extension."]],
    ["Purposes of processing", ["Data is processed to save captures, display them in the extension, organize them by workspace and category, search them, create versions, restore deleted captures, copy captures back to the clipboard, export backups, synchronize optional Drive backups and enforce Pro limits or access."]],
    ["Sharing and third-party services", ["Captured content is not shared with ArcaWand Soft for normal local use.", "Optional third-party services may be contacted only when needed: Google Drive for user-enabled synchronization, payment or license providers for Pro activation, and basic website analytics for the public marketing site."]],
    ["Security and transmission", ["Local extension data stays in the browser extension environment unless the user exports it, copies it, enables Drive sync or uses another explicit feature that moves data.", "When network communication is required for optional services, it should use HTTPS or the secure transport provided by the browser and the relevant provider."]],
    ["Retention, deletion and user control", ["Users can delete captures inside the extension, empty trash where available, export local backups, restore backups, disconnect Drive sync and remove the extension from Chrome.", "Uninstalling the extension or clearing Chrome extension storage may delete local data. Data stored in Google Drive remains under the user’s Google account until the user deletes it there."]],
    ["Children and sensitive content", ["Ultimate Clipboard Pro is a productivity tool for general users and is not directed to children. Users should avoid storing highly sensitive secrets unless they understand their own device, browser and backup security model."]],
    ["International use", ["The extension and website may be used internationally. Optional service providers may process technical data in countries where they operate, according to their own terms and privacy policies."]],
    ["Policy updates", ["This privacy policy may be updated to reflect product, legal, Chrome Web Store or provider changes. The date shown on this page indicates the latest published update."]]
  ],
  fr: [
    ["Développeur et contact", ["Ultimate Clipboard Pro est publié par ArcaWand Soft. Pour toute question de confidentialité, support ou conformité Chrome Web Store, contactez contact@arcawand-soft.com."]],
    ["Engagement relatif aux données utilisateur Chrome Web Store", ["Cette politique vise à correspondre au comportement réel de l’extension et aux déclarations de confidentialité renseignées dans le Chrome Web Store Developer Dashboard. Si une déclaration, une permission ou une fonction change, cette politique doit être mise à jour.", "L’extension utilise les permissions demandées uniquement pour fournir ou améliorer les fonctions clairement décrites. Elle n’utilise pas les permissions pour collecter des données de navigation sans lien avec le produit."]],
    ["Mention Google API Limited Use", ["Si l’utilisateur active la synchronisation Google Drive, l’extension peut recevoir des informations depuis les API Google afin de créer, lire, mettre à jour ou restaurer les fichiers de sauvegarde Ultimate Clipboard Pro de l’utilisateur.", "L’utilisation et le transfert des informations reçues depuis les API Google respecteront la Chrome Web Store User Data Policy, y compris les exigences Limited Use. Les données Google API servent uniquement aux fonctions de sauvegarde et synchronisation visibles par l’utilisateur, ne sont pas vendues et ne sont pas utilisées pour la publicité."]],
    ["Catégories détaillées de données", ["Le contenu fourni par l’utilisateur peut inclure textes capturés, codes, images, captures d’écran, notes, titres écrits manuellement, catégories et contenus de montage.", "Les métadonnées peuvent inclure titre de page, URL source, favicon, date de capture, date de création de version, favoris, état épinglé, état corbeille, état coffre-fort, préférences d’affichage, langue, thème, couleur d’accentuation et autres réglages choisis.", "L’état de licence et de paiement peut inclure le minimum nécessaire à la vérification de l’accès Pro via le fournisseur choisi. ArcaWand Soft ne traite pas les numéros de carte bancaire dans l’extension."]],
    ["Finalités du traitement", ["Les données sont traitées pour enregistrer les captures, les afficher, les classer par espace et catégorie, les rechercher, créer des versions, restaurer des captures supprimées, recopier une capture dans le presse-papier, exporter des sauvegardes, synchroniser Drive de manière optionnelle et appliquer les limites ou accès Pro."]],
    ["Partage et services tiers", ["Le contenu capturé n’est pas partagé avec ArcaWand Soft dans le cadre de l’usage local normal.", "Des services tiers optionnels peuvent être contactés uniquement si nécessaire : Google Drive pour la synchronisation activée par l’utilisateur, prestataires de paiement ou licence pour Pro, et analytics basiques pour le site marketing public."]],
    ["Sécurité et transmission", ["Les données locales de l’extension restent dans l’environnement de l’extension navigateur sauf si l’utilisateur les exporte, les copie, active Drive ou utilise une fonction explicite qui les déplace.", "Lorsque des communications réseau sont nécessaires, elles doivent utiliser HTTPS ou le transport sécurisé fourni par le navigateur et le prestataire concerné."]],
    ["Conservation, suppression et contrôle utilisateur", ["L’utilisateur peut supprimer des captures, vider la corbeille lorsque disponible, exporter des sauvegardes locales, restaurer des sauvegardes, déconnecter Drive et supprimer l’extension de Chrome.", "La désinstallation ou l’effacement du stockage Chrome peut supprimer les données locales. Les données dans Google Drive restent sous le contrôle du compte Google de l’utilisateur jusqu’à suppression par celui-ci."]],
    ["Enfants et contenus sensibles", ["Ultimate Clipboard Pro est un outil de productivité généraliste et ne vise pas les enfants. Les utilisateurs doivent éviter de stocker des secrets très sensibles sans comprendre le niveau de sécurité de leur appareil, navigateur et sauvegardes."]],
    ["Utilisation internationale", ["L’extension et le site peuvent être utilisés internationalement. Les prestataires optionnels peuvent traiter des données techniques dans les pays où ils opèrent, selon leurs propres conditions et politiques."]],
    ["Mises à jour", ["Cette politique peut être mise à jour pour refléter les changements produit, légaux, Chrome Web Store ou fournisseurs. La date affichée indique la dernière mise à jour publiée."]]
  ],
  es: [
    ["Desarrollador y contacto", ["Ultimate Clipboard Pro es publicado por ArcaWand Soft. Para privacidad, soporte o cumplimiento de Chrome Web Store, escribe a contact@arcawand-soft.com."]],
    ["Compromiso de datos de usuario de Chrome Web Store", ["Esta política busca coincidir con el comportamiento real de la extensión y las declaraciones del Chrome Web Store Developer Dashboard.", "La extensión usa permisos solo para funciones claramente descritas y no para recopilar navegación no relacionada."]],
    ["Declaración Google API Limited Use", ["Si activas Google Drive, la extensión puede recibir información de APIs de Google para crear, leer, actualizar o restaurar copias de seguridad.", "El uso y transferencia de información recibida de APIs de Google cumplirá la Chrome Web Store User Data Policy, incluidos los requisitos Limited Use. Estos datos no se venden ni se usan para publicidad."]],
    ["Categorías de datos", ["El contenido puede incluir textos, código, imágenes, capturas, notas, títulos, categorías y montajes.", "Los metadatos pueden incluir título de página, URL, favicon, fechas, favoritos, papelera, bóveda, idioma, tema, color de acento y preferencias.", "La licencia puede incluir lo mínimo necesario para verificar acceso Pro. ArcaWand Soft no procesa números de tarjeta dentro de la extensión."]],
    ["Finalidades", ["Los datos se usan para guardar, mostrar, organizar, buscar, versionar, restaurar, copiar, exportar, sincronizar opcionalmente y aplicar límites o acceso Pro."]],
    ["Compartición y terceros", ["El contenido capturado no se comparte con ArcaWand Soft en el uso local normal.", "Servicios opcionales pueden incluir Google Drive, proveedores de licencia o pago y analítica básica del sitio público."]],
    ["Seguridad y transmisión", ["Los datos locales permanecen en la extensión salvo exportación, copia, Drive u otra acción explícita.", "Las comunicaciones de red necesarias deben usar HTTPS o transporte seguro del navegador/proveedor."]],
    ["Conservación y control", ["Puedes borrar capturas, vaciar papelera, exportar, restaurar, desconectar Drive y desinstalar la extensión.", "Los datos de Google Drive siguen bajo tu cuenta hasta que los elimines allí."]],
    ["Menores y datos sensibles", ["La extensión no está dirigida a niños. Evita guardar secretos muy sensibles sin entender tu seguridad de dispositivo, navegador y backups."]],
    ["Uso internacional", ["Servicios opcionales pueden tratar datos técnicos en países donde operan, según sus propias políticas."]],
    ["Actualizaciones", ["Esta política puede actualizarse por cambios de producto, legales, Chrome Web Store o proveedores."]]
  ],
  it: [
    ["Sviluppatore e contatto", ["Ultimate Clipboard Pro è pubblicata da ArcaWand Soft. Per privacy, supporto o conformità Chrome Web Store, scrivi a contact@arcawand-soft.com."]],
    ["Impegno sui dati utente Chrome Web Store", ["Questa informativa deve corrispondere al comportamento reale dell’estensione e alle dichiarazioni nel Chrome Web Store Developer Dashboard.", "L’estensione usa i permessi solo per funzioni descritte chiaramente e non per raccogliere navigazione non correlata."]],
    ["Dichiarazione Google API Limited Use", ["Se abiliti Google Drive, l’estensione può ricevere informazioni dalle API Google per creare, leggere, aggiornare o ripristinare backup.", "L’uso e il trasferimento delle informazioni ricevute dalle API Google rispetteranno la Chrome Web Store User Data Policy, inclusi i requisiti Limited Use. Questi dati non sono venduti né usati per pubblicità."]],
    ["Categorie di dati", ["Il contenuto può includere testi, codice, immagini, screenshot, note, titoli, categorie e montaggi.", "I metadati possono includere titolo pagina, URL, favicon, date, preferiti, cestino, vault, lingua, tema, colore e preferenze.", "La licenza può includere il minimo necessario per verificare Pro. ArcaWand Soft non tratta numeri di carta nell’estensione."]],
    ["Finalità", ["I dati servono a salvare, mostrare, organizzare, cercare, versionare, ripristinare, copiare, esportare, sincronizzare opzionalmente e applicare limiti o accesso Pro."]],
    ["Condivisione e terzi", ["Il contenuto catturato non è condiviso con ArcaWand Soft nell’uso locale normale.", "Servizi opzionali possono includere Google Drive, provider di licenza o pagamento e analytics di base del sito pubblico."]],
    ["Sicurezza e trasmissione", ["I dati locali restano nell’estensione salvo export, copia, Drive o altra azione esplicita.", "Le comunicazioni di rete necessarie devono usare HTTPS o trasporto sicuro del browser/provider."]],
    ["Conservazione e controllo", ["Puoi eliminare catture, svuotare il cestino, esportare, ripristinare, disconnettere Drive e disinstallare l’estensione.", "I dati su Google Drive restano nel tuo account finché non li elimini."]],
    ["Minori e dati sensibili", ["L’estensione non è rivolta ai bambini. Evita di salvare segreti molto sensibili senza comprendere la sicurezza di dispositivo, browser e backup."]],
    ["Uso internazionale", ["I servizi opzionali possono trattare dati tecnici nei paesi in cui operano, secondo le loro informative."]],
    ["Aggiornamenti", ["Questa informativa può essere aggiornata per modifiche di prodotto, legali, Chrome Web Store o provider."]]
  ],
  de: [
    ["Entwickler und Kontakt", ["Ultimate Clipboard Pro wird von ArcaWand Soft veröffentlicht. Für Datenschutz, Support oder Chrome-Web-Store-Compliance: contact@arcawand-soft.com."]],
    ["Chrome Web Store Nutzerdaten-Verpflichtung", ["Diese Richtlinie soll dem tatsächlichen Verhalten der Erweiterung und den Angaben im Chrome Web Store Developer Dashboard entsprechen.", "Die Erweiterung nutzt Berechtigungen nur für klar beschriebene Funktionen und nicht zur Erfassung nicht relevanter Browserdaten."]],
    ["Google API Limited Use Erklärung", ["Wenn Google Drive aktiviert wird, kann die Erweiterung Informationen aus Google APIs erhalten, um Backups zu erstellen, zu lesen, zu aktualisieren oder wiederherzustellen.", "Die Nutzung und Weitergabe von Informationen aus Google APIs entspricht der Chrome Web Store User Data Policy einschließlich der Limited Use Anforderungen. Diese Daten werden nicht verkauft und nicht für Werbung genutzt."]],
    ["Datenkategorien", ["Inhalte können Texte, Code, Bilder, Screenshots, Notizen, Titel, Kategorien und Montagen umfassen.", "Metadaten können Seitentitel, URL, Favicon, Daten, Favoriten, Papierkorb, Vault, Sprache, Theme, Akzentfarbe und Einstellungen umfassen.", "Lizenzdaten umfassen nur das zur Prüfung von Pro erforderliche Minimum. ArcaWand Soft verarbeitet keine Kartennummern in der Erweiterung."]],
    ["Zwecke", ["Daten werden genutzt, um Captures zu speichern, anzuzeigen, zu organisieren, zu suchen, zu versionieren, wiederherzustellen, zu kopieren, zu exportieren, optional zu synchronisieren und Pro-Limits oder Zugriff anzuwenden."]],
    ["Weitergabe und Drittanbieter", ["Erfasste Inhalte werden bei normaler lokaler Nutzung nicht mit ArcaWand Soft geteilt.", "Optionale Dienste können Google Drive, Lizenz- oder Zahlungsanbieter und einfache Website-Analytics umfassen."]],
    ["Sicherheit und Übertragung", ["Lokale Daten bleiben in der Erweiterung, außer bei Export, Kopie, Drive-Sync oder anderer ausdrücklicher Aktion.", "Erforderliche Netzwerkkommunikation sollte HTTPS oder sicheren Transport des Browsers/Anbieters nutzen."]],
    ["Aufbewahrung und Kontrolle", ["Nutzer können Captures löschen, den Papierkorb leeren, exportieren, wiederherstellen, Drive trennen und die Erweiterung deinstallieren.", "Google-Drive-Daten bleiben im Nutzerkonto, bis sie dort gelöscht werden."]],
    ["Kinder und sensible Inhalte", ["Die Erweiterung richtet sich nicht an Kinder. Speichern Sie keine hochsensiblen Geheimnisse, ohne Ihr Geräte-, Browser- und Backup-Sicherheitsmodell zu verstehen."]],
    ["Internationale Nutzung", ["Optionale Anbieter können technische Daten in Ländern verarbeiten, in denen sie tätig sind, gemäß ihren eigenen Richtlinien."]],
    ["Aktualisierungen", ["Diese Richtlinie kann wegen Produkt-, Rechts-, Chrome-Web-Store- oder Anbieteränderungen aktualisiert werden."]]
  ]
};

for (const [lang, additions] of Object.entries(enhancedFaq)) {
  langs[lang].faqItems = [...additions, ...langs[lang].faqItems];
}

for (const [lang, additions] of Object.entries(enhancedPrivacySections)) {
  const existing = langs[lang].privacySections;
  langs[lang].privacySections = [existing[0], ...additions, ...existing.slice(1)];
}

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
function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
function structuredData(lang, page, title, desc, canonical) {
  const l = langs[lang];
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ArcaWand Soft",
          item: `https://arcawand-soft.com${l.home}`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Ultimate Clipboard Pro",
          item: absProduct(lang, "presentation")
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page === "faq" ? l.faq : l.privacy,
          item: canonical
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": page === "privacy" ? "PrivacyPolicy" : "WebPage",
      name: title,
      headline: title,
      description: desc,
      url: canonical,
      inLanguage: l.html,
      isPartOf: {
        "@type": "WebSite",
        name: "ArcaWand Soft",
        url: "https://arcawand-soft.com/"
      },
      publisher: {
        "@type": "Organization",
        name: "ArcaWand Soft",
        url: "https://arcawand-soft.com/",
        email: "contact@arcawand-soft.com",
        logo: {
          "@type": "ImageObject",
          url: "https://arcawand-soft.com/assets/Arcawand_Soft_Logo.webp"
        }
      },
      about: {
        "@type": "SoftwareApplication",
        name: "Ultimate Clipboard Pro",
        applicationCategory: "BrowserApplication",
        operatingSystem: "Chrome"
      }
    }
  ];
  if (page === "faq") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: l.faqItems.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer
        }
      }))
    });
  }
  return graph.map((entry) => `<script type="application/ld+json">${jsonLd(entry)}</script>`).join("\n");
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
${structuredData(lang, page, title, desc, canonical)}
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
