# SPEC — Base Layout + Navigation + Footer (Astro POC)

**Status:** DRAFT — awaiting Jason's approval
**Target:** `astro/` subdirectory (Astro 5 + Tailwind v4)
**Scope:** First migration task. Proves the Astro workflow end-to-end with low-risk components.

---

## Goal

Port the shared page skeleton from legacy `src/index.html` into reusable Astro components:

1. A shared **Base layout** (`<html>`, `<head>`, fonts, global styles, nav + footer slots).
2. A **Navigation** component (fixed top bar, logo, desktop menu, mobile menu toggle, language switcher).
3. A **Footer** component (4-column grid, social links, newsletter stub, copyright row).
4. A **minimal index page** (`astro/src/pages/index.astro`) that uses `BaseLayout` and renders only `<Nav />` + a placeholder `<main>` + `<Footer />`.

**No content sections yet.** Hero, stats, milestones, sponsors, partners, divisions come in later specs. This POC only proves layout + nav + footer + theme tokens work under Astro + Tailwind v4.

**Why this first:** base layout is load-bearing for every future component. If it's wrong, every later component inherits the bug. Nav and Footer are self-contained, data-light, and visually identifiable — easy to verify.

---

## Reference

- **Legacy source to port from:**
  - `src/index.html:1-44` — `<head>` + `<nav>` (nav bar + mobile menu)
  - `src/index.html:386-430` — `<footer>`
  - `src/js/main.js:5-13` — mobile menu toggle (13 lines of JS)
  - `src/js/main.js:141-147` — language switcher click handler (placeholder alert)
  - `tailwind.config.js:1-96` — full color palette + fonts to translate to Tailwind v4 `@theme` block
  - `src/css/input.css:1-97` — global styles (fonts, scrollbar, selection, focus) to port to `astro/src/styles/global.css`
- **Live reference** (legacy): start Python server on the repo root and open `http://localhost:9911/src/` to see the current visual baseline.
- **Screenshots**: I will capture the legacy nav + footer via Playwright MCP before implementing, and save to `specs/images/base-layout/legacy-{nav,footer}-{desktop,mobile}.png`. Final Astro output compared against those.

---

## Out of scope

**This task does NOT touch or create:**

- ❌ Hero section (video background, H1 headline)
- ❌ Stats strip (12+ Years / 8 Cars / 40+ Members / No.1)
- ❌ Achievements / Engineering Milestones (coverflow)
- ❌ Sponsors scroller
- ❌ Partners grid
- ❌ Divisions section
- ❌ Tonal shift / kinetic backgrounds / glass panels — global utility classes port along with the theme but are not exercised by any component yet
- ❌ Actual language switching (keeps the placeholder alert behavior)
- ❌ Sub-pages (`about.html`, `garage.html`, etc.) — nav links point to `#` or `/` for now and we note this as a known deferral
- ❌ Any edit to legacy `src/`, `aristurtle.gr/`, `dist/`
- ❌ Any `git commit`

---

## Files to create / modify

**Create:**
- `astro/src/layouts/BaseLayout.astro`
- `astro/src/components/Nav.astro`
- `astro/src/components/Footer.astro`

**Modify:**
- `astro/src/pages/index.astro` — replace scaffold's placeholder with `BaseLayout` using `Nav` + `main` placeholder + `Footer`
- `astro/src/styles/global.css` — add `@theme` block with colors/fonts from `tailwind.config.js`, plus global rules ported from `src/css/input.css` (selection, scrollbar, focus, smooth scroll, grayscale-hover utility). Keep `@import "tailwindcss"` at top.

**Do NOT modify:**
- `astro/astro.config.mjs` (already correct after `astro add tailwind`)
- `astro/tsconfig.json`
- `astro/package.json` (unless a new dep is needed; if so, STOP and report)

---

## Acceptance criteria (numbered, measurable)

### Build & structural

1. `cd astro && npm run build` exits 0 with no errors or warnings.
2. `astro/dist/index.html` exists and is > 2 KB.
3. `astro/dist/index.html` contains exactly one `<nav>` and exactly one `<footer>` element.
4. `astro/dist/index.html` references Google Fonts `Space Grotesk` and `Inter` in `<head>`.
5. `astro/dist/index.html` references Material Symbols Outlined font in `<head>`.
6. `astro/dist/index.html` has `<html lang="en" class="dark">`.
7. `astro/dist/index.html` `<title>` equals `ARISTURTLE | Formula Student Electric & Driverless`.
8. `astro/src/layouts/BaseLayout.astro`, `astro/src/components/Nav.astro`, `astro/src/components/Footer.astro` all exist.

### Theme tokens (Tailwind v4 `@theme`)

9. `global.css` defines CSS variables for all of these color names (matching `tailwind.config.js`): `primary`, `secondary`, `secondary-light`, `secondary-dark`, `tertiary`, `surface`, `surface-container-low`, `on-surface`, `on-surface-variant`, `outline`, `outline-variant`, `background`.
10. `global.css` defines the font families `headline` → `"Space Grotesk", sans-serif` and `body` → `"Inter", sans-serif` and `label` → `"Inter", sans-serif`.
11. A test element `<div class="bg-secondary">` renders with computed `background-color: rgb(247, 148, 29)` (== `#f7941d`) — verified via chrome-devtools MCP.
12. A test element `<div class="text-on-surface-variant">` renders with computed `color: rgb(196, 199, 199)` (== `#c4c7c7`).

### Navigation component — desktop (viewport width ≥ 1280px)

13. Nav is fixed at top: computed `position: fixed`, `top: 0px`.
14. Nav has computed `z-index: 50`.
15. Nav contains exactly 7 desktop menu links with text content `Home, About, Cars, Divisions, Partners, Recruitment, Contact` in that order.
16. Active link `Home` has text color `rgb(247, 148, 29)` (`#f7941d`) and a bottom border of the same color.
17. Logo image renders from `/assets/images/logo-horizontal.png` and is visible (non-zero `naturalWidth`).
18. EN/GR language switcher element exists with class `lang-switcher`.
19. No console errors after load.

### Navigation component — mobile (viewport width 375px)

20. Mobile menu button exists with class `mobile-menu-btn` and is visible (`display !== none`).
21. Desktop menu container is hidden (`display: none` on the `hidden md:flex` wrapper).
22. Initial state: element with class `mobile-menu` has the `hidden` class present.
23. Clicking `.mobile-menu-btn` toggles the `hidden` class on `.mobile-menu` (verified: click → class removed → click again → class added).
24. Mobile menu contains the same 7 links in the same order as desktop.

### Footer component

25. Footer has computed `background-color: rgb(23, 23, 23)` (== Tailwind `neutral-900` `#171717`) and a top border.
26. Footer renders a 4-column grid at viewport ≥ 768px: column 1 = brand + tagline, column 2 = Connect (4 social links), column 3 = Info (3 links), column 4 = Newsletter (email input + arrow button).
27. Footer contains exactly 4 social links with `hrefs` pointing to instagram.com, linkedin.com, facebook.com, youtube.com (in that order).
28. Footer copyright row shows text containing `© 2024 ARISTURTLE RACING TEAM`.
29. Newsletter input has `type="email"` and `placeholder="EMAIL ADDRESS"`.

### Component isolation

30. `Nav.astro` has a `<style>` block scoped to itself (or uses only Tailwind classes); no nav-specific CSS leaks into `global.css`.
31. `Footer.astro` has a `<style>` block scoped to itself (or uses only Tailwind classes); no footer-specific CSS leaks into `global.css`.
32. Removing `<Nav />` from `index.astro` leaves `<Footer />` visually unaffected (verified by a test build with Nav commented out: footer still renders identically). *(Optional step — skip if iteration budget is tight, but must be noted in report.)*

### Runtime (dev server)

33. `cd astro && npm run dev` starts on its default port (4321) without errors.
34. `GET http://localhost:4321/` returns HTTP 200.
35. Browser console is clean (no errors, no warnings) on initial page load at `/`.
36. No 404s in the network tab on initial load *except* for image paths that legitimately don't exist yet (noted and listed in the verification report).

---

## Plan

1. **Capture legacy baseline screenshots** via Playwright MCP against `http://localhost:9911/src/` (desktop 1280×800, mobile 375×800). Save to `specs/images/base-layout/legacy-*.png`. These become the visual reference.
2. **Port theme** — translate `tailwind.config.js` colors + fonts into `astro/src/styles/global.css` using Tailwind v4 `@theme { --color-*: ...; --font-*: ... }` syntax.
3. **Port global CSS** — copy selection, focus-visible, scrollbar, smooth-scroll, and `grayscale-hover` rules from `src/css/input.css:1-97` into `global.css`. Skip section-specific rules (tonal-shift, kinetic-bg, glass-panel, cinematic-reveal, showcase, tech-card, scan-line) — those belong in their own component specs later.
4. **Create `BaseLayout.astro`** — `<html lang="en" class="dark">`, `<head>` with meta/viewport/title/font links + import of `global.css`, `<body>` with a `<slot />` for page content.
5. **Create `Nav.astro`** — port `src/index.html:13-44` verbatim to Tailwind v4 classes; rewrite the `href`s to root-relative (`/`, `/about`, `/cars`, etc.) and note deferred pages. Add a minimal `<script>` for the mobile menu toggle and lang-switcher placeholder alert (13 lines from `main.js`).
6. **Create `Footer.astro`** — port `src/index.html:386-430` verbatim.
7. **Update `index.astro`** — wrap in `<BaseLayout>`, render `<Nav />` then empty `<main class="min-h-screen"></main>` placeholder (so footer doesn't collide with nav), then `<Footer />`.
8. **Build** (`npm run build`). Fix any errors. If build fails and the fix is unclear → STOP on divergence.
9. **Start dev server** (`npm run dev`).
10. **Self-verify** all 36 acceptance criteria via Playwright + chrome-devtools MCP. Produce the pass/fail table.

---

## Commands

```bash
# Legacy baseline (from repo root)
python3 -m http.server 9911   # serves legacy at http://localhost:9911/src/

# Astro build
cd astro && npm run build

# Astro dev
cd astro && npm run dev       # http://localhost:4321

# Astro preview (built output)
cd astro && npm run preview
```

---

## Known deferrals (not failures)

- Sub-page routes (`about`, `cars`, `divisions`, `partners`, `recruitment`, `contact`) don't exist yet. Nav links will point to `#` placeholders. Tracked for future spec.
- `assets/images/logo-horizontal.png` lives in repo-root `assets/`, not inside `astro/`. For this POC, copy the asset into `astro/public/assets/images/` so Astro serves it. Do NOT duplicate all assets — only the logo for now.
- Language switcher remains a placeholder `alert()` — real i18n via Astro's built-in i18n routing is a separate future spec.
- Tailwind v4 migration may require small syntactical changes (e.g., `border-outline-variant/20` — v4 opacity syntax may differ). Any such translation that isn't a mechanical 1:1 must be reported as a divergence.

---

## Iteration budget

**Maximum 3 self-verify iterations.** If after 3 attempts any of the 36 criteria still fail, STOP and report blockers with specific options.

---

## What Jason needs to approve before I start

1. ✅ / ❌ — Scope: base layout + Nav + Footer only, no content sections. OK?
2. ✅ / ❌ — Copy `logo-horizontal.png` into `astro/public/assets/images/` as the one-file exception. OK?
3. ✅ / ❌ — Nav links to `#` for deferred pages, deferred items listed above. OK?
4. ✅ / ❌ — Tailwind v4 `@theme` block in `global.css` is the correct place for color/font tokens (vs. a separate config file). OK?
5. ✅ / ❌ — 36 acceptance criteria above are sufficient / too strict / missing something. OK?
6. ✅ / ❌ — Iteration budget of 3 is acceptable. OK?

Reply with numbers + A/B/objections. Once approved, I execute the plan.
