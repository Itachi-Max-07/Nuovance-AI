import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "rgb(var(--color-dark) / <alpha-value>)",
          slate: "rgb(var(--color-slate) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          "light-blue": "rgb(var(--color-light-blue) / <alpha-value>)",
          offwhite: "rgb(var(--color-offwhite) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
