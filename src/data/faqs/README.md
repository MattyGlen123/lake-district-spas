# FAQs Data Structure

This directory contains frequently asked questions (FAQs) organized by individual spa.

## File Structure

- `spa-{id}-faqs.tsx` - FAQ data for each spa (e.g., `spa-1-faqs.tsx`)
- `helpers.ts` - Helper functions for dynamically generating FAQ values
- `index.ts` - Exports helper functions to access FAQ data

## Usage

```typescript
import { getFAQsBySpaId, getAllFAQs } from '@/data/faqs';

// Get FAQs for a specific spa
const lodoreFallsFAQs = getFAQsBySpaId(1);

// Get all FAQs across all spas
const allFAQs = getAllFAQs();
```

## Data Structure

Each FAQ entry includes:

- **question**: The FAQ question text (string)
- **answer**: The FAQ answer (string or ReactNode)
  - Can be a plain string for simple answers
  - Can be a ReactNode (JSX) for answers with internal links or formatting
- **schemaText**: Plain text version for Schema.org JSON-LD markup (optional)
  - Used for SEO rich snippets in search results
  - Should be a concise version of the answer (150-250 words recommended)
  - If not provided, the component will attempt to extract text from the ReactNode answer

## FAQ Interface

```typescript
export interface FAQ {
  question: string;
  answer: string | ReactNode;
  schemaText?: string; // Plain text version for Schema.org markup
}
```

## Benefits of This Structure

1. **Matches Other Data Patterns**: Consistent with treatments and day-passes data structure
2. **Smaller Files**: Each spa's FAQs in separate files for easier maintenance
3. **Better Performance**: Only loads FAQs for the spa being viewed
4. **Easy Updates**: Update individual spa files without affecting others
5. **Better Git Diffs**: Changes to one spa don't affect other files
6. **SEO Optimized**: Built-in support for Schema.org FAQPage markup
7. **Flexible Answers**: Support for both plain text and rich JSX answers with links

## Using Helper Functions

**IMPORTANT**: Always use helper functions from `helpers.ts` instead of hardcoding values. This ensures data consistency and makes FAQs easier to maintain.

### Available Helper Functions

All helper functions are imported from `./helpers`:

#### Spa Access Helpers
- `getSpaAccessDuration(spa)` - Get duration in hours (number)
- `getSpaAccessDurationText(spa)` - Get formatted duration (e.g., "2 hours")
- `getSpaAccessDurationHyphenated(spa)` - Get hyphenated duration (e.g., "2-hour")
- `getSpaAccessWeekdayPrice(spa)` - Get weekday price (number)
- `getSpaAccessWeekendPrice(spa)` - Get weekend price (number)
- `getSpaAccessPriceRange(spa)` - Get formatted price range (e.g., "£35-40")
- `getSpaAccessPriceRangeShort(spa)` - Get short price range (e.g., "£35-40")

#### Day Pass Helpers
- `getDayPassPrice(spaId, dayPassId)` - Get formatted day pass price (e.g., "£140")
- `getDayPassDuration(spaId, dayPassId)` - Get formatted day pass duration (e.g., "3 hours")

#### Treatment Helpers
- `getTreatmentPrice(spaId, treatmentName)` - Get treatment price by name (e.g., "£90")
- `getTreatmentDuration(spaId, treatmentName)` - Get treatment duration (e.g., "60 minutes")
- `getTreatmentIdByName(spaId, treatmentName)` - Get treatment ID for linking (e.g., "fell-walkers-massage")
- `getTreatmentBrandsText(spaId)` - Get formatted brands text (e.g., "Elemis and ishga products")

#### Other Helpers
- `getThermalFacilitiesCount(spa)` - Get count of thermal facilities
- `getAgePolicy(spa)` - Get age policy text (e.g., "18+", "16+")

### Example: Using Helpers

```typescript
import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentPrice,
  getTreatmentDuration,
  getTreatmentBrandsText,
} from './helpers';

export function getSpa14FAQs(spa: Spa): FAQ[] {
  // Get dynamic values using helpers
  const dayPassPrice = getDayPassPrice(spa.id, 'another-place-day-membership-treatment');
  const treatmentPrice = getTreatmentPrice(spa.id, 'Fell Walkers Massage');
  const treatmentDuration = getTreatmentDuration(spa.id, '60 minute');
  const brandsText = getTreatmentBrandsText(spa.id);

  return [
    {
      question: 'What treatments are available?',
      answer: (
        <>
          The signature treatment is the{' '}
          <Link href="#treatments" className="text-stone-900 underline">
            Fell Walkers Massage
          </Link>
          {' '}({treatmentPrice || '£90'}, {treatmentDuration || '60 minutes'}).
        </>
      ),
      schemaText: `The signature treatment is the Fell Walkers Massage (${treatmentPrice || '£90'}, ${treatmentDuration || '60 minutes'}).`,
    },
  ];
}
```

## Adding Internal Links

FAQs should include internal links to:
1. **Treatment names** - Always link treatment names to their specific treatment card (e.g., `#fell-walkers-massage`)
2. **Day pass names** - Link day pass names to their specific day pass card (e.g., `#day-pass-id`)
3. **Section references** - Link to relevant sections of the page

### Linking Treatment Names

**Always link treatment names** to their specific treatment cards when mentioned in FAQs:

```typescript
import Link from 'next/link';
import { getTreatmentPrice, getTreatmentDuration, getTreatmentIdByName } from './helpers';

export function getSpa14FAQs(spa: Spa): FAQ[] {
  // Get treatment ID for linking
  const fellWalkersId = getTreatmentIdByName(spa.id, 'Fell Walkers Massage');
  const fellWalkersPrice = getTreatmentPrice(spa.id, 'Fell Walkers Massage');
  const treatmentDuration = getTreatmentDuration(spa.id, '60 minute');

  return [
    {
      question: 'What treatments are available?',
      answer: (
        <>
          The signature treatment is the{' '}
          <Link href={fellWalkersId ? `#${fellWalkersId}` : '#treatments'} className="text-stone-900 underline">
            Fell Walkers Massage
          </Link>
          {' '}({fellWalkersPrice || '£90'}, {treatmentDuration || '60 minutes'}).
        </>
      ),
    },
  ];
}
```

**Note**: Treatment IDs are automatically generated from treatment names (e.g., "Fell Walkers Massage" becomes "fell-walkers-massage"). Always use `getTreatmentIdByName()` helper to get the correct ID, and provide a fallback to `#treatments` if the treatment is not found.

### Linking Day Pass Names

**Always link day pass names** to their specific day pass cards:

```typescript
import Link from 'next/link';
import { getDayPassPrice, getDayPassDuration } from './helpers';

{
  question: 'How much does a spa day cost?',
  answer: (
    <>
      The{' '}
      <Link href="#another-place-day-membership-treatment" className="text-stone-900 underline">
        Day Membership with Treatment
      </Link>
      {' '}starts from {getDayPassPrice(spa.id, 'another-place-day-membership-treatment') || '£110'}.
    </>
  ),
}
```

### Common Internal Link Targets

- `#{treatment-id}` - Specific treatment card (e.g., `#fell-walkers-massage`, `#the-works`)
  - Use `getTreatmentIdByName(spaId, treatmentName)` to get the correct ID
  - Always provide fallback to `#treatments` if treatment not found
- `#treatments` - Treatments section (fallback for treatment links)
- `#day-passes` - Day passes section
- `#{day-pass-id}` - Specific day pass card (e.g., `#low-wood-bay-ultimate-activity`)
- `#access` - Access Policy section
- `#book` - Booking CTA section
- `#thermal` - Thermal Facilities section
- `#faq-4` - Link to another FAQ (use `id="faq-4"` on the FAQ div)

## Schema.org Markup

The FAQs component automatically generates FAQPage Schema.org JSON-LD markup for SEO. This enables rich snippets in Google search results.

The `schemaText` field should:
- Be a plain text version (no HTML/JSX)
- Be concise (150-250 words recommended)
- Include the direct answer first (don't bury the answer)
- Match the content of the full answer but can be shorter

Example:
```typescript
{
  question: 'Do I need to book in advance?',
  answer: (
    <>
      Yes, advance booking is recommended... [full answer with links]
    </>
  ),
  schemaText: 'Yes, advance booking is recommended. The spa operates on a timed booking system...',
}
```

## Adding New FAQs

To add FAQs for a new spa:

1. Create a new file: `src/data/faqs/spa-{id}-faqs.tsx` (note: `.tsx` extension for JSX support)
2. Import required dependencies:
```typescript
import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentPrice,
  getTreatmentDuration,
  getTreatmentIdByName,
  getTreatmentBrandsText,
  // ... other helpers as needed
} from './helpers';
```
3. Export a function that generates FAQs (not a static array):
```typescript
export function getSpa{id}FAQs(spa: Spa): FAQ[] {
  // Get dynamic values using helpers
  const dayPassPrice = getDayPassPrice(spa.id, 'day-pass-id');
  const treatmentPrice = getTreatmentPrice(spa.id, 'Treatment Name');
  const treatmentId = getTreatmentIdByName(spa.id, 'Treatment Name');
  
  return [
    {
      question: 'Question text?',
      answer: (
        <>
          Answer with{' '}
          <Link href={treatmentId ? `#${treatmentId}` : '#treatments'} className="text-stone-900 underline">
            treatment name
          </Link>
          {' '}and dynamic values like {treatmentPrice || '£90'}.
        </>
      ),
      schemaText: 'Plain text version for Schema markup with dynamic values',
    },
  ];
}
```
4. Add the import to `index.ts`:
```typescript
import { getSpa{id}FAQs } from './spa-{id}-faqs';
```
5. Add to the `faqGeneratorsBySpaId` object in `index.ts`:
```typescript
{id}: getSpa{id}FAQs,
```

### Example FAQ Entry

```typescript
import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentPrice,
  getTreatmentDuration,
  getTreatmentIdByName,
  getTreatmentBrandsText,
} from './helpers';

export function getSpa14FAQs(spa: Spa): FAQ[] {
  // Get dynamic values using helpers
  const dayPassPrice = getDayPassPrice(spa.id, 'another-place-day-membership-treatment');
  const fellWalkersPrice = getTreatmentPrice(spa.id, 'Fell Walkers Massage');
  const fellWalkersId = getTreatmentIdByName(spa.id, 'Fell Walkers Massage');
  const treatment60Min = getTreatmentDuration(spa.id, '60 minute');
  const brandsText = getTreatmentBrandsText(spa.id);

  return [
    {
      question: `What treatments are available at ${spa.name}?`,
      answer: (
        <>
          {spa.name} Swim Club offers 18 spa treatments using{brandsText ? ` ${brandsText}` : ' land&water products'}. The signature treatment is the{' '}
          <Link href={fellWalkersId ? `#${fellWalkersId}` : '#treatments'} className="text-stone-900 underline">
            Fell Walkers Massage
          </Link>
          {' '}({fellWalkersPrice || '£90'}, {treatment60Min || '60 minutes'}), designed specifically for tired legs after a day hiking in the Lake District fells.
          <br />
          <br />
          Day membership starts from {dayPassPrice || '£110'} per person. See all{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            day pass options
          </Link>
          {' '}or{' '}
          <Link href="#treatments" className="text-stone-900 underline">
            treatment options
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} Swim Club offers 18 spa treatments using${brandsText ? ` ${brandsText}` : ' land&water products'}. The signature Fell Walkers Massage (${fellWalkersPrice || '£90'}, ${treatment60Min || '60 minutes'}) is designed for tired legs after hiking. Day membership starts from ${dayPassPrice || '£110'} per person.`,
    },
  ];
}
```

## Best Practices

1. **Use Helper Functions**: **NEVER hardcode prices, durations, or other values**. Always use helper functions from `helpers.ts` to ensure data consistency.
2. **Link Treatment Names**: **Always link treatment names** to their specific treatment card using `getTreatmentIdByName()` (e.g., `#fell-walkers-massage`). Provide fallback to `#treatments` if treatment not found.
3. **Link Day Pass Names**: **Always link day pass names** to their specific day pass card (e.g., `#day-pass-id`).
4. **Direct Answer First**: Always start with the direct answer in the first sentence.
5. **Internal Links**: Use internal links to relevant sections (treatments, access, booking, etc.).
6. **Schema Text**: Always provide `schemaText` for SEO - it should be a concise, plain text version with dynamic values.
7. **Length**: Full answers should be 150-250 words; schema text can be shorter.
8. **Formatting**: Use `<br />` tags for paragraph breaks in JSX answers.
9. **Link Styling**: Use `className="text-stone-900 underline"` for internal links (note: `font-semibold` has been removed).
10. **Not All Spas Need FAQs**: Only create FAQ files for spas that have researched, specific FAQs.
11. **Function-Based FAQs**: Export a function that accepts a `Spa` object, not a static array.
12. **Fallback Values**: Always provide fallback values when using helpers (e.g., `{treatmentPrice || '£90'}`).
13. **Treatment IDs**: Treatment IDs are automatically generated from treatment names. Use `getTreatmentIdByName()` to get the correct ID for linking.

## Notes

- Not all spas have FAQs - only create files for spas that do
- FAQs are displayed on the spa detail page after the Related Spas section
- The FAQs component automatically generates Schema.org JSON-LD markup
- Answers can include rich formatting and internal links for better user experience
- Schema text should always be provided for SEO benefits
- FAQ sections are conditionally rendered - if a spa has no FAQs, the section won't appear
- **Always use `.tsx` extension** for FAQ files (not `.ts`) since they contain JSX
- **Never hardcode values** - use helper functions to ensure data consistency across the site
- **Treatment and day pass names should always be linked** to their specific cards (not just sections) to improve user experience and navigation
- **Treatment cards have IDs** automatically generated from treatment names (e.g., "Fell Walkers Massage" → "fell-walkers-massage")
- **Use `getTreatmentIdByName()`** to get the correct treatment ID for linking, with fallback to `#treatments` if not found

