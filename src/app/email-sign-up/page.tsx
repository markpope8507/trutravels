"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import { topCrumbs } from "@/lib/breadcrumbs";

/**
 * Email sign-up, as a page rather than a popup.
 *
 * Mirrors trutravels.com/email-sign-up, which exists so the newsletter can be
 * linked to directly — from a social bio, a QR code, an email footer — rather
 * than only being reachable by triggering the popup. The copy is theirs.
 *
 * The FIELDS are the live page's four: email, nationality, first name, last
 * name. The footer strip on this site only takes an email, which is right for
 * a strip; a dedicated page can reasonably ask for a little more.
 *
 * Built on the shared field system (.field labels, the pink submit, the
 * success panel), so it looks like every other form here rather than a
 * one-off.
 *
 * Mirrored by converted/email-sign-up.html.
 */

const HERO = "https://cdn.trutravels.com/thailand/full-moon-party.jpg";

const INPUT =
  "w-full rounded-[10px] bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white " +
  "placeholder:text-gray-500 focus:outline-none focus:border-tru-pink/50 transition-colors";
const LABEL = "block text-tru-pink font-heading text-[10px] font-bold uppercase tracking-[0.2em] mb-2";

export default function EmailSignUpPage() {
  const [done, setDone] = useState(false);

  return (
    <>
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img src={HERO} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Newsletter
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Join The
              <br />
              <span className="text-tru-pink">TruCrew</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Be the first to hear about new tours, deals and more.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs crumbs={topCrumbs("Email Sign Up")} />

      <section className="relative overflow-hidden pt-16 pb-24">
        <img
          src="/bg-assets/good-vibes.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[520px] opacity-[0.06] brightness-0 invert"
        />
        <img
          src="/bg-assets/sun.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 bottom-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert"
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase leading-[1.05] tracking-tight text-white">
              Discounts, Deals <span className="text-tru-pink">&amp; Destinations</span>
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-300 sm:text-lg">
              <p>
                Because we know you only really wanna hear the good stuff. The exciting news, the pack-your-bags
                I&rsquo;m-going-on-holiday news.
              </p>
              <p>
                <strong className="font-semibold text-white">
                  You&rsquo;ll be the first to know about big discounts launching and new destinations.
                </strong>{" "}
                Positive vibes and travel inspo only.
              </p>
              <p>
                If you&rsquo;re looking to stay in the loop, and want to see that email drop in your inbox and
                instantly smile — sign up. We&rsquo;d hate for you to miss out.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-tru-navy p-6 sm:p-8">
            {done ? (
              <div className="py-8 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-tru-pink/30 bg-tru-pink/15">
                  <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="mb-2 font-heading text-2xl font-black uppercase tracking-tight text-white">
                  You&rsquo;re In The <span className="text-tru-pink">TruCrew</span>
                </h3>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-300">
                  Check your inbox — there&rsquo;s a welcome email on its way, and the next drop lands there first.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
              >
                <h3 className="mb-1.5 font-heading text-lg font-black uppercase tracking-tight text-white">
                  Sign Up <span className="text-tru-pink">Below</span>
                </h3>
                <p className="mb-7 text-sm leading-relaxed text-gray-400">
                  Four fields. Takes about ten seconds.
                </p>

                <div className="mb-4">
                  <label htmlFor="es-email" className={LABEL}>
                    Email <span className="text-gray-500">*</span>
                  </label>
                  <input id="es-email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" className={INPUT} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-3">
                  <div className="mb-4">
                    <label htmlFor="es-first" className={LABEL}>
                      First Name <span className="text-gray-500">*</span>
                    </label>
                    <input id="es-first" name="firstName" type="text" required placeholder="First name" autoComplete="given-name" className={INPUT} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="es-last" className={LABEL}>
                      Last Name <span className="text-gray-500">*</span>
                    </label>
                    <input id="es-last" name="lastName" type="text" required placeholder="Last name" autoComplete="family-name" className={INPUT} />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="es-nationality" className={LABEL}>
                    Nationality <span className="text-gray-500">(optional)</span>
                  </label>
                  <input id="es-nationality" name="nationality" type="text" placeholder="e.g. British" autoComplete="country-name" className={INPUT} />
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                    So we can send you departures and prices that actually apply to you.
                  </p>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-tru-pink px-8 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light"
                >
                  Sign Me Up
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <p className="mt-4 text-xs leading-relaxed text-gray-500">
                  By subscribing you agree to receive marketing emails from TruTravels. Unsubscribe in one click, any
                  time — see our{" "}
                  <Link href="/terms-conditions" className="text-gray-300 underline hover:text-tru-pink">
                    privacy policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
