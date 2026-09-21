import Breadcrumbs from "@/components/breadcrumbs";
import { topCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { travelStyleConfig, type TravelStyle } from "@/lib/data";

export const metadata: Metadata = {
  title: "Travel Styles & Life Moments — TruTravels",
  description:
    "Every traveller is different. Find the trip that fits how you travel — from Classic to Backpacker — and where you are in life, from a gap year to a work-break reset.",
};

// Maps each travel style to the slug used by /travel-styles/[slug].
const TRAVEL_STYLES: { slug: string; style: TravelStyle }[] = [
  { slug: "classic", style: "classic" },
  { slug: "backpacker", style: "backpacker" },
  { slug: "flashpacker", style: "flashpacker" },
  { slug: "multi-country", style: "multi_country" },
  { slug: "limited-edition", style: "limited_edition" },
];

// Hero image per style — matches the imagery used on each style's landing page.
const HERO_IMAGES: Record<TravelStyle, string> = {
  classic: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
  backpacker: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
  flashpacker: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
  multi_country: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
  limited_edition: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80",
};

const LIFE_MOMENTS = [
  {
    slug: "gap-year",
    title: "Gap Year",
    snippet:
      "The University of Life. Long itineraries, multi-country adventures, and the trips that shape who you become.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    emoji: "🌍",
  },
  {
    slug: "just-left-uni",
    title: "Just Left Uni",
    snippet:
      "First taste of freedom. Big trips, full moons, hostel mates and the best year of your life — engineered.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
    emoji: "🎓",
  },
  {
    slug: "looking-to-challenge-myself",
    title: "Looking To Challenge Myself",
    snippet:
      "Treks, summits, jungle climbs and the recovery on the other side. Trips for travellers who want to be tested.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    emoji: "🏔️",
  },
  {
    slug: "solo-soul-searcher",
    title: "Solo Soul Searcher",
    snippet:
      "Trips, stories and voices for travellers heading out on their own. Find your people, find yourself.",
    image: "/images/solo-soul-searcher-hero.jpg",
    emoji: "🚶",
  },
  {
    slug: "turning-30",
    title: "Turning 30",
    snippet:
      "Stamps collected, comfort zones outgrown. Off-the-beaten-path adventures for the next decade.",
    image: "https://cdn.trutravels.com/africa/morocco-images/morocco-uncovered-day-3-road-trip-viewpoint.jpg",
    emoji: "🎂",
  },
  {
    slug: "work-break-recharge",
    title: "Work Break Recharge",
    snippet:
      "Two weeks. Out of office. Full reset. Hand-picked trips under 14 days for the 9-to-5 escape.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    emoji: "🌴",
  },
];

export default function TravelStylesPage() {
  return (
    <div className="pb-24">
      {/* ===================== HERO ===================== */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <img
          src="/images/explore-hero.jpg"
          alt="TruTravels group adventure"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Explore
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Find Your<br />Travel Style
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;However you like to travel, and wherever you are in life — there&apos;s a
              TruTravels adventure built for it.&rdquo;
            </p>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={topCrumbs("Travel Styles")} />

      {/* ===================== TRAVEL STYLES ===================== */}
      <section className="relative overflow-hidden pt-20 pb-8">
        <img
          src="/bg-assets/sun.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-8 w-[260px] sm:w-[400px] md:w-[520px] lg:w-[680px] opacity-[0.08] brightness-0 invert"
        />
        <img
          src="/bg-assets/komodo-dragon.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-20 sm:-left-32 lg:-left-40 bottom-10 w-[300px] sm:w-[460px] md:w-[600px] lg:w-[760px] opacity-[0.07] brightness-0 invert"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
            Five Ways To Travel
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
            Travel <span className="text-gradient">Styles</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg mb-12">
            From all-in Classic adventures to budget-savvy Backpacker routes, every TruTravels trip
            comes in a style built around how you want to travel.
          </p>

          <div className="space-y-8">
          {TRAVEL_STYLES.map(({ slug, style }, i) => {
            const cfg = travelStyleConfig[style];
            return (
              <div
                key={slug}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-[16px] border border-white/10 bg-white/[0.02] p-5 sm:p-6"
              >
                {/* Hero image + white logo overlay */}
                <div
                  className={`relative overflow-hidden rounded-[12px] aspect-[16/10] ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <img
                    src={HERO_IMAGES[style]}
                    alt={cfg.label}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  <div
                    className="absolute inset-x-0 bottom-0 h-1.5"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <div className="relative h-full flex items-center justify-center p-2">
                    <img
                      src={cfg.logo}
                      alt={cfg.label}
                      className="max-h-[95%] max-w-[95%] w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                    />
                  </div>
                </div>

                {/* Copy + CTA */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-2 font-heading"
                    style={{ color: cfg.color }}
                  >
                    Travel Style
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading leading-tight mb-4">
                    {cfg.label}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed mb-6">
                    {cfg.description}
                  </p>
                  <Link
                    href={`/travel-styles/${slug}`}
                    className="inline-flex items-center gap-2 rounded-[10px] border px-7 py-3 text-sm font-bold uppercase tracking-wider font-heading transition-all duration-300 hover:text-white"
                    style={{ color: cfg.color, borderColor: cfg.color }}
                  >
                    {`View ${cfg.label} Trips`} &rarr;
                  </Link>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== LIFE MOMENTS ===================== */}
      <section className="relative overflow-hidden pt-20">
        <img
          src="/bg-assets/community.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-6 w-[240px] sm:w-[360px] md:w-[480px] lg:w-[600px] opacity-[0.08] brightness-0 invert"
        />
        <img
          src="/bg-assets/good-vibes.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -bottom-12 w-[260px] sm:w-[400px] md:w-[520px] lg:w-[680px] opacity-[0.07] brightness-0 invert"
        />

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
          {LIFE_MOMENTS.map((moment) => (
            <Link key={moment.slug} href={`/life-moments/${moment.slug}`} className="group">
              <div className="relative overflow-hidden rounded-[12px] border border-white/10 bg-tru-navy h-full flex flex-col hover:border-tru-pink/30 transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={moment.image}
                    alt={moment.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tru-navy via-tru-navy/20 to-transparent" />
                  <span className="absolute top-3 left-3 h-9 w-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-lg">
                    {moment.emoji}
                  </span>
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
    </div>
  );
}
