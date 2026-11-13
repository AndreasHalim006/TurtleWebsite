import { gsap } from 'gsap';

const LUXE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const header = document.getElementById('site-header') as HTMLElement | null;
const toggle = document.getElementById('menu-toggle') as HTMLButtonElement | null;
const overlay = document.getElementById('menu-overlay') as HTMLElement | null;

if (header && toggle && overlay) {
  const root = document.documentElement;
  const forced = header.dataset.forceCompact === 'true';
  const compactBarH = 68;
  let contentStarted = forced;
  let menuOpen = false;

  const applyState = () => {
    header.dataset.compact = String(forced || contentStarted || menuOpen);
  };

  // "Discrete Switch": large bar over the hero, snaps to compact once content begins.
  if (!forced) {
    const hero = document.querySelector('[data-hero]');
    if (hero) {
      new IntersectionObserver(
        ([entry]) => {
          contentStarted = !entry.isIntersecting;
          applyState();
        },
        { rootMargin: `-${compactBarH}px 0px 0px 0px`, threshold: 0 }
      ).observe(hero);
    } else {
      contentStarted = true;
      applyState();
    }
  }

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

    const lenis = (window as any).lenis;
    if (open) {
      lastFocus = document.activeElement as HTMLElement;
      lenis?.stop();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(
          overlay.querySelectorAll('.menu-overlay__nav li, .menu-overlay__side > *'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.04, delay: 0.25, ease: LUXE_EASE, overwrite: true }
        );
      }
      (overlay.querySelector('a[href]') as HTMLElement | null)?.focus();
    } else {
      lenis?.start();
      (lastFocus ?? toggle).focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(!menuOpen));

  // Close after choosing a link (same-page anchors don't reload).
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
