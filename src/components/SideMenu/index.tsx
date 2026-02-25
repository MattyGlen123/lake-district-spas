'use client';

import { useMemo, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { spaData } from '@/data/spas';
import { Spa } from '@/types/spa';
import { MenuLink } from './MenuLink';
import { CollapsibleSection } from './CollapsibleSection';
import { LocationHeader } from './LocationHeader';
import { COLLECTION_LINKS, PAGES_LINKS, isPathActive } from './links';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname();
  const [collectionOpen, setCollectionOpen] = useState(true);
  const [pagesOpen, setPagesOpen] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const groupedSpas = useMemo(
    () =>
      spaData.reduce(
        (acc, spa) => {
          if (!acc[spa.location]) acc[spa.location] = [];
          acc[spa.location].push(spa);
          return acc;
        },
        {} as Record<string, Spa[]>
      ),
    []
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out border-l border-stone-100 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-8 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-serif text-3xl text-stone-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-3 bg-stone-100 border border-stone-200 rounded-full text-stone-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-mineral-sage flex-grow overflow-y-auto px-8 pt-6 pb-24 space-y-12">
            <CollapsibleSection
              title="Collection"
              isOpen={collectionOpen}
              onToggle={() => setCollectionOpen(!collectionOpen)}
            >
              {COLLECTION_LINKS.map(({ href, label, match }) => (
                <MenuLink
                  key={href}
                  href={href}
                  isActive={isPathActive(match, pathname)}
                  onClose={onClose}
                >
                  {label}
                </MenuLink>
              ))}
            </CollapsibleSection>

            <CollapsibleSection
              title="Pages"
              isOpen={pagesOpen}
              onToggle={() => setPagesOpen(!pagesOpen)}
            >
              {PAGES_LINKS.map(({ href, label, match }) => (
                <MenuLink
                  key={href}
                  href={href}
                  isActive={isPathActive(match, pathname)}
                  onClose={onClose}
                >
                  {label}
                </MenuLink>
              ))}
            </CollapsibleSection>

            <div className="mb-6">
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-stone-400">
                Spa Index
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                Browse by Location
              </p>
            </div>

            {Object.entries(groupedSpas)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([location, spas]) => (
                <div key={location} className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <LocationHeader
                      location={location}
                      pathname={pathname}
                      onClose={onClose}
                    />
                    <div className="h-px flex-grow bg-stone-100" />
                  </div>
                  <div className="space-y-3">
                    {spas.map((spa) => (
                      <MenuLink
                        key={spa.id}
                        href={`/spa/${spa.url}`}
                        isActive={pathname === `/spa/${spa.url}`}
                        onClose={onClose}
                      >
                        {spa.name}
                      </MenuLink>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
