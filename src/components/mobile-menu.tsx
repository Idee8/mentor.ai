'use client';

import Link from 'next/link';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function MobileMenu({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 bg-background/95 backdrop-blur-sm z-50 sm:hidden',
        'transition-all duration-300 ease-in-out',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      <div className="flex justify-end items-center p-8">
        <X
          size={24}
          onClick={toggleMenu}
          className="absolute transform transition-transform duration-200 ease-in-out"
        />
      </div>
      <div className="flex flex-col items-center justify-center h-full space-y-8">
        <MobileNavLink label="Features" href="/features" onClick={toggleMenu} />
        <MobileNavLink
          label="Entreprise"
          href="/entreprise"
          onClick={toggleMenu}
        />
        <MobileNavLink label="About" href="/about" onClick={toggleMenu} />
        <MobileNavLink
          label="Changelog"
          href="/changelog"
          onClick={toggleMenu}
        />
        <div className="flex flex-col items-center space-y-4 pt-8">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleMenu}
          >
            Login
          </Link>
          <Button className="rounded-md w-32" onClick={toggleMenu}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}

const MobileNavLink: React.FC<{
  href: string;
  label: string;
  onClick: () => void;
}> = ({ href, label, onClick }) => {
  return (
    <Link
      href={href}
      className="text-xl font-semibold hover:text-muted-foreground transition-colors"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};
