'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Hexagon, Menu } from 'lucide-react';

import { MobileMenu } from './mobile-menu';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { ButtonLink } from './ui/button-link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScroll(50);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // prevent scrolling when menu is open
    document.body.style.overflow = isOpen ? 'unset' : 'hidden';
  };

  return (
    <nav
      className={cn(
        'w-full shadow sticky top-0 z-30 bg-background',
        scrolled && 'bg-muted/30 backdrop-blur border-b border-neutral-800',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl flex gap-2 items-center font-bold"
            >
              <Hexagon />
              Mentor
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavbarLink label="Features" href="/#features" />
              <NavbarLink label="FAQ" href="/#faq" />
              <NavbarLink label="About" href="/docs/manifesto" />
              <NavbarLink label="Changelog" href="/changelog" />
            </div>
          </div>

          <div className="sm:flex items-center space-x-4 hidden">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <ButtonLink href={'/register'} className="rounded-md">
              Sign Up
            </ButtonLink>
          </div>

          <button
            type="button"
            className="sm:hidden block bg-card"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu
              size={24}
              className="transform transition-transform duration-200 ease-in-out"
            />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} toggleMenu={toggleMenu} />
    </nav>
  );
};

const NavbarLink: React.FC<{
  href: string;
  label: string;
}> = ({ href, label }) => {
  return (
    <Link
      href={href}
      className="px-3 py-2 hover:text-muted-foreground transition-colors"
    >
      {label}
    </Link>
  );
};

export default Navbar;
