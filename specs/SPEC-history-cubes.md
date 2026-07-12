# SPEC: History Cubes Visual

## Goal
Replace the History station's magnetic line field with the supplied React Bits Cubes interaction while keeping the visual inside the right side of the car outline.

## Scope
- `src/components/reactbits/Cubes.jsx`
- `src/components/reactbits/MagnetLines.jsx` (remove)
- `src/pages/index.astro`

## Acceptance Criteria
1. The History station renders a responsive 6-by-6 Cubes grid in place of MagnetLines.
2. The existing HUDWindow frame is enabled as a solid primary-blue rectangle with no gradient; its top and bottom edges sit inside the car-outline corners.
3. The Cubes configuration matches the supplied React Bits screenshot: dashed purple borders, grid size 6, maximum angle 45 degrees, radius 3, auto-animation enabled, and click ripple enabled.
4. Face color, ripple color, ripple speed, and cell spacing use the React Bits defaults; motion uses the project luxe easing curve.
5. The square grid is centered at 78% of the wider frame's content width, providing enough clearance that tilted edge cubes are not cropped by the frame or window bounds.
6. MagnetLines is no longer imported, rendered, or retained as an unused component.

## Verification
1. Run `pnpm run build`.
2. Inspect the History station at desktop widths and confirm the Cubes grid remains inside the car outline with no outer HUD border.
