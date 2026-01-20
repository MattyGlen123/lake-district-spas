import { SpaDayPasses } from '@/types/spa';

export const spa14DayPasses: SpaDayPasses = {
  spaId: 14, // Another Place, The Lake
  options: [
    {
      id: 'another-place-day-membership-treatment',
      packageName: 'Day Membership with Treatment',
      priceGBP: 110,
      spaDuration: 14,
      treatmentsIncluded: true,
      refreshmentsIncluded: false,
      mealIncluded: false,
      included: [
        'Full day access to Swim Club (7am - 9pm)',
        '20-metre lake-view swimming pool',
        'Sauna and outdoor hot tub',
        '60-minute treatment of choice',
        'Use of cardio room',
      ],
      description:
        'Full day membership with swim club access, thermal facilities, and your choice of 60-minute treatment.',
      daysAvailable: 'Monday - Sunday',
      ageRestriction: '18+',
      bookingRequired: true,
      dayPassUrl: 'https://another.place/the-lake/swim-club/',
      bookingUrl: 'https://another.place/the-lake/book/treatments',
      lastVerified: '2025-01-19',
    },
    {
      id: 'another-place-day-membership-lunch',
      packageName: 'Day Membership with Treatment & Lunch',
      priceGBP: 120,
      spaDuration: 14,
      treatmentsIncluded: true,
      refreshmentsIncluded: true,
      mealIncluded: true,
      included: [
        'Full day access to Swim Club (7am - 9pm)',
        '20-metre lake-view swimming pool',
        'Sauna and outdoor hot tub',
        '60-minute treatment of choice',
        'One-course lunch',
        'Use of cardio room',
      ],
      description:
        'Full day membership with swim club access, thermal facilities, 60-minute treatment, and one-course lunch.',
      daysAvailable: 'Monday - Sunday',
      ageRestriction: '18+',
      bookingRequired: true,
      dayPassUrl: 'https://another.place/the-lake/swim-club/',
      bookingUrl: 'https://another.place/the-lake/book/treatments',
      lastVerified: '2025-01-19',
    },
  ],
};
