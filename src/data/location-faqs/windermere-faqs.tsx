import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassDuration,
  getTreatmentPrice,
  getTreatmentBrandsText,
  getThermalFacilitiesCount,
  getAgePolicy,
} from '@/data/faqs/helpers';

export function getWindermereFAQs(spas: Spa[]): FAQ[] {
  const lowWoodBay = spas.find((s) => s.id === 7);
  const beechHill = spas.find((s) => s.id === 10);

  // Low Wood Bay values
  const lwbThermalCount = lowWoodBay
    ? getThermalFacilitiesCount(lowWoodBay)
    : null;
  const lwbBrandsText = lowWoodBay
    ? getTreatmentBrandsText(lowWoodBay.id)
    : null;
  const lwbAgePolicy = lowWoodBay ? getAgePolicy(lowWoodBay) : null;
  const lwbRechargePrice = lowWoodBay
    ? getDayPassPrice(lowWoodBay.id, 'low-wood-bay-recharge-spa')
    : null;
  const lwbHideawayPrice = lowWoodBay
    ? getDayPassPrice(lowWoodBay.id, 'low-wood-bay-hideaway-retreat')
    : null;
  const lwbHideawayDuration = lowWoodBay
    ? getDayPassDuration(lowWoodBay.id, 'low-wood-bay-hideaway-retreat')
    : null;

  // Beech Hill values
  const bhBrandsText = beechHill ? getTreatmentBrandsText(beechHill.id) : null;
  const bhSpaAccessPrice = beechHill
    ? getDayPassPrice(beechHill.id, 'beech-hill-spa-access-sunday-thursday')
    : null;
  const bhRejuvenatePrice = beechHill
    ? getDayPassPrice(beechHill.id, 'beech-hill-rejuvenate-spa-day')
    : null;
  const bhRelaxPrice = beechHill
    ? getDayPassPrice(beechHill.id, 'beech-hill-relax-spa-day')
    : null;
  const bhCouplesFullBodyPrice = beechHill
    ? getTreatmentPrice(beechHill.id, 'Couples Full Body Massage')
    : null;
  const bhCouplesBackPrice = beechHill
    ? getTreatmentPrice(beechHill.id, 'Couples Back, Neck and Shoulder')
    : null;

  return [
    {
      question: 'What are the best spa hotels in Windermere?',
      answer: (
        <>
          Windermere has two spa hotels on the shores of England&apos;s largest
          lake, each offering a distinctly different experience.{' '}
          <Link
            href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}`}
            className="underline"
          >
            {lowWoodBay?.name || 'Low Wood Bay Spa'}
          </Link>{' '}
          is the larger resort option with two outdoor infinity pools,{' '}
          {lwbThermalCount || 6} thermal experiences including an outdoor
          fellside sauna, and multiple hot tubs. It suits visitors who want
          variety, watersports on the lake, and a full day out.{' '}
          <Link
            href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}`}
            className="underline"
          >
            {beechHill?.name || 'Beech Hill Hotel & Spa'}
          </Link>{' '}
          is smaller and more intimate, with an outdoor hot tub on the lakeside
          terrace, and a secret gate leading to a private beach.
          <br />
          <br />
          The key difference for many visitors is access policy. Beech Hill
          includes complimentary spa access for all hotel guests, while Low Wood
          Bay charges separately for spa use. If spa access as part of your room
          rate matters, Beech Hill is the better fit. If you want the largest
          facilities and outdoor pools, Low Wood Bay is the clear choice. Both
          are {lwbAgePolicy || '16+'} for spa facilities. For more spas nearby,
          see{' '}
          <Link
            href="/location/spas-in-bowness-on-windermere"
            className="underline"
          >
            spas in Bowness on Windermere
          </Link>
          , just a few minutes down the road.
        </>
      ),
      schemaText: `Windermere has two spa hotels on the shores of England's largest lake. ${lowWoodBay?.name || 'Low Wood Bay Spa'} is the larger resort with two outdoor infinity pools, ${lwbThermalCount || 6} thermal experiences, and watersports on the lake. ${beechHill?.name || 'Beech Hill Hotel & Spa'} is smaller and more intimate with a maximum of 6 guests, an outdoor hot tub on the lakeside terrace, and a private beach. Beech Hill includes complimentary spa access for hotel guests, while Low Wood Bay charges separately. Both are ${lwbAgePolicy || '16+'} for spa facilities.`,
    },
    {
      question: 'Which Windermere spas have lake views?',
      answer: (
        <>
          Both Windermere spas have Lake Windermere views, but the experience is
          quite different at each.{' '}
          <Link
            href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}#pool`}
            className="underline"
          >
            {lowWoodBay?.name || 'Low Wood Bay Spa'}
          </Link>{' '}
          has two heated outdoor infinity pools that look directly across the
          water to the Langdale Pikes. The outdoor fellside sauna also has fell
          views, and the multiple hot tubs are positioned for evening stargazing
          over the lake. The indoor thermal pool has floor to ceiling windows
          framing the same panorama.
          <br />
          <br />
          <Link
            href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}#pool`}
            className="underline"
          >
            {beechHill?.name || 'Beech Hill Hotel & Spa'}
          </Link>{' '}
          takes a different approach. The signature outdoor hot tub sits on a
          lakeside terrace with direct, uninterrupted views across Windermere to
          the fells beyond. The 35 foot indoor pool has floor to ceiling windows
          maximising the lake vista, and dual vitality spa pools on the outdoor
          terrace provide hydrotherapy with the same views. Beyond the spa, a
          secret gate leads to the lakeshore for open water swimming from the
          hotel&apos;s private beach.
          <br />
          <br />
          For the most dramatic pool views, Low Wood Bay&apos;s infinity pools
          are hard to beat. For a quieter, more personal lake view experience
          with fewer guests around you, Beech Hill&apos;s terrace hot tub offers
          something special.
        </>
      ),
      schemaText: `Both Windermere spas have Lake Windermere views. ${lowWoodBay?.name || 'Low Wood Bay Spa'} has two heated outdoor infinity pools looking across the water to the Langdale Pikes, an outdoor fellside sauna with fell views, and multiple hot tubs for evening stargazing. ${beechHill?.name || 'Beech Hill Hotel & Spa'} has an outdoor hot tub on a lakeside terrace with direct Windermere views, a 35 foot indoor pool with floor to ceiling windows, and dual vitality spa pools on the outdoor terrace. A secret gate leads to the lakeshore for open water swimming.`,
    },
    {
      question: 'Can I book a couples spa day in Windermere?',
      answer: (
        <>
          Yes, both Windermere spas offer options for couples.{' '}
          <Link
            href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}#treatments`}
            className="underline"
          >
            {beechHill?.name || 'Beech Hill Hotel & Spa'}
          </Link>{' '}
          has dedicated couples treatments using{' '}
          {bhBrandsText || 'CAUDALIE products'}, including a{' '}
          <Link
            href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}#couples-full-body-massage`}
            className="underline"
          >
            Couples Full Body Massage
          </Link>{' '}
          ({bhCouplesFullBodyPrice || '£190'}, 50 minutes) and a{' '}
          <Link
            href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}#couples-back-neck-and-shoulder-massage`}
            className="underline"
          >
            Couples Back, Neck and Shoulder Massage
          </Link>{' '}
          ({bhCouplesBackPrice || '£140'}, 25 minutes). Beech Hill naturally
          creates an intimate couples atmosphere. Spa day packages start from{' '}
          {bhSpaAccessPrice || '£45'} per person for access only, or from{' '}
          {bhRelaxPrice || '£115'} including a treatment and afternoon tea.
          <br />
          <br />
          At{' '}
          <Link
            href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}#day-passes`}
            className="underline"
          >
            {lowWoodBay?.name || 'Low Wood Bay Spa'}
          </Link>
          , the standout couples option is{' '}
          <Link
            href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}#low-wood-bay-hideaway-retreat`}
            className="underline"
          >
            The Hideaway Retreat
          </Link>{' '}
          ({lwbHideawayPrice || '£300'} per person). This includes a 110 minute
          treatment in an exclusive couples room with heated beds, a salt bath,
          and Lake Windermere views, plus a {lwbHideawayDuration || '3 hours'}{' '}
          thermal journey, prosecco, and lunch or afternoon tea. For something
          more active together, the{' '}
          <Link
            href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}#low-wood-bay-sail-spa`}
            className="underline"
          >
            watersports
          </Link>{' '}
          and spa combination packages let couples kayak, paddleboard, or sail
          on the lake before relaxing in the thermal facilities.
        </>
      ),
      schemaText: `Yes, both Windermere spas offer couples options. ${beechHill?.name || 'Beech Hill Hotel & Spa'} has dedicated couples treatments including a Couples Full Body Massage (${bhCouplesFullBodyPrice || '£190'}, 50 minutes) and Couples Back, Neck and Shoulder Massage (${bhCouplesBackPrice || '£140'}, 25 minutes). With a maximum of 6 guests, it naturally creates an intimate atmosphere. ${lowWoodBay?.name || 'Low Wood Bay Spa'} offers The Hideaway Retreat (${lwbHideawayPrice || '£300'} per person) with a 110 minute treatment in an exclusive couples room with salt bath and lake views, plus thermal journey, prosecco, and dining.`,
    },
    {
      question: 'What spa treatments are available in Windermere?',
      answer: (
        <>
          Windermere&apos;s two spas use different treatment brands, giving
          visitors a genuine choice of styles.{' '}
          <Link
            href={`/spa/${lowWoodBay?.url || 'low-wood-bay-spa'}#treatments`}
            className="underline"
          >
            {lowWoodBay?.name || 'Low Wood Bay Spa'}
          </Link>{' '}
          offers treatments using{' '}
          {lwbBrandsText || 'Berry & Birch and ESPA products'}. The menu covers
          massages, facials, body scrubs, reflexology, and specialist options
          including pre natal treatments and cancer recovery therapies. Most
          treatments are 50 minutes, with longer 110 minute experiences
          available for full body rituals. Treatments start from{' '}
          {lwbRechargePrice || '£175'} when booked as part of the Recharge Spa
          Day which includes a {lwbHideawayDuration || '3 hours'} thermal
          journey and lunch.
          <br />
          <br />
          <Link
            href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}#treatments`}
            className="underline"
          >
            {beechHill?.name || 'Beech Hill Hotel & Spa'}
          </Link>{' '}
          uses exclusively {bhBrandsText || 'CAUDALIE products'}, the French
          vineyard skincare brand. The range includes six different facials
          targeting everything from hydration to anti ageing, plus full body and
          hot stone massages. Treatments run from 25 to 50 minutes, with the{' '}
          <Link
            href={`/spa/${beechHill?.url || 'beech-hill-hotel-spa'}#beech-hill-rejuvenate-spa-day`}
            className="underline"
          >
            Rejuvenate Spa Day
          </Link>{' '}
          ({bhRejuvenatePrice || '£140'}) including a 50 minute luxury CAUDALIE
          treatment with afternoon tea and fizz.
          <br />
          <br />
          If you prefer natural, locally inspired products, Low Wood Bay&apos;s
          Berry & Birch range is made with Lake District botanicals. For French
          vineyard skincare, Beech Hill&apos;s CAUDALIE offering is the only one
          in the area. Both spas require advance booking for treatments.
        </>
      ),
      schemaText: `Windermere's two spas use different treatment brands. ${lowWoodBay?.name || 'Low Wood Bay Spa'} offers treatments using ${lwbBrandsText || 'Berry & Birch and ESPA products'} including massages, facials, body scrubs, reflexology, and specialist options. Most treatments are 50 minutes with 110 minute experiences available. ${beechHill?.name || 'Beech Hill Hotel & Spa'} uses exclusively ${bhBrandsText || 'CAUDALIE products'}, the French vineyard skincare brand, with six different facials plus full body and hot stone massages. Treatments run from 25 to 50 minutes. Both spas require advance booking.`,
    },
  ];
}
