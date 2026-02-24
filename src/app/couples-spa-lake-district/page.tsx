import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CouplesSpaHero from '@/components/CouplesSpaHero';
import FeatureSpotlights from '@/components/FeatureSpotlights';
import FeaturedSpas from '@/components/FeaturedSpas';
import CouplesDayPasses from '@/components/CouplesDayPasses';
import FeaturedTreatments from '@/components/FeaturedTreatments';

export const metadata = {
  title: 'Couples Spa Guide - Lake District | Romantic Spa Retreats',
  description:
    'Outdoor infinity pools, lakeside hot tubs and thermal suites for couples. Discover our curated selection of the Lake District\'s most romantic spa hotels.',
};

export default function CouplesSpaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <CouplesSpaHero
          backgroundImage="/images/blog/lake-district-spas_blog-relaxation-lounge-evening.jpg"
          backgroundImageAlt="Evening relaxation lounge at a Lake District spa"
        />
        <FeatureSpotlights />
        <FeaturedSpas />
        <CouplesDayPasses
          featuredDayPassIds={[
            'armathwaite-sunset-weekday',
            'lodore-falls-derwent-delight',
            'low-wood-bay-hideaway-retreat',
            'swan-champagne-truffle-spa-day',
          ]}
          heading="Couples Day Experiences"
          eyebrowLabel="Spontaneous Romance"
          description="Experience a romantic spa day without booking an overnight stay. Each of our featured spas offers day passes perfect for couples."
          ctaLabel="Browse all day passes"
          ctaVariant="link"
          background="bg-white"
        />
        <FeaturedTreatments />
      </main>

      <Footer />
    </div>
  );
}

