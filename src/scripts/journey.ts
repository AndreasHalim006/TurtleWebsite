import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector<HTMLElement>('[data-journey]');
const viewport = section?.querySelector<HTMLElement>('.journey__viewport');
const track = section?.querySelector<HTMLElement>('.journey__track');

if (section && viewport && track) {
  const mm = gsap.matchMedia();

  // Desktop: pin the section and translate the track horizontally with scroll.
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    // Stop when the last panel reaches the right gutter.
    const distance = () => {
      const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
      return Math.max(0, track.scrollWidth - (viewport.clientWidth - pad * 2));
    };

    gsap.to(track, {
      x: () => -distance(),
      ease: 'none', // scrubbed movement must stay linear to track the scrollbar
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  });
}
