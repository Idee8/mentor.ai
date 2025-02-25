import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Faq />
    </div>
  );
}
