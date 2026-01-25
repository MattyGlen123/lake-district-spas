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
    'Outdoor infinity pools with fell views, lakeside hot tubs, and thermal suites designed for reconnection. Our curated selection of the Lake District\'s most romantic spa hotels.',
};

export default function CouplesSpaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <CouplesSpaHero />
        <FeatureSpotlights />
        <FeaturedSpas />
        <CouplesDayPasses />
        <FeaturedTreatments />
      </main>

      <Footer />
    </div>
  );
}

