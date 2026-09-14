import Link from "next/link";

export const metadata = {
  title: "Page Not Found — TruTravels",
  description: "This page has wandered off. Head back to the trips and find your next adventure.",
};

// Where to send people instead. Kept short — a 404 is a signpost, not a menu.
const ROUTES = [
  { label: "All Trips", href: "/explore/all-trips", note: "Every departure, filterable" },
  { label: "Destinations", href: "/explore", note: "Browse by where you're headed" },
  { label: "Stories", href: "/stories", note: "Guides, tips and real trips" },
  { label: "Help & Support", href: "/support", note: "Talk to a human" },
];

const CHEV = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function NotFound() {
  return (
    <>
      {/* HERO — same right-aligned overlay language as the Essentials pages,
          with the status code sitting behind the headline as a watermark. */}
      <section className="relative h-[80vh] min-h-[560px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/images/northernthailandviews.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />

        {/* Oversized 404, clipped by the section so it reads as texture */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-4 sm:right-4 top-1/2 -translate-y-1/2 font-heading font-black text-white/[0.07] leading-none tracking-tighter text-[clamp(12rem,34vw,30rem)]"
        >
          404
        </span>

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Error 404 &middot; Off The Map
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              You&rsquo;ve Gone<br />
              <span className="text-tru-pink">Off Track</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto mb-8">
              &ldquo;Getting lost is half the fun &mdash; though usually we mean somewhere
              more interesting than this.&rdquo;
            </p>
            <div className="flex flex-wrap gap-3 justify-end">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
              >
                Explore Trips
                {CHEV}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-[10px] border border-white/25 hover:border-white/50 hover:bg-white/5 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
              >
                Take Me Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signposts */}
      <section className="relative overflow-hidden py-16">
        <img src="/bg-assets/komodo-dragon.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 lg:-left-24 top-0 w-[220px] sm:w-[340px] lg:w-[440px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 lg:-right-20 bottom-0 w-[220px] sm:w-[340px] lg:w-[440px] opacity-[0.05] brightness-0 invert" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Try One Of These</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-8">
            Back On <span className="text-tru-pink">Solid Ground</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROUTES.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/5 p-5 hover:border-tru-pink/40 hover:bg-white/[0.07] transition"
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-white font-bold text-sm uppercase font-heading tracking-wide group-hover:text-tru-pink transition">
                    {r.label}
                  </span>
                  <span className="block text-gray-400 text-xs mt-0.5">{r.note}</span>
                </span>
                <span className="flex-shrink-0 text-gray-500 group-hover:text-tru-pink transition">{CHEV}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
