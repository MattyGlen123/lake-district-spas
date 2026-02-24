import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getTreatmentBrandsText,
} from './helpers';
import { getDayPassPrice, getDayPassDuration } from './helpers';

export function getSpa17FAQs(spa: Spa): FAQ[] {
  const brandsText = getTreatmentBrandsText(spa.id);
  const lazyDaysPrice = getDayPassPrice(spa.id, 'grange-lazy-days-for-locals');
  const spaPackagePrice = getDayPassPrice(spa.id, 'grange-spa-day-package');
  const spaPackageDuration = getDayPassDuration(spa.id, 'grange-spa-day-package');

  return [
    // FAQ 1: Spa access included
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          Spa access at {spa.name} is not automatically included with every room booking. Most hotel guests can use the leisure suite facilities for an additional charge. However, some overnight packages do include complimentary spa access, so it&apos;s worth checking which packages are available when booking your stay.
          <br />
          <br />
          The leisure suite includes a heated indoor pool, jacuzzi hot tub, traditional sauna, and steam room. Robes and slippers are provided for all spa visitors. Spa treatments using {brandsText || 'Tropic Skincare'} are available at an additional cost and should be booked in advance by contacting the hotel directly.
          <br />
          <br />
          If you&apos;d prefer a standalone spa visit without an overnight stay, {spa.name} also offers{' '}
          <Link href="#day-passes" className="underline">
            spa day packages
          </Link>{' '}
          starting from {lazyDaysPrice || '£25'} per person. For full details on access policies, see the{' '}
          <Link href="#access" className="underline">
            spa access information
          </Link>{' '}
          section.
        </>
      ),
      schemaText: `Spa access at ${spa.name} is not automatically included with every room booking. Most hotel guests can use the leisure suite for an additional charge, though some overnight packages include complimentary access. The leisure suite includes a heated indoor pool, jacuzzi, sauna, and steam room. Robes and slippers are provided. Spa day packages are also available from ${lazyDaysPrice || '£25'} per person for non-guests.`,
    },

    // FAQ 2: Spa day cost
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          {spa.name} offers two spa day packages. The Lazy Days for Locals package costs {lazyDaysPrice || '£25'} per person and includes full day access to the leisure suite facilities plus a £15 food allocation from the lounge menu. This is available seven days a week and is one of the most affordable spa day options in the Lake District.
          <br />
          <br />
          The Spa Day Package costs {spaPackagePrice || '£59'} per person and includes {spaPackageDuration || '2 hours'} of spa facilities access, a 25 minute treatment, and a £15 food allocation that can be used towards lunch or afternoon tea. This package is available Sunday to Thursday. Both packages include use of the heated indoor pool, jacuzzi, sauna, and steam room, and both require guests to be aged 18 or over.
          <br />
          <br />
          Booking is required in advance via email. For full package details and booking information, see the{' '}
          <Link href="#day-passes" className="underline">
            spa day packages
          </Link>{' '}
          section. You can also browse all available{' '}
          <Link href="#treatments" className="underline">
            treatments and prices
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} offers two spa day packages. The Lazy Days for Locals costs ${lazyDaysPrice || '£25'} per person with full day access and a £15 food allocation, available seven days a week. The Spa Day Package costs ${spaPackagePrice || '£59'} per person with ${spaPackageDuration || '2 hours'} of access, a 25 minute treatment, and £15 food allocation, available Sunday to Thursday. Both include pool, jacuzzi, sauna, and steam room. Guests must be 18 or over. Booking required in advance via email.`,
    },

    // FAQ 3: Spa facilities
    {
      question: `What spa facilities does ${spa.name} have?`,
      answer: (
        <>
          The leisure suite at {spa.name} includes a heated indoor pool, jacuzzi hot tub, traditional sauna, and steam room. Loungers are arranged around the pool area, and robes, slippers, and towels are provided for all visitors. The facilities are set within the hotel&apos;s Edwardian building, giving the spa a character and charm that larger modern spa complexes don&apos;t offer.
          <br />
          <br />
          This is an intimate boutique spa rather than a large destination wellness centre. The compact setting means it rarely feels crowded, and the atmosphere is quiet and relaxed. Guests visiting on a spa day package can use the facilities alongside hotel guests, with no separate time slots or booking requirements for the pool and thermal areas.
          <br />
          <br />
          Dedicated treatment rooms offer therapies using {brandsText || 'Tropic Skincare'}, a brand known for natural, freshly made botanical formulations. Treatments range from express facials and massages through to full body aromatherapy sessions. For a full list, see the{' '}
          <Link href="#treatments" className="underline">
            treatments and prices
          </Link>{' '}
          section, or explore the{' '}
          <Link href="#thermal" className="underline">
            thermal facilities
          </Link>{' '}
          in detail.
        </>
      ),
      schemaText: `The leisure suite at ${spa.name} includes a heated indoor pool, jacuzzi hot tub, traditional sauna, and steam room. Loungers, robes, slippers, and towels are provided. This is an intimate boutique spa set within an Edwardian building rather than a large destination wellness centre. Treatment rooms offer therapies using ${brandsText || 'Tropic Skincare'}, known for natural botanical formulations. Treatments range from express facials to full body aromatherapy sessions.`,
    },

    // FAQ 4: Afternoon tea combination
    {
      question: `Can I combine a spa visit with afternoon tea at ${spa.name}?`,
      answer: (
        <>
          Yes, the Spa Day Package at {spa.name} ({spaPackagePrice || '£59'} per person) includes {spaPackageDuration || '2 hours'} of leisure suite access, a 25 minute treatment, and a £15 food allocation that can be put towards afternoon tea in the hotel&apos;s restaurant. The combination of spa facilities followed by afternoon tea in the Edwardian dining room makes for a relaxing full experience, and is particularly popular for celebrations and gifts.
          <br />
          <br />
          The more affordable Lazy Days for Locals package ({lazyDaysPrice || '£25'} per person) also includes a £15 food allocation, giving you full day spa access plus the option to enjoy lunch or afternoon tea from the lounge menu. Prosecco and other drinks can be added at the time.
          <br />
          <br />
          Both packages are available for guests aged 18 and over and require advance booking via email. The Spa Day Package runs Sunday to Thursday, while Lazy Days for Locals is available seven days a week. See the{' '}
          <Link href="#day-passes" className="underline">
            spa day packages
          </Link>{' '}
          section for full details and booking information.
        </>
      ),
      schemaText: `Yes, the Spa Day Package (${spaPackagePrice || '£59'} per person) includes ${spaPackageDuration || '2 hours'} of spa access, a 25 minute treatment, and a £15 food allocation usable for afternoon tea. The Lazy Days for Locals package (${lazyDaysPrice || '£25'}) also includes a £15 food allocation with full day spa access. Both are for guests aged 18 and over, require advance booking, and include use of the pool, jacuzzi, sauna, and steam room.`,
    },

    // FAQ 5: Car free access
    {
      question: `Can I get to ${spa.name} without a car?`,
      answer: (
        <>
          Yes, {spa.name} is one of the most accessible spa hotels in the Lake District for car free travel. Grange-over-Sands railway station is directly opposite the hotel entrance, making it easy to arrive by train from Lancaster (approximately 30 minutes), with onward connections from Manchester, Preston, and destinations further south.
          <br />
          <br />
          Once at the hotel, Grange-over-Sands village, the promenade, and coastal walking paths are all within easy walking distance. The town sits on the southern edge of the Lake District National Park, around 15 minutes from Lake Windermere by road, making it a good base for exploring the wider area by bus or taxi if needed.
          <br />
          <br />
          Hotel parking is available but spaces are limited, so arriving by train can actually be more convenient than driving. For a complete overview of the hotel location and how to plan your visit, see the{' '}
          <Link href="#access" className="underline">
            access information
          </Link>{' '}
          section, or explore other{' '}
          <Link href="/spas" className="underline">
            Lake District spas
          </Link>
          .
        </>
      ),
      schemaText: `Yes, ${spa.name} is one of the most accessible spa hotels in the Lake District for car free travel. Grange-over-Sands railway station is directly opposite the hotel entrance, with trains from Lancaster (approximately 30 minutes) connecting from Manchester, Preston, and further south. The village, promenade, and coastal walking paths are all within walking distance. Hotel parking is limited, so arriving by train can be more convenient than driving.`,
    },
  ];
}

