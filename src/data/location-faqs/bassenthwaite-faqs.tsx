import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentBrandsText,
  getThermalFacilitiesCount,
  getTreatmentPrice,
  getTreatmentIdByName,
} from '@/data/faqs/helpers';

export function getBassenthwaiteFAQs(spas: Spa[]): FAQ[] {
  const armathwaite = spas.find((s) => s.id === 2);

  // Day pass prices
  const sunriseWeekdayPrice = getDayPassPrice(2, 'armathwaite-sunrise-weekday');
  const sunsetWeekdayPrice = getDayPassPrice(2, 'armathwaite-sunset-weekday');
  const escapeWeekdayPrice = getDayPassPrice(2, 'armathwaite-escape-weekday');
  const serenityWeekdayPrice = getDayPassPrice(2, 'armathwaite-serenity-weekday');
  const serenityWeekendPrice = getDayPassPrice(2, 'armathwaite-serenity-weekend');
  const sereniTeaWeekdayPrice = getDayPassPrice(2, 'armathwaite-sereni-tea-weekday');

  // Durations
  const sunriseDuration = getDayPassDuration(2, 'armathwaite-sunrise-weekday');
  const serenityDuration = getDayPassDuration(2, 'armathwaite-serenity-weekday');

  // Treatment and facility values
  const brandsText = armathwaite ? getTreatmentBrandsText(armathwaite.id) : null;
  const thermalCount = armathwaite ? getThermalFacilitiesCount(armathwaite) : null;
  const walkersRecoveryPrice = getTreatmentPrice(2, "Organic Walker's Recovery");
  const walkersRecoveryId = getTreatmentIdByName(2, "Organic Walker's Recovery");
  const herbalSleepCocoonPrice = getTreatmentPrice(2, 'Herbal Sleep Cocoon');
  const herbalSleepCocoonId = getTreatmentIdByName(2, 'Herbal Sleep Cocoon');

  return [
    // FAQ 1: bassenthwaite lake things to do
    {
      question: 'What is there to do around Bassenthwaite Lake?',
      answer: (
        <>
          Bassenthwaite Lake is the only body of water in the Lake District
          officially called a lake, and the area around it offers a mix of
          outdoor activities and relaxation. Walking routes range from gentle
          lakeside paths to the summit of Skiddaw, England&apos;s fourth
          highest peak. The lake is also one of only two sites in England
          where ospreys nest, with a viewing point open during breeding
          season.
          <br />
          <br />
          For a spa experience, the{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}`}
            className="underline"
          >
            {armathwaite?.name || 'Armathwaite Hall Hotel & Spa'}
          </Link>{' '}
          sits within a 400 acre deer park on the eastern shore. The spa
          features outdoor infinity pools with fell views, an Amethyst
          Crystal Cave steam room, and {thermalCount || 2} thermal
          facilities.{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}#day-passes`}
            className="underline"
          >
            Day spa packages
          </Link>{' '}
          start from {sunriseWeekdayPrice || '£70'} for a morning session,
          making it easy to combine a walk with a spa visit on the same day.
          <br />
          <br />
          The market town of Keswick is a short drive south, with independent
          shops, the Theatre by the Lake, and the Derwentwater launch.
          Nearby{' '}
          <Link
            href="/location/spas-in-borrowdale"
            className="underline"
          >
            Borrowdale
          </Link>{' '}
          and{' '}
          <Link
            href="/location/spas-in-ullswater"
            className="underline"
          >
            Ullswater
          </Link>{' '}
          offer further spa options within easy reach.
        </>
      ),
      schemaText: `Bassenthwaite Lake is the only body of water in the Lake District officially called a lake. Activities include walks from gentle lakeside paths to the summit of Skiddaw, plus osprey watching during breeding season. The ${armathwaite?.name || 'Armathwaite Hall Hotel & Spa'} sits within a 400 acre deer park on the shore, offering outdoor infinity pools, an Amethyst Crystal Cave steam room, and ${thermalCount || 2} thermal facilities. Day spa packages start from ${sunriseWeekdayPrice || '£70'}. The market town of Keswick is a short drive south with shops, Theatre by the Lake, and the Derwentwater launch. Borrowdale and Ullswater are also within easy reach.`,
    },

    // FAQ 2: bassenthwaite spa
    {
      question: 'Is there a spa in Bassenthwaite?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}`}
            className="underline"
          >
            {armathwaite?.name || 'Armathwaite Hall Hotel & Spa'}
          </Link>{' '}
          is the spa in Bassenthwaite, set within a turreted Victorian
          mansion on the shores of Bassenthwaite Lake. The spa features
          outdoor infinity pools overlooking the fells, a 16 metre indoor
          pool, an outdoor hot tub, and {thermalCount || 2} thermal
          experiences including the distinctive Amethyst Crystal Cave steam
          room and a Finnish sauna.
          <br />
          <br />
          The{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}#treatments`}
            className="underline"
          >
            treatment menu
          </Link>{' '}
          spans over 25 options using{' '}
          {brandsText || 'Temple Spa, VOYA, and Made for Life products'}.
          Standout treatments include the{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}#${walkersRecoveryId || 'treatments'}`}
            className="underline"
          >
            Organic Walker&apos;s Recovery
          </Link>{' '}
          ({walkersRecoveryPrice || '£105'}), an exclusive massage designed
          for fell walkers that you won&apos;t find at any other Lake
          District spa.
          <br />
          <br />
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}#day-passes`}
            className="underline"
          >
            Day passes
          </Link>{' '}
          range from {sunriseWeekdayPrice || '£70'} for a{' '}
          {sunriseDuration || '2.5 hours'} Sunrise Spa to{' '}
          {serenityWeekendPrice || '£200'} for a full day Serenity package
          with treatment and lunch. Hotel guests receive complimentary spa
          access.
        </>
      ),
      schemaText: `Yes. ${armathwaite?.name || 'Armathwaite Hall Hotel & Spa'} is the spa in Bassenthwaite, set within a Victorian mansion on the shores of Bassenthwaite Lake. The spa features outdoor infinity pools, a 16 metre indoor pool, outdoor hot tub, and ${thermalCount || 2} thermal experiences including the Amethyst Crystal Cave steam room and Finnish sauna. Over 25 treatments use ${brandsText || 'Temple Spa, VOYA, and Made for Life products'}, with the exclusive Organic Walker's Recovery massage at ${walkersRecoveryPrice || '£105'} designed for fell walkers. Day passes range from ${sunriseWeekdayPrice || '£70'} for a ${sunriseDuration || '2.5 hours'} Sunrise Spa to ${serenityWeekendPrice || '£200'} for the full day Serenity package. Hotel guests receive complimentary spa access.`,
    },

    // FAQ 3: spa near keswick
    {
      question: 'What is the nearest spa to Keswick?',
      answer: (
        <>
          The nearest spa to Keswick is{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}`}
            className="underline"
          >
            {armathwaite?.name || 'Armathwaite Hall Hotel & Spa'}
          </Link>{' '}
          in Bassenthwaite, approximately 6 miles north of Keswick town
          centre (around 15 minutes by car). It is a country estate spa on
          the shores of Bassenthwaite Lake with outdoor infinity pools, an
          Amethyst Crystal Cave steam room, and a 16 metre indoor pool.
          <br />
          <br />
          Day visitors can book packages starting from{' '}
          {sunriseWeekdayPrice || '£70'} for the morning{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}#armathwaite-sunrise-weekday`}
            className="underline"
          >
            Sunrise Spa
          </Link>
          , or from {sunsetWeekdayPrice || '£70'} for the evening{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}#armathwaite-sunset-weekday`}
            className="underline"
          >
            Sunset Spa
          </Link>{' '}
          which includes prosecco in the hot tub. Full day packages with a
          treatment and lunch start at {serenityWeekdayPrice || '£190'}.
          Treatments use{' '}
          {brandsText || 'Temple Spa, VOYA, and Made for Life products'}.
          <br />
          <br />
          Further afield,{' '}
          <Link
            href="/location/spas-in-borrowdale"
            className="underline"
          >
            Borrowdale
          </Link>{' '}
          (10 miles south of Bassenthwaite) and{' '}
          <Link
            href="/location/spas-in-penrith"
            className="underline"
          >
            Penrith
          </Link>{' '}
          (18 miles east) offer alternative spa options in the northern
          Lakes.
        </>
      ),
      schemaText: `The nearest spa to Keswick is ${armathwaite?.name || 'Armathwaite Hall Hotel & Spa'} in Bassenthwaite, approximately 6 miles north (around 15 minutes by car). It is a country estate spa on Bassenthwaite Lake with outdoor infinity pools, an Amethyst Crystal Cave steam room, and a 16 metre indoor pool. Day packages start from ${sunriseWeekdayPrice || '£70'} for the morning Sunrise Spa, or ${sunsetWeekdayPrice || '£70'} for the evening Sunset Spa with prosecco. Full day packages with treatment and lunch start at ${serenityWeekdayPrice || '£190'}. Treatments use ${brandsText || 'Temple Spa, VOYA, and Made for Life products'}. Borrowdale and Penrith offer alternative spa options in the northern Lakes.`,
    },

    // FAQ 4: spa breaks keswick
    {
      question: 'Can you book a spa break near Keswick?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}`}
            className="underline"
          >
            {armathwaite?.name || 'Armathwaite Hall Hotel & Spa'}
          </Link>{' '}
          in Bassenthwaite is the closest spa hotel to Keswick, around 15
          minutes by car. As a full country house hotel set within a 400
          acre deer park, it is well suited for overnight spa breaks.
          Hotel guests receive complimentary spa access including the
          outdoor infinity pools, indoor pool, hot tub, Finnish sauna,
          and Amethyst Crystal Cave steam room.
          <br />
          <br />
          Treatments can be added to your stay and are booked separately.
          The{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}#treatments`}
            className="underline"
          >
            treatment menu
          </Link>{' '}
          includes over 25 options from{' '}
          {brandsText || 'Temple Spa, VOYA, and Made for Life'}. If you
          prefer a day visit without an overnight stay, the{' '}
          <Link
            href={`/spa/${armathwaite?.url || 'armathwaite-hall-hotel-spa'}#armathwaite-sereni-tea-weekday`}
            className="underline"
          >
            Sereni Tea
          </Link>{' '}
          package from {sereniTeaWeekdayPrice || '£160'} combines a
          treatment, afternoon tea, and 4 hours of spa access.
          <br />
          <br />
          The location works well for a wider northern Lakes itinerary.
          Keswick, Derwentwater, and Skiddaw are all on the doorstep, with{' '}
          <Link
            href="/location/spas-in-borrowdale"
            className="underline"
          >
            Borrowdale
          </Link>{' '}
          and{' '}
          <Link
            href="/location/spas-in-ullswater"
            className="underline"
          >
            Ullswater
          </Link>{' '}
          both reachable for day trips during your stay.
        </>
      ),
      schemaText: `Yes. ${armathwaite?.name || 'Armathwaite Hall Hotel & Spa'} in Bassenthwaite is the closest spa hotel to Keswick, around 15 minutes by car. Hotel guests receive complimentary spa access including outdoor infinity pools, indoor pool, hot tub, Finnish sauna, and Amethyst Crystal Cave steam room. Treatments are booked separately, with over 25 options from ${brandsText || 'Temple Spa, VOYA, and Made for Life'}. For day visits, the Sereni Tea package from ${sereniTeaWeekdayPrice || '£160'} combines a treatment, afternoon tea, and 4 hours of access. Keswick, Derwentwater, and Skiddaw are all nearby, with Borrowdale and Ullswater reachable for day trips.`,
    },
  ];
}
