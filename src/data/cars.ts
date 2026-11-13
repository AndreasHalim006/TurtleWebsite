import garage from './garage.json';

type Img = { default: ImageMetadata };

const mainImages = import.meta.glob<Img>('/src/images/*.{jpeg,jpg,png}', { eager: true });
const galleryImages = import.meta.glob<Img>('/src/images/garage/gallery/*.{jpeg,jpg,png,webp}', { eager: true });

export interface Figure {
  label: string;
  value: string;
  unit: string;
  /** true when no number exists in our data yet (shown as 00). */
  placeholder: boolean;
}

export interface Car {
  id: string;
  name: string;
  years: string;
  startYear: string;
  description: string;
  image?: ImageMetadata;
  specs: string[];
  gallery: ImageMetadata[];
  figures: Figure[];
}

const pick = (specs: string[], re: RegExp): string | null => {
  for (const s of specs) {
    const m = s.match(re);
    if (m) return m[1].replace(',', '.');
  }
  return null;
};

const buildFigures = (specs: string[]): Figure[] => {
  const defs: Array<[string, RegExp, string]> = [
    ['Weight', /(\d+(?:[.,]\d+)?)\s*kg/i, 'kg'],
    ['Motor power (each)', /(\d+(?:[.,]\d+)?)\s*kW(?!h)/i, 'kW'],
    ['Accumulator', /(\d+(?:[.,]\d+)?)\s*kWh/i, 'kWh'],
    ['Top speed', /(\d+(?:[.,]\d+)?)\s*km\/h/i, 'km/h'],
  ];
  // TODO(content): confirm figures per car; "00" marks a missing value.
  return defs.map(([label, re, unit]) => {
    const value = pick(specs, re);
    return { label, unit, value: value ?? '00', placeholder: value === null };
  });
};

export const cars: Car[] = (garage as any[]).map((c) => {
  const mainKey = `/src/images/${c.image}`;
  const gallery = (c.gallery as string[])
    .map((g) => galleryImages[`/src/images/garage/gallery/${g}`]?.default)
    .filter((x): x is ImageMetadata => Boolean(x));
  return {
    id: c.id,
    name: c.name,
    years: c.years,
    startYear: String(c.years).slice(0, 4),
    description: c.description,
    image: mainImages[mainKey]?.default,
    specs: c.specs,
    gallery,
    figures: buildFigures(c.specs),
  };
});

/** Oldest first, for the timeline. */
export const carsChronological = [...cars].reverse();
