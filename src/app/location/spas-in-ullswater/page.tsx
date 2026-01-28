import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import { spaData } from '@/data/spas';

export const metadata: Metadata = {
  title: 'Spas in Ullswater | Lake District Spas',
  description:
    "Discover Another Place, The Lake on England's second largest lake. Wild swimming, paddleboarding and a 20-metre pool with fell views on the shores of Ullswater.",
};

// Filter spas for Ullswater
// Ullswater spa: Another Place, The Lake (id: 14)
const ullswaterSpas = spaData.filter((spa) => spa.location === 'Ullswater');

const heroContent = {
  badge: 'Ullswater Spas',
  titleLine1: 'Spas in',
  titleLine2: 'Ullswater',
  description:
    "England's most beautiful lake, where Wordsworth found his daffodils and a contemporary lakeside hotel invites you to swim in the water rather than just look at it.",
};

const introContent = `Ullswater winds for nine miles through the northern Lake District, its elongated Z-shape carved by three glaciers that retreated ten thousand years ago. Many consider it England's most beautiful lake, Wordsworth certainly thought so, describing it as "the happiest combination of beauty and grandeur which any of the Lakes affords". It was here at Glencoyne Bay in April 1802 that he and his sister Dorothy encountered the daffodils that would inspire the most famous poem in the English language. Those same daffodils still bloom each spring along the shoreline.

Another Place, The Lake occupies 18 acres of parkland at Watermillock on the western shore, its grounds running down to a private jetty. The hotel opened in 2017 in a restored Georgian building with a contemporary wing added, and its ethos centres on getting outdoors rather than simply admiring the view from inside. The spa, called Swim Club, reflects this philosophy, a 20-metre indoor pool with floor-to-ceiling glass walls that blur the boundary between inside and lake. An outdoor Swedish-style hot tub looking towards Arthur's Pike, and a sauna with glass doors framing fell views. Ultraviolet filtration keeps the pool low on chlorine. Two treatment rooms and a treatment snug offer therapies.

Hotel guests have complimentary access to Swim Club throughout their stay. Day visitors can book memberships that include pool, hot tub and sauna. Three restaurants provide fuel, Rampsbeck for contemporary dining with lake views, The Living Space for all-day casual eating, and The Glasshouse for wood-fired pizza in a Victorian-style lakeside building. Families benefit from an Ofsted-registered Kids' Zone included free for guests.`

const relatedLocations = [
  { name: 'Penrith', slug: 'penrith', distance: '5 miles northeast' },
  { name: 'Borrowdale', slug: 'borrowdale', distance: '20 miles west' },
  {
    name: 'Appleby-in-Westmorland',
    slug: 'appleby-in-westmorland',
    distance: '18 miles southeast',
  },
  
];

export default function UllswaterSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={ullswaterSpas}
          sectionLabel={`${ullswaterSpas.length} ${
            ullswaterSpas.length === 1 ? 'Spa' : 'Spas'
          } in Ullswater`}
          sectionTitle="Lakeside Spa"
        />
        <RelatedLocations
          currentLocation="Ullswater"
          locations={relatedLocations}
        />
      </main>

      <Footer />
    </div>
  );
}

