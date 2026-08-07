const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const languages = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];

for (const language of languages) {
  const relative = language === "en"
    ? path.join("ultimate-clipboard-pro", "demo", "index.html")
    : path.join(language, "ultimate-clipboard-pro", "demo", "index.html");
  const file = path.join(root, relative);
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<!doctype html>[\s\S]*?<html/i, "<!doctype html>\n<html");
  html = html.replace(/data-ucp-demo-lang="[^"]+"/g, `data-ucp-demo-lang="${language}"`);
  html = html.replace(/\/assets\/ucp-demo\.css\?v=[^"']+/g, "/assets/ucp-demo.css?v=20260807-launcher-match");
  html = html.replace(/\/assets\/ucp-demo\.js\?v=[^"']+/g, "/assets/ucp-demo.js?v=20260807-pro-badge");
  if (!html.includes("assets/icons/arrow_right.png")) {
    html = html.replace(
      /(<link[^>]+href="\/assets\/extension-runtime\/assets\/icons\/icon128\.png"[^>]*>)/i,
      '$1<link rel="preload" as="image" href="/assets/extension-runtime/assets/icons/arrow_right.png">'
    );
  }
  fs.writeFileSync(file, html, "utf8");
}

console.log(`Refreshed ${languages.length} Ultimate Clipboard Pro demo routes.`);
