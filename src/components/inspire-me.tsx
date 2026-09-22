"use client";

import { useState, useEffect } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { createPortal } from "react-dom";
import Link from "next/link";
import { tripUrl } from "@/lib/utils";
import TravelStyleBadge from "@/components/travel-style-badge";
import {
  STEPS,
  getMatches,
  regionsWithoutTrips,
  type Answers,
  type Match,
  type Question,
} from "@/lib/inspire-me-quiz";

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

function Tick() {
  return (
    <svg className="ml-auto h-4 w-4 flex-shrink-0 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function QuestionBlock({
  q,
  picked,
  onToggle,
}: {
  q: Question;
  picked: string[];
  onToggle: (value: string) => void;
}) {
  const atMax = q.max !== undefined && picked.length >= q.max;
  return (
    <fieldset className="mx-0 border-0 p-0">
      <legend className="mb-1 font-heading text-xl font-black uppercase leading-tight text-white sm:text-2xl">
        {q.question}
      </legend>
      <p className="mb-5 text-sm text-gray-400">
        {q.hint}
        {atMax && q.type === "multi" && (
          <span className="text-tru-pink"> That&rsquo;s your {q.max} — unpick one to swap.</span>
        )}
      </p>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {q.options.map((o) => {
          const on = picked.includes(o.value);
          // At the cap, everything unpicked goes quiet rather than silently
          // doing nothing when clicked.
          const blocked = !on && atMax && !o.wildcard;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => !blocked && onToggle(o.value)}
              aria-pressed={on}
              disabled={blocked}
              className={`flex items-center gap-3 rounded-[10px] border px-4 py-3.5 text-left transition-all duration-200 ${
                on
                  ? "border-tru-pink bg-tru-pink/10 text-white"
                  : blocked
                    ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-gray-600"
                    : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <span className="text-sm font-medium">{o.label}</span>
              {on && <Tick />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Results({
  matches,
  missingRegions,
  onClose,
  onRestart,
}: {
  matches: Match[];
  missingRegions: string[];
  onClose: () => void;
  onRestart: () => void;
}) {
  const RANK = ["Top Match", "Great Fit", "You'd Love"];
  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-black uppercase text-white sm:text-3xl">
        Your <span className="text-tru-pink">Perfect</span> Trips
      </h2>
      <p className="mb-6 text-sm text-gray-400">
        Based on your answers. Each one shows what it matched on.
      </p>

      {/* Africa and Oceania are on the list because people look for them —
          saying we don't run them yet beats quietly showing Thailand. */}
      {missingRegions.length > 0 && (
        <p className="mb-6 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-gray-300">
          We don&rsquo;t run trips in{" "}
          <span className="text-white">{missingRegions.join(" or ")}</span> yet — so these are matched
          on everything else you told us.
        </p>
      )}

      <div className="space-y-4">
        {matches.map(({ trip, reasons }, i) => (
          <Link
            key={trip.id}
            href={tripUrl(trip)}
            onClick={onClose}
            className="group flex gap-4 overflow-hidden rounded-[10px] border border-white/5 bg-white/5 transition-all duration-300 hover:border-tru-pink/20"
          >
            <div className="relative w-28 flex-shrink-0 overflow-hidden sm:w-36">
              <img
                src={trip.image}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-2 top-2">
                <span className="rounded-full bg-tru-pink px-2 py-0.5 font-heading text-[9px] font-bold uppercase tracking-wider text-white">
                  {RANK[i] ?? "Also Worth A Look"}
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1 py-4 pr-4">
              <div className="mb-1 flex items-center gap-2">
                <TravelStyleBadge style={trip.travelStyle} size="small" />
              </div>
              <p className="mb-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-tru-pink">
                {trip.duration}
              </p>
              <h3 className="mb-1 font-heading text-sm font-black uppercase text-white transition-colors group-hover:text-tru-pink">
                {trip.title}
              </h3>
              <p className="mb-2 line-clamp-2 text-xs text-gray-400">{trip.tagline}</p>

              {/* Why this trip — the quiz should show its working, not just
                  assert that three trips are "perfect". */}
              {reasons.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
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

              <div className="flex items-baseline gap-1.5">
                {trip.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">&pound;{trip.originalPrice}</span>
                )}
                <span className="text-sm font-bold text-tru-green">&pound;{trip.price}</span>
              </div>
            </div>
          </Link>
        ))}
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
    const option = q.options.find((o) => o.value === value)!;
    setAnswers((prev) => {
      const picked = prev[q.id] ?? [];
      let next: string[];

      if (q.type === "single") {
        next = picked[0] === value ? [] : [value];
      } else if (option.wildcard) {
        next = picked.includes(value) ? [] : [value];
      } else {
        const noWildcards = picked.filter((v) => !q.options.find((o) => o.value === v)?.wildcard);
        next = noWildcards.includes(value)
          ? noWildcards.filter((v) => v !== value)
          : [...noWildcards, value];
        // At the cap, the newest pick pushes the oldest out.
        if (q.max !== undefined) next = next.slice(-q.max);
      }
      return { ...prev, [q.id]: next };
    });
  };

  /* Every question is answerable, so nothing is required — but moving on
     having answered nothing at all just wastes a step. */
  const stepAnswered = current?.questions.some((q) => (answers[q.id] ?? []).length > 0);
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) setMatches(getMatches(answers));
    else setStep(step + 1);
  };

  const back = () => {
    if (showResults) setMatches(null);
    else if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setMatches(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-4 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[10px] border border-white/10 bg-tru-navy">
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
              onClose={onClose}
              onRestart={restart}
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
