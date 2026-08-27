import { SpaDayPasses } from '@/types/spa';

// Rewritten 2026-08-26. Lakeside replaced its entire onejourney catalogue:
// the six packages previously listed here (booking items 7198, 7203, 7685,
// 7202, 7326, 7328) all 404 at source, so every "Book" link was dead. The
// three below are the live, bookable catalogue, read from the onejourney
// JSON API (`https://api.onejourney.travel/340/spa-packages/en`). See
// `.scratch/day-pass-refresh/issues/13-lakeside-catalogue-replaced.md`.
//
// The catalogue also lists a fourth package, "Fizz and Float" (18902, £39).
// It is deliberately NOT here: it has released no bookable timeslot on any
// date, confirmed with the hotel. Gate 6 (bookability) now detects this
// automatically — see the `availabilityProbe` block in the run artifact.
export const spa9DayPasses: SpaDayPasses = {
  spaId: 9, // Lakeside Hotel Spa
  options: [
    {
      id: 'lakeside-dip-and-dine',
      packageName: 'Dip & Dine',
      priceGBP: 25,
      spaDuration: 3,
      treatmentsIncluded: false,
      refreshmentsIncluded: true,
      mealIncluded: false,
      included: [
        "3 hours' access to the leisure facilities",
        '17m heated indoor pool with Lake Windermere views',
        'Jacuzzi, sauna and steam room',
        'Towels provided',
        '£15 food credit per person towards breakfast, lunch or dinner in the hotel',
      ],
      description: 'Swim, unwind and dine — three hours in the pool and thermal rooms, then £15 towards a meal in the hotel.',
      daysAvailable: 'Monday-Sunday',
      ageRestriction: 'All ages',
      bookingRequired: true,
      dayPassUrl: 'https://www.lakesidehotel.co.uk/spa/spa-day/',
      bookingUrl: 'https://lakesidehotel.onejourney.travel/spa/days/18904',
      lastVerified: '2026-08-26',
    },
    {
      id: 'lakeside-express-escape',
      packageName: 'Express Escape',
      priceGBP: 70,
      spaDuration: 3,
      treatmentsIncluded: true,
      refreshmentsIncluded: true,
      mealIncluded: true,
      included: [
        'Full spa access',
        '17m heated indoor pool with Lake Windermere views',
        'Sauna, steam room, spa garden and poolside jacuzzi',
        '30-minute ELEMIS treatment of choice (back, neck and shoulder massage, taster facial, mini manicure or mini pedicure)',
        'Luxury afternoon tea with tea or coffee',
      ],
      description: 'A half day of spa access, a 30-minute ELEMIS treatment and afternoon tea — the best-value treatment package here.',
      daysAvailable: 'Monday-Sunday',
      ageRestriction: 'All ages',
      bookingRequired: true,
      dayPassUrl: 'https://www.lakesidehotel.co.uk/spa/spa-day/',
      bookingUrl: 'https://lakesidehotel.onejourney.travel/spa/days/18905',
      lastVerified: '2026-08-26',
    },
    {
      id: 'lakeside-signature-sanctuary-spa-day',
      packageName: 'Signature Sanctuary Spa Day',
      priceGBP: 95,
      spaDuration: 3,
      treatmentsIncluded: true,
      refreshmentsIncluded: true,
      mealIncluded: true,
      included: [
        "Three hours' access to the pool, sauna, steam room and poolside jacuzzi",
        '17m heated indoor pool with Lake Windermere views',
        '60-minute ELEMIS treatment of choice (facial, deep tissue or Swedish massage, manicure or pedicure)',
        'Traditional afternoon tea served in the Spa Lounge',
        'Robes and towels provided',
      ],
      description: 'Lakeside’s full signature day — a 60-minute ELEMIS treatment, three hours in the spa and afternoon tea in your robe.',
      daysAvailable: 'Monday-Sunday',
      ageRestriction: 'All ages',
      bookingRequired: true,
      dayPassUrl: 'https://www.lakesidehotel.co.uk/spa/spa-day/',
      bookingUrl: 'https://lakesidehotel.onejourney.travel/spa/days/18912',
      lastVerified: '2026-08-26',
    },
  ],
};
