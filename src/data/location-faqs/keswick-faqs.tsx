import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getTreatmentBrandsText,
} from '@/data/faqs/helpers';
import { getLocationTreatmentCount } from './helpers';

export function getKeswickFAQs(spas: Spa[]): FAQ[] {
  const underscar = spas.find((s) => s.id === 19);

  // Day pass prices
  const twilightPrice = getDayPassPrice(19, 'underscar-twilight-spa');
  const harmoniPrice = getDayPassPrice(19, 'underscar-harmonie-half-day');
  const reflectionPrice = getDayPassPrice(19, 'underscar-reflection-full-day');

  // Treatment and facility values
  const brandsText = underscar ? getTreatmentBrandsText(underscar.id) : null;
  const treatmentCount = getLocationTreatmentCount(spas);

  return [
    // FAQ 1: spa keswick / spas near keswick (1,000–10,000/mo)
    {
      question: 'Is there a spa near Keswick in the Lake District?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}`}
            className="underline"
          >
            {underscar?.name || 'The Spa at Underscar'}
          </Link>{' '}
          is located at Applethwaite on the sheltered slopes of Skiddaw, a
          short drive above Keswick with views over Derwentwater. The spa
          serves guests staying in the 25 five-star self-catering cottages on
          the estate, and is also open to day visitors via bookable spa day
          packages.
          <br />
          <br />
          The facilities include a 13-metre heated indoor swimming pool, a
          hydrotherapy jacuzzi with massage jets, a eucalyptus-infused sauna,
          steam room, relaxation room, and a Technogym-equipped gym. Treatment
          rooms deliver therapies from Germaine de Capuccini, NEOM Organics,
          and The Gel Bottle. The{' '}
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}#day-passes`}
            className="underline"
          >
            day spa packages
          </Link>{' '}
          for non-residents start from {twilightPrice || '£55'} for an
          evening session.
          <br />
          <br />
          For other spa options close to Keswick,{' '}
          <Link href="/location/spas-in-borrowdale" className="underline">
            Borrowdale
          </Link>{' '}
          is 5 miles south and home to The Falls Spa at Lodore Falls Hotel,
          which features a 16-metre outdoor infinity pool overlooking
          Derwentwater.{' '}
          <Link href="/location/spas-in-bassenthwaite" className="underline">
            Bassenthwaite
          </Link>{' '}
          is 5 miles northwest with Armathwaite Hall Hotel and Spa.
        </>
      ),
      schemaText: `Yes. ${underscar?.name || 'The Spa at Underscar'} is located at Applethwaite on the slopes of Skiddaw above Keswick, with views over Derwentwater. The spa is included for cottage guests and open to day visitors from ${twilightPrice || '£55'}. Facilities include a 13-metre heated pool, hydrotherapy jacuzzi, eucalyptus sauna, steam room, relaxation room, and gym. Treatments use Germaine de Capuccini, NEOM Organics, and The Gel Bottle products. Borrowdale (5 miles south) has The Falls Spa at Lodore Falls, and Bassenthwaite (5 miles northwest) has Armathwaite Hall.`,
    },

    // FAQ 2: underscar spa day / spa day keswick
    {
      question: 'Can you do a spa day near Keswick without staying overnight?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}#day-passes`}
            className="underline"
          >
            {underscar?.name || 'The Spa at Underscar'}
          </Link>{' '}
          offers seven{' '}
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}#day-passes`}
            className="underline"
          >
            day spa packages
          </Link>{' '}
          for non-residents. The entry-level option is the Twilight Spa
          Experience at {twilightPrice || '£55'}, giving 3 hours of evening
          access (6pm–9pm) to the pool, jacuzzi, sauna, steam room, and gym.
          <br />
          <br />
          Half-day packages run for 4 hours 15 minutes and start from{' '}
          {harmoniPrice || '£80'} for the Harmonie package, which includes
          a 30-minute gel manicure or pedicure, hot drink, and traybake.
          Packages adding a massage or express facial are available from £90,
          while the Mindfulness Half Spa Day (£100) includes a NEOM back
          massage with a candle to keep.
          <br />
          <br />
          Full spa days run from 9am to 5:15pm (8 hours 15 minutes) and range
          from £150 to {reflectionPrice || '£210'}. The premium{' '}
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}#underscar-reflection-full-day`}
            className="underline"
          >
            Reflection Full Spa Day
          </Link>{' '}
          ({reflectionPrice || '£210'}) includes two hour-long treatments from
          the premium menu and High Tea. All packages include towel, robe, and
          slippers. Booking is required in advance.
        </>
      ),
      schemaText: `Yes. ${underscar?.name || 'The Spa at Underscar'} offers seven day spa packages for non-residents near Keswick. The Twilight Spa Experience costs ${twilightPrice || '£55'} for 3 hours (6pm-9pm). Half-day packages from ${harmoniPrice || '£80'} include treatments, hot drink, and traybake. Full spa days (9am-5:15pm) range from £150 to ${reflectionPrice || '£210'}, with the Reflection Full Spa Day including two hour-long treatments and High Tea. All packages include pool, jacuzzi, sauna, steam room, gym, towel, robe, and slippers. Advance booking required.`,
    },

    // FAQ 3: spa treatments near keswick / underscar treatments
    {
      question: 'What spa treatments are available near Keswick?',
      answer: (
        <>
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}#treatments`}
            className="underline"
          >
            {underscar?.name || 'The Spa at Underscar'}
          </Link>{' '}
          near Keswick offers over{' '}
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}#treatments`}
            className="underline"
          >
            {treatmentCount || 40} treatments
          </Link>{' '}
          using{' '}
          {brandsText ||
            'Germaine de Capuccini, NEOM Organics, and The Gel Bottle'}{' '}
          products.
          <br />
          <br />
          Massage therapies range from the 30-minute Walkers Leg Massage (£60)
          — designed for those who have been out on the fells above Keswick —
          to the 90-minute Aromatherapy Massage with Face and Scalp (£120).
          Deep tissue (£85), hot stone (from £65), and Indian head massage
          (£65) are also available.
          <br />
          <br />
          Germaine de Capuccini facials range from 30-minute Express Facials
          (£65) through to advanced Timexpert anti-ageing treatments from
          £115. NEOM Organics body experiences (£90) blend meditation,
          shiatsu, and reflexology techniques in De-Stress, Sleep, or Mood
          Boost formats. Pregnancy treatments are available via the 90-minute
          Baobab Pregnancy Treatment (£120). For the full list, see the{' '}
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}#treatments`}
            className="underline"
          >
            treatments section
          </Link>
          .
        </>
      ),
      schemaText: `${underscar?.name || 'The Spa at Underscar'} near Keswick offers over ${treatmentCount || 40} treatments using ${brandsText || 'Germaine de Capuccini, NEOM Organics, and The Gel Bottle'} products. Massages range from a 30-minute Walkers Leg Massage (£60) to a 90-minute Aromatherapy Massage with Face and Scalp (£120). Germaine de Capuccini facials from £65 (express) to £120 (advanced Timexpert). NEOM Organics holistic experiences (£90) in De-Stress, Sleep, and Mood Boost. Baobab Pregnancy Treatment (90 minutes, £120) available.`,
    },

    // FAQ 4: underscar cottages spa included / is spa free at underscar
    {
      question: 'Is the spa at Underscar included with cottage bookings?',
      answer: (
        <>
          Yes. Spa access is complimentary for all guests staying at Underscar
          and is included with every cottage booking at no additional charge.
          This covers the 13-metre heated indoor pool, hydrotherapy jacuzzi,
          eucalyptus sauna, steam room, relaxation room, and gym for the full
          duration of your stay.
          <br />
          <br />
          There is no time limit on facility access for cottage guests. You can
          use the spa at any point during opening hours without pre-booking.
          The spa operates adults-only hours during late evening and early
          morning, with designated family swim times available during the day
          for children staying in the cottages.
          <br />
          <br />
          Cottage guests who want to book treatments can do so online via the{' '}
          <Link href="https://underscar.try.be/" className="underline">
            try.be booking system
          </Link>{' '}
          or by calling 017687 71500. Advance booking is recommended for
          treatments, particularly at weekends and during peak Lake District
          holiday periods. See the full{' '}
          <Link
            href={`/spa/${underscar?.url || 'underscar-spa'}`}
            className="underline"
          >
            Underscar spa page
          </Link>{' '}
          for details on treatments and facilities.
        </>
      ),
      schemaText: `Yes. Spa access is complimentary for all Underscar cottage guests at no extra charge, covering the 13-metre pool, hydrotherapy jacuzzi, eucalyptus sauna, steam room, relaxation room, and gym for the full stay. No time limit and no pre-booking required for facilities. Adults-only hours during late evening and early morning; family swim times available during the day. Treatments can be booked online at underscar.try.be or by calling 017687 71500. Advance booking recommended for treatments.`,
    },
  ];
}
