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
        <div className="flex shrink-0 items-center gap-12 sm:gap-16 animate-sponsor-marquee group-hover:[animation-play-state:paused]">
          {loopLogos.map((logo, index) => {
            const content = (
              <img
                src={logo.src}
                alt={logo.alt || 'Sponsor logo'}
                title={logo.alt || ''}
                className="h-10 md:h-12 w-auto max-h-10 md:max-h-12 object-contain pointer-events-none filter brightness-0 invert opacity-85 hover:opacity-100 transition-all duration-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                loading="lazy"
                decoding="async"
                draggable={false}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            );

            return (
              <div
                key={`${logo.src}-${index}`}
                className="shrink-0 flex items-center justify-center px-2 py-1 transition-transform duration-300 hover:scale-110"
              >
                {logo.href ? (
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
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
