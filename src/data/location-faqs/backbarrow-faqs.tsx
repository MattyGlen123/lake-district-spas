import { FAQ } from '@/components/FAQs';
import Link from 'next/link';
import { Spa } from '@/types/spa';
import {
  getDayPassPrice,
  getDayPassPricePerPerson,
  getTreatmentPrice,
  getTreatmentBrandsText,
  getThermalFacilitiesCount,
} from '@/data/faqs/helpers';

export function getBackbarrowFAQs(spas: Spa[]): FAQ[] {
  const whitewater = spas.find((s) => s.id === 13);

  // Day pass prices
  const luxuriousSpaPrice = getDayPassPrice(13, 'whitewater-luxurious-spa-afternoon-tea');
  const purePamperingPrice = getDayPassPrice(13, 'whitewater-pure-pampering');
  const weekdayEscapePrice = getDayPassPrice(13, 'whitewater-weekday-escape');
  const couplesRetreatPrice = getDayPassPrice(13, 'whitewater-couples-retreat');
  const couplesPerPersonPrice = getDayPassPricePerPerson(13, 'whitewater-couples-retreat');

  // Treatment and facility values
  const rasulPrice = getTreatmentPrice(13, 'Fango Mud Rasul');
  const brandsText = whitewater ? getTreatmentBrandsText(whitewater.id) : null;
  const thermalCount = whitewater ? getThermalFacilitiesCount(whitewater) : null;

  return [
    {
      question:
        'Are there any spa day deals at the Whitewater Hotel in Backbarrow?',
      answer: (
        <>
          Yes, the{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}`}
            className="underline"
          >
            {whitewater?.name || 'Whitewater Hotel & Leisure Club'}
          </Link>{' '}
          offers four spa day packages starting from {luxuriousSpaPrice || '£60'}{' '}
          per person. Every package includes 4 hours of spa access, a treatment,
          and afternoon tea.
          <br />
          <br />
          The{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}#whitewater-luxurious-spa-afternoon-tea`}
            className="underline"
          >
            Luxurious Spa With Afternoon Tea
          </Link>{' '}
          at {luxuriousSpaPrice || '£60'} is the best value option, including a 30
          minute treatment of your choice plus afternoon tea. For a more
          indulgent day, the{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}#whitewater-pure-pampering`}
            className="underline"
          >
            Pure Pampering
          </Link>{' '}
          package at {purePamperingPrice || '£90'} upgrades to a full body Elemis
          massage. The{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}#whitewater-weekday-escape`}
            className="underline"
          >
            Weekday Escape
          </Link>{' '}
          at {weekdayEscapePrice || '£90'} offers two 30 minute treatments with
          afternoon tea or light lunch, available Monday to Friday.
          <br />
          <br />
          All packages include the heated indoor pool, outdoor jacuzzi,
          Turkish Hamam steam room, and sauna. Browse all options on our{' '}
          <Link href="/spa-days" className="underline">
            spa days page
          </Link>
          .
        </>
      ),
      schemaText: `Yes, the ${whitewater?.name || 'Whitewater Hotel & Leisure Club'} offers four spa day packages starting from ${luxuriousSpaPrice || '£60'} per person. Every package includes 4 hours of spa access, a treatment, and afternoon tea. The Luxurious Spa With Afternoon Tea at ${luxuriousSpaPrice || '£60'} is the best value option, including a 30 minute treatment plus afternoon tea. Pure Pampering at ${purePamperingPrice || '£90'} upgrades to a full body Elemis massage. The Weekday Escape at ${weekdayEscapePrice || '£90'} offers two 30 minute treatments with afternoon tea or light lunch, available Monday to Friday. All packages include the heated indoor pool, outdoor jacuzzi, Turkish Hamam steam room, and sauna.`,
    },
    {
      question: 'Is there a spa near Newby Bridge?',
      answer: (
        <>
          The nearest spa to Newby Bridge is the{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}`}
            className="underline"
          >
            {whitewater?.name || 'Whitewater Hotel & Leisure Club'}
          </Link>{' '}
          in Backbarrow, just one mile south. It features the Lake
          District&apos;s first Rasul Mud Temple, an outdoor jacuzzi overlooking
          the River Leven, and {thermalCount || 4} thermal facilities including a
          Turkish Hamam aromatherapy steam room.
          <br />
          <br />
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}#day-passes`}
            className="underline"
          >
            Day spa packages
          </Link>{' '}
          are available from {luxuriousSpaPrice || '£60'} per
          person with no overnight stay required. The spa is adults only (18+)
          and all packages include 4 hours of access to the pool, jacuzzi, and
          thermal suite. {brandsText ? `Treatments use ${brandsText}` : 'Elemis treatments are available'}.
          <br />
          <br />
          For more options in the southern Lakes, see{' '}
          <Link
            href="/location/spas-in-newby-bridge"
            className="underline"
          >
            spas in Newby Bridge
          </Link>{' '}
          and{' '}
          <Link
            href="/location/spas-in-windermere"
            className="underline"
          >
            spas in Windermere
          </Link>
          , approximately 6 miles north.
        </>
      ),
      schemaText: `The nearest spa to Newby Bridge is the ${whitewater?.name || 'Whitewater Hotel & Leisure Club'} in Backbarrow, just one mile south. It features the Lake District's only Rasul Mud Temple, an outdoor jacuzzi overlooking the River Leven, and ${thermalCount || 4} thermal facilities including a Turkish Hamam aromatherapy steam room. Day spa packages are available from ${luxuriousSpaPrice || '£60'} per person with no overnight stay required. The spa is adults only (18+) and all packages include 4 hours of access to the pool, jacuzzi, and thermal suite. ${brandsText ? `Treatments use ${brandsText}` : 'Elemis treatments are available'}. For more options, spas in Newby Bridge and Windermere are approximately 6 miles north.`,
    },
    {
      question: 'Can couples visit the spa in Backbarrow?',
      answer: (
        <>
          Yes, couples are welcome at the{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}`}
            className="underline"
          >
            {whitewater?.name || 'Whitewater Hotel & Leisure Club'}
          </Link>
          . The dedicated{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}#whitewater-couples-retreat`}
            className="underline"
          >
            Couples Retreat
          </Link>{' '}
          package costs {couplesPerPersonPrice || '£110'}{' '}
          per person and includes a private Luxury Mud Rasul session, a 30
          minute Elemis back massage each, afternoon tea, and 4 hours of full
          spa access.
          <br />
          <br />
          The Rasul Mud Temple is what makes this couples experience unique. An Arabian inspired steam chamber
          where you apply mineral rich muds together before the steam cycle
          cleanses and softens the skin. The experience takes around 45 minutes
          and is priced at {rasulPrice || '£79'} if booked separately as a{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}#treatments`}
            className="underline"
          >
            standalone treatment
          </Link>
          .
          <br />
          <br />
          The spa is adults only (18+), so couples can enjoy a peaceful
          atmosphere throughout. Any of the other{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}#day-passes`}
            className="underline"
          >
            day pass packages
          </Link>{' '}
          can also be booked for two people.
        </>
      ),
      schemaText: `Yes, couples are welcome at the ${whitewater?.name || 'Whitewater Hotel & Leisure Club'}. The dedicated Couples Retreat package costs ${couplesRetreatPrice || '£220'} total (${couplesPerPersonPrice || '£110'} per person) and includes a private Luxury Mud Rasul session, a 30 minute Elemis back massage each, afternoon tea, and 4 hours of full spa access. The Rasul Mud Temple is the only one in the Lake District, an Arabian inspired steam chamber where you apply mineral rich muds together before the steam cycle cleanses and softens the skin. The experience takes around 45 minutes and is priced at ${rasulPrice || '£79'} if booked separately. The spa is adults only (18+), so couples can enjoy a peaceful atmosphere.`,
    },
    {
      question: 'Is there a riverside spa in the Lake District?',
      answer: (
        <>
          The{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}`}
            className="underline"
          >
            {whitewater?.name || 'Whitewater Hotel & Leisure Club'}
          </Link>{' '}
          in Backbarrow is the Lake District&apos;s riverside spa, set on the
          banks of the River Leven where it flows from Lake Windermere toward
          Morecambe Bay. The outdoor jacuzzi overlooks the river, and the
          Cascades indoor pool features a distinctive multi level design beneath
          vaulted ceilings with natural daylight.
          <br />
          <br />
          The riverside setting shapes the whole experience. Backbarrow is a
          quiet hamlet in the southern Lakes, far removed from the busier tourist
          villages further north. The spa offers {thermalCount || 4} thermal
          facilities including the Lake District&apos;s only Rasul Mud Temple and
          a Turkish Hamam aromatherapy steam room.{' '}
          <Link
            href={`/spa/${whitewater?.url || 'whitewater-hotel-leisure-club'}#day-passes`}
            className="underline"
          >
            Day spa packages
          </Link>{' '}
          start from {luxuriousSpaPrice || '£60'} per person, all including
          afternoon tea and a treatment.
          <br />
          <br />
          While many Lake District spas offer lake views, the Whitewater
          Hotel&apos;s river setting provides something different. The nearby{' '}
          <Link
            href="/location/spas-in-newby-bridge"
            className="underline"
          >
            Newby Bridge
          </Link>{' '}
          and{' '}
          <Link
            href="/location/spas-in-windermere"
            className="underline"
          >
            Windermere
          </Link>{' '}
          locations offer lakeside spa alternatives if you prefer water views on
          a grander scale.
        </>
      ),
      schemaText: `The ${whitewater?.name || 'Whitewater Hotel & Leisure Club'} in Backbarrow is the Lake District's riverside spa, set on the banks of the River Leven. The outdoor jacuzzi overlooks the river, and the Cascades indoor pool features a distinctive multi level design beneath vaulted ceilings. Backbarrow is a quiet hamlet in the southern Lakes. The spa offers ${thermalCount || 4} thermal facilities including the Lake District's only Rasul Mud Temple and a Turkish Hamam aromatherapy steam room. Day spa packages start from ${luxuriousSpaPrice || '£60'} per person, all including afternoon tea and a treatment. While many Lake District spas offer lake views, the Whitewater Hotel's river setting provides something different.`,
    },
  ];
}
