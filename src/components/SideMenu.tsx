'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X, MapPin, ChevronRight } from 'lucide-react';
import { spaData } from '@/data/spas';
import { Spa } from '@/types/spa';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const pathname = usePathname();

  // Group spas by location
  const groupedSpas = useMemo(() => {
    return spaData.reduce((acc, spa) => {
      if (!acc[spa.location]) acc[spa.location] = [];
      acc[spa.location].push(spa);
      return acc;
    }, {} as Record<string, Spa[]>);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out border-l border-stone-100 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-10 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-serif text-3xl text-stone-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-3 bg-stone-100 border border-stone-200 rounded-full text-stone-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-mineral-sage flex-grow overflow-y-auto px-8 py-10 space-y-12">
            {/* Pages Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-stone-400">
                  Pages
                </h3>
                <div className="h-px flex-grow bg-stone-100" />
              </div>
              <div className="space-y-3">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
                >
                  <span
                    className={`font-serif text-lg ${
                      pathname === '/' ? 'text-amber-700' : 'text-stone-800'
                    }`}
                  >
                    Home
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 ${
                      pathname === '/' ? 'text-amber-700' : 'text-stone-300'
                    }`}
                  />
                </Link>
                <Link
                  href="/spa-days"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
                >
                  <span
                    className={`font-serif text-lg ${
                      pathname === '/spa-days'
                        ? 'text-amber-700'
                        : 'text-stone-800'
                    }`}
                  >
                    Day Passes
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 ${
                      pathname === '/spa-days'
                        ? 'text-amber-700'
                        : 'text-stone-300'
                    }`}
                  />
                </Link>
                <Link
                  href="/couples-spa-lake-district"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
                >
                  <span
                    className={`font-serif text-lg ${
                      pathname === '/couples-spa-lake-district'
                        ? 'text-amber-700'
                        : 'text-stone-800'
                    }`}
                  >
                    Couples Spa Guide
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 ${
                      pathname === '/couples-spa-lake-district'
                        ? 'text-amber-700'
                        : 'text-stone-300'
                    }`}
                  />
                </Link>
                <Link
                  href="/about"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
                >
                  <span
                    className={`font-serif text-lg ${
                      pathname === '/about'
                        ? 'text-amber-700'
                        : 'text-stone-800'
                    }`}
                  >
                    About Us
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 ${
                      pathname === '/about'
                        ? 'text-amber-700'
                        : 'text-stone-300'
                    }`}
                  />
                </Link>
                <Link
                  href="/partnership"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
                >
                  <span className="font-serif text-lg">Partnership</span>
                </Link>
                <Link
                  href="/blog"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
                >
                  <span
                    className={`font-serif text-lg ${
                      pathname === '/blog' || pathname.startsWith('/blog/')
                        ? 'text-amber-700'
                        : 'text-stone-800'
                    }`}
                  >
                    Blog
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 ${
                      pathname === '/blog' || pathname.startsWith('/blog/')
                        ? 'text-amber-700'
                        : 'text-stone-300'
                    }`}
                  />
                </Link>
              </div>
            </div>

            {/* Spa Index Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-stone-400">
                  Spa Index
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  Browse by Location
                </p>
              </div>
            </div>

            {/* Location Groups */}
            {Object.entries(groupedSpas)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([location, spas]) => (
                <div key={location} className="space-y-6">
                  {/* Location Header */}
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-4 w-4 text-amber-600 opacity-60" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-400">
                      {location}
                    </h3>
                    <div className="h-px flex-grow bg-stone-100" />
                  </div>

                  {/* Spa Links */}
                  <div className="space-y-3">
                    {spas.map((spa) => {
                      const isActive = pathname === `/spa/${spa.url}`;
                      return (
                        <Link
                          key={spa.id}
                          href={`/spa/${spa.url}`}
                          onClick={onClose}
                          className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
                        >
                          <span
                            className={`font-serif text-lg ${
                              isActive ? 'text-amber-700' : 'text-stone-800'
                            }`}
                          >
                            {spa.name}
                          </span>
                          <ChevronRight
                            className={`h-4 w-4 ${
                              isActive ? 'text-amber-700' : 'text-stone-300'
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
