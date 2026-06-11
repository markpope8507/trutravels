"use client";

export default function BackToTop() {
  return (
    <section className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 rounded-[10px] border border-tru-pink/40 bg-transparent px-8 py-3.5 text-sm font-semibold text-tru-pink hover:bg-tru-pink hover:text-white hover:border-tru-pink transition-all duration-300 uppercase tracking-wider font-heading"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
          Take Me To The Top
        </button>
      </div>
    </section>
  );
}
