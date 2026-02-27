.claude/skills/# CLAUDE.md

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

> Compressed diagrams are in `.claude/diagrams/`. Load them at session start for accurate context without file-read overhead.
>
> | File | Covers |
> |------|--------|
> | `00-overview.md` | System-wide — data, libs, pages |
> | `01-data-layer.md` | Spa entity model and relationships |
> | `02-page-routing.md` | App Router URL structure |
> | `03-component-hierarchy.md` | Spa detail page component tree |
> | `04-data-flow.md` | How data flows from TS files to pages |
> | `05-blog-system.md` | MDX pipeline and blog utilities |
> | `06-filtering-logic.md` | Filter/sort/paginate flow |
> | `07-location-pages.md` | Location page structure and data flow |

### Data Layer (no backend — all local TypeScript)

See `.claude/diagrams/01-data-layer.md` for the full entity model. Key access patterns:

- **`spaData`** — exported array from `src/data/spas.ts`. ~22 spas, each with `id` and `url` (slug).
- **`getTreatmentsBySpaId(id)`** — `src/data/treatments/index.ts`
- **`getDayPassesBySpaId(id)`** — `src/data/day-passes/index.ts`
- **`getFAQsBySpaId(id)`** — `src/data/faqs/index.ts`
- **`src/types/spa.ts`** — Core types: `Spa`, `Treatment`, `DayPassOption`, `AccessLabel`.

### Pages (App Router)

See `.claude/diagrams/02-page-routing.md` for full URL structure. All pages are statically generated. `/spas` is the only `'use client'` page (filter/sort/paginate). Location pages are 13 individual static folders under `src/app/location/`.

### Blog System

- MDX files in `content/blog/` with YAML frontmatter (see `docs/blog.md` for full spec).
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

See `docs/STYLE_GUIDE.md` for full reference. Key rules:

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

1. Create `content/blog/{slug}.mdx` with required frontmatter (see `docs/blog.md`).
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

## Content Directories

- **`.claude/content-in/`** — Input materials. Place files here as source context for AI agents to read. Keep contributions and source materials in this folder.
- **`.claude/content-out/`** — Agent output. AI-generated content goes here, kept separate from the input to prevent self-biasing on previous output. Agents should write their work here.

## Key Documentation

- `docs/TECHNICAL_DOCUMENTATION.md` — Full tech stack, data structures, component architecture.
- `docs/STYLE_GUIDE.md` — Design system, typography, colors, component patterns.
- `docs/blog.md` — Blog post creation guide with MDX component docs.
- `docs/treatments.md` — Treatment data structure.
- `docs/day-passes.md` — Day pass data structure.
