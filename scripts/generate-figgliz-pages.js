const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceAssets = path.resolve(root, "..", "figgliz", "server", "public", "stats", "assets", "images");
const figglizAssets = path.join(root, "assets", "figgliz");
const extensionLegalContent = require("./figgliz-extension-legal-content.json");
const socialImage = "https://arcawand-soft.com/assets/Figgliz_SEO_Image.png";
const socialImageAlt = "Figgliz Chrome extension preview";

const langs = {
  en: {
    dir: "",
    html: "en",
    home: "/",
    navSofts: "Our apps",
    back: "Back to ArcaWand Soft",
    presentation: "Presentation",
    faq: "FAQ",
    stats: "Statistics",
    privacy: "Privacy policy",
    terms: "Terms of use",
    contact: "Contact",
    install: "Install Extension",
    productDesc: "Private random chats for real conversations",
    footer: "ArcaWand Soft. Premium apps for demanding users.",
    heroTitle: "Turn five minutes of break into an unexpected encounter",
    heroLead: "Figgliz is a Chrome extension for discreet one-to-one conversations with randomly matched people: text chat, short voice notes, optional webcam sessions and lightweight games, without public profiles or social pressure.",
    heroKicker: "Private social discovery",
    primaryCta: "Install Extension",
    secondaryCta: "View plans",
    betaNote: "Figgliz is currently in beta testing with volunteer users before its public Chrome Web Store release.",
    sectionsTitle: "Designed for spontaneous conversations",
    sectionsLead: "Figgliz keeps the interaction direct, light and intentionally minimal: no public feed, no follower count, no profile theatre.",
    features: [
      ["Random one-to-one matching", "Start a conversation with someone new while keeping identity and public presence out of the experience."],
      ["Text, voice and webcam", "Chat by text, send short voice notes, or open a webcam session only after an explicit invitation is accepted."],
      ["Games as icebreakers", "Invite someone to chess, checkers, Connect 4, Ping Pong, Flappy Duo or Air Hockey when words need a warm-up."],
      ["Safety controls first", "Use Next, block, report, availability controls and warnings before risky contact-information sharing."]
    ],
    privacyCards: [
      ["No public profile", "No real name, public username, profile photo, public wall or social feed is required."],
      ["Explicit webcam consent", "Webcam sessions start only after both people accept the invitation."],
      ["Anonymous public stats", "The stats page shows aggregate usage only, never message contents."],
      ["Local choice and control", "You choose your availability, preferences and when to leave a conversation."]
    ],
    gamesTitle: "Games that make the first minute easier",
    gamesLead: "Game invitations are designed as small social bridges: play only, or play while keeping a webcam session open when both people agree.",
    statsTitle: "A public pulse, not a public database",
    statsLead: "Figgliz can expose anonymous aggregate activity on the public stats page, so visitors understand momentum without exposing conversations.",
    pricingTitle: "Plans for casual use, daily use and launch supporters",
    pricingLead: "Start free, upgrade for higher quotas and Pro controls, or choose the lifetime launch offer while it is available.",
    monthly: "Monthly",
    yearly: "Yearly",
    launch: "Launch offer",
    chooseOffer: "Choose this offer",
    continueFree: "Continue with Free",
    pageTitles: {
      faq: "Figgliz FAQ",
      stats: "Figgliz Live Statistics",
      privacy: "Figgliz Privacy Policy",
      terms: "Figgliz Terms of Use"
    },
    pageDesc: {
      presentation: "Figgliz is a Chrome extension for private random conversations, voice notes, optional webcam sessions and games, with safety controls and no public profile.",
      faq: "Answers about Figgliz, random matching, privacy, safety, voice, webcam sessions, games, plans and beta availability.",
      stats: "Live anonymous Figgliz statistics for discussions, webcam sessions and games played by the community.",
      privacy: "Detailed privacy policy for Figgliz, covering random conversations, webcam consent, anonymous stats, paid plans, licensing and user controls.",
      terms: "Terms of use for Figgliz, including beta availability, acceptable use, safety, paid plans, licensing and limitations."
    },
    faqItems: [
      ["What is Figgliz?", "Figgliz is a Chrome extension for private one-to-one conversations with randomly matched people. It is designed for spontaneous discovery without public profiles, followers or social pressure."],
      ["Do I need to create a public profile?", "No. Figgliz is intentionally built without public profiles, real-name display, public usernames, profile photos, feeds or follower mechanics."],
      ["Can I choose who I meet?", "Matching is random, but language and gender preference filters can help make conversations feel more relevant while keeping the discovery experience lightweight."],
      ["Is webcam required?", "No. Webcam is optional and starts only after an invitation is explicitly accepted. You can stay with text and voice notes if that is what feels right."],
      ["What safety tools are available?", "You can move to the next match, block, report, manage availability and receive warnings before risky contact-information sharing."],
      ["Are conversations shown on the public stats page?", "No. The stats page is designed for anonymous aggregate activity only. Message contents are not published there."],
      ["What do games add to the experience?", "Games make the first minute less awkward. You can invite someone to a quick chess, checkers, Connect 4, Ping Pong, Flappy Duo or Air Hockey session."],
      ["What does Pro unlock?", "Pro is designed for heavier use: higher quotas, advanced filters, webcam backgrounds, faster Next, video pause, game invitations and Pro-level controls."],
      ["Is Figgliz available now?", "Figgliz is currently in beta testing with volunteer users and will be available publicly soon."],
      ["How can I contact ArcaWand Soft?", "Write to contact@arcawand-soft.com for support, privacy questions, partnerships or product feedback."]
    ],
    privacySections: [
      ["Overview", ["Figgliz is a Chrome extension built by ArcaWand Soft for private random one-to-one conversations.", "The product is designed to avoid public profiles and to give users clear controls over matching, availability, webcam participation and safety actions."]],
      ["Data handled by the product", ["Depending on use, Figgliz may process account or license status, language and preference settings, conversation state, safety actions, anonymous aggregate statistics, game invitations and optional webcam session metadata.", "Message contents are not intended for public display and are not shown on the public statistics page."]],
      ["Webcam, microphone and consent", ["Webcam and microphone features are optional. A webcam session should begin only after explicit invitation and acceptance.", "Users can stop video, mute microphone, mute remote audio, pause video, use fullscreen and leave the session."]],
      ["Safety and moderation", ["Figgliz includes block, report, Next and availability controls. Reports may require enough technical and contextual information to investigate abuse, protect users and enforce rules."]],
      ["Public statistics", ["The public stats page may display anonymous aggregate usage signals such as activity levels. It is not designed to publish private conversations, identities or message contents."]],
      ["Payments and licensing", ["Paid plans and license validation may use external payment and licensing providers. Payment card details are handled by those providers, not by a public Figgliz chat database."]],
      ["Contact", ["For privacy questions, contact ArcaWand Soft at contact@arcawand-soft.com."]]
    ],
    termsSections: [
      ["Acceptance", ["By installing, accessing or using Figgliz, you agree to these Terms of Use and the Figgliz Privacy Policy. If you do not agree, do not use the product."]],
      ["Beta availability", ["Figgliz is currently in beta testing with volunteer users. Features, limits, plans, prices and availability may change before or after public release."]],
      ["Acceptable use", ["Do not use Figgliz for harassment, threats, exploitation, illegal content, impersonation, spam, fraud, privacy violations, sexual exploitation, hate, malware, scraping or attempts to bypass safety systems."]],
      ["User responsibility", ["Users are responsible for their conversations, shared information, webcam choices, game behavior and compliance with applicable law."]],
      ["Plans and licenses", ["Paid plans may unlock quotas, filters, webcam features, faster matching controls, game invitations or other Pro benefits. Licenses are personal unless expressly stated otherwise."]],
      ["Safety actions", ["ArcaWand Soft may restrict, suspend or terminate access when abuse, fraud, safety risk, payment misuse or rule violations are detected."]],
      ["Limitations", ["Figgliz is provided as a communication and social discovery tool. Availability depends on browser behavior, network quality, matching availability and third-party services."]],
      ["Contact", ["For support or legal questions, contact contact@arcawand-soft.com."]]
    ]
  },
  fr: {
    dir: "fr",
    html: "fr",
    home: "/fr/",
    navSofts: "Nos apps",
    back: "Retour vers ArcaWand Soft",
    presentation: "Présentation",
    faq: "FAQ",
    privacy: "Politique de confidentialité",
    terms: "CGU",
    contact: "Contact",
    install: "Installer l'extension",
    productDesc: "Discussions aléatoires privées pour de vraies conversations",
    footer: "ArcaWand Soft. Apps premium pour utilisateurs exigeants.",
    heroTitle: "Transformez cinq minutes de pause en rencontre inattendue",
    heroLead: "Figgliz est une extension Chrome pour des conversations discrètes en tête-à-tête avec des personnes tirées au hasard : texte, notes vocales courtes, webcam optionnelle et petits jeux, sans profil public ni pression sociale.",
    heroKicker: "Découverte sociale privée",
    primaryCta: "Installer l'extension",
    secondaryCta: "Voir les offres",
    betaNote: "Figgliz est actuellement en bêta test auprès d'utilisateurs volontaires avant sa sortie publique sur le Chrome Web Store.",
    sectionsTitle: "Pensée pour des conversations spontanées",
    sectionsLead: "Figgliz garde l'échange direct, léger et volontairement minimal : pas de fil public, pas de compteur d'abonnés, pas de théâtre de profil.",
    features: [
      ["Matching aléatoire en tête-à-tête", "Lancez une conversation avec quelqu'un de nouveau sans transformer l'échange en vitrine publique."],
      ["Texte, voix et webcam", "Discutez par texte, envoyez de courtes notes vocales ou ouvrez une webcam seulement après invitation acceptée."],
      ["Des jeux pour briser la glace", "Invitez l'autre personne aux échecs, dames, Puissance 4, Ping Pong, Flappy Duo ou Air Hockey quand les premiers mots hésitent."],
      ["Contrôles de sécurité", "Passez au suivant, bloquez, signalez, gérez votre disponibilité et recevez un avertissement avant un partage risqué de coordonnées."]
    ],
    privacyCards: [
      ["Aucun profil public", "Pas de vrai nom, pseudo public, photo de profil, mur public ou fil social obligatoire."],
      ["Webcam sur consentement explicite", "Une session webcam démarre uniquement si les deux personnes acceptent l'invitation."],
      ["Statistiques anonymes", "La page publique affiche seulement des données agrégées, jamais le contenu des messages."],
      ["Contrôle permanent", "Vous choisissez votre disponibilité, vos préférences et le moment où vous quittez une conversation."]
    ],
    gamesTitle: "Des jeux pour rendre la première minute plus simple",
    gamesLead: "Les invitations de jeu servent de petits ponts sociaux : jouer seulement, ou jouer avec la webcam si les deux personnes sont d'accord.",
    statsTitle: "Une pulsation publique, pas une base de données publique",
    statsLead: "Figgliz peut afficher une activité agrégée anonyme sur la page de statistiques, pour montrer la dynamique sans exposer les conversations.",
    pricingTitle: "Des offres pour tester, utiliser souvent ou soutenir le lancement",
    pricingLead: "Commencez gratuitement, passez à Plus ou Pro pour plus de quotas et de contrôles, ou profitez de l'offre Lifetime de lancement.",
    monthly: "Mensuel",
    yearly: "Annuel",
    launch: "Offre de lancement",
    chooseOffer: "Choisir cette offre",
    continueFree: "Continuer gratuitement",
    pageTitles: { faq: "FAQ Figgliz", privacy: "Politique de confidentialité Figgliz", terms: "Conditions générales d'utilisation Figgliz" },
    pageDesc: {
      presentation: "Figgliz est une extension Chrome pour conversations privées aléatoires, notes vocales, webcam optionnelle et jeux, avec contrôles de sécurité et sans profil public.",
      faq: "Réponses sur Figgliz, le matching aléatoire, la confidentialité, la sécurité, la voix, la webcam, les jeux, les offres et la bêta.",
      privacy: "Politique de confidentialité de Figgliz : conversations aléatoires, consentement webcam, statistiques anonymes, offres payantes, licence et contrôles utilisateur.",
      terms: "Conditions d'utilisation de Figgliz : bêta, usage acceptable, sécurité, offres payantes, licence et limites."
    },
    faqItems: [
      ["Qu'est-ce que Figgliz ?", "Figgliz est une extension Chrome pour conversations privées en tête-à-tête avec des personnes tirées au hasard, sans profils publics, abonnés ni pression sociale."],
      ["Dois-je créer un profil public ?", "Non. Figgliz évite volontairement les profils publics, vrais noms, pseudos publics, photos de profil, fils sociaux et mécaniques d'abonnés."],
      ["Puis-je choisir qui je rencontre ?", "Le matching reste aléatoire, mais des préférences de langue et de genre peuvent aider à rendre les échanges plus pertinents."],
      ["La webcam est-elle obligatoire ?", "Non. Elle est optionnelle et démarre uniquement après invitation explicitement acceptée. Vous pouvez rester au texte et aux notes vocales."],
      ["Quels outils de sécurité sont prévus ?", "Vous pouvez passer au suivant, bloquer, signaler, gérer votre disponibilité et recevoir des avertissements avant un partage risqué de coordonnées."],
      ["Les conversations apparaissent-elles sur la page de statistiques ?", "Non. La page de statistiques affiche seulement des données anonymes agrégées, jamais les messages."],
      ["À quoi servent les jeux ?", "Les jeux rendent la première minute moins gênante : échecs, dames, Puissance 4, Ping Pong, Flappy Duo ou Air Hockey."],
      ["Que débloque Pro ?", "Pro vise un usage plus intense : quotas plus élevés, filtres avancés, arrière-plans webcam, Next plus rapide, pause vidéo, invitations de jeu et contrôles Pro."],
      ["Figgliz est-il disponible maintenant ?", "Figgliz est actuellement en bêta test auprès d'utilisateurs volontaires et sera disponible publiquement prochainement."],
      ["Comment contacter ArcaWand Soft ?", "Écrivez à contact@arcawand-soft.com pour le support, la confidentialité, les partenariats ou les retours produit."]
    ],
    privacySections: [
      ["Vue d'ensemble", ["Figgliz est une extension Chrome créée par ArcaWand Soft pour des conversations privées aléatoires en tête-à-tête.", "Le produit évite les profils publics et donne des contrôles clairs sur le matching, la disponibilité, la webcam et la sécurité."]],
      ["Données traitées", ["Selon l'usage, Figgliz peut traiter l'état de compte ou licence, les réglages de langue et préférences, l'état de conversation, les actions de sécurité, les statistiques anonymes agrégées, les invitations de jeu et les métadonnées de webcam optionnelle.", "Les messages ne sont pas destinés à l'affichage public et ne sont pas publiés sur la page de statistiques."]],
      ["Webcam, micro et consentement", ["La webcam et le micro sont optionnels. Une session webcam ne doit commencer qu'après invitation et acceptation explicites.", "L'utilisateur peut arrêter la vidéo, couper le micro, couper l'audio distant, mettre la vidéo en pause, passer en plein écran et quitter la session."]],
      ["Sécurité et modération", ["Figgliz inclut blocage, signalement, Next et contrôles de disponibilité. Les signalements peuvent nécessiter des informations techniques et contextuelles pour enquêter et protéger les utilisateurs."]],
      ["Statistiques publiques", ["La page de statistiques peut afficher des signaux d'activité anonymes agrégés. Elle n'est pas conçue pour publier des conversations, identités ou contenus privés."]],
      ["Paiements et licence", ["Les offres payantes et validations de licence peuvent utiliser des prestataires externes. Les informations de carte bancaire sont traitées par ces prestataires."]],
      ["Contact", ["Pour toute question de confidentialité, contactez ArcaWand Soft à contact@arcawand-soft.com."]]
    ],
    termsSections: [
      ["Acceptation", ["En installant, accédant ou utilisant Figgliz, vous acceptez ces CGU et la politique de confidentialité Figgliz. Si vous n'acceptez pas, n'utilisez pas le produit."]],
      ["Disponibilité bêta", ["Figgliz est actuellement en bêta test auprès d'utilisateurs volontaires. Les fonctions, limites, offres, prix et disponibilités peuvent évoluer avant ou après la sortie publique."]],
      ["Usage acceptable", ["N'utilisez pas Figgliz pour le harcèlement, les menaces, l'exploitation, les contenus illégaux, l'usurpation, le spam, la fraude, les atteintes à la vie privée, la haine, les malwares ou le contournement des systèmes de sécurité."]],
      ["Responsabilité utilisateur", ["Les utilisateurs sont responsables de leurs conversations, informations partagées, choix de webcam, comportement dans les jeux et respect de la loi applicable."]],
      ["Offres et licences", ["Les offres payantes peuvent débloquer quotas, filtres, fonctions webcam, matching plus rapide, invitations de jeu ou avantages Pro. Les licences sont personnelles sauf indication contraire."]],
      ["Actions de sécurité", ["ArcaWand Soft peut restreindre, suspendre ou fermer un accès en cas d'abus, fraude, risque de sécurité, paiement problématique ou violation des règles."]],
      ["Limites", ["Figgliz est fourni comme outil de communication et de découverte sociale. La disponibilité dépend du navigateur, du réseau, de la disponibilité du matching et de services tiers."]],
      ["Contact", ["Pour le support ou les questions légales, contactez contact@arcawand-soft.com."]]
    ]
  },
  es: {
    dir: "es", html: "es", home: "/es/", navSofts: "Nuestras apps", back: "Volver a ArcaWand Soft", presentation: "Presentación", faq: "FAQ", privacy: "Política de privacidad", terms: "Términos de uso", contact: "Contacto", install: "Instalar extensión", productDesc: "Chats aleatorios privados para conversaciones reales", footer: "ArcaWand Soft. Apps premium para usuarios exigentes.",
    heroTitle: "Convierte cinco minutos de pausa en un encuentro inesperado", heroLead: "Figgliz es una extensión de Chrome para conversaciones discretas uno a uno con personas aleatorias: texto, notas de voz cortas, webcam opcional y juegos ligeros, sin perfiles públicos ni presión social.", heroKicker: "Descubrimiento social privado", primaryCta: "Instalar extensión", secondaryCta: "Ver planes", betaNote: "Figgliz está actualmente en beta con usuarios voluntarios antes de su lanzamiento público en Chrome Web Store.",
    sectionsTitle: "Pensada para conversaciones espontáneas", sectionsLead: "Figgliz mantiene la interacción directa, ligera y mínima: sin feed público, sin seguidores, sin teatro de perfil.",
    features: [["Emparejamiento aleatorio uno a uno", "Empieza una conversación con alguien nuevo sin convertirla en una vitrina pública."], ["Texto, voz y webcam", "Chatea por texto, envía notas de voz cortas o abre webcam solo tras una invitación aceptada."], ["Juegos para romper el hielo", "Invita a ajedrez, damas, Conecta 4, Ping Pong, Flappy Duo o Air Hockey cuando faltan palabras."], ["Controles de seguridad", "Usa Next, bloquea, reporta, gestiona disponibilidad y recibe avisos antes de compartir datos de contacto riesgosos."]],
    privacyCards: [["Sin perfil público", "No requiere nombre real, usuario público, foto de perfil, muro o feed social."], ["Webcam con consentimiento", "La webcam empieza solo si ambas personas aceptan la invitación."], ["Estadísticas anónimas", "La página pública muestra solo datos agregados, nunca mensajes."], ["Control permanente", "Tú decides disponibilidad, preferencias y cuándo salir de una conversación."]],
    gamesTitle: "Juegos para hacer más fácil el primer minuto", gamesLead: "Las invitaciones de juego son pequeños puentes sociales: jugar solamente, o jugar con webcam si ambas personas aceptan.", statsTitle: "Pulso público, no base de datos pública", statsLead: "Figgliz puede mostrar actividad anónima agregada para enseñar movimiento sin exponer conversaciones.", pricingTitle: "Planes para probar, usar a diario y apoyar el lanzamiento", pricingLead: "Empieza gratis, mejora cuotas y controles Pro, o elige la oferta Lifetime de lanzamiento.", monthly: "Mensual", yearly: "Anual", launch: "Oferta de lanzamiento", chooseOffer: "Elegir esta oferta", continueFree: "Continuar gratis",
    pageTitles: { faq: "FAQ de Figgliz", privacy: "Política de privacidad de Figgliz", terms: "Términos de uso de Figgliz" },
    pageDesc: { presentation: "Figgliz es una extensión de Chrome para conversaciones privadas aleatorias, notas de voz, webcam opcional y juegos, con controles de seguridad y sin perfil público.", faq: "Respuestas sobre Figgliz, emparejamiento aleatorio, privacidad, seguridad, voz, webcam, juegos, planes y beta.", privacy: "Política de privacidad de Figgliz sobre conversaciones aleatorias, consentimiento de webcam, estadísticas anónimas, planes, licencias y controles.", terms: "Términos de uso de Figgliz: beta, uso aceptable, seguridad, planes, licencias y límites." },
    faqItems: [["¿Qué es Figgliz?", "Una extensión de Chrome para conversaciones privadas uno a uno con personas aleatorias, sin perfiles públicos ni presión social."], ["¿Necesito perfil público?", "No. Figgliz evita perfiles públicos, nombres reales, fotos de perfil, feeds y seguidores."], ["¿Puedo elegir con quién hablar?", "El emparejamiento es aleatorio, con preferencias de idioma y género para orientar la experiencia."], ["¿La webcam es obligatoria?", "No. Es opcional y requiere invitación aceptada."], ["¿Qué seguridad incluye?", "Next, bloquear, reportar, disponibilidad y avisos antes de compartir datos de contacto riesgosos."], ["¿Los mensajes aparecen en estadísticas?", "No. Las estadísticas son agregadas y anónimas."], ["¿Para qué sirven los juegos?", "Para romper el hielo con ajedrez, damas, Conecta 4, Ping Pong, Flappy Duo o Air Hockey."], ["¿Qué desbloquea Pro?", "Más cuotas, filtros avanzados, fondos de webcam, Next más rápido, pausa de vídeo, invitaciones de juego y controles Pro."], ["¿Está disponible ahora?", "Figgliz está en beta con usuarios voluntarios y estará disponible públicamente pronto."], ["¿Cómo contacto con ArcaWand Soft?", "Escribe a contact@arcawand-soft.com."]],
    privacySections: [["Resumen", ["Figgliz es una extensión de Chrome de ArcaWand Soft para conversaciones privadas aleatorias uno a uno.", "Evita perfiles públicos y ofrece controles claros de matching, disponibilidad, webcam y seguridad."]], ["Datos tratados", ["Puede procesar estado de licencia, preferencias, estado de conversación, acciones de seguridad, estadísticas anónimas, invitaciones de juego y metadatos opcionales de webcam.", "Los mensajes no se muestran públicamente ni en la página de estadísticas."]], ["Webcam y consentimiento", ["La webcam y el micrófono son opcionales y requieren invitación aceptada.", "El usuario puede detener vídeo, silenciar micrófono, silenciar audio remoto, pausar vídeo y salir."]], ["Seguridad", ["Bloqueo, reporte, Next y disponibilidad ayudan a proteger la experiencia."]], ["Pagos y licencia", ["Los pagos y licencias pueden usar proveedores externos."]], ["Contacto", ["Para privacidad, escribe a contact@arcawand-soft.com."]]],
    termsSections: [["Aceptación", ["Al usar Figgliz aceptas estos términos y la política de privacidad."]], ["Beta", ["Figgliz está en beta y puede cambiar antes o después del lanzamiento público."]], ["Uso aceptable", ["No uses Figgliz para acoso, amenazas, fraude, spam, odio, malware, explotación o evasión de seguridad."]], ["Responsabilidad", ["Eres responsable de tus conversaciones, información compartida y comportamiento."]], ["Planes", ["Los planes de pago pueden desbloquear cuotas, filtros, webcam, juegos y funciones Pro."]], ["Seguridad", ["ArcaWand Soft puede restringir el acceso en caso de abuso o fraude."]], ["Límites", ["La disponibilidad depende de Chrome, red, matching y servicios terceros."]], ["Contacto", ["contact@arcawand-soft.com"]]]
  },
  it: {
    dir: "it", html: "it", home: "/it/", navSofts: "Le nostre app", back: "Torna ad ArcaWand Soft", presentation: "Presentazione", faq: "FAQ", privacy: "Informativa privacy", terms: "Termini d'uso", contact: "Contatto", install: "Installa estensione", productDesc: "Chat casuali private per conversazioni reali", footer: "ArcaWand Soft. App premium per utenti esigenti.",
    heroTitle: "Trasforma cinque minuti di pausa in un incontro inatteso", heroLead: "Figgliz è un'estensione Chrome per conversazioni discrete uno a uno con persone abbinate casualmente: testo, brevi note vocali, webcam opzionale e giochi leggeri, senza profili pubblici o pressione sociale.", heroKicker: "Scoperta sociale privata", primaryCta: "Installa estensione", secondaryCta: "Vedi i piani", betaNote: "Figgliz è attualmente in beta test con utenti volontari prima del rilascio pubblico sul Chrome Web Store.",
    sectionsTitle: "Pensata per conversazioni spontanee", sectionsLead: "Figgliz mantiene l'interazione diretta, leggera e minimale: niente feed pubblico, follower o teatro del profilo.",
    features: [["Matching casuale uno a uno", "Inizia una conversazione con qualcuno di nuovo senza profili pubblici."], ["Testo, voce e webcam", "Chatta, invia note vocali o apri la webcam solo dopo invito accettato."], ["Giochi rompighiaccio", "Invita a scacchi, dama, Forza 4, Ping Pong, Flappy Duo o Air Hockey."], ["Controlli di sicurezza", "Usa Next, blocco, segnalazione, disponibilità e avvisi prima di condividere contatti rischiosi."]],
    privacyCards: [["Nessun profilo pubblico", "Niente nome reale, username pubblico, foto profilo, bacheca o feed."], ["Webcam con consenso", "La webcam parte solo se entrambi accettano."], ["Statistiche anonime", "La pagina pubblica mostra solo dati aggregati."], ["Controllo continuo", "Scegli disponibilità, preferenze e quando uscire."]],
    gamesTitle: "Giochi per rendere più facile il primo minuto", gamesLead: "Gli inviti di gioco sono piccoli ponti sociali: solo gioco, oppure gioco con webcam se entrambi accettano.", statsTitle: "Un segnale pubblico, non un database pubblico", statsLead: "Figgliz può mostrare attività aggregata anonima senza esporre conversazioni.", pricingTitle: "Piani per provare, usare ogni giorno e sostenere il lancio", pricingLead: "Inizia gratis, passa a Plus o Pro, oppure scegli l'offerta Lifetime di lancio.", monthly: "Mensile", yearly: "Annuale", launch: "Offerta lancio", chooseOffer: "Scegli questa offerta", continueFree: "Continua gratis",
    pageTitles: { faq: "FAQ Figgliz", privacy: "Informativa privacy Figgliz", terms: "Termini d'uso Figgliz" },
    pageDesc: { presentation: "Figgliz è un'estensione Chrome per conversazioni private casuali, note vocali, webcam opzionale e giochi, con controlli di sicurezza e senza profilo pubblico.", faq: "Risposte su Figgliz, matching casuale, privacy, sicurezza, voce, webcam, giochi, piani e beta.", privacy: "Informativa privacy di Figgliz: conversazioni casuali, consenso webcam, statistiche anonime, piani, licenze e controlli.", terms: "Termini d'uso di Figgliz: beta, uso accettabile, sicurezza, piani, licenze e limiti." },
    faqItems: [["Cos'è Figgliz?", "Un'estensione Chrome per conversazioni private uno a uno con persone casuali."], ["Serve un profilo pubblico?", "No. Niente profilo pubblico, nome reale, foto o follower."], ["Posso scegliere chi incontrare?", "Il matching è casuale con preferenze di lingua e genere."], ["La webcam è obbligatoria?", "No. È opzionale e richiede invito accettato."], ["Quali controlli di sicurezza ci sono?", "Next, blocco, segnalazione, disponibilità e avvisi."], ["Le conversazioni sono nelle statistiche?", "No. Solo dati aggregati anonimi."], ["A cosa servono i giochi?", "A rompere il ghiaccio con scacchi, dama, Forza 4, Ping Pong, Flappy Duo o Air Hockey."], ["Cosa sblocca Pro?", "Quote superiori, filtri, sfondi webcam, Next più rapido, pausa video, giochi e controlli Pro."], ["È disponibile ora?", "Figgliz è in beta con utenti volontari e arriverà pubblicamente presto."], ["Come contatto ArcaWand Soft?", "contact@arcawand-soft.com"]],
    privacySections: [["Panoramica", ["Figgliz è un'estensione Chrome di ArcaWand Soft per conversazioni private casuali.", "Evita profili pubblici e offre controlli chiari."]], ["Dati trattati", ["Può trattare licenza, preferenze, stato conversazione, sicurezza, statistiche anonime, inviti di gioco e metadati webcam.", "I messaggi non sono pubblicati."]], ["Webcam e consenso", ["Webcam e microfono sono opzionali e richiedono consenso."]], ["Sicurezza", ["Blocco, segnalazione, Next e disponibilità aiutano a proteggere l'esperienza."]], ["Pagamenti", ["Pagamenti e licenze possono usare provider esterni."]], ["Contatto", ["contact@arcawand-soft.com"]]],
    termsSections: [["Accettazione", ["Usando Figgliz accetti questi termini e l'informativa privacy."]], ["Beta", ["Figgliz è in beta e può cambiare."]], ["Uso accettabile", ["Sono vietati molestie, minacce, frodi, spam, odio, malware e abusi."]], ["Responsabilità", ["Sei responsabile delle tue conversazioni e informazioni condivise."]], ["Piani", ["I piani a pagamento possono sbloccare funzioni Pro."]], ["Sicurezza", ["ArcaWand Soft può limitare accessi abusivi."]], ["Limiti", ["La disponibilità dipende da Chrome, rete e servizi terzi."]], ["Contatto", ["contact@arcawand-soft.com"]]]
  },
  de: {
    dir: "de", html: "de", home: "/de/", navSofts: "Unsere Apps", back: "Zurück zu ArcaWand Soft", presentation: "Präsentation", faq: "FAQ", privacy: "Datenschutz", terms: "Nutzungsbedingungen", contact: "Kontakt", install: "Extension installieren", productDesc: "Private Zufalls-Chats für echte Gespräche", footer: "ArcaWand Soft. Premium-Apps für anspruchsvolle Nutzer.",
    heroTitle: "Mach aus fünf Minuten Pause eine unerwartete Begegnung", heroLead: "Figgliz ist eine Chrome-Erweiterung für diskrete Eins-zu-eins-Gespräche mit zufällig gematchten Personen: Text, kurze Sprachnachrichten, optionale Webcam und kleine Spiele, ohne öffentliche Profile oder sozialen Druck.", heroKicker: "Private soziale Entdeckung", primaryCta: "Extension installieren", secondaryCta: "Tarife ansehen", betaNote: "Figgliz befindet sich derzeit im Betatest mit freiwilligen Nutzern vor der öffentlichen Veröffentlichung im Chrome Web Store.",
    sectionsTitle: "Für spontane Gespräche entwickelt", sectionsLead: "Figgliz hält Interaktionen direkt, leicht und minimal: kein öffentlicher Feed, keine Follower, kein Profiltheater.",
    features: [["Zufälliges Eins-zu-eins-Matching", "Starte ein Gespräch mit jemand Neuem ohne öffentliches Profil."], ["Text, Sprache und Webcam", "Chatte per Text, sende kurze Sprachnachrichten oder öffne Webcam nur nach angenommener Einladung."], ["Spiele als Eisbrecher", "Lade zu Schach, Dame, Vier gewinnt, Ping Pong, Flappy Duo oder Air Hockey ein."], ["Sicherheitskontrollen", "Nutze Next, Blockieren, Melden, Verfügbarkeit und Warnungen vor riskanten Kontaktdaten."]],
    privacyCards: [["Kein öffentliches Profil", "Kein echter Name, öffentlicher Nutzername, Profilfoto, öffentliche Pinnwand oder Feed."], ["Webcam nur mit Zustimmung", "Webcam startet nur, wenn beide zustimmen."], ["Anonyme Statistiken", "Die öffentliche Seite zeigt nur aggregierte Daten."], ["Kontrolle jederzeit", "Du entscheidest Verfügbarkeit, Präferenzen und wann du gehst."]],
    gamesTitle: "Spiele, die die erste Minute leichter machen", gamesLead: "Spieleinladungen sind kleine soziale Brücken: nur spielen oder mit Webcam, wenn beide zustimmen.", statsTitle: "Öffentlicher Puls, keine öffentliche Datenbank", statsLead: "Figgliz kann anonyme aggregierte Aktivität zeigen, ohne Gespräche offenzulegen.", pricingTitle: "Tarife zum Testen, täglichen Nutzen und Unterstützen des Launches", pricingLead: "Starte kostenlos, upgrade für höhere Quoten und Pro-Kontrollen oder wähle das Lifetime-Launch-Angebot.", monthly: "Monatlich", yearly: "Jährlich", launch: "Launch-Angebot", chooseOffer: "Angebot wählen", continueFree: "Kostenlos fortfahren",
    pageTitles: { faq: "Figgliz FAQ", privacy: "Figgliz Datenschutzerklärung", terms: "Figgliz Nutzungsbedingungen" },
    pageDesc: { presentation: "Figgliz ist eine Chrome-Erweiterung für private Zufallsgespräche, Sprachnachrichten, optionale Webcam und Spiele, mit Sicherheitskontrollen und ohne öffentliches Profil.", faq: "Antworten zu Figgliz, Zufalls-Matching, Datenschutz, Sicherheit, Sprache, Webcam, Spielen, Tarifen und Beta.", privacy: "Datenschutzerklärung für Figgliz: Zufallsgespräche, Webcam-Zustimmung, anonyme Statistiken, Tarife, Lizenz und Nutzerkontrollen.", terms: "Nutzungsbedingungen für Figgliz: Beta, zulässige Nutzung, Sicherheit, Tarife, Lizenz und Grenzen." },
    faqItems: [["Was ist Figgliz?", "Eine Chrome-Erweiterung für private Eins-zu-eins-Gespräche mit zufällig gematchten Personen."], ["Brauche ich ein öffentliches Profil?", "Nein. Keine öffentlichen Profile, echten Namen, Fotos, Feeds oder Follower."], ["Kann ich auswählen, wen ich treffe?", "Das Matching ist zufällig, mit Sprach- und Geschlechtspräferenzen."], ["Ist Webcam Pflicht?", "Nein. Sie ist optional und braucht eine angenommene Einladung."], ["Welche Sicherheitsfunktionen gibt es?", "Next, Blockieren, Melden, Verfügbarkeit und Warnungen."], ["Erscheinen Gespräche in Statistiken?", "Nein. Nur anonyme aggregierte Daten."], ["Wozu dienen Spiele?", "Zum Eisbrechen mit Schach, Dame, Vier gewinnt, Ping Pong, Flappy Duo oder Air Hockey."], ["Was schaltet Pro frei?", "Höhere Quoten, Filter, Webcam-Hintergründe, schnelleres Next, Video-Pause, Spiele und Pro-Kontrollen."], ["Ist Figgliz jetzt verfügbar?", "Figgliz ist im Betatest und wird bald öffentlich verfügbar sein."], ["Wie kontaktiere ich ArcaWand Soft?", "contact@arcawand-soft.com"]],
    privacySections: [["Überblick", ["Figgliz ist eine Chrome-Erweiterung von ArcaWand Soft für private Zufallsgespräche.", "Sie vermeidet öffentliche Profile und bietet klare Kontrollen."]], ["Verarbeitete Daten", ["Figgliz kann Lizenzstatus, Präferenzen, Gesprächsstatus, Sicherheitsaktionen, anonyme Statistiken, Spieleinladungen und Webcam-Metadaten verarbeiten.", "Nachrichten werden nicht öffentlich angezeigt."]], ["Webcam und Zustimmung", ["Webcam und Mikrofon sind optional und benötigen Zustimmung."]], ["Sicherheit", ["Blockieren, Melden, Next und Verfügbarkeit schützen die Erfahrung."]], ["Zahlungen", ["Zahlungen und Lizenzierung können externe Anbieter nutzen."]], ["Kontakt", ["contact@arcawand-soft.com"]]],
    termsSections: [["Annahme", ["Durch Nutzung akzeptierst du diese Bedingungen und die Datenschutzerklärung."]], ["Beta", ["Figgliz ist in Beta und kann sich ändern."]], ["Zulässige Nutzung", ["Belästigung, Drohungen, Betrug, Spam, Hass, Malware und Missbrauch sind verboten."]], ["Verantwortung", ["Nutzer sind für Gespräche und geteilte Informationen verantwortlich."]], ["Tarife", ["Bezahlte Tarife können Pro-Funktionen freischalten."]], ["Sicherheit", ["ArcaWand Soft kann missbräuchlichen Zugriff beschränken."]], ["Grenzen", ["Verfügbarkeit hängt von Chrome, Netzwerk und Drittanbietern ab."]], ["Kontakt", ["contact@arcawand-soft.com"]]]
  }
};

const prices = {
  free: { name: { en: "Free", fr: "Gratuit", es: "Gratis", it: "Gratis", de: "Kostenlos" }, price: "0€" },
  plusMonthly: { name: { en: "Plus Monthly", fr: "Plus mensuel", es: "Plus mensual", it: "Plus mensile", de: "Plus monatlich" }, price: "4,99€", suffix: { en: "per month", fr: "par mois", es: "al mes", it: "al mese", de: "pro Monat" }, url: "https://checkout.dodopayments.com/buy/pdt_0NfCEGqkUoRePcFK3NAnl?quantity=1" },
  plusYearly: { name: { en: "Plus Yearly", fr: "Plus annuel", es: "Plus anual", it: "Plus annuale", de: "Plus jährlich" }, price: "39,99€", suffix: { en: "per year", fr: "par an", es: "al año", it: "all'anno", de: "pro Jahr" }, url: "https://checkout.dodopayments.com/buy/pdt_0NfCEwaZsgaAnzbsBozKT?quantity=1" },
  proMonthly: { name: { en: "Pro Monthly", fr: "Pro mensuel", es: "Pro mensual", it: "Pro mensile", de: "Pro monatlich" }, price: "8,99€", suffix: { en: "per month", fr: "par mois", es: "al mes", it: "al mese", de: "pro Monat" }, url: "https://checkout.dodopayments.com/buy/pdt_0NfCFk0V2e9ewt8AQTUgU?quantity=1" },
  proYearly: { name: { en: "Pro Yearly", fr: "Pro annuel", es: "Pro anual", it: "Pro annuale", de: "Pro jährlich" }, price: "69,99€", suffix: { en: "per year", fr: "par an", es: "al año", it: "all'anno", de: "pro Jahr" }, url: "https://checkout.dodopayments.com/buy/pdt_0NfCGEW8cFRLbo98dwON2?quantity=1" },
  lifetime: { name: { en: "Pro Lifetime", fr: "Pro à vie", es: "Pro de por vida", it: "Pro a vita", de: "Pro Lifetime" }, price: "99€", suffix: { en: "one time", fr: "une seule fois", es: "una sola vez", it: "una sola volta", de: "einmalig" }, url: "https://checkout.dodopayments.com/buy/pdt_0NfoqxYzfXACDIlJJFR63?quantity=1" }
};

const pricingCopy = {
  en: {
    title: "Figgliz Plus or Pro",
    monthlyLead: "Try Plus or Pro monthly to unlock more video comfort, unlimited voice notes, game invitations and webcam background customization, with the freedom to stop whenever you want.",
    yearlyLead: "Switch to yearly to keep Plus or Pro benefits all year at a better price: video comfort, unlimited voice notes, game invitations, filters and webcam backgrounds.",
    launchLead: "Grab the launch offer before it disappears: one payment, Pro for life, and every Pro comfort unlocked for good.",
    freeSubtitle: "Start simply",
    plusSubtitle: "More control",
    proSubtitle: "Complete experience",
    lifetimeTitle: "Lifetime access",
    lifetimeSubtitle: "Very limited offer for the first 100 subscribers",
    currentOffer: "Current offer"
  },
  fr: {
    title: "Figgliz Plus ou Pro",
    monthlyLead: "Essaie Plus ou Pro au mois pour débloquer plus de confort vidéo, les vocaux illimités, les invitations aux jeux et la personnalisation des fonds de webcam, avec la liberté d'arrêter quand tu veux.",
    yearlyLead: "Passe à l'annuel pour garder les avantages Plus ou Pro toute l'année à meilleur prix : confort vidéo, vocaux illimités, invitations aux jeux, filtres et fonds de webcam.",
    launchLead: "Profite de l'offre de lancement avant qu'elle disparaisse : un seul paiement, Pro à vie, et tout le confort Pro débloqué pour de bon.",
    freeSubtitle: "Démarrer simplement",
    plusSubtitle: "Plus de contrôle",
    proSubtitle: "Expérience complète",
    lifetimeTitle: "Accès à vie",
    lifetimeSubtitle: "Offre très limitée aux 100 premiers abonnés",
    currentOffer: "Offre actuelle"
  },
  es: {
    title: "Figgliz Plus o Pro",
    monthlyLead: "Prueba Plus o Pro al mes para desbloquear más comodidad de vídeo, notas de voz ilimitadas, invitaciones a juegos y fondos de webcam, con libertad para parar cuando quieras.",
    yearlyLead: "Pasa al anual para mantener las ventajas Plus o Pro todo el año a mejor precio: vídeo cómodo, voces ilimitadas, juegos, filtros y fondos de webcam.",
    launchLead: "Aprovecha la oferta de lanzamiento antes de que desaparezca: un solo pago, Pro de por vida y todo el confort Pro desbloqueado para siempre.",
    freeSubtitle: "Empezar simple",
    plusSubtitle: "Más control",
    proSubtitle: "Experiencia completa",
    lifetimeTitle: "Acceso de por vida",
    lifetimeSubtitle: "Oferta muy limitada para los primeros 100 suscriptores",
    currentOffer: "Oferta actual"
  },
  it: {
    title: "Figgliz Plus o Pro",
    monthlyLead: "Prova Plus o Pro al mese per sbloccare più comfort video, vocali illimitati, inviti ai giochi e sfondi webcam, con la libertà di fermarti quando vuoi.",
    yearlyLead: "Passa all'annuale per tenere i vantaggi Plus o Pro tutto l'anno a prezzo migliore: comfort video, vocali illimitati, giochi, filtri e sfondi webcam.",
    launchLead: "Approfitta dell'offerta di lancio prima che sparisca: un solo pagamento, Pro a vita e tutto il comfort Pro sbloccato per sempre.",
    freeSubtitle: "Inizia semplicemente",
    plusSubtitle: "Più controllo",
    proSubtitle: "Esperienza completa",
    lifetimeTitle: "Accesso a vita",
    lifetimeSubtitle: "Offerta molto limitata ai primi 100 abbonati",
    currentOffer: "Offerta attuale"
  },
  de: {
    title: "Figgliz Plus oder Pro",
    monthlyLead: "Teste Plus oder Pro monatlich für mehr Videokomfort, unbegrenzte Sprachnachrichten, Spieleinladungen und Webcam-Hintergründe, mit der Freiheit jederzeit aufzuhören.",
    yearlyLead: "Wechsle zum Jahresplan und behalte Plus- oder Pro-Vorteile günstiger für das ganze Jahr: Videokomfort, unbegrenzte Sprache, Spiele, Filter und Webcam-Hintergründe.",
    launchLead: "Nutze das Launch-Angebot, bevor es verschwindet: eine Zahlung, Pro lebenslang und alle Pro-Vorteile dauerhaft freigeschaltet.",
    freeSubtitle: "Einfach starten",
    plusSubtitle: "Mehr Kontrolle",
    proSubtitle: "Komplette Erfahrung",
    lifetimeTitle: "Lebenslanger Zugriff",
    lifetimeSubtitle: "Sehr limitiertes Angebot für die ersten 100 Abonnenten",
    currentOffer: "Aktuelles Angebot"
  }
};

const pricingBenefits = {
  "en": {
    "free": [
      "Unlimited text",
      "3 voice notes per day",
      "1 video or audio call per day",
      "15-second Next cooldown"
    ],
    "plus": [
      "Unlimited voice notes",
      "30 video invitations per day",
      "2 call credits to gift per day",
      "Unlimited calls",
      "Advanced language/gender filters",
      "3-second Next cooldown"
    ],
    "pro": [
      "Unlimited video invitations",
      "Unlimited calls",
      "5 call credits to gift per day",
      "Video Pause",
      "Instant Next",
      "Priority queue",
      "Beta access"
    ]
  },
  "fr": {
    "free": [
      "Textes illimités",
      "3 vocaux par jour",
      "1 appel vidéo ou audio par jour",
      "15 secondes d'attente pour Next"
    ],
    "plus": [
      "Vocaux illimités",
      "30 demandes vidéo par jour",
      "2 crédits d'appel à offrir par jour",
      "Appels illimités",
      "Filtres avancés langue/genre",
      "3 secondes d'attente pour Next"
    ],
    "pro": [
      "Demandes vidéo illimitées",
      "Appels illimités",
      "5 crédits d'appel à offrir par jour",
      "Fonction Pause Vidéo",
      "Next instantanés",
      "Priorité dans la file",
      "Accès bêta"
    ]
  },
  "es": {
    "free": [
      "Chats de texto ilimitados",
      "3 notas de voz al día",
      "1 llamada de vídeo o audio al día",
      "15 segundos de espera para Next"
    ],
    "plus": [
      "Notas de voz ilimitadas",
      "30 solicitudes de vídeo al día",
      "2 créditos de llamada para regalar al día",
      "Llamadas ilimitadas",
      "Filtros avanzados de idioma/género",
      "3 segundos de espera para Next"
    ],
    "pro": [
      "Solicitudes de vídeo ilimitadas",
      "Llamadas ilimitadas",
      "5 créditos de llamada para regalar al día",
      "Pausa de Vídeo",
      "Next instantáneo",
      "Prioridad en la cola",
      "Acceso beta"
    ]
  },
  "it": {
    "free": [
      "Chat testuali illimitate",
      "3 vocali al giorno",
      "1 chiamata video o audio al giorno",
      "15 secondi di attesa per Next"
    ],
    "plus": [
      "Vocali illimitati",
      "30 richieste video al giorno",
      "2 crediti chiamata da regalare al giorno",
      "Chiamate illimitate",
      "Filtri avanzati lingua/genere",
      "3 secondi di attesa per Next"
    ],
    "pro": [
      "Richieste video illimitate",
      "Chiamate illimitate",
      "5 crediti chiamata da regalare al giorno",
      "Funzione Pausa Video",
      "Next istantaneo",
      "Priorità in coda",
      "Accesso beta"
    ]
  },
  "de": {
    "free": [
      "Unbegrenzte Textchats",
      "3 Sprachnachrichten pro Tag",
      "1 Video- oder Audioanruf pro Tag",
      "15 Sekunden Wartezeit für Next"
    ],
    "plus": [
      "Unbegrenzte Sprachnachrichten",
      "30 Videoanfragen pro Tag",
      "2 Anrufguthaben zum Verschenken pro Tag",
      "Unbegrenzte Anrufe",
      "Erweiterte Sprach-/Gender-Filter",
      "3 Sekunden Wartezeit für Next"
    ],
    "pro": [
      "Unbegrenzte Videoanfragen",
      "Unbegrenzte Anrufe",
      "5 Anrufguthaben zum Verschenken pro Tag",
      "Video-Pause",
      "Sofortiges Next",
      "Priorität in der Warteschlange",
      "Beta-Zugang"
    ]
  }
};

const gameLabels = {
  en: { chess: "Chess", dames: "Checkers", connect4: "Connect 4", ping: "Ping Pong", "flappy-duo": "Flappy Duo", "air-hockey": "Air Hockey" },
  fr: { chess: "Échecs", dames: "Dames", connect4: "Puissance 4", ping: "Ping Pong", "flappy-duo": "Flappy Duo", "air-hockey": "Air Hockey" },
  es: { chess: "Ajedrez", dames: "Damas", connect4: "Conecta 4", ping: "Ping Pong", "flappy-duo": "Flappy Duo", "air-hockey": "Air Hockey" },
  it: { chess: "Scacchi", dames: "Dama", connect4: "Forza 4", ping: "Ping Pong", "flappy-duo": "Flappy Duo", "air-hockey": "Air Hockey" },
  de: { chess: "Schach", dames: "Dame", connect4: "Vier gewinnt", ping: "Ping Pong", "flappy-duo": "Flappy Duo", "air-hockey": "Air Hockey" }
};

const languageCodes = { en: "GB", fr: "FR", es: "ES", it: "IT", de: "DE" };
const languageNames = { en: "English", fr: "Français", es: "Español", it: "Italiano", de: "Deutsch" };
const languageButtonLabels = { en: "Change language", fr: "Changer de langue", es: "Cambiar idioma", it: "Cambia lingua", de: "Sprache wechseln" };
const statsNavLabels = {
  en: "Statistics",
  fr: "Statistiques",
  es: "Estad\u00edsticas",
  it: "Statistiche",
  de: "Statistiken"
};
const statsCopy = {
  en: {
    title: "Figgliz live statistics",
    heading: "Live statistics",
    lead: "Follow Figgliz anonymous public activity: discussions started, webcam sessions accepted and games played by the community.",
    updated: "Last update",
    totalsTitle: "Community activity",
    gamesTitle: "Games accepted by players",
    discussions: "Discussions started",
    videoSessions: "Webcam sessions",
    gamesPlayed: "Games played",
    chess: "Chess",
    checkers: "Checkers",
    connect4: "Connect 4",
    pingpong: "Ping Pong",
    doublesnake: "Flappy Duo",
    airhockey: "Air Hockey",
    recordEyebrow: "Live record",
    recordTitle: "Flappy Duo record",
    recordDistance: "Best distance",
    recordNickname: "Player",
    privacyNote: "Only anonymous aggregate counters are displayed here. Message content, identities and conversations are never published."
  },
  fr: {
    title: "Statistiques Figgliz en direct",
    heading: "Statistiques en direct",
    lead: "Suivez l'activit\u00e9 publique et anonyme de Figgliz : discussions lanc\u00e9es, sessions webcam accept\u00e9es et parties jou\u00e9es par la communaut\u00e9.",
    updated: "Derni\u00e8re mise \u00e0 jour",
    totalsTitle: "Activit\u00e9 de la communaut\u00e9",
    gamesTitle: "Parties accept\u00e9es par les joueurs",
    discussions: "Discussions lanc\u00e9es",
    videoSessions: "Sessions webcam",
    gamesPlayed: "Parties jou\u00e9es",
    chess: "\u00c9checs",
    checkers: "Dames",
    connect4: "Puissance 4",
    pingpong: "Ping Pong",
    doublesnake: "Flappy Duo",
    airhockey: "Air Hockey",
    recordEyebrow: "Record en direct",
    recordTitle: "Record Flappy Duo",
    recordDistance: "Meilleure distance",
    recordNickname: "Pseudo",
    privacyNote: "Seuls des compteurs anonymes agr\u00e9g\u00e9s sont affich\u00e9s ici. Les messages, identit\u00e9s et conversations ne sont jamais publi\u00e9s."
  },
  es: {
    title: "Estad\u00edsticas en directo de Figgliz",
    heading: "Estad\u00edsticas en directo",
    lead: "Sigue la actividad p\u00fablica y an\u00f3nima de Figgliz: conversaciones iniciadas, sesiones de webcam aceptadas y partidas jugadas por la comunidad.",
    updated: "\u00daltima actualizaci\u00f3n",
    totalsTitle: "Actividad de la comunidad",
    gamesTitle: "Partidas aceptadas por jugadores",
    discussions: "Conversaciones iniciadas",
    videoSessions: "Sesiones de webcam",
    gamesPlayed: "Partidas jugadas",
    chess: "Ajedrez",
    checkers: "Damas",
    connect4: "Conecta 4",
    pingpong: "Ping Pong",
    doublesnake: "Flappy Duo",
    airhockey: "Air Hockey",
    recordEyebrow: "R\u00e9cord en directo",
    recordTitle: "R\u00e9cord de Flappy Duo",
    recordDistance: "Mejor distancia",
    recordNickname: "Alias",
    privacyNote: "Aqu\u00ed solo se muestran contadores agregados an\u00f3nimos. Los mensajes, identidades y conversaciones nunca se publican."
  },
  it: {
    title: "Statistiche live Figgliz",
    heading: "Statistiche live",
    lead: "Segui l'attivit\u00e0 pubblica e anonima di Figgliz: conversazioni avviate, sessioni webcam accettate e partite giocate dalla community.",
    updated: "Ultimo aggiornamento",
    totalsTitle: "Attivit\u00e0 della community",
    gamesTitle: "Partite accettate dai giocatori",
    discussions: "Conversazioni avviate",
    videoSessions: "Sessioni webcam",
    gamesPlayed: "Partite giocate",
    chess: "Scacchi",
    checkers: "Dama",
    connect4: "Forza 4",
    pingpong: "Ping Pong",
    doublesnake: "Flappy Duo",
    airhockey: "Air Hockey",
    recordEyebrow: "Record live",
    recordTitle: "Record Flappy Duo",
    recordDistance: "Migliore distanza",
    recordNickname: "Nickname",
    privacyNote: "Qui sono mostrati solo contatori aggregati anonimi. Messaggi, identit\u00e0 e conversazioni non vengono mai pubblicati."
  },
  de: {
    title: "Figgliz Live-Statistiken",
    heading: "Live-Statistiken",
    lead: "Verfolge die anonyme \u00f6ffentliche Aktivit\u00e4t von Figgliz: gestartete Gespr\u00e4che, angenommene Webcam-Sitzungen und gespielte Partien.",
    updated: "Letzte Aktualisierung",
    totalsTitle: "Community-Aktivit\u00e4t",
    gamesTitle: "Von Spielern angenommene Partien",
    discussions: "Gestartete Gespr\u00e4che",
    videoSessions: "Webcam-Sitzungen",
    gamesPlayed: "Gespielte Partien",
    chess: "Schach",
    checkers: "Dame",
    connect4: "Vier gewinnt",
    pingpong: "Ping Pong",
    doublesnake: "Flappy Duo",
    airhockey: "Air Hockey",
    recordEyebrow: "Live-Rekord",
    recordTitle: "Flappy Duo Rekord",
    recordDistance: "Beste Distanz",
    recordNickname: "Name",
    privacyNote: "Hier werden nur anonyme aggregierte Z\u00e4hler angezeigt. Nachrichten, Identit\u00e4ten und Gespr\u00e4che werden niemals ver\u00f6ffentlicht."
  }
};
const pageSlugs = { presentation: "", faq: "faq/", stats: "stats/", privacy: "privacy/", terms: "terms/" };

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

function langBase(lang) {
  return lang === "en" ? "" : `${lang}/`;
}

function productBase(lang) {
  return `${langBase(lang)}figgliz/`;
}

function absProduct(lang, page = "presentation") {
  return `https://arcawand-soft.com/${productBase(lang)}${pageSlugs[page] || ""}`;
}

function relFromProductPage(page) {
  return page === "presentation"
    ? { presentation: "./", faq: "faq/", stats: "stats/", privacy: "privacy/", terms: "terms/" }
    : { presentation: "../", faq: "../faq/", stats: "../stats/", privacy: "../privacy/", terms: "../terms/" };
}

function languageMenu(current) {
  const options = Object.keys(langs).map((code) => `<button class="language-menu-option" type="button" role="option" data-lang="${code}"${code === current ? ' aria-selected="true"' : ""}><span class="language-code-badge">${languageCodes[code]}</span><span>${languageNames[code]}</span></button>`).join("");
  return `<div class="language-menu arcawand-product-language-menu" data-current-lang="${current}"><button class="language-menu-button" type="button" aria-label="${esc(languageButtonLabels[current])}" aria-haspopup="listbox" aria-expanded="false"><span class="language-code-badge">${languageCodes[current] || current.toUpperCase()}</span><span>${languageNames[current]}</span><span class="language-menu-chevron" aria-hidden="true"></span></button><div class="language-menu-panel" role="listbox" aria-label="${esc(languageButtonLabels[current])}">${options}</div></div>`;
}

function productNav(lang, active, rel) {
  const l = langs[lang];
  return `<nav class="ucp-product-nav figgliz-product-nav" aria-label="Figgliz"><a href="${rel.presentation}" data-ucp-nav="presentation"${active === "presentation" ? ' aria-current="page"' : ""}>${esc(l.presentation)}</a><a href="${rel.faq}" data-ucp-nav="faq"${active === "faq" ? ' aria-current="page"' : ""}>${esc(l.faq)}</a><a href="${rel.stats}" data-ucp-nav="stats"${active === "stats" ? ' aria-current="page"' : ""}>${esc(statsNavLabels[lang] || statsNavLabels.en)}</a><a href="${rel.privacy}" data-ucp-nav="privacy"${active === "privacy" ? ' aria-current="page"' : ""}>${esc(l.privacy)}</a><a href="${rel.terms}" data-ucp-nav="terms"${active === "terms" ? ' aria-current="page"' : ""}>${esc(l.terms)}</a></nav>`;
}

function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function structuredData(lang, page, title, desc) {
  const l = langs[lang];
  const canonical = absProduct(lang, page);
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Figgliz",
      applicationCategory: "BrowserApplication",
      operatingSystem: "Chrome",
      description: l.pageDesc.presentation,
      url: absProduct(lang, "presentation"),
      image: socialImage,
      offers: { "@type": "AggregateOffer", lowPrice: "0", highPrice: "99", priceCurrency: "EUR" },
      publisher: { "@type": "Organization", name: "ArcaWand Soft", url: "https://arcawand-soft.com/" }
    },
    {
      "@context": "https://schema.org",
      "@type": page === "privacy" ? "PrivacyPolicy" : page === "terms" ? "TermsOfService" : "WebPage",
      name: title,
      headline: title,
      description: desc,
      image: socialImage,
      primaryImageOfPage: { "@type": "ImageObject", url: socialImage, width: 1200, height: 675 },
      url: canonical,
      inLanguage: l.html,
      isPartOf: { "@type": "WebSite", name: "ArcaWand Soft", url: "https://arcawand-soft.com/" },
      about: { "@type": "SoftwareApplication", name: "Figgliz", applicationCategory: "BrowserApplication", image: socialImage }
    }
  ];
  if (page === "faq") {
    const faq = legalPageContent(lang, "faq");
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.sections.map((section) => ({
        "@type": "Question",
        name: section.title,
        acceptedAnswer: { "@type": "Answer", text: sectionText(section) }
      }))
    });
  }
  return graph.map((entry) => `<script type="application/ld+json">${jsonLd(entry)}</script>`).join("\n");
}

function legalPageContent(lang, page) {
  return extensionLegalContent[lang]?.[page] || extensionLegalContent.en[page];
}

function sectionText(section) {
  return [section.body, ...(Array.isArray(section.items) ? section.items : [])].filter(Boolean).join(" ");
}

function renderLegalSection(section) {
  const body = section.body ? `<p>${esc(section.body)}</p>` : "";
  const items = Array.isArray(section.items) && section.items.length
    ? `<ul>${section.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
    : "";
  return `<h2>${esc(section.title)}</h2>${body}${items}`;
}

function benefitList(items) {
  return `<ul class="figgliz-plan-benefits">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function pricingCard(lang, key, tier, featured = false) {
  const l = langs[lang];
  const copy = pricingCopy[lang];
  const benefits = pricingBenefits[lang];
  const plan = prices[key];
  const isFree = key === "free";
  const subtitle = tier === "plus" ? copy.plusSubtitle : tier === "pro" ? copy.proSubtitle : copy.freeSubtitle;
  const cta = isFree
    ? ""
    : `<a class="figgliz-price-button" href="${plan.url}" target="_blank" rel="noopener noreferrer">${esc(l.chooseOffer)}</a>`;
  const badge = tier === "plus" || tier === "pro" ? `<img class="figgliz-plan-badge" src="/assets/figgliz/Badge_${tier === "plus" ? "Plus" : "Pro"}.png" alt="${tier === "plus" ? "Plus" : "Pro"}" width="88" height="88" loading="lazy" decoding="async">` : "";
  return `<article class="figgliz-price-card figgliz-price-card-${tier}${featured ? " is-featured" : ""}"><header class="figgliz-plan-card-head"><div>${badge}<h3>${esc(plan.name[lang] || plan.name.en)}</h3><p>${esc(subtitle)}</p></div><p class="figgliz-price"><span>${esc(plan.price)}</span>${plan.suffix ? `<small>${esc(plan.suffix[lang])}</small>` : ""}</p></header>${benefitList(benefits[tier])}${cta}</article>`;
}

function lifetimeCard(lang) {
  const copy = pricingCopy[lang];
  const l = langs[lang];
  const plan = prices.lifetime;
  return `<article class="figgliz-lifetime-card"><header class="figgliz-plan-card-head"><div><img class="figgliz-plan-badge" src="/assets/figgliz/Badge_Pro.png" alt="Pro" width="88" height="88" loading="lazy" decoding="async"><h3>${esc(copy.lifetimeTitle)}</h3><p>${esc(copy.lifetimeSubtitle)}</p></div><p class="figgliz-price"><span>${esc(plan.price)}</span><small>${esc(plan.suffix[lang])}</small></p></header>${benefitList(pricingBenefits[lang].pro)}<a class="figgliz-price-button" href="${plan.url}" target="_blank" rel="noopener noreferrer">${esc(l.chooseOffer)}</a></article>`;
}

function pricing(lang) {
  const l = langs[lang];
  const copy = pricingCopy[lang];
  return `<section id="plans" class="figgliz-section figgliz-pricing"><div class="figgliz-plan-box" data-plan="monthly"><div class="figgliz-plan-head"><h2>${esc(copy.title)}</h2><p class="figgliz-plan-lead figgliz-plan-lead-monthly">${esc(copy.monthlyLead)}</p><p class="figgliz-plan-lead figgliz-plan-lead-yearly">${esc(copy.yearlyLead)}</p><p class="figgliz-plan-lead figgliz-plan-lead-launch">${esc(copy.launchLead)}</p></div><div class="figgliz-plan-tabs" role="tablist" aria-label="${esc(l.pricingTitle)}"><button type="button" role="tab" aria-selected="true" data-plan-tab="monthly">${esc(l.monthly)}</button><button type="button" role="tab" aria-selected="false" data-plan-tab="yearly">${esc(l.yearly)}</button><button type="button" role="tab" aria-selected="false" data-plan-tab="launch">${esc(l.launch)}</button></div><div class="figgliz-plan-content figgliz-plan-content-monthly">${pricingCard(lang, "free", "free")}${pricingCard(lang, "plusMonthly", "plus", true)}${pricingCard(lang, "proMonthly", "pro", true)}</div><div class="figgliz-plan-content figgliz-plan-content-yearly">${pricingCard(lang, "free", "free")}${pricingCard(lang, "plusYearly", "plus", true)}${pricingCard(lang, "proYearly", "pro", true)}</div><div class="figgliz-plan-content figgliz-plan-content-launch">${lifetimeCard(lang)}</div></div></section>`;
}

function presentationPage(lang) {
  const l = langs[lang];
  const about = legalPageContent(lang, "about");
  const aboutSections = about.sections.filter((section) => !/^contact$/i.test(section.title));
  const features = aboutSections.map((section) => `<article class="figgliz-card"><h3>${esc(section.title)}</h3><p>${esc(sectionText(section))}</p></article>`).join("");
  const games = ["chess", "dames", "connect4", "ping", "flappy-duo", "air-hockey"].map((name) => `<figure class="figgliz-game"><img src="/assets/figgliz/${name}.webp" alt="" width="160" height="160" loading="lazy" decoding="async"><figcaption>${esc(gameLabels[lang][name])}</figcaption></figure>`).join("");
  return `<section class="ucp-static-hero figgliz-hero"><h1>${esc(l.heroTitle)}</h1><p>${esc(l.heroLead)}</p><figure class="figgliz-product-image"><img src="/assets/figgliz_image_produit.png" alt="Figgliz Chrome extension product preview" width="1254" height="1254" loading="eager" decoding="async" fetchpriority="high"></figure><div class="figgliz-actions"><button class="figgliz-primary" type="button" data-install-extension-trigger="true">${esc(l.primaryCta)}</button><a class="figgliz-secondary" href="#plans">${esc(l.secondaryCta)}</a></div><p class="figgliz-beta">${esc(l.betaNote)}</p></section><section class="figgliz-section"><div class="figgliz-section-head"><h2>${esc(about.title)}</h2><p>${esc(about.lead)}</p></div><div class="figgliz-card-grid">${features}</div></section><section class="figgliz-section figgliz-games"><div class="figgliz-section-head"><h2>${esc(l.gamesTitle)}</h2><p>${esc(l.gamesLead)}</p></div><div class="figgliz-game-grid">${games}</div></section><figure class="figgliz-demo-shot"><img src="/assets/figgliz_chess_demo.png" alt="Figgliz chess game with webcam conversations" width="1672" height="941" loading="lazy" decoding="async"></figure>${pricing(lang)}`;
}

function textPage(lang, page) {
  const content = legalPageContent(lang, page);
  return `<article class="ucp-page-content figgliz-text-content">${content.sections.map(renderLegalSection).join("\n")}</article>`;
}

function faqPage(lang) {
  const content = legalPageContent(lang, "faq");
  return `<div class="ucp-faq-list">${content.sections.map((section) => `<article class="ucp-faq-item"><h2>${esc(section.title)}</h2><p>${esc(sectionText(section))}</p></article>`).join("\n")}</div>`;
}

function statsPage(lang) {
  const copy = statsCopy[lang] || statsCopy.en;
  const totalCards = [
    ["discussions", copy.discussions, "icon.webp"],
    ["videoSessions", copy.videoSessions, "webcam.webp"],
    ["gamesPlayed", copy.gamesPlayed, "games.webp"]
  ].map(([key, label, image]) => `<article class="figgliz-stat-card figgliz-stat-card-total"><img src="/assets/figgliz/${image}" alt="" width="86" height="86" loading="lazy" decoding="async"><div><p>${esc(label)}</p><strong data-figgliz-stat="${key}">--</strong></div></article>`).join("");
  const gameCards = [
    ["chess", copy.chess, "chess.webp"],
    ["checkers", copy.checkers, "dames.webp"],
    ["connect4", copy.connect4, "connect4.webp"],
    ["pingpong", copy.pingpong, "ping.webp"],
    ["doublesnake", copy.doublesnake, "flappy-duo.webp"],
    ["airhockey", copy.airhockey, "air-hockey.webp"]
  ].map(([key, label, image]) => `<article class="figgliz-stat-card figgliz-stat-card-game"><img src="/assets/figgliz/${image}" alt="" width="96" height="96" loading="lazy" decoding="async"><p>${esc(label)}</p><strong data-figgliz-stat="${key}">--</strong></article>`).join("");
  const recordCard = `<article class="figgliz-stat-record-card" data-figgliz-flappy-record><div class="figgliz-stat-record-visual" aria-hidden="true"><img src="/assets/figgliz/flappy-record-trophy.png" alt="" width="120" height="120" loading="lazy" decoding="async"></div><div class="figgliz-stat-record-copy"><p>${esc(copy.recordEyebrow)}</p><h2>${esc(copy.recordTitle)}</h2><dl><div><dt>${esc(copy.recordDistance)}</dt><dd data-figgliz-record-distance>--</dd></div><div><dt>${esc(copy.recordNickname)}</dt><dd data-figgliz-record-nickname>--</dd></div></dl></div></article>`;
  return `<section class="figgliz-section figgliz-stats-page" data-figgliz-stats data-stats-endpoint="https://figgliz.arcawand-soft.com/stats.json" data-lang="${lang}"><div class="figgliz-stats-grid figgliz-stats-totals" aria-label="${esc(copy.totalsTitle)}">${totalCards}</div><div class="figgliz-stats-heading"><h2>${esc(copy.gamesTitle)}</h2><p>${esc(copy.privacyNote)}</p></div><div class="figgliz-stats-grid figgliz-stats-games">${gameCards}</div>${recordCard}<p class="figgliz-stats-updated"><span>${esc(copy.updated)} : </span><time data-figgliz-stat-updated>--</time></p></section>`;
}

function pageTitle(lang, page) {
  const l = langs[lang];
  const presentationTitles = {
    en: "Figgliz - Private random conversations for Chrome",
    fr: "Figgliz - Conversations aléatoires privées pour Chrome",
    es: "Figgliz - Conversaciones aleatorias privadas para Chrome",
    it: "Figgliz - Conversazioni casuali private per Chrome",
    de: "Figgliz - Private Zufallsgespräche für Chrome"
  };
  if (page === "stats") return (statsCopy[lang] || statsCopy.en).title;
  return page === "presentation" ? presentationTitles[lang] : l.pageTitles[page];
}

function render(lang, page) {
  const l = langs[lang];
  const rel = relFromProductPage(page);
  const title = pageTitle(lang, page);
  const desc = page === "stats" ? (statsCopy[lang] || statsCopy.en).lead : l.pageDesc[page];
  const canonical = absProduct(lang, page);
  const main = page === "presentation" ? presentationPage(lang) : page === "faq" ? faqPage(lang) : page === "stats" ? statsPage(lang) : textPage(lang, page);
  const legalContent = page === "faq" || page === "privacy" || page === "terms" ? legalPageContent(lang, page) : null;
  const staticTitle = page === "presentation" ? "" : page === "stats" ? (statsCopy[lang] || statsCopy.en).heading : legalContent.title;
  const staticKicker = page === "faq" ? l.faq : page === "stats" ? (statsNavLabels[lang] || statsNavLabels.en) : page === "privacy" ? l.privacy : l.terms;
  const headingLead = legalContent?.lead || desc;
  const heading = page === "presentation" ? "" : `<section class="ucp-static-hero figgliz-static-hero"><span class="ucp-static-kicker">${esc(staticKicker)}</span><h1><span class="ucp-heading-line ucp-heading-main">${esc(staticTitle)}</span><span class="ucp-heading-line ucp-heading-product">Figgliz</span></h1><p>${esc(headingLead)}</p></section>`;
  return `<!doctype html>
<html lang="${l.html}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#6b82ff">
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
<meta property="og:image" content="${socialImage}">
<meta property="og:image:secure_url" content="${socialImage}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="675">
<meta property="og:image:alt" content="${socialImageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${socialImage}">
<meta name="twitter:image:alt" content="${socialImageAlt}">
${structuredData(lang, page, title, desc)}
<link rel="icon" type="image/png" href="/assets/Arcawand_Soft_Favicon.png">
<link rel="stylesheet" href="/assets/ucp-product-pages.css?v=20260515-heading-flow">
<link rel="stylesheet" href="/assets/figgliz-product.css?v=20260619-stats">
<script defer src="/assets/analytics.js"></script>
<script defer src="/assets/figgliz-product-pages.js?v=20260619-stats"></script>
<script defer src="/assets/install-extension-modal.js?v=20260601-beta"></script>
</head>
<body class="ucp-static-page figgliz-static-page">
<a class="arcawand-root-return" href="${l.home}" aria-label="${esc(l.back)}">&larr; ArcaWand Soft</a>
<div class="ucp-product-mark figgliz-product-mark"><img src="/assets/figgliz/icon.webp" alt="" width="48" height="48" decoding="async"><span class="ucp-product-title">Figgliz</span></div>
${languageMenu(lang)}
${productNav(lang, page, rel)}
<main class="ucp-static-main figgliz-main">
${heading}
${main}
</main>
<footer class="ucp-static-footer"><span>${esc(l.footer)}</span><span><a href="mailto:contact@arcawand-soft.com">contact@arcawand-soft.com</a></span></footer>
</body>
</html>
`;
}

function copyAssets() {
  fs.mkdirSync(figglizAssets, { recursive: true });
  for (const file of ["figgliz-head.webp", "icon.webp", "webcam.webp", "games.webp", "chess.webp", "dames.webp", "connect4.webp", "ping.webp", "flappy-duo.webp", "flappy-record-trophy.png", "air-hockey.webp"]) {
    fs.copyFileSync(path.join(sourceAssets, file), path.join(figglizAssets, file));
  }
  for (const file of ["Badge_Plus.png", "Badge_Pro.png"]) {
    fs.copyFileSync(path.resolve(root, "..", "figgliz", "extension", "assets", "icons", file), path.join(figglizAssets, file));
  }
}

function writePages() {
  for (const lang of Object.keys(langs)) {
    for (const page of Object.keys(pageSlugs)) {
      const dir = path.join(root, productBase(lang), pageSlugs[page]);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), render(lang, page), "utf8");
    }
  }
}

function navDrop(lang, depth) {
  const prefix = depth === 0 ? "" : "../".repeat(depth);
  const l = langs[lang];
  const ucpLinks = {
    presentation: `${prefix}ultimate-clipboard-pro/`,
    demo: `${prefix}ultimate-clipboard-pro/demo/`,
    faq: `${prefix}ultimate-clipboard-pro/faq/`,
    privacy: `${prefix}ultimate-clipboard-pro/privacy/`,
    terms: `${prefix}ultimate-clipboard-pro/terms/`
  };
  const fig = {
    presentation: `${prefix}figgliz/`,
    faq: `${prefix}figgliz/faq/`,
    stats: `${prefix}figgliz/stats/`,
    privacy: `${prefix}figgliz/privacy/`,
    terms: `${prefix}figgliz/terms/`
  };
  const labels = {
    en: { ucpDesc: "An advanced clipboard for demanding users", demo: "Demo", terms: "Terms of use" },
    fr: { ucpDesc: "Un presse-papiers avancé pour les utilisateurs exigeants", demo: "Démo", terms: "CGU" },
    es: { ucpDesc: "Un portapapeles avanzado para usuarios exigentes", demo: "Demo", terms: "Términos de uso" },
    it: { ucpDesc: "Un portappunti avanzato per utenti esigenti", demo: "Demo", terms: "Termini d'uso" },
    de: { ucpDesc: "Eine erweiterte Zwischenablage für anspruchsvolle Nutzer", demo: "Demo", terms: "Nutzungsbedingungen" }
  }[lang];
  const app = (title, desc, hrefs, includeDemo) => `<div class="nav-app-card"><a class="nav-drop-item nav-app-main" href="${hrefs.presentation}"><strong>${esc(title)}</strong><span>${esc(desc)}</span></a><div class="nav-app-links ${includeDemo ? "" : "nav-app-links-four"}"><a href="${hrefs.presentation}">${esc(l.presentation)}</a>${includeDemo ? `<a href="${hrefs.demo}">${esc(labels.demo)}</a>` : ""}<a href="${hrefs.faq}">${esc(l.faq)}</a>${hrefs.stats ? `<a href="${hrefs.stats}">${esc(statsNavLabels[lang] || statsNavLabels.en)}</a>` : ""}<a href="${hrefs.privacy}">${esc(l.privacy)}</a><a href="${hrefs.terms}">${esc(includeDemo ? labels.terms : l.terms)}</a></div></div>`;
  return `<div class="nav-drop"><button class="nav-drop-button" type="button" data-i18n="navSofts">${esc(l.navSofts)}</button><div class="nav-drop-menu nav-apps-menu nav-apps-menu-wide">${app("Ultimate Clipboard Pro", labels.ucpDesc, ucpLinks, true)}${app("Figgliz", l.productDesc, fig, false)}</div></div>`;
}

function patchHomeNav() {
  const files = [
    ["index.html", "en", 0], ["contact/index.html", "en", 1], ["privacy/index.html", "en", 1],
    ["fr/index.html", "fr", 0], ["fr/contact/index.html", "fr", 1], ["fr/privacy/index.html", "fr", 1],
    ["es/index.html", "es", 0], ["es/contact/index.html", "es", 1], ["es/privacy/index.html", "es", 1],
    ["it/index.html", "it", 0], ["it/contact/index.html", "it", 1], ["it/privacy/index.html", "it", 1],
    ["de/index.html", "de", 0], ["de/contact/index.html", "de", 1], ["de/privacy/index.html", "de", 1]
  ];
  for (const [rel, lang, depth] of files) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/<div class="nav-drop">[\s\S]*?<\/div><\/div><\/div><a class="nav-link"/, `${navDrop(lang, depth)}<a class="nav-link"`);
    fs.writeFileSync(file, content, "utf8");
  }
}

function patchSitemap() {
  const file = path.join(root, "sitemap.xml");
  let content = fs.readFileSync(file, "utf8");
  const urls = Object.keys(langs).flatMap((lang) => Object.keys(pageSlugs).map((page) => absProduct(lang, page)));
  const additions = urls.filter((url) => !content.includes(`<loc>${url}</loc>`)).map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join("\n");
  if (additions) content = content.replace("</urlset>", `${additions}\n</urlset>`);
  fs.writeFileSync(file, content, "utf8");
}

copyAssets();
writePages();
patchHomeNav();
patchSitemap();
