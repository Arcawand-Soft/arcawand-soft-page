const fs = require("fs");
const path = require("path");
const { LANGUAGES, languageByCode, languageMenu, localizedPath, localizedUrl } = require("./language-config");

const root = path.resolve(__dirname, "..");
const base = "https://arcawand-soft.com/";
const existingLanguages = new Set(["en", "fr", "es", "it", "de"]);
const generatedLanguages = LANGUAGES.filter((language) => !existingLanguages.has(language.code)).map((language) => language.code);

const productImages = {
  site: "https://arcawand-soft.com/assets/preview_social_networks.png",
  ucp: "https://arcawand-soft.com/assets/Ultimate_Clipboard_Pro_SEO_Image.png",
  figgliz: "https://arcawand-soft.com/assets/Figgliz_SEO_Image.png"
};

const packs = {
  en: {
    languageLabel: "Change language",
    navHome: "Home",
    navApps: "Our apps",
    contact: "Contact",
    privacy: "Privacy",
    presentation: "Presentation",
    demo: "Demo",
    faq: "FAQ",
    stats: "Statistics",
    terms: "Terms of use",
    siteTitle: "ArcaWand Soft - Original secure apps for productivity and fun",
    siteDesc: "ArcaWand Soft builds original, secure browser apps including Ultimate Clipboard Pro and Figgliz for demanding users who want productivity, privacy and better breaks.",
    heroTitle: "Original, secure and powerful apps.",
    heroLead: "ArcaWand Soft creates premium browser extensions for focused work, private breaks and everyday control.",
    philosophyTitle: "Tools for serious work and lighter moments",
    philosophyLead: "One brand, two useful directions: productivity workflows that stay clear, and private social experiences that stay simple.",
    ucpDesc: "An advanced clipboard for demanding users",
    figglizDesc: "Private random chats for real conversations",
    ctaProduct: "Open product page",
    ctaInstall: "Install Extension",
    ctaLaunch: "Launch offer",
    contactTitle: "Contact ArcaWand Soft",
    contactLead: "Have a technical question, a product idea, a partnership request or feedback? Send a clear message to the developer.",
    contactBody: "For product support, include the product name, browser, operating system and a short description. We read useful feedback carefully.",
    sitePrivacyTitle: "ArcaWand Soft website privacy policy",
    sitePrivacyLead: "How this static website handles technical data, contact messages, launch notifications, analytics, external services and user rights.",
    ucpTitle: "Ultimate Clipboard Pro",
    ucpHero: "Everything you copy, organized and ready when you need it",
    ucpLead: "Capture text, code, images, screenshots and web pages in a local-first Chrome workspace built for speed, search and reuse.",
    ucpBullets: ["Capture while browsing without losing context.", "Organize text, code and images in dedicated workspaces.", "Search titles, notes, source URLs and versions.", "Use Pro workflows, ZIP backup and optional Google Drive sync."],
    ucpFaq: [["What is Ultimate Clipboard Pro?", "A Chrome extension that turns copied text, code and images into an organized workspace."], ["Is my content local?", "Normal capture management is local-first. Optional Drive sync is controlled by the user."], ["What does Pro unlock?", "Unlimited captures, vault, trash, versioning, montage, more tools and optional Drive sync."], ["Who is it for?", "AI users, developers, researchers, creators and anyone who copies valuable information every day."]],
    ucpPrivacy: [["Local-first design", "Captures and settings are stored locally by default in the browser extension environment."], ["Optional services", "Google Drive sync, licensing and payment services are contacted only for the features they provide."], ["User control", "Users can export, restore, delete captures, disconnect Drive and remove the extension from Chrome."]],
    ucpTerms: [["Product use", "Ultimate Clipboard Pro is a productivity extension for capturing, organizing and reusing content while browsing."], ["Pro license", "The standard lifetime Pro price is USD 69, with a launch price of USD 49 while available."], ["Responsibility", "Users are responsible for the legality and safety of the content they capture, export or synchronize."]],
    figglizTitle: "Figgliz",
    figglizHero: "Turn five minutes of break into an unexpected encounter",
    figglizLead: "A Chrome extension for private random conversations: text, short voice notes, optional webcam and quick games, without public profiles.",
    figglizBullets: ["Random one-to-one conversations.", "Text, voice notes and optional webcam.", "Chess, Checkers, Connect 4, Ping Pong, Flappy Duo and Air Hockey.", "Availability, Next, block and report controls."],
    figglizFaq: [["What is Figgliz?", "A Chrome extension for private one-to-one conversations with randomly matched people."], ["Do I need a public profile?", "No. Figgliz avoids public profiles, feeds, follower counts and profile theatre."], ["Is webcam required?", "No. Webcam starts only after explicit invitation and acceptance."], ["Are stats public?", "Only anonymous aggregate counters are public. Conversations are not published."]],
    figglizPrivacy: [["Private by design", "Figgliz is designed for private random conversations without public profiles."], ["Webcam consent", "Webcam and microphone features are optional and require explicit acceptance."], ["Public statistics", "The statistics page displays anonymous aggregate counters, not private messages or identities."]],
    figglizTerms: [["Beta product", "Figgliz is currently in beta testing with volunteer users before its public release."], ["Acceptable use", "Harassment, threats, exploitation, spam, fraud and attempts to bypass safety systems are prohibited."], ["Paid plans", "Plus and Pro may unlock higher quotas, filters, webcam features, games and faster matching controls."]]
  },
  ro: {
    languageLabel: "Schimbă limba",
    navHome: "Acasă", navApps: "Aplicațiile noastre", contact: "Contact", privacy: "Confidențialitate", presentation: "Prezentare", demo: "Demo", faq: "FAQ", stats: "Statistici", terms: "Termeni de utilizare",
    siteTitle: "ArcaWand Soft - aplicații originale, sigure și puternice",
    siteDesc: "ArcaWand Soft creează extensii Chrome premium precum Ultimate Clipboard Pro și Figgliz pentru productivitate, confidențialitate și pauze mai bune.",
    heroTitle: "Aplicații originale, sigure și puternice.", heroLead: "Extensii premium pentru lucru concentrat, pauze private și control zilnic.", philosophyTitle: "Instrumente pentru muncă serioasă și pauze mai bune", philosophyLead: "Productivitate clară și experiențe sociale private, simple și voluntare.",
    ucpDesc: "Un manager de clipboard avansat pentru utilizatori exigenți", figglizDesc: "Conversații aleatorii private pentru dialoguri reale", ctaProduct: "Deschide pagina produsului", ctaInstall: "Instalează extensia", ctaLaunch: "Ofertă de lansare",
    contactTitle: "Contactează ArcaWand Soft", contactLead: "Ai o întrebare tehnică, o idee de produs sau feedback? Trimite un mesaj clar dezvoltatorului.", contactBody: "Pentru suport, include produsul, browserul, sistemul de operare și o descriere scurtă.",
    sitePrivacyTitle: "Politica de confidențialitate a site-ului ArcaWand Soft", sitePrivacyLead: "Cum gestionează acest site static datele tehnice, mesajele de contact, notificările, analiticele și serviciile externe.",
    ucpTitle: "Ultimate Clipboard Pro", ucpHero: "Tot ce copiezi, organizat și gata de reutilizare", ucpLead: "Capturează texte, cod, imagini și pagini web într-un spațiu Chrome local-first.", ucpBullets: ["Capturezi fără să pierzi contextul.", "Organizezi texte, cod și imagini separat.", "Cauți în titluri, note, URL-uri sursă și versiuni.", "Folosești Pro, backup ZIP și sincronizare Drive opțională."],
    ucpFaq: [["Ce este Ultimate Clipboard Pro?", "O extensie Chrome care transformă conținutul copiat într-un spațiu organizat."], ["Datele rămân locale?", "Gestionarea normală este local-first; Drive este opțional."], ["Ce deblochează Pro?", "Capturi nelimitate, seif, coș, versiuni, montage, instrumente și Drive opțional."], ["Pentru cine este?", "Utilizatori AI, dezvoltatori, cercetători, creatori și power users."]],
    ucpPrivacy: [["Design local-first", "Capturile și setările sunt stocate local implicit."], ["Servicii opționale", "Drive, licența și plățile sunt folosite doar pentru funcțiile activate."], ["Control utilizator", "Poți exporta, restaura, șterge, deconecta Drive și dezinstala extensia."]],
    ucpTerms: [["Utilizare", "Extensia ajută la capturarea, organizarea și reutilizarea conținutului."], ["Licență Pro", "Preț standard lifetime USD 69, preț de lansare USD 49 cât timp este disponibil."], ["Responsabilitate", "Utilizatorul răspunde pentru conținutul capturat, exportat sau sincronizat."]],
    figglizTitle: "Figgliz", figglizHero: "Transformă cinci minute de pauză într-o întâlnire neașteptată", figglizLead: "Conversații aleatorii private cu text, vocale, webcam opțională și jocuri rapide.", figglizBullets: ["Conversații unu-la-unu aleatorii.", "Text, vocale și webcam opțională.", "Șah, dame, Connect 4, Ping Pong, Flappy Duo și Air Hockey.", "Disponibilitate, Next, blocare și raportare."],
    figglizFaq: [["Ce este Figgliz?", "O extensie Chrome pentru conversații private unu-la-unu."], ["Am nevoie de profil public?", "Nu. Nu există profil public sau feed."], ["Webcam este obligatorie?", "Nu, este opțională și cere accept explicit."], ["Statisticile sunt publice?", "Doar contoare anonime agregate."]],
    figglizPrivacy: [["Confidențialitate", "Figgliz evită profilurile publice."], ["Consimțământ webcam", "Webcam și microfon sunt opționale."], ["Statistici", "Statisticile publice sunt anonime și agregate."]],
    figglizTerms: [["Beta", "Figgliz este în testare beta."], ["Utilizare acceptabilă", "Abuzul, hărțuirea, frauda și spamul sunt interzise."], ["Planuri plătite", "Plus și Pro pot debloca cote, filtre, webcam și jocuri."]]
  },
  pt: {
    languageLabel: "Alterar idioma", navHome: "Início", navApps: "Nossas apps", contact: "Contato", privacy: "Privacidade", presentation: "Apresentação", demo: "Demo", faq: "FAQ", stats: "Estatísticas", terms: "Termos de uso",
    siteTitle: "ArcaWand Soft - apps originais, seguras e poderosas", siteDesc: "ArcaWand Soft cria extensões Chrome premium como Ultimate Clipboard Pro e Figgliz para produtividade, privacidade e pausas melhores.", heroTitle: "Apps originais, seguras e poderosas.", heroLead: "Extensões premium para trabalho focado, pausas privadas e controle diário.", philosophyTitle: "Ferramentas para trabalho sério e pausas leves", philosophyLead: "Produtividade clara e experiências sociais privadas, simples e voluntárias.", ucpDesc: "Um gestor de clipboard avançado para usuários exigentes", figglizDesc: "Chats aleatórios privados para conversas reais", ctaProduct: "Abrir página do produto", ctaInstall: "Instalar extensão", ctaLaunch: "Oferta de lançamento",
    contactTitle: "Contacte a ArcaWand Soft", contactLead: "Tem uma pergunta técnica, ideia de produto ou feedback? Envie uma mensagem clara.", contactBody: "Para suporte, inclua produto, navegador, sistema operacional e uma descrição curta.", sitePrivacyTitle: "Política de privacidade do site ArcaWand Soft", sitePrivacyLead: "Como este site estático trata dados técnicos, mensagens de contato, notificações, analytics e serviços externos.",
    ucpTitle: "Ultimate Clipboard Pro", ucpHero: "Tudo o que copia, organizado e pronto para reutilizar", ucpLead: "Capture texto, código, imagens e páginas web em um espaço Chrome local-first.", ucpBullets: ["Capture sem perder contexto.", "Organize texto, código e imagens.", "Pesquise títulos, notas, URLs e versões.", "Use Pro, backup ZIP e Drive opcional."],
    ucpFaq: [["O que é Ultimate Clipboard Pro?", "Uma extensão Chrome que organiza o que você copia."], ["O conteúdo fica local?", "Sim por padrão; Drive é opcional."], ["O que o Pro libera?", "Capturas ilimitadas, cofre, lixeira, versões, ferramentas e Drive."], ["Para quem é?", "Usuários de IA, devs, pesquisadores e criadores."]],
    ucpPrivacy: [["Local-first", "Capturas e configurações ficam locais por padrão."], ["Serviços opcionais", "Drive, licença e pagamentos só quando ativados."], ["Controle", "Você pode exportar, restaurar, apagar e desconectar Drive."]],
    ucpTerms: [["Uso", "Extensão de produtividade para capturar e reutilizar conteúdo."], ["Pro", "Preço lifetime padrão USD 69, lançamento USD 49 enquanto disponível."], ["Responsabilidade", "Você responde pelo conteúdo capturado ou sincronizado."]],
    figglizTitle: "Figgliz", figglizHero: "Transforme cinco minutos de pausa num encontro inesperado", figglizLead: "Conversas aleatórias privadas com texto, voz, webcam opcional e jogos rápidos.", figglizBullets: ["Conversas aleatórias um a um.", "Texto, voz e webcam opcional.", "Xadrez, damas, Connect 4, Ping Pong, Flappy Duo e Air Hockey.", "Disponibilidade, Next, bloqueio e denúncia."],
    figglizFaq: [["O que é Figgliz?", "Uma extensão Chrome para conversas privadas aleatórias."], ["Preciso de perfil público?", "Não."], ["Webcam é obrigatória?", "Não, só com convite aceito."], ["As estatísticas mostram mensagens?", "Não, apenas dados agregados."]],
    figglizPrivacy: [["Privado por design", "Sem perfis públicos."], ["Consentimento", "Webcam e microfone são opcionais."], ["Estatísticas", "Apenas contadores anônimos."]],
    figglizTerms: [["Beta", "Figgliz está em beta."], ["Uso aceitável", "Abuso, fraude, spam e assédio são proibidos."], ["Planos", "Plus e Pro desbloqueiam cotas e recursos."]]
  },
  ar: {
    languageLabel: "تغيير اللغة", navHome: "الرئيسية", navApps: "تطبيقاتنا", contact: "اتصال", privacy: "الخصوصية", presentation: "عرض", demo: "تجربة", faq: "الأسئلة", stats: "إحصاءات", terms: "شروط الاستخدام",
    siteTitle: "ArcaWand Soft - تطبيقات أصلية وآمنة وقوية", siteDesc: "تطوّر ArcaWand Soft إضافات Chrome مميزة مثل Ultimate Clipboard Pro وFiggliz للإنتاجية والخصوصية والاستراحات الأفضل.", heroTitle: "تطبيقات أصلية وآمنة وقوية.", heroLead: "إضافات مميزة للعمل المركز، والاستراحات الخاصة، والتحكم اليومي.", philosophyTitle: "أدوات للعمل الجاد ولحظات أخف", philosophyLead: "إنتاجية واضحة وتجارب اجتماعية خاصة وبسيطة.", ucpDesc: "مدير حافظة متقدم للمستخدمين المتطلبين", figglizDesc: "دردشات عشوائية خاصة لمحادثات حقيقية", ctaProduct: "افتح صفحة المنتج", ctaInstall: "ثبّت الإضافة", ctaLaunch: "عرض الإطلاق",
    contactTitle: "تواصل مع ArcaWand Soft", contactLead: "هل لديك سؤال تقني أو فكرة منتج أو ملاحظات؟ أرسل رسالة واضحة.", contactBody: "للدعم، اذكر اسم المنتج والمتصفح ونظام التشغيل ووصفاً قصيراً.", sitePrivacyTitle: "سياسة خصوصية موقع ArcaWand Soft", sitePrivacyLead: "كيف يتعامل هذا الموقع الثابت مع البيانات التقنية ورسائل الاتصال والتنبيهات والتحليلات والخدمات الخارجية.",
    ucpTitle: "Ultimate Clipboard Pro", ucpHero: "كل ما تنسخه، منظّم وجاهز عند الحاجة", ucpLead: "التقط النصوص والكود والصور وصفحات الويب داخل مساحة Chrome محلية أولاً.", ucpBullets: ["التقاط بدون فقدان السياق.", "تنظيم النصوص والكود والصور.", "بحث في العناوين والملاحظات والروابط والإصدارات.", "ميزات Pro ونسخ ZIP ومزامنة Drive اختيارية."],
    ucpFaq: [["ما هو Ultimate Clipboard Pro؟", "إضافة Chrome تنظّم ما تنسخه."], ["هل يبقى المحتوى محلياً؟", "نعم افتراضياً، وDrive اختياري."], ["ماذا يفتح Pro؟", "التقاطات غير محدودة وخزنة وسلة وإصدارات وأدوات."], ["لمن هو؟", "لمستخدمي الذكاء الاصطناعي والمطورين والباحثين والمبدعين."]],
    ucpPrivacy: [["محلي أولاً", "التقاطاتك وإعداداتك محلية افتراضياً."], ["خدمات اختيارية", "Drive والترخيص والدفع تُستخدم فقط عند التفعيل."], ["تحكم المستخدم", "يمكنك التصدير والاستعادة والحذف وفصل Drive."]],
    ucpTerms: [["الاستخدام", "إضافة إنتاجية لالتقاط المحتوى وتنظيمه."], ["ترخيص Pro", "السعر القياسي USD 69 وسعر الإطلاق USD 49 عند توفره."], ["المسؤولية", "المستخدم مسؤول عن المحتوى الذي يلتقطه أو يزامنه."]],
    figglizTitle: "Figgliz", figglizHero: "حوّل خمس دقائق استراحة إلى لقاء غير متوقع", figglizLead: "محادثات عشوائية خاصة: نص، رسائل صوتية قصيرة، كاميرا اختيارية وألعاب سريعة.", figglizBullets: ["محادثات عشوائية فردية.", "نص وصوت وكاميرا اختيارية.", "شطرنج، دام، Connect 4، Ping Pong، Flappy Duo وAir Hockey.", "توفر، التالي، حظر وإبلاغ."],
    figglizFaq: [["ما هو Figgliz؟", "إضافة Chrome لمحادثات خاصة عشوائية."], ["هل أحتاج ملفاً عاماً؟", "لا."], ["هل الكاميرا إلزامية؟", "لا، فقط بعد قبول دعوة."], ["هل تظهر الرسائل في الإحصاءات؟", "لا، فقط أرقام مجهولة."]],
    figglizPrivacy: [["خاص بالتصميم", "لا ملفات عامة."], ["موافقة الكاميرا", "الكاميرا والميكروفون اختياريان."], ["الإحصاءات", "أرقام مجهولة ومجمعة فقط."]],
    figglizTerms: [["بيتا", "Figgliz قيد الاختبار التجريبي."], ["استخدام مقبول", "الإساءة والاحتيال والسبام ممنوعة."], ["خطط مدفوعة", "Plus وPro يفتحان حصصاً وميزات."]]
  }
};

Object.assign(packs, {
  zh: clonePack("zh", {
    languageLabel: "更改语言", navHome: "首页", navApps: "我们的应用", contact: "联系", privacy: "隐私", presentation: "介绍", demo: "演示", faq: "常见问题", stats: "统计", terms: "使用条款",
    siteTitle: "ArcaWand Soft - 原创、安全、强大的应用", siteDesc: "ArcaWand Soft 打造 Ultimate Clipboard Pro 和 Figgliz 等 Chrome 扩展，兼顾效率、隐私和轻松休息。",
    heroTitle: "原创、安全、强大的应用。", heroLead: "为专注工作、私密休息和日常掌控打造的高级浏览器扩展。", philosophyTitle: "认真工作，也轻松休息", philosophyLead: "清晰的生产力工具，加上简单自愿的私密社交体验。",
    ucpDesc: "面向高要求用户的高级剪贴板管理器", figglizDesc: "用于真实交流的私密随机聊天", ctaProduct: "打开产品页面", ctaInstall: "安装扩展", ctaLaunch: "发布优惠",
    contactTitle: "联系 ArcaWand Soft", sitePrivacyTitle: "ArcaWand Soft 网站隐私政策", ucpHero: "复制的一切，都被整理并随时可用", figglizHero: "把五分钟休息变成一次意外相遇"
  }),
  ja: clonePack("ja", {
    languageLabel: "言語を変更", navHome: "ホーム", navApps: "アプリ", contact: "連絡先", privacy: "プライバシー", presentation: "紹介", demo: "デモ", faq: "FAQ", stats: "統計", terms: "利用規約",
    siteTitle: "ArcaWand Soft - 独創的で安全な高性能アプリ", siteDesc: "ArcaWand Soft は Ultimate Clipboard Pro と Figgliz など、生産性、プライバシー、休憩に役立つ Chrome 拡張を開発します。",
    heroTitle: "独創的で安全な高性能アプリ。", heroLead: "集中作業、プライベートな休憩、日常のコントロールのためのプレミアム拡張機能。", philosophyTitle: "仕事にも休憩にも役立つツール", philosophyLead: "明快な生産性ワークフローと、シンプルで任意のプライベート交流。",
    ucpDesc: "要求の高いユーザー向けの高度なクリップボード", figglizDesc: "本物の会話のためのプライベートランダムチャット", ctaProduct: "製品ページを開く", ctaInstall: "拡張機能をインストール", ctaLaunch: "ローンチ特典",
    contactTitle: "ArcaWand Soft に連絡", sitePrivacyTitle: "ArcaWand Soft サイトのプライバシーポリシー", ucpHero: "コピーしたものを整理し、必要な時にすぐ使える", figglizHero: "5分の休憩を思いがけない出会いに"
  }),
  ru: clonePack("ru", {
    languageLabel: "Сменить язык", navHome: "Главная", navApps: "Наши приложения", contact: "Контакты", privacy: "Конфиденциальность", presentation: "Обзор", demo: "Демо", faq: "FAQ", stats: "Статистика", terms: "Условия",
    siteTitle: "ArcaWand Soft - оригинальные, безопасные и мощные приложения", siteDesc: "ArcaWand Soft создает расширения Chrome Ultimate Clipboard Pro и Figgliz для продуктивности, приватности и полезных пауз.",
    heroTitle: "Оригинальные, безопасные и мощные приложения.", heroLead: "Премиальные расширения для сфокусированной работы, приватных пауз и ежедневного контроля.", philosophyTitle: "Инструменты для работы и легких пауз", philosophyLead: "Чистые рабочие процессы и простые приватные социальные моменты.",
    ucpDesc: "Продвинутый менеджер буфера обмена", figglizDesc: "Приватные случайные чаты для настоящих разговоров", ctaProduct: "Открыть страницу продукта", ctaInstall: "Установить расширение", ctaLaunch: "Стартовое предложение",
    contactTitle: "Связаться с ArcaWand Soft", sitePrivacyTitle: "Политика конфиденциальности сайта ArcaWand Soft", ucpHero: "Все, что вы копируете, организовано и готово к повторному использованию", figglizHero: "Превратите пять минут перерыва в неожиданную встречу"
  }),
  nl: clonePack("nl", {
    languageLabel: "Taal wijzigen", navHome: "Home", navApps: "Onze apps", contact: "Contact", privacy: "Privacy", presentation: "Presentatie", demo: "Demo", faq: "FAQ", stats: "Statistieken", terms: "Gebruiksvoorwaarden",
    siteTitle: "ArcaWand Soft - originele, veilige en krachtige apps", siteDesc: "ArcaWand Soft bouwt Chrome-extensies zoals Ultimate Clipboard Pro en Figgliz voor productiviteit, privacy en betere pauzes.",
    heroTitle: "Originele, veilige en krachtige apps.", heroLead: "Premium browserextensies voor gefocust werk, privé pauzes en dagelijkse controle.", philosophyTitle: "Tools voor serieus werk en lichtere momenten", philosophyLead: "Heldere productiviteit en eenvoudige privé sociale ervaringen.",
    ucpDesc: "Een geavanceerde klembordmanager", figglizDesc: "Privé willekeurige chats voor echte gesprekken", ctaProduct: "Productpagina openen", ctaInstall: "Extensie installeren", ctaLaunch: "Lanceringsaanbieding",
    contactTitle: "Neem contact op met ArcaWand Soft", sitePrivacyTitle: "Privacybeleid van de ArcaWand Soft website", ucpHero: "Alles wat je kopieert, georganiseerd en klaar voor hergebruik", figglizHero: "Maak van vijf minuten pauze een onverwachte ontmoeting"
  }),
  pl: clonePack("pl", {
    languageLabel: "Zmień język", navHome: "Start", navApps: "Nasze aplikacje", contact: "Kontakt", privacy: "Prywatność", presentation: "Prezentacja", demo: "Demo", faq: "FAQ", stats: "Statystyki", terms: "Warunki korzystania",
    siteTitle: "ArcaWand Soft - oryginalne, bezpieczne i mocne aplikacje", siteDesc: "ArcaWand Soft tworzy rozszerzenia Chrome Ultimate Clipboard Pro i Figgliz dla produktywności, prywatności i lepszych przerw.",
    heroTitle: "Oryginalne, bezpieczne i mocne aplikacje.", heroLead: "Premium rozszerzenia do skupionej pracy, prywatnych przerw i codziennej kontroli.", philosophyTitle: "Narzędzia do pracy i lżejszych chwil", philosophyLead: "Jasne przepływy produktywności oraz proste prywatne doświadczenia społeczne.",
    ucpDesc: "Zaawansowany menedżer schowka", figglizDesc: "Prywatne losowe czaty do prawdziwych rozmów", ctaProduct: "Otwórz stronę produktu", ctaInstall: "Zainstaluj rozszerzenie", ctaLaunch: "Oferta startowa",
    contactTitle: "Skontaktuj się z ArcaWand Soft", sitePrivacyTitle: "Polityka prywatności strony ArcaWand Soft", ucpHero: "Wszystko, co kopiujesz, uporządkowane i gotowe", figglizHero: "Zamień pięć minut przerwy w nieoczekiwane spotkanie"
  }),
  tr: clonePack("tr", {
    languageLabel: "Dili değiştir", navHome: "Ana sayfa", navApps: "Uygulamalarımız", contact: "İletişim", privacy: "Gizlilik", presentation: "Tanıtım", demo: "Demo", faq: "SSS", stats: "İstatistikler", terms: "Kullanım şartları",
    siteTitle: "ArcaWand Soft - özgün, güvenli ve güçlü uygulamalar", siteDesc: "ArcaWand Soft, üretkenlik, gizlilik ve daha iyi molalar için Ultimate Clipboard Pro ve Figgliz gibi Chrome eklentileri geliştirir.",
    heroTitle: "Özgün, güvenli ve güçlü uygulamalar.", heroLead: "Odaklı çalışma, özel molalar ve günlük kontrol için premium tarayıcı eklentileri.", philosophyTitle: "Ciddi iş ve hafif molalar için araçlar", philosophyLead: "Net üretkenlik akışları ve basit, gönüllü özel sosyal deneyimler.",
    ucpDesc: "Talepkar kullanıcılar için gelişmiş pano yöneticisi", figglizDesc: "Gerçek sohbetler için özel rastgele konuşmalar", ctaProduct: "Ürün sayfasını aç", ctaInstall: "Eklentiyi yükle", ctaLaunch: "Lansman teklifi",
    contactTitle: "ArcaWand Soft ile iletişim", sitePrivacyTitle: "ArcaWand Soft web sitesi gizlilik politikası", ucpHero: "Kopyaladığınız her şey düzenli ve tekrar kullanıma hazır", figglizHero: "Beş dakikalık molayı beklenmedik bir tanışmaya dönüştür"
  }),
  ko: clonePack("ko", {
    languageLabel: "언어 변경", navHome: "홈", navApps: "앱", contact: "문의", privacy: "개인정보", presentation: "소개", demo: "데모", faq: "FAQ", stats: "통계", terms: "이용 약관",
    siteTitle: "ArcaWand Soft - 독창적이고 안전한 강력한 앱", siteDesc: "ArcaWand Soft는 생산성, 개인정보 보호, 더 나은 휴식을 위한 Ultimate Clipboard Pro와 Figgliz Chrome 확장 프로그램을 만듭니다.",
    heroTitle: "독창적이고 안전한 강력한 앱.", heroLead: "집중 업무, 사적인 휴식, 일상적인 제어를 위한 프리미엄 브라우저 확장.", philosophyTitle: "진지한 일과 가벼운 순간을 위한 도구", philosophyLead: "명확한 생산성 흐름과 단순하고 자발적인 사적 소셜 경험.",
    ucpDesc: "고급 클립보드 관리자", figglizDesc: "진짜 대화를 위한 비공개 랜덤 채팅", ctaProduct: "제품 페이지 열기", ctaInstall: "확장 프로그램 설치", ctaLaunch: "출시 혜택",
    contactTitle: "ArcaWand Soft 문의", sitePrivacyTitle: "ArcaWand Soft 웹사이트 개인정보 처리방침", ucpHero: "복사한 모든 것을 정리하고 바로 재사용", figglizHero: "5분 휴식을 뜻밖의 만남으로"
  }),
  hi: clonePack("hi", {
    languageLabel: "भाषा बदलें", navHome: "होम", navApps: "हमारे ऐप्स", contact: "संपर्क", privacy: "गोपनीयता", presentation: "प्रस्तुति", demo: "डेमो", faq: "FAQ", stats: "आँकड़े", terms: "उपयोग की शर्तें",
    siteTitle: "ArcaWand Soft - मौलिक, सुरक्षित और शक्तिशाली ऐप्स", siteDesc: "ArcaWand Soft उत्पादकता, गोपनीयता और बेहतर ब्रेक के लिए Ultimate Clipboard Pro और Figgliz जैसे Chrome एक्सटेंशन बनाता है.",
    heroTitle: "मौलिक, सुरक्षित और शक्तिशाली ऐप्स.", heroLead: "फोकस्ड काम, निजी ब्रेक और दैनिक नियंत्रण के लिए प्रीमियम ब्राउज़र एक्सटेंशन.", philosophyTitle: "काम और हल्के पलों के लिए टूल", philosophyLead: "स्पष्ट उत्पादकता वर्कफ़्लो और सरल निजी सामाजिक अनुभव.",
    ucpDesc: "मांग करने वाले उपयोगकर्ताओं के लिए उन्नत क्लिपबोर्ड", figglizDesc: "वास्तविक बातचीत के लिए निजी रैंडम चैट", ctaProduct: "उत्पाद पेज खोलें", ctaInstall: "एक्सटेंशन इंस्टॉल करें", ctaLaunch: "लॉन्च ऑफर",
    contactTitle: "ArcaWand Soft से संपर्क करें", sitePrivacyTitle: "ArcaWand Soft वेबसाइट गोपनीयता नीति", ucpHero: "जो भी आप कॉपी करें, व्यवस्थित और तैयार", figglizHero: "पाँच मिनट के ब्रेक को अप्रत्याशित मुलाकात बनाएं"
  })
});

const detailedOverrides = {
  zh: {
    contactLead: "有技术问题、产品想法、合作请求或反馈？请向开发者发送清晰的消息。",
    contactBody: "寻求支持时，请写明产品名称、浏览器、操作系统和简短说明。我们会认真阅读有用的反馈。",
    sitePrivacyLead: "说明此静态网站如何处理技术数据、联系消息、上线通知、统计、外部服务以及用户权利。",
    ucpLead: "在 Chrome 中以本地优先的工作区捕获文本、代码、图片、截图和网页，快速搜索并重复使用。",
    ucpBullets: ["浏览时捕获内容，不丢失上下文。", "把文本、代码和图片分别整理到专用工作区。", "搜索标题、笔记、来源网址和版本。", "使用 Pro 工作流、ZIP 备份和可选 Google Drive 同步。"],
    ucpFaq: [["Ultimate Clipboard Pro 是什么？", "它是一款 Chrome 扩展，把复制的文本、代码和图片变成有条理的工作区。"], ["内容会保留在本地吗？", "默认采用本地优先管理。Google Drive 同步是可选功能，由用户控制。"], ["Pro 解锁什么？", "无限捕获、保险库、回收站、版本、蒙太奇、更多工具和可选 Drive 同步。"], ["适合谁使用？", "适合 AI 用户、开发者、研究人员、创作者，以及每天复制大量重要信息的人。"]],
    ucpPrivacy: [["本地优先", "捕获内容和设置默认存储在浏览器扩展环境中。"], ["可选服务", "只有在使用 Google Drive 同步、许可验证或支付时，才会联系对应服务。"], ["用户控制", "用户可以导出、恢复、删除捕获内容，断开 Drive，或移除扩展。"]],
    ucpTerms: [["产品用途", "Ultimate Clipboard Pro 用于在浏览时捕获、整理和重复使用内容。"], ["Pro 许可", "标准终身 Pro 价格为 69 美元，发布优惠价为 49 美元，优惠期内有效。"], ["责任", "用户需对其捕获、导出或同步的内容合法性和安全性负责。"]],
    figglizLead: "面向私密随机对话的 Chrome 扩展：文本、短语音、可选摄像头和小游戏，无需公开资料。",
    figglizBullets: ["随机一对一对话。", "文本、语音留言和可选摄像头。", "国际象棋、跳棋、四子棋、乒乓、Flappy Duo 和 Air Hockey。", "可用状态、Next、屏蔽和举报控制。"],
    figglizFaq: [["Figgliz 是什么？", "它是一款用于随机匹配一对一私密对话的 Chrome 扩展。"], ["需要公开资料吗？", "不需要。Figgliz 避免公开资料、动态流、粉丝数和表演式社交。"], ["必须开摄像头吗？", "不需要。摄像头仅在邀请并接受后才会启用。"], ["统计数据公开吗？", "只公开匿名汇总计数，不公开对话或身份。"]],
    figglizPrivacy: [["私密设计", "Figgliz 设计用于没有公开资料的随机私密对话。"], ["摄像头同意", "摄像头和麦克风为可选功能，需要明确同意。"], ["公开统计", "统计页面只显示匿名汇总计数，不显示私人消息或身份。"]],
    figglizTerms: [["测试阶段", "Figgliz 目前正由志愿用户进行 beta 测试，尚未公开发布。"], ["可接受使用", "禁止骚扰、威胁、剥削、垃圾信息、欺诈以及绕过安全系统的行为。"], ["付费方案", "Plus 和 Pro 可解锁更高额度、筛选、摄像头功能、游戏和更快匹配控制。"]]
  },
  ja: {
    contactLead: "技術的な質問、製品アイデア、提携相談、フィードバックがあれば、開発者へ分かりやすく送ってください。",
    contactBody: "サポート依頼では、製品名、ブラウザ、OS、短い説明を含めてください。有用なフィードバックは丁寧に確認します。",
    sitePrivacyLead: "この静的サイトが技術データ、連絡メッセージ、リリース通知、分析、外部サービス、ユーザーの権利をどう扱うかを説明します。",
    ucpLead: "Chrome 内のローカル優先ワークスペースで、テキスト、コード、画像、スクリーンショット、Web ページをすばやく保存・検索・再利用できます。",
    ucpBullets: ["閲覧中の文脈を失わずに保存。", "テキスト、コード、画像を専用ワークスペースで整理。", "タイトル、メモ、元 URL、バージョンを検索。", "Pro ワークフロー、ZIP バックアップ、任意の Google Drive 同期を利用。"],
    ucpFaq: [["Ultimate Clipboard Pro とは？", "コピーしたテキスト、コード、画像を整理されたワークスペースに変える Chrome 拡張機能です。"], ["内容はローカルに残りますか？", "通常の管理はローカル優先です。Drive 同期はユーザーが選ぶ任意機能です。"], ["Pro で何が使えますか？", "無制限保存、保管庫、ゴミ箱、バージョン、モンタージュ、追加ツール、Drive 同期などです。"], ["誰向けですか？", "AI ユーザー、開発者、研究者、クリエイター、毎日多くの情報をコピーする人向けです。"]],
    ucpPrivacy: [["ローカル優先設計", "保存内容と設定は既定でブラウザ拡張環境内に保存されます。"], ["任意サービス", "Google Drive 同期、ライセンス、決済は該当機能のためだけに使用されます。"], ["ユーザー管理", "エクスポート、復元、削除、Drive 切断、拡張機能の削除が可能です。"]],
    ucpTerms: [["製品の利用", "閲覧中の内容を保存、整理、再利用するための生産性拡張機能です。"], ["Pro ライセンス", "標準の買い切り Pro 価格は 69 米ドル、提供中のローンチ価格は 49 米ドルです。"], ["責任", "保存、エクスポート、同期する内容の合法性と安全性はユーザーの責任です。"]],
    figglizLead: "公開プロフィールなしで、テキスト、短い音声、任意のウェブカメラ、ミニゲームを使えるプライベートなランダム会話用 Chrome 拡張機能です。",
    figglizBullets: ["ランダムな一対一の会話。", "テキスト、音声メモ、任意のウェブカメラ。", "チェス、チェッカー、Connect 4、Ping Pong、Flappy Duo、Air Hockey。", "在席状態、Next、ブロック、通報の操作。"],
    figglizFaq: [["Figgliz とは？", "ランダムにマッチした相手と一対一で私的に会話する Chrome 拡張機能です。"], ["公開プロフィールは必要ですか？", "不要です。公開プロフィール、フィード、フォロワー数、見せるためのSNS要素を避けます。"], ["ウェブカメラは必須ですか？", "いいえ。招待と承諾があった場合だけ開始されます。"], ["統計は公開されますか？", "公開されるのは匿名の集計値だけです。会話は公開されません。"]],
    figglizPrivacy: [["プライバシー重視", "公開プロフィールなしのプライベートなランダム会話を前提に設計されています。"], ["ウェブカメラ同意", "カメラとマイクは任意で、明示的な承諾が必要です。"], ["公開統計", "統計ページは匿名の集計値のみを表示します。"]],
    figglizTerms: [["ベータ製品", "Figgliz は公開前に有志ユーザーでベータテスト中です。"], ["許容される利用", "嫌がらせ、脅迫、搾取、スパム、詐欺、安全機能の回避は禁止です。"], ["有料プラン", "Plus と Pro は上限、フィルター、ウェブカメラ機能、ゲーム、より速いマッチング操作を解放します。"]]
  },
  ru: {
    contactLead: "Есть технический вопрос, идея продукта, запрос на сотрудничество или отзыв? Напишите разработчику понятное сообщение.",
    contactBody: "Для поддержки укажите продукт, браузер, операционную систему и краткое описание. Полезные отзывы внимательно читаются.",
    sitePrivacyLead: "Как этот статический сайт обрабатывает технические данные, сообщения, уведомления о запуске, аналитику, внешние сервисы и права пользователя.",
    ucpLead: "Сохраняйте текст, код, изображения, скриншоты и веб-страницы в локальном рабочем пространстве Chrome для быстрого поиска и повторного использования.",
    ucpBullets: ["Сохраняйте контент во время просмотра без потери контекста.", "Организуйте текст, код и изображения в отдельных пространствах.", "Ищите по заголовкам, заметкам, исходным URL и версиям.", "Используйте Pro-процессы, ZIP-резервные копии и опциональную синхронизацию Google Drive."],
    ucpFaq: [["Что такое Ultimate Clipboard Pro?", "Chrome-расширение, которое превращает скопированный текст, код и изображения в организованное рабочее пространство."], ["Данные остаются локальными?", "Обычное управление локально по умолчанию. Синхронизация Drive включается только пользователем."], ["Что открывает Pro?", "Неограниченные сохранения, сейф, корзину, версии, монтаж, дополнительные инструменты и Drive."], ["Для кого это?", "Для пользователей ИИ, разработчиков, исследователей, авторов и всех, кто ежедневно копирует важную информацию."]],
    ucpPrivacy: [["Локальный подход", "Сохранения и настройки по умолчанию хранятся в среде расширения браузера."], ["Опциональные сервисы", "Drive, лицензирование и платежи используются только для соответствующих функций."], ["Контроль пользователя", "Можно экспортировать, восстановить, удалить данные, отключить Drive и удалить расширение."]],
    ucpTerms: [["Использование", "Расширение помогает сохранять, организовывать и повторно использовать контент при работе в браузере."], ["Лицензия Pro", "Стандартная пожизненная цена Pro — 69 USD, стартовая цена — 49 USD, пока доступна."], ["Ответственность", "Пользователь отвечает за законность и безопасность сохраняемого, экспортируемого или синхронизируемого контента."]],
    figglizLead: "Chrome-расширение для приватных случайных разговоров: текст, короткие голосовые, опциональная веб-камера и быстрые игры без публичных профилей.",
    figglizBullets: ["Случайные разговоры один на один.", "Текст, голосовые заметки и опциональная веб-камера.", "Шахматы, шашки, Connect 4, Ping Pong, Flappy Duo и Air Hockey.", "Статус доступности, Next, блокировка и жалобы."],
    figglizFaq: [["Что такое Figgliz?", "Chrome-расширение для приватных разговоров один на один со случайно подобранными людьми."], ["Нужен публичный профиль?", "Нет. Figgliz избегает профилей, лент, подписчиков и социальной витрины."], ["Веб-камера обязательна?", "Нет. Она запускается только после явного приглашения и согласия."], ["Публичны ли статистики?", "Публичны только анонимные агрегированные счетчики, не разговоры и не личности."]],
    figglizPrivacy: [["Приватность по замыслу", "Figgliz создан для приватных случайных разговоров без публичных профилей."], ["Согласие на камеру", "Камера и микрофон опциональны и требуют явного согласия."], ["Публичная статистика", "Страница статистики показывает только анонимные агрегированные значения."]],
    figglizTerms: [["Бета-продукт", "Figgliz сейчас тестируется добровольцами перед публичным запуском."], ["Допустимое использование", "Запрещены травля, угрозы, эксплуатация, спам, мошенничество и обход защитных систем."], ["Платные планы", "Plus и Pro могут открывать лимиты, фильтры, веб-камеру, игры и ускоренные функции подбора."]]
  },
  nl: {
    contactLead: "Heb je een technische vraag, productidee, samenwerkingsverzoek of feedback? Stuur een duidelijke boodschap naar de ontwikkelaar.",
    contactBody: "Vermeld voor support de productnaam, browser, besturingssysteem en een korte beschrijving. Bruikbare feedback wordt zorgvuldig gelezen.",
    sitePrivacyLead: "Hoe deze statische website technische gegevens, contactberichten, lanceringsmeldingen, analytics, externe diensten en gebruikersrechten behandelt.",
    ucpLead: "Leg tekst, code, afbeeldingen, screenshots en webpagina's vast in een local-first Chrome-werkruimte voor snelheid, zoeken en hergebruik.",
    ucpBullets: ["Leg vast tijdens het browsen zonder context te verliezen.", "Organiseer tekst, code en afbeeldingen in aparte werkruimtes.", "Zoek in titels, notities, bron-URL's en versies.", "Gebruik Pro-workflows, ZIP-back-up en optionele Google Drive-sync."],
    ucpFaq: [["Wat is Ultimate Clipboard Pro?", "Een Chrome-extensie die gekopieerde tekst, code en afbeeldingen omzet in een georganiseerde werkruimte."], ["Blijft mijn inhoud lokaal?", "Normaal beheer is local-first. Drive-sync is optioneel en staat onder controle van de gebruiker."], ["Wat ontgrendelt Pro?", "Onbeperkte captures, kluis, prullenbak, versies, montage, extra tools en optionele Drive-sync."], ["Voor wie is het?", "AI-gebruikers, ontwikkelaars, onderzoekers, makers en iedereen die dagelijks waardevolle informatie kopieert."]],
    ucpPrivacy: [["Local-first ontwerp", "Captures en instellingen worden standaard lokaal opgeslagen in de browserextensie."], ["Optionele diensten", "Google Drive, licenties en betalingen worden alleen gebruikt voor de functies die ze leveren."], ["Gebruikerscontrole", "Je kunt exporteren, herstellen, verwijderen, Drive loskoppelen en de extensie verwijderen."]],
    ucpTerms: [["Productgebruik", "Ultimate Clipboard Pro is bedoeld om content tijdens het browsen vast te leggen, te organiseren en opnieuw te gebruiken."], ["Pro-licentie", "De standaard lifetime Pro-prijs is USD 69, met een lanceringsprijs van USD 49 zolang beschikbaar."], ["Verantwoordelijkheid", "Gebruikers zijn verantwoordelijk voor de legaliteit en veiligheid van de content die zij vastleggen, exporteren of synchroniseren."]],
    figglizLead: "Een Chrome-extensie voor private willekeurige gesprekken: tekst, korte spraakberichten, optionele webcam en snelle games, zonder openbare profielen.",
    figglizBullets: ["Willekeurige een-op-een gesprekken.", "Tekst, spraaknotities en optionele webcam.", "Schaken, dammen, Connect 4, Ping Pong, Flappy Duo en Air Hockey.", "Beschikbaarheid, Next, blokkeren en rapporteren."],
    figglizFaq: [["Wat is Figgliz?", "Een Chrome-extensie voor private een-op-een gesprekken met willekeurig gematchte mensen."], ["Heb ik een openbaar profiel nodig?", "Nee. Figgliz vermijdt openbare profielen, feeds, volgersaantallen en sociale show."], ["Is webcam verplicht?", "Nee. Webcam start alleen na uitnodiging en acceptatie."], ["Zijn statistieken openbaar?", "Alleen anonieme totalen zijn openbaar. Gesprekken worden niet gepubliceerd."]],
    figglizPrivacy: [["Privé ontworpen", "Figgliz is ontworpen voor private willekeurige gesprekken zonder openbare profielen."], ["Webcamtoestemming", "Webcam en microfoon zijn optioneel en vereisen expliciete acceptatie."], ["Openbare statistieken", "De statistiekenpagina toont anonieme totalen, geen privéberichten of identiteiten."]],
    figglizTerms: [["Bètaproduct", "Figgliz wordt momenteel getest door vrijwillige gebruikers vóór de publieke release."], ["Aanvaardbaar gebruik", "Intimidatie, bedreiging, uitbuiting, spam, fraude en pogingen om veiligheidssystemen te omzeilen zijn verboden."], ["Betaalde plannen", "Plus en Pro kunnen hogere limieten, filters, webcamfuncties, games en snellere matching ontgrendelen."]]
  },
  pl: {
    contactLead: "Masz pytanie techniczne, pomysł na produkt, propozycję współpracy lub opinię? Wyślij jasną wiadomość do twórcy.",
    contactBody: "W zgłoszeniu podaj produkt, przeglądarkę, system operacyjny i krótki opis. Przydatne opinie czytamy uważnie.",
    sitePrivacyLead: "Jak ta statyczna strona obsługuje dane techniczne, wiadomości kontaktowe, powiadomienia o premierach, analitykę, usługi zewnętrzne i prawa użytkownika.",
    ucpLead: "Zapisuj tekst, kod, obrazy, zrzuty ekranu i strony WWW w lokalnym obszarze Chrome stworzonym do szybkiego wyszukiwania i ponownego użycia.",
    ucpBullets: ["Zapisuj podczas przeglądania bez utraty kontekstu.", "Organizuj tekst, kod i obrazy w osobnych przestrzeniach.", "Szukaj w tytułach, notatkach, URL źródłowych i wersjach.", "Korzystaj z Pro, kopii ZIP i opcjonalnej synchronizacji Google Drive."],
    ucpFaq: [["Czym jest Ultimate Clipboard Pro?", "Rozszerzeniem Chrome, które zamienia kopiowany tekst, kod i obrazy w uporządkowaną przestrzeń roboczą."], ["Czy treści zostają lokalnie?", "Domyślnie zarządzanie jest lokalne. Synchronizacja Drive jest opcjonalna i kontrolowana przez użytkownika."], ["Co daje Pro?", "Nielimitowane zapisy, sejf, kosz, wersje, montaż, więcej narzędzi i opcjonalny Drive."], ["Dla kogo to jest?", "Dla użytkowników AI, programistów, badaczy, twórców i osób kopiujących dużo ważnych informacji."]],
    ucpPrivacy: [["Lokalnie przede wszystkim", "Zapisy i ustawienia domyślnie znajdują się lokalnie w środowisku rozszerzenia."], ["Usługi opcjonalne", "Drive, licencjonowanie i płatności są używane tylko dla odpowiednich funkcji."], ["Kontrola użytkownika", "Możesz eksportować, przywracać, usuwać dane, odłączyć Drive i usunąć rozszerzenie."]],
    ucpTerms: [["Użycie produktu", "Ultimate Clipboard Pro służy do zapisywania, organizowania i ponownego używania treści podczas przeglądania."], ["Licencja Pro", "Standardowa cena lifetime Pro to 69 USD, a cena startowa 49 USD, dopóki jest dostępna."], ["Odpowiedzialność", "Użytkownik odpowiada za legalność i bezpieczeństwo treści zapisywanych, eksportowanych lub synchronizowanych."]],
    figglizLead: "Rozszerzenie Chrome do prywatnych losowych rozmów: tekst, krótkie wiadomości głosowe, opcjonalna kamera i szybkie gry bez publicznych profili.",
    figglizBullets: ["Losowe rozmowy jeden na jeden.", "Tekst, notatki głosowe i opcjonalna kamera.", "Szachy, warcaby, Connect 4, Ping Pong, Flappy Duo i Air Hockey.", "Dostępność, Next, blokowanie i zgłaszanie."],
    figglizFaq: [["Czym jest Figgliz?", "Rozszerzeniem Chrome do prywatnych rozmów jeden na jeden z losowo dobranymi osobami."], ["Czy potrzebuję publicznego profilu?", "Nie. Figgliz unika publicznych profili, feedów, liczników obserwujących i społecznej autoprezentacji."], ["Czy kamera jest wymagana?", "Nie. Kamera uruchamia się tylko po zaproszeniu i akceptacji."], ["Czy statystyki są publiczne?", "Publiczne są tylko anonimowe dane zbiorcze. Rozmowy nie są publikowane."]],
    figglizPrivacy: [["Prywatność z założenia", "Figgliz jest zaprojektowany do prywatnych losowych rozmów bez publicznych profili."], ["Zgoda na kamerę", "Kamera i mikrofon są opcjonalne i wymagają wyraźnej akceptacji."], ["Statystyki publiczne", "Strona statystyk pokazuje anonimowe liczniki zbiorcze, nie prywatne wiadomości ani tożsamości."]],
    figglizTerms: [["Produkt beta", "Figgliz jest obecnie testowany przez ochotników przed publicznym wydaniem."], ["Dozwolone użycie", "Nękanie, groźby, wykorzystywanie, spam, oszustwa i obchodzenie zabezpieczeń są zabronione."], ["Plany płatne", "Plus i Pro mogą odblokować wyższe limity, filtry, kamerę, gry i szybsze dopasowania."]]
  },
  tr: {
    contactLead: "Teknik bir sorunuz, ürün fikriniz, iş birliği talebiniz veya geri bildiriminiz mi var? Geliştiriciye net bir mesaj gönderin.",
    contactBody: "Destek için ürün adını, tarayıcıyı, işletim sistemini ve kısa bir açıklamayı ekleyin. Yararlı geri bildirimleri dikkatle okuruz.",
    sitePrivacyLead: "Bu statik sitenin teknik verileri, iletişim mesajlarını, lansman bildirimlerini, analizleri, harici servisleri ve kullanıcı haklarını nasıl ele aldığını açıklar.",
    ucpLead: "Metinleri, kodları, görselleri, ekran görüntülerini ve web sayfalarını hızlı arama ve yeniden kullanım için local-first bir Chrome çalışma alanında yakalayın.",
    ucpBullets: ["Gezinirken bağlamı kaybetmeden yakalayın.", "Metin, kod ve görselleri ayrı çalışma alanlarında düzenleyin.", "Başlıklarda, notlarda, kaynak URL'lerinde ve sürümlerde arayın.", "Pro akışları, ZIP yedekleme ve isteğe bağlı Google Drive senkronizasyonu kullanın."],
    ucpFaq: [["Ultimate Clipboard Pro nedir?", "Kopyalanan metinleri, kodları ve görselleri düzenli bir çalışma alanına dönüştüren Chrome eklentisidir."], ["İçeriğim yerel kalır mı?", "Normal yönetim local-first çalışır. Drive senkronizasyonu isteğe bağlıdır ve kullanıcı kontrolündedir."], ["Pro neyi açar?", "Sınırsız yakalama, kasa, çöp kutusu, sürümleme, montaj, ek araçlar ve isteğe bağlı Drive."], ["Kimler için?", "AI kullanıcıları, geliştiriciler, araştırmacılar, içerik üreticileri ve her gün değerli bilgi kopyalayanlar için."]],
    ucpPrivacy: [["Local-first tasarım", "Yakalamalar ve ayarlar varsayılan olarak tarayıcı eklentisi ortamında yerel saklanır."], ["İsteğe bağlı servisler", "Drive, lisans ve ödeme servisleri yalnızca ilgili özellikler için kullanılır."], ["Kullanıcı kontrolü", "Dışa aktarabilir, geri yükleyebilir, silebilir, Drive bağlantısını kesebilir ve eklentiyi kaldırabilirsiniz."]],
    ucpTerms: [["Ürün kullanımı", "Ultimate Clipboard Pro gezinirken içerik yakalamak, düzenlemek ve yeniden kullanmak için bir üretkenlik eklentisidir."], ["Pro lisansı", "Standart lifetime Pro fiyatı 69 USD, lansman fiyatı mevcut olduğu sürece 49 USD'dir."], ["Sorumluluk", "Yakalanan, dışa aktarılan veya senkronize edilen içeriğin yasallığı ve güvenliği kullanıcıya aittir."]],
    figglizLead: "Herkese açık profil olmadan özel rastgele sohbetler için Chrome eklentisi: metin, kısa sesli notlar, isteğe bağlı webcam ve hızlı oyunlar.",
    figglizBullets: ["Rastgele bire bir sohbetler.", "Metin, sesli notlar ve isteğe bağlı webcam.", "Satranç, dama, Connect 4, Ping Pong, Flappy Duo ve Air Hockey.", "Uygunluk, Next, engelleme ve raporlama kontrolleri."],
    figglizFaq: [["Figgliz nedir?", "Rastgele eşleşen kişilerle özel bire bir sohbet için Chrome eklentisidir."], ["Herkese açık profil gerekir mi?", "Hayır. Figgliz herkese açık profil, akış, takipçi sayısı ve sosyal vitrin mantığından kaçınır."], ["Webcam zorunlu mu?", "Hayır. Webcam yalnızca açık davet ve kabulden sonra başlar."], ["İstatistikler herkese açık mı?", "Yalnızca anonim toplam sayaçlar herkese açıktır. Sohbetler yayınlanmaz."]],
    figglizPrivacy: [["Gizlilik odaklı", "Figgliz herkese açık profil olmadan özel rastgele sohbetler için tasarlanmıştır."], ["Webcam onayı", "Webcam ve mikrofon isteğe bağlıdır ve açık kabul gerektirir."], ["Genel istatistikler", "İstatistik sayfası özel mesajları veya kimlikleri değil, anonim toplamları gösterir."]],
    figglizTerms: [["Beta ürün", "Figgliz kamuya açılmadan önce gönüllü kullanıcılarla beta testindedir."], ["Kabul edilebilir kullanım", "Taciz, tehdit, sömürü, spam, dolandırıcılık ve güvenlik sistemlerini aşma girişimleri yasaktır."], ["Ücretli planlar", "Plus ve Pro daha yüksek kotalar, filtreler, webcam özellikleri, oyunlar ve daha hızlı eşleşme kontrolleri sunabilir."]]
  },
  ko: {
    contactLead: "기술 질문, 제품 아이디어, 제휴 요청 또는 피드백이 있나요? 개발자에게 명확한 메시지를 보내 주세요.",
    contactBody: "지원 요청에는 제품명, 브라우저, 운영체제, 짧은 설명을 포함해 주세요. 유용한 피드백은 꼼꼼히 확인합니다.",
    sitePrivacyLead: "이 정적 웹사이트가 기술 데이터, 문의 메시지, 출시 알림, 분석, 외부 서비스 및 사용자 권리를 어떻게 다루는지 설명합니다.",
    ucpLead: "Chrome 안의 로컬 우선 작업 공간에서 텍스트, 코드, 이미지, 스크린샷, 웹페이지를 캡처하고 빠르게 검색해 재사용하세요.",
    ucpBullets: ["탐색 중 문맥을 잃지 않고 캡처합니다.", "텍스트, 코드, 이미지를 전용 작업 공간에 정리합니다.", "제목, 메모, 원본 URL, 버전을 검색합니다.", "Pro 워크플로, ZIP 백업, 선택적 Google Drive 동기화를 사용합니다."],
    ucpFaq: [["Ultimate Clipboard Pro는 무엇인가요?", "복사한 텍스트, 코드, 이미지를 정리된 작업 공간으로 바꾸는 Chrome 확장 프로그램입니다."], ["콘텐츠는 로컬에 남나요?", "일반 관리는 로컬 우선입니다. Drive 동기화는 사용자가 선택하는 기능입니다."], ["Pro는 무엇을 열어 주나요?", "무제한 캡처, 보관함, 휴지통, 버전, 몽타주, 추가 도구, 선택적 Drive 동기화를 제공합니다."], ["누구에게 적합한가요?", "AI 사용자, 개발자, 연구자, 크리에이터, 매일 중요한 정보를 많이 복사하는 사람에게 적합합니다."]],
    ucpPrivacy: [["로컬 우선 설계", "캡처와 설정은 기본적으로 브라우저 확장 환경에 로컬 저장됩니다."], ["선택적 서비스", "Google Drive, 라이선스, 결제 서비스는 해당 기능을 위해서만 사용됩니다."], ["사용자 제어", "내보내기, 복원, 삭제, Drive 연결 해제, 확장 프로그램 제거가 가능합니다."]],
    ucpTerms: [["제품 사용", "Ultimate Clipboard Pro는 브라우징 중 콘텐츠를 캡처, 정리, 재사용하기 위한 생산성 확장 프로그램입니다."], ["Pro 라이선스", "표준 lifetime Pro 가격은 USD 69이며, 출시 가격은 제공 기간 동안 USD 49입니다."], ["책임", "캡처, 내보내기, 동기화하는 콘텐츠의 합법성과 안전성은 사용자 책임입니다."]],
    figglizLead: "공개 프로필 없이 텍스트, 짧은 음성, 선택적 웹캠, 빠른 게임으로 비공개 랜덤 대화를 할 수 있는 Chrome 확장 프로그램입니다.",
    figglizBullets: ["랜덤 1:1 대화.", "텍스트, 음성 메모, 선택적 웹캠.", "체스, 체커, Connect 4, Ping Pong, Flappy Duo, Air Hockey.", "상태, Next, 차단, 신고 제어."],
    figglizFaq: [["Figgliz는 무엇인가요?", "랜덤 매칭된 사람과 비공개 1:1 대화를 하는 Chrome 확장 프로그램입니다."], ["공개 프로필이 필요한가요?", "아니요. Figgliz는 공개 프로필, 피드, 팔로워 수, 과시형 소셜 요소를 피합니다."], ["웹캠은 필수인가요?", "아니요. 명시적 초대와 수락 후에만 시작됩니다."], ["통계는 공개되나요?", "익명 집계 카운터만 공개됩니다. 대화는 공개되지 않습니다."]],
    figglizPrivacy: [["비공개 설계", "Figgliz는 공개 프로필 없는 비공개 랜덤 대화를 위해 설계되었습니다."], ["웹캠 동의", "웹캠과 마이크는 선택 사항이며 명시적 수락이 필요합니다."], ["공개 통계", "통계 페이지는 비공개 메시지나 신원이 아닌 익명 집계값만 표시합니다."]],
    figglizTerms: [["베타 제품", "Figgliz는 공개 출시 전 자원 사용자와 베타 테스트 중입니다."], ["허용 사용", "괴롭힘, 협박, 착취, 스팸, 사기, 안전 시스템 우회 시도는 금지됩니다."], ["유료 플랜", "Plus와 Pro는 더 높은 한도, 필터, 웹캠 기능, 게임, 더 빠른 매칭 제어를 제공할 수 있습니다."]]
  },
  hi: {
    contactLead: "तकनीकी सवाल, उत्पाद विचार, साझेदारी अनुरोध या प्रतिक्रिया है? डेवलपर को साफ संदेश भेजें।",
    contactBody: "सपोर्ट के लिए उत्पाद नाम, ब्राउज़र, ऑपरेटिंग सिस्टम और छोटा विवरण शामिल करें। उपयोगी प्रतिक्रिया ध्यान से पढ़ी जाती है।",
    sitePrivacyLead: "यह स्थिर वेबसाइट तकनीकी डेटा, संपर्क संदेश, लॉन्च नोटिफिकेशन, एनालिटिक्स, बाहरी सेवाओं और उपयोगकर्ता अधिकारों को कैसे संभालती है।",
    ucpLead: "Chrome में local-first workspace के अंदर टेक्स्ट, कोड, इमेज, स्क्रीनशॉट और वेब पेज कैप्चर करें, खोजें और दोबारा उपयोग करें।",
    ucpBullets: ["ब्राउज़ करते समय संदर्भ खोए बिना कैप्चर करें।", "टेक्स्ट, कोड और इमेज को अलग workspace में व्यवस्थित करें।", "शीर्षक, नोट्स, source URL और versions में खोजें।", "Pro workflows, ZIP backup और वैकल्पिक Google Drive sync उपयोग करें।"],
    ucpFaq: [["Ultimate Clipboard Pro क्या है?", "एक Chrome extension जो copied text, code और images को organized workspace में बदलता है।"], ["क्या मेरा content local रहता है?", "सामान्य प्रबंधन local-first है। Drive sync वैकल्पिक और user-controlled है।"], ["Pro क्या unlock करता है?", "Unlimited captures, vault, trash, versioning, montage, ज्यादा tools और optional Drive sync।"], ["यह किसके लिए है?", "AI users, developers, researchers, creators और रोज़ महत्वपूर्ण जानकारी copy करने वालों के लिए।"]],
    ucpPrivacy: [["लोकल-फर्स्ट डिजाइन", "Captures और settings default रूप से browser extension environment में locally stored रहते हैं।"], ["वैकल्पिक सेवाएँ", "Google Drive sync, licensing और payments केवल संबंधित features के लिए इस्तेमाल होते हैं।"], ["उपयोगकर्ता नियंत्रण", "Users export, restore, delete, Drive disconnect और extension remove कर सकते हैं।"]],
    ucpTerms: [["उत्पाद उपयोग", "Ultimate Clipboard Pro browsing के दौरान content capture, organize और reuse करने के लिए productivity extension है।"], ["Pro लाइसेंस", "Standard lifetime Pro price USD 69 है, launch price उपलब्ध रहने तक USD 49 है।"], ["जिम्मेदारी", "Captured, exported या synchronized content की legality और safety user की responsibility है।"]],
    figglizLead: "निजी random conversations के लिए Chrome extension: text, short voice notes, optional webcam और quick games, बिना public profile के।",
    figglizBullets: ["Random one-to-one conversations.", "Text, voice notes और optional webcam.", "Chess, Checkers, Connect 4, Ping Pong, Flappy Duo और Air Hockey.", "Availability, Next, block और report controls."],
    figglizFaq: [["Figgliz क्या है?", "Randomly matched लोगों के साथ private one-to-one conversations के लिए Chrome extension।"], ["क्या public profile चाहिए?", "नहीं। Figgliz public profiles, feeds, follower counts और social theatre से बचता है।"], ["क्या webcam ज़रूरी है?", "नहीं। Webcam केवल explicit invitation और acceptance के बाद शुरू होता है।"], ["क्या stats public हैं?", "सिर्फ anonymous aggregate counters public हैं। Conversations publish नहीं होतीं।"]],
    figglizPrivacy: [["डिजाइन से निजी", "Figgliz public profiles के बिना निजी random conversations के लिए designed है।"], ["Webcam सहमति", "Webcam और microphone optional हैं और explicit acceptance मांगते हैं।"], ["सार्वजनिक आँकड़े", "Statistics page anonymous aggregate counters दिखाता है, private messages या identities नहीं।"]],
    figglizTerms: [["बीटा उत्पाद", "Figgliz public release से पहले volunteer users के साथ beta testing में है।"], ["स्वीकार्य उपयोग", "Harassment, threats, exploitation, spam, fraud और safety systems bypass attempts prohibited हैं।"], ["पेड प्लान", "Plus और Pro higher quotas, filters, webcam features, games और faster matching controls unlock कर सकते हैं।"]]
  }
};

for (const [code, overrides] of Object.entries(detailedOverrides)) {
  Object.assign(packs[code], overrides);
}

function clonePack(code, overrides) {
  const basePack = JSON.parse(JSON.stringify(packs.en));
  Object.assign(basePack, overrides);
  basePack.ucpLead = overrides.ucpLead || basePack.ucpLead;
  basePack.figglizLead = overrides.figglizLead || basePack.figglizLead;
  return basePack;
}

function pack(code) {
  return packs[code] || packs.en;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

function rel(pathName, fromDepth = 0) {
  return `${"../".repeat(fromDepth)}${pathName}`;
}

function head({ lang, pageKey, title, desc, image, productName }) {
  const language = languageByCode(lang);
  const canonical = localizedUrl(lang, pageKey);
  const alternates = LANGUAGES.map((item) => `<link rel="alternate" hreflang="${item.code}" href="${localizedUrl(item.code, pageKey)}">`).join("\n");
  const json = {
    "@context": "https://schema.org",
    "@type": productName ? "WebPage" : "WebSite",
    name: title,
    headline: title,
    description: desc,
    url: canonical,
    inLanguage: language.html,
    image,
    publisher: { "@type": "Organization", name: "ArcaWand Soft", url: base, email: "contact@arcawand-soft.com" }
  };
  if (productName) json.about = { "@type": "SoftwareApplication", name: productName, applicationCategory: "BrowserApplication", operatingSystem: "Chrome" };
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#8b5cf6">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow">
<meta name="author" content="ArcaWand Soft">
<link rel="canonical" href="${canonical}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${localizedUrl("en", pageKey)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ArcaWand Soft">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:secure_url" content="${image}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="675">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${image}">
<script type="application/ld+json">${JSON.stringify(json).replace(/</g, "\\u003c")}</script>`;
}

function pageShell({ lang, pageKey, title, desc, image, productName, css = "", scripts = "", bodyClass = "", body }) {
  const language = languageByCode(lang);
  return `<!doctype html>
<html lang="${language.html}"${language.rtl ? ' dir="rtl"' : ""}>
<head>
${head({ lang, pageKey, title, desc, image, productName })}
<link rel="icon" type="image/png" href="/assets/Arcawand_Soft_Favicon.png">
<link rel="stylesheet" href="/assets/site.css?v=20260620-languages">
${css}
<script defer src="/assets/site.js?v=20260620-languages"></script>
${scripts}
</head>
<body class="${bodyClass}">
${body}
<script defer src="/assets/install-extension-modal.js"></script>
</body>
</html>
`;
}

function nav(lang, pageKey, depth = 0) {
  const t = pack(lang);
  const prefix = "../".repeat(depth);
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="${prefix}" aria-label="ArcaWand Soft"><span class="brand-stack"><img class="brand-logo" src="/assets/Arcawand_Soft_Logo_320.webp" alt="ArcaWand Soft" width="320" height="88" decoding="async"></span></a><button class="mobile-toggle" aria-label="Open menu">☰</button><nav class="nav"><a class="nav-link" href="${localizedUrl(lang, "home")}">${esc(t.navHome)}</a><div class="nav-drop"><button class="nav-drop-button" type="button">${esc(t.navApps)}</button><div class="nav-drop-menu nav-apps-menu nav-apps-menu-wide"><div class="nav-app-card"><a class="nav-drop-item nav-app-main" href="${localizedUrl(lang, "ucp")}"><strong>Ultimate Clipboard Pro</strong><span>${esc(t.ucpDesc)}</span></a><div class="nav-app-links"><a href="${localizedUrl(lang, "ucp")}">${esc(t.presentation)}</a><a href="${localizedUrl(lang, "ucpDemo")}">${esc(t.demo)}</a><a href="${localizedUrl(lang, "ucpFaq")}">${esc(t.faq)}</a><a href="${localizedUrl(lang, "ucpPrivacy")}">${esc(t.privacy)}</a><a href="${localizedUrl(lang, "ucpTerms")}">${esc(t.terms)}</a></div></div><div class="nav-app-card"><a class="nav-drop-item nav-app-main" href="${localizedUrl(lang, "figgliz")}"><strong>Figgliz</strong><span>${esc(t.figglizDesc)}</span></a><div class="nav-app-links nav-app-links-four"><a href="${localizedUrl(lang, "figgliz")}">${esc(t.presentation)}</a><a href="${localizedUrl(lang, "figglizFaq")}">${esc(t.faq)}</a><a href="${localizedUrl(lang, "figglizStats")}">${esc(t.stats)}</a><a href="${localizedUrl(lang, "figglizPrivacy")}">${esc(t.privacy)}</a><a href="${localizedUrl(lang, "figglizTerms")}">${esc(t.terms)}</a></div></div></div></div><a class="nav-link" href="${localizedUrl(lang, "contact")}">${esc(t.contact)}</a>${languageMenu(lang, pageKey, t.languageLabel)}</nav></div></header>`;
}

function footer(lang) {
  const t = pack(lang);
  return `<footer class="site-footer"><div class="footer-inner"><span>ArcaWand Soft</span><div class="footer-links"><a href="${localizedUrl(lang, "home")}">${esc(t.navHome)}</a><a href="${localizedUrl(lang, "privacy")}">${esc(t.privacy)}</a><a href="${localizedUrl(lang, "contact")}">${esc(t.contact)}</a></div></div></footer>`;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function renderHome(lang) {
  const t = pack(lang);
  return pageShell({
    lang,
    pageKey: "home",
    title: t.siteTitle,
    desc: t.siteDesc,
    image: productImages.site,
    body: `<div class="site-shell">${nav(lang, "home")}<main><section class="section hero"><div><h1>${esc(t.heroTitle)}</h1><p class="lead">${esc(t.heroLead)}</p><div class="hero-actions"><a class="btn btn-primary" href="${localizedUrl(lang, "ucp")}">${esc(t.ctaProduct)}</a><a class="btn btn-ghost" href="${localizedUrl(lang, "contact")}">${esc(t.contact)}</a></div></div><div class="hero-visual" aria-hidden="true"><div class="product-orbit"><img src="/assets/Ultimate_Clipboard_Pro_poster_1600.webp" alt="" width="1600" height="900" loading="eager" decoding="async"></div></div></section><section class="section"><div class="section-heading"><span class="eyebrow">ArcaWand Soft</span><h2>${esc(t.philosophyTitle)}</h2><p>${esc(t.philosophyLead)}</p></div><div class="grid-cards"><article class="card"><h3>Ultimate Clipboard Pro</h3><p>${esc(t.ucpDesc)}</p></article><article class="card"><h3>Figgliz</h3><p>${esc(t.figglizDesc)}</p></article><article class="card"><h3>Local-first</h3><p>${esc(t.siteDesc)}</p></article></div></section><section class="section product-feature"><span class="eyebrow">${esc(t.navApps)}</span><article class="product-poster-card"><img src="/assets/Ultimate_Clipboard_Pro_poster.png" alt="Ultimate Clipboard Pro" width="1672" height="941" loading="lazy" decoding="async"></article><div class="product-copy"><h2>Ultimate Clipboard Pro</h2><p class="lead">${esc(t.ucpLead)}</p><ul>${t.ucpBullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul><div class="hero-actions"><a class="btn btn-primary" href="${localizedUrl(lang, "ucp")}">${esc(t.ctaProduct)}</a></div></div><article class="product-poster-card"><img src="/assets/figgliz_image_produit.png" alt="Figgliz" width="1254" height="1254" loading="lazy" decoding="async"></article><div class="product-copy"><h2>Figgliz</h2><p class="lead">${esc(t.figglizLead)}</p><ul>${t.figglizBullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul><div class="hero-actions"><a class="btn btn-primary" href="${localizedUrl(lang, "figgliz")}">${esc(t.ctaProduct)}</a><a class="btn btn-ghost" href="https://checkout.dodopayments.com/buy/pdt_0NfoqxYzfXACDIlJJFR63?quantity=1">${esc(t.ctaLaunch)}</a></div></div></section></main>${footer(lang)}</div>`
  });
}

function renderSimpleSitePage(lang, pageKey) {
  const t = pack(lang);
  const title = pageKey === "contact" ? t.contactTitle : t.sitePrivacyTitle;
  const lead = pageKey === "contact" ? t.contactLead : t.sitePrivacyLead;
  const bodyText = pageKey === "contact" ? t.contactBody : `${t.sitePrivacyLead} ArcaWand Soft does not require a visitor account on this public website. Product-specific privacy details are available on each product page.`;
  return pageShell({
    lang,
    pageKey,
    title,
    desc: lead,
    image: productImages.site,
    body: `<div class="site-shell">${nav(lang, pageKey, 1)}<main><section class="section"><div class="section-heading"><span class="eyebrow">ArcaWand Soft</span><h1>${esc(title)}</h1><p>${esc(lead)}</p></div><div class="grid-cards"><article class="card"><h2>${esc(title)}</h2><p>${esc(bodyText)}</p><p><a class="btn btn-primary" href="mailto:contact@arcawand-soft.com">contact@arcawand-soft.com</a></p></article></div></section></main>${footer(lang)}</div>`
  });
}

function productNav(lang, active, product) {
  const t = pack(lang);
  const keys = product === "ucp"
    ? [["ucp", t.presentation], ["ucpDemo", t.demo], ["ucpFaq", t.faq], ["ucpPrivacy", t.privacy], ["ucpTerms", t.terms]]
    : [["figgliz", t.presentation], ["figglizFaq", t.faq], ["figglizStats", t.stats], ["figglizPrivacy", t.privacy], ["figglizTerms", t.terms]];
  return `<nav class="ucp-product-nav" aria-label="${product === "ucp" ? "Ultimate Clipboard Pro" : "Figgliz"}">${keys.map(([key, label]) => `<a href="${localizedUrl(lang, key)}"${key === active ? ' aria-current="page"' : ""}>${esc(label)}</a>`).join("")}</nav>`;
}

function productShell(lang, pageKey, product, title, desc, main) {
  const t = pack(lang);
  const productName = product === "ucp" ? "Ultimate Clipboard Pro" : "Figgliz";
  const icon = product === "ucp" ? "/assets/ultimate_clipboard_pro_icon_96.webp" : "/assets/figgliz/icon.webp";
  const css = `<link rel="stylesheet" href="/assets/ucp-product-pages.css?v=20260620-languages">${product === "figgliz" ? '\n<link rel="stylesheet" href="/assets/figgliz-product.css?v=20260620-languages">' : ""}`;
  const script = product === "ucp" ? "/assets/ucp-product-pages.js?v=20260620-languages" : "/assets/figgliz-product-pages.js?v=20260620-languages";
  const active = pageKey;
  return pageShell({
    lang,
    pageKey,
    title,
    desc,
    image: product === "ucp" ? productImages.ucp : productImages.figgliz,
    productName,
    css,
    scripts: `<script defer src="/assets/analytics.js"></script>\n<script defer src="${script}"></script>`,
    bodyClass: `ucp-static-page ${product === "figgliz" ? "figgliz-static-page" : ""}`,
    body: `<a class="arcawand-root-return" href="${localizedUrl(lang, "home")}" aria-label="ArcaWand Soft">&larr; ArcaWand Soft</a><div class="ucp-product-mark"><img src="${icon}" alt="" width="48" height="48" decoding="async"><span class="ucp-product-title">${productName}</span></div>${languageMenu(lang, pageKey, t.languageLabel)}${productNav(lang, active, product)}<main class="ucp-static-main"><section class="ucp-static-hero"><span class="ucp-static-kicker">${esc(productName)}</span><h1>${esc(title)}</h1><p>${esc(desc)}</p></section>${main}</main><footer class="ucp-static-footer"><span>ArcaWand Soft</span><span><a href="mailto:contact@arcawand-soft.com">contact@arcawand-soft.com</a></span></footer>`
  });
}

function renderUcp(lang, page) {
  const t = pack(lang);
  if (page === "ucp") {
    return productShell(lang, page, "ucp", t.ucpHero, t.ucpLead, `<section class="ucp-page-grid"><div><article class="ucp-page-content"><img src="/assets/Ultimate_Clipboard_Pro_poster.png" alt="Ultimate Clipboard Pro" width="1672" height="941" loading="eager" decoding="async"><h2>${esc(t.ucpTitle)}</h2><ul>${t.ucpBullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul><button class="ucp-demo-install-cta" type="button">${esc(t.ctaInstall)}</button></article></div></section>`);
  }
  if (page === "ucpDemo") {
    return productShell(lang, page, "ucp", `${t.demo} Ultimate Clipboard Pro`, `${t.demo}: ${t.ucpLead}`, `<section class="ucp-demo-intro"><article><h2>${esc(t.demo)}</h2><p>${esc(t.ucpLead)}</p><ul>${t.ucpBullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul><button class="ucp-demo-install-cta" type="button">${esc(t.ctaInstall)}</button></article></section><div class="ucp-demo-root" data-ucp-demo-lang="${lang}"></div><script defer src="/assets/ucp-demo.js?v=20260516-card-view-compact"></script>`);
  }
  const data = page === "ucpFaq" ? t.ucpFaq : page === "ucpPrivacy" ? t.ucpPrivacy : t.ucpTerms;
  const label = page === "ucpFaq" ? t.faq : page === "ucpPrivacy" ? t.privacy : t.terms;
  return productShell(lang, page, "ucp", `${label} Ultimate Clipboard Pro`, `${label} - ${t.ucpLead}`, `<section class="ucp-page-grid"><div class="ucp-faq-list">${data.map(([h, p]) => `<article class="ucp-faq-item"><h2>${esc(h)}</h2><p>${esc(p)}</p></article>`).join("")}</div></section>`);
}

function renderFiggliz(lang, page) {
  const t = pack(lang);
  if (page === "figgliz") {
    return productShell(lang, page, "figgliz", t.figglizHero, t.figglizLead, `<section class="figgliz-section"><figure class="figgliz-product-image"><img src="/assets/figgliz_image_produit.png" alt="Figgliz" width="1254" height="1254" loading="eager" decoding="async"></figure><div class="figgliz-card-grid">${t.figglizBullets.map((item) => `<article class="figgliz-card"><h3>${esc(item)}</h3><p>${esc(t.figglizLead)}</p></article>`).join("")}</div></section>`);
  }
  if (page === "figglizStats") {
    const labels = ["Chess", "Checkers", "Connect 4", "Ping Pong", "Flappy Duo", "Air Hockey"];
    return productShell(lang, page, "figgliz", `${t.stats} Figgliz`, `${t.stats} - ${t.figglizLead}`, `<section class="figgliz-section figgliz-stats-page" data-figgliz-stats data-stats-endpoint="https://figgliz.arcawand-soft.com/stats.json" data-lang="${lang}"><div class="figgliz-stats-grid figgliz-stats-totals"><article class="figgliz-stat-card figgliz-stat-card-total"><img src="/assets/figgliz/icon.webp" alt="" width="86" height="86"><div><p>Discussions</p><strong data-figgliz-stat="discussions">--</strong></div></article><article class="figgliz-stat-card figgliz-stat-card-total"><img src="/assets/figgliz/webcam.webp" alt="" width="86" height="86"><div><p>Webcam</p><strong data-figgliz-stat="videoSessions">--</strong></div></article><article class="figgliz-stat-card figgliz-stat-card-total"><img src="/assets/figgliz/games.webp" alt="" width="86" height="86"><div><p>${esc(t.stats)}</p><strong data-figgliz-stat="gamesPlayed">--</strong></div></article></div><div class="figgliz-stats-grid figgliz-stats-games">${["chess","checkers","connect4","pingpong","doublesnake","airhockey"].map((key, index) => `<article class="figgliz-stat-card figgliz-stat-card-game"><p>${labels[index]}</p><strong data-figgliz-stat="${key}">--</strong></article>`).join("")}</div><article class="figgliz-stat-record-card" data-figgliz-flappy-record><div class="figgliz-stat-record-copy"><p>Live record</p><h2>Flappy Duo</h2><dl><div><dt>Distance</dt><dd data-figgliz-record-distance>--</dd></div><div><dt>Player</dt><dd data-figgliz-record-nickname>--</dd></div></dl></div></article></section>`);
  }
  const data = page === "figglizFaq" ? t.figglizFaq : page === "figglizPrivacy" ? t.figglizPrivacy : t.figglizTerms;
  const label = page === "figglizFaq" ? t.faq : page === "figglizPrivacy" ? t.privacy : t.terms;
  return productShell(lang, page, "figgliz", `${label} Figgliz`, `${label} - ${t.figglizLead}`, `<section class="ucp-page-grid"><div class="ucp-faq-list">${data.map(([h, p]) => `<article class="ucp-faq-item"><h2>${esc(h)}</h2><p>${esc(p)}</p></article>`).join("")}</div></section>`);
}

function findMatchingDiv(content, start) {
  const tagRegex = /<\/?div\b[^>]*>/gi;
  tagRegex.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagRegex.exec(content))) {
    if (match[0].startsWith("</")) depth -= 1;
    else depth += 1;
    if (depth === 0) return tagRegex.lastIndex;
  }
  return -1;
}

function replaceLanguageMenu(content, lang, pageKey) {
  const start = content.indexOf('<div class="language-menu');
  if (start === -1) return content;
  const end = findMatchingDiv(content, start);
  if (end === -1) return content;
  return `${content.slice(0, start)}${languageMenu(lang, pageKey, pack(lang).languageLabel)}${content.slice(end)}`;
}

function replaceAlternates(content, pageKey) {
  const canonicalMatch = content.match(/<link rel="canonical" href="[^"]+">\s*/);
  if (!canonicalMatch) return content;
  const start = canonicalMatch.index + canonicalMatch[0].length;
  const after = content.slice(start);
  const endMatch = after.match(/(?:<link rel="alternate"[^>]+>\s*)+/);
  const end = endMatch && endMatch.index === 0 ? start + endMatch[0].length : start;
  const alternates = `${LANGUAGES.map((language) => `<link rel="alternate" hreflang="${language.code}" href="${localizedUrl(language.code, pageKey)}">`).join("\n")}\n<link rel="alternate" hreflang="x-default" href="${localizedUrl("en", pageKey)}">\n`;
  return `${content.slice(0, start)}${alternates}${content.slice(end)}`;
}

function patchExistingPage(lang, pageKey) {
  const relPath = localizedPath(lang, pageKey);
  const file = path.join(root, relPath, "index.html");
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, "utf8");
  content = replaceLanguageMenu(content, lang, pageKey);
  content = replaceAlternates(content, pageKey);
  content = content.replace(/<link rel="stylesheet" href="\/assets\/site\.css(?:\?[^"]*)?">/g, '<link rel="stylesheet" href="/assets/site.css?v=20260620-languages">');
  content = content.replace(/<script defer src="\/assets\/site\.js(?:\?[^"]*)?"><\/script>/g, '<script defer src="/assets/site.js?v=20260620-languages"></script>');
  content = content.replace(/<script defer src="\/assets\/ucp-product-pages\.js(?:\?[^"]*)?"><\/script>/g, '<script defer src="/assets/ucp-product-pages.js?v=20260620-languages"></script>');
  content = content.replace(/<script defer src="\/assets\/figgliz-product-pages\.js(?:\?[^"]*)?"><\/script>/g, '<script defer src="/assets/figgliz-product-pages.js?v=20260620-languages"></script>');
  fs.writeFileSync(file, content, "utf8");
}

function patchRootRedirect() {
  const file = path.join(root, "index.html");
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(/const supported = new Set\(\[[^\]]+\]\);/, 'const supported = new Set(["fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"]);');
  fs.writeFileSync(file, content, "utf8");
}

function writeGeneratedPages() {
  for (const lang of generatedLanguages) {
    write(path.join(root, localizedPath(lang, "home"), "index.html"), renderHome(lang));
    write(path.join(root, localizedPath(lang, "contact"), "index.html"), renderSimpleSitePage(lang, "contact"));
    write(path.join(root, localizedPath(lang, "privacy"), "index.html"), renderSimpleSitePage(lang, "privacy"));
    for (const page of ["ucp", "ucpDemo", "ucpFaq", "ucpPrivacy", "ucpTerms"]) {
      write(path.join(root, localizedPath(lang, page), "index.html"), renderUcp(lang, page));
    }
    for (const page of ["figgliz", "figglizFaq", "figglizStats", "figglizPrivacy", "figglizTerms"]) {
      write(path.join(root, localizedPath(lang, page), "index.html"), renderFiggliz(lang, page));
    }
  }
}

function patchAllMenusAndSeo() {
  const pageKeys = ["home", "contact", "privacy", "ucp", "ucpDemo", "ucpFaq", "ucpPrivacy", "ucpTerms", "figgliz", "figglizFaq", "figglizStats", "figglizPrivacy", "figglizTerms"];
  for (const language of LANGUAGES) {
    for (const pageKey of pageKeys) patchExistingPage(language.code, pageKey);
  }
}

function writeSitemap() {
  const pageKeys = ["home", "contact", "privacy", "ucp", "ucpDemo", "ucpFaq", "ucpPrivacy", "ucpTerms", "figgliz", "figglizFaq", "figglizStats", "figglizPrivacy", "figglizTerms"];
  const rows = [];
  for (const pageKey of pageKeys) {
    for (const language of LANGUAGES) {
      const priority = pageKey === "home" ? "1.0" : pageKey === "ucp" || pageKey === "figgliz" ? "0.9" : "0.7";
      rows.push(`  <url>
    <loc>${localizedUrl(language.code, pageKey)}</loc>
${LANGUAGES.map((item) => `    <xhtml:link rel="alternate" hreflang="${item.code}" href="${localizedUrl(item.code, pageKey)}"/>`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl("en", pageKey)}"/>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }
  }
  fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join("\n")}\n</urlset>\n`, "utf8");
}

writeGeneratedPages();
patchAllMenusAndSeo();
patchRootRedirect();
writeSitemap();
