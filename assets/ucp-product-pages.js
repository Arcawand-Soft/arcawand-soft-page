(() => {
  const supportedLangs = ["en", "fr", "es", "it", "de"];
  const labels = {
    en: { presentation: "Presentation", demo: "Demo", faq: "FAQ", privacy: "Privacy policy", terms: "Terms of use", contact: "Contact" },
    fr: { presentation: "Présentation", demo: "Démo", faq: "FAQ", privacy: "Politique de confidentialité", terms: "CGU", contact: "Contact" },
    es: { presentation: "Presentación", demo: "Demo", faq: "FAQ", privacy: "Política de privacidad", terms: "Términos de uso", contact: "Contacto" },
    it: { presentation: "Presentazione", demo: "Demo", faq: "FAQ", privacy: "Informativa privacy", terms: "Termini d’uso", contact: "Contatto" },
    de: { presentation: "Präsentation", demo: "Demo", faq: "FAQ", privacy: "Datenschutz", terms: "Nutzungsbedingungen", contact: "Kontakt" }
  };
  const languageButtonLabels = {
    en: "Change language",
    fr: "Changer de langue",
    es: "Cambiar idioma",
    it: "Cambia lingua",
    de: "Sprache wechseln"
  };
  const routes = {
    en: {
      presentation: "https://arcawand-soft.com/ultimate-clipboard-pro/",
      demo: "https://arcawand-soft.com/ultimate-clipboard-pro/demo/",
      faq: "https://arcawand-soft.com/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/ultimate-clipboard-pro/terms/",
      contact: "https://arcawand-soft.com/contact/"
    },
    fr: {
      presentation: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/",
      demo: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/demo/",
      faq: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/fr/ultimate-clipboard-pro/terms/",
      contact: "https://arcawand-soft.com/fr/contact/"
    },
    es: {
      presentation: "https://arcawand-soft.com/es/ultimate-clipboard-pro/",
      demo: "https://arcawand-soft.com/es/ultimate-clipboard-pro/demo/",
      faq: "https://arcawand-soft.com/es/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/es/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/es/ultimate-clipboard-pro/terms/",
      contact: "https://arcawand-soft.com/es/contact/"
    },
    it: {
      presentation: "https://arcawand-soft.com/it/ultimate-clipboard-pro/",
      demo: "https://arcawand-soft.com/it/ultimate-clipboard-pro/demo/",
      faq: "https://arcawand-soft.com/it/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/it/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/it/ultimate-clipboard-pro/terms/",
      contact: "https://arcawand-soft.com/it/contact/"
    },
    de: {
      presentation: "https://arcawand-soft.com/de/ultimate-clipboard-pro/",
      demo: "https://arcawand-soft.com/de/ultimate-clipboard-pro/demo/",
      faq: "https://arcawand-soft.com/de/ultimate-clipboard-pro/faq/",
      privacy: "https://arcawand-soft.com/de/ultimate-clipboard-pro/privacy/",
      terms: "https://arcawand-soft.com/de/ultimate-clipboard-pro/terms/",
      contact: "https://arcawand-soft.com/de/contact/"
    }
  };

  function getLangFromPath() {
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    return supportedLangs.includes(first) ? first : "en";
  }

  function getProductPage() {
    const path = window.location.pathname;
    if (path.includes("/ultimate-clipboard-pro/demo")) return "demo";
    if (path.includes("/ultimate-clipboard-pro/faq")) return "faq";
    if (path.includes("/ultimate-clipboard-pro/privacy")) return "privacy";
    if (path.includes("/ultimate-clipboard-pro/terms")) return "terms";
    return "presentation";
  }

  function setupLanguageMenu() {
    const menu = document.querySelector(".arcawand-product-language-menu");
    if (!menu || menu.dataset.languageMenuReady === "true") return;
    menu.dataset.languageMenuReady = "true";
    const button = menu.querySelector(".language-menu-button");
    const panel = menu.querySelector(".language-menu-panel");
    const lang = getLangFromPath();
    const languageLabel = languageButtonLabels[lang] || languageButtonLabels.en;
    if (button && !button.getAttribute("aria-label")) button.setAttribute("aria-label", languageLabel);
    if (panel && (!panel.getAttribute("aria-label") || panel.getAttribute("aria-label") === "Language")) {
      panel.setAttribute("aria-label", languageLabel);
    }
    const close = () => {
      menu.classList.remove("is-open");
      button?.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      document.querySelectorAll(".language-menu.is-open").forEach((node) => {
        if (node !== menu) node.classList.remove("is-open");
      });
      menu.classList.add("is-open");
      button?.setAttribute("aria-expanded", "true");
    };

    const toggleMenu = () => {
      if (menu.classList.contains("is-open")) close();
      else openMenu();
    };

    button?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      toggleMenu();
    });

    panel?.addEventListener("click", (event) => {
      event.stopPropagation();
      const option = event.target.closest("[data-lang]");
      if (!option) return;
      event.preventDefault();
      const next = option.dataset.lang;
      const page = getProductPage();
      try {
        localStorage.setItem("arcawand-lang", next);
        localStorage.setItem("ucp-lang", next);
      } catch (error) {}
      window.location.href = routes[next]?.[page] || routes.en.presentation;
    });

    document.addEventListener("pointerdown", (event) => {
      if (!event.target.closest(".arcawand-product-language-menu")) close();
    }, true);
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".arcawand-product-language-menu")) close();
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  const productLandingFaqItems = {
  "en": [
    [
      "I already copy and paste every day. Why would I need Ultimate Clipboard Pro?",
      "Because the normal clipboard is temporary. Ultimate Clipboard Pro turns the things you copy into a structured workspace: text, code and images stay available, searchable and ready to reuse instead of disappearing after the next copy."
    ],
    [
      "Who is this extension really for?",
      "It is for demanding users who collect useful information while browsing: AI users saving prompts and answers, developers keeping snippets, researchers gathering sources, creators preparing content, marketers reusing copy and anyone who hates losing valuable copied material."
    ],
    [
      "How is it different from a basic clipboard history?",
      "A basic history is usually a long timeline. Ultimate Clipboard Pro gives you dedicated workspaces for text, code and images, plus titles, categories, source URLs, notes, favorites, pins, visual source history, advanced search and Pro workflows such as versioning and montage."
    ],
    [
      "What can I capture with it?",
      "You can capture text, code, images, screenshots and, when available, web pages in Markdown. The extension is designed to cover the real material users copy every day, not only plain text."
    ],
    [
      "Does it capture code intelligently?",
      "Yes. Code captures are treated separately from normal text and can keep useful context such as language, source and classification. For developers and technical users, this makes snippets much easier to find and reuse later."
    ],
    [
      "What happens after I copy something useful?",
      "The capture can appear in the floating launcher, the side panel and the full manager. From there you can use it again, classify it, favorite it, pin it, search it or keep working without breaking your browsing flow."
    ],
    [
      "Can I organize captures instead of scrolling through a huge list?",
      "Yes. You can use categories and subcategories, separate text/code/image spaces, favorites, pinned items, trash and vault workflows. The goal is to make your copied material feel organized, not buried."
    ],
    [
      "How fast can I find something later?",
      "Search is built for real retrieval. It can use capture content plus useful metadata such as titles, notes, source domains and URLs. This means you can search by what you copied, where it came from or how you described it."
    ],
    [
      "Can it help me remember where a capture came from?",
      "Yes. Source context is one of the strongest advantages of the product. Captures can keep page information and source URLs, and the visual source history helps you return to the origin of what you saved."
    ],
    [
      "Why are titles and notes useful?",
      "Titles and notes let you turn a raw capture into something meaningful. Instead of recognizing a snippet by chance, you can name it, describe it and make it much easier to find again weeks later."
    ],
    [
      "What is versioning used for?",
      "Versioning lets Pro users keep several versions of the same text or code capture inside one item. It is ideal for prompts, replies, snippets, drafts and improvements where you want evolution without duplicate clutter."
    ],
    [
      "What is capture montage?",
      "Montage lets you assemble several text captures into one clean combined text. It is useful for preparing prompts, reports, summaries, briefs, research notes or reusable content blocks."
    ],
    [
      "What about image captures and screenshots?",
      "Ultimate Clipboard Pro is not limited to text. Image captures and screenshots can be kept, organized and reused in the same productivity logic, with their own workspace and controls."
    ],
    [
      "Is my content private?",
      "The extension is designed with a local-first philosophy. Normal capture management happens in the browser extension environment on your device. Optional services such as Google Drive sync, payment and licensing are separated and used only for their specific purpose."
    ],
    [
      "Do I have to use Google Drive?",
      "No. Google Drive sync is optional. You can work locally and use local export/restore. Drive sync is for users who want a cloud backup and restore path across their own Google account."
    ],
    [
      "What can I do with the free version?",
      "The free version lets you understand the workflow with limited captures and a smaller tool set. It is useful for trying the product and seeing how much value a structured clipboard workspace brings to your day."
    ],
    [
      "Why upgrade to Pro?",
      "Pro is for daily use. It unlocks unlimited captures, vault access, trash recovery, versioning, montage, more tools, advanced workflows and optional Google Drive sync. If the extension becomes part of your workday, Pro removes the friction."
    ],
    [
      "What should I try first after installing?",
      "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history."
    ],
    [
      "Will it slow down my browsing?",
      "The extension is built to stay close to your workflow without taking over the page. The floating launcher gives quick access, and the full manager opens when you need deeper organization."
    ],
    [
      "How can I contact the developer?",
      "You can contact ArcaWand Soft at contact@arcawand-soft.com for support, privacy questions, product feedback or business requests."
    ]
  ],
  "fr": [
    [
      "Je copie-colle déjà tous les jours. Pourquoi aurais-je besoin d’Ultimate Clipboard Pro ?",
      "Parce que le presse-papier classique est temporaire. Ultimate Clipboard Pro transforme ce que vous copiez en véritable espace de travail : textes, codes et images restent disponibles, recherchables et prêts à être réutilisés au lieu de disparaître au prochain copier."
    ],
    [
      "À qui s’adresse vraiment cette extension ?",
      "Elle s’adresse aux utilisateurs exigeants qui collectent de l’information utile en naviguant : utilisateurs d’IA, développeurs, chercheurs, créateurs, marketeurs, rédacteurs et tous ceux qui ne veulent plus perdre du contenu copié important."
    ],
    [
      "Quelle est la différence avec un simple historique de presse-papier ?",
      "Un historique classique est souvent une longue liste chronologique. Ultimate Clipboard Pro propose des espaces séparés pour textes, codes et images, avec titres, catégories, URLs sources, notes, favoris, épingles, historique visuel des sources, recherche avancée et workflows Pro comme le versioning et le montage."
    ],
    [
      "Que puis-je capturer ?",
      "Vous pouvez capturer des textes, du code, des images, des captures d’écran et, lorsque disponible, des pages web en Markdown. L’extension couvre les contenus réellement copiés au quotidien, pas seulement du texte brut."
    ],
    [
      "La capture de code est-elle vraiment adaptée aux développeurs ?",
      "Oui. Les captures de code sont traitées séparément du texte classique et peuvent conserver un contexte utile comme le langage, la source et le classement. Les snippets deviennent beaucoup plus faciles à retrouver et réutiliser."
    ],
    [
      "Que se passe-t-il après avoir copié quelque chose d’utile ?",
      "La capture peut apparaître dans le launcher flottant, la fenêtre latérale et le gestionnaire complet. Vous pouvez ensuite la réutiliser, la classer, la mettre en favori, l’épingler, la rechercher ou continuer à travailler sans casser votre navigation."
    ],
    [
      "Puis-je organiser mes captures au lieu de parcourir une énorme liste ?",
      "Oui. Vous pouvez utiliser catégories et sous-catégories, espaces texte/code/image, favoris, épingles, corbeille et coffre-fort. L’objectif est que vos captures soient rangées, pas enterrées."
    ],
    [
      "À quelle vitesse puis-je retrouver une capture plus tard ?",
      "La recherche est pensée pour retrouver vite. Elle peut utiliser le contenu, les titres, les notes, les domaines sources et les URLs. Vous pouvez donc chercher par ce que vous avez copié, par sa provenance ou par la façon dont vous l’avez nommé."
    ],
    [
      "L’extension peut-elle m’aider à retrouver la page d’origine ?",
      "Oui. Le contexte source est un avantage majeur. Les captures peuvent garder les informations de page et les URLs sources, et l’historique visuel des sources aide à revenir à l’origine de ce que vous avez sauvegardé."
    ],
    [
      "À quoi servent les titres et les notes ?",
      "Les titres et notes transforment une capture brute en élément compréhensible. Vous ne dépendez plus d’un souvenir vague : vous nommez, décrivez et retrouvez plus facilement vos captures, même longtemps après."
    ],
    [
      "À quoi sert le versioning ?",
      "Le versioning permet aux utilisateurs Pro de conserver plusieurs versions d’une même capture texte ou code dans un seul item. C’est idéal pour prompts, réponses, snippets, brouillons et améliorations successives, sans créer de doublons confus."
    ],
    [
      "Qu’est-ce que le montage de captures ?",
      "Le montage permet d’assembler plusieurs captures de texte en un seul texte propre. C’est utile pour préparer prompts, rapports, synthèses, briefs, notes de recherche ou blocs de contenu réutilisables."
    ],
    [
      "Et pour les images et captures d’écran ?",
      "Ultimate Clipboard Pro ne se limite pas au texte. Les images et captures d’écran peuvent être conservées, organisées et réutilisées avec leur propre espace de travail et leurs contrôles dédiés."
    ],
    [
      "Mes contenus restent-ils privés ?",
      "L’extension suit une philosophie local-first. La gestion normale des captures se fait dans l’environnement de l’extension sur votre appareil. Les services optionnels comme Google Drive, paiement et licence restent séparés et ne servent qu’à leur fonction précise."
    ],
    [
      "Google Drive est-il obligatoire ?",
      "Non. La synchronisation Google Drive est optionnelle. Vous pouvez travailler localement avec export et restauration locale. Drive sert aux utilisateurs qui veulent une sauvegarde cloud via leur propre compte Google."
    ],
    [
      "Que permet la version gratuite ?",
      "La version gratuite permet de comprendre le workflow avec des limites de captures et un ensemble d’outils réduit. Elle est idéale pour tester l’intérêt d’un espace de presse-papier structuré."
    ],
    [
      "Pourquoi passer à Pro ?",
      "Pro est pensé pour l’usage quotidien. Il débloque les captures illimitées, le coffre-fort, la corbeille, le versioning, le montage, davantage d’outils, des workflows avancés et la synchronisation Google Drive optionnelle. Si l’extension entre dans votre routine, Pro enlève les limites."
    ],
    [
      "Que tester en premier après l’installation ?",
      "Capturez un texte utile, un extrait de code et une image. Ouvrez ensuite le gestionnaire, ajoutez un titre, classez un item, recherchez par source et réutilisez une capture. Cette première boucle montre immédiatement la différence avec un simple historique."
    ],
    [
      "L’extension risque-t-elle de ralentir ma navigation ?",
      "Elle est conçue pour rester proche de votre flux de travail sans prendre le contrôle de la page. Le launcher flottant donne un accès rapide, et le gestionnaire complet s’ouvre seulement quand vous voulez organiser plus finement."
    ],
    [
      "Comment contacter le développeur ?",
      "Vous pouvez contacter ArcaWand Soft à contact@arcawand-soft.com pour le support, la confidentialité, les retours produit ou les demandes professionnelles."
    ]
  ],
  "es": [
    [
      "Ya copio y pego todos los días. ¿Por qué necesitaría Ultimate Clipboard Pro?",
      "Porque el portapapeles normal es temporal. Ultimate Clipboard Pro convierte lo que copias en un espacio de trabajo estructurado: texto, código e imágenes quedan disponibles, buscables y listos para reutilizar."
    ],
    [
      "¿Para quién está pensada realmente esta extensión?",
      "Para usuarios exigentes que recopilan información útil mientras navegan: usuarios de IA, desarrolladores, investigadores, creadores, marketers, redactores y cualquiera que no quiera perder contenido copiado importante."
    ],
    [
      "¿En qué se diferencia de un historial de portapapeles básico?",
      "Un historial básico suele ser una lista cronológica. Ultimate Clipboard Pro separa texto, código e imágenes, y añade títulos, categorías, URLs de origen, notas, favoritos, fijados, historial visual de fuentes, búsqueda avanzada y flujos Pro como versionado y montaje."
    ],
    [
      "¿Qué puedo capturar?",
      "Puedes capturar texto, código, imágenes, capturas de pantalla y, cuando esté disponible, páginas web en Markdown. Está pensado para el material real que copias cada día, no solo texto plano."
    ],
    [
      "¿La captura de código es útil para desarrolladores?",
      "Sí. El código se trata por separado del texto normal y puede conservar contexto útil como lenguaje, fuente y clasificación. Así los snippets son mucho más fáciles de encontrar y reutilizar."
    ],
    [
      "¿Qué ocurre después de copiar algo útil?",
      "La captura puede aparecer en el launcher flotante, el panel lateral y el gestor completo. Desde ahí puedes reutilizarla, clasificarla, marcarla como favorita, fijarla, buscarla o seguir trabajando sin romper tu flujo."
    ],
    [
      "¿Puedo organizar mis capturas en lugar de recorrer una lista enorme?",
      "Sí. Puedes usar categorías, subcategorías, espacios separados para texto/código/imágenes, favoritos, fijados, papelera y bóveda. La idea es organizar tus capturas, no enterrarlas."
    ],
    [
      "¿Qué tan rápido puedo encontrar algo después?",
      "La búsqueda está pensada para recuperar información de verdad. Puede usar el contenido, títulos, notas, dominios de origen y URLs. Puedes buscar por lo copiado, por su procedencia o por cómo lo nombraste."
    ],
    [
      "¿Puede ayudarme a recordar de dónde venía una captura?",
      "Sí. El contexto de origen es una ventaja clave. Las capturas pueden conservar información de página y URL, y el historial visual de fuentes ayuda a volver al origen."
    ],
    [
      "¿Para qué sirven los títulos y las notas?",
      "Los títulos y notas convierten una captura en algo claro. En lugar de reconocer un fragmento por casualidad, puedes nombrarlo, describirlo y encontrarlo semanas después."
    ],
    [
      "¿Para qué sirve el versionado?",
      "El versionado permite a usuarios Pro guardar varias versiones de una misma captura de texto o código dentro de un solo item. Es ideal para prompts, respuestas, snippets, borradores y mejoras sucesivas sin duplicados confusos."
    ],
    [
      "¿Qué es el montaje de capturas?",
      "El montaje permite unir varias capturas de texto en un único texto limpio. Es útil para preparar prompts, informes, resúmenes, briefs, notas de investigación o bloques reutilizables."
    ],
    [
      "¿Y las imágenes y capturas de pantalla?",
      "Ultimate Clipboard Pro no se limita al texto. Las imágenes y capturas de pantalla pueden guardarse, organizarse y reutilizarse con su propio espacio de trabajo."
    ],
    [
      "¿Mi contenido es privado?",
      "La extensión sigue una filosofía local-first. La gestión normal ocurre en el entorno de la extensión en tu dispositivo. Servicios opcionales como Google Drive, pagos y licencias están separados y se usan solo para su función."
    ],
    [
      "¿Google Drive es obligatorio?",
      "No. Google Drive es opcional. Puedes trabajar localmente con exportación y restauración local. Drive es para quienes quieren una copia cloud en su propia cuenta Google."
    ],
    [
      "¿Qué puedo hacer con la versión gratuita?",
      "La versión gratuita permite entender el flujo con límites de capturas y menos herramientas. Es una buena forma de comprobar el valor de un portapapeles estructurado."
    ],
    [
      "¿Por qué pasar a Pro?",
      "Pro está pensado para uso diario. Desbloquea capturas ilimitadas, bóveda, papelera, versionado, montaje, más herramientas, flujos avanzados y sincronización opcional con Google Drive. Si la extensión entra en tu rutina, Pro elimina la fricción."
    ],
    [
      "¿Qué debería probar primero tras instalarla?",
      "Captura un texto útil, un snippet de código y una imagen. Luego abre el gestor, añade un título, clasifica un item, busca por fuente y reutiliza una captura. Ese primer ciclo muestra la diferencia."
    ],
    [
      "¿Puede ralentizar mi navegación?",
      "Está diseñada para estar cerca de tu flujo sin tomar el control de la página. El launcher flotante da acceso rápido y el gestor completo se abre cuando necesitas organizar mejor."
    ],
    [
      "¿Cómo contacto con el desarrollador?",
      "Puedes escribir a ArcaWand Soft en contact@arcawand-soft.com para soporte, privacidad, feedback del producto o solicitudes profesionales."
    ]
  ],
  "it": [
    [
      "Copio e incollo già ogni giorno. Perché dovrei usare Ultimate Clipboard Pro?",
      "Perché gli appunti normali sono temporanei. Ultimate Clipboard Pro trasforma ciò che copi in uno spazio strutturato: testi, codice e immagini restano disponibili, ricercabili e pronti da riutilizzare."
    ],
    [
      "A chi è destinata davvero questa estensione?",
      "A utenti esigenti che raccolgono informazioni utili durante la navigazione: utenti AI, sviluppatori, ricercatori, creator, marketer, copywriter e chiunque non voglia perdere contenuti copiati importanti."
    ],
    [
      "In cosa è diversa da una cronologia degli appunti?",
      "Una cronologia base è spesso una lunga lista. Ultimate Clipboard Pro separa testi, codice e immagini, aggiunge titoli, categorie, URL sorgente, note, preferiti, elementi fissati, cronologia visiva delle fonti, ricerca avanzata e flussi Pro come versioning e montaggio."
    ],
    [
      "Cosa posso catturare?",
      "Puoi catturare testi, codice, immagini, screenshot e, quando disponibile, pagine web in Markdown. È pensata per il materiale reale che copi ogni giorno, non solo testo semplice."
    ],
    [
      "La cattura del codice è utile per sviluppatori?",
      "Sì. Il codice viene trattato separatamente dal testo normale e può conservare contesto utile come linguaggio, fonte e classificazione. Gli snippet diventano molto più facili da trovare e riutilizzare."
    ],
    [
      "Cosa succede dopo aver copiato qualcosa di utile?",
      "La cattura può apparire nel launcher flottante, nel pannello laterale e nel gestore completo. Da lì puoi riutilizzarla, classificarla, aggiungerla ai preferiti, fissarla, cercarla o continuare a lavorare senza interrompere il flusso."
    ],
    [
      "Posso organizzare le catture invece di scorrere una lista enorme?",
      "Sì. Puoi usare categorie e sottocategorie, spazi separati per testo/codice/immagini, preferiti, elementi fissati, cestino e vault. L’obiettivo è ordinare le catture, non seppellirle."
    ],
    [
      "Quanto velocemente posso ritrovare qualcosa?",
      "La ricerca è pensata per il recupero reale. Può usare contenuto, titoli, note, domini sorgente e URL. Puoi cercare per ciò che hai copiato, da dove viene o come lo hai descritto."
    ],
    [
      "Può aiutarmi a ricordare da dove arrivava una cattura?",
      "Sì. Il contesto della fonte è un vantaggio importante. Le catture possono conservare informazioni della pagina e URL, e la cronologia visiva delle fonti aiuta a tornare all’origine."
    ],
    [
      "A cosa servono titoli e note?",
      "Titoli e note trasformano una cattura grezza in qualcosa di significativo. Puoi nominarla, descriverla e ritrovarla facilmente anche dopo settimane."
    ],
    [
      "A cosa serve il versioning?",
      "Il versioning permette agli utenti Pro di mantenere più versioni della stessa cattura di testo o codice in un solo item. È ideale per prompt, risposte, snippet, bozze e miglioramenti progressivi senza duplicati confusi."
    ],
    [
      "Cos’è il montaggio delle catture?",
      "Il montaggio permette di assemblare più catture di testo in un unico testo pulito. È utile per preparare prompt, report, sintesi, brief, note di ricerca o blocchi riutilizzabili."
    ],
    [
      "E per immagini e screenshot?",
      "Ultimate Clipboard Pro non si limita al testo. Immagini e screenshot possono essere salvati, organizzati e riutilizzati con il proprio spazio di lavoro."
    ],
    [
      "I miei contenuti restano privati?",
      "L’estensione segue una filosofia local-first. La gestione normale avviene nell’ambiente dell’estensione sul tuo dispositivo. Servizi opzionali come Google Drive, pagamenti e licenze sono separati e usati solo per la loro funzione."
    ],
    [
      "Google Drive è obbligatorio?",
      "No. Google Drive è opzionale. Puoi lavorare localmente con export e ripristino locale. Drive è per chi desidera una copia cloud nel proprio account Google."
    ],
    [
      "Cosa posso fare con la versione gratuita?",
      "La versione gratuita permette di capire il flusso con limiti di catture e meno strumenti. È un modo semplice per capire il valore di uno spazio appunti strutturato."
    ],
    [
      "Perché passare a Pro?",
      "Pro è pensata per l’uso quotidiano. Sblocca catture illimitate, vault, cestino, versioning, montaggio, più strumenti, flussi avanzati e sincronizzazione Google Drive opzionale. Se l’estensione entra nella tua routine, Pro elimina gli attriti."
    ],
    [
      "Cosa provare subito dopo l’installazione?",
      "Cattura un testo utile, uno snippet di codice e un’immagine. Poi apri il gestore, aggiungi un titolo, classifica un item, cerca per fonte e riutilizza una cattura. Quel primo ciclo mostra subito la differenza."
    ],
    [
      "Può rallentare la navigazione?",
      "È progettata per restare vicina al tuo flusso senza controllare la pagina. Il launcher flottante offre accesso rapido e il gestore completo si apre quando vuoi organizzare meglio."
    ],
    [
      "Come posso contattare lo sviluppatore?",
      "Puoi contattare ArcaWand Soft a contact@arcawand-soft.com per supporto, privacy, feedback sul prodotto o richieste professionali."
    ]
  ],
  "de": [
    [
      "Ich kopiere und füge jeden Tag ein. Warum brauche ich Ultimate Clipboard Pro?",
      "Weil die normale Zwischenablage nur vorübergehend ist. Ultimate Clipboard Pro macht aus kopierten Inhalten einen strukturierten Arbeitsbereich: Text, Code und Bilder bleiben verfügbar, durchsuchbar und wiederverwendbar."
    ],
    [
      "Für wen ist diese Erweiterung wirklich gedacht?",
      "Für anspruchsvolle Nutzer, die beim Browsen wertvolle Informationen sammeln: KI-Nutzer, Entwickler, Forscher, Creator, Marketer, Texter und alle, die wichtige kopierte Inhalte nicht verlieren wollen."
    ],
    [
      "Worin unterscheidet sie sich von einer einfachen Zwischenablage-Historie?",
      "Eine einfache Historie ist meist nur eine chronologische Liste. Ultimate Clipboard Pro trennt Text, Code und Bilder und ergänzt Titel, Kategorien, Quell-URLs, Notizen, Favoriten, Pins, visuelle Quellenhistorie, erweiterte Suche und Pro-Workflows wie Versionierung und Montage."
    ],
    [
      "Was kann ich erfassen?",
      "Sie können Text, Code, Bilder, Screenshots und, wenn verfügbar, Webseiten als Markdown erfassen. Die Erweiterung ist für das echte Material gedacht, das Nutzer täglich kopieren, nicht nur für reinen Text."
    ],
    [
      "Ist die Code-Erfassung für Entwickler geeignet?",
      "Ja. Code-Captures werden getrennt von normalem Text behandelt und können nützlichen Kontext wie Sprache, Quelle und Klassifizierung behalten. Snippets werden dadurch deutlich leichter auffindbar und wiederverwendbar."
    ],
    [
      "Was passiert, nachdem ich etwas Nützliches kopiert habe?",
      "Das Capture kann im Floating Launcher, im Seitenfenster und im vollständigen Manager erscheinen. Dort können Sie es wiederverwenden, klassifizieren, favorisieren, anheften, suchen oder weiterarbeiten, ohne den Browsing-Flow zu unterbrechen."
    ],
    [
      "Kann ich Captures organisieren, statt durch eine riesige Liste zu scrollen?",
      "Ja. Sie können Kategorien, Unterkategorien, getrennte Bereiche für Text/Code/Bilder, Favoriten, Pins, Papierkorb und Vault nutzen. Ziel ist Ordnung statt verborgenem Chaos."
    ],
    [
      "Wie schnell finde ich später etwas wieder?",
      "Die Suche ist für echtes Wiederfinden gemacht. Sie kann Inhalte, Titel, Notizen, Quelldomains und URLs nutzen. Sie suchen also nach dem Inhalt, der Herkunft oder Ihrer eigenen Beschreibung."
    ],
    [
      "Hilft die Erweiterung, die ursprüngliche Seite wiederzufinden?",
      "Ja. Quellenkontext ist einer der wichtigsten Vorteile. Captures können Seiteninformationen und URLs behalten, und die visuelle Quellenhistorie hilft beim Zurückkehren zum Ursprung."
    ],
    [
      "Wozu sind Titel und Notizen gut?",
      "Titel und Notizen machen aus einem rohen Capture ein verständliches Element. Sie können Inhalte benennen, beschreiben und auch Wochen später leichter wiederfinden."
    ],
    [
      "Wofür ist Versionierung gedacht?",
      "Mit Versionierung können Pro-Nutzer mehrere Versionen desselben Text- oder Code-Captures in einem einzigen Item behalten. Ideal für Prompts, Antworten, Snippets, Entwürfe und Verbesserungen ohne doppelte Einträge."
    ],
    [
      "Was ist Capture-Montage?",
      "Mit Montage können mehrere Text-Captures zu einem sauberen Gesamttext kombiniert werden. Das ist hilfreich für Prompts, Berichte, Zusammenfassungen, Briefings, Recherchenotizen oder wiederverwendbare Textblöcke."
    ],
    [
      "Was ist mit Bildern und Screenshots?",
      "Ultimate Clipboard Pro ist nicht auf Text beschränkt. Bilder und Screenshots können mit eigenem Arbeitsbereich gespeichert, organisiert und wiederverwendet werden."
    ],
    [
      "Bleiben meine Inhalte privat?",
      "Die Erweiterung folgt einer Local-first-Philosophie. Die normale Capture-Verwaltung findet in der Browser-Erweiterung auf Ihrem Gerät statt. Optionale Dienste wie Google Drive, Zahlung und Lizenzierung sind getrennt und werden nur für ihren Zweck genutzt."
    ],
    [
      "Muss ich Google Drive nutzen?",
      "Nein. Google Drive ist optional. Sie können lokal arbeiten und lokale Exporte/Wiederherstellungen nutzen. Drive ist für Nutzer gedacht, die ein Cloud-Backup im eigenen Google-Konto möchten."
    ],
    [
      "Was kann ich mit der kostenlosen Version tun?",
      "Die kostenlose Version zeigt den Workflow mit Capture-Limits und kleinerem Toolset. Sie ist ideal, um den Nutzen eines strukturierten Zwischenablage-Arbeitsbereichs zu verstehen."
    ],
    [
      "Warum auf Pro upgraden?",
      "Pro ist für den täglichen Einsatz gedacht. Es schaltet unbegrenzte Captures, Vault, Papierkorb, Versionierung, Montage, mehr Tools, fortgeschrittene Workflows und optionalen Google-Drive-Sync frei. Wenn die Erweiterung Teil Ihres Arbeitstags wird, entfernt Pro die Reibung."
    ],
    [
      "Was sollte ich nach der Installation zuerst ausprobieren?",
      "Erfassen Sie einen nützlichen Text, ein Code-Snippet und ein Bild. Öffnen Sie dann den Manager, vergeben Sie einen Titel, klassifizieren Sie ein Item, suchen Sie nach Quelle und verwenden Sie ein Capture erneut. Dieser erste Durchlauf zeigt den Unterschied."
    ],
    [
      "Kann die Erweiterung mein Browsing verlangsamen?",
      "Sie ist darauf ausgelegt, nah am Workflow zu bleiben, ohne die Seite zu übernehmen. Der Floating Launcher bietet schnellen Zugriff, der vollständige Manager öffnet sich erst für tiefere Organisation."
    ],
    [
      "Wie kann ich den Entwickler kontaktieren?",
      "Sie erreichen ArcaWand Soft unter contact@arcawand-soft.com für Support, Datenschutzfragen, Produktfeedback oder geschäftliche Anfragen."
    ]
  ]
};

  function setupProductLandingFaqOverride() {
    if (getProductPage() !== "presentation") return;
    const lang = getLangFromPath();
    const items = productLandingFaqItems[lang] || productLandingFaqItems.en;
    const apply = () => {
      const section = document.getElementById("faq");
      if (!section || section.dataset.productLandingFaqReady === "true") return Boolean(section);
      section.dataset.productLandingFaqReady = "true";
      const title = section.querySelector("h2")?.textContent || "Frequently Asked Questions";
      const wrap = document.createElement("div");
      wrap.className = "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8";
      const headingWrap = document.createElement("div");
      headingWrap.className = "text-center space-y-4 mb-16";
      const heading = document.createElement("h2");
      heading.className = "text-3xl md:text-4xl font-bold leading-tight";
      heading.textContent = title;
      headingWrap.appendChild(heading);
      const list = document.createElement("div");
      list.className = "space-y-4";
      items.forEach(([question, answer], index) => {
        const details = document.createElement("details");
        details.className = "ucp-product-faq-item border border-white/5 rounded-xl px-6 bg-card/50";
        if (index === 0) details.open = true;
        const summary = document.createElement("summary");
        summary.className = "ucp-product-faq-question text-left font-semibold";
        summary.textContent = question;
        const body = document.createElement("p");
        body.className = "ucp-product-faq-answer text-muted-foreground leading-relaxed";
        body.textContent = answer;
        details.append(summary, body);
        list.appendChild(details);
      });
      wrap.append(headingWrap, list);
      section.replaceChildren(wrap);
      return true;
    };
    if (apply()) return;
    const observer = new MutationObserver(() => {
      if (apply()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 8000);
  }

  function setupProductNav() {
    const lang = getLangFromPath();
    const page = getProductPage();
    document.querySelectorAll("[data-ucp-nav]").forEach((link) => {
      const key = link.dataset.ucpNav;
      link.textContent = labels[lang]?.[key] || labels.en[key] || link.textContent;
      if (key === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function setupProductHeaderScroll() {
    const mark = document.querySelector(".ucp-product-mark");
    const nav = document.querySelector(".ucp-product-nav");
    if (!mark || !nav) return;
    let ticking = false;
    const update = () => {
      const scrolled = window.scrollY > 36;
      document.body.classList.toggle("ucp-product-scrolled", scrolled);
      mark.classList.toggle("is-hidden", scrolled);
      ticking = false;
    };
    update();
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
  }

  function setupProductFooterLinks() {
    const lang = getLangFromPath();
    const items = ["presentation", "demo", "faq", "privacy", "terms", "contact"];
    const apply = () => {
      const footer = document.querySelector("footer");
      if (!footer) return false;
      const linkGroup = Array.from(footer.querySelectorAll("div")).find((node) => {
        const links = Array.from(node.children).filter((child) => child.matches?.("a"));
        return links.length >= 3 && links.some((link) => link.getAttribute("href") === "#");
      });
      if (!linkGroup) return false;
      linkGroup.replaceChildren(...items.map((key) => {
        const link = document.createElement("a");
        link.href = routes[lang]?.[key] || routes.en[key];
        link.className = "text-sm text-muted-foreground hover:text-foreground transition-all duration-200";
        link.textContent = labels[lang]?.[key] || labels.en[key];
        return link;
      }));
      return true;
    };

    if (apply()) return;
    const observer = new MutationObserver(() => {
      if (apply()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 8000);
  }

  function init() {
    const lang = getLangFromPath();
    document.documentElement.lang = lang;
    setupLanguageMenu();
    setupProductNav();
    setupProductHeaderScroll();
    setupProductLandingFaqOverride();
    setupProductFooterLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
