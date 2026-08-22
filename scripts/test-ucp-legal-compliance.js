const fs = require("fs");
const path = require("path");
const { LANGUAGES, localizedPath } = require("./language-config");

const root = path.resolve(__dirname, "..");
for (const { code } of LANGUAGES) {
  for (const page of ["ucpFaq", "ucpPrivacy", "ucpTerms", "ucpSales"]) {
    const file = path.join(root, localizedPath(code, page), "index.html");
    if (!fs.existsSync(file)) throw new Error(`${code} missing ${page}`);
    const html = fs.readFileSync(file, "utf8");
    if (!html.includes("contact@arcawand-soft.com")) throw new Error(`${code} ${page} missing contact`);
    if (!html.includes("data-ucp-nav=\"terms\"") || !html.includes("data-ucp-nav=\"sales\"")) {
      throw new Error(`${code} ${page} missing CGU/CGV navigation`);
    }
  }
}
const enPrivacy = fs.readFileSync(path.join(root, "ultimate-clipboard-pro", "privacy", "index.html"), "utf8");
for (const marker of ["Chrome Web Store User Data Policy", "Google API Services User Data Policy", "Limited Use", "drive.file"]) {
  if (!enPrivacy.includes(marker)) throw new Error(`English privacy missing ${marker}`);
}
const enSales = fs.readFileSync(path.join(root, "ultimate-clipboard-pro", "sales", "index.html"), "utf8");
for (const marker of ["merchant of record", "USD 49.00", "three devices", "Activation alone", "mandatory consumer law"]) {
  if (!enSales.includes(marker)) throw new Error(`English sales terms missing ${marker}`);
}
console.log(`PASS UCP legal pages (${LANGUAGES.length} languages × 4 pages)`);
