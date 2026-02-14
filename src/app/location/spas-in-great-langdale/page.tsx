import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import { spaData } from '@/data/spas';

export const metadata: Metadata = {
  title: 'Spas in Great Langdale | Lake District Spas',
  description:
    "Discover Brimstone Spa in Great Langdale, the Lake District's premier walking valley. Seven thermal experiences beneath the Langdale Pikes, exclusive to estate guests.",
};

// Filter spas for Great Langdale
// Great Langdale spa: Brimstone Spa (id: 3)
const greatLangdaleSpas = spaData.filter(
  (spa) => spa.location === 'Great Langdale'
);

const heroContent = {
  badge: 'Great Langdale Spas',
  titleLine1: 'Spas in',
  titleLine2: 'Great Langdale',
  description:
    "The Lake District's premier walking valley, where the Langdale Pikes dominate the skyline and one exceptional spa rewards tired legs after days on the fells.",
  imageSrc: '/images/locations/great-langdale-lake-district-spa-breaks.jpg',
  imageAlt:
    'Stunning view down Great Langdale valley with steep craggy fells rising either side, patchwork green fields divided by dry stone walls and scattered farmsteads stretching toward the Langdale Pikes under dramatic clouds',
};

const introContent = `Great Langdale is where the Lake District gets serious. The valley runs west from Ambleside beneath some of the most dramatic mountain scenery in England, the Langdale Pikes rise in a sudden vertical surge from the valley floor, their rocky summits instantly recognisable from as far away as Windermere's eastern shore. Walkers have been coming here for generations, drawn by terrain that Alfred Wainwright described as stirring both imagination and emotion.

Brimstone Spa occupies the 35-acre Langdale Estate, a former Victorian gunpowder works where millstones, a waterwheel and old cannon hint at industrial history now absorbed into woodland and waterways. The spa takes its design cues from the surrounding landscape, burnished metallic tiles against reclaimed brick, long windows framing fell views from the outdoor Finnish sauna. Seven thermal experiences follow a guided sequence, lava sauna and herbal sauna, mineral steam bath and Himalayan salt room, ice fountain and experience showers, with a 9-metre indoor and outdoor pool as the centrepiece. The outdoor terrace has a log fire for warming up between sessions while watching the weather move across the Pikes.

Crucially for walkers, the estate includes a fully stocked bootroom where guests can borrow quality walking gear, boots, waterproofs, everything needed for a day on the fells. The arrangement works both ways, spend the morning climbing Harrison Stickle, then the afternoon recovering in the thermal suite. Brimstone Spa is exclusive to guests of the Langdale Estate, staying at the Langdale Hotel, Brimstone Hotel or self-catering lodges, so there is no day spa option here. The tradeoff is a quieter, more considered experience that matches the valley's character, remote, dramatic, and earned rather than easily accessed.`;

const relatedLocations = [
  { name: 'Ambleside', slug: 'ambleside', distance: '5 miles east' },
  { name: 'Grasmere', slug: 'grasmere', distance: '7 miles northeast' },
  { name: 'Windermere', slug: 'windermere', distance: '10 miles southeast' },
];

export default function GreatLangdaleSpasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={introContent} />
        <LocationFeaturedSpas
          spas={greatLangdaleSpas}
          sectionLabel={`${greatLangdaleSpas.length} ${
            greatLangdaleSpas.length === 1 ? 'Spa' : 'Spas'
          } in Great Langdale`}
          sectionTitle="Valley Spa"
        />
        <RelatedLocations
          currentLocation="Great Langdale"
          locations={relatedLocations}
        />
      </main>

      <Footer />
    </div>
  );
}


