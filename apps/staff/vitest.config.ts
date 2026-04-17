import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": dirname,
      "@lib": path.resolve(dirname, "lib"),
      "@workspace/ui": path.resolve(dirname, "../../packages/ui/src/index.tsx"),
      "@workspace/ui/": `${path.resolve(dirname, "../../packages/ui/src")}/`,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/generated/**",
      "**/dist/**",
      "**/e2e/**",
    ],
    css: true,
    restoreMocks: true,
    clearMocks: true,
  },
});
