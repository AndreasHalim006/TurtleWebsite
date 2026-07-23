# SPEC: Mobile Seasons Year Folders

## Goal

Make season years the only collapsible level on the mobile Seasons page. An opened year exposes the full team archive without additional department folders or hover-only information.

## Scope

- `src/pages/seasons.astro`
- `src/components/seasons/SeasonSection.astro`
- Mobile and tablet layouts below `1024px`; desktop composition and hover preview remain unchanged.

## Acceptance Criteria

1. At widths below `1024px`, each season year is a folder toggle and exactly one year remains open at a time.
2. The first season opens by default; a valid season hash opens that season instead.
3. Departments inside the open season are static expanded sections, not nested disclosure controls.
4. Every member entry in the open season visibly presents a portrait, name, position, and email without hover or another tap.
5. Missing portraits use the season hero image, then the site fallback; missing position/email values display `Position not listed` or `Email not listed`.
6. Member portraits use a reserved `4 / 5` aspect ratio, `object-fit: cover`, async decoding, and lazy loading.
7. Opening another year closes the previously open year and updates `aria-expanded` and the URL hash.
8. Desktop season layout, member hover previews, email-copy behavior, and season navigation remain unchanged.
9. `pnpm run build` passes, and browser inspection at `390 × 844` confirms only one open year, no nested department disclosures, visible member fields/photos, and no horizontal overflow.
