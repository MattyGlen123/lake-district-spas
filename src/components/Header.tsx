'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import SideMenu from './SideMenu';

const Header = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/spas', label: 'Spas' },
    { href: '/spa-treatments', label: 'Treatments' },
    { href: '/spa-days', label: 'Day passes' },
  ] as const;

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
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

            {/* Desktop Nav Links + Menu Button - Right aligned */}
            <div className="flex items-center gap-6">
              <nav
                className="hidden md:flex items-center gap-6 text-sm font-medium"
                aria-label="Main navigation"
              >
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={
                      pathname === href
                        ? 'text-amber-600'
                        : 'text-stone-600'
                    }
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                className="p-3 bg-stone-100 border border-stone-200 rounded-full text-stone-400"
                onClick={() => setIsSideMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
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
