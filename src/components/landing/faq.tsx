"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function Faq() {
  return (
    <div
      className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:gap-20 justify-between px-10 sm:px-14 lg:px-8 py-12"
      id="faq"
    >
      <h2 className="flex flex-col text-3xl">
        Frequently <span>Asked</span> <span>Questions</span>
      </h2>
      <div className="flex flex-col flex-1 sm:mt-0 mt-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Which AI models does Mentor use?
            </AccordionTrigger>
            <AccordionContent>
              We plan to currently use latest AI models. We support Anthropic,
              OpenAI and Google models out of the box. For reasoning models we
              only support DeepSeek R1.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is there mobile support?</AccordionTrigger>
            <AccordionContent>
              Currently Mentor AI is only available on desktop.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              What are your data privacy & security policies?
            </AccordionTrigger>
            <AccordionContent>
              At Mentor AI, we take data privacy very seriously and implement
              state-of-the-art security measures to protect your data. You can
              learn more about{" "}
              <Link
                href={"/docs/privacy"}
                className="underline text-foreground"
              >
                our data privacy policies
              </Link>{" "}
              .
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Do you offer a free trial?</AccordionTrigger>
            <AccordionContent>
              Not currently, but we have the most generous free plan in the
              industry that you can use for as long as you want. If you require
              higher usage limits, more advanced features or dedicated support,
              you can upgrade to Pro or Business at any time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              I have more questions about Mentor. How can I get in touch?
            </AccordionTrigger>
            <AccordionContent>
              Sure, we're happy to answer any questions you might have. Just
              shoot us an email at{" "}
              <Link
                href={"mailto:hi@idee8.agency"}
                className="underline text-foreground"
              >
                hi@idee8.agency
              </Link>{" "}
              and we'll get back to you as soon as possible.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
