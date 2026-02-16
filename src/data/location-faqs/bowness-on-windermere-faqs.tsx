import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getTreatmentBrandsText,
  getThermalFacilitiesCount,
} from '@/data/faqs/helpers';

export function getBownessOnWindermereFAQs(spas: Spa[]): FAQ[] {
  const oldEngland = spas.find((s) => s.id === 6);
  const lakesHotel = spas.find((s) => s.id === 18);

  // Old England values
  const oeThermalCount = oldEngland
    ? getThermalFacilitiesCount(oldEngland)
    : null;
  const oeBrandsText = oldEngland
    ? getTreatmentBrandsText(oldEngland.id)
    : null;
  const oeTimeForMePrice = oldEngland
    ? getDayPassPrice(oldEngland.id, 'old-england-time-for-me-weekday')
    : null;
  const oeMorningRetreatPrice = oldEngland
    ? getDayPassPrice(oldEngland.id, 'old-england-morning-retreat-weekday')
    : null;
  const oeAfternoonEscapePrice = oldEngland
    ? getDayPassPrice(oldEngland.id, 'old-england-afternoon-escape-weekday')
    : null;

  // Lakes Hotel values
  const lhThermalCount = lakesHotel
    ? getThermalFacilitiesCount(lakesHotel)
    : null;
  const lhBrandsText = lakesHotel
    ? getTreatmentBrandsText(lakesHotel.id)
    : null;

  return [
    {
      question:
        'What happened to the Burnside Hotel in Bowness on Windermere?',
      answer: (
        <>
          The Burnside Hotel has been completely transformed and rebranded as
          the{' '}
          <Link
            href={`/spa/${lakesHotel?.url || 'lakes-hotel-spa'}`}
            className="underline"
          >
            {lakesHotel?.name || 'Lakes Hotel & Spa'}
          </Link>
          . The property received significant investment, upgrading it into a
          modern spa hotel on Lake Road in Bowness, just a five minute walk from
          the village centre and lake shore piers.
          <br />
          <br />
          The renovation added a full spa with indoor pool featuring a signature
          &quot;secret button&quot; that makes the entire surface bubble, two
          feature hot tubs with atmospheric mood lighting, and{' '}
          {lhThermalCount || 4} thermal facilities including sauna, steam room,
          cold plunge pool and poolside showers. A poolside bar serves prosecco,
          cocktails and light bites while you relax. The spa stays open until
          10:30pm, making it one of the latest running spa facilities in the
          Lake District.{' '}
          <Link
            href={`/spa/${lakesHotel?.url || 'lakes-hotel-spa'}#treatments`}
            className="underline"
          >
            Treatments
          </Link>{' '}
          use {lhBrandsText || 'Elemis products'},
          including their advanced BIOTEC facial technology.
          <br />
          <br />
          The hotel also added Mizumi, an Asian restaurant, and hot tub rooms
          with private balconies. Spa access is complimentary for all hotel and
          apartment guests. If you have an old booking reference or are looking
          for the Burnside by name, it is the same location at the same address
          on Lake Road.
        </>
      ),
      schemaText: `The Burnside Hotel in Bowness on Windermere has been completely transformed and rebranded as the ${lakesHotel?.name || 'Lakes Hotel & Spa'}. The property received significant investment, adding a full spa with indoor pool, two feature hot tubs with mood lighting, ${lhThermalCount || 4} thermal facilities, and a poolside bar serving prosecco and cocktails. The spa stays open until 10:30pm. Treatments use ${lhBrandsText || 'Elemis products'} including BIOTEC facial technology. The hotel also added Mizumi restaurant and hot tub rooms with private balconies. Spa access is complimentary for all hotel and apartment guests. It is the same location on Lake Road in Bowness.`,
    },
    {
      question: 'What spas are in Bowness on Windermere?',
      answer: (
        <>
          Bowness on Windermere has two spa hotels, each with a very different
          character.{' '}
          <Link
            href={`/spa/${oldEngland?.url || 'macdonald-old-england-hotel-spa'}`}
            className="underline"
          >
            {oldEngland?.name || 'Macdonald Old England Hotel & Spa'}
          </Link>{' '}
          is a historic lakeside property with a 20 metre indoor pool framing
          panoramic Lake Windermere views, {oeThermalCount || 4} thermal
          facilities including Finnish sauna and ice room, and{' '}
          <Link
            href={`/spa/${oldEngland?.url || 'macdonald-old-england-hotel-spa'}#treatments`}
            className="underline"
          >
            treatments
          </Link>{' '}
          using {oeBrandsText || 'Elemis and ishga products'}. It sits directly on the
          lake shore with private gardens running down to the water.
          <br />
          <br />
          <Link
            href={`/spa/${lakesHotel?.url || 'lakes-hotel-spa'}`}
            className="underline"
          >
            {lakesHotel?.name || 'Lakes Hotel & Spa'}
          </Link>{' '}
          takes a more modern, theatrical approach. Atmospheric lighting
          transforms the pool area after dark, two feature hot tubs glow with
          LED mood lighting, and a poolside bar lets you sip prosecco between
          dips. The spa stays open until 10:30pm, compared to 6:30pm at the Old
          England.
          <br />
          <br />
          The biggest practical difference is access. The Old England welcomes
          day visitors with{' '}
          <Link
            href={`/spa/${oldEngland?.url || 'macdonald-old-england-hotel-spa'}#day-passes`}
            className="underline"
          >
            spa day packages
          </Link>{' '}
          from {oeTimeForMePrice || '£70'}, while the Lakes Hotel is exclusive
          to overnight guests. Both are within easy walking distance of
          Bowness&apos;s lakefront piers, restaurants and shops. For more
          options nearby, see{' '}
          <Link
            href="/location/spas-in-windermere"
            className="underline"
          >
            spas in Windermere
          </Link>{' '}
          just a mile up the road.
        </>
      ),
      schemaText: `Bowness on Windermere has two spa hotels. ${oldEngland?.name || 'Macdonald Old England Hotel & Spa'} is a historic lakeside property with a 20 metre indoor pool with Lake Windermere views, ${oeThermalCount || 4} thermal facilities including Finnish sauna and ice room, and treatments using ${oeBrandsText || 'Elemis and ishga products'}. ${lakesHotel?.name || 'Lakes Hotel & Spa'} takes a modern approach with atmospheric lighting, two feature hot tubs, a poolside bar, and extended hours until 10:30pm. The Old England welcomes day visitors with spa day packages from ${oeTimeForMePrice || '£70'}, while the Lakes Hotel is exclusive to overnight guests. Both are within walking distance of Bowness village.`,
    },
    {
      question: 'Can you book a spa day in Bowness on Windermere?',
      answer: (
        <>
          Yes, but only at one of the two Bowness spas.{' '}
          <Link
            href={`/spa/${oldEngland?.url || 'macdonald-old-england-hotel-spa'}#day-passes`}
            className="underline"
          >
            {oldEngland?.name || 'Macdonald Old England Hotel & Spa'}
          </Link>{' '}
          offers spa day packages for day visitors. The most affordable is{' '}
          <Link
            href={`/spa/${oldEngland?.url || 'macdonald-old-england-hotel-spa'}#old-england-time-for-me-weekday`}
            className="underline"
          >
            My Time For Me
          </Link>{' '}
          at {oeTimeForMePrice || '£70'} per person, which includes
          a 25 minute {oeBrandsText || 'Elemis or ishga'} treatment plus four
          hours of pool and thermal suite access. For a fuller experience,{' '}
          <Link
            href={`/spa/${oldEngland?.url || 'macdonald-old-england-hotel-spa'}#old-england-morning-retreat-weekday`}
            className="underline"
          >
            My Morning Retreat
          </Link>{' '}
          ({oeMorningRetreatPrice || '£109'}) adds a two course
          lunch in the Lakeside Restaurant, and{' '}
          <Link
            href={`/spa/${oldEngland?.url || 'macdonald-old-england-hotel-spa'}#old-england-afternoon-escape-weekday`}
            className="underline"
          >
            My Afternoon Escape
          </Link>{' '}
          ({oeAfternoonEscapePrice || '£109'}) includes afternoon tea. All
          packages are available seven days a week and must be pre booked.
          <br />
          <br />
          The{' '}
          <Link
            href={`/spa/${lakesHotel?.url || 'lakes-hotel-spa'}`}
            className="underline"
          >
            {lakesHotel?.name || 'Lakes Hotel & Spa'}
          </Link>{' '}
          does not offer spa days. Access is exclusively for hotel and apartment
          guests, which keeps the facilities quieter and more relaxed. If you
          want to experience the Lakes Hotel spa, you will need to book an
          overnight stay. Spa access is then complimentary from 8am to 10:30pm.
          <br />
          <br />
          For more spa day options in the area, nearby{' '}
          <Link
            href="/location/spas-in-windermere"
            className="underline"
          >
            Windermere
          </Link>{' '}
          and{' '}
          <Link
            href="/location/spas-in-newby-bridge"
            className="underline"
          >
            Newby Bridge
          </Link>{' '}
          both have spas offering day visitor packages.
        </>
      ),
      schemaText: `Yes, but only at one of the two Bowness spas. ${oldEngland?.name || 'Macdonald Old England Hotel & Spa'} offers spa day packages for day visitors. My Time For Me costs ${oeTimeForMePrice || '£70'} per person and includes a 25 minute treatment plus four hours of pool and thermal suite access. My Morning Retreat (${oeMorningRetreatPrice || '£109'}) adds a two course lunch, and My Afternoon Escape (${oeAfternoonEscapePrice || '£109'}) includes afternoon tea. All packages are available seven days a week. ${lakesHotel?.name || 'Lakes Hotel & Spa'} does not offer spa days as access is exclusively for hotel and apartment guests. Nearby Windermere and Newby Bridge also have spas offering day visitor packages.`,
    },
    {
      question:
        'Which Bowness on Windermere spa hotels have hot tubs?',
      answer: (
        <>
          The{' '}
          <Link
            href={`/spa/${lakesHotel?.url || 'lakes-hotel-spa'}#pool`}
            className="underline"
          >
            {lakesHotel?.name || 'Lakes Hotel & Spa'}
          </Link>{' '}
          is the Bowness spa with hot tubs. It has two feature hot tubs with
          atmospheric LED mood lighting, positioned as a centrepiece of the spa
          experience. Combined with the poolside bar, they create a social,
          relaxed atmosphere that works especially well in the evening when the
          lighting really comes into its own. The spa stays open until 10:30pm,
          so you can enjoy the hot tubs after dinner. Access is for hotel and
          apartment guests only.
          <br />
          <br />
          <Link
            href={`/spa/${oldEngland?.url || 'macdonald-old-england-hotel-spa'}#thermal`}
            className="underline"
          >
            {oldEngland?.name || 'Macdonald Old England Hotel & Spa'}
          </Link>{' '}
          does not have hot tubs, but its {oeThermalCount || 4} thermal
          facilities offer a different kind of heat therapy. The Finnish sauna,
          aromatherapy steam room, ice room and experience showers provide a
          full contrast bathing circuit. The 20 metre indoor pool with its
          panoramic Windermere views is the centrepiece here rather than hot
          tubs.
          <br />
          <br />
          If hot tubs are a priority for your trip, the Lakes Hotel delivers on
          that front. For the widest choice of hot tub experiences in the area,{' '}
          <Link
            href="/location/spas-in-windermere"
            className="underline"
          >
            Windermere
          </Link>{' '}
          has additional spa hotels with outdoor hot tubs and lake views just a
          mile away.
        </>
      ),
      schemaText: `${lakesHotel?.name || 'Lakes Hotel & Spa'} is the Bowness spa with hot tubs. It has two feature hot tubs with atmospheric LED mood lighting, combined with a poolside bar for a social, relaxed atmosphere. The spa stays open until 10:30pm so you can enjoy the hot tubs after dinner. Access is for hotel and apartment guests only. ${oldEngland?.name || 'Macdonald Old England Hotel & Spa'} does not have hot tubs but offers ${oeThermalCount || 4} thermal facilities including Finnish sauna, aromatherapy steam room, ice room and experience showers for a full contrast bathing circuit, plus a 20 metre indoor pool with panoramic Windermere views.`,
    },
  ];
}
