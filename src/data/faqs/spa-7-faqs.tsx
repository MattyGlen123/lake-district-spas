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

export function getSpa7FAQs(spa: Spa): FAQ[] {
  const thermalCount = getThermalFacilitiesCount(spa);
  const brandsText = getTreatmentBrandsText(spa.id);
  const agePolicy = getAgePolicy(spa);
  
  // Day pass prices
  const ultimateActivityPrice = getDayPassPrice(spa.id, 'low-wood-bay-ultimate-activity');
  const paddleSpaPrice = getDayPassPrice(spa.id, 'low-wood-bay-paddle-spa');
  const sailSpaPrice = getDayPassPrice(spa.id, 'low-wood-bay-sail-spa');
  const twilightPrice = getDayPassPrice(spa.id, 'low-wood-bay-twilight-thermal');
  const weekendThermalPrice = getDayPassPrice(spa.id, 'low-wood-bay-weekend-thermal');
  const weekdayThermalLunchPrice = getDayPassPrice(spa.id, 'low-wood-bay-weekday-thermal-lunch');
  const weekendThermalLunchPrice = getDayPassPrice(spa.id, 'low-wood-bay-weekend-thermal-lunch');
  const rechargePrice = getDayPassPrice(spa.id, 'low-wood-bay-recharge-spa');
  const restfulRetreatPrice = getDayPassPrice(spa.id, 'low-wood-bay-restful-retreat');
  const hideawayPrice = getDayPassPrice(spa.id, 'low-wood-bay-hideaway-retreat');
  
  // Day pass durations
  const ultimateActivityDuration = getDayPassDuration(spa.id, 'low-wood-bay-ultimate-activity');
  const paddleSpaDuration = getDayPassDuration(spa.id, 'low-wood-bay-paddle-spa');
  const twilightDuration = getDayPassDuration(spa.id, 'low-wood-bay-twilight-thermal');
  const weekendThermalDuration = getDayPassDuration(spa.id, 'low-wood-bay-weekend-thermal');
  const rechargeDuration = getDayPassDuration(spa.id, 'low-wood-bay-recharge-spa');
  
  // Treatment durations
  const treatment50Min = getTreatmentDuration(spa.id, '50 minute');
  const treatment110Min = getTreatmentDuration(spa.id, '110 minute');

  return [
    {
      question: `Can I combine watersports with spa at ${spa.name}?`,
      answer: (
        <>
          Yes, {spa.name} offers unique spa day packages that combine water activities on Lake Windermere with thermal spa access. This makes it the only Lake District spa where you can enjoy paddleboarding, kayaking, or sailing followed by relaxation in the thermal facilities.
          <br />
          The{' '}
          <Link href="#low-wood-bay-ultimate-activity" className="text-stone-900 underline">
            Ultimate Activity Spa Day
          </Link>{' '}
          ({ultimateActivityPrice || '£140'}) includes a 2 hour water activity where you choose between a single kayak, double canoe, or pedalo for two. After your time on the lake, enjoy {ultimateActivityDuration || '3 hours'} in the{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            thermal facilities
          </Link>{' '}
          including three saunas, steam room, indoor pool, and two outdoor infinity pools. The package includes lunch or wood fired afternoon tea at Blue Smoke restaurant, plus robes and towels.
          <br />
          <br />
          The{' '}
          <Link href="#low-wood-bay-paddle-spa" className="text-stone-900 underline">
            Morning Paddle & Spa
          </Link>{' '}
          ({paddleSpaPrice || '£135'}) includes a 2 hour paddleboard session with wetsuit hire, followed by the same {paddleSpaDuration || '3 hours'} thermal journey and dining experience. For a truly special occasion, the{' '}
          <Link href="#low-wood-bay-sail-spa" className="text-stone-900 underline">
            Sail & Spa Day
          </Link>{' '}
          ({sailSpaPrice || '£180'} per person for groups of 2 to 6) combines a private 1 hour yacht charter on Lake Windermere with your spa experience and meal.
          <br />
          <br />
          All watersports and spa combination packages must be booked in advance as they&apos;re extremely popular, especially during summer months. The activities are suitable for beginners with instruction provided. Check weather conditions may affect watersports availability. For more information, see the{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            Day Passes
          </Link>{' '}
          section.
        </>
      ),
      schemaText:
        `Yes, ${spa.name} offers unique spa day packages that combine water activities on Lake Windermere with thermal spa access. The Ultimate Activity Spa Day (${ultimateActivityPrice || '£140'}) includes a 2 hour water activity (single kayak, double canoe, or pedalo) followed by ${ultimateActivityDuration || '3 hours'} in thermal facilities and lunch or afternoon tea. The Morning Paddle & Spa (${paddleSpaPrice || '£135'}) includes a 2 hour paddleboard session with wetsuit hire. The Sail & Spa Day (${sailSpaPrice || '£180'}/person for 2-6 guests) combines a private 1 hour yacht charter with spa access and dining. All packages must be booked in advance.`,
    },
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          {spa.name} offers spa day packages from {twilightPrice || '£60'} to {sailSpaPrice || '£360'} per person depending on what&apos;s included. With 17 different packages available, there&apos;s an option for every budget and preference.
          <br />
          <br />
          The most affordable option is the{' '}
          <Link href="#low-wood-bay-twilight-thermal" className="text-stone-900 underline">
            Twilight Thermal Journey
          </Link>{' '}
          ({twilightPrice || '£60'}, Monday to Thursday evenings only), which gives you {twilightDuration || '2 hours'} of evening spa access. For daytime visits, the{' '}
          <Link href="#low-wood-bay-weekend-thermal" className="text-stone-900 underline">
            Weekend Thermal Journey
          </Link>{' '}
          ({weekendThermalPrice || '£95'}, Saturday and Sunday) offers {weekendThermalDuration || '3 hours'} of spa access without treatment or dining.           If you want the full experience, the{' '}
          <Link href="#low-wood-bay-weekday-thermal-lunch" className="text-stone-900 underline">
            Weekday Thermal Journey with Lunch or Afternoon Tea
          </Link>{' '}
          starts at {weekdayThermalLunchPrice || '£125'}, or the{' '}
          <Link href="#low-wood-bay-weekend-thermal-lunch" className="text-stone-900 underline">
            Weekend Thermal Journey with Lunch or Afternoon Tea
          </Link>{' '}
          is {weekendThermalLunchPrice || '£130'}.
          <br />
          <br />
          Packages including a {treatment50Min || '50 minute'} treatment start at {rechargePrice || '£175'} for the{' '}
          <Link href="#low-wood-bay-recharge-spa" className="text-stone-900 underline">
            Recharge Spa Day
          </Link>{' '}
          , which includes your choice of treatment, {rechargeDuration || '3 hours'} thermal journey, and lunch or afternoon tea. The{' '}
          <Link href="#low-wood-bay-restful-retreat" className="text-stone-900 underline">
            Restful Retreat
          </Link>{' '}
          ({restfulRetreatPrice || '£205'}) adds a glass of prosecco. The luxurious{' '}
          <Link href="#low-wood-bay-hideaway-retreat" className="text-stone-900 underline">
            Hideaway Retreat
          </Link>{' '}
          ({hideawayPrice || '£300'} per person for couples) includes a {treatment110Min || '110 minute'} treatment in an exclusive room with salt bath and Lake Windermere views.
          <br />
          <br />
          All packages include robes and towels. Weekday packages are typically £5 to £15 less expensive than weekend prices. Hotel guests receive 25% off spa day bookings made Monday to Thursday. Note that you&apos;ll need to bring a payment card or phone for purchasing additional food and drinks around the pool areas. For more details on{' '}
          <Link href="#access" className="text-stone-900 underline">
            spa access
          </Link>{' '}
          and{' '}
          <Link href="#day-passes" className="text-stone-900 underline">
            Day Passes
          </Link>
          , see the relevant sections.
        </>
      ),
      schemaText:
        `${spa.name} offers spa day packages from ${twilightPrice || '£60'} to ${sailSpaPrice || '£360'} per person. The Twilight Thermal Journey (Mon-Thu evenings, ${twilightPrice || '£60'}) offers the best value for spa access only. The Weekend Thermal Journey (${weekendThermalPrice || '£95'}) provides ${weekendThermalDuration || '3 hours'} access. Packages with treatment start at ${rechargePrice || '£175'} (Recharge Spa Day with ${treatment50Min || '50 minute'} treatment, ${rechargeDuration || '3 hours'} thermal journey, and lunch or afternoon tea). Weekday packages are typically £5-15 less than weekend prices. Hotel guests receive 25% off Monday to Thursday. All prices include robes and towels.`,
    },
    {
      question: `What's included in a ${spa.name} spa day?`,
      answer: (
        <>
          All {spa.name} spa days include access to the thermal facilities featuring {thermalCount} different heat experiences, two outdoor infinity pools, and indoor thermal pool. The thermal journey includes three saunas (dry salt sauna, infrared cabin for deep tissue relaxation, and outdoor fellside sauna with mountain views), coconut steam room, herbal lounge, and multi sensory experience showers both indoor and outdoor. You can relax in the heated indoor thermal pool or enjoy the two heated outdoor infinity pools overlooking Lake Windermere and the Langdale Pikes. Multiple outdoor hot tubs are perfect for stargazing in the evening. Robes and towels are provided with all packages.
          <br />
          <br />
          What else is included depends on which package you book. Many packages include a {treatment50Min || '50 minute'} spa treatment where you choose from options including{brandsText ? ` ${brandsText}` : ''} therapies. Most full day packages include either a 2 course lunch or wood fired afternoon tea served at Blue Smoke on the Bay restaurant. Some packages like the{' '}
          <Link href="#low-wood-bay-restful-retreat" className="text-stone-900 underline">
            Restful Retreat
          </Link>{' '}
          include a complimentary glass of prosecco. The{' '}
          <Link href="#low-wood-bay-weekday-ultimate-dine" className="text-stone-900 underline">
            Ultimate Spa & Dine
          </Link>{' '}
          packages add access to the mud room experience.
          <br />
          <br />
          Duration varies from {twilightDuration || '2 hours'} ({' '}
          <Link href="#low-wood-bay-twilight-thermal" className="text-stone-900 underline">
            Twilight packages
          </Link>
          , {twilightPrice || '£60'} to £95) to {rechargeDuration || '3 hours'} (most day packages, {weekdayThermalLunchPrice || '£125'} to {sailSpaPrice || '£360'}). Remember to bring flip flops or beach shoes for walking around the spa, and a payment card for purchasing additional refreshments at the poolside areas. For more information about the{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            thermal facilities
          </Link>{' '}
          and{' '}
          <Link href="#treatments" className="text-stone-900 underline">
            treatments
          </Link>
          , see the relevant sections.
        </>
      ),
      schemaText:
        `All spa days include access to ${thermalCount} thermal experiences: three saunas (dry salt, infrared cabin, outdoor fellside sauna), coconut steam room, herbal lounge, and experience showers. You can use the indoor thermal pool, two heated outdoor infinity pools overlooking Lake Windermere, and multiple outdoor hot tubs. Robes and towels are provided. Depending on your package, you may also receive a ${treatment50Min || '50 minute'} treatment, 2 course lunch or wood fired afternoon tea at Blue Smoke, glass of prosecco, and mud room experience. Duration varies from ${twilightDuration || '2 hours'} to ${rechargeDuration || '3 hours'}.`,
    },
    {
      question: `Do I need to book spa treatments in advance at ${spa.name}?`,
      answer: (
        <>
          Yes, advance booking is essential at {spa.name} for both spa day packages and individual treatments. The spa is exceptionally popular, having been voted Best Spa in the North West 2026, and packages regularly sell out particularly on weekends, school holidays, and during peak summer months from June to August.
          <br />
          <br />
          When you book your spa day package, you&apos;ll also select your preferred treatment time if your package includes a treatment. With 17 different package options ranging from the {twilightPrice || '£60'}{' '}
          <Link href="#low-wood-bay-twilight-thermal" className="text-stone-900 underline">
            Twilight Thermal Journey
          </Link>{' '}
          to the {sailSpaPrice || '£360'}{' '}
          <Link href="#low-wood-bay-sail-spa" className="text-stone-900 underline">
            Sail & Spa
          </Link>{' '}
          experience, booking ahead ensures you get your first choice package and preferred time slot. The watersports combination packages ({' '}
          <Link href="#low-wood-bay-ultimate-activity" className="text-stone-900 underline">
            Ultimate Activity Spa Day
          </Link>
          ,{' '}
          <Link href="#low-wood-bay-paddle-spa" className="text-stone-900 underline">
            Morning Paddle & Spa
          </Link>
          ,{' '}
          <Link href="#low-wood-bay-sail-spa" className="text-stone-900 underline">
            Sail & Spa
          </Link>
          ) are especially popular and often book up weeks in advance during summer.
          <br />
          <br />
          If you&apos;re staying as a hotel guest at {spa.name}, you can add spa access separately with a 25% discount available Monday to Thursday. However, even for hotel guests this requires advance booking as capacity in the thermal facilities is limited to maintain a peaceful atmosphere. The spa is open for treatments from 9:30am to 7:30pm, with spa day packages available from 10am to 8pm. Walk in availability is extremely limited and not guaranteed. Book your spa experience when making your room reservation or as early as possible to avoid disappointment. To explore available{' '}
          <Link href="#treatments" className="text-stone-900 underline">
            treatments
          </Link>
          , see the relevant section.
        </>
      ),
      schemaText:
        `Yes, advance booking is essential for both spa day packages and treatments. The spa was voted Best Spa in the North West 2026 and packages regularly sell out, especially on weekends and school holidays. Book your preferred package and treatment times when making your reservation. Hotel guests can add spa access with 25% discount Monday to Thursday, but this also requires advance booking. Walk in availability is extremely limited.`,
    },
    {
      question: `Can teenagers use the spa at ${spa.name}?`,
      answer: (
        <>
          Yes, {spa.name} welcomes guests aged {agePolicy || '16 and over'} to use all spa facilities. This makes it one of the few Lake District spas suitable for families with older teenagers, as most spas in the region have an 18 and over policy.
          <br />
          <br />
          All guests under 18 must be accompanied by an adult throughout their spa visit. The {agePolicy || '16+'} age restriction applies to all thermal facilities including the three saunas (dry salt, infrared, and outdoor fellside sauna), coconut steam room, herbal lounge, indoor thermal pool, outdoor infinity pools, and hot tubs. Teenagers can also enjoy spa treatments, with popular choices including massages and facials{brandsText ? ` using ${brandsText}` : ''}.
          <br />
          <br />
          For families visiting with teenagers, the watersports combination packages are particularly appealing. The{' '}
          <Link href="#low-wood-bay-ultimate-activity" className="text-stone-900 underline">
            Ultimate Activity Spa Day
          </Link>{' '}
          ({ultimateActivityPrice || '£140'}) and{' '}
          <Link href="#low-wood-bay-paddle-spa" className="text-stone-900 underline">
            Morning Paddle & Spa
          </Link>{' '}
          ({paddleSpaPrice || '£135'}) offer age appropriate activities on Lake Windermere followed by thermal relaxation. These packages work well for active families who want to combine adventure with wellness.
          <br />
          <br />
          The {agePolicy || '16+'} policy balances creating a tranquil spa environment with being family friendly. During school holidays, you may find the spa busier with younger guests. For the quietest experience, consider visiting on weekday mornings when the spa tends to be less crowded. All spa day packages and treatments for guests under 18 must be booked and paid for by an adult. For more information about the{' '}
          <Link href="#thermal" className="text-stone-900 underline">
            thermal facilities
          </Link>{' '}
          and{' '}
          <Link href="#book" className="text-stone-900 underline">
            booking
          </Link>
          , see the relevant sections.
        </>
      ),
      schemaText:
        `Yes, ${spa.name} welcomes guests aged ${agePolicy || '16 and over'} to use all spa facilities. This makes it one of the few Lake District spas suitable for families with older teenagers. All guests under 18 must be accompanied by an adult. The ${agePolicy || '16+'} age restriction applies to all thermal facilities including saunas, steam rooms, pools, and hot tubs. Teenagers can also enjoy spa treatments. The watersports combination packages are particularly popular with families visiting with teens.`,
    },
  ];
}

