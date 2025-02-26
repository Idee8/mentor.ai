"use client";

import Link from "next/link";
import { SvgGrid } from "./grid";
import { ArrowUpRight } from "lucide-react";
import { BlurText } from "../ui/blur-text";
import { Button } from "../ui/button";
import { useContext } from "react";
import { LandingContext } from "@/app/(landing)/provider";

export function Hero() {
  const { setShowRequestAccessModal } = useContext(LandingContext);
  return (
    <div className="relative mx-auto mt-8 w-full max-w-screen-lg bg-neutral-800/40 overflow-hidden sm:rounded-2xl rounded-lg  p-6 text-center sm:p-12 sm:px-0">
      <SvgGrid />
      <div className="max-w-4xl flex flex-col items-center mx-auto md:p-8 py-8 px-2 space-y-8 mt-9">
        <Link
          href={"/docs/manifesto"}
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
        <h1 className="flex flex-col items-center text-foreground font-serif font-medium md:text-6xl text-4xl">
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
        <p className="md:max-w-lg text-center font-medium sm:text-base text-sm text-foreground">
          The AI-powered workspace to mentor you on any codebase hosted on
          Github and document all your learning for future use.
        </p>

        <div>
          <Button
            className="rounded-lg"
            size={"lg"}
            onClick={() => setShowRequestAccessModal(true)}
          >
            Early Access - it's free
          </Button>

          <div className="flex gap-4 items-center sm:h-10 mt-4 cursor-pointer">
            <div className="flex items-center justify-center -space-x-2">
              {[
                "/avatars/avatar-0.jpeg",
                "/avatars/avatar-1.jpg",
                "/avatars/avatar-2.jpeg",
              ].map((avatar, idx) => (
                <div
                  key={avatar}
                  className="relative inline-block h-8 w-8 rounded-full border-2 border-background bg-neutral-300"
                  style={{ zIndex: 4 - idx }}
                >
                  <img
                    src={avatar}
                    alt={`User ${idx}`}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Join 1,232+ developers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
