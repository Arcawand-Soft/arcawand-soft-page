const SALES_NAV_LABELS = Object.freeze({
  en: "Sales Terms",
  fr: "CGV",
  es: "CGV",
  it: "CGV",
  de: "AGB",
  ro: "CGV",
  pt: "CGV",
  ar: "شروط البيع",
  zh: "销售条款",
  ja: "販売条件",
  ru: "Условия продажи",
  nl: "Verkoopvoorwaarden",
  pl: "Warunki sprzedaży",
  tr: "Satış Koşulları",
  ko: "판매 약관",
  hi: "बिक्री शर्तें"
});

function salesNavLabel(languageCode) {
  return SALES_NAV_LABELS[languageCode] || SALES_NAV_LABELS.en;
}

module.exports = { SALES_NAV_LABELS, salesNavLabel };
