import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import { spaData } from '@/data/spas';

export const metadata: Metadata = {
  title: 'Spas in Appleby-in-Westmorland | Lake District Spas',
  description:
    'Discover the Garden Spa at Appleby Manor in the Eden Valley. Outdoor hot tubs, fire pit, and country house tranquility on the edge of the Lake District.',
};

// Filter spas for Appleby-in-Westmorland
// Appleby spa: Appleby Manor Hotel & Garden Spa (id: 15)
const applebySpas = spaData.filter(
  (spa) => spa.location === 'Appleby-in-Westmorland'
);

const heroContent = {
  badge: 'Appleby Spa',
  titleLine1: 'Spas in',
  titleLine2: 'Appleby-in-Westmorland',
  description:
    'Eden Valley tranquility on the edge of the Lake District. A country house spa escape where outdoor hot tubs meet fire pits and historic England awaits.',
};

const introContent = `Appleby-in-Westmorland offers something the central Lake District cannot: space, quiet, and the unhurried pace of a historic market town that most visitors drive straight past. Sitting in the Eden Valley on the national park's eastern edge, this former county town of Westmorland trades fell-top drama for gentle riverside walks and centuries of history written in red sandstone.

The town itself deserves exploration. Appleby Castle dominates the skyline, its Norman keep watching over a broad main street that climbs from the River Eden to the church of St Lawrence. The annual Horse Fair, held each June, draws Travellers from across Britain in a tradition stretching back to 1685. For the rest of the year, Appleby belongs to those who appreciate England's quieter corners.

The Garden Spa at Appleby Manor brings contemporary wellness to this pastoral setting. A 19th-century country house hotel with views toward the castle, it centres on an indoor vitality pool with underwater massage loungers and targeted hydrotherapy jets. But the signature experience lies outside: a sheltered spa garden where hot tubs steam beneath open skies and flames flicker in the fire pit year-round.

The thermal journey includes traditional sauna, aromatherapy steam room, and a salt inhalation room for respiratory wellness, a thoughtful addition that speaks to the spa's focus on genuine therapeutic benefit. For special occasions, a private hot tub can be hired with panoramic countryside views stretching across the Eden Valley.

Unlike the busier Lake District destinations, Appleby rewards those willing to venture beyond the obvious. Day spa packages welcome visitors from £45, making this an accessible escape for couples seeking relaxation without the crowds. Combine it with a walk along the river to the Millennium Bridge, lunch in one of the town's coaching inns, and you have a day that feels genuinely restorative rather than simply scenic.`;

const relatedLocations = [
  { name: 'Penrith', slug: 'penrith', distance: '12 miles north' },
  { name: 'Ullswater', slug: 'ullswater', distance: '15 miles northwest' },
  { name: 'Bassenthwaite', slug: 'bassenthwaite', distance: '30 miles northwest' },
];

export default function ApplebySpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={applebySpas}
          sectionLabel={`${applebySpas.length} ${applebySpas.length === 1 ? 'Spa' : 'Spas'} in Appleby-in-Westmorland`}
          sectionTitle="Eden Valley Spa"
        />
        <RelatedLocations
          currentLocation="Appleby-in-Westmorland"
          locations={relatedLocations}
        />
      </main>

      <Footer />
    </div>
  );
}

