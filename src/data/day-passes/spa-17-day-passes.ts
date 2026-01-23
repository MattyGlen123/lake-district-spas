import { SpaDayPasses } from '@/types/spa';

export const spa17DayPasses: SpaDayPasses = {
  spaId: 17, // Grange Hotel Spa
  options: [
    {
      id: 'grange-lazy-days-for-locals',
      packageName: 'Lazy Days for Locals',
      priceGBP: 25,
      spaDuration: 8,
      treatmentsIncluded: false,
      refreshmentsIncluded: false,
      mealIncluded: true,
      included: [
        'Full day access to leisure facilities',
        '£15 food allocation from lounge menu',
        'Heated indoor pool and jacuzzi',
        'Sauna and steam room',
      ],
      description: 'Come and relax for the day with full access to our leisure facilities and £15 towards food.',
      daysAvailable: 'Monday-Sunday',
      ageRestriction: '18+',
      bookingRequired: true,
      bookingEmail: 'info@grange-hotel.co.uk',
      dayPassUrl: 'https://grange-hotel.co.uk/lazy-days-for-locals/',
      lastVerified: '2026-01-22',
    },
    {
      id: 'grange-spa-day-package',
      packageName: 'Spa Day Package',
      priceGBP: 59,
      spaDuration: 2,
      treatmentsIncluded: true,
      refreshmentsIncluded: false,
      mealIncluded: true,
      included: [
        '2-hour spa facilities access',
        '25-minute treatment',
        '£15 food allocation for lunch or afternoon tea',
        'Heated indoor pool and jacuzzi',
        'Sauna and steam room',
      ],
      description: 'Treat yourself to a day of relaxation with an indulgent treatment, spa facilities, and lunch or afternoon tea.',
      daysAvailable: 'Sunday-Thursday',
      ageRestriction: '18+',
      bookingRequired: true,
      bookingEmail: 'info@grange-hotel.co.uk',
      dayPassUrl: 'https://grange-hotel.co.uk/spa-day-package/',
      lastVerified: '2026-01-22',
    },
  ],
};

