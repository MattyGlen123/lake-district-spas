# Location FAQ Implementation Examples

This document shows the real implementation from Windermere (the first location FAQ) to guide FAQ creation for subsequent locations.

## File Structure

```
src/data/location-faqs/
├── index.ts                    # Exports getLocationFAQs() and getAllLocationFAQs()
├── helpers.ts                  # Location-level aggregate helpers
└── windermere-faqs.tsx         # Windermere FAQs (4 FAQs)
```

## Key Differences from Spa FAQs

1. **Function receives `Spa[]`** not a single `Spa` — the array contains all spas for that location
2. **Find specific spas** by ID within the function: `const lowWoodBay = spas.find(s => s.id === 7)`
3. **Null-safe access** — always check `lowWoodBay ?` before calling helpers
4. **Links go to spa detail pages** — `/spa/${spa.url}#section` not `#section`
5. **Can link to other location pages** — `/location/spas-in-{slug}`
6. **Comparative angle** — answers compare/contrast spas rather than describing one

## Function Signature

```typescript
export function get{PascalCaseLocation}FAQs(spas: Spa[]): FAQ[] {
```

## Imports Pattern

```typescript
import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentPrice,
  getTreatmentBrandsText,
  getThermalFacilitiesCount,
  getAgePolicy,
} from '@/data/faqs/helpers';
```

Note: helpers are imported from `@/data/faqs/helpers` (the existing spa-level helpers), NOT from `./helpers`.

## Finding Spas & Extracting Values

```typescript
export function getWindermereFAQs(spas: Spa[]): FAQ[] {
  const lowWoodBay = spas.find((s) => s.id === 7);
  const beechHill = spas.find((s) => s.id === 10);

  // Always null-check before calling helpers
  const lwbThermalCount = lowWoodBay ? getThermalFacilitiesCount(lowWoodBay) : null;
  const lwbBrandsText = lowWoodBay ? getTreatmentBrandsText(lowWoodBay.id) : null;
  const bhCouplesPrice = beechHill ? getTreatmentPrice(beechHill.id, 'Couples Full Body Massage') : null;
```

## Link Patterns

```typescript
// Link to a spa detail page
<Link href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}`} className="underline">
  {lowWoodBay?.name || 'Low Wood Bay Spa'}
</Link>

// Link to a section on a spa detail page
<Link href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}#treatments`} className="underline">
  {beechHill?.name || 'Beech Hill Hotel & Spa'}
</Link>

// Link to a specific treatment on a spa page
<Link href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}#couples-full-body-massage`} className="underline">
  Couples Full Body Massage
</Link>

// Link to a specific day pass on a spa page
<Link href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}#low-wood-bay-hideaway-retreat`} className="underline">
  The Hideaway Retreat
</Link>

// Link to another location page
<Link href="/location/spas-in-bowness-on-windermere" className="underline">
  spas in Bowness on Windermere
</Link>
```

## Spa Name Fallbacks

Always provide fallback for spa name and URL in case the spa isn't found:

```typescript
{lowWoodBay?.name || 'Low Wood Bay Spa'}
`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}`
```

## Example FAQ: Comparison (Multiple Spas)

```typescript
{
  question: 'What are the best spa hotels in Windermere?',
  answer: (
    <>
      Windermere has two spa hotels on the shores of England&apos;s largest lake, each offering a distinctly different experience.{' '}
      <Link href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}`} className="underline">
        {lowWoodBay?.name || 'Low Wood Bay Spa'}
      </Link>{' '}
      is the larger resort option with two outdoor infinity pools, {lwbThermalCount || 6} thermal experiences...
      <br />
      <br />
      The key difference for many visitors is access policy...
    </>
  ),
  schemaText: `Windermere has two spa hotels on the shores of England's largest lake. ${lowWoodBay?.name || 'Low Wood Bay Spa'} is the larger resort...`,
}
```

## Location Page Integration

In the location page file (`src/app/location/spas-in-{slug}/page.tsx`):

```typescript
// Imports
import { HelpCircle } from 'lucide-react';
import FAQs, { generateFAQSchema } from '@/components/FAQs';
import { getLocationFAQs } from '@/data/location-faqs';

// Outside component
const faqs = getLocationFAQs('Windermere');

// In JSX, after LocationFeaturedSpas:
{faqs.length > 0 && (
  <div className="container mx-auto px-4 md:px-8">
    <FAQs
      id="faq"
      title="Common Questions"
      subtitle="Frequently asked questions about spas in Windermere."
      icon={HelpCircle}
      faqs={faqs}
    />
  </div>
)}
{faqs.length > 0 && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
  />
)}
```

## Registration in index.ts

```typescript
import { getWindermereFAQs } from './windermere-faqs';

const faqGeneratorsByLocation: Record<string, (spas: Spa[]) => FAQ[]> = {
  Windermere: getWindermereFAQs,
};
```

## Quality Checklist

- All dynamic values use helpers with null checks (no hardcoded prices, names, etc.)
- NO hyphens in prose ("adults only" not "adults-only", "16 metre" not "16-metre")
- Both JSX answer and schemaText provided for every FAQ
- Links use `className="underline"` (no font-weight or color classes)
- Links point to spa detail pages (`/spa/{slug}#section`) not on-page anchors
- Spa names use `spa?.name || 'Fallback Name'`
- Spa URLs use `spa?.url || 'fallback-slug'`
- Apostrophes use `&apos;` in JSX
- Line breaks use `<br />` (self-closing with space)
- Answers take the comparative/geographic perspective, not the single-spa perspective
- No overlap with existing spa FAQ topics for the spas at this location
- File registered in `index.ts`
- FAQs component and Schema.org script added to location page
