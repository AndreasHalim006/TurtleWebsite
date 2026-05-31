# SPEC-sponsors-ideal.md | The "Biometric Assembly" Sponsors Page

## 1. Vision & Aesthetic
A high-fidelity, spatial data visualization terminal. The page should feel like an active engineering console where partner data is being "assembled" and "analyzed" in real-time.

**Design Language:**
- **Minimalist Monochrome:** #020202 (Void) background with #FFFFFF (Pure White) and #ff8900 (Aristurtle Orange).
- **Atmosphere:** Deep, moving "Grainient" background with technical micro-grids.
- **Interactions:** Tactile, geometric "Lock-on" HUD cursor.

---

## 2. Technical Architecture

### A. The Master Grid (The "Ecosystem")
A mathematically perfect, static field of hexagons covering the entire viewport.
- **Hexagon Orientation:** Flat-top.
- **Dimensions:** Width: 180px | Height: 156px.
- **Uniform Spacing:** 20px gap between all parallel edges.
- **Idle State:** Small white dots (Scale: 0.05) at 100% opacity.
- **Active Zone:** Central grid slots reserved for sponsor assembly.

### B. The Morphing System (Scroll-Driven)
- **Navigation:** The grid remains static; only the content within the grid morphs.
- **Assembly Logic:** As the user scrolls, current sponsors shrink to dots, and the next category's logos grow from dots into full-sized tiles.
- **Transition Style:** center-out spiral assembly with "back.out" GSAP easing.
- **Halftone Effect:** Surrounding empty hexagons partially grow (Scale: 0.3) when a category is active to create a soft "dissolve" edge.

### C. The Hex-Target HUD (Cursor)
A custom 6-vertex technical cursor that "locks" onto partners.
- **Idle Mode:** 6 brackets in a wide circular formation (30px radius), spinning continuously. Brackets point outward.
- **Lock Mode:** Brackets fly to the 6 vertices of the targeted hexagon.
- **Geometry:** Brackets have a perfect 120° opening to cradle the hex corners.
- **Visuals:** Aristurtle Orange stroke with a neon glow (drop-shadow).

---

## 3. Interaction Design

### Hover States (The "Analysis")
When a user targets a sponsor tile:
1.  **Scale:** Tile increases to 1.1x.
2.  **Depth:** Inset shadow filter triggers to create a "recessed" tactile feel.
3.  **Border:** The "Car-Line" (orange path) glows to 100% opacity and increases in stroke width.
4.  **Logo:** Partner logo scales up by 10% within the safe zone.

### Click Behavior (The "Connection")
- **Action:** Opens the partner's website in a new `_blank` tab.
- **Cursor Feedback:** HUD dot pulses briefly on click.

---

## 4. UI Elements (The "Terminal")
- **HUD Label:** Fixed position (top 10-15vh). Displays tier title (e.g., // THE_SYNDICATE) in high-tracking Jura font.
- **Scroll Proxy:** Long vertical track (e.g., 300vh per category) to ensure transitions feel deliberate and professional.
- **Final CTA:** A full-screen "Join the Legacy" section that emerges as the final assembly state.

---

## 5. Development Constraints
- **Performance:** Use `InstancedMesh` logic or efficient DOM recycling to handle 96+ partners.
- **Responsiveness:** Scale the Master Grid constants (HEX_W, HEX_H, GAP) based on viewport width.
- **Accessibility:** Ensure `prefers-reduced-motion` skips the heavy spatial transitions but keeps the content accessible.
