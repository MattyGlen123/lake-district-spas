import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getThermalFacilitiesCount,
  getAgePolicy,
} from '@/data/faqs/helpers';
import { getTreatmentsBySpaId } from '@/data/treatments';

export function getGrasmereFAQs(spas: Spa[]): FAQ[] {
  const daffodil = spas.find((s) => s.id === 4);
  const rothayGarden = spas.find((s) => s.id === 11);

  // Daffodil values
  const daffodilThermalCount = daffodil
    ? getThermalFacilitiesCount(daffodil)
    : null;
  const daffodilTreatmentCount = daffodil
    ? getTreatmentsBySpaId(daffodil.id).length
    : null;
  const daffodilAgePolicy = daffodil ? getAgePolicy(daffodil) : null;
  const daffodilFacilitiesWeekdayPrice = daffodil
    ? getDayPassPrice(daffodil.id, 'daffodil-spa-facilities-weekday')
    : null;
  const daffodilFacilitiesWeekendPrice = daffodil
    ? getDayPassPrice(daffodil.id, 'daffodil-spa-facilities-weekend')
    : null;
  const daffodilAfternoonBlissPrice = daffodil
    ? getDayPassPrice(daffodil.id, 'daffodil-afternoon-bliss')
    : null;
  const daffodilTwilightSpaPrice = daffodil
    ? getDayPassPrice(daffodil.id, 'daffodil-twilight-spa')
    : null;
  const daffodilDoNotDisturbWeekendPrice = daffodil
    ? getDayPassPrice(daffodil.id, 'daffodil-do-not-disturb-weekend')
    : null;

  // Rothay Garden values
  const rothayThermalCount = rothayGarden
    ? getThermalFacilitiesCount(rothayGarden)
    : null;
  const rothayAgePolicy = rothayGarden ? getAgePolicy(rothayGarden) : null;

  return [
    {
      question: 'What spas are there in Grasmere?',
      answer: (
        <>
          Grasmere has two spa hotels, each with a distinct character and setting.{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}`}
            className="underline"
          >
            {daffodil?.name || 'Daffodil Hotel Spa'}
          </Link>{' '}
          occupies the only lakeside position in the village, with a 33ft hydrotherapy pool, Finnish sauna, steam room, tepidarium, and rasul mud chamber. It uses TEMPLESPA products across {daffodilTreatmentCount || 33} treatments and welcomes both hotel guests and day visitors, with{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}#day-passes`}
            className="underline"
          >
            day passes
          </Link>{' '}
          starting from {daffodilFacilitiesWeekdayPrice || '£35'} per person.
          <br />
          <br />
          <Link
            href={`/spa/${rothayGarden?.url || 'rothay-garden-by-harbour-hotels'}`}
            className="underline"
          >
            {rothayGarden?.name || 'Rothay Garden by Harbour Hotels'}
          </Link>{' '}
          is nestled in riverside gardens on the edge of the village, where the River Rothay flows beneath the fells. The Riverside Spa features a HydroSpa hydrotherapy pool with fell views, hot tub, herbal pine sauna, aromatherapy steam room, infrared heated loungers, and a heated pebble reflexology walk. It is exclusively for hotel guests, with no day passes available.
          <br />
          <br />
          The key difference is access. If you want a spa day without an overnight stay, {daffodil?.name || 'Daffodil Hotel Spa'} is your option. If you prefer an intimate, uncrowded atmosphere reserved for guests only, {rothayGarden?.name || 'Rothay Garden by Harbour Hotels'} delivers that. Both spas are adults only ({daffodilAgePolicy || '16+'} at the Daffodil, {rothayAgePolicy || '18+'} at Rothay Garden).
        </>
      ),
      schemaText: `Grasmere has two spa hotels. ${daffodil?.name || 'Daffodil Hotel Spa'} occupies the only lakeside position with a 33ft hydrotherapy pool, Finnish sauna, steam room, tepidarium, and rasul mud chamber using TEMPLESPA products. Day passes from ${daffodilFacilitiesWeekdayPrice || '£35'} per person. ${rothayGarden?.name || 'Rothay Garden by Harbour Hotels'} is in riverside gardens with a HydroSpa hydrotherapy pool, hot tub, herbal pine sauna, aromatherapy steam room, infrared heated loungers, and heated pebble reflexology walk. Rothay Garden is exclusively for hotel guests with no day passes. Both are adults only.`,
    },
    {
      question: 'Which Grasmere hotels have a spa?',
      answer: (
        <>
          Two hotels in Grasmere have spa facilities.{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}`}
            className="underline"
          >
            {daffodil?.name || 'Daffodil Hotel Spa'}
          </Link>{' '}
          sits on the shore of Grasmere lake with {daffodilThermalCount || 4} thermal facilities including a 33ft hydrotherapy pool with cascade water features, Finnish sauna, steam room, and tepidarium. It also has a rasul mud chamber for a more unusual spa experience. The lake view Dining Room overlooks the water, and{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}#day-passes`}
            className="underline"
          >
            spa day packages
          </Link>{' '}
          can include afternoon tea or a 2 course lunch.
          <br />
          <br />
          <Link
            href={`/spa/${rothayGarden?.url || 'rothay-garden-by-harbour-hotels'}`}
            className="underline"
          >
            {rothayGarden?.name || 'Rothay Garden by Harbour Hotels'}
          </Link>{' '}
          is a country house hotel in two acres of gardens beside the River Rothay. The Riverside Spa has {rothayThermalCount || 4} thermal facilities with floor to ceiling windows framing fell views, plus a hot tub and heated pebble reflexology walk. The hotel also has a 2 AA Rosette restaurant and welcomes dogs throughout.
          <br />
          <br />
          Both hotels include complimentary spa access for guests. For nearby alternatives, {' '}
          <Link href="/location/spas-in-ambleside" className="underline">
            Ambleside
          </Link>{' '}
          is 4 miles south and{' '}
          <Link href="/location/spas-in-borrowdale" className="underline">
            Borrowdale
          </Link>{' '}
          is 8 miles north.
        </>
      ),
      schemaText: `Two hotels in Grasmere have spa facilities. ${daffodil?.name || 'Daffodil Hotel Spa'} sits on the shore of Grasmere lake with ${daffodilThermalCount || 4} thermal facilities including a 33ft hydrotherapy pool, Finnish sauna, steam room, and tepidarium, plus a rasul mud chamber. ${rothayGarden?.name || 'Rothay Garden by Harbour Hotels'} is a country house hotel in riverside gardens with ${rothayThermalCount || 4} thermal facilities, a hot tub, and heated pebble reflexology walk. Both hotels include complimentary spa access for guests. Ambleside is 4 miles south and Borrowdale is 8 miles north for nearby alternatives.`,
    },
    {
      question: 'Can you do a spa day in Grasmere without staying overnight?',
      answer: (
        <>
          Yes, but only at one of Grasmere&apos;s two spas.{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}#day-passes`}
            className="underline"
          >
            {daffodil?.name || 'Daffodil Hotel Spa'}
          </Link>{' '}
          offers nine different day pass packages ranging from {daffodilFacilitiesWeekdayPrice || '£35'} to {daffodilDoNotDisturbWeekendPrice || '£195'} per person. The most affordable option is 3 hours of spa facilities for {daffodilFacilitiesWeekdayPrice || '£35'} Monday to Thursday or {daffodilFacilitiesWeekendPrice || '£45'} at weekends. The{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}#daffodil-twilight-spa`}
            className="underline"
          >
            Twilight Spa
          </Link>{' '}
          ({daffodilTwilightSpaPrice || '£40'}) is a popular evening option with 2 hours of access and a glass of prosecco from 4pm.
          <br />
          <br />
          For a fuller experience, the{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}#daffodil-afternoon-bliss`}
            className="underline"
          >
            Afternoon Bliss
          </Link>{' '}
          package ({daffodilAfternoonBlissPrice || '£70'}) combines 3 hours of spa access with a full afternoon tea in the lake view Dining Room overlooking Grasmere. Full spa days with treatments included start from {daffodilFacilitiesWeekdayPrice ? '£170' : '£170'} midweek.
          <br />
          <br />
          <Link
            href={`/spa/${rothayGarden?.url || 'rothay-garden-by-harbour-hotels'}`}
            className="underline"
          >
            {rothayGarden?.name || 'Rothay Garden by Harbour Hotels'}
          </Link>{' '}
          does not offer day passes. The Riverside Spa is exclusively for hotel guests, so you would need to book a room to access the facilities there.
        </>
      ),
      schemaText: `Yes, but only at ${daffodil?.name || 'Daffodil Hotel Spa'}, which offers nine day pass packages from ${daffodilFacilitiesWeekdayPrice || '£35'} to ${daffodilDoNotDisturbWeekendPrice || '£195'} per person. Spa facilities access costs ${daffodilFacilitiesWeekdayPrice || '£35'} weekday or ${daffodilFacilitiesWeekendPrice || '£45'} weekend for 3 hours. Twilight Spa (${daffodilTwilightSpaPrice || '£40'}) offers 2 hours evening access with prosecco. Afternoon Bliss (${daffodilAfternoonBlissPrice || '£70'}) includes afternoon tea with lake views. ${rothayGarden?.name || 'Rothay Garden by Harbour Hotels'} does not offer day passes and is exclusively for hotel guests.`,
    },
    {
      question: 'Does the Wordsworth Hotel in Grasmere have a spa?',
      answer: (
        <>
          No. The Wordsworth Hotel in Grasmere previously had a pool and spa, but these facilities were permanently removed during a major renovation that began in October 2024. The hotel is being refurbished by The Inn Collection Group and is expected to reopen in early 2026 as The Wordsworth Inn, focused on dining and accommodation rather than wellness. The former spa and pool areas have been converted into additional bedrooms.
          <br />
          <br />
          If you&apos;re looking for a spa in Grasmere, the village still has two options.{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}`}
            className="underline"
          >
            {daffodil?.name || 'Daffodil Hotel Spa'}
          </Link>{' '}
          is the village&apos;s lakeside spa hotel with a 33ft hydrotherapy pool, {daffodilThermalCount || 4} thermal facilities, and {daffodilTreatmentCount || 33} treatments using TEMPLESPA products. It offers{' '}
          <Link
            href={`/spa/${daffodil?.url || 'daffodil-hotel-spa'}#day-passes`}
            className="underline"
          >
            day passes
          </Link>{' '}
          from {daffodilFacilitiesWeekdayPrice || '£35'} per person and is open to visitors aged {daffodilAgePolicy || '16+'}.
          <br />
          <br />
          <Link
            href={`/spa/${rothayGarden?.url || 'rothay-garden-by-harbour-hotels'}`}
            className="underline"
          >
            {rothayGarden?.name || 'Rothay Garden by Harbour Hotels'}
          </Link>{' '}
          offers the Riverside Spa with a HydroSpa hydrotherapy pool, herbal pine sauna, aromatherapy steam room, infrared heated loungers, and fell views through floor to ceiling windows. It&apos;s exclusively for hotel guests aged {rothayAgePolicy || '18+'}, with no day passes available.
        </>
      ),
      schemaText: `No. The Wordsworth Hotel in Grasmere previously had a pool and spa, but these facilities were permanently removed during a major renovation that began in October 2024. The hotel is being refurbished by The Inn Collection Group and is expected to reopen in early 2026 as The Wordsworth Inn, without spa facilities. If you're looking for a spa in Grasmere, ${daffodil?.name || 'Daffodil Hotel Spa'} has a 33ft hydrotherapy pool, ${daffodilThermalCount || 4} thermal facilities, and 33 TEMPLESPA treatments with day passes from ${daffodilFacilitiesWeekdayPrice || '£35'}. ${rothayGarden?.name || 'Rothay Garden by Harbour Hotels'} offers the Riverside Spa exclusively for hotel guests aged ${rothayAgePolicy || '18+'}.`,
    },
  ];
}
