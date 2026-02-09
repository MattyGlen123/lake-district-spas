import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import { getThermalFacilitiesCount, getTreatmentBrandsText, getAgePolicy, getDayPassPrice, getDayPassDuration, getTreatmentIdByName, getTreatmentDuration } from './helpers';

export function getSpa15FAQs(spa: Spa): FAQ[] {
  const thermalCount = getThermalFacilitiesCount(spa);
  const brandsText = getTreatmentBrandsText(spa.id);
  const agePolicy = getAgePolicy(spa);
  const backMassageId = getTreatmentIdByName(spa.id, 'Back Massage');
  const absoluteSpaRitualId = getTreatmentIdByName(spa.id, 'Absolute Spa Ritual');
  const lavaShellRelaxId = getTreatmentIdByName(spa.id, 'Lava Shell Relax Massage - Full Body Massage');
  const elemisExpertTouchRenewId = getTreatmentIdByName(spa.id, 'Elemis Expert Touch Renew Facial');
  const elemisExpertTouchRevealId = getTreatmentIdByName(spa.id, 'Elemis Expert Touch Reveal Facial');
  const elemisExpertTouchNourishId = getTreatmentIdByName(spa.id, 'Elemis Expert Touch Nourish Facial');
  const thermalOnlyPrice = getDayPassPrice(spa.id, 'appleby-thermal-only');
  const thermalOnlyDuration = getDayPassDuration(spa.id, 'appleby-thermal-only');
  const indulgenceWeekendPrice = getDayPassPrice(spa.id, 'appleby-indulgence-weekend');
  const indulgenceWeekdayPrice = getDayPassPrice(spa.id, 'appleby-indulgence-weekday');
  const indulgenceDuration = getDayPassDuration(spa.id, 'appleby-indulgence-weekend');
  const luxurienceWeekdayPrice = getDayPassPrice(spa.id, 'appleby-luxurience-weekday');
  const luxurienceWeekendPrice = getDayPassPrice(spa.id, 'appleby-luxurience-weekend');
  const luxurienceDuration = getDayPassDuration(spa.id, 'appleby-luxurience-weekday');
  const lightTeaWeekdayPrice = getDayPassPrice(spa.id, 'appleby-thermal-light-tea-weekday');
  const lightTeaWeekendPrice = getDayPassPrice(spa.id, 'appleby-thermal-light-tea-weekend');
  const lightTeaDuration = getDayPassDuration(spa.id, 'appleby-thermal-light-tea-weekday');
  const thermalMealWeekdayPrice = getDayPassPrice(spa.id, 'appleby-thermal-meal-weekday');
  const thermalMealWeekendPrice = getDayPassPrice(spa.id, 'appleby-thermal-meal-weekend');
  const thermalMealDuration = getDayPassDuration(spa.id, 'appleby-thermal-meal-weekday');
  const treatment25Min = getTreatmentDuration(spa.id, '25 minute');
  const treatment110Min = getTreatmentDuration(spa.id, 'Absolute Spa Ritual');
  const skinBoosterDuration = getTreatmentDuration(spa.id, 'Skin Booster');

  return [
    // FAQ 1: Spa day pricing
    {
      question: `How much does a spa day cost at ${spa.name}?`,
      answer: (
        <>
          Spa day packages at {spa.name} start from {thermalOnlyPrice || '£45'} per person for a {thermalOnlyDuration || '2 hour'}{' '}
          <Link href="#appleby-thermal-only" className="underline">
            Aqua Thermal Journey
          </Link>
          , which gives you access to the hydrotherapy pool, outdoor spa bath, sauna, and salt inhalation room. The most comprehensive package is the{' '}
          <Link href="#appleby-indulgence-weekend" className="underline">
            Indulgence
          </Link>{' '}
          at {indulgenceWeekendPrice || '£125'} per person on weekends ({indulgenceWeekdayPrice || '£115'} weekdays), which includes {indulgenceDuration || '5 hours'} of spa access, a treatment of your choice, and a 2 course lunch.
          <br />
          <br />
          In between, the{' '}
          <Link href="#appleby-luxurience-weekday" className="underline">
            Luxurience packages
          </Link>{' '}
          offer a {luxurienceDuration || '3 hour'} thermal journey with a {treatment25Min || '25 minute'} treatment and lunch or afternoon tea from {luxurienceWeekdayPrice || '£89'} weekdays or {luxurienceWeekendPrice || '£99'} weekends. All packages include full use of the thermal facilities and outdoor spa garden. Weekday pricing is typically £10 less than weekends across all packages.
          <br />
          <br />
          With 11 different day spa packages available, there&apos;s an option to suit most budgets. Browse all options in the{' '}
          <Link href="#day-passes" className="underline">
            spa day packages section
          </Link>
          .
        </>
      ),
      schemaText: `Spa day packages at ${spa.name} start from ${thermalOnlyPrice || '£45'} per person for a ${thermalOnlyDuration || '2 hour'} Aqua Thermal Journey. The most comprehensive Indulgence package costs ${indulgenceWeekendPrice || '£125'} per person on weekends (${indulgenceWeekdayPrice || '£115'} weekdays) and includes ${indulgenceDuration || '5 hours'} of spa access, a treatment, and 2 course lunch. Mid range Luxurience packages start from ${luxurienceWeekdayPrice || '£89'} weekdays with a ${luxurienceDuration || '3 hour'} thermal journey, ${treatment25Min || '25 minute'} treatment, and lunch or afternoon tea. Weekday pricing is typically £10 less than weekends. There are 11 different packages available.`,
    },

    // FAQ 2: Day visitor access
    {
      question: `Can I visit the Garden Spa without staying at the hotel?`,
      answer: (
        <>
          Yes, {spa.name} welcomes day visitors to the Garden Spa through their{' '}
          <Link href="#day-passes" className="underline">
            day spa packages
          </Link>
          . You don&apos;t need to be a hotel guest to enjoy the spa facilities. Day packages range from {thermalOnlyDuration || '2 hour'}{' '}
          <Link href="#appleby-thermal-only" className="underline">
            thermal journeys
          </Link>{' '}
          to full {indulgenceDuration || '5 hour'} experiences with treatments and dining included. All packages must be booked in advance.
          <br />
          <br />
          Day visitors get full access to the same facilities as hotel guests, including the indoor hydrotherapy pool with underwater massage loungers, the outdoor spa garden with hot tub and fire pit, traditional sauna, aromatherapy steam room, and salt inhalation room. The spa operates a time slot system, so you&apos;ll choose either a{' '}
          <Link href="#appleby-thermal-only" className="underline">
            morning
          </Link>{' '}
          or{' '}
          <Link href="#appleby-thermal-only" className="underline">
            afternoon
          </Link>{' '}session when booking.
          <br />
          <br />
          Please note that all day spa packages are restricted to guests aged {agePolicy || '18 and over'}. For full details on packages and pricing, see the{' '}
          <Link href="#day-passes" className="underline">
            spa day packages
          </Link>{' '}
          and{' '}
          <Link href="#access" className="underline">
            access information
          </Link>{' '}
          sections.
        </>
      ),
      schemaText: `Yes, ${spa.name} welcomes day visitors to the Garden Spa through their day spa packages. You don't need to be a hotel guest. Day packages range from 2 hour thermal journeys to full 5 hour experiences with treatments and dining. All packages must be booked in advance. Day visitors get full access to the hydrotherapy pool, outdoor spa garden with hot tubs and fire pit, sauna, steam room, and salt inhalation room. All day spa packages are restricted to guests aged ${agePolicy || '18 and over'}.`,
    },

    // FAQ 3: Facilities overview
    {
      question: `What facilities does the Garden Spa at ${spa.name} have?`,
      answer: (
        <>
          The Garden Spa features {thermalCount || 4} thermal facilities alongside its main hydrotherapy pool and outdoor spa garden. Indoors, the vitality pool has underwater massage loungers, volcano pads, and shoulder cannons for targeted hydrotherapy. The thermal suite includes a traditional sauna, aromatherapy steam room, salt inhalation room designed for respiratory benefits, and rain sky experience showers.
          <br />
          <br />
          The standout feature is the sheltered outdoor spa garden, which has a hot tub for year round alfresco bathing alongside a fire pit and comfortable lounge furniture. There&apos;s also a separate private hire hot tub in its own glass cube enclosure, available to book at additional cost with a glass of bubbly included.
          <br />
          <br />
          For a closer look at each facility, see the{' '}
          <Link href="#thermal" className="underline">
            thermal facilities
          </Link>{' '}
          section.
        </>
      ),
      schemaText: `The Garden Spa features ${thermalCount || 4} thermal facilities alongside a hydrotherapy pool and outdoor spa garden. The indoor vitality pool has underwater massage loungers, volcano pads, and shoulder cannons. Thermal facilities include a traditional sauna, aromatherapy steam room, salt inhalation room for respiratory benefits, and rain sky experience showers. The standout feature is the sheltered outdoor spa garden, which has a hot tub for year round bathing alongside a fire pit and lounge furniture. There's also a separate private hire hot tub in a glass cube enclosure, available at additional cost with a glass of bubbly.`,
    },

    // FAQ 4: Treatments
    {
      question: `What treatments are available at the Garden Spa?`,
      answer: (
        <>
          The Garden Spa offers treatments using {brandsText || 'Elemis and Lava Shell products'}, ranging from{' '}
          <Link href={backMassageId ? `#${backMassageId}` : '#treatments'} className="underline">
            {treatment25Min || '25 minute'} express options
          </Link>{' '}
          to the signature {treatment110Min || '110 minute'}{' '}
          <Link href={absoluteSpaRitualId ? `#${absoluteSpaRitualId}` : '#treatments'} className="underline">
            Absolute Spa Ritual
          </Link>{' '}
          which combines a full body massage with a skin specific facial. Massage therapies include deep tissue, Indian head massage, back massage, and the{' '}
          <Link href={lavaShellRelaxId ? `#${lavaShellRelaxId}` : '#treatments'} className="underline">
            Lava Shell Relax range
          </Link>{' '}
          which uses heated shells for a warming full body treatment.
          <br />
          <br />
          Facial treatments use Elemis formulas across three specialist options: the{' '}
          <Link href={elemisExpertTouchRenewId ? `#${elemisExpertTouchRenewId}` : '#treatments'} className="underline">
            Expert Touch Renew
          </Link>{' '}
          for anti aging and firming, the{' '}
          <Link href={elemisExpertTouchRevealId ? `#${elemisExpertTouchRevealId}` : '#treatments'} className="underline">
            Expert Touch Reveal
          </Link>{' '}
          for resurfacing and glow, and the{' '}
          <Link href={elemisExpertTouchNourishId ? `#${elemisExpertTouchNourishId}` : '#treatments'} className="underline">
            Expert Touch Nourish
          </Link>{' '}
          for hydration and radiance. There&apos;s also a {skinBoosterDuration || '25 minute'} Skin Booster facial when time is limited. For expectant mothers, the Elemis Peaceful Pregnancy Massage is available from the second trimester using specialist positioning for comfort and safety.
          <br />
          <br />
          Treatments can be booked as part of day spa packages or separately. See the full{' '}
          <Link href="#treatments" className="underline">
            treatment menu
          </Link>{' '}
          for details and prices.
        </>
      ),
      schemaText: `The Garden Spa offers treatments using ${brandsText || 'Elemis and Lava Shell products'}, from ${treatment25Min || '25 minute'} express options to the signature ${treatment110Min || '110 minute'} Absolute Spa Ritual combining full body massage with a facial. Massage options include deep tissue, Indian head massage, and the Lava Shell Relax range using heated shells. Facials use Elemis formulas across three Expert Touch options for anti aging, resurfacing, or hydration. The Elemis Peaceful Pregnancy Massage is available from the second trimester. Treatments can be booked as part of day spa packages or separately.`,
    },

    // FAQ 5: Afternoon tea packages
    {
      question: `Does ${spa.name} offer spa packages with afternoon tea?`,
      answer: (
        <>
          Yes, several of the Garden Spa&apos;s day packages include afternoon tea. The most affordable option is the{' '}
          <Link href="#appleby-thermal-light-tea-weekday" className="underline">
            Aqua Thermal Journey with Light Afternoon Tea
          </Link>{' '}
          , starting from {lightTeaWeekdayPrice || '£49'} per person on weekdays ({lightTeaWeekendPrice || '£59'} weekends). This includes a {lightTeaDuration || '2 hour'} thermal journey followed by sandwiches, a scone with jam and cream, and biscuits.
          <br />
          <br />
          For a fuller experience, the{' '}
          <Link href="#appleby-thermal-spa-experience-weekday" className="underline">
            Aqua Thermal Spa Experience with Lunch or Afternoon Tea
          </Link>{' '}
          starts from {thermalMealWeekdayPrice || '£60'} weekdays ({thermalMealWeekendPrice || '£65'} weekends) and lets you choose between a full afternoon tea or a 2 course lunch after your {thermalMealDuration || '2 hour'} spa session. The{' '}
          <Link href="#appleby-luxurience-weekday" className="underline">
            Luxurience packages
          </Link>{' '}
          from {luxurienceWeekdayPrice || '£89'} also offer the lunch or afternoon tea choice, and add a {treatment25Min || '25 minute'} treatment and an extra hour of spa access.
          <br />
          <br />
          All afternoon tea options pair with the full Aqua Thermal Journey including the hydrotherapy pool, outdoor spa garden, and thermal suite. See all{' '}
          <Link href="#day-passes" className="underline">
            spa day packages
          </Link>{' '}
          for the complete range.
        </>
      ),
      schemaText: `Yes, several Garden Spa day packages include afternoon tea. The Aqua Thermal Journey with Light Afternoon Tea starts from ${lightTeaWeekdayPrice || '£49'} weekdays (${lightTeaWeekendPrice || '£59'} weekends) with a ${lightTeaDuration || '2 hour'} thermal journey and light tea. The Aqua Thermal Spa Experience from ${thermalMealWeekdayPrice || '£60'} weekdays lets you choose between full afternoon tea or 2 course lunch. Luxurience packages from ${luxurienceWeekdayPrice || '£89'} add a ${treatment25Min || '25 minute'} treatment plus the lunch or afternoon tea choice. All options include access to the hydrotherapy pool, outdoor spa garden, and thermal suite.`,
    },
  ];
}

