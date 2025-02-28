import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of service',
};

export default async function Page() {
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
        <h1 className="text-center sm:text-4xl text-3xl font-semibold">
          Terms of service
        </h1>
        <p>
          Subject to these Terms of Service (this "Agreement"), Mentor AI
          ("Mentor AI", "we", "us" and/or "our") provides access to Mentor AI's
          cloud-based mentorship platform (collectively, the "Services"). By
          using or accessing the Services, you acknowledge that you have read,
          understand, and agree to be bound by this Agreement.
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
          <p>
            By signing up and using the services provided by Mentor AI, you
            agree to be bound by the following terms and conditions.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">2. Description of Service</h2>
          <p>
            Mentor AI provides an AI-powered code mentorship platform to assist
            developers in understanding, improving, and documenting their code.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">3. Fair Use</h2>
          <ul className="list-disc pl-5">
            <li>Spreading misinformation</li>
            <li>Copyright infringement</li>
            <li>Promoting harmful activities</li>
            <li>Exploiting vulnerabilities</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">
            4. Intellectual Property Rights
          </h2>
          <p>
            The Service and its contents are owned by us and protected by
            applicable intellectual property laws.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">
            5. Repository and Data Ownership
          </h2>
          <p>
            You retain ownership of your code, but grant us a limited license to
            process and analyze it.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">6. Changes to these Terms</h2>
          <p>
            We reserve the right to revise and update these Terms of Service at
            any time.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">7. Contact Information</h2>
          <p>For questions, contact us at irereapps@gmail.com.</p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">8. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" without warranties of any kind.</p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">9. Limitation of Liability</h2>
          <p>
            We are not liable for any damages arising from the use of the
            Service.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">
            10. Governing Law and Jurisdiction
          </h2>
          <p>
            These Terms are governed by the laws of the State of California.
          </p>
        </section>

        <p className="mt-6 font-semibold">
          By using Mentor AI, you agree to these Terms of Service.
        </p>
      </div>
    </div>
  );
}
