# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lake District Spas is a Next.js 14 (App Router) directory website for Lake District spa facilities. All data is static TypeScript — no CMS, no database, no external APIs. The site uses static generation for all pages.

## Commands

```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint for .ts/.tsx/.js/.jsx
npm test             # Jest tests (single worker)
npm run test:watch   # Jest watch mode
npm run test:coverage # Jest with coverage
```

Run a single test file: `npx jest src/__tests__/filtering.test.ts --maxWorkers=1`

Pre-commit hook (Husky) runs `typecheck` then `test` — both must pass.

## Architecture

### Data Layer (no backend — all local TypeScript)

- **`src/data/spas.ts`** — Central spa database (~22 spas). Exported as `spaData`. Each spa has an `id` (number), `url` (slug), facilities, images, access policies, related spas.
- **`src/data/treatments/`** — One file per spa (`spa-{id}-treatments.ts`). Access via `getTreatmentsBySpaId(id)` or `getAllTreatments()` from the index.
- **`src/data/day-passes/`** — One file per spa (`spa-{id}-day-passes.ts`). Access via `getDayPassesBySpaId(id)` or `getDayPassOptionsBySpaId(id)` from the index.
- **`src/data/faqs/`** — FAQ generation helpers per spa.
- **`src/types/spa.ts`** — Core types: `Spa`, `Treatment`, `DayPass`, `AccessLabel`, etc.
- **`src/types/blog.ts`** — Blog types: `BlogPostMeta`, `BlogPost`.

### Pages (App Router)

- `/` — Homepage with multi-filter (access labels, location, facilities). Client component with `useState`.
- `/spa/[slug]` — Dynamic spa detail pages. Uses `generateStaticParams` from `spaData`.
- `/spa-days` — Spa day passes page with advanced filtering.
- `/blog` — Blog listing with category filtering.
- `/blog/[slug]` — MDX blog posts. Uses `next-mdx-remote/rsc`.
- `/[location]` — 13 location pages (Windermere, Ambleside, Borrowdale, etc.) via `src/lib/locationPages.ts`.
- `/about` — About page.

### Blog System

- MDX files in `content/blog/` with YAML frontmatter (see `blog.md` for full spec).
- Blog utilities in `src/lib/blog.ts`: `getAllBlogPosts()`, `getBlogPostBySlug()`, `getRelatedPosts()`.
- Blog images in `public/images/blog/` with alt text centralized in `public/images/blog/images.json`.
- **Never hardcode prices in blog posts** — use `<SpaAccessPrice>`, `<DayPassPrice>`, `<DayPassLink>`, `<TreatmentLink>` MDX components.
- Categories: `guides`, `comparisons`, `seasonal`, `facilities`, `locations`.

### Components

- **`src/components/ui/`** — shadcn/ui primitives (Radix UI based, "new-york" style).
- **`src/components/`** — Page-specific components. PascalCase naming.
- Key spa detail components: `SpaHero`, `QuickFactsBar`, `SpaIntroduction`, `ThermalFacilities`, `PoolFeatures`, `Treatments`, `AccessPolicy`, `BookVisitCTA`.
- `GoogleAnalytics.tsx` — GTM integration with custom outbound click tracking (tracks `spa_id`, `click_intent`, `product_name`).
- `BookVisitCTA.tsx` — Appends UTM parameters (`utm_source=lakedistrictspas.co.uk`) to outbound booking links.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig and jest).

## Design System

See `STYLE_GUIDE.md` for full reference. Key rules:

- **Typography**: Playfair Display (`font-serif`) for headings, Inter (`font-sans`) for body.
- **Colors**: Emerald 950 primary (`#064e3b`), Amber 600/700 accent, Stone palette for neutrals. Custom backgrounds: `bg-soft-cream` (#FAF9F6), `bg-mineral-sage` (#F6F7F6), `bg-warm-stone` (#F2F0ED).
- **No hover effects** — all interactive elements are static (except modals/accordions).
- **Generous spacing** — `py-32` for sections, `rounded-2xl`/`rounded-3xl` for cards.
- **Section headers** use decorative amber line + uppercase tracking label above serif heading.

## Adding Data

### New Spa
1. Add entry to `src/data/spas.ts` with unique `id` and `url` slug.
2. Create treatment file `src/data/treatments/spa-{id}-treatments.ts` and register in `index.ts`.
3. Create day pass file `src/data/day-passes/spa-{id}-day-passes.ts` (if applicable) and register in `index.ts`.
4. Add images to `public/images/spas/`.
5. Run tests — spa data validation and intro text tests will catch issues.

### New Blog Post
1. Create `content/blog/{slug}.mdx` with required frontmatter (see `blog.md`).
2. Add images to `public/images/blog/` and register alt text in `images.json`.
3. Use dynamic price components, not hardcoded prices.
4. `publishedAt` must be today or past to appear.

## Testing

Tests in `src/__tests__/` validate:
- Spa data structure completeness and required fields.
- Intro text accuracy (facility counts, age policies, access labels must match data).
- Filtering logic (multi-filter AND/OR combinations).
- Utility functions and schema generation.
- Blog price component rendering.
- Outbound click tracking.

## Key Documentation

- `TECHNICAL_DOCUMENTATION.md` — Full tech stack, data structures, component architecture.
- `STYLE_GUIDE.md` — Design system, typography, colors, component patterns.
- `blog.md` — Blog post creation guide with MDX component docs.
- `src/data/treatments/README.md` — Treatment data structure.
- `src/data/day-passes/README.md` — Day pass data structure.
