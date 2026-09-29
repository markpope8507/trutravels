import Link from "next/link";
import PillButton from "@/components/pill-button";
import BookingTripHubAccess from "@/components/booking-trip-hub-access";

export const metadata = {
  title: "Trip Hub — Preview | TruTravels",
  description:
    "The Trip Hub panel on My Bookings — locked until the balance is paid, then the way into the trip's leader, group, chat and prep.",
  robots: { index: false, follow: false },
};

/**
 * A shareable overview of the Trip Hub.
 *
 * WHY THIS PAGE EXISTS. The hub sits inside My Bookings, behind a login and
 * behind a paid-in-full booking — so a link to it shows a log-in wall to
 * whoever it's sent to. This shows the panel in both of its states and opens
 * the hub itself with an example booking loaded.
 *
 * THE PANELS ARE THE REAL COMPONENT, not screenshots or a rebuild: the same
 * BookingTripHubAccess that booking-history.tsx renders in a booking's Access
 * tab, mounted twice with a different balance.
 *
 * NOINDEX. A working preview on a real domain, not a page of the site.
 */

const SECTIONS = [
  {
    id: "leader",
    name: "Your Leader",
    detail:
      "The guide who'll actually be on the trip, with a piece to camera introducing themselves. A face to it before you fly.",
  },
  {
    id: "group",
    name: "Your Group",
    detail:
      "Who else is on the trip: first name, country, age bracket, how many Tru trips they've done, and who's travelling together.",
  },
  {
    id: "chat",
    name: "Group Chat",
    detail:
      "The group talking weeks before departure, with Tru.D in the thread answering visa, packing and currency questions.",
  },
  {
    id: "itinerary",
    name: "Day By Day",
    detail:
      "The itinerary opened up per day — where you sleep, what's included, which meals, and a map link per stop.",
  },
  {
    id: "prep",
    name: "Before You Fly",
    detail:
      "Meeting point, visas, airports, spending money, vaccinations, the 24/7 emergency number, and a packing list to tick off.",
  },
  {
    id: "faqs",
    name: "Tipping & FAQs",
    detail: "The awkward questions people would rather not phone up about.",
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
        A traveller finds it on <span className="text-white">My Bookings</span>,
        inside their booking. It stays locked until the balance is cleared, then
        opens into everything they need before they fly. Today that window
        &mdash; between paying and flying &mdash; is a confirmation email and
        silence.
      </p>

      {/* The section itself, both states */}
      <section className="mt-14">
        <h2 className="font-heading text-xl font-black uppercase tracking-wide text-white">
          On The Bookings Page
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
          Both of these are the live component, not a mock-up &mdash; the same
          panel a booking renders, shown with a balance outstanding and with the
          trip paid off.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Balance outstanding &mdash; locked
            </p>
            <BookingTripHubAccess balanceDue={736} hubHref="/preview/trip-hub/demo" />
          </div>
          <div>
            <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-green">
              Paid in full &mdash; unlocked
            </p>
            <BookingTripHubAccess balanceDue={0} hubHref="/preview/trip-hub/demo" />
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          The locked state sells what&rsquo;s behind it rather than just saying
          no &mdash; clearing the balance is the action it exists to prompt, and
          its four icons are the four tiles the unlocked state opens with.
        </p>
      </section>

      {/* What the CTA opens */}
      <section className="mt-16">
        <h2 className="font-heading text-xl font-black uppercase tracking-wide text-white">
          What &ldquo;Enter Your Trip Hub&rdquo; Opens
        </h2>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <PillButton href="/preview/trip-hub/demo">Open The Trip Hub</PillButton>
          <Link
            href="/preview/trip-hub/demo/chat"
            className="rounded-[10px] border border-white/20 px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:border-white/40 hover:bg-white/5"
          >
            Open The Group Chat
          </Link>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Loaded with an example booking &mdash; Thailand Island Hopper,
          12&ndash;25 April 2026. No login needed.
        </p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-[10px] border border-white/10 bg-white/10 sm:grid-cols-2">
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
            The panel is currently switched off in the product &mdash; the
            account area was trimmed to phase 1 and the Access tab went with it.
            Listing that tab again turns the section back on.
          </li>
          <li>
            Everything in the hub is example content for one booking: the
            leader, the group, the messages and the dates are made up.
          </li>
          <li>
            The chat and Tru.D replies are a working front end with nothing
            behind them &mdash; messages you send won&rsquo;t go anywhere.
          </li>
          <li>Worth opening on a phone too; it&rsquo;s built mobile-first.</li>
        </ul>
      </section>
    </main>
  );
}
