import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
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

gsap.registerPlugin(ScrollTrigger, Observer);

const CHAPTER_TRANSITION_DURATION = 4.8;
const PHASE_SPACING = CHAPTER_TRANSITION_DURATION;
const CHAPTER_TRANSITION_EASE = 'power3.inOut';
const OBSERVER_TOLERANCE = 18;
const POST_TRANSITION_INPUT_COOLDOWN = 850;
const SCROLLBAR_PHASE_DEBOUNCE = 180;

const STORY_TO_STORY_TIMING = {
  fadeOutStart: 0,
  fadeOutDuration: 0.10,
  zoomOutStart: 0.10,
  zoomOutDuration: 0.34,
  zoomInStart: 0.58,
  zoomInDuration: 0.30,
  fadeInStart: 0.90,
  fadeInDuration: 0.10,
  slideFadeInOffset: 0.1,
  slideDurationRatio: 0.9,
};

const CLEAN_STORY_TIMING = {
  fadeOutStart: 0,
  fadeOutDuration: 0.15,
  zoomStart: 0.1,
  zoomDuration: 0.7,
  fadeInStart: 0.8,
  fadeInDuration: 0.15,
  slideFadeInOffset: 0.1,
  slideDurationRatio: 0.85,
};

const WORDMARK_BOUNDS = {
  x: 270,
  y: 70,
  width: 710,
  height: 105,
};

const cleanFocus: WordmarkFocus = {
  cx: 560,
  cy: 104,
  fillRatio: 0.2,
  maxWidthRatio: 0.68,
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
        focus: { cx: 640, cy: 21, fillRatio: 9 },
        imageTransform: { scale: 2.04, xPercent: 0, yPercent: 0 },
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

  const applyWordmarkTransform = (wm: ResolvedWordmarkFocus) => {
    maskWordmark.removeAttribute('transform');
    gsap.set(maskWordmark, {
      scale: wm.scale,
      x: wm.x,
      y: wm.y,
      transformOrigin: '0px 0px',
      force3D: true,
    });
  };

  const setCleanWordmark = () => applyWordmarkTransform(resolveFocus(cleanFocus));

  const setPhaseActive = (phaseIndex: number, phases: PhaseDefinition[]) => {
    if (phaseIndex === activePhaseIndex) return;
    activePhaseIndex = phaseIndex;
    const phase = phases[phaseIndex];
    activateSlide(phase?.kind === 'story' ? phase.slide ?? null : null);
  };

  const setPhaseVisualState = (phase: PhaseDefinition) => {
    const wm = resolveFocus(phase.focus);
    const activeImage = phase.kind === 'story' ? document.querySelector(phase.image ?? '') : null;
    const inactiveImages = activeImage
      ? maskedImages.filter((i) => i !== activeImage)
      : maskedImages;
    const inactiveSlides = phase.slide
      ? slides.filter((s) => s !== phase.slide)
      : slides;

    applyWordmarkTransform(wm);
    gsap.set(stageBg, { opacity: phase.kind === 'clean' ? 1 : 0 });
    gsap.set(inactiveImages, { opacity: 0, filter: 'blur(14px)' });
    gsap.set(inactiveSlides, { autoAlpha: 0, y: 18, pointerEvents: 'none' });

    if (phase.kind === 'story' && phase.image && phase.slide && phase.imageTransform) {
      gsap.set(phase.image, {
        opacity: 1, filter: 'blur(0px)',
        scale: phase.imageTransform.scale,
        xPercent: phase.imageTransform.xPercent,
        yPercent: phase.imageTransform.yPercent,
      });
      gsap.set(phase.slide, { autoAlpha: 1, y: 0, pointerEvents: 'auto' });
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
  gsap.set(slides, { autoAlpha: 0, y: 18, pointerEvents: 'none' });
  setCleanWordmark();

  let tl: gsap.core.Timeline | null = null;
  let pinTrigger: ScrollTrigger | null = null;
  let chapterObserver: Observer | null = null;
  let phaseTween: gsap.core.Tween | null = null;
  let activePhases: PhaseDefinition[] = [];
  let isTransitioning = false;
  let currentPhaseIndex = 0;
  let suppressInputUntil = 0;
  let scrollSyncTimer = 0;
  let ignoreScrollSync = false;

  const destroyTimeline = () => {
    phaseTween?.kill();
    phaseTween = null;
    chapterObserver?.kill();
    chapterObserver = null;
    pinTrigger?.kill();
    pinTrigger = null;
    tl?.scrollTrigger?.kill();
    tl?.kill();
    tl = null;
    isTransitioning = false;
    suppressInputUntil = 0;
    window.clearTimeout(scrollSyncTimer);
    ignoreScrollSync = false;
  };

  const clearTypingState = () => {
    slides.forEach(destroyTypeInstance);
    clearActiveTypeIt();
    slides.forEach(resetTypeTarget);
  };

  const buildTimeline = () => {
    destroyTimeline();
    activePhaseIndex = -1;
    clearTypingState();

    const phases = buildPhases();
    activePhases = phases;
    const totalDuration = (phases.length - 1) * PHASE_SPACING;

    setPhaseVisualState(phases[0]);
    setPhaseActive(0, phases);
    currentPhaseIndex = 0;

    tl = gsap.timeline({ paused: true, defaults: { ease: CHAPTER_TRANSITION_EASE } });
    phases.forEach((_, index) => tl!.add(`phase-${index}`, index * PHASE_SPACING));

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

      const transStart = segStart;
      const transLen = PHASE_SPACING;

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
        const s1 = transStart + transLen * STORY_TO_STORY_TIMING.fadeOutStart;
        const s1Dur = transLen * STORY_TO_STORY_TIMING.fadeOutDuration;

        // Zoom out
        const s2 = transStart + transLen * STORY_TO_STORY_TIMING.zoomOutStart;
        const s2Dur = transLen * STORY_TO_STORY_TIMING.zoomOutDuration;

        // Zoom in
        const s3 = transStart + transLen * STORY_TO_STORY_TIMING.zoomInStart;
        const s3Dur = transLen * STORY_TO_STORY_TIMING.zoomInDuration;

        // Fade in new
        const s4 = transStart + transLen * STORY_TO_STORY_TIMING.fadeInStart;
        const s4Dur = transLen * STORY_TO_STORY_TIMING.fadeInDuration;

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
            autoAlpha: 0,
            y: -16,
            pointerEvents: 'none',
            duration: s1Dur * STORY_TO_STORY_TIMING.slideDurationRatio,
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
        tl!.set(inactiveSlides, { autoAlpha: 0, y: 18, pointerEvents: 'none' }, s2);

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
          tl!.set(toSlide, { autoAlpha: 0, y: 20, pointerEvents: 'none' }, s3);
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
            autoAlpha: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: s4Dur * STORY_TO_STORY_TIMING.slideDurationRatio,
            ease: 'power2.out',
          }, s4 + s4Dur * STORY_TO_STORY_TIMING.slideFadeInOffset);
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

        const fadeOutStart = transStart + transLen * CLEAN_STORY_TIMING.fadeOutStart;
        const fadeOutDur = transLen * CLEAN_STORY_TIMING.fadeOutDuration;

        const zoomStart = transStart + transLen * CLEAN_STORY_TIMING.zoomStart;
        const zoomDur = transLen * CLEAN_STORY_TIMING.zoomDuration;

        const fadeInStart = transStart + transLen * CLEAN_STORY_TIMING.fadeInStart;
        const fadeInDur = transLen * CLEAN_STORY_TIMING.fadeInDuration;

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
            autoAlpha: 0,
            y: fromPhase.kind === 'story' ? -16 : 18,
            pointerEvents: 'none',
            duration: fadeOutDur * CLEAN_STORY_TIMING.slideDurationRatio,
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
        tl!.set(inactiveSlides, { autoAlpha: 0, y: 18, pointerEvents: 'none' }, zoomStart);

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
            autoAlpha: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: fadeInDur * CLEAN_STORY_TIMING.slideDurationRatio,
            ease: 'power2.out',
          }, fadeInStart + fadeInDur * CLEAN_STORY_TIMING.slideFadeInOffset);
        }
      }
    });

    /* Final settle */
    const finalPhase = phases[phases.length - 1];
    const finalWm = resolveFocus(finalPhase.focus);

    tl
      .call(() => applyWordmarkTransform(finalWm), [], totalDuration)
      .set(stageBg, { opacity: 1 }, totalDuration)
      .set(maskedImages, { opacity: 0, filter: 'blur(14px)' }, totalDuration)
      .set(slides, { autoAlpha: 0, y: 18, pointerEvents: 'none' }, totalDuration);

    tl.to({}, { duration: 0.01 }, totalDuration);
  };

  const setPhaseInstant = (phaseIndex: number) => {
    if (!tl || !activePhases.length) return;
    const safeIndex = Math.max(0, Math.min(activePhases.length - 1, phaseIndex));
    phaseTween?.kill();
    phaseTween = null;
    tl.pause(`phase-${safeIndex}`);
    currentPhaseIndex = safeIndex;
    isTransitioning = false;
    suppressInputUntil = 0;
    setPhaseVisualState(activePhases[safeIndex]);
    setPhaseActive(safeIndex, activePhases);
  };

  const releaseNativeScroll = (direction: 'forward' | 'backward') => {
    chapterObserver?.disable();
    isTransitioning = false;
    suppressInputUntil = 0;
    if (!pinTrigger) return;
    const top = direction === 'forward' ? pinTrigger.end + 2 : Math.max(0, pinTrigger.start - 2);
    ignoreScrollSync = true;
    window.scrollTo({ top, behavior: 'auto' });
    window.setTimeout(() => { ignoreScrollSync = false; }, SCROLLBAR_PHASE_DEBOUNCE);
  };

  const goToPhase = (phaseIndex: number) => {
    if (!tl || !activePhases.length || isTransitioning || Date.now() < suppressInputUntil) return;

    if (phaseIndex < 0) {
      releaseNativeScroll('backward');
      return;
    }

    if (phaseIndex >= activePhases.length) {
      releaseNativeScroll('forward');
      return;
    }

    if (phaseIndex === currentPhaseIndex) return;

    phaseTween?.kill();
    clearActiveTypeIt();
    isTransitioning = true;
    phaseTween = tl.tweenTo(`phase-${phaseIndex}`, {
      duration: CHAPTER_TRANSITION_DURATION,
      ease: CHAPTER_TRANSITION_EASE,
      onComplete: () => {
        currentPhaseIndex = phaseIndex;
        phaseTween = null;
        isTransitioning = false;
        suppressInputUntil = Date.now() + POST_TRANSITION_INPUT_COOLDOWN;
        setPhaseVisualState(activePhases[phaseIndex]);
        setPhaseActive(phaseIndex, activePhases);
      },
      onInterrupt: () => {
        phaseTween = null;
        isTransitioning = false;
      },
    });
  };

  const enableChapterControl = (entryPhase: number) => {
    setPhaseInstant(entryPhase);
    chapterObserver?.enable();
  };

  const getScrollPhaseIndex = () => {
    if (!pinTrigger || activePhases.length < 2) return currentPhaseIndex;
    const progress = (window.scrollY - pinTrigger.start) / Math.max(1, pinTrigger.end - pinTrigger.start);
    return Math.max(0, Math.min(activePhases.length - 1, Math.round(progress * (activePhases.length - 1))));
  };

  const syncPhaseFromScrollPosition = () => {
    if (!isInsidePinnedRange() || ignoreScrollSync || !activePhases.length) return;
    const phaseIndex = getScrollPhaseIndex();
    if (isTransitioning) {
      phaseTween?.kill();
      phaseTween = null;
      isTransitioning = false;
      suppressInputUntil = Date.now() + POST_TRANSITION_INPUT_COOLDOWN;
    }
    if (phaseIndex !== currentPhaseIndex) setPhaseInstant(phaseIndex);
    chapterObserver?.enable();
  };

  const queueScrollPhaseSync = () => {
    window.clearTimeout(scrollSyncTimer);
    scrollSyncTimer = window.setTimeout(syncPhaseFromScrollPosition, SCROLLBAR_PHASE_DEBOUNCE);
  };

  const isInsidePinnedRange = () => {
    if (pinTrigger?.isActive) return true;
    const rect = scrollSection.getBoundingClientRect();
    return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
  };

  const handleChapterKeydown = (event: KeyboardEvent) => {
    if (!isInsidePinnedRange()) return;

    const forwardKeys = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar']);
    const backwardKeys = new Set(['ArrowUp', 'PageUp']);
    const exitForwardKeys = new Set(['End']);
    const exitBackwardKeys = new Set(['Home']);

    if (forwardKeys.has(event.key)) {
      event.preventDefault();
      syncPhaseFromScrollPosition();
      chapterObserver?.enable();
      goToPhase(currentPhaseIndex + 1);
    } else if (backwardKeys.has(event.key)) {
      event.preventDefault();
      syncPhaseFromScrollPosition();
      chapterObserver?.enable();
      goToPhase(currentPhaseIndex - 1);
    } else if (exitForwardKeys.has(event.key)) {
      event.preventDefault();
      releaseNativeScroll('forward');
    } else if (exitBackwardKeys.has(event.key)) {
      event.preventDefault();
      releaseNativeScroll('backward');
    }
  };

  const createChapterController = () => {
    chapterObserver?.kill();
    pinTrigger?.kill();

    chapterObserver = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      preventDefault: true,
      tolerance: OBSERVER_TOLERANCE,
      wheelSpeed: -1,
      onUp: () => goToPhase(currentPhaseIndex + 1),
      onDown: () => goToPhase(currentPhaseIndex - 1),
    });
    chapterObserver.disable();

    pinTrigger = ScrollTrigger.create({
      trigger: scrollSection,
      start: 'top top',
      end: () => `+=${window.innerHeight * (activePhases.length + 1)}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => enableChapterControl(0),
      onEnterBack: () => enableChapterControl(activePhases.length - 1),
      onToggle: (self) => {
        if (self.isActive) queueScrollPhaseSync();
      },
      onUpdate: (self) => {
        if (self.isActive && !chapterObserver?.isEnabled) chapterObserver?.enable();
        if (self.isActive && !isTransitioning) queueScrollPhaseSync();
      },
      onLeave: () => chapterObserver?.disable(),
      onLeaveBack: () => chapterObserver?.disable(),
    });
  };

  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: reduce)', () => {
    destroyTimeline();
    setCleanWordmark();
    gsap.set(maskedImages, { opacity: 0 });
    gsap.set(slides, { autoAlpha: 0, pointerEvents: 'none' });
    gsap.set(stageBg, { opacity: 1 });

    const handleResizeReduced = () => setCleanWordmark();
    window.addEventListener('resize', handleResizeReduced);

    return () => {
      window.removeEventListener('resize', handleResizeReduced);
      clearTypingState();
    };
  });

  media.add('(prefers-reduced-motion: no-preference)', () => {
    buildTimeline();
    createChapterController();

    let resizeTimer = 0;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setCleanWordmark();
        buildTimeline();
        createChapterController();
        ScrollTrigger.refresh();
      }, 180);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleChapterKeydown);
    window.addEventListener('scroll', queueScrollPhaseSync, { passive: true });

    return () => {
      window.clearTimeout(resizeTimer);
      window.clearTimeout(scrollSyncTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleChapterKeydown);
      window.removeEventListener('scroll', queueScrollPhaseSync);
      destroyTimeline();
      clearTypingState();
    };
  });

  document.addEventListener('astro:before-swap', () => {
    media.revert();
    destroyTimeline();
    clearTypingState();
  }, { once: true });
}
