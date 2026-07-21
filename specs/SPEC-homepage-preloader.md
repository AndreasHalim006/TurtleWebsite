# SPEC: Global Telemetry Preloader

## Goal
Implement a motorsport-themed global preloader for every ARISTURTLE page. The loader must cover real document loading, keep scrolling locked while the page settles, and release a fully initialized layout without adding avoidable animation work.

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
   - Typography: **Jura** (Sans-serif/Monospace appearance) for all telemetry log items and counters.
   - Accent color: Aristurtle Orange (`--brand-orange` which maps to `--brand-primary-1` or `#9FFF10` line).
   - Layout: Clean, centered telemetry panel including:
     - A spinning wireframe vector or minimal tech HUD indicator.
     - A digital percentage display ticking from `00` to `100`.
     - Staggered telemetry status logs printing sequentially (e.g., `[SYS] LOAD DRIVERLESS MODULES...`, `[SYS] BOOTING TELEMETRY BUS...`, `[SYS] WEBGL SHADERS COMPILED`).
     - A progress bar (1px high, full width or boxed) expanding horizontally.

3. **Real Loading Coordination**:
   - Progress must animate to no more than `90%` while the document is still loading.
   - The final `90%` to `100%` step must begin only after the intro timeline and either the browser `window.load` event or the readiness timeout have completed.
   - A third-party request must not trap the page at `90%`; document readiness must have a maximum wait of `3` seconds before the exit is allowed to continue.
   - The loader must be removed from the DOM after its exit so it leaves no persistent composited layer or pointer-event surface.

4. **Smooth Entry & Exit Choreography**:
   - The animation must use GSAP with the project-standard `luxe` ease (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - The percentage counter should count from `0` to `90` over `1.0` to `1.4` seconds, then complete to `100` in no more than `0.25` seconds after the page is ready.
   - When the counter hits `100`, the exit sequence triggers:
     - The telemetry lines fade out (`opacity: 0`).
     - The preloader container translates upwards out of the viewport (`yPercent: -100`) over `0.6` to `0.8` seconds with `luxe` ease.
   - The progress bar and exit movement must animate with transforms and opacity rather than layout properties such as `width`, `top`, or `left`.

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
3. Visit `/`, `/about-us`, `/garage`, and `/contact`: each route shows one loader, reaches 100%, exits, and allows scrolling.
4. Confirm the loader element is absent from the DOM after completion and no page reports console errors.
5. Verify accessibility: emulate `prefers-reduced-motion` and check that the loader exits immediately without motion or a persistent scroll lock.
