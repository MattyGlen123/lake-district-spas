import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getTreatmentBrandsText,
  getTreatmentIdByName,
} from './helpers';

export function getSpa8FAQs(spa: Spa): FAQ[] {
  const brandsText = getTreatmentBrandsText(spa.id);
  const walkersLegMassageId = getTreatmentIdByName(spa.id, 'WALKERS LEG MASSAGE');

  return [
    {
      question: `Can I visit the Waterfall Spa at ${spa.name} without staying at the hotel?`,
      answer: (
        <>
          No, the Waterfall Spa at {spa.name} is exclusively available to hotel
          guests and does not offer day passes or walk in spa visits. This is
          actually one of the advantages of staying here, as the spa remains
          peaceful and uncrowded throughout your visit, giving you the freedom to
          use the facilities at your own pace.
          <br />
          <br />
          As a hotel guest, your spa access is included with every room booking
          at no additional cost. The Waterfall Spa is open from 8am to 8pm
          daily, and you have full access to the pool, infrared sauna, steam
          room, outdoor hot tub, and hydrotherapy fountain as many times as you
          like during your stay. There are no time slots to book and no extra
          charges for spa use.
          <br />
          <br />
          If you are looking for a Lake District spa day without an overnight
          stay, several other spas in the area do offer day pass packages.
          Browse our{' '}
          <Link href="/" className="text-stone-900 underline">
            full spa directory
          </Link>{' '}
          to find options.
        </>
      ),
      schemaText: `No, the Waterfall Spa at ${spa.name} is exclusively available to hotel guests and does not offer day passes or walk in spa visits. As a hotel guest, your spa access is included with every room booking at no additional cost. The Waterfall Spa is open from 8am to 8pm daily, and you have full access to the pool, infrared sauna, steam room, outdoor hot tub, and hydrotherapy fountain throughout your stay. There are no time slots to book and no extra charges.`,
    },
    {
      question: `What spa facilities are included with my room booking at ${spa.name}?`,
      answer: (
        <>
          Every room booking at {spa.name} includes full access to the Waterfall
          Spa at no extra charge. The spa features a swimming pool with a
          starlit fibre optic ceiling, an infrared sauna, a steam room, an
          outdoor hot tub, and an outdoor hydrotherapy fountain. There is also a
          fully equipped gym if you want to work out before or after your spa
          session. Facilities are open from 8am to 8pm daily.
          <br />
          <br />
          Unlike many Lake District spa hotels that charge separately for spa
          access or limit you to timed sessions, all facilities at the Waterfall
          Spa are available to every guest throughout your stay. There is no need
          to pre book a spa time slot, and you can return to use the facilities
          as often as you like.
          <br />
          <br />
          The spa also offers a full menu of{' '}
          {brandsText || 'Elemis'} treatments including massages, facials, and
          body treatments, which can be booked separately. For the complete
          treatment list and pricing, see the{' '}
          <Link
            href="#treatments"
            className="text-stone-900 underline"
          >
            treatments section
          </Link>
          . To explore the thermal facilities in more detail, visit the{' '}
          <Link
            href="#thermal"
            className="text-stone-900 underline"
          >
            facilities section
          </Link>
          .
        </>
      ),
      schemaText: `Every room booking at ${spa.name} includes full access to the Waterfall Spa at no extra charge. The spa features a swimming pool with a starlit fibre optic ceiling, an infrared sauna, a steam room, an outdoor hot tub, and an outdoor hydrotherapy fountain. There is also a gym. Facilities are open from 8am to 8pm daily. Unlike many Lake District spa hotels that charge separately or limit you to timed sessions, all facilities are available to every guest throughout your stay. The spa also offers ${brandsText || 'Elemis'} treatments including massages, facials, and body treatments, bookable separately.`,
    },
    {
      question: `What is the Walkers Leg Massage at ${spa.name}?`,
      answer: (
        <>
          The{' '}
          <Link href={walkersLegMassageId ? `#${walkersLegMassageId}` : '#treatments'} className="text-stone-900 underline">
            Walkers Leg Massage
          </Link>{' '}
          is a specialist treatment at the Waterfall Spa
          designed specifically for guests who have been exploring the Lake
          District fells on foot. Using {brandsText || 'Elemis'} products, this
          focused massage targets tired and aching legs after a day of hiking,
          fell walking, or trail running. It is one of the few spa treatments in
          the Lake District created specifically with walkers in mind.
          <br />
          <br />
          {spa.name} is ideally placed for this treatment thanks to its central
          Ambleside location. Popular walks including Wansfell Pike, the
          Fairfield Horseshoe, and Stock Ghyll Force waterfall all start within
          minutes of the hotel. You can head out for a day on the fells and
          return to the spa for a targeted recovery session without needing to
          drive anywhere.
          <br />
          <br />
          This treatment should be booked in advance as availability is limited.
          You can view the full range of spa treatments, including other massage
          options and facials, in the{' '}
          <Link
            href="#treatments"
            className="text-stone-900 underline"
          >
            treatments section
          </Link>
          . To book your stay and treatment together, visit the{' '}
          <Link
            href="#book"
            className="text-stone-900 underline"
          >
            booking section
          </Link>
          .
        </>
      ),
      schemaText: `The Walkers Leg Massage is a specialist treatment at the Waterfall Spa designed specifically for guests who have been exploring the Lake District fells on foot. Using ${brandsText || 'Elemis'} products, this focused massage targets tired and aching legs after a day of hiking, fell walking, or trail running. ${spa.name} is ideally placed for this treatment thanks to its central Ambleside location. Popular walks including Wansfell Pike, the Fairfield Horseshoe, and Stock Ghyll Force waterfall all start within minutes of the hotel. This treatment should be booked in advance as availability is limited.`,
    },
    {
      question: `Can children use the Waterfall Spa at ${spa.name}?`,
      answer: (
        <>
          Yes, children are welcome to use the Waterfall Spa at {spa.name} when
          accompanied by an adult. This makes the hotel one of the more family
          friendly spa options in the Lake District, where many properties
          restrict their spa facilities to guests aged 16 and over or adults
          only.
          <br />
          <br />
          Children can enjoy the swimming pool, and the Waterfall Spa is open to
          all guests from 8am to 8pm daily. Parents should be aware that the spa
          also includes an infrared sauna, steam room, and outdoor hot tub, so
          younger children will need close supervision around these thermal
          facilities. The atmosphere is relaxed and welcoming rather than
          strictly formal, making it comfortable for families.
          <br />
          <br />
          If you are planning a family stay and want everyone to be able to
          enjoy the spa, {spa.name} is a strong choice in Ambleside. For more
          details on the full range of spa facilities available, see the{' '}
          <Link
            href="#thermal"
            className="text-stone-900 underline"
          >
            facilities section
          </Link>
          . For general access policies, see the{' '}
          <Link
            href="#access"
            className="text-stone-900 underline"
          >
            spa access information
          </Link>
          .
        </>
      ),
      schemaText: `Yes, children are welcome to use the Waterfall Spa at ${spa.name} when accompanied by an adult. This makes the hotel one of the more family friendly spa options in the Lake District, where many properties restrict spa access to guests aged 16 and over or adults only. Children can enjoy the swimming pool, and the spa is open from 8am to 8pm daily. Parents should supervise younger children around the infrared sauna, steam room, and outdoor hot tub. The atmosphere is relaxed and welcoming rather than strictly formal, making it comfortable for families.`,
    },
    {
      question: `Are there rooms with private hot tubs or spa facilities at ${spa.name}?`,
      answer: (
        <>
          Yes, {spa.name} offers several premium room categories that include
          private spa facilities within the room itself. The loft suites feature
          a private jacuzzi for two, an in room steam room, and a personal
          sauna, giving you your own spa experience without leaving your room.
          Some rooms also have a balcony hot tub with views over the Ambleside
          rooftops and surrounding fells.
          <br />
          <br />
          These rooms are part of the Lakeland Club tier and are highly sought
          after, so booking well in advance is recommended. Even with a private
          hot tub or jacuzzi in your room, you still have full access to the
          main Waterfall Spa facilities included in your stay. This means you
          can enjoy both the communal pool, sauna, and steam room during the day
          and then retreat to your private spa facilities in the evening.
          <br />
          <br />
          Guest reviews consistently highlight these rooms as a standout
          feature. If a private spa experience is important to you, check
          availability early through the{' '}
          <Link
            href="#book"
            className="text-stone-900 underline"
          >
            booking section
          </Link>
          . For information on the shared spa facilities available to all
          guests, see the{' '}
          <Link
            href="#thermal"
            className="text-stone-900 underline"
          >
            facilities section
          </Link>
          .
        </>
      ),
      schemaText: `Yes, ${spa.name} offers several premium room categories with private spa facilities. The loft suites feature a private jacuzzi for two, an in room steam room, and a personal sauna. Some rooms also have a balcony hot tub with views over Ambleside and the surrounding fells. These rooms are part of the Lakeland Club tier and are highly sought after, so booking well in advance is recommended. Even with private spa facilities in your room, you still have full access to the main Waterfall Spa included in your stay.`,
    },
  ];
}

