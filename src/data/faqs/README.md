# FAQs Data Structure

This directory contains frequently asked questions (FAQs) organized by individual spa.

## File Structure

- `spa-{id}-faqs.ts` - FAQ data for each spa (e.g., `spa-1-faqs.ts`)
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

## Adding Internal Links

FAQs can include internal links to other sections of the spa page using Next.js `Link` component:

```typescript
import Link from 'next/link';

{
  question: 'Example question?',
  answer: (
    <>
      Answer text with a link to{' '}
      <Link href="#treatments" className="text-stone-900 font-semibold underline">
        the treatments section
      </Link>
      .
    </>
  ),
  schemaText: 'Plain text version without links for Schema markup.',
}
```

Common internal link targets:
- `#treatments` - Treatments section
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

1. Create a new file: `src/data/faqs/spa-{id}-faqs.ts`
2. Import the FAQ type and Link component:
```typescript
import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
```
3. Export an array of FAQs:
```typescript
export const spa{id}FAQs: FAQ[] = [
  {
    question: 'Question text?',
    answer: 'Answer text or JSX',
    schemaText: 'Plain text version for Schema markup',
  },
];
```
4. Add the import to `index.ts`:
```typescript
import { spa{id}FAQs } from './spa-{id}-faqs';
```
5. Add to the `faqsBySpaId` object in `index.ts`:
```typescript
{id}: spa{id}FAQs,
```

### Example FAQ Entry

```typescript
{
  question: 'Do I need to book spa treatments in advance?',
  answer: (
    <>
      Yes, advance booking is strongly recommended. Demand for treatments is high throughout the year, and the hotel explicitly advises guests to book their desired treatments before arrival to avoid disappointment.
      <br />
      <br />
      You can book spa treatments when making your room reservation online, by calling the hotel directly, or by contacting the spa team. For more details,{' '}
      <Link href="#treatments" className="text-stone-900 font-semibold underline">
        browse our treatments
      </Link>{' '}
      or see the{' '}
      <Link href="#book" className="text-stone-900 font-semibold underline">
        booking information
      </Link>{' '}
      section.
    </>
  ),
  schemaText: 'Yes, advance booking is strongly recommended. Demand for treatments is high throughout the year, and the hotel explicitly advises guests to book their desired treatments before arrival to avoid disappointment. You can book spa treatments when making your room reservation online, by calling the hotel directly, or by contacting the spa team.',
}
```

## Best Practices

1. **Direct Answer First**: Always start with the direct answer in the first sentence
2. **Internal Links**: Use internal links to relevant sections (treatments, access, booking, etc.)
3. **Schema Text**: Always provide `schemaText` for SEO - it should be a concise, plain text version
4. **Length**: Full answers should be 150-250 words; schema text can be shorter
5. **Formatting**: Use `<br />` tags for paragraph breaks in JSX answers
6. **Link Styling**: Use `className="text-stone-900 font-semibold underline"` for internal links
7. **Not All Spas Need FAQs**: Only create FAQ files for spas that have researched, specific FAQs

## Notes

- Not all spas have FAQs - only create files for spas that do
- FAQs are displayed on the spa detail page after the Access Policy section
- The FAQs component automatically generates Schema.org JSON-LD markup
- Answers can include rich formatting and internal links for better user experience
- Schema text should always be provided for SEO benefits
- FAQ sections are conditionally rendered - if a spa has no FAQs, the section won't appear

