import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Page Not Found - Lake District Spas',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-white">
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.5em] text-amber-700 block mb-6">
              Page Not Found
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-900 leading-[1.1] mb-12">
              404
            </h1>
            <div className="h-px w-24 bg-amber-200 mx-auto mb-12" />
            <p className="max-w-2xl mx-auto text-stone-500 text-xl font-light leading-relaxed mb-12">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Decorative Background Text */}
          <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none overflow-hidden opacity-[0.03]">
            <div className="absolute top-20 right-10 text-[20vw] font-serif italic text-emerald-900 leading-none select-none rotate-12">
              404
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-[#FAF9F6] py-32 border-y border-stone-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8 leading-tight">
              Let&apos;s Get You Back on Track
            </h2>
            <p className="text-stone-600 font-light text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
              Explore our directory of Lake District spas, learn more about our mission, or return to the homepage.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-10 py-5 bg-emerald-950 text-white font-bold rounded-full shadow-xl uppercase tracking-widest text-xs"
              >
                <Home className="h-4 w-4 mr-3" />
                Return Home
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-10 py-5 bg-stone-900 text-white font-bold rounded-full shadow-xl uppercase tracking-widest text-xs"
              >
                About Us
                <ArrowRight className="h-4 w-4 ml-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

