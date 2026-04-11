# SPEC — Footer v2 (Logo + Socials + Map)

**Status:** DRAFT — awaiting Jason's approval
**Target:** `astro/src/components/Footer.astro`
**Scope:** Complete rewrite of the existing placeholder footer — new layout, new content, new assets.

---

## Goal

Replace the current 4-column placeholder footer with a **3-column landmark footer** that establishes the team's identity, links out to all social channels with real brand icons, and anchors the physical location of the workshop via an embedded Google Maps view.

**Why this matters:** the footer is the last thing every visitor sees on every page. Currently it has dead form inputs and placeholder links. The new footer must feel "this is a real team with a real address you can visit" — not a template.

---

## Reference

- **Legacy source replaced:** `astro/src/components/Footer.astro` (current — 4-column grid with Brand / Connect / Info / Newsletter).
- **Logo asset:** `astro/src/assets/logo-full-white.png` — copied from `aristurtle.gr/assets/images/Logo-Full_WHITE-scaled-500x500.png`. 500×500 PNG, white turtle hex + Protergia sunburst, mostly transparent. ~52 KB.
- **Google Maps place:** Aristurtle (Aristotle University Racing Team Electric and Driverless)
  - Coordinates: `40.6280927, 22.9591767`
  - Place name: `Aristurtle Aristotle University Racing Team`
  - Source: short URL `https://maps.app.goo.gl/QAdbZHDCByB7JJqZ8` → resolved to `https://www.google.com/maps/place/Aristurtle+(Aristotle+University+Racing+Team+Electric+and+Driverless)/@40.6280967,22.9566018,17z`
- **Social URLs** (unchanged from current footer):
  - Instagram: `https://instagram.com/aristurtle`
  - LinkedIn: `https://linkedin.com/company/aristurtle`
  - Facebook: `https://facebook.com/aristurtle`
  - YouTube: `https://youtube.com/@aristurtle`

---

## Layout (per decision 5)

Three-column horizontal layout at **≥lg (1024px)**. Stacks to a single column below.

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│   ┌──────────┐   ┌────────────────────┐   ┌─────────────────────┐  │
│   │          │   │ ARISTURTLE         │   │                     │  │
│   │   LOGO   │   │ Racing Team...     │   │                     │  │
│   │  (full   │   │                    │   │       MAP           │  │
│   │  white)  │   │ Aristotle Univ...  │   │     (iframe)        │  │
│   │          │   │ Thessaloniki       │   │                     │  │
│   │          │   │                    │   │                     │  │
│   └──────────┘   │ [IG] [LI] [FB] [YT]│   │                     │  │
│                  └────────────────────┘   └─────────────────────┘  │
│                                                                    │
│   ─────────────────────────────────────────────────────────────    │
│   © 2026 ARISTURTLE RACING TEAM. ENGINEERED FOR VELOCITY.          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

- **Column 1 (logo):** width `auto`, the logo sized at `w-40 lg:w-48` (160→192px).
- **Column 2 (content):** flex-grow — brand wordmark, tagline, location text, then the 4 social links each shown as `[icon] TEXT URL` so the href is visible (per your original ask: "icons, and the links being shown").
- **Column 3 (map):** `w-full lg:w-[420px] xl:w-[480px]`, aspect-ratio ~4:3, iframe with lazy loading.
- **Mobile (<lg):** columns stack vertically in order Logo → Content → Map. Map height `h-64` (256px) on mobile.

---

## Content — exact strings

| Slot | Text |
|------|------|
| Brand wordmark | `ARISTURTLE` (headline font, large, white) |
| Tagline | `The premier electric and autonomous racing team of Aristotle University of Thessaloniki.` |
| Location line 1 | `Aristotle University of Thessaloniki` |
| Location line 2 | `University Campus, 54124 Thessaloniki, Greece` |
| Copyright | `© 2026 ARISTURTLE RACING TEAM. ENGINEERED FOR VELOCITY.` |

**Pending confirmation:** the precise postal line ("University Campus, 54124 Thessaloniki, Greece") is my best-effort reconstruction from the coordinates + general knowledge of AUTh. If you have the exact building or street address the team uses on official correspondence, paste it and I'll use that verbatim — otherwise I'll ship with the line above.

---

## Social links — icons + visible URLs

Four links rendered as a vertical list (stacked `<a>` elements). Each row:

```
[brand SVG 20×20]   PLATFORM NAME         instagram.com/aristurtle
```

- **Icon source:** inline SVG path data from **Simple Icons v12** (MIT-licensed brand marks). Paste the path `<path d="..."/>` directly in Footer.astro — no dependency.
- **Visible URL text:** the hostname + path, without `https://`, `text-xs` or `text-sm`, `font-label`, `text-neutral-500`, `hover:text-secondary`.
- **Hover state:** icon and URL text both shift to `text-secondary` on `:hover`.
- **`href`:** full `https://` URL, `target="_blank"`, `rel="noopener noreferrer"`.

Social list in order: **Instagram, LinkedIn, Facebook, YouTube** (same order as current footer).

---

## Map embed

- **Method:** `<iframe>` from `https://maps.google.com/maps?q=...&hl=en&z=17&output=embed` (no API key, decision 3 = B).
- **Exact src:**
  ```
  https://maps.google.com/maps?q=Aristurtle+Aristotle+University+Racing+Team&ll=40.6280927,22.9591767&hl=en&z=17&output=embed
  ```
- **Attributes:** `loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`, `title="Map showing Aristurtle workshop location"`, `allowfullscreen`, `frameborder="0"`, `style="border:0"`.
- **Wrapper:** `<a href="https://maps.app.goo.gl/QAdbZHDCByB7JJqZ8" target="_blank" rel="noopener">…iframe…</a>` so clicking the whole map opens the full Google Maps place page in a new tab.
  - **Known gotcha:** wrapping an `<iframe>` in an `<a>` is valid HTML but clicks land on the iframe first. To make the outer link actually fire, the map is inside a `<div class="relative">` and a `<span class="absolute inset-0 cursor-pointer">` sits ON TOP of the iframe with `pointer-events: auto` to capture clicks. The iframe itself gets `pointer-events: none` so it becomes a static thumbnail rather than interactive. This gives the intended "static-ish" feel per decision 3.
- **Fallback:** if the iframe fails to load (network blocked), the wrapper shows the logo + coordinates text. This is a pure CSS fallback using `<noscript>` and empty-iframe detection — acceptance criterion verifies the primary path, fallback is best-effort.

---

## Removals

Per decision 6 (D — drop both):
- ❌ **Info column** (Privacy Policy / Technical Specs / Team History) — gone. Will return when real pages exist.
- ❌ **Newsletter column** (email input + arrow button) — gone. No backend, was dishonest UX.
- ❌ **Legacy dot circles** in the copyright row (the two 32×32 circles with orange dots) — gone, replaced by cleaner copyright row.

---

## Files to create / modify

**Create:**
- `astro/src/assets/logo-full-white.png` ✅ already done (copied from aristurtle.gr)

**Modify:**
- `astro/src/components/Footer.astro` — full rewrite
- `astro/src/content/` — no changes (footer is not a content collection)

**Do NOT modify:**
- Any other component
- `global.css`
- `BaseLayout.astro`
- `Nav.astro`
- `index.astro` (import stays the same)

---

## Acceptance criteria (numbered, measurable)

### Build & structural
1. `cd astro && npm run build` exits 0 with no errors or warnings.
2. `astro/dist/index.html` still contains exactly one `<footer>`.
3. Footer contains exactly **one `<img>` element** (the logo).
4. Footer contains exactly **one `<iframe>` element** (the map).
5. Footer contains exactly **4 social links** matching the order Instagram, LinkedIn, Facebook, YouTube.
6. Footer contains **zero `<input>` elements** (newsletter removed).
7. Footer does NOT contain the strings `Privacy Policy`, `Technical Specs`, `Team History`, or `Newsletter`.

### Logo
8. Logo `<img>` uses Astro's `<Image />` component so it gets optimized at build time (no raw `<img src="/assets/…">`).
9. Logo source is `astro/src/assets/logo-full-white.png`.
10. Logo rendered width at ≥lg viewport is between 160px and 200px.
11. Logo `naturalWidth > 0` after page load (file loads, not 404).

### Content
12. Footer text contains the substring `ARISTURTLE` (wordmark).
13. Footer text contains the tagline substring `The premier electric and autonomous racing team of Aristotle University of Thessaloniki.`
14. Footer text contains the substring `Aristotle University of Thessaloniki` (location line 1).
15. Footer text contains a substring matching `54124` and `Thessaloniki` and `Greece` (location line 2).
16. Footer text contains the substring `© 2026 ARISTURTLE RACING TEAM. ENGINEERED FOR VELOCITY.`

### Social links
17. Each of the 4 social links has `target="_blank"` and `rel` containing `noopener`.
18. Each social link `href` is one of the exact URLs listed under "Reference → Social URLs".
19. Each social link contains an inline SVG (`<svg>`) element as the icon.
20. Each social link has **visible text** showing the hostname+path (e.g. `instagram.com/aristurtle`) — the text is not `display: none`, verified by checking `offsetWidth > 0` on the text span.
21. On hover, the icon and text color change to `rgb(247, 148, 29)` (= `#f7941d` = `text-secondary`). Verified via `getComputedStyle` after programmatic `:hover` simulation.

### Map
22. Map iframe `src` is exactly `https://maps.google.com/maps?q=Aristurtle+Aristotle+University+Racing+Team&ll=40.6280927,22.9591767&hl=en&z=17&output=embed`.
23. Map iframe has `loading="lazy"`.
24. Map iframe has `title` attribute equal to `Map showing Aristurtle workshop location`.
25. Map is wrapped in a parent `<a>` whose `href` is the short URL `https://maps.app.goo.gl/QAdbZHDCByB7JJqZ8`, with `target="_blank"`.
26. Map click is intercepted by an overlay span so clicks go to the parent `<a>` rather than the iframe — verified by checking that an element at the iframe's center point has a `cursor: pointer` computed style (the overlay sits on top).
27. Map iframe computed `pointer-events` is `none`.

### Layout
28. At viewport ≥1024px, the footer columns layout is logo | content | map in that visual order — verified by `getBoundingClientRect().left` ordering.
29. At viewport 1024px, all 3 columns are visible without wrapping to a second row.
30. At viewport 375px, the columns stack vertically — verified by checking that column 2's `top` > column 1's `bottom`, and column 3's `top` > column 2's `bottom`.
31. Map container has a visible aspect ratio close to 4:3 on desktop (height/width between 0.7 and 0.8, allowing for rounding).
32. Footer background color is `rgb(23, 23, 23)` (neutral-900, verified via canvas pixel test because Tailwind v4 emits oklch).

### Runtime
33. `cd astro && npm run dev` serves the footer with no console errors on initial load.
34. No 404s on initial load except as noted in prior spec (logo was the only asset; now logo is processed by `<Image />` so the URL will be `/_astro/logo-full-white.<hash>.webp` or similar — verify this URL returns 200).
35. Map iframe either loads successfully (GET to `maps.google.com/maps?…` returns 200 or 302) OR is noted in the report as blocked at test time (some CI networks block Google). Not a hard fail.

### Component isolation
36. `Footer.astro` has no new CSS added to `global.css` — all custom styles live in a scoped `<style>` block inside Footer.astro.
37. Removing `<Footer />` from `index.astro` leaves `<Nav />` visually unaffected (sanity check — should be obvious since they don't share state).

---

## Plan

1. **Capture baseline screenshot** of current footer via Playwright MCP (`nav-1280.png` already exists; grab a footer-scoped screenshot for before/after).
2. **Find Simple Icons SVG paths** for Instagram, LinkedIn, Facebook, YouTube. Source: public Simple Icons CDN raw files (`https://cdn.simpleicons.org/<name>`) or inline from memory of their published SVG path data. Each path is a single `<path d="…"/>`. MIT-licensed, attribution not required for inline use.
3. **Rewrite `Footer.astro`:**
   - Frontmatter: `import { Image } from 'astro:assets'; import logo from '../assets/logo-full-white.png';`
   - Define an array `const socials = [{name, href, hostPath, pathD}, …]` in frontmatter and `{socials.map(s => (…))}` in the body.
   - 3-column CSS grid at `lg:grid-cols-[auto_1fr_auto]`, single-column below.
   - Map wrapper: `<a>` with absolute-positioned overlay `<span>`.
   - Scoped `<style>` for any non-Tailwind tweaks (minimal — aspect-ratio on the map, pointer-events on the iframe).
4. **Build** (`npm run build`). Fix errors. STOP on divergence.
5. **Start dev server** (already running from prior iteration; reuse).
6. **Self-verify** all 37 acceptance criteria via Playwright MCP + computed-style probes. Produce pass/fail table.
7. **Iteration budget: 3.**

---

## Commands

```bash
cd /home/iason/workbench/TurtleWebsite/astro
npm run build
# dev server already running on :4321 from prior session; if not:
# npm run dev > /tmp/astro-dev.log 2>&1 &
```

---

## Known deferrals (not failures)

- **Address line 2 exact wording** — the postcode/campus line is my best-effort reconstruction. If it's wrong, you'll say so in review and I'll update one line.
- **Map tile attribution** — Google's iframe embed includes their own attribution; nothing for us to add.
- **Screen-reader map experience** — the iframe has `title="Map showing Aristurtle workshop location"` and the wrapping `<a>` has the short URL. That's industry-standard. Real-world users on screen readers will hear "Map showing…, link" which is correct.
- **Interactive map ToS** — decision 3 = B is the free iframe embed; no API key, no ToS concerns.

---

## Iteration budget

**Maximum 3 self-verify iterations.** If after 3 attempts any criterion still fails, STOP and report blockers with options.

---

## What Jason needs to approve before I start

1. ✅ / ❌ — Logo = `Logo-Full_WHITE-scaled-500x500.png` re-named `logo-full-white.png` (already copied to `astro/src/assets/`). OK?
2. ✅ / ❌ — Map iframe `src` uses `?q=...&ll=40.6280927,22.9591767&output=embed` (no API key). OK?
3. ✅ / ❌ — Location address line = `Aristotle University of Thessaloniki` / `University Campus, 54124 Thessaloniki, Greece`. Correct text, or paste the right one?
4. ✅ / ❌ — Social icons = inline Simple Icons v12 SVGs (MIT-licensed, brand logos). OK?
5. ✅ / ❌ — Info + Newsletter columns deleted entirely, not kept as commented-out code. OK?
6. ✅ / ❌ — Map is click-through to `https://maps.app.goo.gl/QAdbZHDCByB7JJqZ8` in a new tab, pan/zoom disabled by pointer-events overlay. OK?
7. ✅ / ❌ — 37 acceptance criteria above are sufficient / too strict / missing something. OK?
8. ✅ / ❌ — Copyright year updated to `© 2026` (current date is 2026-04-11). OK?

Reply with numbers + A/B/objections. Once approved, I execute.
