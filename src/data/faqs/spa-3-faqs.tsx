import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getThermalFacilitiesCount,
  getAgePolicy,
  getTreatmentIdByName,
  getTreatmentPrice,
} from './helpers';

export function getSpa3FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values
  const thermalCount = getThermalFacilitiesCount(spa);

  const agePolicy = getAgePolicy(spa);
  const fellwalkerId = getTreatmentIdByName(spa.id, 'Fellwalker');
  const fellwalkerPrice = getTreatmentPrice(spa.id, 'Fellwalker');
  const spaSensesId = getTreatmentIdByName(
    spa.id,
    'Spa Senses Signature Ritual - Detoxifying'
  );

  return [
    {
      question: `Can I visit ${spa.name} for the day without staying at the hotel?`,
      answer: (
        <>
          No, {spa.name} is exclusively available to hotel guests. Unlike many
          Lake District spas, Brimstone does not offer day passes or spa day
          packages. The spa facilities are reserved solely for guests staying at
          the hotel, creating an intimate and tranquil environment throughout
          your visit.
          <br />
          <br />
          This exclusive approach means the spa never feels overcrowded, and
          hotel guests can enjoy unlimited access to all facilities throughout
          their stay. From the moment you arrive until check out, you can use
          the 9 metre swim through pool, {thermalCount} thermal experiences, and
          relaxation areas as often as you wish without booking time slots or
          worrying about capacity limits.
          <br />
          <br />
          If you&apos;re looking to experience {spa.name}, the only option is to
          book a stay at the hotel. Spa access is complimentary for all hotel
          guests regardless of room type. To book your stay, visit the{' '}
          <Link href="#book" className="underline">
            booking section
          </Link>
          . For spas that do offer day passes in the Lake District, see our{' '}
          <Link href="/spas" className="underline">
            Spas page
          </Link>
          .
        </>
      ),
      schemaText: `No, ${spa.name} is exclusively available to hotel guests. Unlike many Lake District spas, Brimstone does not offer day passes or spa day packages. The spa facilities are reserved solely for guests staying at the hotel. Hotel guests enjoy unlimited access to all facilities throughout their stay, including the 9 metre swim through pool and ${thermalCount} thermal experiences. To experience ${spa.name}, you must book a stay at the hotel. Spa access is complimentary for all guests regardless of room type.`,
    },
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          Yes, spa access is complimentary for all hotel guests at {spa.name}{' '}
          regardless of which room type you book. From your arrival until check
          out, you have unlimited access to all spa facilities including the
          unique 9 metre swim through indoor and outdoor pool, {thermalCount}{' '}
          thermal experiences, relaxation areas, and the outdoor terrace with
          views over the Langdale Pikes.
          <br />
          <br />
          Unlike some Lake District spas that operate on timed booking slots,{' '}
          {spa.name} allows guests to come and go as they please throughout
          their stay. You can use the spa facilities first thing in the morning,
          between activities, or for a relaxing evening session. The spa is even
          available while you wait for your room to be ready on arrival, so you
          can start unwinding from the moment you arrive.
          <br />
          <br />
          The thermal facilities include a Finnish sauna, laconium for gentle
          heat therapy, aromatic steam room, ice room for contrast therapy, and
          multi sensory experience showers. Towels and robes are provided. For
          full details on the facilities, see the{' '}
          <Link href="#thermal" className="underline">
            thermal facilities section
          </Link>
          .
        </>
      ),
      schemaText: `Yes, spa access is complimentary for all hotel guests at ${spa.name} regardless of room type. From arrival until check out, you have unlimited access to all spa facilities including the unique 9 metre swim through indoor and outdoor pool, ${thermalCount} thermal experiences, relaxation areas, and outdoor terrace. Unlike some Lake District spas with timed booking slots, ${spa.name} allows guests to come and go as they please. The spa is available from arrival, even while waiting for your room. Thermal facilities include Finnish sauna, laconium, aromatic steam room, ice room, and experience showers. Towels and robes are provided.`,
    },
    {
      question: `What makes ${spa.name} unique in the Lake District?`,
      answer: (
        <>
          {spa.name} stands out in the Lake District for its distinctive
          Scandinavian inspired design and several unique features you
          won&apos;t find elsewhere. The centrepiece is the 9 metre swim through
          pool that connects the indoor spa directly to the outdoor terrace,
          allowing you to swim between warm waters while taking in views of the
          surrounding Langdale fells. This is the only swim through pool of its
          kind in the Lake District.
          <br />
          <br />
          Beyond the pool, guests enjoy {thermalCount} thermal experiences
          including a traditional Finnish sauna, laconium (gentle dry heat
          room), aromatic steam room infused with essential oils, an ice room
          for contrast therapy, and multi sensory experience showers. The spa
          uses exclusive Pure Alchemy products, a range developed specifically
          for Brimstone using natural Lake District elements.
          <br />
          <br />
          The location in the heart of walking country makes {spa.name}{' '}
          particularly popular with hikers, and the signature{' '}
          <Link
            href={fellwalkerId ? `#${fellwalkerId}` : '#treatments'}
            className="underline"
          >
            Fellwalker
          </Link>{' '}
          treatment is designed specifically for soothing tired muscles after
          mountain adventures. For more Lake District spa options, see our{' '}
          <Link href="/spas" className="underline">
            Spas page
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} stands out in the Lake District for its Scandinavian inspired design and unique features. The centrepiece is the 9 metre swim through pool connecting indoors to the outdoor terrace with views of the Langdale fells, the only one of its kind in the Lake District. Guests enjoy ${thermalCount} thermal experiences including Finnish sauna, laconium, aromatic steam room, ice room, and experience showers. The spa uses exclusive Pure Alchemy products developed from Lake District natural elements. The reading room offers complimentary all day refreshments including beer, wine, and snacks. The Arc'Teryx Bootroom provides outdoor equipment for exploring Great Langdale. The signature Fellwalker treatment is designed for hikers.`,
    },
    {
      question: `What treatments does ${spa.name} offer?`,
      answer: (
        <>
          {spa.name} offers 27 spa treatments ranging from express 25 minute
          therapies to indulgent 100 minute signature rituals. The treatment
          menu features two premium brands: Pure Alchemy, an exclusive range
          developed specifically for Brimstone using Lake District natural
          elements, and Skeyndor, a professional skincare line known for
          advanced facial treatments.
          <br />
          <br />
          Treatments are organised into categories including facial treatments
          (from £65 for an express facial to £250 for the Timeless anti ageing
          facial), body treatments (£125 to £300 for couples), and massage
          therapies. The signature{' '}
          <Link
            href={fellwalkerId ? `#${fellwalkerId}` : '#treatments'}
            className="underline"
          >
            Fellwalker
          </Link>{' '}
          treatment ({fellwalkerPrice || '£125'}, 50 minutes) is designed
          specifically for walkers and hikers, focusing on feet, back, and legs
          to soothe muscles after exploring the fells. For couples, the{' '}
          <Link
            href={spaSensesId ? `#${spaSensesId}` : '#treatments'}
            className="underline"
          >
            Spa Senses Signature Rituals
          </Link>{' '}
          (from £300 per person, 100 minutes) offer multi sensory experiences
          including full body exfoliation, private steam, wraps, and choice of
          facial or massage.
          <br />
          <br />
          Express treatments (25 minutes, £65) are available Monday to Thursday
          between 10am and 4pm only. Due to the spa&apos;s intimate size,
          advance booking is recommended for all treatments. To view the full
          treatment menu or book, see the{' '}
          <Link href="#treatments" className="underline">
            treatments section
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} offers 27 spa treatments ranging from 25 minute express therapies to 100 minute signature rituals. The menu features Pure Alchemy (exclusive Lake District inspired products) and Skeyndor (professional skincare). Treatments include facials (£65 to £250), body treatments (£125 to £300), and massages. The signature Fellwalker treatment (${fellwalkerPrice || '£125'}, 50 minutes) is designed for hikers. Couples Spa Senses Signature Rituals start at £300 per person for 100 minutes. Express 25 minute treatments (£65) are available Monday to Thursday 10am to 4pm only. Advance booking recommended. Book via the treatments section or call 015394 38014.`,
    },
    {
      question: `Is ${spa.name} adults only?`,
      answer: (
        <>
          Yes, {spa.name} is exclusively for guests aged{' '}
          {agePolicy || '18 and over'}. The spa facilities including the swim
          through pool, all thermal experiences, and relaxation areas are
          restricted to adult guests only. This policy is in place due to the
          nature of the thermal heat experiences (saunas, steam rooms, laconium)
          which are unsuitable for children, and to maintain a peaceful,
          relaxing atmosphere for all visitors.
          <br />
          <br />
          While the spa is adults only, families with children are welcome to
          stay at the wider Langdale Estate, which includes the adjacent
          Langdale Hotel. However, children cannot access the Brimstone spa
          facilities under any circumstances. If you&apos;re travelling with
          younger guests, be aware that the spa experience will only be
          available to adult members of your party.
          <br />
          <br />
          For families seeking spa experiences where children are welcome, some
          Lake District spas offer dedicated family swim times or have
          facilities suitable for younger guests. For alternative options,
          browse our{' '}
          <Link href="/spas" className="underline">
            Lake District spa directory
          </Link>{' '}
          to find spas with different age policies.
        </>
      ),
      schemaText: `Yes, ${spa.name} is exclusively for guests aged ${agePolicy || '18 and over'}. The spa facilities including the swim through pool, thermal experiences, and relaxation areas are restricted to adults only. This policy exists due to the thermal heat experiences (saunas, steam rooms, laconium) being unsuitable for children, and to maintain a peaceful atmosphere. Families with children can stay at the wider Langdale Estate, but children cannot access Brimstone spa facilities. For family friendly spa options in the Lake District with different age policies, browse our spa directory.`,
    },
  ];
}
