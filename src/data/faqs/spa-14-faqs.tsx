import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getTreatmentBrandsText,
  getDayPassPrice,
  getTreatmentDuration,
  getTreatmentPrice,
  getTreatmentIdByName,
} from './helpers';

export function getSpa14FAQs(spa: Spa): FAQ[] {
  // Day pass prices
  const dayMembershipTreatmentPrice = getDayPassPrice(spa.id, 'another-place-day-membership-treatment');
  const dayMembershipLunchPrice = getDayPassPrice(spa.id, 'another-place-day-membership-lunch');
  
  // Treatment prices
  const fellWalkersPrice = getTreatmentPrice(spa.id, 'Fell Walkers Massage');
  const fullBodyMassagePrice = getTreatmentPrice(spa.id, 'Full Body Massage');
  const drenchFacialPrice = getTreatmentPrice(spa.id, 'land&water drench facial');
  const worksPrice = getTreatmentPrice(spa.id, 'The Works');
  const sideBySidePrice = getTreatmentPrice(spa.id, 'Side by Side');
  
  // Treatment IDs for linking
  const fellWalkersId = getTreatmentIdByName(spa.id, 'Fell Walkers Massage');
  const fullBodyMassageId = getTreatmentIdByName(spa.id, 'Full Body Massage');
  const drenchFacialId = getTreatmentIdByName(spa.id, 'land&water drench facial');
  const worksId = getTreatmentIdByName(spa.id, 'The Works');
  const sideBySideId = getTreatmentIdByName(spa.id, 'Side by Side');
  
  // Treatment durations
  const treatment60Min = getTreatmentDuration(spa.id, '60 minute');
  const treatment120Min = getTreatmentDuration(spa.id, '120 minute');
  
  // Brands text
  const brandsText = getTreatmentBrandsText(spa.id);

  return [
    {
      question: `What is the Swim Club at ${spa.name}?`,
      answer: (
        <>
          The Swim Club is {spa.name}&apos;s take on a spa, designed around active relaxation rather than traditional thermal experiences. At its heart is a stunning 20 metre indoor pool with floor-to-ceiling glass walls and views across Ullswater to the fells beyond. The pool uses ultra violet filtered, low chlorine water and includes a shallow area for children.
          <br />
          <br />
          Beyond the pool, the Swim Club includes an outdoor Swedish style hot tub overlooking the grounds, a sauna with lake views, treatment rooms offering massages and facials, and a cardio room with running machines. The hot tub and sauna are for guests aged 16 and over only. While it lacks the extensive thermal suite found at destination spas, the Swim Club offers a more casual, activity focused approach that complements the hotel&apos;s outdoor lifestyle positioning.
          <br />
          <br />
          For details on what&apos;s included, see the{' '}
          <Link href="#thermal" className="underline">
            pool and facilities section
          </Link>
          .
        </>
      ),
      schemaText: `The Swim Club is ${spa.name}'s take on a spa, designed around active relaxation. It features a stunning 20 metre indoor pool with floor-to-ceiling glass walls and views across Ullswater, an outdoor Swedish style hot tub, a sauna, treatment rooms, and a cardio room. The hot tub and sauna are for guests aged 16 and over only. Rather than a traditional thermal spa, it offers a casual, activity focused approach to wellness.`,
    },
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Day membership at {spa.name} Swim Club starts from {dayMembershipTreatmentPrice || '£110'} per person with the{' '}
          <Link href="#another-place-day-membership-treatment" className="underline">
            Day Membership with Treatment
          </Link>
          . This includes full day access to the 20 metre lake view pool, outdoor hot tub, sauna, and cardio room, plus a {treatment60Min || '60 minute'} treatment of your choice. For {dayMembershipLunchPrice || '£120'} per person, you can add a one course lunch in the hotel restaurant with the{' '}
          <Link href="#another-place-day-membership-lunch" className="underline">
            Day Membership with Treatment & Lunch
          </Link>
          .
          <br />
          <br />
          If you&apos;re looking for a shorter experience, the Evening Swim Club package offers access from 6pm with a three course dinner in Rampsbeck Restaurant for £55 to £60 per person (available Sunday to Thursday outside school holidays). Day membership is subject to availability and booking is required in advance.
          <br />
          <br />
          For locals, {spa.name} also offers limited 6 and 12 month memberships giving ongoing access to the pool, hot tub, sauna, and cardio room. View all{' '}
          <Link href="#day-passes" className="underline">
            day pass options
          </Link>{' '}
          or{' '}
          <Link href="#book" className="underline">
            book directly
          </Link>
          .
        </>
      ),
      schemaText: `Day membership at ${spa.name} Swim Club costs ${dayMembershipTreatmentPrice || '£110'} per person including full day access and a ${treatment60Min || '60 minute'} treatment, or ${dayMembershipLunchPrice || '£120'} with a one course lunch. Evening packages from £55-60 include dinner (Sunday to Thursday). Day membership includes the 20 metre lake view pool, outdoor hot tub, sauna, and cardio room. Booking is required in advance. Local memberships are also available on 6 and 12 month terms.`,
    },
    {
      question: `Is Swim Club access included with my room at ${spa.name}?`,
      answer: (
        <>
          Yes, Swim Club access is complimentary for all hotel guests at {spa.name}, regardless of which room type you book. This includes the 20 metre lake view swimming pool, outdoor hot tub, sauna, and cardio room. There is no extra charge and no time limit on your access during opening hours (7am to 9pm daily).
          <br />
          <br />
          This makes {spa.name} different from some Lake District spa hotels where spa access costs extra or is only included for premium room bookings. You can even use the Swim Club facilities before your room is ready (check in is at 3pm) and after check out (11am), making the most of your visit.
          <br />
          <br />
          Only spa treatments require separate booking and payment. The hot tub and sauna are restricted to guests aged 16 and over. For full details, see the{' '}
          <Link href="#access" className="underline">
            access information section
          </Link>
          .
        </>
      ),
      schemaText: `Yes, Swim Club access is complimentary for all hotel guests at ${spa.name}, regardless of room type. This includes the 20 metre pool, outdoor hot tub, sauna, and cardio room with no extra charge and no time limit during opening hours (7am to 9pm). You can use facilities before check in and after check out. Only spa treatments require separate booking and payment. Hot tub and sauna are restricted to guests aged 16 and over.`,
    },
    {
      question: `Can children use the Swim Club facilities at ${spa.name}?`,
      answer: (
        <>
          Yes, children are welcome in the Swim Club pool at {spa.name} during family swim times from 9am to 6pm daily. The 20 metre pool has a shallow area specifically designed for younger swimmers. However, the outdoor hot tub and sauna are restricted to guests aged 16 and over at all times for safety reasons.
          <br />
          <br />
          For couples or adults seeking a quieter experience, dedicated adult only swim times run from 7am to 9am and 6pm to 9pm. These early morning and evening slots offer a more tranquil atmosphere without children in the pool area.
          <br />
          <br />
          {spa.name} also offers a separate Ofsted registered Kids Zone with supervised sessions, arts and crafts, campfire cooking, and outdoor activities, giving parents time to enjoy the spa while children are entertained. For adults only spa alternatives in the Lake District, browse our{' '}
          <Link href="/" className="underline">
            full spa directory
          </Link>
          .
        </>
      ),
      schemaText: `Yes, children are welcome in the Swim Club pool at ${spa.name} during family swim times from 9am to 6pm. The pool has a shallow area for younger swimmers. However, the hot tub and sauna are restricted to guests aged 16 and over. Adult only swim times run from 7am to 9am and 6pm to 9pm for a quieter experience. A separate Ofsted registered Kids Zone offers supervised activities for children.`,
    },
    {
      question: `What treatments are available at ${spa.name}?`,
      answer: (
        <>
          {spa.name} Swim Club offers 18 spa treatments using{brandsText ? ` ${brandsText}` : ' land&water products'}, a brand developed with their sister hotel Watergate Bay in Cornwall. The signature treatment is the{' '}
          <Link href={fellWalkersId ? `#${fellWalkersId}` : '#treatments'} className="underline">
            Fell Walkers Massage
          </Link>
          {' '}({fellWalkersPrice || '£90'}, {treatment60Min || '60 minutes'}), designed specifically for tired legs after a day hiking in the Lake District fells. It includes a foot soak and scrub, legs wrapped in heated towels, leg and foot massage, and neck and scalp massage.
          <br />
          <br />
          Other popular options include{' '}
          <Link href={fullBodyMassageId ? `#${fullBodyMassageId}` : '#treatments'} className="underline">
            full body massage
          </Link>
          {' '}({fullBodyMassagePrice || '£90'}), the{' '}
          <Link href={drenchFacialId ? `#${drenchFacialId}` : '#treatments'} className="underline">
            land&water drench facial
          </Link>
          {' '}({drenchFacialPrice || '£90'}), and{' '}
          <Link href={worksId ? `#${worksId}` : '#treatments'} className="underline">
            The Works
          </Link>
          {' '}({worksPrice || '£160'}, {treatment120Min || '120 minutes'}) which combines body brush, salt scrub, wrap, mini facial, and full body massage for the ultimate experience. Pregnancy safe treatments are available including adapted massage and facial options.
          <br />
          <br />
          For couples,{' '}
          <Link href={sideBySideId ? `#${sideBySideId}` : '#treatments'} className="underline">
            side by side massage or facial treatments
          </Link>
          {' '}({sideBySidePrice || '£170'}) are available in the double treatment room. Most treatments can be booked online, though The Works and 30 minute treatments require booking through guest services directly. See all{' '}
          <Link href="#treatments" className="underline">
            treatment options
          </Link>
          .
        </>
      ),
      schemaText: `${spa.name} Swim Club offers 18 spa treatments using${brandsText ? ` ${brandsText}` : ' land&water products'}. The signature Fell Walkers Massage (${fellWalkersPrice || '£90'}, ${treatment60Min || '60 minutes'}) is designed for tired legs after hiking, including foot soak, heated towel leg wrap, and massage. Other options include full body massage (${fullBodyMassagePrice || '£90'}), land&water drench facial (${drenchFacialPrice || '£90'}), and The Works (${worksPrice || '£160'}, ${treatment120Min || '120 minutes'}). Pregnancy safe treatments and side by side couples treatments (${sideBySidePrice || '£170'}) are available. Most treatments can be booked online.`,
    },
  ];
}

