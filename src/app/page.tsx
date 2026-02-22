import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SpaFilterSection from '@/components/SpaFilterSection';
import FeaturedArticles from '@/components/FeaturedArticles';
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
        <SpaFilterSection />
        <FeaturedArticles />
      </main>

      <Footer />
    </div>
  );
}
