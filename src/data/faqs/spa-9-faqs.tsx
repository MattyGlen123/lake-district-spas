import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import { getDayPassPrice, getDayPassDuration } from '@/data/priced-content';

export function getSpa9FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values from day passes
  const dipDinePrice = getDayPassPrice(spa.id, 'lakeside-dip-and-dine');
  const dipDineDuration = getDayPassDuration(spa.id, 'lakeside-dip-and-dine');
  const expressEscapePrice = getDayPassPrice(
    spa.id,
    'lakeside-express-escape'
  );
  const signaturePrice = getDayPassPrice(
    spa.id,
    'lakeside-signature-sanctuary-spa-day'
  );
  const signatureDuration = getDayPassDuration(
    spa.id,
    'lakeside-signature-sanctuary-spa-day'
  );

  return [
    // FAQ 1: Pricing
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa day packages at {spa.name} range from {dipDinePrice || '£25'} to{' '}
          {signaturePrice || '£95'} per person, making it one of the most
          affordable spa options in the Lake District. With three packages
          available, there&apos;s an option for every budget.
          <br />
          <br />
          The most affordable option is{' '}
          <Link href="#lakeside-dip-and-dine" className="underline">
            Dip &amp; Dine
          </Link>{' '}
          ({dipDinePrice || '£25'}), which gives you{' '}
          {dipDineDuration || '3 hours'} of access to the 17 metre heated pool,
          sauna, steam room and jacuzzi, plus a £15 food credit to spend in the
          hotel.
          <br />
          <br />
          If you want a treatment included, the{' '}
          <Link href="#lakeside-express-escape" className="underline">
            Express Escape
          </Link>{' '}
          ({expressEscapePrice || '£70'}) combines spa access with a 30 minute
          ELEMIS treatment and afternoon tea, while the{' '}
          <Link
            href="#lakeside-signature-sanctuary-spa-day"
            className="underline"
          >
            Signature Sanctuary Spa Day
          </Link>{' '}
          ({signaturePrice || '£95'}) upgrades that to a full 60 minute
          treatment. View all packages in the{' '}
          <Link href="#day-passes" className="underline">
            Day Spa Packages section
          </Link>
          .
        </>
      ),
      schemaText: `Spa day packages at ${spa.name} range from ${dipDinePrice || '£25'} to ${signaturePrice || '£95'} per person. Dip & Dine (${dipDinePrice || '£25'}) offers ${dipDineDuration || '3 hours'} of pool, sauna, steam room and jacuzzi access plus a £15 food credit. For treatments, the Express Escape (${expressEscapePrice || '£70'}) includes a 30 minute ELEMIS treatment and afternoon tea, and the Signature Sanctuary Spa Day (${signaturePrice || '£95'}) includes a 60 minute treatment.`,
    },

    // FAQ 2: Facilities
    {
      question: `What spa facilities are included at ${spa.name}?`,
      answer: (
        <>
          {spa.name} offers a 17 metre heated indoor pool with views across Lake
          Windermere, a poolside jacuzzi, traditional sauna, and relaxing steam
          room. All spa day packages include access to these facilities. The
          pool features a beach style shallow area making it suitable for guests
          of all swimming abilities.
          <br />
          <br />
          Outside, the spa garden provides a tranquil retreat with an open fire
          pit and heat domes to keep warm while enjoying the lakeside setting.
          This outdoor space is perfect for relaxing between pool sessions or
          warming up after a swim. The combination of indoor thermal facilities
          and outdoor relaxation areas offers a complete wellness experience.
          <br />
          <br />
          It&apos;s worth noting that {spa.name} is a hotel wellness facility
          rather than a destination thermal spa. If you&apos;re looking for an
          extensive thermal suite with multiple heat experiences, consider{' '}
          <Link href="/spa/lodore-falls-spa" className="underline">
            Lodore Falls
          </Link>{' '}
          or{' '}
          <Link href="/spa/low-wood-bay-spa" className="underline">
            Low Wood Bay
          </Link>
          . For full facility details, see the{' '}
          <Link href="#thermal" className="underline">
            Thermal Facilities section
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} offers a 17 metre heated indoor pool with Lake Windermere views, poolside jacuzzi, traditional sauna, and steam room. The outdoor spa garden features a fire pit and heat domes for relaxing in the lakeside setting. All spa day packages include access to these facilities.`,
    },

    // FAQ 3: Children policy
    {
      question: `Can children use the spa at ${spa.name}?`,
      answer: (
        <>
          Yes, {spa.name} is a family friendly spa where children are welcome to
          use the pool and facilities. This makes it an excellent choice for
          families wanting to enjoy a spa day together, unlike many Lake
          District spas that operate adults only policies. All spa day packages
          are available to guests of all ages.
          <br />
          <br />
          The 17 metre heated pool features a beach style shallow area, making
          it accessible and safe for younger swimmers. Families can enjoy the
          pool, jacuzzi, sauna, and steam room together. The outdoor spa garden
          with its fire pit is also available for all guests to use.
          <br />
          <br />
          If you&apos;re seeking a quieter, adults only spa experience, you may
          prefer{' '}
          <Link href="/spa/lodore-falls-spa" className="underline">
            Lodore Falls
          </Link>{' '}
          (18 and over) or{' '}
          <Link href="/spa/brimstone-hotel-spa" className="underline">
            Brimstone Spa
          </Link>{' '}
          (18 and over). For more family friendly options, see our{' '}
          <Link href="/spas" className="underline">
            Spas page
          </Link>
          .
        </>
      ),
      schemaText: `Yes, ${spa.name} is a family friendly spa where children are welcome. All spa day packages are available to guests of all ages. The pool features a beach style shallow area suitable for younger swimmers. For adults only spa experiences in the Lake District, consider Lodore Falls (18+) or Brimstone Spa (18+).`,
    },

    // FAQ 4: Outdoor spa garden
    {
      question: `What is the outdoor spa garden at ${spa.name}?`,
      answer: (
        <>
          The outdoor spa garden at {spa.name} is a tranquil lakeside retreat
          featuring an open fire pit and heat domes where guests can relax and
          warm up while enjoying views of Lake Windermere. It provides a unique
          outdoor space to unwind between swimming and sauna sessions.
          <br />
          <br />
          The fire pit creates a cosy focal point where you can gather and warm
          up after using the pool or thermal facilities. The heat domes offer
          covered, heated seating areas so you can enjoy the fresh Lake District
          air without getting cold. This combination of outdoor warmth and
          natural surroundings sets {spa.name} apart from indoor only spas.
          <br />
          <br />
          Access to the spa garden is included with all spa day packages and
          hotel guest spa access. It&apos;s particularly atmospheric on cooler
          days when you can contrast the crisp outdoor air with the warmth of
          the fire pit and heat domes. For more details on what&apos;s included,
          see the{' '}
          <Link href="#thermal" className="underline">
            Thermal Facilities section
          </Link>
          .
        </>
      ),
      schemaText: `The outdoor spa garden at ${spa.name} is a tranquil lakeside retreat with an open fire pit and heat domes. Guests can relax and warm up while enjoying Lake Windermere views. The fire pit creates a cosy gathering spot, while heat domes provide covered heated seating. Access is included with all spa day packages.`,
    },

    // FAQ 5: Afternoon tea package
    {
      question: `Does ${spa.name} offer spa packages with afternoon tea?`,
      answer: (
        <>
          Yes, two of the four packages include it. The{' '}
          <Link
            href="#lakeside-signature-sanctuary-spa-day"
            className="underline"
          >
            Signature Sanctuary Spa Day
          </Link>{' '}
          ({signaturePrice || '£95'}) combines{' '}
          {signatureDuration || '3 hours'} of spa access with a 60 minute ELEMIS
          treatment and a traditional afternoon tea served in the Spa Lounge, so
          you can stay in your robe throughout.
          <br />
          <br />
          This package is ideal for a special occasion or a treat with friends.
          After your treatment, you can enjoy the 17 metre heated pool, sauna,
          steam room and jacuzzi before sitting down to afternoon tea with views
          across Lake Windermere. The hotel&apos;s food is consistently praised
          in reviews, making this package excellent value for a combined spa and
          dining experience.
          <br />
          <br />
          For a shorter visit, the{' '}
          <Link href="#lakeside-express-escape" className="underline">
            Express Escape
          </Link>{' '}
          ({expressEscapePrice || '£70'}) also includes afternoon tea alongside
          full spa access and a 30 minute ELEMIS treatment. Book directly
          through the{' '}
          <Link href="#book" className="underline">
            spa booking page
          </Link>
          .
        </>
      ),
      schemaText: `Yes. The Signature Sanctuary Spa Day (${signaturePrice || '£95'}) includes ${signatureDuration || '3 hours'} of spa access, a 60 minute ELEMIS treatment, and a traditional afternoon tea served in the Spa Lounge overlooking Lake Windermere. The Express Escape (${expressEscapePrice || '£70'}) also includes afternoon tea with a 30 minute ELEMIS treatment.`,
    },
  ];
}
