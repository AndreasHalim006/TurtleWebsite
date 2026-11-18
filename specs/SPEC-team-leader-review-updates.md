# SPEC: Team Leader Review Updates (v2)

Status: **DRAFT / PENDING APPROVAL**  
Target Branch: `v2`  
Reference: User Meeting Notes (2026-11-18)

## 1. Overview & Scope
Implement approved items from the team leader design and architecture review:
- **Item 2:** Darker racing green brand accent token (`#00A651`).
- **Item 3:** Real historical podiums & awards on Home & site data.
- **Item 5:** Native unpinned horizontal swipe for the car journey on Home.
- **Item 7:** Visual photo gallery section on `/about`.
- **Item 8:** Dedicated `/subteams` page with technical breakdown of all 8 subdivisions.
- **Item 9:** Fix member photo cropping on `/team`.
- **Item 10:** Accessible image lightbox modal for car galleries on `/cars`.
- **Item 11:** Remove placeholder achievements column on `/cars`.
- **Item 12:** Call-to-action button in hero header on `/sponsors`.
- **Item 13:** Shelve `/theses` from navigation & footer links.
- **Item 14:** Remove `/blog` page and references.
- **Item 15:** Remove `/videos` page and references.
- **Item 16:** Remove `/sponsor-portal` page and references.

*(Items 1 and 4 regarding external FSG/FSS photos and new subteam candid photos are deferred to a subsequent asset drop).*

## 2. Acceptance Criteria (Measurable)

1. **Build & Quality:**
   - `pnpm run build` exits with code 0.
   - Zero TypeScript, Astro, or broken link warnings.
   - Zero console errors on all active pages (`/`, `/about`, `/subteams`, `/team`, `/cars`, `/sponsors`, `/join`).

2. **Brand & Color (Item 2):**
   - `--color-brand-orange` in `src/styles/global.css` is updated from `#9FFF10` to authentic racing green `#00A651`.
   - Hover states, focus outlines, and accents reflect the new green tone across all components.

3. **Achievements (Item 3):**
   - Homepage achievement cards display Aristurtle's real historical podiums:
     - 1st Place (2021) – Business Plan Presentation, Formula Student Austria
     - 3rd Place (2021) – Skidpad (Driverless), Formula Student East
     - 3rd Place (2019) – Overall Electric Class, Formula SAE Italy
     - 2nd Place (2015) – Overall Class 1C, Formula SAE Italy
   - No `20XX` placeholder text remains on the homepage.

4. **Home Car Journey (Item 5):**
   - On desktop (>= 1024px), vertical window scroll is **never** pinned or hijacked by GSAP ScrollTrigger.
   - The car journey list allows smooth, native horizontal swiping/scrolling (`scroll-snap-type: x mandatory`).
   - Page continues to scroll vertically without resistance or pause.

5. **About Page (Item 7):**
   - `/about` features a multi-photo responsive gallery showing team members working in the lab/workshop and at the racetrack, utilizing high-resolution assets already in the repo.

6. **Subteams Page (Item 8):**
   - Route `/subteams` is accessible and listed in the primary navigation overlay.
   - All 8 subdivisions (Mechanical, Aerodynamics, Powertrain, Electronics, IT & Software, Vehicle Dynamics, Driverless, Operations) are presented with their technical domains, responsibilities, and visual assets.

7. **Team Page Member Photos (Item 9):**
   - Member photos across all seasons on `/team` do not crop members' heads or faces (`object-top` framing / relaxed aspect ratio).

8. **Cars Page Gallery Lightbox & Layout (Items 10 & 11):**
   - Clicking any car gallery image or main car image opens a full-screen accessible modal dialog (`<dialog>`).
   - Modal supports `Esc` key to close, close button, and backdrop click to dismiss.
   - The placeholder "Achievements" column is completely removed from `/cars`. The specifications section spans cleanly without empty gap.

9. **Sponsors Page Hero CTA (Item 12):**
   - `/sponsors` contains a prominent CTA button in or immediately below the hero header ("Become a Partner" / "Get in Touch") linking to `mailto:info@aristurtle.gr`.

10. **Dead Link & Route Cleanup (Items 13, 14, 15, 16):**
    - Nav links contain only: Home (`/`), About (`/about`), Subteams (`/subteams`), Team (`/team`), Cars (`/cars`), Sponsors (`/sponsors`), Join Us (`/join`).
    - `/blog.astro`, `/videos.astro`, and `/sponsor-portal.astro` are deleted.
    - `/theses` is removed from active nav/footer.
    - Footer links in `Footer.astro` contain no broken links.
