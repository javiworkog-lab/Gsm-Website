// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://gsm.cl',
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: false } }),
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es-CL', locales: { 'es-CL': 'es-CL' } },
      changefreq: 'weekly',
      priority: 0.8,
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
