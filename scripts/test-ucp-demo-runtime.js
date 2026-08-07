const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const languages = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];
const runtimeSource = fs.readFileSync(path.join(root, "assets", "extension-runtime", "demo-runtime.js"), "utf8");

const proIcon = fs.readFileSync(path.join(root, "assets", "extension-runtime", "assets", "icons", "pro-icon.png"));
assert.strictEqual(proIcon.readUInt32BE(16), 360, "Demo must use the current 360px Pro badge asset");
assert.strictEqual(proIcon.readUInt32BE(20), 360, "Demo Pro badge must remain square");
for (const stylesheet of ["content/floatingPanel.css", "sidepanel/sidepanel.css"]) {
  const css = fs.readFileSync(path.join(root, "assets", "extension-runtime", stylesheet), "utf8");
  assert(css.includes('img[src*="pro-icon.png"]'), `${stylesheet} must style the Pro PNG itself`);
  assert(css.includes("drop-shadow(1.25px 0 0 #fff)"), `${stylesheet} must keep the fine white Pro outline`);
  assert(/\.brand-pro-badge\s*\{[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;/m.test(css), `${stylesheet} Pro badge container must stay transparent`);
}

function contextFor(language) {
  const window = { location: { search: `?lang=${language}`, pathname: `/${language}/ultimate-clipboard-pro/demo/` } };
  window.window = window;
  const context = { window, URLSearchParams, console, setTimeout, clearTimeout };
  vm.createContext(context);
  if (language !== "en") {
    vm.runInContext(fs.readFileSync(path.join(root, "assets", "extension-runtime", "demo-locales", `${language}.js`), "utf8"), context);
  }
  vm.runInContext(runtimeSource, context);
  return context;
}

for (const language of languages) {
  const context = contextFor(language);
  const runtime = context.window.UCP_DEMO_RUNTIME;
  assert(runtime.supportedLanguages.includes(language), `${language} must be supported`);
  const state = runtime.createDemoState(language);
  assert.strictEqual(state.settings.language, language, `${language} state language mismatch`);
  assert(state.items.length >= 20, `${language} needs a rich text dataset`);
  assert(state.devItems.length >= 10, `${language} needs a rich code dataset`);
  assert(state.imageItems.length >= 10, `${language} needs a rich image dataset`);
  assert(state.categories.some((category) => category.parentId), `${language} needs subcategories`);
  if (language !== "en") {
    const pack = context.window.UCP_DEMO_LOCALES[language];
    assert(Object.keys(pack.dictionary).length >= 280, `${language} locale dictionary is incomplete`);
    assert(runtime.copyByLang[language]?.installLabel, `${language} install label is missing`);
    assert.notStrictEqual(state.items[0].captureVersions[0].content, contextFor("en").window.UCP_DEMO_RUNTIME.createDemoState("en").items[0].captureVersions[0].content, `${language} active capture version was not translated`);
  }
  const route = language === "en"
    ? path.join(root, "ultimate-clipboard-pro", "demo", "index.html")
    : path.join(root, language, "ultimate-clipboard-pro", "demo", "index.html");
  const html = fs.readFileSync(route, "utf8");
  assert(html.startsWith("<!doctype html>\n<html"), `${language} demo route has content before its html element`);
  assert(html.includes(`data-ucp-demo-lang="${language}"`), `${language} demo route points to the wrong runtime locale`);
  assert(html.includes("assets/icons/arrow_right.png"), `${language} demo route does not preload the launcher arrow`);
}

const arabicContext = contextFor("ar");
const arabicState = arabicContext.window.UCP_DEMO_RUNTIME.createDemoState("ar");
assert(/[\u0600-\u06ff]/.test(arabicState.items[0].content), "Arabic captures were not translated");

const demoScript = fs.readFileSync(path.join(root, "assets", "ucp-demo.js"), "utf8");
assert(demoScript.includes('host.setAttribute("dir", "ltr")'), "Floating demo host needs an explicit LTR boundary");
assert(demoScript.includes("text-align: left !important"), "Arabic demo content must remain left aligned");

console.log(`Validated Ultimate Clipboard Pro demo runtime in ${languages.length} languages.`);
