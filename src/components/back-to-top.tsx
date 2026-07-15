"use client";

export default function BackToTop() {
  return (
    <section className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border px-6 py-2.5 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200 border-tru-pink bg-tru-pink text-white active:bg-tru-pink-light sm:border-tru-pink/40 sm:bg-transparent sm:text-tru-pink sm:hover:bg-tru-pink sm:hover:text-white sm:hover:border-tru-pink"
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
