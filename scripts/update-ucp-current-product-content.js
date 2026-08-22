const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { LANGUAGES } = require("./language-config");

const siteRoot = path.resolve(__dirname, "..");
const extensionRoot = path.resolve(siteRoot, "..", "multi-copy-paste", "extension");
const markerStart = "<!-- ucp-current-product:start -->";
const markerEnd = "<!-- ucp-current-product:end -->";
const publishedDate = new Date("2026-08-22T12:00:00Z");

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function localeDictionary(language) {
  const file = path.join(extensionRoot, "shared", "locales", `${language}.js`);
  const context = { MCP_LOCALES: {} };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return context.MCP_LOCALES?.[language] || {};
}

function route(language, page) {
  const prefix = language === "en" ? "" : `${language}/`;
  return path.join(siteRoot, prefix, "ultimate-clipboard-pro", page, "index.html");
}

function replaceMarkedBlock(html, block) {
  const expression = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`);
  return expression.test(html) ? html.replace(expression, block) : html;
}

function insertBefore(html, needle, block) {
  if (html.includes(markerStart)) return replaceMarkedBlock(html, block);
  if (!html.includes(needle)) throw new Error(`Unable to locate product-content insertion point: ${needle}`);
  return html.replace(needle, `${block}\n${needle}`);
}

function updatePublishedDate(html, language) {
  const formatted = new Intl.DateTimeFormat(language, { dateStyle: "long", timeZone: "UTC" }).format(publishedDate);
  return html.replace(/(<article class="ucp-page-content"><p>)([^<]*?)(<\/p>)/, (_match, open, current, close) => {
    const separator = current.includes(":") ? current.slice(0, current.indexOf(":") + 1) : current;
    return `${open}${escapeHtml(separator)} <time datetime="2026-08-22">${escapeHtml(formatted)}</time>${close}`;
  });
}

function currentFaq(dictionary) {
  return `${markerStart}
<article class="ucp-faq-item ucp-faq-item-important"><h2>${escapeHtml(dictionary["faq.76.q"])}</h2><p>${escapeHtml(dictionary["faq.76.a"])}</p></article>
<article class="ucp-faq-item"><h2>${escapeHtml(dictionary["faq.77.q"])}</h2><p>${escapeHtml(dictionary["faq.77.a"])}</p></article>
${markerEnd}`;
}

function updateFaqSchema(html, dictionary) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (script, rawJson) => {
    let data;
    try {
      data = JSON.parse(rawJson);
    } catch (_error) {
      return script;
    }
    if (data?.["@type"] === "FAQPage" && !Array.isArray(data.mainEntity)) {
      data["@type"] = "WebPage";
      return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
    }
    if (data?.["@type"] !== "FAQPage" || !Array.isArray(data.mainEntity)) return script;
    const currentQuestions = [
      [dictionary["faq.76.q"], dictionary["faq.76.a"]],
      [dictionary["faq.77.q"], dictionary["faq.77.a"]]
    ];
    const names = new Set(currentQuestions.map(([question]) => question));
    data.mainEntity = data.mainEntity.filter((entry) => !names.has(entry?.name));
    data.mainEntity.push(...currentQuestions.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    })));
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });
}

function currentPrivacy(dictionary) {
  return `${markerStart}
<h2>${escapeHtml(dictionary["faq.77.q"])}</h2>
<p>${escapeHtml(dictionary["popup.privacyMultiDevice"])}</p>
<p>${escapeHtml(dictionary["popup.aboutMultiDevice"])}</p>
<h2>${escapeHtml(dictionary["faq.76.q"])}</h2>
<p>${escapeHtml(dictionary["faq.76.a"])}</p>
${markerEnd}`;
}

function currentTerms(dictionary) {
  return `${markerStart}
<h2>${escapeHtml(dictionary["faq.76.q"])}</h2>
<p>${escapeHtml(dictionary["faq.76.a"])}</p>
<h2>${escapeHtml(dictionary["faq.77.q"])}</h2>
<p>${escapeHtml(dictionary["faq.77.a"])}</p>
${markerEnd}`;
}

function updatePage(language, page, content) {
  const file = route(language, page);
  let html = fs.readFileSync(file, "utf8");
  if (page === "faq") {
    html = insertBefore(html, "</div></div><aside class=\"ucp-side-card\">", content);
    html = updateFaqSchema(html, localeDictionary(language));
  }
  else html = insertBefore(html, "</article></div><aside class=\"ucp-side-card\">", content);
  html = updatePublishedDate(html, language);
  fs.writeFileSync(file, html, "utf8");
}

function applyCurrentProductContent() {
  for (const { code } of LANGUAGES) {
    const dictionary = localeDictionary(code);
    const required = ["faq.76.q", "faq.76.a", "faq.77.q", "faq.77.a", "popup.aboutMultiDevice", "popup.privacyMultiDevice"];
    const missing = required.filter((key) => !dictionary[key]);
    if (missing.length) throw new Error(`Missing ${code} product copy: ${missing.join(", ")}`);
    updatePage(code, "faq", currentFaq(dictionary));
    updatePage(code, "privacy", currentPrivacy(dictionary));
    updatePage(code, "terms", currentTerms(dictionary));
  }
  console.log(`Updated current Ultimate Clipboard Pro FAQ, privacy and terms content in ${LANGUAGES.length} languages.`);
}

if (require.main === module) applyCurrentProductContent();

module.exports = { applyCurrentProductContent };
