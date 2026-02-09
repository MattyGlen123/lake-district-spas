import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import { getAgePolicy, getDayPassPrice } from './helpers';

export function getSpa10FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values
  const agePolicy = getAgePolicy(spa);
  const spaAccessPrice = getDayPassPrice(spa.id, 'beech-hill-spa-access-sunday-thursday');
  const relaxPrice = getDayPassPrice(spa.id, 'beech-hill-relax-spa-day');
  const rejuvenatePrice = getDayPassPrice(spa.id, 'beech-hill-rejuvenate-spa-day');

  return [
    // FAQ 1: Spa Day Pricing
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          {spa.name} offers spa day packages from {spaAccessPrice || '£45'} to {rejuvenatePrice || '£140'} per person. The most affordable option is Spa Access ({spaAccessPrice || '£45'}) which gives you 3 hours to enjoy the outdoor hot tub with Lake Windermere views, indoor pool, Himalayan sauna, and aromatic steam room.
          <br />
          <br />
          For a more indulgent experience, the Relax Spa Day ({relaxPrice || '£115'}) includes a 25 minute CAUDALIE treatment plus afternoon tea. The Rejuvenate Spa Day ({rejuvenatePrice || '£140'}) upgrades this to a 50 minute luxury treatment with afternoon tea and a glass of fizz. All packages include full use of the spa facilities and those stunning lake views from the outdoor terrace.
          <br />
          <br />
          Spa days are available to non residents but require advance booking. The spa has a maximum of 6 guests at any time, ensuring a peaceful experience. For full package details, see the{' '}
          <Link href="#day-passes" className="underline">
            spa day packages section
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} offers spa day packages from ${spaAccessPrice || '£45'} to ${rejuvenatePrice || '£140'} per person. Spa Access (${spaAccessPrice || '£45'}) gives you 3 hours of facilities. The Relax Spa Day (${relaxPrice || '£115'}) includes a 25 minute treatment plus afternoon tea. The Rejuvenate Spa Day (${rejuvenatePrice || '£140'}) includes a 50 minute treatment with afternoon tea and fizz. All packages include the outdoor hot tub, pool, sauna, and steam room. Advance booking required.`,
    },

    // FAQ 2: Age Restrictions
    {
      question: `Can children use the spa at ${spa.name}?`,
      answer: (
        <>
          The spa facilities at {spa.name} including the outdoor hot tub, Himalayan sauna, and aromatic steam room are for guests aged {agePolicy || '16 and over'} only. However, children can use the indoor swimming pool during a dedicated family session from 10am to 1pm daily.
          <br />
          <br />
          Outside of the 10am to 1pm family window, the pool becomes part of the adults only spa environment. This split approach allows families to enjoy swimming together while maintaining a peaceful, relaxing atmosphere in the thermal facilities throughout the day.
          <br />
          <br />
          If you&apos;re visiting with children, you could enjoy family swim time together in the morning, then take turns using the spa facilities while the other parent supervises. For spas with different age policies, see our{' '}
          <Link href="/" className="underline">
            full spa directory
          </Link>
          .
        </>
      ),
      schemaText: `The spa facilities at ${spa.name} including the outdoor hot tub, sauna, and steam room are for guests aged ${agePolicy || '16 and over'} only. However, children can use the indoor swimming pool during a dedicated family session from 10am to 1pm daily. Outside these hours, the pool is part of the adults only spa environment. This allows families to enjoy swimming together while maintaining a peaceful atmosphere in the thermal areas.`,
    },

    // FAQ 3: Outdoor Facilities
    {
      question: `Does ${spa.name} have outdoor spa facilities?`,
      answer: (
        <>
          Yes, {spa.name} features an outdoor hot tub positioned on a lakeside terrace with direct views over Lake Windermere to the fells beyond. This is the spa&apos;s signature feature and relatively rare among Lake District spas. Guest reviews frequently mention enjoying the hot tub in all weather, including sitting in it while rain falls around you.
          <br />
          <br />
          The outdoor terrace also includes dual vitality spa pools offering hydrotherapy with those same uninterrupted lake views. Beyond the spa, the hotel has two private jetties and a secret gate providing direct access to the lakeshore for open water swimming from the private beach.
          <br />
          <br />
          Inside, you&apos;ll find a 35 foot swimming pool with atmospheric lighting and floor to ceiling windows maximising the lake views, plus a Himalayan sauna and aromatic steam room. For the complete facilities list, see the{' '}
          <Link href="#thermal" className="underline">
            thermal facilities
          </Link>{' '}
          and{' '}
          <Link href="#pool" className="underline">
            pool features
          </Link>{' '}
          sections.
        </>
      ),
      schemaText: `Yes, ${spa.name} features an outdoor hot tub on a lakeside terrace with direct views over Lake Windermere. This signature feature is rare among Lake District spas. The outdoor terrace also includes dual vitality spa pools with hydrotherapy. The hotel has private jetties and lakeshore access for open water swimming. Inside, there's a 35 foot pool with lake views, a Himalayan sauna, and aromatic steam room.`,
    },

    // FAQ 4: Booking Requirements
    {
      question: `Do I need to book the spa in advance at ${spa.name}?`,
      answer: (
        <>
          Yes, pre booking is required for all spa access at {spa.name}, whether you&apos;re a hotel guest or visiting for a spa day. This policy helps maintain the intimate, peaceful atmosphere the spa is known for, with a maximum of just 6 guests using the facilities at any time.
          <br />
          <br />
          Hotel guests should book their spa time through reception upon arrival or in advance. Day visitors need to book their spa day package before arriving. Guest reviews frequently mention having the spa to themselves or enjoying a quiet, uncrowded experience, which is a direct result of this managed approach.
          <br />
          <br />
          Early booking is recommended, especially for weekends and the popular Rejuvenate Spa Day package. You can book by emailing reservations@beechhillhotel.co.uk or calling the hotel directly. For booking information, see the{' '}
          <Link href="#access" className="underline">
            spa access information
          </Link>
          .
        </>
      ),
      schemaText: `Yes, pre booking is required for all spa access at ${spa.name}, whether you're a hotel guest or day visitor. This maintains the intimate atmosphere with a maximum of 6 guests at any time. Hotel guests should book through reception. Day visitors need to book packages in advance. Guest reviews frequently mention having the spa to themselves. Book via reservations@beechhillhotel.co.uk.`,
    },

    // FAQ 5: Spa Access for Hotel Guests
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          Yes, spa access is complimentary for all hotel guests at {spa.name}. Your room rate includes full use of the outdoor hot tub with Lake Windermere views, the 35 foot indoor pool, Himalayan sauna, and aromatic steam room at no additional charge.
          <br />
          <br />
          The spa is open Thursday to Sunday from 9:30am to 4pm, with extended hours until 6pm on Fridays and Saturdays. While access is free for guests, you do need to pre book your spa time through reception to ensure availability, as the spa maintains a maximum of 6 guests for a peaceful experience.
          <br />
          <br />
          Spa treatments using the CAUDALIE range are available at extra cost and can be booked in advance. The hotel offers everything from 25 minute express treatments to 50 minute luxury facials and massages. For treatment options, see the{' '}
          <Link href="#treatments" className="underline">
            spa treatments section
          </Link>
          .
        </>
      ),
      schemaText: `Yes, spa access is complimentary for all hotel guests at ${spa.name}. Your room rate includes the outdoor hot tub with lake views, 35 foot indoor pool, Himalayan sauna, and aromatic steam room. The spa is open Thursday to Sunday 9:30am-4pm, with extended hours until 6pm on Fridays and Saturdays. Pre booking through reception is required. Treatments using the CAUDALIE range are available at extra cost.`,
    },
  ];
}

