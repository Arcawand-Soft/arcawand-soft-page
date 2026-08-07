const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { LANGUAGES, localizedUrl } = require("./language-config");

const root = path.resolve(__dirname, "..");
const version = "20260807-landing-language-alignment";
const installModal = fs.readFileSync(path.join(root, "assets", "install-extension-modal.js"), "utf8");
const landingCss = fs.readFileSync(path.join(root, "assets", "ucp-landing.css"), "utf8");

assert.ok(!landingCss.includes('"Arial Narrow"'), "Landing typography must not use a condensed system face");
assert.ok(!/text-transform:\s*uppercase/.test(landingCss), "Landing copy must not be forced into all caps");
assert.match(landingCss, /\.ucp-flow-card img\s*\{[^}]*height:\s*auto;[^}]*object-fit:\s*contain;/s, "Flow screenshots must preserve their intrinsic ratio");
assert.match(landingCss, /\.ucp-language-name\s*\{[^}]*text-align:\s*left;/s, "Every language name, including Arabic, must align left inside its chip");

function pageFile(language) {
  return path.join(root, language.code === "en" ? "" : language.code, "ultimate-clipboard-pro", "index.html");
}

for (const language of LANGUAGES) {
  const file = pageFile(language);
  assert.ok(fs.existsSync(file), `Missing page: ${file}`);
  const html = fs.readFileSync(file, "utf8");
  const label = language.code;

  assert.strictEqual((html.match(/<h1\b/g) || []).length, 1, `${label}: expected one H1`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || "";
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || "";
  const descriptionMinimum = ["zh", "ja", "ko"].includes(label) ? 35 : 70;
  assert.ok(title.length >= 35 && title.length <= 75, `${label}: useful SEO title`);
  assert.ok(description.length >= descriptionMinimum && description.length <= 170, `${label}: useful SEO description`);
  assert.ok(html.includes(`<link rel="canonical" href="${localizedUrl(language.code, "ucp")}">`), `${label}: canonical URL`);
  assert.strictEqual((html.match(/rel="alternate" hreflang=/g) || []).length, LANGUAGES.length + 1, `${label}: hreflang graph`);
  assert.ok(html.includes('type="application/ld+json"'), `${label}: structured data`);
  assert.ok(html.includes(`ucp-landing.css?v=${version}`), `${label}: landing CSS`);
  assert.ok(html.includes(`ucp-landing.js?v=${version}`), `${label}: landing JavaScript`);
  assert.ok(!html.includes('id="root"'), `${label}: no client-rendered root`);
  assert.ok(!html.includes("index-BRdfzjER.js"), `${label}: no legacy React bundle`);
  assert.ok(!html.includes("ucp-email-floating"), `${label}: no intrusive legacy email prompt`);
  assert.strictEqual((html.match(/data-install-extension-trigger="true"/g) || []).length, 2, `${label}: install actions`);
  assert.ok(!/dodo|checkout|id="(?:pro|pricing)"/i.test(html), `${label}: no pricing or checkout block`);
  assert.ok(html.includes("ucp-capture-panel-text") && html.includes("ucp-capture-panel-code") && html.includes("ucp-capture-panel-image"), `${label}: three capture workspaces`);
  assert.ok(html.includes("ucp-drive-section") && html.includes("ucp-faq-section"), `${label}: Drive and FAQ sections`);
  assert.ok(html.includes("ucp-language-showcase"), `${label}: early language showcase`);
  assert.strictEqual((html.match(/class="ucp-language-chip"/g) || []).length, LANGUAGES.length, `${label}: every supported language is listed`);
  assert.ok(!html.includes("__ARC_"), `${label}: no translation extraction marker`);
  if (label !== "en") assert.ok(!html.includes("What should I try first after installing?"), `${label}: localized closing call to action`);
  assert.ok(!/[\uFFFD]/.test(html), `${label}: no replacement character`);
  assert.strictEqual(/<html[^>]*dir="rtl"/.test(html), Boolean(language.rtl), `${label}: RTL direction`);
  if (label === "fr") {
    for (const oldTitleCase of ["Trois Espaces de Travail Dédiés", "Recherche Avancée", "Lanceur Flottant", "Chronologie Visuelle des Sources", "Texte, Code et Images"]) {
      assert.ok(!html.includes(oldTitleCase), `fr: no English-style title casing for ${oldTitleCase}`);
    }
  }
  assert.ok(new RegExp(`^\\s{4}${label}: \\{`, "m").test(installModal), `${label}: localized install modal`);

  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    assert.ok(/\bwidth="\d+"/.test(image[0]) && /\bheight="\d+"/.test(image[0]), `${label}: intrinsic image dimensions`);
  }
}

console.log(`Ultimate Clipboard Pro landing checks passed for ${LANGUAGES.length} languages.`);
