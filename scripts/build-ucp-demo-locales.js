const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const runtimePath = path.join(root, "assets", "extension-runtime", "demo-runtime.js");
const outputDir = path.join(root, "assets", "extension-runtime", "demo-locales");
const languages = {
  fr: "fr", es: "es", it: "it", de: "de", ro: "ro", pt: "pt", ar: "ar",
  zh: "zh-CN", ja: "ja", ru: "ru", nl: "nl", pl: "pl", tr: "tr", ko: "ko", hi: "hi"
};
const baseCopy = {
  general: "General", favorites: "Favorites", trash: "Trash", vault: "Vault", ai: "AI",
  research: "Research", support: "Support", product: "Product", operations: "Operations",
  design: "Design", web: "Web images", blockedTitle: "Demo mode",
  blocked: "This is a visual demo of the extension. Please install the extension to access all features.",
  desktopOnlyTitle: "Demo available on PC only",
  desktopOnly: "Demo mode is available on PC only. Please open this page on a computer to try the visual demo.",
  closeLabel: "Close demo message", imagePrefix: "Demo image", installLabel: "Install extension"
};

function loadEnglishState() {
  const context = {
    window: { location: { search: "?lang=en", pathname: "/ultimate-clipboard-pro/demo/" } },
    URLSearchParams, console, setTimeout, clearTimeout
  };
  context.window.window = context.window;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(runtimePath, "utf8"), context, { filename: runtimePath });
  return context.window.UCP_DEMO_RUNTIME.createDemoState("en");
}

function collectTranslatableStrings(state) {
  const strings = new Set(Object.values(baseCopy));
  const addFields = (entry, fields) => fields.forEach((field) => {
    if (typeof entry?.[field] === "string" && entry[field].trim()) strings.add(entry[field]);
  });
  [...state.categories, ...state.devCategories, ...state.imageCategories].forEach((entry) => addFields(entry, ["name"]));
  state.items.forEach((entry) => {
    addFields(entry, ["title", "content", "preview", "note", "categoryName", "sourceTitle"]);
    (entry.versions || []).forEach((version) => addFields(version, ["title", "content", "preview", "note"]));
    (entry.captureVersions || []).forEach((version) => addFields(version, ["title", "content", "preview", "note"]));
  });
  state.devItems.forEach((entry) => {
    addFields(entry, ["title", "note", "categoryName", "sourceTitle"]);
    (entry.versions || []).forEach((version) => addFields(version, ["title", "note"]));
    (entry.captureVersions || []).forEach((version) => addFields(version, ["title", "note"]));
  });
  state.imageItems.forEach((entry) => addFields(entry, ["title", "altText", "note", "categoryName", "sourceTitle"]));
  return [...strings];
}

async function translate(text, target) {
  if (/^(Ultimate Clipboard Pro|AI|CSS|HTML|JavaScript|TypeScript|React|Python|SQL|Node|API)$/i.test(text)) return text;
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`Translation failed (${response.status}) for ${target}`);
  const payload = await response.json();
  return payload[0].map((part) => part[0]).join("");
}

async function mapWithConcurrency(values, limit, mapper) {
  const results = new Array(values.length);
  let cursor = 0;
  async function worker() {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker));
  return results;
}

async function main() {
  const sourceStrings = collectTranslatableStrings(loadEnglishState());
  fs.mkdirSync(outputDir, { recursive: true });
  for (const [language, target] of Object.entries(languages)) {
    let completed = 0;
    const translated = await mapWithConcurrency(sourceStrings, 8, async (source) => {
      const value = await translate(source, target);
      completed += 1;
      if (completed % 25 === 0) process.stdout.write(`\r${language}: ${completed}/${sourceStrings.length}`);
      return value;
    });
    const dictionary = Object.fromEntries(sourceStrings.map((source, index) => [source, translated[index]]));
    const copy = Object.fromEntries(Object.entries(baseCopy).map(([key, value]) => [key, dictionary[value] || value]));
    const payload = `window.UCP_DEMO_LOCALES = window.UCP_DEMO_LOCALES || {};\nwindow.UCP_DEMO_LOCALES[${JSON.stringify(language)}] = ${JSON.stringify({ copy, dictionary }, null, 2)};\n`;
    fs.writeFileSync(path.join(outputDir, `${language}.js`), payload, "utf8");
    process.stdout.write(`\r${language}: ${sourceStrings.length}/${sourceStrings.length}\n`);
  }
  console.log(`Built ${Object.keys(languages).length} complete demo locale packs (${sourceStrings.length} source strings each).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
