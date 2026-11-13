// Central site content. Anything marked TODO(content) is a placeholder.
// Every placeholder is also listed in src/data/placeholders.md.

import mechanicalChassis from '../assets/subdivisions/mechanical_chassis.png';
import mechanicalAero from '../assets/subdivisions/mechanical_aerodynamics.png';
import powertrain from '../assets/subdivisions/powertrain_1.png';
import electronics from '../assets/subdivisions/electronics_1.png';
import driverless from '../assets/subdivisions/driverless_perception.png';
import itSoftware from '../assets/subdivisions/it_1.jpg';
import vehicleDynamics from '../assets/subdivisions/vehicledynamics_1.png';

import operations from '../assets/subdivisions/operations_graphic.png';

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Cars', href: '/cars' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Theses', href: '/theses' },
  { label: 'Blog', href: '/blog' },
  { label: 'Videos', href: '/videos' },
  { label: 'Sponsor Portal', href: '/sponsor-portal' },
];

export const joinLink = { label: 'Join Us', href: '/join' };

export const contact = {
  email: 'info@aristurtle.gr',
  leaderRole: 'Team Leader',
  leaderName: 'Malamas Bogatinis',
  phone: '(+30) 6985878769',
  phoneHref: 'tel:+306985878769',
  address: ['Aristotle University of Thessaloniki', 'Faculty of Engineering', 'Thessaloniki 541 24', 'Greece'],
  // TODO(content): legal entity / VAT number, if the team wants it shown in the footer.
  legal: 'Org. no: 000 000 000',
};

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/arist.u.r.t.le/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aristotle.university.racing.team.electric/' },
  { label: 'Facebook', href: 'https://www.facebook.com/aristurtle' },
];

export const footerColumns = {
  general: [
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Cars', href: '/cars' },
    { label: 'Sponsors', href: '/sponsors' },
    { label: 'Theses', href: '/theses' },
  ],
  // TODO(content): real event pages (unveiling, career day).
  events: [
    { label: 'Career Day', href: '/blog' },
    { label: 'Car Unveiling', href: '/blog' },
  ],
  media: [
    { label: 'Blog', href: '/blog' },
    { label: 'Videos', href: '/videos' },
    { label: 'Wallpapers', href: '/videos' },
  ],
};

export const hero = {
  // TODO(content): final tagline.
  title: 'Built by students. Driven by engineering.',
  subtitle: 'Accelerating the next generation of engineers through electric and driverless Formula Student race cars.',
};

export const worldClass = {
  title: 'world-class team',
  // TODO(content): real member / major counts.
  body:
    'Aristurtle is the Aristotle University of Thessaloniki Formula Student team. A team of 00 students from 00 majors, we have been pushing for perfection since 2013, when we built the first electric race car in Northern Greece.',
};

// TODO(content): replace all four with real results (place, year, discipline, competition).
export const achievements = [
  { place: '1st place', year: '20XX', discipline: 'Placeholder discipline', competition: 'Formula Student XX' },
  { place: '2nd place', year: '20XX', discipline: 'Placeholder discipline', competition: 'Formula Student XX' },
  { place: '3rd place', year: '20XX', discipline: 'Placeholder discipline', competition: 'Formula Student XX' },
  { place: '1st place', year: '20XX', discipline: 'Placeholder discipline', competition: 'Formula Student XX' },
];

export const departments = [
  {
    id: 'mechanical',
    name: 'Mechanical',
    blurb: 'Simulation-driven design of the chassis, aerodynamics and suspension that give the car its grip.',
    topics: ['Chassis & Composites', 'Aerodynamics', 'Suspension'],
    image: mechanicalChassis,
  },
  {
    id: 'electrical',
    name: 'Electrical',
    blurb: 'In-house high-voltage powertrain and embedded electronics, engineered for efficiency on track.',
    topics: ['Powertrain', 'Electronics & Embedded', 'Accumulator'],
    image: powertrain,
  },
  {
    id: 'software',
    name: 'Software',
    blurb: 'Control, data and autonomy: from torque vectoring to the full driverless stack.',
    topics: ['Driverless', 'Vehicle Dynamics & Control', 'IT & Software'],
    image: driverless,
  },
];

export const subdivisions = [
  { id: 'mechanical', name: 'Mechanical', image: mechanicalChassis, description: 'Design, analyze, and manufacture the core physical structures, aerodynamics, and drivetrain of the race car.' },
  { id: 'aerodynamics', name: 'Aerodynamics & Suspension', image: mechanicalAero, description: 'CFD-driven aero packages and suspension geometry that maximise downforce and mechanical grip.' },
  { id: 'powertrain', name: 'Powertrain', image: powertrain, description: 'Develop the high-voltage electrical drive systems, custom battery accumulator, and electric motors for peak performance.' },
  { id: 'electronics', name: 'Electronics & Embedded', image: electronics, description: 'Create the low-voltage nervous system that manages sensors, microcontrollers, and communication protocols.' },
  { id: 'it-software', name: 'IT & Software Development', image: itSoftware, description: "Architect the team's digital infrastructure, custom web apps, cloud systems, and complex data pipelines." },
  { id: 'vehicle-dynamics', name: 'Vehicle Dynamics & Control', image: vehicleDynamics, description: 'Optimize track performance through advanced simulations, data analysis, and control systems like Torque Vectoring.' },
  { id: 'driverless', name: 'Driverless', image: driverless, description: 'Convert the vehicle into an autonomous racer using computer vision, machine learning, and path planning algorithms.' },
  { id: 'operations', name: 'Operations', image: operations, description: 'Drive the business side of the team by managing sponsorships, marketing, public relations, and visual identity.' },
];

export const joinForm =
  'https://docs.google.com/forms/d/e/1FAIpQLSdJkxdR0KYUsm0qqWfzx2Sv87FcDKtLA15mhI01N2IBBxRY5w/viewform?usp=sharing&ouid=103565197720049109907';

export const joinBenefits = [
  { title: 'Real-world engineering', desc: 'Apply your theoretical knowledge to build an actual electric and autonomous race car from scratch.' },
  { title: 'Professional network', desc: 'Connect with industry leaders, top-tier engineering companies, and passionate alumni around the globe.' },
  { title: 'Hands-on experience', desc: 'Work with cutting-edge tools, advanced materials, and modern software stacks before you even graduate.' },
];

export const aboutValues = [
  { letter: 'A', title: 'utonomous', text: 'We have created the first Autonomous / Driverless Electric race car in the Balkan region.' },
  { letter: 'R', title: 'esearch', text: 'Aristurtle fosters research on cutting-edge technologies and empowers young engineers to innovate.' },
  { letter: 'I', title: 'nitiative', text: 'Back in 2013, we built the first electric race car in Northern Greece, driven solely by the will of its members.' },
  { letter: 'S', title: 'ustainability', text: 'Raising public awareness for Electric and Autonomous mobility is our main focus.' },
  { letter: 'T', title: 'rack record', text: 'Our team has had an unparalleled course in the Formula Student competitions it has participated in.' },
  { letter: 'U', title: 'nity', text: 'We believe in long-lasting relationships. By supporting our work, you become part of our growing family.' },
  { letter: 'R', title: 'eturn', text: 'Our sponsorship program offers strategic promotion solutions by creating unique, stimulating content.' },
  { letter: 'T', title: 'alent', text: "Our members are exceptionally skilled individuals and we strive to contribute to everyone's personal development." },
  { letter: 'L', title: 'earning', text: 'We give engineering students hands-on practical experience by bridging the gap between theory and practice.' },
  { letter: 'E', title: 'xcellence', text: 'The Greek Electric Vehicle Formula Student team with the most participations and distinctions in international FSAE competitions.' },
];

