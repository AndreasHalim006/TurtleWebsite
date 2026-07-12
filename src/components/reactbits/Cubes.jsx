import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
CustomEase.create('cubes-luxe', '0.16,1,0.3,1');

const Cubes = ({
  gridSize = 10,
  cubeSize,
  maxAngle = 45,
  radius = 3,
  easing = 'cubes-luxe',
  duration = { enter: 0.3, leave: 0.6 },
  cellGap,
  borderStyle = '1px solid #fff',
  faceColor = '#120F17',
  shadow = false,
  autoAnimate = true,
  rippleOnClick = true,
  rippleColor = '#fff',
  rippleSpeed = 2
}) => {
  const sceneRef = useRef(null);
  const rafRef = useRef(null);
  const idleTimerRef = useRef(null);
  const userActiveRef = useRef(false);
  const simPosRef = useRef({ x: 0, y: 0 });
  const simTargetRef = useRef({ x: 0, y: 0 });
  const simRAFRef = useRef(null);

  const colGap = typeof cellGap === 'number' ? `${cellGap}px` : cellGap?.col !== undefined ? `${cellGap.col}px` : '5%';
  const rowGap = typeof cellGap === 'number' ? `${cellGap}px` : cellGap?.row !== undefined ? `${cellGap.row}px` : '5%';
  const enterDur = duration.enter;
  const leaveDur = duration.leave;

  const tiltAt = useCallback(
    (rowCenter, colCenter) => {
      if (!sceneRef.current) return;
      sceneRef.current.querySelectorAll('.cube').forEach(cube => {
        const row = Number(cube.dataset.row);
        const col = Number(cube.dataset.col);
        const distance = Math.hypot(row - rowCenter, col - colCenter);
        if (distance <= radius) {
          const angle = (1 - distance / radius) * maxAngle;
          gsap.to(cube, {
            duration: enterDur,
            ease: easing,
            overwrite: true,
            rotateX: -angle,
            rotateY: angle
          });
        } else {
          gsap.to(cube, {
            duration: leaveDur,
            ease: easing,
            overwrite: true,
            rotateX: 0,
            rotateY: 0
          });
        }
      });
    },
    [radius, maxAngle, enterDur, leaveDur, easing]
  );

  const onPointerMove = useCallback(
    event => {
      if (!sceneRef.current) return;
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const rect = sceneRef.current.getBoundingClientRect();
      const colCenter = (event.clientX - rect.left) / (rect.width / gridSize);
      const rowCenter = (event.clientY - rect.top) / (rect.height / gridSize);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));
      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    },
    [gridSize, tiltAt]
  );

  const resetAll = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.querySelectorAll('.cube').forEach(cube => {
      gsap.to(cube, {
        duration: leaveDur,
        rotateX: 0,
        rotateY: 0,
        ease: easing
      });
    });
  }, [leaveDur, easing]);

  const onTouchMove = useCallback(
    event => {
      if (!sceneRef.current) return;
      event.preventDefault();
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const rect = sceneRef.current.getBoundingClientRect();
      const touch = event.touches[0];
      const colCenter = (touch.clientX - rect.left) / (rect.width / gridSize);
      const rowCenter = (touch.clientY - rect.top) / (rect.height / gridSize);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));
      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    },
    [gridSize, tiltAt]
  );

  const onClick = useCallback(
    event => {
      if (!rippleOnClick || !sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const colHit = Math.floor((event.clientX - rect.left) / (rect.width / gridSize));
      const rowHit = Math.floor((event.clientY - rect.top) / (rect.height / gridSize));
      const rings = {};

      sceneRef.current.querySelectorAll('.cube').forEach(cube => {
        const distance = Math.hypot(Number(cube.dataset.row) - rowHit, Number(cube.dataset.col) - colHit);
        const ring = Math.round(distance);
        if (!rings[ring]) rings[ring] = [];
        rings[ring].push(cube);
      });

      Object.keys(rings).map(Number).sort((a, b) => a - b).forEach(ring => {
        const delay = ring * (0.15 / rippleSpeed);
        const animationDuration = 0.3 / rippleSpeed;
        const faces = rings[ring].flatMap(cube => Array.from(cube.querySelectorAll('.cube-face')));
        gsap.to(faces, { backgroundColor: rippleColor, duration: animationDuration, delay, ease: easing });
        gsap.to(faces, {
          backgroundColor: faceColor,
          duration: animationDuration,
          delay: delay + animationDuration + (0.6 / rippleSpeed),
          ease: easing
        });
      });
    },
    [rippleOnClick, gridSize, faceColor, rippleColor, rippleSpeed, easing]
  );

  useEffect(() => {
    if (!autoAnimate || !sceneRef.current) return;
    simPosRef.current = { x: Math.random() * gridSize, y: Math.random() * gridSize };
    simTargetRef.current = { x: Math.random() * gridSize, y: Math.random() * gridSize };

    const loop = () => {
      if (!userActiveRef.current) {
        const position = simPosRef.current;
        const target = simTargetRef.current;
        position.x += (target.x - position.x) * 0.02;
        position.y += (target.y - position.y) * 0.02;
        tiltAt(position.y, position.x);
        if (Math.hypot(position.x - target.x, position.y - target.y) < 0.1) {
          simTargetRef.current = { x: Math.random() * gridSize, y: Math.random() * gridSize };
        }
      }
      simRAFRef.current = requestAnimationFrame(loop);
    };

    simRAFRef.current = requestAnimationFrame(loop);
    return () => {
      if (simRAFRef.current != null) cancelAnimationFrame(simRAFRef.current);
    };
  }, [autoAnimate, gridSize, tiltAt]);

  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;

    const onTouchStart = () => { userActiveRef.current = true; };
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerleave', resetAll);
    element.addEventListener('click', onClick);
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchend', resetAll, { passive: true });

    return () => {
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerleave', resetAll);
      element.removeEventListener('click', onClick);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', resetAll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [onPointerMove, resetAll, onClick, onTouchMove]);

  const cells = Array.from({ length: gridSize });
  const sceneStyle = {
    gridTemplateColumns: cubeSize ? `repeat(${gridSize}, ${cubeSize}px)` : `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: cubeSize ? `repeat(${gridSize}, ${cubeSize}px)` : `repeat(${gridSize}, 1fr)`,
    columnGap: colGap,
    rowGap,
    perspective: '99999999px',
    gridAutoRows: '1fr'
  };
  const wrapperStyle = {
    '--cube-face-border': borderStyle,
    '--cube-face-bg': faceColor,
    '--cube-face-shadow': shadow === true ? '0 0 6px rgba(0,0,0,.5)' : shadow || 'none',
    ...(cubeSize ? { width: `${gridSize * cubeSize}px`, height: `${gridSize * cubeSize}px` } : {})
  };

  return (
    <div className="relative w-full aspect-square" style={wrapperStyle}>
      <div ref={sceneRef} className="grid w-full h-full" style={sceneStyle}>
        {cells.map((_, row) =>
          cells.map((__, col) => (
            <div
              key={`${row}-${col}`}
              className="cube relative w-full h-full aspect-square [transform-style:preserve-3d]"
              data-row={row}
              data-col={col}
            >
              <span className="absolute pointer-events-none -inset-9" />
              {[
                'translateY(-50%) rotateX(90deg)',
                'translateY(50%) rotateX(-90deg)',
                'translateX(-50%) rotateY(-90deg)',
                'translateX(50%) rotateY(90deg)',
                'rotateY(-90deg) translateX(50%) rotateY(90deg)',
                'rotateY(90deg) translateX(-50%) rotateY(-90deg)'
              ].map(transform => (
                <div
                  key={transform}
                  className="cube-face absolute inset-0 flex items-center justify-center"
                  style={{
                    background: 'var(--cube-face-bg)',
                    border: 'var(--cube-face-border)',
                    boxShadow: 'var(--cube-face-shadow)',
                    transform
                  }}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cubes;
