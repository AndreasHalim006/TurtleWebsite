// Respect reduced-motion: show the poster image instead of the looping video.
const video = document.getElementById('hero-video') as HTMLVideoElement | null;
if (video && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  video.pause();
  video.removeAttribute('autoplay');
  video.style.display = 'none';
}
