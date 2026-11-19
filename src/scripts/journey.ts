// Native horizontal photo journey. Never intercept wheel/touch vertical scrolling.
const section = document.querySelector<HTMLElement>('[data-journey]');
const viewport = section?.querySelector<HTMLElement>('.journey__viewport');

if (section && viewport) {
  const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-journey-slide]'));
  const years = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-journey-year]'));
  const prev = section.querySelector<HTMLButtonElement>('#journey-prev');
  const next = section.querySelector<HTMLButtonElement>('#journey-next');
  const status = section.querySelector<HTMLElement>('[data-journey-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let frame = 0;
  let dragging = false;
  let dragged = false;
  let startX = 0;
  let startScroll = 0;

  const positions = () => {
    const gutter = Number.parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    const viewportLeft = viewport.getBoundingClientRect().left;
    return panels.map(panel => panel.getBoundingClientRect().left - viewportLeft + viewport.scrollLeft - gutter);
  };
  const update = () => {
    frame = 0;
    const offsets = positions();
    let closest = 0;
    offsets.forEach((offset, i) => {
      if (Math.abs(offset - viewport.scrollLeft) < Math.abs(offsets[closest] - viewport.scrollLeft)) closest = i;
    });
    const atEnd = viewport.scrollWidth > viewport.clientWidth && viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2;
    active = atEnd ? panels.length - 1 : closest;
    years.forEach((button, i) => {
      if (i === active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    if (prev) prev.disabled = viewport.scrollLeft <= 2;
    if (next) next.disabled = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2;
    if (status) status.textContent = `${active + 1} of ${panels.length}: ${years[active]?.getAttribute('aria-label') ?? ''}`;
  };
  const go = (index: number) => {
    const target = Math.max(0, Math.min(index, panels.length - 1));
    const left = Math.max(0, Math.min(positions()[target] ?? 0, viewport.scrollWidth - viewport.clientWidth));
    viewport.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  prev?.addEventListener('click', () => go(active - 1));
  next?.addEventListener('click', () => go(active + 1));
  years.forEach((button, index) => button.addEventListener('click', () => go(index)));
  viewport.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); go(active + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); go(event.key === 'Home' ? 0 : panels.length - 1);
    }
  });

  // Touch remains native. Only mouse drag suppresses an accidental car-link click.
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragging = true; dragged = false;
    startX = event.clientX; startScroll = viewport.scrollLeft;
  });
  window.addEventListener('pointermove', event => {
    if (!dragging || event.pointerType !== 'mouse') return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 5) {
      dragged = true; viewport.classList.add('is-dragging');
      viewport.scrollLeft = startScroll - delta;
    }
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false; viewport.classList.remove('is-dragging');
    update();
    // Snap to the nearest slide after a deliberate mouse drag.
    if (dragged) go(active);
    // Native pointerup clicks occur before this timer; later keyboard activation stays usable.
    window.setTimeout(() => { dragged = false; }, 0);
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', endDrag);
  viewport.addEventListener('dragstart', event => event.preventDefault());
  viewport.addEventListener('click', event => {
    if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; }
  }, true);
  new ResizeObserver(scheduleUpdate).observe(viewport);
  update();
}
