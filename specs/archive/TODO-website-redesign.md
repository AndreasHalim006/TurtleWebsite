# Aristurtle Website Redesign - TODO

## TL;DR

Migrate aristurtle.gr from outdated WordPress to a modern static HTML/CSS/JS site based on Stitch prototype design. Build MVP first with existing assets, then iterate with user-provided content.

---

## Requirements

### User Requirements (Verbatim)
- "Our site is outdated and should be reworked on"
- "I've worked with LLM's with html, css, javascript, but I've never done Wordpress"
- "My hosting provider doesn't allow me ssh access, so we can't work with SSH"
- "Could we work on this website together locally, and then I can deploy it on the web server?"
- "The hosting shouldnt be done with github pages in the end. I want the server that I have to actually host the website"
- "Go with your recommendations" (simplified navigation, bilingual, feature latest car, remove news, email links for forms)
- "Color Palette: the team's logo is mainly black/orange. Fix this section"
- "Lets go with Option A. How can we integrate our content into stitch's design? Lets plan this out"
- "We should begin by bringing up a prototype, and wherever the content is missing i'll provide it to you. but an mvp should be set up first, with all the images and content that we have from the current site"

### Technical Requirements
- Static HTML/CSS/JS (no WordPress, no PHP dependencies)
- Deploy to existing Plesk hosting (aristurtle.gr)
- No SSH access - use Plesk File Manager for deployment
- Local development first, then deploy
- Professional design matching FS team standards (FSTeamDelft, AMZRacing, ChalmersFS)
- Black/orange primary colors (matching team logo)
- Bilingual support (Greek/English)

---

## Facts

### Current Site Status (aristurtle.gr)
- WordPress 6.9.4 (outdated)
- PHP 7.4.33 (End of Life, security risk)
- 33GB disk usage
- Security vulnerabilities flagged
- Complex navigation with dropdowns
- Mixed Greek/English content

### Current Site Content Structure
- **Home**: Hero, Recruitment CTA, Team/Garage/Divisions sections, ARISTLE acronym
- **About Us**: Team history, Why Electric, Why Driverless, Ikiskos workspace
- **Garage**: 8 cars (Calypso, Persephone, Nemesis, Thetis DV, Thetis, Iris, Eve, Electra)
- **Subdivisions**: 8 departments (Aero, Autonomous, Chassis, Composites, HV, LV, Operations, Suspension)
- **Seasons**: 10 years (2015-2025)
- **Partners**: 6 tiers (Academia, Premium, Platinum, Gold, Silver, Bronze, Supporters, Food, Media)
- **Contact**: Team leader info, address

### Downloaded Assets
- Team logo (white version)
- Car images (Calypso, Persephone, Thetis, Iris, Nemesis, Thetis DV, Eve, Electra)
- Team photos
- Division letter images (Aerodynamics, Autonomous, Chassis, Composites, HV, LV, Operations, Suspension)
- Some sponsor logos
- All text content extracted

### Stitch Prototype Output
- 7 HTML pages with consistent design system
- Dark theme with orange/cyan accents
- Space Grotesk + Inter typography
- "Kinetic Precision" aesthetic
- All pages use Tailwind CDN (not production-ready)
- Placeholder images (Google AIDA-generated)
- Text placeholders for sponsors
- No JavaScript functionality
- No SEO meta tags

### Server Environment
- Plesk control panel
- Apache/Nginx web server
- PHP available (but not needed for static site)
- File Manager for uploads
- No SSH access
- Domain: aristurtle.gr

---

## User Made Decisions

1. **Stay with current hosting** (not GitHub Pages)
2. **Static HTML/CSS/JS** (no WordPress)
3. **Simplified navigation** (match professional FS teams)
4. **Black/orange primary colors** (matching team logo)
5. **Option A**: Use Stitch output as foundation
6. **MVP first**: Build prototype with existing assets, iterate with user-provided content
7. **Design recommendations accepted**: Simplified nav, bilingual, feature latest car, remove news, email links for forms

---

## Implied Decisions

1. **Tailwind CSS compilation**: Remove CDN dependency, compile locally
2. **Image optimization**: Convert to WebP, proper sizing, lazy loading
3. **SEO optimization**: Meta tags, structured data, sitemap, robots.txt
4. **Contact form**: Need backend solution (Formspree, EmailJS, or custom PHP)
5. **Language support**: JavaScript-based switching or separate files
6. **Mobile responsiveness**: All pages must work on mobile devices
7. **Performance**: Fast loading, optimized assets
8. **Accessibility**: WCAG 2.1 AA compliant

---

## Pending Decisions

### 1. Contact Form Backend
**Background**: Static sites can't process forms server-side without a backend service.

**Options**:
- **A. Formspree** (Recommended): Free tier, easy setup, no code changes needed
  - Pros: Simple, reliable, spam protection
  - Cons: Limited free submissions, third-party dependency
- **B. EmailJS**: Client-side email sending
  - Pros: No backend needed, customizable
  - Cons: Requires API key, rate limits
- **C. Custom PHP**: Use existing PHP hosting
  - Pros: Full control, no third-party
  - Cons: Requires PHP code, maintenance
- **D. Netlify Forms**: If deploying to Netlify
  - Pros: Built-in, easy
  - Cons: Requires Netlify hosting

**Recommendation**: A (Formspree) - simplest solution for MVP

### 2. Greek Language Support
**Background**: Current site has mixed Greek/English content. Need systematic approach.

**Options**:
- **A. Separate HTML files** (e.g., `index.html`, `index_gr.html`)
  - Pros: Better SEO, simpler implementation
  - Cons: Duplicate maintenance, larger file size
- **B. JavaScript-based switching**: Single HTML, JS swaps content
  - Pros: Single file, dynamic
  - Cons: SEO challenges, JS dependency
- **C. JSON content files**: HTML structure, content from JSON
  - Pros: Clean separation, easy updates
  - Cons: More complex setup

**Recommendation**: A (Separate files) - better for SEO and simplicity

### 3. Image Sourcing
**Background**: Stitch output uses placeholder images. Need actual assets.

**Options**:
- **A. Use downloaded assets from current site** (MVP approach)
  - Pros: Immediate availability, no waiting
  - Cons: May be lower quality, limited selection
- **B. Request high-res assets from team**
  - Pros: Better quality, more options
  - Cons: Requires coordination, delays MVP
- **C. Mix of both**: Use downloaded for MVP, upgrade later
  - Pros: Best of both worlds
  - Cons: More work later

**Recommendation**: C (Mix) - MVP with existing, upgrade later

### 4. Sponsor Logo Format
**Background**: Need sponsor logos for Partners page.

**Options**:
- **A. Download from current site** (existing logos)
  - Pros: Immediate availability
  - Cons: May be low-res, inconsistent formats
- **B. Request SVG/high-res from sponsors**
  - Pros: Professional quality
  - Cons: Time-consuming, may not get all
- **C. Use current logos for MVP, upgrade later**
  - Pros: Fast MVP, can improve later
  - Cons: Inconsistent quality initially

**Recommendation**: C (Current for MVP, upgrade later)

---

## Plan

### Phase 1: Project Setup (2-3 hours)
- [x] Create project directory structure
- [ ] Copy Stitch HTML files to src/
- [ ] Set up Tailwind CSS compilation
  - Create `tailwind.config.js` with black/orange/cyan palette
  - Create `package.json` with dependencies
  - Set up build scripts
- [ ] Create base CSS file with custom styles
- [ ] Test build process

### Phase 2: Asset Integration (4-6 hours)
- [ ] Organize downloaded assets into src/assets/
- [ ] Optimize images for web (WebP, sizing)
- [ ] Create sponsor logo directory structure
- [ ] Update all `<img>` tags to point to actual assets
- [ ] Add fallback images for missing assets

### Phase 3: Content Integration (6-8 hours)
- [ ] Extract text content from current site
- [ ] Map content to Stitch page sections
- [ ] Update HTML with actual text content
- [ ] Ensure tone matches professional FS team style
- [ ] Add placeholder markers for missing content

### Phase 4: Technical Implementation (8-10 hours)
- [ ] Remove Tailwind CDN, use compiled CSS
- [ ] Implement mobile menu (hamburger toggle)
- [ ] Implement language switcher (EN/GR)
- [ ] Add scroll animations (fade-in, parallax)
- [ ] Set up contact form backend (Formspree)
- [ ] Add SEO meta tags to all pages
- [ ] Add structured data (JSON-LD)
- [ ] Create sitemap.xml
- [ ] Create robots.txt

### Phase 5: Testing & Optimization (4-6 hours)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing
- [ ] Performance optimization (image lazy loading, minification)
- [ ] Accessibility testing (contrast, keyboard nav, ARIA)
- [ ] SEO validation (meta tags, structured data)
- [ ] Fix any bugs or issues

### Phase 6: Deployment Preparation (2-3 hours)
- [ ] Run production build
- [ ] Optimize and minify all assets
- [ ] Create deployment package (zip)
- [ ] Document deployment steps for Plesk
- [ ] Test deployment package locally

### Phase 7: User Review & Iteration (Ongoing)
- [ ] Present MVP to user
- [ ] Collect feedback on content gaps
- [ ] User provides missing content (images, text, logos)
- [ ] Integrate user-provided content
- [ ] Iterate until satisfied

### Phase 8: Production Deployment
- [ ] Upload to Plesk via File Manager
- [ ] Replace WordPress files
- [ ] Update .htaccess for static site
- [ ] Test live site
- [ ] Monitor for issues

---

## Testing Requirements

### Functional Testing
- [ ] All navigation links work
- [ ] Mobile menu toggles correctly
- [ ] Language switcher works
- [ ] Contact form submits successfully
- [ ] All images load correctly
- [ ] All pages render properly

### Cross-Browser Testing
- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Edge (desktop)

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Images optimized (WebP, proper sizing)
- [ ] CSS/JS minified
- [ ] Lazy loading implemented
- [ ] No render-blocking resources

### Accessibility Testing
- [ ] Color contrast ratio > 4.5:1
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Focus indicators visible

### SEO Testing
- [ ] Meta tags present on all pages
- [ ] Open Graph tags present
- [ ] Structured data valid
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Canonical URLs set

---

## Documentation Updates Required

### Deployment Guide
- [ ] Step-by-step Plesk deployment instructions
- [ ] File structure explanation
- [ ] Build process documentation
- [ ] Troubleshooting guide

### Content Management Guide
- [ ] How to update text content
- [ ] How to replace images
- [ ] How to add/update sponsors
- [ ] How to manage bilingual content

### Maintenance Guide
- [ ] How to rebuild the site
- [ ] How to update dependencies
- [ ] How to add new pages
- [ ] How to monitor performance

---

## Current Status

**Phase**: Phase 1 - Project Setup (In Progress)
**MVP Goal**: Working prototype with existing assets, missing content marked for user input
**Next Step**: Copy Stitch HTML files to src/ and set up Tailwind compilation

---

## Notes

- Stitch output uses `#ffb59d` (peach) for secondary color - needs to be changed to `#ff6b35` (orange) to match team logo
- All pages need proper file naming (index.html, about.html, garage.html, etc.)
- Navigation links need to be updated to point to correct files
- Footer needs to be consistent across all pages
- Consider adding a 404 page
- Consider adding a privacy policy page (linked in footer)
- Newsletter signup in footer needs backend or should be removed
- Map on contact page needs Google Maps embed or static image

---

## User Content Needed

### Images
- [ ] High-resolution team photos (group, workshop, events)
- [ ] Car photos (all 8 cars, multiple angles)
- [ ] Competition photos
- [ ] Sponsor event photos
- [ ] Any additional branding assets

### Sponsor Logos
- [ ] Premium: Protergia
- [ ] Platinum: dSPACE, JAMSport, Sensoric Solutions, EY
- [ ] Gold: (all gold tier sponsors)
- [ ] Silver: (all silver tier sponsors)
- [ ] Bronze: (all bronze tier sponsors)
- [ ] Supporters: (all supporter sponsors)
- [ ] Food: (all food suppliers)
- [ ] Media: (all media sponsors)

### Text Content
- [ ] Greek translations for all pages
- [ ] Updated car specifications
- [ ] Updated team member info
- [ ] Updated sponsor descriptions
- [ ] Any new content or updates

### Technical
- [ ] Contact form email address
- [ ] Social media links (Instagram, LinkedIn, Facebook, YouTube)
- [ ] Google Maps embed code or coordinates
- [ ] Any analytics tracking codes (Google Analytics, etc.)
