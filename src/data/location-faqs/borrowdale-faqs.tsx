import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentBrandsText,
  getThermalFacilitiesCount,
  getSpaAccessPriceRange,
} from '@/data/faqs/helpers';
import { getLocationTreatmentCount } from './helpers';

export function getBorrowdaleFAQs(spas: Spa[]): FAQ[] {
  const lodoreFalls = spas.find((s) => s.id === 1);

  // Day pass prices
  const twilightPrice = getDayPassPrice(1, 'lodore-falls-twilight-spa');
  const renewPrice = getDayPassPrice(1, 'lodore-falls-renew-spa');
  const restartPrice = getDayPassPrice(1, 'lodore-falls-restart-spa');
  const rasulPrice = getDayPassPrice(1, 'lodore-falls-rasul-ritual');

  // Durations
  const twilightDuration = getDayPassDuration(1, 'lodore-falls-twilight-spa');
  const renewDuration = getDayPassDuration(1, 'lodore-falls-renew-spa');

  // Facility and treatment values
  const thermalCount = lodoreFalls
    ? getThermalFacilitiesCount(lodoreFalls)
    : null;
  const brandsText = lodoreFalls
    ? getTreatmentBrandsText(lodoreFalls.id)
    : null;
  const accessPriceRange = lodoreFalls
    ? getSpaAccessPriceRange(lodoreFalls)
    : null;
  const treatmentCount = getLocationTreatmentCount(spas);

  return [
    // FAQ 1: lodore hotel borrowdale (50,000/mo, Medium)
    {
      question: 'Is there a spa at the Lodore hotel in Borrowdale?',
      answer: (
        <>
          Yes.{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}`}
            className="underline"
          >
            {lodoreFalls?.name || 'Lodore Falls Hotel & Spa'}
          </Link>{' '}
          has a purpose built spa at the northern end of Borrowdale, where the
          hotel sits beside Derwentwater with Lodore Falls cascading behind the
          property. The spa is open to both hotel guests and day visitors.
          <br />
          <br />
          The centrepiece is a 16 metre outdoor infinity edge vitality pool with
          underwater bubble loungers, hydromassage neck jets, and views across
          the lake to Catbells. Inside, the thermal suite includes{' '}
          {thermalCount || 9} heat experiences spanning a Finnish sauna, herbal
          sauna, Roman laconium, salt steam room, aroma steam room, ice
          fountain, and heated loungers. A private Rasul chamber offers
          Moroccan mud rituals for small groups.
          <br />
          <br />
          Suite guests receive{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#access-policy`}
            className="underline"
          >
            complimentary spa access
          </Link>{' '}
          for 2 hours per night, while standard room guests can book sessions
          from {accessPriceRange || '£35 per person Monday to Thursday, or £40 per person Friday to Sunday'}.{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#day-passes`}
            className="underline"
          >
            Day spa packages
          </Link>{' '}
          for non residents start from {twilightPrice || '£75'}.
        </>
      ),
      schemaText: `Yes. ${lodoreFalls?.name || 'Lodore Falls Hotel & Spa'} has a purpose built spa at the northern end of Borrowdale, beside Derwentwater with Lodore Falls behind the property. The centrepiece is a 16 metre outdoor infinity edge vitality pool with bubble loungers, hydromassage jets, and lake views to Catbells. The thermal suite includes ${thermalCount || 9} heat experiences: Finnish sauna, herbal sauna, Roman laconium, salt steam room, aroma steam room, ice fountain, and heated loungers. A Rasul chamber offers Moroccan mud rituals. Suite guests receive 2 hours complimentary spa access per night. Standard room guests can book sessions from ${accessPriceRange || '£35-40 per person'}. Day spa packages for non residents start from ${twilightPrice || '£75'}.`,
    },

    // FAQ 2: lodore falls half spa day (50/mo, Unknown)
    {
      question: 'Can you book a half spa day at Lodore Falls?',
      answer: (
        <>
          Yes. All spa sessions at{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}`}
            className="underline"
          >
            {lodoreFalls?.name || 'Lodore Falls Hotel & Spa'}
          </Link>{' '}
          run as {renewDuration || '2 hours'} slots, making them a half day
          experience rather than a full day visit. There are five{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#day-passes`}
            className="underline"
          >
            day spa packages
          </Link>{' '}
          to choose from, each including thermal suite access, the outdoor
          infinity pool, and relaxation areas.
          <br />
          <br />
          The most affordable option is the{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#lodore-falls-twilight-spa`}
            className="underline"
          >
            Twilight Spa
          </Link>{' '}
          at {twilightPrice || '£75'} for a {twilightDuration || '2 hours'}{' '}
          evening session with prosecco in the Champagne Bar. For a half day
          with a treatment, the{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#lodore-falls-renew-spa`}
            className="underline"
          >
            Falls Renew
          </Link>{' '}
          package at {renewPrice || '£150'} includes a 50 minute treatment plus
          a hot drink and traybake. The{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#lodore-falls-restart-spa`}
            className="underline"
          >
            Restart
          </Link>{' '}
          package at {restartPrice || '£180'} adds a 2 course lunch or
          afternoon tea.
          <br />
          <br />
          For couples or small groups, the{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#lodore-falls-rasul-ritual`}
            className="underline"
          >
            Rasul Ritual
          </Link>{' '}
          from {rasulPrice || '£125'} per person includes a shared mud
          treatment, prosecco, and afternoon tea. All packages must be booked in
          advance and are for guests aged 18 and over.
        </>
      ),
      schemaText: `Yes. All spa sessions at ${lodoreFalls?.name || 'Lodore Falls Hotel & Spa'} run as ${renewDuration || '2 hours'} slots, making them a half day experience. Five day spa packages are available, each including thermal suite access, the outdoor infinity pool, and relaxation areas. The Twilight Spa costs ${twilightPrice || '£75'} for an evening session with prosecco. The Falls Renew at ${renewPrice || '£150'} includes a 50 minute treatment, hot drink, and traybake. The Restart at ${restartPrice || '£180'} adds a 2 course lunch or afternoon tea. For couples, the Rasul Ritual from ${rasulPrice || '£125'} per person includes a shared mud treatment, prosecco, and afternoon tea. All packages must be booked in advance and are for guests aged 18 and over.`,
    },

    // FAQ 3: borrowdale spa (50/mo, Medium)
    {
      question: 'What spa facilities are available in Borrowdale?',
      answer: (
        <>
          Borrowdale has one spa,{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}`}
            className="underline"
          >
            The Falls Spa at Lodore Falls Hotel
          </Link>
          , which sits at the northern end of the valley on the shore of
          Derwentwater. Despite being a single venue, the facility is one of the
          most comprehensive in the Lake District.
          <br />
          <br />
          The outdoor 16 metre infinity edge vitality pool is the standout
          feature, with underwater bubble loungers and views across the lake to
          Catbells. The{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#thermal-facilities`}
            className="underline"
          >
            thermal suite
          </Link>{' '}
          has {thermalCount || 9} experiences: a panoramic Finnish sauna, herbal
          sauna, Roman laconium, aroma steam room, salt steam room, experience
          showers, ice fountain, cold drench bucket, and heated loungers. A
          private Rasul chamber seats up to four guests for a guided Moroccan
          mud ritual.
          <br />
          <br />
          Five{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#treatments`}
            className="underline"
          >
            treatment rooms
          </Link>{' '}
          deliver therapies using {brandsText || 'ishga and ELEMIS products'},
          and a Champagne bar serves drinks between sessions. For other spa
          options nearby, {' '}
          <Link href="/location/spas-in-bassenthwaite" className="underline">
            Bassenthwaite
          </Link>{' '}
          is 8 miles northwest and{' '}
          <Link href="/location/spas-in-grasmere" className="underline">
            Grasmere
          </Link>{' '}
          is 7 miles south.
        </>
      ),
      schemaText: `Borrowdale has one spa, The Falls Spa at Lodore Falls Hotel, at the northern end of the valley on Derwentwater. The outdoor 16 metre infinity edge vitality pool has bubble loungers and views to Catbells. The thermal suite offers ${thermalCount || 9} experiences: panoramic Finnish sauna, herbal sauna, Roman laconium, aroma steam room, salt steam room, experience showers, ice fountain, cold drench bucket, and heated loungers. A Rasul chamber seats up to four for a Moroccan mud ritual. Five treatment rooms use ${brandsText || 'ishga and ELEMIS products'}, and a Champagne bar serves drinks between sessions. Bassenthwaite is 8 miles northwest and Grasmere 7 miles south for other spa options.`,
    },

    // FAQ 4: lodore falls spa treatments (50/mo, Medium/37)
    {
      question: 'What spa treatments can you book in Borrowdale?',
      answer: (
        <>
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#treatments`}
            className="underline"
          >
            {lodoreFalls?.name || 'Lodore Falls Hotel & Spa'}
          </Link>{' '}
          offers over{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#treatments`}
            className="underline"
          >
            {treatmentCount || 35} treatments
          </Link>{' '}
          across its five treatment rooms, using{' '}
          {brandsText || 'ishga and ELEMIS products'}. All treatments are 50
          minutes unless stated otherwise, with most priced at £100.
          <br />
          <br />
          The ishga range draws on Scottish seaweed based skincare and includes
          full body massages, facials, and combination treatments such as a mini
          facial with salt oil scrub. ELEMIS treatments focus on advanced
          facials using their expert tech and expert touch ranges, covering
          everything from sculpting and firming to radiance and rejuvenation.
          Standalone options include reflexology, bamboo massage, and the
          signature Falls Deluxe Trio combining a back, neck and shoulder
          massage with a mini facial and head massage.
          <br />
          <br />
          The{' '}
          <Link
            href={`/spa/${lodoreFalls?.url || 'lodore-falls-spa'}#journey-of-the-senses-rasul-ritual`}
            className="underline"
          >
            Journey of the Senses Rasul Ritual
          </Link>{' '}
          is a 60 minute guided mud treatment in the private Rasul chamber,
          available from £60 per person. Pregnancy specific massages are also
          offered through both the ishga and ELEMIS menus.
        </>
      ),
      schemaText: `${lodoreFalls?.name || 'Lodore Falls Hotel & Spa'} offers over ${treatmentCount || 35} treatments across five treatment rooms, using ${brandsText || 'ishga and ELEMIS products'}. Most treatments are 50 minutes and priced at £100. The ishga range includes seaweed based facials, full body massages, and combinations like a mini facial with salt oil scrub. ELEMIS treatments focus on advanced facials using expert tech and expert touch ranges. Standalone options include reflexology, bamboo massage, and the Falls Deluxe Trio. The Journey of the Senses Rasul Ritual is a 60 minute guided mud treatment from £60 per person. Pregnancy specific massages are available through both ishga and ELEMIS.`,
    },
  ];
}
