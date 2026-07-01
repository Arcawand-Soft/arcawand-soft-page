# ArcaWand Soft Website - Agent Notes

This repository contains the static GitHub Pages website for `https://arcawand-soft.com`, including the multilingual Ultimate Clipboard Pro and Figgliz product pages.

## Encoding And Text Safety

- Keep every file in UTF-8.
- Never introduce mojibake such as `Ã`, `Â`, `â€™`, `â€œ`, `â€`, or `?` replacing accents.
- After editing localized HTML, JS, JSON, or generated pages, scan the diff for broken accents, apostrophes, arrows, quotes, and special characters.
- Prefer plain UTF-8 characters over HTML entity noise, unless the surrounding file already requires entities.

## Languages

Maintain all supported languages whenever user-facing content changes:

- English: root/default pages.
- French: `/fr/`.
- Spanish: `/es/`.
- Italian: `/it/`.
- German: `/de/`.
- Figgliz also has full static language routes for `/ro/`, `/pt/`, `/ar/`, `/zh/`, `/ja/`, `/ru/`, `/nl/`, `/pl/`, `/tr/`, `/ko/`, and `/hi/`. When touching Figgliz product copy, pricing copy, plan benefits, legal/product navigation, or runtime UI labels, keep these routes synchronized too.

This applies to navigation, footer links, buttons, modals, language menus, ARIA labels, tooltips, SEO tags, Open Graph tags, JSON-LD, FAQ, privacy policy, terms, contact text, and product copy.

## Product Page Generation

- Product static pages are generated from shared source logic. When changing product subpages, shared product navigation, footer content, FAQ, privacy, or terms content, update the generator/source first, then regenerate the localized pages.
- If `scripts/generate-product-pages.js` changes, run it before finishing.
- Do not manually patch one language page and forget the others.
- Figgliz pricing is a special runtime block: the static pages contain fallback markup, but `/assets/figgliz-product-pages.js` rebuilds `.figgliz-plan-box` in the browser. Keep the runtime component, `/assets/figgliz-product.css`, `scripts/generate-figgliz-pages.js`, and all Figgliz page cache-busting query strings synchronized.
- Figgliz live prices come from `https://api.arcawand-soft.com/billing/checkout-prices` on the Figgliz VPS, with browser-side cache under `figglizCheckoutPriceCache:v1`. Do not hardcode localized dynamic prices into static HTML except as fallback copy.
- Currency flags for the Figgliz pricing selector live under `/assets/flags/currency/` and are named by lowercase ISO currency code. When the Figgliz extension or VPS adds/removes currencies, update this folder and the `supportedCurrencies`/`priorityCurrencies` lists in `/assets/figgliz-product-pages.js`.
- The VPS currency allow-list is in the Figgliz repository, `server/src/billing.js`. If the website needs newly supported checkout currencies, update and redeploy that backend file as well.

## SEO Checklist

For every new or modified page, verify:

- Localized `<title>` and meta description.
- Canonical URL.
- `hreflang` links for all languages plus `x-default`.
- Open Graph title, description, image, URL, type, and locale where applicable.
- Twitter card metadata.
- JSON-LD structured data when relevant.
- `sitemap.xml` includes the page and language variants.
- The page has one clear H1 and sensible heading hierarchy.
- Images have useful `alt`, `width`, and `height`.
- FAQ pages use FAQ-focused content and schema only when the content is actually present.

Use a separate social preview image for Ultimate Clipboard Pro pages when available, and do not accidentally reuse the generic site preview where a product-specific preview is intended.

## Performance And PageSpeed

- Keep the site lightweight. Do not add external libraries unless truly necessary.
- Prefer optimized WebP/AVIF assets and correctly sized responsive images.
- Add explicit `width` and `height` to images to avoid CLS.
- Use `loading`, `decoding`, and `fetchpriority` intentionally.
- Avoid render-blocking CSS/JS where practical.
- Keep scripts small, defer non-critical behavior, and avoid forced layout loops.
- Check mobile CLS after hero, video, language menu, floating widgets, and product nav changes.

## Accessibility

- Icon-only and image-only buttons need accessible names.
- The language menu must work and expose a clear accessible label on every page.
- Dropdowns, modals, close buttons, carousel controls, and floating widgets must be keyboard and screen-reader friendly.
- Maintain sufficient contrast, especially CTA buttons and small navigation text.
- Keep tap targets usable on mobile.

## Site Behavior

- Language detection may redirect first-time visitors, but manual language selection must override detection and persist across navigation.
- The language selector must route to the matching page in the selected language, including product subpages.
- The product header/nav behavior must remain consistent across presentation, FAQ, privacy policy, and terms pages.
- Install Extension buttons should open the localized "coming soon" modal until the Chrome Web Store URL exists.
- Get Pro buttons should use:
  `https://checkout.dodopayments.com/buy/pdt_0NeBVHHvl7TdkOznAvJOk?quantity=1`
- Contact links should use `contact@arcawand-soft.com`.

## Newsletter Floating Form

- Never expose Sender.net API tokens or private credentials in frontend code.
- The floating signup widget may call only a public endpoint/worker designed for this purpose.
- Keep placeholder mode safe when no public endpoint is configured.
- Preserve the localStorage anti-spam keys and behavior unless the user asks to change them.

## Design Consistency

- Keep the premium dark/productivity design language consistent across home, product, FAQ, privacy, terms, and contact pages.
- Product pages should feel like part of the main site, not a separate disconnected landing page.
- Responsive behavior must be checked for desktop, tablet, and mobile.
- Do not add duplicate headers, duplicate language menus, or orphan footer links.
- Do not rely on CSS priority battles. Never stack new rules on top of old rules just to "win" specificity.
- When changing design, style, or CSS, first identify the rule responsible for the current rendering, remove or replace that rule, then apply the new styling in the proper source file or generated template.
- After style changes, audit likely conflicts across desktop/mobile, localized pages, hover states, sticky states, language menus, product subpages, and generated HTML.

## Verification Before Finishing

- Run `git diff --check`.
- If the generator changed, run `node scripts/generate-product-pages.js`.
- Run `node --check scripts/generate-product-pages.js` when that file changes.
- Run `node --check assets/ucp-product-pages.js` when that file changes.
- Scan generated pages for mojibake and language-menu regressions.
- Verify sitemap and SEO metadata after adding pages.
- Do not stage, commit, revert, or delete unrelated dirty files.

## Local Tooling And Deployment Pitfalls

- This Windows environment may run an older Windows PowerShell where `Set-Content -Encoding UTF8NoBOM` is not supported. If you need UTF-8 without BOM for bulk replacements, use .NET explicitly:
  `[System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $file), $text, (New-Object System.Text.UTF8Encoding($false)))`.
- PowerShell may display UTF-8 as mojibake even when the file bytes are correct. Before "fixing" accents, verify with `[System.IO.File]::ReadAllText(path, [System.Text.Encoding]::UTF8)` or inspect the actual diff.
- `gh` may not be installed on this machine. To verify GitHub Pages after pushing, use HTTP checks against the public URL instead of assuming `gh run list` is available. Example: `Invoke-WebRequest -UseBasicParsing https://arcawand-soft.com/fr/figgliz/ -Headers @{ "Cache-Control" = "no-cache" }` and check for the new cache-busting token.
- After changing shared static assets such as `/assets/figgliz-product-pages.js` or `/assets/figgliz-product.css`, bump the query string on every generated Figgliz page. Otherwise GitHub Pages may be updated while browsers keep serving stale JS/CSS.
- `scripts/generate-figgliz-pages.js` currently emits the canonical Figgliz fallback markup for the core generated pages, while 16 language routes also exist as static clones. If you update cache-busting or runtime assets, scan all language folders with `rg`, not only the generator output.
- Do not stage unrelated untracked marketing assets just because they appear in `git status`. During the pricing work, several unrelated images and cache files were present; stage only files tied to the requested patch.

## Git Safety

- The worktree may contain unrelated user changes. Do not revert them.
- Stage only files related to the current task.
- If the user asks to push, commit a scoped change with a clear message and push only after verification succeeds.
