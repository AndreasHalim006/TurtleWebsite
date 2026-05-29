import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

export const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    // Use a slight delay to ensure fonts and layout are settled before calculating bounding boxes
    const initTimeout = setTimeout(() => {
        const split = SplitText.create(rootRef.current.querySelector('.scramble-target'), {
            type: 'chars',
            charsClass: 'inline-block will-change-transform'
        });

        split.chars.forEach(el => {
            const c = el;
            // Lock the width of each character to prevent layout jitter when scrambling
            gsap.set(c, { 
                width: c.getBoundingClientRect().width,
                textAlign: 'center',
                attr: { 'data-content': c.innerHTML } 
            });
        });

        const handleMove = e => {
            split.chars.forEach(el => {
                const c = el;
                const { left, top, width, height } = c.getBoundingClientRect();
                const dx = e.clientX - (left + width / 2);
                const dy = e.clientY - (top + height / 2);
                const dist = Math.hypot(dx, dy);

                if (dist < radius) {
                    gsap.to(c, {
                        overwrite: true,
                        duration: duration * (1 - dist / radius),
                        scrambleText: {
                            text: c.dataset.content || '',
                            chars: scrambleChars,
                            speed
                        },
                        ease: 'none'
                    });
                }
            });
        };

        const el = rootRef.current;
        el.addEventListener('pointermove', handleMove);

        return () => {
            el.removeEventListener('pointermove', handleMove);
            split.revert();
        };
    }, 100);

    return () => clearTimeout(initTimeout);

  }, [radius, duration, speed, scrambleChars]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={style}
    >
      <div className="scramble-target">{children}</div>
    </div>
  );
};

export default ScrambledText;