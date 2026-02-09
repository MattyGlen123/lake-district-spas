import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getAgePolicy,
  getDayPassPrice,
  getTreatmentIdByName,
  getTreatmentPrice,
  getTreatmentDuration,
} from './helpers';

export function getSpa12FAQs(spa: Spa): FAQ[] {
  const agePolicy = getAgePolicy(spa);

  // Treatment IDs
  const newBeginningsId = getTreatmentIdByName(spa.id, 'New Beginnings Massage');
  const yourBestYouId = getTreatmentIdByName(spa.id, 'Your Best You');
  const waveTouchId = getTreatmentIdByName(spa.id, 'Wave Touch Massage');
  const ultimateGlowId = getTreatmentIdByName(spa.id, 'The Ultimate Glow');
  const dVineFacialId = getTreatmentIdByName(spa.id, 'D-Vine Facial');
  const premierCruId = getTreatmentIdByName(spa.id, 'Premier Cru Facial');
  const myKindaMassageId = getTreatmentIdByName(spa.id, 'My Kinda Massage');

  // Treatment prices
  const cheapestTreatmentPrice = getTreatmentPrice(spa.id, 'Eyebrow Wax');
  const ultimateGlowPrice = getTreatmentPrice(spa.id, 'The Ultimate Glow');
  const dVineFacialPrice = getTreatmentPrice(spa.id, 'D-Vine Facial');
  const premierCruPrice = getTreatmentPrice(spa.id, 'Premier Cru Facial');
  const myKindaMassagePrice = getTreatmentPrice(spa.id, 'My Kinda Massage');
  const newBeginningsPrice = getTreatmentPrice(spa.id, 'New Beginnings Massage');
  const yourBestYouPrice = getTreatmentPrice(spa.id, 'Your Best You');
  const waveTouchPrice = getTreatmentPrice(spa.id, 'Wave Touch Massage');

  // Treatment durations
  const treatment50Min = getTreatmentDuration(spa.id, '50 minute');
  const treatment25Min = getTreatmentDuration(spa.id, '25 minute');
  const dVineFacialDuration = getTreatmentDuration(spa.id, 'D-Vine Facial');
  const myKindaMassageDuration = getTreatmentDuration(spa.id, 'My Kinda Massage');
  const yourBestYouDuration = getTreatmentDuration(spa.id, 'Your Best You');
  const waveTouchDuration = getTreatmentDuration(spa.id, 'Wave Touch Massage');

  // Day pass prices
  const simpleRitualWeekday = getDayPassPrice(spa.id, 'north-lakes-simple-ritual-weekday');
  const simpleRitualWeekend = getDayPassPrice(spa.id, 'north-lakes-simple-ritual-weekend');
  const afternoonRitualWeekday = getDayPassPrice(spa.id, 'north-lakes-afternoon-ritual-weekday');
  const afternoonRitualWeekend = getDayPassPrice(spa.id, 'north-lakes-afternoon-ritual-weekend');
  const twilightRitualWeekday = getDayPassPrice(spa.id, 'north-lakes-twilight-ritual-weekday');
  const pureLuxuryWeekday = getDayPassPrice(spa.id, 'north-lakes-pure-luxury-weekday');
  const pureLuxuryWeekend = getDayPassPrice(spa.id, 'north-lakes-pure-luxury-weekend');

  return [
    // FAQ 1: Spa day pricing
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa days at {spa.name} range from {simpleRitualWeekday || '£63'} to {pureLuxuryWeekend || '£260'} per person, with weekday prices typically £10 less than weekends. There are{' '}
          <Link href="#day-passes" className="underline">
            five packages
          </Link>{' '}
          to choose from, each offering a different combination of spa access, treatments, and dining.
          <br />
          <br />
          The{' '}
          <Link href="#north-lakes-simple-ritual-weekday" className="underline">
            Simple Ritual
          </Link>{' '}
          ({simpleRitualWeekday || '£63'} weekday, {simpleRitualWeekend || '£73'} weekend) gives you a full day of spa facilities with light lunch included. The Morning Ritual and{' '}
          <Link href="#north-lakes-afternoon-ritual-weekday" className="underline">
            Afternoon Ritual
          </Link>{' '}
          (from {afternoonRitualWeekday || '£126'}) add a {treatment50Min || '50 minute'} treatment and are perfect for a focused half day visit. The{' '}
          <Link href="#north-lakes-twilight-ritual-weekday" className="underline">
            Twilight Ritual
          </Link>{' '}
          (from {twilightRitualWeekday || '£126'}) includes evening spa access from 4pm with a £25 food credit towards dinner at the FYR restaurant.
          <br />
          <br />
          For the ultimate indulgence, the{' '}
          <Link href="#north-lakes-pure-luxury-weekday" className="underline">
            Pure Luxury Spa Experience
          </Link>{' '}
          (from {pureLuxuryWeekday || '£250'}) includes three treatments, prosecco lunch, and cream tea. All packages include access to the 13 metre indoor pool, whirlpool hot tub, Finnish saunas, and steam room.
        </>
      ),
      schemaText:
        `Spa days at ${spa.name} range from ${simpleRitualWeekday || '£63'} to ${pureLuxuryWeekend || '£260'} per person, with weekday prices typically £10 less than weekends. The Simple Ritual (from ${simpleRitualWeekday || '£63'}) includes full day spa access with light lunch. The Morning, Afternoon, and Twilight Rituals (from ${afternoonRitualWeekday || '£126'}) add a ${treatment50Min || '50 minute'} treatment and dining. The Pure Luxury Spa Experience (from ${pureLuxuryWeekday || '£250'}) includes three treatments, prosecco lunch, and cream tea. All packages include the indoor pool, hot tub, Finnish saunas, and steam room.`,
    },

    // FAQ 2: Spa facilities for hotel guests
    {
      question: `What spa facilities are included for hotel guests at ${spa.name}?`,
      answer: (
        <>
          All hotel guests at {spa.name} receive complimentary spa access at no extra charge, which is a genuine advantage compared to some Lake District spas where spa access costs extra or is limited to certain room types. Your stay includes full use of the 13 metre indoor pool, whirlpool hot tub, steam room, and separate male and female Finnish saunas. Robes and slippers are provided.
          <br />
          <br />
          The separate gender saunas are a distinctive feature at {spa.name}, offering added privacy and comfort that most Lake District spas don&apos;t provide. The spa is open Monday to Friday from 6am to 9:30pm and Saturday to Sunday from 7am to 8pm, giving you plenty of flexibility to enjoy the facilities around your other plans.
          <br />
          <br />
          If you&apos;re not staying at the hotel,{' '}
          <Link href="#day-passes" className="underline">
            day passes
          </Link>{' '}
          and annual memberships are also available for non residents. For full details on spa access policies and opening hours, see the{' '}
          <Link href="#access" className="underline">
            Spa Access Information
          </Link>{' '}
          section.
        </>
      ),
      schemaText:
        `All hotel guests at ${spa.name} receive complimentary spa access at no extra charge. This includes the 13 metre indoor pool, whirlpool hot tub, steam room, and separate male and female Finnish saunas. Robes and slippers are provided. The spa is open Monday to Friday 6am to 9:30pm and Saturday to Sunday 7am to 8pm. Day passes and annual memberships are also available for non residents.`,
    },

    // FAQ 3: Children and swimming pool
    {
      question: `Can children use the swimming pool at ${spa.name}?`,
      answer: (
        <>
          Yes, children are welcome to use the swimming pool at {spa.name} during designated family sessions between 10am and 1pm. Outside these hours, the pool is reserved for guests aged {agePolicy || '16 and over'} only. The spa facilities including the Finnish saunas and steam room are restricted to guests aged {agePolicy || '16 and over'} at all times.
          <br />
          <br />
          This arrangement works well for both families and couples. If you&apos;re visiting as a couple and prefer a quieter experience, plan your swim for the afternoon or evening when the pool reverts to adult only use. Early mornings are also a good option, with the spa opening at 6am on weekdays.
          <br />
          <br />
          For couples specifically seeking adults only spa environments across the Lake District, see our{' '}
          <Link href="/couples-spa-lake-district" className="underline">
            couples spa guide
          </Link>{' '}
          for alternatives.
        </>
      ),
      schemaText:
        `Yes, children can use the swimming pool at ${spa.name} during designated family sessions between 10am and 1pm. Outside these hours, the pool is reserved for guests aged ${agePolicy || '16 and over'} only. The spa facilities including Finnish saunas and steam room are restricted to guests aged ${agePolicy || '16 and over'} at all times. Couples seeking a quieter experience should plan their swim for the afternoon or evening when the pool is adult only.`,
    },

    // FAQ 4: Treatments available
    {
      question: `What treatments are available at ${spa.name}?`,
      answer: (
        <>
          {spa.name} offers over 20{' '}
          <Link href="#treatments" className="underline">
            treatments
          </Link>{' '}
          from two specialist brands: Caudalie, known for French luxury skincare using grape seed extracts, and TEMPLESPA, which uses Mediterranean botanical ingredients. Treatments range from {cheapestTreatmentPrice || '£16'} for express beauty services to {ultimateGlowPrice || '£110'} for the{' '}
          <Link href={ultimateGlowId ? `#${ultimateGlowId}` : '#treatments'} className="underline">
            signature Ultimate Glow experience
          </Link>
          .
          <br />
          <br />
          Facial treatments start at {dVineFacialPrice || '£52'} for the express{' '}
          <Link href={dVineFacialId ? `#${dVineFacialId}` : '#treatments'} className="underline">
            Caudalie D Vine Facial
          </Link>{' '}
          ({dVineFacialDuration || '25 minutes'}) and go up to {premierCruPrice || '£89'} for premium options including the{' '}
          <Link href={premierCruId ? `#${premierCruId}` : '#treatments'} className="underline">
            Premier Cru
          </Link>{' '}
          and Resveratrol facials. The most popular massage is the{' '}
          <Link href={myKindaMassageId ? `#${myKindaMassageId}` : '#treatments'} className="underline">
            TEMPLESPA My Kinda Massage
          </Link>{' '}
          ({myKindaMassageDuration || '50 minutes'}, {myKindaMassagePrice || '£89'}), which lets you choose from three aromatic oil blends. There&apos;s also a pregnancy safe{' '}
          <Link href={newBeginningsId ? `#${newBeginningsId}` : '#treatments'} className="underline">
            New Beginnings Massage
          </Link>{' '}
          ({newBeginningsPrice || '£89'}) and a dedicated menopause treatment called{' '}
          <Link href={yourBestYouId ? `#${yourBestYouId}` : '#treatments'} className="underline">
            Your Best You
          </Link>{' '}
          ({yourBestYouDuration || '80 minutes'}, {yourBestYouPrice || '£105'}).
          <br />
          <br />
          For something unique, the{' '}
          <Link href={waveTouchId ? `#${waveTouchId}` : '#treatments'} className="underline">
            Wave Touch Massage
          </Link>{' '}
          ({waveTouchPrice || '£35'}, {waveTouchDuration || '25 minutes'}) uses a state of the art Wave Bed for a hands free relaxation experience. Browse all treatments in the{' '}
          <Link href="#treatments" className="underline">
            treatments section
          </Link>{' '}
          below.
        </>
      ),
      schemaText:
        `${spa.name} offers over 20 treatments from two specialist brands: Caudalie (French luxury skincare) and TEMPLESPA (Mediterranean botanicals). Prices range from ${cheapestTreatmentPrice || '£16'} for express beauty services to ${ultimateGlowPrice || '£110'} for the signature Ultimate Glow experience. Facials start at ${dVineFacialPrice || '£52'} for an express option up to ${premierCruPrice || '£89'} for premium anti aging facials. Full body massage is ${myKindaMassagePrice || '£89'} for ${myKindaMassageDuration || '50 minutes'}. Specialty treatments include a pregnancy safe massage (${newBeginningsPrice || '£89'}), a menopause focused treatment (${yourBestYouPrice || '£105'}), and the unique Wave Touch Massage on a Wave Bed (${waveTouchPrice || '£35'}).`,
    },

    // FAQ 5: Afternoon tea with spa day
    {
      question: `Does ${spa.name} offer afternoon tea with spa days?`,
      answer: (
        <>
          Yes, the{' '}
          <Link href="#north-lakes-afternoon-ritual-weekday" className="underline">
            Afternoon Ritual
          </Link>{' '}
          package at {spa.name} combines afternoon tea with a spa experience, priced at {afternoonRitualWeekday || '£126'} on weekdays and {afternoonRitualWeekend || '£136'} at weekends. The package includes 4 hours of spa access, a {treatment50Min || '50 minute'} treatment (or two {treatment25Min || '25 minute'} treatments), and a full afternoon tea.
          <br /><br />
          This makes an ideal gift for occasions like Mother&apos;s Day, birthdays, or simply treating someone special. You get to enjoy the pool, hot tub, and thermal facilities before or after your treatment, then sit down to afternoon tea to round off the experience.
          <br />
          <br />
          If you&apos;d prefer an evening experience, the{' '}
          <Link href="#north-lakes-twilight-ritual-weekday" className="underline">
            Twilight Ritual
          </Link>{' '}
          (from {twilightRitualWeekday || '£126'}) offers the same spa access and treatment but replaces afternoon tea with a £25 food credit towards dinner at FYR restaurant.
          <br />
          <br />
          For the most indulgent option, the{' '}
          <Link href="#north-lakes-pure-luxury-weekday" className="underline">
            Pure Luxury Spa Experience
          </Link>{' '}
          (from {pureLuxuryWeekday || '£250'}) includes three treatments, prosecco lunch, and cream tea.
        </>
      ),
      schemaText:
        `Yes, the Afternoon Ritual package at ${spa.name} combines afternoon tea with a spa experience, priced at ${afternoonRitualWeekday || '£126'} on weekdays and ${afternoonRitualWeekend || '£136'} at weekends. It includes 4 hours of spa access, a ${treatment50Min || '50 minute'} treatment or two ${treatment25Min || '25 minute'} treatments, and a full afternoon tea. This is ideal for Mother's Day, birthdays, or celebrating special occasions. Alternatively, the Twilight Ritual replaces afternoon tea with a £25 dinner credit at FYR restaurant, or the Pure Luxury experience (from ${pureLuxuryWeekday || '£250'}) includes three treatments, prosecco lunch, and cream tea.`,
    },
  ];
}

