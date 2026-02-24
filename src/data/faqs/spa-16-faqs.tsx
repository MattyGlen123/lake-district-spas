import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getThermalFacilitiesCount,
  getAgePolicy,
  getDayPassPrice,
} from './helpers';

export function getSpa16FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values
  const thermalCount = getThermalFacilitiesCount(spa);
  const agePolicy = getAgePolicy(spa);
  
  // Day pass prices
  const thermal60Price = getDayPassPrice(spa.id, 'netherwood-thermal-60min');
  const thermal90Price = getDayPassPrice(spa.id, 'netherwood-thermal-90min');
  const thermal150Price = getDayPassPrice(spa.id, 'netherwood-thermal-150min');
  const halfDayPrice = getDayPassPrice(spa.id, 'netherwood-half-day-spa');
  const relaxationPrice = getDayPassPrice(spa.id, 'netherwood-spa-relaxation');
  const couplesPrice = getDayPassPrice(spa.id, 'netherwood-couples-unwind');

  return [
    // FAQ 1: Swimming Pool Question
    {
      question: `Does ${spa.name} have a swimming pool?`,
      answer: (
        <>
          No, {spa.name} does not have a traditional swimming pool. Instead, the spa features a unique plunge tub room with hot, warm, and cold hydrotherapy circuits designed for therapeutic muscle relaxation and improved circulation. This approach to wellness is quite different from most Lake District spas and focuses on the health benefits of contrast water therapy.
          <br />
          <br />
          The plunge tub room allows you to move between temperatures in a therapeutic sequence, similar to traditional Scandinavian bathing rituals. Combined with the{' '}
          <Link href="#thermal" className="underline">
            {thermalCount || 5} thermal facilities
          </Link>
          {' '}including a salt inhalation room and aromatherapy steam room, the spa offers a comprehensive wellness experience without a conventional pool. Many guests find this hydrotherapy focused approach more beneficial for muscle recovery and relaxation than simple swimming.
          <br />
          <br />
          If you&apos;re specifically looking for a Lake District spa with a swimming pool, you may want to explore{' '}
          <Link href="/spas" className="underline">
            other options
          </Link>
          . However, if you&apos;re interested in therapeutic water experiences and unique wellness facilities, {spa.name}&apos;s plunge tub circuits offer something you won&apos;t find elsewhere in the region.
        </>
      ),
      schemaText:
        `No, ${spa.name} does not have a traditional swimming pool. Instead, the spa features a unique plunge tub room with hot, warm, and cold hydrotherapy circuits designed for therapeutic muscle relaxation and improved circulation. The plunge tub room allows you to move between temperatures in a therapeutic sequence. Combined with ${thermalCount || 5} thermal facilities including a salt inhalation room and aromatherapy steam room, the spa offers a comprehensive wellness experience focused on hydrotherapy benefits.`,
    },

    // FAQ 2: Spa Day Cost
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa day prices at {spa.name} start from {thermal60Price || '£20'} for a{' '}
          <Link href="#netherwood-thermal-60min" className="underline">
            60 minute Thermal Journey
          </Link>
          , making it one of the more affordable spa day options in the Lake District. Longer sessions are available at {thermal90Price || '£25'} for{' '}
          <Link href="#netherwood-thermal-90min" className="underline">
            90 minutes
          </Link>
          {' '}or {thermal150Price || '£40'} for{' '}
          <Link href="#netherwood-thermal-150min" className="underline">
            2.5 hours
          </Link>
          {' '}of thermal facilities access.
          <br />
          <br />
          For a more complete spa day experience, the{' '}
          <Link href="#netherwood-half-day-spa" className="underline">
            Half Day Spa Package
          </Link>
          {' '}({halfDayPrice || '£55'}) includes 90 minutes of thermal journey access plus soup and sandwich lunch. The{' '}
          <Link href="#netherwood-spa-relaxation" className="underline">
            Spa Relaxation Package
          </Link>
          {' '}({relaxationPrice || '£75'}) adds a 25 minute treatment and glass of prosecco. Couples can enjoy the{' '}
          <Link href="#netherwood-couples-unwind" className="underline">
            Couples Unwind Package
          </Link>
          {' '}({couplesPrice || '£160'} for two) with treatments, prosecco, and cream tea.
          <br />
          <br />
          All spa day packages include robes, towels, and slippers. View all{' '}
          <Link href="#day-passes" className="underline">
            spa day packages and prices
          </Link>
          {' '}to find the right option for your visit.
        </>
      ),
      schemaText:
        `Spa day prices at ${spa.name} start from ${thermal60Price || '£20'} for a 60 minute Thermal Journey. Longer sessions cost ${thermal90Price || '£25'} for 90 minutes or ${thermal150Price || '£40'} for 2.5 hours. The Half Day Spa Package (${halfDayPrice || '£55'}) includes 90 minutes plus lunch. The Spa Relaxation Package (${relaxationPrice || '£75'}) adds a 25 minute treatment and prosecco. Couples can book the Couples Unwind Package (${couplesPrice || '£160'} for two) with treatments, prosecco, and cream tea. All packages include robes, towels, and slippers.`,
    },

    // FAQ 3: Spa Access for Hotel Guests
    {
      question: `Is spa access included for hotel guests at ${spa.name}?`,
      answer: (
        <>
          No, spa access is not automatically included with hotel room bookings at {spa.name}. All guests, including those staying overnight, must pay separately for Thermal Journey access. This applies to the plunge tub room with hot, warm, and cold circuits as well as all other thermal facilities including the sauna, steam room, and salt inhalation room.
          <br />
          <br />
          Hotel guests can book Thermal Journey sessions from {thermal60Price || '£20'} for{' '}
          <Link href="#netherwood-thermal-60min" className="underline">
            60 minutes
          </Link>
          {' '}up to {thermal150Price || '£40'} for{' '}
          <Link href="#netherwood-thermal-150min" className="underline">
            2.5 hours
          </Link>
          . The Thermal Journey operates daily from 10am to 5:30pm, with{' '}
          <Link href="#treatments" className="underline">
            treatment bookings
          </Link>
          {' '}available until 6pm. All sessions include robes, towels, and slippers, so you don&apos;t need to bring your own.
          <br />
          <br />
          We recommend booking your spa time when you reserve your room, as slots can fill up especially at weekends. For full details on access policies and pricing, see the{' '}
          <Link href="#access" className="underline">
            Spa Access Information
          </Link>
          {' '}section.
        </>
      ),
      schemaText:
        `No, spa access is not automatically included with hotel room bookings at ${spa.name}. All guests must pay separately for Thermal Journey access, from ${thermal60Price || '£20'} for 60 minutes up to ${thermal150Price || '£40'} for 2.5 hours. The Thermal Journey operates daily from 10am to 5:30pm. All sessions include robes, towels, and slippers. Book your spa time when you reserve your room as slots can fill up at weekends.`,
    },

    // FAQ 4: Unique Thermal Facilities
    {
      question: `What makes ${spa.name}'s thermal facilities unique?`,
      answer: (
        <>
          {spa.name}&apos;s signature feature is its plunge tub room offering hot, warm, and cold hydrotherapy circuits. This therapeutic approach allows you to move between different water temperatures, promoting muscle relaxation, improved circulation, and overall wellness. The contrast therapy technique is inspired by traditional Scandinavian bathing rituals and provides benefits you won&apos;t find at most Lake District spas.
          <br />
          <br />
          Beyond the plunge tubs, the spa includes a calming salt inhalation room designed to support respiratory health, a traditional dry heat sauna, and an aromatherapy steam room infused with lemongrass, citrus, and cinnamon scents. An ice fountain and thermal shower with massaging jets complete the {thermalCount || 5} facility thermal journey.
          <br />
          <br />
          The combination of hydrotherapy circuits and salt therapy makes {spa.name} particularly suited for guests seeking therapeutic wellness benefits rather than simply a relaxing swim. Explore all{' '}
          <Link href="#thermal" className="underline">
            thermal facilities
          </Link>
          {' '}to plan your visit.
        </>
      ),
      schemaText:
        `${spa.name}'s signature feature is its plunge tub room offering hot, warm, and cold hydrotherapy circuits for therapeutic muscle relaxation and improved circulation. The contrast therapy technique is inspired by traditional Scandinavian bathing rituals. Beyond the plunge tubs, the spa includes a salt inhalation room for respiratory health, dry heat sauna, aromatherapy steam room with lemongrass and citrus, ice fountain, and thermal shower. This combination of hydrotherapy and salt therapy makes ${spa.name} particularly suited for therapeutic wellness benefits.`,
    },

    // FAQ 5: Booking in Advance
    {
      question: `Do I need to book the ${spa.name} spa in advance?`,
      answer: (
        <>
          Yes, booking in advance is required for all Thermal Journey sessions and treatments at {spa.name}. The spa operates with timed entry slots to ensure a peaceful, uncrowded experience for all guests. Walk in visits are not available, so planning ahead is essential.
          <br />
          <br />
          The Thermal Journey is available daily from 10am to 5:30pm, with treatments bookable until 6pm. The spa is exclusively for guests aged {agePolicy || '18+'}, maintaining a tranquil adults only atmosphere throughout. Weekend slots and treatment appointments tend to book up quickly, so reserving at least a few days ahead is recommended, especially during peak seasons.
          <br />
          <br />
          You can book spa sessions directly through the{' '}
          <Link href="#book" className="underline">
            booking section
          </Link>
          {' '}on this page or contact the spa by phone. If you&apos;re staying overnight, consider booking your spa time when you make your room reservation to secure your preferred slot.
        </>
      ),
      schemaText:
        `Yes, booking in advance is required for all Thermal Journey sessions and treatments at ${spa.name}. The spa operates with timed entry slots and walk in visits are not available. The Thermal Journey is available daily from 10am to 5:30pm, with treatments bookable until 6pm. The spa is exclusively for guests aged ${agePolicy || '18+'}. Weekend slots book up quickly, so reserving a few days ahead is recommended. If staying overnight, book your spa time when making your room reservation.`,
    },
  ];
}

