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
  title: 'Spas in Windermere | Lake District Spas',
  description:
    "Discover luxury spas in Windermere, England's largest lake. Compare facilities, prices, and book your perfect Lake District spa break.",
};

// Filter spas for Windermere area
// Windermere spas: Low Wood Bay (id: 7), Beech Hill (id: 10)
const windermereSpas = spaData.filter((spa) => spa.location === 'Windermere');
const faqs = getLocationFAQs('Windermere');

const heroContent = {
  badge: 'Windermere Spas',
  titleLine1: 'Spas in',
  titleLine2: 'Windermere',
  description:
    "England's largest lake meets world-class wellness. From infinity pools overlooking the water to thermal suites with fell views, Windermere offers the Lake District's finest concentration of luxury spa hotels.",
  imageSrc: '/images/locations/windermere-lake-district-spa-breaks.jpg',
  imageAlt:
    "Still waters of Lake Windermere reflecting green fells and mature woodland on a summer morning, the scenic backdrop for spa hotels along England's largest lake in the Lake District National Park",
};

const introContent = `Windermere has drawn visitors seeking restoration for over two centuries. The Victorians arrived by railway to take the waters, today's travellers come for infinity pools that seem to merge with England's largest lake and thermal suites where steam rises against a backdrop of Lakeland fells.

The town's position at the heart of the Lake District makes it the region's most accessible spa destination. Direct trains from Manchester connect in under two hours, while the M6 places Windermere within easy reach of the North West. For couples planning a Lake District wellness escape, Windermere offers two distinct spa experiences on the shores of England's largest lake.

Low Wood Bay delivers the full resort experience. Hotel guests get complimentary use of the Resort Leisure Area (indoor pool, infrared sauna, jacuzzi, and steam room) during the morning and evening hours opening times. The paid thermal journey unlocks the full estate: two outdoor infinity pools gazing across to the Langdale Pikes, an indoor infinity pool, the outdoor Fellside Sauna with lake views, dry salt sauna, steam cabin, and herbal lounge. Hotel guests get 25% off the thermal journey Monday to Thursday. The adventurous can combine spa time with sailing or paddleboarding on the lake itself.

Beech Hill offers an intimate experience. The 1900s hotel sits in landscaped gardens with private jetties and a 35ft indoor pool with atmospheric lighting. A large outdoor hot tub on the lakeside terrace provides panoramic Windermere views, while a secret gate leads directly to a private beach for wild swimming between spa sessions. The Himalayan sauna and aromatic steam room provide the thermal heat, while Caudalie treatments bring French vineyard skincare to the lakeside setting. Crucially, spa access is included for all hotel guests.

Both spas are adults-only in their thermal areas, creating the peaceful atmosphere couples seek. The setting does the rest, spa terraces look across the water as the sun drops behind Claife Heights, and treatment rooms frame views that elsewhere would be the main attraction.`;

const relatedLocations = [
  {
    name: 'Bowness on Windermere',
    slug: 'bowness-on-windermere',
    distance: '1 mile south',
  },
  { name: 'Ambleside', slug: 'ambleside', distance: '6 miles north' },
  { name: 'Newby Bridge', slug: 'newby-bridge', distance: '6 miles south' },
];

export default function WindermereSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={windermereSpas}
          sectionLabel={`${windermereSpas.length} ${windermereSpas.length === 1 ? 'Spa' : 'Spas'} in Windermere`}
          sectionTitle="Lake Windermere Spas"
        />
        {faqs.length > 0 && (
          <div className="bg-[#FAF9F6]">
            <div className="container mx-auto px-4 md:px-8">
              <FAQs
                id="faq"
                title="Common Questions"
                subtitle="Frequently asked questions about spas in Windermere."
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
          currentLocation="Windermere"
          locations={relatedLocations}
          backgroundColor={'bg-white'}
        />
      </main>

      <Footer />
    </div>
  );
}
