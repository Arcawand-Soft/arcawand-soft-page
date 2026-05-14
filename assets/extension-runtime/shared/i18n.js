(function initI18n(global) {
  const LANGUAGE_NAMES = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    it: "Italiano"
  };

  LANGUAGE_NAMES.fr = "Fran\u00E7ais";
  LANGUAGE_NAMES.es = "Espa\u00F1ol";

  const SLUG_LABELS = {
    en: {
      general: "General", favorites: "Favorites", trash: "Trash", ai: "AI", prompts: "Prompts", agents: "AI agents", office: "Office", images: "Images", image: "Image", video: "Video", audio: "Audio",
      word: "Word", excel: "Excel", powerpoint: "PowerPoint", pdf: "PDF", notes: "Notes", google: "Google", workspace: "Workspace", microsoft: "Microsoft", cloud: "Cloud",
      communication: "Communication", productivity: "Productivity", automation: "Automation", development: "Development", wordpress: "WordPress", marketing: "Marketing",
      social: "Social", media: "Media", content: "Content", creation: "Creation", ecommerce: "E-commerce", customer: "Customer", support: "Support", data: "Data", security: "Security",
      finance: "Finance", personal: "Useful", info: "Information", forms: "Forms", hr: "HR", recruitment: "Recruitment", legal: "Legal", education: "Education",
      links: "Shared links", emails: "Emails", email: "Email", replies: "Canned replies", signatures: "Signatures", tasks: "Tasks", calendar: "Calendar", meetings: "Meetings", snippets: "PHP snippets",
      copywriting: "Copywriting", ads: "Ads", emailing: "Emailing", pages: "Landing pages", products: "Products", orders: "Orders", customers: "Customers", refunds: "Refunds",
      tickets: "Tickets", faq: "FAQ", bugs: "Customer bugs", canned: "Prepared replies", analytics: "Analytics", credentials: "Non-sensitive credentials", passwords: "Passwords to ignore",
      tokens: "Tokens / API keys to ignore", privacy: "Privacy", sites: "Excluded sites", invoices: "Invoices", payments: "Payments", quotes: "Quotes", phones: "Phones", addresses: "Addresses",
      identities: "Identity", contact: "Contact", applications: "Applications", repetitive: "Repeated fields", candidates: "Candidates", offers: "Offers", interviews: "Interviews",
      contracts: "Contracts", terms: "Terms", courses: "Courses", tutorials: "Tutorials", research: "Research", videos: "Videos", fonts: "Fonts", portraits: "AI portraits",
      backgrounds: "AI backgrounds", ui: "UI references", headers: "Headers & hero", icons: "Icons", screenshots: "Screenshots", mockups: "Mockups", scans: "Scans", receipts: "Receipts & invoices", article: "Article", articles: "Articles", hook: "Hook", hooks: "Hooks", newsletter: "Newsletter", newsletters: "Newsletters", sheet: "Sheet", sheets: "Sheets", slide: "Slide", slides: "Slides", drive: "Drive", meet: "Meet", outlook: "Outlook", teams: "Teams", onedrive: "OneDrive", copilot: "Copilot", dropbox: "Dropbox", icloud: "iCloud", mega: "MEGA", slack: "Slack", discord: "Discord", whatsapp: "WhatsApp", linkedin: "LinkedIn", notion: "Notion", obsidian: "Obsidian", make: "Make", zapier: "Zapier", n8n: "n8n", webhooks: "Webhooks", rpa: "RPA", hivepress: "HivePress", branding: "Branding", campaign: "Campaign", campaigns: "Campaigns", thumbnail: "Thumbnail", thumbnails: "Thumbnails", hero: "Hero", header: "Header", design: "Design", web: "Web", documents: "Documents", commerce: "Commerce", store: "Store", stores: "Stores", photo: "Photo", photos: "Photos"
    },
    fr: {
      prompts: "Prompts", agents: "Agents IA", images: "Images", video: "Vidéo", audio: "Audio", word: "Word", excel: "Excel", powerpoint: "PowerPoint", pdf: "PDF", notes: "Notes",
      links: "Liens partagés", emails: "Emails", replies: "Réponses types", signatures: "Signatures", tasks: "Tâches", calendar: "Calendrier", meetings: "Réunions", snippets: "Snippets PHP",
      copywriting: "Copywriting", ads: "Publicités", emailing: "Emailing", pages: "Landing pages", products: "Produits", orders: "Commandes", customers: "Clients", refunds: "Remboursements",
      tickets: "Tickets", faq: "FAQ", bugs: "Bugs clients", canned: "Réponses préparées", analytics: "Analytics", credentials: "Identifiants non sensibles", passwords: "Mots de passe à ignorer",
      tokens: "Tokens / clés API à ignorer", privacy: "Confidentialité", sites: "Sites exclus", invoices: "Factures", payments: "Paiements", quotes: "Devis", phones: "Téléphones", addresses: "Adresses",
      identities: "Identité", contact: "Contact", applications: "Candidatures", repetitive: "Champs répétitifs", candidates: "Candidats", offers: "Offres", interviews: "Entretiens",
      contracts: "Contrats", terms: "Conditions", courses: "Cours", tutorials: "Tutoriels", research: "Recherche", videos: "Vidéos", fonts: "Polices", portraits: "Portraits IA",
      backgrounds: "Arrières-plans IA", ui: "Références UI", headers: "Headers & hero", icons: "Icônes", screenshots: "Captures d'écran", mockups: "Mockups", scans: "Scans", receipts: "Reçus & factures", article: "Article", articles: "Articles", hook: "Hook", hooks: "Hooks", newsletter: "Newsletter", newsletters: "Newsletters", sheet: "Feuille", sheets: "Feuilles", slide: "Diapositive", slides: "Diapositives", drive: "Drive", meet: "Meet", outlook: "Outlook", teams: "Teams", onedrive: "OneDrive", copilot: "Copilot", dropbox: "Dropbox", icloud: "iCloud", mega: "MEGA", slack: "Slack", discord: "Discord", whatsapp: "WhatsApp", linkedin: "LinkedIn", notion: "Notion", obsidian: "Obsidian", make: "Make", zapier: "Zapier", n8n: "n8n", webhooks: "Webhooks", rpa: "RPA", hivepress: "HivePress", branding: "Branding", campaign: "Campagne", campaigns: "Campagnes", thumbnail: "Miniature", thumbnails: "Miniatures", hero: "Hero", header: "Header", design: "Design", web: "Web", documents: "Documents", commerce: "Commerce", store: "Boutique", stores: "Boutiques", photo: "Photo", photos: "Photos",
      design: "Design", web: "Web", social: "Réseaux sociaux", ecommerce: "E-commerce", documents: "Documents", branding: "Branding", landing: "Landing", crm: "CRM",
      slack: "Slack", discord: "Discord", whatsapp: "WhatsApp", linkedin: "LinkedIn", notion: "Notion", obsidian: "Obsidian", make: "Make", zapier: "Zapier", n8n: "n8n",
      webhooks: "Webhooks", rpa: "RPA", google: "Google", workspace: "Workspace", docs: "Docs", sheets: "Sheets", slides: "Slides", drive: "Drive", meet: "Meet",
      microsoft: "Microsoft", office: "Office", outlook: "Outlook", teams: "Teams", onedrive: "OneDrive", copilot: "Copilot", cloud: "Cloud", storage: "Stockage", dropbox: "Dropbox",
      icloud: "iCloud", mega: "MEGA", shared: "Partagé", messages: "Messages", html: "HTML", css: "CSS", javascript: "JavaScript", typescript: "TypeScript", python: "Python",
      php: "PHP", sql: "SQL", json: "JSON", git: "Git / GitHub", terminal: "Terminal", api: "API"
    },
    de: {
      general: "Allgemein", favorites: "Favoriten", trash: "Papierkorb", ai: "KI", prompts: "Prompts", agents: "KI-Agenten", office: "Büro", images: "Bilder", image: "Bild", video: "Video", audio: "Audio",
      notes: "Notizen", links: "Geteilte Links", emails: "E-Mails", email: "E-Mail", replies: "Antwortvorlagen", signatures: "Signaturen", tasks: "Aufgaben", calendar: "Kalender", meetings: "Besprechungen", snippets: "PHP-Snippets",
      google: "Google", workspace: "Workspace", microsoft: "Microsoft", cloud: "Cloud", communication: "Kommunikation", productivity: "Produktivität", automation: "Automatisierung", development: "Entwicklung",
      wordpress: "WordPress", marketing: "Marketing", social: "Soziale", media: "Medien", content: "Inhalt", creation: "Erstellung", ecommerce: "E-Commerce", customer: "Kunde", support: "Support", data: "Daten",
      security: "Sicherheit", finance: "Finanzen", personal: "Nützliche", info: "Informationen", forms: "Formulare", hr: "HR", recruitment: "Recruiting", legal: "Recht", education: "Lernen",
      copywriting: "Copywriting", ads: "Anzeigen", emailing: "Emailing", pages: "Landingpages", products: "Produkte", orders: "Bestellungen", customers: "Kunden", refunds: "Rückerstattungen",
      tickets: "Tickets", faq: "FAQ", bugs: "Kundenfehler", canned: "Vorbereitete Antworten", analytics: "Analytics", credentials: "Nicht sensible Zugangsdaten", passwords: "Zu ignorierende Passwörter",
      tokens: "Zu ignorierende Tokens / API-Schlüssel", privacy: "Datenschutz", sites: "Ausgeschlossene Websites", invoices: "Rechnungen", payments: "Zahlungen", quotes: "Angebote", phones: "Telefone", addresses: "Adressen",
      identities: "Identität", contact: "Kontakt", applications: "Bewerbungen", repetitive: "Wiederholte Felder", candidates: "Kandidaten", offers: "Stellenangebote", interviews: "Interviews", contracts: "Verträge",
      terms: "AGB", courses: "Kurse", tutorials: "Tutorials", research: "Recherche", videos: "Videos", fonts: "Schriften", portraits: "KI-Porträts", backgrounds: "KI-Hintergründe", ui: "UI-Referenzen",
      headers: "Header & Hero", icons: "Icons", screenshots: "Screenshots", scans: "Scans", receipts: "Belege & Rechnungen", article: "Artikel", articles: "Artikel", hook: "Hook", hooks: "Hooks", newsletter: "Newsletter", newsletters: "Newsletter", sheet: "Tabelle", sheets: "Tabellen", slide: "Folie", slides: "Folien", drive: "Drive", meet: "Meet", outlook: "Outlook", teams: "Teams", onedrive: "OneDrive", copilot: "Copilot", dropbox: "Dropbox", icloud: "iCloud", mega: "MEGA", slack: "Slack", discord: "Discord", whatsapp: "WhatsApp", linkedin: "LinkedIn", notion: "Notion", obsidian: "Obsidian", make: "Make", zapier: "Zapier", n8n: "n8n", webhooks: "Webhooks", rpa: "RPA", hivepress: "HivePress", branding: "Branding", campaign: "Kampagne", campaigns: "Kampagnen", thumbnail: "Miniaturansicht", thumbnails: "Miniaturansichten", hero: "Hero", header: "Header", design: "Design", web: "Web", documents: "Dokumente", commerce: "Commerce", store: "Shop", stores: "Shops", photo: "Foto", photos: "Fotos"
    },
    es: {
      general: "General", favorites: "Favoritos", trash: "Papelera", ai: "IA", prompts: "Prompts", agents: "Agentes IA", office: "Ofimática", images: "Imágenes", image: "Imagen", video: "Vídeo", audio: "Audio",
      notes: "Notas", links: "Enlaces compartidos", emails: "Emails", email: "Email", replies: "Respuestas tipo", signatures: "Firmas", tasks: "Tareas", calendar: "Calendario", meetings: "Reuniones", snippets: "Snippets PHP",
      google: "Google", workspace: "Workspace", microsoft: "Microsoft", cloud: "Nube", communication: "Comunicación", productivity: "Productividad", automation: "Automatización", development: "Desarrollo",
      wordpress: "WordPress", marketing: "Marketing", social: "Redes", media: "Sociales", content: "Contenido", creation: "Creación", ecommerce: "E-commerce", customer: "Cliente", support: "Soporte", data: "Datos",
      security: "Seguridad", finance: "Finanzas", personal: "Información", info: "útil", forms: "Formularios", hr: "RR. HH.", recruitment: "Selección", legal: "Legal", education: "Formación",
      copywriting: "Copywriting", ads: "Publicidad", emailing: "Emailing", pages: "Landing pages", products: "Productos", orders: "Pedidos", customers: "Clientes", refunds: "Reembolsos",
      tickets: "Tickets", faq: "FAQ", bugs: "Bugs de clientes", canned: "Respuestas preparadas", analytics: "Analytics", credentials: "Credenciales no sensibles", passwords: "Contraseñas a ignorar",
      tokens: "Tokens / claves API a ignorar", privacy: "Privacidad", sites: "Sitios excluidos", invoices: "Facturas", payments: "Pagos", quotes: "Presupuestos", phones: "Teléfonos", addresses: "Direcciones",
      identities: "Identidad", contact: "Contacto", applications: "Candidaturas", repetitive: "Campos repetitivos", candidates: "Candidatos", offers: "Ofertas", interviews: "Entrevistas", contracts: "Contratos",
      terms: "CGV / CGU", courses: "Cursos", tutorials: "Tutoriales", research: "Investigación", videos: "Vídeos", fonts: "Fuentes", portraits: "Retratos IA", backgrounds: "Fondos IA", ui: "Referencias UI",
      headers: "Cabeceras y hero", icons: "Iconos", screenshots: "Capturas", scans: "Escaneos", receipts: "Recibos y facturas", article: "Artículo", articles: "Artículos", hook: "Gancho", hooks: "Ganchos", newsletter: "Newsletter", newsletters: "Newsletters", sheet: "Hoja", sheets: "Hojas", slide: "Diapositiva", slides: "Diapositivas", drive: "Drive", meet: "Meet", outlook: "Outlook", teams: "Teams", onedrive: "OneDrive", copilot: "Copilot", dropbox: "Dropbox", icloud: "iCloud", mega: "MEGA", slack: "Slack", discord: "Discord", whatsapp: "WhatsApp", linkedin: "LinkedIn", notion: "Notion", obsidian: "Obsidian", make: "Make", zapier: "Zapier", n8n: "n8n", webhooks: "Webhooks", rpa: "RPA", hivepress: "HivePress", branding: "Branding", campaign: "Campaña", campaigns: "Campañas", thumbnail: "Miniatura", thumbnails: "Miniaturas", hero: "Hero", header: "Cabecera", design: "Diseño", web: "Web", documents: "Documentos", commerce: "Comercio", store: "Tienda", stores: "Tiendas", photo: "Foto", photos: "Fotos"
    },
    it: {
      general: "Generale", favorites: "Preferiti", trash: "Cestino", ai: "IA", prompts: "Prompt", agents: "Agenti IA", office: "Ufficio", images: "Immagini", image: "Immagine", video: "Video", audio: "Audio",
      notes: "Note", links: "Link condivisi", emails: "Email", email: "Email", replies: "Risposte tipo", signatures: "Firme", tasks: "Attività", calendar: "Calendario", meetings: "Riunioni", snippets: "Snippet PHP",
      google: "Google", workspace: "Workspace", microsoft: "Microsoft", cloud: "Cloud", communication: "Comunicazione", productivity: "Produttività", automation: "Automazione", development: "Sviluppo",
      wordpress: "WordPress", marketing: "Marketing", social: "Social", media: "Media", content: "Contenuti", creation: "Creazione", ecommerce: "E-commerce", customer: "Cliente", support: "Supporto", data: "Dati",
      security: "Sicurezza", finance: "Finanza", personal: "Informazioni", info: "utili", forms: "Moduli", hr: "HR", recruitment: "Reclutamento", legal: "Legale", education: "Formazione",
      copywriting: "Copywriting", ads: "Annunci", emailing: "Emailing", pages: "Landing page", products: "Prodotti", orders: "Ordini", customers: "Clienti", refunds: "Rimborsi",
      tickets: "Ticket", faq: "FAQ", bugs: "Bug clienti", canned: "Risposte preparate", analytics: "Analytics", credentials: "Credenziali non sensibili", passwords: "Password da ignorare",
      tokens: "Token / chiavi API da ignorare", privacy: "Privacy", sites: "Siti esclusi", invoices: "Fatture", payments: "Pagamenti", quotes: "Preventivi", phones: "Telefoni", addresses: "Indirizzi",
      identities: "Identità", contact: "Contatto", applications: "Candidature", repetitive: "Campi ripetitivi", candidates: "Candidati", offers: "Offerte", interviews: "Colloqui", contracts: "Contratti",
      terms: "CGV / CGU", courses: "Corsi", tutorials: "Tutorial", research: "Ricerca", videos: "Video", fonts: "Font", portraits: "Ritratti IA", backgrounds: "Sfondi IA", ui: "Riferimenti UI",
      headers: "Header e hero", icons: "Icone", screenshots: "Screenshot", scans: "Scansioni", receipts: "Ricevute e fatture", article: "Articolo", articles: "Articoli", hook: "Hook", hooks: "Hook", newsletter: "Newsletter", newsletters: "Newsletter", sheet: "Foglio", sheets: "Fogli", slide: "Slide", slides: "Slide", drive: "Drive", meet: "Meet", outlook: "Outlook", teams: "Teams", onedrive: "OneDrive", copilot: "Copilot", dropbox: "Dropbox", icloud: "iCloud", mega: "MEGA", slack: "Slack", discord: "Discord", whatsapp: "WhatsApp", linkedin: "LinkedIn", notion: "Notion", obsidian: "Obsidian", make: "Make", zapier: "Zapier", n8n: "n8n", webhooks: "Webhooks", rpa: "RPA", hivepress: "HivePress", branding: "Branding", campaign: "Campagna", campaigns: "Campagne", thumbnail: "Miniatura", thumbnails: "Miniature", hero: "Hero", header: "Header", design: "Design", web: "Web", documents: "Documenti", commerce: "Commerce", store: "Store", stores: "Store", photo: "Foto", photos: "Foto"
    }
  };

  const CATEGORY_TRANSLATIONS = {
    general: { en: "General", fr: "Général", de: "Allgemein", es: "General", it: "Generale" },
    favorites: { en: "Favorites", fr: "Favoris", de: "Favoriten", es: "Favoritos", it: "Preferiti" },
    trash: { en: "Trash", fr: "Corbeille", de: "Papierkorb", es: "Papelera", it: "Cestino" },
    ai: { en: "AI", fr: "IA", de: "KI", es: "IA", it: "IA" },
    office: { en: "Office", fr: "Bureautique", de: "Büro", es: "Ofimática", it: "Ufficio" },
    "google-workspace": { en: "Google Workspace", fr: "Google Workspace", de: "Google Workspace", es: "Google Workspace", it: "Google Workspace" },
    microsoft: { en: "Microsoft 365", fr: "Microsoft 365", de: "Microsoft 365", es: "Microsoft 365", it: "Microsoft 365" },
    cloud: { en: "Cloud & storage", fr: "Cloud & stockage", de: "Cloud & Speicher", es: "Nube y almacenamiento", it: "Cloud e archiviazione" },
    communication: { en: "Communication", fr: "Communication", de: "Kommunikation", es: "Comunicación", it: "Comunicazione" },
    productivity: { en: "Productivity", fr: "Productivité", de: "Produktivität", es: "Productividad", it: "Produttività" },
    automation: { en: "Automation", fr: "Automatisation", de: "Automatisierung", es: "Automatización", it: "Automazione" },
    development: { en: "Development", fr: "Développement", de: "Entwicklung", es: "Desarrollo", it: "Sviluppo" },
    wordpress: { en: "WordPress", fr: "WordPress", de: "WordPress", es: "WordPress", it: "WordPress" },
    marketing: { en: "Marketing", fr: "Marketing", de: "Marketing", es: "Marketing", it: "Marketing" },
    "social-media": { en: "Social media", fr: "Réseaux sociaux", de: "Soziale Medien", es: "Redes sociales", it: "Social media" },
    "content-creation": { en: "Content creation", fr: "Création de contenu", de: "Content-Erstellung", es: "Creación de contenido", it: "Creazione contenuti" },
    ecommerce: { en: "E-commerce", fr: "E-commerce", de: "E-Commerce", es: "E-commerce", it: "E-commerce" },
    "customer-support": { en: "Customer support", fr: "Support client", de: "Kundensupport", es: "Atención al cliente", it: "Supporto clienti" },
    data: { en: "Data", fr: "Données", de: "Daten", es: "Datos", it: "Dati" },
    security: { en: "Security", fr: "Sécurité", de: "Sicherheit", es: "Seguridad", it: "Sicurezza" },
    finance: { en: "Finance & admin", fr: "Finance & administratif", de: "Finanzen & Verwaltung", es: "Finanzas y administración", it: "Finanza e amministrazione" },
    "personal-info": { en: "Useful information", fr: "Informations utiles", de: "Nützliche Informationen", es: "Información útil", it: "Informazioni utili" },
    forms: { en: "Forms", fr: "Formulaires", de: "Formulare", es: "Formularios", it: "Moduli" },
    "hr-recruitment": { en: "HR & recruitment", fr: "RH & recrutement", de: "HR & Recruiting", es: "RR. HH. y selección", it: "HR e recruiting" },
    legal: { en: "Legal", fr: "Juridique", de: "Rechtliches", es: "Legal", it: "Legale" },
    education: { en: "Training & learning", fr: "Formation & apprentissage", de: "Schulung & Lernen", es: "Formación y aprendizaje", it: "Formazione e apprendimento" },
    media: { en: "Media", fr: "Médias", de: "Medien", es: "Medios", it: "Media" }
    ,"dev-general": { en: "General", fr: "Général", de: "Allgemein", es: "General", it: "Generale" }
    ,"dev-favorites": { en: "Favorites", fr: "Favoris", de: "Favoriten", es: "Favoritos", it: "Preferiti" }
    ,"dev-trash": { en: "Trash", fr: "Corbeille", de: "Papierkorb", es: "Papelera", it: "Cestino" }
    ,"image-general": { en: "General", fr: "Général", de: "Allgemein", es: "General", it: "Generale" }
    ,"image-favorites": { en: "Favorites", fr: "Favoris", de: "Favoriten", es: "Favoritos", it: "Preferiti" }
    ,"image-trash": { en: "Trash", fr: "Corbeille", de: "Papierkorb", es: "Papelera", it: "Cestino" }
    ,"image-ai": { en: "AI images", fr: "Images IA", de: "KI-Bilder", es: "Imágenes IA", it: "Immagini IA" }
    ,"image-ai-prompts": { en: "Prompt results", fr: "Résultats de prompts", de: "Prompt-Ergebnisse", es: "Resultados de prompts", it: "Risultati prompt" }
    ,"image-ai-portraits": { en: "AI portraits", fr: "Portraits IA", de: "KI-Porträts", es: "Retratos IA", it: "Ritratti IA" }
    ,"image-ai-products": { en: "AI products", fr: "Produits IA", de: "KI-Produkte", es: "Productos IA", it: "Prodotti IA" }
    ,"image-ai-backgrounds": { en: "AI backgrounds", fr: "Arrière-plans IA", de: "KI-Hintergründe", es: "Fondos IA", it: "Sfondi IA" }
    ,"image-design": { en: "Design", fr: "Design", de: "Design", es: "Diseño", it: "Design" }
    ,"image-design-ui": { en: "UI references", fr: "Références UI", de: "UI-Referenzen", es: "Referencias UI", it: "Riferimenti UI" }
    ,"image-design-branding": { en: "Branding", fr: "Branding", de: "Branding", es: "Branding", it: "Branding" }
    ,"image-design-ads": { en: "Ads creatives", fr: "Créatifs publicitaires", de: "Werbemittel", es: "Creatividades publicitarias", it: "Creatività ads" }
    ,"image-web": { en: "Web images", fr: "Images web", de: "Webbilder", es: "Imágenes web", it: "Immagini web" }
    ,"image-web-headers": { en: "Headers & hero", fr: "Headers & héros", de: "Header & Hero", es: "Cabeceras y hero", it: "Header e hero" }
    ,"image-web-icons": { en: "Icons", fr: "Icônes", de: "Icons", es: "Iconos", it: "Icone" }
    ,"image-web-screenshots": { en: "Screenshots", fr: "Captures d’écran", de: "Screenshots", es: "Capturas", it: "Screenshot" }
    ,"image-social": { en: "Social media", fr: "Réseaux sociaux", de: "Soziale Medien", es: "Redes sociales", it: "Social media" }
    ,"image-social-instagram": { en: "Instagram", fr: "Instagram", de: "Instagram", es: "Instagram", it: "Instagram" }
    ,"image-social-youtube": { en: "YouTube thumbnails", fr: "Miniatures YouTube", de: "YouTube-Thumbnails", es: "Miniaturas de YouTube", it: "Miniature YouTube" }
    ,"image-social-linkedin": { en: "LinkedIn", fr: "LinkedIn", de: "LinkedIn", es: "LinkedIn", it: "LinkedIn" }
    ,"image-commerce": { en: "E-commerce", fr: "E-commerce", de: "E-Commerce", es: "E-commerce", it: "E-commerce" }
    ,"image-commerce-products": { en: "Product photos", fr: "Photos produits", de: "Produktbilder", es: "Fotos de producto", it: "Foto prodotto" }
    ,"image-commerce-mockups": { en: "Mockups", fr: "Mockups", de: "Mockups", es: "Mockups", it: "Mockup" }
    ,"image-documents": { en: "Documents", fr: "Documents", de: "Dokumente", es: "Documentos", it: "Documenti" }
    ,"image-documents-scans": { en: "Scans", fr: "Scans", de: "Scans", es: "Escaneos", it: "Scansioni" }
    ,"image-documents-receipts": { en: "Receipts & invoices", fr: "Reçus & factures", de: "Belege & Rechnungen", es: "Recibos y facturas", it: "Ricevute e fatture" }
  };

  const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_NAMES);

  function normalizeLanguageCode(value, supportedLanguages = SUPPORTED_LANGUAGES) {
    const supported = Array.isArray(supportedLanguages) && supportedLanguages.length
      ? supportedLanguages
      : SUPPORTED_LANGUAGES;
    const raw = String(value || "").trim().toLowerCase().replace(/_/g, "-");
    if (!raw) return "";
    if (supported.includes(raw)) return raw;
    const base = raw.split("-")[0];
    return supported.includes(base) ? base : "";
  }

  function browserLanguageCandidates() {
    const candidates = [];
    try {
      const uiLanguage = global.chrome?.i18n?.getUILanguage?.();
      if (uiLanguage) candidates.push(uiLanguage);
    } catch (error) {}
    try {
      if (Array.isArray(global.navigator?.languages)) candidates.push(...global.navigator.languages);
      if (global.navigator?.language) candidates.push(global.navigator.language);
      if (global.navigator?.userLanguage) candidates.push(global.navigator.userLanguage);
    } catch (error) {}
    try {
      const intlLanguage = new Intl.DateTimeFormat().resolvedOptions().locale;
      if (intlLanguage) candidates.push(intlLanguage);
    } catch (error) {}
    try {
      const documentLanguage = global.document?.documentElement?.lang;
      if (documentLanguage) candidates.push(documentLanguage);
    } catch (error) {}
    return [...new Set(candidates.filter(Boolean))];
  }

  function acceptedChromeLanguages() {
    return new Promise((resolve) => {
      try {
        if (!global.chrome?.i18n?.getAcceptLanguages) {
          resolve([]);
          return;
        }
        global.chrome.i18n.getAcceptLanguages((languages) => {
          resolve(Array.isArray(languages) ? languages : []);
        });
      } catch (error) {
        resolve([]);
      }
    });
  }

  function detectPreferredLanguage(options = {}) {
    const supportedLanguages = Array.isArray(options.supportedLanguages) && options.supportedLanguages.length
      ? options.supportedLanguages
      : SUPPORTED_LANGUAGES;
    const fallback = normalizeLanguageCode(options.fallback, supportedLanguages) || "en";
    const savedLanguage = normalizeLanguageCode(options.savedLanguage, supportedLanguages);
    if (options.preferSaved && savedLanguage) return savedLanguage;
    for (const candidate of browserLanguageCandidates()) {
      const detected = normalizeLanguageCode(candidate, supportedLanguages);
      if (detected) return detected;
    }
    return fallback;
  }

  async function detectPreferredLanguageAsync(options = {}) {
    const supportedLanguages = Array.isArray(options.supportedLanguages) && options.supportedLanguages.length
      ? options.supportedLanguages
      : SUPPORTED_LANGUAGES;
    const fallback = normalizeLanguageCode(options.fallback, supportedLanguages) || "en";
    const savedLanguage = normalizeLanguageCode(options.savedLanguage, supportedLanguages);
    if (options.preferSaved && savedLanguage) return savedLanguage;
    const acceptedLanguages = await acceptedChromeLanguages();
    for (const candidate of [...acceptedLanguages, ...browserLanguageCandidates()]) {
      const detected = normalizeLanguageCode(candidate, supportedLanguages);
      if (detected) return detected;
    }
    return fallback;
  }

  function currentLanguage(settings) {
    return normalizeLanguageCode(settings?.language) || "en";
  }

  function translate(key, params = {}, language = "en") {
    const locales = global.MCP_LOCALES || {};
    const dictionary = locales[language] || locales.en || {};
    const fallback = locales.en || {};
    let value = dictionary[key] || fallback[key] || key;
    Object.keys(params || {}).forEach((name) => {
      value = value.replaceAll(`{${name}}`, String(params[name]));
    });
    return repairMojibake(value);
  }

  function translateCategoryName(category, language = "en") {
    if (!category) return "";
    if (category.customName) return repairMojibake(category.name);
    const translatedCategory = CATEGORY_TRANSLATIONS[category.id]?.[language] || CATEGORY_TRANSLATIONS[category.id]?.en;
    if (translatedCategory) return repairMojibake(translatedCategory);
    if (category.id === "vault" || category.id === "image-vault" || category.id === "dev-vault") return translate("vault.title", {}, language);
    if (String(category.id || "").startsWith("dev-")) return repairMojibake(category.name);
    const key = `category.${category.id}`;
    const translated = translate(key, {}, language);
    if (translated !== key) return translated;
    if (isDefaultLibraryCategory(category)) {
      const fallback = translatedSlugLabel(category, language);
      if (fallback) return fallback;
    }
    if (category.isSystem || category.isDefault) {
      if (category.id === "general") return translate("categories.general", {}, language);
      if (category.id === "favorites") return translate("categories.favorites", {}, language);
      if (category.id === "trash") return translate("trash.title", {}, language);
      if (category.id === "vault" || category.id === "image-vault" || category.id === "dev-vault") return translate("vault.title", {}, language);
    }
    return repairMojibake(category.name);
  }

  function isDefaultLibraryCategory(category) {
    return [
      ...(global.MCP?.DEFAULT_CATEGORIES || []),
      ...(global.MCP?.DEFAULT_IMAGE_CATEGORIES || []),
      ...(global.MCP?.DEFAULT_DEV_CATEGORIES || [])
    ].some((item) => item.id === category.id);
  }

  function translatedSlugLabel(category, language) {
    const tokens = String(category.id || "").replace(/^(image|dev)-/, "").split("-").filter(Boolean);
    const dictionary = SLUG_LABELS[language] || SLUG_LABELS.en;
    const translatedTokens = tokens.map((token) => dictionary[token] || SLUG_LABELS.en[token] || titleFromSlug(token));
    if (!translatedTokens.length) return titleFromSlug(category.name);
    if (translatedTokens.length === 1) return repairMojibake(translatedTokens[0]);
    return repairMojibake(translatedTokens.join(" "));
  }

  function titleFromSlug(value) {
    return String(value || "")
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  const CP1252_REVERSE_BYTES = Object.freeze({
    0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
    0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E,
    0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
    0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
  });

  const MOJIBAKE_TOKENS = Object.freeze([
    "\u00C3\u0192", "\u00C3\u201A", "\u00C3", "\u00C2", "\u00E2\u20AC",
    "\u00E2\u20AC\u2122", "\u00E2\u20AC\u0153", "\u00E2\u20AC\u009D",
    "\u00E2\u20AC\u00A6", "\u00E2\u20AC\u201D", "\u00E2\u20AC\u201C",
    "\u00E2\u201A\u00AC", "\uFFFD"
  ]);

  const SIMPLE_MOJIBAKE_REPLACEMENTS = Object.freeze({
    "\u00C3\u00A0": "\u00E0", "\u00C3\u00A1": "\u00E1", "\u00C3\u00A2": "\u00E2", "\u00C3\u00A3": "\u00E3", "\u00C3\u00A4": "\u00E4",
    "\u00C3\u00A7": "\u00E7", "\u00C3\u00A8": "\u00E8", "\u00C3\u00A9": "\u00E9", "\u00C3\u00AA": "\u00EA", "\u00C3\u00AB": "\u00EB",
    "\u00C3\u00AC": "\u00EC", "\u00C3\u00AD": "\u00ED", "\u00C3\u00AE": "\u00EE", "\u00C3\u00AF": "\u00EF", "\u00C3\u00B1": "\u00F1",
    "\u00C3\u00B2": "\u00F2", "\u00C3\u00B3": "\u00F3", "\u00C3\u00B4": "\u00F4", "\u00C3\u00B6": "\u00F6",
    "\u00C3\u00B9": "\u00F9", "\u00C3\u00BA": "\u00FA", "\u00C3\u00BB": "\u00FB", "\u00C3\u00BC": "\u00FC",
    "\u00C3\u2030": "\u00C9", "\u00C3\u20AC": "\u00C0", "\u00C3\u2013": "\u00D6",
    "\u00C2\u00AB": "\u00AB", "\u00C2\u00BB": "\u00BB", "\u00C2\u00A3": "\u00A3", "\u00C2\u00B0": "\u00B0", "\u00C2\u00A0": " "
  });

  function mojibakeScore(text) {
    return MOJIBAKE_TOKENS.reduce((total, token) => total + String(text || "").split(token).length - 1, 0);
  }

  function cp1252BytesFromText(text) {
    const bytes = [];
    for (const char of String(text || "")) {
      const code = char.codePointAt(0);
      if (code <= 0xFF) bytes.push(code);
      else if (CP1252_REVERSE_BYTES[code]) bytes.push(CP1252_REVERSE_BYTES[code]);
      else return null;
    }
    return new Uint8Array(bytes);
  }

  function decodeCp1252Utf8(text) {
    const bytes = cp1252BytesFromText(text);
    if (!bytes || !global.TextDecoder) return text;
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch (error) {
      return text;
    }
  }

  function repairMojibake(value) {
    let repaired = String(value ?? "");
    Object.entries(SIMPLE_MOJIBAKE_REPLACEMENTS).forEach(([from, to]) => {
      repaired = repaired.replaceAll(from, to);
    });
    let score = mojibakeScore(repaired);
    if (!score) return repaired;
    for (let index = 0; index < 6; index += 1) {
      const candidate = decodeCp1252Utf8(repaired);
      const nextScore = mojibakeScore(candidate);
      if (candidate === repaired || nextScore >= score) break;
      repaired = candidate;
      score = nextScore;
      if (!score) break;
    }
    return repaired;
  }

  function formatDate(timestamp, language = "en") {
    if (!timestamp) return translate("dates.unknown", {}, language);
    try {
      return new Intl.DateTimeFormat(resolveDateLocale(language), {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: resolveLocalTimeZone()
      }).format(new Date(timestamp));
    } catch (error) {
      return new Date(timestamp).toLocaleString();
    }
  }

  function resolveDateLocale(language = "en") {
    const requested = normalizeLanguageCode(language) || "en";
    const requestedBase = requested.split("-")[0];
    const candidates = browserLanguageCandidates();
    const regionalMatch = candidates.find((candidate) => {
      const value = String(candidate || "").trim().replace(/_/g, "-");
      return value.includes("-") && value.toLowerCase().split("-")[0] === requestedBase;
    });
    if (regionalMatch) return regionalMatch;
    const browserRegional = candidates.find((candidate) => String(candidate || "").includes("-"));
    const browserBase = normalizeLanguageCode(browserRegional);
    if (browserRegional && browserBase === requestedBase) return browserRegional;
    const defaults = {
      en: "en-US",
      fr: "fr-FR",
      es: "es-ES",
      de: "de-DE",
      it: "it-IT"
    };
    return defaults[requestedBase] || requested;
  }

  function resolveLocalTimeZone() {
    try {
      return new Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
    } catch (error) {
      return undefined;
    }
  }

  global.MCP = Object.assign(global.MCP || {}, {
    LANGUAGE_NAMES,
    SUPPORTED_LANGUAGES,
    normalizeLanguageCode,
    browserLanguageCandidates,
    acceptedChromeLanguages,
    detectPreferredLanguage,
    detectPreferredLanguageAsync,
    currentLanguage,
    t: translate,
    translateCategoryName,
    repairMojibake,
    resolveDateLocale,
    resolveLocalTimeZone,
    formatLocalizedDate: formatDate
  });
})(globalThis);
