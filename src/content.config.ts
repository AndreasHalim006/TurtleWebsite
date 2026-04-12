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

export const collections = { showcase };
