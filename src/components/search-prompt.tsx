"use client";

export default function SearchPrompt() {
  return (
    <div className="mt-12 text-center">
      <p className="text-white text-lg sm:text-xl font-handwriting mb-4">
        Search in the way that makes sense for you&hellip;
      </p>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
        className="inline-flex items-center gap-3 rounded-[10px] border border-white/20 bg-white/5 px-6 py-3 text-sm text-gray-400 hover:border-white/30 hover:bg-white/10 hover:text-white transition-all duration-200 w-72"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search trips, destinations...
      </button>
    </div>
  );
}
