# Aristurtle Website | Project Context & Instructions

## Project Overview
This is the official website for **ARISTURTLE**, the Formula Student racing team from the Aristotle University of Thessaloniki. The project utilizes a **Minimalist Monochrome** aesthetic, emphasizing engineering precision through clean lines, high-contrast typography, and a strict color palette.

### Core Technologies
- **Framework:** [Astro](https://astro.build/) (Static Site Generator)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [GSAP](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Scrolling:** [Lenis](https://lenis.darkroom.engineering/) (Global smooth scroll with inertia)
- **3D/Visuals:** Three.js (integrated for advanced components)
- **Testing:** Playwright

## Architectural Patterns
- **Layouts:** Use `src/layouts/BaseLayout.astro` for global structure, including the smooth scroll initializer.
- **Components:** Modular Astro components located in `src/components/`. Key components like `Navbar.astro` handle complex scroll-linked brand states.
- **Design System:**
  - **Colors:** A strict monochrome palette (Blacks, Dark Grays `#0A0A0A`, `#141414`) with a single high-contrast accent color: Aristurtle Orange (`--brand-orange`).
  - **Typography:** **Jura** (Sans-serif) for all text elements, providing a modern, technical feel.
  - **Spacing:** Container-based model (`max-w-[1800px]`) with generous viewport-based gutters (`px-[5vw]`).

## Building and Running
- `pnpm run dev`: Start the local development server.
- `pnpm run build`: Generate a production-ready static build in the `dist/` directory.
- `pnpm run preview`: Locally preview the production build.
- `pnpm exec playwright test`: Execute the end-to-end test suite.

## Development Conventions
1. **Motion Design:** Always use the `LUXE_EASE` curve (`cubic-bezier(0.16, 1, 0.3, 1)`) for GSAP animations to maintain smooth, high-end motion.
2. **Typography:** Avoid italics and serif fonts. Use Jura exclusively with clean, standard tracking.
3. **Visuals:** Maintain perfectly flat, clean backgrounds. Avoid gradients, film grain, or complex textures.
4. **Assets:** Large video assets should be placed in `src/assets/images/` and imported via Astro's asset system for optimization.
5. **Interactive UI:** The NavBar uses a "Discrete Switch" logic—staying large during hero sections and snapping to compact once content begins.

## Key Files
- `src/layouts/BaseLayout.astro`: Global initialization (Lenis, Fonts).
- `src/components/Navbar.astro`: Complex scroll-linked navigation and logo dynamics.
- `src/pages/index.astro`: Homepage implementation with timeline and card-grid patterns.
- `src/styles/global.css`: Tailwind theme and global variable definitions.
