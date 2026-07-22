import React from 'react';
import LogoLoop from './LogoLoop';

export default function SponsorLogoLoop({ logos = [] }) {
  return (
    <div className="w-full relative overflow-hidden flex items-center justify-center">
      <LogoLoop
        logos={logos}
        speed={120}
        direction="left"
        logoHeight={120}
        gap={60}
        hoverSpeed={20}
        fadeOut
        fadeOutColor="#0a0a0a"
        scaleOnHover
        ariaLabel="Platinum sponsor logos"
      />
    </div>
  );
}
