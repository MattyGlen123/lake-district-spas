import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentBrandsText,
  getThermalFacilitiesCount,
  getAgePolicy,
  getTreatmentPrice,
} from '@/data/faqs/helpers';

export function getApplebyInWestmorlandFAQs(spas: Spa[]): FAQ[] {
  const applebyManor = spas.find((s) => s.id === 15);

  // Appleby Manor values
  const thermalCount = applebyManor
    ? getThermalFacilitiesCount(applebyManor)
    : null;
  const brandsText = applebyManor
    ? getTreatmentBrandsText(applebyManor.id)
    : null;
  const agePolicy = applebyManor ? getAgePolicy(applebyManor) : null;
  const thermalOnlyPrice = applebyManor
    ? getDayPassPrice(applebyManor.id, 'appleby-thermal-only')
    : null;
  const thermalOnlyDuration = applebyManor
    ? getDayPassDuration(applebyManor.id, 'appleby-thermal-only')
    : null;
  const indulgenceWeekdayPrice = applebyManor
    ? getDayPassPrice(applebyManor.id, 'appleby-indulgence-weekday')
    : null;
  const indulgenceWeekendPrice = applebyManor
    ? getDayPassPrice(applebyManor.id, 'appleby-indulgence-weekend')
    : null;
  const indulgenceDuration = applebyManor
    ? getDayPassDuration(applebyManor.id, 'appleby-indulgence-weekend')
    : null;
  const _luxurienceWeekdayPrice = applebyManor
    ? getDayPassPrice(applebyManor.id, 'appleby-luxurience-weekday')
    : null;
  const thermalMealWeekdayPrice = applebyManor
    ? getDayPassPrice(applebyManor.id, 'appleby-thermal-meal-weekday')
    : null;
  const absoluteRitualPrice = applebyManor
    ? getTreatmentPrice(applebyManor.id, 'Absolute Spa Ritual')
    : null;

  return [
    // FAQ 1: Eden Valley spa
    {
      question: 'Is there a spa in the Eden Valley?',
      answer: (
        <>
          Yes. The{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}`}
            className="underline"
          >
            {applebyManor?.name || 'Appleby Manor Hotel & Garden Spa'}
          </Link>{' '}
          is the Eden Valley&apos;s spa destination, set within a 19th century
          country house hotel on the eastern edge of the Lake District National
          Park near Appleby-in-Westmorland. It is the only dedicated spa facility
          in the Eden Valley, offering a full thermal journey, outdoor spa garden,
          and professional treatments.
          <br />
          <br />
          The spa features an indoor vitality pool with underwater massage
          loungers and hydrotherapy jets, {thermalCount || 4} thermal experiences
          including a salt inhalation room for respiratory wellness, and a
          sheltered outdoor garden with hot tub and fire pit. Treatments use{' '}
          {brandsText || 'ELEMIS and Lava Shells products'}, with the signature{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#treatments`}
            className="underline"
          >
            Absolute Spa Ritual
          </Link>{' '}
          combining a full body massage with a prescriptive facial over 110
          minutes ({absoluteRitualPrice || '£120'}).
          <br />
          <br />
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#day-passes`}
            className="underline"
          >
            Day spa packages
          </Link>{' '}
          start from {thermalOnlyPrice || '£45'} per person. The
          nearest alternative spas are in{' '}
          <Link
            href="/location/spas-in-penrith"
            className="underline"
          >
            Penrith
          </Link>
          , around 12 miles north.
        </>
      ),
      schemaText: `Yes. The ${applebyManor?.name || 'Appleby Manor Hotel & Garden Spa'} is the Eden Valley's spa destination, set within a 19th century country house hotel near Appleby-in-Westmorland on the eastern edge of the Lake District. It features an indoor vitality pool with hydrotherapy jets, ${thermalCount || 4} thermal experiences including a salt inhalation room, and a sheltered outdoor garden with hot tub and fire pit. Treatments use ${brandsText || 'ELEMIS and Lava Shells products'}, with the signature Absolute Spa Ritual at ${absoluteRitualPrice || '£120'} for 110 minutes. Day spa packages start from ${thermalOnlyPrice || '£45'} per person. The nearest alternative spas are in Penrith, around 12 miles north.`,
    },

    // FAQ 2: Spa day in Appleby
    {
      question: 'What is there to do on a spa day in Appleby-in-Westmorland?',
      answer: (
        <>
          A spa day at{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}`}
            className="underline"
          >
            {applebyManor?.name || 'Appleby Manor Hotel & Garden Spa'}
          </Link>{' '}
          pairs well with exploring this historic market town. The spa itself
          offers {thermalOnlyDuration || '2 hours'} to {indulgenceDuration || '5 hours'}{' '}
          of thermal experiences depending on your{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#day-passes`}
            className="underline"
          >
            package choice
          </Link>
          , including the hydrotherapy pool, outdoor hot tub, fire pit, sauna,
          steam room, and salt inhalation room. Several packages include a 2
          course lunch or afternoon tea in the hotel restaurant.
          <br />
          <br />
          Beyond the spa, Appleby rewards a wander. The broad main street climbs
          from the River Eden to the church of St Lawrence, passing independent
          shops and coaching inns. Appleby Castle and its rare breeds conservation
          centre sit at the top of the town. For a longer walk, the riverside
          path to the Millennium Bridge is flat and gentle, making it an ideal
          before or after spa stroll. The town is notably quieter than central
          Lake District destinations, which suits the unhurried pace of a spa
          day.
          <br />
          <br />
          The{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#appleby-thermal-meal-weekday`}
            className="underline"
          >
            Aqua Thermal Spa Experience with Lunch
          </Link>{' '}
          from {thermalMealWeekdayPrice || '£60'} is a good option if you want
          to combine spa time with an afternoon in the town.
        </>
      ),
      schemaText: `A spa day at ${applebyManor?.name || 'Appleby Manor Hotel & Garden Spa'} pairs well with exploring this historic market town. The spa offers ${thermalOnlyDuration || '2 hours'} to ${indulgenceDuration || '5 hours'} of thermal experiences including a hydrotherapy pool, outdoor hot tub, fire pit, sauna, steam room, and salt inhalation room. Several packages include lunch or afternoon tea. Beyond the spa, Appleby's main street climbs from the River Eden past independent shops and coaching inns to Appleby Castle. The riverside walk to the Millennium Bridge makes an ideal before or after spa stroll. The town is notably quieter than central Lake District destinations.`,
    },

    // FAQ 3: Spa hotel near Penrith
    {
      question: 'Is Appleby Manor a good spa hotel near Penrith?',
      answer: (
        <>
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}`}
            className="underline"
          >
            {applebyManor?.name || 'Appleby Manor Hotel & Garden Spa'}
          </Link>{' '}
          is around 12 miles south of Penrith, roughly 20 minutes by car along
          the A66. It offers a different character to the{' '}
          <Link
            href="/location/spas-in-penrith"
            className="underline"
          >
            Penrith spas
          </Link>
          : a smaller, country house setting in the Eden Valley rather than a
          larger hotel on the edge of town. If you want a quieter, more rural spa
          escape within easy reach of Penrith, it is well worth considering.
          <br />
          <br />
          The spa stands out for its outdoor garden with hot tub and fire pit, its
          salt inhalation room, and a private hire hot tub in a glass enclosure
          for special occasions. Treatments use{' '}
          {brandsText || 'ELEMIS and Lava Shells products'}. Day spa packages
          range from {thermalOnlyPrice || '£45'} for a{' '}
          {thermalOnlyDuration || '2 hours'} thermal journey up to{' '}
          {indulgenceWeekendPrice || '£125'} for the full{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#appleby-indulgence-weekend`}
            className="underline"
          >
            Indulgence package
          </Link>{' '}
          with {indulgenceDuration || '5 hours'} of spa access, a treatment, and
          lunch.
          <br />
          <br />
          The spa is {agePolicy || '16+'} for general access, though{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#day-passes`}
            className="underline"
          >
            day spa packages
          </Link>{' '}
          require guests to be 18 or over. Weekday pricing is typically
          £10 less than weekends across all packages, so midweek visits offer the
          best value.
        </>
      ),
      schemaText: `${applebyManor?.name || 'Appleby Manor Hotel & Garden Spa'} is around 12 miles south of Penrith, roughly 20 minutes by car. It offers a smaller, country house setting in the Eden Valley with an outdoor spa garden, hot tub, fire pit, salt inhalation room, and a private hire hot tub for special occasions. Treatments use ${brandsText || 'ELEMIS and Lava Shells products'}. Day spa packages range from ${thermalOnlyPrice || '£45'} for a ${thermalOnlyDuration || '2 hours'} thermal journey to ${indulgenceWeekendPrice || '£125'} for the full Indulgence package with ${indulgenceDuration || '5 hours'} of spa access, a treatment, and lunch. The spa is ${agePolicy || '16+'} for general access. Weekday pricing is typically £10 less than weekends.`,
    },

    // FAQ 4: Overnight spa break
    {
      question: 'Can you stay overnight at the spa hotel in Appleby?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}`}
            className="underline"
          >
            {applebyManor?.name || 'Appleby Manor Hotel & Garden Spa'}
          </Link>{' '}
          is a full country house hotel as well as a spa, so overnight stays and
          spa breaks are available. The hotel sits in its own grounds on Roman
          Road with views toward Appleby Castle, and rooms range from standard
          doubles to more spacious options in the main house.
          <br />
          <br />
          Hotel guests should note that spa access is not automatically included
          in the room rate and must be booked separately, either as a standalone{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#day-passes`}
            className="underline"
          >
            spa day package
          </Link>{' '}
          or by arranging access through reception. This gives you flexibility to
          choose the level of spa experience you want, from a{' '}
          {thermalOnlyDuration || '2 hours'}{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#appleby-thermal-only`}
            className="underline"
          >
            thermal journey
          </Link>{' '}
          at {thermalOnlyPrice || '£45'} to the full day{' '}
          <Link
            href={`/spa/${applebyManor?.url || 'appleby-manor-hotel-garden-spa'}#appleby-indulgence-weekday`}
            className="underline"
          >
            Indulgence
          </Link>{' '}
          from {indulgenceWeekdayPrice || '£115'} with treatment and lunch
          included.
          <br />
          <br />
          For those visiting the Lake District from further afield, Appleby is
          well connected by rail on the famous Settle to Carlisle line, making a
          car free spa break genuinely practical. The station is a short taxi ride
          from the hotel. Nearby{' '}
          <Link
            href="/location/spas-in-ullswater"
            className="underline"
          >
            Ullswater
          </Link>{' '}
          and{' '}
          <Link
            href="/location/spas-in-penrith"
            className="underline"
          >
            Penrith
          </Link>{' '}
          are also within easy reach if you want to explore more of the area
          during your stay.
        </>
      ),
      schemaText: `Yes. ${applebyManor?.name || 'Appleby Manor Hotel & Garden Spa'} is a full country house hotel with overnight stays and spa breaks available. The hotel sits in its own grounds with views toward Appleby Castle. Hotel guests should note that spa access is not included in the room rate and must be booked separately, from a ${thermalOnlyDuration || '2 hours'} thermal journey at ${thermalOnlyPrice || '£45'} to the full day Indulgence package from ${indulgenceWeekdayPrice || '£115'}. Appleby is well connected by rail on the Settle to Carlisle line, making car free spa breaks practical. Ullswater and Penrith are within easy reach for exploring the wider area.`,
    },
  ];
}
