import Link from 'next/link';

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div className="max-w-24">
        <Link
          href={'/'}
          className="group flex divide-neutral-500 rounded-full border border-neutral-500 bg-neutral-800 text-xs font-medium drop-shadow-sm transition-colors duration-75 hover:bg-neutral-700 sm:divide-x animate-slide-up-fade [--offset:10px] [animation-delay:0ms] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in"
        >
          <span className="py-1.5 pl-4 text-foreground sm:pr-2.5">Go home</span>
        </Link>
      </div>
      <div className="border border-border p-3 rounded-lg shadow space-y-3">
        <h1 className="font-serif text-3xl mt-3">Code Comphrension</h1>
        <p>
          Mentor is an AI Agent to help you understand and learn (Code
          Comphrension). Our approach is to build the engineer + mentor of the
          future: a human-AI pair that's an order of magnitude more effective
          than any one person. We build software and models to invent at the
          edge of what's useful and what's possible.
        </p>
        <p>
          This hybrid agent will have effortless control over their codebase and
          no low-entropy keystrokes. They will iterate at the speed of their
          judgment, even in the most complex systems. Using a combination of AI
          and human ingenuity, they will out-smart and out-engineer the best
          pure-AI system. We are aiming to make understanding simple.
        </p>
        <p>
          Our work has already improved the lives of hundreds of thousands of
          programmers. If this excites you, we'd love to hear from you. — Irere
          Emmanuel, and the Idee8 team
        </p>
      </div>
    </div>
  );
}
