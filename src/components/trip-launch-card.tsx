"use client";

import { CountdownBoxes, useCountdown } from "@/components/trip-countdown";
import type { TripLaunch } from "@/lib/data";

/**
 * The pre-launch stand-in for TripPricingCard.
 *
 * The notify-me modal is owned by TripBookingWrapper and opened by event, so
 * the card and the sticky bar can both raise it without either knowing about
 * the other — and only one can ever be on screen.
 *
 * A trip whose page is live but whose dates aren't on sale yet gets this in
 * place of the price-and-check-dates box: a countdown to the on-sale moment,
 * and one CTA that joins the notify list.
 *
 * WHY THE PRICE IS STILL HERE, MARKED INDICATIVE. Taking it away doesn't stop
 * people needing it — it just sends them to a competitor to find a number. An
 * indicative "from" price with the word indicative on it is more honest than
 * an empty box, and it's what decides whether someone joins the list at all.
 *
 * WHAT HAPPENS AT ZERO. The countdown reports `done` and the card switches to
 * "Dates are live" with a Check Dates button, so a page left open overnight
 * doesn't sit on 00:00:00:00 telling the visitor to wait for something that
 * already happened. The real page would re-render from the server by then;
 * this is the belt to that braces.
 */

export default function TripLaunchCard({
  launch,
  price,
  duration,
  tripTitle,
  onBookNow,
}: {
  launch: TripLaunch;
  price: number;
  duration: string;
  tripTitle: string;
  /** Used only after the countdown hits zero. */
  onBookNow: () => void;
}) {
  const left = useCountdown(launch.onSale);

  const onSaleLabel = new Date(launch.onSale).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const days = parseInt(duration, 10) || 1;
  const perDay = Math.round(price / days);
  const live = left?.done ?? false;

  return (
    <>
      <div className="rounded-[16px] border border-tru-pink/30 bg-tru-pink/[0.06] p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tru-pink opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-tru-pink" />
          </span>
          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">
            {live ? "Dates Are Live" : "Coming Soon"}
          </p>
        </div>

        {live ? (
          <>
            <p className="mb-5 text-sm leading-relaxed text-gray-200">
              Dates for {tripTitle} are open. Grab one before the list does.
            </p>
            <button
              onClick={onBookNow}
              className="w-full rounded-[10px] border px-5 py-3.5 font-heading text-sm font-bold uppercase tracking-wider transition"
              style={{ backgroundColor: "#FFD814", borderColor: "#FCD200", color: "#0F1111" }}
            >
              Check Dates &rarr;
            </button>
          </>
        ) : (
          <>
            <h3 className="mb-1 font-heading text-xl font-black uppercase leading-tight tracking-tight text-white">
              Bookings Open In
            </h3>
            <p className="mb-4 text-xs text-gray-400">
              Dates go live {onSaleLabel}
              {launch.firstDeparture && (
                <> &middot; first departure {new Date(launch.firstDeparture).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</>
              )}
            </p>

            <CountdownBoxes iso={launch.onSale} />

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-[10px] uppercase tracking-wider text-gray-400">From</span>
                <span className="font-heading text-3xl font-black leading-none text-white">&pound;{price}</span>
                <span className="text-sm text-gray-400">/ person</span>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Indicative &mdash; around <span className="font-bold text-white">&pound;{perDay}</span> a day. Confirmed
                when dates go live.
              </p>
            </div>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent("register-interest"))}
              className="mt-5 w-full rounded-[10px] bg-tru-pink px-5 py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light"
            >
              Notify Me When It&rsquo;s Live
            </button>
            <p className="mt-3 text-center text-xs leading-snug text-gray-400">
              We&rsquo;ll email you the morning dates open &mdash; before it goes out anywhere else.
            </p>

            {launch.interestCount !== undefined && (
              <p className="mt-3 text-center font-heading text-[10px] font-bold uppercase tracking-[0.15em] text-tru-pink">
                {launch.interestCount.toLocaleString("en-GB")} already waiting
              </p>
            )}
          </>
        )}

        <div className="mt-4 flex items-center justify-center gap-4 border-t border-white/10 pt-4">
          <img src="/images/atol-logo.png" alt="ATOL Protected" className="h-7 w-auto" />
          <img
            src="/images/abta-logo.png"
            alt="ABTA — Travel With Confidence"
            className="h-6 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
      </div>

    </>
  );
}
