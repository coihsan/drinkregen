// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import partytown from "@astrojs/partytown";
import tunnel from "astro-tunnel";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://coihsan.github.io/drinkregen/",

  output: "static",

  integrations: [
    react(),
    partytown(),
    tunnel(),
    sitemap({
      filter: (page) => {
        return !page.includes("/admin/") && !page.includes("/staff/");
      },
    }),
  ],

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
      name: "Russo One",
      cssVariable: "--font-russo",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/russo.ttf"],
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
    optimizeDeps: {
      include: ["motion/react"],
    },
  },
});
