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
        '50-minute treatment of choice',
        'Use of cardio room',
      ],
      description:
        'Full day membership with swim club access, thermal facilities, and your choice of 50-minute treatment.',
      daysAvailable: 'Monday - Sunday',
      ageRestriction: '18+',
      bookingRequired: true,
      dayPassUrl: 'https://another.place/the-lake/swim-club/',
      bookingEmail: 'life@another.place',
      lastVerified: '2026-04-27',
    },
    {
      id: 'another-place-swim-and-dine',
      packageName: 'Swim & Dine',
      priceGBP: 60,
      spaDuration: 3,
      treatmentsIncluded: false,
      refreshmentsIncluded: true,
      mealIncluded: true,
      included: [
        'Swim Club access from 6pm',
        '20-metre lake-view swimming pool',
        'Outdoor hot tub',
        'Three-course dinner at Rampsbeck Restaurant',
      ],
      description:
        'Evening package with Swim Club access and a three-course dinner at Rampsbeck Restaurant. Arrive from 6pm, Swim Club closes 9pm.',
      requiredNumbers: 'Minimum 2 people',
      daysAvailable: 'Sunday - Thursday (outside school holidays)',
      ageRestriction: '18+',
      bookingRequired: true,
      dayPassUrl: 'https://another.place/the-lake/swim-club/swim-and-dine',
      bookingUrl: 'https://another.place/the-lake/swim-club/swim-and-dine',
      lastVerified: '2026-04-27',
    },
  ],
};
