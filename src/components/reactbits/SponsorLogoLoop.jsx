import React from 'react';
import LogoLoop from './LogoLoop';

export default function SponsorLogoLoop({ logos = [] }) {
  const fittedLogos = React.useMemo(() => logos.map((logo) => ({
    ...logo,
    ariaLabel: logo.alt || logo.title || 'Sponsor logo',
    node: (
      <span className="flex h-[88px] w-[190px] items-center justify-center">
        <img
          className="block h-full w-full object-contain pointer-events-none [-webkit-user-drag:none]"
          src={logo.src}
          srcSet={logo.srcSet}
          sizes={logo.sizes}
          alt={logo.alt || ''}
          title={logo.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
      </span>
    ),
  })), [logos]);

  return (
    <div className="w-full relative overflow-hidden flex items-center justify-center">
      <LogoLoop
        logos={fittedLogos}
        speed={120}
        direction="left"
        logoHeight={88}
        gap={48}
        hoverSpeed={20}
        fadeOut
        fadeOutColor="#0a0a0a"
        scaleOnHover
        ariaLabel="Platinum sponsor logos"
      />
    </div>
  );
}
