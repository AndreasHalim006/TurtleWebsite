# SPEC-sponsors-ideal.md | Fixed Honeycomb Sponsors Grid

## Goal

Create a sponsors page with a fixed full-viewport honeycomb field: all hexagons start as small dim marks, then each sponsor category expands from the center outward as the user scrolls.

## References

- Current route: `src/pages/sponsors.astro`
- Sponsor data: `src/content/sponsors/*.md`
- Category data: `src/content/sponsor-categories/*.md`
- Existing dark Grainient background and hex target cursor

## Acceptance Criteria

- The hero and final CTA from the current sponsors redesign remain.
- Desktop/tablet sponsor browsing uses one pinned, full-viewport, flat-top hexagon field.
- Idle state shows a medium-density field of small dim hexagons across the sponsor viewport.
- Each category scroll segment is `160vh`.
- During category changes, the previous sponsor hexes collapse to idle before the next category expands.
- Active sponsor slots are selected center-out, prioritizing the middle hexagons first.
- All sponsors in each category appear in the active state; dense tiers shrink/fit without viewport overflow.
- The Academia tier may scale active hexagons up to `1.5`; the existing viewport-fit bounds still take precedence so its 11-logo cluster remains fully visible.
- Active sponsor hexes use a white fill for logo readability and reveal logos in a center-out wave.
- The initial tier's logo resources are requested at high priority; later tiers preload in the background without competing with the initial page render.
- A tier transition must not reveal an active hexagon until every logo in that tier has completed loading or reached a handled error state.
- Desktop pool images must not use native lazy loading while positioned offscreen; changing tiers must not produce temporarily blank active hexagons.
- The HUD stays on the left edge and the tier rail stays on the right edge.
- The existing target cursor remains, locks to active sponsor hexes, and spins when idle.
- Mobile and `prefers-reduced-motion: reduce` render readable stacked sponsor sections with no pinned morph animation.
- No horizontal overflow and no console errors on load.

## Out Of Scope

- Changing sponsor/category content schema.
- Adding sponsor descriptions or new sponsor copy.
- Redesigning the navbar, hero, or final CTA beyond what is needed to integrate the new assembly scene.
- Editing legacy files under `aristurtle.gr/`.

## Commands To Run

```bash
pnpm run build
pnpm run dev
```

Use Playwright MCP for desktop, mobile, reduced-motion, console, and cursor behavior checks when available.
