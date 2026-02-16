import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
} from '@/data/faqs/helpers';

export function getGrangeOverSandsFAQs(spas: Spa[]): FAQ[] {
  const netherwood = spas.find((s) => s.id === 16);
  const grangeHotel = spas.find((s) => s.id === 17);

  // Netherwood values
  const nwThermalCount = netherwood
    ? getThermalFacilitiesCount(netherwood)
    : null;
  const nwBrandsText = netherwood
    ? getTreatmentBrandsText(netherwood.id)
    : null;
  const nwThermal60Price = netherwood
    ? getDayPassPrice(netherwood.id, 'netherwood-thermal-60min')
    : null;
  const nwThermal90Price = netherwood
    ? getDayPassPrice(netherwood.id, 'netherwood-thermal-90min')
    : null;
  const nwHalfDayPrice = netherwood
    ? getDayPassPrice(netherwood.id, 'netherwood-half-day-spa')
    : null;
  const nwCouplesPrice = netherwood
    ? getDayPassPrice(netherwood.id, 'netherwood-couples-unwind')
    : null;

  // Grange Hotel values
  const ghBrandsText = grangeHotel
    ? getTreatmentBrandsText(grangeHotel.id)
    : null;
  const ghLazyDaysPrice = grangeHotel
    ? getDayPassPrice(grangeHotel.id, 'grange-lazy-days-for-locals')
    : null;
  const ghSpaPackagePrice = grangeHotel
    ? getDayPassPrice(grangeHotel.id, 'grange-spa-day-package')
    : null;

  return [
    // FAQ 1: What spas are there — targets "grange over sands spa" (500/mo)
    {
      question: 'What spas are there in Grange-over-Sands?',
      answer: (
        <>
          Grange-over-Sands has two spa hotels, both set in Victorian buildings
          with views across Morecambe Bay.{' '}
          <Link
            href={`/spa/${netherwood?.url || 'netherwood-hotel-spa'}`}
            className="underline"
          >
            {netherwood?.name || 'Netherwood Hotel & Spa'}
          </Link>{' '}
          is an adults only spa housed in a Grade II listed mansion, offering a
          thermal journey with {nwThermalCount || 5} facilities including a
          unique plunge tub room with hot, warm and cold hydrotherapy circuits, a
          salt inhalation room and aromatherapy steam room.{' '}
          <Link
            href={`/spa/${netherwood?.url || 'netherwood-hotel-spa'}#treatments`}
            className="underline"
          >
            Treatments
          </Link>{' '}
          use {nwBrandsText || 'ELEMIS products'}.
          <br />
          <br />
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}`}
            className="underline"
          >
            {grangeHotel?.name || 'Grange Hotel'}
          </Link>{' '}
          takes a more traditional approach with a heated indoor pool, jacuzzi
          hot tub, sauna and steam room in an intimate Edwardian setting.{' '}
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}#treatments`}
            className="underline"
          >
            Treatments
          </Link>{' '}
          use {ghBrandsText || 'Tropic Skincare products'}, and the hotel&apos;s
          Carriages Restaurant serves five course dining with local ingredients
          including Morecambe Bay shrimps.
          <br />
          <br />
          Both spas welcome day visitors as well as hotel guests. Netherwood
          thermal sessions start from {nwThermal60Price || '£20'} per person,
          while the Grange Hotel&apos;s{' '}
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}#grange-lazy-days-for-locals`}
            className="underline"
          >
            Lazy Days for Locals
          </Link>{' '}
          offers full day access from {ghLazyDaysPrice || '£25'}. For more
          options nearby, see{' '}
          <Link href="/location/spas-in-newby-bridge" className="underline">
            spas in Newby Bridge
          </Link>{' '}
          just 8 miles north.
        </>
      ),
      schemaText: `Grange-over-Sands has two spa hotels with Morecambe Bay views. ${netherwood?.name || 'Netherwood Hotel & Spa'} is an adults only spa in a Grade II listed mansion with ${nwThermalCount || 5} thermal facilities including plunge tubs with hot, warm and cold hydrotherapy circuits, a salt inhalation room and aromatherapy steam room. Treatments use ${nwBrandsText || 'ELEMIS products'}. ${grangeHotel?.name || 'Grange Hotel'} offers a heated indoor pool, jacuzzi, sauna and steam room in an Edwardian setting with ${ghBrandsText || 'Tropic Skincare'} treatments. Both welcome day visitors, with thermal sessions from ${nwThermal60Price || '£20'} and full day access from ${ghLazyDaysPrice || '£25'}.`,
    },

    // FAQ 2: Which spa hotel — targets "grange over sands spa hotel" (50/mo)
    {
      question: 'Which Grange-over-Sands spa hotel should I choose?',
      answer: (
        <>
          It depends on what you are looking for.{' '}
          <Link
            href={`/spa/${netherwood?.url || 'netherwood-hotel-spa'}`}
            className="underline"
          >
            {netherwood?.name || 'Netherwood Hotel & Spa'}
          </Link>{' '}
          suits guests who want a dedicated wellness experience. The adults only
          thermal journey includes plunge tub hydrotherapy circuits, a salt
          inhalation room and ice fountain, set within 15 acres of woodland
          gardens. There is no swimming pool, so the focus is entirely on
          therapeutic heat and water therapies. Day passes start from{' '}
          {nwThermal60Price || '£20'} for 60 minutes, or{' '}
          {nwHalfDayPrice || '£55'} for a{' '}
          <Link
            href={`/spa/${netherwood?.url || 'netherwood-hotel-spa'}#netherwood-half-day-spa`}
            className="underline"
          >
            half day package
          </Link>{' '}
          with lunch.
          <br />
          <br />
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}`}
            className="underline"
          >
            {grangeHotel?.name || 'Grange Hotel'}
          </Link>{' '}
          is better for guests who want a pool and a more classic hotel spa
          experience. The leisure suite has a heated indoor pool, jacuzzi, sauna
          and steam room, and the{' '}
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}#grange-spa-day-package`}
            className="underline"
          >
            Spa Day Package
          </Link>{' '}
          ({ghSpaPackagePrice || '£59'}) includes a treatment plus a £15 food
          allocation for lunch or afternoon tea. It also sits directly opposite
          the railway station, making it the easier option for car free visits.
          <br />
          <br />
          For couples, the Netherwood&apos;s{' '}
          <Link
            href={`/spa/${netherwood?.url || 'netherwood-hotel-spa'}#netherwood-couples-unwind`}
            className="underline"
          >
            Couples Unwind Package
          </Link>{' '}
          ({nwCouplesPrice || '£160'} for two) includes treatments, prosecco
          and cream tea alongside thermal access.
        </>
      ),
      schemaText: `It depends on what you are looking for. ${netherwood?.name || 'Netherwood Hotel & Spa'} suits guests wanting a dedicated wellness experience with adults only thermal facilities including plunge tub hydrotherapy, salt inhalation room and ice fountain. Day passes start from ${nwThermal60Price || '£20'}. ${grangeHotel?.name || 'Grange Hotel'} is better for guests wanting a pool and classic hotel spa with heated indoor pool, jacuzzi, sauna and steam room. The Spa Day Package costs ${ghSpaPackagePrice || '£59'} with a treatment and food allocation. The Grange Hotel sits opposite the railway station for easy car free access. For couples, the Netherwood offers a Couples Unwind Package at ${nwCouplesPrice || '£160'} for two.`,
    },

    // FAQ 3: Clare House — targets "clare house grange over sands" (500/mo, Low)
    {
      question:
        'Does Clare House in Grange-over-Sands have a spa?',
      answer: (
        <>
          No, Clare House does not have spa facilities. It is a small country
          house hotel on Park Road in Grange-over-Sands, known for its gardens
          and traditional hospitality, but it does not offer a pool, thermal
          suite or treatment rooms.
          <br />
          <br />
          If you are looking for a spa in Grange-over-Sands, the two options
          are{' '}
          <Link
            href={`/spa/${netherwood?.url || 'netherwood-hotel-spa'}`}
            className="underline"
          >
            {netherwood?.name || 'Netherwood Hotel & Spa'}
          </Link>{' '}
          and{' '}
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}`}
            className="underline"
          >
            {grangeHotel?.name || 'Grange Hotel'}
          </Link>
          . Both are within the town and welcome day visitors. Netherwood offers
          an adults only thermal journey with plunge tub hydrotherapy, salt room
          and steam room, with sessions starting from{' '}
          {nwThermal60Price || '£20'} for 60 minutes. The Grange Hotel has a
          heated indoor pool, jacuzzi, sauna and steam room, with its{' '}
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}#grange-lazy-days-for-locals`}
            className="underline"
          >
            Lazy Days for Locals
          </Link>{' '}
          package offering full day access from {ghLazyDaysPrice || '£25'}.
          <br />
          <br />
          You could stay at Clare House and visit either spa during your trip,
          as both are a short walk or drive away within the town. For a wider
          selection, see{' '}
          <Link href="/location/spas-in-backbarrow" className="underline">
            spas in Backbarrow
          </Link>{' '}
          and{' '}
          <Link href="/location/spas-in-newby-bridge" className="underline">
            Newby Bridge
          </Link>
          , both around 6 to 8 miles north.
        </>
      ),
      schemaText: `No, Clare House does not have spa facilities. It is a small country house hotel known for its gardens and traditional hospitality but does not offer a pool, thermal suite or treatment rooms. The two spas in Grange-over-Sands are ${netherwood?.name || 'Netherwood Hotel & Spa'} and ${grangeHotel?.name || 'Grange Hotel'}. Netherwood offers an adults only thermal journey with plunge tub hydrotherapy from ${nwThermal60Price || '£20'} for 60 minutes. The Grange Hotel has a heated indoor pool, jacuzzi, sauna and steam room with full day access from ${ghLazyDaysPrice || '£25'}. You could stay at Clare House and visit either spa during your trip.`,
    },

    // FAQ 4: Things to do — targets "grange over sands things to do" (500/mo, Medium)
    {
      question:
        'What is there to do in Grange-over-Sands alongside a spa visit?',
      answer: (
        <>
          Grange-over-Sands has plenty to fill a day or weekend around a spa
          visit. The Edwardian promenade curves along Morecambe Bay with views
          across the sands to the Lakeland fells, and the ornamental gardens
          along the seafront are planted with palms and semi tropical shrubs
          thanks to the town&apos;s mild coastal climate. The climb to
          Hampsfell Hospice, a stone shelter built in 1846, rewards with
          panoramas stretching from the Old Man of Coniston to Blackpool Tower
          on clear days.
          <br />
          <br />
          The medieval village of Cartmel is just two miles inland and well
          worth the detour. Its 12th century priory is one of the finest in
          northern England, and the village has a cluster of independent shops,
          pubs and the famous Cartmel racecourse. Morecambe Bay itself is a
          haven for birdwatching, with curlews, oystercatchers and pink footed
          geese feeding on the tidal flats.
          <br />
          <br />
          For a full spa day combined with local exploring, the{' '}
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}#grange-lazy-days-for-locals`}
            className="underline"
          >
            Lazy Days for Locals
          </Link>{' '}
          package at{' '}
          <Link
            href={`/spa/${grangeHotel?.url || 'grange-hotel'}`}
            className="underline"
          >
            {grangeHotel?.name || 'Grange Hotel'}
          </Link>{' '}
          ({ghLazyDaysPrice || '£25'}) gives you all day pool access with a
          food allocation, leaving time to explore the promenade or Cartmel
          before or after. Alternatively, a{' '}
          <Link
            href={`/spa/${netherwood?.url || 'netherwood-hotel-spa'}#netherwood-thermal-90min`}
            className="underline"
          >
            90 minute thermal session
          </Link>{' '}
          at{' '}
          <Link
            href={`/spa/${netherwood?.url || 'netherwood-hotel-spa'}`}
            className="underline"
          >
            {netherwood?.name || 'Netherwood Hotel & Spa'}
          </Link>{' '}
          ({nwThermal90Price || '£25'}) fits neatly into a morning or afternoon.
        </>
      ),
      schemaText: `Grange-over-Sands has plenty to complement a spa visit. The Edwardian promenade curves along Morecambe Bay with views to the Lakeland fells, and ornamental gardens feature palms and semi tropical shrubs. The climb to Hampsfell Hospice offers panoramas from the Old Man of Coniston to Blackpool Tower. Cartmel village is two miles inland with a 12th century priory, independent shops and the famous racecourse. Morecambe Bay is excellent for birdwatching. The Grange Hotel Lazy Days for Locals package (${ghLazyDaysPrice || '£25'}) gives all day pool access, or a 90 minute thermal session at ${netherwood?.name || 'Netherwood Hotel & Spa'} (${nwThermal90Price || '£25'}) fits into a morning or afternoon.`,
    },
  ];
}
