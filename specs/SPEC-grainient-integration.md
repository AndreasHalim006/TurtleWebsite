# SPEC-grainient-integration.md

## Goal
Integrate the `<Grainient />` React component from React Bits into the ARISTURTLE website to provide a "Cinematic Precision" atmospheric background.

## Acceptance Criteria
- [x] Install `ogl` dependency.
- [x] Create `src/components/reactbits/Grainient.jsx` with the source code.
- [x] Implement the component in the main landing page (`index.astro`).
- [x] Use brand colors (Oranges: `#ff9800`, `#e65100`, `#ffc107`) for the gradient.
- [x] Ensure the component is positioned as a background with negative z-index.
- [x] Verify the build completes without errors.

## Implementation Details
- **Component Path:** `src/components/reactbits/Grainient.jsx`
- **Dependency:** `ogl`
- **Colors Used:**
  - `color1`: `#ff9800` (Brand Orange)
  - `color2`: `#e65100` (Brand Orange Dark)
  - `color3`: `#050505` (Void Background)
- **Props Tweaks:**
  - `timeSpeed`: `0.15` (Slower for a more cinematic feel)
  - `noiseScale`: `1.5`
  - `grainAmount`: `0.2` (Added more noise for texture)
  - `warpStrength`: `1.5`
  - `warpAmplitude`: `40`
  - `zoom`: `0.8`
