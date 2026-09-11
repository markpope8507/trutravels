"use client";

import { useExpDisclosure, toggleExpDisclosure } from "@/lib/use-exp-disclosure";
import type { TripExperienceCount } from "@/lib/data";

/**
 * The "TRU Experience Types" disclosure on a tour card — a 5-up icon grid of
 * experience types with their activity counts, behind a summary row.
 *
 * Shared by the trip card and the deal card. It lived in trip-card.tsx with a
 * second, older implementation in deal-card.tsx that still rendered coloured
 * name pills, so the deals page drifted away from the rest of the site. One
 * component now, so they can't diverge again. The static build's equivalent is
 * .tripcard__exp / .tripcard__pills in converted/styles.css.
 *
 * Open/closed state is deliberately global (useExpDisclosure): opening one card
 * opens them all, so a row of cards stays the same height.
 */
export default function ExperienceTypesDisclosure({
  expCounts,
  totalActivities,
}: {
  expCounts: TripExperienceCount[];
  totalActivities: number;
}) {
  const open = useExpDisclosure();

  return (
    <div className="mt-auto pt-3 border-t border-white/10">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleExpDisclosure();
        }}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left text-[11px] font-bold uppercase tracking-wider font-heading text-gray-300 hover:text-white transition-colors"
      >
        <span>
          TRU Experience Types &middot;{" "}
          <span className="text-gray-500 font-semibold normal-case tracking-normal">
            {totalActivities} activities
          </span>
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-5 gap-1.5 items-stretch">
            {expCounts.map((e) => (
              <div key={e.id} className="flex flex-col items-center gap-1 text-center">
                <img src={e.icon} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
                <span className="text-[8px] font-semibold uppercase font-heading leading-tight text-gray-200">
                  {e.name}
                </span>
                <span className="text-[0.95rem] font-bold mt-auto pt-0.5 text-white">
                  {e.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
