# Astro 7 Refactor Design

Date: 2026-08-15

Status: Approved in conversation

## Context

Teslime.de is a static, single-page Astro website. Its presentation and content are established and must remain recognizably the same, but its implementation has accumulated most responsibilities in two files:

- `src/pages/index.astro` contains 1,046 lines of page content, image imports, navigation, and footer markup.
- `src/layouts/Layout.astro` contains the document shell, 800 lines of global CSS, and all client-side behavior.

The project currently uses Astro 5.12.3. The latest release at the time of this design is Astro 7.2.2, which requires Node.js 22.12 or newer. The production workflow still uses Node.js 20. The existing Astro 5 build succeeds with four diagnostics: three unused image imports and a deprecated iframe attribute.

The browser baseline was captured before changes at 1440 × 1000 and 390 × 844. It establishes the fixed header, desktop sidebar, mobile hamburger menu, introduction collage, long-form treatment content, image layouts, and footer as the visual contract.

## Goals

- Upgrade Astro to the latest stable release and align Node.js, checking, TypeScript, and CI configuration with it.
- Preserve the site's overall appearance, content ordering, pricing, responsive behavior, and external integrations.
- Split the page into focused Astro components with clear ownership.
- Replace the monolithic global stylesheet with a small global foundation and scoped component styles.
- Apply consistent naming to components, TypeScript symbols, CSS classes, and media files.
- Remove unused images, imports, selectors, comments, configuration, and deployment files when their lack of use is demonstrable.
- Correct approved spelling, grammar, punctuation, terminology, metadata, semantics, and accessibility issues without changing substantive service claims.
- Add lightweight automated output checks and perform real-browser regression verification.
- Document how to run, verify, build, configure, and deploy the site.

## Non-goals

- Redesigning the site, changing its brand, replacing its font stack, or adopting a component framework.
- Changing prices, contact details, medical or cosmetic claims, treatment descriptions, or the meaning of the copy.
- Moving content into a CMS or Astro content collections.
- Adding view transitions, client islands, analytics, external fonts, or other features that do not benefit this single static page.
- Changing existing public section fragment identifiers such as `#scroll-hautanalyse`.
- Altering the user's staged `.codex/config.toml` changes.

## Dependency and Runtime Upgrade

The project will use:

- Astro 7.2.2 or the latest stable patch available when dependencies are installed.
- The latest `@astrojs/check` compatible with Astro 7.
- The latest TypeScript release accepted by `@astrojs/check`'s peer dependency range.
- Node.js `>=22.12.0`, recorded in `package.json` and used by GitHub Actions.

The npm lockfile will be regenerated through npm. No UI framework, CSS framework, formatter, linter, or browser-test package will be added solely for this refactor.

The package scripts will be standardized as follows:

- `npm run dev` starts the local Astro development server.
- `npm start` remains as an alias for contributors familiar with the existing command.
- `npm run check` runs Astro diagnostics.
- `npm run build` creates the production output.
- `npm test` builds the site and runs dependency-free Node output tests.
- `npm run verify` runs diagnostics, the production build, and the output tests.

## Page and Component Architecture

`src/layouts/BaseLayout.astro` will own only the HTML document, German language declaration, page metadata, favicon, global stylesheet import, and slot.

`src/pages/index.astro` will become a composition root. Its template will show the page structure without containing treatment details:

1. `SiteHeader`
2. `IntroductionSection`
3. `SkinAnalysisSection`
4. `FacialTreatmentsSection`
5. `NailsLashesAndMassageSection`
6. `HairRemovalSection`
7. `FootCareSection`
8. `ReviewsSection`
9. `ContactFooter`

The exact grouping may be adjusted during extraction when two adjacent sections share more markup or styling than expected, but every resulting section component will have one recognizable content responsibility. Hidden cross-section styling dependencies are not allowed.

Small shared components will be introduced only for markup that genuinely repeats:

- `TreatmentCard` provides the bordered light tile container.
- `PriceRow` provides the description, optional duration, and price layout.
- `ImageGallery` provides named layout variants for the existing image groups.
- `SectionAnchor` consistently implements the preserved fragment targets and header scroll offset.

Repeated site information and navigation groups will live in typed modules under `src/data/`. Contact values used by both the header and footer will have one source of truth. Navigation labels and destinations will be defined once and rendered into the one responsive navigation component so desktop and mobile cannot drift.

Unique rich prose stays in its owning `.astro` component. It will not be forced into a large generic JSON or TypeScript schema because that would make editing harder and obscure the established document structure.

## Styling Architecture

`src/styles/global.css` will contain only:

- Design tokens for the two existing background colors, header height, sidebar width, content widths, borders, and shared spacing.
- Box sizing, smooth scrolling, body defaults, base typography, global image behavior, address normalization, and reduced-motion handling.
- A minimal set of intentionally global utility classes when the same semantic helper is used across unrelated components.

Astro component `<style>` blocks will own header/navigation, introduction, card, pricing, gallery, section, reviews, and footer styles. Scoped styles are preferred so selectors do not leak across component boundaries.

The refactor will preserve:

- The Comic Sans-style system font stack.
- The lavender page and lighter tile colors.
- The fixed header and 700 px desktop/sidebar breakpoint.
- The existing sidebar width, maximum content widths, black tile borders, collage geometry, QR grid, image arrangement, and centered presentation.

Inline style attributes will be replaced by semantic classes or typed component variants. `class:list` may be used for variants such as gallery layout or seasonal visibility. Selector specificity will remain low, and `!important` declarations will be removed where component boundaries make them unnecessary.

Small consistency improvements are allowed when they prevent fragile CSS, including normalized spacing, focus-visible indicators, and reduced-motion behavior. They must not amount to a redesign.

## Naming Conventions

- Astro component filenames and component symbols use `PascalCase`.
- TypeScript variables and props use `camelCase` and descriptive `Image` suffixes for imported media.
- CSS classes use semantic lowercase `kebab-case`; BEM-style element names may be retained within a complex component such as navigation.
- Public fragment IDs remain unchanged for compatibility.
- Image filenames use lowercase ASCII `kebab-case`, with consistent words such as `microneedling`, `hydra-face`, `vorher`, `nachher`, and `geraet`.
- German `ß` is written correctly in visible text and transliterated as `ss` only where ASCII identifiers or filenames require it.

Existing inconsistent media names will be renamed in the same commit as their imports. Examples include `Hydra-Face3-vorher.webp`, `Teslime_willkommen.webp`, and the misspelled `microneeling-rf-mashine.webp`.

## Asset and Dead-Code Cleanup

The following six image files have no rendered or stylesheet use and will be deleted:

- `src/images/fusspflege.jpg`
- `src/images/pact_therapie.jpg`
- `src/images/termine-kosmetik.jpg`
- `src/images/urlaub-flugzeug.png`
- `src/images/wegbeschreibung.jpg`
- `src/images/weihnachten.jpg`

All remaining media references will be traced after component extraction. An image is retained if it is rendered, used by CSS, or is a public document linked from the page. `public/NiSV.jpeg`, the favicon, the banner, navigation icons, and every currently rendered treatment/review image remain.

Obsolete holiday and pandemic selectors, unused generic selectors, commented-out expired announcements, commented imports, and unused markup variants will be removed. The empty tracked `.ai/mcp/mcp.json` will be deleted. The user's `.codex` configuration will not be modified.

The `develop.yml` GitHub Pages workflow will be deleted because the repository has no develop branch and production deployment is handled by the main-branch Netcup FTP workflow.

## Copy and Metadata Corrections

The approved copy pass includes all identified spelling and clear consistency corrections, including:

- `Klassiche` to `Klassische`
- `Genzkörpermassage` to `Ganzkörpermassage`
- `Reperaturkräfte` to `Reparaturkräfte`
- `Schutzkreme` to `Schutzcreme`
- `Ermässigung` to `Ermäßigung`
- `sien` to `sein`
- `Ergenbis` to `Ergebnis`
- `start unterstützt` to `stark unterstützt`
- `sicher zu stellen` to `sicherzustellen`
- `darauf folgenden` to `darauffolgenden`
- `ihr Handy` to formal `Ihr Handy`
- Mixed-case `Fuss`, `Fusspflege`, and `Fachfusspflege` to `Fuß`, `Fußpflege`, and `Fachfußpflege`
- `Fachfusspflegerin` to `Fachfußpflegerin`
- `ggfs.` to `ggf.`
- `WhatsApp Nachricht` to `WhatsApp-Nachricht`
- Duplicate `für` in `Empfohlen für: für jedes Alter`
- German compounds such as `Radiofrequenzbehandlung`, `Diodenlaser`, `Hot-Stone-Massage`, and `Google-Rezensionen`
- Correct compound coordination in `Hals-, Gesichts- und Dekolletébehandlung` and `Gesichts-, Hals- und Dekolletémassage`
- Consistent `Microneedling`
- Correct spaces between values and units, including `4,5 mm`
- The malformed punctuation and missing commas in the `Ergebnis 2` paragraph

Alternative text, page title, and description will use the same approved terminology. The duplicate placeholder description meta tag will be removed. Prices and substantive claims remain unchanged.

## Navigation and Client Behavior

The fixed header, desktop sidebar, and mobile dropdown remain one responsive component. The navigation markup will become valid HTML, with group headings represented within list semantics rather than `div` elements directly inside a `ul`.

The hamburger button will expose `aria-expanded` and `aria-controls`. It will:

- Toggle the mobile menu and existing hamburger-to-close animation.
- Close after an internal section link is selected.
- Close when Escape is pressed.
- Return focus to the toggle when closed with Escape.

The home control will be an actual link to a top-of-page target and will close the mobile menu. Desktop behavior remains visually unchanged.

The computed header height will continue to drive section scroll margins. A `ResizeObserver` or equivalent resize handling will update the value when header dimensions change, instead of calculating it only once.

The winter laser image will preserve the existing client-local August-through-February visibility rule. The implementation will use descriptive names instead of a generic `show` class.

Above-the-fold images remain eager. Below-the-fold images and external embeds will be lazy where browser behavior and the baseline allow it. External links opened in a new tab will consistently use safe `rel` values.

## Environment and External Embeds

`PUBLIC_GOOGLE_MAPS_API_KEY` will be described through Astro's type-safe environment schema as an optional public value used during static generation.

When present, the footer renders the same Google Maps embed. When absent, the page renders a normal link to the practice location rather than a URL containing `key=undefined`. This preserves useful behavior in local development and CI without exposing a secret requirement. The key is public by definition because it is embedded in generated client-visible markup and should be restricted by domain in Google Cloud.

The YouTube iframe will retain its current video and permissions, receive a descriptive title, remove the deprecated `frameborder` attribute, and use CSS for its border and dimensions.

## Error Handling and Accessibility

This is a static site with no user-submitted data or server runtime. Error handling therefore focuses on build-time validation and graceful optional integrations:

- Astro's typed props and strict compiler validate component contracts and markup.
- Astro Check must report no diagnostics.
- A missing Maps key produces a useful fallback rather than broken markup.
- All internal navigation fragments are tested against rendered IDs.
- Duplicate IDs are treated as test failures.
- Decorative images use empty alternative text; informative images use concise descriptions.
- Buttons and links retain visible keyboard focus, and animation honors reduced-motion preferences.
- Landmarks, headings, navigation labels, and iframe titles remain available to assistive technology.

## Automated Testing

A dependency-free Node test under `tests/` will inspect `dist/index.html` after a production build. It will verify:

- The German language attribute, title, and single non-placeholder description.
- Presence of the major content sections and unchanged key price/content markers.
- Uniqueness of all rendered IDs.
- Existence of a rendered target for every internal `#scroll-*` link.
- Expected navigation groups and important external contact links.
- Safe new-tab link attributes where applicable.
- Absence of known stale copy and malformed values such as `Astro description`, `key=undefined`, and the approved typos.

Tests will avoid pixel assertions and brittle full-document snapshots. The browser baseline, not serialized implementation detail, is the visual reference.

## Browser Verification

After implementation, the production or development site will be exercised in Chromium through the Playwright CLI at:

- Desktop: 1440 × 1000
- Mobile: 390 × 844

Verification will cover:

- Initial desktop and mobile rendering against the captured baseline.
- Desktop sidebar visibility and mobile sidebar concealment.
- Hamburger open/close animation and state.
- Anchor navigation, correct fixed-header offset, and menu closure after selection.
- Home-link behavior.
- Seasonal laser image visibility for the current month.
- Console errors and warnings.
- Failed local asset requests.
- Maps behavior with the configured local key and fallback behavior without it.

Text corrections may cause very small line-wrap differences. Those are acceptable; changes to the layout model, imagery, ordering, colors, or responsive structure are not.

## CI, Deployment, and Documentation

`.github/workflows/main.yml` will keep the current main-branch Netcup FTP deployment. It will use Node.js 22, `npm ci`, and `npm run verify` before artifact upload. FTP credentials and deployment paths remain unchanged.

The stale develop-branch GitHub Pages workflow will be removed.

The README will document:

- Node.js 22.12 or newer and npm prerequisites.
- `npm install` or `npm ci`.
- `npm run dev` and the default `http://localhost:4321` URL.
- The Maps environment variable and fallback.
- All verification and build commands.
- The static `dist/` output and current automated Netcup deployment.

## Completion Criteria

The refactor is complete when:

1. The project installs from the lockfile on supported Node.js.
2. `npm run verify` exits successfully with no Astro diagnostics or test failures.
3. Astro reports version 7.2.2 or a newer stable patch explicitly installed during the work.
4. The page passes the documented desktop and mobile browser checks with no local console or asset errors.
5. Existing prices, substantive content, public fragment targets, integrations, and visual structure remain intact apart from approved copy and accessibility corrections.
6. Confirmed unused media, dead code, stale workflow/configuration, and generated project artifacts are absent from the tracked tree.
7. The pre-existing `.codex/config.toml` changes remain outside the refactor commits.
