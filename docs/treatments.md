# Treatments Data Structure

This directory contains spa treatment data organized by individual spa.

## File Structure

- `spa-{id}-treatments.ts` - Treatment data for each spa (e.g., `spa-1-treatments.ts`)
- `index.ts` - Exports helper functions to access treatment data

## Usage

```typescript
import { getTreatmentsBySpaId, getAllTreatments } from '@/data/treatments';

// Get treatments for a specific spa
const spa1Treatments = getTreatmentsBySpaId(1);

// Get all treatments across all spas
const allTreatments = getAllTreatments();
```

## Benefits of This Structure

1. **Smaller Files**: Each file contains only treatments for one spa (4-18KB vs 92KB)
2. **Better Performance**: Only loads treatments for the spa being viewed
3. **Easier Maintenance**: Smaller files are easier to edit and review
4. **Better Git Diffs**: Changes to one spa's treatments don't affect other spas

## Adding New Treatments

To add treatments for a new spa:

1. Create a new file: `src/data/treatments/spa-{id}-treatments.ts`
2. Use the same structure as existing files
3. Add the import and mapping to `index.ts`

Example:
```typescript
// spa-9-treatments.ts
import { Treatment } from '@/types/spa';

export const spa9Treatments: Treatment[] = [
  {
    spaId: 9,
    name: 'Example Treatment',
    description: 'Full description...',
    shortDescription: 'Brief description...',
    duration: '60 minutes',
    brand: 'Brand Name',
    category: 'Massage Therapies',
  },
];
```
