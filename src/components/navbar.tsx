"use client";

import React from "react";
import Link from "next/link";
import { Hexagon } from "lucide-react";

import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="w-full shadow sticky top-0 z-50">
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
              <NavbarLink label="Features" href="/features" />
              <NavbarLink label="Entreprise" href="/entreprise" />
              <NavbarLink label="About" href="/about" />
              <NavbarLink label="Changelog" href="/changelog" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-muted-foreground">
              Login
            </Link>
            <Button className="rounded-md">Sign Up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavbarLink: React.FC<{
  href: string;
  label: string;
}> = ({ href, label }) => {
  return (
    <Link href={href} className="px-3 py-2 hover:text-muted-foreground">
      {label}
    </Link>
  );
};

export default Navbar;
