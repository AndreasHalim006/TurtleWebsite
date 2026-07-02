import React from 'react';
import LogoLoop from './LogoLoop';

const sponsorLogos = [
  { src: "https://aristurtle.gr/wp-content/uploads/2024/05/Protergia_logo_RGB_Protergia_Orange-1.png", alt: "Protergia", href: "https://www.protergia.gr/" },
  { src: "https://aristurtle.gr/wp-content/uploads/2020/11/Plat-02-e1774556245979.png", alt: "dSPACE", href: "https://www.dspace.com/" },
  { src: "https://aristurtle.gr/wp-content/uploads/2024/05/Protergia_logo_RGB_Protergia_Orange-1.png", alt: "Protergia", href: "https://www.protergia.gr/" },
  { src: "https://aristurtle.gr/wp-content/uploads/2020/11/Plat-04-e1774556302438.png", alt: "JAMSport", href: "https://www.facebook.com/JAMSport-Suspension-Systems-458932950963959/" },
  { src: "https://aristurtle.gr/wp-content/uploads/2024/05/Protergia_logo_RGB_Protergia_Orange-1.png", alt: "Protergia", href: "https://www.protergia.gr/" },
  { src: "https://aristurtle.gr/wp-content/uploads/2026/03/Sensoric_Solutions_logo-e1774556181747.png", alt: "Sensoric Solutions", href: "https://www.sensoric-solutions.com" },
  { src: "https://aristurtle.gr/wp-content/uploads/2024/05/Protergia_logo_RGB_Protergia_Orange-1.png", alt: "Protergia", href: "https://www.protergia.gr/" },
  { src: "https://aristurtle.gr/wp-content/uploads/2023/02/ey-e1774556330715.png", alt: "EY", href: "https://www.ey.com/el_gr" },
];

export default function SponsorLogoLoop() {
  return (
    <div className="w-full relative overflow-hidden flex items-center justify-center">
      <LogoLoop
        logos={sponsorLogos}
        speed={120}
        direction="left"
        logoHeight={120}
        gap={60}
        hoverSpeed={20}
        fadeOut
        fadeOutColor="#0a0a0a"
        scaleOnHover
        ariaLabel="Sponsor logos"
      />
    </div>
  );
}
