import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HomepageFeaturedSpas from '@/components/HomepageFeaturedSpas';
import FeaturedArticles from '@/components/FeaturedArticles';
import FeaturedLocations from '@/components/FeaturedLocations';
import CouplesDayPasses from '@/components/CouplesDayPasses';
import Footer from '@/components/Footer';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Lake District Spas',
  url: 'https://lakedistrictspas.co.uk',
  logo: 'https://lakedistrictspas.co.uk/logo.svg',
  description:
    'Complete guide to Lake District spas. Compare facilities, access policies, and thermal suites across spa hotels in the Lake District.',
  sameAs: [],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Header />

      <main>
        <Hero />
        <HomepageFeaturedSpas />
        <FeaturedArticles />
        <FeaturedLocations />
        <CouplesDayPasses
          featuredDayPassIds={[
            'armathwaite-escape-weekend',
            'swan-champagne-truffle-spa-day',
            'netherwood-spa-relaxation',
            'north-lakes-simple-ritual-weekday',
          ]}
          heading="Spa Day Experiences"
          eyebrowLabel="Featured Day Passes"
          description="Explore hand-picked day passes from some of the Lake District's finest spas, no overnight stay required."
          ctaLabel="See All Day Passes"
          ctaVariant="button"
          background="bg-stone-50"
        />
      </main>

      <Footer />
    </div>
  );
}
