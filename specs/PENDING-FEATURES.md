# Aristurtle Website | Pending & Active Features

Tracker for review items and team leader notes.

Latest pass: [Round two feedback](SPEC-feedback-round-two.md). Previous pass: [Pending feedback implementation](SPEC-pending-feedback-implementation.md).
Browser review is left to the user; no changes have been pushed in this pass.

---

## Active & Pending Features

### 1. Φωτο απο fsg fss (Photos from FSG & FSS)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Retained FSG photo attribution after checking the source usage notice: it requires copyright source and photographer inside or near the photo. Removed repeated podium credits together with the removed tile images.
* **Action Needed:** No further credit changes without different permission from FSG.
* **Notes / Input:** Download all the images from the fsg website and use them as the main pool of images for everythin (https://media.formulastudent.de/keyword/GR%20Thessaloniki%20U;fsg26 the keywords matter)
* **Round Two Input / Outcome:** Are credits necessary? Yes: source usage notice checked; discreet nearby credits retained.


---

### 3. Achievments podiums apo g (Achievements & podiums from garage/history)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Text-only podium tiles in justified flex rows, preserving newest-first order and rank emphasis. Removed tile images and their credits. Swapped the section backdrop to a different photo at 8% opacity, with a single nearby credit.
* **Source:** https://www.formulastudent.de/teams/fse/details/tid/738
* **Spec:** [Homepage podium results](SPEC-podium-results.md), superseding item 3 in the earlier team leader review spec.
* **Action Needed:** Review the filled rows and faint background on desktop/mobile.
* **Notes / Input:** I want them to be in a cool grid similar to google photos with the 1st places to be bigger and then the 2nd places and then the 3rd places smaller. Try to keep the newest to oldest in general if possible
* **Round Two Input / Outcome:** Remove tile images; use a different very faint section background; eliminate the empty right-hand grid gap.


---

### 5. Last section of home to not be scrolled (Home car timeline unpinned)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Replaced the carousel with one large Calypso photo (user-selected latest car in the current garage), plus seven older cars as styled name/year links. Removed carousel controls and its unused script.
* **Action Needed:** Review Calypso feature and archive name links.
* **Notes / Input:** One dominant car photo, with part of the next slide visible so visitors immediately understand they can swipe.
Year and car name over a dark fade, using the site’s existing typography and green accent.
A thin, clickable year timeline below to show progress and let visitors jump directly to a car.
Keep previous/next controls visible on mobile as well as desktop.
Move “Explore Our Cars” beside the section heading, replacing the empty “next up” slide.
Keep natural vertical scrolling, manual swiping, and restrained transitions.
* **Round Two Input / Outcome:** Show only the latest car large; show the other cars through their names. User selected Calypso rather than Rhea.


---

### 6. Pages to be on nav (Pages in navigation menu)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Direct navbar now hides after deliberate downward scrolling and reappears when scrolling upward. It remains visible near the top and while keyboard focus is inside it; tiny direction changes do not flicker.
* **Action Needed:** Try scrolling down/up and keyboard navigation on desktop/mobile.
* **Notes / Input:** I don't want a pages dropdown. I want all the pages to be on the navbar ready to be clicked
* **Round Two Input / Outcome:** Use the familiar show-on-scroll-up navbar effect.


---

### 10. Photos in /cars should open (Lightbox on click)
* **Status:** Unfinished / deferred by user (no round-two code changes)
* **Current State:** Lightbox hides/clears old images before loading, decodes the new image off-DOM, and ignores stale requests. Added previous/next, Left/Right keys, photo count, loading/error status, and navigation through the selected car's entire deduplicated gallery. Escape/backdrop close and focus return retained.
* **Action Needed:** Deferred. Wait for the user to request further lightbox work.
* **Notes / Input:** it is a bit buggy: I see the previously selected image for a subsecond and I want to be able to navigate to the next images when zoomed
* **Round Two Input / Outcome:** Leave unfinished; do not change it in round two.


---

## Completed & Closed Features

* [x] **2. Πιο σκούρο πράσινο?** — Updated `--color-brand-orange` in `src/styles/global.css` to `#00A651` (classic racing green).
* [x] **11. No achievments in /cars** — Removed the placeholder achievements column from `/cars`; specifications table now spans full width cleanly.
* [x] **12. In /sponsors cto button on top** — Added "Become a Partner" and "View Current Partners" CTA buttons in the hero header of `/sponsors`.
* [x] **13. /theses for next version** — Shelved from active navigation and footer links.
* [x] **14. /blog no** — Deleted `/blog.astro` and purged all site references.
* [x] **15. /video no** — Deleted `/videos.astro` and purged all site references.
* [x] **16. /sponsor portal no** — Deleted `/sponsor-portal.astro` and purged all site references.

---

### 4. Photos apo subteams (Photos from subteams)
* **Status:** Completed & closed (accepted in round two)
* **Current State:** Replaced CAD imagery with credited FSG pool photos on Home department tiles, /subteams, and /team subdivision cards. Captions describe the actual competition scenes without claiming department identities.
* **Action Needed:** None.
* **Notes / Input:** use photos from the fsg pool

---

### 7. Photos in about (Photos on About page)
* **Status:** Completed & closed (accepted in round two)
* **Current State:** Preserved the completed four-photo gallery. Purpose/vision now shares a full-width FSG racing photo with a dark fade, open columns, and credited source; About intro uses a fully visible FSG team photo.
* **Action Needed:** None.
* **Notes / Input:** it's done. Make the background of the "Our Purpose Our Vision" section better

---

### 8. Subteam page (Dedicated `/subteams` page)
* **Status:** Completed & closed (accepted in round two)
* **Current State:** All eight subteams now have native expandable detail sections with activities adapted from `RECRUITMENT_2026.pdf`, found in the old local checkout. PDF page references and the seven-to-eight department mapping are documented in `SUBTEAM-CONTENT-SOURCES.md`.
* **Action Needed:** None.
* **Notes / Input:** I want the user to be able to click and see more info about the subteams. You can get the information from the pdf (maybe it is in the old folder)

---

### 9. Photos in /team page are cropped (Member portrait crop fix)
* **Status:** Completed & closed (accepted in round two)
* **Current State:** Every season hero photo now renders at its natural aspect ratio with `block h-auto w-full`, without aspect-ratio or object-cover cropping. Member portrait framing is unchanged.
* **Action Needed:** None.
* **Notes / Input:** I want the big team photo in every year to never be cropped
