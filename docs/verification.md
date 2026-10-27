# Verification

Run `npm run verify` for project changes. It runs `astro check`, then `npm test`
(production build plus Node's built-in tests). Tests check document metadata,
major sections, representative content/prices, unique IDs, fragment links,
external links, review image dimensions, and known unwanted placeholders/typos.
They also validate all catalogue rows (including descriptions, notes and
durations), local HTML/CSS asset references, and ARIA label/control targets.
Node 24 imports the typed price catalogue directly; no test framework is needed.
These checks do not replace browser verification.

## Local development server

Run `npm run dev` and open `http://localhost:4322/`. Development and preview
default to port 4322 to keep Teslime separate from the sister site
`ottoschuster.de` on port 4321. The sister site redirects its root to `/de/`,
while Teslime serves its German page directly at `/`. Browsers can cache the
sister site's permanent redirect when both projects share the same origin.

Always use the URL printed by Astro: if the configured port is occupied,
Astro selects another port.

If the wrong site appears, run `npx astro dev status` and
`npx astro preview status` in the relevant project directories. Stop an unused
server with `npx astro dev stop` or `npx astro preview stop` from its own project
directory, then restart Teslime. If the browser still applies an old redirect,
clear cached data for that local origin or check in a private window.

## Appearance and interactions

For every change affecting appearance or interaction, verify the affected areas
in a real browser before declaring completion:

1. Use `npm run dev`, or `npm run preview -- --host 127.0.0.1` after building for
   production-output checks.
2. Check **320 px**, **390 px**, and **1440 px** viewport widths. This site currently
   has only German content; no Romanian checks are needed.
3. Capture and inspect screenshots for wrapping, alignment, image cropping,
   horizontal overflow, and spacing beneath the fixed header. Save artifacts in
   ignored `output/playwright/`. For global changes, inspect the full page from
   introduction through treatments, reviews, and contact.
4. Exercise mobile menu open/close, Escape and focus restoration, navigation
   closing after selecting a link, anchor destinations, and return to top. For
   header/navigation changes also test around the 700 px desktop breakpoint and
   resizing with the menu open.
5. Check WhatsApp, email, social links, the NiSV document, and Maps destinations
   without sending messages or making calls. Verify the map or fallback expected
   for the build configuration. When seasonal-image logic changes, test both
   August–February and March–July dates.
6. Check keyboard focus, reduced motion where affected, missing images, browser
   errors, and failed asset requests. A script measuring overflow alone does not
   replace inspecting screenshots.

For production deployment, check the built site before uploading and repeat the
affected live checks afterwards. See [deploy.md](deploy.md) for host, transfer,
backup, and rollback checks.

Documentation and CI-only edits do not require website screenshots. Validate
documentation links and commands, inspect workflow changes, and run
`npm run verify`. Report exactly what was checked and any limitation.

## Refactor comparison (18 October 2026)

The pre-refactor production build is saved locally in
`output/playwright/before/dist/`. Compare it with the new production build under
identical viewport, font, and date conditions. Load and decode lazy images before
measuring layout or taking screenshots. Capture individual section viewports;
very tall full-page screenshots can contain browser capture artifacts.

The baseline and refactored page were compared at 320, 390, and 1440 px for text,
headings, images, cards, price rows, treatment metadata, and footer geometry.
Keep comparison logs and before/after screenshots under `output/playwright/`.
These artifacts are local evidence, not committed fixtures.

The configured Google Maps embed returned HTTP 403 on localhost in the baseline
and refactored build. Local checks can verify its URL and iframe, but cannot
confirm a working live map. Verify it on the intended domain during an explicitly
requested deployment. Do not change the production key to make a local check pass.

## Hydra-Face announcement

At 320, 390, and 1440 px, clear
`teslime:hydra-face-october-2026:dismissed` from local storage and reload. Check
that the complete poster, caption and centered close icon fit the viewport. The
panel should hug its content on mobile too, with narrow side gutters and no
large empty bands above or below the image. Check that clicking the poster or
activating its link with Enter closes the modal and navigates to `#scroll-gesicht`,
with the treatment heading focused and visible below the fixed header. Repeat
when the URL already has that hash. Backdrop, caption, close-button clicks and
Escape must only dismiss, preserving the current scroll position and hash.
Check keyboard focus containment/restoration and scroll restoration. Reload
and revisit to confirm dismissal persists. With storage access blocked, verify
that opening and closing still work without errors. With JavaScript disabled,
verify that the modal stays hidden and the permanent treatment poster and text
remain available. Inspect the replacement poster and expanded treatment list at
all three widths.

## GitHub Pages preview

Verify both deployment prefixes when changing asset paths or the workflow:

```sh
npm run verify
SITE_URL=https://reaver86.github.io BASE_PATH=/teslime.de PUBLIC_GOOGLE_MAPS_API_KEY= npm run verify
npm run preview -- --host 127.0.0.1
```

Open `/teslime.de/` on the preview server and check the same three viewport widths,
navigation, images, favicon, NiSV document, and Maps link fallback. The HTML/asset
tests honor `BASE_PATH` and fail if a local asset escapes the deployment prefix.
After pushing, confirm the workflow succeeds and check the actual Pages URL.
Rebuild with the production origin and `/` base before any production deployment.
