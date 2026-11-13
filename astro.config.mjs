// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://aristurtle.gr',
  base: '/',
  build: {
    assets: 'assets'
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});