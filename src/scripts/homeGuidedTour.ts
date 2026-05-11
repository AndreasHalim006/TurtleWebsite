import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TypeIt from 'typeit';

type PhaseDefinition = {
  kind: 'clean' | 'story';
  slide?: Element | null;
  image?: string;
  focus: WordmarkFocus;
  imageTransform?: {
    scale: number;
    xPercent: number;
    yPercent: number;
  };
};

type WordmarkFocus = {
  cx?: number;
  cy?: number;
  fillRatio: number;
  maxWidthRatio?: number;
  measureBounds?: boolean;
};

type TypeItInstance = {
  destroy?: () => void;
  go: () => TypeItInstance;
};

gsap.registerPlugin(ScrollTrigger);

const SNAP_POINTS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const PHASE_SPACING = 1;
const HOLD_EXIT_OFFSET = 0.34;
const TRANSITION_DURATION = 0.46;

const WORDMARK_BOUNDS = {
  x: 270,
  y: 70,
  width: 710,
  height: 105,
};

const cleanFocus: WordmarkFocus = {
  fillRatio: 0.24,
  maxWidthRatio: 0.78,
  measureBounds: true,
};

const getStoryFillRatio = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const portrait = height > width;

  if (width < 520) return 1.08;
  if (portrait) return 1.32;
  if (height < 760) return 1.62;
  return 1.84;
};

const getWideFillRatio = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const portrait = height > width;

  if (width < 520) return 0.38;
  if (portrait) return 0.42;
  return 0.48;
};

const getWordmarkBounds = (measureBounds = false) => {
  if (measureBounds && maskWordmark instanceof SVGGraphicsElement) {
    const bbox = maskWordmark.getBBox();
    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    };
  }

  return WORDMARK_BOUNDS;
};

const resolveFocus = (focus: WordmarkFocus) => {
  const sw = window.innerWidth;
  const sh = window.innerHeight;
  const bounds = getWordmarkBounds(focus.measureBounds);
  const focusCx = focus.cx ?? bounds.x + bounds.width / 2;
  const focusCy = focus.cy ?? bounds.y + bounds.height / 2;
  const heightScale = (sh * focus.fillRatio) / bounds.height;
  const widthScale = focus.maxWidthRatio ? (sw * focus.maxWidthRatio) / bounds.width : heightScale;
  const scale = Math.min(heightScale, widthScale);
  const x = sw / 2 - focusCx * scale;
  const y = sh / 2 - focusCy * scale;

  return { scale, x, y };
};

type ResolvedWordmarkFocus = ReturnType<typeof resolveFocus>;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[char];
  });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollSection = document.querySelector<HTMLElement>('[data-cinematic-scroll]');
const stageBg = document.querySelector<SVGRectElement>('[data-stage-bg]');
const maskWordmark = document.querySelector('[data-mask-wordmark]');
const maskedImages = gsap.utils.toArray<Element>('[data-masked-img]');
const slide1 = document.querySelector('[data-slide="1"]');
const slide2 = document.querySelector('[data-slide="2"]');
const slide3 = document.querySelector('[data-slide="3"]');
const slide4 = document.querySelector('[data-slide="4"]');
const slides = [slide1, slide2, slide3, slide4].filter((slide): slide is Element => slide !== null);

if (scrollSection && stageBg && maskWordmark) {
  const typeInstances = new Map<Element, TypeItInstance>();
  const typedSlides = new Set<Element>();
  let activeTypedSlide: Element | null = null;
  let activePhaseIndex = -1;

  const buildPhases = (): PhaseDefinition[] => {
    const storyFillRatio = getStoryFillRatio();
    const wideFillRatio = getWideFillRatio();

    return [
      {
        kind: 'clean',
        focus: cleanFocus,
      },
      {
        kind: 'story',
        image: '[data-masked-img="1"]',
        slide: slide1,
        focus: { cx: 350, cy: 17, fillRatio: 7 },
        imageTransform: { scale: 2, xPercent: 10, yPercent: -25 },
      },
      {
        kind: 'story',
        image: '[data-masked-img="2"]',
        slide: slide2,
        focus: { cx: 65, cy: 60, fillRatio: 7 },
        imageTransform: { scale: 1.5, xPercent: 30, yPercent: -2 },
      },
      {
        kind: 'story',
        image: '[data-masked-img="3"]',
        slide: slide3,
        focus: { cx: 495, cy: 35, fillRatio: 7 },
        imageTransform: { scale: 1.45, xPercent: -26, yPercent: 0 },
      },
      {
        kind: 'story',
        image: '[data-masked-img="4"]',
        slide: slide4,
        focus: { cx: 880, cy: 21, fillRatio: wideFillRatio },
        imageTransform: { scale: 1.04, xPercent: 0, yPercent: 0 },
      },
      {
        kind: 'clean',
        focus: cleanFocus,
      },
    ];
  };

  const resetTypeTarget = (slide: Element) => {
    const target = slide.querySelector<HTMLElement>('[data-typeit-copy]');
    if (target) target.textContent = '';
  };

  const destroyTypeInstance = (slide: Element) => {
    typeInstances.get(slide)?.destroy?.();
    typeInstances.delete(slide);
  };

  const clearTypeIt = (slide: Element | null) => {
    if (!slide) return;

    typedSlides.delete(slide);
    destroyTypeInstance(slide);
    resetTypeTarget(slide);
  };

  const clearActiveTypeIt = () => {
    clearTypeIt(activeTypedSlide);
    activeTypedSlide = null;
  };

  const runTypeIt = (slide: Element | null) => {
    if (!slide || typedSlides.has(slide)) return;

    const target = slide.querySelector<HTMLElement>('[data-typeit-copy]');
    if (!target) return;

    destroyTypeInstance(slide);
    resetTypeTarget(slide);

    const title = escapeHtml(target.dataset.typeitTitle ?? '');
    const body = escapeHtml(target.dataset.typeitBody ?? '');
    const typedMarkup = `${title}<br><span class="typeit-body">${body}</span>`;
    const instance = new TypeIt(target, {
      speed: 18,
      waitUntilVisible: false,
      cursor: false,
      lifeLike: true,
      html: true,
    })
      .type(typedMarkup)
      .go() as TypeItInstance;

    typeInstances.set(slide, instance);
    typedSlides.add(slide);
  };

  const activateSlide = (slide: Element | null) => {
    if (!slide) {
      clearActiveTypeIt();
      return;
    }

    if (slide !== activeTypedSlide) {
      clearActiveTypeIt();
      activeTypedSlide = slide;
    }

    runTypeIt(slide);
  };

  const applyWordmarkMatrix = (wm: ResolvedWordmarkFocus) => {
    maskWordmark.setAttribute('transform', `matrix(${wm.scale},0,0,${wm.scale},${wm.x},${wm.y})`);
  };

  const setCleanWordmark = () => {
    const wm = resolveFocus(cleanFocus);
    applyWordmarkMatrix(wm);
  };

  const setPhaseActive = (phaseIndex: number, phases: PhaseDefinition[]) => {
    if (phaseIndex === activePhaseIndex) return;

    activePhaseIndex = phaseIndex;
    const phase = phases[phaseIndex];
    activateSlide(phase?.kind === 'story' ? phase.slide ?? null : null);
  };

  const getNearestPhaseIndex = (progress: number, totalPhases: number) =>
    Math.max(0, Math.min(totalPhases - 1, Math.round(progress * (totalPhases - 1))));

  const setPhaseVisualState = (phase: PhaseDefinition) => {
    const wm = resolveFocus(phase.focus);
    const activeImage = phase.kind === 'story' ? document.querySelector(phase.image ?? '') : null;
    const inactiveImages = activeImage
      ? maskedImages.filter((image) => image !== activeImage)
      : maskedImages;
    const inactiveSlides = phase.slide
      ? slides.filter((slide) => slide !== phase.slide)
      : slides;

    if (phase.kind === 'clean') {
      applyWordmarkMatrix(wm);
    } else {
      gsap.set(maskWordmark, {
        scale: wm.scale,
        x: wm.x,
        y: wm.y,
        transformOrigin: '0px 0px',
        force3D: true,
      });
    }
    gsap.set(stageBg, { opacity: phase.kind === 'clean' ? 1 : 0 });
    gsap.set(inactiveImages, { opacity: 0, filter: 'blur(14px)' });
    gsap.set(inactiveSlides, { opacity: 0, y: 18, pointerEvents: 'none' });

    if (phase.kind === 'story' && phase.image && phase.slide && phase.imageTransform) {
      gsap.set(phase.image, {
        opacity: 1,
        filter: 'blur(0px)',
        scale: phase.imageTransform.scale,
        xPercent: phase.imageTransform.xPercent,
        yPercent: phase.imageTransform.yPercent,
      });
      gsap.set(phase.slide, { opacity: 1, y: 0, pointerEvents: 'auto' });
    }
  };

  slides.forEach(resetTypeTarget);

  gsap.set(maskedImages, {
    opacity: 0,
    filter: 'blur(14px)',
    scale: 1,
    xPercent: 0,
    yPercent: 0,
    transformOrigin: '50% 50%',
    force3D: true,
  });
  gsap.set(stageBg, { opacity: 1 });
  gsap.set(slides, { opacity: 0, y: 18, pointerEvents: 'none' });
  setCleanWordmark();

  let tl: gsap.core.Timeline | null = null;
  let removeEndpointScrollListener: (() => void) | null = null;

  const buildTimeline = () => {
    if (tl) tl.kill();
    removeEndpointScrollListener?.();
    removeEndpointScrollListener = null;
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    activePhaseIndex = -1;
    clearActiveTypeIt();
    slides.forEach(resetTypeTarget);

    const phases = buildPhases();
    const totalDuration = phases.length - 1;

    setPhaseVisualState(phases[0]);

    const settleCleanEndpoint = (progress: number) => {
      const nearestIndex = getNearestPhaseIndex(progress, phases.length);
      if (nearestIndex === 0 || nearestIndex === phases.length - 1) {
        setPhaseVisualState(phases[nearestIndex]);
      }
    };
    let endpointSettleTimer = 0;
    const queueEndpointSettle = () => {
      window.clearTimeout(endpointSettleTimer);
      endpointSettleTimer = window.setTimeout(() => {
        const start = scrollSection.offsetTop;
        const end = start + scrollSection.offsetHeight - window.innerHeight;
        const progress = (window.scrollY - start) / Math.max(1, end - start);

        if (progress <= 0.045 || progress >= 0.955) {
          settleCleanEndpoint(progress);
        }
      }, 760);
    };

    window.addEventListener('scroll', queueEndpointSettle, { passive: true });
    removeEndpointScrollListener = () => {
      window.clearTimeout(endpointSettleTimer);
      window.removeEventListener('scroll', queueEndpointSettle);
    };

    tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scrollSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.62,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nearestIndex = getNearestPhaseIndex(self.progress, phases.length);
          const exactProgress = nearestIndex / (phases.length - 1);

          if (Math.abs(self.progress - exactProgress) < 0.045) {
            setPhaseActive(nearestIndex, phases);
            if (nearestIndex === 0 || nearestIndex === phases.length - 1) {
              setPhaseVisualState(phases[nearestIndex]);
            }
          }
        },
        onScrubComplete: (self) => settleCleanEndpoint(self.progress),
        onSnapComplete: (self) => settleCleanEndpoint(self.progress),
        snap: {
          snapTo: SNAP_POINTS,
          duration: { min: 0.24, max: 0.7 },
          delay: 0.16,
          ease: 'power3.out',
        },
      },
    });

    phases.slice(1).forEach((phase, index) => {
      const position = index * PHASE_SPACING + HOLD_EXIT_OFFSET;
      const wm = resolveFocus(phase.focus);
      const activeImage = phase.kind === 'story' ? document.querySelector(phase.image ?? '') : null;
      const inactiveImages = activeImage
        ? maskedImages.filter((image) => image !== activeImage)
        : maskedImages;
      const inactiveSlides = phase.slide
        ? slides.filter((slide) => slide !== phase.slide)
        : slides;

      tl!
        .to(maskWordmark, {
          scale: wm.scale,
          x: wm.x,
          y: wm.y,
          duration: TRANSITION_DURATION,
          ease: 'power1.inOut',
        }, position)
        .to(stageBg, {
          opacity: phase.kind === 'clean' ? 1 : 0,
          duration: TRANSITION_DURATION * 0.82,
          ease: 'power1.inOut',
        }, position)
        .to(inactiveImages, {
          opacity: 0,
          filter: 'blur(14px)',
          duration: TRANSITION_DURATION * 0.7,
          ease: 'power2.inOut',
        }, position)
        .to(inactiveSlides, {
          opacity: 0,
          y: phase.kind === 'clean' ? 18 : -12,
          pointerEvents: 'none',
          duration: TRANSITION_DURATION * 0.58,
          ease: 'power2.inOut',
        }, position);

      if (phase.kind === 'story' && phase.image && phase.slide && phase.imageTransform) {
        tl!
          .to(phase.image, {
            opacity: 1,
            filter: 'blur(0px)',
            scale: phase.imageTransform.scale,
            xPercent: phase.imageTransform.xPercent,
            yPercent: phase.imageTransform.yPercent,
            duration: TRANSITION_DURATION * 0.9,
            ease: 'power2.out',
          }, position + 0.08)
          .to(phase.slide, {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: TRANSITION_DURATION * 0.75,
            ease: 'power2.out',
          }, position + 0.16);
      }
    });

    const finalPhase = phases[phases.length - 1];
    const finalWm = resolveFocus(finalPhase.focus);

    tl
      .call(() => applyWordmarkMatrix(finalWm), [], totalDuration)
      .set(stageBg, { opacity: 1 }, totalDuration)
      .set(maskedImages, { opacity: 0, filter: 'blur(14px)' }, totalDuration)
      .set(slides, { opacity: 0, y: 18, pointerEvents: 'none' }, totalDuration);

    tl.to({}, { duration: 0.01 }, totalDuration);
  };

  if (reducedMotion) {
    setCleanWordmark();
    gsap.set(maskedImages, { opacity: 0 });
    gsap.set(slides, { opacity: 0, pointerEvents: 'none' });
    gsap.set(stageBg, { opacity: 1 });

    const handleResizeReduced = () => setCleanWordmark();

    window.addEventListener('resize', handleResizeReduced);
    document.addEventListener('astro:before-swap', () => {
      window.removeEventListener('resize', handleResizeReduced);
      slides.forEach(destroyTypeInstance);
    }, { once: true });
  } else {
    buildTimeline();

    const handleResize = () => {
      setCleanWordmark();
      buildTimeline();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('astro:before-swap', () => {
      window.removeEventListener('resize', handleResize);
      removeEndpointScrollListener?.();
      removeEndpointScrollListener = null;
      slides.forEach(destroyTypeInstance);
      clearActiveTypeIt();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl?.kill();
    }, { once: true });
  }
}
