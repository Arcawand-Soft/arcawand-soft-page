const fs = require("fs");
const path = require("path");
const { LANGUAGES, localizedPath } = require("./language-config");
const legal = require("./ucp-legal-content.json");
const { salesNavLabel } = require("./ucp-legal-nav-labels");

const root = path.resolve(__dirname, "..");
const effectiveDate = new Date("2026-08-22T00:00:00Z");
const chromeLabels = {
  en: ["Presentation", "Demo", "Back to ArcaWand Soft"], fr: ["Présentation", "Démo", "Retour vers ArcaWand Soft"], es: ["Presentación", "Demo", "Volver a ArcaWand Soft"], it: ["Presentazione", "Demo", "Torna ad ArcaWand Soft"], de: ["Präsentation", "Demo", "Zurück zu ArcaWand Soft"],
  ro: ["Prezentare", "Demonstrație", "Înapoi la ArcaWand Soft"], pt: ["Apresentação", "Demonstração", "Voltar para ArcaWand Soft"], ar: ["نظرة عامة", "عرض توضيحي", "العودة إلى ArcaWand Soft"], zh: ["产品介绍", "演示", "返回 ArcaWand Soft"], ja: ["製品紹介", "デモ", "ArcaWand Soft に戻る"],
  ru: ["Обзор", "Демо", "Вернуться к ArcaWand Soft"], nl: ["Presentatie", "Demo", "Terug naar ArcaWand Soft"], pl: ["Prezentacja", "Demo", "Wróć do ArcaWand Soft"], tr: ["Tanıtım", "Demo", "ArcaWand Soft'a dön"], ko: ["제품 소개", "데모", "ArcaWand Soft로 돌아가기"], hi: ["परिचय", "डेमो", "ArcaWand Soft पर वापस जाएँ"]
};

function esc(value) {
  return String(value ?? "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

function fileFor(code, pageKey) {
  return path.join(root, localizedPath(code, pageKey), "index.html");
}

function updatedLabel(code) {
  const date = new Intl.DateTimeFormat(code, { dateStyle: "long", timeZone: "UTC" }).format(effectiveDate);
  return `<p><time datetime="2026-08-22">${esc(date)}</time></p>`;
}

function numberedContent(dictionary, prefix) {
  return `<ol class="ucp-legal-list">${Array.from({ length: 14 }, (_, index) => {
    const key = `${prefix}.${String(index + 1).padStart(2, "0")}`;
    return `<li><p>${esc(dictionary[key])}</p></li>`;
  }).join("\n")}</ol>`;
}

function referenceLinks(page) {
  const links = page === "privacy"
    ? [
        ["Chrome Web Store User Data Policy", "https://developer.chrome.com/docs/webstore/program-policies/user-data-faq"],
        ["Google API Services User Data Policy", "https://developers.google.com/terms/api-services-user-data-policy"],
        ["Google Privacy Policy", "https://policies.google.com/privacy"]
      ]
    : page === "sales"
      ? [
          ["Dodo Payments Buyer Terms", "https://dodopayments.com/archive/buyer-terms"],
          ["Dodo Payments Privacy Policy", "https://dodopayments.com/privacy-policy"]
        ]
      : [
          ["Ultimate Clipboard Pro Privacy Policy", "../privacy/"],
          ["Ultimate Clipboard Pro Terms of Sale", "../sales/"]
        ];
  return `<nav class="ucp-legal-references" aria-label="Official references">${links.map(([label, href]) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}</a>`).join("")}</nav>`;
}

function privacyContent(dictionary) {
  const keys = [
    "popup.privacyIntro", "popup.privacyLocal", "popup.privacyData", "popup.privacyNoSale",
    "popup.privacyNoAds", "popup.privacyPermissions", "popup.privacyControl", "popup.privacyDodo",
    "popup.privacyMultiDevice", "popup.privacyGoogleData", "popup.privacyLicenseService",
    "popup.privacyRetention", "popup.privacySecurity", "popup.privacyLimitedUse",
    "popup.privacyWebsite", "popup.privacyContact"
  ];
  return `<div class="ucp-legal-sections">${keys.map((key, index) => {
    const copy = dictionary[key];
    const accessibleHeading = String(copy).split(/[:.!?]/, 1)[0].trim();
    return `<section class="ucp-legal-section"><h2><span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><span class="ucp-visually-hidden">${esc(accessibleHeading)}</span></h2><p>${esc(copy)}</p></section>`;
  }).join("\n")}</div>`;
}

function replaceArticle(html, body) {
  const article = /<article class="ucp-page-content">[\s\S]*?<\/article>/;
  if (!article.test(html)) throw new Error("Legal article container not found");
  return html.replace(article, `<article class="ucp-page-content">${body}</article>`);
}

function faqBlock(dictionary) {
  const ids = [...Array.from({ length: 20 }, (_, index) => String(index + 1).padStart(2, "0")), "76", "77", "78", "79", "80", "81", "82", "83", "84", "85"];
  return `<!-- UCP_LEGAL_FAQ_START -->\n${ids.map((id) => `<article class="ucp-faq-item${id === "76" ? " ucp-faq-item-important" : ""}"><h2>${esc(dictionary[`faq.${id}.q`])}</h2><p>${esc(dictionary[`faq.${id}.a`])}</p></article>`).join("\n")}\n<!-- UCP_LEGAL_FAQ_END -->`;
}

function updateFaq(html, dictionary) {
  const block = faqBlock(dictionary);
  const list = /<div class="ucp-faq-list">[\s\S]*?<\/div>/;
  if (!list.test(html)) throw new Error("FAQ list container not found");
  html = html.replace(list, `<div class="ucp-faq-list">${block}</div>`);
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (script, raw) => {
    let data;
    try { data = JSON.parse(raw); } catch (_error) { return script; }
    if (data?.["@type"] !== "FAQPage") return script;
    const additions = [...Array.from({ length: 20 }, (_, index) => String(index + 1).padStart(2, "0")), "76", "77", "78", "79", "80", "81", "82", "83", "84", "85"].map((id) => ({
      "@type": "Question",
      name: dictionary[`faq.${id}.q`],
      acceptedAnswer: { "@type": "Answer", text: dictionary[`faq.${id}.a`] }
    }));
    data.mainEntity = additions;
    return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
  });
}

function updatePageChrome(html, code, page, dictionary) {
  const pageCopy = {
    faq: [dictionary["popup.faqTitle"], dictionary["faq.14.a"], dictionary["popup.faq"]],
    privacy: [dictionary["popup.privacyTitle"], dictionary["popup.privacyIntro"], dictionary["popup.privacy"]],
    terms: [dictionary["popup.termsTitle"], dictionary["popup.terms.02"], dictionary["popup.terms"]],
    sales: [dictionary["popup.salesTermsTitle"], dictionary["popup.salesTerms.02"], dictionary["popup.salesTerms"]]
  }[page];
  const [title, description, kicker] = pageCopy;
  const canonical = `https://arcawand-soft.com/${code === "en" ? "" : `${code}/`}ultimate-clipboard-pro/${page}/`;
  const [presentation, demo, back] = chromeLabels[code] || chromeLabels.en;
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canonical}">`)
    .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(title)}</h1>`)
    .replace(/<span class="ucp-static-kicker">[\s\S]*?<\/span>/, `<span class="ucp-static-kicker">${esc(kicker)}</span>`)
    .replace(/(<section class="ucp-static-hero">[\s\S]*?<h1>[\s\S]*?<\/h1>)<p>[\s\S]*?<\/p>/, `$1<p>${esc(description)}</p>`)
    .replace(/(<a href="[^"]*" data-ucp-nav="presentation"[^>]*>)[\s\S]*?<\/a>/, `$1${esc(presentation)}</a>`)
    .replace(/(<a href="[^"]*" data-ucp-nav="demo"[^>]*>)[\s\S]*?<\/a>/, `$1${esc(demo)}</a>`)
    .replace(/(<a href="[^"]*" data-ucp-nav="faq"[^>]*>)[\s\S]*?<\/a>/, `$1${esc(dictionary["popup.faq"])}</a>`)
    .replace(/(<a href="[^"]*" data-ucp-nav="privacy"[^>]*>)[\s\S]*?<\/a>/, `$1${esc(dictionary["popup.privacy"])}</a>`)
    .replace(/(<a href="[^"]*" data-ucp-nav="terms"[^>]*>)[\s\S]*?<\/a>/, `$1${esc(dictionary["popup.terms"])}</a>`)
    .replace(/(<a href="[^"]*" data-ucp-nav="sales"[^>]*>)[\s\S]*?<\/a>/, `$1${esc(salesNavLabel(code))}</a>`)
    .replace(/(<a href="[^\"]*presentation[^\"]*">)[\s\S]*?<\/a>/, `$1${esc(presentation)}</a>`)
    .replace(/(<a href="[^\"]*demo\/">)[\s\S]*?<\/a>/g, `$1${esc(demo)}</a>`)
    .replace(/(<a href="[^\"]*faq\/">)[\s\S]*?<\/a>/g, `$1${esc(dictionary["popup.faq"])}</a>`)
    .replace(/(<a href="[^\"]*privacy\/">)[\s\S]*?<\/a>/g, `$1${esc(dictionary["popup.privacy"])}</a>`)
    .replace(/(<a href="[^\"]*terms\/">)[\s\S]*?<\/a>/g, `$1${esc(dictionary["popup.terms"])}</a>`)
    .replace(/(<a href="[^\"]*sales\/">)[\s\S]*?<\/a>/g, `$1${esc(salesNavLabel(code))}</a>`)
    .replace(/(<a class="arcawand-root-return" href="[^"]*" aria-label=")[^"]*(">)[\s\S]*?<\/a>/, `$1${esc(back)}$2&larr; ${esc(back)}</a>`)
    .replace(/(<aside class="ucp-side-card"><h2>)[\s\S]*?(<\/h2><p>)[\s\S]*?(<\/p>)/, `$1Ultimate Clipboard Pro$2${esc(description)}$3`)
    .replace(/(<aside class="ucp-side-card">[\s\S]*?<nav><a href="\.\.\/">)[\s\S]*?<\/a>/, `$1${esc(presentation)}</a>`);
}

function apply() {
  for (const { code } of LANGUAGES) {
    const dictionary = legal[code] || legal.en;
    const pages = {
      ucpPrivacy: `${updatedLabel(code)}${privacyContent(dictionary)}${referenceLinks("privacy")}`,
      ucpTerms: `${updatedLabel(code)}${numberedContent(dictionary, "popup.terms")}${referenceLinks("terms")}`,
      ucpSales: `${updatedLabel(code)}${numberedContent(dictionary, "popup.salesTerms")}${referenceLinks("sales")}`
    };
    for (const [pageKey, body] of Object.entries(pages)) {
      const file = fileFor(code, pageKey);
      let html = fs.readFileSync(file, "utf8");
      html = replaceArticle(html, body);
      html = updatePageChrome(html, code, { ucpPrivacy: "privacy", ucpTerms: "terms", ucpSales: "sales" }[pageKey], dictionary);
      fs.writeFileSync(file, html, "utf8");
    }
    const faqFile = fileFor(code, "ucpFaq");
    let faqHtml = updateFaq(fs.readFileSync(faqFile, "utf8"), dictionary);
    faqHtml = updatePageChrome(faqHtml, code, "faq", dictionary);
    fs.writeFileSync(faqFile, faqHtml, "utf8");
  }
  console.log(`Applied UCP legal content to ${LANGUAGES.length} languages.`);
}

if (require.main === module) apply();
module.exports = { apply };
