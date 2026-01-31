import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getTreatmentBrandsText,
  getTreatmentIdByName,
  getAgePolicy,
} from './helpers';

export function getSpa2FAQs(spa: Spa): FAQ[] {
  // Day pass prices
  const sunriseWeekday = getDayPassPrice(spa.id, 'armathwaite-sunrise-weekday');
  const sunriseWeekend = getDayPassPrice(spa.id, 'armathwaite-sunrise-bank-holiday');
  const sunsetWeekday = getDayPassPrice(spa.id, 'armathwaite-sunset-weekday');
  const escapeWeekday = getDayPassPrice(spa.id, 'armathwaite-escape-weekday');
  const escapeWeekend = getDayPassPrice(spa.id, 'armathwaite-escape-weekend');
  const sereniTeaWeekday = getDayPassPrice(spa.id, 'armathwaite-sereni-tea-weekday');
  const sereniTeaWeekend = getDayPassPrice(spa.id, 'armathwaite-sereni-tea-weekend');
  const serenityWeekday = getDayPassPrice(spa.id, 'armathwaite-serenity-weekday');
  const serenityWeekend = getDayPassPrice(spa.id, 'armathwaite-serenity-weekend');
  const motherToBeWeekday = getDayPassPrice(spa.id, 'armathwaite-mother-to-be-weekday');

  // Treatment brands
  const brandsText = getTreatmentBrandsText(spa.id);

  // Treatment ID for linking
  const walkersRecoveryId = getTreatmentIdByName(spa.id, "Organic Walker's Recovery");

  // Age policy
  const agePolicy = getAgePolicy(spa);

  return [
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa days at {spa.name} range from {sunriseWeekday || '£70'} to {serenityWeekend || '£200'} per person depending on the package you choose. There are 12 different spa day options to suit various budgets and preferences.
          <br />
          <br />
          For the best value, the{' '}
          <Link href="#armathwaite-sunrise-weekday" className="text-stone-900 underline">
            Sunrise Spa
          </Link>{' '}
          ({sunriseWeekday || '£70'} weekdays, {sunriseWeekend || '£80'} weekends) offers morning spa access, or the{' '}
          <Link href="#armathwaite-sunset-weekday" className="text-stone-900 underline">
            Sunset Spa
          </Link>{' '}
          ({sunsetWeekday || '£70'} weekdays) provides evening access. Both include full use of spa facilities, robes, and towels.
          <br />
          <br />
          For a half day experience, the{' '}
          <Link href="#armathwaite-escape-weekday" className="text-stone-900 underline">
            Escape Half Day
          </Link>{' '}
          ({escapeWeekday || '£140'} to {escapeWeekend || '£150'}) includes a 55 minute treatment. The popular{' '}
          <Link href="#armathwaite-sereni-tea-weekday" className="text-stone-900 underline">
            Sereni Tea
          </Link>{' '}
          ({sereniTeaWeekday || '£160'} to {sereniTeaWeekend || '£170'}) combines spa access with afternoon tea. For the ultimate experience, the{' '}
          <Link href="#armathwaite-serenity-weekday" className="text-stone-900 underline">
            Serenity Full Day
          </Link>{' '}
          ({serenityWeekday || '£190'} to {serenityWeekend || '£200'}) includes a treatment plus lunch or afternoon tea. Specialist packages like the Mother To Be ({motherToBeWeekday || '£150'} weekdays) cater to specific needs.
          <br />
          <br />
          All packages include access to the indoor pool, outdoor infinity pools, outdoor hot tub, Finnish sauna, Amethyst Crystal Cave steam room, and relaxation areas. For full details, see the{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            spa day packages section
          </Link>
          .
        </>
      ),
      schemaText:
        `Spa days at ${spa.name} range from ${sunriseWeekday || '£70'} to ${serenityWeekend || '£200'} per person. The Sunrise Spa (${sunriseWeekday || '£70'} weekdays) and Sunset Spa (${sunsetWeekday || '£70'} weekdays) offer the best value for spa access only. The Escape Half Day (${escapeWeekday || '£140'}-${escapeWeekend || '£150'}) includes a 55 minute treatment. The Sereni Tea (${sereniTeaWeekday || '£160'}-${sereniTeaWeekend || '£170'}) combines spa with afternoon tea. The Serenity Full Day (${serenityWeekday || '£190'}-${serenityWeekend || '£200'}) includes treatment plus lunch or afternoon tea. All packages include access to indoor and outdoor pools, hot tub, sauna, and the Amethyst Crystal Cave steam room.`,
    },
    {
      question: `What makes the spa at ${spa.name} unique?`,
      answer: (
        <>
          {spa.name} stands out among Lake District spas for its exceptional outdoor facilities and exclusive treatments. The spa features multiple outdoor infinity pools with stunning views across the fells, plus an outdoor hot tub that guests consistently rate as a highlight in reviews.
          <br />
          <br />
          Inside, you&apos;ll find the Amethyst Crystal Cave, a distinctive steam room experience unique to Armathwaite Hall. The thermal facilities also include a Finnish sauna and a 16 metre indoor swimming pool. The{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            thermal facilities section
          </Link>{' '}
          has full details of all heat experiences available.
          <br />
          <br />
          For treatments, the spa offers an exclusive{' '}
          <Link href={walkersRecoveryId ? `#${walkersRecoveryId}` : '#treatments'} className="text-stone-900 underline">
            Organic Walker&apos;s Recovery
          </Link>{' '}
          massage only available at {spa.name}, specifically designed for guests exploring the Lake District fells. Treatments use{brandsText ? ` ${brandsText}` : ' Temple Spa, VOYA, and Made for Life'} products. The setting itself is remarkable: a lakeside position on the shores of Bassenthwaite Lake within a 400 acre private deer park. For treatment options, see the{' '}
          <Link href="#treatments" className="text-stone-900 underline">
            treatments section
          </Link>
          .
        </>
      ),
      schemaText:
        `${spa.name} stands out for its exceptional outdoor facilities and exclusive treatments. The spa features multiple outdoor infinity pools with fell views, plus an outdoor hot tub consistently praised in reviews. Inside, the Amethyst Crystal Cave steam room offers a unique experience, alongside a Finnish sauna and 16 metre indoor pool. The exclusive Organic Walker's Recovery massage is only available here, designed for Lake District fell walkers. Treatments use${brandsText ? ` ${brandsText}` : ' Temple Spa, VOYA, and Made for Life'} products. The setting is remarkable: lakeside on Bassenthwaite Lake within a 400 acre private deer park.`,
    },
    {
      question: `Can children use the spa at ${spa.name}?`,
      answer: (
        <>
          Spa day bookings at {spa.name} are for guests aged {agePolicy || '18 and over'} only. However, unlike many Lake District spas that are completely adults only, Armathwaite Hall offers a dedicated family swimming time each morning.
          <br />
          <br />
          Children under 16 can use the swimming pool facilities from 8:30am to 9:30am every day of the week, provided they are accompanied by an adult. This early morning window allows families staying at the hotel to enjoy the pool together before the spa opens for adult guests.
          <br />
          <br />
          Outside of the family swimming time, the spa and pool areas are reserved for guests {agePolicy || '18 and over'}. If you&apos;re visiting with children, the hotel&apos;s 400 acre grounds offer plenty to explore, including a deer park and wildlife. You could book spa treatments or a spa day during times when children are enjoying the estate or alternative activities. For full access details, see the{' '}
          <Link href="#access" className="text-stone-900 underline">
            spa access information
          </Link>
          . For other Lake District spas with different age policies, see our{' '}
          <Link href="/" className="text-stone-900 underline">
            homepage
          </Link>
          .
        </>
      ),
      schemaText:
        `Spa day bookings at ${spa.name} are for guests aged ${agePolicy || '18 and over'} only. However, children under 16 can use the swimming pool from 8:30am to 9:30am every day when accompanied by an adult. This early morning family window is unique among Lake District spas. Outside this time, the spa and pool are reserved for adult guests. The hotel's 400 acre grounds offer plenty for children including a deer park and wildlife.`,
    },
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          Yes, hotel guests at {spa.name} receive complimentary access to the spa facilities as part of their stay. This includes use of the 16 metre indoor swimming pool, outdoor infinity pools, outdoor hot tub, Finnish sauna, Amethyst Crystal Cave steam room, and relaxation areas.
          <br />
          <br />
          Spa treatments are not included in your room rate and must be booked separately. Popular treatments include massages, facials, and body therapies using{brandsText ? ` ${brandsText}` : ' Temple Spa, VOYA, and Made for Life'} products. The exclusive{' '}
          <Link href={walkersRecoveryId ? `#${walkersRecoveryId}` : '#treatments'} className="text-stone-900 underline">
            Organic Walker&apos;s Recovery
          </Link>{' '}
          treatment is particularly popular with guests who have been exploring the fells.
          <br />
          <br />
          If you&apos;re not staying at the hotel, you can visit as a day guest by booking one of the{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            spa day packages
          </Link>{' '}
          starting from {sunriseWeekday || '£70'}. All spa access, whether for hotel guests or day visitors, must be pre booked due to limited capacity. The spa operates an {agePolicy || '18 and over'} policy for bookings. For full details, see the{' '}
          <Link href="#access" className="text-stone-900 underline">
            access information section
          </Link>
          .
        </>
      ),
      schemaText:
        `Yes, hotel guests at ${spa.name} receive complimentary access to spa facilities including the indoor pool, outdoor infinity pools, outdoor hot tub, Finnish sauna, Amethyst Crystal Cave steam room, and relaxation areas. Spa treatments are not included and must be booked separately. Day visitors can book spa packages starting from ${sunriseWeekday || '£70'}. All spa access must be pre booked due to limited capacity. The spa operates an ${agePolicy || '18 and over'} policy for bookings.`,
    },
    {
      question: `Can I combine afternoon tea with a spa day at ${spa.name}?`,
      answer: (
        <>
          Yes, the{' '}
          <Link href="#armathwaite-sereni-tea-weekday" className="text-stone-900 underline">
            Sereni Tea spa day
          </Link>{' '}
          ({sereniTeaWeekday || '£160'} weekdays, {sereniTeaWeekend || '£170'} weekends) is specifically designed to combine spa relaxation with a traditional afternoon tea experience. This popular package is ideal for celebrations, birthdays, and special occasions.
          <br />
          <br />
          The Sereni Tea package includes full access to all spa facilities: the 16 metre indoor pool, outdoor infinity pools with fell views, outdoor hot tub, Finnish sauna, Amethyst Crystal Cave steam room, and relaxation areas. You&apos;ll also receive robes and towels. After enjoying the spa, you&apos;ll sit down for afternoon tea featuring a selection of sandwiches, scones with clotted cream and jam, and sweet treats.
          <br />
          <br />
          If you prefer to include a spa treatment as well as afternoon tea, the{' '}
          <Link href="#armathwaite-serenity-weekday" className="text-stone-900 underline">
            Serenity Full Day
          </Link>{' '}
          ({serenityWeekday || '£190'} to {serenityWeekend || '£200'}) includes a 55 minute treatment plus your choice of lunch or afternoon tea. Both packages are popular for special occasions and should be booked in advance, especially for weekend dates. See all{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            spa day packages
          </Link>{' '}
          for the full range of options.
        </>
      ),
      schemaText:
        `Yes, the Sereni Tea spa day (${sereniTeaWeekday || '£160'} weekdays, ${sereniTeaWeekend || '£170'} weekends) combines spa relaxation with afternoon tea. The package includes full spa access (indoor pool, outdoor pools, hot tub, sauna, Amethyst Crystal Cave), robes and towels, plus afternoon tea with sandwiches, scones, and sweet treats. For spa treatment plus afternoon tea, the Serenity Full Day (${serenityWeekday || '£190'}-${serenityWeekend || '£200'}) includes a 55 minute treatment. Both packages are popular for celebrations and should be booked in advance.`,
    },
  ];
}

