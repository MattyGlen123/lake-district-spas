# Mermaid Diagrams — Implementation Plan

## Overview

This plan implements Mermaid diagrams as compressed codebase context for AI sessions, a stop hook for automatic TypeScript validation, and instructions for optional shell aliases. All diagram files live in `.claude/diagrams/`, are committed to the repo, and are treated as living documents to be updated whenever architecture changes.

### Why each diagram type — AI accuracy rationale

| Diagram | Failure mode it prevents |
|---------|--------------------------|
| `00-overview.md` | Claude mis-wires data sources to pages or proposes backend changes to what is a fully static site |
| `01-data-layer.md` | Claude invents fields, uses wrong access patterns, or confuses `Treatment` / `DayPassOption` types |
| `02-page-routing.md` | Claude creates routes in the wrong directory structure or misses the 13-individual-folder pattern for location pages |
| `03-component-hierarchy.md` | Claude suggests components that already exist, or adds logic to the wrong layer (page vs. component) |
| `04-data-flow.md` | Claude adds API calls or server-side fetching to a codebase that is entirely static TypeScript at build time |
| `05-blog-system.md` | Claude hardcodes prices, ignores the `publishedAt` gate, or bypasses the dynamic MDX component system |
| `06-filtering-logic.md` | Claude breaks the OR/AND/special-case facility filter rules or misunderstands the draft-vs-active filter pattern |
| `07-location-pages.md` | Claude creates a catch-all dynamic route instead of the individual static folder pattern, or ignores `getLocationPagePath` null safety |

---

## Scope

- 8 standalone Mermaid diagram files (1 overview + 7 domain-specific)
- CLAUDE.md updated to reference diagrams and trim duplicate prose
- Stop hook script + `settings.local.json` update
- Shell alias reference instructions (not implemented — provided for manual setup)

---

## Step 1 — Create `.claude/diagrams/` directory and diagram files

Create the following 8 files. Each file contains a single Mermaid diagram optimised for AI consumption.

---

### `.claude/diagrams/00-overview.md`

```markdown
# System Overview

\```mermaid
graph TD
    subgraph Data["Data Layer — static TypeScript"]
        spas[spas.ts — spaData array]
        treatments[treatments/spa-N-treatments.ts]
        dayPasses[day-passes/spa-N-day-passes.ts]
        faqs[faqs/index.ts + helpers.ts]
        locationFaqs[location-faqs/index.ts + helpers.ts]
    end

    subgraph Lib["Libraries"]
        spaCatalog[spa-catalog.ts — filter / sort / count]
        locationLib[locationPages.ts — slugs + metadata]
        blogLib[blog.ts — getAllBlogPosts / getRelated]
        prices[prices.ts — price helpers]
        treatCatalog[treatment-catalog.ts]
        dayPassCatalog[day-pass-catalog.ts]
    end

    subgraph Pages["App Router — all statically generated"]
        home[/ — Homepage]
        spasPage[/spas — Listing + filter + sort + paginate]
        spaDetail[/spa/:slug — Spa detail]
        spaDays[/spa-days — Day passes]
        spaTreatments[/spa-treatments — Treatments]
        blog[/blog — Blog list]
        blogPost[/blog/:slug — MDX post]
        location[/location/spas-in-:slug — 13 location pages]
        locations[/locations — Location hub]
        couples[/couples-spa-lake-district]
    end

    spas --> spaDetail
    spas --> spasPage
    spas --> home
    spas --> location
    treatments --> spaDetail
    dayPasses --> spaDetail
    dayPasses --> spaDays
    faqs --> spaDetail
    locationFaqs --> location
    spaCatalog --> spasPage
    locationLib --> location
    blogLib --> blog
    blogLib --> blogPost
    treatCatalog --> spaTreatments
    dayPassCatalog --> spaDays
\```
```

---

### `.claude/diagrams/01-data-layer.md`

```markdown
# Data Layer — Spa Entity Relationships

\```mermaid
erDiagram
    Spa {
        number id PK
        string url "slug — used in /spa/:slug route"
        string name
        string location "matches locationPageSlugs keys"
        AccessLabel[] accessLabels "filter dimension"
        Facilities facilities "9 boolean flags"
        SpaImage[] images
        string[] keyFeatures
        ThermalFacility[] thermalFacilities
        PoolFeature[] poolFeatures
        AccessPolicy[] accessPolicy
        string agePolicy
        number[] relatedSpas "FK array to other spa ids"
        SpaAccessForHotelGuest spaAccessForHotelGuest
        string hotelBookingUrl
        string dayPassBookingUrl
        string treatmentBookingUrl
    }

    Treatment {
        number spaId FK
        string name
        TreatmentCategory category "Massage | Facial | Body | Hands and Feet"
        string duration
        string price
        string brand
        string bookingUrl
    }

    DayPassOption {
        string id PK
        number spaId FK
        string packageName
        number priceGBP
        number pricePerPerson
        number spaDuration
        boolean treatmentsIncluded
        boolean refreshmentsIncluded
        boolean mealIncluded
        string[] included
        string daysAvailable
        string ageRestriction
        string lastVerified
    }

    FAQ {
        number spaId FK
        string question
        string answer
        string answerHtml
    }

    LocationFAQ {
        string location FK
        string question
        string answer
    }

    Spa ||--o{ Treatment : "src/data/treatments/spa-N-treatments.ts"
    Spa ||--o{ DayPassOption : "src/data/day-passes/spa-N-day-passes.ts"
    Spa ||--o{ FAQ : "src/data/faqs/index.ts"
    Spa }o--o{ Spa : "relatedSpas[]"
\```
```

---

### `.claude/diagrams/02-page-routing.md`

```markdown
# App Router — URL Structure

\```mermaid
graph LR
    root["src/app/"]

    root --> home["page.tsx → /"]
    root --> spas["spas/page.tsx → /spas\n'use client' — filter/sort/paginate"]
    root --> spa["spa/[slug]/page.tsx → /spa/:slug\ngenerateStaticParams from spaData[].url"]
    root --> spaDays["spa-days/page.tsx → /spa-days"]
    root --> spaTreat["spa-treatments/page.tsx → /spa-treatments"]
    root --> blog["blog/page.tsx → /blog"]
    root --> blogSlug["blog/[slug]/page.tsx → /blog/:slug\nnext-mdx-remote/rsc — MDX"]
    root --> locationSlug["location/spas-in-*/page.tsx\n13 individual folders → /location/spas-in-:slug"]
    root --> locations["locations/page.tsx → /locations"]
    root --> couples["couples-spa-lake-district/page.tsx"]
    root --> about["about/page.tsx → /about"]
    root --> partnership["partnership/page.tsx → /partnership"]

    spa --> staticNote["generateStaticParams\n→ spaData.map(s => s.url)"]
    blogSlug --> blogNote["generateStaticParams\n→ getAllBlogSlugs()"]
    locationSlug --> locationNote["13 static folders\nsrc/lib/locationPages.ts drives slugs"]
\```
```

---

### `.claude/diagrams/03-component-hierarchy.md`

```markdown
# Spa Detail Page — Component Tree

\```mermaid
graph TD
    SpaDetailPage["SpaDetailPage\n/spa/[slug]/page.tsx"]

    SpaDetailPage --> schema["ld+json schema\ngenerateSpaSchema + generateFAQSchema"]
    SpaDetailPage --> Header
    SpaDetailPage --> Breadcrumbs["Breadcrumbs\nlocation + spaName"]
    SpaDetailPage --> SpaHero["SpaHero\nimages, name, location, keyFeatures, accessLabels"]
    SpaDetailPage --> QuickFactsBar["QuickFactsBar\nfacilities booleans, agePolicy, accessLabels"]
    SpaDetailPage --> BackButton
    SpaDetailPage --> SpaIntroduction["SpaIntroduction\nspa.intro text"]
    SpaDetailPage --> JumpToSection["JumpToSection\nanchors to page sections"]
    SpaDetailPage --> ThermalFacilities["ThermalFacilities\nspa.thermalFacilities[]"]
    SpaDetailPage --> PoolFeatures["PoolFeatures\nspa.poolFeatures[]"]
    SpaDetailPage --> DayPasses["DayPasses\nDayPassOption[] from day-passes/index.ts"]
    SpaDetailPage --> Treatments["Treatments\nTreatment[] from treatments/index.ts"]
    SpaDetailPage --> AccessPolicy["AccessPolicy\nspa.accessPolicy[]"]
    SpaDetailPage --> BookVisitCTA["BookVisitCTA\noutbound links + UTM params"]
    SpaDetailPage --> SpaNavigation["SpaNavigation\nprev/next spa"]
    SpaDetailPage --> RelatedSpas["RelatedSpas\nspa.relatedSpas[] → lookup in spaData"]
    SpaDetailPage --> FAQs["FAQs\ngetFAQsBySpaId(spa.id)"]
    SpaDetailPage --> Footer
\```
```

---

### `.claude/diagrams/04-data-flow.md`

```markdown
# Data Flow — Static TypeScript to Rendered Pages

\```mermaid
flowchart TD
    spaData["spaData\nsrc/data/spas.ts"]
    treatIndex["getTreatmentsBySpaId(id)\nsrc/data/treatments/index.ts"]
    dayPassIndex["getDayPassesBySpaId(id)\nsrc/data/day-passes/index.ts"]
    faqIndex["getFAQsBySpaId(id)\nsrc/data/faqs/index.ts"]
    locationFaqIndex["getLocationFAQs(location)\nsrc/data/location-faqs/index.ts"]

    spaData --> |"find by url slug"| spaDetail["SpaDetailPage\n/spa/:slug"]
    treatIndex --> spaDetail
    dayPassIndex --> spaDetail
    faqIndex --> spaDetail

    spaData --> |"applyFilters + sortSpas"| spaCatalog["spa-catalog.ts"]
    spaCatalog --> |"usePagination"| spasPage["SpasPage\n/spas — client component"]

    spaData --> |"filter: spa.location === name"| locationPage["LocationPage\n/location/spas-in-*"]
    locationFaqIndex --> locationPage

    spaData --> |"first 6 hand-picked IDs"| homepage["Homepage\n/"]

    spaData --> |"generateStaticParams at build"| buildTime["Static Generation\nnpm run build"]

    blogMDX["content/blog/*.mdx"] --> |"gray-matter + readingTime"| blogLib["blog.ts"]
    blogLib --> blogList["BlogListPage\n/blog"]
    blogLib --> blogPost["BlogPostPage\n/blog/:slug"]
\```
```

---

### `.claude/diagrams/05-blog-system.md`

```markdown
# Blog System — MDX Pipeline

\```mermaid
flowchart TD
    mdxFiles["content/blog/*.mdx\nYAML frontmatter + MDX content"]

    subgraph Frontmatter["Required Frontmatter Fields"]
        title
        excerpt
        publishedAt["publishedAt — must be today or past to publish"]
        category["category: guides | comparisons | seasonal | facilities | locations"]
        tags["tags: string[]"]
        featuredImage
        featuredImageAlt
    end

    mdxFiles --> |"gray-matter parse"| Frontmatter
    mdxFiles --> |"next-mdx-remote/rsc"| BlogPostPage

    blogLib["src/lib/blog.ts"]
    blogLib --> |"getAllBlogPosts()\nfilter publishedAt ≤ now\nsort newest first"| BlogListPage["/blog"]
    blogLib --> |"getBlogPostBySlug(slug)"| BlogPostPage["/blog/:slug"]
    blogLib --> |"getRelatedPosts(slug)\nscore: +2 same category, +1 per shared tag"| BlogPostPage

    subgraph MDXComponents["Dynamic MDX Components — never hardcode prices"]
        SpaAccessPrice
        DayPassPrice
        DayPassLink
        TreatmentLink
    end

    BlogPostPage --> MDXComponents

    images["public/images/blog/"]
    imagesJson["public/images/blog/images.json\ncentralised alt text"]
    images --> BlogPostPage
    imagesJson --> BlogPostPage
\```
```

---

### `.claude/diagrams/06-filtering-logic.md`

```markdown
# Spas Page — Filter, Sort, and Pagination Flow

\```mermaid
flowchart TD
    spaData["spaData array\n~22 spas"]

    subgraph FiltersState["SpaFiltersState"]
        accessLabels["accessLabels: AccessLabel[]\nOR match — spa must have at least one"]
        location["location: string\nexact match or 'All Locations'"]
        facilities["facilities: string[]\nmixed logic — see below"]
    end

    spaData --> applyFilters["applyFilters(spa, filters)\nspa-catalog.ts"]
    FiltersState --> applyFilters

    subgraph FacilityLogic["Facility filter logic"]
        poolOR["indoorPool | outdoorPool → OR\nany selected pool type matches"]
        iceSpecial["iceRoom → checks iceRoom OR coldPlunge\ntreat as equivalent"]
        otherAND["all other facilities → AND\nspa must have every selected facility"]
    end

    applyFilters --> FacilityLogic
    FacilityLogic --> filtered["Filtered spa array"]

    filtered --> |"sortSpas(spas, sortBy)"| sorted["Sorted array\nname-asc | name-desc | location-asc"]

    sorted --> usePagination["usePagination hook\nitemsPerPage = 12\nresets on filter or sort change"]
    usePagination --> paginatedSpas["Paginated results → SpaGrid"]

    useDraftFilters["useDraftFilters hook\ndraft state — apply only on modal confirm\nURL not synced"] --> FiltersState

    pageTokens["pageTokens\nencode page numbers for PaginationControls"] --> usePagination
\```
```

---

### `.claude/diagrams/07-location-pages.md`

```markdown
# Location Pages — Structure and Data Flow

\```mermaid
flowchart TD
    locationLib["src/lib/locationPages.ts"]

    subgraph Exports["Exports"]
        slugMap["locationPageSlugs\nRecord name→slug — 13 entries\ne.g. Windermere → windermere"]
        metadata["locationMetadata\nLocationMeta[] — name, slug, image, tagline"]
        getSlug["getLocationPageSlug(name) → slug | null"]
        getPath["getLocationPagePath(name) → /location/spas-in-:slug | null"]
    end

    locationLib --> Exports

    spaData["spaData"] --> |"filter: spa.location === locationName"| localSpas["Spas at this location"]

    localSpas --> LocationPage["src/app/location/spas-in-*/page.tsx\n13 individual static page folders"]
    metadata --> LocationPage
    locationFaqs["src/data/location-faqs/\ngetLocationFAQs(location)"] --> LocationPage

    LocationPage --> |"static build"| rendered["13 URLs:\n/location/spas-in-windermere\n/location/spas-in-ambleside\n... etc"]

    getPath --> |"used in SideMenu + internal links\nreturns null if no page exists yet"| internalLinks["Internal linking\nSideMenu/links.ts, spa cards"]
\```
```

---

## Step 2 — Update CLAUDE.md

### What to change

**Add a new "Context Diagrams" section** immediately after the "Architecture" heading, before any sub-sections. This section lists all diagram files so Claude loads them immediately at the start of a session.

**Trim the verbose prose** in the Data Layer section — replace the bullet-point file descriptions with a one-line summary and a link to the relevant diagram. The diagram carries the structural information; CLAUDE.md should carry conventions and rules.

### Specific edits

**Add this section after the `## Architecture` heading:**

```markdown
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
```

**Trim the "Data Layer" sub-section.** Replace the current block:

```markdown
### Data Layer (no backend — all local TypeScript)

- **`src/data/spas.ts`** — Central spa database (~22 spas). Exported as `spaData`. Each spa has an `id` (number), `url` (slug), facilities, images, access policies, related spas.
- **`src/data/treatments/`** — One file per spa (`spa-{id}-treatments.ts`). Access via `getTreatmentsBySpaId(id)` or `getAllTreatments()` from the index.
- **`src/data/day-passes/`** — One file per spa (`spa-{id}-day-passes.ts`). Access via `getDayPassesBySpaId(id)` or `getDayPassOptionsBySpaId(id)` from the index.
- **`src/data/faqs/`** — FAQ generation helpers per spa.
- **`src/types/spa.ts`** — Core types: `Spa`, `Treatment`, `DayPass`, `AccessLabel`, etc.
- **`src/types/blog.ts`** — Blog types: `BlogPostMeta`, `BlogPost`.
```

With this trimmed version:

```markdown
### Data Layer (no backend — all local TypeScript)

See `.claude/diagrams/01-data-layer.md` for the full entity model. Key access patterns:

- **`spaData`** — exported array from `src/data/spas.ts`. ~22 spas, each with `id` and `url` (slug).
- **`getTreatmentsBySpaId(id)`** — `src/data/treatments/index.ts`
- **`getDayPassesBySpaId(id)`** — `src/data/day-passes/index.ts`
- **`getFAQsBySpaId(id)`** — `src/data/faqs/index.ts`
- **`src/types/spa.ts`** — Core types: `Spa`, `Treatment`, `DayPassOption`, `AccessLabel`.
```

**Trim the "Pages" sub-section.** Replace current list:

```markdown
### Pages (App Router)

- `/` — Homepage with featured spas section (6 hand-picked spas) and hub links to other sections.
- `/spas` — Full spa listing with filtering (access labels, location, facilities), sorting, and pagination. Client component using `spa-catalog.ts` utilities.
- `/spa/[slug]` — Dynamic spa detail pages. Uses `generateStaticParams` from `spaData`.
- `/spa-days` — Spa day passes page with advanced filtering.
- `/blog` — Blog listing with category filtering.
- `/blog/[slug]` — MDX blog posts. Uses `next-mdx-remote/rsc`.
- `/[location]` — 13 location pages (Windermere, Ambleside, Borrowdale, etc.) via `src/lib/locationPages.ts`.
- `/about` — About page.
```

With:

```markdown
### Pages (App Router)

See `.claude/diagrams/02-page-routing.md` for full URL structure. All pages are statically generated. `/spas` is the only `'use client'` page (filter/sort/paginate). Location pages are 13 individual static folders under `src/app/location/`.
```

---

## Step 3 — Stop Hook

### Script: `.claude/scripts/stop-hook.sh`

Create this file and make it executable:

```bash
chmod +x .claude/scripts/stop-hook.sh
```

Script content:

```bash
#!/bin/bash
# Claude Code stop hook
# Runs after Claude finishes each task.
# - If files have changed: runs TypeScript typecheck
# - If typecheck fails: exits with code 2 (Claude Code feeds output back to Claude)
# - If typecheck passes: prints confirmation and exits cleanly
# - AUTO-COMMIT: uncomment the block below to enable (see note)

# Check if there are any uncommitted changes (staged or unstaged)
if git diff --quiet && git diff --cached --quiet; then
  # No changes — nothing to check
  exit 0
fi

echo "Files changed — running TypeScript check..."
OUTPUT=$(npm run typecheck 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "TypeScript errors found. Please fix before finishing:"
  echo ""
  echo "$OUTPUT"
  exit 2  # Exit code 2 = Claude Code feeds this output back to Claude as a message
fi

echo "TypeScript check passed."

# --- OPTIONAL AUTO-COMMIT (disabled by default) ---
# Uncomment to enable auto-commit on clean typecheck.
# Note: Husky pre-commit hook will also run typecheck + test on commit.
# This is safe but means typecheck runs twice. Tests only run on commit, not here.
#
# git add -A
# git commit -m "Auto-commit: Claude task complete, typecheck passed
#
# Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
# --------------------------------------------------

exit 0
```

### `settings.local.json` update

Add a `hooks` key alongside the existing `permissions`:

```json
{
  "permissions": {
    "allow": [
      "Bash(cat:*)",
      "Bash(unzip:*)",
      "Bash(npx tsc:*)",
      "Bash(npm test:*)",
      "Bash(npm run typecheck:*)",
      "Bash(npm run build:*)",
      "Bash(npx eslint:*)",
      "WebSearch",
      "WebFetch(domain:www.inncollectiongroup.com)",
      "WebFetch(domain:www.in-cumbria.com)",
      "WebFetch(domain:www.underscar.co.uk)",
      "WebFetch(domain:underscar.try.be)",
      "WebFetch(domain:www.spaseekers.com)",
      "WebFetch(domain:www.keswick.org)",
      "WebFetch(domain:www.tripadvisor.com)",
      "Bash(wc:*)",
      "Bash(git mv:*)",
      "Bash(head:*)",
      "Bash(grep:*)",
      "Bash(node:*)",
      "Bash(npx jest:*)"
    ]
  },
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/scripts/stop-hook.sh"
          }
        ]
      }
    ]
  }
}
```

Also add `"Bash(npm run typecheck:*)"` to the allow list in `settings.local.json` if not already present (it is — confirmed above).

---

## Step 3b — Manual Context Injection (Interim Method)

Before aliases are configured, load diagram context at the start of any session using one of these two methods:

**Option A — Paste at session start (no setup required)**

At the beginning of a new Claude Code conversation, run:

```bash
cat /Users/matty/Desktop/projects/lake-district-spas/.claude/diagrams/*.md
```

Copy the output and paste it as your opening message prefixed with: `"Here is the current codebase architecture context:"`. Claude will treat it as session context without needing file reads.

**Option B — Use `/context add` in Claude Code**

In the Claude Code session, type:

```
/context add .claude/diagrams/00-overview.md
/context add .claude/diagrams/01-data-layer.md
```

Add whichever diagrams are relevant to the task at hand. For architecture-touching tasks, load all 8.

---

## Step 4 — Shell Alias Reference

> **Do not implement now.** Add these to `~/.zshrc` manually when ready. Once set up, replace the manual injection methods above.

```bash
# Claude Code aliases — Lake District Spas project
# Add to ~/.zshrc

# Load all diagrams as system context at session start (primary alias for most sessions)
alias claude-full='claude --append-system-prompt "$(cat /Users/matty/Desktop/projects/lake-district-spas/.claude/diagrams/*.md)"'

# Fast mode with Haiku for quick tasks (lower cost, no diagram context)
alias claude-fast='claude --model claude-haiku-4-5-20251001'

# Combined: diagrams + Haiku (good for well-defined tasks that still need architecture context)
alias claude-full-fast='claude --model claude-haiku-4-5-20251001 --append-system-prompt "$(cat /Users/matty/Desktop/projects/lake-district-spas/.claude/diagrams/*.md)"'

# Bypass permission prompts — use for trusted, exploratory sessions only
alias claude-yolo='claude --dangerously-skip-permissions'
```

To activate after adding: `source ~/.zshrc`

---

## Step 5 — Maintenance Guidelines

Add this section to the bottom of each diagram file:

```markdown
---
*Update this diagram whenever the [relevant area] changes. Treat as a living document.*
```

**When to update diagrams:**

| Diagram | Update trigger |
|---------|---------------|
| `00-overview.md` | New page added, new data source added, new library created |
| `01-data-layer.md` | New field on `Spa` type, new data collection added, type changes in `spa.ts` |
| `02-page-routing.md` | New route added, route renamed, new layout added |
| `03-component-hierarchy.md` | New component added to spa detail page, component removed or renamed |
| `04-data-flow.md` | New data source wired to a page, new static generation pattern |
| `05-blog-system.md` | New MDX component added, frontmatter fields changed, blog utility added |
| `06-filtering-logic.md` | New filter dimension added, filter logic changed, pagination changes |
| `07-location-pages.md` | New location page added (new slug in `locationPageSlugs`), FAQ structure changes |

**Standard update procedure:** When completing a task that changes architecture, update the relevant diagram file as the final step before committing.

**Recommended regeneration timing (from transcript):** The best moment to update or fully regenerate diagrams is at **PR / feature close** — once a feature is confirmed working. For tasks that touch multiple diagrams, batch-update them all in the same commit as the feature. This keeps the diagram set coherent and prevents drift.

---

## File Summary

| Action | Path |
|--------|------|
| Create | `.claude/diagrams/00-overview.md` |
| Create | `.claude/diagrams/01-data-layer.md` |
| Create | `.claude/diagrams/02-page-routing.md` |
| Create | `.claude/diagrams/03-component-hierarchy.md` |
| Create | `.claude/diagrams/04-data-flow.md` |
| Create | `.claude/diagrams/05-blog-system.md` |
| Create | `.claude/diagrams/06-filtering-logic.md` |
| Create | `.claude/diagrams/07-location-pages.md` |
| Create | `.claude/scripts/stop-hook.sh` |
| Modify | `.claude/settings.local.json` |
| Modify | `CLAUDE.md` |

All diagram files and the stop hook script should be committed to the repo. `.claude/settings.local.json` is already gitignored (local only) — the hooks block lives there and does not need committing.
