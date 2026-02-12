---
name: location-faqs
description: Research-driven FAQ creation workflow for Lake District location pages. Creates SEO-optimized FAQ sections targeting location-level keywords that don't overlap with existing spa FAQs. Produces 4 FAQs per location with Schema markup, dynamic data helpers, and links to spa detail pages. Designed for all 13 location pages in the Next.js spa directory.
---

# Location FAQ Research & Creation Skill

## Overview

This skill creates location-level FAQs for the 13 location pages on lakedistrictspas.co.uk. Unlike spa FAQs (which target branded spa keywords), location FAQs target geographic search terms like "windermere spa day" or "best spa in borrowdale". The workflow ensures no keyword overlap with existing spa-level FAQs.

## Workflow

The process has 4 interactive steps:

1. **Receive Location Data** — User provides location, skill gathers context
2. **Generate Keywords** — Skill outputs up to 8 keywords for user to research
3. **Analyse Keyword Reports** — User provides CSV, skill selects target keywords
4. **Generate 4 FAQs** — Skill outputs complete FAQ file

---

## Step 1: Receive Location Data

Ask the user which location to work on. They will provide a location name matching a key from `locationPageSlugs` in `src/lib/locationPages.ts`.

### Available Locations

```
Windermere, Ambleside, Appleby-in-Westmorland, Backbarrow, Newby Bridge,
Bassenthwaite, Borrowdale, Grange-over-Sands, Grasmere, Great Langdale,
Penrith, Ullswater, Bowness-on-Windermere
```

### Data to Gather

Once the user provides the location, read the following:

1. **Location page file** — `src/app/location/spas-in-{slug}/page.tsx`
   - Extract `heroContent` and `introContent` to understand the location's positioning
   - Note which spas are filtered for this location

2. **Spas at this location** — Filter `spaData` from `src/data/spas.ts` where `spa.location === locationName`
   - Note spa IDs, names, URLs, key facilities, access policies, age policies

3. **Day passes** — For each spa, read `src/data/day-passes/spa-{id}-day-passes.ts`
   - Note package names, prices, durations, IDs

4. **Treatments** — For each spa, read `src/data/treatments/spa-{id}-treatments.ts`
   - Note brands, signature treatments, price ranges

5. **Existing spa FAQs** — For each spa, read `src/data/faqs/spa-{id}-faqs.tsx`
   - List the questions and topics already covered
   - These topics/keywords must be avoided in location FAQs

### Output

Present a summary to the user:

```
## Location: {Name}
- Spas: {list with IDs}
- Key features: {summary}
- Existing spa FAQ topics already covered:
  - {list of questions from spa FAQs for these spas}
- Ready for keyword research: Yes
```

---

## Step 2: Generate Keywords for Research

Generate **up to 8 keywords** for the user to research in Google Keyword Planner.

### Keyword Categories

**Location + spa intent:**
- "{location} spa day"
- "{location} spa hotel"
- "spas in {location}"
- "best spa in {location}"
- "spa near {location}"

**Location + activity:**
- "{location} spa and afternoon tea"
- "{location} couples spa"
- "{location} spa break"

**Location + practical:**
- "{location} spa prices"
- "{location} spa day deals"

**Nearby/comparative (if relevant):**
- "{location} vs {nearby location} spa"
- "spas near {nearby town/lake}"

### Avoid

- Keywords already targeted by spa-level FAQs for spas in this location
- Branded spa name keywords (those belong to spa FAQs)
- Generic "Lake District spa" terms (covered by other pages)
- Very long tail terms unlikely to get volume

### Output

Present the keywords as a numbered list:

```
## Keywords to Research (max 8)

Please research these in Google Keyword Planner and provide the CSV report(s):

1. windermere spa day
2. spas in windermere
3. best spa windermere
4. windermere spa prices
5. windermere spa and afternoon tea
6. windermere couples spa
7. spa near windermere lake
8. windermere spa break
```

---

## Step 3: Analyse Keyword Reports

The user will provide 1-2 CSV files from Google Keyword Planner. The CSV format is:

```
Keyword,Currency,Avg. monthly searches,Three month change,YoY change,Competition,Competition (indexed value),Top of page bid (low range),Top of page bid (high range)
```

### Analysis Criteria

**Primary targets:** Low competition keywords with 10-100 monthly searches
**Fallback targets:** Medium competition keywords (if fewer than 4 viable low-competition keywords)

### Output

Create a keyword analysis:

```
## Keyword Analysis for {Location}

### Recommended Keywords (ranked)

| # | Keyword | Monthly Searches | Competition | Recommendation |
|---|---------|-----------------|-------------|----------------|
| 1 | ... | ... | ... | Target — FAQ topic: "..." |
| 2 | ... | ... | ... | Target — FAQ topic: "..." |
| 3 | ... | ... | ... | Target — FAQ topic: "..." |
| 4 | ... | ... | ... | Target — FAQ topic: "..." |

### Excluded Keywords
| Keyword | Reason |
|---------|--------|
| ... | Too high competition / No volume / Overlaps with spa FAQ |

### Proposed FAQ Questions

1. "Question targeting keyword 1?"
2. "Question targeting keyword 2?"
3. "Question targeting keyword 3?"
4. "Question targeting keyword 4?"
```

Wait for user approval of the 4 proposed questions before proceeding to Step 4.

---

## Step 4: Generate 4 FAQs

Generate the complete FAQ file for the location.

### File Location

`src/data/location-faqs/{slug}-faqs.tsx`

Where `{slug}` is the location slug from `locationPageSlugs` (e.g. `windermere`, `bowness-on-windermere`).

### Function Signature

```typescript
export function get{PascalCaseLocation}FAQs(spas: Spa[]): FAQ[] {
```

The function receives the array of spas for that location (already filtered by the caller).

### Imports Pattern

```typescript
import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
// Reuse existing helpers from spa FAQs
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentPrice,
  getTreatmentIdByName,
  getTreatmentBrandsText,
  getThermalFacilitiesCount,
  getAgePolicy,
  getSpaAccessPriceRange,
  // ... only import what's needed
} from '@/data/faqs/helpers';
// Import location-specific helpers if needed
// import { ... } from './helpers';
```

### Finding Spas Within the Function

```typescript
export function getWindermereFAQs(spas: Spa[]): FAQ[] {
  const lowWoodBay = spas.find(s => s.id === 7);
  const beechHill = spas.find(s => s.id === 10);

  // Extract dynamic values
  const lwbDayPassPrice = lowWoodBay ? getDayPassPrice(lowWoodBay.id, 'low-wood-bay-twilight-thermal') : null;
  // ...
```

### Internal Linking Rules

Location FAQs link **to spa detail pages**, not on-page anchors:

```typescript
// Link to a spa's treatments section
<Link href="/spa/low-wood-bay-spa#treatments" className="underline">
  Low Wood Bay treatments
</Link>

// Link to a specific day pass on a spa page
<Link href="/spa/low-wood-bay-spa#low-wood-bay-sail-spa" className="underline">
  Sail & Spa Day
</Link>

// Link to another location page
<Link href="/location/spas-in-bowness-on-windermere" className="underline">
  Bowness on Windermere spas
</Link>

// Link to a spa detail page generally
<Link href="/spa/beech-hill-hotel-spa" className="underline">
  Beech Hill Hotel & Spa
</Link>
```

**Important:** Use the spa's `url` field from `spaData` for the slug (e.g. `spa.url` gives `"low-wood-bay-spa"`). Build the link as `/spa/${spa.url}`.

### FAQ Structure

Each FAQ object:

```typescript
{
  question: 'Location-focused question targeting keyword?',
  answer: (
    <>
      Direct answer first (40-60 words). Reference specific spas with links.
      <br />
      <br />
      Supporting detail (100-150 words). Compare spas, mention prices via helpers,
      link to specific treatments or day passes on spa detail pages.
      <br />
      <br />
      Optional call to action with link to related location page or spa page.
    </>
  ),
  schemaText: 'Plain text version (80-150 words). No HTML/JSX. Use template literals for dynamic values.',
}
```

### Registering the File

After creating the FAQ file, add it to `src/data/location-faqs/index.ts`:

```typescript
import { get{PascalCaseLocation}FAQs } from './{slug}-faqs';

// Add to the map:
'{LocationKey}': get{PascalCaseLocation}FAQs,
```

### Integrating with the Location Page

Add FAQs to the location page file (`src/app/location/spas-in-{slug}/page.tsx`):

```typescript
// Add imports
import { HelpCircle } from 'lucide-react';
import FAQs, { generateFAQSchema } from '@/components/FAQs';
import { getLocationFAQs } from '@/data/location-faqs';

// Get FAQs (inside or outside the component, depending on static needs)
const faqs = getLocationFAQs('{LocationKey}');

// Add to JSX after LocationFeaturedSpas, before Footer:
{faqs.length > 0 && (
  <div className="container mx-auto px-4 md:px-8">
    <FAQs
      id="faq"
      title="Common Questions"
      subtitle="Frequently asked questions about spas in {Location}."
      icon={HelpCircle}
      faqs={faqs}
    />
  </div>
)}

// Add Schema.org JSON-LD to the page's metadata or as a script tag:
{faqs.length > 0 && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
  />
)}
```

---

## Writing & Style Rules

### Critical Rules

- **NO hyphens in prose** — "adults only" not "adults-only", "2 hour" not "2-hour"
- **Direct answer first** — Every FAQ starts with a clear answer in the first sentence
- **Never hardcode data** — Use helper functions for all prices, durations, facility counts
- **Always provide fallbacks** — `{price || '£60'}`, `{thermalCount || 4}`
- **Use `&apos;`** for apostrophes in JSX
- **Use `<br />`** for paragraph breaks (self-closing with space)
- **Link styling** — `className="underline"` for all internal links

### Answer Quality

- 150-250 words per JSX answer
- 80-150 words per schemaText
- Helpful and informative, not salesy
- Specific and practical with real details
- 2-4 internal links per answer
- Reference specific spas by name with links to their detail pages

### Location FAQ Specifics

- Answers should compare/contrast spas when the location has multiple
- Reference the location's character and setting (draw from the intro content)
- Link to other nearby location pages where relevant
- Don't duplicate the spa-level FAQ angle — take the geographic/comparative perspective

---

## Common Pitfalls

- Using on-page anchors (`#treatments`) instead of full spa page links (`/spa/{slug}#treatments`)
- Hardcoding spa names instead of using `spa.name`
- Forgetting to check for `null` when a spa might not exist in the array
- Overlapping with topics already covered in spa-level FAQs
- Using hyphens in prose text
- Missing schemaText on any FAQ
- Forgetting to register the file in `index.ts`
- Forgetting to add the FAQs component to the location page
