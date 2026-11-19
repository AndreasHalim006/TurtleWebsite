# Round two feedback

User direction, 2026-11-19. Supersedes the corresponding layout criteria in
SPEC-pending-feedback-implementation.md. Local changes only; no browser testing/server.

## Scope and design
Visual thesis: calmer text-led achievements, one dominant archived car photo, restrained navigation.
Content plan: preserve all 13 podium results and archive car names; close accepted tracker items.
Interaction thesis: static latest-car feature with linked archive names; direction-aware navbar,
subtle hover emphasis, no carousel or automatic motion. Honor reduced motion.

## Acceptance criteria
- Keep source-required FSG attribution; verify the actual notice before advising removal.
- Remove every image and per-photo credit from individual podium tiles.
- Replace the section background with a different FSG image at 8% opacity and one nearby credit.
- Use justified flex rows so each row fills its width without sparse grid holes; preserve
  newest-first DOM/visual order and rank emphasis (1st > 2nd > 3rd) where space permits.
- Feature Calypso (user-selected, latest in current garage data) as the sole large car photo;
  all other garage cars appear once as styled text links, with years and no images.
- Remove carousel controls, swipe/year-jump UI, and unused journey script.
- Navbar stays visible near page top, hides after deliberate downward scrolling, returns
  on upward scrolling; small deltas do not flicker; focused navigation remains visible.
  All seven direct links and existing solid-background behavior remain.
- Mark items 4,7,8,9 completed/closed; item10 explicitly unfinished/deferred and unchanged.
- Run production build and local checks. Hand browser review to user; no commit/push.

Files: PodiumGrid.astro, CarJourney.astro, index.astro, Header.astro, scripts/header.ts,
remove scripts/journey.ts, tracker and relevant project/spec notes.

## Verification and handoff
- `pnpm.cmd run build` passed (10 pages).
- Isolated TypeScript check for header.ts passed.
- Node VM checks of the actual transpiled header script passed: downward hide,
  upward reveal, 12px jitter threshold, top visibility, solid state and keyboard focus.
- Generated HTML checks passed: 13 text-only podiums in descending date order,
  exactly one Calypso feature image, seven text-only archive names, no carousel UI.
- `git diff --check` passed. Cars/lightbox files have no round-two diff.
- No browser testing or server launched; no commit/push.
- User checks: podium row balance at desktop/mobile, faint background, Calypso crop,
  archive links, and navbar hiding/reappearing while scrolling and using Tab.

## Attribution evidence
Read https://media.formulastudent.de/keyword#fsg-copyright directly.
The notice permits Formula Student Germany use and explicitly requires source plus
photographer inside/near each photo. Credits remain near photos still in use;
the removed podium tile photos no longer produce repeated credits.
