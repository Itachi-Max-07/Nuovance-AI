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
          "dark-2": "rgb(var(--color-dark-2) / <alpha-value>)",
          surface: "rgb(var(--color-surface) / <alpha-value>)",
          "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
          slate: "rgb(var(--color-slate) / <alpha-value>)",
          muted: "rgb(var(--color-muted) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          "accent-2": "rgb(var(--color-accent-2) / <alpha-value>)",
          offwhite: "rgb(var(--color-offwhite) / <alpha-value>)",
          // Hairline borders/dividers on dark surfaces.
          line: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        input: "14px",
      },
      boxShadow: {
        // Soft indigo glow for accent CTAs and card hovers.
        glow: "0 0 32px 0 rgba(91, 91, 255, 0.35)",
        "glow-sm": "0 0 18px 0 rgba(91, 91, 255, 0.22)",
        // Soft depth shadow for matte cards; contrast does most of the work.
        card: "0 8px 30px rgba(0, 0, 0, 0.35)",
      },
      backdropBlur: {
        glass: "20px",
      },
      scale: {
        "97": "0.97",
      },
      transitionDuration: {
        "160": "160ms",
      },
      transitionProperty: {
        // Press/hover feedback: colors + filter + transform + shadow glow.
        // Keyboard focus uses outline (never box-shadow rings), so the
        // focus indicator still appears instantly on Tab.
        press: "color, background-color, border-color, filter, transform, box-shadow",
        // Card hover: colors + glow only. No transform — Framer Motion owns
        // transforms on hoverable cards and CSS transitions would fight it.
        hover: "color, background-color, border-color, box-shadow",
      },
    },
  },
  plugins: [],
};
export default config;
