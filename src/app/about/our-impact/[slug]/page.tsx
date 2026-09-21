import Breadcrumbs from "@/components/breadcrumbs";
import { impactCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTES, getCte, formatFirstTour } from "@/lib/ctes";

export function generateStaticParams() {
  return CTES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cte = getCte(slug);
  if (!cte) return {};
  return {
    title: `${cte.name} — TruTravels`,
    description: cte.summary,
  };
}

export default async function CtePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cte = getCte(slug);
  if (!cte) notFound();

  const others = CTES.filter((c) => c.slug !== cte.slug);

  return (
    <article className="pb-24">
      {/* ===================== HERO ===================== */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        <img
          src={cte.image}
          alt={cte.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tru-navy via-tru-navy/60 to-tru-navy/20" />

        <div className="relative z-10 w-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href="/about/our-impact"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-[0.2em] font-heading transition mb-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Our Impact
          </Link>

          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-4 font-heading">
            Community Tourism Enterprise &middot; {cte.country}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase font-heading leading-[0.95] mb-6 max-w-3xl">
            {cte.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="text-white font-semibold">{cte.country}</span>
            <span className="text-gray-500">&middot;</span>
            <span>First tour {formatFirstTour(cte.firstTour)}</span>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={impactCrumbs(cte.name)} />

      {/* ===================== INTRO ===================== */}
      <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-14">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-40 lg:-right-72 -top-4 w-[260px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <div className="relative">
          {cte.intro.map((p, i) => (
            <p key={i} className="text-xl sm:text-2xl text-white font-light leading-relaxed mb-6">
              {p}
            </p>
          ))}
          <div className="h-px w-16 bg-tru-pink mt-4" />
        </div>
      </section>

      {/* ===================== IMPACT NUMBERS ===================== */}
      {cte.impact && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cte.impact.map((s) => (
              <div
                key={s.label}
                className="rounded-[10px] border border-white/10 bg-white/[0.04] p-5 text-center"
              >
                <p className="font-heading text-3xl sm:text-4xl font-black text-tru-pink leading-none tabular-nums">
                  {s.value}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm leading-snug mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===================== SECTIONS ===================== */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16">
        <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-40 lg:-left-72 top-1/4 w-[240px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-40 lg:-right-72 bottom-1/3 w-[240px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <div className="relative space-y-20">
          {cte.sections.map((section, i) => (
            <section
              key={section.heading}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                {section.kicker && (
                  <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
                    {section.kicker}
                  </p>
                )}
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading leading-tight mb-5">
                  {section.heading}
                </h2>
                {section.body.map((p, j) => (
                  <p key={j} className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
              </div>

              {section.image && (
                <div
                  className={`relative overflow-hidden rounded-[10px] aspect-[4/3] ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <img
                    src={section.image}
                    alt={section.imageAlt ?? section.heading}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24">
        <div className="rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.05] p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-3">
            Visit {cte.name}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
            This experience is built into our {cte.country} trips from{" "}
            {formatFirstTour(cte.firstTour)}. Find the route that takes you there.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
          >
            Explore Trips
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ===================== OTHER CTEs ===================== */}
      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
            More Enterprises
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-8">
            Others We <span className="text-tru-pink">Work With</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/about/our-impact/${o.slug}`}
                className="group relative overflow-hidden rounded-[10px] aspect-[5/3] block"
              >
                <img
                  src={o.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-heading text-[10px] font-bold uppercase tracking-[0.22em] text-tru-pink mb-1">
                    {o.country}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                    {o.name}
                  </h3>
                  <p className="text-[12px] text-gray-200 leading-snug">{o.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
