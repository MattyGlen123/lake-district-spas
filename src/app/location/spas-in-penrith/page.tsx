import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import { spaData } from '@/data/spas';

export const metadata: Metadata = {
  title: 'Spas in Penrith | Lake District Spas',
  description:
    'Discover North Lakes Hotel & Spa in Penrith, gateway to Ullswater and the northern Lake District. Pool, thermal facilities and Caudalie treatments just off the M6.',
};

// Filter spas for Penrith
// Penrith spa: North Lakes Hotel & Spa (id: 12)
const penrithSpas = spaData.filter((spa) => spa.location === 'Penrith');

const heroContent = {
  badge: 'Penrith Spas',
  titleLine1: 'Spas in',
  titleLine2: 'Penrith',
  description:
    'The historic market town on the edge of the Lake District, where a four star spa hotel offers easy access to Ullswater and the northern fells from the doorstep of the M6.',
  imageSrc: '/images/locations/penrith-lake-district-spa-breaks.jpg',
  imageAlt:
    'Wide panoramic view from the hilltop above Penrith looking west across the Eden Valley toward the northern Lake District fells and a distant lake, with green farmland and the town visible below on a summer day',
};

const introContent = `Penrith occupies an unusual position, a substantial market town sitting just outside the Lake District National Park boundary, yet serving as the gateway to Ullswater and the northern fells. The town's history runs deeper than most visitors realise. In the 9th and 10th centuries this was the capital of Cumbria, a semi independent state that formed part of the Kingdom of Strathclyde. The ruins of Penrith Castle, begun in 1399 and later a royal fortress for Richard Duke of Gloucester, stand opposite the railway station.

The North Lakes Hotel & Spa sits just off the M6, a position that makes it one of the most accessible spa hotels in the Lake District. Built in 1985 in traditional hunting lodge style, the hotel uses local stone, natural wood and open log fires to create something that feels considerably older than its years. The spa occupies a space with exposed wooden beams and a relaxed country house atmosphere. Facilities centre on a 13 metre swimming pool, hot tub, sauna and steam room, with six treatment rooms offering therapies using Caudalie products. Day visitors receive three hours of facility access, while hotel guests booking direct get complimentary use of the spa, gym and pool throughout their stay.

The location works well for those wanting to combine spa time with exploration. Ullswater lies just ten minutes away by car, with the Ullswater Steamers running between Pooley Bridge, Howtown and Glenridding. For walkers, Helvellyn rises to 950 metres at the southern end of the lake, England's third highest peak and home to the famous Striding Edge scramble.`

const relatedLocations = [
  { name: 'Ullswater', slug: 'ullswater', distance: '6 miles west' },
  { name: 'Borrowdale', slug: 'borrowdale', distance: '17 miles west' },
  {
    name: 'Appleby-in-Westmorland',
    slug: 'appleby-in-westmorland',
    distance: '13 miles southeast',
  },
];

export default function PenrithSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={penrithSpas}
          sectionLabel={`${penrithSpas.length} ${
            penrithSpas.length === 1 ? 'Spa' : 'Spas'
          } in Penrith`}
          sectionTitle="Gateway Spa"
        />
        <RelatedLocations
          currentLocation="Penrith"
          locations={relatedLocations}
        />
      </main>

      <Footer />
    </div>
  );
}


