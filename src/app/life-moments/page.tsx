import Breadcrumbs from "@/components/breadcrumbs";
import { sectionCrumbs, TRAVEL_STYLES } from "@/lib/breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { LIFE_MOMENT_CARDS } from "@/lib/life-moments";

export const metadata: Metadata = {
  title: "Life Moments — TruTravels",
  description:
    "Whatever's brought you here — a gap year, a quarter-life reset or a much-needed break from the 9-to-5 — find the TruTravels trip built for it.",
};

/**
 * The Life Moments index.
 *
 * The six moments were only ever listed as a section on /travel-styles, which
 * is why the breadcrumb trail still nests them under it — this page gives that
 * listing a home of its own without moving it in the hierarchy. The cards are
 * the same ones, reading the same LIFE_MOMENT_CARDS the Travel Styles page
 * reads, so the two can't drift apart.
 */
export default function LifeMomentsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
          alt="A map, a camera and a packed bag — planning the next trip"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Explore
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Find Your<br />Life Moment
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;However you like to travel, and wherever you are in life — there&rsquo;s a
              TruTravels adventure built for it.&rdquo;
            </p>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={sectionCrumbs(TRAVEL_STYLES, "Life Moments")} />

      {/* THE SIX MOMENTS */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
            Travel By Life Moment
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
            Where Are You <span className="text-gradient">In Life?</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg mb-12">
            Travel isn&apos;t one-size-fits-all. Whatever&apos;s brought you here — a gap year, a
            quarter-life reset or a much-needed break from the 9-to-5 — we&apos;ve got the trip for it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LIFE_MOMENT_CARDS.map((moment) => (
              <Link key={moment.slug} href={`/life-moments/${moment.slug}`} className="group">
                <div className="relative overflow-hidden rounded-[12px] border border-white/10 bg-tru-navy h-full flex flex-col hover:border-tru-pink/30 transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={moment.image}
                      alt={moment.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tru-navy via-tru-navy/20 to-transparent" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-black text-white uppercase font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                      {moment.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                      {moment.snippet}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-tru-pink text-xs font-bold uppercase tracking-wider font-heading group-hover:gap-2.5 transition-all">
                      Explore
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
