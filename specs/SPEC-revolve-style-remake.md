# SPEC: Revolve-style Remake of the Aristurtle Website

Status: **IMPLEMENTED on branch `v2` (build verified; browser verification pending)**

Decisions (answered 2026-11-13):
1. Option A: Revolve layout/structure/motion; Aristurtle accent + Jura + flat dark backgrounds. The accent token is still `--color-brand-orange`, whose current value in the repo is `#9FFF10` (lime), not orange. One-line change in `src/styles/global.css` if the brand color should be a true orange.
2. New site lives on `v2`; old pages and effects were removed (not kept).
3. Reuse existing content (sponsors, garage, seasons, subdivisions, photos); placeholders for the rest.
4. Sponsor Portal is a placeholder page, no auth.

Implementation notes / deviations:
- Blog, Videos and Theses use in-page placeholder arrays instead of a content collection.
- Cars performance figures are parsed from the existing spec text; missing values show `00`.
Reference: https://www.revolve.no/ (Revolve NTNU; used with their permission)

## 1. Reconnaissance (verified 2026-11-13)

- The reference is a **Webflow** site (Webflow CSS/JS, jQuery, Finsweet attributes, Webflow CMS for cars/blog).
- Reference design tokens (from its published CSS):
  - Accent: `#ffcf26` (yellow). Backgrounds: `#121212` / `#181818`. Secondary greys: `#2e2e2e`, `#313131`, `#e2e2e2`.
  - Fonts: Raleway, Montserrat, Open Sans, Host Grotesk (headings use lowercase/uppercase display styles).
- Reference pages: Home, About, Team, Cars (`/cars`), Partners/Sponsors, Theses, Blog, Videos, Sponsor Portal, Join Us.
  `/about` and `/team` return 404 at those exact URLs, so real URLs must be confirmed before mirroring structure.
- Reference homepage sections, in order:
  1. Hero: full-bleed image, tagline `THEORY IN PRACTICE`, subline, 2 CTAs (Join the Team, Become a Partner). Hamburger nav overlay + persistent CTA.
  2. "World-class team": intro paragraph, 2 CTAs, 4 achievement cards (competition logo + place + discipline).
  3. "Complex solutions for a complex future": 3 department cards (Mechanical, Electrical, Software), each with a short blurb and 3 topic links, plus "Get to know our cars" CTA.
  4. "Dedicated to disrupt": horizontal-scroll journey section + CTA.
  5. "Will you race with us?": 2 CTAs.
  6. Footer: Contact, Address, General links, Events links, Media links, socials.
- Reference Cars page: car selector/filter, then one section per car: name, class tag (EV/DV/CV), description, 4 performance figures (weight, power, 0-100, wheel torque), Mechanical/Electrical/Software bullet lists, achievements grouped by competition.

## 2. Open decisions (need an answer before implementation)

1. **Design system conflict.** `AGENTS.md` mandates Jura, monochrome, orange accent, no gradients. Reference uses yellow + Raleway/Montserrat.
   - Option A (recommended): copy Revolve's **layout, section structure, interactions and motion**; keep Aristurtle **orange + Jura + flat dark backgrounds**.
   - Option B: copy Revolve's colors/fonts too, and update `AGENTS.md` section 4.
2. **Scope of replacement.** Existing pages/components (`about-us`, `garage`, `seasons`, `sponsors`, `subdivisions`, `recruitment`, `contact`, Hyperspeed/Cubes/Blinds/Journey components) are heavily built. Replace them, or build the new site in parallel (new branch / new routes) and swap when ready?
3. **Copying method.** Recommended: **rebuild in Astro + Tailwind** using the reference CSS values as measurements. Not recommended: mirroring with HTTrack/`wget --mirror`/SingleFile, because it would import Webflow runtime, jQuery, their CMS markup, their analytics IDs (GA, Nocodelytics, Jetboost) and a Firebase config with their API key, and it produces unmaintainable static HTML.
4. **Content source.** Reuse existing Aristurtle copy/images where available (seasons, sponsors, garage.json, team photos); everything else is a labeled placeholder (section 4).

## 3. Page map (Revolve -> Aristurtle)

| Revolve page | Aristurtle route | Source of content |
|---|---|---|
| Home | `/` | New layout, existing copy/images + placeholders |
| About | `/about` | Existing `about-us` content |
| Team | `/team` | Existing `subdivisions` content + placeholders for member list |
| Cars | `/cars` | Existing `garage.json` + `seasons` content; specs missing -> placeholders |
| Partners | `/sponsors` | Existing `content/sponsors` |
| Theses | `/theses` | Placeholder |
| Blog | `/blog` | Placeholder (empty content collection + 1-2 sample entries) |
| Videos | `/videos` | Placeholder |
| Sponsor Portal | `/sponsor-portal` | Placeholder page only (no auth, no Firebase) |
| Join Us | `/join` | Existing `recruitment` content |

## 4. Placeholder policy

- Every placeholder is visibly marked in source with `TODO(content):` and rendered with obviously fake-but-plausible text (e.g. `00` for stats, `Lorem ipsum` for prose, grey image boxes labeled `PLACEHOLDER 16:9`).
- No Revolve text, photos, logos, team member names, contact details, or tracking/Firebase/CMS identifiers may remain in the repo.
- A single `src/data/placeholders.md` checklist lists every placeholder so the team can fill them in.

## 5. Acceptance criteria (measurable)

1. `pnpm run build` exits 0 with no TypeScript/Astro errors.
2. All 10 routes in section 3 return HTTP 200 in `pnpm run preview` and appear in the nav.
3. Home contains the 6 sections from section 1 in the same order, each with the same number of CTAs/cards as the reference (2 hero CTAs, 4 achievement cards, 3 department cards).
4. Navigation: hero state is large; compact state after the hero leaves the viewport; hamburger overlay opens/closes by click and `Esc`; focus is trapped while open.
5. Cars page: selector filters cars; each car section has 4 performance figures, 3 category lists and a per-competition achievements block.
6. Layout checked at 375, 768, 1280, 1920 px widths: no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`).
7. Hero title is 2 lines or fewer at 1280 px.
8. All GSAP motion uses `LUXE_EASE` (`cubic-bezier(0.16, 1, 0.3, 1)`) and is disabled under `prefers-reduced-motion`.
9. Zero console errors on every route.
10. `grep -ri "revolve" src/ public/` returns nothing, except this spec.
11. Lighthouse (mobile) Performance >= 85 and Accessibility >= 95 on `/`.

## 6. Out of scope

- Real sponsor-portal authentication, CMS integration, form backends.
- Editing `aristurtle.gr/` (legacy mirror).
- Final copywriting and final imagery.

## 7. Verification

- `pnpm run build` plus Playwright MCP screenshots at the 4 widths, side by side with the reference, and a console check.
- If no browser MCP is available, state that browser verification was not possible and report only build results.
