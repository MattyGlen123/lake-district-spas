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
  title: 'Spas in Newby Bridge | Lake District Spas',
  description:
    'Discover spas in Newby Bridge at the southern tip of Lake Windermere. Outdoor thermal bathing, indoor pools and Elemis treatments where the lake meets the River Leven.',
};

// Filter spas for Newby Bridge
// Newby Bridge spas: Swan Hotel Spa (id: 5), Lakeside Hotel & Spa (id: 9)
const newbyBridgeSpas = spaData.filter(
  (spa) => spa.location === 'Newby Bridge'
);

const heroContent = {
  badge: 'Newby Bridge Spas',
  titleLine1: 'Spas in',
  titleLine2: 'Newby Bridge',
  description:
    "Where Lake Windermere meets the River Leven, two spa hotels offer a quieter gateway to the southern Lakes with steam trains, lake cruises and fell walks on the doorstep.",
  imageSrc: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg',
  imageAlt:
    'Water cascading over a broad weir on the River Leven at Newby Bridge with a traditional stone arch bridge beyond, surrounded by lush green woodland and gentle fells at the southern tip of Lake Windermere',
};

const introContent = `Newby Bridge sits at the point where England's largest lake empties into the River Leven, a small hamlet that takes its name from the five arched stone bridge built here in 1651. This is the quieter end of Windermere, away from the crowds of Bowness and Ambleside, yet perfectly positioned as a gateway to the southern Lake District. Steam trains on the Lakeside and Haverthwaite Railway pull into the station on their way to the lakeside pier, where cruises depart northward up the full length of Windermere.

Two spa hotels anchor the hamlet, each making the most of its waterside setting. The Swan Hotel sits on the banks of the River Leven, its grounds running right down to the water. It opened in 2022 and earned a five bubble rating from the Good Spa Guide within two years. The emphasis here is on outdoor thermal bathing, with a hydrotherapy pool and an outdoor Finnish sauna looking across the grounds. There's also an ice bucket for contrast therapy, and The Bothy, a retreat with log burner and salt lamps. Inside, the health club adds a indoor pool, sauna, steam room and jacuzzi. Day visitors can book thermal sessions from around £40 for two hours.

A short distance up the shore, the Lakeside Hotel occupies a prime position directly on Windermere's southern edge, where the water stretches north towards the central fells. The building began life as a 17th century coaching inn and still shows its history in oak panelling, beams and open fires. The spa takes a more traditional approach, with a 17 metre heated indoor pool framed by panoramic windows, a steam room, sauna and poolside jacuzzi, plus three treatment rooms offering Elemis therapies. An outdoor spa garden provides somewhere to sit when the weather cooperates, and pool and thermal facilities are included in the room rate for guests.

The location suits walkers seeking a quieter base. Gummer's How rises directly behind the hamlet, offering one of the finest viewpoints over the length of Windermere for relatively little effort. The combination of accessible spa facilities, lake cruises, heritage railways and easy road access from the M6 makes Newby Bridge particularly appealing for both short breaks and family visits.`;

const faqs = getLocationFAQs('Newby Bridge');

const relatedLocations = [
  { name: 'Windermere', slug: 'windermere', distance: '8 miles north' },
  {
    name: 'Grange-over-Sands',
    slug: 'grange-over-sands',
    distance: '6 miles south',
  },
  { name: 'Backbarrow', slug: 'backbarrow', distance: '1 mile west' },
];

export default function NewbyBridgeSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={newbyBridgeSpas}
          sectionLabel={`${newbyBridgeSpas.length} ${
            newbyBridgeSpas.length === 1 ? 'Spa' : 'Spas'
          } in Newby Bridge`}
          sectionTitle="Riverside and Lakeside Spas"
        />
        {faqs.length > 0 && (
          <div className="container mx-auto px-4 md:px-8">
            <FAQs
              id="faq"
              title="Common Questions"
              subtitle="Frequently asked questions about spas in Newby Bridge."
              icon={HelpCircle}
              faqs={faqs}
            />
          </div>
        )}
        <RelatedLocations
          currentLocation="Newby Bridge"
          locations={relatedLocations}
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


