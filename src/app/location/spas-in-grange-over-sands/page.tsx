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
  title: 'Spas in Grange-over-Sands | Lake District Spas',
  description:
    'Discover spas in Grange-over-Sands, an Edwardian coastal town on Morecambe Bay. Two Victorian spa hotels offer pools, thermal suites and treatments with bay views.',
};

// Filter spas for Grange-over-Sands
// Grange-over-Sands spas: Netherwood Hotel & Spa (id: 16), Grange Hotel (id: 17)
const grangeOverSandsSpas = spaData.filter(
  (spa) => spa.location === 'Grange-over-Sands'
);

const heroContent = {
  badge: 'Grange-over-Sands Spas',
  titleLine1: 'Spas in',
  titleLine2: 'Grange-over-Sands',
  description:
    "An Edwardian coastal town on the edge of Morecambe Bay, where two Victorian spa hotels offer relaxation with sweeping views across the sands to the Lakeland fells.",
  imageSrc: '/images/locations/grange-over-sands-lake-district-spa-breaks.jpg',
  imageAlt:
    'Sweeping view across the sandy channels and tidal flats of Morecambe Bay at low tide from Grange-over-Sands, with gentle green hills and rocky headlands visible across the estuary on a calm evening',
};

const introContent = `Grange-over-Sands occupies a unique position on the Cartmel Peninsula, where the Lake District meets Morecambe Bay. This elegant Edwardian town grew up around its railway station, which brought Victorian visitors seeking the mild climate and sea air. The famous promenade still curves along the edge of the salt marshes, backed by ornamental gardens planted with palms and semi-tropical shrubs, a legacy of those gentler winters that made this corner of Cumbria a favoured retreat.

The bay dominates everything here. At low tide, the sands stretch for miles towards Lancaster, and the light shifts constantly across the mudflats where curlews, oystercatchers and pink-footed geese feed. The walk along the promenade to the historic Lido site reveals views north to the Lakeland fells, while the climb to Hampsfell Hospice, a stone shelter built in 1846, offers panoramas from the Old Man of Coniston to Blackpool Tower on clear days. The medieval village of Cartmel lies just two miles inland, its 12th-century priory still standing watch over a cluster of pubs, artisan shops and the famous racecourse.

Two Victorian hotels anchor the spa scene in Grange-over-Sands, each taking full advantage of those bay views. The Grange Hotel, built in 1866, offers a leisure suite with indoor swimming pool, hot tub, sauna and steam room, facilities included for all hotel guests. Their treatment rooms use Tropic Skincare products, and day visitors can book spa packages that combine pool access with treatments and lunch. The hotel's Carriages Restaurant serves British cuisine crafted from local produce, with Morecambe Bay shrimps and Holker saltmarsh lamb featuring prominently.

Netherwood Hotel & Spa takes a different approach, housing its adults-only thermal suite in a Grade II listed Victorian mansion set within 15 acres of woodland and gardens. The thermal journey includes wooden hot tubs, a cold plunge pool, aroma steam room, salt inhalation room, ice fountain and monsoon shower. Three treatment rooms offer Germaine de Capuccini therapies, and the floor-to-ceiling windows in the dining room frame those sweeping bay views. Spa access is bookable separately from accommodation, with thermal sessions starting at £20 per person for 90 minutes.

Both hotels sit within easy reach of the railway station, making Grange-over-Sands one of the most accessible spa destinations in the region for car-free visitors. The Furness Line connects to Lancaster and the West Coast Main Line, placing London just three hours away, yet the pace here feels entirely removed from city life.`;

const faqs = getLocationFAQs('Grange-over-Sands');

const relatedLocations = [
  { name: 'Newby Bridge', slug: 'newby-bridge', distance: '8 miles north', image: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg' },
  { name: 'Backbarrow', slug: 'backbarrow', distance: '6 miles north', image: '/images/locations/backbarrow-lake-district-spa-breaks.jpg' },
  { name: 'Windermere', slug: 'windermere', distance: '10 miles north', image: '/images/locations/windermere-lake-district-spa-breaks.jpg' },
];

export default function GrangeOverSandsSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={grangeOverSandsSpas}
          sectionLabel={`${grangeOverSandsSpas.length} ${grangeOverSandsSpas.length === 1 ? 'Spa' : 'Spas'} in Grange-over-Sands`}
          sectionTitle="Coastal Spas"
        />
        {faqs.length > 0 && (
          <div className="bg-[#FAF9F6]">
            <div className="container mx-auto px-4 md:px-8">
              <FAQs
                id="faq"
                title="Common Questions"
                subtitle="Frequently asked questions about spas in Grange-over-Sands."
                icon={HelpCircle}
                faqs={faqs}
              />
            </div>
          </div>
        )}
        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
          />
        )}
        <RelatedLocations
          currentLocation="Grange-over-Sands"
          locations={relatedLocations}
          backgroundColor={'bg-white'}
        />
      </main>

      <Footer />
    </div>
  );
}

