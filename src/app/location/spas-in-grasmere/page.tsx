import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import { spaData } from '@/data/spas';

export const metadata: Metadata = {
  title: 'Spas in Grasmere | Lake District Spas',
  description:
    "Discover spas in Grasmere, Wordsworth's beloved Lake District village. Two spa hotels offer thermal pools, saunas and treatments between literary sites and fell walks.",
};

// Filter spas for Grasmere
// Grasmere spas: Daffodil Hotel Spa (id: 4), Rothay Garden by Harbour Hotels (id: 11)
const grasmereSpas = spaData.filter((spa) => spa.location === 'Grasmere');

const heroContent = {
  badge: 'Grasmere Spas',
  titleLine1: 'Spas in',
  titleLine2: 'Grasmere',
  description:
    "Wordsworth's beloved village in the heart of the Lakes, where two spa hotels offer relaxation between literary pilgrimages and classic fell walks.",
  imageSrc: '/images/locations/grasmere-lake-district-spa-breaks.jpg',
  imageAlt:
    'Aerial view of Grasmere village beside its lake with a tree-covered island in the foreground, green fields and mature woodland leading up to rounded Lakeland fells under a clear summer sky in the Lake District',
};

const introContent = `Grasmere sits in a bowl of fells at the geographic heart of the Lake District, a village that William Wordsworth famously called "the loveliest spot that man hath found". Visitors come for the literary pilgrimage, the cottage, the museum, his grave in St Oswald's churchyard, but they stay for the landscape that inspired him.

The village itself is a compact cluster of slate cottages, galleries and tea rooms gathered around the church. The famous Grasmere Gingerbread Shop occupies the old schoolhouse where Wordsworth once taught, while the Heaton Cooper Studio continues a century-long tradition of Lake District landscape painting. Beyond the village, Grasmere lake curves beneath Helm Crag's distinctive rocky summit, and the paths that radiate outward lead to Easedale Tarn, Loughrigg Terrace, Rydal Water and the high fells beyond. Rowing boats can be hired at Faeryland on the lake's shore during summer months.

Two spa hotels serve Grasmere, each with a distinct character. The Daffodil Hotel & Spa occupies the only lakeside position in the village, with the lake-view dining room and terrace making the most of that waterfront setting. The spa itself includes a 10-metre thermal pool, sauna, steam room, tepidarium and a Moroccan-style mud rasul, with treatments using TEMPLESPA products. Hotel guests have complimentary access, while day visitors can book two-hour sessions from £30 per person on weekdays.

Rothay Garden by Harbour Hotels takes a different approach, nestled in two acres of riverside gardens on the edge of the village where the River Rothay flows beneath the fells. The original building dates from 1856, and the feel remains traditional country house despite recent refurbishment. The Riverside Spa offers a hydrotherapy pool with sunken loungers, herbal pine sauna, aromatherapy room, monsoon showers and heated infrared loungers, a compact but well-considered thermal circuit. The 2 AA Rosette Garden Restaurant emphasises local seasonal produce, and the hotel welcomes dogs throughout.

For visitors combining spa time with walking, Grasmere offers an ideal base. The classic circuit around the lake takes under an hour, while the path to Easedale Tarn and back fills a morning. More ambitious routes climb Helm Crag's rocky howff or traverse to Fairfield. After a day on the fells, both spas provide a compelling reason to linger.`;

const relatedLocations = [
  { name: 'Ambleside', slug: 'ambleside', distance: '4 miles south' },
  { name: 'Windermere', slug: 'windermere', distance: '9 miles south' },
  { name: 'Borrowdale', slug: 'borrowdale', distance: '8 miles north' },
];

export default function GrasmereSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={grasmereSpas}
          sectionLabel={`${grasmereSpas.length} ${
            grasmereSpas.length === 1 ? 'Spa' : 'Spas'
          } in Grasmere`}
          sectionTitle="Village Spas"
        />
        <RelatedLocations
          currentLocation="Grasmere"
          locations={relatedLocations}
        />
      </main>

      <Footer />
    </div>
  );
}
