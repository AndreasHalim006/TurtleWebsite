import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const MagneticButton = ({ 
  children, 
  className = '', 
  strength = 0.4,
  labelStrength = 0.24,
  onClick 
}) => {
  const zoneRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const btn = btnRef.current;
    if (!zone || !btn) return;

    // Find label if it exists
    const label = btn.querySelector('.magnetic-label');

    const onMouseMove = (e) => {
      const rect = zone.getBoundingClientRect();
      const mapX = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
      const mapY = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

      gsap.to(btn, {
        x: mapX * strength,
        y: mapY * strength,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true
      });

      if (label) {
        gsap.to(label, {
          x: mapX * labelStrength,
          y: mapY * labelStrength,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true
        });
      }
    };

    const onMouseLeave = () => {
      const elasticEase = "elastic.out(1, 0.4)";
      
      gsap.to(btn, { 
        x: 0, 
        y: 0,
        duration: 0.7,
        ease: elasticEase,
        overwrite: true
      });

      if (label) {
        gsap.to(label, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: elasticEase,
          overwrite: true
        });
      }
    };

    zone.addEventListener("mousemove", onMouseMove);
    zone.addEventListener("mouseleave", onMouseLeave);

    return () => {
      zone.removeEventListener("mousemove", onMouseMove);
      zone.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [strength, labelStrength]);

  return (
    <div 
      ref={zoneRef} 
      className={`relative flex items-center justify-center cursor-pointer ${className}`}
      style={{ width: '100%', height: '100%' }}
      onClick={onClick}
    >
      <div ref={btnRef} className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default MagneticButton;