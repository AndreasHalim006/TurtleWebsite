# Pending feature feedback implementation

Authorized by the user's notes in PENDING-FEATURES.md, 2026-11-19.
Implement locally on v2. Do not start servers, run browser testing, commit, or push.

## Design and scope
Visual thesis: photo-led racing identity, Sansation typography, dark fades, racing green accents.
Content plan: preserve pages and copy except requested subteam detail and image captions;
give each existing section one job. Use authentic FSG photos as the main general image pool.
Interaction thesis: manual native car swipe with year jumps; native accessible subteam
disclosures; responsive lightbox navigation with race-safe image loading. Honor reduced motion.

## Acceptance criteria
1. Download every accessible image matching BOTH `GR Thessaloniki U` and `fsg26`
   from the supplied FSG media URL. Record source URLs, local paths, and credits/metadata
   when supplied in a manifest. Do not bypass access restrictions; report inaccessible assets.
   Prefer this pool for generic site imagery; retain historical car/member/season accuracy.
2. All 13 podiums remain in descending month order in DOM/reading order. At desktop,
   first-place tiles have greater area than second-place tiles, which exceed third-place
   tiles; mobile retains legible ordered tiles without horizontal page overflow.
3. Home car journey: one large photo and part of next slide visible, car/year over fade,
   clickable year progress row, active year tracking, previous/next on mobile and desktop.
   Explore Our Cars beside heading; remove next-up tile. No pinning or vertical scroll hijack.
4. All seven primary destinations are directly available in the navbar without a menu
   or pages dropdown, including on mobile (horizontal scrolling allowed for nav links).
5. About purpose/vision receives a deliberate photographic background and readable fade.
6. Each of the eight subteams has an independently keyboard-operable disclosure for more
   information, grounded in the legacy PDF/reference if available. Use FSG pool imagery;
   avoid claims that generic photos identify a particular department.
7. Every season team image uses natural aspect ratio and is fully visible; no object-cover
   crop or forced aspect ratio on season hero photos. Member portraits remain scoped out.
8. Cars lightbox clears stale imagery before showing/loading a new selection, guards against
   out-of-order async image loads, and supports previous/next buttons, Left/Right keys,
   counter, Escape, backdrop close, and restored focus. Navigate the selected car's full
   gallery including its main image. Communicate loading/failure accessibly.
9. Update tracker statuses with literal implemented/blocked details while preserving user notes.

## Files and ownership
- Asset discovery/download: new src/images/fsg26 pool, manifest, reusable image data module.
- Home: index.astro, scripts/journey.ts; extract components if needed.
- Navigation/lightbox: Header.astro, scripts/header.ts, cars.astro and dedicated lightbox script.
- About/subteams/team: corresponding pages, new subteam detail data if useful.
- Root owns integration, tracker/spec updates, build and local validation.

## Verification
Run production build and appropriate static/type checks after integration. Do not perform
browser checks; hand off desktop/mobile checks to the user. No deployment in this pass.

## Implemented and checked
- All requested items implemented locally. Original user notes preserved in the tracker;
  each item has a specific user browser-review action.
- Downloaded 117/117 matching FSG photos (132.4 MB) at public display resolution,
  actual maximum long edge 2048px; originals remain linked in the manifest.
  Photographer names recovered from EXIF and credited near the selected photos.
- Found the recruitment PDF in the sibling old checkout; source pages and the mapping
  from its seven departments to the site's eight sections are documented separately.
- `pnpm.cmd run build`: passed, 10 pages and 263 optimized image renditions.
- `pnpm.cmd exec astro check`: 0 errors, 0 warnings, 33 existing content-schema hints.
- Generated HTML checks: 13 descending-date podiums, 8 car slides/year selectors,
  8 subteam disclosures, 10 uncropped season hero images, 7 direct links on every
  active page, 115 full-gallery car images, and valid emitted image asset references.
- Node VM tests against transpiled scripts passed for lightbox stale loads, rapid
  navigation, close-during-load, errors, keyboard wrap, focus restoration and car scoping;
  journey tests covered control states, last slide on wide layouts, year jumps,
  reduced-motion navigation, native touch behavior and drag/keyboard click handling.
- `git diff --check`: passed. No browser tests or servers launched. No commit or push.

## User browser handoff
1. Home: photo choices, podium hierarchy/chronology, carousel swipe/drag, next/previous,
   year jumps and visible mobile controls; vertical scrolling remains natural.
2. Navbar: direct links and horizontal mobile navigation.
3. About/Subteams: purpose/vision contrast, all eight expandable detail sections and copy.
4. Team: switch all seasons and confirm entire group photos remain visible.
5. Cars: open photos rapidly, use arrows and buttons through each car's full gallery,
   Escape/backdrop close, and reopen on a different car without a stale image flash.
