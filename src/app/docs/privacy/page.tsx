import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy policy',
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <Link
        href={'/'}
        className="group flex divide-neutral-500 max-w-28 rounded-full border border-neutral-500 bg-neutral-800 text-xs font-medium drop-shadow-sm transition-colors duration-75 hover:bg-neutral-700 sm:divide-x animate-slide-up-fade [--offset:10px] [animation-delay:0ms] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in"
      >
        <span className="py-1.5 pl-4 text-foreground sm:pr-2.5">Go home</span>
        <span className="flex items-center gap-1.5 p-1.5 pl-2.5">
          <div className="rounded-full bg-neutral-100 p-0.5">
            <ArrowUpRight className="size-2.5 text-neutral-700 transition-transform duration-100 group-hover:-translate-y-px group-hover:translate-x-px" />
          </div>
        </span>
      </Link>

      <div className="border border-neutral-700 p-8 rounded-lg shadow space-y-6 text-neutral-200">
        <h1 className="text-3xl text-center font-bold mb-4">Privacy Policy</h1>

        <section className="mb-6">
          <h2 className="text-lg font-semibold">1. Introduction</h2>
          <p>
            Welcome to Mentor AI. Your privacy is important to us. This Privacy
            Policy explains how we collect, use, and share your personal
            information when you use our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold">2. Information We Collect</h2>
          <p>We collect various types of information, including:</p>
          <ul className="list-disc ml-6">
            <li>
              Personal Information (e.g., name, email, account credentials)
            </li>
            <li>Repository Data (code you connect to Mentor AI)</li>
            <li>Usage Data (how you interact with our platform)</li>
            <li>Cookies and tracking data</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold">
            3. How We Use Your Information
          </h2>
          <p>We use your data for various purposes, including:</p>
          <ul className="list-disc ml-6">
            <li>Providing and improving our services</li>
            <li>Enhancing AI-based recommendations</li>
            <li>Responding to customer support requests</li>
            <li>Ensuring security and preventing fraud</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold">
            4. Data Sharing and Disclosure
          </h2>
          <p>
            We do not sell your data. However, we may share information with:
          </p>
          <ul className="list-disc ml-6">
            <li>Service providers to help operate our platform</li>
            <li>Legal authorities when required by law</li>
            <li>Business partners in case of a merger or acquisition</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold">
            5. Security of Your Information
          </h2>
          <p>
            We take data security seriously and implement industry-standard
            measures. However, no method of transmission over the internet is
            100% secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold">6. Your Rights</h2>
          <p>You have rights regarding your data, including:</p>
          <ul className="list-disc ml-6">
            <li>Accessing, updating, or deleting your personal data</li>
            <li>Opting out of certain data collection practices</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold">7. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use
            of our services means you accept any changes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, contact us at
            irereapps@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
