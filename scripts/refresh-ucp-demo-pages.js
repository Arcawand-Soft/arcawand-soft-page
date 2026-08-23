const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const languages = ["en", "fr", "es", "it", "de", "ro", "pt", "ar", "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"];
const prebootLauncher = '<aside class="ucp-demo-launcher-preboot" dir="ltr" aria-hidden="true"><span class="ucp-demo-launcher-preboot__collapse"><img src="/assets/extension-runtime/assets/icons/arrow_right.png" alt=""></span><span class="ucp-demo-launcher-preboot__brand"><img src="/assets/extension-runtime/assets/icons/icon128.png" alt=""></span><span class="ucp-demo-launcher-preboot__utility"><span aria-hidden="true">↗</span></span><span class="ucp-demo-launcher-preboot__utility"><img src="/assets/extension-runtime/assets/icons/tootls.png" alt=""></span><span class="ucp-demo-launcher-preboot__utility ucp-demo-launcher-preboot__recent"><img src="/assets/extension-runtime/assets/icons/tools-icons/emojis.png" alt=""></span><span class="ucp-demo-launcher-preboot__utility"><img src="/assets/extension-runtime/assets/icons/screen_full_page_png.png" alt=""></span></aside>';

for (const language of languages) {
  const relative = language === "en"
    ? path.join("ultimate-clipboard-pro", "demo", "index.html")
    : path.join(language, "ultimate-clipboard-pro", "demo", "index.html");
  const file = path.join(root, relative);
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<!doctype html>[\s\S]*?<html/i, "<!doctype html>\n<html");
  html = html.replace(/data-ucp-demo-lang="[^"]+"/g, `data-ucp-demo-lang="${language}"`);
  html = html.replace(/\/assets\/ucp-demo\.css\?v=[^"']+/g, "/assets/ucp-demo.css?v=20260823-zoom-parity-v1");
  html = html.replace(/\/assets\/ucp-demo\.js\?v=[^"']+/g, "/assets/ucp-demo.js?v=20260823-demo-sandbox-v1");
  if (!html.includes("/assets/ucp-demo-zoom.js")) {
    html = html.replace(
      /(<link rel="stylesheet" href="\/assets\/ucp-demo\.css\?v=[^"]+">)/i,
      '<script src="/assets/ucp-demo-zoom.js?v=20260823-zoom-parity-v1"></script>\n$1'
    );
  }
  if (!html.includes('class="ucp-demo-launcher-preboot"')) html = html.replace(/(<body[^>]*>)/i, `$1\n${prebootLauncher}`);
  if (!html.includes("assets/icons/arrow_right.png")) {
    html = html.replace(
      /(<link[^>]+href="\/assets\/extension-runtime\/assets\/icons\/icon128\.png"[^>]*>)/i,
      '$1<link rel="preload" as="image" href="/assets/extension-runtime/assets/icons/arrow_right.png">'
    );
  }
  fs.writeFileSync(file, html, "utf8");
}

console.log(`Refreshed ${languages.length} Ultimate Clipboard Pro demo routes.`);
