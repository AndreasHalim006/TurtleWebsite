# SPEC: Station Content Priority

## Goal
Make the Subsystems and History stations feel immediately responsive by revealing readable HUD content before their heavier React Bits interactions.

## Scope
- `src/pages/index.astro`

## Acceptance Criteria
1. The Subsystems `FlowingMenu` and History `Cubes` islands hydrate only when their station content becomes visible, rather than during the initial page load.
2. At every desktop journey station, non-heavy HUD windows begin their reveal first.
3. The `FlowingMenu` and `Cubes` HUD windows begin their reveal after the lightweight windows, with no more than a `0.15s` intentional gap.
4. The station-active timeline label remains after both reveal groups so scroll-state behavior remains unchanged.
5. Reduced-motion behavior and mobile content remain unchanged.

