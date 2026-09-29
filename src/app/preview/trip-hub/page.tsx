import Link from "next/link";
import PillButton from "@/components/pill-button";

export const metadata = {
  title: "Trip Hub — Preview | TruTravels",
  description:
    "What a traveller sees once their booking is confirmed: their tour leader, the group they're travelling with, the group chat, and everything they need before they fly.",
  robots: { index: false, follow: false },
};

/**
 * A shareable overview of the Trip Hub.
 *
 * WHY THIS PAGE EXISTS. The hub itself lives behind a login — it's the
 * post-booking area — so a link to it shows a log-in wall to anyone it's sent
 * to. This explains what the hub is and opens it with a real booking loaded, so
 * the link works for someone with no account and no context.
 *
 * NOINDEX. It's a working preview under a real domain, not a page of the site.
 */

const SECTIONS = [
  {
    id: "leader",
    name: "Your Leader",
    detail:
      "The guide who'll actually be on the trip — their name, where they're from, and a piece to camera introducing themselves. Put a face to it before you fly.",
  },
  {
    id: "group",
    name: "Your Group",
    detail:
      "Who else is on the trip: first name, country, age bracket, how many Tru trips they've done, and who's travelling together. The single most-asked question before a group tour, answered without asking.",
  },
  {
    id: "chat",
    name: "Group Chat",
    detail:
      "The group talking to each other weeks before departure, with Tru.D in the thread — tag it and it answers visa, packing and currency questions on the spot.",
  },
  {
    id: "itinerary",
    name: "Day By Day",
    detail:
      "The itinerary opened up per day: where you sleep, what's included, which meals, and a map link for each stop.",
  },
  {
    id: "prep",
    name: "Before You Fly",
    detail:
      "Meeting point, visa rules, which airport, spending money, vaccinations, the 24/7 emergency number — and a packing list you can tick off.",
  },
  {
    id: "faqs",
    name: "Tipping & FAQs",
    detail:
      "The awkward questions people would rather not phone up about, answered in writing.",
  },
];

export default function TripHubPreview() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-tru-pink">
        Internal Preview
      </p>
      <h1 className="font-heading text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
        The Trip Hub
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
        What a traveller gets the moment their booking is confirmed. Today that
        window — between paying and flying — is a confirmation email and
        silence. The hub fills it: who&rsquo;s taking them, who they&rsquo;re
        going with, and everything they need to sort before they go.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <PillButton href="/preview/trip-hub/demo">Open The Trip Hub</PillButton>
        <Link
          href="/preview/trip-hub/demo/chat"
          className="rounded-[10px] border border-white/20 px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:border-white/40 hover:bg-white/5"
        >
          Open The Group Chat
        </Link>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Loaded with a real example booking — Thailand Island Hopper, 12&ndash;25
        April 2026. No login needed.
      </p>

      {/* Where it sits */}
      <section className="mt-16">
        <h2 className="mb-5 font-heading text-xl font-black uppercase tracking-wide text-white">
          Where It Sits
        </h2>
        <ol className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          {[
            { step: "Book", note: "Checkout, confirmation email" },
            { step: "Trip Hub", note: "Everything between booking and flying", now: true },
            { step: "Travel", note: "You're on the trip" },
          ].map((s) => (
            <li
              key={s.step}
              className={`flex-1 rounded-[10px] border p-5 ${
                s.now
                  ? "border-tru-pink/40 bg-tru-pink/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <p
                className={`font-heading text-sm font-black uppercase tracking-wide ${
                  s.now ? "text-tru-pink" : "text-white"
                }`}
              >
                {s.step}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">{s.note}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
          In the product it&rsquo;s reached from a confirmed booking in My
          Account, so it only ever opens for the person who booked.
        </p>
      </section>

      {/* What's in it */}
      <section className="mt-16">
        <h2 className="mb-5 font-heading text-xl font-black uppercase tracking-wide text-white">
          What&rsquo;s In It
        </h2>
        <div className="grid gap-px overflow-hidden rounded-[10px] border border-white/10 bg-white/10 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={`/preview/trip-hub/demo#${s.id}`}
              className="group bg-tru-navy p-6 transition-colors hover:bg-white/[0.04]"
            >
              <p className="font-heading text-sm font-black uppercase tracking-wide text-white transition-colors group-hover:text-tru-pink">
                {s.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[10px] border border-white/10 bg-white/[0.02] p-6">
        <h2 className="font-heading text-sm font-black uppercase tracking-wide text-white">
          Worth Knowing
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-gray-400">
          <li>
            Everything on the demo is example content for one booking — the
            leader, the group, the messages and the dates are all made up.
          </li>
          <li>
            The chat and Tru.D replies are a working front end with no backend
            behind them; messages you send won&rsquo;t go anywhere.
          </li>
          <li>
            Best viewed on a phone as well as a desktop — the section bar sticks
            and the whole thing is built mobile-first.
          </li>
        </ul>
      </section>

      <div className="mt-12">
        <PillButton href="/preview/trip-hub/demo">Open The Trip Hub</PillButton>
      </div>
    </main>
  );
}
