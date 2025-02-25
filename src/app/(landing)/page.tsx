import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SvgGrid } from "@/components/landing/grid";
import { BlurText } from "@/components/ui/blur-text";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="relative mx-auto mt-8 w-full max-w-screen-lg bg-neutral-800/40 overflow-hidden rounded-2xl  p-6 text-center sm:p-12 sm:px-0">
        <SvgGrid />
        <div className="max-w-4xl flex flex-col items-center mx-auto p-8 space-y-8 mt-9">
          <Link
            href={"/manifesto"}
            className="group flex divide-neutral-500 rounded-full border border-neutral-500 bg-neutral-800 text-xs font-medium drop-shadow-sm transition-colors duration-75 hover:bg-neutral-700 sm:divide-x animate-slide-up-fade [--offset:10px] [animation-delay:0ms] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in"
          >
            <span className="py-1.5 pl-4 text-foreground sm:pr-2.5">
              Introducing mentor
            </span>
            <span className="flex items-center gap-1.5 p-1.5 pl-2.5">
              <span className="hidden sm:block">Read more</span>
              <div className="rounded-full bg-neutral-100 p-0.5">
                <ArrowUpRight className="size-2.5 text-neutral-700 transition-transform duration-100 group-hover:-translate-y-px group-hover:translate-x-px" />
              </div>
            </span>
          </Link>
          <h1 className="flex flex-col items-center text-foreground font-serif font-medium text-6xl">
            <span>
              <BlurText
                text="Meet Your Intelligent"
                delay={150}
                animateBy="words"
                direction="top"
              />
            </span>
            <span>
              <BlurText
                text="Coding Mentor"
                delay={150}
                animateBy="words"
                direction="top"
              />
            </span>
          </h1>
          <p className="max-w-lg text-center font-medium text-foreground">
            The AI-powered workspace to mentor you on any codebase hosted on
            Github and document all your learning for future use.
          </p>

          <div>
            <Button className="rounded-lg" size={"lg"}>
              Early Access - it's free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
