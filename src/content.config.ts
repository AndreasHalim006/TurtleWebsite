import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';


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

const seasons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/seasons' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.string(),
      order: z.number(),
      heroImage: z.string().optional(),
      departments: z.array(
        z.object({
          name: z.string(),
          members: z.array(z.object({
            name: z.string(),
            role: z.string(),
            email: z.string(),
            image: z.string().optional(),
          })),
        })
      ).optional(),
    }),
});

export const collections = { sponsorCategories, sponsors, seasons };
