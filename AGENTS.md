# AGENTS.md

Project instructions for AI coding agents working on the Aristurtle website.

## Purpose

This repository contains the current Astro implementation of the Aristurtle Racing Team website. The codebase is content-driven, animation-capable, and intended to be developed carefully rather than by broad theme-level rewrites.

The user values direct, factual communication. Do not overstate progress. Do not claim UI work is complete unless you have actually verified it.

## Current Repo Layout

The repository root is the Astro project.

```text
/
├── public/              Static public assets
├── src/
│   ├── assets/          Source-managed assets
│   ├── components/      Reusable UI components
│   ├── content/         Content collections and Markdown entries
│   ├── layouts/         Shared page layouts
│   ├── pages/           Route files
│   ├── styles/          Global styling and tokens
│   └── content.config.ts
├── specs/               Approved or draft implementation specs
├── aristurtle.gr/       Legacy mirror / reference material
├── package.json
├── AGENTS.md
└── CLAUDE.md
```

## Core Rules

1. Spec before code for non-trivial UI work.
2. Keep changes scoped. Do not silently redesign unrelated parts of the site.
3. Verify before claiming completion.
4. Stop on divergence. If the repo, data, or visual reality differs from the assumed plan, report it.
5. Be explicit about what was changed, what was verified, and what remains unverified.

## Workflow

### 1. Spec

For any non-trivial feature or redesign pass, create or update a spec file in `specs/` before implementation.

Each spec should contain:
- Goal
- References
- Acceptance criteria
- Out of scope
- Commands to run

Acceptance criteria should be measurable where possible. Prefer statements like:
- "`<Hero>` renders a single full-bleed visual plane above the fold"
- "No console errors on load"
- "CTA group contains exactly 2 actions"
- "Desktop hero title remains on 2 lines or fewer at 1280px"

Avoid vague criteria like "looks premium" or "feels dynamic".

### 2. Plan

Before editing, identify:
- The files you will touch
- The files you will not touch
- Any likely risk areas

### 3. Implement

- Make focused changes.
- Prefer one component or one section at a time.
- Do not refactor widely unless the task explicitly calls for it.
- Preserve the existing visual language unless the task is a deliberate redesign.

### 4. Verify

Minimum verification for UI work:
- `npm run build`
- browser-level inspection if available
- check for console errors if browser tooling is available

If Playwright MCP or Chrome DevTools MCP is available in the session, use it.

If MCP is not available:
- do not pretend you visually verified the result
- report exactly what you did verify locally

## Browser Verification

Preferred verification order:

1. Playwright MCP for navigation, screenshots, viewport checks, and interaction flows
2. Chrome DevTools MCP for computed styles, layout numbers, and console inspection
3. If neither MCP server is available, fall back to build/test/tooling checks and clearly state that browser self-verification was not possible in this session

Never fabricate a pass/fail report.

## Editing Boundaries

- `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, and `src/content/` are the normal working areas.
- `public/` may be updated for public assets.
- `aristurtle.gr/` should be treated as reference material unless the user explicitly asks to modify it.
- Generated output should not be edited by hand.

## Commands

Run from repository root:

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Communication Standard

- Be concise.
- Be literal about status.
- State blockers early.
- Separate completed work from assumptions.
- If something is not verified, say it is not verified.

## Design Standard

For branded landing-page work:
- first viewport should read as one composition
- brand must be a hero-level signal
- use real imagery as the primary visual anchor where possible
- avoid dashboard-style clutter and decorative overlays
- motion should support hierarchy, not create noise

When working within the existing prototype or design system, evolve it rather than replacing it with a generic template.
