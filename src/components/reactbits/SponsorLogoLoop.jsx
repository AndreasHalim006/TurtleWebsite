import React from 'react';
import LogoLoop from './LogoLoop';

export default function SponsorLogoLoop({ logos = [] }) {
  const fittedLogos = React.useMemo(
    () =>
      logos.map((logo) => ({
        ...logo,
        ariaLabel: logo.alt || logo.name || 'Sponsor logo',
        node: (
          <div className="flex h-[84px] md:h-[96px] w-[160px] md:w-[195px] items-center justify-center pointer-events-auto">
            <div
              className="w-full h-full max-h-[64px] md:max-h-[76px] max-w-[145px] md:max-w-[180px] opacity-95 transition-transform duration-300 group-hover/item:scale-120 group-hover/item:opacity-100"
              style={{
                background: 'linear-gradient(to bottom, #9FFF10 0%, #00F3CB 100%)',
                WebkitMaskImage: `url("${logo.src}")`,
                maskImage: `url("${logo.src}")`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                filter: 'drop-shadow(0 0 4px rgba(159, 255, 16, 0.4))',
              }}
            />
          </div>
        ),
      })),
    [logos]
  );

  return (
    <div className="w-full relative overflow-hidden flex items-center justify-center">
      <LogoLoop
        logos={fittedLogos}
        speed={100}
        direction="left"
        logoHeight={84}
        gap={20}
        hoverSpeed={15}
        fadeOut
        fadeOutColor="#0a0a0a"
        scaleOnHover={true}
        ariaLabel="Platinum sponsor logos"
      />
    </div>
  );
}
