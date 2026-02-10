import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
  getAgePolicy,
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentDuration,
} from './helpers';

export function getSpa13FAQs(spa: Spa): FAQ[] {
  // Dynamic values
  const thermalCount = getThermalFacilitiesCount(spa);
  const brandsText = getTreatmentBrandsText(spa.id);
  const agePolicy = getAgePolicy(spa);

  // Day pass prices
  const afternoonTeaPrice = getDayPassPrice(spa.id, 'whitewater-luxurious-spa-afternoon-tea');
  const purePamperingPrice = getDayPassPrice(spa.id, 'whitewater-pure-pampering');
  const weekdayEscapePrice = getDayPassPrice(spa.id, 'whitewater-weekday-escape');
  const couplesRetreatPrice = getDayPassPrice(spa.id, 'whitewater-couples-retreat');

  // Day pass durations
  const spaDuration = getDayPassDuration(spa.id, 'whitewater-luxurious-spa-afternoon-tea');

  // Treatment durations
  const treatment30Min = getTreatmentDuration(spa.id, '30 minute');
  const rasulDuration = getTreatmentDuration(spa.id, 'Rasul');

  return [
    // FAQ 1: Spa day pricing
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          <Link href="#day-passes" className="underline">
            Spa day packages
          </Link>{' '}
          at {spa.name} start from {afternoonTeaPrice || '£60'} per person, with every package including a spa treatment, afternoon tea, and {spaDuration || '4 hours'} of full spa facilities access. All packages are for adults aged {agePolicy || '18 and over'} only.
          <br />
          <br />
          The{' '}
          <Link href="#whitewater-luxurious-spa-afternoon-tea" className="underline">
            Luxurious Spa With Afternoon Tea
          </Link>{' '}
          ({afternoonTeaPrice || '£60'}) includes a {treatment30Min || '30 minute'} treatment of your choice plus afternoon tea. The{' '}
          <Link href="#whitewater-pure-pampering" className="underline">
            Pure Pampering
          </Link>{' '}
          package ({purePamperingPrice || '£90'}) upgrades to a full body Elemis massage with afternoon tea. For midweek visitors, the{' '}
          <Link href="#whitewater-weekday-escape" className="underline">
            Weekday Escape
          </Link>{' '}
          ({weekdayEscapePrice || '£90'}, Monday to Friday) offers two {treatment30Min || '30 minute'} treatments plus afternoon tea or light lunch.
          <br />
          <br />
          For couples, the{' '}
          <Link href="#whitewater-couples-retreat" className="underline">
            Couples Retreat
          </Link>{' '}
          ({couplesRetreatPrice || '£110'} per person) includes a luxury Rasul Mud Temple experience, back massages, and afternoon tea. Every package includes use of the heated indoor pool, outdoor jacuzzi, Turkish Hamam steam room, and sauna. For the full list of packages, see the{' '}
          <Link href="#day-passes" className="underline">
            day passes section
          </Link>
          .
        </>
      ),
      schemaText: `Spa day packages at ${spa.name} start from ${afternoonTeaPrice || '£60'} per person. Every package includes a spa treatment, afternoon tea, and ${spaDuration || '4 hours'} of full spa facilities access. The Luxurious Spa With Afternoon Tea (${afternoonTeaPrice || '£60'}) includes a ${treatment30Min || '30 minute'} treatment plus afternoon tea. Pure Pampering (${purePamperingPrice || '£90'}) upgrades to a full body Elemis massage. The Weekday Escape (${weekdayEscapePrice || '£90'}, Mon-Fri) offers two treatments plus afternoon tea or light lunch. The Couples Retreat (${couplesRetreatPrice || '£110'} per person) includes a Rasul Mud Temple experience, back massages, and afternoon tea. All packages include heated indoor pool, outdoor jacuzzi, Turkish Hamam steam room, and sauna.`,
    },

    // FAQ 2: Rasul Mud Temple
    {
      question: `What is the Rasul Mud Temple at ${spa.name}?`,
      answer: (
        <>
          The Rasul Mud Temple at {spa.name} is an Arabian inspired steam room experience and the first of its kind in the Lake District. It uses mineral rich muds applied to different areas of the body, combined with therapeutic steam, to deeply cleanse and revitalise the skin. The treatment takes {rasulDuration || '45 minutes'} and is a genuinely unique wellness experience.
          <br />
          <br />
          During the session, several types of mud specific to different parts of the body are applied to the skin. You then enter the Rasul steam room where the muds work together with the steaming heat to draw out impurities and nourish the skin. The experience finishes with a refreshing shower. Guests often describe feeling completely revitalised afterwards, with noticeably softer and cleaner skin.
          <br />
          <br />
          The Rasul Mud Temple is available as a standalone treatment or as part of the{' '}
          <Link href="#whitewater-couples-retreat" className="underline">
            Couples Retreat
          </Link>{' '}
          day pass package. For standalone bookings, you can find it in the{' '}
          <Link href="#treatments" className="underline">
            treatments section
          </Link>
          .
        </>
      ),
      schemaText: `The Rasul Mud Temple at ${spa.name} is an Arabian inspired steam room experience and the first of its kind in the Lake District. It uses mineral rich muds applied to different areas of the body, combined with therapeutic steam, to deeply cleanse and revitalise the skin. The treatment takes ${rasulDuration || '45 minutes'}. Several types of mud specific to different parts of the body are applied, then you enter the Rasul steam room where the muds work with the steaming heat to draw out impurities. The experience finishes with a refreshing shower. The Rasul is available as a standalone treatment or as part of the Couples Retreat day pass package.`,
    },

    // FAQ 3: Spa access included
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          Yes, complimentary access to the Cascades spa facilities is included for all hotel guests at {spa.name}, regardless of room type. This means you can use the heated indoor swimming pool, outdoor jacuzzi overlooking River Leven, traditional sauna, Turkish Hamam aromatherapy steam room, and multi sensory feature shower at no extra cost during your stay.
          <br />
          <br />
          Hotel guests also receive a 10% discount on all{' '}
          <Link href="#treatments" className="underline">
            spa treatments
          </Link>
          , which use {brandsText || 'Elemis products'}. Robes and towels are provided when you arrive at the spa. There is no need to pre book your spa access as a hotel guest, though treatments should be booked in advance to secure your preferred time.
          <br />
          <br />
          If you&apos;re not staying at the hotel, day pass packages are also available starting from {afternoonTeaPrice || '£60'} per person. For full details, see the{' '}
          <Link href="#access" className="underline">
            spa access information
          </Link>{' '}
          and{' '}
          <Link href="#day-passes" className="underline">
            day passes
          </Link>{' '}
          sections.
        </>
      ),
      schemaText: `Yes, complimentary access to the Cascades spa facilities is included for all hotel guests at ${spa.name}, regardless of room type. This includes the heated indoor swimming pool, outdoor jacuzzi overlooking River Leven, traditional sauna, Turkish Hamam aromatherapy steam room, and multi sensory feature shower. Hotel guests also receive a 10% discount on all spa treatments. Robes and towels are provided. Day pass packages are available for non-guests starting from ${afternoonTeaPrice || '£60'} per person.`,
    },

    // FAQ 4: Children policy
    {
      question: `Can children use the spa at ${spa.name}?`,
      answer: (
        <>
          No, the Cascades spa facilities at {spa.name} are for adults aged {agePolicy || '18 and over'} only. This applies to all spa areas including the swimming pool, outdoor jacuzzi, sauna, Turkish Hamam steam room, and feature shower. The age restriction is in place to maintain a peaceful, relaxing environment for all spa guests.
          <br />
          <br />
          Families are welcome to stay at the hotel and enjoy its other amenities. The hotel&apos;s riverside location in Backbarrow offers easy access to family friendly activities in the area. Fell Foot Park on Lake Windermere is a short drive away, the Lakeside and Haverthwaite steam railway runs nearby, and the market town of Ulverston is around 15 minutes by car. There are also plenty of scenic walking trails directly from the hotel along River Leven.
          <br />
          <br />
          For more details on spa policies, see the{' '}
          <Link href="#access" className="underline">
            spa access information
          </Link>
          . To browse other Lake District spas with different age policies, visit our{' '}
          <Link href="/" className="underline">
            homepage
          </Link>
          .
        </>
      ),
      schemaText: `No, the Cascades spa facilities at ${spa.name} are for adults aged ${agePolicy || '18 and over'} only. This applies to all spa areas including the swimming pool, outdoor jacuzzi, sauna, Turkish Hamam steam room, and feature shower. The age restriction maintains a peaceful, relaxing environment. Families are welcome to stay at the hotel. Nearby family friendly activities include Fell Foot Park on Lake Windermere, the Lakeside and Haverthwaite steam railway, and scenic walking trails along River Leven.`,
    },

    // FAQ 5: Thermal facilities
    {
      question: `What thermal facilities does ${spa.name} have?`,
      answer: (
        <>
          The Cascades spa at {spa.name} has {thermalCount || 4} thermal facilities alongside the heated indoor pool and outdoor jacuzzi. The thermal circuit includes a traditional sauna, a Turkish Hamam aromatherapy steam room (an aromatic alternative to a standard steam room), and a multi sensory feature shower. The spa also has the Rasul Mud Temple, an Arabian steam room experience available at additional cost and the first of its kind in the Lake District.
          <br />
          <br />
          The outdoor jacuzzi overlooks River Leven and is a highlight for many guests, offering a peaceful setting to relax with views of the riverside and surrounding woodland. The heated indoor swimming pool is a generous size and stays warm throughout the year. All spa facilities are for adults aged {agePolicy || '18 and over'} only, and robes and towels are provided.
          <br />
          <br />
          For hotel guests, access to all facilities (except the Rasul Mud Temple) is complimentary. To learn more about the Rasul experience, see{' '}
          <Link href="#faq-2" className="underline">
            the Rasul Mud Temple FAQ above
          </Link>
          . For the full facility details, visit the{' '}
          <Link href="#thermal" className="underline">
            thermal facilities section
          </Link>
          .
        </>
      ),
      schemaText: `The Cascades spa at ${spa.name} has ${thermalCount || 4} thermal facilities alongside the heated indoor pool and outdoor jacuzzi. The thermal circuit includes a traditional sauna, a Turkish Hamam aromatherapy steam room, and a multi sensory feature shower. The Rasul Mud Temple (additional cost) is an Arabian steam room experience and the first of its kind in the Lake District. The outdoor jacuzzi overlooks River Leven. All facilities are for adults aged ${agePolicy || '18 and over'} only. Robes and towels are provided. Hotel guests receive complimentary access to all facilities except the Rasul Mud Temple.`,
    },
  ];
}


