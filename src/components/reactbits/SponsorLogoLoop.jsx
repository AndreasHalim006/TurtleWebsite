import React from 'react';
import LogoLoop from './LogoLoop';

export default function SponsorLogoLoop({ logos = [] }) {
  const fittedLogos = React.useMemo(
    () =>
      logos.map((logo) => ({
        ...logo,
        ariaLabel: logo.alt || logo.title || 'Sponsor logo',
        node: (
          <div className="flex h-[52px] w-[130px] md:w-[160px] items-center justify-center pointer-events-auto">
            <div
              className="w-full h-full max-h-[36px] md:max-h-[42px] max-w-[120px] md:max-w-[145px] transition-all duration-300 opacity-90 group-hover/item:opacity-100"
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
                filter: 'drop-shadow(0 0 3px rgba(159, 255, 16, 0.35))',
              }}
              title={logo.alt || ''}
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
        logoHeight={52}
        gap={40}
        hoverSpeed={15}
        fadeOut
        fadeOutColor="#0a0a0a"
        scaleOnHover
        ariaLabel="Platinum sponsor logos"
      />
    </div>
  );
}
