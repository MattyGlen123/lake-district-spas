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
  title: 'Spas in Keswick | Lake District Spas',
  description:
    'Discover spas near Keswick in the Lake District. Underscar offers a 13-metre heated pool, hydrotherapy jacuzzi, sauna, and steam room on the slopes of Skiddaw above Derwentwater.',
};

// Filter spas for Keswick
// Keswick spa: The Spa at Underscar (id: 19)
const keswickSpas = spaData.filter((spa) => spa.location === 'Keswick');

const heroContent = {
  badge: 'Keswick Spa',
  titleLine1: 'Spas in',
  titleLine2: 'Keswick',
  description:
    "The northern hub of the Lake District, gateway to Skiddaw and Derwentwater, with a luxury cottage spa retreat on the sheltered slopes above the town.",
  imageSrc: '/images/locations/keswick-lake-district-spa-breaks.jpg',
  imageAlt:
    'View across Derwentwater from the slopes of Skiddaw above Keswick, showing the lake and surrounding fells in autumn colours with the town visible on the shoreline in the northern Lake District',
};

const introContent = `Keswick sits at the northern end of Derwentwater, where the lake's wooded shoreline gives way to an expansive market town that has served as the gateway to the northern fells for over two centuries. Surrounded by some of the Lake District's most recognisable summits — Skiddaw to the north, Blencathra to the east, Catbells and the Derwent Fells to the west — Keswick draws walkers, climbers, and those simply in search of dramatic Cumbrian scenery in equal measure.

The town itself is well equipped with independent shops, restaurants, and the famous Pencil Museum, but it is the landscape that defines the experience. The Borrowdale valley stretches south towards Honister Pass, and the ridge walk from Catbells across to Maiden Moor is among the most popular routes in the national park. The northern circuit of Derwentwater is a gentler option, tracing the wooded shores past landing stages where rowing boats and motor launches make use of the same water that has been drawing visitors since the Picturesque painters arrived in the 18th century.

The Spa at Underscar sits above Keswick on the sheltered slopes of Skiddaw, set within a five-star self-catering cottage estate converted from a 19th-century coach house and walled garden. The spa's 13-metre indoor heated pool looks across towards Derwentwater, and the hydrotherapy jacuzzi, eucalyptus sauna, and steam room provide a complete thermal experience for guests staying in the 25 cottages on the estate.

Spa access is included with all cottage bookings, giving guests an unhurried base from which to explore the northern fells before returning to the water and warmth. Germaine de Capuccini and NEOM Organics treatments are available to book in the softly lit treatment rooms, and day visitors can access the spa through bookable day packages ranging from an evening Twilight session to a full eight-hour spa day with treatments and High Tea.

For those wanting further spa options in the wider area, the Borrowdale valley lies five miles to the south, where The Falls Spa at Lodore Falls Hotel offers a 16-metre outdoor infinity pool with thermal suite. Armathwaite Hall Hotel and Spa in Bassenthwaite, five miles to the northwest, provides another full spa destination within easy reach of Keswick.`;

const faqs = getLocationFAQs('Keswick');

const relatedLocations = [
  {
    name: 'Borrowdale',
    slug: 'borrowdale',
    distance: '5 miles south',
    image: '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
  },
  {
    name: 'Bassenthwaite',
    slug: 'bassenthwaite',
    distance: '5 miles northwest',
    image: '/images/locations/bassenthwaite-lake-district-spa-breaks.jpg',
  },
  {
    name: 'Ullswater',
    slug: 'ullswater',
    distance: '15 miles east',
    image: '/images/locations/ullswater-lake-district-spa-breaks.jpg',
  },
];

export default function KeswickSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={keswickSpas}
          sectionLabel={`${keswickSpas.length} ${keswickSpas.length === 1 ? 'Spa' : 'Spas'} in Keswick`}
          sectionTitle="Keswick Spa"
        />
        {faqs.length > 0 && (
          <div className="bg-[#FAF9F6]">
            <div className="container mx-auto px-4 md:px-8">
              <FAQs
                id="faq"
                title="Common Questions"
                subtitle="Frequently asked questions about spas near Keswick."
                icon={HelpCircle}
                faqs={faqs}
              />
            </div>
          </div>
        )}
        <RelatedLocations
          currentLocation="Keswick"
          locations={relatedLocations}
          backgroundColor={'bg-white'}
        />
        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateFAQSchema(faqs)),
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
