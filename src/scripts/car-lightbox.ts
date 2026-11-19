type GalleryImage = { src: string; alt: string };
type Galleries = Record<string, GalleryImage[]>;

const dialog = document.querySelector<HTMLDialogElement>('#car-lightbox');
const image = document.querySelector<HTMLImageElement>('#lightbox-img');
const data = document.getElementById('car-lightbox-data');
const caption = document.getElementById('lightbox-caption');
const counter = document.getElementById('lightbox-count');
const status = document.getElementById('lightbox-status');
const frame = document.querySelector<HTMLElement>('.lightbox-dialog__img-wrap');
const previous = document.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
const next = document.querySelector<HTMLButtonElement>('[data-lightbox-next]');

if (dialog && image && data && status) {
  const galleries: Galleries = JSON.parse(data.textContent || '{}');
  let photos: GalleryImage[] = [];
  let selected = 0;
  let request = 0;
  let opener: HTMLButtonElement | null = null;

  const clearImage = () => {
    image.hidden = true;
    image.removeAttribute('src');
    image.alt = '';
  };

  const showPhoto = async (index: number) => {
    if (!photos.length) return;
    selected = (index + photos.length) % photos.length;
    const photo = photos[selected];
    const currentRequest = ++request;

    // Clear before changing source: a previous decoded frame must never flash.
    clearImage();
    frame?.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading photo…';
    if (caption) caption.textContent = photo.alt;
    if (counter) counter.textContent = `${selected + 1} / ${photos.length}`;
    if (previous) previous.disabled = photos.length < 2;
    if (next) next.disabled = photos.length < 2;

    const loaded = new Image();
    loaded.src = photo.src;
    try {
      await loaded.decode();
      // Ignore a completed load after another selection or after closing.
      if (currentRequest !== request || !dialog.open) return;
      image.src = photo.src;
      image.alt = photo.alt;
      image.hidden = false;
      status.textContent = '';
    } catch {
      if (currentRequest !== request || !dialog.open) return;
      status.textContent = 'This photo could not load. Try another photo or close the gallery.';
    } finally {
      if (currentRequest === request) frame?.setAttribute('aria-busy', 'false');
    }
  };

  document.querySelectorAll<HTMLButtonElement>('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const gallery = galleries[trigger.dataset.lightboxCar || ''];
      if (!gallery?.length) return;
      photos = gallery;
      opener = trigger;
      clearImage();
      status.textContent = '';
      if (!dialog.open) dialog.showModal();
      document.documentElement.classList.add('lightbox-open');
      const index = Number(trigger.dataset.lightboxIndex);
      void showPhoto(Number.isInteger(index) && index >= 0 && index < photos.length ? index : 0);
    });
  });

  previous?.addEventListener('click', () => void showPhoto(selected - 1));
  next?.addEventListener('click', () => void showPhoto(selected + 1));
  dialog.querySelectorAll('[data-close-lightbox]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    void showPhoto(selected + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  // Native Escape and all explicit close controls share cleanup and focus return.
  dialog.addEventListener('close', () => {
    request++;
    clearImage();
    status.textContent = '';
    frame?.setAttribute('aria-busy', 'false');
    document.documentElement.classList.remove('lightbox-open');
    opener?.focus({ preventScroll: true });
    opener = null;
  });
}

export {};
