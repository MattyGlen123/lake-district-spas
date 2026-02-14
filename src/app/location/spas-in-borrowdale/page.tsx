import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import { spaData } from '@/data/spas';

export const metadata: Metadata = {
  title: 'Spas in Borrowdale | Lake District Spas',
  description:
    "Discover Borrowdale spas in the Lake District's most dramatic valley. Lodore Falls Hotel features a 16-metre infinity pool overlooking Derwentwater.",
};

// Filter spas for Borrowdale
// Borrowdale spa: Lodore Falls Hotel Spa (id: 1)
const borrowdaleSpas = spaData.filter((spa) => spa.location === 'Borrowdale');

const heroContent = {
  badge: 'Borrowdale Spa',
  titleLine1: 'Spas in',
  titleLine2: 'Borrowdale',
  description:
    "One of the Lake District's most dramatic valleys, home to an infinity-edge spa overlooking Derwentwater and the fells beyond.",
  imageSrc: '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
  imageAlt:
    'Traditional wooden gate and dry stone wall opening onto wildflower meadows in Borrowdale valley, with steep green fells and wooded hillsides rising into summer clouds in the heart of the Lake District',
};

const introContent = `Borrowdale cuts deep into the heart of the Lake District, a glacier-carved valley where towering fells rise steeply from the shores of Derwentwater. This is walking country at its finest, ancient oakwoods cloak the lower slopes, the River Derwent winds through valley-bottom meadows, and at the Jaws of Borrowdale the landscape narrows dramatically between Castle Crag and King's How. It's a place that has drawn visitors since Georgian times, when the Picturesque movement sent tourists in search of wild, romantic scenery.

The Falls Spa at Lodore Falls Hotel occupies a striking position at the northern end of Borrowdale, where the hotel's namesake waterfall cascades down behind the property. The spa building itself is a contemporary addition, designed to frame the landscape through floor-to-ceiling glass. Its 16-metre outdoor infinity-edge vitality pool is the undisputed centrepiece, one of the largest in the region, with underwater bubble loungers, hydromassage neck jets, and views that stretch across Derwentwater to Catbells and the northwestern fells.

Inside, the thermal suite offers twelve distinct heat experiences. A glass-fronted Finnish sauna looks out over the grounds, while a Roman laconium, salt steam room, aroma steam room, and herbal sauna provide gentler warmth. An ice fountain and cold drench bucket offer contrast therapy, and heated loungers line the relaxation areas.

The four-person Rasul chamber brings Moroccan bathing traditions to Cumbria, complete with mineral-rich muds and atmospheric lighting. Five treatment rooms deliver therapies from Elemis and ishga, with a Champagne bar for refreshments between sessions.

Suite guests enjoy two hours of complimentary spa access per night of their stay, while those in standard rooms can book two-hour sessions from £35 per person on weekdays or £40 at weekends. 

Day spa packages are also available for non-residents, making this an accessible retreat even without an overnight stay. For those seeking a spa escape surrounded by some of England's most celebrated mountain scenery, Borrowdale delivers a dramatic backdrop that few locations can match.`;

const relatedLocations = [
  { name: 'Bassenthwaite', slug: 'bassenthwaite', distance: '8 miles northwest' },
  { name: 'Ullswater', slug: 'ullswater', distance: '12 miles east' },
  { name: 'Grasmere', slug: 'grasmere', distance: '7 miles south' },
];

export default function BorrowdaleSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={borrowdaleSpas}
          sectionLabel={`${borrowdaleSpas.length} ${borrowdaleSpas.length === 1 ? 'Spa' : 'Spas'} in Borrowdale`}
          sectionTitle="Valley Spa"
        />
        <RelatedLocations
          currentLocation="Borrowdale"
          locations={relatedLocations}
        />
      </main>

      <Footer />
    </div>
  );
}

