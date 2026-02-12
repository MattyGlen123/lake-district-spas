# Location FAQs Skill — Implementation Plan

## What We're Building

A new Claude Code skill (`.claude/skills/location-faqs/SKILL.md`) that follows a research-driven workflow to create SEO-optimized FAQs for each of the 13 location pages. The skill produces `.tsx` FAQ files in a new `src/data/location-faqs/` directory.

---

## Skill Workflow (Interactive Steps)

### Step 1: Receive Location Data

The skill asks which location to start with. The user provides the location name (matching a key from `locationPageSlugs`). The skill then automatically reads:

- The location page file (`src/app/location/spas-in-{slug}/page.tsx`) for intro content and hero data
- All spas at that location (filtered from `spaData` by `spa.location`)
- Day passes for those spas (via `getDayPassOptionsBySpaId`)
- Treatments for those spas (via `getTreatmentsBySpaId`)
- **Existing spa FAQ files** for those spas (from `src/data/faqs/spa-{id}-faqs.tsx`) to identify already-covered topics/keywords

The skill outputs a summary of the location data and a list of topics already covered by spa FAQs, to ensure no overlap.

### Step 2: Generate Keywords for Research

Based on the location data and existing spa FAQ topics, the skill generates **up to 8 keywords** for the user to research in Google Keyword Planner. Keywords should focus on:

- Location + spa (e.g. "windermere spa day", "spas near windermere")
- Location + activity (e.g. "windermere spa and afternoon tea")
- Location + intent (e.g. "best spa in windermere", "windermere spa prices")
- Comparative/area terms (e.g. "windermere vs bowness spa")

**Avoid:** Keywords already targeted by spa-level FAQs for spas in that location.

The user goes away and researches these keywords, then provides 1-2 CSV reports.

### Step 3: Analyse Keyword Reports

The skill analyses the CSV data, targeting:

- **Primary:** Low competition keywords with 10–100 monthly searches
- **Fallback:** Medium competition keywords (if fewer than 4 viable low-competition keywords exist)

Output: A ranked keyword analysis with recommendations for which 4 keywords to target.

### Step 4: Generate 4 FAQs

The skill generates 4 location FAQs based on the selected keywords. Each FAQ follows the same `FAQ[]` interface as spa FAQs (`question`, `answer` as JSX, `schemaText` as plain text).

**Key differences from spa FAQs:**

- Generator function signature: `get{Location}FAQs(spas: Spa[]): FAQ[]`
- Internal links point to spa detail pages: `/spa/{slug}#treatments`, `/spa/{slug}#{day-pass-id}`
- Can link to other location pages: `/location/spas-in-{slug}`
- May reference multiple spas in a single answer
- Uses existing helpers from `src/data/faqs/helpers.ts` where possible (e.g. `getDayPassPrice`, `getTreatmentPrice`)
- New location-specific helpers go in `src/data/location-faqs/helpers.ts`

---

## File Structure to Create

```
src/data/location-faqs/
├── index.ts                           # Exports getFAQsByLocation()
├── helpers.ts                         # Location-specific aggregate helpers
├── windermere-faqs.tsx                # Example: Windermere location FAQs
├── bowness-on-windermere-faqs.tsx     # Slug-based naming
└── ...                                # One file per location (as completed)
```

### `index.ts` Pattern

```typescript
import { FAQ } from '@/components/FAQs';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';
import { getWindermereFAQs } from './windermere-faqs';
// ... more imports as locations are added

const faqGeneratorsByLocation: Record<string, (spas: Spa[]) => FAQ[]> = {
  Windermere: getWindermereFAQs,
  // ... more locations as they are added
};

export function getLocationFAQs(location: string): FAQ[] {
  const generator = faqGeneratorsByLocation[location];
  if (!generator) return [];

  const spas = spaData.filter((s) => s.location === location);
  if (spas.length === 0) return [];

  return generator(spas);
}
```

### FAQ File Pattern (e.g. `windermere-faqs.tsx`)

```typescript
import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import { getDayPassPrice, getTreatmentPrice, getTreatmentIdByName } from '@/data/faqs/helpers';
// import location-specific helpers if needed

export function getWindermereFAQs(spas: Spa[]): FAQ[] {
  // Find specific spas by ID or name
  const lowWoodBay = spas.find(s => s.id === 7);
  const beechHill = spas.find(s => s.id === 10);

  // Extract dynamic values using existing helpers
  const dayPassPrice = lowWoodBay ? getDayPassPrice(lowWoodBay.id, 'low-wood-bay-twilight-thermal') : null;

  return [
    {
      question: 'What spas are in Windermere?',
      answer: (
        <>
          Answer text with{' '}
          <Link href="/spa/low-wood-bay-spa#day-passes" className="underline">
            Low Wood Bay
          </Link>{' '}
          links pointing to spa detail pages.
        </>
      ),
      schemaText: 'Plain text version for Schema.org markup.',
    },
    // ... 3 more FAQs
  ];
}
```

### Location Page Integration

Each location page (e.g. `src/app/location/spas-in-windermere/page.tsx`) will import and render FAQs after `LocationFeaturedSpas`, reusing the existing `FAQs` component:

```typescript
import FAQs from '@/components/FAQs';
import { getLocationFAQs } from '@/data/location-faqs';

// Inside the component:
const faqs = getLocationFAQs('Windermere');

// In JSX, after LocationFeaturedSpas:
{faqs.length > 0 && <FAQs faqs={faqs} />}
```

---

## Skill File Structure

```
.claude/skills/location-faqs/
├── SKILL.md                          # Main skill definition
└── references/
    └── implementation-examples.md    # Real code examples (created after first location)
```

---

## Writing & Style Rules (Carried Over from Spa FAQs)

- NO hyphens in prose (e.g. "adults only" not "adults-only")
- Direct answer first in every FAQ
- 150–250 words per JSX answer, 80–150 words per schemaText
- Use `&apos;` for apostrophes in JSX
- Use `<br />` for paragraph breaks
- Always provide fallback values: `{price || '£60'}`
- Link styling: `className="underline"` (matching spa FAQ convention)
- Never hardcode prices, durations, or facility counts — always use helpers
- All template literals use `${spa.name}` not hardcoded names

---

## Implementation Order

1. **Create the skill file** (`.claude/skills/location-faqs/SKILL.md`) with the full workflow
2. **Create `src/data/location-faqs/` directory** with `index.ts` and `helpers.ts` scaffolding
3. **Run the skill for the first location** — this produces the first FAQ file and validates the pattern
4. **Integrate FAQs into the location page** — add the `FAQs` component to the location page template
5. **Create `references/implementation-examples.md`** after the first location is complete, using it as the reference for subsequent locations
6. **Repeat** for remaining 12 locations

---

## Questions Resolved (Summary)

| Decision | Answer |
|---|---|
| FAQ placement on page | After `LocationFeaturedSpas` |
| Component to use | Reuse existing `FAQs` component |
| Internal links | Point to spa detail pages (e.g. `/spa/low-wood-bay-spa#treatments`) |
| Cross-location links | Yes, link to other location pages where relevant |
| Function signature | `get{Location}FAQs(spas: Spa[]): FAQ[]` |
| Location identifier | String key from `locationPageSlugs` |
| Helpers | New `src/data/location-faqs/helpers.ts` + reuse existing helpers |
| Overlap avoidance | Keyword/topic level only; same facts OK if targeting different keywords |
| Read existing spa FAQs | Yes, as part of analysis step |
| Keyword count | Up to 8 per location |
| FAQ count | 4 per location, always |
| Thin keywords fallback | Extend to medium competition |
| File naming | Slug-based (e.g. `windermere-faqs.tsx`) |
| Rollout scope | All 13 locations |
