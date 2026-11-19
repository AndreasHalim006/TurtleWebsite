# Typography refresh: Sansation

User selected Sansation on 2026-11-19, superseding the local Barlow trial.

## Scope
Visual thesis: technical, geometric typography using Sansation throughout.
Content plan: preserve existing content and section structure.
Interaction thesis: preserve existing reveals, navigation, and hover behavior.
Use self-hosted Sansation Regular 400 and Bold 700 for body/UI and display.
Files: global CSS, font dependencies/lockfile, typography guidance in AGENTS.md.
No changes to colors, images, layout, or animation logic.

## Acceptance criteria
- Both font tokens use Sansation; import real 400 and 700 weights.
- Remove Barlow packages and imports.
- Font assets are bundled locally with swap behavior.
- Production build passes.
- Browser testing is handed to the user: check hero heading wraps, menu labels,
  body readability, and button text on desktop/mobile. No agent browser testing.

Status: implemented locally; awaiting user browser review.

## Local verification
- `pnpm.cmd run build` passed (10 pages).
- `git diff --check` passed.
- Sansation CSS declares local assets with `font-display: swap` and actual 400/700 weights.
- No browser testing performed, per user preference. Not pushed.
