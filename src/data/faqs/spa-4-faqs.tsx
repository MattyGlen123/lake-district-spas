import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getTreatmentBrandsText,
  getAgePolicy,
  getDayPassPrice,
  getTreatmentIdByName,
  getTreatmentPrice,
  getTreatmentDuration,
} from './helpers';

export function getSpa4FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values
  const brandsText = getTreatmentBrandsText(spa.id);
  const agePolicy = getAgePolicy(spa);
  const driftAwayId = getTreatmentIdByName(spa.id, 'Drift Away (30 min back massage)');
  const powerBreakfastFacialId = getTreatmentIdByName(spa.id, 'The Power Breakfast Facial');
  const champagneTrufflesId = getTreatmentIdByName(spa.id, 'Champagne & Truffles (60 mins)');
  const vipGoldenTruffleId = getTreatmentIdByName(spa.id, 'VIP Golden Truffle Experience');
  
  // Treatment prices and durations
  const driftAway30Price = getTreatmentPrice(spa.id, 'Drift Away (30 min back massage)');
  const driftAway30Duration = getTreatmentDuration(spa.id, '30 minutes');
  const driftAway90Price = getTreatmentPrice(spa.id, 'Drift Away (90 min full body, face & scalp)');
  const driftAway90Duration = getTreatmentDuration(spa.id, '90 minutes');
  const powerBreakfastFacialPrice = getTreatmentPrice(spa.id, 'The Power Breakfast Facial');
  const powerBreakfastFacialDuration = getTreatmentDuration(spa.id, '45 minutes');
  const champagneTrufflesPrice = getTreatmentPrice(spa.id, 'Champagne & Truffles (60 mins)');
  const vipGoldenTrufflePrice = getTreatmentPrice(spa.id, 'VIP Golden Truffle Experience');
  const vipGoldenTruffleDuration = getTreatmentDuration(spa.id, '120 minutes');
  const upgradePrice = getTreatmentPrice(spa.id, 'Hot Oil Scalp Massage Upgrade');
  const upgradeDuration = getTreatmentDuration(spa.id, '15 minutes');

  // Day pass prices
  const facilitiesWeekdayPrice = getDayPassPrice(spa.id, 'daffodil-spa-facilities-weekday');
  const facilitiesWeekendPrice = getDayPassPrice(spa.id, 'daffodil-spa-facilities-weekend');
  const afternoonBlissPrice = getDayPassPrice(spa.id, 'daffodil-afternoon-bliss');
  const simplySpaTimePrice = getDayPassPrice(spa.id, 'daffodil-simply-spa-time');
  const twilightSpaPrice = getDayPassPrice(spa.id, 'daffodil-twilight-spa');
  const itsAllGoodWeekdayPrice = getDayPassPrice(spa.id, 'daffodil-its-all-good-weekday');
  const doNotDisturbWeekendPrice = getDayPassPrice(spa.id, 'daffodil-do-not-disturb-weekend');

  return [
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          Yes, spa access is complimentary for all hotel guests at {spa.name}. You can use the spa facilities from 2pm on your arrival day until midday on your departure day at no additional charge. This includes full access to the 33ft hydrotherapy pool with cascade water features, Finnish sauna, steam room, tepidarium, and relaxation lounge.
          <br />
          <br />
          There&apos;s no need to pre book your spa time as a hotel guest. Simply head down to the spa during opening hours (8am to 8pm daily) and enjoy the facilities at your leisure. The spa operates on a relaxed basis for hotel guests rather than timed slots, so you can come and go as you please throughout your stay.
          <br />
          <br />
          {agePolicy && (
            <>
              Please note that the spa is for guests aged {agePolicy} only due to the thermal heat experiences.{' '}
            </>
          )}
          If you&apos;d like to book a treatment during your stay, it&apos;s best to reserve in advance as appointments can fill up, especially at weekends. For full details on{' '}
          <Link href="#treatments" className="underline">
            treatments
          </Link>
          {' '}and{' '}
          <Link href="#thermal" className="underline">
            facilities
          </Link>
          , see the relevant sections.
        </>
      ),
      schemaText: `Yes, spa access is complimentary for all hotel guests at ${spa.name}. You can use the spa facilities from 2pm on arrival until midday on departure at no additional charge. This includes the 33ft hydrotherapy pool with cascade features, Finnish sauna, steam room, tepidarium, and relaxation lounge. No pre-booking needed for hotel guests. The spa is open 8am to 8pm daily${agePolicy ? ` and is for guests aged ${agePolicy} only` : ''}.`,
    },
    {
      question: `Can I combine afternoon tea with a spa visit at ${spa.name}?`,
      answer: (
        <>
          Yes, {spa.name} offers the{' '}
          <Link href="#daffodil-afternoon-bliss" className="underline">
            Afternoon Bliss
          </Link>{' '}
          package ({afternoonBlissPrice || '£70'} per person) which combines 3 hours of spa access with a full afternoon tea served in the lake view Dining Room overlooking Grasmere. This is one of the most popular spa day options and a wonderful way to spend an afternoon in the Lake District.
          <br />
          <br />
          The package is available Monday to Sunday and includes full use of the hydrotherapy pool, Finnish sauna, steam room, and relaxation areas. Your afternoon tea features a selection of finger sandwiches, freshly baked scones with clotted cream and jam, and a range of sweet treats, all served with views across Grasmere lake.
          <br />
          <br />
          If you prefer lunch instead of afternoon tea, the{' '}
          <Link href="#daffodil-simply-spa-time" className="underline">
            Simply Spa Time
          </Link>{' '}
          package ({simplySpaTimePrice || '£60'}) offers 2 hours of spa access with a 2 course lunch. Booking is required for all spa day packages. For all options, see the{' '}
          <Link href="#day-passes" className="underline">
            day passes section
          </Link>
          .
        </>
      ),
      schemaText: `Yes, ${spa.name} offers the Afternoon Bliss package (${afternoonBlissPrice || '£70'} per person) combining 3 hours of spa access with full afternoon tea in the lake view Dining Room overlooking Grasmere. Available Monday to Sunday, it includes the hydrotherapy pool, Finnish sauna, steam room, and relaxation areas. Alternatively, Simply Spa Time (${simplySpaTimePrice || '£60'}) offers 2 hours spa access with 2 course lunch. Booking required for all packages.`,
    },
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa day packages at {spa.name} range from {facilitiesWeekdayPrice || '£35'} to {doNotDisturbWeekendPrice || '£195'} per person, depending on what&apos;s included. The spa offers nine different packages to suit various budgets and preferences.
          <br />
          <br />
          For spa facilities only, prices start at {facilitiesWeekdayPrice || '£35'} for 3 hours Monday to Thursday, or {facilitiesWeekendPrice || '£45'} Friday to Sunday and bank holidays. The{' '}
          <Link href="#daffodil-twilight-spa" className="underline">
            Twilight Spa
          </Link>{' '}
          ({twilightSpaPrice || '£40'}) offers 2 hours of evening access from 4pm with a glass of prosecco. For spa with dining, the{' '}
          <Link href="#daffodil-simply-spa-time" className="underline">
            Simply Spa Time
          </Link>{' '}
          ({simplySpaTimePrice || '£60'}) includes 2 course lunch, while{' '}
          <Link href="#daffodil-afternoon-bliss" className="underline">
            Afternoon Bliss
          </Link>{' '}
          ({afternoonBlissPrice || '£70'}) features full afternoon tea with lake views.
          <br />
          <br />
          Full spa days with treatments start at {itsAllGoodWeekdayPrice || '£170'} for the It&apos;s All Good package (facial, back massage, spa access, and lunch). All packages include use of the hydrotherapy pool, sauna, steam room, and relaxation lounge. The spa is{' '}
          {agePolicy ? `for guests aged ${agePolicy} only` : 'adults only'}. For booking details, see the{' '}
          <Link href="#day-passes" className="underline">
            day passes section
          </Link>
          .
        </>
      ),
      schemaText: `Spa day packages at ${spa.name} range from ${facilitiesWeekdayPrice || '£35'} to ${doNotDisturbWeekendPrice || '£195'} per person. Facilities only: ${facilitiesWeekdayPrice || '£35'} weekday or ${facilitiesWeekendPrice || '£45'} weekend for 3 hours. Twilight Spa (${twilightSpaPrice || '£40'}) offers 2 hours evening access with prosecco. Simply Spa Time (${simplySpaTimePrice || '£60'}) includes 2 course lunch. Afternoon Bliss (${afternoonBlissPrice || '£70'}) includes afternoon tea with lake views. Full spa days with treatments from ${itsAllGoodWeekdayPrice || '£170'}. All packages include hydrotherapy pool, sauna, steam room access.`,
    },
    {
      question: `What spa treatments are available at ${spa.name}?`,
      answer: (
        <>
          {spa.name} offers 33 spa treatments using{brandsText ? ` ${brandsText}` : ' Temple Spa products'}, ranging from {upgradeDuration || '15 minute'} upgrades to {vipGoldenTruffleDuration || '2 hour'} luxury experiences. Treatments span facials, massage therapies, body treatments, and hands and feet treatments, with prices from {upgradePrice || '£15'} to {vipGoldenTrufflePrice || '£231'}.
          <br />
          <br />
          Popular treatments include the{' '}
          <Link href={driftAwayId ? `#${driftAwayId}` : '#treatments'} className="underline">
            Drift Away massage
          </Link>{' '}
          (from {driftAway30Price || '£72'} for {driftAway30Duration || '30 minutes'} back massage, up to {driftAway90Price || '£140'} for {driftAway90Duration || '90 minutes'} full body with face and scalp), the{' '}
          <Link href={powerBreakfastFacialId ? `#${powerBreakfastFacialId}` : '#treatments'} className="underline">
            Power Breakfast Facial
          </Link>{' '}
          ({powerBreakfastFacialPrice || '£77'}, {powerBreakfastFacialDuration || '45 minutes'}) for quick results, and the luxurious{' '}
          <Link href={champagneTrufflesId ? `#${champagneTrufflesId}` : '#treatments'} className="underline">
            Champagne and Truffles facial
          </Link>{' '}
          (from {champagneTrufflesPrice || '£121'}). For the ultimate indulgence, the{' '}
          <Link href={vipGoldenTruffleId ? `#${vipGoldenTruffleId}` : '#treatments'} className="underline">
            VIP Golden Truffle Experience
          </Link>{' '}
          ({vipGoldenTrufflePrice || '£231'}, {vipGoldenTruffleDuration || '2 hours'}) combines full body exfoliation, anti ageing massage, and deluxe facial.
          <br />
          <br />
          The spa also offers pregnancy safe treatments through the New Beginnings range, reflexology, and various express treatments that can enhance any spa visit. Quick {upgradeDuration || '15 minute'} upgrades like hot oil scalp massage or eye massage are available from {upgradePrice || '£15'} to add to your main treatment. For the full menu, see the{' '}
          <Link href="#treatments" className="underline">
            treatments section
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} offers 33 spa treatments using${brandsText ? ` ${brandsText}` : ' Temple Spa products'}, from ${upgradeDuration || '15 minute'} upgrades to ${vipGoldenTruffleDuration || '2 hour'} experiences, priced ${upgradePrice || '£15'} to ${vipGoldenTrufflePrice || '£231'}. Popular options include Drift Away massage (from ${driftAway30Price || '£72'}), Power Breakfast Facial (${powerBreakfastFacialPrice || '£77'}, ${powerBreakfastFacialDuration || '45 minutes'}), and Champagne and Truffles facial (from ${champagneTrufflesPrice || '£121'}). The VIP Golden Truffle Experience (${vipGoldenTrufflePrice || '£231'}, ${vipGoldenTruffleDuration || '2 hours'}) is the ultimate indulgence. Pregnancy safe treatments available through New Beginnings range. Express ${upgradeDuration || '15 minute'} upgrades from ${upgradePrice || '£15'}.`,
    },
    {
      question: `Do I need to book the spa in advance at ${spa.name}?`,
      answer: (
        <>
          It depends on whether you&apos;re a hotel guest or day visitor. Hotel guests do not need to book spa facility access in advance. You can simply turn up during spa opening hours (8am to 8pm daily) and use the hydrotherapy pool, sauna, steam room, and relaxation areas at your leisure throughout your stay.
          <br />
          <br />
          Day visitors must book their spa experience in advance, as day passes have limited availability. Weekend slots and packages including afternoon tea tend to book up faster, so it&apos;s worth reserving ahead if you have specific dates in mind.
          <br />
          <br />
          For spa treatments, advance booking is recommended for both hotel guests and day visitors. Popular treatments and weekend appointments fill up quickly. You can book treatments when making your room reservation, or contact the spa team separately. See the{' '}
          <Link href="#treatments" className="underline">
            treatments
          </Link>{' '}
          and{' '}
          <Link href="#day-passes" className="underline">
            day passes
          </Link>{' '}
          sections for booking information.
        </>
      ),
      schemaText: `Hotel guests do not need to book spa facility access in advance at ${spa.name}. Simply turn up during opening hours (8am to 8pm) and use facilities at leisure. Day visitors must book in advance as day passes have limited availability. Contact thespateam@daffodilhotel.com or call the hotel. Weekend slots book faster. For treatments, advance booking recommended for everyone as popular appointments fill quickly.`,
    },
  ];
}

