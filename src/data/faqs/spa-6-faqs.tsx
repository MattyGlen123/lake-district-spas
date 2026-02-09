import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
  getTreatmentIdByName,
  getDayPassPrice,
} from './helpers';

export function getSpa6FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values
  const thermalCount = getThermalFacilitiesCount(spa);
  const brandsText = getTreatmentBrandsText(spa.id);
  const ishgaExpressFacialId = getTreatmentIdByName(spa.id, 'ishga Express Facial');
  const macdonaldSignatureId = getTreatmentIdByName(spa.id, 'Macdonald Signature Treatment');
  
  // Day pass prices
  const timeForMePrice = getDayPassPrice(spa.id, 'old-england-time-for-me-weekend');
  const morningRetreatPrice = getDayPassPrice(spa.id, 'old-england-morning-retreat-weekend');
  const afternoonEscapePrice = getDayPassPrice(spa.id, 'old-england-afternoon-escape-weekend');
  
  // Calculate price range (min and max)
  const minPrice = timeForMePrice || '£70';
  const maxPrice = morningRetreatPrice || afternoonEscapePrice || '£109';

  return [
    {
      question: `What facilities does the spa at ${spa.name} have?`,
      answer: (
        <>
          The spa at {spa.name} features a 20 metre indoor pool with panoramic Lake Windermere views through floor to ceiling windows, making it one of the few Lake District spas where you can swim while gazing across the water. The thermal suite includes {thermalCount || 4} heat experiences: a traditional Finnish sauna, aromatherapy steam room, ice room for circulation boosting cold therapy, and aromatherapy experience showers.
          <br />
          <br />
          Eight treatment rooms offer {brandsText || 'Elemis'} therapies, from{' '}
          <Link href={ishgaExpressFacialId ? `#${ishgaExpressFacialId}` : '#treatments'} className="underline">
            express 25 minute facials
          </Link>{' '}
          to{' '}
          <Link href={macdonaldSignatureId ? `#${macdonaldSignatureId}` : '#treatments'} className="underline">
            signature 85 minute experiences
          </Link>
          . The spa is located within a historic lakeside hotel with private jetties and mature gardens extending down to the shoreline. While the thermal facilities focus on traditional heat experiences rather than outdoor pools or hot tubs, the unique lakeside pool views and central Bowness location set this spa apart. For full facility details, see the{' '}
          <Link href="#thermal" className="underline">
            thermal facilities
          </Link>{' '}
          and{' '}
          <Link href="#treatments" className="underline">
            treatments
          </Link>{' '}
          sections.
        </>
      ),
      schemaText: `The spa at ${spa.name} features a 20 metre indoor pool with panoramic Lake Windermere views through floor to ceiling windows. The thermal suite includes ${thermalCount || 4} heat experiences: a traditional Finnish sauna, aromatherapy steam room, ice room for cold therapy, and aromatherapy experience showers. Eight treatment rooms offer ${brandsText || 'Elemis'} therapies. The spa is located within a historic lakeside hotel with private jetties and mature gardens extending to the shoreline.`,
    },
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa day packages at {spa.name} range from {minPrice} to {maxPrice} per person, with options to suit different budgets and time preferences. All packages include full access to the 20 metre lakeside pool and thermal suite facilities.
          <br />
          <br />
          The most affordable option is the{' '}
          <Link href="#old-england-time-for-me-weekend" className="underline">
            My Time For Me package
          </Link>{' '}
          at {timeForMePrice || '£70'}, which includes 4 hours of spa access plus a 25 minute {brandsText || 'Elemis'} treatment. For a more complete experience, the{' '}
          <Link href="#old-england-morning-retreat-weekend" className="underline">
            My Morning Retreat
          </Link>{' '}
          ({morningRetreatPrice || '£109'}) offers 3 hours of spa access, a 25 minute treatment, and a 2 course lunch in the Lakeside Restaurant with views across Lake Windermere. Alternatively, the{' '}
          <Link href="#old-england-afternoon-escape-weekend" className="underline">
            My Afternoon Escape
          </Link>{' '}
          ({afternoonEscapePrice || '£109'}) swaps lunch for afternoon tea. Prices are the same on weekdays and weekends. Pre booking is required for all spa day packages. For current availability and booking, see the{' '}
          <Link href="#day-passes" className="underline">
            spa day packages
          </Link>{' '}
          section.
        </>
      ),
      schemaText: `Spa day packages at ${spa.name} range from ${minPrice} to ${maxPrice} per person. The My Time For Me package (${timeForMePrice || '£70'}) includes 4 hours spa access plus a 25 minute treatment. My Morning Retreat (${morningRetreatPrice || '£109'}) offers 3 hours spa access, treatment, and 2 course lunch. My Afternoon Escape (${afternoonEscapePrice || '£109'}) includes 3 hours spa access, treatment, and afternoon tea. All packages include full access to the 20 metre lakeside pool and thermal suite. Pre booking required.`,
    },
    {
      question: `Can children use the spa at ${spa.name}?`,
      answer: (
        <>
          Children are welcome to use the 20 metre swimming pool at {spa.name} between 10am and 5pm daily. This makes the hotel a good choice for families who want to combine a Lake District break with some pool time. The pool features Lake Windermere views and is maintained at a comfortable swimming temperature.
          <br />
          <br />
          However, the thermal suite facilities are restricted to guests aged 18 and over only. This includes the Finnish sauna, aromatherapy steam room, ice room, and experience showers. The age restriction ensures these heat experiences remain safe and the environment stays tranquil for adult guests. If you&apos;re seeking a quieter pool experience without children, consider visiting before 10am or after 5pm when the pool is adults only. For families wanting dedicated spa time while children enjoy other activities, the hotel&apos;s central Bowness location offers easy access to boat trips, shops, and Lake Windermere attractions. For access details, see the{' '}
          <Link href="#access" className="underline">
            spa access information
          </Link>{' '}
          section.
        </>
      ),
      schemaText: `Children are welcome to use the 20 metre swimming pool at ${spa.name} between 10am and 5pm daily. The thermal suite facilities (Finnish sauna, aromatherapy steam room, ice room, and experience showers) are restricted to guests aged 18 and over only. For a quieter pool experience without children, visit before 10am or after 5pm when the pool is adults only.`,
    },
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          Yes, complimentary pool and thermal suite access is included for all hotel guests at {spa.name}. This means you can enjoy the 20 metre lakeside pool with Lake Windermere views and all thermal facilities without any additional charge during your stay.
          <br />
          <br />
          The pool and gym are open from 7am to 6:30pm daily, giving you flexibility to visit before breakfast or fit in a swim around your day&apos;s activities. The thermal suite includes a Finnish sauna, aromatherapy steam room, ice room, and experience showers. Children can use the pool between 10am and 5pm, while the thermal facilities remain adults only throughout the day. If you want spa treatments during your stay, these are charged separately and advance booking is recommended to secure your preferred time. For day visitors who are not staying at the hotel, spa day packages start from {timeForMePrice || '£70'}. See the{' '}
          <Link href="#access" className="underline">
            spa access information
          </Link>{' '}
          for full details.
        </>
      ),
      schemaText: `Yes, complimentary pool and thermal suite access is included for all hotel guests at ${spa.name}. The pool and gym are open 7am to 6:30pm daily. The thermal suite includes Finnish sauna, aromatherapy steam room, ice room, and experience showers. Children can use the pool 10am to 5pm, thermal facilities are adults only. Spa treatments are charged separately. Day visitors can book spa day packages from ${timeForMePrice || '£70'}.`,
    },
    {
      question: `What's included in a spa day at ${spa.name}?`,
      answer: (
        <>
          All spa day packages at {spa.name} include full access to the 20 metre indoor pool with Lake Windermere views and the thermal suite facilities (Finnish sauna, aromatherapy steam room, ice room, and experience showers). Complimentary towels are provided, and changing rooms have large lockers that you secure with your own chosen code, so no coins are needed.
          <br />
          <br />
          Robes and slippers are available to hire for £10 if you want to relax on the terrace overlooking the lake. This is optional but recommended if you plan to move between the spa and outdoor terrace areas. All packages include at least one 25 minute {brandsText || 'Elemis or ishga'} treatment, with options ranging from{' '}
          <Link href={ishgaExpressFacialId ? `#${ishgaExpressFacialId}` : '#treatments'} className="underline">
            express facials
          </Link>{' '}
          to neck, back and shoulder massages. The Morning Retreat and Afternoon Escape packages also include a meal (2 course lunch or afternoon tea respectively). Lockers, showers, and hair styling facilities are available in the changing rooms. For package options and booking, see the{' '}
          <Link href="#day-passes" className="underline">
            spa day packages
          </Link>{' '}
          section.
        </>
      ),
      schemaText: `All spa day packages at ${spa.name} include full access to the 20 metre indoor pool with Lake Windermere views and thermal suite (Finnish sauna, aromatherapy steam room, ice room, experience showers). Complimentary towels provided. Changing rooms have lockers with choose your own code. Robes and slippers available to hire for £10. All packages include at least one 25 minute treatment. Morning Retreat and Afternoon Escape packages include a meal.`,
    },
  ];
}

