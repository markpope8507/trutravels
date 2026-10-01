"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  ALL_OFF,
  ALL_ON,
  CATEGORIES,
  type Consent,
  useCookieConsent,
} from "@/lib/cookie-consent";

/**
 * The cookie banner, and the preference centre behind it.
 *
 * SHAPE COMES FROM THE COMPETITOR SET. G Adventures, Flash Pack and Intro all
 * use a bottom bar rather than a full-screen blocker, all offer the same four
 * categories, and all keep a "manage" link in the footer so the choice can be
 * changed later. A visitor has seen this shape a hundred times; the brand is
 * what should feel different, not the mechanics.
 *
 * REJECT SITS NEXT TO ACCEPT, same size, same weight. Burying it behind
 * "Settings" is the dark pattern the ICO and the EDPB both call out, and it's
 * the thing people notice. Optional categories all start OFF in the panel.
 *
 * NOT A BLOCKER. No backdrop, no scroll lock — the bar sits above the page and
 * the page keeps working. Tru.D's launcher is bottom-right, so the bar lifts
 * off the bottom edge and the launcher moves up while it's showing.
 */

const BTN =
  "inline-flex items-center justify-center rounded-[10px] px-5 py-2.5 font-heading " +
  "text-xs font-bold uppercase tracking-wider transition whitespace-nowrap";

function Toggle({
  on,
  locked,
  onChange,
  label,
}: {
  on: boolean;
  locked?: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={locked}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full border transition-colors ${
        locked
          ? "cursor-not-allowed border-white/10 bg-white/10"
          : on
            ? "border-tru-pink bg-tru-pink"
            : "border-white/20 bg-white/5 hover:border-white/40"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all ${
          on ? "left-[calc(100%-1.25rem)] bg-white" : "left-1 bg-gray-400"
        } ${locked ? "bg-gray-500" : ""}`}
      />
    </button>
  );
}

export default function CookieBanner() {
  const { consent, ready, panelOpen, openPanel, closePanel, save } = useCookieConsent();
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<Consent>(ALL_OFF);

  useEffect(() => setMounted(true), []);

  /* The panel opens from two places — the banner, and the footer link after a
     decision — so it seeds from whatever is stored each time it opens. */
  useEffect(() => {
    if (panelOpen) setDraft(consent ?? ALL_OFF);
  }, [panelOpen, consent]);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen, closePanel]);

  if (!mounted || !ready) return null;

  const bannerOpen = consent === null && !panelOpen;

  return createPortal(
    <>
      {/* ---------------------------------------------------------- the bar */}
      {bannerOpen && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookies on TruTravels"
          className="fixed inset-x-0 bottom-0 z-[110] p-3 sm:p-4"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-[10px] border border-white/10 bg-tru-navy/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="min-w-0 flex-1">
              <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">
                Cookies
              </p>
              <p className="mt-1 font-handwriting text-xl leading-none text-white sm:text-2xl">
                Mind if we keep a few?
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-gray-300">
                Some are needed to make the site work &mdash; signing in, holding your
                cart. The rest help us see which trips people actually look at, and show
                you ours elsewhere. Your call, and you can change it any time.{" "}
                <Link
                  href="/terms-conditions"
                  className="text-white underline decoration-white/30 underline-offset-2 transition hover:text-tru-pink hover:decoration-tru-pink"
                >
                  Cookie policy
                </Link>
              </p>
            </div>

            <div className="flex flex-shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center lg:flex-col xl:flex-row">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => save(ALL_ON)}
                  className={`${BTN} flex-1 bg-tru-pink text-white hover:bg-tru-pink-light`}
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={() => save(ALL_OFF)}
                  className={`${BTN} flex-1 border border-white/25 text-white hover:border-white/50 hover:bg-white/5`}
                >
                  Reject All
                </button>
              </div>
              <button
                type="button"
                onClick={openPanel}
                className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400 underline decoration-gray-600 underline-offset-4 transition hover:text-white hover:decoration-white"
              >
                Choose
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------- preference centre */}
      {panelOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closePanel} />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences"
            className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[14px] border border-white/10 bg-tru-navy sm:mx-4 sm:rounded-[10px]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">
                  Cookies
                </p>
                <h2 className="mt-1 font-heading text-lg font-black uppercase tracking-tight text-white">
                  Choose What We Keep
                </h2>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                className="-mr-1 -mt-1 flex-shrink-0 text-gray-400 transition hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="flex flex-col gap-4">
                {CATEGORIES.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-[10px] border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-black uppercase tracking-wide text-white">
                          {c.name}
                          {c.locked && (
                            <span className="ml-2 align-middle font-sans text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                              Always on
                            </span>
                          )}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{c.summary}</p>
                        <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{c.examples}</p>
                      </div>
                      <Toggle
                        on={c.locked ? true : draft[c.id]}
                        locked={c.locked}
                        label={c.name}
                        onChange={(next) => setDraft((d) => ({ ...d, [c.id]: next }))}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-white/10 px-6 py-5 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => save(draft)}
                className={`${BTN} flex-1 bg-tru-pink text-white hover:bg-tru-pink-light`}
              >
                Save My Choices
              </button>
              <button
                type="button"
                onClick={() => save(ALL_ON)}
                className={`${BTN} flex-1 border border-white/25 text-white hover:border-white/50 hover:bg-white/5`}
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => save(ALL_OFF)}
                className={`${BTN} flex-1 border border-white/25 text-white hover:border-white/50 hover:bg-white/5`}
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
