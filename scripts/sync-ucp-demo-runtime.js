const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");
const extensionRoot = path.resolve(siteRoot, "..", "multi-copy-paste");
const localeNames = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];

function copy(relativeSource, relativeTarget = relativeSource) {
  const source = path.join(extensionRoot, relativeSource);
  const target = path.join(siteRoot, "assets", "extension-runtime", relativeTarget);
  if (!fs.existsSync(source)) throw new Error(`Missing canonical extension asset: ${source}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

copy(path.join("shared", "i18n.js"));
copy(path.join("shared", "locales", "categorySlugs.js"));
localeNames.forEach((language) => copy(path.join("shared", "locales", `${language}.js`)));
copy(path.join("assets", "icons", "arrow_right.png"));
copy(path.join("assets", "icons", "pro-icon.png"));

console.log(`Synced canonical Ultimate Clipboard Pro i18n for ${localeNames.length} languages.`);
