const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { salesNavLabel } = require("./ucp-legal-nav-labels");

const root = path.resolve(__dirname, "..");
const extensionRoot = path.resolve(root, "..", "multi-copy-paste", "extension");
const languages = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];
const runtimeSource = fs.readFileSync(path.join(root, "assets", "extension-runtime", "demo-runtime.js"), "utf8");
const zoomSource = fs.readFileSync(path.join(root, "assets", "ucp-demo-zoom.js"), "utf8");
const refreshDemoPagesSource = fs.readFileSync(path.join(root, "scripts", "refresh-ucp-demo-pages.js"), "utf8");
assert(refreshDemoPagesSource.includes("20260823-demo-sandbox-v1"), "The demo route refresher must preserve the zoom-parity asset version");
assert(refreshDemoPagesSource.includes("ucp-demo-zoom.js"), "The demo route refresher must preserve the first-paint zoom bridge");
const canonicalZoomGuard = fs.readFileSync(path.join(extensionRoot, "shared", "uiZoomGuard.js"), "utf8");
const demoZoomGuard = fs.readFileSync(path.join(root, "assets", "extension-runtime", "shared", "uiZoomGuard.js"), "utf8");
assert.strictEqual(demoZoomGuard, canonicalZoomGuard, "Demo surfaces must use the extension's canonical zoom guard");
assert.ok(runtimeSource.includes("global.MCP.DEFAULT_EXCLUDED_DEMO_URLS = []"), "Demo runtime must bypass extension-only demo URL exclusions");
assert(runtimeSource.includes("DEMO_MUTATION_MESSAGE_TYPES"), "Demo mutations must be governed by an explicit deny-list");
assert(runtimeSource.includes("installMutationGuards"), "Direct storage mutation helpers must be guarded in demo mode");

const syntaxHighlighter = fs.readFileSync(path.join(root, "assets", "extension-runtime", "shared", "codeSyntaxHighlighter.js"), "utf8");
const surfaceBoot = fs.readFileSync(path.join(root, "assets", "extension-runtime", "shared", "surfaceBoot.js"), "utf8");
const demoContentScript = fs.readFileSync(path.join(root, "assets", "extension-runtime", "content", "contentScript.js"), "utf8");
const canonicalContentScript = fs.readFileSync(path.join(extensionRoot, "content", "contentScript.js"), "utf8");
assert.strictEqual(
  demoContentScript.replaceAll("ucp-demo-floating-host", "mcp-floating-host"),
  canonicalContentScript,
  "Floating panels, popups, dialogs, tools and toasts must use the canonical extension renderer"
);
assert.strictEqual(
  fs.readFileSync(path.join(root, "assets", "extension-runtime", "sidepanel", "sidepanel.js"), "utf8"),
  fs.readFileSync(path.join(extensionRoot, "sidepanel", "sidepanel.js"), "utf8"),
  "Manager cards, buttons, menus, dialogs and tools must use the canonical extension renderer"
);
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
  const normalizedDemoCss = stylesheet === "content/floatingPanel.css"
    ? css.replace('/assets/extension-runtime/shared/managerButton.css', '../shared/managerButton.css')
    : css;
  assert.strictEqual(normalizedDemoCss, canonicalCss, `${stylesheet} must remain canonical apart from its public import URL`);
}
for (const [stylesheet, selector] of [
  ["content/floatingPanel.css", ".mcp-floating-menu button"],
  ["sidepanel/sidepanel.css", ".manager-menu-popover button"],
  ["popup/popup.css", ".popup-menu-popover button"]
]) {
  const css = fs.readFileSync(path.join(extensionRoot, stylesheet), "utf8");
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(
    css,
    new RegExp(`${escapedSelector}\\s*\\{[\\s\\S]*?font-size:\\s*14px;[\\s\\S]*?line-height:\\s*1\\.2;`),
    `${stylesheet} must define the same compact menu typography explicitly`
  );
}
assert(
  fs.readFileSync(path.join(root, "assets", "extension-runtime", "content", "floatingPanel.css"), "utf8")
    .startsWith('@import url("/assets/extension-runtime/shared/managerButton.css");'),
  "Floating demo buttons must load their shared stylesheet from the public runtime root"
);
for (const stylesheet of ["shared/driveQuickSyncControl.css", "shared/guidedTour.css", "shared/managerButton.css"]) {
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
assert(demoSidepanelHtml.includes('../shared/uiZoomGuard.js'), "The demo manager must boot the canonical zoom guard before rendering");
assert(demoSidepanelHtml.includes("sidepanel.css?v=20260823-demo-sandbox-v1"), "The demo manager stylesheet needs a cache-busting version for compact menu typography");

function contextFor(language) {
  const window = { location: { search: `?lang=${language}`, pathname: `/${language}/ultimate-clipboard-pro/demo/` } };
  window.window = window;
  const context = { window, URLSearchParams, console, setTimeout, clearTimeout };
  vm.createContext(context);
  vm.runInContext(zoomSource, context);
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
  assert(runtime.copyByLang[language]?.blockedTitle, `${language} demo blocked-action title is missing`);
  assert(runtime.copyByLang[language]?.blocked, `${language} demo blocked-action explanation is missing`);
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
  assert(html.includes('/assets/ucp-demo-zoom.js?v=20260823-zoom-parity-v1'), `${language} demo must establish native UI scale before first paint`);
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
assert(demoManagerHtml.includes("installMutationGuards()"), "The manager must arm demo mutation guards before user interaction");

const mutationTypes = [
  "MCP_CREATE_CATEGORY",
  "MCP_UPDATE_CATEGORY",
  "MCP_DELETE_ITEM",
  "MCP_TOGGLE_FAVORITE",
  "MCP_UPDATE_DEV_ITEM",
  "MCP_DELETE_IMAGE_ITEM",
  "MCP_CLEAR_HISTORY"
];
const runtimeContract = contextFor("en").window.UCP_DEMO_RUNTIME;
assert.strictEqual(runtimeContract.snapChromeZoomFactor(1.012), 1, "Browser chrome width must not create a false 110% zoom");
assert.strictEqual(runtimeContract.snapChromeZoomFactor(1.38), 1, "A docked side panel or DevTools must not be mistaken for browser zoom");
assert.strictEqual(runtimeContract.snapChromeZoomFactor(1.108), 1.1, "110% browser zoom must be detected");
assert.strictEqual(runtimeContract.snapChromeZoomFactor(1.505), 1.5, "150% browser zoom must be detected");
assert.strictEqual(runtimeContract.snapChromeZoomFactor(1.602), 1.6, "160% browser zoom must be detected");

for (const [ratio, expected] of [[1, 1], [1.1, 1.1], [1.5, 1.5], [1.6, 1.6]]) {
  const styleValues = {};
  const window = {
    outerWidth: 1280 * ratio,
    innerWidth: 1280,
    document: { documentElement: { style: { setProperty: (key, value) => { styleValues[key] = value; } } } },
    addEventListener: () => {},
    visualViewport: { addEventListener: () => {} }
  };
  window.window = window;
  const zoomContext = { window };
  vm.createContext(zoomContext);
  vm.runInContext(zoomSource, zoomContext);
  assert.strictEqual(window.UCP_DEMO_ZOOM.getFactor(), expected, `${Math.round(ratio * 100)}% zoom must be available before demo paint`);
  assert.strictEqual(styleValues["--ucp-demo-page-zoom-inverse"], String(1 / expected), `${Math.round(ratio * 100)}% inverse scale is incorrect`);
}
mutationTypes.forEach((type) => assert(runtimeContract.isDemoMutationMessage(type), `${type} must be blocked in demo mode`));
assert(!runtimeContract.isDemoMutationMessage("MCP_GET_STATE"), "Read-only state access must remain available");
assert(!runtimeContract.isDemoMutationMessage("MCP_OPEN_TOOLS_OVERLAY"), "Opening an exploratory surface must remain available");

const demoCss = fs.readFileSync(path.join(root, "assets", "ucp-demo.css"), "utf8");
assert.match(demoCss, /\.ucp-real-demo-manager-frame\s*\{[\s\S]*?width:\s*100vw;[\s\S]*?height:\s*100vh;/, "The demo manager must use the same full viewport as the extension");
assert.match(demoCss, /html\.ucp-demo-surface-open\s+#ucp-demo-floating-host/, "The real demo launcher must disappear behind the manager");
assert.match(demoCss, /html\.ucp-demo-surface-open\s+\.ucp-demo-launcher-preboot/, "The preboot launcher must disappear behind the manager");
assert.match(demoCss, /\.ucp-demo-launcher-preboot\s*\{[\s\S]*?transform:\s*scale\(var\(--ucp-demo-page-zoom-inverse, 1\)\)/, "The preboot launcher must render at the extension's native scale");
assert.match(demoCss, /\.ucp-real-demo-dialog\s*\{[\s\S]*?font-family:\s*Inter,[\s\S]*?scale\(var\(--ucp-demo-page-zoom-inverse, 1\)\)/, "Demo-only dialogs must use the extension typography and native scale");

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

(async () => {
  const context = contextFor("fr");
  let blockedCount = 0;
  const bridge = context.window.UCP_DEMO_RUNTIME.makeStateBridge("fr", { showBlocked: () => { blockedCount += 1; } });
  bridge.installChromeMock();
  assert.strictEqual(
    context.window.chrome.runtime.getURL("content/floatingPanel.css"),
    "/assets/extension-runtime/content/floatingPanel.css?v=20260823-menu-typography-v2",
    "The canonical floating stylesheet must bypass stale public caches"
  );
  const zoomResponse = await context.window.chrome.runtime.sendMessage({ type: "MCP_GET_PAGE_ZOOM" });
  assert.strictEqual(zoomResponse.data.zoomFactor, 1, "The demo runtime must implement the extension zoom-message contract");
  const initialState = bridge.currentState();
  const initialCategoryCount = initialState.categories.length;
  const response = await context.window.chrome.runtime.sendMessage({
    type: "MCP_CREATE_CATEGORY",
    category: { name: "Ma catégorie", icon: "folder", color: "#e50914" }
  });
  assert.strictEqual(response.ok, true, "Creating a sandbox category must succeed");
  assert.strictEqual(bridge.currentState().categories.length, initialCategoryCount + 1, "The created category must live in demo memory");

  const protectedRename = await context.window.chrome.runtime.sendMessage({
    type: "MCP_UPDATE_CATEGORY",
    categoryId: "ai",
    updates: { name: "Renamed default" }
  });
  assert.strictEqual(protectedRename.ok, false, "A bundled demo category name must remain immutable");
  assert.strictEqual(bridge.currentState().categories.find((item) => item.id === "ai").name, initialState.categories.find((item) => item.id === "ai").name);

  context.window.MCP = {
    saveClipboardItem: async () => ({ item: { id: "allowed-text" } }),
    saveDevItem: async () => ({ item: { id: "forbidden-code" } })
  };
  bridge.installMutationGuards();
  assert.strictEqual((await context.window.MCP.saveClipboardItem({ content: "allowed" })).item.id, "allowed-text", "Text creation stays available in the sandbox");
  await assert.rejects(() => context.window.MCP.saveDevItem({ content: "forbidden" }), /Demo mode/);
  assert.strictEqual(blockedCount, 1, "Adjacent denied actions must coalesce into one stable demo alert");

  const sandboxState = bridge.currentState();
  await context.window.chrome.storage.local.set({
    mcp_clipboard_items: sandboxState.items.concat({ id: "user-text", content: "Sandbox text", categoryId: "general" })
  });
  assert(bridge.currentState().items.some((item) => item.id === "user-text"), "User-created text must persist for the current demo session");
  await assert.rejects(() => context.window.chrome.storage.local.set({
    mcp_dev_items: sandboxState.devItems.concat({ id: "user-code", content: "const forbidden = true;" })
  }), /Demo mode/, "Code creation must remain unavailable");

  const reorderedCategories = bridge.currentState().categories.map((category) => category.id === "ai" ? { ...category, order: 999 } : category);
  await context.window.chrome.storage.local.set({ mcp_categories: reorderedCategories });
  assert.strictEqual(bridge.currentState().categories.find((item) => item.id === "ai").order, 999, "Bundled categories may be reordered");
  await assert.rejects(() => context.window.chrome.storage.local.set({
    mcp_categories: bridge.currentState().categories.filter((category) => !category.id.startsWith("cat-demo-"))
  }), /Demo mode/, "Categories must not be deletable in the demo sandbox");

  console.log(`Validated Ultimate Clipboard Pro demo runtime in ${languages.length} languages.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
