// Aristurtle Website - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Scroll animations (fade-in on scroll)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
      }
    });
  }, observerOptions);
  
  // Observe elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
    observer.observe(el);
  });
  
  // Engineering Milestones — Coverflow Sticky Scroll
  const showcaseSection = document.querySelector('#achievements-showcase');
  const showcaseCards = document.querySelectorAll('.showcase-card');
  const progressBar = document.querySelector('#showcase-progress');
  const showcaseCounter = document.querySelector('#showcase-counter');

  if (showcaseSection && showcaseCards.length > 0) {
    const mobileMQ = window.matchMedia('(max-width: 767px)');

    function updateShowcase() {
      const rect = showcaseSection.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      let globalProgress = scrollable > 0 ? -rect.top / scrollable : 0;
      globalProgress = Math.max(0, Math.min(1, globalProgress));

      if (progressBar) progressBar.style.width = `${globalProgress * 100}%`;

      const n = showcaseCards.length;
      const virtualIndex = globalProgress * (n - 1);
      const isMobile = mobileMQ.matches;
      const activeIdx = Math.round(virtualIndex);

      if (showcaseCounter) {
        const shown = String(Math.min(n, activeIdx + 1)).padStart(2, '0');
        const total = String(n).padStart(2, '0');
        showcaseCounter.textContent = `${shown} / ${total}`;
      }

      showcaseCards.forEach((card, i) => {
        const delta = i - virtualIndex;
        const absDelta = Math.abs(delta);

        if (isMobile) {
          const isActive = i === activeIdx;
          card.style.transform = 'translate(-50%, -50%) scale(1)';
          card.style.opacity = isActive ? 1 : 0;
          card.style.zIndex = isActive ? 100 : 0;
          card.style.borderColor = isActive
            ? 'rgba(255, 107, 53, 1)'
            : 'rgba(68, 71, 72, 0.4)';
          return;
        }

        // Desktop coverflow: dramatic arc, 3 cards visible
        const clamped = Math.min(absDelta, 1.5);
        const translateX = delta * 62;           // % of card width — wider spread
        const translateZ = -clamped * 380;       // deeper push-back
        const rotateY = -delta * 48;             // stronger rotation
        const scale = 1 - Math.min(absDelta, 1) * 0.22;

        let opacity;
        if (absDelta <= 1) {
          opacity = 1;
        } else if (absDelta < 1.4) {
          opacity = 1 - (absDelta - 1) / 0.4;
        } else {
          opacity = 0;
        }

        const zIndex = 100 - Math.round(absDelta * 10);

        card.style.transform =
          `translate(-50%, -50%) translate3d(${translateX}%, 0, ${translateZ}px) ` +
          `rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
        card.style.borderColor = absDelta < 0.5
          ? 'rgba(255, 107, 53, 1)'
          : 'rgba(68, 71, 72, 0.4)';
      });
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateShowcase();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (mobileMQ.addEventListener) mobileMQ.addEventListener('change', onScroll);
    updateShowcase();
  }
  
  // Language switcher placeholder
  const langSwitcher = document.querySelector('.lang-switcher');
  if (langSwitcher) {
    langSwitcher.addEventListener('click', function() {
      // TODO: Implement language switching
      alert('Greek language support coming soon!');
    });
  }
  
});
