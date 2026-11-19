# Aristurtle Website | Pending & Active Features

Tracker for review items and team leader notes.

---

## Active & Pending Features

### 1. Φωτο απο fsg fss (Photos from FSG & FSS)
* **Status:** Awaiting assets / Feedback
* **Current State:** Using temporary high-resolution competition track photos from the repository (`nemesaki-red-bull-ring-scaled.jpg`, etc.).
* **Action Needed:** Need official media files from Formula Student Germany (FSG) and Formula Student Spain (FSS) or confirmation on which images to use.
* **Notes / Input:** 

---

### 3. Achievments podiums apo g (Achievements & podiums from garage/history)
* **Status:** Implemented (Awaiting review)
* **Current State:** Homepage displays all 13 podium finishes from the user-supplied FSG results table, newest to oldest (August 2025 through July 2017), with month/year and a source link. Includes overall and individual discipline podiums. Removed the unsupported 2021 driverless skidpad and 2015 entries.
* **Source:** https://www.formulastudent.de/teams/fse/details/tid/738
* **Spec:** [Homepage podium results](SPEC-podium-results.md), superseding item 3 in the earlier team leader review spec.
* **Action Needed:** Review the updated homepage presentation.
* **Notes / Input:** User requested the podium selection and newest-first ordering on 2026-11-19.


---

### 4. Photos apo subteams (Photos from subteams)
* **Status:** Awaiting assets / Feedback
* **Current State:** Currently using CAD/render diagrams from `src/assets/subdivisions/`.
* **Action Needed:** Awaiting real workshop / candid photos of team members working in each subteam if available.
* **Notes / Input:** 

---

### 5. Last section of home to not be scrolled (Home car timeline unpinned)
* **Status:** Implemented (Awaiting review)
* **Current State:** Removed GSAP desktop scroll-pinning and scrubbing. Converted into a smooth native horizontal swipe (`scroll-snap-type: x mandatory`) with previous/next arrow buttons and mouse drag support, leaving the vertical scroll unhijacked.
* **Action Needed:** Review on live preview / device to confirm the feel meets expectations.
* **Notes / Input:** 

---

### 6. Pages to be on nav (Pages in navigation menu)
* **Status:** Implemented (Awaiting review)
* **Current State:** Primary navigation overlay now displays: **Home, About, Subteams, Team, Cars, Sponsors, Join Us**.
* **Action Needed:** Confirm if this exact list of pages in the menu is finalized.
* **Notes / Input:** 

---

### 7. Photos in about (Photos on About page)
* **Status:** Implemented (Awaiting review)
* **Current State:** Added a 4-photo "Behind the Build: From Workshop to Racetrack" grid showing Manufacturing, Testing, Paddock, and Competition.
* **Action Needed:** Confirm if you want different photos or additional copy.
* **Notes / Input:** 

---

### 8. Subteam page (Dedicated `/subteams` page)
* **Status:** Implemented (Awaiting review)
* **Current State:** Built `/subteams` route featuring all 8 departments (Mechanical & Chassis, Aerodynamics & Suspension, Powertrain & Accumulator, Electronics & Embedded, IT & Software, Vehicle Dynamics & Control, Driverless Systems, Operations & Business) with technical domain tags, descriptions, and CAD graphics.
* **Action Needed:** Review layout, department descriptions, and domain tags.
* **Notes / Input:** 

---

### 9. Photos in /team page are cropped (Member portrait crop fix)
* **Status:** Implemented (Awaiting review)
* **Current State:** Updated member photo framing with `object-top` and borders so heads and faces are not cut off.
* **Action Needed:** Check seasons on `/team` to verify all member headshots look properly framed.
* **Notes / Input:** 

---

### 10. Photos in /cars should open (Lightbox on click)
* **Status:** Implemented (Awaiting review)
* **Current State:** Added a full-screen `<dialog id="car-lightbox">` modal to `/cars`. Clicking any gallery thumbnail or car photo opens it full screen with backdrop blur, caption, close button, and `Esc` dismissal.
* **Action Needed:** Review interaction and lightbox styling.
* **Notes / Input:** 

---

## Completed & Closed Features

* [x] **2. Πιο σκούρο πράσινο?** — Updated `--color-brand-orange` in `src/styles/global.css` to `#00A651` (classic racing green).
* [x] **11. No achievments in /cars** — Removed the placeholder achievements column from `/cars`; specifications table now spans full width cleanly.
* [x] **12. In /sponsors cto button on top** — Added "Become a Partner" and "View Current Partners" CTA buttons in the hero header of `/sponsors`.
* [x] **13. /theses for next version** — Shelved from active navigation and footer links.
* [x] **14. /blog no** — Deleted `/blog.astro` and purged all site references.
* [x] **15. /video no** — Deleted `/videos.astro` and purged all site references.
* [x] **16. /sponsor portal no** — Deleted `/sponsor-portal.astro` and purged all site references.
