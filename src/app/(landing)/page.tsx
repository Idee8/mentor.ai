import { CTA } from "@/components/landing/cta";
import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Testimonials } from "@/components/landing/testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Testimonials />
      <Faq />

      <CTA
        description="Start tracking your link clicks and conversions in seconds and see exactly how your marketing drives revenue."
        primaryActionText="Start for free"
        secondaryActionText="Get a Demo"
        title="Supercharge your understanding"
      />
    </div>
  );
}
