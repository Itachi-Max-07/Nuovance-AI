# Nuovance AI — Portfolio Website

Single-page marketing site for **Nuovance AI**, an AI, automation, and software
engineering company.

> *"Engineering the Future with Artificial Intelligence"*

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript (strict)
- [Tailwind CSS](https://tailwindcss.com/) with brand tokens as CSS variables
- [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) for animation
- Deploy target: [Vercel](https://vercel.com/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the local development server |
| `npm run build` | Create a production build          |
| `npm run start` | Serve the production build         |
| `npm run lint`  | Run ESLint                         |

## Project Structure

```
src/
├── app/                        # App Router entry (layout, page, globals.css)
├── components/
│   ├── sections/               # One file per page section (Hero, About, …)
│   ├── layout/                 # Navbar, Footer
│   ├── ui/                     # Reusable primitives (Button, Globe, OrbitMotif)
│   ├── hero/                   # Hero workflow canvas (nodes, particles)
│   └── workflow-story/         # Scroll-driven workflow story + scenes
└── lib/
    ├── content.ts              # ALL site copy as typed data — no hardcoded text
    └── utils.ts                # Shared helpers
public/
├── logo/                       # Brand + partner logos served by the site
└── videos/                     # Demo videos
reference/                      # Source brand assets & company profile (not served)
```

## Conventions

- All copy lives in [`src/lib/content.ts`](src/lib/content.ts) — components map
  over typed data and never hardcode text.
- Brand colors, radii, borders, and shadows are CSS variables defined in
  [`src/app/globals.css`](src/app/globals.css) and mirrored as `brand.*` tokens
  in [`tailwind.config.ts`](tailwind.config.ts). No arbitrary Tailwind values.
- Server Components by default; `"use client"` only on small, low-level
  animation/interaction wrappers.
- See [`CLAUDE.md`](CLAUDE.md) for the full design-system and contribution rules.
