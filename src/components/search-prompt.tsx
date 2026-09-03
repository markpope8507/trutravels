"use client";

export default function SearchPrompt() {
  return (
    <div className="mx-auto mb-8 max-w-3xl">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
        aria-label="Search trips, destinations and stories"
        className="flex w-full items-center gap-3 rounded-[10px] border border-white bg-tru-navy px-4 py-3.5 text-left text-sm text-white transition-colors duration-200 hover:border-tru-pink sm:py-4"
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
        Search trips, destinations...
      </button>
    </div>
  );
}
