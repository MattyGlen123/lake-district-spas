import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getTreatmentBrandsText,
  getAgePolicy,
  getDayPassPrice,
} from './helpers';

export function getSpa19FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values
  const agePolicy = getAgePolicy(spa);
  const brandsText = getTreatmentBrandsText(spa.id);

  // Day pass prices
  const twilightPrice = getDayPassPrice(spa.id, 'underscar-twilight-spa');
  const harmoniPrice = getDayPassPrice(spa.id, 'underscar-harmonie-half-day');
  const serenityHalfPrice = getDayPassPrice(spa.id, 'underscar-serenity-half-day');
  const reflectionPrice = getDayPassPrice(spa.id, 'underscar-reflection-full-day');

  return [
    {
      question: `Is spa access included with a stay at ${spa.name}?`,
      answer: (
        <>
          Yes. All guests staying at Underscar receive complimentary access to the spa
          facilities throughout their stay at no additional charge. This includes the
          13-metre heated indoor swimming pool, hydrotherapy jacuzzi with massage jets,
          eucalyptus-infused sauna, steam room, relaxation room, and Technogym-equipped gym.
          <br />
          <br />
          There is no time limit or pre-booking required for facility access as a cottage
          guest. You can use the spa at your leisure during your stay. The spa operates
          adults-only hours during late evening and early morning, with designated family swim
          times available for younger guests staying in the cottages.
          <br />
          <br />
          {agePolicy && (
            <>
              Please note that the spa, treatments, and packages are for guests aged{' '}
              {agePolicy} and over.{' '}
            </>
          )}
          If you would like to book a spa treatment during your stay, advance booking is
          recommended as appointment slots fill quickly, particularly at weekends. See the{' '}
          <Link href="#treatments" className="underline">
            treatments section
          </Link>{' '}
          for the full menu.
        </>
      ),
      schemaText: `Yes. All guests staying at Underscar receive complimentary access to the spa facilities throughout their stay at no additional charge. This includes the 13-metre heated indoor pool, hydrotherapy jacuzzi, eucalyptus sauna, steam room, relaxation room, and gym. No time limit or pre-booking required for cottage guests. Adults-only hours apply during late evening and early morning, with designated family swim times during the day.${agePolicy ? ` The spa is for guests aged ${agePolicy} and over.` : ''} Advance booking recommended for treatments.`,
    },
    {
      question: `Can I visit the Underscar spa without staying in a cottage?`,
      answer: (
        <>
          Yes. Underscar welcomes day visitors with a range of spa day packages. Options
          start from {twilightPrice || '£55'} for the Twilight Spa Experience, a 3-hour
          evening session from 6pm to 9pm giving access to the pool, jacuzzi, sauna, steam
          room, and gym.
          <br />
          <br />
          Half-day packages run for 4 hours 15 minutes and start from{' '}
          {harmoniPrice || '£80'} for the Harmonie package, which includes a 30-minute gel
          manicure or pedicure, hot drink, and traybake. The{' '}
          <Link href="#underscar-serenity-half-day" className="underline">
            Serenity Half Spa Day
          </Link>{' '}
          ({serenityHalfPrice || '£90'}) includes a 30-minute massage or express facial,
          while the Mindfulness Half Spa Day (£100) adds a NEOM back massage with a candle
          to take home.
          <br />
          <br />
          Full spa days run from 9am to 5:15pm and range from £150 to{' '}
          {reflectionPrice || '£210'}, with the{' '}
          <Link href="#underscar-reflection-full-day" className="underline">
            Reflection Full Spa Day
          </Link>{' '}
          ({reflectionPrice || '£210'}) offering two hour-long treatments and High Tea. All
          packages include towel, robe, and slippers. See the{' '}
          <Link href="#day-passes" className="underline">
            day passes section
          </Link>{' '}
          for full details. Booking is required for all day visitor packages.
        </>
      ),
      schemaText: `Yes. Day visitors are welcome at Underscar with packages from ${twilightPrice || '£55'} for the Twilight Spa Experience (3 hours, 6pm-9pm). Half-day packages from ${harmoniPrice || '£80'} include treatments, a hot drink, and traybake. Full spa days (9am-5:15pm) range from £150 to ${reflectionPrice || '£210'}, with the Reflection Full Spa Day including two hour-long treatments and High Tea. All packages include use of the pool, jacuzzi, sauna, steam room, gym, towel, robe, and slippers. Advance booking required.`,
    },
    {
      question: `What spa treatments are available at ${spa.name}?`,
      answer: (
        <>
          {spa.name} offers a comprehensive treatment menu using{' '}
          {brandsText || 'Germaine de Capuccini, NEOM Organics, and The Gel Bottle'}{' '}
          products. Treatments span four categories: massage therapies, facial treatments,
          body treatments, and hands and feet treatments.
          <br />
          <br />
          Massage therapies range from a 30-minute Back, Neck and Shoulder Massage (£60) to
          a 90-minute Aromatherapy Massage with Face and Scalp (£120). The walkers leg
          massage (£60) is popular with those who have been out on the Skiddaw fells.
          <br />
          <br />
          Facial treatments use the Germaine de Capuccini range, from 30-minute Express
          Facials (£65) to advanced Timexpert treatments (from £115) targeting ageing and
          brightening. NEOM Organics body experiences (£90) combine meditation, shiatsu, and
          reflexology techniques in De-Stress, Sleep, or Mood Boost formats. Pregnancy
          treatments are available through the Baobab Pregnancy Treatment (90 minutes,
          £120). For the full menu, see the{' '}
          <Link href="#treatments" className="underline">
            treatments section
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} offers treatments using ${brandsText || 'Germaine de Capuccini, NEOM Organics, and The Gel Bottle'} products across massage therapies, facials, body treatments, and hands and feet treatments. Massages range from 30-minute Back, Neck and Shoulder (£60) to 90-minute Aromatherapy Massage with Face and Scalp (£120). Germaine de Capuccini facials from 30-minute Express Facials (£65) to Timexpert treatments from £115. NEOM Organics experiences (£90) in De-Stress, Sleep, and Mood Boost. Baobab Pregnancy Treatment (90 minutes, £120) available.`,
    },
    {
      question: `What is the age restriction at the ${spa.name}?`,
      answer: (
        <>
          The minimum age for spa access, treatments, and spa day packages at Underscar is{' '}
          {agePolicy || '16'}. This applies to all visitors using the pool, jacuzzi, sauna,
          steam room, gym, and treatment rooms, whether staying in the cottages or visiting
          as a day guest.
          <br />
          <br />
          Families with younger children are still welcome to stay at Underscar. The spa
          operates adults-only hours during late evening and early morning, while designated
          family swim times during the day allow children staying in the cottages to use the
          pool. Guests aged 15 and under are not permitted during adults-only periods or for
          any spa treatments.
          <br />
          <br />
          If you are booking for a group with mixed ages, it is worth contacting Underscar
          directly on 017687 71500 to confirm current family swim times and any seasonal
          variations.
        </>
      ),
      schemaText: `The minimum age for spa access, treatments, and packages at Underscar is ${agePolicy || '16'}. This applies to all pool, jacuzzi, sauna, steam room, gym, and treatment room use. Families with younger children can stay in the cottages and access designated family swim times during the day. Adults-only hours apply during late evening and early morning. Contact 017687 71500 for current family swim times.`,
    },
    {
      question: `How do I book spa treatments at ${spa.name}?`,
      answer: (
        <>
          Spa treatments at Underscar can be booked online via the{' '}
          <Link href="https://underscar.try.be/" className="underline">
            try.be booking system
          </Link>{' '}
          on the Underscar website, or by calling the team directly on 017687 71500. Email
          enquiries can also be sent to salesandrentals@underscar.co.uk.
          <br />
          <br />
          Advance booking is strongly recommended, particularly for weekends and during peak
          Lake District holiday periods. Some treatments, including the NEOM experiences and
          advanced Germaine de Capuccini facials, are especially popular and can book up
          weeks ahead.
          <br />
          <br />
          Cottage guests can arrange treatments when making their accommodation booking or
          any time before arrival. Day visitors wishing to book a spa day package including a
          treatment should also book in advance via the online system. See the{' '}
          <Link href="#day-passes" className="underline">
            day passes section
          </Link>{' '}
          for the full range of packages.
        </>
      ),
      schemaText: `Spa treatments at Underscar can be booked online via the try.be booking system or by calling 017687 71500. Email enquiries to salesandrentals@underscar.co.uk. Advance booking strongly recommended, especially for weekends and peak periods. Cottage guests can book when making accommodation reservations or any time before arrival. Day visitors should book spa day packages including treatments in advance online.`,
    },
  ];
}
