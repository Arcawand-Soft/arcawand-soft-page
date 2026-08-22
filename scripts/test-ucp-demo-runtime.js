const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { salesNavLabel } = require("./ucp-legal-nav-labels");

const root = path.resolve(__dirname, "..");
const extensionRoot = path.resolve(root, "..", "multi-copy-paste", "extension");
const languages = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];
const runtimeSource = fs.readFileSync(path.join(root, "assets", "extension-runtime", "demo-runtime.js"), "utf8");
assert.ok(runtimeSource.includes("global.MCP.DEFAULT_EXCLUDED_DEMO_URLS = []"), "Demo runtime must bypass extension-only demo URL exclusions");

const syntaxHighlighter = fs.readFileSync(path.join(root, "assets", "extension-runtime", "shared", "codeSyntaxHighlighter.js"), "utf8");
const surfaceBoot = fs.readFileSync(path.join(root, "assets", "extension-runtime", "shared", "surfaceBoot.js"), "utf8");
const demoContentScript = fs.readFileSync(path.join(root, "assets", "extension-runtime", "content", "contentScript.js"), "utf8");
assert(syntaxHighlighter.includes("renderCodeSyntax"), "The demo must ship the canonical syntax-highlighting engine");
assert(surfaceBoot.includes("shared/codeSyntaxHighlighter.js"), "The demo surface boot must load syntax highlighting before rendering cards");
assert.match(
  demoContentScript,
  /mediaType === "dev"[\s\S]{0,180}renderCodeSyntaxSafely\(previewText, fullPreviewText/,
  "Switching a demo code card between V1-V10 must preserve syntax highlighting"
);

const proIcon = fs.readFileSync(path.join(root, "assets", "extension-runtime", "assets", "icons", "pro-icon.png"));
const canonicalProIcon = fs.readFileSync(path.join(extensionRoot, "assets", "icons", "pro-icon.png"));
assert.deepStrictEqual(proIcon, canonicalProIcon, "Demo must use the extension's current Pro badge asset");
for (const stylesheet of ["content/floatingPanel.css", "sidepanel/sidepanel.css"]) {
  const css = fs.readFileSync(path.join(root, "assets", "extension-runtime", stylesheet), "utf8");
  const canonicalCss = fs.readFileSync(path.join(extensionRoot, stylesheet), "utf8");
  assert.strictEqual(css, canonicalCss, `${stylesheet} must remain byte-identical to the extension renderer`);
}
const managerCss = fs.readFileSync(path.join(root, "assets", "extension-runtime", "sidepanel", "sidepanel.css"), "utf8");
assert.match(
  managerCss,
  /:root:not\(\[data-resolved-theme="light"\]\) \.embedded-version-tab:not\(\.is-active\)\s*\{[\s\S]*?--version-tab-bg:\s*color-mix\(/,
  "Inactive demo version tabs need the same lighter dark-theme surface as the extension"
);
const demoSidepanelHtml = fs.readFileSync(path.join(root, "assets", "extension-runtime", "demo-sidepanel.html"), "utf8");
assert(demoSidepanelHtml.includes("sidepanel.css?v=20260822-version-contrast-v4"), "The demo manager stylesheet needs a cache-busting version for the contrast fix");

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
  assert(new RegExp(`data-ucp-nav="sales"[^>]*>${salesNavLabel(language).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</a>`).test(html), `${language} demo top navigation is missing the sales terms link`);
  assert(html.includes(`<a href="../sales/">${salesNavLabel(language)}</a>`), `${language} demo product-pages card is missing the sales terms link`);
}

const arabicContext = contextFor("ar");
const arabicState = arabicContext.window.UCP_DEMO_RUNTIME.createDemoState("ar");
assert(/[\u0600-\u06ff]/.test(arabicState.items[0].content), "Arabic captures were not translated");

const demoScript = fs.readFileSync(path.join(root, "assets", "ucp-demo.js"), "utf8");
assert(demoScript.includes('host.setAttribute("dir", "ltr")'), "Floating demo host needs an explicit LTR boundary");
assert(demoScript.includes("text-align: left !important"), "Arabic demo content must remain left aligned");
assert(demoScript.includes("preloadManager"), "The manager must be warmed before its first opening");
assert(!demoScript.includes("managerShell?.remove()"), "Closing the manager must preserve its warmed iframe");
assert(demoScript.includes("ucp-demo-surface-open"), "An open demo surface must lock the document behind it");
assert(demoScript.includes("prepareIsolatedDemoHost"), "The website demo must not reuse a host injected by the installed extension");
assert(demoScript.includes('const demoFloatingHostId = "ucp-demo-floating-host"'), "The website demo must use a host id that cannot collide with the installed extension");
assert(demoScript.includes("openDemoTools"), "The launcher tools button must open the Pro tools catalog in the demo");
assert(demoScript.includes("UCP_DEMO_TOOL_BLOCKED"), "Tool execution must be blocked by the demo shell");
assert(runtimeSource.includes("forceDemoProRuntime"), "The isolated demo runtime must expose a deterministic Pro capability gate");
assert(runtimeSource.includes('message.surface === "tools" && message.toolId'), "The launcher recent-tool shortcut must be blocked instead of opening a tool");
assert(runtimeSource.includes("Promise.all("), "Shared demo dependencies must not load as one long network waterfall");

const demoManagerHtml = fs.readFileSync(path.join(root, "assets", "extension-runtime", "demo-sidepanel.html"), "utf8");
assert(demoManagerHtml.includes("__UCP_DEMO_FORCE_PRO__"), "The manager must enable Pro mode before its renderer starts");
assert(demoManagerHtml.includes("UCP_DEMO_SELECT_TAB"), "The warmed manager must switch tabs without reloading its iframe");
assert(demoManagerHtml.includes("driveQuickSyncControl.css"), "The Drive quick-sync renderer needs its component stylesheet");
assert(demoManagerHtml.includes("data-manager-action=\"open-tool\""), "The demo manager must intercept tool execution at the interaction boundary");

for (const language of languages) {
  for (const page of ["demo", "faq", "privacy", "terms"]) {
    const route = language === "en"
      ? path.join(root, "ultimate-clipboard-pro", page, "index.html")
      : path.join(root, language, "ultimate-clipboard-pro", page, "index.html");
    const html = fs.readFileSync(route, "utf8");
    const menu = html.match(/<div class="language-menu-panel"[\s\S]*?<\/div>/)?.[0] || "";
    assert.strictEqual((menu.match(/class="language-menu-option"/g) || []).length, 16, `${language}/${page} must expose all 16 languages`);
    if (page === "demo") assert(html.includes("ucp-demo-launcher-preboot"), `${language} demo needs a parser-rendered launcher fallback`);
  }
}

console.log(`Validated Ultimate Clipboard Pro demo runtime in ${languages.length} languages.`);
