# Aristurtle Website | Agent Instructions

Project instructions and context for AI coding agents working on the Aristurtle website. 
This file serves as the definitive source of truth for workflow, design, and technical guidelines.

## 1. Project Overview & Identity
- **Goal:** Official website for **ARISTURTLE**, the Formula Student racing team from the Aristotle University of Thessaloniki.
- **Aesthetics:** The site follows the layout, section structure and typography of https://www.revolve.no/ (used with permission): full-bleed photo sections with dark fades, uppercase display headings, thin-bordered translucent buttons. Only the old Aristurtle color palette and content were kept.
- **UI Bias:** Prefer strong brand presence, one clear job per section, restrained motion, and real imagery. Avoid floating badges and dashboard-like clutter.

## 2. Core Technologies
- **Framework:** Astro (Static Site Generator)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP with ScrollTrigger (native browser scrolling, no smooth-scroll library)

## 3. Required Workflow

1. **Active Branch:** For now, all commits and code pushes MUST go to the `v2` branch (`git push origin v2`). Do not push directly to `main` or `master`.
2. **Spec Before Code:** For any non-trivial feature or redesign pass, create or update a spec file in `specs/` before implementation. Acceptance criteria must be measurable (e.g., "Desktop hero title remains on 2 lines or fewer at 1280px" not "looks dynamic").
3. **Plan & Scope:** Identify files to touch and boundaries. Keep changes strictly scoped. Do not silently redesign unrelated parts of the site.
4. **Stop on Divergence:** If the repo, data, or visual reality differs from the assumed plan, stop and report it.
5. **Be Explicit:** State blockers early. Be literal about status. Separate completed work from assumptions.

## 4. Design System & Development Conventions

- **Colors:** Palette carried over from the previous site: blacks/dark grays `#0A0A0A`, `#141414` and a single accent `--color-brand-orange` (currently `#9FFF10`; change it in `src/styles/global.css`).
- **Typography:** **Syne** (display headings, uppercase, bold) and **Host Grotesk** (body, UI), both self-hosted via `@fontsource-variable`. Same pairing as the reference.
- **Spacing:** `.container-site` (`max-width: 1440px`) with `5vw` gutters.
- **Motion:** Restrained GSAP/ScrollTrigger (reveal on scroll, pinned horizontal car timeline). Always honor `prefers-reduced-motion`.
- **Navigation:** Fixed bar (menu button left, logo center, Join Us right); transparent over the hero, solid after scrolling. Menu overlay closes with Esc and traps focus.
- **Assets:** Photos live in `src/images/` and `src/assets/`, imported via Astro's asset system.

## 5. Repository Layout & Editing Boundaries

- **Normal working areas:** `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, and `src/content/`.
- **Layouts:** Use `src/layouts/BaseLayout.astro` for global structure.
- **Public:** `public/` is for static assets.
- **Specs:** `specs/` for approved or draft implementation specs.
- **Reference:** `aristurtle.gr/` is legacy mirror/reference material. Do NOT edit unless explicitly requested.

## 6. Commands

Run from repository root:
```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run preview
# Git / Deployment:
git push origin v2  # Push to v2 branch (active development/deployment branch)
```

## 7. Verification Protocol

Do NOT claim completion without verification. Minimum verification for UI work:
1. `pnpm run build`
2. Browser-level inspection (check for console errors).

**Browser Verification Order:**
1. Playwright MCP (navigation, screenshots, viewports, flows)
2. Chrome DevTools MCP (computed styles, layout numbers, console)
3. If neither MCP server is available, state explicitly that browser self-verification was not possible and report only what was verified locally. Never fabricate a pass/fail report.
