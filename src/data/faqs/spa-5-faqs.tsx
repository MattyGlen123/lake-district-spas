import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getSpaAccessDurationText,
  getThermalFacilitiesCount,
  getAgePolicy,
  getDayPassPrice,
  getDayPassDuration,
} from './helpers';

export function getSpa5FAQs(spa: Spa): FAQ[] {
  // Extract dynamic values
  const durationText = getSpaAccessDurationText(spa);
  const thermalCount = getThermalFacilitiesCount(spa);
  const agePolicy = getAgePolicy(spa);
  
  // Day pass prices
  const twilightWeekdayPrice = getDayPassPrice(spa.id, 'swan-twilight-sessions-weekday');
  const twilightWeekendPrice = getDayPassPrice(spa.id, 'swan-twilight-sessions-weekend');
  const afternoonTeaPrice = getDayPassPrice(spa.id, 'swan-thermal-access-afternoon-tea');
  const winterGlowPrice = getDayPassPrice(spa.id, 'swan-winter-glow-spa-day');
  const champagneTrufflePrice = getDayPassPrice(spa.id, 'swan-champagne-truffle-spa-day');
  const fullWorksPrice = getDayPassPrice(spa.id, 'swan-full-works-spa-day');
  
  // Day pass durations
  const twilightDuration = getDayPassDuration(spa.id, 'swan-twilight-sessions-weekday');
  const afternoonTeaDuration = getDayPassDuration(spa.id, 'swan-thermal-access-afternoon-tea');
  const fullWorksDuration = getDayPassDuration(spa.id, 'swan-full-works-spa-day');

  return [
    {
      question: `Do I need to book the spa in advance at ${spa.name}?`,
      answer: (
        <>
          Yes, booking in advance is essential at {spa.name}. The spa frequently reaches capacity, especially on weekends and during holidays.
          If you&apos;re staying at the hotel, we strongly recommend booking your spa access at the same time you book your room. Guests in Splendid rooms and above receive complimentary spa access, but you still need to reserve your time slot to guarantee entry.
          <br />
          <br />
          Day visitors should book thermal access or{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            spa day packages
          </Link>{' '}
          online in advance. For quieter times, consider weekday twilight sessions (Monday through Thursday, 6pm to 8pm), which tend to be less crowded than daytime slots.
          <br />
          <br />
          Late arrivals may lose their bookings, and the spa cannot easily accommodate rescheduling due to high demand. Book early to avoid disappointment.
        </>
      ),
      schemaText: `Yes, booking in advance is essential at ${spa.name}. The spa frequently reaches capacity, especially on weekends and during holidays. If you're staying at the hotel, we strongly recommend booking your spa access at the same time you book your room. Guests in Splendid rooms and above receive complimentary spa access, but you still need to reserve your time slot to guarantee entry. Day visitors should book thermal access or spa day packages online in advance. For quieter times, consider weekday twilight sessions (Monday through Thursday, 6pm to 8pm), which tend to be less crowded than daytime slots. Late arrivals may lose their bookings, and the spa cannot easily accommodate rescheduling due to high demand.`,
    },
    {
      question: `Is spa access included with my room at ${spa.name}?`,
      answer: (
        <>
          It depends on your room type. Guests staying in Splendid rooms and above receive complimentary spa access during their stay. If you&apos;ve booked a Standard room, you can purchase {durationText || '2 hour'} spa day passes, with prices ranging from {twilightWeekdayPrice || '£35'} to {fullWorksPrice || '£225'} depending on the package.
          <br />
          <br />
          The spa is open from 10am to 8pm daily. Complimentary access includes all{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            thermal facilities
          </Link>
          , including the indoor and outdoor hydrotherapy pool, Finnish saunas, steam room, cold plunge pool, and experience showers.
          <br />
          <br />
          Important: Even if your room includes spa access, you should still{' '}
          <Link href="#faq" className="text-stone-900 underline">
            book your spa time slot in advance
          </Link>{' '}
          to guarantee entry, as the spa frequently reaches capacity.
          <br />
          <br />
          When booking your room, confirm your spa access entitlement to avoid any confusion or disappointment during your stay.
        </>
      ),
      schemaText: `It depends on your room type. Guests staying in Splendid rooms and above receive complimentary spa access during their stay. If you've booked a Standard room, you can purchase ${durationText || '2 hour'} spa day passes, with prices ranging from ${twilightWeekdayPrice || '£35'} to ${fullWorksPrice || '£225'} depending on the package. The spa is open from 10am to 8pm daily. Complimentary access includes all thermal facilities, including the indoor and outdoor hydrotherapy pool, Finnish saunas, steam room, cold plunge pool, and experience showers. Important: Even if your room includes spa access, you should still book your spa time slot in advance to guarantee entry, as the spa frequently reaches capacity. When booking your room, confirm your spa access entitlement to avoid any confusion or disappointment during your stay.`,
    },
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa day prices at {spa.name} range from {twilightWeekdayPrice || '£35'} to {fullWorksPrice || '£225'}, depending on which package you choose. Budget conscious visitors love the twilight sessions, while those seeking a full spa experience can opt for premium packages that include treatments and meals.
          <br />
          <br />
          Budget options: The{' '}
          <Link href="#swan-twilight-sessions-weekday" className="text-stone-900 underline">
            Twilight Session
          </Link>{' '}
          starts at {twilightWeekdayPrice || '£35'} (Monday through Thursday, 6pm to 8pm) or {twilightWeekendPrice || '£55'} (Saturday and Sunday, 6pm to 8pm). These provide {twilightDuration || '2 hours'} of thermal access at quieter times.
          <br />
          <br />
          Best value: The{' '}
          <Link href="#swan-thermal-access-afternoon-tea" className="text-stone-900 underline">
            Thermal Access plus Afternoon Tea
          </Link>{' '}
          package costs {afternoonTeaPrice || '£65'} and is consistently praised in guest reviews as amazing value for money. You&apos;ll get {afternoonTeaDuration || '2 hours'} of{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            thermal access
          </Link>{' '}
          plus a full afternoon tea service.
          <br />
          <br />
          Premium options: For a more indulgent experience, the{' '}
          <Link href="#swan-winter-glow-spa-day" className="text-stone-900 underline">
            Winter Glow Spa Day
          </Link>{' '}
          ({winterGlowPrice || '£150'}) and{' '}
          <Link href="#swan-champagne-truffle-spa-day" className="text-stone-900 underline">
            Champagne Truffle Spa Day
          </Link>{' '}
          ({champagneTrufflePrice || '£150'}) include treatments and refreshments. The{' '}
          <Link href="#swan-full-works-spa-day" className="text-stone-900 underline">
            Full Works package
          </Link>{' '}
          ({fullWorksPrice || '£225'}) offers the complete spa day experience with extended thermal access ({fullWorksDuration || '3 hours'}), treatments, and a meal.
          <br />
          <br />
          Hotel guests: If you&apos;re staying in a Splendid room or above, complimentary{' '}
          <Link href="#access" className="text-stone-900 underline">
            spa access
          </Link>{' '}
          is included with your room, so you won&apos;t need to purchase a day pass.
        </>
      ),
      schemaText: `Spa day prices at ${spa.name} range from ${twilightWeekdayPrice || '£35'} to ${fullWorksPrice || '£225'}, depending on which package you choose. Budget options: Twilight Sessions start at ${twilightWeekdayPrice || '£35'} (Monday through Thursday, 6pm to 8pm) or ${twilightWeekendPrice || '£55'} (Saturday and Sunday, 6pm to 8pm). These provide ${twilightDuration || '2 hours'} of thermal access at quieter times. Best value: The Thermal Access plus Afternoon Tea package costs ${afternoonTeaPrice || '£65'} and is consistently praised in guest reviews as amazing value for money. You'll get ${afternoonTeaDuration || '2 hours'} of thermal access plus a full afternoon tea service. Premium options: For a more indulgent experience, the Winter Glow Spa Day (${winterGlowPrice || '£150'}) and Champagne Truffle Spa Day (${champagneTrufflePrice || '£150'}) include treatments and refreshments. The Full Works package (${fullWorksPrice || '£225'}) offers the complete spa day experience with extended thermal access (${fullWorksDuration || '3 hours'}), treatments, and a meal. Hotel guests: If you're staying in a Splendid room or above, complimentary spa access is included with your room, so you won't need to purchase a day pass.`,
    },
    {
      question: `What is the Holte Spa at ${spa.name}?`,
      answer: (
        <>
          Holte Spa is the branded name for {spa.name}&apos;s contemporary thermal wellness facility. Set in a stunning riverside location overlooking the River Leven at the southern tip of Lake Windermere, Holte Spa offers a unique thermal experience in the Lake District.
          <br />
          <br />
          What makes Holte Spa unique:
          <br />
          <br />
          {thermalCount || '5'} thermal experiences: Outdoor Finnish sauna with River Leven views, indoor Finnish sauna, steam room, cold plunge pool, and multi sensory experience showers
          <br />
          <br />
          Swim through hydrotherapy pool: A unique indoor to outdoor pool connection, naturally filtered with minimal chlorine for a gentler swimming experience
          <br />
          <br />
          Outdoor wellness focus: The outdoor Finnish sauna with river views is a standout feature, offering an authentic Scandinavian wellness experience in a Lake District setting
          <br />
          <br />
          Temple Spa treatments: Choose from 28 professional Temple Spa treatments delivered by experienced therapists
          <br />
          <br />
          The spa operates an adults only policy (guests aged 16 to 17 are welcome when accompanied by a parent or guardian). Access is available from 10am to 8pm daily through{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            spa day packages
          </Link>{' '}
          or complimentary for hotel guests in Splendid rooms and above.
        </>
      ),
      schemaText: `Holte Spa is the branded name for ${spa.name}'s contemporary thermal wellness facility. Set in a stunning riverside location overlooking the River Leven at the southern tip of Lake Windermere, Holte Spa offers a unique thermal experience in the Lake District. What makes Holte Spa unique: ${thermalCount || '5'} thermal experiences including an outdoor Finnish sauna with River Leven views, indoor Finnish sauna, steam room, cold plunge pool, and multi sensory experience showers. The swim through hydrotherapy pool offers a unique indoor to outdoor connection, naturally filtered with minimal chlorine for a gentler swimming experience. The outdoor Finnish sauna with river views is a standout feature, offering an authentic Scandinavian wellness experience in a Lake District setting. Holte Spa also offers 28 professional Temple Spa treatments delivered by experienced therapists. The spa operates an ${agePolicy || 'adults only'} policy (guests aged 16 to 17 are welcome when accompanied by a parent or guardian). Access is available from 10am to 8pm daily through spa day packages or complimentary for hotel guests in Splendid rooms and above.`,
    },
    {
      question: `What thermal facilities does ${spa.name} have?`,
      answer: (
        <>
          {spa.name} features {thermalCount || '5'} thermal experiences plus a unique swim through hydrotherapy pool. The combination of indoor and outdoor facilities, including an authentic outdoor Finnish sauna, sets this spa apart from other Lake District wellness destinations.
          <br />
          <br />
          The thermal facilities include:
          <br />
          <br />
          Outdoor Finnish Sauna: An authentic outdoor sauna experience with stunning River Leven views. This is a unique selling point and a favourite among guests seeking a true Scandinavian wellness experience in the Lake District.
          <br />
          <br />
          Indoor Finnish Sauna: A traditional Finnish inspired sauna for deep heat therapy and relaxation.
          <br />
          <br />
          Steam Room: 100% humidity steam room for deep relaxation, skin cleansing, and respiratory benefits.
          <br />
          <br />
          Cold Plunge Pool: For contrast therapy, which can help reduce inflammation, improve circulation, and invigorate the body after heat treatments.
          <br />
          <br />
          Experience Showers: Multi sensory showers featuring tropical rain, mist, monsoon, and cold waterfall effects to refresh and energize.
          <br />
          <br />
          Hydrotherapy pool: The spa&apos;s unique swim through pool connects indoor and outdoor spaces, naturally filtered with minimal chlorine for a gentler swimming experience. There&apos;s also a 12 seater jacuzzi with gentle massage jets.
          <br />
          <br />
          The spa is open from 10am to 8pm daily. Day visitors receive{' '}
          {durationText && <>{durationText} </>}
          time slots for thermal access. Swimwear is required, and towels and robes are provided. Remember to{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            book in advance
          </Link>
          , as the thermal suite frequently reaches capacity.
        </>
      ),
      schemaText: `${spa.name} features ${thermalCount || '5'} thermal experiences plus a unique swim through hydrotherapy pool. The combination of indoor and outdoor facilities, including an authentic outdoor Finnish sauna, sets this spa apart from other Lake District wellness destinations. The thermal facilities include: (1) Outdoor Finnish Sauna with stunning River Leven views, a unique selling point and favourite among guests; (2) Indoor Finnish Sauna for traditional Finnish heat therapy; (3) Steam Room with 100% humidity for deep relaxation and respiratory benefits; (4) Cold Plunge Pool for contrast therapy to reduce inflammation and improve circulation; (5) Experience Showers with multi sensory effects including tropical rain, mist, monsoon, and cold waterfall. The spa's unique swim through pool connects indoor and outdoor spaces, naturally filtered with minimal chlorine for a gentler swimming experience. There's also a 12 seater jacuzzi with gentle massage jets. The spa is open from 10am to 8pm daily. Day visitors receive ${durationText || '2 hour'} time slots for thermal access. Swimwear is required, and towels and robes are provided. Book in advance as the thermal suite frequently reaches capacity.`,
    },
  ];
}

