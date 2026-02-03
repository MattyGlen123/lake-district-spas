import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import { getDayPassPrice, getDayPassDuration } from './helpers';

export function getSpa9FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values from day passes
  const steamSwimPrice = getDayPassPrice(spa.id, 'lakeside-steam-and-swim');
  const steamSwimDuration = getDayPassDuration(spa.id, 'lakeside-steam-and-swim');
  const twilightPrice = getDayPassPrice(spa.id, 'lakeside-twilight-swim-steam');
  const seasonalPrice = getDayPassPrice(spa.id, 'lakeside-seasonal-spa-day');
  const revitalisingPrice = getDayPassPrice(spa.id, 'lakeside-revitalising-spa-day');
  const afternoonTeaPrice = getDayPassPrice(spa.id, 'lakeside-afternoon-tea-spa-day');
  const afternoonTeaDuration = getDayPassDuration(spa.id, 'lakeside-afternoon-tea-spa-day');
  const groupPrice = getDayPassPrice(spa.id, 'lakeside-group-spa-day');

  return [
    // FAQ 1: Pricing
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa day packages at {spa.name} range from {steamSwimPrice || '£30'} to {afternoonTeaPrice || '£150'} per person, making it one of the most affordable spa options in the Lake District. With six different packages available, there&apos;s an option for every budget.
          <br />
          <br />
          The most affordable option is the{' '}
          <Link href="#lakeside-steam-and-swim" className="text-stone-900 underline">
            Steam And Swim
          </Link>{' '}
          package ({steamSwimPrice || '£30'}) which gives you {steamSwimDuration || '3 hours'} of access to the 17 metre heated pool, sauna, steam room and jacuzzi. For evening visits, the{' '}
          <Link href="#lakeside-twilight-swim-steam" className="text-stone-900 underline">
            Twilight Swim & Steam
          </Link>{' '}
          ({twilightPrice || '£30'}) includes a glass of fizz on arrival. If you want treatments included, the{' '}
          <Link href="#lakeside-seasonal-spa-day" className="text-stone-900 underline">
            Seasonal Spa Day
          </Link>{' '}
          ({seasonalPrice || '£90'}) offers full day access with a 45 minute treatment.
          <br />
          <br />
          For groups of 4 or more, the{' '}
          <Link href="#lakeside-group-spa-day" className="text-stone-900 underline">
            Group Spa Day
          </Link>{' '}
          starts from {groupPrice || '£85'} per person. View all packages in the{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            Day Spa Packages section
          </Link>.
        </>
      ),
      schemaText: `Spa day packages at ${spa.name} range from ${steamSwimPrice || '£30'} to ${afternoonTeaPrice || '£150'} per person. The Steam And Swim package (${steamSwimPrice || '£30'}) offers ${steamSwimDuration || '3 hours'} of pool, sauna, steam room and jacuzzi access. For treatments, the Seasonal Spa Day (${seasonalPrice || '£90'}) includes a 45 minute treatment. Group packages start from ${groupPrice || '£85'} per person for 4 or more guests.`,
    },

    // FAQ 2: Facilities
    {
      question: `What spa facilities are included at ${spa.name}?`,
      answer: (
        <>
          {spa.name} offers a 17 metre heated indoor pool with views across Lake Windermere, a poolside jacuzzi, traditional sauna, and relaxing steam room. All spa day packages include access to these facilities. The pool features a beach style shallow area making it suitable for guests of all swimming abilities.
          <br />
          <br />
          Outside, the spa garden provides a tranquil retreat with an open fire pit and heat domes to keep warm while enjoying the lakeside setting. This outdoor space is perfect for relaxing between pool sessions or warming up after a swim. The combination of indoor thermal facilities and outdoor relaxation areas offers a complete wellness experience.
          <br />
          <br />
          It&apos;s worth noting that {spa.name} is a hotel wellness facility rather than a destination thermal spa. If you&apos;re looking for an extensive thermal suite with multiple heat experiences, consider{' '}
          <Link href="/spa/lodore-falls-spa" className="text-stone-900 underline">
            Lodore Falls
          </Link>{' '}
          or{' '}
          <Link href="/spa/low-wood-bay-spa" className="text-stone-900 underline">
            Low Wood Bay
          </Link>
          . For full facility details, see the{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            Thermal Facilities section
          </Link>.
        </>
      ),
      schemaText: `${spa.name} offers a 17 metre heated indoor pool with Lake Windermere views, poolside jacuzzi, traditional sauna, and steam room. The outdoor spa garden features a fire pit and heat domes for relaxing in the lakeside setting. All spa day packages include access to these facilities.`,
    },

    // FAQ 3: Children policy
    {
      question: `Can children use the spa at ${spa.name}?`,
      answer: (
        <>
          Yes, {spa.name} is a family friendly spa where children are welcome to use the pool and facilities. This makes it an excellent choice for families wanting to enjoy a spa day together, unlike many Lake District spas that operate adults only policies. All spa day packages are available to guests of all ages.
          <br />
          <br />
          The 17 metre heated pool features a beach style shallow area, making it accessible and safe for younger swimmers. Families can enjoy the pool, jacuzzi, sauna, and steam room together. The outdoor spa garden with its fire pit is also available for all guests to use.
          <br />
          <br />
          If you&apos;re seeking a quieter, adults only spa experience, you may prefer{' '}
          <Link href="/spa/lodore-falls-spa" className="text-stone-900 underline">
            Lodore Falls
          </Link>{' '}
          (18 and over) or{' '}
          <Link href="/spa/brimstone-hotel-spa" className="text-stone-900 underline">
            Brimstone Spa
          </Link>{' '}
          (18 and over). For more family friendly options, see our{' '}
          <Link href="/" className="text-stone-900 underline">
            homepage
          </Link>.
        </>
      ),
      schemaText: `Yes, ${spa.name} is a family friendly spa where children are welcome. All spa day packages are available to guests of all ages. The pool features a beach style shallow area suitable for younger swimmers. For adults only spa experiences in the Lake District, consider Lodore Falls (18+) or Brimstone Spa (18+).`,
    },

    // FAQ 4: Outdoor spa garden
    {
      question: `What is the outdoor spa garden at ${spa.name}?`,
      answer: (
        <>
          The outdoor spa garden at {spa.name} is a tranquil lakeside retreat featuring an open fire pit and heat domes where guests can relax and warm up while enjoying views of Lake Windermere. It provides a unique outdoor space to unwind between swimming and sauna sessions.
          <br />
          <br />
          The fire pit creates a cosy focal point where you can gather and warm up after using the pool or thermal facilities. The heat domes offer covered, heated seating areas so you can enjoy the fresh Lake District air without getting cold. This combination of outdoor warmth and natural surroundings sets {spa.name} apart from indoor only spas.
          <br />
          <br />
          Access to the spa garden is included with all spa day packages and hotel guest spa access. It&apos;s particularly atmospheric on cooler days when you can contrast the crisp outdoor air with the warmth of the fire pit and heat domes. For more details on what&apos;s included, see the{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            Thermal Facilities section
          </Link>.
        </>
      ),
      schemaText: `The outdoor spa garden at ${spa.name} is a tranquil lakeside retreat with an open fire pit and heat domes. Guests can relax and warm up while enjoying Lake Windermere views. The fire pit creates a cosy gathering spot, while heat domes provide covered heated seating. Access is included with all spa day packages.`,
    },

    // FAQ 5: Afternoon tea package
    {
      question: `Does ${spa.name} offer spa packages with afternoon tea?`,
      answer: (
        <>
          Yes, the{' '}
          <Link href="#lakeside-afternoon-tea-spa-day" className="text-stone-900 underline">
            Afternoon Tea Spa Day
          </Link>{' '}
          ({afternoonTeaPrice || '£150'}) combines {afternoonTeaDuration || '3 hours'} of spa access with a 60 minute treatment and traditional afternoon tea in the Lake View restaurant. You&apos;ll also receive tea or coffee with morning pastries on arrival.
          <br />
          <br />
          This package is ideal for a special occasion or a treat with friends. After your treatment, you can enjoy the 17 metre heated pool, sauna, steam room and jacuzzi before sitting down to afternoon tea with views across Lake Windermere. The hotel&apos;s food is consistently praised in reviews, making this package excellent value for a combined spa and dining experience.
          <br />
          <br />
          If you prefer lunch instead of afternoon tea, the{' '}
          <Link href="#lakeside-revitalising-spa-day" className="text-stone-900 underline">
            Revitalising Spa Day
          </Link>{' '}
          ({revitalisingPrice || '£135'}) offers full day spa access, a 60 minute treatment and a 2 course lunch in the Conservatory. Book directly through the{' '}
          <Link href="#book" className="text-stone-900 underline">
            spa booking page
          </Link>.
        </>
      ),
      schemaText: `Yes, the Afternoon Tea Spa Day (${afternoonTeaPrice || '£150'}) includes ${afternoonTeaDuration || '3 hours'} of spa access, a 60 minute treatment, and afternoon tea in the Lake View restaurant overlooking Lake Windermere. Tea and pastries are served on arrival. Alternatively, the Revitalising Spa Day (${revitalisingPrice || '£135'}) offers a 2 course lunch instead.`,
    },
  ];
}

