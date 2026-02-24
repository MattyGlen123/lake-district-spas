import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
} from './helpers';

export function getSpa18FAQs(spa: Spa): FAQ[] {
  const thermalCount = getThermalFacilitiesCount(spa);
  const brandsText = getTreatmentBrandsText(spa.id);

  return [
    // FAQ 1: Spa access included
    {
      question: `Is spa access included at ${spa.name}?`,
      answer: (
        <>
          Yes, spa access is completely complimentary for all hotel and apartment guests at {spa.name}. There are no extra charges, no time slot bookings, and no restrictions on usage. You can use the spa facilities from 8am right through to 10:30pm (with last pool entry at 9:30pm), coming and going as you please throughout the day.
          <br />
          <br />
          This is a genuine standout compared to many Lake District spa hotels, where spa access often costs extra or comes with limited time slots. At {spa.name}, your stay includes full use of the main pool, two feature hot tubs, sauna, steam room, cold plunge pool, and poolside showers for the entire duration of your visit. The poolside bar is also accessible directly from the spa area, so you can enjoy a drink between dips without needing to change.
          <br />
          <br />
          Spa treatments are available at an additional cost and require advance booking. For full details on access policies, see the{' '}
          <Link href="#access" className="underline">
            spa access information
          </Link>{' '}
          section. You can also browse available{' '}
          <Link href="#treatments" className="underline">
            treatments and prices
          </Link>
          .
        </>
      ),
      schemaText: `Yes, spa access is completely complimentary for all hotel and apartment guests at ${spa.name}. There are no extra charges, no time slot bookings, and no restrictions on usage. You can use the spa from 8am to 10:30pm, including the main pool, two feature hot tubs, sauna, steam room, cold plunge pool, and poolside showers. This is a genuine standout compared to many Lake District spa hotels where access often costs extra. Spa treatments are available at an additional cost and require advance booking.`,
    },

    // FAQ 2: Children policy
    {
      question: `Can children use the spa at ${spa.name}?`,
      answer: (
        <>
          Yes, children aged 16 and under are welcome to use the spa at {spa.name} between 8am and 2pm, provided they are supervised by an adult aged 18 or over. A maximum of 6 children are allowed in the pool at any one time. After 2pm, the spa becomes an adults only environment for the rest of the evening until closing at 10:30pm.
          <br />
          <br />
          This split system works well for both families and couples. If you&apos;re visiting as a couple and prefer a quieter atmosphere, plan your spa time for the afternoon or evening when the space is reserved for adults. With the spa open until 10:30pm, there&apos;s plenty of time to enjoy the hot tubs, sauna, steam room, and poolside bar in a relaxed setting after the family swimming hours end.
          <br />
          <br />
          For families, the morning sessions offer a great opportunity to enjoy the pool and hot tubs together before heading out to explore Bowness village, which is just a five minute walk from the hotel. For full details, see the{' '}
          <Link href="#access" className="underline">
            access information
          </Link>{' '}
          section, or explore other{' '}
          <Link href="/spas" className="underline">
            Lake District spas
          </Link>{' '}
          with different age policies.
        </>
      ),
      schemaText: `Yes, children aged 16 and under are welcome between 8am and 2pm, supervised by an adult aged 18 or over. A maximum of 6 children are allowed in the pool at any one time. After 2pm, the spa becomes adults only until closing at 10:30pm. This split system works well for both families and couples. If you prefer a quieter atmosphere, plan your spa time for the afternoon or evening.`,
    },

    // FAQ 3: Spa day without staying
    {
      question: `Can I visit ${spa.name} for a spa day without staying?`,
      answer: (
        <>
          No, the spa at {spa.name} is exclusively for hotel and apartment guests. Day passes and spa day packages are not currently available. This means the spa tends to stay quieter and more relaxed than venues that sell day passes alongside hotel bookings, which is something regular guests particularly appreciate.
          <br />
          <br />
          If you do book a stay, spa access is complimentary with no extra charge and no time restrictions. You can use the pool, two hot tubs, sauna, steam room, cold plunge pool, and poolside bar from 8am until 10:30pm throughout your visit. Spa treatments using Elemis products are available at an additional cost and should be booked in advance.
          <br />
          <br />
          If you&apos;re looking for a spa day experience in the Lake District without an overnight stay, several other spas in the area do offer day visitor packages. You can compare options on our{' '}
          <Link href="/spas" className="underline">
            homepage
          </Link>
          . For booking a stay at {spa.name}, see the{' '}
          <Link href="#book" className="underline">
            booking section
          </Link>
          .
        </>
      ),
      schemaText: `No, the spa at ${spa.name} is exclusively for hotel and apartment guests. Day passes and spa day packages are not currently available. This means the spa tends to stay quieter and more relaxed. If you book a stay, spa access is complimentary with no extra charge and no time restrictions from 8am to 10:30pm. If you're looking for a spa day without an overnight stay, several other Lake District spas offer day visitor packages.`,
    },

    // FAQ 4: Spa facilities
    {
      question: `What facilities are in the spa at ${spa.name}?`,
      answer: (
        <>
          The spa at {spa.name} features a main swimming pool with water features and a signature &quot;secret button&quot; that makes the entire pool bubble, two feature hot tubs with atmospheric mood lighting, a traditional sauna, steam room, cold plunge pool, and poolside showers. In total there are {thermalCount || 4} thermal facilities alongside the main pool.
          <br />
          <br />
          One of the most distinctive features is the poolside bar, where you can order prosecco, cocktails, and light bites without leaving the spa area. The atmospheric blue LED mood lighting throughout the pool and hot tub area creates a particularly striking ambiance during evening visits, and with the spa open until 10:30pm there&apos;s plenty of time to enjoy it after dark.
          <br />
          <br />
          Treatment rooms offer {brandsText || 'Elemis'} therapies including BIOTEC facial technology treatments that use microcurrent, ultrasonic, LED, and oxygen infusion technology for advanced skincare results. For full details on thermal facilities, see the{' '}
          <Link href="#thermal" className="underline">
            thermal facilities
          </Link>{' '}
          section. Browse all available{' '}
          <Link href="#treatments" className="underline">
            treatments and prices
          </Link>
          .
        </>
      ),
      schemaText: `The spa at ${spa.name} features a main swimming pool with a signature secret button that makes the entire pool bubble, two feature hot tubs with atmospheric mood lighting, a traditional sauna, steam room, cold plunge pool, and poolside showers. The poolside bar lets you order prosecco, cocktails, and light bites without leaving the spa area. Treatment rooms offer ${brandsText || 'Elemis'} therapies including BIOTEC facial technology using microcurrent, ultrasonic, LED, and oxygen infusion technology.`,
    },

    // FAQ 5: Burnside Hotel connection
    {
      question: `Is ${spa.name} the same as the Burnside Hotel?`,
      answer: (
        <>
          Yes, {spa.name} is the former Burnside Hotel, reimagined and upgraded into a five star property. The hotel is located at the same address on Lake Road in Bowness on Windermere, just a five minute walk from the village centre. If you&apos;ve stayed at the Burnside before, you&apos;ll recognise the location but find a significantly enhanced experience throughout.
          <br />
          <br />
          The rebrand reflects substantial investment in the property, including the addition of a full spa with {thermalCount || 4} thermal facilities, a main pool with water features, two hot tubs, and a poolside bar. The hotel also features hot tub rooms with private balconies overlooking Lake Windermere, the Mizumi Asian restaurant, a cocktail bar, and Elemis spa treatments with advanced BIOTEC facial technology.
          <br />
          <br />
          Spa access is complimentary for all hotel and apartment guests with no time restrictions, and the spa is open from 8am to 10:30pm daily. For an overview of everything available, see the{' '}
          <Link href="#thermal" className="underline">
            thermal facilities
          </Link>{' '}
          and{' '}
          <Link href="#access" className="underline">
            access information
          </Link>{' '}
          sections.
        </>
      ),
      schemaText: `Yes, ${spa.name} is the former Burnside Hotel, reimagined and upgraded into a five star property at the same address on Lake Road in Bowness on Windermere. The rebrand reflects substantial investment including a full spa with thermal facilities, main pool, two hot tubs, poolside bar, hot tub rooms with private balconies, the Mizumi Asian restaurant, and Elemis spa treatments. Spa access is complimentary for all guests with no time restrictions from 8am to 10:30pm daily.`,
    },
  ];
}

