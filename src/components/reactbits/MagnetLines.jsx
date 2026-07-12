import { useRef, useEffect } from 'react';

const interpolateColor = (color1, color2, factor) => {
  const parseHex = (hex) => {
    const c = hex.replace('#', '');
    return {
      r: parseInt(c.substring(0, 2), 16),
      g: parseInt(c.substring(2, 4), 16),
      b: parseInt(c.substring(4, 6), 16),
    };
  };
  const c1 = parseHex(color1);
  const c2 = parseHex(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return `rgb(${r}, ${g}, ${b})`;
};

export default function MagnetLines({
  rows = 9,
  columns = 9,
  containerSize = '80vmin',
  lineColor = '#efefef',
  lineWidth = '1vmin',
  lineHeight = '6vmin',
  baseAngle = -10,
  safeInset = '8%',
  className = '',
  style = {},
  gradientColors = null
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('[data-magnet-line]');

    const onPointerMove = pointer => {
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        const b = pointer.x - centerX;
        const a = pointer.y - centerY;
        const c = Math.sqrt(a * a + b * b) || 1;
        const r = ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > centerY ? 1 : -1);

        item.style.setProperty('--rotate', `${r}deg`);
      });
    };

    window.addEventListener('pointermove', onPointerMove);

    if (items.length) {
      const middleIndex = Math.floor(items.length / 2);
      const rect = items[middleIndex].getBoundingClientRect();
      onPointerMove({ x: rect.x, y: rect.y });
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [rows, columns]);

  const total = rows * columns;
  const spans = Array.from({ length: total }, (_, i) => {
    let currentLineColor = lineColor;
    if (gradientColors && gradientColors.length >= 2) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const maxDist = (rows - 1) + (columns - 1);
      const factor = maxDist > 0 ? (row + col) / maxDist : 0;
      currentLineColor = interpolateColor(gradientColors[0], gradientColors[1], factor);
    }
    return (
      <span
        key={i}
        data-magnet-line
        className="block origin-center"
        style={{
          background: currentLineColor,
          width: lineWidth,
          height: lineHeight,
          maxWidth: '18%',
          maxHeight: '62%',
          '--rotate': `${baseAngle}deg`,
          transform: 'rotate(var(--rotate))',
          willChange: 'transform'
        }}
      />
    );
  });

  return (
    <div
      ref={containerRef}
      className={`grid place-items-center ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: containerSize || '100%',
        height: containerSize || '100%',
        padding: safeInset,
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {spans}
    </div>
  );
}
