"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { FIELD_HINT, FIELD_INPUT, FIELD_LABEL, FORM_SUBMIT } from "@/lib/form-classes";

/**
 * "Notify me when this goes on sale" — the CTA on a trip that hasn't launched.
 *
 * WHAT IT ASKS FOR. Email, and nothing else that isn't needed. The one
 * optional extra is which month they'd travel: it's the single thing that
 * makes the list worth having, because it tells the team which departures to
 * open first rather than just how many people are waiting.
 *
 * SAYS WHAT HAPPENS NEXT. "We'll email you" is where most register-interest
 * forms stop. The confirmation says when (the on-sale date they're already
 * looking at) and what the email will contain, because the next question after
 * signing up is always "so when do I hear?".
 *
 * NO BACKEND — `onSubmit` is where the POST goes.
 */

export default function RegisterInterestModal({
  tripTitle,
  onSaleLabel,
  onClose,
}: {
  tripTitle: string;
  /** Human-readable on-sale date, e.g. "14 November 2026". */
  onSaleLabel: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => setMounted(true), []);
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* The next twelve months, generated rather than listed — a hardcoded list
     goes stale the moment the year turns. */
  const options = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + i + 1);
    return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  });

  const toggleMonth = (m: string) =>
    setMonths((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Register interest in ${tripTitle}`}
        className="relative mx-4 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-[10px] border border-white/10 bg-tru-navy"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="min-w-0">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">Coming Soon</p>
            <p className="truncate font-heading text-sm font-black uppercase tracking-tight text-white">{tripTitle}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 transition hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {done ? (
            <div className="py-6 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-tru-pink/30 bg-tru-pink/15">
                <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h3 className="mb-2 font-heading text-xl font-black uppercase tracking-tight text-white">
                You&rsquo;re On The <span className="text-tru-pink">List</span>
              </h3>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-300">
                We&rsquo;ll email you on {onSaleLabel} — the morning dates go live, before it goes out anywhere else.
              </p>
              <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-gray-500">
                One email about this trip. Nothing else, unless you&rsquo;re already on the newsletter.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-[10px] bg-tru-pink px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light"
              >
                Done
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
            >
              <p className="mb-6 text-sm leading-relaxed text-gray-300">
                Dates go live on <span className="font-semibold text-white">{onSaleLabel}</span>. Leave your email and
                we&rsquo;ll tell you the morning they do — before it goes out anywhere else.
              </p>

              <div className="mb-4">
                <label htmlFor="ri-email" className={FIELD_LABEL}>
                  Email <span className="text-gray-500">*</span>
                </label>
                <input
                  id="ri-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  autoComplete="email"
                  className={FIELD_INPUT}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="ri-name" className={FIELD_LABEL}>
                  First Name <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  id="ri-name"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  autoComplete="given-name"
                  className={FIELD_INPUT}
                />
              </div>

              <fieldset className="mx-0 mb-6 border-0 p-0">
                <legend className={FIELD_LABEL}>
                  When would you go? <span className="text-gray-500">(optional)</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {options.map((m) => {
                    const on = months.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMonth(m)}
                        aria-pressed={on}
                        className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                          on
                            ? "border-tru-pink bg-tru-pink/10 text-tru-pink"
                            : "border-white/15 text-gray-300 hover:border-tru-pink/50 hover:text-white"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
                <p className={FIELD_HINT}>
                  Tells us which departures to open first — not a commitment to anything.
                </p>
              </fieldset>

              <button type="submit" className={FORM_SUBMIT}>
                Notify Me
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <p className={`${FIELD_HINT} mt-4`}>
                One email about this trip when it launches. Unsubscribe in a click.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
