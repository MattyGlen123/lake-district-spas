'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import SideMenu from './SideMenu';

const Header = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Text - Left */}
            <Link href="/" className="flex items-center gap-3">
              <div className="p-1">
                <Image
                  src="/logo.svg"
                  alt="Lake District Spas logo"
                  width={48}
                  height={48}
                  className="h-10 w-10 md:h-12 md:w-12"
                  priority
                />
              </div>
              <span className="text-xl font-serif text-primary">
                Lake District Spas
              </span>
            </Link>

            {/* Menu Button - Right */}
            <button
              type="button"
              className="p-2 text-stone-700"
              onClick={() => setIsSideMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />
    </>
  );
};

export default Header;
