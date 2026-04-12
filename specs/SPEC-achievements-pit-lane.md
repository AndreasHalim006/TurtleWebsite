# SPEC — Achievements Pit Lane

## Goal
Replace the sticky-scroll coverflow in `Showcase.astro` with a horizontal
pit-lane scroller. The section should feel like rolling down pit row: forward
lateral motion, sector-style chrome, user in full control of pacing. No scroll
hijack, no tall sticky section, no auto-advance.

## Decisions (locked)
- **1A** Overwrite `Showcase.astro` in place. Same import, same slot in `index.astro`.
- **2C** Controls: native drag/swipe + scroll-snap + desktop arrow buttons +
  keyboard (← → when section is in viewport).
- **3B** Card width `clamp(340px, 42vw, 640px)`. 1 card on mobile, ~2 on desktop.
- **4A** No auto-advance. Pure manual.
- **5B** Header: existing "Engineering Milestones / Our proud Achievements."
  title, plus a monospace `SECTOR 02 / 06` readout AND a segmented bar that
  fills one cell per card as you advance.
- **6A** Natural section height (`py-24`). No 400vh, no sticky.

## Data source
Unchanged: `astro/src/content/showcase/*.md` collection, sorted by `order`.
Six cards today, component adapts to N cards automatically.

## Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ENGINEERING MILESTONES              SECTOR 02 / 06          │
│ Our proud Achievements.             ▰▰░░░░░░░░░░░           │
│                                                             │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│ ◀ │  active   │  │   next    │  │   next+1  │ ▶             │
│   │           │  │           │  │           │               │
│   └───────────┘  └───────────┘  └───────────┘               │
│   Title                                                     │
│   Caption                                                   │
└─────────────────────────────────────────────────────────────┘
```

- Strip: `overflow-x: auto`, `scroll-snap-type: x mandatory`, hidden scrollbar.
- Card: `scroll-snap-align: center`, `scroll-snap-stop: always`.
- Strip horizontal padding = `(container_width − card_width) / 2` (set via JS
  on mount + resize) so first and last cards can snap to center.
- Arrow buttons: absolute left/right, vertically centered on the strip.
- Active card border tinted `var(--color-secondary)`.

## Acceptance criteria
1. Section has NO `sticky` positioning and NO 400vh height. Natural `py-24`.
2. Renders all 6 cards from `showcase` content collection, sorted by `order`.
3. Card width = `clamp(340px, 42vw, 640px)`, aspect ratio 4/3.
4. Card image uses `object-fit: contain` (no cropping).
5. Strip horizontally scrolls via mouse drag, touch swipe, trackpad, and wheel.
6. Scroll-snap centers one card at a time, `scroll-snap-stop: always`.
7. Native scrollbar hidden.
8. First and last cards can reach the horizontal center of the strip.
9. Desktop arrow buttons (◀ ▶) visible ≥ 768px viewport width.
10. Left arrow scrolls to previous card; disabled at index 0.
11. Right arrow scrolls to next card; disabled at last index.
12. ArrowLeft / ArrowRight keyboard keys advance by one card IFF section is
    intersecting the viewport (IntersectionObserver gate, so keys don't hijack
    other sections).
13. `SECTOR XX / 06` readout reflects the currently centered card, 1-indexed,
    zero-padded to 2 digits.
14. Segmented bar has 6 cells; cells 1..activeIndex+1 are filled secondary
    colour; the rest are muted.
15. Active card has border colour `var(--color-secondary)`; others keep the
    default `outline-variant/20`.
16. No auto-advance. The scroll position only changes in response to user
    input (drag, wheel, button, key).
17. Component works at 375, 768, 1024, 1280, 1920, 2560 viewport widths with
    no horizontal overflow of the page itself.
18. Resize recomputes the strip padding so first/last cards stay centerable.
19. Build (`npm run build`) completes with no errors.

## Out of scope
- Any change to `Hero`, `Stats`, `Rhea`, `Divisions`, `Sponsors`, `JoinTheTeam`.
- The `showcase` content collection schema and files.
- Any new asset imports.
- Auto-advance, hover zoom, 3D transforms, parallax.

## Commands
- Dev: `cd astro && npm run dev`
- Build: `cd astro && npm run build`
- Verify: Playwright MCP at 375, 1280, 2560; test drag, keyboard, arrows, sector readout.
