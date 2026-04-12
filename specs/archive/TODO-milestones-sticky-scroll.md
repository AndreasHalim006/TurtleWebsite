# TODO — Engineering Milestones Sticky-Scroll (Coverflow Rework)

## TL;DR
Replace the current "pop-up from below" stacking showcase on the homepage Engineering Milestones section with a 3D coverflow-style sticky scroll: active card centered, one fully-opaque neighbor on each side, circular/arc motion between cards, page keeps scrolling until all milestones shown.

## Requirements (quoting Jason)
> "I want to create a sticky scroll for the engineering milestones page, so that I can showcase in an interactive way my teams milestones. I'd like some more circular motion, showing that an element goes in the background and another one comes in front, as a circle. Currently, it seems like it just pops up."
>
> 1. The website should scroll down if all the elements haven't been shown
> 2. While we're viewing the main card, 2 background cards should be visible, one on the left and one on the right.
> 3. The cards shouldn't be opaque, I don't want to see the rest of the cards through them. *(interpreted as: cards must be fully opaque — no see-through)*

Reference: https://homesickofafterlife.com/features/posts-sticky-scroll/

## Facts (current codebase)
- Section shell: `src/index.html:84` — `<section id="achievements-showcase" class="relative h-[600vh] bg-neutral-950">` with `sticky top-0 h-screen` inner. Requirement #1 (page scrolls until done) is already satisfied by this shell.
- Layout: `src/index.html:88` uses `grid-cols-12`, 5/12 text column + 7/12 stage. No horizontal room for left/right neighbors.
- Cards: `src/index.html:107-166` — 6 `.showcase-card` divs, each absolutely positioned inside `.showcase-stack` wrapper (`src/index.html:106`).
- Motion logic: `src/js/main.js:51-116`. Waiting cards start at `translateY=100%` + `opacity=0` → this causes the "pop up" feel. Covered cards fade to `opacity=0.7` → this causes see-through.
- Motion loop: `requestAnimationFrame(updateShowcase)` runs continuously (`src/js/main.js:111-115`) even when not scrolling.
- CSS: `src/css/input.css:121-151` — defines `.showcase-stack { perspective: 1500px }` and base `.showcase-card` (absolute, centered via `translate(-50%,-50%)`, `bg-color #1b1c1c`, border, top-shadow).
- Build: `npm run build` → `tailwindcss -i ./src/css/input.css -o ./dist/css/style.css --minify`.

## Decisions (Jason confirmed 2026-04-10)
1. **1A** — Cards are fully opaque (100%) at all times. Depth via scale + shadow + blur only.
2. **2A** — Text (headline + paragraph + progress bar) moves above the card stage; stage gets full width.
3. **3A** — Coverflow arc motion: rotateY + translateX + scale + translateZ.
4. **4A** — Show exactly 2 neighbors (prev + next). Hide others.
5. **5A** — First/last cards: empty side blank (no wrap-around).
6. **6A** — Keep `h-[600vh]` (≈100vh scroll per transition).
7. **7A** — Only touch `src/` + build to `dist/`. Do not touch `aristurtle.gr/` mirror.
8. **8A** — On mobile (<768px): single centered card, simple fade between cards, no side neighbors.

## Implied decisions
- Fix the `requestAnimationFrame` infinite loop — replace with scroll/resize listeners + rAF throttle. It's wasted CPU and trivial to fix while I'm in the file.
- Progress bar stays in place, just moves up into the new text header.
- Card background stays `#1b1c1c` (solid). Border colour on active card stays orange `#FF6B35` (secondary).

## Plan

### Step 1 — HTML restructure (`src/index.html:84-171`)
- Change the inner sticky container from `flex items-center` + `grid-cols-12` to `flex flex-col`.
- Top block: text header (headline, paragraph, progress bar) in a single horizontal row on md+, stacked on mobile.
- Bottom block: full-width stage `<div class="showcase-stack">` with `relative` positioning, height ~60-65vh, containing the 6 `.showcase-card` elements (unchanged structure).

### Step 2 — CSS updates (`src/css/input.css:121-151`)
- Keep `.showcase-stack { perspective: 1800px; transform-style: preserve-3d; }` — bump perspective for more depth.
- `.showcase-card`: absolute, `left: 50%; top: 50%`, width responsive (max 520px desktop, 88% mobile), `background-color: #1b1c1c` (fully solid), border, shadow. Add `backface-visibility: hidden` to avoid flicker during rotateY.
- Transition timing: small CSS transition on transform/opacity for smoothing between rAF frames (maybe 80ms).

### Step 3 — JS rewrite (`src/js/main.js:51-116`)
- Compute `globalProgress` from section rect (same as now).
- Compute `virtualIndex = globalProgress * (N-1)` — float "current card" index.
- For each card `i`, `delta = i - virtualIndex`.
- Desktop coverflow transform:
  - `translateX = delta * 55%` (of stage width; keeps neighbors inside viewport)
  - `translateZ = -Math.abs(delta) * 220px`
  - `rotateY = -delta * 28deg`
  - `scale = 1 - Math.min(Math.abs(delta), 1) * 0.18`
  - `opacity`: 1 for `|delta| <= 1`, linear fade to 0 across `|delta| ∈ [1, 1.4]`, 0 beyond
  - `zIndex = 100 - Math.round(Math.abs(delta) * 10)`
  - Active border (orange) when `|delta| < 0.5`
- Mobile (<768px, via `matchMedia`): single card only.
  - Active card (nearest integer to `virtualIndex`): opacity 1, scale 1, translateY 0, no rotation.
  - Others: opacity 0, no transform.
- Replace `requestAnimationFrame(updateShowcase)` loop with `scroll`/`resize` listener + rAF throttle. Initial call on DOMContentLoaded.
- Keep progress bar width update.

### Step 4 — Build
- Run `npm run build`.
- Visually verify in browser — dev server or file:// open.

### Step 5 — SPEC COMPLIANCE CHECK
Report back each requirement 1-3 + decisions 1-8 against what was built.

## Testing requirements
- Scroll through the section on desktop Chromium — verify:
  - Cards enter from right (as next), exit left (as prev) with rotation.
  - All visible cards are fully solid (no see-through).
  - Exactly 3 cards visible at any mid-scroll moment.
  - First card: no prev visible. Last card: no next visible.
  - Progress bar fills 0→100% across the section.
  - Section pins (sticky) until scroll progress reaches the bottom.
- Resize to <768px — verify single-card fallback works.
- Check no console errors.

## Documentation updates
- None required. `DESIGN.md` doesn't spec this section; comments in input.css can stay minimal.

## Out of scope
- `aristurtle.gr/` mirror sync (Jason: "we work on src").
- Fixing the `src/dist` vs root `dist` CSS output mismatch (noted earlier, separate concern).
- Any changes to other sections on index.html.
