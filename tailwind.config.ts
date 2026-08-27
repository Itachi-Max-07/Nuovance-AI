import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

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
          // Soft Brutalism palette — warm paper, beige, charcoal ink, cobalt.
          paper: "rgb(var(--color-paper) / <alpha-value>)",
          cream: "rgb(var(--color-cream) / <alpha-value>)",
          card: "rgb(var(--color-card) / <alpha-value>)",
          ink: "rgb(var(--color-ink) / <alpha-value>)",
          body: "rgb(var(--color-body) / <alpha-value>)",
          faint: "rgb(var(--color-faint) / <alpha-value>)",
          // THE accent: primary actions and highlights only.
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          // Accent as small text on light backgrounds (better contrast).
          "accent-deep": "rgb(var(--color-accent-deep) / <alpha-value>)",
          // Success/qualified states (workflow story badges, live dots).
          green: "rgb(var(--color-green) / <alpha-value>)",
          // "AI working" status tone on the hero workflow nodes.
          violet: "rgb(var(--color-violet) / <alpha-value>)",
          // Premium Purple — dark-theme hover accent (buttons, links).
          purple: "rgb(var(--color-purple) / <alpha-value>)",
          // Hairline dividers INSIDE cards (structural borders use ink).
          // Variable-driven so the dark scope can flip it to a light hairline.
          line: "rgb(var(--color-line) / 0.12)",
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
        card: "24px",
        input: "16px",
        // Workflow node cards on the hero canvas.
        node: "20px",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        // Shadow recipes live in globals.css as variables: layered physical
        // depth at :root (hard offset + soft ambient falloff), flat pure-black
        // hard offsets inside .theme-dark. Same classes work on both bases.
        brutal: "var(--shadow-brutal)",
        "brutal-sm": "var(--shadow-brutal-sm)",
        "brutal-lg": "var(--shadow-brutal-lg)",
        // Sparing accent offset for the single highlighted element per view.
        "brutal-accent": "4px 4px 0 0 rgb(var(--color-accent))",
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
        // Gentle overshoot for tactile press/lift interactions.
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionProperty: {
        // Press/hover feedback: colors + filter + transform + shadow.
        // Keyboard focus uses outline (never box-shadow rings), so the
        // focus indicator still appears instantly on Tab.
        press: "color, background-color, border-color, filter, transform, box-shadow",
        // Card hover: colors + shadow only. No transform — Framer Motion owns
        // transforms on hoverable cards and CSS transitions would fight it.
        hover: "color, background-color, border-color, box-shadow",
        // Brutalist card hover: CSS owns the transform here (Framer Motion is
        // only on the entry wrapper, never the hovered element).
        brutal: "transform, box-shadow, border-color",
      },
      // MDX article body (`prose`). Every colour is re-pointed at the brand
      // CSS variables so long-form content tracks the same tokens as the rest
      // of the site — the plugin's default gray palette is never used. The
      // element components in mdx-components.tsx override the elements they
      // map; `prose` only styles what MDX can emit but we don't map (h4, hr,
      // tables, strong/em, nested lists).
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(var(--color-body))",
            "--tw-prose-headings": "rgb(var(--color-ink))",
            "--tw-prose-lead": "rgb(var(--color-body))",
            "--tw-prose-links": "rgb(var(--color-accent-deep))",
            "--tw-prose-bold": "rgb(var(--color-ink))",
            "--tw-prose-counters": "rgb(var(--color-faint))",
            "--tw-prose-bullets": "rgb(var(--color-accent))",
            "--tw-prose-hr": "rgb(var(--color-ink) / 0.12)",
            "--tw-prose-quotes": "rgb(var(--color-ink))",
            "--tw-prose-quote-borders": "rgb(var(--color-accent))",
            "--tw-prose-captions": "rgb(var(--color-faint))",
            "--tw-prose-code": "rgb(var(--color-ink))",
            "--tw-prose-th-borders": "rgb(var(--color-ink))",
            "--tw-prose-td-borders": "rgb(var(--color-ink) / 0.12)",
            // The article column owns its own width constraint.
            maxWidth: "none",
            // Inline code renders as a bordered chip and blockquotes carry an
            // accent rule, so the plugin's decorative backticks and smart
            // quotes would double up. Strip them.
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            "blockquote p:first-of-type::before": { content: '""' },
            "blockquote p:last-of-type::after": { content: '""' },
          },
        },
      },
    },
  },
  plugins: [typography],
};
export default config;
