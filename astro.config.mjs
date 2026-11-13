// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Overridden by the GitHub Pages workflow so project-page previews work on a sub-path.
  site: process.env.SITE_URL ?? 'https://aristurtle.gr',
  base: process.env.SITE_BASE ?? '/',
  build: {
    assets: 'assets'
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
