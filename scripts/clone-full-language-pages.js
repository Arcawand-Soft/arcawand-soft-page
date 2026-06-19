const fs = require("fs");
const path = require("path");
const { LANGUAGES, languageByCode, languageMenu, localizedPath, localizedUrl } = require("./language-config");

const root = path.resolve(__dirname, "..");
const baseLanguages = new Set(["en", "fr", "es", "it", "de"]);
const targetLanguages = LANGUAGES.filter((language) => !baseLanguages.has(language.code));

const pageKeys = [
  "home",
  "contact",
  "privacy",
  "ucp",
  "ucpDemo",
  "ucpFaq",
  "ucpPrivacy",
  "ucpTerms",
  "figgliz",
  "figglizFaq",
  "figglizStats",
  "figglizPrivacy",
  "figglizTerms"
];

const sourcePaths = {
  home: "index.html",
  contact: "contact/index.html",
  privacy: "privacy/index.html",
  ucp: "ultimate-clipboard-pro/index.html",
  ucpDemo: "ultimate-clipboard-pro/demo/index.html",
  ucpFaq: "ultimate-clipboard-pro/faq/index.html",
  ucpPrivacy: "ultimate-clipboard-pro/privacy/index.html",
  ucpTerms: "ultimate-clipboard-pro/terms/index.html",
  figgliz: "figgliz/index.html",
  figglizFaq: "figgliz/faq/index.html",
  figglizStats: "figgliz/stats/index.html",
  figglizPrivacy: "figgliz/privacy/index.html",
  figglizTerms: "figgliz/terms/index.html"
};

const seo = {
  ro: {
    languageLabel: "Schimbă limba",
    home: ["ArcaWand Soft - aplicații originale, sigure și puternice", "ArcaWand Soft creează extensii Chrome premium pentru productivitate, conversații private, divertisment și control zilnic."],
    contact: ["Contact ArcaWand Soft", "Contactează dezvoltatorul ArcaWand Soft pentru suport, întrebări tehnice, idei de produs sau parteneriate."],
    privacy: ["Politica de confidențialitate ArcaWand Soft", "Cum gestionează site-ul ArcaWand Soft datele tehnice, mesajele de contact, serviciile externe și drepturile utilizatorilor."],
    ucp: ["Ultimate Clipboard Pro - manager clipboard avansat pentru Chrome", "Capturează, organizează, caută și reutilizează texte, coduri, imagini, capturi de ecran și pagini web într-un spațiu Chrome local-first."],
    ucpDemo: ["Demo Ultimate Clipboard Pro", "Explorează vizual interfața Ultimate Clipboard Pro, cu texte, coduri, imagini, categorii și căutare într-o demonstrație web."],
    ucpFaq: ["FAQ Ultimate Clipboard Pro", "Răspunsuri despre Ultimate Clipboard Pro, capturi, confidențialitate, versiuni, Drive, backup, Pro și utilizarea zilnică."],
    ucpPrivacy: ["Politica de confidențialitate Ultimate Clipboard Pro", "Detalii despre datele locale, sincronizarea opțională Google Drive, licențe, plăți și controlul utilizatorului în Ultimate Clipboard Pro."],
    ucpTerms: ["Termeni de utilizare Ultimate Clipboard Pro", "Condițiile de utilizare pentru Ultimate Clipboard Pro, licența Pro, responsabilități, backup, sincronizare și servicii opționale."],
    figgliz: ["Figgliz - conversații aleatorii private pentru Chrome", "Figgliz este o extensie Chrome pentru conversații private aleatorii, note vocale, webcam opțional și jocuri rapide, fără profil public."],
    figglizFaq: ["FAQ Figgliz", "Răspunsuri despre conversații aleatorii private, siguranță, webcam, jocuri, abonamente Plus și Pro și statistici Figgliz."],
    figglizStats: ["Statistici Figgliz", "Statistici publice anonime pentru Figgliz: conversații, sesiuni webcam, jocuri și recorduri, fără date private."],
    figglizPrivacy: ["Politica de confidențialitate Figgliz", "Cum protejează Figgliz conversațiile private, consimțământul webcam, datele serverului VPS și statisticile anonime."],
    figglizTerms: ["Termeni de utilizare Figgliz", "Condițiile Figgliz pentru conversații private, jocuri, siguranță, beta, abonamente Plus și Pro și utilizare acceptabilă."]
  },
  pt: {
    languageLabel: "Alterar idioma",
    home: ["ArcaWand Soft - apps originais, seguras e poderosas", "A ArcaWand Soft cria extensões Chrome premium para produtividade, conversas privadas, diversão e controle diário."],
    contact: ["Contato ArcaWand Soft", "Fale com o desenvolvedor da ArcaWand Soft para suporte, perguntas técnicas, ideias de produto ou parcerias."],
    privacy: ["Política de privacidade ArcaWand Soft", "Como o site ArcaWand Soft trata dados técnicos, mensagens de contato, serviços externos e direitos do usuário."],
    ucp: ["Ultimate Clipboard Pro - gerenciador avançado de clipboard para Chrome", "Capture, organize, pesquise e reutilize textos, códigos, imagens, screenshots e páginas web em um espaço Chrome local-first."],
    ucpDemo: ["Demo Ultimate Clipboard Pro", "Explore visualmente a interface do Ultimate Clipboard Pro com textos, códigos, imagens, categorias e busca em uma demonstração web."],
    ucpFaq: ["FAQ Ultimate Clipboard Pro", "Respostas sobre capturas, privacidade, versões, Drive, backup, Pro e uso diário do Ultimate Clipboard Pro."],
    ucpPrivacy: ["Política de privacidade Ultimate Clipboard Pro", "Detalhes sobre dados locais, sincronização opcional com Google Drive, licenças, pagamentos e controle do usuário."],
    ucpTerms: ["Termos de uso Ultimate Clipboard Pro", "Termos para Ultimate Clipboard Pro, licença Pro, responsabilidades, backup, sincronização e serviços opcionais."],
    figgliz: ["Figgliz - conversas aleatórias privadas para Chrome", "Figgliz é uma extensão Chrome para conversas aleatórias privadas, notas de voz, webcam opcional e jogos rápidos, sem perfil público."],
    figglizFaq: ["FAQ Figgliz", "Respostas sobre conversas privadas, segurança, webcam, jogos, planos Plus e Pro e estatísticas Figgliz."],
    figglizStats: ["Estatísticas Figgliz", "Estatísticas públicas anônimas do Figgliz: conversas, webcam, jogos e recordes, sem dados privados."],
    figglizPrivacy: ["Política de privacidade Figgliz", "Como o Figgliz protege conversas privadas, consentimento de webcam, dados no VPS e estatísticas anônimas."],
    figglizTerms: ["Termos de uso Figgliz", "Termos do Figgliz para conversas privadas, jogos, segurança, beta, planos Plus e Pro e uso aceitável."]
  },
  ar: {
    languageLabel: "تغيير اللغة",
    home: ["ArcaWand Soft - تطبيقات أصلية وآمنة وقوية", "تطوّر ArcaWand Soft إضافات Chrome مميزة للإنتاجية والمحادثات الخاصة والترفيه والتحكم اليومي."],
    contact: ["اتصل بـ ArcaWand Soft", "تواصل مع مطوّر ArcaWand Soft للدعم أو الأسئلة التقنية أو أفكار المنتجات أو الشراكات."],
    privacy: ["سياسة خصوصية ArcaWand Soft", "كيف يتعامل موقع ArcaWand Soft مع البيانات التقنية ورسائل الاتصال والخدمات الخارجية وحقوق المستخدم."],
    ucp: ["Ultimate Clipboard Pro - مدير حافظة متقدم لـ Chrome", "التقط ونظّم وابحث وأعد استخدام النصوص والأكواد والصور ولقطات الشاشة وصفحات الويب في مساحة Chrome محلية أولاً."],
    ucpDemo: ["عرض Ultimate Clipboard Pro", "استكشف واجهة Ultimate Clipboard Pro بصرياً مع نصوص وأكواد وصور وفئات وبحث في عرض ويب."],
    ucpFaq: ["أسئلة Ultimate Clipboard Pro", "إجابات حول الالتقاط والخصوصية والإصدارات وDrive والنسخ الاحتياطي وPro والاستخدام اليومي."],
    ucpPrivacy: ["سياسة خصوصية Ultimate Clipboard Pro", "تفاصيل حول البيانات المحلية ومزامنة Google Drive الاختيارية والتراخيص والمدفوعات وتحكم المستخدم."],
    ucpTerms: ["شروط استخدام Ultimate Clipboard Pro", "شروط Ultimate Clipboard Pro والترخيص Pro والمسؤوليات والنسخ الاحتياطي والمزامنة والخدمات الاختيارية."],
    figgliz: ["Figgliz - محادثات عشوائية خاصة لـ Chrome", "Figgliz إضافة Chrome للمحادثات العشوائية الخاصة والرسائل الصوتية القصيرة والكاميرا الاختيارية والألعاب السريعة بدون ملف عام."],
    figglizFaq: ["أسئلة Figgliz", "إجابات حول المحادثات الخاصة والسلامة والكاميرا والألعاب وخطط Plus وPro وإحصاءات Figgliz."],
    figglizStats: ["إحصاءات Figgliz", "إحصاءات عامة مجهولة لـ Figgliz: المحادثات والكاميرا والألعاب والأرقام القياسية بدون بيانات خاصة."],
    figglizPrivacy: ["سياسة خصوصية Figgliz", "كيف يحمي Figgliz المحادثات الخاصة وموافقة الكاميرا وبيانات الخادم وإحصاءات مجهولة."],
    figglizTerms: ["شروط استخدام Figgliz", "شروط Figgliz للمحادثات الخاصة والألعاب والسلامة والنسخة التجريبية وخطط Plus وPro والاستخدام المقبول."]
  }
};

const fallbackSeo = {
  zh: {
    languageLabel: "更改语言",
    home: ["ArcaWand Soft - 原创、安全、强大的应用", "ArcaWand Soft 打造优质 Chrome 扩展，服务于效率、私密交流、娱乐和日常掌控。"],
    contact: ["联系 ArcaWand Soft", "联系 ArcaWand Soft 开发者，获取支持、技术答疑、产品建议或合作信息。"],
    privacy: ["ArcaWand Soft 隐私政策", "了解 ArcaWand Soft 网站如何处理技术数据、联系消息、外部服务和用户权利。"],
    ucp: ["Ultimate Clipboard Pro - Chrome 高级剪贴板管理器", "在 Chrome 中捕获、整理、搜索并复用文本、代码、图片、截图和网页内容。"],
    ucpDemo: ["Ultimate Clipboard Pro 演示", "通过网页演示查看 Ultimate Clipboard Pro 的文本、代码、图片、分类和搜索界面。"],
    ucpFaq: ["Ultimate Clipboard Pro 常见问题", "关于捕获、隐私、版本、Drive、备份、Pro 和日常使用的回答。"],
    ucpPrivacy: ["Ultimate Clipboard Pro 隐私政策", "本地数据、可选 Google Drive 同步、许可、付款和用户控制说明。"],
    ucpTerms: ["Ultimate Clipboard Pro 使用条款", "Ultimate Clipboard Pro、Pro 许可、责任、备份、同步和可选服务条款。"],
    figgliz: ["Figgliz - Chrome 私密随机聊天", "Figgliz 是用于私密随机聊天、短语音、可选摄像头和小游戏的 Chrome 扩展，无公开资料页。"],
    figglizFaq: ["Figgliz 常见问题", "关于私密聊天、安全、摄像头、游戏、Plus 和 Pro 以及统计数据的回答。"],
    figglizStats: ["Figgliz 统计", "Figgliz 的匿名公开统计：聊天、摄像头、游戏和记录，不包含私人数据。"],
    figglizPrivacy: ["Figgliz 隐私政策", "Figgliz 如何保护私密聊天、摄像头同意、VPS 数据和匿名统计。"],
    figglizTerms: ["Figgliz 使用条款", "Figgliz 私密聊天、游戏、安全、测试版、Plus/Pro 和可接受使用条款。"]
  },
  ja: {
    languageLabel: "言語を変更",
    home: ["ArcaWand Soft - 独自性、安全性、パワーを備えたアプリ", "ArcaWand Soft は、生産性、プライベートな休憩、楽しさ、日常の操作性を高める Chrome 拡張を開発しています。"],
    contact: ["ArcaWand Soft に連絡", "サポート、技術的な質問、製品アイデア、提携について開発者に連絡できます。"],
    privacy: ["ArcaWand Soft プライバシーポリシー", "このサイトの技術データ、連絡メッセージ、外部サービス、ユーザー権利の扱いについて。"],
    ucp: ["Ultimate Clipboard Pro - Chrome 用高度クリップボード管理", "テキスト、コード、画像、スクリーンショット、Web ページを Chrome 内で保存、整理、検索、再利用します。"],
    ucpDemo: ["Ultimate Clipboard Pro デモ", "Ultimate Clipboard Pro のテキスト、コード、画像、カテゴリ、検索を Web デモで確認できます。"],
    ucpFaq: ["Ultimate Clipboard Pro FAQ", "キャプチャ、プライバシー、バージョン、Drive、バックアップ、Pro、日常利用に関する回答。"],
    ucpPrivacy: ["Ultimate Clipboard Pro プライバシーポリシー", "ローカルデータ、任意の Google Drive 同期、ライセンス、支払い、ユーザー管理について。"],
    ucpTerms: ["Ultimate Clipboard Pro 利用規約", "Ultimate Clipboard Pro、Pro ライセンス、責任、バックアップ、同期、任意サービスの条件。"],
    figgliz: ["Figgliz - Chrome のプライベートランダム会話", "Figgliz は公開プロフィールなしで、テキスト、短い音声、任意の webcam、ゲームを楽しめる Chrome 拡張です。"],
    figglizFaq: ["Figgliz FAQ", "プライベート会話、安全性、webcam、ゲーム、Plus/Pro、統計に関する回答。"],
    figglizStats: ["Figgliz 統計", "Figgliz の匿名集計統計。会話、webcam、ゲーム、記録を表示し、個人データは表示しません。"],
    figglizPrivacy: ["Figgliz プライバシーポリシー", "Figgliz のプライベート会話、webcam 同意、VPS データ、匿名統計の保護について。"],
    figglizTerms: ["Figgliz 利用規約", "Figgliz の会話、ゲーム、安全、ベータ、Plus/Pro、許容利用に関する条件。"]
  },
  ru: {
    languageLabel: "Изменить язык",
    home: ["ArcaWand Soft - оригинальные, безопасные и мощные приложения", "ArcaWand Soft создает премиальные расширения Chrome для продуктивности, приватного общения, отдыха и контроля."],
    contact: ["Связаться с ArcaWand Soft", "Напишите разработчику ArcaWand Soft по вопросам поддержки, технических деталей, идей продукта или партнерства."],
    privacy: ["Политика конфиденциальности ArcaWand Soft", "Как сайт ArcaWand Soft обрабатывает технические данные, сообщения, внешние сервисы и права пользователей."],
    ucp: ["Ultimate Clipboard Pro - продвинутый менеджер буфера обмена для Chrome", "Сохраняйте, организуйте, ищите и повторно используйте текст, код, изображения, скриншоты и веб-страницы в Chrome."],
    ucpDemo: ["Демо Ultimate Clipboard Pro", "Посмотрите интерфейс Ultimate Clipboard Pro с текстами, кодом, изображениями, категориями и поиском."],
    ucpFaq: ["FAQ Ultimate Clipboard Pro", "Ответы о захвате данных, приватности, версиях, Drive, резервных копиях, Pro и ежедневном использовании."],
    ucpPrivacy: ["Политика конфиденциальности Ultimate Clipboard Pro", "Локальные данные, опциональная синхронизация Google Drive, лицензии, платежи и пользовательский контроль."],
    ucpTerms: ["Условия использования Ultimate Clipboard Pro", "Условия Ultimate Clipboard Pro, лицензии Pro, ответственности, резервных копий, синхронизации и опциональных сервисов."],
    figgliz: ["Figgliz - приватные случайные беседы для Chrome", "Figgliz - расширение Chrome для приватных случайных бесед, коротких голосовых, optional webcam и быстрых игр без публичного профиля."],
    figglizFaq: ["FAQ Figgliz", "Ответы о приватных беседах, безопасности, webcam, играх, планах Plus и Pro и статистике Figgliz."],
    figglizStats: ["Статистика Figgliz", "Анонимная публичная статистика Figgliz: беседы, webcam, игры и рекорды без частных данных."],
    figglizPrivacy: ["Политика конфиденциальности Figgliz", "Как Figgliz защищает приватные беседы, согласие на webcam, данные VPS и анонимную статистику."],
    figglizTerms: ["Условия использования Figgliz", "Условия Figgliz для приватных бесед, игр, безопасности, беты, Plus/Pro и допустимого использования."]
  },
  nl: {
    languageLabel: "Taal wijzigen",
    home: ["ArcaWand Soft - originele, veilige en krachtige apps", "ArcaWand Soft bouwt premium Chrome-extensies voor productiviteit, privégesprekken, plezier en dagelijkse controle."],
    contact: ["Contact ArcaWand Soft", "Neem contact op met de ontwikkelaar van ArcaWand Soft voor support, technische vragen, productideeën of samenwerking."],
    privacy: ["Privacybeleid ArcaWand Soft", "Hoe de ArcaWand Soft website technische gegevens, contactberichten, externe diensten en gebruikersrechten behandelt."],
    ucp: ["Ultimate Clipboard Pro - geavanceerde klembordmanager voor Chrome", "Leg tekst, code, afbeeldingen, screenshots en webpagina's vast, organiseer ze en vind ze terug in Chrome."],
    ucpDemo: ["Demo Ultimate Clipboard Pro", "Bekijk de interface van Ultimate Clipboard Pro met tekst, code, afbeeldingen, categorieën en zoeken."],
    ucpFaq: ["FAQ Ultimate Clipboard Pro", "Antwoorden over captures, privacy, versies, Drive, back-up, Pro en dagelijks gebruik."],
    ucpPrivacy: ["Privacybeleid Ultimate Clipboard Pro", "Details over lokale gegevens, optionele Google Drive-sync, licenties, betalingen en gebruikerscontrole."],
    ucpTerms: ["Gebruiksvoorwaarden Ultimate Clipboard Pro", "Voorwaarden voor Ultimate Clipboard Pro, Pro-licentie, verantwoordelijkheid, back-up, sync en optionele diensten."],
    figgliz: ["Figgliz - privé willekeurige gesprekken voor Chrome", "Figgliz is een Chrome-extensie voor privé willekeurige gesprekken, korte voice notes, optionele webcam en snelle games zonder openbaar profiel."],
    figglizFaq: ["FAQ Figgliz", "Antwoorden over privégesprekken, veiligheid, webcam, games, Plus en Pro en Figgliz-statistieken."],
    figglizStats: ["Figgliz-statistieken", "Anonieme publieke Figgliz-statistieken: gesprekken, webcam, games en records zonder privégegevens."],
    figglizPrivacy: ["Privacybeleid Figgliz", "Hoe Figgliz privégesprekken, webcamtoestemming, VPS-data en anonieme statistieken beschermt."],
    figglizTerms: ["Gebruiksvoorwaarden Figgliz", "Voorwaarden voor Figgliz, privégesprekken, games, veiligheid, beta, Plus/Pro en acceptabel gebruik."]
  }
};

function buildGenericSeo(code) {
  const language = languageByCode(code);
  const name = language.name;
  return {
    languageLabel: "Change language",
    home: [`ArcaWand Soft - original secure apps in ${name}`, `ArcaWand Soft builds premium Chrome extensions for productivity, private conversations, games and everyday control in ${name}.`],
    contact: [`Contact ArcaWand Soft - ${name}`, `Contact ArcaWand Soft for product support, technical questions, product ideas and partnerships in ${name}.`],
    privacy: [`ArcaWand Soft privacy policy - ${name}`, `How the ArcaWand Soft website handles technical data, contact messages, external services and user rights in ${name}.`],
    ucp: [`Ultimate Clipboard Pro for Chrome - ${name}`, `Capture, organize, search and reuse text, code, images, screenshots and web pages with Ultimate Clipboard Pro in ${name}.`],
    ucpDemo: [`Ultimate Clipboard Pro demo - ${name}`, `Explore the Ultimate Clipboard Pro visual demo with text, code, images, categories and search in ${name}.`],
    ucpFaq: [`Ultimate Clipboard Pro FAQ - ${name}`, `Answers about Ultimate Clipboard Pro captures, privacy, versions, Drive sync, backup, Pro and daily workflows in ${name}.`],
    ucpPrivacy: [`Ultimate Clipboard Pro privacy policy - ${name}`, `Privacy details for Ultimate Clipboard Pro local data, optional Drive sync, licensing, payments and user controls in ${name}.`],
    ucpTerms: [`Ultimate Clipboard Pro terms of use - ${name}`, `Terms for Ultimate Clipboard Pro, Pro license, backup, sync, optional services and user responsibilities in ${name}.`],
    figgliz: [`Figgliz for Chrome - ${name}`, `Private random conversations, voice notes, optional webcam and quick games with Figgliz in ${name}.`],
    figglizFaq: [`Figgliz FAQ - ${name}`, `Answers about Figgliz private conversations, safety, webcam, games, Plus, Pro and statistics in ${name}.`],
    figglizStats: [`Figgliz statistics - ${name}`, `Anonymous public Figgliz statistics for conversations, webcam sessions, games and records in ${name}.`],
    figglizPrivacy: [`Figgliz privacy policy - ${name}`, `Privacy details for Figgliz conversations, webcam consent, VPS server data and anonymous statistics in ${name}.`],
    figglizTerms: [`Figgliz terms of use - ${name}`, `Terms for Figgliz private conversations, games, safety, beta, Plus, Pro and acceptable use in ${name}.`]
  };
}

function pack(code) {
  return seo[code] || fallbackSeo[code] || buildGenericSeo(code);
}

function readSource(pageKey) {
  return fs.readFileSync(path.join(root, sourcePaths[pageKey]), "utf8");
}

function outputFile(code, pageKey) {
  return path.join(root, localizedPath(code, pageKey), "index.html");
}

function depthForPage(code, pageKey) {
  const relative = localizedPath(code, pageKey);
  if (!relative) return 0;
  return relative.split("/").filter(Boolean).length;
}

function rootPrefix(depth) {
  return depth === 0 ? "" : "../".repeat(depth);
}

function rewriteRelativeAssets(content, depth) {
  const prefix = rootPrefix(depth);
  return content
    .replace(/(["'(=])(?:\.\.\/)*assets\//g, `$1${prefix}assets/`)
    .replace(/(["'(=])(?:\.\.\/)*ultimate-clipboard-pro\/assets\//g, `$1${prefix}ultimate-clipboard-pro/assets/`)
    .replace(/(["'(=])(?:\.\.\/)*figgliz\/assets\//g, `$1${prefix}figgliz/assets/`);
}

function replaceTitleAndMeta(content, code, pageKey) {
  const [title, desc] = pack(code)[pageKey];
  const canonical = localizedUrl(code, pageKey);
  return content
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${desc}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${title}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${desc}">`);
}

function replaceCanonicalAndAlternates(content, code, pageKey) {
  const canonical = `<link rel="canonical" href="${localizedUrl(code, pageKey)}">`;
  const alternates = LANGUAGES.map((language) => `<link rel="alternate" hreflang="${language.code}" href="${localizedUrl(language.code, pageKey)}">`).join("\n");
  const xDefault = `<link rel="alternate" hreflang="x-default" href="${localizedUrl("en", pageKey)}">`;
  const replacement = `${canonical}\n${alternates}\n${xDefault}`;
  return content.replace(/<link rel="canonical" href="[^"]+">\s*(?:<link rel="alternate"[^>]+>\s*)+/m, `${replacement}\n`);
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

function replaceLanguageMenu(content, code, pageKey) {
  const start = content.indexOf('<div class="language-menu');
  if (start === -1) return content;
  const end = findMatchingDiv(content, start);
  if (end === -1) return content;
  const menu = languageMenu(code, pageKey, pack(code).languageLabel);
  return `${content.slice(0, start)}${menu}${content.slice(end)}`;
}

function patchLanguageState(content, code) {
  const language = languageByCode(code);
  content = content.replace(/<html lang="[^"]+"(?: dir="rtl")?>/, `<html lang="${language.html}"${language.rtl ? ' dir="rtl"' : ""}>`);
  content = content.replace(/window\.__ARCAWAND_LANG__="[^"]+"/g, `window.__ARCAWAND_LANG__="${code}"`);
  content = content.replace(/localStorage\.setItem\("arcawand-lang","[^"]+"\)/g, `localStorage.setItem("arcawand-lang","${code}")`);
  content = content.replace(/localStorage\.setItem\("ucp-lang","[^"]+"\)/g, `localStorage.setItem("ucp-lang","${code}")`);
  return content;
}

function patchJsonLd(content, code, pageKey) {
  const [title, desc] = pack(code)[pageKey];
  const canonical = localizedUrl(code, pageKey);
  return content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => {
    const data = {
      "@context": "https://schema.org",
      "@type": pageKey.includes("Faq") ? "FAQPage" : "WebPage",
      name: title,
      description: desc,
      url: canonical,
      inLanguage: languageByCode(code).html,
      publisher: {
        "@type": "Organization",
        name: "ArcaWand Soft",
        url: "https://arcawand-soft.com/"
      }
    };
    return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
  });
}

function normalizeTextFile(content) {
  return `${content.replace(/[ \t]+$/gm, "").replace(/\s+$/g, "")}\n`;
}

function clonePage(code, pageKey) {
  const depth = depthForPage(code, pageKey);
  let content = readSource(pageKey);
  content = rewriteRelativeAssets(content, depth);
  content = patchLanguageState(content, code);
  content = replaceTitleAndMeta(content, code, pageKey);
  content = replaceCanonicalAndAlternates(content, code, pageKey);
  content = replaceLanguageMenu(content, code, pageKey);
  content = patchJsonLd(content, code, pageKey);
  content = normalizeTextFile(content);
  const file = outputFile(code, pageKey);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function patchExistingPage(code, pageKey) {
  const file = outputFile(code, pageKey);
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, "utf8");
  content = replaceCanonicalAndAlternates(content, code, pageKey);
  content = replaceLanguageMenu(content, code, pageKey);
  content = patchLanguageState(content, code);
  content = normalizeTextFile(content);
  fs.writeFileSync(file, content, "utf8");
}

function writeSitemap() {
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
  fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${rows.join("\n")}
</urlset>
`, "utf8");
}

for (const language of targetLanguages) {
  for (const pageKey of pageKeys) clonePage(language.code, pageKey);
}

for (const language of LANGUAGES) {
  for (const pageKey of pageKeys) patchExistingPage(language.code, pageKey);
}

writeSitemap();
