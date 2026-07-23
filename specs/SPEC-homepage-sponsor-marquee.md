# SPEC: Homepage Sponsor Marquee Proportions

## Goal

Keep the homepage platinum-sponsor marquee visually balanced when source logos have widely different intrinsic aspect ratios.

## Scope

- `src/components/reactbits/SponsorLogoLoop.jsx`
- No sponsor data, source artwork, marquee motion, or sponsor-page layout changes.

## Acceptance Criteria

1. Every marquee logo occupies an equal `190px × 88px` desktop fitting slot.
2. Logo artwork uses `object-fit: contain` at `100%` width and height, with no stretching, cropping, or altered aspect ratio.
3. The gap between fitting slots is `48px`, independent of each logo's intrinsic width.
4. Existing external sponsor links, accessible names, hover scaling, direction, and marquee speed remain unchanged.
5. A failed logo request hides only the failed image and does not change the dimensions of its fitting slot.
6. `pnpm run build` completes successfully.
