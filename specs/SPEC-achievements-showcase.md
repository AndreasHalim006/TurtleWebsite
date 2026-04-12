# SPEC — Achievements Showcase (sticky coverflow)

**Status:** DRAFT — awaiting Jason's approval
**Target:** `astro/src/components/Showcase.astro` (new) + `astro/src/content/showcase/*.md` (new content collection) + images in `astro/src/assets/showcase/`
**Scope:** Port the legacy "Engineering Milestones" section (`src/index.html:83-175`) to Astro as a sticky-scroll 3D coverflow. Jason's original vision lives in `TODO-milestones-sticky-scroll.md` — this spec carries that design forward into the Astro architecture.

---

## Goal

A pinned (sticky) section that takes over the viewport while the user scrolls through 6 engineering milestones. Each milestone is a card with an image + title + caption. As the user scrolls, cards move in a circular coverflow arc: the active card is centered and fully opaque; the previous and next cards sit beside it, tilted back in 3D. All visible cards are **solid** — no see-through. First card has nothing to the left; last card has nothing to the right. Scrolling continues until the 6th card is active, then the page releases.

This is **one** component: `<Showcase />`. Data lives in a content collection so adding a 7th milestone = dropping a new markdown file.

---

## Reference — legacy behavior (what we're replacing)

Legacy uses `h-[600vh]` section + `sticky top-0 h-screen` inner + absolutely-positioned `.showcase-card`s. Motion logic at `src/js/main.js:51-116` runs in a continuous `rAF` loop and does a "pop-up from below" (`translateY: 100% → 0`) which Jason disliked ("it seems like it just pops up"). Covered cards are set to `opacity: 0.7` which causes the see-through Jason also disliked. Layout is a `grid-cols-12` with 5/12 text + 7/12 stage — no horizontal room for coverflow neighbors.

**Everything the new version must change:**
1. No pop-up — cards slide in via rotation/translation, not via vertical slide.
2. Fully opaque cards (`opacity: 1`) at all times when visible.
3. Text header moves **above** the stage; stage becomes full-width.
4. Motion is rotateY + translateX + scale + translateZ (coverflow arc).
5. Exactly 3 cards visible at any mid-scroll moment: prev, active, next.
6. First card has nothing on its left; last card has nothing on its right (no wrap).
7. Replace the continuous rAF loop with a throttled `scroll`/`resize` listener.

---

## Data model — content collection

Create a new content collection `showcase` at `astro/src/content/showcase/` with one markdown file per milestone. Schema (astro's `defineCollection` + `zod`):

```ts
// astro/src/content/config.ts  (create or append)
import { defineCollection, z } from 'astro:content';

const showcase = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    order: z.number(),           // 1..N, defines scroll sequence
    title: z.string(),           // "Custom Motors"
    caption: z.string(),         // 1-2 sentence description
    image: image(),              // processed by astro:assets
    alt: z.string(),             // accessibility alt text
  }),
});

export const collections = { showcase };
```

6 initial files (keeping legacy content verbatim):

| file | order | title | caption | image |
|---|---|---|---|---|
| `01-motors.md` | 1 | Custom Motors | In-house designed quad-motor powertrain delivering peak performance. | `motors1.png` |
| `02-ecu.md` | 2 | Custom ECU | Proprietary electronic control unit managing vehicle performance in real-time. | `ECU.png` |
| `03-chassis.md` | 3 | Aluminum Chassis | Lightweight aluminum spaceframe designed for maximum torsional stiffness. | `chassis.png` |
| `04-powertrain.md` | 4 | Powertrain | High-voltage battery pack optimized for endurance and acceleration. | `powertrain1.jpg` |
| `05-autonomous.md` | 5 | Autonomous System | Custom perception stack with LiDAR and AI for driverless racing. | `driverless.png` |
| `06-aero.md` | 6 | Aerodynamics | CFD-optimized wings generating maximum downforce with minimal drag. | `aero.png` |

Images copied from `src/assets/images/` → `astro/src/assets/showcase/` (NOT `public/`, because astro's `image()` helper processes them for WebP + responsive sizes). Markdown body is ignored (schema-only component); content collection is used purely for the typed frontmatter list.

---

## Layout — the sticky stage

```
┌─────────────────────────────────────────────────────┐  ← section top (h-[600vh])
│  [sticky region begins]                              │
│  ┌─ ENGINEERING MILESTONES ──────────  02 / 06 ──┐   │  ← header: label + title + progress
│  │  From CAD to Circuit.        [==========   ]  │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│           ┌────┐ ┌─────────┐ ┌────┐                  │  ← stage: prev | active | next
│           │prev│ │ active  │ │next│                  │
│           │    │ │         │ │    │                  │
│           └────┘ └─────────┘ └────┘                  │
│                                                       │
│  [sticky region ends when last card active]          │
└─────────────────────────────────────────────────────┘  ← section bottom
```

- Section: `<section class="relative h-[600vh] bg-neutral-950">`
- Sticky wrapper: `<div class="sticky top-0 h-screen flex flex-col overflow-hidden">`
- Header block (top, flex-shrink-0): label + headline on the left, paragraph + progress bar on the right. Max-w-7xl, centered.
- Stage (flex-1, relative): `.showcase-stack` full-width, `perspective: 1800px`, holds 6 absolutely-positioned `.showcase-card` divs.

---

## Motion math

Driven by a single JS function that reads section scroll progress and writes inline `transform` + `opacity` + `zIndex` to each card.

```ts
// progress: 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
const sectionRect = section.getBoundingClientRect();
const scrollable = section.offsetHeight - window.innerHeight;
const progress = Math.max(0, Math.min(1, -sectionRect.top / scrollable));

// virtual float index across N cards
const virtualIndex = progress * (N - 1);    // 0..5 for 6 cards

// per-card transforms
cards.forEach((card, i) => {
  const delta = i - virtualIndex;             // -5..+5, but only |delta|<1.4 matters
  const abs = Math.abs(delta);
  const clampedAbs = Math.min(abs, 1);

  const tx = delta * 55;                      // % of stage width
  const tz = -abs * 220;                      // px — push back
  const ry = -delta * 28;                     // deg — tilt
  const scale = 1 - clampedAbs * 0.18;        // 1.0 → 0.82
  const opacity = abs <= 1 ? 1 : Math.max(0, 1 - (abs - 1) / 0.4);
  const z = 100 - Math.round(abs * 10);

  card.style.transform =
    `translate(-50%, -50%) translateX(${tx}%) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
  card.style.opacity = opacity.toString();
  card.style.zIndex = z.toString();
  card.classList.toggle('is-active', abs < 0.5);
});
```

Progress bar width = `progress * 100%`. Counter = `String(Math.round(virtualIndex) + 1).padStart(2, '0') + ' / 06'`.

### Motion constants (tunable)

| constant | value | purpose |
|---|---|---|
| `translateX` per delta | 55% | horizontal slide between cards |
| `translateZ` per abs(delta) | −220px | depth pushback |
| `rotateY` per delta | 28° | coverflow tilt |
| `scale` reduction at delta=±1 | 0.18 (→0.82) | depth via size |
| `opacity` falloff | 1.0 until \|Δ\|=1, 0 at \|Δ\|=1.4 | hide far cards |
| fade transition | 80ms | smooth between rAF frames |

---

## Mobile (<768px) fallback

Coverflow doesn't fit at phone width. Use `matchMedia('(max-width: 767px)')` to switch to a single-card fade:

- Only the card with `round(virtualIndex) === i` is visible (`opacity: 1`, `scale: 1`, no rotate).
- All other cards: `opacity: 0`.
- Header becomes stacked (label → title → paragraph → progress), centered.

---

## Scroll listener (not rAF loop)

```ts
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { update(); ticking = false; });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
// IntersectionObserver to pause updates when section is fully off-screen
```

An `IntersectionObserver` watches the section. When `isIntersecting` is false, `onScroll` short-circuits. This avoids touching the DOM on every scroll event elsewhere on the page.

Inside `<Showcase>` the script is `<script>` (processed by Astro, module-scoped, runs once on page load).

---

## Styling

Card:
```css
.showcase-card {
  position: absolute;
  left: 50%; top: 50%;
  width: min(520px, 88vw);
  aspect-ratio: 4 / 3;
  background-color: #1b1c1c;           /* fully solid */
  border: 1px solid rgb(68 71 72 / 0.3);
  border-radius: 12px;
  overflow: hidden;
  backface-visibility: hidden;
  will-change: transform, opacity;
  transition: transform 80ms linear, opacity 80ms linear;
  box-shadow: 0 30px 60px -15px rgba(0,0,0,0.8);
}
.showcase-card.is-active { border-color: var(--color-secondary); }
.showcase-card__media { flex: 1; position: relative; }
.showcase-card__media img { width: 100%; height: 100%; object-fit: cover; }
.showcase-card__body { padding: 1rem 1.25rem; }
```

Stack:
```css
.showcase-stack {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1800px;
  transform-style: preserve-3d;
}
```

---

## Files to create / modify

**Create:**
- `astro/src/content/config.ts` (if missing) — content collection schema
- `astro/src/content/showcase/01-motors.md` … `06-aero.md` — 6 milestone files
- `astro/src/assets/showcase/motors1.png`, `ECU.png`, `chassis.png`, `powertrain1.jpg`, `driverless.png`, `aero.png` — copied from legacy `src/assets/images/`
- `astro/src/components/Showcase.astro` — the new component

**Modify:**
- `astro/src/pages/index.astro` — import and render `<Showcase />` below `<Stats />`

**Do NOT modify:**
- `global.css`, `BaseLayout.astro`, `Nav.astro`, `Footer.astro`, `Hero.astro`, `Stats.astro`
- `src/` legacy tree
- `astro.config.mjs`

---

## Acceptance criteria (numbered, measurable)

### Build & structural
1. `cd astro && npm run build` exits 0 with no errors or warnings.
2. Content collection `showcase` exists with exactly 6 entries, types pass `tsc --noEmit`.
3. Rendered page contains one `<section>` with height equal to `6 * window.innerHeight` (±1px).
4. That section contains exactly 6 `.showcase-card` elements.
5. Each card contains one `<img>` (optimized by astro:assets — `src` ends in `.webp` or contains the hashed filename from `_astro/`), one `<h3>`, one `<p>`.
6. Card titles, in DOM order, equal exactly `['Custom Motors', 'Custom ECU', 'Aluminum Chassis', 'Powertrain', 'Autonomous System', 'Aerodynamics']`.
7. No 404s in the Network panel on initial load.

### Sticky & scroll
8. While scrolling from section top to section bottom, the `.sticky` wrapper's `getBoundingClientRect().top` stays at ≈ 0 (±1px) for the entire scroll range.
9. At scroll `progress = 0`, `virtualIndex = 0`, card index 0 is centered (`|delta|<0.1`), card 1 is to the right as neighbor, card −1 doesn't exist (left side empty).
10. At scroll `progress = 1`, card 5 is centered, card 4 is to the left as neighbor, card 6 doesn't exist (right side empty).
11. At `progress ≈ 0.5`, the virtual index is ≈ 2.5 and cards 2 and 3 share the center with equal |delta|.
12. Counter text updates to `01 / 06` … `06 / 06` across the scroll range.
13. Progress bar computed `width` increases monotonically from 0 to full as `progress` goes 0→1.

### Coverflow motion
14. At any mid-scroll moment, at most 3 cards have `opacity >= 0.9` (prev, active, next).
15. All other cards have `opacity < 0.05`.
16. Active card has `scale(1)` (tolerance ±0.02) and `rotateY(0deg)` (±2°).
17. Neighbor cards (`|delta| ≈ 1`) have `rotateY ≈ ±28°` and `scale ≈ 0.82` (±0.02).
18. Cards never reach `opacity = 0.7` (the legacy see-through value) — no card is partially transparent.
19. `zIndex` of the active card is strictly greater than that of its neighbors.
20. On first card (`progress = 0`): no `.showcase-card` has a negative delta producing a visible left neighbor (`opacity < 0.05` for index 0's would-be left slot, which simply doesn't exist).
21. On last card (`progress = 1`): same on the right side.

### Layout
22. Header block (label "Engineering Milestones" + `<h2>` + `<p>` + progress bar) exists above the stage and is visually separated from it.
23. `<h2>` text includes `From CAD to` and `Circuit.` (with the period in a `text-secondary` span matching legacy).
24. Stage `.showcase-stack` computed `width` equals container width (full-bleed within max-w-7xl).
25. Stage `.showcase-stack` computed `perspective` is `1800px`.

### Mobile
26. At viewport 375×812: exactly one card has `opacity >= 0.9` at any scroll moment (single-card mode).
27. At 375×812: visible card has `rotateY(0)` and `scale(1)`.
28. At 375×812: header elements stack vertically.

### Performance / runtime
29. No `requestAnimationFrame` loop runs when the section is off-screen (verified by adding a console.count in dev, scrolling away, counter stops).
30. No console errors at any scroll position.
31. Scroll listener uses `{ passive: true }`.

### Component isolation
32. All styles scoped to `Showcase.astro` `<style>` block. `global.css` unchanged.
33. `Nav.astro`, `Footer.astro`, `Hero.astro`, `Stats.astro` unchanged.
34. The only change to `index.astro` is an added import + `<Showcase />` render below `<Stats />`.

---

## Plan

1. Copy 6 images from `src/assets/images/` → `astro/src/assets/showcase/`.
2. Create `astro/src/content/config.ts` with the `showcase` schema.
3. Create 6 markdown files in `astro/src/content/showcase/` with frontmatter (no body).
4. Write `Showcase.astro`: reads the collection, sorts by `order`, renders header + stage + cards, scoped `<style>`, client `<script>` for scroll listener.
5. Add import + render to `index.astro`.
6. `cd astro && npm run build` — fix errors, STOP on divergence.
7. Self-verify all 34 criteria via Playwright MCP at viewports 1920×1080, 1280×800, 1024×768, 768×1024, 375×812. Actually drive the scroll to sample `progress ∈ {0, 0.2, 0.4, 0.5, 0.6, 0.8, 1}`.
8. Pass/fail table. Iteration budget: 3.

---

## Commands

```bash
cd /home/iason/workbench/TurtleWebsite
mkdir -p astro/src/assets/showcase
cp src/assets/images/{motors1.png,ECU.png,chassis.png,powertrain1.jpg,driverless.png,aero.png} astro/src/assets/showcase/
cd astro && npm run build
```

---

## What Jason needs to approve before I start

1. ✅ / ❌ — **Content collection** approach (6 markdown files + typed schema) vs. hardcoding the 6 cards inside `Showcase.astro`. Collection is cleaner for adding future milestones but is more moving parts. Recommend: **collection**.
2. ✅ / ❌ — **Card copy** stays verbatim from legacy (see table above). OK, or new text?
3. ✅ / ❌ — **6 images** keep their legacy filenames/sources. OK, or new imagery?
4. ✅ / ❌ — **Motion constants** (55% translateX, −220px translateZ, 28° rotateY, 0.82 scale at delta=1). OK to start with these, tune if it doesn't feel right?
5. ✅ / ❌ — **Section height** `h-[600vh]` = ~100vh scroll per transition (same as legacy). OK, or tighter (e.g. `h-[400vh]` for faster cycling)?
6. ✅ / ❌ — **Header layout** — label + H2 on the left, paragraph + progress bar on the right (md+), stacked on mobile. OK?
7. ✅ / ❌ — **Headline copy** stays `From CAD to Circuit.` with `Circuit.` in orange. OK, or new copy?
8. ✅ / ❌ — **Mobile fallback** = single card fade, no side neighbors. OK?
9. ✅ / ❌ — **34 acceptance criteria** above are the right level. Too strict / missing anything?

Reply with numbers + ✅/❌ + alternatives. Once approved, I execute.
