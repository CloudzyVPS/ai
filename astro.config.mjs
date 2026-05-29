// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://cloudzyvps.github.io',
  base: '/ai/',
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  i18n: {
    defaultLocale: 'en_us',
    locales: [
      { path: 'en_us', codes: ['en-US'] },
      { path: 'en_gb', codes: ['en-GB'] },
      { path: 'en_au', codes: ['en-AU'] },
      { path: 'en_sg', codes: ['en-SG'] },
      { path: 'de_de', codes: ['de-DE'] },
      { path: 'de_ch', codes: ['de-CH'] },
      { path: 'nl_nl', codes: ['nl-NL'] },
      { path: 'ar_ae', codes: ['ar-AE'] },
    ],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
