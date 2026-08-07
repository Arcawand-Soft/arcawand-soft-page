const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const languages = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];

function productFile(language, product) {
  return path.join(root, language === "en" ? product : path.join(language, product), "index.html");
}

function productSubpageFile(language, product, subpage) {
  const productRoot = language === "en" ? product : path.join(language, product);
  return path.join(root, productRoot, subpage, "index.html");
}

function writeIfChanged(file, transform) {
  const before = fs.readFileSync(file, "utf8");
  const after = `${transform(before).replace(/[ \t]+$/gm, "").replace(/\s+$/u, "")}\n`;
  if (after !== before) fs.writeFileSync(file, after, "utf8");
}

function removeScriptContaining(html, marker) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (script) => script.includes(marker) ? "" : script);
}

function removeFigglizPlanFeature(html) {
  return html.replace(/<article\b[^>]*class="figgliz-card"[^>]*>[\s\S]*?<\/article>/gi, (card) => {
    return /<h3>\s*(?:Plans|Offres|Planes|Piani|Pl.ne)\s*<\/h3>/i.test(card) ? "" : card;
  });
}

for (const language of languages) {
  writeIfChanged(productFile(language, "figgliz"), (html) => removeFigglizPlanFeature(html
    .replace(/<a\b[^>]*class="figgliz-secondary"[^>]*href="#plans"[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<section\b[^>]*id="plans"[^>]*>[\s\S]*?<\/section>/gi, "")
    .replace(/20260701-pricing/g, "20260807-product-cleanup")));

  for (const subpage of ["faq", "stats", "privacy", "terms"]) {
    writeIfChanged(productSubpageFile(language, "figgliz", subpage), (html) =>
      html.replace(/20260701-pricing/g, "20260807-product-cleanup"));
  }

  writeIfChanged(productFile(language, "ultimate-clipboard-pro"), (html) => {
    let next = html
      .replace(/<script\b[^>]*src="\/assets\/ucp-launch-pricing\.js"[^>]*><\/script>/gi, "")
      .replace(/,"offers":\{"@type":"Offer"[^}]+\}/g, "")
      .replace(/20260515-heading-flow/g, "20260807-drive-sync")
      .replace(/20260620-languages/g, "20260807-drive-sync");
    next = removeScriptContaining(next, "pdt_0NeBVHHvl7TdkOznAvJOk");
    return next;
  });
}

console.log("Updated Ultimate Clipboard Pro and Figgliz presentation pages in 16 languages.");
