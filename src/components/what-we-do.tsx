import type React from "react";

/**
 * "What we do" — the homepage's one <h1>.
 *
 * Added for SEO and for language models. Before this, the homepage had three
 * <h1>s and all three were hero carousel slides ("Leave Ordinary Behind",
 * "Thailand Summer Sale", "Rio Carnival 2027"), so the most important heading
 * on the page was a promotion that rotates with the campaign, and no heading
 * anywhere named the product. The hero headline is a <p> now — don't promote it
 * back; one <h1> per page and this is it.
 *
 * Placement follows every comparable operator: Intrepid, G Adventures, Intro
 * Travel and Topdeck all put a plain statement of the category directly below
 * the hero. The layout — statement left, prose right — is Intro Travel's.
 *
 * The stats are a third grid child rather than nested in the heading column, so
 * mobile (one column) drops them under the body copy while desktop places them
 * back under the h1.
 *
 * Mirrored by the same block in converted/index.html.
 */

const FACTS: { n: string; suffix?: string; label: string; icon: React.ReactNode }[] = [
  {
    n: "10–20",
    label: "Per group",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-1a4 4 0 0 0-4-4h-1m-4 5H2v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1Zm-2-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6-1a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
      />
    ),
  },
  {
    n: "18–45",
    label: "Age range",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"
      />
    ),
  },
  {
    n: "35",
    suffix: "+",
    label: "Countries",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
      </>
    ),
  },
  {
    n: "65",
    suffix: "+",
    label: "Trips",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 4-6 2.5v13L9 17l6 3 6-2.5v-13L15 7 9 4Zm0 0v13m6-10v13"
      />
    ),
  },
];

export default function WhatWeDo() {
  return (
    <section className="relative overflow-hidden pt-16 pb-6 lg:pt-22 lg:pb-8">
      {/* The logo smile. Wider than a square mark, so it sits lower and runs
          larger — otherwise it reads as a stripe across the corner. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bg-assets/tru-logo.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-20 top-[8%] w-[280px] sm:w-[420px] lg:w-[580px] opacity-[0.05] brightness-0 invert"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0 items-start">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-4">
              Small Group Adventure Travel
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-black uppercase leading-[0.95] tracking-tight text-white">
              Unforgettable
              <span className="block text-tru-pink">Small Group Adventures</span>
            </h1>
          </div>

          {/* mt-[1.375rem] on desktop starts the copy level with the cap of
              "UNFORGETTABLE" rather than with the eyebrow above it. Measured,
              not derived — the h1's 0.95 leading pulls its cap up inside its
              own box, so the eyebrow height doesn't cancel it. */}
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-[1.375rem]">
            <p className="text-gray-300 text-base sm:text-lg leading-[1.75] mb-5">
              You deserve more from your travels. Start your journey solo, and leave with unforgettable memories,
              incredible new connections, a full camera roll and a brand new version of yourself.
            </p>
            <p className="text-gray-300 text-base sm:text-lg leading-[1.75] mb-5">
              <strong className="text-white font-semibold">
                TruTravels’ small group adventures for 18 to 40-somethings
              </strong>{" "}
              are built to remind you what it is to feel inspired, connected and completely alive. Let your Local
              Legend show you the version of the place most travellers miss.
            </p>
            <p className="text-gray-300 text-base sm:text-lg leading-[1.75]">
              Travel with TruTravels and{" "}
              <strong className="text-white font-semibold">Leave Ordinary Behind.</strong>
            </p>
          </div>

          {/* Third grid child, not nested in the heading column — that's what
              lets mobile drop it below the copy while desktop keeps it under
              the h1. Four across at every width, which is why the labels are
              one or two words: at 375px each column is about 77px. */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 lg:col-start-1 lg:row-start-2">
            {FACTS.map((f) => (
              <div key={f.label} className="text-center">
                <span className="mx-auto mb-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-tru-pink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-full w-full">
                    {f.icon}
                  </svg>
                </span>
                <p className="font-heading text-lg sm:text-2xl font-black leading-none text-white tabular-nums mb-1">
                  {f.n}
                  {f.suffix}
                </p>
                <p className="text-gray-400 text-[0.6875rem] sm:text-xs leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
