# TurtleWebsite — Project Instructions

## Project
Aristurtle Racing Team website. Migrating from hand-edited `src/index.html` + Tailwind CLI to **Astro** (component-based static site generator) with Tailwind.

## Directory layout
- `src/` — legacy hand-written HTML/CSS/JS. **Do not keep editing this for new work.** Kept for reference during migration.
- `astro/` — new Astro project. **All new UI work happens here.**
- `aristurtle.gr/` — Greek mirror. Do not touch unless explicitly asked.
- `dist/` — Tailwind CLI output for legacy `src/`. Will be retired after migration.
- `content/`, `assets/` — shared content/assets, may be referenced from Astro.

## Workflow — MANDATORY

### 1. Spec before code
Every non-trivial UI task starts with a `SPEC-{feature}.md` file containing:
- **Goal** — one paragraph, plain language.
- **Reference images** — pinned visuals in `specs/images/` when applicable.
- **Acceptance criteria** — numbered, **measurable** where possible (e.g. "active card rotateY = 48°", "max-width 640px", "6 items rendered from content collection").
- **Out of scope** — what this task explicitly does NOT change.
- **Commands** — exact build, dev server, screenshot/verify commands.

No code edits until the spec is written and Jason has approved it.

### 2. Component isolation
One feature = one `.astro` component with scoped `<style>`. Do not cross component boundaries to "fix" things in another component without saying so explicitly and getting approval.

Data-driven sections (milestones, sponsors, partners, divisions) use Astro **content collections** — one Markdown file per item with a typed schema. Adding a new item = dropping a new file, never editing the component.

### 3. Self-verify before declaring "done"
Before saying any UI task is complete, I MUST:
1. Run the build and dev server.
2. Use the **playwright** MCP or **chrome-devtools** MCP to load the page.
3. Screenshot or inspect the DOM for each acceptance criterion.
4. Report a **per-criterion pass/fail table** — not a vibes summary.
5. If any criterion fails and I cannot fix it in ≤ 3 self-verify iterations, stop and report a blocker per the divergence protocol in global CLAUDE.md.

"I think it's done" without the pass/fail table = not done.

### 4. MCP tools available
- **playwright** (`@playwright/mcp`) — drive the browser: navigate, click, scroll, screenshot, multi-viewport. Use for "make the page do X and show me the result".
- **chrome-devtools** (`chrome-devtools-mcp`) — debug the browser: console, network, computed styles, performance. Use for "why is this element the wrong size".

Prefer DOM measurement over screenshot comparison when a criterion is numeric (size, rotation, position, color). Screenshots are for layout/aesthetic verification that DOM numbers can't cover.

### 5. Iteration budget
Cap self-verify loops at **3 per task**. If the spec can't be met in 3 loops, stop and report — the spec is probably wrong or a decision is missing.

## Commands (legacy src/)
- Build: `npm run build` (Tailwind CLI → `dist/css/style.css`)
- Watch: `npm run watch`
- Local server (was on port 9911 last session): `python3 -m http.server 9911`

## Commands (astro/ — once scaffolded)
- Dev: `cd astro && npm run dev`
- Build: `cd astro && npm run build`
- Preview built output: `cd astro && npm run preview`

## Things NOT to do
- Do not `git add -A`. Always add specific files. (Also in global CLAUDE.md.)
- Do not modify `aristurtle.gr/` unless explicitly asked.
- Do not keep hand-editing `src/index.html` for new features — that's what this migration is about.
- Do not claim a UI task is "done" without the self-verify pass/fail table.
- Do not cross component boundaries silently.
