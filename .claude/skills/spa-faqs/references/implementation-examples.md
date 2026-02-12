# FAQ Implementation Examples

This document shows real implementation examples from Lodore Falls (Spa ID 1) and Low Wood Bay (Spa ID 7) to guide FAQ creation for new spas.

## File Structure

FAQs are organized by spa ID in separate files:

```
src/data/faqs/
├── index.ts                    # Exports getFAQsBySpaId() helper
├── helpers.ts                  # Helper functions to extract dynamic values
├── spa-1-faqs.tsx              # Lodore Falls FAQs (5 FAQs)
├── spa-7-faqs.tsx              # Low Wood Bay FAQs (5 FAQs)
└── spa-{id}-faqs.tsx           # Future spa FAQs
```

## Helper Functions Available

From `helpers.ts`, these functions extract values from spa data:

```typescript
// Spa access helpers
getSpaAccessDuration(spa)                    // Returns: 2 (number)
getSpaAccessDurationText(spa)                // Returns: "2 hours"
getSpaAccessDurationHyphenated(spa)          // Returns: "2-hour"
getSpaAccessWeekdayPrice(spa)                // Returns: 35 (number)
getSpaAccessWeekendPrice(spa)                // Returns: 40 (number)
getSpaAccessPriceRange(spa)                  // Returns: "£35 per person Monday to Thursday, or £40 per person Friday to Sunday"
getSpaAccessPriceRangeShort(spa)             // Returns: "£35-40"

// Facility helpers
getThermalFacilitiesCount(spa)               // Returns: 7 (number)

// Treatment helpers
getTreatmentBrandsText(spa.id)               // Returns: "Elemis and ishga products"
getTreatmentBrandsText(spa.id, 3)            // Returns up to 3 brands

// Age policy helpers
getAgePolicy(spa)                            // Returns: "18 and over" or "16 and over"

// Day pass helpers (Low Wood Bay specific)
getDayPassPrice(spa.id, 'low-wood-bay-ultimate-activity')     // Returns: "£140"
getDayPassDuration(spa.id, 'low-wood-bay-twilight-thermal')   // Returns: "2 hours"

// Treatment duration helpers
getTreatmentDuration(spa.id, '50 minute')    // Returns: "50 minute"
getTreatmentDuration(spa.id, '110 minute')   // Returns: "110 minute"
```

**Critical Pattern:** Always use helper functions instead of hardcoding values. This ensures data stays in sync with the source data files.

## Function Signature Pattern

Each spa has a function that returns an array of FAQs:

```typescript
export function getSpa{ID}FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values using helpers
  const durationText = getSpaAccessDurationText(spa);
  const priceRange = getSpaAccessPriceRange(spa);
  const thermalCount = getThermalFacilitiesCount(spa);
  const agePolicy = getAgePolicy(spa);

  return [
    {
      question: `Question text with ${spa.name}?`,
      answer: (
        <>JSX answer with dynamic values</>
      ),
      schemaText: `Plain text answer with ${spa.name}`,
    },
    // ... more FAQs
  ];
}
```

## FAQ Object Structure

Each FAQ has three properties:

```typescript
{
  question: string,           // The question (use template literals with ${spa.name})
  answer: ReactNode,          // JSX with <Link> components, <br />, dynamic values
  schemaText: string,         // Plain text version (no HTML/JSX) for JSON-LD
}
```

## Example 1: Simple FAQ (Lodore Falls - Children Policy)

```typescript
{
  question: `Can children use the spa at ${spa.name}?`,
  answer: (
    <>
      No, The Falls Spa is adults only and restricted to guests aged {agePolicy || '18 and over'}. Due to the thermal heat experiences within the spa, including multiple saunas, aromatic steam rooms, a salt inhalation room, and the heated outdoor infinity pool. Only adult guests are permitted to use the facilities. This age restriction is in place for both safety reasons (thermal experiences can be unsuitable for younger guests) and to maintain a tranquil, relaxing environment for all visitors.
      <br />
      <br />
      If you&apos;re planning a family visit to Lodore Falls Hotel & Spa, children are of course welcome to stay at the hotel and enjoy its other amenities. The hotel&apos;s stunning location on the shores of Derwentwater in the Borrowdale Valley offers plenty of family friendly activities. Guests of all ages can enjoy the beautiful lakeside grounds, nearby Lodore Falls waterfall (a short walk from the hotel), and easy access to popular Lake District attractions like boat trips on Derwentwater, Keswick town, and numerous family friendly walks and outdoor activities.
      <br />
      <br />
      For families seeking spa experiences, you might consider booking treatments or spa access during times when other family members can enjoy alternative activities, or look into family friendly spa facilities elsewhere in the Lake District that offer dedicated family sessions with different age policies. For more spa options in the Lake District, see our{' '}
      <Link href="/" className="text-stone-900 font-semibold underline">
        homepage
      </Link>
      .
    </>
  ),
  schemaText:
    `No, The Falls Spa is adults only and restricted to guests aged ${agePolicy || '18 and over'}. Due to the thermal heat experiences within the spa, including multiple saunas, aromatic steam rooms, and the heated outdoor infinity pool. Only adult guests are permitted to use the facilities. This age restriction is in place for both safety reasons and to maintain a tranquil, relaxing environment for all visitors.`,
}
```

**Key Patterns:**
- ✅ Use `{agePolicy || '18 and over'}` with fallback
- ✅ NO HYPHENS: "family friendly" not "family-friendly", "adults only" not "adults-only"
- ✅ Schema text is shorter (only first paragraph)
- ✅ Internal link to homepage with proper className
- ✅ Use `&apos;` for apostrophes in JSX

## Example 2: Complex FAQ with Conditionals (Lodore Falls - Spa Access Included)

```typescript
{
  question: `Is spa access included with my room at ${spa.name}?`,
  answer: (
    <>
      Spa access depends on your room type at {spa.name}. Guests staying in suites receive {durationText || 'spa access'} of complimentary spa access to The Falls Spa, subject to availability. This includes use of the thermal suite&apos;s {thermalCount} heat experiences, the heated outdoor 16 metre infinity pool with stunning views over Derwentwater, the relaxation areas, and the exclusive Champagne bar.
      <br />
      <br />
      {priceRange && (
        <>
          Guests in other room categories can book {durationHyphenated || 'spa'} spa time slots for {priceRange}. These prices give you full access to all spa facilities during your allocated time slot. All spa access, whether complimentary for suite guests or paid for other guests, must be pre-booked due to limited capacity{durationHyphenated ? `, and you'll select from one of six daily ${durationHyphenated} time slots when reserving` : ''}.
        </>
      )}
      <br />
      <br />
      {agePolicy && (
        <>
          It&apos;s important to note that only guests aged {agePolicy} can use the spa facilities due to the thermal heat experiences.
        </>
      )}
      {' '}If spa access is a priority for your visit, consider upgrading to a suite room to enjoy complimentary access{priceRange ? `, or factor the additional cost into your budget when booking a standard room` : ''}. For full details on access policies, see the{' '}
      <Link href="#access" className="text-stone-900 font-semibold underline">
        Spa Access Information section
      </Link>.
    </>
  ),
  schemaText:
    `Spa access depends on your room type at ${spa.name}. Guests staying in suites receive ${durationText || 'spa access'} of complimentary spa access to The Falls Spa, subject to availability.${priceRange ? ` Guests in other room categories can book ${durationHyphenated || 'spa'} spa time slots for ${priceRange}.` : ''} All spa access must be pre-booked due to limited capacity${agePolicy ? `, and only guests aged ${agePolicy} can use the facilities due to the thermal heat experiences` : ''}.`,
}
```

**Key Patterns:**
- ✅ Use conditional rendering with `{priceRange && (...)}`
- ✅ Use ternary operators for fallbacks: `{durationText || 'spa access'}`
- ✅ Dynamic values in text: `{thermalCount}`, `{priceRange}`
- ✅ Template literals in schemaText with conditionals
- ✅ Link to `#access` section
- ✅ NO HYPHENS: "16 metre" not "16-metre" (in prose context)

## Example 3: Multiple Dynamic Day Pass Values (Low Wood Bay - Pricing)

```typescript
{
  question: `How much does a spa day cost at ${spa.name}?`,
  answer: (
    <>
      {spa.name} offers spa day packages from {twilightPrice || '£60'} to {sailSpaPrice || '£360'} per person depending on what&apos;s included. With 17 different packages available, there&apos;s an option for every budget and preference.
      <br />
      <br />
      The most affordable option is the{' '}
      <Link href="#low-wood-bay-twilight-thermal" className="text-stone-900 underline">
        Twilight Thermal Journey
      </Link>{' '}
      ({twilightPrice || '£60'}, Monday to Thursday evenings only), which gives you {twilightDuration || '2 hours'} of evening spa access. For daytime visits, the{' '}
      <Link href="#low-wood-bay-weekend-thermal" className="text-stone-900 underline">
        Weekend Thermal Journey
      </Link>{' '}
      ({weekendThermalPrice || '£95'}, Saturday and Sunday) offers {weekendThermalDuration || '3 hours'} of spa access without treatment or dining.           If you want the full experience, the{' '}
      <Link href="#low-wood-bay-weekday-thermal-lunch" className="text-stone-900 underline">
        Weekday Thermal Journey with Lunch or Afternoon Tea
      </Link>{' '}
      starts at {weekdayThermalLunchPrice || '£125'}, or the{' '}
      <Link href="#low-wood-bay-weekend-thermal-lunch" className="text-stone-900 underline">
        Weekend Thermal Journey with Lunch or Afternoon Tea
      </Link>{' '}
      is {weekendThermalLunchPrice || '£130'}.
      <br />
      <br />
      Packages including a {treatment50Min || '50 minute'} treatment start at {rechargePrice || '£175'} for the{' '}
      <Link href="#low-wood-bay-recharge-spa" className="text-stone-900 underline">
        Recharge Spa Day
      </Link>{' '}
      , which includes your choice of treatment, {rechargeDuration || '3 hours'} thermal journey, and lunch or afternoon tea. The{' '}
      <Link href="#low-wood-bay-restful-retreat" className="text-stone-900 underline">
        Restful Retreat
      </Link>{' '}
      ({restfulRetreatPrice || '£205'}) adds a glass of prosecco. The luxurious{' '}
      <Link href="#low-wood-bay-hideaway-retreat" className="text-stone-900 underline">
        Hideaway Retreat
      </Link>{' '}
      ({hideawayPrice || '£300'} per person for couples) includes a {treatment110Min || '110 minute'} treatment in an exclusive room with salt bath and Lake Windermere views.
      <br />
      <br />
      All packages include robes and towels. Weekday packages are typically £5 to £15 less expensive than weekend prices. Hotel guests receive 25% off spa day bookings made Monday to Thursday. Note that you&apos;ll need to bring a payment card or phone for purchasing additional food and drinks around the pool areas. For more details on{' '}
      <Link href="#access" className="text-stone-900 underline">
        spa access
      </Link>{' '}
      and{' '}
      <Link href="#day-passes" className="text-stone-900 underline">
        Day Passes
      </Link>
      , see the relevant sections.
    </>
  ),
  schemaText:
    `${spa.name} offers spa day packages from ${twilightPrice || '£60'} to ${sailSpaPrice || '£360'} per person. The Twilight Thermal Journey (Mon-Thu evenings, ${twilightPrice || '£60'}) offers the best value for spa access only. The Weekend Thermal Journey (${weekendThermalPrice || '£95'}) provides ${weekendThermalDuration || '3 hours'} access. Packages with treatment start at ${rechargePrice || '£175'} (Recharge Spa Day with ${treatment50Min || '50 minute'} treatment, ${rechargeDuration || '3 hours'} thermal journey, and lunch or afternoon tea). Weekday packages are typically £5-15 less than weekend prices. Hotel guests receive 25% off Monday to Thursday. All prices include robes and towels.`,
}
```

**Setup for this FAQ (at top of function):**
```typescript
// Day pass prices
const ultimateActivityPrice = getDayPassPrice(spa.id, 'low-wood-bay-ultimate-activity');
const twilightPrice = getDayPassPrice(spa.id, 'low-wood-bay-twilight-thermal');
const weekendThermalPrice = getDayPassPrice(spa.id, 'low-wood-bay-weekend-thermal');
const weekdayThermalLunchPrice = getDayPassPrice(spa.id, 'low-wood-bay-weekday-thermal-lunch');
const weekendThermalLunchPrice = getDayPassPrice(spa.id, 'low-wood-bay-weekend-thermal-lunch');
const rechargePrice = getDayPassPrice(spa.id, 'low-wood-bay-recharge-spa');
const restfulRetreatPrice = getDayPassPrice(spa.id, 'low-wood-bay-restful-retreat');
const hideawayPrice = getDayPassPrice(spa.id, 'low-wood-bay-hideaway-retreat');
const sailSpaPrice = getDayPassPrice(spa.id, 'low-wood-bay-sail-spa');

// Day pass durations
const twilightDuration = getDayPassDuration(spa.id, 'low-wood-bay-twilight-thermal');
const weekendThermalDuration = getDayPassDuration(spa.id, 'low-wood-bay-weekend-thermal');
const rechargeDuration = getDayPassDuration(spa.id, 'low-wood-bay-recharge-spa');

// Treatment durations
const treatment50Min = getTreatmentDuration(spa.id, '50 minute');
const treatment110Min = getTreatmentDuration(spa.id, '110 minute');
```

**Key Patterns:**
- ✅ Extract all needed values at top of function
- ✅ Always use fallbacks: `{twilightPrice || '£60'}`
- ✅ Link to specific day pass sections with `#low-wood-bay-{package-name}`
- ✅ NO HYPHENS in ranges: "£5 to £15" not "£5-15" (in prose), BUT "£5-15" OK in schemaText
- ✅ Multiple internal links (6 links in this answer)
- ✅ Practical tips from reviews ("bring payment card or phone")

## Example 4: Link to Another FAQ (Lodore Falls - Time Limit)

```typescript
{
  question: `How long can I use the spa facilities at ${spa.name}?`,
  answer: (
    <>
      Spa access at {spa.name} is limited to {durationHyphenated || 'timed'} time slots. The Falls Spa operates on a timed booking system to manage capacity and ensure all guests can enjoy the facilities in a peaceful, relaxing environment.
      <br />
      <br />
      {durationText && (
        <>
          The {durationText} window gives you enough time to experience the thermal suite&apos;s various heat experiences (including saunas, steam rooms, salt inhalation room, and ice fountain), relax in the heated outdoor infinity pool with its spectacular lake and mountain views, and unwind in the relaxation areas or Champagne bar.
          <br />
          <br />
        </>
      )}
      The time slot system helps prevent overcrowding and maintains the tranquil atmosphere the spa is known for. While some guests wish for unlimited access{durationText ? `, the majority find ${durationText} sufficient to enjoy the full spa experience` : ''}. For the specific time slots available,{' '}
      <Link href="#faq-4" className="text-stone-900 font-semibold underline">
        see the next FAQ
      </Link>
      . For more information about the facilities, visit the{' '}
      <Link href="#thermal" className="text-stone-900 font-semibold underline">
        facilities section
      </Link>
      .
    </>
  ),
  schemaText:
    `Spa access at ${spa.name} is limited to ${durationHyphenated || 'timed'} time slots. The Falls Spa operates on a timed booking system to manage capacity and ensure all guests can enjoy the facilities in a peaceful, relaxing environment.${durationText ? ` The ${durationText} window gives you enough time to experience the thermal suite's various heat experiences, relax in the heated outdoor infinity pool with its spectacular lake and mountain views, and unwind in the relaxation areas or Champagne bar.` : ''}`,
}
```

**Key Patterns:**
- ✅ Link to another FAQ: `<Link href="#faq-4">see the next FAQ</Link>`
- ✅ Conditional entire paragraph: `{durationText && (<>...</>)}`
- ✅ Conditional sentence fragment: `{durationText ? `, majority find ${durationText} sufficient` : ''}`
- ✅ Schema text uses template literal conditionals
- ✅ EXCEPTION: "durationHyphenated" is OK because it's used as adjective ("2-hour time slots")

## Internal Link Patterns

Common link targets and their styling:

```typescript
// Link to section on same page
<Link href="#thermal" className="text-stone-900 font-semibold underline">
  thermal facilities
</Link>

// Link to another FAQ (use ID on FAQ container)
<Link href="#faq-4" className="text-stone-900 font-semibold underline">
  see the next FAQ
</Link>

// Link to specific day pass
<Link href="#low-wood-bay-ultimate-activity" className="text-stone-900 underline">
  Ultimate Activity Spa Day
</Link>

// Link to homepage
<Link href="/" className="text-stone-900 font-semibold underline">
  homepage
</Link>
```

**Common section IDs:**
- `#thermal` - Thermal facilities section
- `#treatments` - Treatments section
- `#access` - Access Information section
- `#book` - Booking CTA section
- `#day-passes` - Day Passes section
- `#faq-{number}` - Specific FAQ (1-indexed)

## JSX Formatting Rules

1. **Line breaks:** Use `<br />` (self-closing with space)
2. **Apostrophes:** Use `&apos;` in JSX (e.g., `you&apos;re`, `it&apos;s`)
3. **Spaces around links:** Use `{' '}` for spacing (e.g., `section.{' '}<Link>`)
4. **Fragment wrapping:** Wrap multi-line JSX in `<>...</>`
5. **Conditional rendering:** Use `{condition && (<>...</>)}` for optional paragraphs
6. **NO HYPHENS in prose:** See hyphen rules below

## Hyphen Rules (CRITICAL)

**User Feedback:** "You've used way too many dashes in the text. Don't use them going forward."

### ❌ INCORRECT (Don't use hyphens in prose):
- "2-hour time slots" → ✅ "2 hour time slots"
- "adults-only spa" → ✅ "adults only spa"
- "family-friendly activities" → ✅ "family friendly activities"
- "16-metre pool" → ✅ "16 metre pool"
- "£100-per-person price" → ✅ "£100 per person price"

### ✅ EXCEPTION (Hyphens allowed when used as adjective BEFORE noun):
- `{durationHyphenated || 'timed'} time slots` → "2-hour time slots" is OK
- This is because "2-hour" is a compound adjective modifying "time slots"

### ✅ OK in schemaText (More flexible):
- "£5-15" is acceptable in schema text for brevity
- "Mon-Thu" is acceptable for day abbreviations

### ✅ OK in dynamic helper output:
- `getSpaAccessDurationHyphenated(spa)` returns "2-hour" which is fine when used as adjective

**Rule of thumb:** If you can remove the hyphen and the sentence still makes sense, remove it.

## Schema Text Best Practices

1. **Plain text only** - No HTML, no JSX, no markdown
2. **Concise** - Usually 50-70% of full answer length
3. **Direct answer first** - Don't bury the lead
4. **Template literals** - Use `${spa.name}`, `${priceRange}`, etc.
5. **Conditional text** - Use ternary operators: `${price ? \` for ${price}\` : ''}`
6. **No apostrophe escaping** - Use regular `'` not `&apos;`
7. **Line breaks** - Use `\\n` if needed (rarely needed)

## Common Dynamic Value Patterns

### Pattern 1: Value with fallback
```typescript
{thermalCount || 7}  // Use helper value, fallback to 7
{durationText || 'spa access'}  // Fallback to generic text
{agePolicy || '18 and over'}  // Fallback to most common
```

### Pattern 2: Conditional entire sentence
```typescript
{priceRange && (
  <>
    Guests can book spa time for {priceRange}.
  </>
)}
```

### Pattern 3: Conditional fragment within sentence
```typescript
The spa offers {thermalCount} facilities{agePolicy ? ` for guests ${agePolicy}` : ''}.
```

### Pattern 4: Multiple values from same helper type
```typescript
// Extract all day passes needed
const twilightPrice = getDayPassPrice(spa.id, 'low-wood-bay-twilight-thermal');
const weekendPrice = getDayPassPrice(spa.id, 'low-wood-bay-weekend-thermal');
const rechargePrice = getDayPassPrice(spa.id, 'low-wood-bay-recharge-spa');

// Use in answer
Packages range from {twilightPrice || '£60'} to {rechargePrice || '£175'}.
```

## File Registration Pattern

After creating `spa-{id}-faqs.tsx`, register it in `index.ts`:

```typescript
import { getSpa7FAQs } from './spa-7-faqs';

const faqGeneratorsBySpaId: Record<number, (spa: Spa) => FAQ[]> = {
  1: getSpa1FAQs,
  7: getSpa7FAQs,
  14: getSpa14FAQs,  // Add new spa here
};
```

## Answer Length Guidelines

- **Full answer (JSX):** 150-250 words
- **Schema text:** 80-150 words (50-70% of full answer)
- **First paragraph:** 40-60 words (direct answer)
- **Supporting paragraphs:** 60-120 words (context, details, tips)
- **Final paragraph:** 30-50 words (call to action, links)

## Complete Example with Setup

```typescript
import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getSpaAccessDurationText,
  getSpaAccessDurationHyphenated,
  getSpaAccessPriceRange,
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
  getAgePolicy,
} from './helpers';

export function getSpa14FAQs(spa: Spa): FAQ[] {
  // Extract all dynamic values needed
  const durationText = getSpaAccessDurationText(spa);
  const durationHyphenated = getSpaAccessDurationHyphenated(spa);
  const priceRange = getSpaAccessPriceRange(spa);
  const thermalCount = getThermalFacilitiesCount(spa);
  const brandsText = getTreatmentBrandsText(spa.id);
  const agePolicy = getAgePolicy(spa);

  return [
    {
      question: `Example question for ${spa.name}?`,
      answer: (
        <>
          Direct answer here using {spa.name} and {thermalCount} facilities. First paragraph should be 40-60 words and give the clear answer.
          <br />
          <br />
          Supporting detail paragraph using {durationText || 'spa access'} and {priceRange}. Provide context, explain options, give practical tips. This section is 60-120 words.
          <br />
          <br />
          Final paragraph with call to action. For more information, see the{' '}
          <Link href="#thermal" className="text-stone-900 font-semibold underline">
            thermal facilities
          </Link>{' '}
          section.
        </>
      ),
      schemaText:
        `Direct answer here for ${spa.name}. Supporting detail using ${durationText || 'spa access'}. Schema text should be 80-150 words, plain text only.`,
    },
    // ... more FAQs
  ];
}
```

## Quality Checklist

Before finalizing FAQ implementation, verify:

- ✅ All dynamic values use helper functions (no hardcoded spa names, prices, durations)
- ✅ NO HYPHENS in prose (except durationHyphenated when used as adjective)
- ✅ Both JSX answer and schemaText provided
- ✅ Internal links use proper className: `text-stone-900 font-semibold underline`
- ✅ Apostrophes use `&apos;` in JSX
- ✅ Line breaks use `<br />` (self-closing with space)
- ✅ Fallbacks provided: `{value || 'fallback'}`
- ✅ Answer length: 150-250 words (JSX), 80-150 words (schema)
- ✅ Direct answer in first sentence
- ✅ Function registered in index.ts
- ✅ All template literals use `${spa.name}` not hardcoded names
