# Architecture and conventions

This is a German, single-page website for Teslime Schuster's cosmetics and foot
care studio. Keep documentation proportionate: this page covers structure and
conventions; [verification.md](verification.md) covers acceptance;
[deploy.md](deploy.md) covers production. There is no API, database, or external
component library to document.

## Current architecture

Astro 7.4 renders static HTML and optimized assets into `dist/`. Netcup serves those
files without a Node runtime. Development/build tools use Node 24, pinned in
`.nvmrc` and constrained in `package.json`. Install with `npm ci`. TypeScript stays
on 6.x because `@astrojs/check` currently supports TypeScript 5 and 6.

| Location | Responsibility |
| --- | --- |
| `src/pages/index.astro` | Composes the single page and its section order |
| `src/layouts/BaseLayout.astro` | Document metadata, German language, favicon, global stylesheet |
| `src/data/site.ts` | Shared business/contact details and metadata |
| `src/data/navigation.ts` | Navigation groups and stable section anchors |
| `src/data/prices.ts` | Typed price lists, treatment prices/durations, and removal fees |
| `src/components/sections/` | Section composition, reviews, and unique explanatory markup |
| `src/components/treatments/` | Focused facial, manicure, eyelash, and massage treatments |
| `src/components/` | Header, footer, introduction, treatment cards, price lists/rows, treatment metadata, galleries, section anchors |
| `src/images/` | Imported images processed by Astro's `Image` component |
| `public/` | Files copied unchanged, including favicon and the NiSV document |
| `src/styles/global.css` | Design tokens, global foundations, shared utilities |
| `tests/` | Node built-in tests against generated HTML |

Most component styles are scoped inside `.astro` files. Keep global styles for
shared foundations and CSS custom properties; do not move all CSS into one file
merely to match the sister website. Existing tokens include colors, header height,
sidebar width, content width, and tile borders.

`SiteHeader.astro` owns mobile menu state, Escape/focus behavior, responsive menu
reset, and dynamic header-height measurement. The desktop sidebar starts at
700 px. `HairRemovalSection.astro` controls seasonal imagery using the visitor's
current month (August through February). These are small browser scripts; there
is no client-side UI framework.

## Editing conventions

- Use TypeScript and typed component props. Follow existing two-space indentation,
  double quotes, semicolons, and descriptive component names.
- Keep business details in `site.ts`, navigation in `navigation.ts`, and prices in
  `prices.ts`. Edit descriptions, line breaks, durations, discounts, and fees there.
  Price strings deliberately retain ranges, per-item qualifiers, and nonbreaking
  spaces; do not coerce them into numbers or render HTML from content strings.
- Use `PriceList` for catalogue rows and `TreatmentMeta` for a centered duration
  and price. `PriceRow` owns row styling; `FacialTreatmentCard` shares facial-card
  heading/list styles across slotted treatment content. Keep the other reusable
  components (`TreatmentCard`, `ImageGallery`, `SectionAnchor`) where applicable.
- Preserve existing `scroll-*` IDs and `#top`: navigation, inbound links, and tests
  depend on them. A layout refactor must not silently break these public anchors.
- Preserve image aspect ratios, meaningful alternative text, keyboard access,
  reduced-motion support, and usable narrow-screen layouts. Keep image imports
  and Astro optimization; the sister site's `public/images/` approach is not a
  reason to discard this pipeline.
- Separate structural refactoring from changes to treatment claims, prices, copy,
  or visual identity. Do not introduce translations, routes, or services without
  a user requirement.

## Google Maps configuration

`astro.config.mjs` declares optional `PUBLIC_GOOGLE_MAPS_API_KEY`, consumed by
`ContactFooter.astro` through `astro:env/server`. It is public in generated HTML.
When configured, the footer embeds Google Maps; otherwise it renders a normal
Maps link. `.env` is ignored. Preserve the intended production value when building;
changing it requires a rebuild. The key should have the appropriate Google Cloud
domain restrictions. This repository has no Umami integration to copy or configure.

## Refactoring boundaries

The section components compose focused treatment components where the content
was large enough to make editing difficult. Unique explanatory copy stays in
Astro markup, while repeated price rows use typed data. There is no generic
page-builder schema or content collection: this single static page does not need
collection queries, a CMS, a client router, or server rendering.

Use Astro's native typed props, scoped styles, optimized images, and typed
environment configuration. The current site already uses these features; do not
add new framework features solely because they exist. Global `compact-copy` and
`standalone-price` utilities replace identical rules previously repeated in
sections. Keep gallery variants and source image dimensions unchanged unless an
intentional appearance change has been requested.

All source images are referenced, including the CSS background and list marker;
retain them. Remove unused code and assets only after checking both imports and
CSS URLs. Update these docs and verification instructions alongside future code
changes, as required by `AGENTS.md`.

## Delivery

`npm run verify` runs Astro diagnostics, a static build, and the HTML tests.
`SITE_URL` and `BASE_PATH` configure the deployment origin and prefix; defaults
are `https://www.teslime.de` and `/`. Use `withBasePath` from `src/data/site.ts`
for files in `public/`; Astro prefixes imported images and generated assets.
Fragment links remain relative to the current page.

`.github/workflows/main.yml` verifies and publishes the GitHub Pages preview on
pushes to `main` and manual runs, using the same Astro action and Pages deployment
as `ottoschuster.de`. The preview is at
<https://reaver86.github.io/teslime.de/>. It builds with
`SITE_URL=https://reaver86.github.io`, `BASE_PATH=/teslime.de`, and an empty Maps
key (the link fallback). It never publishes to Netcup. Explicit production
requests follow [deploy.md](deploy.md).
