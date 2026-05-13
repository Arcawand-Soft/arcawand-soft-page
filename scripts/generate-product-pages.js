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

const termsContent = {
  en: {
    terms: "Terms of use",
    termsTitle: "Ultimate Clipboard Pro Terms of Use",
    termsDesc: "Terms of Use for Ultimate Clipboard Pro, covering the Chrome extension, Pro lifetime license, launch pricing, backups, Google Drive sync, acceptable use and user responsibilities.",
    termsKicker: "Product terms",
    termsLead: "These Terms explain how Ultimate Clipboard Pro may be used, what the Pro lifetime license includes, what remains the user's responsibility, and how ArcaWand Soft limits misuse and risk.",
    termsSections: [
      ["Acceptance of these Terms", ["By installing, accessing or using Ultimate Clipboard Pro, you agree to these Terms of Use and to the product Privacy Policy. If you do not agree, do not install or use the extension.", "These Terms apply to the Chrome extension, the public product pages, documentation, Pro licensing workflows and related support communications."]],
      ["Publisher and contact", ["Ultimate Clipboard Pro is published by ArcaWand Soft. Product, legal, support and privacy questions can be sent to contact@arcawand-soft.com."]],
      ["Product purpose", ["Ultimate Clipboard Pro is a productivity extension for capturing, organizing, searching, editing and reusing text, code, images, screenshots and web page captures while browsing.", "The extension is not a legal, medical, financial, compliance or security auditing tool. Users remain responsible for how they use captured content."]],
      ["Free version", ["The free version may include limits such as a maximum number of stored text, code or image captures and access to a limited set of tools.", "Free features may evolve over time to improve the product, maintain service quality or align with Chrome Web Store requirements."]],
      ["Pro lifetime license", ["A Pro lifetime license unlocks Pro features for the supported product version and licensing system, subject to these Terms and normal technical compatibility.", "Pro may include unlimited text, code and image captures, vault access, trash access, capture versioning, montage workflows, additional tools, Google Drive sync and other advanced features described on the product page.", "Lifetime means the lifetime of the Ultimate Clipboard Pro product as operated by ArcaWand Soft, not the lifetime of the user, a browser, an operating system, a third-party service or a store platform."]],
      ["Price and launch offer", ["The standard Pro lifetime license price is USD 69.", "A launch price of USD 49 may be offered for an undefined promotional period. ArcaWand Soft may end, change or replace the launch price at any time without retroactive price changes for completed purchases.", "Taxes, currency conversion, payment fees or regional charges may be handled by the payment provider."]],
      ["Payments, activation and refunds", ["Payments may be processed by third-party providers such as Dodo Payments or another provider selected by ArcaWand Soft. Payment card data is handled by the payment provider, not inside the extension.", "License activation may require a valid license key or account-related verification. Sharing, reselling, publishing, bypassing or attempting to forge a Pro license is prohibited.", "Refund eligibility, where available, may depend on the payment provider, applicable law and the circumstances of the purchase."]],
      ["User content and responsibility", ["Users are responsible for the legality, accuracy, sensitivity and security of the content they capture, store, copy, export or synchronize.", "Do not use the extension to capture, store or distribute content you are not allowed to handle, including unlawful, infringing, harmful or confidential third-party material."]],
      ["Local storage, backups and data loss", ["Ultimate Clipboard Pro is designed as a local-first extension, but local browser storage can be affected by browser resets, extension removal, profile corruption, operating system issues or user actions.", "Users should create backups when content matters. ArcaWand Soft is not responsible for loss of local captures, deleted items, failed imports, damaged backups or data removed from Google Drive by the user or a third-party service."]],
      ["Optional Google Drive synchronization", ["Google Drive sync is optional. If enabled, the user authorizes the extension to create, update, read or restore backup files required for the synchronization feature.", "The user remains responsible for their Google account, Drive storage, permissions, network availability and any manual deletion or modification of synced files."]],
      ["Acceptable use", ["Users must not reverse engineer license checks, attack the extension, abuse APIs, interfere with synchronization, distribute modified versions, use the product to violate rights or laws, or attempt to access data belonging to other users.", "Automated abuse, scraping of product services, license sharing and attempts to bypass Pro restrictions are prohibited."]],
      ["Availability and changes", ["ArcaWand Soft may update, improve, remove, rename or reorganize features to improve quality, performance, security, compatibility or compliance.", "The extension depends on Chrome, browser APIs, Google services, payment providers and other third-party environments that may change independently."]],
      ["Intellectual property", ["Ultimate Clipboard Pro, ArcaWand Soft, product names, logos, interface design, copy, assets and original product materials are owned by ArcaWand Soft or its licensors.", "Using the extension does not transfer ownership of the product, brand or source materials to the user."]],
      ["Disclaimer", ["The product is provided as a productivity tool on an as-is and as-available basis, to the maximum extent permitted by law.", "ArcaWand Soft does not guarantee uninterrupted operation, perfect capture accuracy, compatibility with every website, permanent availability of third-party services or recovery of deleted data."]],
      ["Limitation of liability", ["To the maximum extent permitted by law, ArcaWand Soft is not liable for indirect, incidental, special, consequential or punitive damages, loss of profits, loss of data, loss of business, loss of opportunity or third-party service failures arising from use of the product."]],
      ["Termination", ["ArcaWand Soft may suspend or revoke access to Pro features if a license is fraudulent, refunded, shared publicly, obtained through abuse or used in violation of these Terms.", "Users may stop using the extension at any time and uninstall it from Chrome."]],
      ["Changes to these Terms", ["These Terms may be updated to reflect product, legal, pricing, payment, Chrome Web Store or third-party service changes. The date shown on this page indicates the latest published update."]],
      ["Governing interpretation", ["If a translated version differs from the English version, the English version should be used as the reference interpretation unless applicable law requires otherwise."]]
    ]
  },
  fr: {
    terms: "CGU",
    termsTitle: "Conditions générales d’utilisation Ultimate Clipboard Pro",
    termsDesc: "CGU de Ultimate Clipboard Pro : extension Chrome, licence Pro lifetime, prix de lancement, sauvegardes, synchronisation Google Drive, usages autorisés et responsabilités utilisateur.",
    termsKicker: "Conditions produit",
    termsLead: "Ces conditions expliquent comment utiliser Ultimate Clipboard Pro, ce que comprend la licence Pro lifetime, ce qui reste sous la responsabilité de l’utilisateur et comment ArcaWand Soft encadre les risques et abus.",
    termsSections: [
      ["Acceptation des conditions", ["En installant, accédant à ou utilisant Ultimate Clipboard Pro, vous acceptez ces Conditions générales d’utilisation ainsi que la Politique de confidentialité du produit. Si vous n’acceptez pas ces conditions, n’installez pas et n’utilisez pas l’extension.", "Ces conditions couvrent l’extension Chrome, les pages produit publiques, la documentation, les workflows de licence Pro et les échanges de support associés."]],
      ["Éditeur et contact", ["Ultimate Clipboard Pro est publié par ArcaWand Soft. Pour toute question produit, juridique, support ou confidentialité, contactez contact@arcawand-soft.com."]],
      ["Objet du produit", ["Ultimate Clipboard Pro est une extension de productivité destinée à capturer, organiser, rechercher, éditer et réutiliser textes, codes, images, captures d’écran et captures de pages web pendant la navigation.", "L’extension n’est pas un outil juridique, médical, financier, de conformité ou d’audit de sécurité. L’utilisateur reste responsable de l’usage des contenus capturés."]],
      ["Version gratuite", ["La version gratuite peut comporter des limites, par exemple un nombre maximal de captures texte, code ou image stockées, ainsi qu’un accès limité à certains outils.", "Les fonctions gratuites peuvent évoluer afin d’améliorer le produit, maintenir la qualité du service ou respecter les exigences du Chrome Web Store."]],
      ["Licence Pro lifetime", ["Une licence Pro lifetime débloque les fonctions Pro pour la version du produit et le système de licence supportés, sous réserve du respect de ces conditions et de la compatibilité technique normale.", "Pro peut inclure captures texte, code et image illimitées, coffre-fort, corbeille, versioning des captures, montage, outils supplémentaires, synchronisation Google Drive et autres fonctions avancées décrites sur la page produit.", "Lifetime désigne la durée de vie du produit Ultimate Clipboard Pro tel qu’exploité par ArcaWand Soft, et non la durée de vie de l’utilisateur, d’un navigateur, d’un système d’exploitation, d’un service tiers ou d’une plateforme de store."]],
      ["Prix et offre de lancement", ["Le prix standard de la licence Pro lifetime est de 69 USD.", "Un prix de lancement de 49 USD peut être proposé pendant une durée promotionnelle non définie. ArcaWand Soft peut mettre fin, modifier ou remplacer ce prix de lancement à tout moment, sans effet rétroactif sur les achats déjà finalisés.", "Les taxes, conversions de devise, frais de paiement ou frais régionaux peuvent être gérés par le prestataire de paiement."]],
      ["Paiements, activation et remboursements", ["Les paiements peuvent être traités par des prestataires tiers tels que Dodo Payments ou tout autre prestataire choisi par ArcaWand Soft. Les données de carte bancaire sont traitées par le prestataire de paiement, pas dans l’extension.", "L’activation de la licence peut nécessiter une clé valide ou une vérification liée au compte. Le partage, la revente, la publication, le contournement ou la falsification d’une licence Pro sont interdits.", "Les remboursements éventuels dépendent du prestataire de paiement, de la loi applicable et des circonstances de l’achat."]],
      ["Contenu utilisateur et responsabilité", ["L’utilisateur est responsable de la légalité, exactitude, sensibilité et sécurité des contenus qu’il capture, stocke, copie, exporte ou synchronise.", "N’utilisez pas l’extension pour capturer, stocker ou diffuser des contenus que vous n’êtes pas autorisé à traiter, notamment des contenus illicites, contrefaisants, nuisibles ou confidentiels appartenant à des tiers."]],
      ["Stockage local, sauvegardes et perte de données", ["Ultimate Clipboard Pro est conçu comme une extension local-first, mais le stockage local du navigateur peut être affecté par une réinitialisation, une désinstallation, une corruption de profil, un problème système ou une action utilisateur.", "L’utilisateur doit créer des sauvegardes lorsque ses contenus sont importants. ArcaWand Soft n’est pas responsable de la perte de captures locales, d’éléments supprimés, d’imports échoués, de sauvegardes endommagées ou de données supprimées de Google Drive par l’utilisateur ou un service tiers."]],
      ["Synchronisation Google Drive optionnelle", ["La synchronisation Google Drive est optionnelle. Si elle est activée, l’utilisateur autorise l’extension à créer, mettre à jour, lire ou restaurer les fichiers nécessaires à la sauvegarde synchronisée.", "L’utilisateur reste responsable de son compte Google, de son stockage Drive, de ses permissions, de sa connexion réseau et de toute suppression ou modification manuelle des fichiers synchronisés."]],
      ["Usages autorisés", ["Il est interdit de contourner la licence, attaquer l’extension, abuser des APIs, perturber la synchronisation, distribuer des versions modifiées, utiliser le produit pour violer des droits ou lois, ou tenter d’accéder aux données d’autres utilisateurs.", "L’abus automatisé, le partage de licence, le scraping des services produit et le contournement des restrictions Pro sont interdits."]],
      ["Disponibilité et évolutions", ["ArcaWand Soft peut mettre à jour, améliorer, supprimer, renommer ou réorganiser des fonctions pour améliorer la qualité, la performance, la sécurité, la compatibilité ou la conformité.", "L’extension dépend de Chrome, des APIs navigateur, de Google, de prestataires de paiement et d’environnements tiers susceptibles d’évoluer indépendamment."]],
      ["Propriété intellectuelle", ["Ultimate Clipboard Pro, ArcaWand Soft, les noms, logos, interfaces, textes, assets et éléments originaux du produit appartiennent à ArcaWand Soft ou à ses concédants.", "L’utilisation de l’extension ne transfère aucun droit de propriété sur le produit, la marque ou les éléments sources."]],
      ["Exclusion de garanties", ["Le produit est fourni comme outil de productivité, en l’état et selon disponibilité, dans la mesure permise par la loi.", "ArcaWand Soft ne garantit pas un fonctionnement ininterrompu, une capture parfaite, une compatibilité avec tous les sites, la disponibilité permanente de services tiers ou la récupération de données supprimées."]],
      ["Limitation de responsabilité", ["Dans la mesure permise par la loi, ArcaWand Soft n’est pas responsable des dommages indirects, incidents, spéciaux, consécutifs ou punitifs, pertes de profits, pertes de données, pertes d’activité, pertes d’opportunités ou défaillances de services tiers liées à l’usage du produit."]],
      ["Résiliation", ["ArcaWand Soft peut suspendre ou révoquer l’accès Pro si une licence est frauduleuse, remboursée, partagée publiquement, obtenue par abus ou utilisée en violation de ces conditions.", "L’utilisateur peut cesser d’utiliser l’extension à tout moment et la désinstaller de Chrome."]],
      ["Modification des conditions", ["Ces conditions peuvent être mises à jour pour refléter les évolutions produit, juridiques, tarifaires, de paiement, Chrome Web Store ou de services tiers. La date affichée indique la dernière mise à jour publiée."]],
      ["Interprétation", ["En cas d’écart entre une traduction et la version anglaise, la version anglaise sert de référence d’interprétation, sauf exigence contraire de la loi applicable."]]
    ]
  }
};

termsContent.es = {
  terms: "Términos de uso",
  termsTitle: "Términos de uso de Ultimate Clipboard Pro",
  termsDesc: "Términos de uso de Ultimate Clipboard Pro: extensión Chrome, licencia Pro lifetime, precio de lanzamiento, copias de seguridad, Google Drive, uso aceptable y responsabilidades.",
  termsKicker: "Términos del producto",
  termsLead: "Estos términos explican cómo usar Ultimate Clipboard Pro, qué incluye la licencia Pro lifetime, qué sigue siendo responsabilidad del usuario y cómo ArcaWand Soft limita abusos y riesgos.",
  termsSections: [
    ["Aceptación", ["Al instalar, acceder o usar Ultimate Clipboard Pro, aceptas estos Términos de uso y la Política de privacidad. Si no estás de acuerdo, no instales ni uses la extensión.", "Estos términos se aplican a la extensión Chrome, páginas del producto, documentación, licencia Pro y comunicaciones de soporte."]],
    ["Editor y contacto", ["Ultimate Clipboard Pro es publicado por ArcaWand Soft. Para cuestiones de producto, legales, soporte o privacidad, escribe a contact@arcawand-soft.com."]],
    ["Finalidad del producto", ["Ultimate Clipboard Pro es una extensión de productividad para capturar, organizar, buscar, editar y reutilizar textos, código, imágenes, capturas y páginas web durante la navegación.", "No es una herramienta legal, médica, financiera, de cumplimiento ni de auditoría de seguridad. El usuario es responsable del uso de sus capturas."]],
    ["Versión gratuita", ["La versión gratuita puede incluir límites de capturas y acceso limitado a herramientas.", "Las funciones gratuitas pueden cambiar para mejorar calidad, seguridad, compatibilidad o cumplimiento con Chrome Web Store."]],
    ["Licencia Pro lifetime", ["La licencia Pro lifetime desbloquea funciones Pro para el producto y sistema de licencia soportados, sujeto a estos términos y compatibilidad técnica.", "Pro puede incluir capturas ilimitadas, bóveda, papelera, versionado, montaje, herramientas adicionales, Google Drive opcional y otras funciones avanzadas.", "Lifetime significa la vida del producto Ultimate Clipboard Pro operado por ArcaWand Soft, no la vida del usuario, navegador, sistema operativo, servicio tercero o tienda."]],
    ["Precio y oferta de lanzamiento", ["El precio estándar de la licencia Pro lifetime es de 69 USD.", "Puede ofrecerse un precio de lanzamiento de 49 USD durante un periodo promocional indefinido. ArcaWand Soft puede cambiar o finalizar esta oferta sin afectar compras ya completadas.", "Impuestos, conversión de divisa o cargos regionales pueden ser gestionados por el proveedor de pago."]],
    ["Pagos, activación y reembolsos", ["Los pagos pueden ser procesados por terceros como Dodo Payments. Los datos de tarjeta son tratados por el proveedor de pago, no dentro de la extensión.", "Compartir, revender, publicar, falsificar o evitar una licencia Pro está prohibido.", "Los reembolsos dependen del proveedor, la ley aplicable y las circunstancias de compra."]],
    ["Contenido y responsabilidad", ["El usuario es responsable de la legalidad, precisión, sensibilidad y seguridad del contenido que captura, almacena, copia, exporta o sincroniza.", "No uses la extensión para tratar contenido ilegal, infractor, dañino o confidencial de terceros sin autorización."]],
    ["Almacenamiento, copias y pérdida de datos", ["Aunque el producto es local-first, el almacenamiento del navegador puede verse afectado por reinicios, desinstalación, corrupción de perfil, problemas del sistema o acciones del usuario.", "El usuario debe hacer copias de seguridad importantes. ArcaWand Soft no responde por pérdidas de datos locales, eliminaciones, importaciones fallidas, backups dañados o archivos borrados de Google Drive."]],
    ["Google Drive opcional", ["Si se activa, el usuario autoriza a la extensión a crear, leer, actualizar o restaurar archivos de backup necesarios.", "El usuario sigue siendo responsable de su cuenta Google, almacenamiento, permisos, red y modificaciones manuales."]],
    ["Uso aceptable", ["Está prohibido atacar la extensión, abusar de APIs, alterar sincronización, distribuir versiones modificadas, violar leyes o derechos, acceder a datos ajenos o evitar restricciones Pro."]],
    ["Cambios y disponibilidad", ["ArcaWand Soft puede actualizar, mejorar, eliminar o reorganizar funciones por calidad, seguridad, compatibilidad o cumplimiento.", "La extensión depende de Chrome, APIs, Google, pagos y servicios terceros que pueden cambiar independientemente."]],
    ["Propiedad intelectual", ["Ultimate Clipboard Pro, ArcaWand Soft, nombres, logos, diseño, textos, assets y materiales originales pertenecen a ArcaWand Soft o sus licenciantes."]],
    ["Exención y límite de responsabilidad", ["El producto se ofrece como herramienta de productividad tal cual y según disponibilidad.", "En la medida permitida por la ley, ArcaWand Soft no será responsable por daños indirectos, pérdida de datos, beneficios, negocio, oportunidad o fallos de servicios terceros."]],
    ["Terminación", ["ArcaWand Soft puede suspender o revocar Pro si la licencia es fraudulenta, reembolsada, compartida públicamente, abusiva o contraria a estos términos.", "El usuario puede dejar de usar y desinstalar la extensión en cualquier momento."]],
    ["Actualizaciones e interpretación", ["Estos términos pueden actualizarse por cambios de producto, legales, precio, pagos, Chrome Web Store o terceros.", "Si una traducción difiere del inglés, la versión inglesa sirve como referencia salvo obligación legal contraria."]]
  ]
};

termsContent.it = {
  terms: "Termini d’uso",
  termsTitle: "Termini d’uso di Ultimate Clipboard Pro",
  termsDesc: "Termini d’uso di Ultimate Clipboard Pro: estensione Chrome, licenza Pro lifetime, prezzo di lancio, backup, Google Drive, uso accettabile e responsabilità.",
  termsKicker: "Termini prodotto",
  termsLead: "Questi termini spiegano come usare Ultimate Clipboard Pro, cosa include la licenza Pro lifetime, cosa resta responsabilità dell’utente e come ArcaWand Soft limita abusi e rischi.",
  termsSections: [
    ["Accettazione", ["Installando, accedendo o usando Ultimate Clipboard Pro, accetti questi Termini d’uso e l’Informativa privacy. Se non accetti, non installare né usare l’estensione.", "I termini si applicano a estensione Chrome, pagine prodotto, documentazione, licenza Pro e supporto."]],
    ["Editore e contatto", ["Ultimate Clipboard Pro è pubblicata da ArcaWand Soft. Per prodotto, aspetti legali, supporto o privacy: contact@arcawand-soft.com."]],
    ["Scopo del prodotto", ["Ultimate Clipboard Pro è un’estensione di produttività per catturare, organizzare, cercare, modificare e riutilizzare testi, codice, immagini, screenshot e pagine web.", "Non è uno strumento legale, medico, finanziario, di compliance o audit di sicurezza. L’utente resta responsabile dei contenuti."]],
    ["Versione gratuita", ["La versione gratuita può includere limiti di catture e accesso ridotto agli strumenti.", "Le funzioni gratuite possono evolvere per qualità, sicurezza, compatibilità o requisiti Chrome Web Store."]],
    ["Licenza Pro lifetime", ["La licenza Pro lifetime sblocca funzioni Pro per il prodotto e il sistema licenza supportati, secondo questi termini e compatibilità tecnica.", "Pro può includere catture illimitate, vault, cestino, versioning, montaggio, strumenti extra, Google Drive opzionale e altre funzioni avanzate.", "Lifetime indica la vita del prodotto Ultimate Clipboard Pro gestito da ArcaWand Soft, non la vita dell’utente, browser, sistema operativo, servizio terzo o store."]],
    ["Prezzo e offerta di lancio", ["Il prezzo standard della licenza Pro lifetime è 69 USD.", "Un prezzo di lancio di 49 USD può essere offerto per un periodo promozionale non definito. ArcaWand Soft può cambiarlo o terminarlo senza effetto retroattivo sugli acquisti completati.", "Tasse, conversioni o costi regionali possono essere gestiti dal provider di pagamento."]],
    ["Pagamenti, attivazione e rimborsi", ["I pagamenti possono essere gestiti da terzi come Dodo Payments. I dati carta sono trattati dal provider, non nell’estensione.", "Condividere, rivendere, pubblicare, falsificare o aggirare una licenza Pro è vietato.", "Eventuali rimborsi dipendono da provider, legge applicabile e circostanze."]],
    ["Contenuti e responsabilità", ["L’utente è responsabile di legalità, accuratezza, sensibilità e sicurezza dei contenuti catturati, salvati, copiati, esportati o sincronizzati.", "Non usare l’estensione per contenuti illegali, lesivi, dannosi o riservati di terzi senza autorizzazione."]],
    ["Storage, backup e perdita dati", ["Il prodotto è local-first, ma lo storage browser può essere alterato da reset, disinstallazione, profilo corrotto, problemi sistema o azioni utente.", "L’utente deve creare backup importanti. ArcaWand Soft non risponde di perdite locali, cancellazioni, import falliti, backup danneggiati o file cancellati da Drive."]],
    ["Google Drive opzionale", ["Se abilitato, l’utente autorizza l’estensione a creare, leggere, aggiornare o ripristinare file backup necessari.", "L’utente resta responsabile di account Google, spazio Drive, permessi, rete e modifiche manuali."]],
    ["Uso accettabile", ["È vietato attaccare l’estensione, abusare API, alterare sync, distribuire versioni modificate, violare leggi o diritti, accedere a dati altrui o aggirare Pro."]],
    ["Disponibilità e modifiche", ["ArcaWand Soft può aggiornare, migliorare, rimuovere o riorganizzare funzioni per qualità, sicurezza, compatibilità o compliance.", "L’estensione dipende da Chrome, API, Google, pagamenti e servizi terzi che possono cambiare indipendentemente."]],
    ["Proprietà intellettuale", ["Ultimate Clipboard Pro, ArcaWand Soft, nomi, loghi, design, testi, asset e materiali originali appartengono ad ArcaWand Soft o licenzianti."]],
    ["Esclusione e limite di responsabilità", ["Il prodotto è fornito come strumento di produttività così com’è e secondo disponibilità.", "Nei limiti di legge, ArcaWand Soft non risponde di danni indiretti, perdita dati, profitti, attività, opportunità o guasti di servizi terzi."]],
    ["Terminazione", ["ArcaWand Soft può sospendere o revocare Pro se una licenza è fraudolenta, rimborsata, condivisa pubblicamente, abusiva o contraria ai termini.", "L’utente può smettere di usare e disinstallare l’estensione in qualsiasi momento."]],
    ["Aggiornamenti e interpretazione", ["I termini possono cambiare per motivi di prodotto, legali, prezzo, pagamenti, Chrome Web Store o terzi.", "Se una traduzione differisce dall’inglese, la versione inglese è riferimento salvo obbligo legale contrario."]]
  ]
};

termsContent.de = {
  terms: "Nutzungsbedingungen",
  termsTitle: "Nutzungsbedingungen für Ultimate Clipboard Pro",
  termsDesc: "Nutzungsbedingungen für Ultimate Clipboard Pro: Chrome-Erweiterung, Pro-Lifetime-Lizenz, Einführungspreis, Backups, Google Drive, zulässige Nutzung und Verantwortung.",
  termsKicker: "Produktbedingungen",
  termsLead: "Diese Bedingungen erklären die Nutzung von Ultimate Clipboard Pro, den Umfang der Pro-Lifetime-Lizenz, die Verantwortung der Nutzer und wie ArcaWand Soft Missbrauch und Risiken begrenzt.",
  termsSections: [
    ["Annahme", ["Durch Installation, Zugriff oder Nutzung von Ultimate Clipboard Pro akzeptieren Sie diese Nutzungsbedingungen und die Datenschutzrichtlinie. Wenn Sie nicht zustimmen, installieren oder nutzen Sie die Erweiterung nicht.", "Die Bedingungen gelten für Chrome-Erweiterung, Produktseiten, Dokumentation, Pro-Lizenzierung und Support-Kommunikation."]],
    ["Herausgeber und Kontakt", ["Ultimate Clipboard Pro wird von ArcaWand Soft veröffentlicht. Für Produkt-, Rechts-, Support- oder Datenschutzfragen: contact@arcawand-soft.com."]],
    ["Produktzweck", ["Ultimate Clipboard Pro ist eine Produktivitätserweiterung zum Erfassen, Organisieren, Suchen, Bearbeiten und Wiederverwenden von Texten, Code, Bildern, Screenshots und Webseiten.", "Es ist kein Rechts-, Medizin-, Finanz-, Compliance- oder Sicherheitsaudit-Tool. Nutzer bleiben für ihre Inhalte verantwortlich."]],
    ["Kostenlose Version", ["Die kostenlose Version kann Capture-Limits und eingeschränkten Tool-Zugriff enthalten.", "Kostenlose Funktionen können sich aus Qualitäts-, Sicherheits-, Kompatibilitäts- oder Chrome-Web-Store-Gründen ändern."]],
    ["Pro-Lifetime-Lizenz", ["Eine Pro-Lifetime-Lizenz schaltet Pro-Funktionen für das unterstützte Produkt und Lizenzsystem frei, vorbehaltlich dieser Bedingungen und normaler technischer Kompatibilität.", "Pro kann unbegrenzte Captures, Vault, Papierkorb, Versionierung, Montage, zusätzliche Tools, optionalen Google-Drive-Sync und weitere Funktionen enthalten.", "Lifetime bedeutet die Lebensdauer des Produkts Ultimate Clipboard Pro, wie es von ArcaWand Soft betrieben wird, nicht die Lebensdauer des Nutzers, Browsers, Betriebssystems, Drittanbieterdienstes oder Stores."]],
    ["Preis und Einführungsangebot", ["Der Standardpreis der Pro-Lifetime-Lizenz beträgt 69 USD.", "Ein Einführungspreis von 49 USD kann für einen nicht definierten Aktionszeitraum angeboten werden. ArcaWand Soft kann diesen Preis jederzeit ändern oder beenden, ohne abgeschlossene Käufe rückwirkend zu ändern.", "Steuern, Währungsumrechnung oder regionale Gebühren können vom Zahlungsanbieter verarbeitet werden."]],
    ["Zahlungen, Aktivierung und Erstattungen", ["Zahlungen können durch Drittanbieter wie Dodo Payments verarbeitet werden. Kartendaten werden vom Zahlungsanbieter verarbeitet, nicht in der Erweiterung.", "Teilen, Weiterverkaufen, Veröffentlichen, Fälschen oder Umgehen einer Pro-Lizenz ist verboten.", "Erstattungen hängen von Anbieter, geltendem Recht und Umständen ab."]],
    ["Inhalte und Verantwortung", ["Nutzer sind für Rechtmäßigkeit, Richtigkeit, Sensibilität und Sicherheit der Inhalte verantwortlich, die sie erfassen, speichern, kopieren, exportieren oder synchronisieren.", "Nutzen Sie die Erweiterung nicht für illegale, rechtsverletzende, schädliche oder vertrauliche Drittinhalte ohne Berechtigung."]],
    ["Speicher, Backups und Datenverlust", ["Das Produkt ist local-first, aber Browserspeicher kann durch Reset, Deinstallation, Profilfehler, Systemprobleme oder Nutzeraktionen betroffen sein.", "Nutzer sollten wichtige Backups erstellen. ArcaWand Soft haftet nicht für lokale Datenverluste, Löschungen, fehlgeschlagene Importe, beschädigte Backups oder aus Drive entfernte Dateien."]],
    ["Optionaler Google Drive Sync", ["Wenn aktiviert, autorisiert der Nutzer die Erweiterung, notwendige Backup-Dateien zu erstellen, lesen, aktualisieren oder wiederherstellen.", "Der Nutzer bleibt verantwortlich für Google-Konto, Drive-Speicher, Berechtigungen, Netzwerk und manuelle Änderungen."]],
    ["Zulässige Nutzung", ["Angriffe auf die Erweiterung, API-Missbrauch, Sync-Störungen, modifizierte Distributionen, Rechtsverletzungen, Zugriff auf fremde Daten oder Umgehung von Pro sind verboten."]],
    ["Verfügbarkeit und Änderungen", ["ArcaWand Soft kann Funktionen für Qualität, Sicherheit, Kompatibilität oder Compliance aktualisieren, verbessern, entfernen oder neu organisieren.", "Die Erweiterung hängt von Chrome, APIs, Google, Zahlungen und Drittanbietern ab, die sich unabhängig ändern können."]],
    ["Geistiges Eigentum", ["Ultimate Clipboard Pro, ArcaWand Soft, Namen, Logos, Design, Texte, Assets und Originalmaterialien gehören ArcaWand Soft oder Lizenzgebern."]],
    ["Haftungsausschluss und Begrenzung", ["Das Produkt wird als Produktivitätstool wie besehen und nach Verfügbarkeit bereitgestellt.", "Soweit gesetzlich zulässig haftet ArcaWand Soft nicht für indirekte Schäden, Datenverlust, Gewinnverlust, Geschäftsverlust, Chancenverlust oder Ausfälle von Drittanbietern."]],
    ["Beendigung", ["ArcaWand Soft kann Pro sperren oder widerrufen, wenn eine Lizenz betrügerisch, erstattet, öffentlich geteilt, missbräuchlich oder vertragswidrig ist.", "Nutzer können die Erweiterung jederzeit nicht mehr verwenden und deinstallieren."]],
    ["Aktualisierungen und Auslegung", ["Diese Bedingungen können sich wegen Produkt-, Rechts-, Preis-, Zahlungs-, Chrome-Web-Store- oder Drittanbieteränderungen ändern.", "Wenn eine Übersetzung von Englisch abweicht, gilt Englisch als Auslegungsreferenz, soweit kein zwingendes Recht anderes verlangt."]]
  ]
};

for (const [lang, content] of Object.entries(termsContent)) {
  Object.assign(langs[lang], content);
}

const languageButtonLabels = {
  en: "Change language",
  fr: "Changer de langue",
  es: "Cambiar idioma",
  it: "Cambia lingua",
  de: "Sprache wechseln"
};

for (const [lang, label] of Object.entries(languageButtonLabels)) {
  langs[lang].languageButtonLabel = label;
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
          name: page === "faq" ? l.faq : page === "terms" ? l.terms : l.privacy,
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
  if (page === "terms") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "TermsOfService",
      name: title,
      description: desc,
      url: canonical,
      inLanguage: l.html,
      provider: {
        "@type": "Organization",
        name: "ArcaWand Soft",
        url: "https://arcawand-soft.com/"
      }
    });
  }
  return graph.map((entry) => `<script type="application/ld+json">${jsonLd(entry)}</script>`).join("\n");
}
function relFromProductPage(page) {
  return page === "presentation"
    ? { presentation: "./", faq: "faq/", privacy: "privacy/", terms: "terms/" }
    : { presentation: "../", faq: "../faq/", privacy: "../privacy/", terms: "../terms/" };
}
function homeHrefs(depth) {
  const prefix = depth === 0 ? "" : "../".repeat(depth);
  return {
    presentation: `${prefix}ultimate-clipboard-pro/`,
    faq: `${prefix}ultimate-clipboard-pro/faq/`,
    privacy: `${prefix}ultimate-clipboard-pro/privacy/`,
    terms: `${prefix}ultimate-clipboard-pro/terms/`
  };
}
function languageMenu(current) {
  const flag = { en: "english", fr: "french", es: "spanish", it: "italian", de: "german" };
  const name = { en: "English", fr: "Français", es: "Español", it: "Italiano", de: "Deutsch" };
  const options = Object.keys(langs).map((code) => `<button class="language-menu-option" type="button" role="option" data-lang="${code}"${code === current ? ' aria-selected="true"' : ""}><img src="/assets/flags/${flag[code]}.webp" alt="" width="28" height="28" loading="lazy" decoding="async"><span>${name[code]}</span></button>`).join("");
  return `<div class="language-menu arcawand-product-language-menu" data-current-lang="${current}"><button class="language-menu-button" type="button" aria-label="${esc(langs[current].languageButtonLabel)}" aria-haspopup="listbox" aria-expanded="false"><img src="/assets/flags/${flag[current]}.webp" alt="" width="28" height="28" loading="lazy" decoding="async"><span>${name[current]}</span><span class="language-menu-chevron" aria-hidden="true"></span></button><div class="language-menu-panel" role="listbox" aria-label="${esc(langs[current].languageButtonLabel)}">${options}</div></div>`;
}
function productNav(lang, active, rel) {
  const l = langs[lang];
  return `<nav class="ucp-product-nav" aria-label="Ultimate Clipboard Pro"><a href="${rel.presentation}" data-ucp-nav="presentation"${active === "presentation" ? ' aria-current="page"' : ""}>${esc(l.presentation)}</a><a href="${rel.faq}" data-ucp-nav="faq"${active === "faq" ? ' aria-current="page"' : ""}>${esc(l.faq)}</a><a href="${rel.privacy}" data-ucp-nav="privacy"${active === "privacy" ? ' aria-current="page"' : ""}>${esc(l.privacy)}</a><a href="${rel.terms}" data-ucp-nav="terms"${active === "terms" ? ' aria-current="page"' : ""}>${esc(l.terms)}</a></nav>`;
}
function staticProductPage(lang, page) {
  const l = langs[lang];
  const rel = relFromProductPage(page);
  const title = page === "faq" ? l.faqTitle : page === "terms" ? l.termsTitle : l.privacyTitle;
  const desc = page === "faq" ? l.faqDesc : page === "terms" ? l.termsDesc : l.privacyDesc;
  const kicker = page === "faq" ? l.faqKicker : page === "terms" ? l.termsKicker : l.privacyKicker;
  const lead = page === "faq" ? l.faqLead : page === "terms" ? l.termsLead : l.privacyLead;
  const canonical = absProduct(lang, page);
  const main = page === "faq"
    ? `<div class="ucp-faq-list">${l.faqItems.map(([q, a]) => `<article class="ucp-faq-item"><h2>${esc(q)}</h2><p>${esc(a)}</p></article>`).join("\n")}</div>`
    : `<article class="ucp-page-content"><p>${esc(l.updated)}</p>${(page === "terms" ? l.termsSections : l.privacySections).map(([h, ps]) => `<h2>${esc(h)}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("\n")}</article>`;
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
<section class="ucp-page-grid"><div>${main}</div><aside class="ucp-side-card"><h2>${esc(l.sideTitle)}</h2><p>${esc(l.sideText)}</p><nav><a href="${rel.presentation}">${esc(l.presentation)}</a><a href="${rel.faq}">${esc(l.faq)}</a><a href="${rel.privacy}">${esc(l.privacy)}</a><a href="${rel.terms}">${esc(l.terms)}</a></nav></aside></section>
</main>
<footer class="ucp-static-footer"><span>${esc(l.footer)}</span><span><a href="mailto:contact@arcawand-soft.com">contact@arcawand-soft.com</a></span></footer>
</body>
</html>
`;
}
function navDrop(lang, depth) {
  const l = langs[lang];
  const href = homeHrefs(depth);
  return `<div class="nav-drop"><button class="nav-drop-button" type="button" data-i18n="navSofts">${esc(l.navSofts)}</button><div class="nav-drop-menu nav-apps-menu"><div class="nav-app-card"><a class="nav-drop-item nav-app-main" href="${href.presentation}"><strong data-i18n="navUcpTitle">Ultimate Clipboard Pro</strong><span data-i18n="navUcpDesc">${esc(l.desc)}</span></a><div class="nav-app-links"><a href="${href.presentation}">${esc(l.presentation)}</a><a href="${href.faq}">${esc(l.faq)}</a><a href="${href.privacy}">${esc(l.privacy)}</a><a href="${href.terms}">${esc(l.terms)}</a></div></div></div></div>`;
}
function patchSiteNav(file, lang, depth) {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(/<div class="nav-drop">[\s\S]*?<\/div>\s*<\/div>\s*<a class="nav-link"/, `${navDrop(lang, depth)}<a class="nav-link"`);
  content = patchLanguageButtonLabel(content, lang);
  fs.writeFileSync(file, content, "utf8");
}

function patchLanguageButtonLabel(content, lang) {
  const label = esc(langs[lang]?.languageButtonLabel || languageButtonLabels.en);
  return content
    .replace(/<button class="language-menu-button" type="button"(?![^>]*aria-label=)/g, `<button class="language-menu-button" type="button" aria-label="${label}"`)
    .replace(/<div class="language-menu-panel" role="listbox" aria-label="Language"/g, `<div class="language-menu-panel" role="listbox" aria-label="${label}"`);
}

function patchProductIndex(lang) {
  const file = path.join(root, productBase(lang), "index.html");
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("/assets/ucp-product-pages.css")) {
    content = content.replace('<link rel="stylesheet" href="/assets/ucp-email-floating.css">', '<link rel="stylesheet" href="/assets/ucp-email-floating.css">\n<link rel="stylesheet" href="/assets/ucp-product-pages.css">');
  }
  if (!content.includes("/assets/ucp-product-pages.js")) {
    content = content.replace('<script defer src="/assets/analytics.js"></script>', '<script defer src="/assets/analytics.js"></script>\n<script defer src="/assets/ucp-product-pages.js"></script>');
  }
  content = content.replace(/Fran\u00c3\u00a7ais/g, "Français").replace(/Espa\u00c3\u00b1ol/g, "Español");
  content = content.replace(/<nav class="ucp-product-nav"[\s\S]*?<\/nav>\s*/g, "");
  content = content.replace(/(<div id="root"><\/div>)/, `${productNav(lang, "presentation", relFromProductPage("presentation"))}\n  $1`);
  content = patchLanguageButtonLabel(content, lang);
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
    for (const page of ["faq", "privacy", "terms"]) {
      const dir = path.join(root, productBase(lang), page);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), staticProductPage(lang, page), "utf8");
    }
  }
}
function patchSitemap() {
  const file = path.join(root, "sitemap.xml");
  let content = fs.readFileSync(file, "utf8");
  const urls = Object.keys(langs).flatMap((lang) => [absProduct(lang, "faq"), absProduct(lang, "privacy"), absProduct(lang, "terms")]);
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
