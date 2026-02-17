# Day Passes Data Structure

This directory contains spa day pass information organized by individual spa.

## File Structure

- `spa-{id}-day-passes.ts` - Day pass options for each spa (e.g., `spa-1-day-passes.ts`)
- `index.ts` - Exports helper functions to access day pass data

## Usage
```typescript
import {
  getDayPassesBySpaId,
  getDayPassOptionsBySpaId,
  getSpasWithDayPasses,
} from '@/data/day-passes';

// Get all day passes for a specific spa
const lodoreFallsPasses = getDayPassesBySpaId(1);

// Get just the options array
const options = getDayPassOptionsBySpaId(1);

// Get list of spa IDs that offer day passes
const spaIds = getSpasWithDayPasses();
```

## Data Structure

Each day pass option includes:

- **id**: Unique identifier (e.g., `'lodore-falls-renew-spa'`)
- **packageName**: Display name of the package
- **priceGBP**: Total price (for group packages) or per-person price (for individual bookings)
- **pricePerPerson**: Optional - used when `priceGBP` is a group total
- **spaDuration**: Number of hours of spa facility access (e.g., `2`, `3`, `4`)
- **requiredNumbers**: Optional text indicating group size requirements (e.g., `"Requires 2 People"`, `"Group of 2–4 Guests"`)
- **treatmentsIncluded**: Boolean indicating if treatments are included
- **refreshmentsIncluded**: Boolean indicating if food/drinks are included
- **mealIncluded**: Boolean indicating if a meal (lunch, afternoon tea, etc.) is included
- **included**: Array of strings describing what's included in the package
- **description**: Single sentence that sells the experience
- **daysAvailable**: When the package is available (e.g., `'Monday - Sunday'`)
- **ageRestriction**: Age requirement (e.g., `'18+'`)
- **bookingRequired**: Whether advance booking is required
- **phoneBooking**: Optional phone number for bookings
- **dayPassUrl**: URL to the day pass information page
- **bookingUrl**: Optional - URL to the booking/purchase page (not all spas have online booking systems)
- **bookingEmail**: Optional - Email address for bookings (used when there's no online booking system)
- **lastVerified**: Date in ISO format (YYYY-MM-DD) when information was last checked

## Benefits of This Structure

1. **Matches Treatments Pattern**: Consistent with existing treatments data structure
2. **Smaller Files**: Each spa's day passes in separate files for easier maintenance
3. **Better Performance**: Only loads day passes for the spa being viewed
4. **Easy Updates**: Update individual spa files without affecting others
5. **Better Git Diffs**: Changes to one spa don't affect other files
6. **Filterable Data**: Numeric `spaDuration` enables filtering and sorting
7. **Clear Inclusions**: `included` array makes it easy to display what's in each package

## Data Verification

All day pass information includes a `lastVerified` date in ISO format (YYYY-MM-DD). 

**IMPORTANT**: Prices and availability should be periodically checked and updated. When updating:
1. Verify information on the spa's official website
2. Update the `lastVerified` date
3. Check booking URLs still work (if applicable)
4. Verify booking emails and phone numbers are current
5. Confirm pricing (especially for group packages vs individual)

## Adding New Day Passes

To add day passes for a new spa:

1. Create a new file: `src/data/day-passes/spa-{id}-day-passes.ts`
2. Follow the structure in `spa-1-day-passes.ts`
3. Add the import to `index.ts`:
```typescript
   import { spa{id}DayPasses } from './spa-{id}-day-passes';
```
4. Add to the `dayPassesBySpaId` object in `index.ts`:
```typescript
   {id}: spa{id}DayPasses,
```
5. Include accurate source URLs and today's date in `lastVerified`

### Example Day Pass Entry

```typescript
{
  id: 'spa-name-package-name',
  packageName: 'Package Name',
  priceGBP: 150,
  pricePerPerson: 75, // Optional - only if priceGBP is group total
  spaDuration: 2, // Number of hours
  requiredNumbers: 'Requires 2 People', // Optional - for group packages
  treatmentsIncluded: true,
  refreshmentsIncluded: true,
  mealIncluded: true, // true if lunch/afternoon tea included, false if only drinks/snacks
  included: [
    '2 hours use of spa facilities',
    '1x 50 minute treatment of choice',
    'Hot drink + traybake',
  ],
  description: 'Single sentence that sells the experience.',
  daysAvailable: 'Monday - Sunday',
  ageRestriction: '18+',
  bookingRequired: true,
  phoneBooking: '01234 567890', // Optional
  dayPassUrl: 'https://spa-website.com/day-pass',
  bookingUrl: 'https://spa-website.com/book', // Optional - use bookingEmail if no online booking system
  bookingEmail: 'bookings@spa-website.com', // Optional - use when bookingUrl is not available
  lastVerified: '2025-01-19',
}
```

## Notes

- Not all spas offer day passes - only create files for spas that do
- Reference spa facilities from main spa data (don't duplicate)
- Keep descriptions concise but compelling
- Always include booking URLs, booking emails, or phone numbers where available
- Some spas don't have online booking systems - use `bookingEmail` instead of `bookingUrl` in those cases
- For group packages, use `pricePerPerson` to show individual pricing
- The `included` array should list all key benefits of the package
