# Garage content correction and viewer verification

## Scope

Update `src/data/garage.json` descriptions, years and specifications from
`recovery/wordpress-archive/GARAGE-CONTENT.md`. Preserve paragraph breaks in
`src/components/garage/CarSection.astro`. Review the existing viewer in
`src/pages/garage.astro` and fix confirmed interaction defects if found.

## Acceptance criteria

- All eight cars match the archived descriptions, years and ordered specification lists.
- Use the newest Thetis list; exclude source metadata and earlier-snapshot notes.
- Nemesis and Thetis DV each render two description paragraphs.
- Gallery clicks display the selected original image in a viewport-sized modal.
- Close button, Escape and backdrop dismiss it and restore thumbnail focus.
- Arrow keys and navigation buttons wrap within the selected car's gallery.
- Background scrolling is locked while open; images fit desktop and mobile viewports.
- Build succeeds and Playwright browser inspection includes console errors.
