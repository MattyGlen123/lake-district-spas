import { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import FAQs, { generateFAQSchema } from '@/components/FAQs';
import { spaData } from '@/data/spas';
import { getLocationFAQs } from '@/data/location-faqs';
import RelatedLocations from '@/components/location/RelatedLocations';

export const metadata: Metadata = {
  title: 'Spas in Ambleside | Lake District Spas',
  description:
    "Discover the exclusive spa in Ambleside, the Lake District's walking capital. Waterfall Spa offers intimate wellness for hotel guests.",
};

// Filter spas for Ambleside
// Ambleside spa: Ambleside Salutation Hotel & Spa (id: 8)
const amblesideSpas = spaData.filter((spa) => spa.location === 'Ambleside');
const faqs = getLocationFAQs('Ambleside');

const heroContent = {
  badge: 'Ambleside Spa',
  titleLine1: 'Spas in',
  titleLine2: 'Ambleside',
  description:
    "The Lake District's walking capital meets village wellness. An intimate spa retreat in the heart of one of Lakeland's most beloved villages.",
  imageSrc: '/images/locations/ambleside-lake-district-spa-breaks.jpg',
  imageAlt:
    'Panoramic summer view across green fields and dry stone walls toward Ambleside village nestled beside the lake, with Lakeland fells rising on both sides of the valley in the Lake District National Park',
};

const introContent = `Ambleside sits where lake meets fell, a slate-grey village at the head of Windermere that has drawn walkers and romantics for generations. The fells rise directly from the village streets, including Loughrigg, Wansfell, and the Fairfield Horseshoe, making this the natural base for couples who want to combine spa relaxation with Lakeland exploration.

The village itself rewards wandering. Independent shops line the narrow streets, centuries-old pubs serve local ales, and the waterfall at Stock Ghyll Force tumbles through ancient woodland just minutes from the centre. Lake Windermere's northern shore lies a short stroll away, with steamers departing for Bowness and beyond.

For spa seekers, Ambleside offers something different: exclusivity. The Waterfall Spa at Ambleside Salutation Hotel is reserved entirely for hotel guests. No day visitors, no crowds, just quiet relaxation in a 350-year-old coaching inn on Lake Road. The 13-metre pool features a starlit fibre optic ceiling that transforms evening swims into something atmospheric. An outdoor hydrotherapy pool brings even more fresh air to the spa experience.

The thermal facilities include an infrared sauna for deep tissue relaxation, particularly welcome after a day on the fells, plus steam room, ice fountain, and poolside hot tub. The treatment menu features 18 Elemis therapies including the Walkers Leg Massage, designed specifically for tired legs after fell walking. It's a spa that understands its location.

For couples seeking a Lake District escape that balances activity with indulgence, Ambleside delivers. Walk to Rydal Water in the morning, lunch in the village, spa in the afternoon, dinner at one of the excellent local restaurants. The compact geography means everything is within reach without needing a car.`;

const relatedLocations = [
  { name: 'Windermere', slug: 'windermere', distance: '6 miles south', image: '/images/locations/windermere-lake-district-spa-breaks.jpg' },
  { name: 'Grasmere', slug: 'grasmere', distance: '4 miles north', image: '/images/locations/grasmere-lake-district-spa-breaks.jpg' },
  { name: 'Great Langdale', slug: 'great-langdale', distance: '5 miles west', image: '/images/locations/great-langdale-lake-district-spa-breaks.jpg' },
];

export default function AmblesideSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={amblesideSpas}
          sectionLabel={`${amblesideSpas.length} ${amblesideSpas.length === 1 ? 'Spa' : 'Spas'} in Ambleside`}
          sectionTitle="Village Spa"
        />

        {faqs.length > 0 && (
          <div className="bg-[#FAF9F6]"> 
            <div className="container mx-auto px-4 md:px-8">
              <FAQs
                id="faq"
                title="Common Questions"
                subtitle="Frequently asked questions about spas in Ambleside."
                icon={HelpCircle}
                faqs={faqs}
              />
            </div>
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
          currentLocation="Ambleside"
          locations={relatedLocations}
          backgroundColor={faqs.length > 0 ? 'bg-white' : undefined}
        />
      </main>

      <Footer />
    </div>
  );
}

