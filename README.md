# ArcaWand Soft Website

Official static GitHub Pages website for ArcaWand Soft.

ArcaWand Soft builds premium browser extensions, mobile apps and productivity software for demanding users who want faster, cleaner and more reliable digital workflows.

## Pages

- `/` - ArcaWand Soft home page.
- `/ultimate-clipboard-pro/` - Ultimate Clipboard Pro product page, adapted from the standalone product landing page and integrated as a subpage of the main site.
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
