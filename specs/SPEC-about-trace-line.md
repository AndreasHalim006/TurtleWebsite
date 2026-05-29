# About Trace Line

## Goal

Update the about-section self-drawing SVG line so it starts from the middle of the left border, runs straight between the about text paragraphs, and then draws a mathematically regular hexagon on the right side of the section.

## References

- User direction: no intermediary shapes, only a straight line that starts at the left-border midpoint, passes between the paragraphs, and draws a perfect equal-sided hexagon.
- Existing about-section SVG drawing in `src/pages/index.astro`.

## Acceptance Criteria

- `#drawing-line` starts at the middle of the left SVG border: `M 0 50`.
- `#drawing-line` and `#drawing-hexagon` are both animated with DrawSVGPlugin in one scroll-linked sequence.
- The connector line draws before the hexagon.
- The path uses a straight connector before the hexagon and no gear/circuit/intermediary shapes.
- At desktop widths, the connector visually passes through the gap between the two about paragraphs.
- The about copy has a visible left page gutter and does not start flush against the viewport edge.
- The two paragraphs share a consistent right edge that reaches close to the hexagon without overlapping it.
- The hexagon vertices are calculated from one center point and one radius so all six sides are equal in SVG coordinate space.
- The hexagon is larger than the previous 16-unit-radius version.
- The final hexagon sits on the right half of the about-section SVG.
- The hexagon contains a visible, clipped Hyperspeed canvas with non-zero rendered dimensions.
- The about-section text sits to the left of the drawn hexagon at desktop widths.
- `npm run build` succeeds.
- Browser verification shows no console errors on the home page.
- Browser verification shows the drawing line and hexagon elements both exist and have non-zero total length.

## Out of Scope

- Redesigning the about-section text layout.
- Changing the scroll trigger timing.
- Replacing DrawSVGPlugin or the existing GSAP setup.
- Adding new image or icon assets.

## Commands to Run

```bash
npm run build
npm run preview
```
