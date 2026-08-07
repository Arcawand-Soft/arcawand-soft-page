const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const languages = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function localizedProductPage(language, product) {
  return language === "en"
    ? `${product}/index.html`
    : `${language}/${product}/index.html`;
}

for (const language of languages) {
  const figgliz = read(localizedProductPage(language, "figgliz"));
  assert(!/id=["']plans["']/.test(figgliz), `${language}: Figgliz pricing section is still present`);
  assert(!/href=["']#plans["']/.test(figgliz), `${language}: Figgliz pricing CTA is still present`);
  assert(!/data-checkout-plan/.test(figgliz), `${language}: Figgliz checkout control is still present`);
  assert(!/<h3>Plans<\/h3>|<h3>Offres<\/h3>|<h3>Planes<\/h3>|<h3>Piani<\/h3>/i.test(figgliz), `${language}: Figgliz plan feature card is still present`);

  const clipboard = read(localizedProductPage(language, "ultimate-clipboard-pro"));
  assert(!/ucp-launch-pricing\.js/.test(clipboard), `${language}: UCP pricing patch is still loaded`);
  assert(!/checkout\.dodopayments\.com\/buy\/pdt_0NeBVHHvl7TdkOznAvJOk/.test(clipboard), `${language}: UCP direct checkout remains in the product page`);

  for (const subpage of ["faq", "stats", "privacy", "terms"]) {
    const figglizSubpage = read(language === "en"
      ? `figgliz/${subpage}/index.html`
      : `${language}/figgliz/${subpage}/index.html`);
    assert(figglizSubpage.includes("20260807-product-cleanup"), `${language}/${subpage}: stale Figgliz asset version`);
  }
}

const ucpRuntime = read("assets/ucp-product-pages.js");
assert(ucpRuntime.includes("ucp-drive-sync-showcase"), "The Drive synchronization showcase is missing");
assert(ucpRuntime.includes("maximumDevices: 3"), "The three-device limit is not encoded in the showcase copy");
for (const language of languages) {
  assert(new RegExp(`\\b${language}:\\s*\\{`).test(ucpRuntime), `${language}: Drive showcase translation is missing`);
}

const figglizRuntime = read("assets/figgliz-product-pages.js");
assert(!/setupProductHeaderScroll\(\);\s*setupPricingTabs\(\)/.test(figglizRuntime), "Figgliz still initializes browser-side pricing");

const demoRuntime = read("assets/extension-runtime/content/contentScript.js");
assert(demoRuntime.includes('class="mcp-launcher-manager"'), "The demo launcher is missing the current manager button");
assert(demoRuntime.includes("launcher-collapse-arrow-icon"), "The demo launcher is missing the current collapse icon");

const demoStyles = read("assets/extension-runtime/content/floatingPanel.css");
assert(demoStyles.includes(".mcp-panel.is-minimized .mcp-launcher-manager"), "The demo manager button is not styled");

console.log("Product presentation regression checks passed for all 16 languages.");
