# Project instructions

- For **WhatsApp + a timeframe**, read [docs/whatsapp.md](docs/whatsapp.md):
  instructions from Dad (Otto Schuster) in the open WhatsApp app.

- Update the relevant documentation in the same change whenever architecture,
  content editing conventions, dependencies, checks, or delivery procedures change.
  Keep docs accurate descriptions of the current site, not stale refactor plans.

- Before changing site structure, content, styles, or behavior, read
  [docs/architecture.md](docs/architecture.md). It describes current conventions
  and refactoring boundaries.
- For changes affecting appearance or interaction, follow
  [docs/verification.md](docs/verification.md), including real-browser checks at
  320, 390, and 1440 px. Run `npm run verify` for project changes.
- Deploy to production **only when the user explicitly asks**, for example
  "deploy it". Then read [docs/deploy.md](docs/deploy.md). Editing, testing,
  committing, pushing, or preparing deployment is not permission to publish.
  Never attach production deployment to an automatic push trigger.
