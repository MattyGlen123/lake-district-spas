'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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

          {/* Mobile Menu Button - Right (hidden for now, kept for future use) */}
          <button
            type="button"
            className="hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation - Empty for now, kept for future use */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            {/* Navigation items can be added here in the future */}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
