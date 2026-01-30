import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getSpaAccessDurationText,
  getSpaAccessDurationHyphenated,
  getSpaAccessPriceRange,
  getSpaAccessPriceRangeShort,
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
  getAgePolicy,
} from './helpers';

export function getSpa1FAQs(spa: Spa): FAQ[] {
  const durationText = getSpaAccessDurationText(spa);
  const durationHyphenated = getSpaAccessDurationHyphenated(spa);
  const priceRange = getSpaAccessPriceRange(spa);
  const priceRangeShort = getSpaAccessPriceRangeShort(spa);
  const thermalCount = getThermalFacilitiesCount(spa);
  const brandsText = getTreatmentBrandsText(spa.id);
  const agePolicy = getAgePolicy(spa);

  return [
  {
    question: `Do I need to book spa treatments in advance at ${spa.name}?`,
    answer: (
      <>
        Yes, advance booking is strongly recommended for spa treatments at {spa.name}. Demand for treatments at The Falls Spa is high throughout the year, and the hotel explicitly advises guests to book their desired treatments before arrival to avoid disappointment. The spa offers a range of luxury treatments{brandsText ? ` using ${brandsText}` : ''}, including massages, facials, body wraps, and signature experiences, but availability can be limited—especially during weekends, school holidays, and peak tourist seasons in the Lake District.
        <br />
        <br />
        You can book spa treatments when making your room reservation online, by calling the hotel directly, or by contacting the spa team. Booking early gives you the best choice of treatment times and allows you to coordinate your spa experience with your chosen spa access time slot{durationHyphenated ? ` (as the spa operates on a ${durationHyphenated} timed booking system)` : ''}. If you&apos;re planning a special occasion visit or have specific therapist requests, advance booking is particularly important. Walk-in treatments may occasionally be available, but relying on this risks missing out on your preferred experiences during your stay. For more details,{' '}
        <Link href="#treatments" className="text-stone-900 font-semibold underline">
          browse our treatments
        </Link>{' '}
        section.
      </>
    ),
    schemaText:
      `Yes, advance booking is strongly recommended for spa treatments at ${spa.name}. Demand for treatments at The Falls Spa is high throughout the year, and the hotel explicitly advises guests to book their desired treatments before arrival to avoid disappointment. The spa offers a range of luxury treatments${brandsText ? ` using ${brandsText}` : ''}, but availability can be limited, especially during weekends, school holidays, and peak tourist seasons. You can book spa treatments when making your room reservation online, by calling the hotel directly, or by contacting the spa team.`,
  },
  {
    question: `Is spa access included with my room at ${spa.name}?`,
    answer: (
      <>
        Spa access depends on your room type at {spa.name}. Guests staying in suites receive {durationText || 'spa access'} of complimentary spa access to The Falls Spa, subject to availability. This includes use of the thermal suite&apos;s {thermalCount} heat experiences, the heated outdoor 16-metre infinity pool with stunning views over Derwentwater, the relaxation areas, and the exclusive Champagne bar.
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
  },
  {
    question: `How long can I use the spa facilities at ${spa.name}?`,
    answer: (
      <>
        Spa access at {spa.name} is limited to {durationHyphenated || 'timed'} time slots. The Falls Spa operates on a timed booking system to manage capacity and ensure all guests can enjoy the facilities in a peaceful, relaxing environment. When you book your spa access, whether it&apos;s complimentary with your suite booking{priceRangeShort ? ` or purchased separately (${priceRangeShort} per person depending on the day)` : ''} {durationHyphenated ? (
          <>you&apos;ll select one of six available {durationHyphenated} time slots throughout the day</>
        ) : (
          <>you&apos;ll need to book your preferred time slot</>
        )}.
        <br />
        <br />
        {durationText && (
          <>
            The {durationText} window gives you enough time to experience the thermal suite&apos;s various heat experiences (including saunas, steam rooms, salt inhalation room, and ice fountain), relax in the heated outdoor infinity pool with its spectacular lake and mountain views, and unwind in the relaxation areas or Champagne bar. If you&apos;ve also booked spa treatments, plan your time carefully, your treatment duration counts within your {durationHyphenated || 'time'} slot, so you may want to arrive early in your window to maximize your facility time before or after your treatment.
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
  },
  {
    question: `What time slots are available for the spa at ${spa.name}?`,
    answer: (
      <>
        The Falls Spa offers six {durationHyphenated || 'time'} time slots daily to accommodate guests throughout the day. The available sessions are: 7:30am-9:30am, 9:45am-11:45am, 12pm-2pm, 2:15pm-4:15pm, 4:30pm-6:30pm, and 6:45pm-8:45pm. You&apos;ll select your preferred time slot when booking your spa access, either at the time of your room reservation or when purchasing a spa day pass.
        <br />
        <br />
        Each time slot offers a different experience. The early morning sessions (7:30am-9:30am and 9:45am-11:45am) are popular with guests who want to start their day feeling refreshed and energized, and you&apos;ll often find these slots quieter. The midday and afternoon slots (12pm-2pm and 2:15pm-4:15pm) work well if you&apos;re combining your spa visit with other activities, allowing you to explore the Lake District in the morning or evening. The later sessions (4:30pm-6:30pm and 6:45pm-8:45pm) offer a particularly special experience. The evening slot lets you watch the sunset over Derwentwater from the outdoor infinity pool, creating a magical end to your day.
        <br />
        <br />
        Availability varies depending on season and day of the week, with weekend slots filling up faster than weekday sessions. Book your preferred time slot as early as possible, especially if visiting during school holidays, bank holiday weekends, or peak summer months (July-August). For more details about the{' '}
        <Link href="#thermal" className="text-stone-900 font-semibold underline">
          facilities
        </Link>{' '}
        or{' '}
        <Link href="#day-passes" className="text-stone-900 font-semibold underline">
          day passes
        </Link>
        , see the relevant sections.
      </>
    ),
    schemaText:
      `The Falls Spa offers six ${durationHyphenated || 'time'} time slots daily: 7:30am-9:30am, 9:45am-11:45am, 12pm-2pm, 2:15pm-4:15pm, 4:30pm-6:30pm, and 6:45pm-8:45pm. You'll select your preferred time slot when booking your spa access. Early morning sessions are quieter, while the evening slot (6:45pm-8:45pm) offers sunset views over Derwentwater from the outdoor infinity pool. Weekend slots fill up faster than weekday sessions, so book early.`,
  },
  {
    question: `Can children use the spa at ${spa.name}?`,
    answer: (
      <>
        No, The Falls Spa is adults-only and restricted to guests aged {agePolicy || '18 and over'}. Due to the thermal heat experiences within the spa, including multiple saunas, aromatic steam rooms, a salt inhalation room, and the heated outdoor infinity pool. Only adult guests are permitted to use the facilities. This age restriction is in place for both safety reasons (thermal experiences can be unsuitable for younger guests) and to maintain a tranquil, relaxing environment for all visitors.
        <br />
        <br />
        If you&apos;re planning a family visit to Lodore Falls Hotel & Spa, children are of course welcome to stay at the hotel and enjoy its other amenities. The hotel&apos;s stunning location on the shores of Derwentwater in the Borrowdale Valley offers plenty of family-friendly activities. Guests of all ages can enjoy the beautiful lakeside grounds, nearby Lodore Falls waterfall (a short walk from the hotel), and easy access to popular Lake District attractions like boat trips on Derwentwater, Keswick town, and numerous family-friendly walks and outdoor activities.
        <br />
        <br />
        For families seeking spa experiences, you might consider booking treatments or spa access during times when other family members can enjoy alternative activities, or look into family-friendly spa facilities elsewhere in the Lake District that offer dedicated family sessions with different age policies. For more spa options in the Lake District, see our{' '}
        <Link href="/" className="text-stone-900 font-semibold underline">
          homepage
        </Link>
        .
      </>
    ),
    schemaText:
      `No, The Falls Spa is adults-only and restricted to guests aged ${agePolicy || '18 and over'}. Due to the thermal heat experiences within the spa, including multiple saunas, aromatic steam rooms, and the heated outdoor infinity pool. Only adult guests are permitted to use the facilities. This age restriction is in place for both safety reasons and to maintain a tranquil, relaxing environment for all visitors.`,
  },
  ];
}

