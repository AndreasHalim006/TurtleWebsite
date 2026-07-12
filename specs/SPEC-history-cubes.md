# SPEC: History Cubes Visual

## Goal
Replace the History station's magnetic line field with the supplied React Bits Cubes interaction while keeping the visual inside the right side of the car outline.

## Scope
- `src/components/reactbits/Cubes.jsx`
- `src/components/reactbits/MagnetLines.jsx` (remove)
- `src/pages/index.astro`

## Acceptance Criteria
1. The History station renders a responsive 6-by-6 Cubes grid in place of MagnetLines.
2. The containing HUD window has no surrounding border or background panel.
3. Cube faces use the monochrome surface and Aristurtle cyan edge color; click ripple uses Aristurtle lime.
4. Pointer tilt, idle animation, and click ripple remain enabled and use the project luxe easing curve.
5. The square grid is centered within the existing right-side History region and never exceeds its width.
6. MagnetLines is no longer imported, rendered, or retained as an unused component.

## Verification
1. Run `pnpm run build`.
2. Inspect the History station at desktop widths and confirm the Cubes grid remains inside the car outline with no outer HUD border.
