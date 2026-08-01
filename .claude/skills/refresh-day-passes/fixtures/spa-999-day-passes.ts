import { SpaDayPasses } from '@/types/spa';

// TEST FIXTURE — not site data, not registered in src/data/day-passes/index.ts.
// A fake spa with a bogus dayPassUrl used to exercise the fetch-failure lane
// (retry log, filed issue, ❌ not-fetched table row, invariant check).
export const spa999DayPasses: SpaDayPasses = {
  spaId: 999, // Test Fixture Spa (does not exist)
  options: [
    {
      id: 'fixture-spa-day',
      packageName: 'Fixture Spa Day',
      priceGBP: 100,
      spaDuration: 4,
      treatmentsIncluded: false,
      refreshmentsIncluded: false,
      mealIncluded: false,
      included: ['Nothing — this spa does not exist'],
      description: 'Test fixture entry for the fetch-failure lane.',
      daysAvailable: 'Monday-Sunday',
      bookingRequired: true,
      dayPassUrl: 'https://spa-999-does-not-exist.invalid/day-passes',
      lastVerified: '2026-01-22',
    },
  ],
};
