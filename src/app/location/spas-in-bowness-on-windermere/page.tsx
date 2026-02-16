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
  title: 'Spas in Bowness-on-Windermere | Lake District Spas',
  description:
    'Discover two spas in Bowness-on-Windermere at the heart of Lake Windermere. Historic lakeside elegance at the Old England or poolside prosecco at the Lakes Hotel.',
};

// Filter spas for Bowness-on-Windermere
// Bowness spas: Lakes Hotel & Spa (id: 18), Macdonald Old England Hotel & Spa (id: 6)
const bownessSpas = spaData.filter(
  (spa) => spa.location === 'Bowness-on-Windermere'
);

const heroContent = {
  badge: 'Bowness-on-Windermere Spas',
  titleLine1: 'Spas in',
  titleLine2: 'Bowness-on-Windermere',
  description:
    "The Lake District's beating heart, where lake cruises depart and two very different spas await. Historic lakeside elegance or poolside prosecco - Bowness offers both.",
  imageSrc:
    '/images/locations/bowness-on-windermere-lake-district-spa-breaks.jpg',
  imageAlt:
    'Aerial view of a tree-covered island surrounded by calm blue water on Lake Windermere near Bowness, with wooded shores and rolling Lakeland fells stretching into the distance on a summer morning',
};

const introContent = `Bowness-on-Windermere sits at the centre of everything. The piers here have launched lake cruises since Victorian times, ferrying visitors to Ambleside, Lakeside and the islands that dot England's largest lake. The village itself bustles with independent shops, restaurants and the World of Beatrix Potter attraction. This is the Lake District at its most accessible. Trains connect to Windermere station a mile uphill, coaches arrive daily, and the A591 brings traffic from every direction.

For couples seeking spa time alongside their Lake District exploration, Bowness delivers genuine choice. Two spa hotels occupy prime positions here, each with its own distinct character and appeal.

The Macdonald Old England Hotel represents the classic Lake District experience. This historic property stands directly on the lake shore, its mature gardens running down to private jetties where guests can moor boats or simply watch the water. The 20-metre indoor pool frames panoramic Windermere views through floor-to-ceiling windows. A traditional thermal suite includes Finnish sauna, aromatherapy steam room, ice room for contrast therapy, and experience showers. Spa access comes complimentary for hotel guests, while day visitors can book packages from £109 including treatments and lunch with lake views.

The Lakes Hotel & Spa takes an entirely different approach. This is spa as theatre - atmospheric mood lighting transforms the pool area after dark, and a poolside bar means you can genuinely sip prosecco while soaking in one of two feature hot tubs. The main pool has a signature "secret button" that makes the entire surface bubble, adding playfulness to proceedings. A cold plunge pool provides the contrast to sauna and steam room sessions. The spa operates extended hours until 10:30pm, making it ideal for evening relaxation. Access is exclusive to hotel guests, ensuring a more intimate atmosphere.

The village location means a trip to the spa slots easily into wider Lake District plans. Walk the shoreline promenade, take a cruise to Ambleside, explore Beatrix Potter's world, then return for thermal relaxation as the sun sets over the fells. Bowness puts you at the heart of the action while offering genuine retreat.`;

const faqs = getLocationFAQs('Bowness-on-Windermere');

const relatedLocations = [
  { name: 'Windermere', slug: 'windermere', distance: '1 mile north' },
  { name: 'Ambleside', slug: 'ambleside', distance: '5 miles north' },
  { name: 'Newby Bridge', slug: 'newby-bridge', distance: '7 miles south' },
];

export default function BownessSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={bownessSpas}
          sectionLabel={`${bownessSpas.length} ${bownessSpas.length === 1 ? 'Spa' : 'Spas'} in Bowness-on-Windermere`}
          sectionTitle="Bowness-on-Windermere Spas"
        />
        {faqs.length > 0 && (
          <div className="bg-[#FAF9F6]">
            <div className="container mx-auto px-4 md:px-8">
              <FAQs
                id="faq"
                title="Common Questions"
                subtitle="Frequently asked questions about spas in Bowness-on-Windermere."
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
          currentLocation="Bowness-on-Windermere"
          locations={relatedLocations}
          backgroundColor={'bg-white'}
        />
      </main>

      <Footer />
    </div>
  );
}
