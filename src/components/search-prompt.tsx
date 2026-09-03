"use client";

import { useRef, useState } from "react";
import {
  SearchDropdownCard,
  SearchResults,
  type SearchAnchor,
} from "@/components/search-overlay";

export default function SearchPrompt() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<SearchAnchor | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Anchor the results dropdown to the bar box (its border edges), so it drops
  // down flush with the bar — same width, no overlap. The user types here and
  // results appear directly below, reading as one connected element.
  const openDropdown = () => {
    const el = barRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setAnchor({ top: r.top, left: r.left, width: r.width, bottom: r.bottom });
    }
    setOpen(true);
  };

  return (
    <div ref={wrapperRef} className="mx-auto mb-8 max-w-3xl">
      <div
        ref={barRef}
        className={`flex w-full items-center gap-3 rounded-[10px] border border-white bg-tru-navy px-4 py-3.5 text-sm text-white transition-colors duration-200 focus-within:border-tru-pink sm:py-4 ${open ? "rounded-b-none" : ""}`}
      >
        <svg
          className="h-5 w-5 shrink-0 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (!open) openDropdown(); }}
          onFocus={openDropdown}
          placeholder="Search trips, destinations..."
          aria-label="Search trips, destinations and stories"
          className="w-full bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      <SearchDropdownCard
        isOpen={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        keepOpenRef={wrapperRef}
        attached
      >
        <SearchResults
          query={query}
          onNavigate={() => setOpen(false)}
          onExample={(example) => { setQuery(example); inputRef.current?.focus(); }}
        />
      </SearchDropdownCard>
    </div>
  );
}
