# Home Responsive Logo Section

## Goal

Rebuild the home page's second section as a robust 4+2 snapped logo journey: clean ARISTURTLE wordmark intro, four image-and-TypeIt story phases, and a clean ARISTURTLE wordmark outro.

## References

- `src/pages/index.astro`
- `src/scripts/homeGuidedTour.ts`
- Existing home page layout: full-screen car image, scroll-linked logo animation, minimal footer.

## Acceptance Criteria

- Home page contains three top-level content sections: opening image, logo animation, and minimal footer.
- The second section maps to six scroll-snap phases: clean logo intro, four content phases, and clean logo outro.
- Phase 0 and Phase 5 match visually: white-filled logo only, no masked photo, no TypeIt text, and no CTA.
- Phase 0 and Phase 5 place the clean logo at the center of the viewport.
- Snap points are `[0, 0.2, 0.4, 0.6, 0.8, 1]`.
- Each snap point is a stable hold state; logo movement, image changes, and copy fades happen between snap points rather than starting at the snapped position.
- Snapping feels soft and magnetic: it settles after the user slows, with a short delay and eased duration instead of an abrupt jump.
- Each middle phase shows exactly one masked image, one TypeIt text block, and one contextual CTA.
- Phase 0 and Phase 5 use a measured-bounds matrix transform for true centered placement; phases 1-4 preserve their specific letter-focused logo crops.
- Logo focus, text placement, and image cropping are calculated from viewport dimensions and do not depend on a fixed `1366 x 768` copy plane.
- The clean full-logo phases keep the wordmark within the viewport at `390x844`, `768x1024`, `1280x720`, `1440x900`, and `1920x1080`.
- Copy is positioned from viewport safe zones and does not overlap the top navigation, CTA, viewport edges, or itself at the tested viewports.
- Portrait and mobile viewports move copy into the lower portion of the stage with constrained readable width and reserved bottom spacing.
- Reduced-motion mode displays a stable static clean-logo section with no TypeIt animation, masked photos, or scroll-linked zoom.
- No horizontal page overflow at tested viewports.
- No console errors on load.

## Out Of Scope

- Redesigning the global navigation.
- Replacing the SVG wordmark paths.
- Redesigning the opening image section.
- Redesigning the minimal footer.
- Modifying legacy mirror files under `aristurtle.gr/`.

## Commands To Run

```bash
npm run build
npm run preview
```

Browser verification:

- Inspect `/` at `390x844`, `768x1024`, `1280x720`, `1440x900`, and `1920x1080`.
- At each viewport, verify all six snapped phases, console errors, and horizontal overflow.
