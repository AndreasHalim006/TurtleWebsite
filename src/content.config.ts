import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const showcase = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/showcase' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      caption: z.string(),
      image: image(),
      alt: z.string(),
    }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sponsors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      category: z.string(),
      order: z.number(),
      logo: z.string(),
      website: z.string().url().optional(),
      alt: z.string().optional(),
      active: z.boolean().default(true),
    }),
});

const sponsorCategories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sponsor-categories' }),
  schema: z.object({
    key: z.string(),
    title: z.string(),
    order: z.number(),
    description: z.string().optional(),
    sponsors: z
      .array(z.object({ sponsor: z.string() }))
      .optional(),
  }),
});

export const collections = { showcase, sponsorCategories, sponsors };
