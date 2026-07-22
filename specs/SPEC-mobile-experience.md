# SPEC: Mobile Experience and Performance

## Product direction

- **Visual thesis:** A compact motorsport poster built from real car imagery, black engineering surfaces, white type, and one electric green accent.
- **Content plan:** Poster-like hero, one primary proof point, progressively disclosed technical detail, and one clear route or contact action.
- **Interaction thesis:** Native touch scrolling, a decisive full-screen menu, and short transform/opacity reveals; continuous WebGL and cursor effects stay on capable desktop devices.

## Scope

The public routes `/`, `/about-us`, `/contact`, `/garage`, `/recruitment`, `/seasons`, `/sponsors`, and `/subdivisions` receive a phone layout at `<=767px` and a touch-optimized layout through `1023px`. Public URLs, content schemas, sponsor links, and car/season/subdivision hashes remain compatible. The legacy mirror, editor/admin route, and the desktop homepage camera/path defect are excluded.

## Required behavior

1. Touch or coarse-pointer devices use native scrolling. Lenis runs only on a fine pointer at `min-width: 1024px`.
2. Phone/tablet heroes use a flat CSS treatment or optimized image; they do not mount WebGL canvases. Desktop effects remain available at `min-width: 1024px` with no reduced-motion preference.
3. The phone navigation logo is `150px` from first paint. Menu controls are at least `48px`, the panel uses `100dvh` plus safe-area padding, traps focus, closes with Escape/backdrop, and restores focus.
4. The full loader runs once per session and exits within `1.6s`; later document loads use a `300-500ms` transition. It waits only for elements marked `data-critical-asset`, with a timeout, and always removes itself and restores scrolling.
5. Hidden desktop homepage islands do not hydrate below their desktop media queries. Mobile routes do not request Hyperspeed, Three.js/OGL effects, TargetCursor, or the desktop menu island.
6. Sponsor tiers, cars, seasons/departments, and subdivisions use progressive disclosure on phones. A hash target opens the matching group. Inactive galleries and member portraits remain lazy.
7. Sponsor logos visible at loader exit are decoded or display an explicit fallback; their slots reserve final dimensions and never render as unexplained empty cells.
8. Every content image has dimensions/aspect ratio, responsive sizing where Astro assets are available, async decoding, and lazy loading unless it is the LCP/critical asset.
9. Mobile reveals animate only transforms/opacity, play once, honor reduced motion, and clean up listeners/ScrollTriggers.
10. The footer does not simulate a successful newsletter submission without a real service.

## Acceptance criteria

- No horizontal document overflow at `320x568`, `360x800`, `375x812`, `390x844`, `430x932`, `768x1024`, or `1024x768`.
- No clipped headings, header overlap, scroll traps, or inaccessible collapsed content at those viewports.
- At `390x844`, public content routes contain no canvas; unopened sponsor tiers, car galleries, seasons, and subdivisions make no eager image requests.
- Standard mobile routes transfer no desktop-only React/WebGL island and target `<=150KB` compressed initial JavaScript; homepage targets `<=200KB`, excluding media.
- Mobile-throttled targets are LCP `<=2.5s`, CLS `<=0.1`, and INP `<=200ms`.
- Menu, disclosures, deep links, browser back, email-copy fallback, map link, and reduced-motion mode work with keyboard and touch.
- `pnpm run build` passes; Playwright reports no console errors on every public route; desktop smoke tests preserve existing composition.

