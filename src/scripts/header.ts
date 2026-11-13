import { gsap } from 'gsap';

const header = document.getElementById('site-header') as HTMLElement | null;
const toggle = document.getElementById('menu-toggle') as HTMLButtonElement | null;
const overlay = document.getElementById('menu-overlay') as HTMLElement | null;

if (header && toggle && overlay) {
  const root = document.documentElement;
  const forced = header.dataset.forceSolid === 'true';
  let menuOpen = false;

  // Transparent over the hero, solid once the page scrolls.
  const applyState = () => {
    const scrolled = window.scrollY > 24;
    header.dataset.solid = String(forced || scrolled || menuOpen);
  };
  applyState();
  window.addEventListener('scroll', applyState, { passive: true });

  let lastFocus: HTMLElement | null = null;
  // DOM order: toggle button first, then overlay links.
  const focusables = () => [toggle, ...Array.from(overlay.querySelectorAll<HTMLElement>('a[href]'))];

  const setOpen = (open: boolean) => {
    menuOpen = open;
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    overlay.setAttribute('aria-hidden', String(!open));
    if (open) overlay.removeAttribute('inert');
    else overlay.setAttribute('inert', '');
    applyState();

    if (open) {
      lastFocus = document.activeElement as HTMLElement;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(
          overlay.querySelectorAll('.menu-overlay__nav li, .menu-overlay__side > *'),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.04, delay: 0.1, ease: 'power2.out', overwrite: true }
        );
      }
      (overlay.querySelector('a[href]') as HTMLElement | null)?.focus();
    } else {
      (lastFocus ?? toggle).focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(!menuOpen));

  overlay.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a[href]')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (!menuOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

}
