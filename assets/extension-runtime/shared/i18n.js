(function initI18n(global) {
  const LANGUAGE_NAMES = {
    en: "English",
    fr: "Français",
    es: "Español",
    it: "Italiano",
    de: "Deutsch",
    ro: "Română",
    pt: "Português",
    ar: "العربية",
    zh: "中文",
    ja: "日本語",
    ru: "Русский",
    nl: "Nederlands",
    pl: "Polski",
    tr: "Türkçe",
    ko: "한국어",
    hi: "हिन्दी"
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
  Object.assign(SLUG_LABELS, global.MCP_SLUG_LOCALES || {});

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
    media: { en: "Media", fr: "Médias", de: "Medien", es: "Medios", it: "Media" },
    "marketing-landing-pages": {
      en: "Landing pages", fr: "Pages de destination", de: "Landingpages", es: "Páginas de destino",
      it: "Landing page", ro: "Pagini de destinație", pt: "Páginas de destino", ar: "الصفحات المقصودة",
      zh: "着陆页", ja: "ランディングページ", ru: "Целевые страницы", nl: "Landingspagina's",
      pl: "Strony docelowe", tr: "Açılış sayfaları", ko: "랜딩 페이지", hi: "लैंडिंग पृष्ठ"
    },
    "security-excluded-sites": {
      en: "Excluded sites", fr: "Sites exclus", de: "Ausgeschlossene Websites", es: "Sitios excluidos",
      it: "Siti esclusi", ro: "Site-uri excluse", pt: "Sites excluídos", ar: "المواقع المستبعدة",
      zh: "已排除的网站", ja: "除外サイト", ru: "Исключённые сайты", nl: "Uitgesloten sites",
      pl: "Wykluczone witryny", tr: "Hariç tutulan siteler", ko: "제외된 사이트", hi: "बहिष्कृत साइटें"
    }
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

  function applyLanguageMetadata(target, language = "en") {
    const normalized = normalizeLanguageCode(language) || "en";
    const root = target?.documentElement || target;
    if (!root) return normalized;
    if ("lang" in root) root.lang = normalized;
    root.setAttribute?.("dir", "ltr");
    if (root.dataset) {
      root.dataset.uiLanguage = normalized;
      root.dataset.textDirection = normalized === "ar" ? "rtl" : "ltr";
    }
    return normalized;
  }

  const LICENSE_ENHANCEMENTS = Object.freeze({
    en: {
      "license.help": "After subscribing to a Lifetime plan, you will receive a license key by email. Paste it here to activate Ultimate Clipboard Pro on this computer.",
      "license.viewPlans": "View plans", "license.chooseOffer": "Choose this plan", "license.currentOffer": "Current plan", "license.activate": "Activate license",
      "license.keyPlaceholder": "Enter your license key here",
      "license.showKey": "Show license key", "license.hideKey": "Hide license key",
      "license.product": "Product", "license.customer": "License holder", "license.purchasedAt": "Purchased at",
      "license.removeRemotePrompt": "This device will be deactivated and its license slot freed. The local license will only be removed after confirmation.",
      "license.recoveryPrompt": "Choose the old device to deactivate by entering its number:",
      "license.privacy": "Your copied content stays local. Your license key is sent only to Arcawand's dedicated license service during activation; no copied content or history is sent."
    },
    fr: {
      "license.help": "Après votre souscription à un plan Lifetime, vous recevrez une clé de licence par mail. Collez cette clé ici pour activer Ultimate Clipboard Pro sur cet ordinateur.",
      "license.viewPlans": "Voir les offres", "license.chooseOffer": "Choisir cette offre", "license.currentOffer": "Offre actuelle", "license.activate": "Activer la licence",
      "license.keyPlaceholder": "Saisissez ici votre clé de licence",
      "license.showKey": "Afficher la clé de licence", "license.hideKey": "Masquer la clé de licence",
      "license.product": "Produit", "license.customer": "Titulaire", "license.purchasedAt": "Achetée le",
      "license.removeRemotePrompt": "Cet appareil sera désactivé et son emplacement de licence libéré. La licence locale ne sera supprimée qu’après confirmation.",
      "license.recoveryPrompt": "Choisissez l’ancien appareil à désactiver en saisissant son numéro :",
      "license.privacy": "Vos contenus copiés restent en local. Votre clé est envoyée uniquement au service de licence Arcawand dédié lors de l’activation ; aucun contenu copié ni historique n’est transmis."
    },
    es: {
      "license.help": "Después de suscribirte a un plan Lifetime, recibirás una clave de licencia por correo electrónico. Pégala aquí para activar Ultimate Clipboard Pro en este ordenador.",
      "license.viewPlans": "Ver ofertas", "license.chooseOffer": "Elegir esta oferta", "license.currentOffer": "Oferta actual", "license.activate": "Activar licencia",
      "license.keyPlaceholder": "Introduce aquí tu clave de licencia",
      "license.showKey": "Mostrar clave de licencia", "license.hideKey": "Ocultar clave de licencia",
      "license.product": "Producto", "license.customer": "Titular", "license.purchasedAt": "Comprada el",
      "license.removeRemotePrompt": "Este dispositivo se desactivará y su plaza de licencia quedará libre. La licencia local solo se eliminará tras la confirmación.",
      "license.recoveryPrompt": "Elige el dispositivo antiguo que deseas desactivar introduciendo su número:",
      "license.privacy": "El contenido copiado permanece local. La clave solo se envía al servicio de licencias dedicado de Arcawand durante la activación; no se envían contenidos ni historial."
    },
    it: {
      "license.help": "Dopo l'iscrizione a un piano Lifetime riceverai una chiave di licenza via e-mail. Incollala qui per attivare Ultimate Clipboard Pro su questo computer.",
      "license.viewPlans": "Vedi offerte", "license.chooseOffer": "Scegli questa offerta", "license.currentOffer": "Offerta attuale", "license.activate": "Attiva licenza",
      "license.keyPlaceholder": "Inserisci qui la chiave di licenza",
      "license.showKey": "Mostra chiave di licenza", "license.hideKey": "Nascondi chiave di licenza",
      "license.product": "Prodotto", "license.customer": "Titolare", "license.purchasedAt": "Acquistata il",
      "license.removeRemotePrompt": "Questo dispositivo verrà disattivato e il posto licenza sarà liberato. La licenza locale verrà rimossa solo dopo la conferma.",
      "license.recoveryPrompt": "Scegli il vecchio dispositivo da disattivare inserendo il suo numero:",
      "license.privacy": "I contenuti copiati restano locali. La chiave viene inviata solo al servizio licenze Arcawand dedicato durante l’attivazione; contenuti e cronologia non vengono inviati."
    },
    de: {
      "license.help": "Nach dem Abschluss eines Lifetime-Plans erhältst du per E-Mail einen Lizenzschlüssel. Füge ihn hier ein, um Ultimate Clipboard Pro auf diesem Computer zu aktivieren.",
      "license.viewPlans": "Angebote ansehen", "license.chooseOffer": "Dieses Angebot wählen", "license.currentOffer": "Aktuelles Angebot", "license.activate": "Lizenz aktivieren",
      "license.keyPlaceholder": "Gib hier deinen Lizenzschlüssel ein",
      "license.showKey": "Lizenzschlüssel anzeigen", "license.hideKey": "Lizenzschlüssel ausblenden",
      "license.product": "Produkt", "license.customer": "Lizenzinhaber", "license.purchasedAt": "Gekauft am",
      "license.removeRemotePrompt": "Dieses Gerät wird deaktiviert und der Lizenzplatz freigegeben. Die lokale Lizenz wird erst nach der Bestätigung entfernt.",
      "license.recoveryPrompt": "Wähle das alte Gerät zur Deaktivierung durch Eingabe seiner Nummer:",
      "license.privacy": "Kopierte Inhalte bleiben lokal. Der Schlüssel wird nur bei der Aktivierung an Arcawands dedizierten Lizenzdienst gesendet; Inhalte und Verlauf werden nie übertragen."
    },
    ro: {
      "license.help": "După abonarea la un plan Lifetime, vei primi prin e-mail o cheie de licență. Lipește-o aici pentru a activa Ultimate Clipboard Pro pe acest computer.",
      "license.viewPlans": "Vezi ofertele", "license.chooseOffer": "Alege această ofertă", "license.currentOffer": "Oferta actuală", "license.activate": "Activează licența",
      "license.keyPlaceholder": "Introdu aici cheia de licență",
      "license.showKey": "Afișează cheia de licență", "license.hideKey": "Ascunde cheia de licență",
      "license.product": "Produs", "license.customer": "Titular", "license.purchasedAt": "Cumpărată la",
      "license.removeRemotePrompt": "Acest dispozitiv va fi dezactivat, iar locul licenței va fi eliberat. Licența locală va fi eliminată numai după confirmare.",
      "license.recoveryPrompt": "Alege dispozitivul vechi de dezactivat introducând numărul său:",
      "license.privacy": "Conținutul copiat rămâne local. Cheia este trimisă doar serviciului dedicat de licențe Arcawand la activare; conținutul și istoricul nu sunt trimise."
    },
    pt: {
      "license.help": "Depois de subscreveres um plano Lifetime, receberás uma chave de licença por e-mail. Cola-a aqui para ativar o Ultimate Clipboard Pro neste computador.",
      "license.viewPlans": "Ver ofertas", "license.chooseOffer": "Escolher esta oferta", "license.currentOffer": "Oferta atual", "license.activate": "Ativar licença",
      "license.keyPlaceholder": "Introduz aqui a tua chave de licença",
      "license.showKey": "Mostrar chave de licença", "license.hideKey": "Ocultar chave de licença",
      "license.product": "Produto", "license.customer": "Titular", "license.purchasedAt": "Comprada em",
      "license.removeRemotePrompt": "Este dispositivo será desativado e a vaga da licença será libertada. A licença local só será removida após a confirmação.",
      "license.recoveryPrompt": "Escolhe o dispositivo antigo a desativar introduzindo o respetivo número:",
      "license.privacy": "O conteúdo copiado permanece local. A chave só é enviada ao serviço de licenças dedicado da Arcawand durante a ativação; nenhum conteúdo ou histórico é enviado."
    },
    ar: {
      "license.help": "بعد الاشتراك في خطة مدى الحياة، ستتلقى مفتاح ترخيص عبر البريد الإلكتروني. الصقه هنا لتفعيل Ultimate Clipboard Pro على هذا الكمبيوتر.",
      "license.viewPlans": "عرض العروض", "license.chooseOffer": "اختيار هذا العرض", "license.currentOffer": "العرض الحالي", "license.activate": "تفعيل الترخيص",
      "license.keyPlaceholder": "أدخل مفتاح الترخيص هنا",
      "license.showKey": "إظهار مفتاح الترخيص", "license.hideKey": "إخفاء مفتاح الترخيص",
      "license.product": "المنتج", "license.customer": "صاحب الترخيص", "license.purchasedAt": "تاريخ الشراء",
      "license.removeRemotePrompt": "سيتم إلغاء تنشيط هذا الجهاز وتحرير مكان الترخيص. لن يُحذف الترخيص المحلي إلا بعد التأكيد.",
      "license.recoveryPrompt": "اختر الجهاز القديم المراد إلغاء تنشيطه بإدخال رقمه:",
      "license.privacy": "يبقى المحتوى المنسوخ محليًا. يُرسل مفتاحك فقط إلى خدمة ترخيص Arcawand المخصصة عند التنشيط، ولا يُرسل أي محتوى أو سجل."
    },
    zh: {
      "license.help": "订阅终身计划后，你会通过电子邮件收到许可证密钥。请将其粘贴到此处，以在这台电脑上激活 Ultimate Clipboard Pro。",
      "license.viewPlans": "查看方案", "license.chooseOffer": "选择此方案", "license.currentOffer": "当前方案", "license.activate": "激活许可证",
      "license.keyPlaceholder": "在此输入许可证密钥",
      "license.showKey": "显示许可证密钥", "license.hideKey": "隐藏许可证密钥",
      "license.product": "产品", "license.customer": "许可证持有人", "license.purchasedAt": "购买时间",
      "license.removeRemotePrompt": "此设备将被停用，其许可证名额将被释放。本地许可证仅在确认后删除。",
      "license.recoveryPrompt": "请输入编号，选择要停用的旧设备：",
      "license.privacy": "复制内容保留在本地。许可证密钥仅在激活时发送到 Arcawand 专用许可证服务；不会发送复制内容或历史记录。"
    },
    ja: {
      "license.help": "Lifetimeプランに加入すると、ライセンスキーがメールで届きます。ここに貼り付けて、このパソコンでUltimate Clipboard Proを有効化してください。",
      "license.viewPlans": "プランを見る", "license.chooseOffer": "このプランを選ぶ", "license.currentOffer": "現在のプラン", "license.activate": "ライセンスを有効化",
      "license.keyPlaceholder": "ここにライセンスキーを入力",
      "license.showKey": "ライセンスキーを表示", "license.hideKey": "ライセンスキーを隠す",
      "license.product": "製品", "license.customer": "ライセンス所有者", "license.purchasedAt": "購入日時",
      "license.removeRemotePrompt": "この端末を無効化し、ライセンス枠を解放します。ローカルライセンスは確認後にのみ削除されます。",
      "license.recoveryPrompt": "無効化する古い端末の番号を入力してください：",
      "license.privacy": "コピー内容は端末内に留まります。キーは有効化時にArcawand専用ライセンスサービスへのみ送信され、内容や履歴は送信されません。"
    },
    ru: {
      "license.help": "После оформления плана Lifetime вы получите лицензионный ключ по электронной почте. Вставьте его сюда, чтобы активировать Ultimate Clipboard Pro на этом компьютере.",
      "license.viewPlans": "Посмотреть предложения", "license.chooseOffer": "Выбрать это предложение", "license.currentOffer": "Текущее предложение", "license.activate": "Активировать лицензию",
      "license.keyPlaceholder": "Введите лицензионный ключ здесь",
      "license.showKey": "Показать лицензионный ключ", "license.hideKey": "Скрыть лицензионный ключ",
      "license.product": "Продукт", "license.customer": "Владелец лицензии", "license.purchasedAt": "Дата покупки",
      "license.removeRemotePrompt": "Это устройство будет деактивировано, а место лицензии освобождено. Локальная лицензия удалится только после подтверждения.",
      "license.recoveryPrompt": "Введите номер старого устройства, которое нужно деактивировать:",
      "license.privacy": "Скопированные данные остаются локальными. Ключ отправляется только выделенному сервису лицензий Arcawand при активации; содержимое и история не передаются."
    },
    nl: {
      "license.help": "Na je abonnement op een Lifetime-plan ontvang je per e-mail een licentiesleutel. Plak die hier om Ultimate Clipboard Pro op deze computer te activeren.",
      "license.viewPlans": "Bekijk aanbiedingen", "license.chooseOffer": "Kies deze aanbieding", "license.currentOffer": "Huidige aanbieding", "license.activate": "Licentie activeren",
      "license.keyPlaceholder": "Voer hier je licentiesleutel in",
      "license.showKey": "Licentiesleutel tonen", "license.hideKey": "Licentiesleutel verbergen",
      "license.product": "Product", "license.customer": "Licentiehouder", "license.purchasedAt": "Gekocht op",
      "license.removeRemotePrompt": "Dit apparaat wordt gedeactiveerd en de licentieplek wordt vrijgemaakt. De lokale licentie wordt pas na bevestiging verwijderd.",
      "license.recoveryPrompt": "Kies het oude apparaat dat je wilt deactiveren door het nummer in te voeren:",
      "license.privacy": "Gekopieerde inhoud blijft lokaal. De sleutel gaat alleen bij activering naar Arcawands speciale licentieservice; inhoud en geschiedenis worden niet verzonden."
    },
    pl: {
      "license.help": "Po wykupieniu planu Lifetime otrzymasz klucz licencyjny e-mailem. Wklej go tutaj, aby aktywować Ultimate Clipboard Pro na tym komputerze.",
      "license.viewPlans": "Zobacz oferty", "license.chooseOffer": "Wybierz tę ofertę", "license.currentOffer": "Aktualna oferta", "license.activate": "Aktywuj licencję",
      "license.keyPlaceholder": "Wpisz tutaj klucz licencyjny",
      "license.showKey": "Pokaż klucz licencyjny", "license.hideKey": "Ukryj klucz licencyjny",
      "license.product": "Produkt", "license.customer": "Właściciel licencji", "license.purchasedAt": "Data zakupu",
      "license.removeRemotePrompt": "To urządzenie zostanie dezaktywowane, a miejsce licencji zwolnione. Lokalna licencja zostanie usunięta dopiero po potwierdzeniu.",
      "license.recoveryPrompt": "Wpisz numer starego urządzenia, które chcesz dezaktywować:",
      "license.privacy": "Skopiowane treści pozostają lokalne. Klucz trafia wyłącznie do dedykowanej usługi licencyjnej Arcawand podczas aktywacji; treści i historia nie są wysyłane."
    },
    tr: {
      "license.help": "Lifetime planına abone olduktan sonra lisans anahtarın e-postayla gönderilir. Ultimate Clipboard Pro'yu bu bilgisayarda etkinleştirmek için anahtarı buraya yapıştır.",
      "license.viewPlans": "Teklifleri gör", "license.chooseOffer": "Bu teklifi seç", "license.currentOffer": "Mevcut teklif", "license.activate": "Lisansı etkinleştir",
      "license.keyPlaceholder": "Lisans anahtarını buraya gir",
      "license.showKey": "Lisans anahtarını göster", "license.hideKey": "Lisans anahtarını gizle",
      "license.product": "Ürün", "license.customer": "Lisans sahibi", "license.purchasedAt": "Satın alma tarihi",
      "license.removeRemotePrompt": "Bu cihaz devre dışı bırakılacak ve lisans yuvası boşaltılacak. Yerel lisans yalnızca onaydan sonra kaldırılacak.",
      "license.recoveryPrompt": "Devre dışı bırakılacak eski cihazın numarasını gir:",
      "license.privacy": "Kopyalanan içerik yerelde kalır. Anahtar yalnızca etkinleştirmede Arcawand’ın özel lisans hizmetine gönderilir; içerik ve geçmiş gönderilmez."
    },
    ko: {
      "license.help": "Lifetime 플랜에 가입하면 이메일로 라이선스 키를 받게 됩니다. 이 컴퓨터에서 Ultimate Clipboard Pro를 활성화하려면 여기에 붙여넣으세요.",
      "license.viewPlans": "요금제 보기", "license.chooseOffer": "이 요금제 선택", "license.currentOffer": "현재 요금제", "license.activate": "라이선스 활성화",
      "license.keyPlaceholder": "여기에 라이선스 키 입력",
      "license.showKey": "라이선스 키 표시", "license.hideKey": "라이선스 키 숨기기",
      "license.product": "제품", "license.customer": "라이선스 소유자", "license.purchasedAt": "구매일",
      "license.removeRemotePrompt": "이 기기가 비활성화되고 라이선스 자리가 확보됩니다. 로컬 라이선스는 확인 후에만 삭제됩니다.",
      "license.recoveryPrompt": "비활성화할 이전 기기의 번호를 입력하세요:",
      "license.privacy": "복사한 콘텐츠는 로컬에 남습니다. 키는 활성화 시 Arcawand 전용 라이선스 서비스에만 전송되며 콘텐츠와 기록은 전송되지 않습니다."
    },
    hi: {
      "license.help": "Lifetime प्लान लेने के बाद आपको ईमेल से लाइसेंस कुंजी मिलेगी। इस कंप्यूटर पर Ultimate Clipboard Pro सक्रिय करने के लिए उसे यहाँ पेस्ट करें।",
      "license.viewPlans": "ऑफ़र देखें", "license.chooseOffer": "यह ऑफ़र चुनें", "license.currentOffer": "मौजूदा ऑफ़र", "license.activate": "लाइसेंस सक्रिय करें",
      "license.keyPlaceholder": "यहाँ अपनी लाइसेंस कुंजी दर्ज करें",
      "license.showKey": "लाइसेंस कुंजी दिखाएँ", "license.hideKey": "लाइसेंस कुंजी छिपाएँ",
      "license.product": "उत्पाद", "license.customer": "लाइसेंस धारक", "license.purchasedAt": "खरीद की तारीख",
      "license.removeRemotePrompt": "यह डिवाइस निष्क्रिय होगा और लाइसेंस स्थान खाली किया जाएगा। स्थानीय लाइसेंस पुष्टि के बाद ही हटेगा।",
      "license.recoveryPrompt": "निष्क्रिय करने वाले पुराने डिवाइस का नंबर दर्ज करें:",
      "license.privacy": "कॉपी की गई सामग्री स्थानीय रहती है। कुंजी केवल सक्रियण के समय Arcawand की समर्पित लाइसेंस सेवा को भेजी जाती है; सामग्री और इतिहास नहीं भेजे जाते।"
    }
  });

  const LICENSE_INSPECTION_KEYS = [
    "license.inspectEyebrow", "license.inspectTitle", "license.inspectText", "license.inspectClose",
    "license.inspectActivate", "license.inspectMissingKey", "license.inspectConclusion",
    "license.inspectConclusionInvalid", "license.inspectConclusionActive", "license.inspectConclusionActivate",
    "license.inspectFunctional", "license.inspectYes", "license.inspectNo", "license.inspectLocalState",
    "license.inspectLocalActive", "license.inspectLocalInactive", "license.inspectCustomerEmail",
    "license.inspectExpiresAt", "license.inspectRenewsAt", "license.inspectUpdatedAt",
    "license.inspectSources", "license.inspectUnavailable", "license.inspectProductId",
    "license.inspectLicenseId", "license.inspectInstanceId", "license.inspectChecking",
    "license.activationInProgress"
  ];
  const LICENSE_INSPECTION_VALUES = Object.freeze({
    en: ["License check", "Check license", "Here is the information available for this license key.", "Close", "Activate license", "Enter a license key before checking it.", "Conclusion", "The license is not functional or is inactive.", "The license is functional and active on this computer.", "The license is functional, but is not active on this computer yet.", "Functional", "Yes", "No", "Local state", "Active on this computer", "To activate", "Customer email", "Expiration", "Renewal", "Updated", "API sources", "Unavailable", "Product ID", "License ID", "Activation ID", "Checking license…", "Activating license…"],
    fr: ["Vérification de licence", "Vérifier la licence", "Voici les informations disponibles pour cette clé de licence.", "Fermer", "Activer la licence", "Saisissez une clé de licence avant de la vérifier.", "Conclusion", "La licence n’est pas fonctionnelle ou est inactive.", "La licence est fonctionnelle et active sur cet ordinateur.", "La licence est fonctionnelle, mais pas encore active sur cet ordinateur.", "Fonctionnelle", "Oui", "Non", "État local", "Active sur cet ordinateur", "À activer", "E-mail client", "Expiration", "Renouvellement", "Mise à jour", "Sources API", "Non disponible", "ID produit", "ID licence", "ID activation", "Vérification de la licence…", "Activation de la licence…"],
    es: ["Comprobación de licencia", "Verificar licencia", "Esta es la información disponible para esta clave de licencia.", "Cerrar", "Activar licencia", "Introduce una clave antes de verificarla.", "Conclusión", "La licencia no funciona o está inactiva.", "La licencia funciona y está activa en este ordenador.", "La licencia funciona, pero aún no está activa en este ordenador.", "Funcional", "Sí", "No", "Estado local", "Activa en este ordenador", "Por activar", "Correo del cliente", "Caducidad", "Renovación", "Actualización", "Fuentes API", "No disponible", "ID de producto", "ID de licencia", "ID de activación", "Verificando la licencia…", "Activando la licencia…"],
    it: ["Verifica licenza", "Controlla la licenza", "Ecco le informazioni disponibili per questa chiave di licenza.", "Chiudi", "Attiva licenza", "Inserisci una chiave prima di verificarla.", "Conclusione", "La licenza non funziona o non è attiva.", "La licenza funziona ed è attiva su questo computer.", "La licenza funziona, ma non è ancora attiva su questo computer.", "Funzionante", "Sì", "No", "Stato locale", "Attiva su questo computer", "Da attivare", "E-mail cliente", "Scadenza", "Rinnovo", "Aggiornamento", "Fonti API", "Non disponibile", "ID prodotto", "ID licenza", "ID attivazione", "Verifica della licenza…", "Attivazione della licenza…"],
    de: ["Lizenzprüfung", "Lizenz prüfen", "Hier sind die verfügbaren Informationen zu diesem Lizenzschlüssel.", "Schließen", "Lizenz aktivieren", "Gib vor der Prüfung einen Lizenzschlüssel ein.", "Ergebnis", "Die Lizenz funktioniert nicht oder ist inaktiv.", "Die Lizenz funktioniert und ist auf diesem Computer aktiv.", "Die Lizenz funktioniert, ist auf diesem Computer aber noch nicht aktiv.", "Funktionsfähig", "Ja", "Nein", "Lokaler Status", "Auf diesem Computer aktiv", "Zu aktivieren", "Kunden-E-Mail", "Ablauf", "Verlängerung", "Aktualisiert", "API-Quellen", "Nicht verfügbar", "Produkt-ID", "Lizenz-ID", "Aktivierungs-ID", "Lizenz wird geprüft…", "Lizenz wird aktiviert…"],
    ro: ["Verificare licență", "Verifică licența", "Iată informațiile disponibile pentru această cheie de licență.", "Închide", "Activează licența", "Introdu o cheie înainte de verificare.", "Concluzie", "Licența nu este funcțională sau este inactivă.", "Licența funcționează și este activă pe acest computer.", "Licența funcționează, dar nu este încă activă pe acest computer.", "Funcțională", "Da", "Nu", "Stare locală", "Activă pe acest computer", "De activat", "E-mail client", "Expirare", "Reînnoire", "Actualizat", "Surse API", "Indisponibil", "ID produs", "ID licență", "ID activare", "Se verifică licența…", "Se activează licența…"],
    pt: ["Verificação da licença", "Verificar licença", "Aqui estão as informações disponíveis para esta chave de licença.", "Fechar", "Ativar licença", "Introduz uma chave antes de a verificar.", "Conclusão", "A licença não funciona ou está inativa.", "A licença funciona e está ativa neste computador.", "A licença funciona, mas ainda não está ativa neste computador.", "Funcional", "Sim", "Não", "Estado local", "Ativa neste computador", "Por ativar", "E-mail do cliente", "Expiração", "Renovação", "Atualização", "Fontes API", "Indisponível", "ID do produto", "ID da licença", "ID de ativação", "A verificar licença…", "A ativar licença…"],
    ar: ["فحص الترخيص", "التحقق من الترخيص", "هذه هي المعلومات المتاحة لمفتاح الترخيص هذا.", "إغلاق", "تفعيل الترخيص", "أدخل مفتاح ترخيص قبل التحقق منه.", "النتيجة", "الترخيص غير صالح أو غير نشط.", "الترخيص صالح ونشط على هذا الكمبيوتر.", "الترخيص صالح لكنه غير نشط بعد على هذا الكمبيوتر.", "صالح", "نعم", "لا", "الحالة المحلية", "نشط على هذا الكمبيوتر", "بانتظار التفعيل", "بريد العميل", "انتهاء الصلاحية", "التجديد", "آخر تحديث", "مصادر API", "غير متاح", "معرّف المنتج", "معرّف الترخيص", "معرّف التفعيل", "جارٍ التحقق من الترخيص…", "جارٍ تفعيل الترخيص…"],
    zh: ["许可证检查", "检查许可证", "以下是此许可证密钥的可用信息。", "关闭", "激活许可证", "请先输入许可证密钥再检查。", "结论", "许可证无效或未启用。", "许可证有效且已在此电脑上激活。", "许可证有效，但尚未在此电脑上激活。", "有效", "是", "否", "本地状态", "已在此电脑激活", "待激活", "客户邮箱", "到期时间", "续订时间", "更新时间", "API 来源", "不可用", "产品 ID", "许可证 ID", "激活 ID", "正在检查许可证…", "正在激活许可证…"],
    ja: ["ライセンス確認", "ライセンスを確認", "このライセンスキーで利用できる情報です。", "閉じる", "ライセンスを有効化", "確認する前にライセンスキーを入力してください。", "結果", "ライセンスは無効または停止中です。", "ライセンスは有効で、このパソコンで使用中です。", "ライセンスは有効ですが、このパソコンではまだ使用されていません。", "有効", "はい", "いいえ", "ローカル状態", "このパソコンで有効", "有効化待ち", "顧客メール", "有効期限", "更新", "更新日時", "API ソース", "利用不可", "製品 ID", "ライセンス ID", "有効化 ID", "ライセンスを確認中…", "ライセンスを有効化中…"],
    ru: ["Проверка лицензии", "Проверить лицензию", "Доступная информация об этом лицензионном ключе.", "Закрыть", "Активировать лицензию", "Введите лицензионный ключ перед проверкой.", "Результат", "Лицензия не работает или неактивна.", "Лицензия работает и активна на этом компьютере.", "Лицензия работает, но ещё не активна на этом компьютере.", "Работает", "Да", "Нет", "Локальный статус", "Активна на этом компьютере", "Требует активации", "E-mail клиента", "Истечение", "Продление", "Обновлено", "Источники API", "Недоступно", "ID продукта", "ID лицензии", "ID активации", "Проверка лицензии…", "Активация лицензии…"],
    nl: ["Licentiecontrole", "Licentie controleren", "Dit is de beschikbare informatie voor deze licentiesleutel.", "Sluiten", "Licentie activeren", "Voer een licentiesleutel in voordat je deze controleert.", "Conclusie", "De licentie werkt niet of is inactief.", "De licentie werkt en is actief op deze computer.", "De licentie werkt, maar is nog niet actief op deze computer.", "Werkend", "Ja", "Nee", "Lokale status", "Actief op deze computer", "Te activeren", "E-mail klant", "Vervaldatum", "Verlenging", "Bijgewerkt", "API-bronnen", "Niet beschikbaar", "Product-ID", "Licentie-ID", "Activerings-ID", "Licentie controleren…", "Licentie activeren…"],
    pl: ["Sprawdzanie licencji", "Sprawdź licencję", "Oto dostępne informacje o tym kluczu licencyjnym.", "Zamknij", "Aktywuj licencję", "Wprowadź klucz licencyjny przed sprawdzeniem.", "Wniosek", "Licencja nie działa lub jest nieaktywna.", "Licencja działa i jest aktywna na tym komputerze.", "Licencja działa, ale nie jest jeszcze aktywna na tym komputerze.", "Działa", "Tak", "Nie", "Stan lokalny", "Aktywna na tym komputerze", "Do aktywacji", "E-mail klienta", "Wygaśnięcie", "Odnowienie", "Zaktualizowano", "Źródła API", "Niedostępne", "ID produktu", "ID licencji", "ID aktywacji", "Sprawdzanie licencji…", "Aktywowanie licencji…"],
    tr: ["Lisans kontrolü", "Lisansı kontrol et", "Bu lisans anahtarı için mevcut bilgiler burada.", "Kapat", "Lisansı etkinleştir", "Kontrol etmeden önce bir lisans anahtarı gir.", "Sonuç", "Lisans çalışmıyor veya etkin değil.", "Lisans çalışıyor ve bu bilgisayarda etkin.", "Lisans çalışıyor ancak bu bilgisayarda henüz etkin değil.", "Çalışıyor", "Evet", "Hayır", "Yerel durum", "Bu bilgisayarda etkin", "Etkinleştirilecek", "Müşteri e-postası", "Son kullanma", "Yenileme", "Güncellendi", "API kaynakları", "Kullanılamaz", "Ürün kimliği", "Lisans kimliği", "Etkinleştirme kimliği", "Lisans kontrol ediliyor…", "Lisans etkinleştiriliyor…"],
    ko: ["라이선스 확인", "라이선스 검사", "이 라이선스 키에 사용할 수 있는 정보입니다.", "닫기", "라이선스 활성화", "확인하기 전에 라이선스 키를 입력하세요.", "결론", "라이선스가 작동하지 않거나 비활성 상태입니다.", "라이선스가 정상이며 이 컴퓨터에서 활성화되어 있습니다.", "라이선스가 정상하지만 이 컴퓨터에서는 아직 활성화되지 않았습니다.", "정상 작동", "예", "아니요", "로컬 상태", "이 컴퓨터에서 활성", "활성화 필요", "고객 이메일", "만료", "갱신", "업데이트", "API 소스", "사용 불가", "제품 ID", "라이선스 ID", "활성화 ID", "라이선스 확인 중…", "라이선스 활성화 중…"],
    hi: ["लाइसेंस जाँच", "लाइसेंस जाँचें", "इस लाइसेंस कुंजी की उपलब्ध जानकारी यहाँ है।", "बंद करें", "लाइसेंस सक्रिय करें", "जाँचने से पहले लाइसेंस कुंजी दर्ज करें।", "निष्कर्ष", "लाइसेंस काम नहीं कर रहा या निष्क्रिय है।", "लाइसेंस काम कर रहा है और इस कंप्यूटर पर सक्रिय है।", "लाइसेंस काम कर रहा है, लेकिन इस कंप्यूटर पर अभी सक्रिय नहीं है।", "काम कर रहा", "हाँ", "नहीं", "स्थानीय स्थिति", "इस कंप्यूटर पर सक्रिय", "सक्रिय करना है", "ग्राहक ईमेल", "समाप्ति", "नवीनीकरण", "अपडेट", "API स्रोत", "उपलब्ध नहीं", "उत्पाद ID", "लाइसेंस ID", "सक्रियण ID", "लाइसेंस की जाँच हो रही है…", "लाइसेंस सक्रिय हो रहा है…"]
  });

  function licenseInspectionCopy(language = "en") {
    const values = LICENSE_INSPECTION_VALUES[language] || LICENSE_INSPECTION_VALUES.en;
    return Object.fromEntries(LICENSE_INSPECTION_KEYS.map((key, index) => [key, values[index]]));
  }

  function translate(key, params = {}, language = "en") {
    const locales = global.MCP_LOCALES || {};
    const dictionary = locales[language] || locales.en || {};
    const fallback = locales.en || {};
    const enhancements = LICENSE_ENHANCEMENTS[language] || LICENSE_ENHANCEMENTS.en;
    const inspection = licenseInspectionCopy(language);
    let value = enhancements[key] || LICENSE_ENHANCEMENTS.en[key] || inspection[key] || dictionary[key] || fallback[key] || key;
    Object.keys(params || {}).forEach((name) => {
      value = value.replaceAll(`{${name}}`, String(params[name]));
    });
    return repairMojibake(value);
  }

  function translateCategoryName(category, language = "en") {
    if (!category) return "";
    if (category.customName) return repairMojibake(category.name);
    const cacheKey = `${language}:${category.id}`;
    if (DEFAULT_CATEGORY_NAME_CACHE.has(cacheKey)) return DEFAULT_CATEGORY_NAME_CACHE.get(cacheKey);
    const translatedCategory = CATEGORY_TRANSLATIONS[category.id]?.[language];
    if (translatedCategory) return cacheDefaultCategoryName(cacheKey, repairMojibake(translatedCategory));
    if (category.id === "vault" || category.id === "image-vault" || category.id === "dev-vault") {
      return cacheDefaultCategoryName(cacheKey, translate("vault.title", {}, language));
    }
    const key = `category.${category.id}`;
    const translated = translate(key, {}, language);
    if (translated !== key) return cacheDefaultCategoryName(cacheKey, translated);
    if (isDefaultLibraryCategory(category)) {
      const fallback = translatedSlugLabel(category, language);
      if (fallback) return cacheDefaultCategoryName(cacheKey, fallback);
    }
    if (category.isSystem || category.isDefault) {
      if (category.id === "general") return translate("categories.general", {}, language);
      if (category.id === "favorites") return translate("categories.favorites", {}, language);
      if (category.id === "trash") return translate("trash.title", {}, language);
      if (category.id === "vault" || category.id === "image-vault" || category.id === "dev-vault") return translate("vault.title", {}, language);
    }
    return repairMojibake(CATEGORY_TRANSLATIONS[category.id]?.en || category.name);
  }

  const DEFAULT_CATEGORY_NAME_CACHE = new Map();
  let defaultCategoryIdCache = null;

  function cacheDefaultCategoryName(key, value) {
    if (DEFAULT_CATEGORY_NAME_CACHE.size > 5000) DEFAULT_CATEGORY_NAME_CACHE.clear();
    DEFAULT_CATEGORY_NAME_CACHE.set(key, value);
    return value;
  }

  function isDefaultLibraryCategory(category) {
    if (!defaultCategoryIdCache) {
      defaultCategoryIdCache = new Set([
        ...(global.MCP?.DEFAULT_CATEGORIES || []),
        ...(global.MCP?.DEFAULT_IMAGE_CATEGORIES || []),
        ...(global.MCP?.DEFAULT_DEV_CATEGORIES || [])
      ].map((item) => item.id));
    }
    return defaultCategoryIdCache.has(category.id);
  }

  function translatedSlugLabel(category, language) {
    const categoryId = String(category.id || "");
    const parentPrefix = category.parentId ? `${category.parentId}-` : "";
    const localId = parentPrefix && categoryId.startsWith(parentPrefix)
      ? categoryId.slice(parentPrefix.length)
      : categoryId.replace(/^(image|dev)-/, "");
    const tokens = localId.split("-").filter(Boolean);
    const dictionary = SLUG_LABELS[language] || SLUG_LABELS.en;
    const translatedTokens = tokens.map((token) => dictionary[token] || SLUG_LABELS.en[token] || titleFromSlug(token));
    if (!translatedTokens.length) return titleFromSlug(category.name);
    const result = repairMojibake(translatedTokens.length === 1 ? translatedTokens[0] : translatedTokens.join(" "));
    const sourceName = repairMojibake(category.name);
    return result.localeCompare(sourceName, undefined, { sensitivity: "accent" }) === 0 ? sourceName : result;
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

  const DATE_FORMAT_VALUES = new Set(["dmy", "mdy", "ymd"]);
  const TIME_FORMAT_VALUES = new Set(["auto", "h12", "h24"]);
  const dateTimeFormatterCache = new Map();
  let dateTimeSettings = Object.freeze({ dateFormat: "dmy", timeFormat: "auto", timeZone: "auto" });
  let supportedTimeZoneCache = null;

  function supportedTimeZones() {
    if (supportedTimeZoneCache) return [...supportedTimeZoneCache];
    let zones = [];
    try {
      zones = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [];
    } catch (error) {
      zones = [];
    }
    supportedTimeZoneCache = [...new Set(["UTC", ...zones])];
    return [...supportedTimeZoneCache];
  }

  function validTimeZone(value) {
    if (!value || value === "auto") return "auto";
    try {
      new Intl.DateTimeFormat("en", { timeZone: value }).format(0);
      return value;
    } catch (error) {
      return "auto";
    }
  }

  function normalizeDateTimePreferences(settings = {}) {
    return {
      dateFormat: DATE_FORMAT_VALUES.has(settings.dateFormat) ? settings.dateFormat : preferredNumericDateFormat(settings.language),
      timeFormat: TIME_FORMAT_VALUES.has(settings.timeFormat) ? settings.timeFormat : "auto",
      timeZone: validTimeZone(settings.timeZone)
    };
  }

  function preferredNumericDateFormat(language = "en") {
    try {
      const order = new Intl.DateTimeFormat(resolveDateLocale(language), {
        year: "numeric", month: "2-digit", day: "2-digit"
      }).formatToParts(new Date(2001, 10, 22))
        .map((part) => part.type)
        .filter((type) => ["year", "month", "day"].includes(type));
      if (order[0] === "year") return "ymd";
      return order[0] === "month" ? "mdy" : "dmy";
    } catch (error) {
      return "dmy";
    }
  }

  function configureDateTimeFormatting(settings = {}) {
    dateTimeSettings = Object.freeze(normalizeDateTimePreferences(settings));
    dateTimeFormatterCache.clear();
    return dateTimeSettings;
  }

  function resolvedDateTimePreferences(overrides = {}) {
    return normalizeDateTimePreferences(Object.assign({}, dateTimeSettings, overrides || {}));
  }

  function resolvedFormattingTimeZone(preferences) {
    return preferences.timeZone === "auto" ? resolveLocalTimeZone() : preferences.timeZone;
  }

  function cachedDateTimeFormatter(locale, options) {
    const key = `${locale}|${JSON.stringify(options)}`;
    if (!dateTimeFormatterCache.has(key)) {
      if (dateTimeFormatterCache.size >= 48) dateTimeFormatterCache.clear();
      dateTimeFormatterCache.set(key, new Intl.DateTimeFormat(locale, options));
    }
    return dateTimeFormatterCache.get(key);
  }

  function timeCycleOptions(preferences) {
    if (preferences.timeFormat === "h12") return { hour12: true };
    if (preferences.timeFormat === "h24") return { hourCycle: "h23" };
    return {};
  }

  function validDate(timestamp) {
    if (timestamp === null || timestamp === undefined || timestamp === "") return null;
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function customNumericDate(date, locale, preferences) {
    const parts = cachedDateTimeFormatter(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: resolvedFormattingTimeZone(preferences)
    }).formatToParts(date);
    const values = Object.fromEntries(parts.filter((part) => ["year", "month", "day"].includes(part.type)).map((part) => [part.type, part.value]));
    if (preferences.dateFormat === "ymd") return `${values.year}-${values.month}-${values.day}`;
    if (preferences.dateFormat === "mdy") return `${values.month}/${values.day}/${values.year}`;
    return `${values.day}/${values.month}/${values.year}`;
  }

  function formatLocalizedDateOnly(timestamp, language = "en", overrides = {}) {
    const date = validDate(timestamp);
    if (!date) return translate("dates.unknown", {}, language);
    const preferences = resolvedDateTimePreferences(overrides);
    const locale = resolveDateLocale(language);
    try {
      return customNumericDate(date, locale, preferences);
    } catch (error) {
      return date.toISOString().slice(0, 10);
    }
  }

  function formatLocalizedTime(timestamp, language = "en", overrides = {}) {
    const date = validDate(timestamp);
    if (!date) return translate("dates.unknown", {}, language);
    const preferences = resolvedDateTimePreferences(overrides);
    try {
      return cachedDateTimeFormatter(resolveDateLocale(language), Object.assign({
        hour: "2-digit",
        minute: "2-digit",
        timeZone: resolvedFormattingTimeZone(preferences)
      }, timeCycleOptions(preferences))).format(date);
    } catch (error) {
      return date.toISOString().slice(11, 16);
    }
  }

  function formatLocalizedDatePart(timestamp, options = {}, language = "en", overrides = {}) {
    const date = validDate(timestamp);
    if (!date) return translate("dates.unknown", {}, language);
    const preferences = resolvedDateTimePreferences(overrides);
    try {
      return cachedDateTimeFormatter(resolveDateLocale(language), Object.assign({}, options, {
        timeZone: resolvedFormattingTimeZone(preferences)
      })).format(date);
    } catch (error) {
      return formatLocalizedDateOnly(date, language, preferences);
    }
  }

  function formatDate(timestamp, language = "en", overrides = {}) {
    const date = validDate(timestamp);
    if (!date) return translate("dates.unknown", {}, language);
    const preferences = resolvedDateTimePreferences(overrides);
    const locale = resolveDateLocale(language);
    try {
      return `${customNumericDate(date, locale, preferences)}, ${formatLocalizedTime(date, language, preferences)}`;
    } catch (error) {
      return `${date.toISOString().slice(0, 10)}, ${date.toISOString().slice(11, 16)}`;
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
      it: "it-IT",
      ro: "ro-RO",
      pt: "pt-PT",
      ar: "ar",
      zh: "zh-CN",
      ja: "ja-JP",
      ru: "ru-RU",
      nl: "nl-NL",
      pl: "pl-PL",
      tr: "tr-TR",
      ko: "ko-KR",
      hi: "hi-IN"
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
    applyLanguageMetadata,
    t: translate,
    translateCategoryName,
    repairMojibake,
    resolveDateLocale,
    resolveLocalTimeZone,
    supportedTimeZones,
    normalizeDateTimePreferences,
    preferredNumericDateFormat,
    configureDateTimeFormatting,
    formatLocalizedDateOnly,
    formatLocalizedTime,
    formatLocalizedDatePart,
    formatLocalizedDate: formatDate
  });
})(globalThis);
