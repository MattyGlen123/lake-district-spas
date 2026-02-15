import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import { HelpCircle } from 'lucide-react';
import FAQs, { generateFAQSchema } from '@/components/FAQs';
import { getLocationFAQs } from '@/data/location-faqs';
import { spaData } from '@/data/spas';

export const metadata: Metadata = {
  title: 'Spas in Bassenthwaite | Lake District Spas',
  description:
    'Discover Armathwaite Hall Spa on Bassenthwaite Lake. Outdoor infinity pools, Amethyst Crystal Cave steam room, and 400 acres of deer park in the northern Lake District.',
};

// Filter spas for Bassenthwaite
// Bassenthwaite spa: Armathwaite Hall Hotel & Spa (id: 2)
const bassenthwaiteSpas = spaData.filter(
  (spa) => spa.location === 'Bassenthwaite'
);

const heroContent = {
  badge: 'Bassenthwaite Spa',
  titleLine1: 'Spas in',
  titleLine2: 'Bassenthwaite',
  description:
    "Country estate grandeur on England's only true lake. A 400-acre deer park, outdoor infinity pools, and an Amethyst Crystal Cave steam room await.",
  imageSrc: '/images/locations/bassenthwaite-lake-district-spa-breaks.jpg',
  imageAlt:
    'Dramatic fell reflected in the mirror-still waters of Bassenthwaite Lake on a clear summer day, with native woodland along the shoreline in the northern Lake District near Keswick',
};

const introContent = `Bassenthwaite Lake holds a quiet distinction: it is the only body of water in the Lake District officially named a lake, the others being meres, waters and tarns. This northern reach of the national park trades the busier shores of Windermere for something more secluded, ancient woodland, osprey nesting sites, and the kind of stillness that draws those seeking genuine escape.

The lake sits in the shadow of Skiddaw, England's fourth highest peak, with the market town of Keswick a short drive south. Walkers know this area for the Coledale Horseshoe and the quieter fells of the northern Lakes. Couples know it for one of the region's most impressive spa estates.

The turreted Victorian mansion has been welcoming guests since the 1800s, but the spa brings contemporary luxury to this historic setting. Multiple outdoor infinity pools gaze across manicured parkland to the fells beyond, their edges seeming to merge with the landscape. An outdoor hot tub offers the same views with the added pleasure of thermal warmth.

Inside, a 16-metre indoor infinity pool anchors the wellness facilities, while the thermal suite delivers genuine distinctiveness. The Amethyst Crystal Cave steam room takes its name seriously, this is not merely a marketing flourish but an immersive crystal-lined chamber designed for deep heat experiences. A traditional Finnish sauna provides the classic counterpoint.

The treatment menu spans 34 experiences, with thoughtful touches that acknowledge the setting. The Herbal Sleep Cocoon wrap is designed specifically to promote restful sleep after fell walking, the kind of detail that suggests a spa genuinely integrated with its landscape rather than simply positioned within it.

Spa access comes complimentary for hotel guests, while day visitors can choose from packages starting at £70 for a morning Sunrise Spa through to full-day experiences with treatments and lunch. For couples seeking the combination of country house grandeur and contemporary wellness, Bassenthwaite offers something the busier central Lakes cannot match: space, silence, and the rare pleasure of deer grazing outside your window.`;

const faqs = getLocationFAQs('Bassenthwaite');

const relatedLocations = [
  { name: 'Ullswater', slug: 'ullswater', distance: '20 miles east' },
  { name: 'Borrowdale', slug: 'borrowdale', distance: '10 miles south' },
  { name: 'Penrith', slug: 'penrith', distance: '18 miles east' },
];

export default function BassenthwaiteSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={bassenthwaiteSpas}
          sectionLabel={`${bassenthwaiteSpas.length} ${bassenthwaiteSpas.length === 1 ? 'Spa' : 'Spas'} in Bassenthwaite`}
          sectionTitle="Country Estate Spa"
        />
        {faqs.length > 0 && (
          <div className="container mx-auto px-4 md:px-8">
            <FAQs
              id="faq"
              title="Common Questions"
              subtitle="Frequently asked questions about spas in Bassenthwaite."
              icon={HelpCircle}
              faqs={faqs}
            />
          </div>
        )}
        <RelatedLocations
          currentLocation="Bassenthwaite"
          locations={relatedLocations}
        />
      </main>

      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
        />
      )}
      <Footer />
    </div>
  );
}

