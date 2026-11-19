const header = document.getElementById('site-header');

if (header) {
  const forced = header.dataset.forceSolid === 'true';
  const applyState = () => { header.dataset.solid = String(forced || window.scrollY > 24); };
  applyState();
  window.addEventListener('scroll', applyState, { passive: true });

  const updateHeight = () => {
    document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
  };
  updateHeight();
  new ResizeObserver(updateHeight).observe(header);

  // Keep the current page in view in the compact, horizontally scrollable nav.
  const nav = header.querySelector<HTMLElement>('.site-header__nav');
  const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
  if (nav && active) nav.scrollLeft = Math.max(0, active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2);
}

export {};
