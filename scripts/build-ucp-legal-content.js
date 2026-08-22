const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const extensionLocales = path.resolve(root, "..", "multi-copy-paste", "extension", "shared", "locales");
const extensionLegalLocales = path.resolve(root, "..", "multi-copy-paste", "extension", "shared", "legalLocales");
const output = path.join(__dirname, "ucp-legal-content.json");
const keys = [
  "popup.terms", "popup.termsTitle", "popup.salesTerms", "popup.salesTermsTitle",
  "popup.faq", "popup.faqTitle", "popup.privacy", "popup.privacyTitle",
  "popup.privacyIntro", "popup.privacyLocal", "popup.privacyData", "popup.privacyNoSale",
  "popup.privacyNoAds", "popup.privacyPermissions", "popup.privacyControl", "popup.privacyDodo",
  "popup.privacyMultiDevice", "popup.privacyGoogleData", "popup.privacyLicenseService",
  "popup.privacyRetention", "popup.privacySecurity", "popup.privacyLimitedUse", "popup.privacyWebsite",
  "popup.privacyContact",
  ...[...Array.from({ length: 20 }, (_, index) => String(index + 1).padStart(2, "0")), "76", "77", "78", "79", "80", "81", "82", "83", "84", "85"].flatMap((id) => [`faq.${id}.q`, `faq.${id}.a`]),
  ...Array.from({ length: 14 }, (_, index) => `popup.terms.${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 14 }, (_, index) => `popup.salesTerms.${String(index + 1).padStart(2, "0")}`)
];

const legal = {};
for (const file of fs.readdirSync(extensionLocales).filter((name) => /^[a-z]{2}\.js$/.test(name))) {
  const sandbox = { globalThis: {} };
  vm.runInNewContext(fs.readFileSync(path.join(extensionLocales, file), "utf8"), sandbox, { filename: file });
  vm.runInNewContext(fs.readFileSync(path.join(extensionLegalLocales, file), "utf8"), sandbox, { filename: `legal-${file}` });
  const code = path.basename(file, ".js");
  const dictionary = sandbox.globalThis.MCP_LOCALES?.[code] || {};
  const missing = keys.filter((key) => !dictionary[key]);
  if (missing.length) throw new Error(`${code} is missing: ${missing.join(", ")}`);
  legal[code] = Object.fromEntries(keys.map((key) => [key, dictionary[key]]));
}
fs.writeFileSync(output, `${JSON.stringify(legal, null, 2)}\n`, "utf8");
console.log(`Generated legal content for ${Object.keys(legal).length} languages.`);
