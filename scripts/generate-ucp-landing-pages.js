const fs = require("fs");
const path = require("path");
const { LANGUAGES, languageMenu, localizedUrl } = require("./language-config");
const locales = require("./ucp-landing-locales.json");
const legalContent = require("./ucp-legal-content.json");
const { salesNavLabel } = require("./ucp-legal-nav-labels");

const root = path.resolve(__dirname, "..");
const version = "20260822-product-refresh";
const socialImage = "https://arcawand-soft.com/assets/Ultimate_Clipboard_Pro_SEO_Image.png";

const languageShowcaseTranslations = {
  en: { eyebrow: "Available worldwide", label: "interface languages", description: "Use Ultimate Clipboard Pro in the language that fits your workflow." },
  fr: { eyebrow: "Pensé pour tous les utilisateurs", label: "langues d’interface", description: "Utilisez Ultimate Clipboard Pro dans la langue qui correspond à votre façon de travailler." },
  es: { eyebrow: "Diseñado para todos", label: "idiomas de interfaz", description: "Usa Ultimate Clipboard Pro en el idioma que mejor se adapte a tu forma de trabajar." },
  it: { eyebrow: "Pensato per tutti", label: "lingue dell’interfaccia", description: "Usa Ultimate Clipboard Pro nella lingua più adatta al tuo modo di lavorare." },
  de: { eyebrow: "Für internationale Workflows", label: "Oberflächensprachen", description: "Nutze Ultimate Clipboard Pro in der Sprache, die zu deinem Arbeitsablauf passt." },
  ro: { eyebrow: "Creat pentru utilizatori din întreaga lume", label: "limbi pentru interfață", description: "Folosește Ultimate Clipboard Pro în limba potrivită modului tău de lucru." },
  pt: { eyebrow: "Criado para utilizadores de todo o mundo", label: "idiomas de interface", description: "Use o Ultimate Clipboard Pro no idioma que melhor se adapta ao seu trabalho." },
  ar: { eyebrow: "مصمم للجميع", label: "لغة للواجهة", description: "استخدم Ultimate Clipboard Pro باللغة التي تناسب طريقة عملك." },
  zh: { eyebrow: "面向全球用户", label: "种界面语言", description: "使用最适合您工作方式的语言操作 Ultimate Clipboard Pro。" },
  ja: { eyebrow: "世界中のユーザーへ", label: "のインターフェース言語", description: "作業スタイルに合った言語で Ultimate Clipboard Pro を利用できます。" },
  ru: { eyebrow: "Для пользователей по всему миру", label: "языков интерфейса", description: "Используйте Ultimate Clipboard Pro на языке, который подходит вашему рабочему процессу." },
  nl: { eyebrow: "Gemaakt voor iedereen", label: "interfacetalen", description: "Gebruik Ultimate Clipboard Pro in de taal die bij jouw manier van werken past." },
  pl: { eyebrow: "Dla użytkowników na całym świecie", label: "języków interfejsu", description: "Korzystaj z Ultimate Clipboard Pro w języku dopasowanym do Twojego sposobu pracy." },
  tr: { eyebrow: "Dünya çapındaki kullanıcılar için", label: "arayüz dili", description: "Ultimate Clipboard Pro’yu çalışma şeklinize uygun dilde kullanın." },
  ko: { eyebrow: "전 세계 사용자를 위해", label: "개 인터페이스 언어", description: "작업 방식에 맞는 언어로 Ultimate Clipboard Pro를 사용하세요." },
  hi: { eyebrow: "दुनिया भर के उपयोगकर्ताओं के लिए", label: "इंटरफ़ेस भाषाएँ", description: "Ultimate Clipboard Pro को अपनी कार्यशैली के अनुकूल भाषा में उपयोग करें।" }
};

const languageFlagImages = {
  en: "/assets/flags/english.webp",
  fr: "/assets/flags/french.webp",
  es: "/assets/flags/spanish.webp",
  it: "/assets/flags/italian.webp",
  de: "/assets/flags/german.webp",
  ro: "/assets/flags/currency/ron.png",
  pt: "/assets/flags/portuguese.svg",
  ar: "/assets/flags/currency/sar.png",
  zh: "/assets/flags/currency/cny.png",
  ja: "/assets/flags/currency/jpy.png",
  ru: "/assets/flags/russian.svg",
  nl: "/assets/flags/dutch.svg",
  pl: "/assets/flags/currency/pln.png",
  tr: "/assets/flags/currency/try.png",
  ko: "/assets/flags/currency/krw.png",
  hi: "/assets/flags/currency/inr.png"
};

const navigationTranslations = {
  ro: { Presentation: "Prezentare", Demo: "Demonstrație", FAQ: "Întrebări frecvente", "Privacy policy": "Politica de confidențialitate", "Terms of use": "Termeni de utilizare" },
  pt: { Presentation: "Apresentação", Demo: "Demonstração", FAQ: "Perguntas frequentes", "Privacy policy": "Política de privacidade", "Terms of use": "Termos de uso" },
  ar: { Presentation: "نظرة عامة", Demo: "عرض توضيحي", FAQ: "الأسئلة الشائعة", "Privacy policy": "سياسة الخصوصية", "Terms of use": "شروط الاستخدام" },
  zh: { Presentation: "产品介绍", Demo: "演示", FAQ: "常见问题", "Privacy policy": "隐私政策", "Terms of use": "使用条款" },
  ja: { Presentation: "製品紹介", Demo: "デモ", FAQ: "よくある質問", "Privacy policy": "プライバシーポリシー", "Terms of use": "利用規約" },
  ru: { Presentation: "Обзор", Demo: "Демо", FAQ: "Вопросы и ответы", "Privacy policy": "Политика конфиденциальности", "Terms of use": "Условия использования" },
  nl: { Presentation: "Presentatie", Demo: "Demo", FAQ: "Veelgestelde vragen", "Privacy policy": "Privacybeleid", "Terms of use": "Gebruiksvoorwaarden" },
  pl: { Presentation: "Prezentacja", Demo: "Demo", FAQ: "Najczęstsze pytania", "Privacy policy": "Polityka prywatności", "Terms of use": "Warunki użytkowania" },
  tr: { Presentation: "Tanıtım", Demo: "Demo", FAQ: "Sık sorulan sorular", "Privacy policy": "Gizlilik politikası", "Terms of use": "Kullanım koşulları" },
  ko: { Presentation: "제품 소개", Demo: "데모", FAQ: "자주 묻는 질문", "Privacy policy": "개인정보 처리방침", "Terms of use": "이용 약관" },
  hi: { Presentation: "परिचय", Demo: "डेमो", FAQ: "अक्सर पूछे जाने वाले प्रश्न", "Privacy policy": "गोपनीयता नीति", "Terms of use": "उपयोग की शर्तें" }
};

const metadataTranslations = {
  ro: {
    title: "Ultimate Clipboard Pro - Manager clipboard avansat pentru Chrome",
    description: "Capturează, organizează, caută și reutilizează texte, cod, imagini, capturi de ecran și pagini web într-un clipboard puternic pentru Chrome."
  },
  pt: {
    title: "Ultimate Clipboard Pro - Gerenciador de área de transferência para Chrome",
    description: "Capture, organize, pesquise e reutilize textos, códigos, imagens, capturas de tela e páginas web em um poderoso espaço de trabalho para Chrome."
  },
  ar: {
    title: "Ultimate Clipboard Pro - مدير الحافظة المتقدم لمتصفح Chrome",
    description: "التقط النصوص والأكواد والصور ولقطات الشاشة وصفحات الويب ونظمها وابحث فيها وأعد استخدامها عبر مساحة حافظة قوية لمتصفح Chrome."
  },
  zh: {
    title: "Ultimate Clipboard Pro - Chrome 高级剪贴板管理器",
    description: "在强大的 Chrome 剪贴板工作区中捕获、整理、搜索并重复使用文本、代码、图片、屏幕截图和网页内容。"
  },
  ja: {
    title: "Ultimate Clipboard Pro - Chrome向け高機能クリップボード管理",
    description: "テキスト、コード、画像、スクリーンショット、Webページを保存・整理・検索し、Chromeの専用ワークスペースからすぐ再利用できます。"
  },
  ru: {
    title: "Ultimate Clipboard Pro - менеджер буфера обмена для Chrome",
    description: "Сохраняйте, систематизируйте, находите и повторно используйте текст, код, изображения, скриншоты и веб-страницы в Chrome."
  },
  nl: {
    title: "Ultimate Clipboard Pro - geavanceerde klembordmanager voor Chrome",
    description: "Leg tekst, code, afbeeldingen, screenshots en webpagina’s vast, organiseer en doorzoek ze en gebruik ze opnieuw in één Chrome-werkruimte."
  },
  pl: {
    title: "Ultimate Clipboard Pro - zaawansowany schowek dla Chrome",
    description: "Przechwytuj, porządkuj, wyszukuj i ponownie wykorzystuj tekst, kod, obrazy, zrzuty ekranu i strony WWW w jednym schowku Chrome."
  },
  tr: {
    title: "Ultimate Clipboard Pro - Chrome için gelişmiş pano yöneticisi",
    description: "Metin, kod, görsel, ekran görüntüsü ve web sayfalarını yakalayın, düzenleyin, arayın ve güçlü bir Chrome çalışma alanında yeniden kullanın."
  },
  ko: {
    title: "Ultimate Clipboard Pro - Chrome용 고급 클립보드 관리자",
    description: "텍스트, 코드, 이미지, 스크린샷과 웹페이지를 캡처하고 정리·검색하여 강력한 Chrome 클립보드 작업 공간에서 다시 사용하세요."
  },
  hi: {
    title: "Ultimate Clipboard Pro - Chrome के लिए उन्नत क्लिपबोर्ड मैनेजर",
    description: "टेक्स्ट, कोड, इमेज, स्क्रीनशॉट और वेब पेज कैप्चर करें, व्यवस्थित करें, खोजें और शक्तिशाली Chrome क्लिपबोर्ड वर्कस्पेस में दोबारा उपयोग करें।"
  }
};

const closingTranslations = {
  ro: {
    "What should I try first after installing?": "Ce ar trebui să încerc mai întâi după instalare?",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "Capturează un text util, un fragment de cod și o imagine. Apoi deschide managerul, adaugă un titlu, clasifică un element, caută după sursă și reutilizează o captură. Acest prim flux arată de ce extensia este mai mult decât un istoric al clipboardului."
  },
  pt: {
    "What should I try first after installing?": "O que devo experimentar primeiro após a instalação?",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "Capture um texto útil, um trecho de código e uma imagem. Depois abra o gerenciador, adicione um título, classifique um item, pesquise pela fonte e reutilize uma captura. Esse primeiro fluxo mostra por que a extensão vai muito além de um histórico da área de transferência."
  },
  ar: {
    "What should I try first after installing?": "ما أول شيء ينبغي تجربته بعد التثبيت؟",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "التقط نصًا مفيدًا ومقطع كود وصورة. ثم افتح المدير، وأضف عنوانًا، وصنّف عنصرًا، وابحث حسب المصدر وأعد استخدام إحدى اللقطات. توضح هذه الجولة الأولى لماذا تتجاوز الإضافة مجرد سجل للحافظة."
  },
  zh: {
    "What should I try first after installing?": "安装后应该先尝试什么？",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "先捕获一段实用文本、一个代码片段和一张图片。然后打开管理器，添加标题、归类项目、按来源搜索并重新使用一条捕获内容。完成这一轮操作，你就会明白它不只是剪贴板历史。"
  },
  ja: {
    "What should I try first after installing?": "インストール後に最初に試すことは？",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "便利なテキスト、コードスニペット、画像を1つずつ保存してみましょう。次に管理画面を開き、タイトルの追加、分類、参照元検索、再利用を試してください。この一連の操作で、単なるクリップボード履歴ではないことが分かります。"
  },
  ru: {
    "What should I try first after installing?": "Что попробовать сразу после установки?",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "Сохраните полезный текст, фрагмент кода и изображение. Затем откройте менеджер, добавьте заголовок, распределите элемент по категории, найдите его по источнику и используйте повторно. Этот первый цикл покажет, почему расширение — больше, чем история буфера обмена."
  },
  nl: {
    "What should I try first after installing?": "Wat kan ik het beste als eerste proberen?",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "Leg een nuttige tekst, een codefragment en een afbeelding vast. Open daarna de manager, voeg een titel toe, classificeer een item, zoek op bron en hergebruik een capture. Die eerste ronde laat zien waarom de extensie veel meer is dan klembordgeschiedenis."
  },
  pl: {
    "What should I try first after installing?": "Co wypróbować jako pierwsze po instalacji?",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "Przechwyć przydatny tekst, fragment kodu i obraz. Następnie otwórz menedżer, dodaj tytuł, przypisz element do kategorii, wyszukaj go według źródła i użyj ponownie. Ten pierwszy cykl pokaże, dlaczego rozszerzenie to coś więcej niż historia schowka."
  },
  tr: {
    "What should I try first after installing?": "Kurulumdan sonra ilk olarak neyi denemeliyim?",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "Kullanışlı bir metin, kod parçası ve görsel yakalayın. Ardından yöneticiyi açın, başlık ekleyin, bir öğeyi sınıflandırın, kaynağa göre arayın ve yakalamayı yeniden kullanın. Bu ilk akış, uzantının pano geçmişinden çok daha fazlası olduğunu gösterir."
  },
  ko: {
    "What should I try first after installing?": "설치 후 가장 먼저 무엇을 해볼까요?",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "유용한 텍스트와 코드 조각, 이미지를 하나씩 캡처해 보세요. 그런 다음 관리자를 열어 제목을 추가하고, 항목을 분류하고, 출처로 검색한 뒤 캡처를 다시 사용해 보세요. 이 첫 흐름만으로 단순한 클립보드 기록 이상의 가치를 확인할 수 있습니다."
  },
  hi: {
    "What should I try first after installing?": "इंस्टॉल करने के बाद सबसे पहले क्या आज़माएँ?",
    "Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history.": "एक उपयोगी टेक्स्ट, कोड स्निपेट और इमेज कैप्चर करें। फिर मैनेजर खोलें, शीर्षक जोड़ें, किसी आइटम को वर्गीकृत करें, स्रोत से खोजें और कैप्चर को दोबारा उपयोग करें। यह पहला प्रवाह दिखाता है कि एक्सटेंशन साधारण क्लिपबोर्ड इतिहास से कहीं अधिक है।"
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageDirectory(language) {
  return path.join(root, language.code === "en" ? "" : language.code, "ultimate-clipboard-pro");
}

function pagePath(language, suffix = "") {
  return language.code === "en" ? `${suffix}` : `/${language.code}${suffix}`;
}

function icon(name) {
  const icons = {
    text: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14M12 5v14M8 19h8"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 9-3 3 3 3m8-6 3 3-3 3m-2-9-4 12"/></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 2-2 5 5"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>',
    source: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 0-9-9m9 9c-2.5-2.4-4-5.4-4-9s1.5-6.6 4-9m0 18c2.5-2.4 4-5.4 4-9s-1.5-6.6-4-9M3 12h18"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.8 2.9 8.3 7 10 4.1-1.7 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>'
  };
  return icons[name] || icons.arrow;
}

function renderLanguageMenu(language, copy) {
  return languageMenu(language.code, "ucp", copy.labels.changeLanguage);
}

function renderNav(language, t) {
  const base = pagePath(language, "/ultimate-clipboard-pro/");
  const legal = legalContent[language.code] || legalContent.en;
  return `<nav class="ucp-landing-nav" aria-label="Ultimate Clipboard Pro">
    <a href="${base}" aria-current="page">${escapeHtml(t("Presentation"))}</a>
    <a href="${base}demo/">${escapeHtml(t("Demo"))}</a>
    <a href="${base}faq/">${escapeHtml(t("FAQ"))}</a>
    <a href="${base}privacy/">${escapeHtml(t("Privacy policy"))}</a>
    <a href="${base}terms/">${escapeHtml(t("Terms of use"))}</a>
    <a href="${base}sales/">${escapeHtml(salesNavLabel(language.code))}</a>
  </nav>`;
}

function renderCapturePanel(kind, title, description, image, width, height, iconName) {
  const image480 = image.replace(/\.webp$/, "-480.webp");
  const image800 = image.replace(/\.webp$/, "-800.webp");
  return `<article class="ucp-capture-panel ucp-capture-panel-${kind}" data-reveal>
    <div class="ucp-capture-copy">
      <span class="ucp-feature-icon">${icon(iconName)}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </div>
    <figure class="ucp-window-frame">
      <div class="ucp-window-bar"><span></span><span></span><span></span><b>Ultimate Clipboard Pro</b></div>
      <img src="${image}" srcset="${image480} 480w, ${image800} 800w, ${image} ${width}w" sizes="(max-width: 680px) 92vw, (max-width: 980px) 88vw, 62vw" alt="${escapeHtml(title)}" width="${width}" height="${height}" loading="lazy" decoding="async">
    </figure>
  </article>`;
}

function renderPage(language) {
  const copy = locales[language.code];
  if (!copy) throw new Error(`Missing landing locale: ${language.code}`);
  const languageShowcase = languageShowcaseTranslations[language.code];
  if (!languageShowcase) throw new Error(`Missing language showcase locale: ${language.code}`);
  const t = (source) => navigationTranslations[language.code]?.[source] || closingTranslations[language.code]?.[source] || copy.translations[source] || source;
  const metadata = metadataTranslations[language.code] || { title: copy.title, description: copy.description };
  const canonical = localizedUrl(language.code, "ucp");
  const productBase = pagePath(language, "/ultimate-clipboard-pro/");
  const home = language.code === "en" ? "/" : `/${language.code}/`;
  const rtl = Boolean(language.rtl);
  const featureList = [
    t("Text capture"), t("Code capture"), t("Capture Images & Screenshots"),
    t("Advanced Search"), t("Visual Source Timeline"), t("20 built-in tools for power users")
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ultimate Clipboard Pro",
    applicationCategory: "BrowserApplication",
    applicationSubCategory: "Clipboard manager",
    operatingSystem: "Chrome",
    description: metadata.description,
    url: canonical,
    image: socialImage,
    screenshot: [
      "https://arcawand-soft.com/assets/products/text-big-panel-rectangular.webp",
      "https://arcawand-soft.com/assets/products/code-big-panel-rectangular.webp",
      "https://arcawand-soft.com/assets/products/image-big-panel-rectangular_960.webp"
    ],
    featureList,
    inLanguage: language.html,
    publisher: { "@type": "Organization", name: "ArcaWand Soft", url: "https://arcawand-soft.com/" }
  };
  const faqItems = [
    ["How is it different from a basic clipboard history?", "A basic history is usually a long timeline. Ultimate Clipboard Pro gives you dedicated workspaces for text, code and images, plus titles, categories, source URLs, notes, favorites, pins, visual source history, advanced search and Pro workflows such as versioning and montage."],
    ["Can I organize captures instead of scrolling through a huge list?", "Yes. You can use categories and subcategories, separate text/code/image spaces, favorites, pinned items, trash and vault workflows. The goal is to make your copied material feel organized, not buried."],
    ["What is versioning used for?", "Versioning lets Pro users keep several versions of the same text or code capture inside one item. It is ideal for prompts, replies, snippets, drafts and improvements where you want evolution without duplicate clutter."],
    ["What is capture montage?", "Montage lets you assemble several text captures into one clean combined text. It is useful for preparing prompts, reports, summaries, briefs, research notes or reusable content blocks."],
    ["Do I have to use Google Drive?", "No. Google Drive sync is optional. You can work locally and use local export/restore. Drive sync is for users who want a cloud backup and restore path across their own Google account."],
    ["Is my content private?", "The extension is designed with a local-first philosophy. Normal capture management happens in the browser extension environment on your device. Optional services such as Google Drive sync, payment and licensing are separated and used only for their specific purpose."]
  ];

  return `<!doctype html>
<html lang="${escapeHtml(language.html)}"${rtl ? ' dir="rtl"' : ""}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#090b12">
<title>${escapeHtml(metadata.title)}</title>
<meta name="description" content="${escapeHtml(metadata.description)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="ArcaWand Soft">
<link rel="canonical" href="${canonical}">
${LANGUAGES.map((item) => `<link rel="alternate" hreflang="${item.code}" href="${localizedUrl(item.code, "ucp")}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${localizedUrl("en", "ucp")}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="ArcaWand Soft">
<meta property="og:title" content="${escapeHtml(metadata.title)}">
<meta property="og:description" content="${escapeHtml(metadata.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${socialImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="675">
<meta property="og:image:alt" content="Ultimate Clipboard Pro">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(metadata.title)}">
<meta name="twitter:description" content="${escapeHtml(metadata.description)}">
<meta name="twitter:image" content="${socialImage}">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
<link rel="icon" type="image/png" href="/assets/Arcawand_Soft_Favicon.png">
<link rel="preload" as="image" href="/assets/products/text-big-panel-rectangular-800.webp" imagesrcset="/assets/products/text-big-panel-rectangular-480.webp 480w, /assets/products/text-big-panel-rectangular-800.webp 800w, /assets/products/text-big-panel-rectangular.webp 1400w" imagesizes="(max-width: 680px) 92vw, (max-width: 980px) 88vw, 54vw" type="image/webp" fetchpriority="high">
<link rel="stylesheet" href="/assets/ucp-landing.css?v=${version}">
<script>window.__ARCAWAND_LANG__=${JSON.stringify(language.code)};</script>
<script defer src="/assets/analytics.js"></script>
<script defer src="/assets/ucp-landing.js?v=${version}"></script>
<script defer src="/assets/install-extension-modal.js?v=20260807-i18n"></script>
</head>
<body class="ucp-landing-page">
<a class="ucp-skip-link" href="#ucp-main">${escapeHtml(t("Presentation"))}</a>
<header class="ucp-landing-header">
  <a class="ucp-home-link" href="${home}" aria-label="ArcaWand Soft"><span aria-hidden="true">←</span><span>ArcaWand Soft</span></a>
  <a class="ucp-brand" href="${productBase}" aria-label="Ultimate Clipboard Pro">
    <img src="/assets/ultimate_clipboard_pro_icon_96.webp" alt="" width="48" height="48" fetchpriority="high" decoding="async">
    <span><strong>Ultimate Clipboard Pro</strong><small>${escapeHtml(t("Chrome Extension"))}</small></span>
  </a>
  <button class="ucp-nav-toggle" type="button" aria-label="${escapeHtml(copy.labels.menu)}" aria-expanded="false"><span></span><span></span></button>
  ${renderNav(language, t)}
  ${renderLanguageMenu(language, copy)}
</header>

<main id="ucp-main">
  <section class="ucp-hero">
    <div class="ucp-hero-copy">
      <p class="ucp-eyebrow"><span></span>${escapeHtml(t("An advanced clipboard for demanding users."))}</p>
      <h1>${escapeHtml(t("Never lose what you copy again"))}</h1>
      <p class="ucp-hero-lead">${escapeHtml(t("Ultimate Clipboard Pro captures everything you copy — text, code, images, screenshots — and organizes it into three dedicated workspaces. Never lose important information again."))}</p>
      <div class="ucp-actions">
        <button class="ucp-button ucp-button-primary" type="button" data-install-extension-trigger="true">${escapeHtml(t("Install Extension"))}${icon("arrow")}</button>
        <a class="ucp-button ucp-button-secondary" href="${productBase}demo/">${escapeHtml(t("Demo"))}</a>
      </div>
      <ul class="ucp-proof-list" aria-label="Ultimate Clipboard Pro">
        <li>${escapeHtml(t("Manifest V3"))}</li><li>${escapeHtml(t("Local-first"))}</li><li>${escapeHtml(t("Text, Code & Images"))}</li>
      </ul>
    </div>
    <div class="ucp-hero-visual">
      <div class="ucp-hero-glow"></div>
      <figure class="ucp-window-frame ucp-window-frame-hero">
        <div class="ucp-window-bar"><span></span><span></span><span></span><b>Ultimate Clipboard Pro</b></div>
        <img src="/assets/products/text-big-panel-rectangular.webp" srcset="/assets/products/text-big-panel-rectangular-480.webp 480w, /assets/products/text-big-panel-rectangular-800.webp 800w, /assets/products/text-big-panel-rectangular.webp 1400w" sizes="(max-width: 680px) 92vw, (max-width: 980px) 88vw, 54vw" alt="${escapeHtml(t("Text capture"))}" width="1400" height="788" fetchpriority="high" decoding="async">
      </figure>
      <div class="ucp-floating-capture ucp-floating-capture-code">${icon("code")}<span>${escapeHtml(t("Code capture"))}</span></div>
      <div class="ucp-floating-capture ucp-floating-capture-image">${icon("image")}<span>${escapeHtml(t("Capture Images & Screenshots"))}</span></div>
    </div>
  </section>

  <section class="ucp-signal-strip" aria-label="Ultimate Clipboard Pro">
    <p><strong>3</strong><span>${escapeHtml(t("Text, Code & Images"))}</span></p>
    <p><strong>20</strong><span>${escapeHtml(t("Transform, analyze, and enhance your clipboard content with professional-grade tools"))}</span></p>
    <p><strong>50+</strong><span>${escapeHtml(t("Code capture with syntax highlighting"))}</span></p>
    <p><strong>${copy.drive.maximumDevices}</strong><span>${escapeHtml(copy.drive.lead)}</span></p>
  </section>

  <section class="ucp-language-showcase" aria-labelledby="ucp-language-showcase-title" data-reveal>
    <div class="ucp-language-showcase-copy">
      <p class="ucp-eyebrow"><span></span>${escapeHtml(languageShowcase.eyebrow)}</p>
      <h2 id="ucp-language-showcase-title"><strong>${LANGUAGES.length}</strong><span>${escapeHtml(languageShowcase.label)}</span></h2>
      <p>${escapeHtml(languageShowcase.description)}</p>
    </div>
    <ul class="ucp-language-grid" aria-label="${escapeHtml(languageShowcase.label)}">
      ${LANGUAGES.map((item) => `<li class="ucp-language-chip" dir="ltr"><img class="ucp-language-flag" src="${languageFlagImages[item.code]}" alt="" width="32" height="22" loading="lazy" decoding="async"><span class="ucp-language-name" lang="${escapeHtml(item.html)}" dir="auto">${escapeHtml(item.name)}</span><small>${escapeHtml(item.code.toUpperCase())}</small></li>`).join("\n      ")}
    </ul>
  </section>

  <section class="ucp-section ucp-capture-section">
    <div class="ucp-section-heading" data-reveal><p class="ucp-eyebrow"><span></span>${escapeHtml(t("Core features that transform your workflow"))}</p><h2>${escapeHtml(t("Three Dedicated Workspaces"))}</h2><p>${escapeHtml(t("Texts, Code, and Images workspaces keep your content organized by type. Each workspace has its own categories, search, and specialized tools."))}</p></div>
    <div class="ucp-capture-stack">
      ${renderCapturePanel("text", t("Text capture"), t("Save copied text as reusable captures with source, date, favicon, categories, favorites and quick actions. Keep notes, prompts, replies and research snippets ready to reuse."), "/assets/products/text-big-panel-rectangular.webp", 1400, 788, "text")}
      ${renderCapturePanel("code", t("Code capture"), t("Store copied code blocks separately from plain text, with clean formatting, preserved indentation, automatic language detection and a classification choice to place each capture in the right programming language."), "/assets/products/code-big-panel-rectangular.webp", 1400, 788, "code")}
      ${renderCapturePanel("image", t("Capture Images & Screenshots"), t("Screenshots, copied images, and visual content are automatically organized in your Images workspace. Built-in OCR extracts text from images for searchability."), "/assets/products/image-big-panel-rectangular_960.webp", 959, 540, "image")}
    </div>
  </section>

  <section class="ucp-section ucp-flow-section">
    <div class="ucp-section-heading" data-reveal><p class="ucp-eyebrow"><span></span>${escapeHtml(t("Floating Launcher"))}</p><h2>${escapeHtml(t("Advanced Search"))}</h2><p>${escapeHtml(t("Find anything instantly with full-text search across all workspaces. Search by content, source, date, category or semantic meaning."))}</p></div>
    <div class="ucp-flow-grid">
      <div class="ucp-flow-rail" aria-hidden="true"><i></i><i></i><i></i></div>
      <article class="ucp-flow-card" data-reveal><span class="ucp-flow-number">01</span><div><h3>${escapeHtml(t("Floating Launcher"))}</h3><p>${escapeHtml(t("Keep your capture tools within reach with the floating launcher. Choose which monitor or monitors display it in a multi-screen setup, and temporarily collapse it whenever you need more space."))}</p></div><div class="ucp-launcher-showcase" role="img" aria-label="${escapeHtml(t("Floating Launcher"))}"><span class="ucp-launcher-showcase-collapse"><img src="/assets/extension-runtime/assets/icons/arrow_right.png" alt="" width="18" height="9"></span><span class="ucp-launcher-showcase-brand"><img src="/assets/extension-runtime/assets/icons/icon128.png" alt="" width="52" height="52"></span><span class="ucp-launcher-showcase-button ucp-launcher-showcase-manager" aria-hidden="true">↗</span><span class="ucp-launcher-showcase-button"><img src="/assets/extension-runtime/assets/icons/tootls.png" alt="" width="31" height="31"></span><span class="ucp-launcher-showcase-button ucp-launcher-showcase-recent"><img src="/assets/extension-runtime/assets/icons/tools-icons/emojis.png" alt="" width="31" height="31"></span><span class="ucp-launcher-showcase-button"><img src="/assets/extension-runtime/assets/icons/screen_full_page_png.png" alt="" width="31" height="31"></span></div></article>
      <article class="ucp-flow-card ucp-flow-card-reverse" data-reveal><span class="ucp-flow-number">02</span><div><h3>${escapeHtml(t("Advanced Search"))}</h3><p>${escapeHtml(t("Find anything instantly with full-text search across all workspaces. Search by content, source, date, category or semantic meaning."))}</p></div><img src="/assets/advanced_search.webp" alt="${escapeHtml(t("Advanced Search"))}" width="953" height="500" loading="lazy" decoding="async"></article>
      <article class="ucp-flow-card" data-reveal><span class="ucp-flow-number">03</span><div><h3>${escapeHtml(t("Visual Source Timeline"))}</h3><p>${escapeHtml(t("See where each item came from with visual source indicators. Track your copy history across websites, apps and documents with timestamp precision."))}</p></div><img src="/assets/source_history_2.webp" alt="${escapeHtml(t("Visual Source Timeline"))}" width="1400" height="702" loading="lazy" decoding="async"></article>
    </div>
  </section>

  <section class="ucp-section ucp-power-section">
    <div class="ucp-power-copy" data-reveal><p class="ucp-eyebrow"><span></span>${escapeHtml(t("20 built-in tools for power users"))}</p><h2>${escapeHtml(t("Your data stays yours"))}</h2><p>${escapeHtml(t("Local-first architecture means your clipboard data never leaves your device unless you choose to sync"))}</p></div>
    <div class="ucp-power-grid">
      <article data-reveal>${icon("shield")}<h3>${escapeHtml(t("Local storage"))}</h3><p>${escapeHtml(t("All clipboard data is stored locally on your device. No cloud servers, no third-party access."))}</p></article>
      <article data-reveal>${icon("source")}<h3>${escapeHtml(t("Source recovery"))}</h3><p>${escapeHtml(t("Reopen the page a text, code block or image came from, so a capture never becomes disconnected from its original context."))}</p></article>
      <article data-reveal>${icon("search")}<h3>${escapeHtml(t("Favorites and pinned captures"))}</h3><p>${escapeHtml(t("Keep important captures within reach with favorites and pinned items across text, code and images."))}</p></article>
      <article data-reveal>${icon("image")}<h3>${escapeHtml(t("Images, OCR & Color tools"))}</h3><p>${escapeHtml(t("Extract text from images and screenshots with high accuracy. Search extracted text across your entire library"))}</p></article>
    </div>
  </section>

  <section class="ucp-section ucp-drive-section" data-reveal>
    <div class="ucp-drive-copy"><p class="ucp-eyebrow"><span></span>${escapeHtml(copy.drive.eyebrow)}</p><h2>${escapeHtml(copy.drive.title)}</h2><p>${escapeHtml(copy.drive.lead)}</p><ul><li>${icon("text")}${escapeHtml(copy.drive.captureLabels[0])}</li><li>${icon("code")}${escapeHtml(copy.drive.captureLabels[1])}</li><li>${icon("image")}${escapeHtml(copy.drive.captureLabels[2])}</li></ul><small>${escapeHtml(copy.drive.note)}</small></div>
    <div class="ucp-drive-map" role="group" aria-label="${escapeHtml(copy.drive.title)}">
      <div class="ucp-drive-lines" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="ucp-drive-hub"><img src="/assets/extension-runtime/assets/icons/drive-logo-128.webp" alt="Google Drive" width="64" height="64" loading="lazy" decoding="async"><strong>${escapeHtml(copy.drive.hub)}</strong><span>${escapeHtml(copy.drive.realtime)}</span></div>
      ${copy.drive.deviceLabels.map((device, index) => `<div class="ucp-device ucp-device-${index + 1}"><img src="/assets/extension-runtime/assets/icons/computer-72.webp" alt="" width="42" height="42" loading="lazy" decoding="async"><strong>${escapeHtml(device)}</strong><span>${escapeHtml(copy.drive.realtime)}</span></div>`).join("")}
    </div>
  </section>

  <section class="ucp-section ucp-faq-section">
    <div class="ucp-section-heading" data-reveal><p class="ucp-eyebrow"><span></span>Ultimate Clipboard Pro</p><h2>${escapeHtml(t("Frequently asked questions"))}</h2></div>
    <div class="ucp-faq-list">${faqItems.map(([question, answer], index) => `<details class="ucp-faq-item"${index === 0 ? " open" : ""} data-reveal><summary>${escapeHtml(t(question))}<span aria-hidden="true">+</span></summary><p>${escapeHtml(t(answer))}</p></details>`).join("")}</div>
  </section>

  <section class="ucp-final-cta" data-reveal>
    <img src="/assets/ultimate_clipboard_pro_icon_96.webp" alt="" width="80" height="80" loading="lazy" decoding="async">
    <div><h2>${escapeHtml(t("What should I try first after installing?"))}</h2><p>${escapeHtml(t("Capture a useful text, a code snippet and an image. Then open the manager, add a title, classify one item, search by source and try reusing a capture. That first loop shows why the extension is more than a clipboard history."))}</p></div>
    <div class="ucp-actions"><button class="ucp-button ucp-button-primary" type="button" data-install-extension-trigger="true">${escapeHtml(t("Install Extension"))}${icon("arrow")}</button><a class="ucp-button ucp-button-secondary" href="${productBase}demo/">${escapeHtml(t("Demo"))}</a></div>
  </section>
</main>

<footer class="ucp-landing-footer"><a href="${home}"><img src="/assets/Arcawand_Soft_Logo_320.webp" alt="ArcaWand Soft" width="160" height="44" loading="lazy" decoding="async"></a><p>${escapeHtml(t("© 2026 Arcawand Soft. All rights reserved."))}</p><nav><a href="${productBase}privacy/">${escapeHtml(t("Privacy policy"))}</a><a href="${productBase}terms/">${escapeHtml(t("Terms of use"))}</a><a href="${productBase}sales/">${escapeHtml(salesNavLabel(language.code))}</a><a href="mailto:contact@arcawand-soft.com">${escapeHtml(t("Contact"))}</a></nav></footer>
</body>
</html>
`;
}

function generateAll() {
  for (const language of LANGUAGES) {
    const directory = pageDirectory(language);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, "index.html"), renderPage(language), "utf8");
  }

  console.log(`Generated ${LANGUAGES.length} Ultimate Clipboard Pro landing pages.`);
}

if (require.main === module) generateAll();

module.exports = { generateAll };
