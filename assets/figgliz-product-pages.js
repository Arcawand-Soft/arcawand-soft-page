(() => {
  const supportedLangs = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];
  const labels = {
    en: { presentation: "Presentation", faq: "FAQ", stats: "Statistics", privacy: "Privacy policy", terms: "Terms of use" },
    fr: { presentation: "Pr\u00e9sentation", faq: "FAQ", stats: "Statistiques", privacy: "Politique de confidentialité", terms: "CGU" },
    es: { presentation: "Presentaci\u00f3n", faq: "FAQ", stats: "Estad\u00edsticas", privacy: "Política de privacidad", terms: "Términos de uso" },
    it: { presentation: "Presentazione", faq: "FAQ", stats: "Statistiche", privacy: "Informativa privacy", terms: "Termini d'uso" },
    de: { presentation: "Pr\u00e4sentation", faq: "FAQ", stats: "Statistiken", privacy: "Datenschutz", terms: "Nutzungsbedingungen" }
  };
  const languageButtonLabels = {
    en: "Change language",
    fr: "Changer de langue",
    es: "Cambiar idioma",
    it: "Cambia lingua",
    de: "Sprache wechseln"
  };
  const routes = {
    en: { presentation: "https://arcawand-soft.com/figgliz/", faq: "https://arcawand-soft.com/figgliz/faq/", stats: "https://arcawand-soft.com/figgliz/stats/", privacy: "https://arcawand-soft.com/figgliz/privacy/", terms: "https://arcawand-soft.com/figgliz/terms/" },
    fr: { presentation: "https://arcawand-soft.com/fr/figgliz/", faq: "https://arcawand-soft.com/fr/figgliz/faq/", stats: "https://arcawand-soft.com/fr/figgliz/stats/", privacy: "https://arcawand-soft.com/fr/figgliz/privacy/", terms: "https://arcawand-soft.com/fr/figgliz/terms/" },
    es: { presentation: "https://arcawand-soft.com/es/figgliz/", faq: "https://arcawand-soft.com/es/figgliz/faq/", stats: "https://arcawand-soft.com/es/figgliz/stats/", privacy: "https://arcawand-soft.com/es/figgliz/privacy/", terms: "https://arcawand-soft.com/es/figgliz/terms/" },
    it: { presentation: "https://arcawand-soft.com/it/figgliz/", faq: "https://arcawand-soft.com/it/figgliz/faq/", stats: "https://arcawand-soft.com/it/figgliz/stats/", privacy: "https://arcawand-soft.com/it/figgliz/privacy/", terms: "https://arcawand-soft.com/it/figgliz/terms/" },
    de: { presentation: "https://arcawand-soft.com/de/figgliz/", faq: "https://arcawand-soft.com/de/figgliz/faq/", stats: "https://arcawand-soft.com/de/figgliz/stats/", privacy: "https://arcawand-soft.com/de/figgliz/privacy/", terms: "https://arcawand-soft.com/de/figgliz/terms/" }
  };
  const pricingEndpoint = "https://api.arcawand-soft.com/billing/checkout-prices";
  const checkoutEndpoint = "https://api.arcawand-soft.com/billing/checkout-session";
  const pricingCacheKey = "figglizCheckoutPriceCache:v1";
  const currencyStorageKey = "figglizCheckoutCurrency";
  const freshPriceTtlMs = 6 * 60 * 60 * 1000;
  const stalePriceTtlMs = 7 * 24 * 60 * 60 * 1000;
  const supportedCurrencies = Object.freeze([
    "AED", "ALL", "AMD", "AUD", "AWG", "AZN", "BAM", "BDT", "BIF", "BMD", "BND", "BOB",
    "BRL", "BSD", "BWP", "BZD", "CAD", "CHF", "CLP", "CNY", "CRC", "CZK", "DJF", "DKK",
    "DOP", "EGP", "ETB", "EUR", "FJD", "GBP", "GEL", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL",
    "HUF", "IDR", "ILS", "INR", "JPY", "KMF", "KRW", "KZT", "LKR", "LRD", "LSL", "MAD",
    "MGA", "MKD", "MOP", "MUR", "MVR", "MWK", "MXN", "MYR", "NGN", "NOK", "NPR", "NZD",
    "PEN", "PGK", "PHP", "PLN", "PYG", "QAR", "RON", "RSD", "RWF", "SAR", "SBD", "SCR",
    "SEK", "SGD", "SZL", "THB", "TOP", "TRY", "TWD", "TZS", "USD", "UYU", "VND", "VUV",
    "WST", "XAF", "XOF", "XPF", "ZAR", "ZMW"
  ]);
  const priorityCurrencies = Object.freeze([
    "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL", "MXN", "SGD",
    "AED", "SAR", "SEK", "NOK", "DKK", "PLN", "RON", "TRY", "HKD", "NZD", "KRW", "ZAR"
  ]);
  const checkoutLinks = Object.freeze({
    plus: {
      monthly: "https://checkout.dodopayments.com/buy/pdt_0NfCEGqkUoRePcFK3NAnl?quantity=1",
      yearly: "https://checkout.dodopayments.com/buy/pdt_0NfCEwaZsgaAnzbsBozKT?quantity=1"
    },
    pro: {
      monthly: "https://checkout.dodopayments.com/buy/pdt_0NfCFk0V2e9ewt8AQTUgU?quantity=1",
      yearly: "https://checkout.dodopayments.com/buy/pdt_0NfCGEW8cFRLbo98dwON2?quantity=1",
      launch: "https://checkout.dodopayments.com/buy/pdt_0NfoqxYzfXACDIlJJFR63?quantity=1"
    }
  });
  const currencyByRegion = Object.freeze({
    AE: "AED", AL: "ALL", AM: "AMD", AU: "AUD", AW: "AWG", AZ: "AZN", BA: "BAM", BD: "BDT",
    BI: "BIF", BM: "BMD", BN: "BND", BO: "BOB", BR: "BRL", BS: "BSD", BW: "BWP", BZ: "BZD",
    CA: "CAD", CH: "CHF", CL: "CLP", CN: "CNY", CR: "CRC", CZ: "CZK", DJ: "DJF", DK: "DKK",
    DO: "DOP", EG: "EGP", ET: "ETB", FJ: "FJD", GB: "GBP", UK: "GBP", GE: "GEL", GM: "GMD",
    GN: "GNF", GT: "GTQ", GY: "GYD", HK: "HKD", HN: "HNL", HU: "HUF", ID: "IDR", IL: "ILS",
    IN: "INR", JP: "JPY", KM: "KMF", KR: "KRW", KZ: "KZT", LK: "LKR", LR: "LRD", LS: "LSL",
    MA: "MAD", MG: "MGA", MK: "MKD", MO: "MOP", MU: "MUR", MV: "MVR", MW: "MWK", MX: "MXN",
    MY: "MYR", NG: "NGN", NO: "NOK", NP: "NPR", NZ: "NZD", PE: "PEN", PG: "PGK", PH: "PHP",
    PL: "PLN", PY: "PYG", QA: "QAR", RO: "RON", RS: "RSD", RW: "RWF", SA: "SAR", SB: "SBD",
    SC: "SCR", SE: "SEK", SG: "SGD", SZ: "SZL", TH: "THB", TO: "TOP", TR: "TRY", TW: "TWD",
    TZ: "TZS", US: "USD", UY: "UYU", VN: "VND", VU: "VUV", WS: "WST", CM: "XAF", SN: "XOF",
    PF: "XPF", ZA: "ZAR", ZM: "ZMW", AT: "EUR", BE: "EUR", CY: "EUR", DE: "EUR", EE: "EUR",
    ES: "EUR", FI: "EUR", FR: "EUR", GR: "EUR", HR: "EUR", IE: "EUR", IT: "EUR", LT: "EUR",
    LU: "EUR", LV: "EUR", MT: "EUR", NL: "EUR", PT: "EUR", SI: "EUR", SK: "EUR"
  });
  const pricingText = {
    en: {
      title: "Figgliz Plus or Pro", monthly: "Monthly", yearly: "Yearly", launch: "Launch offer", choose: "Choose this plan", current: "Current offer", payIn: "Pay in {currency}", currency: "Currency", loading: "Updating prices", perMonth: "per month", perYear: "per year", oneTime: "one time",
      monthlyLead: "Try Plus or Pro monthly to unlock more video comfort, unlimited voice messages, game invitations and webcam background customization, with freedom to stop whenever you want.",
      yearlyLead: "Switch to yearly to keep Plus or Pro benefits all year at a better price: video comfort, unlimited voice messages, games, filters and webcam backgrounds.",
      launchLead: "Grab the launch offer before it disappears: one payment, Pro for life, unlimited gifted call credits and every Pro comfort unlocked for good.",
      freeTag: "Start safely", plusTag: "More control", proTag: "Full experience", lifetimeTitle: "Lifetime access", lifetimeSubtitle: "Very limited offer for the first 100 subscribers",
      free: ["Unlimited text", "3 voice messages per day", "1 video or audio call per day", "Receive game invitations", "15 seconds of waiting for Next"],
      plus: ["Unlimited voice messages", "30 video requests per day", "Unlimited audio calls", "Webcam backgrounds", "Advanced filters", "Send game invitations", "2 gifted call credits per day", "Conversation history", "3 seconds of waiting for Next", "4x matching priority"],
      pro: ["Unlimited voice messages", "Unlimited audio and video calls", "Webcam backgrounds", "Video Pause", "Send game invitations", "5 gifted call credits per day", "Conversation history", "Instant Next", "Priority queue", "Beta access"],
      lifetime: ["Unlimited voice messages", "Unlimited audio and video calls", "Webcam backgrounds", "Video Pause", "Send game invitations", "Conversation history", "Instant Next", "Priority queue", "Unlimited gifted call credits per day", "Beta access"]
    },
    fr: {
      title: "Figgliz Plus ou Pro", monthly: "Mensuel", yearly: "Annuel", launch: "Offre de lancement", choose: "Choisir cette offre", current: "Offre actuelle", payIn: "Payer en {currency}", currency: "Devise", loading: "Mise à jour des prix", perMonth: "par mois", perYear: "par an", oneTime: "une seule fois",
      monthlyLead: "Essaie Plus ou Pro au mois pour débloquer plus de confort vidéo, les messages vocaux illimités, les invitations aux jeux et les arrière-plans de webcam, avec la liberté d'arrêter quand tu veux.",
      yearlyLead: "Passe à l'annuel pour garder les avantages Plus ou Pro toute l'année à meilleur prix : confort vidéo, messages vocaux illimités, jeux, filtres et arrière-plans de webcam.",
      launchLead: "Profite de l'offre de lancement avant qu'elle disparaisse : un seul paiement, Pro à vie, crédits d'appels à offrir illimités et tout le confort Pro débloqué pour de bon.",
      freeTag: "Démarrer simplement", plusTag: "Plus de contrôle", proTag: "Expérience complète", lifetimeTitle: "Accès à vie", lifetimeSubtitle: "Offre très limitée aux 100 premiers abonnés",
      free: ["Textes illimités", "3 messages vocaux par jour", "1 appel vidéo ou audio par jour", "Réception d'invitation aux jeux", "15 secondes d'attente pour Next"],
      plus: ["Messages vocaux illimités", "30 appels vidéo par jour", "Appels audio illimités", "Arrière-plans de webcam", "Filtres avancés", "Envoi d'invitation aux jeux", "2 crédits d'appel à offrir par jour", "Historique des conversations", "3 secondes d'attente pour Next", "Priorité matching 4x"],
      pro: ["Messages vocaux illimités", "Appels audio et vidéo illimités", "Arrière-plans de webcam", "Pause vidéo", "Envoi d'invitation aux jeux", "5 crédits d'appel à offrir par jour", "Historique des conversations", "Next instantanés", "Priorité dans la file", "Accès bêta aux nouveautés"],
      lifetime: ["Messages vocaux illimités", "Appels audio et vidéo illimités", "Arrière-plans de webcam", "Pause vidéo", "Envoi d'invitation aux jeux", "Historique des conversations", "Next instantanés", "Priorité dans la file", "Crédits illimités d'appels à offrir par jour", "Accès bêta aux nouveautés"]
    },
    es: { title: "Figgliz Plus o Pro", monthly: "Mensual", yearly: "Anual", launch: "Oferta de lanzamiento", choose: "Elegir esta oferta", current: "Oferta actual", payIn: "Pagar en {currency}", currency: "Divisa", loading: "Actualizando precios", perMonth: "al mes", perYear: "al año", oneTime: "una sola vez", monthlyLead: "Prueba Plus o Pro al mes para desbloquear más comodidad de vídeo, mensajes de voz ilimitados, invitaciones a juegos y fondos de webcam.", yearlyLead: "Pasa al anual para mantener las ventajas Plus o Pro todo el año a mejor precio.", launchLead: "Aprovecha la oferta de lanzamiento: un pago, Pro de por vida y créditos de llamada ilimitados para regalar.", freeTag: "Empieza con calma", plusTag: "Más control", proTag: "Experiencia completa", lifetimeTitle: "Acceso de por vida", lifetimeSubtitle: "Oferta muy limitada para los primeros 100 suscriptores", free: ["Texto ilimitado", "3 mensajes de voz al día", "1 llamada de vídeo o audio al día", "Recibir invitaciones a juegos", "15 segundos de espera para Next"], plus: ["Mensajes de voz ilimitados", "30 solicitudes de vídeo al día", "Llamadas de audio ilimitadas", "Fondos de webcam", "Filtros avanzados", "Enviar invitaciones a juegos", "2 créditos de llamada para regalar al día", "Historial de conversaciones", "3 segundos de espera para Next", "Prioridad de matching 4x"], pro: ["Mensajes de voz ilimitados", "Llamadas de audio y vídeo ilimitadas", "Fondos de webcam", "Pausa de vídeo", "Enviar invitaciones a juegos", "5 créditos de llamada para regalar al día", "Historial de conversaciones", "Next instantáneo", "Prioridad en la cola", "Acceso beta"], lifetime: ["Mensajes de voz ilimitados", "Llamadas de audio y vídeo ilimitadas", "Fondos de webcam", "Pausa de vídeo", "Enviar invitaciones a juegos", "Historial de conversaciones", "Next instantáneo", "Prioridad en la cola", "Créditos de llamada ilimitados para regalar al día", "Acceso beta"] },
    it: { title: "Figgliz Plus o Pro", monthly: "Mensile", yearly: "Annuale", launch: "Offerta lancio", choose: "Scegli questa offerta", current: "Offerta attuale", payIn: "Paga in {currency}", currency: "Valuta", loading: "Aggiornamento prezzi", perMonth: "al mese", perYear: "all'anno", oneTime: "una sola volta", monthlyLead: "Prova Plus o Pro al mese per sbloccare più comfort video, messaggi vocali illimitati, inviti ai giochi e sfondi webcam.", yearlyLead: "Passa all'annuale per tenere i vantaggi Plus o Pro tutto l'anno a prezzo migliore.", launchLead: "Approfitta dell'offerta di lancio: un solo pagamento, Pro a vita e crediti chiamata illimitati da offrire.", freeTag: "Inizia semplice", plusTag: "Più controllo", proTag: "Esperienza completa", lifetimeTitle: "Accesso a vita", lifetimeSubtitle: "Offerta molto limitata ai primi 100 abbonati", free: ["Testi illimitati", "3 messaggi vocali al giorno", "1 chiamata video o audio al giorno", "Ricezione inviti ai giochi", "15 secondi di attesa per Next"], plus: ["Messaggi vocali illimitati", "30 richieste video al giorno", "Chiamate audio illimitate", "Sfondi webcam", "Filtri avanzati", "Invio inviti ai giochi", "2 crediti chiamata da offrire al giorno", "Cronologia conversazioni", "3 secondi di attesa per Next", "Priorità matching 4x"], pro: ["Messaggi vocali illimitati", "Chiamate audio e video illimitate", "Sfondi webcam", "Pausa video", "Invio inviti ai giochi", "5 crediti chiamata da offrire al giorno", "Cronologia conversazioni", "Next istantaneo", "Priorità in coda", "Accesso beta"], lifetime: ["Messaggi vocali illimitati", "Chiamate audio e video illimitate", "Sfondi webcam", "Pausa video", "Invio inviti ai giochi", "Cronologia conversazioni", "Next istantaneo", "Priorità in coda", "Crediti chiamata illimitati da offrire al giorno", "Accesso beta"] },
    de: { title: "Figgliz Plus oder Pro", monthly: "Monatlich", yearly: "Jährlich", launch: "Launch-Angebot", choose: "Angebot wählen", current: "Aktuelles Angebot", payIn: "In {currency} zahlen", currency: "Währung", loading: "Preise werden aktualisiert", perMonth: "pro Monat", perYear: "pro Jahr", oneTime: "einmalig", monthlyLead: "Teste Plus oder Pro monatlich für mehr Videokomfort, unbegrenzte Sprachnachrichten, Spieleinladungen und Webcam-Hintergründe.", yearlyLead: "Wechsle zum Jahresplan und behalte Plus- oder Pro-Vorteile günstiger für das ganze Jahr.", launchLead: "Nutze das Launch-Angebot: eine Zahlung, Pro lebenslang und unbegrenzte verschenkbare Anrufguthaben.", freeTag: "Sicher starten", plusTag: "Mehr Kontrolle", proTag: "Volle Erfahrung", lifetimeTitle: "Lebenslanger Zugriff", lifetimeSubtitle: "Sehr limitiertes Angebot für die ersten 100 Abonnenten", free: ["Unbegrenzter Text", "3 Sprachnachrichten pro Tag", "1 Video- oder Audioanruf pro Tag", "Spieleinladungen empfangen", "15 Sekunden Wartezeit für Next"], plus: ["Unbegrenzte Sprachnachrichten", "30 Videoanfragen pro Tag", "Unbegrenzte Audioanrufe", "Webcam-Hintergründe", "Erweiterte Filter", "Spieleinladungen senden", "2 verschenkbare Anrufguthaben pro Tag", "Gesprächsverlauf", "3 Sekunden Wartezeit für Next", "4x Matching-Priorität"], pro: ["Unbegrenzte Sprachnachrichten", "Unbegrenzte Audio- und Videoanrufe", "Webcam-Hintergründe", "Video-Pause", "Spieleinladungen senden", "5 verschenkbare Anrufguthaben pro Tag", "Gesprächsverlauf", "Sofortiges Next", "Priorität in der Warteschlange", "Beta-Zugang"], lifetime: ["Unbegrenzte Sprachnachrichten", "Unbegrenzte Audio- und Videoanrufe", "Webcam-Hintergründe", "Video-Pause", "Spieleinladungen senden", "Gesprächsverlauf", "Sofortiges Next", "Priorität in der Warteschlange", "Unbegrenzte verschenkbare Anrufguthaben pro Tag", "Beta-Zugang"] }
  };
  pricingText.ro = {
    ...pricingText.en,
    title: "Figgliz Plus sau Pro", monthly: "Lunar", yearly: "Anual", launch: "Ofertă de lansare", choose: "Alege oferta", current: "Oferta actuală", payIn: "Plătește în {currency}", currency: "Monedă", loading: "Se actualizează prețurile", perMonth: "pe lună", perYear: "pe an", oneTime: "o singură dată",
    monthlyLead: "Încearcă Plus sau Pro lunar ca să deblochezi mai mult confort video, mesaje vocale nelimitate, invitații la jocuri și fundaluri de webcam.",
    yearlyLead: "Alege anualul ca să păstrezi avantajele Plus sau Pro tot anul la un preț mai bun.",
    launchLead: "Prinde oferta de lansare: o singură plată, Pro pe viață și credite de apel de oferit nelimitate.",
    freeTag: "Pornește simplu", plusTag: "Mai mult control", proTag: "Experiență completă", lifetimeTitle: "Acces pe viață", lifetimeSubtitle: "Ofertă foarte limitată pentru primii 100 de abonați",
    free: ["Texte nelimitate", "3 mesaje vocale pe zi", "1 apel video sau audio pe zi", "Primește invitații la jocuri", "15 secunde de așteptare pentru Next"],
    plus: ["Mesaje vocale nelimitate", "30 de apeluri video pe zi", "Apeluri audio nelimitate", "Fundaluri de webcam", "Filtre avansate", "Trimite invitații la jocuri", "2 credite de apel de oferit pe zi", "Istoricul conversațiilor", "3 secunde de așteptare pentru Next", "Prioritate matching 4x"],
    pro: ["Mesaje vocale nelimitate", "Apeluri audio și video nelimitate", "Fundaluri de webcam", "Pauză video", "Trimite invitații la jocuri", "5 credite de apel de oferit pe zi", "Istoricul conversațiilor", "Next instant", "Prioritate în coadă", "Acces beta"],
    lifetime: ["Mesaje vocale nelimitate", "Apeluri audio și video nelimitate", "Fundaluri de webcam", "Pauză video", "Trimite invitații la jocuri", "Istoricul conversațiilor", "Next instant", "Prioritate în coadă", "Credite de apel de oferit nelimitate pe zi", "Acces beta"]
  };
  pricingText.pt = {
    ...pricingText.en,
    title: "Figgliz Plus ou Pro", monthly: "Mensal", yearly: "Anual", launch: "Oferta de lançamento", choose: "Escolher esta oferta", current: "Oferta atual", payIn: "Pagar em {currency}", currency: "Moeda", loading: "A atualizar preços", perMonth: "por mês", perYear: "por ano", oneTime: "uma só vez",
    monthlyLead: "Experimenta Plus ou Pro mensal para desbloquear mais conforto de vídeo, mensagens vocais ilimitadas, convites para jogos e fundos de webcam.",
    yearlyLead: "Passa para anual para manter as vantagens Plus ou Pro todo o ano por um preço melhor.",
    launchLead: "Aproveita a oferta de lançamento: um pagamento, Pro vitalício e créditos de chamada ilimitados para oferecer.",
    freeTag: "Começar simples", plusTag: "Mais controlo", proTag: "Experiência completa", lifetimeTitle: "Acesso vitalício", lifetimeSubtitle: "Oferta muito limitada aos primeiros 100 subscritores",
    free: ["Textos ilimitados", "3 mensagens vocais por dia", "1 chamada de vídeo ou áudio por dia", "Receber convites para jogos", "15 segundos de espera para Next"],
    plus: ["Mensagens vocais ilimitadas", "30 chamadas de vídeo por dia", "Chamadas de áudio ilimitadas", "Fundos de webcam", "Filtros avançados", "Enviar convites para jogos", "2 créditos de chamada para oferecer por dia", "Histórico de conversas", "3 segundos de espera para Next", "Prioridade de matching 4x"],
    pro: ["Mensagens vocais ilimitadas", "Chamadas de áudio e vídeo ilimitadas", "Fundos de webcam", "Pausa de vídeo", "Enviar convites para jogos", "5 créditos de chamada para oferecer por dia", "Histórico de conversas", "Next instantâneo", "Prioridade na fila", "Acesso beta"],
    lifetime: ["Mensagens vocais ilimitadas", "Chamadas de áudio e vídeo ilimitadas", "Fundos de webcam", "Pausa de vídeo", "Enviar convites para jogos", "Histórico de conversas", "Next instantâneo", "Prioridade na fila", "Créditos de chamada ilimitados para oferecer por dia", "Acesso beta"]
  };
  pricingText.ar = {
    ...pricingText.en,
    title: "Figgliz Plus أو Pro", monthly: "شهري", yearly: "سنوي", launch: "عرض الإطلاق", choose: "اختر هذا العرض", current: "العرض الحالي", payIn: "ادفع بـ {currency}", currency: "العملة", loading: "جاري تحديث الأسعار", perMonth: "شهريًا", perYear: "سنويًا", oneTime: "مرة واحدة",
    monthlyLead: "جرّب Plus أو Pro شهريًا لفتح راحة فيديو أكبر، ورسائل صوتية غير محدودة، ودعوات ألعاب، وخلفيات كاميرا.",
    yearlyLead: "اختر الاشتراك السنوي للاحتفاظ بمزايا Plus أو Pro طوال السنة بسعر أفضل.",
    launchLead: "استفد من عرض الإطلاق: دفعة واحدة، Pro مدى الحياة، ورصيد مكالمات غير محدود يمكنك إهداؤه.",
    freeTag: "ابدأ ببساطة", plusTag: "تحكم أكبر", proTag: "تجربة كاملة", lifetimeTitle: "وصول مدى الحياة", lifetimeSubtitle: "عرض محدود جدًا لأول 100 مشترك",
    free: ["رسائل نصية غير محدودة", "3 رسائل صوتية يوميًا", "مكالمة فيديو أو صوت واحدة يوميًا", "استقبال دعوات الألعاب", "15 ثانية انتظار لـ Next"],
    plus: ["رسائل صوتية غير محدودة", "30 مكالمة فيديو يوميًا", "مكالمات صوتية غير محدودة", "خلفيات كاميرا", "فلاتر متقدمة", "إرسال دعوات الألعاب", "رصيدان للمكالمات للإهداء يوميًا", "سجل المحادثات", "3 ثوانٍ انتظار لـ Next", "أولوية مطابقة 4x"],
    pro: ["رسائل صوتية غير محدودة", "مكالمات صوت وفيديو غير محدودة", "خلفيات كاميرا", "إيقاف الفيديو مؤقتًا", "إرسال دعوات الألعاب", "5 أرصدة مكالمات للإهداء يوميًا", "سجل المحادثات", "Next فوري", "أولوية في الطابور", "وصول تجريبي"],
    lifetime: ["رسائل صوتية غير محدودة", "مكالمات صوت وفيديو غير محدودة", "خلفيات كاميرا", "إيقاف الفيديو مؤقتًا", "إرسال دعوات الألعاب", "سجل المحادثات", "Next فوري", "أولوية في الطابور", "أرصدة مكالمات غير محدودة للإهداء يوميًا", "وصول تجريبي"]
  };
  pricingText.zh = {
    ...pricingText.en,
    title: "Figgliz Plus 或 Pro", monthly: "月付", yearly: "年付", launch: "首发优惠", choose: "选择此方案", current: "当前方案", payIn: "以 {currency} 支付", currency: "货币", loading: "正在更新价格", perMonth: "每月", perYear: "每年", oneTime: "一次性",
    monthlyLead: "按月试用 Plus 或 Pro，解锁更舒适的视频体验、无限语音消息、游戏邀请和摄像头背景。",
    yearlyLead: "选择年付，以更优惠的价格全年保留 Plus 或 Pro 权益。",
    launchLead: "抓住首发优惠：一次付款，终身 Pro，并可每天赠送无限通话额度。",
    freeTag: "轻松开始", plusTag: "更多控制", proTag: "完整体验", lifetimeTitle: "终身访问", lifetimeSubtitle: "仅限前 100 位订阅者的限量优惠",
    free: ["无限文字", "每天 3 条语音消息", "每天 1 次视频或音频通话", "接收游戏邀请", "Next 等待 15 秒"],
    plus: ["无限语音消息", "每天 30 次视频通话", "无限音频通话", "摄像头背景", "高级筛选", "发送游戏邀请", "每天可赠送 2 个通话额度", "会话历史", "Next 等待 3 秒", "4x 匹配优先级"],
    pro: ["无限语音消息", "无限音频和视频通话", "摄像头背景", "视频暂停", "发送游戏邀请", "每天可赠送 5 个通话额度", "会话历史", "即时 Next", "队列优先", "Beta 访问"],
    lifetime: ["无限语音消息", "无限音频和视频通话", "摄像头背景", "视频暂停", "发送游戏邀请", "会话历史", "即时 Next", "队列优先", "每天可赠送无限通话额度", "Beta 访问"]
  };
  pricingText.ja = {
    ...pricingText.en,
    title: "Figgliz Plus または Pro", monthly: "月額", yearly: "年額", launch: "ローンチ特典", choose: "このプランを選ぶ", current: "現在のプラン", payIn: "{currency} で支払う", currency: "通貨", loading: "価格を更新中", perMonth: "月あたり", perYear: "年あたり", oneTime: "一回払い",
    monthlyLead: "Plus または Pro を月額で試して、快適なビデオ、無制限のボイスメッセージ、ゲーム招待、Webカメラ背景を解放しよう。",
    yearlyLead: "年額に切り替えると、Plus または Pro の特典をよりお得に一年中使えます。",
    launchLead: "ローンチ特典を入手：一度の支払いで Pro が生涯使え、通話クレジットも無制限に贈れます。",
    freeTag: "気軽に開始", plusTag: "もっと操作性", proTag: "完全体験", lifetimeTitle: "生涯アクセス", lifetimeSubtitle: "先着100名限定の特別オファー",
    free: ["テキスト無制限", "1日3件のボイスメッセージ", "1日1回のビデオまたは音声通話", "ゲーム招待を受信", "Next の待ち時間15秒"],
    plus: ["ボイスメッセージ無制限", "1日30回のビデオ通話", "音声通話無制限", "Webカメラ背景", "高度なフィルター", "ゲーム招待を送信", "1日2件の贈れる通話クレジット", "会話履歴", "Next の待ち時間3秒", "マッチング優先度4x"],
    pro: ["ボイスメッセージ無制限", "音声・ビデオ通話無制限", "Webカメラ背景", "ビデオ一時停止", "ゲーム招待を送信", "1日5件の贈れる通話クレジット", "会話履歴", "即時 Next", "キュー優先", "ベータアクセス"],
    lifetime: ["ボイスメッセージ無制限", "音声・ビデオ通話無制限", "Webカメラ背景", "ビデオ一時停止", "ゲーム招待を送信", "会話履歴", "即時 Next", "キュー優先", "1日無制限の贈れる通話クレジット", "ベータアクセス"]
  };
  pricingText.ru = {
    ...pricingText.en,
    title: "Figgliz Plus или Pro", monthly: "Ежемесячно", yearly: "Ежегодно", launch: "Стартовое предложение", choose: "Выбрать предложение", current: "Текущий план", payIn: "Оплата в {currency}", currency: "Валюта", loading: "Обновляем цены", perMonth: "в месяц", perYear: "в год", oneTime: "один раз",
    monthlyLead: "Попробуй Plus или Pro на месяц: больше комфорта в видео, безлимитные голосовые сообщения, приглашения в игры и фоны веб-камеры.",
    yearlyLead: "Годовой план сохраняет преимущества Plus или Pro на весь год по более выгодной цене.",
    launchLead: "Забери стартовое предложение: один платеж, Pro навсегда и безлимитные подарочные кредиты для звонков.",
    freeTag: "Легкий старт", plusTag: "Больше контроля", proTag: "Полный опыт", lifetimeTitle: "Пожизненный доступ", lifetimeSubtitle: "Очень ограниченное предложение для первых 100 подписчиков",
    free: ["Безлимитный текст", "3 голосовых сообщения в день", "1 видео- или аудиозвонок в день", "Получение приглашений в игры", "15 секунд ожидания Next"],
    plus: ["Безлимитные голосовые сообщения", "30 видеозвонков в день", "Безлимитные аудиозвонки", "Фоны веб-камеры", "Расширенные фильтры", "Отправка приглашений в игры", "2 подарочных кредита для звонков в день", "История разговоров", "3 секунды ожидания Next", "Приоритет подбора 4x"],
    pro: ["Безлимитные голосовые сообщения", "Безлимитные аудио- и видеозвонки", "Фоны веб-камеры", "Пауза видео", "Отправка приглашений в игры", "5 подарочных кредитов для звонков в день", "История разговоров", "Мгновенный Next", "Приоритет в очереди", "Бета-доступ"],
    lifetime: ["Безлимитные голосовые сообщения", "Безлимитные аудио- и видеозвонки", "Фоны веб-камеры", "Пауза видео", "Отправка приглашений в игры", "История разговоров", "Мгновенный Next", "Приоритет в очереди", "Безлимитные подарочные кредиты для звонков в день", "Бета-доступ"]
  };
  pricingText.nl = {
    ...pricingText.en,
    title: "Figgliz Plus of Pro", monthly: "Maandelijks", yearly: "Jaarlijks", launch: "Lanceringsaanbieding", choose: "Kies dit aanbod", current: "Huidig aanbod", payIn: "Betalen in {currency}", currency: "Valuta", loading: "Prijzen bijwerken", perMonth: "per maand", perYear: "per jaar", oneTime: "eenmalig",
    monthlyLead: "Probeer Plus of Pro per maand voor meer videocomfort, onbeperkte spraakberichten, game-uitnodigingen en webcamachtergronden.",
    yearlyLead: "Kies jaarlijks en behoud Plus- of Pro-voordelen het hele jaar voor een betere prijs.",
    launchLead: "Pak de lanceringsaanbieding: één betaling, Pro voor het leven en onbeperkt oproepcredits om te schenken.",
    freeTag: "Rustig starten", plusTag: "Meer controle", proTag: "Volledige ervaring", lifetimeTitle: "Levenslange toegang", lifetimeSubtitle: "Zeer beperkte aanbieding voor de eerste 100 abonnees",
    free: ["Onbeperkte tekst", "3 spraakberichten per dag", "1 video- of audiogesprek per dag", "Game-uitnodigingen ontvangen", "15 seconden wachten op Next"],
    plus: ["Onbeperkte spraakberichten", "30 videogesprekken per dag", "Onbeperkte audiogesprekken", "Webcamachtergronden", "Geavanceerde filters", "Game-uitnodigingen sturen", "2 oproepcredits om te schenken per dag", "Gespreksgeschiedenis", "3 seconden wachten op Next", "4x matchingprioriteit"],
    pro: ["Onbeperkte spraakberichten", "Onbeperkte audio- en videogesprekken", "Webcamachtergronden", "Video pauzeren", "Game-uitnodigingen sturen", "5 oproepcredits om te schenken per dag", "Gespreksgeschiedenis", "Directe Next", "Prioriteit in de wachtrij", "Bètatoegang"],
    lifetime: ["Onbeperkte spraakberichten", "Onbeperkte audio- en videogesprekken", "Webcamachtergronden", "Video pauzeren", "Game-uitnodigingen sturen", "Gespreksgeschiedenis", "Directe Next", "Prioriteit in de wachtrij", "Onbeperkt oproepcredits om te schenken per dag", "Bètatoegang"]
  };
  pricingText.pl = {
    ...pricingText.en,
    title: "Figgliz Plus albo Pro", monthly: "Miesięcznie", yearly: "Rocznie", launch: "Oferta startowa", choose: "Wybierz ofertę", current: "Aktualna oferta", payIn: "Zapłać w {currency}", currency: "Waluta", loading: "Aktualizacja cen", perMonth: "miesięcznie", perYear: "rocznie", oneTime: "jednorazowo",
    monthlyLead: "Wypróbuj Plus albo Pro miesięcznie, aby odblokować większy komfort wideo, nielimitowane wiadomości głosowe, zaproszenia do gier i tła kamery.",
    yearlyLead: "Wybierz plan roczny i korzystaj z zalet Plus albo Pro przez cały rok w lepszej cenie.",
    launchLead: "Skorzystaj z oferty startowej: jedna płatność, Pro na zawsze i nielimitowane kredyty połączeń do rozdania.",
    freeTag: "Prosty start", plusTag: "Więcej kontroli", proTag: "Pełne doświadczenie", lifetimeTitle: "Dostęp dożywotni", lifetimeSubtitle: "Bardzo limitowana oferta dla pierwszych 100 subskrybentów",
    free: ["Nielimitowany tekst", "3 wiadomości głosowe dziennie", "1 połączenie wideo lub audio dziennie", "Odbieranie zaproszeń do gier", "15 sekund oczekiwania na Next"],
    plus: ["Nielimitowane wiadomości głosowe", "30 połączeń wideo dziennie", "Nielimitowane połączenia audio", "Tła kamery", "Zaawansowane filtry", "Wysyłanie zaproszeń do gier", "2 kredyty połączeń do rozdania dziennie", "Historia rozmów", "3 sekundy oczekiwania na Next", "Priorytet dopasowania 4x"],
    pro: ["Nielimitowane wiadomości głosowe", "Nielimitowane połączenia audio i wideo", "Tła kamery", "Pauza wideo", "Wysyłanie zaproszeń do gier", "5 kredytów połączeń do rozdania dziennie", "Historia rozmów", "Natychmiastowy Next", "Priorytet w kolejce", "Dostęp beta"],
    lifetime: ["Nielimitowane wiadomości głosowe", "Nielimitowane połączenia audio i wideo", "Tła kamery", "Pauza wideo", "Wysyłanie zaproszeń do gier", "Historia rozmów", "Natychmiastowy Next", "Priorytet w kolejce", "Nielimitowane kredyty połączeń do rozdania dziennie", "Dostęp beta"]
  };
  pricingText.tr = {
    ...pricingText.en,
    title: "Figgliz Plus veya Pro", monthly: "Aylık", yearly: "Yıllık", launch: "Lansman teklifi", choose: "Bu teklifi seç", current: "Geçerli teklif", payIn: "{currency} ile öde", currency: "Para birimi", loading: "Fiyatlar güncelleniyor", perMonth: "aylık", perYear: "yıllık", oneTime: "tek sefer",
    monthlyLead: "Daha rahat video, sınırsız sesli mesaj, oyun davetleri ve webcam arka planları için Plus veya Pro'yu aylık dene.",
    yearlyLead: "Yıllığa geçerek Plus veya Pro avantajlarını tüm yıl daha iyi fiyata kullan.",
    launchLead: "Lansman teklifini yakala: tek ödeme, ömür boyu Pro ve sınırsız hediye arama kredisi.",
    freeTag: "Basit başla", plusTag: "Daha fazla kontrol", proTag: "Tam deneyim", lifetimeTitle: "Ömür boyu erişim", lifetimeSubtitle: "İlk 100 abone için çok sınırlı teklif",
    free: ["Sınırsız metin", "Günde 3 sesli mesaj", "Günde 1 video veya sesli arama", "Oyun davetleri alma", "Next için 15 saniye bekleme"],
    plus: ["Sınırsız sesli mesaj", "Günde 30 video araması", "Sınırsız sesli arama", "Webcam arka planları", "Gelişmiş filtreler", "Oyun davetleri gönderme", "Günde 2 hediye arama kredisi", "Konuşma geçmişi", "Next için 3 saniye bekleme", "4x eşleşme önceliği"],
    pro: ["Sınırsız sesli mesaj", "Sınırsız sesli ve görüntülü arama", "Webcam arka planları", "Video duraklatma", "Oyun davetleri gönderme", "Günde 5 hediye arama kredisi", "Konuşma geçmişi", "Anında Next", "Sırada öncelik", "Beta erişimi"],
    lifetime: ["Sınırsız sesli mesaj", "Sınırsız sesli ve görüntülü arama", "Webcam arka planları", "Video duraklatma", "Oyun davetleri gönderme", "Konuşma geçmişi", "Anında Next", "Sırada öncelik", "Günde sınırsız hediye arama kredisi", "Beta erişimi"]
  };
  pricingText.ko = {
    ...pricingText.en,
    title: "Figgliz Plus 또는 Pro", monthly: "월간", yearly: "연간", launch: "출시 혜택", choose: "이 플랜 선택", current: "현재 플랜", payIn: "{currency}로 결제", currency: "통화", loading: "가격 업데이트 중", perMonth: "월별", perYear: "연간", oneTime: "1회 결제",
    monthlyLead: "Plus 또는 Pro를 월간으로 사용해 더 편한 영상, 무제한 음성 메시지, 게임 초대, 웹캠 배경을 열어 보세요.",
    yearlyLead: "연간 플랜으로 Plus 또는 Pro 혜택을 더 좋은 가격에 1년 내내 유지하세요.",
    launchLead: "출시 혜택을 잡으세요: 한 번 결제, 평생 Pro, 매일 무제한으로 선물 가능한 통화 크레딧.",
    freeTag: "안전하게 시작", plusTag: "더 많은 제어", proTag: "완전한 경험", lifetimeTitle: "평생 이용", lifetimeSubtitle: "첫 100명 구독자 한정 혜택",
    free: ["무제한 텍스트", "하루 음성 메시지 3개", "하루 영상 또는 음성 통화 1회", "게임 초대 받기", "Next 대기 15초"],
    plus: ["무제한 음성 메시지", "하루 영상 통화 30회", "무제한 음성 통화", "웹캠 배경", "고급 필터", "게임 초대 보내기", "하루 선물 통화 크레딧 2개", "대화 기록", "Next 대기 3초", "매칭 우선순위 4x"],
    pro: ["무제한 음성 메시지", "무제한 음성 및 영상 통화", "웹캠 배경", "영상 일시정지", "게임 초대 보내기", "하루 선물 통화 크레딧 5개", "대화 기록", "즉시 Next", "대기열 우선", "베타 액세스"],
    lifetime: ["무제한 음성 메시지", "무제한 음성 및 영상 통화", "웹캠 배경", "영상 일시정지", "게임 초대 보내기", "대화 기록", "즉시 Next", "대기열 우선", "하루 무제한 선물 통화 크레딧", "베타 액세스"]
  };
  pricingText.hi = {
    ...pricingText.en,
    title: "Figgliz Plus या Pro", monthly: "मासिक", yearly: "वार्षिक", launch: "लॉन्च ऑफर", choose: "यह ऑफर चुनें", current: "मौजूदा ऑफर", payIn: "{currency} में भुगतान", currency: "मुद्रा", loading: "कीमतें अपडेट हो रही हैं", perMonth: "प्रति माह", perYear: "प्रति वर्ष", oneTime: "एक बार",
    monthlyLead: "बेहतर वीडियो सुविधा, असीमित वॉइस मैसेज, गेम निमंत्रण और वेबकैम बैकग्राउंड के लिए Plus या Pro मासिक आज़माएँ।",
    yearlyLead: "वार्षिक प्लान चुनकर Plus या Pro के फायदे पूरे साल बेहतर कीमत पर रखें।",
    launchLead: "लॉन्च ऑफर लें: एक भुगतान, जीवनभर Pro और प्रतिदिन असीमित गिफ्ट कॉल क्रेडिट।",
    freeTag: "आसान शुरुआत", plusTag: "अधिक नियंत्रण", proTag: "पूरा अनुभव", lifetimeTitle: "जीवनभर एक्सेस", lifetimeSubtitle: "पहले 100 सब्सक्राइबर के लिए बहुत सीमित ऑफर",
    free: ["असीमित टेक्स्ट", "प्रतिदिन 3 वॉइस मैसेज", "प्रतिदिन 1 वीडियो या ऑडियो कॉल", "गेम निमंत्रण प्राप्त करें", "Next के लिए 15 सेकंड प्रतीक्षा"],
    plus: ["असीमित वॉइस मैसेज", "प्रतिदिन 30 वीडियो कॉल", "असीमित ऑडियो कॉल", "वेबकैम बैकग्राउंड", "उन्नत फ़िल्टर", "गेम निमंत्रण भेजें", "प्रतिदिन 2 गिफ्ट कॉल क्रेडिट", "बातचीत इतिहास", "Next के लिए 3 सेकंड प्रतीक्षा", "4x मैचिंग प्राथमिकता"],
    pro: ["असीमित वॉइस मैसेज", "असीमित ऑडियो और वीडियो कॉल", "वेबकैम बैकग्राउंड", "वीडियो पॉज़", "गेम निमंत्रण भेजें", "प्रतिदिन 5 गिफ्ट कॉल क्रेडिट", "बातचीत इतिहास", "तुरंत Next", "कतार प्राथमिकता", "बीटा एक्सेस"],
    lifetime: ["असीमित वॉइस मैसेज", "असीमित ऑडियो और वीडियो कॉल", "वेबकैम बैकग्राउंड", "वीडियो पॉज़", "गेम निमंत्रण भेजें", "बातचीत इतिहास", "तुरंत Next", "कतार प्राथमिकता", "प्रतिदिन असीमित गिफ्ट कॉल क्रेडिट", "बीटा एक्सेस"]
  };

  function getLangFromPath() {
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    return supportedLangs.includes(first) ? first : "en";
  }

  function getProductPage() {
    const path = window.location.pathname;
    if (path.includes("/faq")) return "faq";
    if (path.includes("/stats")) return "stats";
    if (path.includes("/privacy")) return "privacy";
    if (path.includes("/terms")) return "terms";
    return "presentation";
  }

  function closeLanguageMenus() {
    document.querySelectorAll(".language-menu.is-open").forEach((menu) => {
      menu.classList.remove("is-open");
      menu.querySelector(".language-menu-button")?.setAttribute("aria-expanded", "false");
    });
  }

  function setupLanguageMenu() {
    const menu = document.querySelector(".arcawand-product-language-menu");
    if (!menu || menu.dataset.languageMenuReady === "true") return;
    menu.dataset.languageMenuReady = "true";
    const button = menu.querySelector(".language-menu-button");
    const panel = menu.querySelector(".language-menu-panel");
    const lang = getLangFromPath();
    const languageLabel = languageButtonLabels[lang] || languageButtonLabels.en;
    button?.setAttribute("aria-label", languageLabel);
    panel?.setAttribute("aria-label", languageLabel);

    button?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = !menu.classList.contains("is-open");
      closeLanguageMenus();
      menu.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
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
      window.location.href = option.dataset.targetUrl || routes[next]?.[page] || routes.en.presentation;
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".arcawand-product-language-menu")) closeLanguageMenus();
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLanguageMenus();
    });
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

  function setupPricingTabs() {
    document.querySelectorAll(".figgliz-plan-box").forEach((box) => {
      if (box.dataset.pricingReady === "true") return;
      box.dataset.pricingReady = "true";
      const lang = getLangFromPath();
      const copy = pricingText[lang] || pricingText.en;
      const state = {
        lang,
        currency: getStoredCurrency() || detectDefaultCurrency(),
        prices: null,
        loading: true,
        requestId: 0
      };
      renderPricingBox(box, state);
      const setPlan = (plan) => {
        const beforeX = window.scrollX;
        const beforeY = window.scrollY;
        box.dataset.plan = plan;
        box.querySelectorAll("[data-plan-tab]").forEach((tab) => {
          tab.setAttribute("aria-selected", String(tab.dataset.planTab === plan));
        });
        window.requestAnimationFrame(() => window.scrollTo(beforeX, beforeY));
      };
      box.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-plan-tab]");
        if (tab) {
          event.preventDefault();
          event.stopPropagation();
          setPlan(tab.dataset.planTab || "monthly");
          return;
        }
        const currencyOption = event.target.closest("[data-currency-option]");
        if (currencyOption) {
          event.preventDefault();
          event.stopPropagation();
          const nextCurrency = normalizeCurrency(currencyOption.dataset.currencyOption);
          if (nextCurrency === state.currency) {
            closeCurrencyMenu(box);
            return;
          }
          state.currency = nextCurrency;
          state.prices = null;
          state.loading = true;
          saveStoredCurrency(nextCurrency);
          renderPricingBox(box, state);
          setPlan(box.dataset.plan || "monthly");
          refreshPricing(box, state);
          return;
        }
        const currencyToggle = event.target.closest("[data-currency-toggle]");
        if (currencyToggle) {
          event.preventDefault();
          event.stopPropagation();
          const menu = box.querySelector("[data-currency-menu]");
          const open = menu?.hidden;
          closeCurrencyMenus();
          if (menu) menu.hidden = !open;
          currencyToggle.setAttribute("aria-expanded", String(Boolean(open)));
          return;
        }
        const checkout = event.target.closest("[data-checkout-plan]");
        if (checkout) {
          event.preventDefault();
          event.stopPropagation();
          openCheckout(checkout.dataset.checkoutPlan, checkout.dataset.checkoutInterval, state.currency);
        }
      });
      document.addEventListener("click", closeCurrencyMenus, { capture: true });
      setPlan(box.dataset.plan || "monthly");
      refreshPricing(box, state);
    });
  }

  function renderPricingBox(box, state) {
    const copy = pricingText[state.lang] || pricingText.en;
    const activePlan = box.dataset.plan || "monthly";
    const currencyOptions = getOrderedCurrencies(state.currency)
      .map((currency) => `<button class="figgliz-currency-option" type="button" role="option" data-currency-option="${currency}" aria-selected="${currency === state.currency}"><img src="/assets/flags/currency/${currency.toLowerCase()}.png" alt="" width="20" height="14" loading="lazy" decoding="async"><span>${escapeHtml(currency)}</span></button>`)
      .join("");
    box.innerHTML = `
      <div class="figgliz-plan-head">
        <h2>${escapeHtml(copy.title)}</h2>
        <p class="figgliz-plan-lead figgliz-plan-lead-monthly">${escapeHtml(copy.monthlyLead)}</p>
        <p class="figgliz-plan-lead figgliz-plan-lead-yearly">${escapeHtml(copy.yearlyLead)}</p>
        <p class="figgliz-plan-lead figgliz-plan-lead-launch">${escapeHtml(copy.launchLead)}</p>
      </div>
      <div class="figgliz-plan-toolbar">
        <div class="figgliz-plan-tabs" role="tablist" aria-label="${escapeHtml(copy.title)}">
          <button type="button" role="tab" aria-selected="${activePlan === "monthly"}" data-plan-tab="monthly">${escapeHtml(copy.monthly)}</button>
          <button type="button" role="tab" aria-selected="${activePlan === "yearly"}" data-plan-tab="yearly">${escapeHtml(copy.yearly)}</button>
          <button type="button" role="tab" aria-selected="${activePlan === "launch"}" data-plan-tab="launch">${escapeHtml(copy.launch)}</button>
        </div>
        <div class="figgliz-currency-control">
          <button class="figgliz-currency-toggle" type="button" data-currency-toggle aria-haspopup="listbox" aria-expanded="false" aria-label="${escapeHtml(copy.currency)}">
            <img src="/assets/flags/currency/${state.currency.toLowerCase()}.png" alt="" width="20" height="14" decoding="async">
            <span>${escapeHtml(copy.payIn.replace("{currency}", state.currency))}</span>
            <span aria-hidden="true">⌄</span>
          </button>
          <div class="figgliz-currency-menu" data-currency-menu role="listbox" aria-label="${escapeHtml(copy.currency)}" hidden>${currencyOptions}</div>
        </div>
      </div>
      <div class="figgliz-plan-content figgliz-plan-content-monthly">${priceCard("free", "monthly", state)}${priceCard("plus", "monthly", state)}${priceCard("pro", "monthly", state)}</div>
      <div class="figgliz-plan-content figgliz-plan-content-yearly">${priceCard("free", "yearly", state)}${priceCard("plus", "yearly", state)}${priceCard("pro", "yearly", state)}</div>
      <div class="figgliz-plan-content figgliz-plan-content-launch">${priceCard("pro", "launch", state)}</div>
    `;
  }

  function priceCard(plan, interval, state) {
    const copy = pricingText[state.lang] || pricingText.en;
    const isFree = plan === "free";
    const isLifetime = interval === "launch";
    const cardClass = isLifetime ? "figgliz-lifetime-card" : `figgliz-price-card figgliz-price-card-${plan}${plan !== "free" ? " is-featured" : ""}`;
    const title = isFree ? "Free" : isLifetime ? copy.lifetimeTitle : `Figgliz ${plan === "plus" ? "Plus" : "Pro"}`;
    const subtitle = isFree ? copy.freeTag : isLifetime ? copy.lifetimeSubtitle : plan === "plus" ? copy.plusTag : copy.proTag;
    const benefits = isFree ? copy.free : isLifetime ? copy.lifetime : copy[plan];
    const badge = plan === "plus" || plan === "pro"
      ? `<img class="figgliz-plan-badge" src="/assets/figgliz/Badge_${plan === "plus" ? "Plus" : "Pro"}.png" alt="${plan === "plus" ? "Plus" : "Pro"}" width="88" height="88" loading="lazy" decoding="async">`
      : "";
    const price = getDisplayPrice(plan, interval, state);
    const priceHtml = state.loading && !isFree && !price
      ? `<span class="figgliz-price-loader" role="status" aria-label="${escapeHtml(copy.loading)}"></span>`
      : formatPriceHtml(price, getPriceSuffix(copy, interval, isFree));
    const cta = isFree
      ? `<span class="figgliz-current-offer">${escapeHtml(copy.current)}</span>`
      : `<button class="figgliz-price-button" type="button" data-checkout-plan="${plan}" data-checkout-interval="${interval}">${escapeHtml(copy.choose)}</button>`;
    return `<article class="${cardClass}" data-pricing-card="${plan}" data-pricing-interval="${interval}">
      <header class="figgliz-plan-card-head"><div>${badge}<h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div><p class="figgliz-price" data-price>${priceHtml}</p></header>
      <ul class="figgliz-plan-benefits">${benefits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>${cta}
    </article>`;
  }

  function getDisplayPrice(plan, interval, state) {
    if (plan === "free") return state.prices?.free?.monthly?.formatted || formatZeroPrice(state.currency, state.lang);
    const normalizedInterval = interval === "launch" ? "lifetime" : interval;
    return state.prices?.[plan]?.[normalizedInterval]?.formatted || "";
  }

  function getPriceSuffix(copy, interval, isFree) {
    if (isFree) return "";
    if (interval === "monthly") return copy.perMonth;
    if (interval === "yearly") return copy.perYear;
    return copy.oneTime;
  }

  function formatPriceHtml(price, suffix) {
    const text = String(price || "").trim();
    const matchPrefix = text.match(/^([A-Z]{3})\s+(.+)$/);
    const matchSuffix = text.match(/^(.+?)\s+([A-Z]{3})$/);
    const amount = matchPrefix ? matchPrefix[2] : matchSuffix ? matchSuffix[1] : text;
    const currency = matchPrefix ? matchPrefix[1] : matchSuffix ? matchSuffix[2] : "";
    return `<span class="figgliz-price-line"><span class="figgliz-price-amount">${escapeHtml(amount)}</span>${currency ? `<span class="figgliz-price-currency">${escapeHtml(currency)}</span>` : ""}</span>${suffix ? `<small>${escapeHtml(suffix)}</small>` : ""}`;
  }

  async function refreshPricing(box, state) {
    const requestId = state.requestId + 1;
    state.requestId = requestId;
    const locale = getBrowserLocale(state.lang);
    const cached = loadCachedPrices(state.currency, locale);
    if (cached?.prices) {
      state.prices = cached.prices;
      state.loading = false;
      renderPricingBox(box, state);
      if (cached.fresh) return;
    }
    state.loading = true;
    renderPricingBox(box, state);
    try {
      const response = await fetch(pricingEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: state.currency, locale })
      });
      const data = await response.json();
      if (!response.ok || !data?.prices || requestId !== state.requestId) return;
      state.prices = data.prices;
      state.currency = normalizeCurrency(data.currency || state.currency);
      state.loading = false;
      saveCachedPrices(state.currency, locale, data);
    } catch (error) {
      state.loading = false;
    }
    renderPricingBox(box, state);
  }

  function loadCachedPrices(currency, locale) {
    try {
      const cache = JSON.parse(localStorage.getItem(pricingCacheKey) || "{}");
      const entry = cache[priceCacheEntryKey(currency, locale)];
      if (!entry?.prices || !entry.savedAt) return null;
      const age = Date.now() - Number(entry.savedAt);
      if (!Number.isFinite(age) || age > stalePriceTtlMs) return null;
      return { prices: entry.prices, fresh: age <= freshPriceTtlMs };
    } catch (error) {
      return null;
    }
  }

  function saveCachedPrices(currency, locale, data) {
    try {
      const cache = JSON.parse(localStorage.getItem(pricingCacheKey) || "{}");
      cache[priceCacheEntryKey(currency, locale)] = { currency, locale, prices: data.prices, savedAt: Date.now(), updatedAt: data.updatedAt || "" };
      const entries = Object.entries(cache).sort((a, b) => Number(b[1].savedAt || 0) - Number(a[1].savedAt || 0)).slice(0, 120);
      localStorage.setItem(pricingCacheKey, JSON.stringify(Object.fromEntries(entries)));
    } catch (error) {}
  }

  function priceCacheEntryKey(currency, locale) {
    return `${normalizeCurrency(currency)}:${String(locale || "en").replace(/[^A-Za-z0-9-]/g, "").slice(0, 16)}`;
  }

  function getOrderedCurrencies(preferredCurrency) {
    const preferred = normalizeCurrency(preferredCurrency);
    const seen = new Set([preferred]);
    const ordered = [preferred];
    for (const code of priorityCurrencies) {
      if (!supportedCurrencies.includes(code) || seen.has(code)) continue;
      seen.add(code);
      ordered.push(code);
    }
    for (const code of [...supportedCurrencies].sort()) {
      if (seen.has(code)) continue;
      seen.add(code);
      ordered.push(code);
    }
    return ordered;
  }

  function detectDefaultCurrency() {
    const locales = [...(Array.isArray(navigator.languages) ? navigator.languages : []), navigator.language, Intl.DateTimeFormat().resolvedOptions().locale].filter(Boolean);
    for (const locale of locales) {
      const region = String(locale).split("-").pop()?.toUpperCase();
      if (region && currencyByRegion[region]) return normalizeCurrency(currencyByRegion[region]);
    }
    return "EUR";
  }

  function getBrowserLocale(lang) {
    return String((Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || lang || "en").replace(/_/g, "-").slice(0, 32);
  }

  function normalizeCurrency(value) {
    const code = String(value || "EUR").trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    return supportedCurrencies.includes(code) ? code : "EUR";
  }

  function getStoredCurrency() {
    try {
      return normalizeCurrency(localStorage.getItem(currencyStorageKey));
    } catch (error) {
      return "";
    }
  }

  function saveStoredCurrency(currency) {
    try {
      localStorage.setItem(currencyStorageKey, normalizeCurrency(currency));
    } catch (error) {}
  }

  function formatZeroPrice(currency, lang) {
    try {
      return new Intl.NumberFormat(getBrowserLocale(lang), { style: "currency", currency, currencyDisplay: ["EUR", "USD", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY"].includes(currency) ? "narrowSymbol" : "code", maximumFractionDigits: ["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "VND", "VUV", "XAF", "XOF", "XPF"].includes(currency) ? 0 : 2, minimumFractionDigits: ["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "VND", "VUV", "XAF", "XOF", "XPF"].includes(currency) ? 0 : 2 }).format(0);
    } catch (error) {
      return currency === "EUR" ? "0€" : `0 ${currency}`;
    }
  }

  function closeCurrencyMenus() {
    document.querySelectorAll("[data-currency-menu]").forEach((menu) => {
      menu.hidden = true;
      menu.closest(".figgliz-currency-control")?.querySelector("[data-currency-toggle]")?.setAttribute("aria-expanded", "false");
    });
  }

  function closeCurrencyMenu(root) {
    const menu = root.querySelector("[data-currency-menu]");
    if (menu) menu.hidden = true;
    root.querySelector("[data-currency-toggle]")?.setAttribute("aria-expanded", "false");
  }

  function openCheckout(plan, interval, currency) {
    const normalizedInterval = interval === "launch" ? "lifetime" : interval;
    const fallback = checkoutLinks[plan]?.[interval] || checkoutLinks[plan]?.[normalizedInterval];
    const popup = window.open("about:blank", "_blank");
    try {
      if (popup) popup.opener = null;
    } catch (error) {}
    fetch(checkoutEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, interval: normalizedInterval, currency: normalizeCurrency(currency) })
    }).then((response) => response.json()).then((data) => {
      const url = data?.checkoutUrl || fallback;
      if (popup && url) popup.location.href = url;
      else if (url) window.open(url, "_blank", "noopener,noreferrer");
    }).catch(() => {
      if (popup && fallback) popup.location.href = fallback;
      else if (fallback) window.open(fallback, "_blank", "noopener,noreferrer");
    });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  }

  function setupStatsPage() {
    const root = document.querySelector("[data-figgliz-stats]");
    if (!root || root.dataset.statsReady === "true") return;
    root.dataset.statsReady = "true";
    const lang = getLangFromPath();
    const endpoint = root.dataset.statsEndpoint || "https://figgliz.arcawand-soft.com/stats.json";
    const updated = root.querySelector("[data-figgliz-stat-updated]");
    const format = new Intl.NumberFormat(lang);
    const formatDate = new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short" });
    const setValue = (key, value) => {
      const node = root.querySelector('[data-figgliz-stat="' + key + '"]');
      if (!node) return;
      const next = Number.isFinite(Number(value)) ? format.format(Math.max(0, Number(value))) : "--";
      if (node.textContent === next) return;
      node.textContent = next;
      node.animate?.([
        { transform: "translateY(5px)", opacity: 0.52 },
        { transform: "translateY(0)", opacity: 1 }
      ], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" });
    };
    const render = (payload = {}) => {
      const totals = payload.totals || {};
      const games = payload.games || {};
      const flappyRecord = payload.records?.flappyDuo || payload.flappyDuoRecord || {};
      setValue("discussions", totals.discussions);
      setValue("videoSessions", totals.videoSessions);
      setValue("gamesPlayed", totals.games);
      setValue("chess", games.chess);
      setValue("checkers", games.checkers);
      setValue("connect4", games.connect4);
      setValue("pingpong", games.pingpong);
      setValue("doublesnake", games.doublesnake);
      setValue("airhockey", games.airhockey);
      setRecord(flappyRecord);
      const stamp = payload.updatedAt || payload.startedAt;
      if (updated && stamp) updated.textContent = formatDate.format(new Date(stamp));
    };
    const setText = (selector, value) => {
      const node = root.querySelector(selector);
      if (!node) return;
      const next = String(value || "--");
      if (node.textContent === next) return;
      node.textContent = next;
      node.animate?.([
        { transform: "translateY(5px)", opacity: 0.52 },
        { transform: "translateY(0)", opacity: 1 }
      ], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" });
    };
    const setRecord = (record = {}) => {
      const distance = Math.max(0, Math.floor(Number(record.distance || 0)));
      setText("[data-figgliz-record-distance]", distance ? format.format(distance) + " m" : "--");
      setText("[data-figgliz-record-nickname]", normalizeRecordNickname(record.nickname));
    };
    const refresh = async () => {
      try {
        const response = await fetch(endpoint, { cache: "no-store" });
        if (!response.ok) throw new Error("stats unavailable");
        render(await response.json());
      } catch (error) {
        root.dataset.statsError = "true";
      }
    };
    refresh();
    if (!connectStatsEvents(endpoint, render)) window.setInterval(refresh, 30000);
  }

  function connectStatsEvents(endpoint, render) {
    if (!("EventSource" in window)) return false;
    try {
      const eventsUrl = new URL(endpoint, window.location.href);
      eventsUrl.pathname = eventsUrl.pathname.replace(/\/stats\.json$/, "/stats/events");
      const events = new EventSource(eventsUrl.href);
      events.addEventListener("stats", (event) => {
        try {
          render(JSON.parse(event.data));
        } catch (error) {}
      });
      events.addEventListener("error", () => {
        events.close();
        window.setInterval(async () => {
          try {
            const response = await fetch(endpoint, { cache: "no-store" });
            if (response.ok) render(await response.json());
          } catch (error) {}
        }, 30000);
      }, { once: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  function normalizeRecordNickname(value) {
    const clean = String(value || "").replace(/\s+/g, " ").trim().slice(0, 15);
    return clean || "--";
  }

  function init() {
    const lang = getLangFromPath();
    document.documentElement.lang = lang;
    setupLanguageMenu();
    setupProductNav();
    setupProductHeaderScroll();
    setupPricingTabs();
    setupStatsPage();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
