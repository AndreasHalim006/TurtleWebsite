import React from 'react';

export default function SponsorLogoLoop({ logos = [] }) {
  if (!logos || logos.length === 0) return null;

  // Quadruple the logos array for seamless infinite looping
  const loopLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center select-none py-2">
      {/* Left/Right Gradient Fade Overlay */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10"></div>

      <div className="w-full flex overflow-hidden group">
        <div className="flex shrink-0 items-center gap-8 sm:gap-12 animate-sponsor-marquee group-hover:[animation-play-state:paused]">
          {loopLogos.map((logo, index) => {
            const content = (
              <div
                className="w-full h-full max-h-[36px] sm:max-h-[42px] max-w-[120px] sm:max-w-[145px] transition-all duration-300 group-hover:scale-110 opacity-90 hover:opacity-100"
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
                aria-label={logo.alt || 'Sponsor logo'}
              />
            );

            return (
              <div
                key={`${logo.src}-${index}`}
                className="shrink-0 flex items-center justify-center w-[130px] sm:w-[160px] h-[52px] px-2 py-1"
              >
                {logo.href ? (
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center"
                    aria-label={logo.alt || 'Sponsor link'}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes sponsor-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-sponsor-marquee {
          animation: sponsor-marquee 35s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
