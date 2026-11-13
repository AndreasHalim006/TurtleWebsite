# Content placeholders

Every item below is fake or missing content that the team should replace.
Search the code for `TODO(content)` to jump to each one.

| Where | What to provide | File |
|---|---|---|
| Home hero | Final tagline and subtitle | `src/data/site.ts` (`hero`) |
| Home "world-class team" | Number of students, number of majors | `src/data/site.ts` (`worldClass`) |
| Home achievements (4 cards) | Real place / year / discipline / competition | `src/data/site.ts` (`achievements`) |
| Footer | Legal entity / VAT number | `src/data/site.ts` (`contact.legal`) |
| Footer "Events" | Real event pages (career day, unveiling) | `src/data/site.ts` (`footerColumns.events`) |
| Footer "Media" | A real wallpapers page | `src/data/site.ts` (`footerColumns.media`) |
| Cars: figures showing `00` | Weight, motor power, accumulator capacity, top speed (only cars whose specs list lacks the number) | `src/data/garage.json` specs, parsed by `src/data/cars.ts` |
| Cars: achievements | Per-competition results for each car | `src/pages/cars.astro` |
| Team | Member lists are from `src/content/seasons`; seasons 2025-2026+ not added yet | `src/content/seasons/` |
| Theses | Real thesis list and PDFs | `src/pages/theses.astro` |
| Blog | Real posts (cover, date, title, excerpt, body) | `src/pages/blog.astro` |
| Videos | Real video embeds | `src/pages/videos.astro` |
| Sponsor portal | Scope of the portal; no authentication exists | `src/pages/sponsor-portal.astro` |
