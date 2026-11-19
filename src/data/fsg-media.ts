import type { ImageMetadata } from 'astro';

// Curated selections from the complete, locally downloaded FSG26 keyword pool.
// All 117 source records and photographer credits: ./fsg-media-manifest.json.
// Keep each credit visible inside or close to its rendered photo.
import photoQVMwx2v from '../images/fsg26/QVMwx2v-20260814_22-43-05_1922_ocks.jpg';
import photokdnDS4v from '../images/fsg26/kdnDS4v-20260813_17-32-53_0456_grobe.jpg';
import photoMM9C8Cq from '../images/fsg26/MM9C8Cq-20260812_10-00-18_0108_Kai.jpg';
import photoHK4wcGw from '../images/fsg26/HK4wcGw-20260811_10-37-05_7497_lodholz.jpg';
import photo92CmSxr from '../images/fsg26/92CmSxr-20260815_18-05-27_6201_schiechtele.jpg';
import photo9kFBCNL from '../images/fsg26/9kFBCNL-20260811_15-26-36_6496_vanstokkom.jpg';
import photoVg69rRk from '../images/fsg26/Vg69rRk-20260815_21-41-19_0125_Kai.jpg';
import photoRT3bNRT from '../images/fsg26/RT3bNRT-20260815_11-21-39_0716_grobe.jpg';
import photoFQX6skc from '../images/fsg26/FQX6skc-20260813_11-50-47_1595_ernst.jpg';
import photodG5X3BC from '../images/fsg26/dG5X3BC-20260811_10-37-33_7505_lodholz.jpg';
import photokNghNgh from '../images/fsg26/kNghNgh-20260813_10-14-11_0097_Kai.jpg';
import photoQKqvtH5 from '../images/fsg26/QKqvtH5-20260812_16-08-08_9866_ocks.jpg';
import photoLJT745D from '../images/fsg26/LJT745D-20260815_17-39-49_9704_partenfelder.jpg';
import photokcmjT6h from '../images/fsg26/kcmjT6h-20260813_10-14-54_0097_Kai.jpg';

export interface FsgPhoto {
  image: ImageMetadata;
  alt: string;
  credit: string;
  source: string;
}

export const fsgCollectionUrl = 'https://media.formulastudent.de/keyword/GR%20Thessaloniki%20U;fsg26';

export const fsgPhotos = {
  hero: { image: photoQVMwx2v, alt: "Aristurtle car 111 racing between illuminated cones at Formula Student Germany 2026.", credit: "©FSG / Lilian Ocks", source: "https://media.formulastudent.de/2026/Hockenheim/20260814-Friday/i-QVMwx2v" },
  team: { image: photokdnDS4v, alt: "The Aristurtle team gathered around car 111 at Hockenheim in 2026.", credit: "©FSG / Axel Grobe", source: "https://media.formulastudent.de/2026/Hockenheim/20260813-Thursday/i-kdnDS4v" },
  teamwork: { image: photoMM9C8Cq, alt: "Team members and event officials examining the car in the FSG inspection tent.", credit: "©FSG / Shengkai Sun", source: "https://media.formulastudent.de/2026/Hockenheim/20260812-Wednesday/i-MM9C8Cq" },
  detail: { image: photoHK4wcGw, alt: "The open accumulator enclosure during technical inspection at Formula Student Germany 2026.", credit: "©FSG / Felix Lodholz", source: "https://media.formulastudent.de/2026/Hockenheim/20260811-Tuesday/i-HK4wcGw" },
  track: { image: photo92CmSxr, alt: "Aristurtle car 111 cornering between cones at Hockenheim.", credit: "©FSG / Natalie Schiechtele", source: "https://media.formulastudent.de/2026/Hockenheim/20260815-Saturday/i-92CmSxr" },
  paddock: { image: photo9kFBCNL, alt: "An Aristurtle driver seated in car 111 in the Hockenheim paddock.", credit: "©FSG / Ronja van Stokkom", source: "https://media.formulastudent.de/2026/Hockenheim/20260811-Tuesday/i-9kFBCNL" },
  celebration: { image: photoVg69rRk, alt: "Aristurtle team members on stage during the Formula Student Germany 2026 awards ceremony.", credit: "©FSG / Shengkai Sun", source: "https://media.formulastudent.de/2026/Hockenheim/20260815-Saturday/i-Vg69rRk" },
  purpose: { image: photoRT3bNRT, alt: "Aristurtle car 111 in motion on the Hockenheim circuit.", credit: "©FSG / Axel Grobe", source: "https://media.formulastudent.de/2026/Hockenheim/20260815-Saturday/i-RT3bNRT" },
} satisfies Record<string, FsgPhoto>;

// General competition imagery, not claims identifying the people's departments.
export const fsgSubteamPhotos: FsgPhoto[] = [
  { image: photoMM9C8Cq, alt: "Team members and officials examining the car during FSG technical inspection.", credit: "©FSG / Shengkai Sun", source: "https://media.formulastudent.de/2026/Hockenheim/20260812-Wednesday/i-MM9C8Cq" },
  { image: photoFQX6skc, alt: "Aristurtle car 111 on the tilt-test platform at Hockenheim.", credit: "©FSG / Niklas Ernst", source: "https://media.formulastudent.de/2026/Hockenheim/20260813-Thursday/i-FQX6skc" },
  { image: photoHK4wcGw, alt: "The open accumulator enclosure during FSG technical inspection.", credit: "©FSG / Felix Lodholz", source: "https://media.formulastudent.de/2026/Hockenheim/20260811-Tuesday/i-HK4wcGw" },
  { image: photodG5X3BC, alt: "An Aristurtle team member working beside the accumulator at FSG technical inspection.", credit: "©FSG / Felix Lodholz", source: "https://media.formulastudent.de/2026/Hockenheim/20260811-Tuesday/i-dG5X3BC" },
  { image: photokNghNgh, alt: "Aristurtle team members discussing a laptop with an event official.", credit: "©FSG / Shengkai Sun", source: "https://media.formulastudent.de/2026/Hockenheim/20260813-Thursday/i-kNghNgh" },
  { image: photoQKqvtH5, alt: "Aristurtle car 111 being prepared between cones for a dynamic test.", credit: "©FSG / Lilian Ocks", source: "https://media.formulastudent.de/2026/Hockenheim/20260812-Wednesday/i-QKqvtH5" },
  { image: photoLJT745D, alt: "Aristurtle car 111 running between cones on the Hockenheim circuit.", credit: "©FSG / Max Partenfelder", source: "https://media.formulastudent.de/2026/Hockenheim/20260815-Saturday/i-LJT745D" },
  { image: photokcmjT6h, alt: "Aristurtle team members discussing technical documents with event officials.", credit: "©FSG / Shengkai Sun", source: "https://media.formulastudent.de/2026/Hockenheim/20260813-Thursday/i-kcmjT6h" },
];
