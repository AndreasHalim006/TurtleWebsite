# CLAUDE.md

Short project rules for AI agents. This file mirrors `AGENTS.md` in a more compact form.

## Project

Aristurtle Racing Team website built with Astro at the repository root.

## Stack

- Astro
- TypeScript
- Tailwind CSS v4
- Content collections
- Optional browser verification through Playwright MCP / Chrome DevTools MCP when available

## Where to work

- Main work happens in `src/`
- Public assets live in `public/`
- Specs live in `specs/`
- `aristurtle.gr/` is reference material unless explicitly requested otherwise

## Required workflow

1. Write or update a spec in `specs/` for non-trivial UI changes.
2. Keep the implementation scoped to the planned files.
3. Run `npm run build` before claiming the task is complete.
4. If browser MCP tools are available, use them for verification.
5. If browser MCP tools are not available, say so explicitly instead of claiming visual verification.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Do not

- Do not silently redesign unrelated sections
- Do not claim completion without verification
- Do not fabricate browser checks
- Do not treat outdated repo instructions as current if the actual file structure disagrees

## UI bias

Prefer:
- strong brand presence
- one clear job per section
- restrained motion
- real imagery over decorative abstraction

Avoid:
- hero cards
- floating badges and overlays in the hero
- dashboard-like clutter
- generic template aesthetics
