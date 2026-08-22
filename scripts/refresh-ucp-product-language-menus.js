const fs = require("fs");
const path = require("path");
const { LANGUAGE_CODES, languageMenu } = require("./language-config");

const root = path.resolve(__dirname, "..");
const pageKeys = { demo: "ucpDemo", faq: "ucpFaq", privacy: "ucpPrivacy", terms: "ucpTerms" };
const chromeLabels = {
  en: { language: "Change language", back: "Back to ArcaWand Soft" },
  fr: { language: "Changer de langue", back: "Retour vers ArcaWand Soft" },
  es: { language: "Cambiar idioma", back: "Volver a ArcaWand Soft" },
  it: { language: "Cambia lingua", back: "Torna ad ArcaWand Soft" },
  de: { language: "Sprache wechseln", back: "Zurück zu ArcaWand Soft" },
  ro: { language: "Schimbă limba", back: "Înapoi la ArcaWand Soft" },
  pt: { language: "Mudar idioma", back: "Voltar para ArcaWand Soft" },
  ar: { language: "تغيير اللغة", back: "العودة إلى ArcaWand Soft" },
  zh: { language: "更改语言", back: "返回 ArcaWand Soft" },
  ja: { language: "言語を変更", back: "ArcaWand Soft に戻る" },
  ru: { language: "Изменить язык", back: "Вернуться к ArcaWand Soft" },
  nl: { language: "Taal wijzigen", back: "Terug naar ArcaWand Soft" },
  pl: { language: "Zmień język", back: "Wróć do ArcaWand Soft" },
  tr: { language: "Dili değiştir", back: "ArcaWand Soft'a dön" },
  ko: { language: "언어 변경", back: "ArcaWand Soft로 돌아가기" },
  hi: { language: "भाषा बदलें", back: "ArcaWand Soft पर वापस जाएँ" }
};

function refreshUcpProductLanguageMenus() {
  let updated = 0;
  for (const language of LANGUAGE_CODES) {
    const base = language === "en" ? "ultimate-clipboard-pro" : path.join(language, "ultimate-clipboard-pro");
    for (const [page, pageKey] of Object.entries(pageKeys)) {
      const file = path.join(root, base, page, "index.html");
      if (!fs.existsSync(file)) throw new Error(`Missing Ultimate Clipboard Pro route: ${file}`);
      const html = fs.readFileSync(file, "utf8");
      const labels = chromeLabels[language];
      const next = html
        .replace(/<div class="language-menu arcawand-product-language-menu"[\s\S]*?<\/div><\/div>/, languageMenu(language, pageKey, labels.language))
        .replace(/<a aria-label="[^"]*" class="arcawand-root-return"/, `<a aria-label="${labels.back}" class="arcawand-root-return"`);
      if (next !== html) {
        fs.writeFileSync(file, next, "utf8");
        updated += 1;
      }
    }
  }
  return updated;
}

if (require.main === module) console.log(`Refreshed ${refreshUcpProductLanguageMenus()} Ultimate Clipboard Pro language menus.`);

module.exports = { refreshUcpProductLanguageMenus };
