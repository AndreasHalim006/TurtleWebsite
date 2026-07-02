# Aristurtle Website | Agent Instructions

Project instructions and context for AI coding agents working on the Aristurtle website. 
This file serves as the definitive source of truth for workflow, design, and technical guidelines.

## 1. Project Overview & Identity
- **Goal:** Official website for **ARISTURTLE**, the Formula Student racing team from the Aristotle University of Thessaloniki.
- **Aesthetics:** Minimalist Monochrome. Emphasizes engineering precision through clean lines, high-contrast typography, and a strict color palette.
- **UI Bias:** Prefer strong brand presence, one clear job per section, restrained motion, and real imagery. Avoid floating badges, dashboard-like clutter, and generic template aesthetics.

## 2. Core Technologies
- **Framework:** Astro (Static Site Generator)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP with ScrollTrigger
- **Scrolling:** Lenis (Global smooth scroll with inertia)
- **3D/Visuals:** Three.js (integrated for advanced components)

## 3. Required Workflow

1. **Spec Before Code:** For any non-trivial feature or redesign pass, create or update a spec file in `specs/` before implementation. Acceptance criteria must be measurable (e.g., "Desktop hero title remains on 2 lines or fewer at 1280px" not "looks dynamic").
2. **Plan & Scope:** Identify files to touch and boundaries. Keep changes strictly scoped. Do not silently redesign unrelated parts of the site.
3. **Stop on Divergence:** If the repo, data, or visual reality differs from the assumed plan, stop and report it.
4. **Be Explicit:** State blockers early. Be literal about status. Separate completed work from assumptions.

## 4. Design System & Development Conventions

- **Colors:** Strict monochrome palette (Blacks, Dark Grays `#0A0A0A`, `#141414`) with a single high-contrast accent: Aristurtle Orange (`--brand-orange`).
- **Typography:** **Jura** (Sans-serif) for all text. No italics, no serif fonts.
- **Spacing:** Container-based model (`max-w-[1800px]`) with generous viewport gutters (`px-[5vw]`).
- **Motion Design:** Always use the `LUXE_EASE` curve (`cubic-bezier(0.16, 1, 0.3, 1)`) for GSAP animations to maintain smooth, high-end motion.
- **Visuals:** Maintain perfectly flat, clean backgrounds. Avoid gradients, film grain, or complex textures.
- **Interactive UI:** Navigation uses "Discrete Switch" logic (large during hero, snaps to compact when content begins).
- **Assets:** Large video assets should be in `src/images/` and imported via Astro's asset system.

## 5. Repository Layout & Editing Boundaries

- **Normal working areas:** `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, and `src/content/`.
- **Layouts:** Use `src/layouts/BaseLayout.astro` for global structure.
- **Public:** `public/` is for static assets.
- **Specs:** `specs/` for approved or draft implementation specs.
- **Reference:** `aristurtle.gr/` is legacy mirror/reference material. Do NOT edit unless explicitly requested.

## 6. Commands

Run from repository root:
```bash
npm install
npm run dev
npm run build
npm run preview
```

## 7. Verification Protocol

Do NOT claim completion without verification. Minimum verification for UI work:
1. `npm run build`
2. Browser-level inspection (check for console errors).

**Browser Verification Order:**
1. Playwright MCP (navigation, screenshots, viewports, flows)
2. Chrome DevTools MCP (computed styles, layout numbers, console)
3. If neither MCP server is available, state explicitly that browser self-verification was not possible and report only what was verified locally. Never fabricate a pass/fail report.
