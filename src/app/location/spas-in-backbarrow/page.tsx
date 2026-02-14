import { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import FAQs, { generateFAQSchema } from '@/components/FAQs';
import { spaData } from '@/data/spas';
import { getLocationFAQs } from '@/data/location-faqs';

export const metadata: Metadata = {
  title: 'Spas in Backbarrow | Lake District Spas',
  description:
    "Discover riverside spa relaxation at Whitewater Hotel in Backbarrow. The Lake District's only Rasul Mud Temple and an outdoor jacuzzi overlooking River Leven.",
};

// Filter spas for Backbarrow
// Backbarrow spa: Whitewater Hotel & Leisure Club (id: 13)
const backbarrowSpas = spaData.filter((spa) => spa.location === 'Backbarrow');
const faqs = getLocationFAQs('Backbarrow');

const heroContent = {
  badge: 'Backbarrow Spa',
  titleLine1: 'Spas in',
  titleLine2: 'Backbarrow',
  description:
    "Riverside wellness where the River Leven flows from Windermere to the sea. An intimate spa retreat featuring a Rasul Mud Temple and outdoor jacuzzi overlooking the water.",
};

const introContent = `Backbarrow sits where the River Leven begins its journey from Lake Windermere to Morecambe Bay, a quiet hamlet that most visitors pass without stopping. Once an industrial village, its 17th-century blast furnace produced iron for centuries. Today it offers something rarer: riverside tranquility just a mile from England's largest lake, yet entirely removed from the tourist bustle.

The setting shapes the spa experience here. The Whitewater Hotel occupies a peaceful stretch of the Leven's banks within Lakeland Village, its outdoor jacuzzi overlooking water that still runs clear and fast toward the coast. Inside, the Cascades pool creates an unexpected sense of space, with stepping stones crossing the water beneath vaulted ceilings.

What makes this spa genuinely distinctive is the Rasul Mud Temple. This Arabian-inspired thermal experience involves applying mineral-rich muds in a private steam chamber, a deeply cleansing ritual that feels worlds away from standard spa treatments. The Turkish Hamam aromatherapy steam room continues the theme, offering something more exotic than the typical sauna-and-steam circuit.

Day spa packages welcome visitors alongside hotel guests, with Elemis treatments completing the wellness offering. The quieter southern Lakes location means you're unlikely to encounter crowds even at peak times.

Backbarrow works particularly well as part of a southern Lakes itinerary. Newby Bridge lies a mile north with its historic bridge and lake steamers. The market town of Ulverston, birthplace of Stan Laurel, sits a few miles south, while Cartmel and its famous priory are within easy reach. It's a quieter corner of the Lake District that rewards those who venture beyond the honeypot villages.`;

const relatedLocations = [
  { name: 'Newby Bridge', slug: 'newby-bridge', distance: '1 mile north' },
  { name: 'Windermere', slug: 'windermere', distance: '6 miles north' },
  { name: 'Grange-over-Sands', slug: 'grange-over-sands', distance: '8 miles south' },
];

export default function BackbarrowSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={backbarrowSpas}
          sectionLabel={`${backbarrowSpas.length} ${backbarrowSpas.length === 1 ? 'Spa' : 'Spas'} in Backbarrow`}
          sectionTitle="Riverside Spa"
        />
        {faqs.length > 0 && (
          <div className="container mx-auto px-4 md:px-8">
            <FAQs
              id="faq"
              title="Common Questions"
              subtitle="Frequently asked questions about spas in Backbarrow."
              icon={HelpCircle}
              faqs={faqs}
            />
          </div>
        )}

        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateFAQSchema(faqs)),
            }}
          />
        )}

        <RelatedLocations
          currentLocation="Backbarrow"
          locations={relatedLocations}
        />
      </main>

      <Footer />
    </div>
  );
}

