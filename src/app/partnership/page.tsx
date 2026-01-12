import Image from 'next/image';
import type { Metadata } from 'next';
import {
  Zap,
  BarChart3,
  Code,
  ChevronRight,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Star,
  Layers,
  Sparkles,
  Circle,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Partnership Opportunities - Lake District Spas',
  description:
    'Partner with Lake District Spas to reach spa seekers ready to book. Featured listings, treatment integration, and SEO consulting services.',
  openGraph: {
    title: 'Partnership Opportunities - Lake District Spas',
    description:
      'Partner with Lake District Spas to reach spa seekers ready to book. Featured listings, treatment integration, and SEO consulting services.',
    type: 'website',
    url: 'https://lakedistrictspas.co.uk/partnership',
    images: [
      {
        url: 'https://lakedistrictspas.co.uk/images/lake-district-spas_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Partnership Opportunities - Lake District Spas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partnership Opportunities - Lake District Spas',
    description:
      'Partner with Lake District Spas to reach spa seekers ready to book. Featured listings, treatment integration, and SEO consulting services.',
    images: [
      'https://lakedistrictspas.co.uk/images/lake-district-spas_hero.jpg',
    ],
  },
};

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-white">
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-8 shadow-sm">
              <Zap className="h-3 w-3 mr-2" />
              Partnership Opportunities
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-900 leading-[1.1] mb-12">
              Reach Spa Seekers <br />
              <span className="italic font-medium text-emerald-950">
                Ready to Book
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-stone-500 text-xl font-light leading-relaxed mb-12">
              Don&apos;t get lost in a hotel booking grid. Get found on the only
              directory built specifically for Lake District wellness.
            </p>
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center px-10 py-5 bg-emerald-950 text-white font-bold rounded-full shadow-xl uppercase tracking-widest text-xs"
            >
              Discuss a Partnership
            </a>
          </div>

          {/* Decorative Background Text */}
          <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none overflow-hidden opacity-[0.03]">
            <div className="absolute top-20 right-10 text-[20vw] font-serif italic text-emerald-900 leading-none select-none rotate-12">
              Growth
            </div>
          </div>
        </section>

        {/* Differentiator Section */}
        <section className="bg-[#FAF9F6] py-32 border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-stone-100 bg-stone-200">
                  <Image
                    src="/images/lake-district-spas_hot-stone-massage.jpg"
                    alt="Professional hot stone massage therapy at a Lake District spa, skilled therapist placing heated basalt stones on client's back with white spa towels, showcasing traditional therapeutic massage treatments and holistic wellness services available at Lake District spa hotels and retreats"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-10 -left-10 bg-white p-8 rounded-3xl shadow-xl hidden lg:block border border-stone-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-stone-400">
                        Monthly Traffic
                      </p>
                      <p className="font-serif text-2xl text-stone-900">
                        +20% High Intent Users
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
                  The Differentiator
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
                  The Spa Directory That <br />
                  <span className="italic">Actually Helps.</span>
                </h2>
                <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                  <p>
                    Major booking platforms treat spas as an afterthought with a
                    simple &quot;has spa&quot; checkbox buried in hotel
                    listings. Visitors can&apos;t easily tell what facilities
                    you actually have, or whether access is included with your
                    stay.
                  </p>
                  <p className="font-medium text-emerald-950">
                    Lake District Spas exists to fix that.
                  </p>
                  <p>
                    We surface the details that matter: your nine thermal
                    experiences, your adults-only policy, your outdoor hot tub
                    with fell views. The specifics that help visitors find and
                    find and book the perfect spa for them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listing & Integration */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-700 block mb-6">
                Our Offerings
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-stone-900 leading-tight">
                Elevate Your Presence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
              {/* Standard Listings */}
              <div className="relative bg-[#FDFCFB] p-12 md:py-6 md:px-4 rounded-[3rem] shadow-sm overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Circle className="h-32 w-32 text-emerald-900" />
                </div>
                <div className="relative z-10 flex flex-col flex-grow">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 shadow-sm flex items-center justify-center text-emerald-900 mb-8 border border-emerald-100">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-3xl text-stone-900 mb-6">
                    Standard Listings
                  </h3>
                  <div className="text-stone-500 font-light leading-relaxed mb-2">
                    A standard listing on our directory, showcasing your
                    spa&apos;s details to visitors actively researching Lake
                    District wellness escapes.
                  </div>
                  <p className="text-emerald-900 font-bold text-xl mb-8">
                    £0/month
                  </p>
                  <ul className="space-y-4 mb-10">
                    {[
                      'Part of the lake district spas directory',
                      'Direct links to your website',
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start text-stone-600 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-3 opacity-60 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-stone-300 text-stone-500 font-bold rounded-full shadow-sm uppercase tracking-widest text-xs mt-auto cursor-not-allowed opacity-60"
                  >
                    Current
                  </button>
                </div>
              </div>

              {/* Featured listiongs */}
              <div className="relative bg-[#FDFCFB] p-12 md:py-6 md:px-4 rounded-[3rem] border-2 border-emerald-100 shadow-sm overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Star className="h-32 w-32 text-emerald-900" />
                </div>
                <div className="relative z-10 flex flex-col flex-grow">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 shadow-sm flex items-center justify-center text-emerald-900 mb-8 border border-emerald-100">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-3xl text-stone-900 mb-6">
                    Featured Listings
                  </h3>
                  <div className="text-stone-500 font-light leading-relaxed mb-2">
                    Elevated directory placement with premium visuals and
                    monthly traffic reports to maximize your spa&apos;s
                    visibility.
                  </div>
                  <p className="text-emerald-900 font-bold text-xl mb-8">
                    £99/month
                  </p>
                  <ul className="space-y-4 mb-10">
                    {[
                      'Featured theme on the listings page',
                      'Priority badges & labels',
                      'Monthly traffic analysis report',
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start text-stone-600 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-3 opacity-60 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#enquiry"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-emerald-950 text-white font-bold rounded-full shadow-xl uppercase tracking-widest text-xs mt-auto"
                  >
                    Select
                  </a>
                </div>
              </div>

              {/* Premium Listings */}
              <div className="relative bg-[#FDFCFB] p-12 md:py-6 md:px-4 rounded-[3rem] border-2 border-emerald-200 shadow-sm overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="h-32 w-32 text-emerald-900" />
                </div>
                <div className="relative z-10 flex flex-col flex-grow">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 shadow-sm flex items-center justify-center text-emerald-900 mb-8 border border-emerald-100">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-3xl text-stone-900 mb-6">
                    Premium Listings
                  </h3>
                  <div className="text-stone-500 font-light leading-relaxed mb-2">
                    Top-tier directory placement with custom campaign content,
                    professional SEO article, and monthly analytics to maximize
                    conversions.
                  </div>
                  <p className="text-emerald-900 font-bold text-xl mb-8">
                    £250/month
                  </p>
                  <ul className="space-y-4 mb-10">
                    {[
                      'Top of grid placement on the listings page',
                      'Campaign of your choice section on your spa page',
                      'Priority badges & labels',
                      'Bespoke article on your spa using our SEO expertise',
                      'Monthly traffic analysis report',
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start text-stone-600 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-3 opacity-60 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#enquiry"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-emerald-950 text-white font-bold rounded-full shadow-xl uppercase tracking-widest text-xs mt-auto"
                  >
                    Select
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO & Consulting Section */}
        <section className="bg-emerald-950 py-32 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <Code className="h-96 w-96 absolute -bottom-20 -right-20 rotate-12" />
          </div>
          <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-20 items-center">
            <div className="md:w-1/2 space-y-8">
              <span className="text-xs font-bold uppercase tracking-[0.5em] text-emerald-400">
                Technical Excellence
              </span>
              <h2 className="font-serif text-4xl md:text-6xl leading-tight">
                Beyond the <br />
                <span className="italic">Directory</span>
              </h2>
              <p className="text-emerald-100/70 text-xl font-light leading-relaxed">
                As a senior product engineer specialising in spa and wellness, I
                help businesses transform their digital presence into a
                high-converting booking engine.
              </p>
              <div className="grid grid-cols-1 gap-6">
                {[
                  'Get More Bookings from Google',
                  'Speed Up Your Website',
                  'Understand Your Customer Data',
                ].map((service, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-bold tracking-wide uppercase">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 bg-white/5 backdrop-blur-sm p-12 rounded-[3rem] border border-white/10">
              <h3 className="font-serif text-2xl mb-6">
                &quot;Help your spa get found.&quot;
              </h3>
              <p className="text-emerald-100/60 font-light leading-relaxed mb-10">
                I work with spas across the world to identify what&apos;s
                stopping their site from converting visitors into bookings.
              </p>
              <a
                href="#enquiry"
                className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-emerald-400"
              >
                Discuss Technical Services
                <ChevronRight className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 bg-[#FAF9F6]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl text-stone-900 mb-6 leading-tight">
                Partner FAQ
              </h2>
              <div className="h-px w-24 bg-amber-200 mx-auto" />
            </div>
            <div className="grid grid-cols-1 gap-8">
              {[
                {
                  q: 'How much does it cost to be listed?',
                  a: 'Standard listings are completely free. We believe in providing a comprehensive directory for our visitors. Premium featured and Premium Listings carry a monthly fees.',
                },
                {
                  q: "How do I update my spa's information?",
                  a: 'Simply use the contact form below or email contact@lakedistrictspas.co.uk. We aim to update verified partner information within 24 hours of receiving the request.',
                },
                {
                  q: 'Do you take commission on bookings?',
                  a: 'No. Unlike major OTA platforms, we are a directory, not a booking agent. We drive qualified traffic directly to your own booking system or phone lines at zero commission.',
                },
                {
                  q: 'What results can I expect from a featured listing?',
                  a: 'Featured partners typically see a 2x increase in profile views and direct clicks to their website. Our audience is highly targeted with visitors specifically searching for spa experiences in the Lake District.',
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-white p-10 rounded-3xl border border-stone-100 shadow-sm"
                >
                  <h3 className="font-serif text-xl text-stone-900 mb-4">
                    {faq.q}
                  </h3>
                  <p className="text-stone-500 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="enquiry" className="py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
              <div className="md:col-span-5 space-y-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 block mb-6">
                    Let&apos;s Talk
                  </span>
                  <h2 className="font-serif text-4xl text-stone-900 leading-tight">
                    Start the <br />
                    Conversation
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-stone-50 rounded-xl text-stone-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="text-stone-500 text-sm font-light">
                      I personally respond to all enquiries, usually within 24
                      hours. No sales bots.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-stone-50 rounded-xl text-stone-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <p className="text-stone-500 text-sm font-light">
                      Direct access:{' '}
                      <span className="font-bold text-stone-900">
                        contact@lakedistrictspas.co.uk
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7">
                <form
                  action="https://formspree.io/f/xbddjdzg"
                  method="POST"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-4"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Your name"
                        className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-emerald-900/10 placeholder:text-stone-300 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-4"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="email@address.com"
                        className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-emerald-900/10 placeholder:text-stone-300 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="interest"
                      className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-4"
                    >
                      Interest
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-emerald-900/10 text-stone-900 text-sm appearance-none cursor-pointer"
                    >
                      <option>Featured Directory Placement</option>
                      <option>Premium Listings</option>
                      <option>SEO & Technical Consulting</option>
                      <option>Other Partnership Enquiry</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-4"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell me about your spa or project..."
                      className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-emerald-900/10 placeholder:text-stone-300 text-sm resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-950/20"
                  >
                    Send Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
