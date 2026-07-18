# SPEC: Homepage Telemetry Preloader

## Goal
Implement a motorsport-themed, high-performance preloader specifically for the home page of the ARISTURTLE website. The preloader will mask the WebGL/Three.js compile latency, avoid layout shifts, and provide an immersive brand intro aligning with Formula Student engineering precision.

## References
- [src/pages/index.astro](file:///c:/Aristurtle-site-LOCAL/src/pages/index.astro)
- [src/layouts/BaseLayout.astro](file:///c:/Aristurtle-site-LOCAL/src/layouts/BaseLayout.astro)
- [src/components/Preloader.astro](file:///c:/Aristurtle-site-LOCAL/src/components/Preloader.astro) [NEW]

## Acceptance Criteria

1. **Homepage Limitation**:
   - The preloader must only render and execute on the homepage (the root `/` route).
   - All other subpages (e.g. `/contact`, `/sponsors`, `/subdivisions`) must bypass the loader and render immediately.

2. **Visual Design & Brand Alignment**:
   - Background color: Strict dark grey/black `#0A0A0A`.
   - Typography: **Jura** (Sans-serif/Monospace appearance) for all telemetry log items and counters.
   - Accent color: Aristurtle Orange (`--brand-orange` which maps to `--brand-primary-1` or `#9FFF10` line).
   - Layout: Clean, centered telemetry panel including:
     - A spinning wireframe vector or minimal tech HUD indicator.
     - A digital percentage display ticking from `00` to `100`.
     - Staggered telemetry status logs printing sequentially (e.g., `[SYS] LOAD DRIVERLESS MODULES...`, `[SYS] BOOTING TELEMETRY BUS...`, `[SYS] WEBGL SHADERS COMPILED`).
     - A progress bar (1px high, full width or boxed) expanding horizontally.

3. **Session Storage Gating**:
   - The loader must check `sessionStorage.getItem('aristurtle-preloader-played')`.
   - If present, the preloader container must be set to `display: none` immediately via inline styling or script in the header, ensuring no flash of the loader screen occurs on page refreshes or subpage navigation.
   - If not present, the loader executes, and sets `sessionStorage.setItem('aristurtle-preloader-played', 'true')` upon completion.

4. **Smooth Entry & Exit Choreography**:
   - The animation must use GSAP with the project-standard `luxe` ease (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - The percentage counter should count from `0` to `100` over a duration of `1.8` to `2.2` seconds.
   - When the counter hits `100` and the window `load` event fires (whichever is later), the exit sequence triggers:
     - The telemetry lines fade out (`opacity: 0`).
     - The preloader container translates upwards out of the viewport (`yPercent: -100` or `y: "-100%"`) over a duration of `1.0` second with `luxe` ease.
     - The homepage hero content initiates its reveal animation concurrently or immediately after the slide-up.

5. **Lenis Scroll-Locking Integration**:
   - During the loading sequence, the global Lenis smooth scroll must be locked using `window.lenis?.stop()`.
   - Once the exit animation completes, scrolling must be unlocked using `window.lenis?.start()`.
   - If the preloader is skipped via the `sessionStorage` check, Lenis scrolling must remain unlocked.

6. **Accessibility & Reduced Motion**:
   - In accordance with `prefers-reduced-motion`, if the user has disabled animations:
     - The loader must immediately fade out (`opacity: 0` with `duration: 0` or standard CSS transition of `0.1s`).
     - Scroll locking must be instantly released.

## Out of Scope
- Global preloader transitions between page route changes.
- Loading animations for images or videos on secondary pages.

## Verification Protocol
1. Verify code compiles and builds successfully using `pnpm run build`.
2. Verify visual appearance on desktop (1920px) and mobile (375px).
3. Test session storage:
   - First visit: Teleloader runs, counts to 100%, slides up, allows scrolling.
   - Refresh / internal page click: Loader does not show; page is immediately interactive.
4. Verify accessibility: Emulate `prefers-reduced-motion` in Chrome DevTools and check that the preloader is skipped/fades out immediately.
