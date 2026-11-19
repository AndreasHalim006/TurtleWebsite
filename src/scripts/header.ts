const header = document.getElementById('site-header');

if (header) {
  const forced = header.dataset.forceSolid === 'true';
  const scrollPosition = () => Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
  let lastY = scrollPosition();
  let direction = 0;
  let travel = 0;
  let scheduled = false;

  const applyState = () => {
    scheduled = false;
    const y = scrollPosition();
    const delta = y - lastY;
    lastY = y;
    header.dataset.solid = String(forced || y > 24);

    if (y <= header.offsetHeight + 24 || header.contains(document.activeElement)) {
      header.dataset.hidden = 'false';
      direction = 0;
      travel = 0;
      return;
    }
    if (delta === 0) return;
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) { direction = nextDirection; travel = 0; }
    travel += Math.abs(delta);
    // Ignore tiny trackpad/scroll deltas so the bar does not flicker.
    if (travel >= 12) header.dataset.hidden = String(direction > 0);
  };
  header.dataset.hidden = 'false';
  applyState();
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(applyState); }
  }, { passive: true });
  header.addEventListener('focusin', () => {
    header.dataset.hidden = 'false';
    lastY = scrollPosition();
    travel = 0;
  });

  const updateHeight = () => {
    document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
  };
  updateHeight();
  new ResizeObserver(updateHeight).observe(header);

  const nav = header.querySelector<HTMLElement>('.site-header__nav');
  const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
  if (nav && active) nav.scrollLeft = Math.max(0, active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2);
}

export {};
