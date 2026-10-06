"use client";

import { useState, useEffect } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import TripCard from "@/components/trip-card";
import {
  STEPS,
  getMatches,
  regionsWithoutTrips,
  unmet,
  DURATION_LABELS,
  type Answers,
  type Match,
  type Question,
  type Unmet,
} from "@/lib/inspire-me-quiz";
import QuestionBlock, { toggleAnswer } from "@/components/preference-questions";
import { setPreferences } from "@/lib/travel-preferences";
import { useAuth } from "@/lib/auth-context";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

/**
 * Inspire Me — the quiz modal.
 *
 * The questions and the matching live in lib/inspire-me-quiz; this file is
 * only how they're shown. Five steps, one question each — though a Step still
 * holds a list, because where and how long shared a screen once and might
 * again.
 *
 * NO AUTO-ADVANCE. The old quiz jumped to the next step 300ms after a single
 * select, which is fine until a step holds a multi-select — three of five do.
 * A Continue button on every step is predictable, and it lets you change your
 * mind before moving on.
 *
 * WILDCARDS ARE EXCLUSIVE. "Surprise me", "Wherever the trip takes me" and
 * "I'm up for anything" clear the other answers to their question, and
 * picking anything else clears them — because "Asia AND surprise me" isn't an
 * answer to anything.
 *
 * NO EMOJI. Every option used to carry one. The rest of the site moved to
 * real icons or plain type; a grid of emoji was the last of it.
 */

function InspireMeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-56 items-center justify-center gap-2 rounded-[10px] bg-tru-pink px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-tru-pink-light"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      Inspire Me
    </button>
  );
}

/**
 * Nothing matched — what we could not do, and the one answer to loosen.
 *
 * The quiz can always return three trips, so the honest failure mode is not
 * an empty page: it is three trips presented as something they are not.
 * This says what we could not meet, offers the single change that would fix
 * it, and hands the closest trips over under their real label.
 */
function NoMatch({ u, onLoosen }: { u: Unmet; onLoosen: (q: "regions" | "duration") => void }) {
  const loosenCopy =
    u.loosen === "regions"
      ? "Search anywhere instead"
      : u.loosen === "duration"
        ? "Drop the trip length"
        : null;

  return (
    <div className="mb-8 rounded-[12px] border border-tru-pink/25 bg-tru-pink/[0.06] p-5 sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-tru-pink/15">
          <svg className="h-5 w-5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 110-16 8 8 0 010 16zM8.5 11h5" />
          </svg>
        </span>
        <div>
          <h2 className="font-heading text-xl font-black uppercase leading-tight text-white sm:text-2xl">
            No exact match <span className="text-tru-pink">&mdash; yet</span>
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-300">
            We don&rsquo;t run a trip that ticks all of that. Here&rsquo;s what we couldn&rsquo;t meet:
          </p>
        </div>
      </div>

      <ul className="mb-5 space-y-2 pl-12">
        {u.regions.length > 0 && (
          <li className="flex items-start gap-2.5 text-sm text-gray-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-tru-pink" />
            <span>
              No trips in <span className="text-white">{u.regions.join(" or ")}</span> &mdash; we&rsquo;re
              working on it.
            </span>
          </li>
        )}
        {u.duration && (
          <li className="flex items-start gap-2.5 text-sm text-gray-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-tru-pink" />
            <span>
              Nothing currently runs for{" "}
              <span className="text-white">{DURATION_LABELS[u.duration] ?? u.duration}</span>.
            </span>
          </li>
        )}
        {u.regions.length === 0 && !u.duration && (
          <li className="flex items-start gap-2.5 text-sm text-gray-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-tru-pink" />
            <span>That combination of places, pace and experiences doesn&rsquo;t line up on one trip.</span>
          </li>
        )}
      </ul>

      <div className="flex flex-col gap-3 pl-12 sm:flex-row sm:items-center">
        {loosenCopy && u.loosen && (
          <button
            onClick={() => onLoosen(u.loosen as "regions" | "duration")}
            className="rounded-[10px] bg-tru-pink px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-tru-pink-light"
          >
            {loosenCopy}
          </button>
        )}
        <Link
          href="/email-sign-up"
          className="font-heading text-xs font-bold uppercase tracking-wider text-tru-pink underline underline-offset-4 transition-colors hover:text-tru-pink-light"
        >
          Tell us where to go next
        </Link>
      </div>
    </div>
  );
}

function Results({
  matches,
  missingRegions,
  unmetAnswers,
  onClose,
  onRestart,
  onLoosen,
}: {
  matches: Match[];
  missingRegions: string[];
  unmetAnswers: Unmet;
  onClose: () => void;
  onRestart: () => void;
  onLoosen: (q: "regions" | "duration") => void;
}) {
  const blank = unmetAnswers.none;
  // Under the empty state these are explicitly the nearest thing we have, not
  // a ranking — calling the first one "Top Match" is the lie worth avoiding.
  const RANK = blank
    ? ["Closest we have", "Also close", "Also close"]
    : ["Top Match", "Great Fit", "You'd Love"];
  return (
    <div>
      {blank && <NoMatch u={unmetAnswers} onLoosen={onLoosen} />}

      <h2 className="mb-2 font-heading text-2xl font-black uppercase text-white sm:text-3xl">
        {blank ? (
          <>The <span className="text-tru-pink">closest</span> we have</>
        ) : (
          <>Your <span className="text-tru-pink">Perfect</span> Trips</>
        )}
      </h2>
      <p className="mb-6 text-sm text-gray-400">
        {blank
          ? "Ranked by how near they get to what you asked for."
          : "Based on your answers. Each one shows what it matched on."}
      </p>

      {/* Africa and Oceania are on the list because people look for them —
          saying we don't run them yet beats quietly showing Thailand. */}
      {!blank && missingRegions.length > 0 && (
        <p className="mb-6 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-gray-300">
          We don&rsquo;t run trips in{" "}
          <span className="text-white">{missingRegions.join(" or ")}</span> yet — so these are matched
          on everything else you told us.
        </p>
      )}

      {/* THE SITE'S TRIP CARD, IN THE SITE'S CAROUSEL. These used to be a
          bespoke wide row that existed only here — a fourth way to draw a
          trip, missing the price-per-day, the places and activities counts
          and the experience-types disclosure every other card carries. Same
          component and same Swiper settings as the country and travel style
          pages now. */}
      <div className="inspire-results relative">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.1}
          freeMode={{ enabled: true, sticky: false }}
          navigation={{ nextEl: ".inspire-next", prevEl: ".inspire-prev" }}
          breakpoints={{ 640: { slidesPerView: 1.8 }, 1024: { slidesPerView: 2.2, spaceBetween: 20 } }}
          speed={600}
        >
          {matches.map(({ trip, reasons }, i) => (
            <SwiperSlide key={trip.id} className="h-auto">
              <div className="flex h-full flex-col">
                <p className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">
                  {RANK[i] ?? (blank ? "Also close" : "Also Worth A Look")}
                </p>
                <TripCard trip={trip} />
                {/* Why this trip — the quiz should show its working, not just
                    assert that three trips are "perfect". */}
                {reasons.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {reasons.slice(0, 4).map((r) => (
                      <span
                        key={r}
                        className="rounded-full border border-tru-pink/25 bg-tru-pink/10 px-2 py-0.5 font-heading text-[9px] font-bold uppercase tracking-wider text-tru-pink"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          aria-label="Previous"
          className="inspire-prev absolute top-[34%] left-1 z-10 shadow-lg shadow-black/40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-tru-navy/90 transition-colors hover:border-tru-pink/40 disabled:opacity-30"
        >
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          aria-label="Next"
          className="inspire-next absolute top-[34%] right-1 z-10 shadow-lg shadow-black/40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-tru-navy/90 transition-colors hover:border-tru-pink/40 disabled:opacity-30"
        >
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/explore"
          onClick={onClose}
          className="flex-1 rounded-[10px] bg-tru-green px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-tru-navy transition-all duration-300 hover:bg-tru-green-light"
        >
          Browse All Trips
        </Link>
        <button
          onClick={onRestart}
          className="flex-1 rounded-[10px] border border-tru-pink px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-tru-pink transition-all duration-300 hover:bg-tru-pink hover:text-white"
        >
          Start Again
        </button>
      </div>
    </div>
  );
}

function InspireMeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => {
      setStep(0);
      setAnswers({});
      setMatches(null);
    }, 300);
    return () => clearTimeout(t);
  }, [isOpen]);

  useScrollLock(isOpen);
  if (!isOpen || !mounted) return null;

  const current = STEPS[step];
  const showResults = matches !== null;
  const progress = showResults ? 100 : ((step + 1) / STEPS.length) * 100;

  /* Functional update, not `{ ...answers }` — two taps inside one render
     read the same stale object and the first one vanishes. Easy to miss by
     hand and trivial to hit on a phone. */
  const toggle = (q: Question, value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: toggleAnswer(q, value, prev[q.id] ?? []) }));
  };

  /* Every question is answerable, so nothing is required — but moving on
     having answered nothing at all just wastes a step. */
  const stepAnswered = current?.questions.some((q) => (answers[q.id] ?? []).length > 0);
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    /* Finishing the quiz while logged in fills in Travel Preferences — the
       questions are the same ones the profile shows, so there's nothing to
       translate. Logged out, the answers just power this result. */
    if (user) setPreferences(answers);
    setMatches(getMatches(answers));
  };

  const back = () => {
    if (showResults) setMatches(null);
    else if (step > 0) setStep(step - 1);
  };

  /**
   * Drop the one answer that excluded everything and score again, without
   * sending the traveller back through five questions to change a single
   * tap. `regions` becomes the wildcard; `duration` has no wildcard option,
   * so it is cleared.
   */
  const loosen = (q: "regions" | "duration") => {
    const relaxed: Answers = { ...answers, [q]: q === "regions" ? ["any"] : [] };
    setAnswers(relaxed);
    setMatches(getMatches(relaxed));
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setMatches(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Wider on results: a question is a list of short options and reads
          better narrow, but three real trip cards need the room. */}
      <div
        className={`relative mx-4 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-[10px] border border-white/10 bg-tru-navy transition-[max-width] duration-300 ${
          showResults ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            {(step > 0 || showResults) && (
              <button onClick={back} aria-label="Back" className="text-gray-400 transition hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">Inspire Me</p>
              <p className="text-xs text-gray-500">
                {showResults ? "Your recommendations" : `Step ${step + 1} of ${STEPS.length}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 transition hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-1 bg-white/5">
          <div className="h-full bg-tru-pink transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {showResults ? (
            <Results
              matches={matches}
              missingRegions={regionsWithoutTrips(answers.regions ?? [])}
              unmetAnswers={unmet(answers, matches)}
              onClose={onClose}
              onRestart={restart}
              onLoosen={loosen}
            />
          ) : (
            <div className="space-y-8">
              {current.questions.map((q) => (
                <QuestionBlock key={q.id} q={q} picked={answers[q.id] ?? []} onToggle={(v) => toggle(q, v)} />
              ))}

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-gray-500">
                  {stepAnswered ? "" : "Pick at least one to carry on."}
                </p>
                <button
                  onClick={next}
                  disabled={!stepAnswered}
                  className="rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-tru-pink-light disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {isLast ? "See My Trips" : "Continue"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export { InspireMeButton, InspireMeModal };
