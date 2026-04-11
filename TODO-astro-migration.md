# TODO — Astro Migration

**Status:** Setup complete. Spec approved by Jason ("go"). Implementation started but paused so Jason can restart Claude Code and pick up with MCP tool schemas loaded into the session.

**Resume instruction for next session:** Read this file top-to-bottom BEFORE doing anything. Then read `AGENTS.md`, `CLAUDE.md`, and `specs/SPEC-base-layout.md`. Then continue from the "RESUME HERE" marker below.

---

## Context

We are migrating the Aristurtle Racing Team website from a hand-written 432-line monolith (`src/index.html` + Tailwind CLI v3) to **Astro 5 + Tailwind v4** inside the `astro/` subdirectory. The migration is driven by two problems we identified over the prior session:

1. **"Jenga" problem** — hand-editing `src/index.html` means changing one section breaks another. Astro's component-based approach with scoped CSS solves this architecturally.
2. **"Blind agent" problem** — agent claims "done", Jason sees it's wrong, wasted cycles. Fixed by the new spec-first + self-verify workflow (see `AGENTS.md`) plus two MCP browser automation servers (`playwright` and `chrome-devtools`).

Jason is **new to frontend**. Every frontend term must be explained in plain English. See `AGENTS.md` section 0.1.

---

## What is already done

### Setup phase — COMPLETE

- ✅ `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest` — both MCP servers registered and marked "Connected" in `claude mcp list`. (Playwright MCP was added in a prior session.)
- ✅ `CLAUDE.md` created at repo root — terse project rules for Claude.
- ✅ `AGENTS.md` created at repo root (445 lines, deliberately emphatic + repetitive, with section 0.1 on plain-English communication for Jason's frontend-newness). This is the cross-agent standard file that Cursor, Codex, Aider, etc. all read.
- ✅ Astro scaffolded in `astro/` via `npm create astro@latest astro -- --template minimal --typescript strict`. Node 22, Astro 5.x.
- ✅ Tailwind v4 integration added via `npx astro add tailwind --yes` — uses `@tailwindcss/vite` plugin. Config lives in `astro/src/styles/global.css` as `@import "tailwindcss"` directive + future `@theme` block.
- ✅ `npm run build` in `astro/` verified working (2.99s, 1 page built, no errors).
- ✅ `specs/SPEC-base-layout.md` written with 36 numbered acceptance criteria.
- ✅ Jason approved the spec with "go" — all 6 decisions in the spec are GO.
- ✅ Logo asset copied: `src/assets/images/logo-horizontal.png` → `astro/public/assets/images/logo-horizontal.png` (505 KB).

### Memory & preferences — COMPLETE

- ✅ Memory entry saved: `~/.claude/projects/-home-iason-workbench-TurtleWebsite/memory/user_frontend_background.md` — "Jason is new to frontend, explain every term in plain English".
- ✅ `MEMORY.md` index updated with that entry.

---

## Spec divergence already noted (non-blocking)

The spec said logo lives at repo-root `assets/images/logo-horizontal.png`. **Reality:** it's at `src/assets/images/logo-horizontal.png`. One-directory correction. No decision needed. Already copied to the correct destination. To be reported in the final self-verify table under "Notes".

---

## Files created so far

- `CLAUDE.md`
- `AGENTS.md`
- `TODO-astro-migration.md` (this file)
- `specs/SPEC-base-layout.md`
- `astro/` (entire scaffold — ~250 npm packages, Astro 5, Tailwind v4, TS strict)
- `astro/public/assets/images/logo-horizontal.png` (copied from `src/assets/`)

**NOT yet created** (this is the next session's work):
- `astro/src/layouts/BaseLayout.astro`
- `astro/src/components/Nav.astro`
- `astro/src/components/Footer.astro`
- Theme block + global styles inside `astro/src/styles/global.css`
- `astro/src/pages/index.astro` is still the Astro scaffold's default — needs to be rewritten to use `BaseLayout` + `Nav` + empty `<main>` + `Footer`.

---

## RESUME HERE — remaining execution plan

Execute in order. Do NOT skip steps. Do NOT touch anything outside `astro/` (and `specs/images/` for screenshots). Follow AGENTS.md workflow strictly.

### Step 1 — Port theme to Tailwind v4 `@theme` block

**File:** `astro/src/styles/global.css`

**Current contents:** just `@import "tailwindcss";` (one line).

**Target contents:** the import line, then an `@theme` block defining the color tokens and font-family tokens from legacy `tailwind.config.js` (repo-root, read it fresh — it has `secondary: #f7941d`, `tertiary: #00d4ff`, all the surface-* colors, `headline` = Space Grotesk, `body`/`label` = Inter), then the global rules from `src/css/input.css:1-97` that are NOT section-specific (keep: selection color, focus-visible outline, scrollbar, smooth scroll, grayscale-hover img utility; SKIP: tonal-shift, kinetic-bg, glass-panel, cinematic-reveal, showcase-*, tech-card, scan-line — those belong in future component specs).

**Tailwind v4 syntax reminder** (v4 uses CSS, not JS, for config):

```css
@import "tailwindcss";

@theme {
  --color-primary: #0a0a0a;
  --color-secondary: #f7941d;
  --color-secondary-light: #ffaa33;
  /* ...etc, all colors from tailwind.config.js... */
  --font-headline: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-label: "Inter", sans-serif;
}

/* Global rules from src/css/input.css */
html { scroll-behavior: smooth; }
::selection { background-color: #ff6b35; color: #ffffff; }
:focus-visible { outline: 2px solid #ff6b35; outline-offset: 2px; }
/* ...etc... */
```

**Gotcha:** legacy `tailwind.config.js` has `font-size: 1.5rem` applied to `html` via `src/css/input.css:5-8`. This makes the whole legacy site render at 1.5x browser zoom equivalent. **DO NOT port this rule** — it was a legacy workaround and the new Astro site should render at normal scale. If Jason's visual comparison later says "things look too small", we revisit. (Flag in verification report.)

**Gotcha:** opacity syntax for custom colors changed between v3 and v4. Legacy uses classes like `border-outline-variant/20` (20% opacity). In v4 with CSS-variable colors, this usually just works via `color-mix()` under the hood, but verify in build. If it breaks, STOP and report.

### Step 2 — Create `astro/src/layouts/BaseLayout.astro`

**Purpose:** shared page skeleton — `<html>`, `<head>` (title, fonts, meta, viewport, CSS import), `<body>` with a `<slot />` for page content.

**Must include:**
- `<html lang="en" class="dark">` — criterion 6.
- `<title>ARISTURTLE | Formula Student Electric & Driverless</title>` — criterion 7.
- `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Google Fonts links (Space Grotesk + Inter, weights 300-900) — criterion 4.
- Material Symbols Outlined font link — criterion 5.
- Import `../styles/global.css`.
- `<body class="selection:bg-secondary selection:text-on-secondary">` (matching legacy body).
- `<slot />` inside `<body>` where page content will go.
- Accept a `title` prop so pages can override the default title (optional, clean practice).

**Astro frontmatter syntax** (the `---` block at the top of `.astro` files) is where you write TypeScript. Component props go there. Example:

```astro
---
import '../styles/global.css';
interface Props { title?: string; }
const { title = 'ARISTURTLE | Formula Student Electric & Driverless' } = Astro.props;
---
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    ...
    <title>{title}</title>
  </head>
  <body class="...">
    <slot />
  </body>
</html>
```

### Step 3 — Create `astro/src/components/Nav.astro`

**Source:** port `src/index.html:13-44` (the `<nav>` block + mobile menu `<div>`) plus the mobile menu toggle JS from `src/js/main.js:5-13` and the lang-switcher alert from `src/js/main.js:141-147`.

**Must have:**
- `<nav class="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md tonal-shift">` — criteria 13, 14. **Note:** `tonal-shift` is a custom class defined in legacy `src/css/input.css:37-40`. Since it's used by the nav ONLY (per my grep — verify), port it into the Nav.astro `<style>` block as a scoped style, not global.
- Logo `<img src="/assets/images/logo-horizontal.png" ...>` — criterion 17. **Note the leading slash** — Astro serves `public/` at root.
- Exactly 7 desktop links in order: Home, About, Cars, Divisions, Partners, Recruitment, Contact — criterion 15.
- Home link styled as active (orange text, bottom border) — criterion 16. Use `text-secondary` + `border-b-2 border-secondary`.
- `class="lang-switcher"` on the EN/GR element — criterion 18.
- Mobile menu button with `class="mobile-menu-btn"`, initially visible only below `md:` breakpoint (768px) — criteria 20, 21.
- Mobile menu dropdown with `class="mobile-menu hidden md:hidden ..."` — starts hidden — criterion 22. Contains the same 7 links — criterion 24.
- `<script>` block at the bottom of the component containing the toggle logic (this is Astro's way of including client-side JS scoped to the component):

```astro
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.mobile-menu');
    if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));

    const lang = document.querySelector('.lang-switcher');
    if (lang) lang.addEventListener('click', () => alert('Greek language support coming soon!'));
  });
</script>
```

- Nav links point to `#` for deferred pages (About, Cars, Divisions, Partners, Recruitment, Contact) and `/` for Home. Jason approved this in decision #3.

### Step 4 — Create `astro/src/components/Footer.astro`

**Source:** port `src/index.html:386-430` verbatim (adjusting classes to v4 if anything breaks).

**Must have:**
- `<footer class="bg-neutral-900 border-t border-neutral-800">` — criterion 25.
- 4-column grid (`grid-cols-1 md:grid-cols-4`) — criterion 26.
- Column 1: brand name + tagline.
- Column 2: Connect header + 4 social links (Instagram, LinkedIn, Facebook, YouTube, in that order) — criterion 27. Legacy `hrefs` are `https://instagram.com/aristurtle`, `https://linkedin.com/company/aristurtle`, `https://facebook.com/aristurtle`, `https://youtube.com/@aristurtle`.
- Column 3: Info header + 3 links (Privacy Policy, Technical Specs, Team History — all `#`).
- Column 4: Newsletter header + email input (`type="email"`, placeholder `"EMAIL ADDRESS"`) + arrow button — criterion 29.
- Copyright row: text containing `© 2024 ARISTURTLE RACING TEAM` — criterion 28.

**Isolation check:** NO global CSS additions in `global.css` for footer. Any custom footer styling goes inside `Footer.astro <style>` block.

### Step 5 — Update `astro/src/pages/index.astro`

Replace the Astro scaffold's default content with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout>
  <Nav />
  <main class="min-h-screen"></main>
  <Footer />
</BaseLayout>
```

The `<main class="min-h-screen">` placeholder ensures the footer doesn't collide with the nav on an empty page. `min-h-screen` = Tailwind class meaning "at least as tall as the browser viewport".

### Step 6 — Build

```bash
cd /home/iason/workbench/TurtleWebsite/astro
npm run build
```

Expect: zero errors, zero warnings, 1 page built to `astro/dist/`. If anything fails, STOP and report per AGENTS.md divergence protocol.

### Step 7 — Start dev server in background

```bash
cd /home/iason/workbench/TurtleWebsite/astro && npm run dev > /tmp/astro-dev.log 2>&1 &
echo $! > /tmp/astro-dev.pid
```

Wait ~2 seconds. `curl -sS -o /dev/null -w '%{http_code}' http://localhost:4321/` should return `200`.

### Step 8 — Self-verify with MCP

**Preferred path** (if MCP tools are loaded in the new session):
- Use `playwright` MCP: navigate to `http://localhost:4321/`, screenshot desktop (1280×800) + mobile (375×800), save to `specs/images/base-layout/`.
- Use `chrome-devtools` MCP: read computed styles for each criterion that needs a numeric check (criteria 11, 12, 13, 14, 25).

**Fallback path** (if MCP still not loaded): use the existing `/tmp/cdp-full.js` CDP WebSocket approach Jason and I built in the previous session. Adapt it to:
1. Launch chromium with `--remote-debugging-port=9222 --headless=new`.
2. Connect via WebSocket, navigate to `http://localhost:4321/`.
3. For each of the 36 criteria, run a `Runtime.evaluate` that returns a boolean or a numeric measurement.
4. Collect all results into a pass/fail table.

Do NOT fabricate results. Every row in the table must correspond to a real measurement.

### Step 9 — Produce the pass/fail report

Format defined in `AGENTS.md` section 3 phase 4. Example:

```
### SELF-VERIFICATION REPORT — SPEC-base-layout

| #  | Criterion                                 | Method                    | Result                 |
|----|-------------------------------------------|---------------------------|------------------------|
| 1  | npm run build exits 0                     | shell                     | ✅ PASS                |
| 2  | dist/index.html > 2 KB                    | stat                      | ✅ PASS (N bytes)      |
| 3  | exactly one <nav> and one <footer>        | grep count                | ✅ PASS                |
| 11 | bg-secondary → rgb(247,148,29)            | chrome-devtools: computed | ✅ PASS                |
| ...| ...                                       | ...                       | ...                    |

Overall: N/36 pass.
Iteration: 1 of 3.
Notes: spec said logo at repo-root assets/, actually src/assets/. Corrected (no approval needed).
```

### Step 10 — Stop and hand back to Jason

Regardless of pass/fail, STOP after the report. Do not continue to port Hero/Sponsors/etc. until Jason reviews the base layout result.

If all 36 pass → report says "ready for next spec".
If some fail → report lists specific fails and recommended next action per AGENTS.md section 4.

---

## Commands reference

```bash
# From repo root
cd /home/iason/workbench/TurtleWebsite

# Legacy site (for visual comparison)
python3 -m http.server 9911     # http://localhost:9911/src/

# Astro
cd astro
npm run build                    # produces astro/dist/
npm run dev                      # http://localhost:4321
npm run preview                  # preview built output

# Verify MCP servers are registered
claude mcp list

# Kill legacy + astro servers cleanly
cat /tmp/astro-dev.pid 2>/dev/null | xargs -r kill
pkill -f "http.server 9911"      # only if it's the specific server YOU started — otherwise use PID
```

---

## Files the next session must read first

1. **This file** (`TODO-astro-migration.md`) — full resume context.
2. **`AGENTS.md`** — section 0.1 (plain English for Jason), section 3 (5-phase workflow), section 4 (divergence protocol), section 7 (MCP tools).
3. **`CLAUDE.md`** — project rules (terse version).
4. **`specs/SPEC-base-layout.md`** — the approved 36-criterion spec. Jason said "go".
5. **`tailwind.config.js`** (repo root, for legacy v3 colors to translate).
6. **`src/css/input.css:1-97`** — global rules to port.
7. **`src/index.html:1-44`** — nav source.
8. **`src/index.html:386-430`** — footer source.
9. **`src/js/main.js:5-13, 141-147`** — mobile menu + lang switcher JS.

---

## Known gotchas for the next session

1. **Tailwind v4, not v3.** `astro/` uses `@import "tailwindcss"` + `@theme` in CSS. Legacy `src/` still uses `@tailwind base; @tailwind components; @tailwind utilities;` + JS config. Do NOT mix them.
2. **MCP session loading.** MCP tool schemas only load at session start. If you still don't see Playwright/chrome-devtools tools after restart, fall back to the `/tmp/cdp-full.js` CDP WebSocket approach — it produced real, honest measurements in the prior session and is acceptable verification per the "no lying" rule.
3. **Component isolation rule.** Each component's custom CSS lives inside its own `<style>` block in the `.astro` file. Only theme tokens and truly global styles (scrollbar, selection, focus, smooth scroll) belong in `global.css`.
4. **Logo path.** File is at `src/assets/images/logo-horizontal.png`, already copied to `astro/public/assets/images/`. In Astro, `public/` serves at site root, so the `<img src>` in Nav.astro should be `/assets/images/logo-horizontal.png` (leading slash).
5. **3-iteration budget.** If the first self-verify report has fails, you get 2 more tries. After that, STOP and report blockers — do not keep iterating.
6. **Jason is new to frontend.** When reporting, explain any frontend term in plain English on first use. See `AGENTS.md` section 0.1.
7. **No commits unless Jason explicitly asks.** No `git add -A`. No AI attribution in any commit message.

---

## Acceptance

Task complete when:
- All files in the "what is already done" + RESUME HERE lists exist.
- `npm run build` in `astro/` succeeds.
- Self-verify pass/fail report has been produced honestly (not fabricated) and shared with Jason.
- Jason has reviewed the report.

**This file (`TODO-astro-migration.md`) can be deleted ONLY after Jason confirms the base layout POC is accepted.**
