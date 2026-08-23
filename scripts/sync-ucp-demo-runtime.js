const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");
const extensionRoot = path.resolve(siteRoot, "..", "multi-copy-paste", "extension");
const runtimeRoot = path.join(siteRoot, "assets", "extension-runtime");
const localeNames = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];

function copy(relativeSource, relativeTarget = relativeSource) {
  const source = path.join(extensionRoot, relativeSource);
  const target = path.join(siteRoot, "assets", "extension-runtime", relativeTarget);
  if (!fs.existsSync(source)) throw new Error(`Missing canonical extension asset: ${source}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyDirectory(relativeSource, relativeTarget = relativeSource, filter = () => true) {
  const sourceRoot = path.join(extensionRoot, relativeSource);
  const targetRoot = path.join(siteRoot, "assets", "extension-runtime", relativeTarget);
  if (!fs.existsSync(sourceRoot)) throw new Error(`Missing canonical extension directory: ${sourceRoot}`);
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    const source = path.join(relativeSource, entry.name);
    const target = path.join(relativeTarget, entry.name);
    if (!filter(source, entry)) continue;
    if (entry.isDirectory()) {
      copyDirectory(source, target, filter);
    } else {
      copy(source, target);
    }
  }
}

function removeExcludedRuntimeDirectory(relativeTarget) {
  const target = path.resolve(runtimeRoot, relativeTarget);
  if (!target.startsWith(`${path.resolve(runtimeRoot)}${path.sep}`)) {
    throw new Error(`Refusing to remove a path outside the demo runtime: ${target}`);
  }
  fs.rmSync(target, { recursive: true, force: true });
}

function enableDemoOnlyProHook() {
  const target = path.join(runtimeRoot, "shared", "surfaceBoot.js");
  const source = fs.readFileSync(target, "utf8");
  const anchor = "    if (surface === \"manager\") await loadScript(\"shared/classifier.js\");";
  const hook = "    if (globalThis.__UCP_DEMO_FORCE_PRO__) globalThis.UCP_DEMO_RUNTIME?.forceDemoProRuntime?.();\n";
  if (!source.includes(anchor)) throw new Error("Unable to locate the manager boot hook in surfaceBoot.js");
  if (!source.includes(hook.trim())) fs.writeFileSync(target, source.replace(anchor, `${hook}${anchor}`), "utf8");
}

function isolateDemoFloatingHost() {
  const target = path.join(runtimeRoot, "content", "contentScript.js");
  const source = fs.readFileSync(target, "utf8");
  if (!source.includes("mcp-floating-host")) throw new Error("Unable to locate the canonical floating host id");
  fs.writeFileSync(target, source.replaceAll("mcp-floating-host", "ucp-demo-floating-host"), "utf8");
}

function resolveDemoStylesheetImports() {
  const target = path.join(runtimeRoot, "content", "floatingPanel.css");
  const source = fs.readFileSync(target, "utf8");
  const canonicalImport = '@import url("../shared/managerButton.css");';
  if (!source.includes(canonicalImport)) throw new Error("Unable to locate the canonical manager-button stylesheet import");
  fs.writeFileSync(
    target,
    source.replace(canonicalImport, '@import url("/assets/extension-runtime/shared/managerButton.css");'),
    "utf8"
  );
}

// The public demo deliberately reuses the extension's production renderers.
// Synchronizing the public renderer directories prevents UI drift. OCR model
// binaries are intentionally excluded: the website demo never runs OCR and
// shipping them would add tens of megabytes to every deployment.
copyDirectory("shared", "shared", (source) => !source.replace(/\\/g, "/").includes("shared/vendor/tesseract"));
enableDemoOnlyProHook();
removeExcludedRuntimeDirectory(path.join("shared", "vendor", "tesseract"));
copy(path.join("content", "contentScript.js"));
isolateDemoFloatingHost();
copy(path.join("content", "floatingPanel.css"));
resolveDemoStylesheetImports();
copy(path.join("sidepanel", "sidepanel.js"));
copy(path.join("sidepanel", "sidepanel.css"));
copyDirectory(path.join("assets", "icons"), path.join("assets", "icons"), (source) => !source.replace(/\\/g, "/").includes("assets/icons/welcome"));
removeExcludedRuntimeDirectory(path.join("assets", "icons", "welcome"));
copyDirectory(path.join("assets", "emoji-flags"));

console.log(`Synced the canonical Ultimate Clipboard Pro demo runtime for ${localeNames.length} languages.`);
