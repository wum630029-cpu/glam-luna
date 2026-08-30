// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://glamluna.net';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
