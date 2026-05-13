# Home Controlled Chapter Logo Section

## Goal

Rebuild the home page's second section as a robust 4+2 controlled chapter logo journey: clean ARISTURTLE wordmark intro, four image-and-TypeIt story phases, and a clean ARISTURTLE wordmark outro.

## References

- `src/pages/index.astro`
- `src/scripts/homeGuidedTour.ts`
- Existing home page layout: full-screen car image, scroll-linked logo animation, minimal footer.

## Acceptance Criteria

- Home page contains three top-level content sections: opening image, logo animation, and minimal footer.
- The second section maps to six controlled phases: clean logo intro, four content phases, and clean logo outro.
- Phase 0 and Phase 5 match visually: white-filled logo only, no masked photo, no TypeIt text, and no CTA.
- Phase 0 and Phase 5 place the clean logo at the center of the viewport.
- Each wheel or touch gesture advances at most one phase.
- Repeated wheel or touch input during a phase transition does not skip phases.
- Touchpad momentum after a heavy gesture does not chain into additional phase changes.
- Phase transitions run at a fixed cinematic speed instead of inheriting native scroll velocity.
- Phase transitions use a deliberately slow cinematic duration around 1.8 seconds.
- Chapter transition sub-timings are defined as named constants so fade and zoom portions can be tuned without editing timeline internals.
- Wordmark endpoint transforms match the animated timeline state without a visible jump or teleport.
- The clean logo in phase 0 and phase 5 is centered in the viewport and kept inside viewport bounds.
- Phase 0 allows normal upward page scroll out of the section.
- Phase 5 allows normal downward page scroll to the footer.
- Keyboard arrows/PageUp/PageDown/Home/End do not desync the controlled phase state.
- Dragging or clicking the scrollbar inside the pinned range resolves to the nearest controlled phase.
- Each middle phase shows exactly one masked image, one TypeIt text block, and one contextual CTA.
- Phase 0 and Phase 5 use a measured-bounds matrix transform for true centered placement; phases 1-4 preserve their specific letter-focused logo crops.
- Logo focus, text placement, and image cropping are calculated from viewport dimensions and do not depend on a fixed `1366 x 768` copy plane.
- The clean full-logo phases keep the wordmark within the viewport at `390x844`, `768x1024`, `1280x720`, `1440x900`, and `1920x1080`.
- Copy is positioned from viewport safe zones and does not overlap the top navigation, CTA, viewport edges, or itself at the tested viewports.
- Portrait and mobile viewports move copy into the lower portion of the stage with constrained readable width and reserved bottom spacing.
- Reduced-motion mode displays a stable static clean-logo section with no TypeIt animation, masked photos, or scroll-linked zoom.
- GSAP setup uses `gsap.matchMedia()` for reduced-motion branching and reverts its media-query context on Astro page swaps.
- ScrollTrigger cleanup is scoped to the home guided-tour timeline and does not kill unrelated page ScrollTriggers.
- Viewport resize rebuilds are debounced so the scroll timeline is not destroyed and recreated for every native resize event.
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
- At each viewport, verify all six controlled phases, one-gesture phase changes, console errors, and horizontal overflow.
