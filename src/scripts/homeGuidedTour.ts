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

/*
 * HOLD: portion at the start of each segment where the current phase
 * stays fully visible (reading time). Transition begins after this.
 */
const HOLD = 0.15;

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

const getWideFillRatio = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const portrait = height > width;

  if (width < 520) return 0.38;
  if (portrait) return 0.42;
  return 0.48;
};

const getMidFillRatio = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const portrait = height > width;

  if (width < 520) return 0.52;
  if (portrait) return 0.58;
  return 0.68;
};

const getWordmarkBounds = (measureBounds = false) => {
  if (measureBounds && maskWordmark instanceof SVGGraphicsElement) {
    const bbox = maskWordmark.getBBox();
    return { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height };
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
const slides = [slide1, slide2, slide3, slide4].filter((s): s is Element => s !== null);

if (scrollSection && stageBg && maskWordmark) {
  const typeInstances = new Map<Element, TypeItInstance>();
  const typedSlides = new Set<Element>();
  let activeTypedSlide: Element | null = null;
  let activePhaseIndex = -1;

  const buildPhases = (): PhaseDefinition[] => {
    const wideFillRatio = getWideFillRatio();

    return [
      { kind: 'clean', focus: cleanFocus },
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
      { kind: 'clean', focus: cleanFocus },
    ];
  };

  const resetTypeTarget = (slide: Element) => {
    const t = slide.querySelector<HTMLElement>('[data-typeit-copy]');
    if (t) t.textContent = '';
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
    if (!slide) { clearActiveTypeIt(); return; }
    if (slide !== activeTypedSlide) { clearActiveTypeIt(); activeTypedSlide = slide; }
    runTypeIt(slide);
  };

  const applyWordmarkMatrix = (wm: ResolvedWordmarkFocus) => {
    maskWordmark.setAttribute('transform', `matrix(${wm.scale},0,0,${wm.scale},${wm.x},${wm.y})`);
  };

  const setCleanWordmark = () => applyWordmarkMatrix(resolveFocus(cleanFocus));

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
      ? maskedImages.filter((i) => i !== activeImage)
      : maskedImages;
    const inactiveSlides = phase.slide
      ? slides.filter((s) => s !== phase.slide)
      : slides;

    if (phase.kind === 'clean') {
      applyWordmarkMatrix(wm);
    } else {
      gsap.set(maskWordmark, {
        scale: wm.scale, x: wm.x, y: wm.y,
        transformOrigin: '0px 0px', force3D: true,
      });
    }
    gsap.set(stageBg, { opacity: phase.kind === 'clean' ? 1 : 0 });
    gsap.set(inactiveImages, { opacity: 0, filter: 'blur(14px)' });
    gsap.set(inactiveSlides, { opacity: 0, y: 18, pointerEvents: 'none' });

    if (phase.kind === 'story' && phase.image && phase.slide && phase.imageTransform) {
      gsap.set(phase.image, {
        opacity: 1, filter: 'blur(0px)',
        scale: phase.imageTransform.scale,
        xPercent: phase.imageTransform.xPercent,
        yPercent: phase.imageTransform.yPercent,
      });
      gsap.set(phase.slide, { opacity: 1, y: 0, pointerEvents: 'auto' });
    }
  };

  const computeMidFocus = (from: PhaseDefinition, to: PhaseDefinition): WordmarkFocus => {
    if (from.kind === 'clean' || to.kind === 'clean') return cleanFocus;

    const bounds = getWordmarkBounds(false);
    const fromCx = from.focus.cx ?? bounds.x + bounds.width / 2;
    const fromCy = from.focus.cy ?? bounds.y + bounds.height / 2;
    const toCx = to.focus.cx ?? bounds.x + bounds.width / 2;
    const toCy = to.focus.cy ?? bounds.y + bounds.height / 2;

    return {
      cx: (fromCx + toCx) / 2,
      cy: (fromCy + toCy) / 2,
      fillRatio: getMidFillRatio(),
      maxWidthRatio: 0.92,
    };
  };

  slides.forEach(resetTypeTarget);
  gsap.set(maskedImages, {
    opacity: 0, filter: 'blur(14px)',
    scale: 1, xPercent: 0, yPercent: 0,
    transformOrigin: '50% 50%', force3D: true,
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
    ScrollTrigger.getAll().forEach((t) => t.kill());

    activePhaseIndex = -1;
    clearActiveTypeIt();
    slides.forEach(resetTypeTarget);

    const phases = buildPhases();
    const totalDuration = (phases.length - 1) * PHASE_SPACING;

    setPhaseVisualState(phases[0]);

    const settleCleanEndpoint = (progress: number) => {
      const idx = getNearestPhaseIndex(progress, phases.length);
      if (idx === 0 || idx === phases.length - 1) setPhaseVisualState(phases[idx]);
    };
    let endpointSettleTimer = 0;
    const queueEndpointSettle = () => {
      window.clearTimeout(endpointSettleTimer);
      endpointSettleTimer = window.setTimeout(() => {
        const start = scrollSection.offsetTop;
        const end = start + scrollSection.offsetHeight - window.innerHeight;
        const p = (window.scrollY - start) / Math.max(1, end - start);
        if (p <= 0.045 || p >= 0.955) settleCleanEndpoint(p);
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
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = getNearestPhaseIndex(self.progress, phases.length);
          const exact = idx / (phases.length - 1);
          if (Math.abs(self.progress - exact) < 0.045) {
            setPhaseActive(idx, phases);
            if (idx === 0 || idx === phases.length - 1) setPhaseVisualState(phases[idx]);
          }
        },
        onScrubComplete: (self) => settleCleanEndpoint(self.progress),
        onSnapComplete: (self) => settleCleanEndpoint(self.progress),
        snap: {
          snapTo: SNAP_POINTS,
          duration: { min: 0.3, max: 0.9 },
          delay: 0.2,
          ease: 'power3.out',
        },
      },
    });

    phases.slice(1).forEach((toPhase, index) => {
      const fromPhase = phases[index];
      const segStart = index * PHASE_SPACING;

      const toWm = resolveFocus(toPhase.focus);

      const toImage = toPhase.kind === 'story' ? document.querySelector(toPhase.image ?? '') : null;
      const toSlide = toPhase.kind === 'story' ? toPhase.slide ?? null : null;
      const fromImage = fromPhase.kind === 'story' ? document.querySelector(fromPhase.image ?? '') : null;
      const fromSlide = fromPhase.kind === 'story' ? fromPhase.slide ?? null : null;

      const inactiveImages = toImage ? maskedImages.filter((i) => i !== toImage) : maskedImages;
      const inactiveSlides = toSlide ? slides.filter((s) => s !== toSlide) : slides;

      const isStoryToStory = fromPhase.kind === 'story' && toPhase.kind === 'story';

      const transStart = segStart + HOLD;
      const transLen = PHASE_SPACING - HOLD;

      if (isStoryToStory) {
        /*
         * ── CINEMATIC STORY → STORY ──
         *
         * 4 steps across the transition window:
         *
         *  0%  – 12%   Step 1: Fade out image & text → white
         * 12%  – 48%   Step 2: Zoom out to mid-breathe (white bg)
         * 48%  – 84%   Step 3: Zoom in to next position (still white)
         * 84%  – 96%   Step 4: Fade in new image & text
         * 96%  – 100%  Settle
         *
         * The zoom steps get 36% each = large slow sweeps.
         * The fades are quick 12% bookends.
         */

        const midFocus = computeMidFocus(fromPhase, toPhase);
        const midWm = resolveFocus(midFocus);

        // Fade out old
        const s1 = transStart;
        const s1Dur = transLen * 0.12;

        // Zoom out
        const s2 = transStart + transLen * 0.12;
        const s2Dur = transLen * 0.36;

        // Zoom in
        const s3 = transStart + transLen * 0.48;
        const s3Dur = transLen * 0.36;

        // Fade in new
        const s4 = transStart + transLen * 0.84;
        const s4Dur = transLen * 0.12;

        /* ── Step 1: fade out outgoing ── */
        if (fromImage) {
          tl!.to(fromImage, {
            opacity: 0,
            filter: 'blur(12px)',
            duration: s1Dur,
            ease: 'power2.in',
          }, s1);
        }
        if (fromSlide) {
          tl!.to(fromSlide, {
            opacity: 0,
            y: -16,
            pointerEvents: 'none',
            duration: s1Dur * 0.9,
            ease: 'power2.in',
          }, s1);
        }
        tl!.to(stageBg, {
          opacity: 1,
          duration: s1Dur,
          ease: 'power1.inOut',
        }, s1);

        /* ── Step 2: zoom out to midpoint ── */
        tl!.to(maskWordmark, {
          scale: midWm.scale,
          x: midWm.x,
          y: midWm.y,
          duration: s2Dur,
          ease: 'power1.inOut',
          transformOrigin: '0px 0px',
          force3D: true,
        }, s2);

        // Ensure all images hidden during zoom
        tl!.set(inactiveImages, { opacity: 0, filter: 'blur(14px)' }, s2);
        if (fromImage) {
          tl!.set(fromImage, { opacity: 0, filter: 'blur(14px)' }, s2);
        }
        tl!.set(inactiveSlides, { opacity: 0, y: 18, pointerEvents: 'none' }, s2);

        /* ── Step 3: zoom in to next position ── */
        tl!.to(maskWordmark, {
          scale: toWm.scale,
          x: toWm.x,
          y: toWm.y,
          duration: s3Dur,
          ease: 'power1.inOut',
          transformOrigin: '0px 0px',
          force3D: true,
        }, s3);

        // Pre-position incoming image (hidden)
        if (toImage && toPhase.imageTransform) {
          tl!.set(toImage, {
            opacity: 0,
            filter: 'blur(12px)',
            scale: toPhase.imageTransform.scale,
            xPercent: toPhase.imageTransform.xPercent,
            yPercent: toPhase.imageTransform.yPercent,
          }, s3);
        }
        if (toSlide) {
          tl!.set(toSlide, { opacity: 0, y: 20, pointerEvents: 'none' }, s3);
        }

        /* ── Step 4: fade in incoming ── */
        tl!.to(stageBg, {
          opacity: 0,
          duration: s4Dur,
          ease: 'power1.inOut',
        }, s4);

        if (toImage) {
          tl!.to(toImage, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: s4Dur,
            ease: 'power2.out',
          }, s4);
        }
        if (toSlide) {
          tl!.to(toSlide, {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: s4Dur * 0.9,
            ease: 'power2.out',
          }, s4 + s4Dur * 0.1);
        }

      } else {
        /*
         * ── CLEAN ↔ STORY ──
         *
         * 3-step transition:
         *  0%  – 15%   Fade out outgoing
         * 10%  – 80%   Zoom (long, slow sweep)
         * 80%  – 95%   Fade in incoming
         * 95%  – 100%  Settle
         */

        const fadeOutStart = transStart;
        const fadeOutDur = transLen * 0.15;

        const zoomStart = transStart + transLen * 0.10;
        const zoomDur = transLen * 0.70;

        const fadeInStart = transStart + transLen * 0.80;
        const fadeInDur = transLen * 0.15;

        /* Fade out outgoing */
        if (fromImage) {
          tl!.to(fromImage, {
            opacity: 0,
            filter: 'blur(12px)',
            duration: fadeOutDur,
            ease: 'power2.in',
          }, fadeOutStart);
        }
        if (fromSlide) {
          tl!.to(fromSlide, {
            opacity: 0,
            y: fromPhase.kind === 'story' ? -16 : 18,
            pointerEvents: 'none',
            duration: fadeOutDur * 0.85,
            ease: 'power2.in',
          }, fadeOutStart);
        }

        if (toPhase.kind === 'clean') {
          tl!.to(stageBg, {
            opacity: 1,
            duration: fadeOutDur,
            ease: 'power1.inOut',
          }, fadeOutStart);
        }

        /* Hide inactive */
        tl!.set(inactiveImages, { opacity: 0, filter: 'blur(14px)' }, zoomStart);
        tl!.set(inactiveSlides, { opacity: 0, y: 18, pointerEvents: 'none' }, zoomStart);

        /* Zoom */
        tl!.to(maskWordmark, {
          scale: toWm.scale,
          x: toWm.x,
          y: toWm.y,
          duration: zoomDur,
          ease: 'power1.inOut',
          transformOrigin: '0px 0px',
          force3D: true,
        }, zoomStart);

        /* Pre-position incoming */
        if (toImage && toPhase.imageTransform) {
          tl!.set(toImage, {
            opacity: 0,
            filter: 'blur(12px)',
            scale: toPhase.imageTransform.scale,
            xPercent: toPhase.imageTransform.xPercent,
            yPercent: toPhase.imageTransform.yPercent,
          }, zoomStart);
        }

        /* Fade in incoming */
        if (toPhase.kind === 'story') {
          tl!.to(stageBg, {
            opacity: 0,
            duration: fadeInDur,
            ease: 'power1.inOut',
          }, fadeInStart);
        }

        if (toImage) {
          tl!.to(toImage, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: fadeInDur,
            ease: 'power2.out',
          }, fadeInStart);
        }
        if (toSlide) {
          tl!.to(toSlide, {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: fadeInDur * 0.85,
            ease: 'power2.out',
          }, fadeInStart + fadeInDur * 0.1);
        }
      }
    });

    /* Final settle */
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
      ScrollTrigger.getAll().forEach((t) => t.kill());
      tl?.kill();
    }, { once: true });
  }
}