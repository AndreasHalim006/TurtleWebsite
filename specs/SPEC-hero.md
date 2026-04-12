# SPEC — Hero (landing video + headline)

**Status:** DRAFT — awaiting Jason's approval
**Target:** `astro/src/components/Hero.astro` (new file)
**Scope:** First component rendered on `/` — full-viewport-height landing block with background video + overlay headline. Nothing else (no stats row, no CTA buttons, no scroll indicator).

---

## Goal

Port the legacy hero (`src/index.html` lines 45–60) to astro as a self-contained component. Keep the video background + gradient + headline + tagline, but **fix the main complaint**: the headline in the legacy version was oversized. The new headline must scale responsively so its **bottom edge never crosses the vertical midline of the viewport** (≈50vh), regardless of window size.

Everything scales fluidly with the window. No fixed px font sizes — all typography uses `clamp()` with viewport units.

---

## Reference — legacy source

```html
<header class="relative h-screen w-full flex items-center overflow-hidden">
  <div class="absolute inset-0 z-0">
    <video autoplay muted loop playsinline class="w-full h-full object-cover brightness-50">
      <source src="assets/images/hero-video.mp4" type="video/mp4"/>
    </video>
    <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent"></div>
  </div>
  <div class="relative z-10 px-8 md:px-16 max-w-4xl">
    <h1 class="font-headline text-5xl md:text-8xl font-bold tracking-tight text-white mb-6 uppercase">
      Engineering the Future of <span class="text-secondary">Electric</span> Racing
    </h1>
    <p class="text-on-surface-variant text-lg md:text-xl font-body max-w-2xl leading-relaxed">
      We design, build, and manufacture high-performance electric and autonomous racing vehicles.
    </p>
  </div>
</header>
```

**Problem with legacy:** `text-8xl` = 96px is a fixed value. At tall viewports it looks fine; at short viewports it overflows; at ultrawide it looks tiny. Worse, `flex items-center` centers the whole block vertically, so the headline's center sits at 50vh and its top/bottom spill both above and below the midline.

---

## Assets

- **Video:** `src/assets/images/hero-video.mp4` (6.4 MB, H.264, 1280×720, 72.75s). Already exists. Will be copied to `astro/public/assets/video/hero-video.mp4` so it's served as a static asset (video files go in `public/`, not `src/assets/`, because Astro's asset pipeline doesn't process video).
- **No new images or fonts.** Reuses `font-headline` (Space Grotesk) + `font-body` (Inter) from `global.css`.

---

## Layout decision — where does the headline sit vertically?

This is the crux of the "touch the middle but not bigger" requirement. I considered three options:

**Option A — Headline bottom-aligned to midline, tagline in lower half** *(recommended)*
```
┌──────────────────────────┐
│                          │
│  ENGINEERING THE FUTURE  │ ← upper half: headline grows, bottom at 50vh
│    OF ELECTRIC RACING    │
│──────────── midline ─────│
│  We design, build, ...   │ ← lower half: tagline directly below
│                          │
└──────────────────────────┘
```
Cleanest interpretation of "as big as to just touch the middle but not bigger." The headline's typography is free to be as large as 2 lines × ~line-height fit in the upper half minus top padding. The tagline sits in the lower half with its own breathing room. Sharp visual anchor at the midline.

**Option B — Whole block vertically centered, headline capped so TOP stays above midline**
The whole `<h1>` + `<p>` block is centered with `items-center`. Clamp the headline font-size so the block's total height doesn't force the top to spill above a reasonable point. Similar to legacy but with a clamp cap.

**Option C — Headline bottom-aligned to midline, no tagline**
Drop the tagline entirely. Just the headline, bottom at 50vh. Minimalist.

**My recommendation:** **A**. It's the literal reading of your requirement and produces a strong layout anchor. B keeps legacy centering but is harder to tune predictably. C loses information.

---

## Layout — Option A mechanics

Hero is a `<section class="h-screen ...">` (full viewport height) with two halves:

```astro
<section class="relative h-screen w-full overflow-hidden">
  <!-- video + gradient, absolutely positioned -->
  <div class="absolute inset-0 z-0">
    <video ...></video>
    <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent"></div>
  </div>

  <!-- content: 2 equal halves -->
  <div class="relative z-10 h-full flex flex-col px-8 md:px-16 lg:px-20">
    <!-- upper half: headline, bottom-anchored -->
    <div class="h-1/2 flex items-end pb-4 md:pb-6">
      <h1 class="hero-headline font-headline font-bold uppercase tracking-tight text-white leading-[0.95] max-w-5xl">
        Engineering the Future of <span class="text-secondary">Electric</span> Racing
      </h1>
    </div>
    <!-- lower half: tagline, top-anchored -->
    <div class="h-1/2 flex items-start pt-4 md:pt-6">
      <p class="hero-tagline font-body text-on-surface-variant leading-relaxed max-w-2xl">
        We design, build, and manufacture high-performance electric and autonomous racing vehicles.
      </p>
    </div>
  </div>
</section>
```

### Headline font-size math

The headline must fit inside `h-1/2 - pb-6` = ~50vh − 24px. With 2 lines and `line-height: 0.95`:
- 2 lines × line-height 0.95 = 1.9 × font-size
- Bottom padding = 24px ≈ 2.4vh on a 1000px-tall viewport
- Usable height ≈ 47.6vh
- Max font-size per viewport height ≈ 47.6 / 1.9 ≈ **25vh**

But we also need a max based on width so it doesn't spill horizontally on ultrawide. Legacy's `max-w-5xl` = 64rem = 1024px for the `<h1>`. At that max-width with the heading string "ENGINEERING THE FUTURE OF ELECTRIC RACING" wrapping to 2 lines, the longest line is ~22 characters. Font-size ≈ width / (22 × 0.55) ≈ `1024 / 12` ≈ 85px. In vw: on 1280px viewport, that's 6.6vw. On 1920px, 4.4vw. So vw scaling keeps it constant relative to max-width.

**Final formula:**
```css
font-size: clamp(2.5rem, min(22vh, 9vw), 8rem);
```
- `min: 2.5rem` (40px) — small screens
- `max: 8rem` (128px) — ultrawide
- `22vh` — the height-driven cap, slightly under 25vh to leave slack
- `9vw` — the width-driven cap, so two lines don't run off-screen
- `min(22vh, 9vw)` — whichever is smaller wins, preventing either overflow

This is what "just about touches the middle, but not bigger" means in CSS.

### Tagline font-size

```css
font-size: clamp(0.95rem, 1.6vh, 1.375rem); /* ~15px → 22px */
```
Legacy was `text-lg md:text-xl` (18→20px fixed). Fluid version keeps it subordinate to the headline.

### Responsive padding

- **< 768px (mobile):** `px-6`, halves collapse to natural heights (heading may wrap to 3 lines) — see mobile override below.
- **768–1023px (tablet):** `px-10`
- **≥1024px (desktop):** `px-16 lg:px-20`

### Mobile (<768px) override

At 375px wide, `9vw` = 33.75px — too small. The height cap (22vh on 667px = 147px) dominates, but 147px is absurd for a 375-wide phone. Add a mobile override:

```css
@media (max-width: 767px) {
  .hero-headline {
    font-size: clamp(2rem, 11vw, 4rem);
  }
}
```

This keeps mobile readable (32–64px) and lets the clamp formula apply only at ≥768px.

---

## Video element

- **Path:** `/assets/video/hero-video.mp4` (served from `astro/public/assets/video/`)
- **Attributes:** `autoplay muted loop playsinline preload="auto"` (same as legacy)
- **Class:** `w-full h-full object-cover brightness-50` (unchanged from legacy)
- **Poster (fallback image):** not added in v1 — when network is slow the video element shows a black background, which is acceptable since the hero section has a dark gradient overlay anyway. Can be added later.
- **Accessibility:** `aria-hidden="true"` on the video since it's decorative.

## Gradient overlay

Unchanged from legacy: `bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent`. This darkens the left third (where the text sits) and fades to transparent on the right so the video is visible there.

---

## Files to create / modify

**Create:**
- `astro/public/assets/video/hero-video.mp4` — copied from `src/assets/images/hero-video.mp4` (no processing)
- `astro/src/components/Hero.astro` — new component

**Modify:**
- `astro/src/pages/index.astro` — import and render `<Hero />` above `<main>`, or replace the empty `<main>` with `<Hero />`. I recommend replacing the empty `<main>` with `<main><Hero /></main>` so semantic structure stays correct.

**Do NOT modify:**
- `global.css`, `BaseLayout.astro`, `Nav.astro`, `Footer.astro`
- `src/` legacy tree
- `astro.config.mjs`

---

## Acceptance criteria (numbered, measurable)

### Build & structural
1. `cd astro && npm run build` exits 0 with no errors or warnings.
2. `dist/index.html` contains exactly one `<section>` whose first descendant is a `<video>` (the hero).
3. Hero contains exactly one `<video>` element.
4. Video `src` resolves to `/assets/video/hero-video.mp4` and returns HTTP 200 when served (dev or preview).
5. Video has attributes: `autoplay`, `muted`, `loop`, `playsinline`.
6. Hero section contains exactly one `<h1>`.
7. Hero `<h1>` textContent trimmed equals `Engineering the Future of Electric Racing`.
8. The word `Electric` in the `<h1>` is wrapped in a `<span>` with computed color `rgb(247, 148, 29)` (secondary).
9. Hero section contains exactly one `<p>` with textContent `We design, build, and manufacture high-performance electric and autonomous racing vehicles.`

### Vertical sizing — the core requirement
10. At viewport 1920×1080: the `<h1>` `getBoundingClientRect().bottom` is ≤ 540 (midline) and ≥ 460 (so it actually reaches near the middle, not way above).
11. At viewport 1280×800: same check, `<h1>` bottom ≤ 400 and ≥ 340.
12. At viewport 1024×768: same check, `<h1>` bottom ≤ 384 and ≥ 320.
13. At viewport 1920×1080: `<h1>` `getBoundingClientRect().top` > 0 (doesn't spill above viewport).
14. Hero section's own `getBoundingClientRect().height` equals `window.innerHeight` (full viewport, `h-screen`).

### Fluid font sizing
15. At viewport 1920×1080: `<h1>` computed `font-size` is between 100px and 128px.
16. At viewport 1280×800: `<h1>` computed `font-size` is between 80px and 120px.
17. At viewport 1024×600: `<h1>` computed `font-size` is between 60px and 100px.
18. At viewport 375×812 (mobile): `<h1>` computed `font-size` is between 32px and 64px.
19. At viewport 1920×1080 vs 1280×800, the two `font-size` values **differ** by ≥ 10px (proves it's actually fluid, not clamped to a single max).

### Layout
20. At viewport ≥768px: the headline `<h1>` is horizontally left-aligned (its left edge ≤ 160px from viewport left at 1280 width, matching `px-16`).
21. The `<p>` tagline is positioned **below** the `<h1>` (tagline `top` > headline `bottom`).
22. At viewport ≥768px: the tagline `top` is ≥ 50% of viewport height ± 30px (tagline lives in the lower half).
23. The gradient overlay div exists and has computed `background-image` containing `linear-gradient`.

### Video behavior
24. `<video>` element exists and `readyState` ≥ 2 after 3 seconds (loaded metadata + current frame). If blocked in CI, noted in report.
25. Video `muted` property is `true` at runtime (autoplay policy requires this).
26. Video has `object-fit: cover` computed style.
27. Video has `filter` containing `brightness(0.5)` (or equivalent) — matches `brightness-50`.

### Runtime
28. No console errors on initial load at 1280×800.
29. No 404s for the video file on initial load.

### Component isolation
30. `Hero.astro` has a scoped `<style>` block (the `clamp()` font rules live there, not in `global.css`).
31. `global.css` is unchanged from its current state.
32. `Nav.astro` and `Footer.astro` are unchanged.
33. The only change to `index.astro` is replacing the empty `<main class="min-h-screen"></main>` with `<main><Hero /></main>` (and adding the import).

---

## Plan

1. Copy `src/assets/images/hero-video.mp4` → `astro/public/assets/video/hero-video.mp4`.
2. Write `Hero.astro` with the layout above and scoped `<style>` containing the `clamp()` rules.
3. Update `index.astro` to import and render `<Hero />` inside `<main>`.
4. `cd astro && npm run build` — fix errors, STOP on divergence.
5. Self-verify all 33 criteria via Playwright MCP at viewports 1920×1080, 1280×800, 1024×600, 768×1024, 375×812.
6. Produce pass/fail table. Iteration budget: 3.

---

## Commands

```bash
cd /home/iason/workbench/TurtleWebsite
cp src/assets/images/hero-video.mp4 astro/public/assets/video/hero-video.mp4
cd astro && npm run build
# dev server should already be running from prior session
```

---

## What Jason needs to approve before I start

1. ✅ / ❌ — **Layout option A** (headline in upper half, bottom-anchored to midline; tagline in lower half, top-anchored). OK, or prefer B (whole block centered) / C (no tagline) / something else?
2. ✅ / ❌ — **Headline copy** stays `Engineering the Future of Electric Racing` with `Electric` in orange. OK, or new copy?
3. ✅ / ❌ — **Tagline copy** stays `We design, build, and manufacture high-performance electric and autonomous racing vehicles.` OK, or new copy?
4. ✅ / ❌ — **Font clamp formula** `clamp(2.5rem, min(22vh, 9vw), 8rem)` for desktop + `clamp(2rem, 11vw, 4rem)` for <768px. OK, or want me to tune (e.g. larger max, tighter min)?
5. ✅ / ❌ — **Video path** `astro/public/assets/video/hero-video.mp4` (served at `/assets/video/hero-video.mp4`). Different path preferred?
6. ✅ / ❌ — **Gradient overlay** kept exactly as legacy (`from-neutral-950 via-neutral-950/40 to-transparent`, left→right). OK?
7. ✅ / ❌ — **No poster image** for v1 (video loads from black). Acceptable, or should I generate/use a poster frame?
8. ✅ / ❌ — **33 acceptance criteria** above are the right level. Too strict / missing anything?

Reply with numbers + A/B/objections. Once approved, I execute.
