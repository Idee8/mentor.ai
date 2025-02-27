'use client';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';

import { Discord, Github, Twitter } from './icons';

export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between sm:flex-row flex-col-reverse sm:gap-0 gap-6">
        <div>
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl flex gap-2 items-center font-semibold"
            >
              <Hexagon />
              Mentor
            </Link>
          </div>
          <h2 className="font-mono mt-4">
            Accelerating engineering mentorship.
          </h2>
          <div className="flex gap-3 mt-4">
            <Link href={`https://github.com/Idee8/mentor.ai`} target="_blank">
              <Github />
            </Link>
            <Link href={`https://x.com/Idee8agency`} target="_blank">
              <Twitter />
            </Link>
            <Link href={`https://discord.gg/EB9XcReV`} target="_blank">
              <Discord />
            </Link>
          </div>
        </div>
        <div className="flex justify-between gap-8 mt-8">
          <div>
            <h2 className="font-mono text-muted-foreground">Features</h2>
            <ul className="text-sm space-y-2 mt-4">
              <li>Review</li>
              <li>Explanations</li>
              <li>Onboarding</li>
              <li>Documentation</li>
            </ul>
          </div>
          <div>
            <h2 className="font-mono text-muted-foreground">Resources</h2>
            <ul className="text-sm space-y-2 mt-4">
              <li>Blog</li>
              <li>Changelog</li>
              <li>Community</li>
              <li>Support Forum</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-xs space-x-2 flex w-full justify-start py-4 mt-4">
        <Link href={`/docs/tos`}>Terms of service</Link>
        <Link href={`/docs/privacy`}>Privacy Policy</Link>
      </div>
    </footer>
  );
}
