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
          // Deepest well — tag/pill backgrounds inside brutalist cards.
          "dark-3": "rgb(var(--color-dark-3) / <alpha-value>)",
          // Soft-brutalism accent: offset shadows, borders, heading markers.
          blue: "rgb(var(--color-blue) / <alpha-value>)",
          // Success/qualified states (workflow story badges, live dots).
          green: "rgb(var(--color-green) / <alpha-value>)",
          slate: "rgb(var(--color-slate) / <alpha-value>)",
          muted: "rgb(var(--color-muted) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          "accent-2": "rgb(var(--color-accent-2) / <alpha-value>)",
          offwhite: "rgb(var(--color-offwhite) / <alpha-value>)",
          // Hairline borders/dividers on dark surfaces.
          line: "rgba(255, 255, 255, 0.08)",
        },
        // Light hero palette (Weave-style hero + workflow canvas only).
        hero: {
          bg: "rgb(var(--hero-bg) / <alpha-value>)",
          surface: "rgb(var(--hero-surface) / <alpha-value>)",
          ink: "rgb(var(--hero-ink) / <alpha-value>)",
          body: "rgb(var(--hero-body) / <alpha-value>)",
          line: "rgb(var(--hero-line) / <alpha-value>)",
          accent: "rgb(var(--hero-accent) / <alpha-value>)",
          cyan: "rgb(var(--hero-cyan) / <alpha-value>)",
          green: "rgb(var(--hero-green) / <alpha-value>)",
          violet: "rgb(var(--hero-violet) / <alpha-value>)",
        },
      },
      fontSize: {
        // Metric chips / status pills on the workflow cards.
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-inter)", "sans-serif"],
        // Display face for the brutalist capability cards.
        grotesk: ["var(--font-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        input: "14px",
        // Workflow node cards on the light hero canvas.
        node: "18px",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        // Soft indigo glow for accent CTAs and card hovers.
        glow: "0 0 32px 0 rgba(91, 91, 255, 0.35)",
        "glow-sm": "0 0 18px 0 rgba(91, 91, 255, 0.22)",
        // Soft depth shadow for matte cards; contrast does most of the work.
        card: "0 8px 30px rgba(0, 0, 0, 0.35)",
        // Soft premium shadows for the light hero's frosted glass cards.
        "hero-card":
          "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px -8px rgba(16, 24, 40, 0.10)",
        "hero-card-hover":
          "0 2px 4px rgba(16, 24, 40, 0.05), 0 24px 48px -12px rgba(16, 24, 40, 0.16)",
        // Blue halo for the highlighted AI node.
        "hero-halo":
          "0 1px 2px rgba(16, 24, 40, 0.04), 0 16px 40px -8px rgba(59, 130, 246, 0.22)",
        // Dark ink CTA on the light hero.
        "hero-cta": "0 1px 2px rgba(16, 24, 40, 0.25), 0 10px 24px -8px rgba(17, 24, 39, 0.35)",
      },
      backdropBlur: {
        glass: "20px",
      },
      scale: {
        "97": "0.97",
        "103": "1.03",
      },
      transitionDuration: {
        "160": "160ms",
      },
      transitionTimingFunction: {
        // Strong ease-out — built-in `ease-out` is too weak for hover lifts.
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      transitionProperty: {
        // Press/hover feedback: colors + filter + transform + shadow glow.
        // Keyboard focus uses outline (never box-shadow rings), so the
        // focus indicator still appears instantly on Tab.
        press: "color, background-color, border-color, filter, transform, box-shadow",
        // Card hover: colors + glow only. No transform — Framer Motion owns
        // transforms on hoverable cards and CSS transitions would fight it.
        hover: "color, background-color, border-color, box-shadow",
        // Brutalist card hover: CSS owns the transform here (Framer Motion is
        // only on the entry wrapper, never the hovered element).
        brutal: "transform, box-shadow, border-color",
      },
    },
  },
  plugins: [],
};
export default config;
