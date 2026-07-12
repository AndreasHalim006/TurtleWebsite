# SPEC: History Cubes Visual

## Goal
Replace the History station's magnetic line field with the supplied React Bits Cubes interaction while keeping the visual inside the right side of the car outline.

## Scope
- `src/components/reactbits/Cubes.jsx`
- `src/components/reactbits/MagnetLines.jsx` (remove)
- `src/pages/index.astro`

## Acceptance Criteria
1. The History station renders a responsive 6-by-6 Cubes grid in place of MagnetLines.
2. The existing HUDWindow frame is a solid primary-blue square with no gradient, sized to `21.4% × 42.8%` in the 1920×960 station canvas and vertically centered around the Cubes grid.
3. The complete Cubes window is positioned at `x: 74.5%`, shifted 1.7 percentage points left from its previous position.
4. The Cubes configuration matches the supplied React Bits screenshot with official primary-blue dashed cube borders, grid size 6, maximum angle 45 degrees, radius 3, auto-animation enabled, and click ripple enabled.
5. Face color, ripple color, ripple speed, and cell spacing use the React Bits defaults; motion uses the project luxe easing curve.
6. The square grid is centered at 78% of the wider frame's content width, providing enough clearance that tilted edge cubes are not cropped by the frame or window bounds.
7. MagnetLines is no longer imported, rendered, or retained as an unused component.

## Verification
1. Run `pnpm run build`.
2. Inspect the History station at desktop widths and confirm the Cubes grid remains inside the car outline with no outer HUD border.
