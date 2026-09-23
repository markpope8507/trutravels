"use client";

import type { Answers, Question } from "@/lib/inspire-me-quiz";

/**
 * The pill group that asks one Inspire Me question, and the rule for toggling
 * an answer.
 *
 * SHARED BY THE QUIZ AND THE PROFILE. The Inspire Me modal asks these one at a
 * time; the profile page shows them all at once as "Travel Preferences". They
 * are the same questions with the same answers, so that finishing the quiz
 * while logged in fills the profile in — which only works if there's one
 * definition of what a question is and what picking an option does.
 */

/**
 * Apply a click to one question's answers.
 *
 * WILDCARDS ARE EXCLUSIVE. "Surprise me", "Wherever the trip takes me" and
 * "I'm up for anything" clear the rest of their question and are cleared by
 * anything else — "Asia AND surprise me" isn't an answer.
 *
 * Pure, so both callers get identical behaviour and it can be reasoned about
 * without a component around it.
 */
export function toggleAnswer(q: Question, value: string, picked: string[]): string[] {
  const option = q.options.find((o) => o.value === value);
  if (!option) return picked;

  if (q.type === "single") return picked[0] === value ? [] : [value];
  if (option.wildcard) return picked.includes(value) ? [] : [value];

  const noWildcards = picked.filter((v) => !q.options.find((o) => o.value === v)?.wildcard);
  const next = noWildcards.includes(value)
    ? noWildcards.filter((v) => v !== value)
    : [...noWildcards, value];
  // At the cap, the newest pick pushes the oldest out.
  return q.max !== undefined ? next.slice(-q.max) : next;
}

/** True once any question has been answered. */
export function hasAnswers(a: Answers): boolean {
  return Object.values(a).some((v) => v.length > 0);
}

function Tick() {
  return (
    <svg className="ml-auto h-4 w-4 flex-shrink-0 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function QuestionBlock({
  q,
  picked,
  onToggle,
  compact = false,
}: {
  q: Question;
  picked: string[];
  onToggle: (value: string) => void;
  /** Profile page: smaller heading, since five of these sit on one screen. */
  compact?: boolean;
}) {
  const atMax = q.max !== undefined && picked.length >= q.max;
  return (
    <fieldset className="mx-0 border-0 p-0">
      <legend
        className={
          compact
            ? "mb-1 font-heading text-sm font-black uppercase tracking-tight text-white"
            : "mb-1 font-heading text-xl font-black uppercase leading-tight text-white sm:text-2xl"
        }
      >
        {q.question}
      </legend>
      <p className={`text-sm text-gray-400 ${compact ? "mb-3" : "mb-5"}`}>
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
              className={`flex items-center gap-3 rounded-[10px] border px-4 text-left transition-all duration-200 ${
                compact ? "py-3" : "py-3.5"
              } ${
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
