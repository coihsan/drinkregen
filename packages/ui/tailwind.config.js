const config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@workspace/ui/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        headoh: ['HEADOH', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      backgroundImage: {
        "hero-pattern": "url('/thunderbolt.svg')",
        "footer-texture": "url('/img/footer-texture.png')",
      },
    },
  },
};

export default config;
