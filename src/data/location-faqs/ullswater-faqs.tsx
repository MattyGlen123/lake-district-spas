import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getTreatmentPrice,
  getTreatmentIdByName,
  getTreatmentBrandsText,
} from '@/data/faqs/helpers';

export function getUllswaterFAQs(spas: Spa[]): FAQ[] {
  const anotherPlace = spas.find((s) => s.id === 14);

  // Day pass prices
  const dayMembershipTreatmentPrice = getDayPassPrice(14, 'another-place-day-membership-treatment');
  const dayMembershipLunchPrice = getDayPassPrice(14, 'another-place-day-membership-lunch');

  // Treatment prices
  const fellWalkersPrice = getTreatmentPrice(14, 'Fell Walkers Massage');
  const sideBySidePrice = getTreatmentPrice(14, 'Side by Side');

  // Treatment IDs for linking
  const fellWalkersId = getTreatmentIdByName(14, 'Fell Walkers Massage');

  // Brands
  const brandsText = getTreatmentBrandsText(14);

  return [
    // FAQ 1: ullswater swimming pool
    {
      question: 'Is there a swimming pool near Ullswater?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}`}
            className="underline"
          >
            {anotherPlace?.name || 'Another Place, The Lake'}
          </Link>{' '}
          at Watermillock on the western shore of Ullswater has a 20 metre
          indoor swimming pool with floor to ceiling glass walls and views
          across the lake to the fells. The pool uses ultra violet filtered,
          low chlorine water and includes a shallow area for children.
          <br />
          <br />
          Hotel guests have complimentary access to the pool from 7am to 9pm
          daily. Family swim times run from 9am to 6pm, with adult only
          sessions from 7am to 9am and 6pm to 9pm. Day visitors can book a{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}#another-place-day-membership-treatment`}
            className="underline"
          >
            Day Membership with Treatment
          </Link>{' '}
          from {dayMembershipTreatmentPrice || '£110'} per person, which
          includes full day pool access along with the outdoor hot tub,
          sauna, and a 60 minute treatment.
          <br />
          <br />
          Ullswater itself is also popular for open water swimming, with
          accessible entry points at Glenridding and Aira Force. For indoor
          pool alternatives, spas in nearby{' '}
          <Link
            href="/location/spas-in-penrith"
            className="underline"
          >
            Penrith
          </Link>{' '}
          are around 5 miles northeast.
        </>
      ),
      schemaText: `Yes. ${anotherPlace?.name || 'Another Place, The Lake'} at Watermillock on Ullswater has a 20 metre indoor swimming pool with floor to ceiling glass walls and lake views. The pool uses ultra violet filtered, low chlorine water and has a shallow area for children. Hotel guests have complimentary access from 7am to 9pm. Family swim runs 9am to 6pm, with adult only sessions 7am to 9am and 6pm to 9pm. Day visitors can book a Day Membership with Treatment from ${dayMembershipTreatmentPrice || '£110'} per person including full day pool access. Ullswater is also popular for open water swimming at Glenridding and Aira Force.`,
    },

    // FAQ 2: spa ullswater
    {
      question: 'Where can I book a spa day near Ullswater?',
      answer: (
        <>
          The only spa on the shores of Ullswater is the Swim Club at{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}`}
            className="underline"
          >
            {anotherPlace?.name || 'Another Place, The Lake'}
          </Link>
          , a contemporary lakeside hotel at Watermillock. Rather than a
          traditional thermal spa, the Swim Club is built around a 20 metre
          indoor pool with lake views, an outdoor Swedish style hot tub, and
          a sauna.
          <br />
          <br />
          Two{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}#day-passes`}
            className="underline"
          >
            day membership packages
          </Link>{' '}
          are available. The Day Membership with Treatment costs{' '}
          {dayMembershipTreatmentPrice || '£110'} per person and includes
          full day access to all facilities plus a 60 minute treatment. For{' '}
          {dayMembershipLunchPrice || '£120'} per person you can add a one
          course lunch. Both packages include the pool, hot tub, sauna, and
          cardio room from 7am to 9pm. Booking is required in advance as
          places are limited.
          <br />
          <br />
          If you are looking for a larger spa with extensive thermal
          facilities, the nearest options are in{' '}
          <Link
            href="/location/spas-in-penrith"
            className="underline"
          >
            Penrith
          </Link>{' '}
          (5 miles) and{' '}
          <Link
            href="/location/spas-in-borrowdale"
            className="underline"
          >
            Borrowdale
          </Link>{' '}
          (20 miles), both within easy reach of Ullswater.
        </>
      ),
      schemaText: `The only spa on Ullswater is the Swim Club at ${anotherPlace?.name || 'Another Place, The Lake'}, a contemporary lakeside hotel at Watermillock. It features a 20 metre indoor pool with lake views, an outdoor Swedish style hot tub, and a sauna. Two day membership packages are available: Day Membership with Treatment at ${dayMembershipTreatmentPrice || '£110'} per person (full day access plus 60 minute treatment) or ${dayMembershipLunchPrice || '£120'} with lunch added. Both include pool, hot tub, sauna, and cardio room from 7am to 9pm. Booking is required. For larger thermal spas, Penrith (5 miles) and Borrowdale (20 miles) have further options.`,
    },

    // FAQ 3: ullswater hotel spa
    {
      question: 'Does Ullswater have a spa hotel?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}`}
            className="underline"
          >
            {anotherPlace?.name || 'Another Place, The Lake'}
          </Link>{' '}
          is the spa hotel on Ullswater, occupying 18 acres of lakeside
          parkland at Watermillock. The hotel opened in 2017 in a restored
          Georgian building and takes a contemporary, outdoors focused
          approach. All hotel guests receive complimentary access to the Swim
          Club facilities throughout their stay, with no extra charge
          regardless of room type.
          <br />
          <br />
          The Swim Club includes a 20 metre pool, outdoor hot tub, sauna,
          and cardio room.{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}#treatments`}
            className="underline"
          >
            Spa treatments
          </Link>{' '}
          are available using {brandsText || 'land&water products'}, with
          the signature{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}#${fellWalkersId || 'treatments'}`}
            className="underline"
          >
            Fell Walkers Massage
          </Link>{' '}
          ({fellWalkersPrice || '£90'}) designed for tired legs after
          hiking. Couples can book{' '}
          side by side treatments ({sideBySidePrice || '£170'}) in the
          double treatment room.
          <br />
          <br />
          The hotel also has three restaurants, a private jetty on the lake,
          and an Ofsted registered Kids Zone for families. For alternative
          spa hotels in the northern Lakes, see our listings for{' '}
          <Link
            href="/location/spas-in-bassenthwaite"
            className="underline"
          >
            Bassenthwaite
          </Link>{' '}
          and{' '}
          <Link
            href="/location/spas-in-penrith"
            className="underline"
          >
            Penrith
          </Link>
          .
        </>
      ),
      schemaText: `Yes. ${anotherPlace?.name || 'Another Place, The Lake'} is the spa hotel on Ullswater, occupying 18 acres of lakeside parkland at Watermillock. Opened in 2017 in a restored Georgian building, all hotel guests receive complimentary Swim Club access including a 20 metre pool, outdoor hot tub, sauna, and cardio room. Treatments use ${brandsText || 'land&water products'}, with the signature Fell Walkers Massage (${fellWalkersPrice || '£90'}) for hikers and side by side couples treatments (${sideBySidePrice || '£170'}). The hotel has three restaurants, a private lakeside jetty, and an Ofsted registered Kids Zone. Alternative spa hotels are available in Bassenthwaite and Penrith.`,
    },

    // FAQ 4: ullswater hot tub
    {
      question: 'Is there an outdoor hot tub near Ullswater?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}`}
            className="underline"
          >
            {anotherPlace?.name || 'Another Place, The Lake'}
          </Link>{' '}
          has an outdoor Swedish style heated hot tub set within the
          hotel&apos;s grounds at Watermillock, overlooking the parkland
          towards the fells. The hot tub is available for guests aged 16 and
          over, with a 20 minute session limit when the spa is busy.
          <br />
          <br />
          Hotel guests can use the hot tub as part of their complimentary
          Swim Club access. Day visitors can book the{' '}
          <Link
            href={`/spa/${anotherPlace?.url || 'another-place-the-lake'}#another-place-day-membership-treatment`}
            className="underline"
          >
            Day Membership with Treatment
          </Link>{' '}
          from {dayMembershipTreatmentPrice || '£110'} per person, which
          includes the hot tub along with the 20 metre pool, sauna, cardio
          room, and a 60 minute treatment. Access runs from 7am to 9pm
          daily.
          <br />
          <br />
          The hot tub is outdoors, so it
          offers a different experience to the indoor pool. For spa
          facilities with outdoor hydrotherapy pools and larger thermal
          suites, see{' '}
          <Link
            href="/location/spas-in-bassenthwaite"
            className="underline"
          >
            Bassenthwaite
          </Link>{' '}
          and{' '}
          <Link
            href="/location/spas-in-borrowdale"
            className="underline"
          >
            Borrowdale
          </Link>
          , both within driving distance of Ullswater.
        </>
      ),
      schemaText: `Yes. ${anotherPlace?.name || 'Another Place, The Lake'} at Watermillock has an outdoor Swedish style heated hot tub overlooking the grounds towards the fells. It is available for guests aged 16 and over, with a 20 minute session limit when busy. Hotel guests use it as part of complimentary Swim Club access. Day visitors can book the Day Membership with Treatment from ${dayMembershipTreatmentPrice || '£110'} per person, including the hot tub, 20 metre pool, sauna, cardio room, and a 60 minute treatment. Access runs 7am to 9pm. For larger thermal suites with outdoor hydrotherapy pools, Bassenthwaite and Borrowdale are within driving distance.`,
    },
  ];
}
