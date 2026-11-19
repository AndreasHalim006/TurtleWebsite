# Aristurtle Website | Pending & Active Features

Tracker for review items and team leader notes.

Implementation and local checks for the latest notes: [Pending feedback implementation](SPEC-pending-feedback-implementation.md).
Browser review is left to the user; no changes have been pushed in this pass.

---

## Active & Pending Features

### 1. Φωτο απο fsg fss (Photos from FSG & FSS)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Downloaded all 117 photos matching both FSG keywords at public display resolution (up to 2048px long edge), with full photographer credits and source/original URLs in `src/data/fsg-media-manifest.json`. Used across Home, About, Subteams, Team subdivision cards, and Join. Historical car and season imagery retained.
* **Action Needed:** Review the selected site photos and credits in your dev preview.
* **Notes / Input:** Download all the images from the fsg website and use them as the main pool of images for everythin (https://media.formulastudent.de/keyword/GR%20Thessaloniki%20U;fsg26 the keywords matter)

---

### 3. Achievments podiums apo g (Achievements & podiums from garage/history)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Replaced equal cards with a photographic mosaic: desktop first-place tiles span 3 columns x 2 rows, second-place tiles 2 x 2, third-place tiles 2 x 1. All 13 results keep newest-first DOM and visual order; imagery is explicitly labelled FSG 2026.
* **Source:** https://www.formulastudent.de/teams/fse/details/tid/738
* **Spec:** [Homepage podium results](SPEC-podium-results.md), superseding item 3 in the earlier team leader review spec.
* **Action Needed:** Review podium tile sizes and readability on desktop/mobile.
* **Notes / Input:** I want them to be in a cool grid similar to google photos with the 1st places to be bigger and then the 2nd places and then the 3rd places smaller. Try to keep the newest to oldest in general if possible


---

### 4. Photos apo subteams (Photos from subteams)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Replaced CAD imagery with credited FSG pool photos on Home department tiles, /subteams, and /team subdivision cards. Captions describe the actual competition scenes without claiming department identities.
* **Action Needed:** Review the selected photographs.
* **Notes / Input:** use photos from the fsg pool

---

### 5. Last section of home to not be scrolled (Home car timeline unpinned)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Large manual photo carousel with next-slide preview, faded car/year captions, clickable year progress, active-year tracking, and previous/next controls on all viewports. Explore Our Cars moved beside heading; next-up tile removed. Native vertical scrolling retained.
* **Action Needed:** Try swiping, mouse dragging, arrow buttons, year jumps, and keyboard controls on your devices.
* **Notes / Input:** One dominant car photo, with part of the next slide visible so visitors immediately understand they can swipe.
Year and car name over a dark fade, using the site’s existing typography and green accent.
A thin, clickable year timeline below to show progress and let visitors jump directly to a car.
Keep previous/next controls visible on mobile as well as desktop.
Move “Explore Our Cars” beside the section heading, replacing the empty “next up” slide.
Keep natural vertical scrolling, manual swiping, and restrained transitions.

---

### 6. Pages to be on nav (Pages in navigation menu)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** All seven pages are direct navbar links with no hamburger, dropdown, or overlay. Mobile links use a horizontally scrollable row; header stays fixed and becomes solid after scrolling.
* **Action Needed:** Check navbar spacing and mobile horizontal navigation.
* **Notes / Input:** I don't want a pages dropdown. I want all the pages to be on the navbar ready to be clicked

---

### 7. Photos in about (Photos on About page)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Preserved the completed four-photo gallery. Purpose/vision now shares a full-width FSG racing photo with a dark fade, open columns, and credited source; About intro uses a fully visible FSG team photo.
* **Action Needed:** Review purpose/vision contrast and background crop.
* **Notes / Input:** it's done. Make the background of the "Our Purpose Our Vision" section better

---

### 8. Subteam page (Dedicated `/subteams` page)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** All eight subteams now have native expandable detail sections with activities adapted from `RECRUITMENT_2026.pdf`, found in the old local checkout. PDF page references and the seven-to-eight department mapping are documented in `SUBTEAM-CONTENT-SOURCES.md`.
* **Action Needed:** Read the expanded department copy and try each disclosure.
* **Notes / Input:** I want the user to be able to click and see more info about the subteams. You can get the information from the pdf (maybe it is in the old folder)

---

### 9. Photos in /team page are cropped (Member portrait crop fix)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Every season hero photo now renders at its natural aspect ratio with `block h-auto w-full`, without aspect-ratio or object-cover cropping. Member portrait framing is unchanged.
* **Action Needed:** Switch through seasons and check each full team photo.
* **Notes / Input:** I want the big team photo in every year to never be cropped

---

### 10. Photos in /cars should open (Lightbox on click)
* **Status:** Implemented (Awaiting user browser review)
* **Current State:** Lightbox hides/clears old images before loading, decodes the new image off-DOM, and ignores stale requests. Added previous/next, Left/Right keys, photo count, loading/error status, and navigation through the selected car's entire deduplicated gallery. Escape/backdrop close and focus return retained.
* **Action Needed:** Try opening different photos quickly, next/previous and arrow keys, closing during load, and switching cars.
* **Notes / Input:** it is a bit buggy: I see the previously selected image for a subsecond and I want to be able to navigate to the next images when zoomed

---

## Completed & Closed Features

* [x] **2. Πιο σκούρο πράσινο?** — Updated `--color-brand-orange` in `src/styles/global.css` to `#00A651` (classic racing green).
* [x] **11. No achievments in /cars** — Removed the placeholder achievements column from `/cars`; specifications table now spans full width cleanly.
* [x] **12. In /sponsors cto button on top** — Added "Become a Partner" and "View Current Partners" CTA buttons in the hero header of `/sponsors`.
* [x] **13. /theses for next version** — Shelved from active navigation and footer links.
* [x] **14. /blog no** — Deleted `/blog.astro` and purged all site references.
* [x] **15. /video no** — Deleted `/videos.astro` and purged all site references.
* [x] **16. /sponsor portal no** — Deleted `/sponsor-portal.astro` and purged all site references.
