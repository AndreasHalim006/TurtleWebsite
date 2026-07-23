# SPEC: Global ARISTURTLE Motion Preloader

## Goal
Implement a minimal, unmistakably ARISTURTLE global preloader for every page. A seamless shell-and-circuit pattern must run continuously for as long as loading takes, while the existing readiness gate keeps scrolling locked and releases a fully initialized layout.

## References
- [src/layouts/BaseLayout.astro](file:///c:/Aristurtle-site-LOCAL/src/layouts/BaseLayout.astro)
- [src/components/Preloader.astro](file:///c:/Aristurtle-site-LOCAL/src/components/Preloader.astro)

## Acceptance Criteria

1. **Global Route Coverage**:
   - `BaseLayout.astro` must render exactly one preloader on every generated page.
   - The loader must run on every full document navigation, including refreshes and internal page changes.
   - Individual pages must not import or mount their own loader instance.

2. **Visual Design & Brand Alignment**:
   - The preloader must remain visually above the homepage hero, navbar, and global overlays for its entire active sequence.
   - Background color: Strict dark grey/black `#0A0A0A`.
   - Typography: **Jura** for the ARISTURTLE lockup and compact status copy.
   - Accent color: Aristurtle Orange (`--brand-orange` which maps to `--brand-primary-1` or `#9FFF10` line).
   - Layout: One centered brand composition containing:
     - The official white ARISTURTLE lockup.
     - A custom horizontal shell-and-circuit vector pattern with one green energy trace.
     - A single compact status line; no percentage, progress bar, telemetry log, spinner, or generic loading dots.
   - The vector pattern must tile seamlessly and translate continuously at a constant speed, with no visible reset at the loop boundary.
   - The composition must remain fully visible without horizontal overflow at `375px` and scale up without exceeding `480px` wide on desktop.

3. **Real Loading Coordination**:
   - The infinite pattern must begin immediately and continue until the browser `window.load` event, every visible `data-critical-asset` image/video, and every visible `data-critical-render` surface have completed, or the readiness timeout has elapsed.
   - A `data-critical-render` surface is ready only after its first usable visual frame has been committed and it has set `data-critical-ready="true"`.
   - A third-party request or failed critical surface must not trap the page; readiness has a maximum wait of `3` seconds before the exit is allowed to continue.
   - The global fail-safe must include the readiness window and exit choreography; it must not dismiss the loader earlier than the readiness timeout.
   - The loader must be removed from the DOM after its exit so it leaves no persistent composited layer or pointer-event surface.

4. **Smooth Entry & Exit Choreography**:
   - The animation must use GSAP with the project-standard `luxe` ease (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - The shell-and-circuit loop must use only transform-based animation, run at a constant linear speed, and remain continuous for an arbitrary loading duration.
   - When readiness resolves, the exit sequence triggers:
     - The centered brand composition fades and translates upward by no more than `16px`.
     - The preloader container translates upwards out of the viewport (`yPercent: -100`) over `0.6` to `0.8` seconds with `luxe` ease.
   - All motion must animate with transforms and opacity rather than layout properties such as `width`, `top`, or `left`.

5. **Lenis Scroll-Locking Integration**:
   - During the loading sequence, the global Lenis smooth scroll must be locked using `window.lenis?.stop()`.
   - Once the exit animation completes, Lenis must resize, ScrollTrigger must refresh once, and scrolling must be unlocked.

6. **Accessibility & Reduced Motion**:
   - In accordance with `prefers-reduced-motion`, if the user has disabled animations:
     - The loader must immediately fade out (`opacity: 0` with `duration: 0` or standard CSS transition of `0.1s`).
     - Scroll locking must be instantly released.

## Out of Scope
- Artificially downloading assets that the current page does not use.
- Replacing asset compression, responsive images, or route-level code splitting.

## Verification Protocol
1. Verify code compiles and builds successfully using `pnpm run build`.
2. Verify visual appearance on desktop (1920px) and mobile (375px).
3. Visit `/`, `/about-us`, `/garage`, and `/contact`: each route shows one continuously moving pattern, exits after readiness, and allows scrolling.
4. Confirm the loader element is absent from the DOM after completion and no page reports console errors.
5. Verify accessibility: emulate `prefers-reduced-motion` and check that the loader exits immediately without motion or a persistent scroll lock.
