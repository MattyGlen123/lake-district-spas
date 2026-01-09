import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Eye,
  Info,
  Search,
  Navigation,
  Heart,
  Quote,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About - Lake District Spas',
  description:
    'Learn about Lake District Spas - why we built this directory and how we help you find the perfect spa experience.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Editorial Hero */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-white">
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.5em] text-amber-700 block mb-6">
              Our Mission
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-900 leading-[1.1] mb-12">
              Why we&apos;re building{' '}
              <span className="italic">Lake District Spas</span>
            </h1>
            <div className="h-px w-24 bg-amber-200 mx-auto mb-12" />
          </div>

          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-5">
            <div className="absolute top-20 left-10 text-[20vw] font-serif italic text-emerald-900 leading-none select-none">
              Wellness
            </div>
          </div>
        </section>

        {/* The Problem - Darker Contrast */}
        <section className="bg-stone-900 text-stone-100 py-32">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-500 block mb-6">
                The Conflict
              </span>
              <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
                The Problem
              </h2>
              <div className="space-y-6 text-stone-400 font-light text-lg leading-relaxed">
                <p>
                  Planning a spa day or spa break in the Lake District is harder
                  than it should be. The information you actually need is
                  scattered, incomplete, or buried in fine print.
                </p>
                <p>
                  The biggest frustration? Finding out whether spa access is
                  included with your hotel stay or costs extra. Major booking
                  platforms rarely make this clear - leaving you to discover
                  hidden costs after you&apos;ve already booked.
                </p>
                <p>
                  Beyond access policies, treatment menus are often PDFs buried
                  on spa websites, facility details are vague marketing speak,
                  and comparing options means opening dozens of tabs.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl grayscale opacity-70 border border-white/10">
                <Image
                  src="/images/lake-district-spas_massage-oil-treatment.jpg"
                  alt="Professional spa therapist pouring aromatic massage oil during luxury treatment, hands performing skilled therapeutic massage techniques with natural oils, showcasing the high-quality wellness treatments and professional spa services"
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-amber-600 p-10 rounded-full hidden lg:block">
                <HelpCircle className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* The Solution - Airy & List Oriented */}
        <section className="bg-[#FAF9F6] py-32 border-b border-stone-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 block mb-6">
                Our Response
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-8 leading-tight">
                The Solution
              </h2>
              <p className="max-w-2xl mx-auto text-stone-500 font-light text-xl leading-relaxed">
                Lake District Spas brings together everything you need to plan
                the perfect spa experience in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[
                {
                  title: 'Clear Access Policies',
                  desc: 'Know exactly whether spa facilities are included, require a day pass, or are exclusive to hotel guests - before you book.',
                  icon: ShieldCheck,
                },
                {
                  title: 'Detailed Facilities',
                  desc: 'Specific details on thermal experiences, pools, treatment rooms, and unique features - not generic descriptions.',
                  icon: Eye,
                },
                {
                  title: 'Treatment Databases',
                  desc: 'Browse and compare treatments across spas with clear pricing and descriptions.',
                  icon: Search,
                },
                {
                  title: 'Locally Researched',
                  desc: 'Every spa personally verified and regularly updated by someone who lives here.',
                  icon: Navigation,
                },
                {
                  title: 'No Hidden Surprises',
                  desc: 'The honest information you need to make confident decisions.',
                  icon: Info,
                },
              ].map((sol, i) => (
                <div
                  key={i}
                  className={`bg-white p-10 rounded-3xl border border-stone-100 shadow-sm flex flex-col h-full ${
                    i < 3 ? 'lg:col-span-2' : 'md:col-span-3 lg:col-span-3'
                  }`}
                >
                  <div className="mb-6 p-4 bg-stone-50 rounded-2xl w-fit text-amber-700">
                    <sol.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-4">
                    {sol.title}
                  </h3>
                  <p className="text-stone-500 text-base font-light leading-relaxed flex-grow">
                    {sol.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who This Is For - Editorial Layout */}
        <section className="py-32 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              <div className="md:w-1/3 md:sticky md:top-32">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 block mb-6">
                  Audience
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 leading-tight">
                  Who This For
                </h2>
                <p className="text-stone-500 font-light leading-relaxed">
                  A resource designed for everyone from the weekend wellness
                  seekers to local spa enthusiasts.
                </p>
              </div>
              <div className="md:w-2/3 space-y-12">
                {[
                  {
                    label: 'Day Spa Visitors',
                    text: "Find spas with public access and compare what's on offer.",
                  },
                  {
                    label: 'Hotel Guests',
                    text: "Understand exactly what's included before you book your stay.",
                  },
                  {
                    label: 'Groups & Couples',
                    text: 'Plan the perfect spa day with friends or a romantic getaway.',
                  },
                  {
                    label: 'Spa Providers',
                    text: 'Get in touch to update your listing or discuss partnership opportunities.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-8">
                    <div className="flex-shrink-0 mt-1 h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center text-[10px] font-black text-stone-400">
                      0{i + 1}
                    </div>
                    <div className="pb-8 border-b border-stone-100 w-full">
                      <h3 className="font-serif text-2xl text-stone-900 mb-3">
                        {item.label}
                      </h3>
                      <p className="text-stone-500 text-lg font-light leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Me - Personal Touch */}
        <section className="bg-emerald-950 py-32 text-stone-100 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 p-24">
              <Heart className="h-64 w-64 text-white" strokeWidth={0.5} />
            </div>
            <div className="absolute bottom-0 left-0 p-24 rotate-180">
              <Quote
                className="h-48 w-48 text-white opacity-20"
                strokeWidth={0.5}
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-500 block mb-6">
              The Creator
            </span>
            <h2 className="font-serif text-4xl md:text-6xl mb-12 leading-tight italic">
              About Me
            </h2>
            <div className="space-y-8 text-emerald-100/70 font-light text-xl md:text-2xl leading-relaxed">
              <p>
                I&apos;m <span className="text-white font-medium">Matthew</span>
                , and I live in Penrith with my family, right on the doorstep of
                the Lake District.
              </p>
              <p>
                This site started from real frustration. My partner and her
                friends regularly plan spa days together, and the same
                complaints kept coming up:{' '}
                <span className="italic text-white">
                  &quot;Why is it so hard to find out if the spa is actually
                  included? What treatments do they offer? Can we even book as
                  day visitors?&quot;
                </span>
              </p>
              <p>
                I realised that if experienced spa-goers were struggling to find
                this information, first-time visitors didn&apos;t stand a
                chance. Lake District Spas is my attempt to fix that. It&apos;s
                a straightforward guide to help you find your perfect spa
                experience.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif text-4xl text-stone-900 mb-8 leading-tight">
              Ready to find your sanctuary?
            </h2>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-10 py-5 bg-stone-900 text-stone-50 font-bold rounded-full shadow-xl uppercase tracking-widest text-xs"
            >
              Explore the Directory
              <ArrowRight className="h-4 w-4 ml-3" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
