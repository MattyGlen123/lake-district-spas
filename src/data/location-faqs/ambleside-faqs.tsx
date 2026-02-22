import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getTreatmentBrandsText,
  getTreatmentPrice,
  getThermalFacilitiesCount,
  getDayPassPrice,
  getTreatmentIdByName,
} from '@/data/faqs/helpers';

export function getAmblesideFAQs(spas: Spa[]): FAQ[] {
  const salutation = spas.find((s) => s.id === 8);

  // Salutation values
  const brandsText = salutation ? getTreatmentBrandsText(salutation.id) : null;
  const thermalCount = salutation
    ? getThermalFacilitiesCount(salutation)
    : null;
  const walkersLegPrice = salutation
    ? getTreatmentPrice(salutation.id, 'WALKERS LEG MASSAGE')
    : null;
  const walkersLegMassageId = salutation
    ? getTreatmentIdByName(salutation.id, 'WALKERS LEG MASSAGE')
    : null;
  // Nearby spa day pass prices (for reference in answers)
  const lwbTwilightPrice = getDayPassPrice(7, 'low-wood-bay-twilight-thermal');
  const lwbRechargePrice = getDayPassPrice(7, 'low-wood-bay-recharge-spa');
  const daffodilWeekdayPrice = getDayPassPrice(
    4,
    'daffodil-spa-facilities-weekday'
  );

  return [
    {
      question: 'What spa hotels are there in Ambleside?',
      answer: (
        <>
          Ambleside has one dedicated spa hotel:{' '}
          <Link
            href={`/spa/${salutation?.url || 'ambleside-salutation-hotel-spa'}`}
            className="underline"
          >
            {salutation?.name || 'Ambleside Salutation Hotel & Spa'}
          </Link>
          , a 350 year old coaching inn on Lake Road in the village centre. The
          Waterfall Spa features a 13 metre heated pool with a starlit fibre
          optic ceiling, {thermalCount || 3} thermal facilities including an
          infrared sauna, and an outdoor hydrotherapy fountain spa with a
          poolside hot tub.
          <br />
          <br />
          Spa access is complimentary for all hotel guests throughout their
          stay, with no time slots or extra charges. The spa is open from 8am to
          8pm daily. The{' '}
          <Link
            href={`/spa/${salutation?.url || 'ambleside-salutation-hotel-spa'}#treatments`}
            className="underline"
          >
            treatment menu
          </Link>{' '}
          includes 18 {brandsText || 'Elemis products'} therapies from{' '}
          {walkersLegPrice || '£70'}, including the{' '}
          <Link
            href={`/spa/${salutation?.url || 'ambleside-salutation-hotel-spa'}#${walkersLegMassageId || 'treatments'}`}
            className="underline"
          >
            Walkers Leg Massage
          </Link>{' '}
          designed for tired legs after fell walking.
          <br />
          <br />
          For more options within a short drive, see{' '}
          <Link href="/location/spas-in-windermere" className="underline">
            spas in Windermere
          </Link>{' '}
          and{' '}
          <Link href="/location/spas-in-grasmere" className="underline">
            spas in Grasmere
          </Link>
          , both under 15 minutes away.
        </>
      ),
      schemaText: `Ambleside has one dedicated spa hotel: ${salutation?.name || 'Ambleside Salutation Hotel & Spa'}, a 350 year old coaching inn on Lake Road. The Waterfall Spa features a 13 metre heated pool with a starlit fibre optic ceiling, ${thermalCount || 3} thermal facilities including an infrared sauna, and an outdoor hydrotherapy fountain spa. Spa access is complimentary for all hotel guests with no time slots or extra charges. The treatment menu includes 18 ${brandsText || 'Elemis'} therapies from ${walkersLegPrice || '£70'}. Windermere and Grasmere spas are both under 15 minutes away.`,
    },
    {
      question: 'Can you book a spa day in Ambleside?',
      answer: (
        <>
          The Waterfall Spa at{' '}
          <Link
            href={`/spa/${salutation?.url || 'ambleside-salutation-hotel-spa'}`}
            className="underline"
          >
            {salutation?.name || 'Ambleside Salutation Hotel & Spa'}
          </Link>{' '}
          is exclusively for hotel guests and does not offer spa day passes to
          non residents. To use the spa, you need to book an overnight stay at
          the hotel. The upside is that spa access comes included free with
          every room booking.
          <br />
          <br />
          If you want a spa day without an overnight stay, the nearest options
          are within a short drive of Ambleside.{' '}
          <Link href="/spa/low-wood-bay-spa" className="underline">
            Low Wood Bay Spa
          </Link>{' '}
          in Windermere (4 miles south) includes a Resort Leisure Area (indoor
          pool, Infrared sauna, jacuzzi, and steam room) free for hotel guests
          during restricted hours. Their{' '}
          <Link href="/spa/low-wood-bay-spa#day-passes" className="underline">
            day passes for the full thermal spa
          </Link>{' '}
          start from {lwbTwilightPrice || '£60'} for a twilight thermal session,
          or from {lwbRechargePrice || '£175'} for a full spa day with treatment
          and lunch.{' '}
          <Link href="/spa/daffodil-hotel-spa" className="underline">
            Daffodil Hotel Spa
          </Link>{' '}
          in Grasmere (4 miles north) has spa access from{' '}
          {daffodilWeekdayPrice || '£35'} on weekdays. Both are 16+ facilities.
          <br />
          <br />
          For the full range of day pass options near Ambleside, browse our{' '}
          <Link href="/spa-days" className="underline">
            spa days page
          </Link>
          .
        </>
      ),
      schemaText: `The Waterfall Spa at ${salutation?.name || 'Ambleside Salutation Hotel & Spa'} is exclusively for hotel guests and does not offer spa day passes. To use the spa you need to book an overnight stay, though spa access is included free with every room. The nearest options are Low Wood Bay Spa in Windermere (4 miles south) — hotel guests get the Resort Leisure Area (indoor pool, Infrared sauna, jacuzzi, steam room) free during restricted hours, with full thermal spa day packages from ${lwbTwilightPrice || '£60'} — and Daffodil Hotel Spa in Grasmere (4 miles north) with spa access from ${daffodilWeekdayPrice || '£35'} on weekdays. Both are 16+ facilities.`,
    },
    {
      question: 'What spas are near Ambleside?',
      answer: (
        <>
          Ambleside is well positioned for reaching several Lake District spas.
          In the village itself,{' '}
          <Link
            href={`/spa/${salutation?.url || 'ambleside-salutation-hotel-spa'}`}
            className="underline"
          >
            {salutation?.name || 'Ambleside Salutation Hotel & Spa'}
          </Link>{' '}
          offers a complimentary spa for hotel guests with an infrared sauna,
          starlit pool, and outdoor hydrotherapy fountain.{' '}
          <Link
            href={`/spa/${salutation?.url || 'ambleside-salutation-hotel-spa'}#treatments`}
            className="underline"
          >
            Treatments
          </Link>{' '}
          use {brandsText || 'Elemis products'} and start from{' '}
          {walkersLegPrice || '£70'}.
          <br />
          <br />
          Within 10 minutes by car,{' '}
          <Link href="/spa/low-wood-bay-spa" className="underline">
            Low Wood Bay Spa
          </Link>{' '}
          in{' '}
          <Link href="/location/spas-in-windermere" className="underline">
            Windermere
          </Link>{' '}
          has two outdoor infinity pools overlooking the lake and six thermal
          experiences, with day passes available.{' '}
          <Link href="/spa/brimstone-hotel-spa" className="underline">
            Brimstone Spa
          </Link>{' '}
          in{' '}
          <Link href="/location/spas-in-great-langdale" className="underline">
            Great Langdale
          </Link>{' '}
          (6 miles west) is an adults only Scandinavian inspired spa with a swim
          through indoor outdoor pool, available to hotel guests only.{' '}
          <Link href="/spa/daffodil-hotel-spa" className="underline">
            Daffodil Hotel Spa
          </Link>{' '}
          in{' '}
          <Link href="/location/spas-in-grasmere" className="underline">
            Grasmere
          </Link>{' '}
          (4 miles north) has a hydrotherapy pool and rasul mud chamber, with
          day passes from {daffodilWeekdayPrice || '£35'}.
          <br />
          <br />
          Further south in{' '}
          <Link
            href="/location/spas-in-bowness-on-windermere"
            className="underline"
          >
            Bowness on Windermere
          </Link>{' '}
          (5 miles), you will find additional spa hotels with lake views and day
          pass options.
        </>
      ),
      schemaText: `Ambleside is well positioned for reaching several Lake District spas. In the village, ${salutation?.name || 'Ambleside Salutation Hotel & Spa'} offers a complimentary spa for hotel guests with infrared sauna, starlit pool, and outdoor hydrotherapy fountain. Within 10 minutes by car, Low Wood Bay Spa in Windermere has two outdoor infinity pools and day passes. Brimstone Spa in Great Langdale (6 miles west) is an adults only spa with a swim through indoor outdoor pool for hotel guests. Daffodil Hotel Spa in Grasmere (4 miles north) has day passes from ${daffodilWeekdayPrice || '£35'}. Bowness on Windermere (5 miles) offers additional spa hotels.`,
    },
    {
      question: 'Is the Langdale Hotel & Spa in Ambleside?',
      answer: (
        <>
          No, the Langdale Hotel is in Great Langdale, about 6 miles west of
          Ambleside village. The{' '}
          <Link href="/spa/brimstone-hotel-spa" className="underline">
            Brimstone Spa
          </Link>{' '}
          on the Langdale Estate is a separate property with its own adults only
          spa, featuring a unique swim through pool connecting indoor and
          outdoor spaces, five thermal facilities, and 27 Pure Alchemy
          treatments inspired by Lake District natural elements. Spa access is
          for hotel guests only.
          <br />
          <br />
          If you are staying in Ambleside and want to use the Brimstone Spa, you
          would need to book a stay at the Brimstone Hotel itself. The drive
          from Ambleside takes around 15 minutes along the B5343 through the
          Langdale valley, one of the most scenic routes in the Lake District.
          <br />
          <br />
          For a spa experience actually in Ambleside village,{' '}
          <Link
            href={`/spa/${salutation?.url || 'ambleside-salutation-hotel-spa'}`}
            className="underline"
          >
            {salutation?.name || 'Ambleside Salutation Hotel & Spa'}
          </Link>{' '}
          is the only option, with a{' '}
          <Link
            href={`/spa/${salutation?.url || 'ambleside-salutation-hotel-spa'}#treatments`}
            className="underline"
          >
            full treatment menu
          </Link>{' '}
          and complimentary spa access for guests. See our{' '}
          <Link href="/location/spas-in-great-langdale" className="underline">
            Great Langdale spas
          </Link>{' '}
          page for more on the Langdale Estate.
        </>
      ),
      schemaText: `No, the Langdale Hotel is in Great Langdale, about 6 miles west of Ambleside village. The Brimstone Spa on the Langdale Estate is a separate adults only property with a swim through indoor outdoor pool, five thermal facilities, and 27 Pure Alchemy treatments. Spa access is for hotel guests only. The drive from Ambleside takes around 15 minutes along the B5343 through the Langdale valley. For a spa in Ambleside village itself, ${salutation?.name || 'Ambleside Salutation Hotel & Spa'} is the only option, with complimentary spa access for hotel guests and a full Elemis treatment menu.`,
    },
  ];
}
