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

### App Router boundaries
- Components are Server Components by DEFAULT.
- ONLY use `"use client"` when necessary (Framer Motion wrappers, interactive
  Navbar state, booking embed). Keep client boundaries as small and low-level
  as possible.
- NEVER make a Section a Client Component just to animate it — use a small
  client `MotionWrapper`/`AnimatedDiv` imported into the server Section.

## Brand Tokens (NON-NEGOTIABLE — Soft Brutalism system, July 2026 redesign)
Colors — CSS variables in globals.css, mirrored in tailwind.config as `brand.*`:
- `--color-paper: #F7F6F3`        primary background (`bg-brand-paper`)
- `--color-cream: #F2EFE9`        alternate sections + wells (`bg-brand-cream`)
- `--color-card: #FFFFFF`         flat card faces (`bg-brand-card`)
- `--color-ink: #1C1C1C`          charcoal — structural borders, headings, shadows
- `--color-body: #474742`         secondary/body text (`text-brand-body`)
- `--color-faint: #65655E`        muted labels (`text-brand-faint`)
- `--color-accent: #2563EB`       cobalt — THE single accent: primary actions/highlights
- `--color-accent-deep: #1D4ED8`  accent as TEXT on light backgrounds (AA contrast)
- `--color-green: #047857`        success/live states
- `--color-violet: #6D28D9`       "AI working" status tone
- `brand-line` (static)           rgba(28,28,28,.12) hairline dividers INSIDE cards only;
  structural borders are 2–3px solid `brand-ink`
- Shadows ride CSS variables (`--shadow-brutal*` in globals.css): layered
  hard-offset + soft ambient at `:root`, flat pure-black hard offsets in
  `.theme-dark`. Classes: `shadow-brutal` / `-sm` / `-lg` / `-accent`.
- Geometry rides CSS variables too: `--radius-card/panel/control` and
  `--border-card/control` (24px/20px/999px + 3px at `:root`; 4px + 2px in
  `.theme-dark`). The shared classes consume them — never hardcode radii or
  border widths into `.card-brutal`/`.btn-brutal`/`.tag-brutal`/`.ws-card`.
- NO glassmorphism, NO backdrop blur, NO neon glows, NO gradient text, NO
  gradients. Flat surfaces everywhere; `.nav-gloss` is a flat solid black
  slab (its old gloss/blur treatment is gone — do not reintroduce it).

### Dark scope (July 2026 — ALL-BLACK Soft Brutalism, everything but the Hero)
- Every section AFTER the Hero is wrapped in `<div className="theme-dark
  bg-brand-paper">` (page.tsx); the Navbar and Footer carry `theme-dark`
  themselves. `.theme-dark` (globals.css) re-points ALL the CSS variables
  above at the black system: paper #0A0A0A, cream #111111, card #141414,
  ink #EAEAEA (off-white), body #B0B0B0, faint #8A8A8A, accent #5E81AC
  (muted steel blue — THE single accent), accent-deep #81A1C1 (accent as
  text), green #A3BE8C (muted sage), violet/purple #B48EAD (muted mauve).
- ONLY the Hero reads the untouched `:root` light values — NEVER apply the
  dark tokens to the Hero, and never hardcode a palette that bypasses the
  variables (shadows/hairlines ride `--shadow-hard` / `--color-line`).
- In scope: sharp 4px corners, 2px borders, flat `4px 4px 0 #000` shadows —
  all via the variables above. Hover feedback is a border/background shift
  (border-soft #333 → border-strong #4A4A4A), never a glow.
- On accent-filled elements use `text-brand-paper` (resolves near-black in
  scope), NOT `text-white` — white on the muted accent fails WCAG AA.
- All surface borders (cards, tags, buttons, nav) come from
  `--color-border-soft` (#333333). Headings weigh 700–800 in scope.
- A scoped rule flattens Tailwind `rounded`…`rounded-3xl` utilities to 4px
  inside `.theme-dark`; `rounded-full` circles (dots, pulse rings, icon
  chips) intentionally stay round.

Typography:
- **Bricolage Grotesque** for headings (`font-heading`, applied to h1–h6 via a
  base rule in globals.css). Weights 500–700, tight letter-spacing, editorial.
- **Inter** for body (`font-sans`), 400–500, generous line height.
- Generous letter-spacing on the wordmark and section labels/eyebrows.

### Styling rules (no drift)
- NEVER use arbitrary Tailwind values (`bg-[#111827]`, `text-[#8CA9FF]`).
- NEVER use default Tailwind color names (`bg-gray-900`, `text-blue-400`).
- ALWAYS use the semantic classes mapped to the CSS variables, **matching the
  names already defined in tailwind.config** (the `brand.*` palette — e.g.
  `bg-brand-dark`, `text-brand-accent`). Do not rename the existing config.
- NO inline styles for colors or typography. Tailwind classes exclusively.

## Brand Feel
Soft Brutalism: tactile, chunky, playful, premium (Gumroad / Craft Docs /
Read.cv energy). Sections alternate between `bg-brand-paper` (#F7F6F3) and
`bg-brand-cream` (#F2EFE9); flat white `.card-brutal` cards with 3px charcoal
borders and hard offset shadows sit on top like physical objects. Cobalt
accent used sparingly (primary CTAs, highlights, indicator dots). Motion is
physical, never sci-fi: spring easing (`ease-spring`), hover lift with shadow
growth, click compress, slight tilts — no glows, no particles beyond the hero
canvas packets. Bold typographic hierarchy (Bricolage Grotesque 700+ for
headings), oversized padding, generous whitespace. Icons are
monochrome/outline. The logo = **N monogram + circular orbit + dot** — echo
that orbit/dot motif in section dividers, background accents, and hover
states via the shared `OrbitMotif` component.

### Component contracts
- Cards: shared `.card-brutal` class (globals.css) — never restyle per
  section. Framer Motion animates only an entry WRAPPER around it; CSS owns
  the hover/press transform.
- Buttons: shared `.btn-brutal` + `.btn-brutal-primary` / `.btn-brutal-outline`
  classes; every CTA on the site presses the same way.
- Tags/chips: shared `.tag-brutal`.
- Workflow-story panels: `.ws-card` (no hover motion — display surfaces).

## Content
- All site copy lives in `src/lib/content.ts` as typed objects/arrays — **never
  hardcode text in components**. Components map over this data.
- Source content is `reference/company-profile.md`.
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

## File Conventions
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
