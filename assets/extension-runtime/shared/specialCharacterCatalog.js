(function initSpecialCharacterCatalog(global) {
  "use strict";

  const LANGUAGES = Object.freeze([
    ["en", "EN", "English"], ["fr", "FR", "Français"], ["es", "ES", "Español"], ["it", "IT", "Italiano"],
    ["de", "DE", "Deutsch"], ["ro", "RO", "Română"], ["pt", "PT", "Português"], ["ar", "AR", "العربية"],
    ["zh", "ZH", "中文"], ["ja", "JA", "日本語"], ["ru", "RU", "Русский"], ["nl", "NL", "Nederlands"],
    ["pl", "PL", "Polski"], ["tr", "TR", "Türkçe"], ["ko", "KO", "한국어"], ["hi", "HI", "हिन्दी"]
  ].map(([id, badge, name]) => Object.freeze({ id, badge, name })));

  const GROUP_LABELS = Object.freeze({
    en: ["Frequent", "Letters", "Punctuation", "Currency", "Mathematics", "Arrows", "Technical", "Shapes", "Music"],
    fr: ["Fréquents", "Lettres", "Ponctuation", "Devises", "Mathématiques", "Flèches", "Technique", "Formes", "Musique"],
    es: ["Frecuentes", "Letras", "Puntuación", "Monedas", "Matemáticas", "Flechas", "Técnicos", "Formas", "Música"],
    it: ["Frequenti", "Lettere", "Punteggiatura", "Valute", "Matematica", "Frecce", "Tecnici", "Forme", "Musica"],
    de: ["Häufig", "Buchstaben", "Satzzeichen", "Währungen", "Mathematik", "Pfeile", "Technik", "Formen", "Musik"],
    ro: ["Frecvente", "Litere", "Punctuație", "Monede", "Matematică", "Săgeți", "Tehnice", "Forme", "Muzică"],
    pt: ["Frequentes", "Letras", "Pontuação", "Moedas", "Matemática", "Setas", "Técnicos", "Formas", "Música"],
    ar: ["الأكثر استخدامًا", "حروف", "ترقيم", "عملات", "رياضيات", "أسهم", "تقنية", "أشكال", "موسيقى"],
    zh: ["常用", "字符", "标点", "货币", "数学", "箭头", "技术", "形状", "音乐"],
    ja: ["よく使う", "文字", "句読点", "通貨", "数学", "矢印", "技術", "図形", "音楽"],
    ru: ["Частые", "Буквы", "Пунктуация", "Валюты", "Математика", "Стрелки", "Технические", "Фигуры", "Музыка"],
    nl: ["Frequent", "Letters", "Interpunctie", "Valuta", "Wiskunde", "Pijlen", "Technisch", "Vormen", "Muziek"],
    pl: ["Częste", "Litery", "Interpunkcja", "Waluty", "Matematyka", "Strzałki", "Techniczne", "Kształty", "Muzyka"],
    tr: ["Sık kullanılan", "Harfler", "Noktalama", "Para birimleri", "Matematik", "Oklar", "Teknik", "Şekiller", "Müzik"],
    ko: ["자주 사용", "문자", "문장 부호", "통화", "수학", "화살표", "기술", "도형", "음악"],
    hi: ["सर्वाधिक उपयोग", "वर्ण", "विराम चिह्न", "मुद्राएँ", "गणित", "तीर", "तकनीकी", "आकृतियाँ", "संगीत"]
  });

  const PROFILES = Object.freeze({
    en: ["’ ‘ “ ” … — – • © ® ™ ° £ € ¢ æ Æ œ Œ á é í ó ú à è ì ò ù â ê î ô û ä ë ï ö ü ÿ ç ñ", "letters"],
    fr: ["é è à ç ù œ É È À Ç Ù Œ ê â î ô û ë ï ü ÿ æ Æ « » ’ … — –", "letters"],
    es: ["ñ á é í ó ú ü Ñ Á É Í Ó Ú Ü ¿ ¡ « » º ª € ’ … —", "letters"],
    it: ["à è é ì í ò ó ù ú À È É Ì Í Ò Ó Ù Ú ’ « » … —", "letters"],
    de: ["ä ö ü ß Ä Ö Ü ẞ „ “ ‚ ‘ € § … – —", "letters"],
    ro: ["ă â î ș ş ț ţ Ă Â Î Ș Ş Ț Ţ „ ” « » … —", "letters"],
    pt: ["á à â ã ç é ê í ó ô õ ú ü Á À Â Ã Ç É Ê Í Ó Ô Õ Ú Ü « » º ª €", "letters"],
    ar: ["ا أ إ آ ء ئ ؤ ة ى ي ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و َ ً ُ ٌ ِ ٍ ْ ّ ، ؛ ؟ ٪ ٫ ٬ ﷼", "letters"],
    zh: ["， 。 、 ； ： ？ ！ “ ” ‘ ’ 《 》 〈 〉 【 】 〔 〕 （ ） —— …… · ￥ 〇 一 二 三 四 五 六 七 八 九 十 百 千 万 亿", "letters"],
    ja: ["あ い う え お か き く け こ さ し す せ そ た ち つ て と な に ぬ ね の は ひ ふ へ ほ ま み む め も や ゆ よ ら り る れ ろ わ を ん ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ン 々 〆 〇 ー ・ 、 。 「 」 『 』 ￥", "letters"],
    ru: ["ё й ц у к е н г ш щ з х ъ ф ы в а п р о л д ж э я ч с м и т ь б ю Ё Й Ц У К Е Н Г Ш Щ З Х Ъ Ф Ы В А П Р О Л Д Ж Э Я Ч С М И Т Ь Б Ю « » „ “ № ₽ … —", "letters"],
    nl: ["é ë ï ó ö ü á à è ê É Ë Ï Ó Ö Ü Á À È Ê ĳ Ĳ ’ “ ” €", "letters"],
    pl: ["ą ć ę ł ń ó ś ź ż Ą Ć Ę Ł Ń Ó Ś Ź Ż „ ” « » … —", "letters"],
    tr: ["ç ğ ı i ö ş ü Ç Ğ I İ Ö Ş Ü â î û ₺ ‘ ’ “ ” …", "letters"],
    ko: ["ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ · ㆍ 《 》 〈 〉 ₩", "letters"],
    hi: ["अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं अः क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह ा ि ी ु ू ृ े ै ो ौ ् ं ः ँ । ॥ ॐ ₹", "letters"]
  });

  const COMMON_GROUPS = Object.freeze([
    ["punctuation", "… ‥ · • ‣ ‧ ‰ ‱ ′ ″ ‴ ※ ⁂ ⁃ ⁄ ⁎ ⁑ ⁕ ⁖ ⁘ ⁙ ⁚ ⁛ ⁜ ⁝ ⁞ ¡ ¿ ‽ ‼ ⁉ ‐ ‑ ‒ – — ― ‘ ’ ‚ ‛ “ ” „ ‟ ‹ › « » ⟨ ⟩ 〈 〉 《 》 「 」 『 』 【 】 〔 〕 〖 〗 〘 〙 〚 〛"],
    ["currency", "$ ¢ £ ¤ ¥ ֏ ؋ ৳ ฿ ៛ ₡ ₢ ₣ ₤ ₦ ₧ ₨ ₩ ₪ ₫ € ₭ ₮ ₯ ₱ ₲ ₳ ₴ ₵ ₶ ₷ ₸ ₹ ₺ ₼ ₽ ₾ ₿ ﷼ ￥ ＄￠ ￡ ￦"],
    ["math", "± × ÷ − ∓ ∗ ∘ ∙ √ ∛ ∜ ∝ ∞ ∟ ∠ ∡ ∢ ∣ ∤ ∥ ∦ ∧ ∨ ∩ ∪ ∫ ∬ ∭ ∮ ∯ ∰ ∴ ∵ ∶ ∷ ∼ ≃ ≅ ≈ ≉ ≠ ≡ ≢ ≤ ≥ ≪ ≫ ⊂ ⊃ ⊄ ⊅ ⊆ ⊇ ⊕ ⊗ ⊥ ⋂ ⋃ ⋅ ⋆ ⋮ ⋯ ⋰ ⋱ ∀ ∁ ∂ ∃ ∄ ∅ ∇ ∈ ∉ ∋ ∌ ∑ ∏ ℵ ℏ π α β γ δ ε θ λ μ σ φ ω Δ Ω"],
    ["arrows", "← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↚ ↛ ↜ ↝ ↞ ↟ ↠ ↡ ↢ ↣ ↤ ↥ ↦ ↧ ↩ ↪ ↫ ↬ ↭ ↮ ↯ ↰ ↱ ↲ ↳ ↴ ↵ ↶ ↷ ↺ ↻ ⇄ ⇅ ⇆ ⇇ ⇈ ⇉ ⇊ ⇋ ⇌ ⇍ ⇎ ⇏ ⇐ ⇑ ⇒ ⇓ ⇔ ⇕ ⇖ ⇗ ⇘ ⇙ ➔ ➜ ➝ ➞ ➟ ➠ ➡ ➢ ➣ ➤ ➥ ➦ ➧ ➨ ➩ ➪ ➫ ➬ ➭ ➮ ➯ ➱ ➲ ➳ ➵ ➸ ➺ ➻ ➼ ➽ ➾"],
    ["technical", "© ® ™ ℠ ℗ ℅ № ℞ ℀ ℁ ℆ ℃ ℉ ° µ ℓ Ω ℧ ℮ ⌁ ⌂ ⌘ ⌥ ⌫ ⌦ ⌧ ⌨ ⎋ ⏎ ⏏ ⏩ ⏪ ⏫ ⏬ ⏭ ⏮ ⏯ ⏰ ⏱ ⏲ ⏳ ⌛ ⌚ ⌖ ⌗ ⌕ ⌬ ⌭ ⌮ ⌯ ⌰ ⌲ ⌴ ⌶ ⌸ ⌹ ⌺ ⌻ ⌼ ⌽ ⌾ ⍉ ⍟ ⎙ ⎚ § ¶ † ‡ @ # & %"],
    ["shapes", "■ □ ▪ ▫ ▬ ▭ ▮ ▯ ▰ ▱ ▲ △ ▴ ▵ ▶ ▷ ▸ ▹ ► ▻ ▼ ▽ ▾ ▿ ◀ ◁ ◂ ◃ ◄ ◅ ◆ ◇ ◈ ◉ ◊ ○ ◌ ◍ ◎ ● ◐ ◑ ◒ ◓ ◔ ◕ ◖ ◗ ◘ ◙ ◚ ◛ ◜ ◝ ◞ ◟ ◠ ◡ ◢ ◣ ◤ ◥ ◦ ★ ☆ ✦ ✧ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ✓ ✔ ✕ ✖ ✗ ✘ ☑ ☒ ♠ ♣ ♥ ♦"],
    ["music", "♩ ♪ ♫ ♬ ♭ ♮ ♯ 𝄞 𝄢 𝄡 𝄪 𝄫 𝄐 𝄆 𝄇" ]
  ]);

  const GROUP_INDEX = Object.freeze({ frequent: 0, letters: 1, punctuation: 2, currency: 3, math: 4, arrows: 5, technical: 6, shapes: 7, music: 8 });
  const GROUP_ICONS = Object.freeze({ frequent: "★", letters: "À", punctuation: "¶", currency: "€", math: "∑", arrows: "→", technical: "⌘", shapes: "◆", music: "♪" });
  const cache = new Map();

  function tokenize(value) {
    return String(value || "").trim().split(/\s+/u).filter(Boolean);
  }

  function codeMetadata(symbol) {
    const codePoints = Array.from(symbol, (character) => character.codePointAt(0));
    return {
      codePoints,
      unicode: codePoints.map((value) => `U+${value.toString(16).toUpperCase().padStart(4, "0")}`).join(" "),
      htmlDecimal: codePoints.map((value) => `&#${value};`).join(""),
      htmlHex: codePoints.map((value) => `&#x${value.toString(16).toUpperCase()};`).join("")
    };
  }

  function getGroupLabel(language, group) {
    const labels = GROUP_LABELS[language] || GROUP_LABELS.en;
    return labels[GROUP_INDEX[group] ?? 1] || group;
  }

  function getSpecialCharacterCatalog(language = "en") {
    const locale = LANGUAGES.some((item) => item.id === language) ? language : "en";
    if (cache.has(locale)) return cache.get(locale);
    const seen = new Set();
    const items = [];
    const append = (symbols, group, local = false) => {
      for (const symbol of tokenize(symbols)) {
        if (!symbol || seen.has(symbol)) continue;
        seen.add(symbol);
        const metadata = codeMetadata(symbol);
        // Every locale starts with a compact, frequency-informed shelf. For
        // languages whose exemplar set has fewer than 24 entries, complete
        // that shelf with the most useful universal punctuation/symbols.
        const priority = local || items.length < 24 ? Math.min(items.length, 30) : 40 + items.length;
        const groupLabel = getGroupLabel(locale, group);
        items.push(Object.freeze({
          id: `${locale}-${metadata.codePoints.map((value) => value.toString(16)).join("-")}`,
          symbol,
          language: locale,
          group,
          groupLabel,
          priority,
          names: Object.freeze({ en: `${groupLabel} · ${metadata.unicode}`, [locale]: `${groupLabel} · ${metadata.unicode}` }),
          search: `${symbol} ${group} ${groupLabel} ${metadata.unicode} ${metadata.htmlDecimal} ${metadata.htmlHex}`.toLocaleLowerCase(locale),
          ...metadata
        }));
      }
    };
    const localProfile = tokenize(PROFILES[locale]?.[0] || PROFILES.en[0]);
    append(localProfile.slice(0, 24).join(" "), "frequent", true);
    append(localProfile.slice(24).join(" "), PROFILES[locale]?.[1] || "letters", true);
    for (const [group, symbols] of COMMON_GROUPS) append(symbols, group, false);
    const frozen = Object.freeze(items.sort((left, right) => left.priority - right.priority));
    cache.set(locale, frozen);
    return frozen;
  }

  function getSpecialCharacterGroups(language = "en", displayLanguage = "en") {
    const counts = new Map();
    for (const item of getSpecialCharacterCatalog(language)) counts.set(item.group, (counts.get(item.group) || 0) + 1);
    return Object.keys(GROUP_INDEX)
      .filter((group) => counts.has(group))
      .map((group) => Object.freeze({
        id: group,
        icon: GROUP_ICONS[group] || "•",
        label: getGroupLabel(displayLanguage, group),
        count: counts.get(group)
      }));
  }

  global.MCP = global.MCP || {};
  Object.assign(global.MCP, {
    getSpecialCharacterLanguages: () => LANGUAGES.slice(),
    getSpecialCharacterCatalog,
    getSpecialCharacterGroups,
    getSpecialCharacterGroupLabel: getGroupLabel,
    getSpecialCharacterCodeMetadata: codeMetadata
  });
})(globalThis);
