// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import lenis from "lenis";
import tailwindcss from "@tailwindcss/vite";
import partytown from '@astrojs/partytown';
import tunnel from 'astro-tunnel';
import sitemap from '@astrojs/sitemap';
const isDevServer = process.env.NODE_ENV === "development";

// https://astro.build/config
export default defineConfig({
  site: "https://drinkregen.com/",
  integrations: [react(),
    partytown(), 
    tunnel(), 
    sitemap({
      filter: (page) => {
        return !page.includes('/admin/') && !page.includes('/staff/');
      }
    })],
    
  output: "static",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Thunderhouse",
      cssVariable: "--font-thunderhouse",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/thunderhouse.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Headoh",
      cssVariable: "--font-headoh",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/HEADOH.ttf"],
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
