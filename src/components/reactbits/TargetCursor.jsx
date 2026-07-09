import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

const TargetCursor = ({
  targetSelector = '.grid-link',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}) => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef(null);
  const tickerFnRef = useRef(null);
  const activeStrengthRef = useRef(0);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const isSmallScreen = window.innerWidth <= 768;
    const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return isSmallScreen || hasCoarsePointer || hasTouchScreen || isMobileUserAgent || prefersReducedMotion;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 2,
      cornerSize: 10,
      idleDist: 30
    }),
    []
  );

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;

    const cleanupTarget = target => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    const startIdleSpin = () => {
      if (!ringRef.current) return;
      gsap.killTweensOf(ringRef.current, 'rotation');
      const currentRot = gsap.getProperty(ringRef.current, "rotation") || 0;
      const normalizedRot = currentRot % 360;
      gsap.set(ringRef.current, { rotation: normalizedRot });
      gsap.to(ringRef.current, {
          rotation: normalizedRot + 360,
          duration: spinDuration,
          ease: "none",
          repeat: -1
      });
    };

    // Set initial idle positions for all 6 corners
    const setIdleFormation = () => {
        if (!cornersRef.current) return;
        const corners = Array.from(cornersRef.current);
        const { idleDist } = constants;
        corners.forEach((corner, i) => {
            const angle = (i * Math.PI * 2) / 6;
            const idleRotation = (i * 60 + 180) % 360; // Perfectly outward
            gsap.set(corner, {
                x: Math.cos(angle) * idleDist,
                y: Math.sin(angle) * idleDist,
                rotation: idleRotation
            });
        });
    };

    setIdleFormation();
    startIdleSpin();

    const tickerFn = () => {
      if (!cursorRef.current || !cornersRef.current) {
        return;
      }
      
      const strength = activeStrengthRef.current;
      if (strength === 0) return;

      // DYNAMICALLY RECALCULATE TARGET BOUNDS (Edge Case Fix for animating targets)
      if (activeTarget && isActiveRef.current) {
          const rect = activeTarget.getBoundingClientRect();
          const offset = 8;
          
          const targetRingRot = Math.round((gsap.getProperty(ringRef.current, "rotation") || 0) / 60) * 60;
          const shift = Math.round(targetRingRot / 60);

          const orderedTargets = [
            { x: rect.right + offset, y: rect.top + rect.height * 0.5 }, // 0: Mid-Right
            { x: rect.left + rect.width * 0.75 + offset, y: rect.bottom + offset }, // 60: Bot-Right
            { x: rect.left + rect.width * 0.25 - offset, y: rect.bottom + offset }, // 120: Bot-Left
            { x: rect.left - offset, y: rect.top + rect.height * 0.5 }, // 180: Mid-Left
            { x: rect.left + rect.width * 0.25 - offset, y: rect.top - offset }, // 240: Top-Left
            { x: rect.left + rect.width * 0.75 + offset, y: rect.top - offset } // 300: Top-Right
          ];
    
          const mappedTargets = [];
          for (let i = 0; i < 6; i++) {
             const targetIndex = (((i + shift) % 6) + 6) % 6;
             mappedTargets.push(orderedTargets[targetIndex]);
          }
          targetCornerPositionsRef.current = mappedTargets;
      }

      if (!targetCornerPositionsRef.current) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');
      const corners = Array.from(cornersRef.current);
      
      const ringRot = gsap.getProperty(ringRef.current, 'rotation') || 0;
      const ringRotRad = ringRot * (Math.PI / 180);
      const cosA = Math.cos(ringRotRad);
      const sinA = Math.sin(ringRotRad);
      
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');
        
        const dx = targetCornerPositionsRef.current[i].x - cursorX;
        const dy = targetCornerPositionsRef.current[i].y - cursorY;
        
        // Transform screen delta to ring's local coordinate system
        const targetLocalX = dx * cosA + dy * sinA;
        const targetLocalY = -dx * sinA + dy * cosA;
        
        const finalX = currentX + (targetLocalX - currentX) * strength;
        const finalY = currentY + (targetLocalY - currentY) * strength;

        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = e => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    let isHiddenByMenu = false;
    const menuHoverHandler = (e) => {
      const isOverMenu = e.target.closest('#main-nav, .sm-scope, .staggered-menu-panel, .sm-toggle');
      if (isOverMenu && !isHiddenByMenu) {
        isHiddenByMenu = true;
        gsap.to(cursorRef.current, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' });
        document.body.style.cursor = '';
      } else if (!isOverMenu && isHiddenByMenu) {
        isHiddenByMenu = false;
        gsap.to(cursorRef.current, { autoAlpha: 1, duration: 0.2, overwrite: 'auto' });
        if (hideDefaultCursor) document.body.style.cursor = 'none';
      }
    };
    window.addEventListener('mouseover', menuHoverHandler, { passive: true });

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = gsap.getProperty(cursorRef.current, 'x');
      const mouseY = gsap.getProperty(cursorRef.current, 'y');
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = e => {
      const target = e.target.closest(targetSelector);
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      
      // Stop idle ring spin and get precise current rotation from GSAP
      gsap.killTweensOf(ringRef.current, 'rotation');
      const currentRotDeg = gsap.getProperty(ringRef.current, "rotation") || 0;

      // Snap the ring to the nearest multiple of 60 degrees
      const targetRingRot = Math.round(currentRotDeg / 60) * 60;
      gsap.to(ringRef.current, { rotation: targetRingRot, duration: 0.2, ease: "power2.out" });

      const rect = target.getBoundingClientRect();
      const offset = 8; 

      // Ordered clockwise starting from 0 degrees (Mid-Right)
      const orderedTargets = [
        { x: rect.right + offset, y: rect.top + rect.height * 0.5 }, // 0: Mid-Right
        { x: rect.left + rect.width * 0.75 + offset, y: rect.bottom + offset }, // 60: Bot-Right
        { x: rect.left + rect.width * 0.25 - offset, y: rect.bottom + offset }, // 120: Bot-Left
        { x: rect.left - offset, y: rect.top + rect.height * 0.5 }, // 180: Mid-Left
        { x: rect.left + rect.width * 0.25 - offset, y: rect.top - offset }, // 240: Top-Left
        { x: rect.left + rect.width * 0.75 + offset, y: rect.top - offset } // 300: Top-Right
      ];

      const shift = Math.round(targetRingRot / 60);
      
      const mappedTargets = [];
      for (let i = 0; i < 6; i++) {
         const targetIndex = (((i + shift) % 6) + 6) % 6;
         mappedTargets.push(orderedTargets[targetIndex]);
      }

      targetCornerPositionsRef.current = mappedTargets;

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current);

      gsap.to(activeStrengthRef, { current: 1, duration: hoverDuration, ease: 'power2.out' });
      
      // We do not animate corner rotations. They stay firmly locked at their local angles.

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef, { current: 0, overwrite: true });
        activeTarget = null;
        
        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners);
          const { idleDist } = constants;
          
          const tl = gsap.timeline();
          corners.forEach((corner, i) => {
            const angle = (i * Math.PI * 2) / 6;
            tl.to(corner, { 
                x: Math.cos(angle) * idleDist, 
                y: Math.sin(angle) * idleDist, 
                duration: 0.3, 
                ease: 'power3.out' 
            }, 0);
          });
        }
        
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && ringRef.current) {
            startIdleSpin();
          }
          resumeTimeout = null;
        }, 50);
        cleanupTarget(target);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('mouseover', menuHoverHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current = 0;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999]"
      style={{ willChange: 'transform' }}
    >
      <div
        ref={dotRef}
        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-brand-orange rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_var(--color-brand-primary-1)]"
        style={{ willChange: 'transform' }}
      />

      <div
        ref={ringRef}
        className="target-cursor-ring absolute top-1/2 left-1/2 w-0 h-0"
        style={{ willChange: 'transform' }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="target-cursor-corner absolute top-1/2 left-1/2 w-6 h-6 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          >
                <svg viewBox="0 0 20 20" className="w-full h-full fill-none stroke-brand-orange stroke-[3]">
                    <path d="M12,3.1 L8,10 L12,16.9" style={{ filter: 'drop-shadow(0 0 5px var(--color-brand-primary-1))' }} />
                </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TargetCursor;
