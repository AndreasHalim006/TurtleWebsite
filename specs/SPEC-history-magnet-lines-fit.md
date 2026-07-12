# SPEC: History Magnet Lines Fit

## Goal
Keep the interactive line field in the right side of the History station visually contained inside the surrounding car outline at every desktop viewport size.

## Scope
- `src/components/reactbits/MagnetLines.jsx`
- `src/pages/index.astro`

## Acceptance Criteria
1. The History line field retains its 18-row, 5-column interactive layout and cyan-to-lime color progression.
2. The field has a proportional safety inset on all four sides; no line begins at the component boundary.
3. Each rotating line is capped relative to its grid cell, so its diagonal footprint cannot extend beyond the safety inset.
4. The field remains fully contained when its parent is resized; it does not rely on viewport-level `cqw` or `cqh` line dimensions.
5. Other homepage stations and journey camera/path geometry are unchanged.

## Verification
1. Run `pnpm run build`.
2. Inspect the History station at desktop widths and confirm the top, right, bottom, and left rows remain inside the car outline while the pointer interaction rotates the lines.
