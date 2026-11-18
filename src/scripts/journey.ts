// Native smooth horizontal swipe for car journey without locking page scroll
const section = document.querySelector<HTMLElement>('[data-journey]');
const viewport = section?.querySelector<HTMLElement>('.journey__viewport');
const prevBtn = document.getElementById('journey-prev');
const nextBtn = document.getElementById('journey-next');

if (viewport) {
  const getScrollAmount = () => {
    const firstPanel = viewport.querySelector<HTMLElement>('.journey__panel');
    return firstPanel ? firstPanel.offsetWidth + 20 : 340;
  };

  prevBtn?.addEventListener('click', () => {
    viewport.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    viewport.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  // Enable subtle drag-to-scroll for desktop mouse users
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    viewport.classList.add('is-dragging');
    startX = e.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
  });

  viewport.addEventListener('mouseleave', () => {
    isDown = false;
    viewport.classList.remove('is-dragging');
  });

  viewport.addEventListener('mouseup', () => {
    isDown = false;
    viewport.classList.remove('is-dragging');
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5;
    viewport.scrollLeft = scrollLeft - walk;
  });
}
