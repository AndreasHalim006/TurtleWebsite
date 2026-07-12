# SPEC: History Magnet Lines Fit

## Goal
Keep the interactive line field in the right side of the History station visually contained inside the surrounding car outline at every desktop viewport size.

## Scope
- `src/components/reactbits/MagnetLines.jsx`
- `src/pages/index.astro`

## Acceptance Criteria
1. The History line field retains its 18-row, 5-column interactive layout and cyan-to-lime color progression.
2. The right panel displays its rounded cyan-to-lime HUD border, with the complete border inset inside the surrounding car outline.
3. The dashes retain the larger visual scale of the original field while a proportional safety inset keeps their rotating endpoints inside the panel border.
4. The field and border remain fully contained when their parent is resized; they do not rely on viewport-level `cqw` or `cqh` line dimensions.
5. Other homepage stations and journey camera/path geometry are unchanged.

## Verification
1. Run `pnpm run build`.
2. Inspect the History station at desktop widths and confirm the top, right, bottom, and left rows remain inside the car outline while the pointer interaction rotates the lines.
