import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
  getAgePolicy,
} from '@/data/faqs/helpers';
import { getCheapestDayPassPrice } from './helpers';

export function getNewbyBridgeFAQs(spas: Spa[]): FAQ[] {
  const swan = spas.find((s) => s.id === 5);
  const lakeside = spas.find((s) => s.id === 9);

  // Swan Hotel Spa values
  const swanThermalCount = swan ? getThermalFacilitiesCount(swan) : null;
  const swanBrandsText = swan ? getTreatmentBrandsText(swan.id) : null;
  const swanAgePolicy = swan ? getAgePolicy(swan) : null;
  const swanTwilightWeekdayPrice = swan
    ? getDayPassPrice(swan.id, 'swan-twilight-sessions-weekday')
    : null;
  const swanAfternoonTeaPrice = swan
    ? getDayPassPrice(swan.id, 'swan-thermal-access-afternoon-tea')
    : null;
  const swanFullWorksPrice = swan
    ? getDayPassPrice(swan.id, 'swan-full-works-spa-day')
    : null;

  // Lakeside Hotel & Spa values
  const lakesideBrandsText = lakeside
    ? getTreatmentBrandsText(lakeside.id)
    : null;
  const lakesideAgePolicy = lakeside ? getAgePolicy(lakeside) : null;
  const lakesideSteamSwimPrice = lakeside
    ? getDayPassPrice(lakeside.id, 'lakeside-steam-and-swim')
    : null;
  const lakesideAfternoonTeaPrice = lakeside
    ? getDayPassPrice(lakeside.id, 'lakeside-afternoon-tea-spa-day')
    : null;
  const lakesideSeasonalPrice = lakeside
    ? getDayPassPrice(lakeside.id, 'lakeside-seasonal-spa-day')
    : null;

  // Location-wide values
  const cheapestPrice = getCheapestDayPassPrice(spas);

  return [
    {
      question: 'What spas are there in Newby Bridge?',
      answer: (
        <>
          Newby Bridge has two spa hotels at the southern tip of Lake Windermere,
          each with its own character and waterside setting.{' '}
          <Link
            href={`/spa/${swan?.url || 'swan-hotel-spa'}`}
            className="underline"
          >
            {swan?.name || 'Swan Hotel Spa'}
          </Link>{' '}
          opened in 2022 on the banks of the River Leven, earning a five bubble
          rating from the Good Spa Guide. It has {swanThermalCount || 5} thermal
          experiences including an outdoor Finnish sauna, a swim through
          hydrotherapy pool, and{' '}
          <Link
            href={`/spa/${swan?.url || 'swan-hotel-spa'}#treatments`}
            className="underline"
          >
            treatments
          </Link>{' '}
          using {swanBrandsText || 'TempleSpa and Holte products'}.
          <br />
          <br />
          <Link
            href={`/spa/${lakeside?.url || 'lakeside-hotel-spa'}`}
            className="underline"
          >
            {lakeside?.name || 'Lakeside Hotel & Spa'}
          </Link>{' '}
          sits directly on the lakeshore in a building that started life as a
          17th century coaching inn. It offers a 17 metre indoor pool with
          Windermere views, a traditional sauna and steam room, an outdoor spa
          garden with fire pit and heat domes, and{' '}
          {lakesideBrandsText || 'ELEMIS'} treatments. Spa access is
          complimentary for all hotel guests, and the pool welcomes children,
          making it a good choice for families.{' '}
          <Link
            href={`/spa/${lakeside?.url || 'lakeside-hotel-spa'}#day-passes`}
            className="underline"
          >
            Day passes
          </Link>{' '}
          are also availble and start from {lakesideSteamSwimPrice || '£30'}.
        </>
      ),
      schemaText: `Newby Bridge has two spa hotels at the southern tip of Lake Windermere. ${swan?.name || 'Swan Hotel Spa'} opened in 2022 on the banks of the River Leven with a five bubble Good Spa Guide rating, ${swanThermalCount || 5} thermal experiences including an outdoor Finnish sauna, a swim through hydrotherapy pool, and ${swanBrandsText || 'TempleSpa and Holte products'}. ${lakeside?.name || 'Lakeside Hotel & Spa'} sits directly on the lakeshore in a 17th century coaching inn with a 17 metre indoor pool, sauna, steam room, outdoor spa garden, and ${lakesideBrandsText || 'ELEMIS'} treatments. Day passes start from ${cheapestPrice || '£30'}.`,
    },
    {
      question:
        'Is the Swan Hotel & Spa in Newby Bridge or Ulverston?',
      answer: (
        <>
          <Link
            href={`/spa/${swan?.url || 'swan-hotel-spa'}`}
            className="underline"
          >
            {swan?.name || 'Swan Hotel Spa'}
          </Link>{' '}
          is in Newby Bridge, not Ulverston. The confusion arises because the
          hotel&apos;s postal address uses the Ulverston postcode (LA12 8NB),
          which covers much of the surrounding area. In practice, the spa is
          right in Newby Bridge hamlet, on the banks of the River Leven where it
          flows out of Lake Windermere. It is around 6 miles north of Ulverston
          town centre.
          <br />
          <br />
          Newby Bridge is a small hamlet at the southern tip of Windermere,
          easily reached from the A590. The Swan sits beside the historic five
          arched stone bridge that gives the hamlet its name. If you are driving
          from Ulverston, the journey takes about 10 minutes. From the M6 at
          Junction 36, it is roughly 20 minutes via the A590. The nearest
          Lakeside and Haverthwaite Railway station is a short walk from the
          hotel, and Windermere lake cruises depart from the pier at nearby{' '}
          <Link
            href="/location/spas-in-backbarrow"
            className="underline"
          >
            Lakeside
          </Link>
          .
        </>
      ),
      schemaText: `${swan?.name || 'Swan Hotel Spa'} is in Newby Bridge, not Ulverston. The confusion arises because the hotel's postal address uses the Ulverston postcode (LA12 8NB), which covers much of the surrounding area. The spa is in Newby Bridge hamlet on the banks of the River Leven where it flows out of Lake Windermere, around 6 miles north of Ulverston town centre. Driving from Ulverston takes about 10 minutes. From the M6 at Junction 36 it is roughly 20 minutes via the A590.`,
    },
    {
      question: 'How much does a spa day cost in Newby Bridge?',
      answer: (
        <>
          Spa day prices in Newby Bridge start from {cheapestPrice || '£30'}{' '}
          and range up to {swanFullWorksPrice || '£225'} depending on the spa
          and package you choose.{' '}
          <Link
            href={`/spa/${lakeside?.url || 'lakeside-hotel-spa'}#day-passes`}
            className="underline"
          >
            {lakeside?.name || 'Lakeside Hotel & Spa'}
          </Link>{' '}
          offers the most affordable entry with its Steam and Swim pass at{' '}
          {lakesideSteamSwimPrice || '£30'} for 3 hours of pool, sauna and
          steam room access. The{' '}
          <Link
            href={`/spa/${lakeside?.url || 'lakeside-hotel-spa'}#lakeside-seasonal-spa-day`}
            className="underline"
          >
            Seasonal Spa Day
          </Link>{' '}
          at {lakesideSeasonalPrice || '£90'} includes a full day with a 45 minute
          treatment, and the{' '}
          <Link
            href={`/spa/${lakeside?.url || 'lakeside-hotel-spa'}#lakeside-afternoon-tea-spa-day`}
            className="underline"
          >
            Afternoon Tea Spa Day
          </Link>{' '}
          at {lakesideAfternoonTeaPrice || '£150'} adds a 60 minute ELEMIS
          treatment and afternoon tea.
          <br />
          <br />
          At{' '}
          <Link
            href={`/spa/${swan?.url || 'swan-hotel-spa'}#day-passes`}
            className="underline"
          >
            {swan?.name || 'Swan Hotel Spa'}
          </Link>
          , the{' '}
          <Link
            href={`/spa/${swan?.url || 'swan-hotel-spa'}#swan-twilight-sessions-weekday`}
            className="underline"
          >
            Twilight Session
          </Link>{' '}
          starts from {swanTwilightWeekdayPrice || '£35'} for 2 hours of thermal bathing on
          weekday evenings. The{' '}
          <Link
            href={`/spa/${swan?.url || 'swan-hotel-spa'}#swan-thermal-access-afternoon-tea`}
            className="underline"
          >
            Thermal Access and Afternoon Tea package
          </Link>{' '}
          is {swanAfternoonTeaPrice || '£65'}, and the{' '}
          <Link
            href={`/spa/${swan?.url || 'swan-hotel-spa'}#swan-full-works-spa-day`}
            className="underline"
          >
            Full Works Holte Spa Day
          </Link>{' '}
          at {swanFullWorksPrice || '£225'} includes a massage, facial, 3 hours of
          thermal access, and afternoon tea or pub lunch. Both spas require
          advance booking for day passes.
        </>
      ),
      schemaText: `Spa day prices in Newby Bridge start from ${cheapestPrice || '£30'} and range up to ${swanFullWorksPrice || '£225'}. ${lakeside?.name || 'Lakeside Hotel & Spa'} offers Steam and Swim at ${lakesideSteamSwimPrice || '£30'} for 3 hours, the Seasonal Spa Day at ${lakesideSeasonalPrice || '£90'} with a 45 minute treatment, and the Afternoon Tea Spa Day at ${lakesideAfternoonTeaPrice || '£150'} with a 60 minute ELEMIS treatment. ${swan?.name || 'Swan Hotel Spa'} starts from ${swanTwilightWeekdayPrice || '£35'} for a weekday Twilight Session, with the Full Works Holte Spa Day at ${swanFullWorksPrice || '£225'} including massage, facial, and dining.`,
    },
    {
      question: 'Is there a family friendly spa in Newby Bridge?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${lakeside?.url || 'lakeside-hotel-spa'}`}
            className="underline"
          >
            {lakeside?.name || 'Lakeside Hotel & Spa'}
          </Link>{' '}
          is {lakesideAgePolicy || 'family friendly'} and welcomes guests of
          all ages to its pool, sauna, steam room and outdoor spa garden. The 17
          metre indoor pool has a beach style shallow area designed for younger
          swimmers, and the poolside jacuzzi and outdoor fire pit are open to
          everyone. Spa access is included for all hotel guests, and the{' '}
          <Link
            href={`/spa/${lakeside?.url || 'lakeside-hotel-spa'}#lakeside-steam-and-swim`}
            className="underline"
          >
            Steam and Swim
          </Link>{' '}
          day pass at {lakesideSteamSwimPrice || '£30'} is available to day
          visitors of all ages too.
          <br />
          <br />
          By contrast,{' '}
          <Link
            href={`/spa/${swan?.url || 'swan-hotel-spa'}`}
            className="underline"
          >
            {swan?.name || 'Swan Hotel Spa'}
          </Link>{' '}
          is {swanAgePolicy || '18+ (16-17 with parent/guardian)'}. This means
          children under 16 cannot use the spa facilities. If you are visiting
          Newby Bridge as a family and want everyone to enjoy the pool and
          thermal facilities together, Lakeside is the right choice. For a
          parents only escape while the family stays nearby, the Swan&apos;s
          adults focused spa is just a short drive along the lakeshore. The
          nearby{' '}
          <Link href="/location/spas-in-backbarrow" className="underline">
            Whitewater Hotel in Backbarrow
          </Link>{' '}
          is another family friendly option just a mile away.
        </>
      ),
      schemaText: `Yes. ${lakeside?.name || 'Lakeside Hotel & Spa'} is ${lakesideAgePolicy || 'family friendly'} and welcomes guests of all ages to its pool, sauna, steam room and outdoor spa garden. The 17 metre indoor pool has a beach style shallow area for younger swimmers. Spa access is included for hotel guests, and the Steam and Swim day pass at ${lakesideSteamSwimPrice || '£30'} is open to all ages. ${swan?.name || 'Swan Hotel Spa'} is ${swanAgePolicy || '18+ (16-17 with parent/guardian)'}, so children under 16 cannot use the spa. For family spa visits in Newby Bridge, Lakeside is the right choice.`,
    },
  ];
}
