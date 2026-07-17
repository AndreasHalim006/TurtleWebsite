# SPEC: Subdivisions Page Restructuring

## 1. Goal
Restructure [subdivisions.astro](file:///c:/Aristurtle-site-LOCAL/src/pages/subdivisions.astro) to showcase the sub-subdivisions (subteams) of Mechanical, Driverless, and Operations (and Vehicle Dynamics) using the specific images extracted from [RECRUITMENT_2026.pdf](file:///c:/Aristurtle-site-LOCAL/RECRUITMENT_2026.pdf). For subdivisions without subteams (Powertrain, Electronics, IT), display their PDF-extracted images in a clean gallery format.

## 2. Aesthetics & Conventions
- **Palette:** Monochrome (#0A0A0A base background) with Brand Orange (`--brand-orange`) highlights.
- **Typography:** Jura font family, tracking-wide uppercase headings.
- **Motion:** Reveal-on-scroll using GSAP with `LUXE_EASE` easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Responsive:** Fluid layout, 2-column alternating layouts on screens `>=1024px`, stacking to 1-column on screens `<1024px`.

## 3. Data & Image Mapping
- **Mechanical**:
  - Aerodynamics -> `mechanical_aerodynamics.png`
  - Chassis & Composites -> `mechanical_chassis.png`
  - Suspension -> `mechanical_suspension.png`
  - Drivetrain -> `mechanical_drivetrain.png`
- **Powertrain**:
  - Gallery -> `powertrain_1.png`, `powertrain_2.png`
- **Electronics & Embedded**:
  - Gallery -> `electronics_1.png`, `electronics_2.png`
- **IT & Software Development**:
  - Gallery -> `it_1.jpg`, `it_2.png`
- **Vehicle Dynamics & Control**:
  - Master the Track -> `vehicledynamics_1.png`
  - Bridge the Gap -> `vehicledynamics_1.png`
  - The Math Behind the Speed -> `vehicledynamics_3.png`
  - Harness the Power -> `vehicledynamics_2.png`
- **Driverless**:
  - Perception -> `driverless_perception.png`
  - State Estimation & SLAM -> `driverless_slam.png`
  - Path Planning & Control -> `driverless_pathplanning.png`
  - Simulation -> `driverless_simulation.png`
- **Operations**:
  - Graphic Design -> `operations_graphic.png`
  - Economic Resources -> `operations_resources.png`
  - Business Plan -> `operations_resources.png`
  - Film & Photography -> `operations_film.png`
  - Social Media -> `operations_graphic.png`

## 4. UI Layout Specifications
- **Header:** Large section identifier (`01`, `02`, etc.) in low-opacity Brand Orange next to the subdivision title.
- **Subteams Layout:**
  - Alternate horizontal order (Desktop: odd items display image-left/text-right, even items display text-left/image-right).
  - Clean card container with `border-white/10` and subtle hover orange borders.
- **Gallery Layout (Powertrain/Electronics/IT):**
  - Side-by-side equal aspect ratio grid, or split-screen block.
- **Animations:**
  - Keep scroll triggers scoped and performant.

## 5. Verification Metrics
- Measurable 1: Page compiles successfully with `pnpm run build`.
- Measurable 2: Staggered columns stack correctly on mobile viewports without horizontal overflow.
- Measurable 3: All assets resolve correctly using Astro's dynamic `<Image />` component.
