# Nuovance AI — Portfolio Website

## Project
Single-page marketing portfolio for **Nuovance AI**, an AI, automation, and
software engineering company. Goal: a premium, credible, engineering-grade
site that converts visitors into consultation bookings.

- Tagline: **"Engineering the Future with Artificial Intelligence"**
- Positioning: **"We don't build software. We engineer intelligent business ecosystems."**
- Motto: **"Innovate. Automate. Transform."**

## Tech Stack
- Next.js 14 (App Router) + TypeScript — **strict TypeScript, NO `any` types.**
  Use `unknown` and narrow, or define proper interfaces (usually in content.ts).
- All component props MUST be explicitly typed with an interface
  (`interface HeroProps { ... }`), not inline parameter types.
- Tailwind CSS (brand tokens as CSS variables)
- Framer Motion for animation
- next/font/google for Montserrat
- Deploy target: Vercel

### App Router boundaries
- Components are Server Components by DEFAULT.
- ONLY use `"use client"` when necessary (Framer Motion wrappers, interactive
  Navbar state, booking embed). Keep client boundaries as small and low-level
  as possible.
- NEVER make a Section a Client Component just to animate it — use a small
  client `MotionWrapper`/`AnimatedDiv` imported into the server Section.

## Brand Tokens (NON-NEGOTIABLE)
Colors — CSS variables in globals.css, mirrored in tailwind.config:
- `--color-dark: #111827`       primary — dark backgrounds, headings (trust/authority)
- `--color-slate: #6B7280`      body & secondary text
- `--color-accent: #8CA9FF`     CTAs, highlights, the "dot" spark
- `--color-light-blue: #D6E0F2` soft fills, card backgrounds
- `--color-offwhite: #F5F7FA`   light section backgrounds

Typography:
- **Montserrat** everywhere, via next/font. SemiBold for headings, Medium for body.
- Generous letter-spacing on the wordmark and section labels/eyebrows.

### Styling rules (no drift)
- NEVER use arbitrary Tailwind values (`bg-[#111827]`, `text-[#8CA9FF]`).
- NEVER use default Tailwind color names (`bg-gray-900`, `text-blue-400`).
- ALWAYS use the semantic classes mapped to the CSS variables, **matching the
  names already defined in tailwind.config** (the `brand.*` palette — e.g.
  `bg-brand-dark`, `text-brand-accent`). Do not rename the existing config.
- NO inline styles for colors or typography. Tailwind classes exclusively.

## Brand Feel
Intelligent, premium, minimal. **Navy-dominant** site: dark navy is the primary
identity (Hero, Experience, Tech/Why-Choose-Us band, Contact, Footer), with
deliberate light sections (`--color-offwhite` / `--color-light-blue`) alternating
between them for rhythm (About, Vision & Mission, Capabilities, Outcomes,
Industries, Methodology, Leadership). Do not convert defined light sections to
dark or vice versa; follow the established per-section background.
Blue accents used sparingly. Lots of whitespace. The logo = **N monogram +
circular orbit + dot** — echo that orbit/dot motif in section dividers,
background accents, and hover states via the shared `OrbitMotif` component.

## Content
- All site copy lives in `src/lib/content.ts` as typed objects/arrays — **never
  hardcode text in components**. Components map over this data.
- Source content is `reference/company-profile.md`.
- Section order: Hero → About → Vision & Mission → Capabilities → **Experience
  (stats + selected work)** → Business Outcomes → Industries → Methodology
  (10 steps) → Leadership → Tech Ecosystem → Why Choose Us → Contact.
- If a required field is missing from content.ts, render `null` or a sensible
  empty state — NEVER hardcode fallback text in the component.
- Placeholders must be explicitly flagged in content.ts
  (e.g. `phone: "+91 XXXXX" // PLACEHOLDER`).
- Images MUST have alt text, stored in content.ts alongside the src — never
  hardcoded in the component.

## Booking / Meeting CTA
- Every consultation CTA ("Schedule a Strategy Consultation", "Book a Meeting")
  links to the booking URL in `content.ts` (`contact.bookingUrl` via the
  `bookingHref` helper, falling back to `#contact` until a real link is set).
- The Contact section embeds the booking calendar inline (Cal.com embed or
  Calendly widget) so visitors can book without leaving the page.
- A persistent "Book a Meeting" button lives in the Navbar (accent blue).
- The booking URL is a placeholder until the user confirms their Cal.com or
  Calendly link — do NOT invent a real URL.

## Working With Design Skills (ui-ux-pro-max)
Use **ui-ux-pro-max** for layout quality, spacing rhythm, visual hierarchy,
motion, component polish, and its pre-delivery review checklist. BUT the brand
tokens, typography (Montserrat), color palette, and the orbit/dot motif in this
file are **non-negotiable and override any default the skill would apply**.
When the skill suggests a color, font, or style that conflicts with these
tokens, follow THIS file. Do not use the skill's default palette or fonts.

## Working With 21st.dev Component Prompts
The user may paste component prompts copied from 21st.dev. Treat them as
**structural and motion references only**: adopt the layout, composition,
interaction, and animation patterns, but ALWAYS re-theme to this project's
brand tokens (navy/blue palette, Montserrat, orbit/dot motif). Strip any
colors, fonts, gradients, or shadcn theme values that come with the prompt.
Rebuild with our Tailwind CSS variables. If a 21st.dev component requires
shadcn/ui primitives, install only what's needed — and ask first (see
dependency rule).

## File Conventions
- Sections: `src/components/sections/` (one file per section, PascalCase)
- Reusable UI: `src/components/ui/` (Button, Card, SectionHeading, OrbitMotif)
- Layout: `src/components/layout/` (Navbar, Footer)
- Copy/data: `src/lib/content.ts`
- Logo assets: `public/logo/`
- One component per file. Keep them small and composable — no giant single-file pages.

## Rules
- Mobile-first; responsive at every breakpoint.
- WCAG AA contrast minimum. Watch accent-blue on white — darken or add weight
  if it fails.
- Use next/image; lazy-load below the fold; optimize all imagery.
- No lorem ipsum — pull real copy from content.ts.
- Contact details use placeholders (`+91 XXXXX`, emails/phone) until confirmed —
  keep them clearly flagged; do NOT invent real ones.
- Commit after each section so changes are easy to roll back.
- DO NOT install new npm packages without explicit user permission. Use native
  browser APIs, standard TypeScript, or existing dependencies (Next.js,
  Framer Motion) first.
- Animations must be GPU-accelerated: animate `transform` and `opacity` only.
  No layout-property animations (width/height/margin) that cause reflows.
- Respect `prefers-reduced-motion`: gate all non-essential animation.

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
