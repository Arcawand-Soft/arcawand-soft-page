# ArcaWand Soft Website

Official static GitHub Pages website for ArcaWand Soft.

ArcaWand Soft builds premium browser extensions, mobile apps and original web products for demanding users who want sharper workflows, safer digital tools and lighter breaks.

## Pages

- `/` - ArcaWand Soft home page.
- `/ultimate-clipboard-pro/` - Ultimate Clipboard Pro product page, adapted from the standalone product landing page and integrated as a subpage of the main site.
- `/figgliz/` - Figgliz product page for the private random chat, webcam and mini-games Chrome extension, with localized FAQ, statistics, privacy policy and terms pages.
- `/privacy/` - privacy and local-first data principles.
- `/contact/` - static contact page.

## Languages

The site includes a language selector with translations for:

- English
- French
- Spanish
- Italian
- German

The selected language is saved in `localStorage` so visitors keep the same language while navigating across pages.

## Ultimate Clipboard Pro Page

The Ultimate Clipboard Pro page keeps the existing premium product presentation, carousel, FAQ, install calls to action and Pro messaging, but the standalone product header has been hidden so the page works as a product route inside the ArcaWand Soft website.

The route is:

```text
https://arcawand-soft.github.io/arcawand-soft-page/ultimate-clipboard-pro/
```

## Figgliz Product Pages

Figgliz uses the same multilingual product-page system and adds:

- Presentation pages in English, French, Spanish, Italian and German.
- Product FAQ pages with localized SEO metadata and FAQ structured data.
- Localized statistics pages that mirror the Figgliz live counters from a public JSON feed.
- Product-specific privacy policy and terms of use pages.
- Optimized WebP assets under `/assets/figgliz/`.
- Pricing cards for Free, Plus, Pro and the Pro Lifetime launch offer.
- Coming-soon install buttons while the extension remains in volunteer beta testing.

## Home Positioning

The home page now presents ArcaWand Soft as a hybrid product studio: serious productivity tools such as Ultimate Clipboard Pro, plus lighter private social experiences such as Figgliz. Featured app blocks should stay localized, responsive and visually consistent across all five languages.

The default route is:

```text
https://arcawand-soft.github.io/arcawand-soft-page/figgliz/
```

## Local Preview

From this repository folder:

```bash
python -m http.server 4177
```

Then open:

```text
http://127.0.0.1:4177/
```

## GitHub Pages

This repository is designed to be served directly by GitHub Pages from the main branch.
