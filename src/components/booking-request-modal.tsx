"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { trips } from "@/lib/data";

/**
 * "Request Date Change" and "Request Cancellation" from the bookings page.
 *
 * THE FLOW. Neither of these can be self-service: moving a departure or
 * cancelling touches the manifest, the local operator's headcount and the
 * money, and the deposit terms differ per booking. So the customer says what
 * they want, and it goes to the bookings team as a filled-in email — they make
 * the change and reply.
 *
 * WHY THE EMAIL IS SHOWN BEFORE IT'S SENT. A request that disappears into a
 * form is the thing people chase by phone an hour later. Showing exactly what
 * the team receives — reference, current departure, requested departure, note
 * — means the customer can see it's complete, and the team gets a message that
 * doesn't need a reply just to establish which booking it's about.
 *
 * DATE CHANGE OFFERS REAL DEPARTURES, read from the trip's own `departures`
 * and filtered to future dates, so nobody requests a date we don't run. A
 * "not sure yet" option exists because plenty of people know they need to move
 * before they know where to.
 *
 * NO BACKEND. `onSend` is where the POST goes; today it just advances to the
 * confirmation. The address below is the bookings team's, from the T&Cs.
 */

export const BOOKINGS_EMAIL = "bookings@trutravels.com";

/** How long the team takes to come back — shown on the confirmation so the
 *  customer knows when chasing is reasonable. */
const RESPONSE_TIME = "one working day";

export type RequestKind = "date-change" | "cancellation";

export type RequestBooking = {
  bookingRef: string;
  tripId: string;
  tripTitle: string;
  departureDate: string;
  travellers: number;
  balanceDue: number;
  depositPaid: number;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const CANCEL_REASONS = [
  "Change of plans",
  "Can't get the time off work",
  "Financial reasons",
  "Illness or injury",
  "Something else",
];

export default function BookingRequestModal({
  kind,
  booking,
  customer,
  onClose,
}: {
  kind: RequestKind;
  booking: RequestBooking;
  customer: { name: string; email: string };
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => setMounted(true), []);
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Future departures for this trip, minus the one they're already on. */
  const alternatives = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const trip = trips.find((t) => t.id === booking.tripId);
    return (trip?.departures ?? [])
      .filter((d) => d.date > today && d.date !== booking.departureDate && d.status !== "full")
      .slice(0, 8);
  }, [booking.tripId, booking.departureDate]);

  const isDateChange = kind === "date-change";
  const options = isDateChange ? alternatives.map((d) => d.date) : CANCEL_REASONS;

  const subject = isDateChange
    ? `Date change request — ${booking.bookingRef}`
    : `Cancellation request — ${booking.bookingRef}`;

  const body = [
    `Booking reference: ${booking.bookingRef}`,
    `Trip: ${booking.tripTitle}`,
    `Current departure: ${fmt(booking.departureDate)}`,
    `Travellers: ${booking.travellers}`,
    isDateChange
      ? `Requested departure: ${choice ? fmt(choice) : "Not sure yet — happy to talk it through"}`
      : `Reason: ${choice || "Not given"}`,
    !isDateChange && booking.depositPaid
      ? `Deposit paid: £${booking.depositPaid} (non-refundable)`
      : "",
    booking.balanceDue > 0 ? `Balance outstanding: £${booking.balanceDue}` : "",
    "",
    note.trim() ? `Note from ${customer.name}:\n${note.trim()}` : "",
    "",
    `From: ${customer.name} <${customer.email}>`,
  ]
    .filter(Boolean)
    .join("\n");

  const heading = isDateChange ? "Request A Date Change" : "Request Cancellation";

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        className="relative mx-4 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-[10px] border border-white/10 bg-tru-navy"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">
              {booking.bookingRef}
            </p>
            <p className="font-heading text-sm font-black uppercase tracking-tight text-white">
              {sent ? "Request Sent" : heading}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 transition hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {sent ? (
            <div className="py-6 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-tru-green/30 bg-tru-green/15">
                <svg className="h-7 w-7 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h3 className="mb-2 font-heading text-xl font-black uppercase tracking-tight text-white">
                It&rsquo;s With The <span className="text-tru-pink">Team</span>
              </h3>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-300">
                We&rsquo;ve sent your request to {BOOKINGS_EMAIL} and copied you in. Someone will come back to you
                within {RESPONSE_TIME}.
              </p>
              <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-gray-500">
                {isDateChange
                  ? "Nothing changes on your booking until they confirm it — your current departure is still yours."
                  : "Your booking is still active until they confirm the cancellation."}
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-[10px] bg-tru-pink px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm leading-relaxed text-gray-300">
                {isDateChange
                  ? "Tell us when you'd rather travel and we'll check availability and any difference in price. Nothing changes until the team confirms it."
                  : `Let us know why and we'll come back with exactly what you'd get back. Your £${booking.depositPaid} deposit is non-refundable.`}
              </p>

              <fieldset className="mx-0 mb-5 border-0 p-0">
                <legend className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">
                  {isDateChange ? "Move to" : "Reason"}
                </legend>

                {isDateChange && alternatives.length === 0 ? (
                  <p className="rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                    We haven&rsquo;t published the next set of dates for this trip yet. Send the request and the team
                    will come back with what&rsquo;s coming up.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {options.map((value) => {
                      const dep = isDateChange ? alternatives.find((d) => d.date === value) : undefined;
                      const on = choice === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setChoice(on ? "" : value)}
                          aria-pressed={on}
                          className={`flex w-full items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition ${
                            on
                              ? "border-tru-pink bg-tru-pink/10"
                              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <span className="flex-1 text-sm text-white">{isDateChange ? fmt(value) : value}</span>
                          {/* The spots figure is the same one the trip page
                              shows — no point offering a date that's nearly
                              gone without saying so. */}
                          {dep?.spotsLeft !== undefined && dep.spotsLeft <= 4 && (
                            <span className="font-heading text-[9px] font-bold uppercase tracking-wider text-tru-pink">
                              {dep.spotsLeft} left
                            </span>
                          )}
                          {on && (
                            <svg className="h-4 w-4 flex-none text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {isDateChange && alternatives.length > 0 && (
                  <p className="mt-3 text-xs text-gray-500">
                    Not sure yet? Leave this blank and say so below — the team will talk it through with you.
                  </p>
                )}
              </fieldset>

              <div className="mb-5">
                <label
                  htmlFor="br-note"
                  className="mb-2 block font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink"
                >
                  Anything else <span className="text-gray-600">(optional)</span>
                </label>
                <textarea
                  id="br-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    isDateChange
                      ? "Flights already booked, travelling with someone else on the same trip, anything that matters."
                      : "Anything you'd like us to know."
                  }
                  className="w-full resize-y rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-tru-pink/50 focus:outline-none"
                />
              </div>

              {/* What the team actually receives. */}
              <details className="mb-5 rounded-[10px] border border-white/10 bg-white/[0.03]">
                <summary className="cursor-pointer select-none px-4 py-3 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 transition hover:text-white">
                  See what we&rsquo;ll send
                </summary>
                <div className="border-t border-white/10 px-4 py-3">
                  <p className="mb-2 text-xs text-gray-500">
                    To: {BOOKINGS_EMAIL} &middot; Subject: {subject}
                  </p>
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-gray-300">{body}</pre>
                </div>
              </details>

              <div className="flex flex-col gap-3 sm:flex-row-reverse">
                <button
                  onClick={() => setSent(true)}
                  className="flex-1 rounded-[10px] bg-tru-pink px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light"
                >
                  Send To The Team
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-[10px] border border-white/15 px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-gray-300 transition hover:border-white/30 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
