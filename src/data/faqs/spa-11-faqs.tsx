import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import { getThermalFacilitiesCount, getAgePolicy } from './helpers';

export function getSpa11FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values
  const thermalCount = getThermalFacilitiesCount(spa);
  const agePolicy = getAgePolicy(spa);

  return [
    // FAQ 1: Spa Access Included
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          Yes, spa access at the Riverside Spa is complimentary for all hotel guests at {spa.name}. Unlike some Lake District spas that charge extra or limit access to certain room categories, every guest can enjoy the full spa facilities at no additional cost throughout their stay.
          <br />
          <br />
          The spa is open from 8am to 8pm daily, and you don&apos;t need to book a time slot. Simply head to the Riverside Spa whenever it suits you during opening hours. The spa features a HydroSpa hydrotherapy pool with fell views, hot tub, herbal pine sauna, aromatherapy steam room, infrared heated loungers, monsoon experience showers, and a heated pebble reflexology walk.
          <br />
          <br />
          Because the spa is exclusively for hotel guests (no day passes are sold), you&apos;ll find a peaceful, uncrowded atmosphere. For full details on spa facilities, see the{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            thermal facilities section
          </Link>
          .
        </>
      ),
      schemaText: `Yes, spa access at the Riverside Spa is complimentary for all hotel guests at ${spa.name}. Unlike some Lake District spas that charge extra or limit access to certain room categories, every guest can enjoy the full spa facilities at no additional cost. The spa is open from 8am to 8pm daily with no booking required. Because the spa is exclusively for hotel guests, you'll find a peaceful, uncrowded atmosphere.`,
    },

    // FAQ 2: Day Pass Availability
    {
      question: `Can I visit the Riverside Spa at ${spa.name} without staying at the hotel?`,
      answer: (
        <>
          No, the Riverside Spa at {spa.name} is exclusively for hotel guests. Day passes and spa day experiences are not available to non guests. This policy helps maintain the peaceful, intimate atmosphere that makes the spa special.
          <br />
          <br />
          If you&apos;d like to experience the Riverside Spa, you&apos;ll need to book a room at {spa.name}. Even a single night stay gives you full access to the spa facilities from 8am to 8pm, with no additional charge and no need to book time slots. The hotel is located in the heart of Grasmere village, making it easy to combine a spa visit with exploring the beautiful surroundings.
          <br />
          <br />
          For Lake District spas that do offer day passes, see our{' '}
          <Link href="/" className="text-stone-900 underline">
            spa directory
          </Link>{' '}
          where you can filter by day pass availability.
        </>
      ),
      schemaText: `No, the Riverside Spa at ${spa.name} is exclusively for hotel guests. Day passes and spa day experiences are not available to non guests. This policy helps maintain the peaceful, intimate atmosphere. If you'd like to experience the Riverside Spa, you'll need to book a room at the hotel. Even a single night stay gives you full access to the spa facilities from 8am to 8pm, with no additional charge.`,
    },

    // FAQ 3: Booking Requirements
    {
      question: `Do I need to book the spa in advance at ${spa.name}?`,
      answer: (
        <>
          No, you don&apos;t need to book the spa facilities in advance at {spa.name}. Unlike many Lake District spas that operate time slot systems, the Riverside Spa allows hotel guests to simply turn up and use the facilities whenever they like during opening hours (8am to 8pm daily).
          <br />
          <br />
          Because the spa is only available to hotel guests and day passes aren&apos;t sold, the facilities are never overcrowded. Guest reviews frequently mention having the spa to themselves or enjoying a peaceful, uncrowded experience. This makes {spa.name} particularly appealing for guests who prefer flexibility and don&apos;t want to plan their relaxation around fixed time slots.
          <br />
          <br />
          Note that if you&apos;d like spa treatments, these are delivered in room and do need to be booked in advance by contacting the hotel directly. For access policy details, see the{' '}
          <Link href="#access" className="text-stone-900 underline">
            spa access information
          </Link>
          .
        </>
      ),
      schemaText: `No, you don't need to book the spa facilities in advance at ${spa.name}. Unlike many Lake District spas that operate time slot systems, the Riverside Spa allows hotel guests to simply turn up and use the facilities whenever they like during opening hours (8am to 8pm daily). Because the spa is only available to hotel guests and day passes aren't sold, the facilities are never overcrowded. Note that spa treatments are delivered in room and do need to be booked in advance.`,
    },

    // FAQ 4: Age Restrictions
    {
      question: `Can children use the spa at ${spa.name}?`,
      answer: (
        <>
          No, the Riverside Spa at {spa.name} is for adults only, with an age restriction of {agePolicy || '18 and over'}. This policy is in place both for safety reasons (thermal experiences can be unsuitable for younger guests) and to maintain the tranquil, relaxing atmosphere that the spa is known for.
          <br />
          <br />
          Guest reviews frequently praise the peaceful, adults only environment, with many couples specifically choosing {spa.name} for child free breaks. The spa&apos;s intimate size and hotel guests only policy means you can expect a consistently calm atmosphere throughout your visit.
          <br />
          <br />
          If you&apos;re travelling with children, they are welcome to stay at the hotel and enjoy Grasmere village and the surrounding Lake District, but won&apos;t be able to access the spa facilities. For couples seeking a romantic spa break, see our{' '}
          <Link href="/couples-spa-lake-district" className="text-stone-900 underline">
            couples spa guide
          </Link>
          .
        </>
      ),
      schemaText: `No, the Riverside Spa at ${spa.name} is for adults only, with an age restriction of ${agePolicy || '18 and over'}. This policy is in place both for safety reasons and to maintain the tranquil, relaxing atmosphere. Guest reviews frequently praise the peaceful, adults only environment. If you're travelling with children, they are welcome to stay at the hotel but won't be able to access the spa facilities.`,
    },

    // FAQ 5: Spa Facilities
    {
      question: `What facilities are in the Riverside Spa at ${spa.name}?`,
      answer: (
        <>
          The Riverside Spa at {spa.name} offers {thermalCount || 'several'} thermal and wellness facilities with beautiful views over the River Rothay and surrounding Lake District fells through floor to ceiling windows.
          <br />
          <br />
          The centrepiece is the HydroSpa hydrotherapy pool featuring sunken loungers for passive relaxation. You&apos;ll also find a hot tub, herbal pine sauna, and aromatherapy steam room for traditional heat experiences. What makes the Riverside Spa distinctive are its infrared heated loungers (excellent for deep muscle relaxation after Lake District walks), monsoon experience showers, and a heated pebble reflexology walk.
          <br />
          <br />
          The spa&apos;s intimate size and hotel guests only policy means facilities rarely feel crowded. Many guests find it the perfect way to unwind after a day exploring Grasmere and the surrounding fells. For the complete facility list, see the{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            thermal facilities
          </Link>{' '}
          and{' '}
          <Link href="#pool" className="text-stone-900 underline">
            pool features
          </Link>{' '}
          sections above.
        </>
      ),
      schemaText: `The Riverside Spa at ${spa.name} offers thermal and wellness facilities with beautiful views over the River Rothay and Lake District fells. The centrepiece is the HydroSpa hydrotherapy pool with sunken loungers. You'll also find a hot tub, herbal pine sauna, aromatherapy steam room, infrared heated loungers, monsoon experience showers, and a heated pebble reflexology walk. The spa's intimate size and hotel guests only policy means facilities rarely feel crowded.`,
    },
  ];
}

