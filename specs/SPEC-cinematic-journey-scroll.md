# SPEC: Cinematic Journey Scroll (Sectional Cutscene Scrolling)

## Goal
Replace the continuous, scroll-scrubbed journey on the home page with a cinematic, slide-based scrolling experience. Transitions between stations (waypoints) will act as cutscenes triggered by a scroll input. Scrolling is locked during transitions and re-enabled once the target station is fully active.

## References
- [src/pages/index.astro](file:///c:/Aristurtle-site-LOCAL/src/pages/index.astro)
- [src/layouts/BaseLayout.astro](file:///c:/Aristurtle-site-LOCAL/src/layouts/BaseLayout.astro)
- [src/components/Navbar.astro](file:///c:/Aristurtle-site-LOCAL/src/components/Navbar.astro)

## Acceptance Criteria
1. **Discrete State Machine**:
   - The home page scroll transitions between 7 discrete states: `hero`, `about`, `mission`, `subsystems`, `history`, `sponsors`, `outro`.
2. **Scroll Jacking & Input Interception**:
   - Standard browser scrollbar is hidden on the homepage to prevent standard manual scrubbing/dragging.
   - Scroll events (mouse wheel, touchpad swipe, touch swipe, arrow keys Up/Down) are intercepted.
   - A single scroll-down gesture triggers transition to the next state in sequence.
   - A single scroll-up gesture triggers transition to the previous state in sequence.
3. **Transition Input Lock**:
   - When a transition starts, an `isAnimating` lock is set to `true`.
   - During the transition, all scroll and gesture inputs are ignored (preventing multiple jumps or momentum queueing).
   - Once the journey playhead is within 0.5% of the target station, the station is considered visually settled and `isAnimating` is set to `false`, allowing the next scroll input without waiting for the imperceptible easing tail.
   - If a new gesture arrives during that easing tail, the previous tween is completed and killed before the next station tween begins, preventing overlapping playhead tweens.
4. **Smooth Programmatic Timeline Animations**:
   - The `journeyTimeline` is set to `paused: true`.
   - The internal timeline travel segments use linear easing (`ease: "none"`) to map progress linearly to the playhead, preventing velocity spiking in the middle of transitions.
   - Transitions play at a fixed cinematic duration of `6.0` seconds using the mandated `luxe` ease (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - The timeline pause points are marked with labels: `station-about-active`, `station-mission-active`, `station-subsystems-active`, `station-history-active`, and `station-sponsors-active`.
   - The transition outro of the active station begins immediately when a scroll is registered (no delayed "hold" before starting).
5. **Decoupled Camera Transitions**:
   - The camera will bypass frame-by-frame tracking of the winding path bends to avoid sharp, aggressive direction changes in the corners.
   - To eliminate temporal velocity "corners" (abrupt speed jumps when starting or stopping travel), the camera's translation and scale are animated using an independent, global GSAP tween.
   - When a transition is triggered, a single continuous GSAP tween is created to move the stage to the target camera coordinates and scale over the full transition duration (6.0s for stations, 4.0s for hero return) using the `"luxe"` ease.
   - This ensures the camera accelerates and decelerates perfectly smoothly from start to finish, with no sudden velocity spikes or freezing at the segment boundaries, while the orange track line continues to draw along the actual curves.
6. **Hero/Journey Window Integration**:
   - Transitioning from `hero` to `about` scrolls the page viewport programmatically to `y = window.innerHeight` using a smooth animation while simultaneously running the timeline from `0` to the `station-about-active` label.
   - Transitioning from `about` back to `hero` plays the timeline back to `0` and scrolls the viewport back to `y = 0`.
   - The global Navbar logo auto-compacts and expands dynamically when scrolling past/above the hero threshold.
6. **No Interruption to Interactive Components**:
   - Interactive components within stations (e.g. Subteam hovers, Acrostic hovers, and CTA links) remain fully clickable/hoverable once the transition settles.
7. **Accessibility fallback**:
   - Respect `prefers-reduced-motion`. In reduced motion mode, standard scrolling should be used, or transitions must be instantaneous.
8. **Stable first interaction**:
   - Homepage initialization must not programmatically reset the viewport to `y = 0` after input listeners are active.
   - A scroll-down gesture issued immediately after the page becomes interactive advances from `hero` to `about`, remains at the journey viewport after the transition, and releases the input lock for the next gesture.
9. **Outro menu framing**:
   - Above 1024px, the final full-car view uses the black canvas left of the menu panel, whose width follows `clamp(260px, 40vw, 460px)`.
   - The available frame begins below the expanded 700px-wide logo using its real `978.84:262.6` aspect ratio, and ends 24px before the left, bottom, and menu edges.
   - Outro scale uses the full `10644 × 5322` stage bounds, preserving the approved car position and visual framing.
   - Outro paths retain the visible `2.5px` non-scaling stroke.
   - Only after the outro timeline tween truly completes, DrawSVG dash-array and dash-offset styles are cleared from every car path and a final solid-stroke override forces `stroke-dasharray: none`, so no cached or final DrawSVG update can chop the wireframe.
   - After that cleanup, all car paths animate together from `2.5px` to `3.5px` over `0.5s` with the luxe ease; reduced-motion mode applies `3.5px` immediately.
   - Leaving the outro kills the stroke-emphasis tween before restoring the journey stroke behavior.
   - At 1024px and below, where the menu becomes full-width, the outro remains centered in the viewport.

## Out Of Scope
- Redesigning the layout of the HUD windows or station content.
- Editing the SVGs or camera path coordinates.
- Modifying styling on other subpages (`/contact`, `/sponsors`).

## Commands to Run
- `npm run dev`
- `npm run build`

## Verification Protocol
1. Verify build completes successfully with `pnpm run build`.
2. Manual/browser inspection at different viewport sizes:
   - Scroll immediately after the page becomes interactive and verify the viewport does not jump back to the Hero.
   - Verify scroll-down from Hero moves viewport to Journey viewport and plays the first station transition.
   - Verify scroll-up from About goes back to Hero.
   - Verify fast, repeated scrolling during a transition does not cause double-transitions or skip stations.
   - Verify interactive hovers on Subsystems and Mission sections function correctly when settled.
