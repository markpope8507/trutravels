"use client";

import { type ReactNode } from "react";

/* Collapsible filter group with a header, optional count badge and chevron.
   Shared by the Explore (All Trips), Deals and Stories filters. */
export default function FilterSection({
  title,
  count = 0,
  open,
  onToggle,
  children,
}: {
  title: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-white/10 pt-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 group"
      >
        <span className="flex items-center gap-2 text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading">
          {title}
          {count > 0 && (
            <span className="bg-tru-pink text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center tracking-normal">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:text-white ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
