import Link from "next/link";
import { truPromises } from "@/lib/data";

// Compact "Book With Confidence" band pulling from the shared Tru Promise data
// (same source as the whats-included page).
export default function BookWithConfidenceBar() {
  return (
    <section className="relative border-y border-white/10 bg-gradient-to-r from-tru-pink/[0.06] via-transparent to-tru-pink/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="text-center mb-8">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-2">The Tru Promise</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide">
            Book With <span className="text-tru-pink">Confidence</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {truPromises.map((p) => (
            <div key={p.title} className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white font-black uppercase font-heading text-sm mb-1">{p.eyebrow}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <Link href="/whats-included" className="text-xs sm:text-sm text-gray-300 hover:text-white transition font-semibold uppercase tracking-wider font-heading">
            ABTA &amp; ATOL Protected &middot; Learn more &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
