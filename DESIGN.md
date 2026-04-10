```markdown
# Design System Specification: Kinetic Precision

## 1. Overview & Creative North Star
**The Creative North Star: "The Engineering Monolith"**

This design system is built to reflect the high-performance world of Formula Student racing. It moves away from the "generic SaaS" look toward a high-end, editorial engineering aesthetic. The goal is to blend the raw power of carbon fiber and asphalt with the clinical precision of a telemetry dashboard. 

We achieve this through **Kinetic Asymmetry**: a layout strategy where elements feel like they are in motion. We favor aggressive typography scales, intentional white space, and "technical layering" that mimics the assembly of a racing chassis. This is not just a website or an app; it is a digital manifestation of mechanical excellence.

---

## 2. Colors & Surface Logic

The palette is rooted in high-contrast depths and "ignition" highlights. 

### Core Palette
- **Primary (Deep Black - #0a0a0a):** Used for the core identity and primary `background` / `surface`.
- **Secondary (Vibrant Orange - #ff6b35):** The "Ignition" color. Used for critical CTAs and energy accents.
- **Tertiary (Electric Blue - #00d4ff):** The "Intelligence" color. Reserved for autonomous systems, data visualization, and technical innovation highlights.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. Structural definition must be achieved through **Tonal Shifting**. 
*   Place a `surface-container-low` section against a `surface` background to define a zone.
*   Use a `surface-container-highest` card to pull a component into the foreground. 
*   **The only exception:** Technical accents (micro-lines) used as decorative flourishes, never as containers.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
1.  **Base Layer:** `surface` (#131313) - The track.
2.  **Secondary Layer:** `surface-container-low` (#1b1c1c) - The paddock.
3.  **Component Layer:** `surface-container-high` (#2a2a2a) - The cockpit.

### The "Glass & Gradient" Rule
To avoid a flat, "templated" feel, main CTAs and Hero backgrounds should utilize subtle linear gradients. 
*   **Signature Gradient:** `secondary` (#ffb59d) to `secondary-container` (#b83900) at a 135-degree angle.
*   **Glassmorphism:** Use `surface-variant` with a 40% opacity and a `20px` backdrop-blur for floating navigation or technical overlays.

---

## 3. Typography: The Voice of Speed

The typography strategy pairs the technical rigidity of **Space Grotesk** with the utilitarian clarity of **Inter**.

*   **Display (Space Grotesk):** Set with tight letter-spacing (-0.04em). These are the "Engine Specs." Use `display-lg` (3.5rem) for high-impact hero statements.
*   **Headlines (Space Grotesk):** Use `headline-lg` (2rem) for section starters. Always in Bold to convey authority.
*   **Body (Inter):** The "Telemetry." Use `body-lg` (1rem) for readability. Ensure a generous line-height (1.6) to allow the technical data to breathe.
*   **Labels (Inter):** Small, often all-caps with increased letter-spacing (+0.1em) to mimic engineering schematics.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through "Tonal Stacking" rather than shadows.
*   **Example:** A `surface-container-lowest` card (#0e0e0e) placed on a `surface-container-low` background (#1b1c1c) creates a "recessed" or "carved" look, suggesting the card is a part of the machine's bodywork.

### Ambient Shadows
When an element must float (e.g., a modal or a floating action button), use a **Shadow-Tint**:
*   **Values:** `0px 24px 48px rgba(0, 0, 0, 0.4)`. 
*   Never use pure black shadows on non-black surfaces; instead, let the shadow inherit the depth of the `on-surface` tone.

### The "Ghost Border" Fallback
If a boundary is required for accessibility, use a "Ghost Border":
*   `outline-variant` (#444748) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons: The Ignition Switches
*   **Primary:** `secondary_container` background with `on_secondary_container` text. Sharp corners (`sm` - 0.125rem) to reflect engineering precision.
*   **Secondary (Ghost):** A `ghost border` with `secondary` text. On hover, fill with 10% `secondary` opacity.
*   **Tertiary:** `tertiary` text with a small `0.5rem` Electric Blue underscore. Use for "Technical Details" or "Read More."

### Cards & Technical Modules
*   **Prohibition:** No divider lines.
*   **Structure:** Use `vertical white space` (e.g., 32px gaps) to separate content blocks. 
*   **Header:** Use `label-sm` in `tertiary` color to categorize the card (e.g., "AUTONOMOUS STATUS").

### Input Fields: The Data Entry
*   **Style:** Minimalist. Only a bottom border using `outline` (#8e9192).
*   **Focus State:** The bottom border transforms into a `secondary` (Vibrant Orange) 2px line with a subtle glow.

### New Component: The "Telemetry Badge"
A custom chip variant. `surface-container-highest` background, `0.125rem` radius, featuring a `tertiary` (Electric Blue) 4px dot on the left. Used for real-time status or engineering categories.

---

## 6. Do’s and Don'ts

### Do:
*   **Embrace Asymmetry:** Align text to the left but place technical stats or images on a staggered right-hand grid.
*   **Use Mono-spacing for Numbers:** When displaying lap times or sensor data, use a monospace font or Inter with `tabular-nums` enabled.
*   **Layer Surfaces:** Think of the UI as a 3D assembly of parts.

### Don’t:
*   **Don't use Rounded Corners:** Avoid `xl` or `full` roundedness unless it's for a specific circular icon. High-performance engineering is sharp and intentional.
*   **Don't use Dividers:** If you feel the need for a line, use a background color shift instead.
*   **Don't use Standard Shadows:** Avoid heavy, muddy shadows that make the UI feel like a 2010s mobile app. Keep it light, airy, and "ambient."
*   **Don't Overuse Orange:** `secondary` is your fire. Too much fire burns the eyes; use it only for the most important actions.