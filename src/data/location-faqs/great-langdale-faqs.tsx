import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
  getTreatmentPrice,
  getTreatmentIdByName,
  getAgePolicy,
} from '@/data/faqs/helpers';
import { getLocationTreatmentCount } from './helpers';

export function getGreatLangdaleFAQs(spas: Spa[]): FAQ[] {
  const brimstone = spas.find((s) => s.id === 3);

  // Dynamic values
  const thermalCount = brimstone
    ? getThermalFacilitiesCount(brimstone)
    : null;
  const brandsText = brimstone
    ? getTreatmentBrandsText(brimstone.id, 3)
    : null;
  const treatmentCount = getLocationTreatmentCount(spas);
  const agePolicy = brimstone ? getAgePolicy(brimstone) : null;
  const fellwalkerPrice = getTreatmentPrice(3, 'Fellwalker');
  const fellwalkerId = getTreatmentIdByName(3, 'Fellwalker');
  const celebrationPrice = getTreatmentPrice(3, 'Celebration of Life');
  const celebrationId = getTreatmentIdByName(3, 'Celebration of Life');

  return [
    // FAQ 1: langdale spa (5,000/mo, Medium/38)
    {
      question: 'What spa is in the Langdale valley?',
      answer: (
        <>
          Great Langdale has one spa,{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}`}
            className="underline"
          >
            {brimstone?.name || 'Brimstone Spa'}
          </Link>
          , located on the 35 acre Langdale Estate beneath the Langdale Pikes.
          It is the only spa facility in the valley, with a Scandinavian
          inspired design that draws on the surrounding mountain landscape.
          <br />
          <br />
          The spa features a 9 metre swim through pool connecting indoor and
          outdoor spaces, with{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}#thermal-facilities`}
            className="underline"
          >
            {thermalCount || 5} thermal experiences
          </Link>{' '}
          including a Finnish sauna, laconium, aroma steam room, ice room, and
          experience showers. An outdoor terrace with a log fire overlooks the
          fells between sessions. The{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}#treatments`}
            className="underline"
          >
            treatment menu
          </Link>{' '}
          includes {treatmentCount || 27} therapies using{' '}
          {brandsText || 'Pure Alchemy, Skeyndor, and Spa Senses products'}.
          <br />
          <br />
          Brimstone Spa is exclusive to Langdale Estate guests, so there is no
          day visitor access. For nearby alternatives with day spa options,{' '}
          <Link href="/location/spas-in-ambleside" className="underline">
            Ambleside
          </Link>{' '}
          is 5 miles east and{' '}
          <Link href="/location/spas-in-grasmere" className="underline">
            Grasmere
          </Link>{' '}
          is 7 miles northeast.
        </>
      ),
      schemaText: `Great Langdale has one spa, ${brimstone?.name || 'Brimstone Spa'}, located on the 35 acre Langdale Estate beneath the Langdale Pikes. The spa features a 9 metre swim through pool connecting indoor and outdoor spaces, with ${thermalCount || 5} thermal experiences including a Finnish sauna, laconium, aroma steam room, ice room, and experience showers. An outdoor terrace with a log fire overlooks the fells. The treatment menu includes ${treatmentCount || 27} therapies using ${brandsText || 'Pure Alchemy, Skeyndor, and Spa Senses products'}. Brimstone Spa is exclusive to Langdale Estate guests with no day visitor access. Ambleside is 5 miles east and Grasmere 7 miles northeast for nearby alternatives with day spa options.`,
    },

    // FAQ 2: langdale estate spa (500/mo, Medium/36)
    {
      question: 'What is the Langdale Estate spa?',
      answer: (
        <>
          The Langdale Estate spa is{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}`}
            className="underline"
          >
            {brimstone?.name || 'Brimstone Spa'}
          </Link>
          , set within a 35 acre estate in the heart of Great Langdale. The
          grounds were originally a Victorian gunpowder works, and traces of
          that industrial past remain in the millstones, waterwheel, and old
          cannon scattered among woodland and waterways.
          <br />
          <br />
          The spa itself has a contemporary Scandinavian inspired design, with
          burnished metallic tiles against reclaimed brick and long windows
          framing fell views. Its centrepiece is a 9 metre pool that guests swim
          through from the indoor space to the outdoor terrace, where a log fire
          and mountain views set the scene. The{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}#thermal-facilities`}
            className="underline"
          >
            thermal suite
          </Link>{' '}
          follows a guided sequence through {thermalCount || 5} experiences,
          from the Finnish sauna through to the ice room.
          <br />
          <br />
          Access is complimentary for all estate guests, whether staying at the
          Brimstone Hotel, the Langdale Hotel, or the self catering lodges. The
          spa is{' '}
          {agePolicy || '18'}+ only, maintaining a quiet atmosphere throughout.
        </>
      ),
      schemaText: `The Langdale Estate spa is ${brimstone?.name || 'Brimstone Spa'}, set within a 35 acre estate in Great Langdale. The grounds were originally a Victorian gunpowder works, with traces of industrial history in the millstones, waterwheel, and old cannon among woodland and waterways. The spa has a Scandinavian inspired design with burnished metallic tiles, reclaimed brick, and long windows framing fell views. Its centrepiece is a 9 metre swim through pool connecting indoor and outdoor spaces. The thermal suite follows a guided sequence through ${thermalCount || 5} experiences. Access is complimentary for all estate guests staying at the Brimstone Hotel, Langdale Hotel, or self catering lodges. The spa is ${agePolicy || '18'}+ only.`,
    },

    // FAQ 3: langdale spa reviews (500/mo, Low/31)
    {
      question: 'What do reviews say about spa visits in Langdale?',
      answer: (
        <>
          Guests at{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}`}
            className="underline"
          >
            {brimstone?.name || 'Brimstone Spa'}
          </Link>{' '}
          consistently highlight the 9 metre swim through pool as the standout
          feature, particularly the experience of moving from inside to the
          outdoor terrace with views across to the Langdale Pikes. The thermal
          suite is praised for its variety of heat experiences and the guided
          sequence that takes guests through each one.
          <br />
          <br />
          Reviewers frequently mention the peaceful atmosphere as a benefit of
          the hotel guests only policy, noting that the spa never feels
          overcrowded. The{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}#${fellwalkerId || 'fellwalker'}`}
            className="underline"
          >
            Fellwalker treatment
          </Link>{' '}
          at {fellwalkerPrice || '£125'} is a popular choice, designed
          specifically for tired muscles after a day on the fells. The{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}#${celebrationId || 'celebration-of-life-ritual'}`}
            className="underline"
          >
            Celebration of Life Ritual
          </Link>{' '}
          at {celebrationPrice || '£200'} is also well regarded for its 90
          minute duration and use of Pure Alchemy products.
          <br />
          <br />
          The combination of walking and spa is a recurring theme, with guests
          appreciating the bootroom for borrowing quality outdoor gear before
          heading onto the fells.
        </>
      ),
      schemaText: `Guests at ${brimstone?.name || 'Brimstone Spa'} consistently highlight the 9 metre swim through pool as the standout feature, particularly swimming from inside to the outdoor terrace with Langdale Pikes views. The thermal suite is praised for its variety and guided sequence. Reviewers mention the peaceful atmosphere from the hotel guests only policy. The Fellwalker treatment at ${fellwalkerPrice || '£125'} is popular with walkers, designed for tired muscles after a day on the fells. The Celebration of Life Ritual at ${celebrationPrice || '£200'} is well regarded for its 90 minute duration using Pure Alchemy products. The combination of walking and spa is a recurring theme, with guests appreciating the bootroom for borrowing outdoor gear.`,
    },

    // FAQ 4: brimstone hotel & spa great langdale ambleside (500/mo, Low/7)
    {
      question: 'Where is Brimstone Hotel and Spa in Great Langdale?',
      answer: (
        <>
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}`}
            className="underline"
          >
            {brimstone?.name || 'Brimstone Spa'}
          </Link>{' '}
          is on the Langdale Estate in Great Langdale, approximately 5 miles
          west of{' '}
          <Link href="/location/spas-in-ambleside" className="underline">
            Ambleside
          </Link>
          . The address is Great Langdale, Cumbria, LA22 9NX. From Ambleside,
          follow the B5343 along the valley floor with the Langdale Pikes
          visible ahead.
          <br />
          <br />
          The estate sits at the western end of the valley, surrounded by some
          of the Lake District&apos;s most dramatic fell walking country. Chapel
          Stile village is a short walk away, and the Stickle Ghyll path to
          Stickle Tarn starts nearby. From{' '}
          <Link href="/location/spas-in-windermere" className="underline">
            Windermere
          </Link>{' '}
          the drive takes around 30 minutes via Ambleside, while{' '}
          <Link href="/location/spas-in-grasmere" className="underline">
            Grasmere
          </Link>{' '}
          is roughly 7 miles northeast over Red Bank or via the A591.
          <br />
          <br />
          The Langdale Estate includes the Brimstone Hotel, Langdale Hotel, and
          self catering lodges. All estate guests receive complimentary access to{' '}
          <Link
            href={`/spa/${brimstone?.url || 'brimstone-hotel-spa'}#thermal-facilities`}
            className="underline"
          >
            the spa&apos;s {thermalCount || 5} thermal experiences
          </Link>{' '}
          and swim through pool throughout their stay.
        </>
      ),
      schemaText: `${brimstone?.name || 'Brimstone Spa'} is on the Langdale Estate in Great Langdale, approximately 5 miles west of Ambleside. The address is Great Langdale, Cumbria, LA22 9NX. From Ambleside, follow the B5343 along the valley floor. The estate sits at the western end of the valley surrounded by dramatic fell walking country. Chapel Stile village is nearby, and the Stickle Ghyll path starts close by. From Windermere the drive takes around 30 minutes via Ambleside. Grasmere is roughly 7 miles northeast. The Langdale Estate includes the Brimstone Hotel, Langdale Hotel, and self catering lodges, with all guests receiving complimentary spa access throughout their stay.`,
    },
  ];
}
