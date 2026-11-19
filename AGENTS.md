# Aristurtle Website | Agent Instructions

Project instructions and context for AI coding agents working on the Aristurtle website. 
This file serves as the definitive source of truth for workflow, design, and technical guidelines.

## 1. Project Overview & Identity
- **Goal:** Official website for **ARISTURTLE**, the Formula Student racing team from the Aristotle University of Thessaloniki.
- **Aesthetics:** The site follows the layout and section structure of https://www.revolve.no/ (used with permission): full-bleed photo sections with dark fades, uppercase display headings, thin-bordered translucent buttons. Aristurtle uses its own typography pairing, color palette, and content.
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
- **Typography:** **Sansation** throughout, with regular body/UI and bold uppercase display headings, self-hosted via `@fontsource/sansation` (400 and 700). This replaces the Barlow trial and distinguishes Aristurtle from the reference.
- **Spacing:** `.container-site` (`max-width: 1440px`) with `5vw` gutters.
- **Motion:** Restrained GSAP/ScrollTrigger reveals; the home car section features one large latest-car image and text links to earlier cars, without a carousel or pinning. Always honor `prefers-reduced-motion`.
- **Navigation:** Fixed bar with logo and direct links to Home, About, Subteams, Team, Cars, Sponsors, and Join Us. Mobile links scroll horizontally; no pages dropdown or menu overlay. Solid background after scrolling; hides on downward scroll and returns on upward scroll, staying visible near the top and during keyboard focus.
- **Assets:** Photos live in `src/images/` and `src/assets/`, imported via Astro's asset system. Prefer the downloaded `src/images/fsg26/` pool for general site imagery; preserve historically accurate car and season photos. FSG photo uses must display the photographer credit from `src/data/fsg-media.ts` near the image; source records live in `src/data/fsg-media-manifest.json`.

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

Do NOT claim verification that was not performed. For UI work, run `pnpm run build` and relevant local checks.

**Browser testing (user preference, 2026-11-19):**
- The user performs browser testing by default. Do not launch browser testing, screenshots, or browser console checks unless the user explicitly requests or authorizes them.
- Tell the user what to check in the browser when handing off UI changes.
- When agent browser testing would be particularly valuable, explain briefly why and wait for the user's authorization before doing it. Continue independent implementation and local checks.
- Report local verification separately from browser verification; clearly state when browser testing is left to the user.
- When authorized, prefer Playwright MCP, then Chrome DevTools MCP. Never fabricate a pass/fail report.
