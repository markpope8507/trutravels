import Link from "next/link";
import { PARTNERS, type Benefit } from "@/lib/partners";

/**
 * The furniture the three Partners pages share: background watermarks, section
 * headings, benefit cards, the numbered steps rail, the partner logo wall and
 * the testimonial carousel.
 *
 * Mirrored by the .ptn-* family in converted/styles.css.
 */

/** Background icon — brand SVG knocked back and pulled past the section edge.
 *  Its section needs `relative overflow-hidden` or it widens the page. */
export function Wm({ src, className }: { src: string; className: string }) {
  return (
    <img
      src={`/bg-assets/${src}.svg`}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none absolute brightness-0 invert ${className}`}
    />
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] mb-3 font-heading">{children}</p>
  );
}

export function H2({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
      {children} <span className="text-tru-pink">{accent}</span>
    </h2>
  );
}

/**
 * Benefit-card icons. Same treatment as the homepage stat icons
 * (components/what-we-do.tsx): bare line art at stroke-width 1.5 in pink, with
 * nothing behind it. No chip — the card already has a border, and a filled chip
 * inside it would be a box in a box. The route cards on /partner-with-us do get
 * a chip, because they're a larger, clickable object.
 *
 * `group` is lifted from the homepage on purpose: it means the same thing in
 * both places. Mirrored by BENEFIT_ICONS in converted/.build/build_partners.py
 * — edit both or they drift.
 */
const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  // a browser window — your own page / your own URL
  window: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path strokeLinecap="round" d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01" />
    </>
  ),
  // chain link — trackable links
  link: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
    />
  ),
  // percent — commission rate
  percent: (
    <>
      <path strokeLinecap="round" d="m19 5-14 14" />
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </>
  ),
  // rising line — incentives that go up through the year
  trend: <path strokeLinecap="round" strokeLinejoin="round" d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  // stacked images — the asset and template pack
  assets: (
    <>
      <rect x="3" y="3" width="13" height="13" rx="2" />
      <path strokeLinecap="round" d="M8 21h11a2 2 0 0 0 2-2V8" />
      <circle cx="7.5" cy="7.5" r="1.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 13 3.5-3.5 2.5 2.5L13 8l3 3" />
    </>
  ),
  // the homepage's "per group" icon — your community, together
  group: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-1a4 4 0 0 0-4-4h-1m-4 5H2v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1Zm-2-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6-1a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
    />
  ),
  // paper plane — you're on the trip too
  plane: <path strokeLinecap="round" strokeLinejoin="round" d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  // banknote — commission paid on bookings
  money: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path strokeLinecap="round" d="M6 12h.01M18 12h.01" />
    </>
  ),
  // rising bars — a rate that scales with how many come
  bars: <path strokeLinecap="round" d="M5 20v-5M10 20V9M15 20v-8M20 20V5" />,
};

/**
 * Five benefits in a two-up grid leaves the last one alone in a half-width
 * row, which reads as a hole rather than a card — so an odd last child spans.
 */
export function Benefits({ items }: { items: Benefit[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map(([t, d, ico], i) => (
        <div
          key={t}
          className={`rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-[1.1rem] ${
            i === items.length - 1 && items.length % 2 === 1 ? "md:col-span-2" : ""
          }`}
        >
          <span aria-hidden className="block h-7 w-7 text-tru-pink mb-[0.7rem]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="block h-full w-full">
              {BENEFIT_ICONS[ico]}
            </svg>
          </span>
          <p className="font-heading text-[0.8125rem] font-black uppercase tracking-[0.03em] text-tru-pink mb-1.5">{t}</p>
          <p className="text-[0.8125rem] leading-relaxed text-gray-400">{d}</p>
        </div>
      ))}
    </div>
  );
}

/** Numbered rail. The connector line is drawn on every step but the last. */
export function Steps({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
      {items.map(([t, d], i) => (
        <div key={t} className="relative pt-12">
          <span className="absolute top-0 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-tru-pink/15 border border-tru-pink/35 font-heading text-xs font-black text-tru-pink">
            {String(i + 1).padStart(2, "0")}
          </span>
          {i < items.length - 1 && (
            <span
              aria-hidden
              className="hidden md:block absolute top-[1.125rem] left-11 -right-6 h-px bg-gradient-to-r from-tru-pink/35 to-white/5"
            />
          )}
          <p className="font-heading text-sm font-black uppercase text-white mb-2">{t}</p>
          <p className="text-sm leading-relaxed text-gray-400">{d}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Every mark is a different colour and two of the six are solid black, so none
 * of them can sit straight on the navy. White tiles are the only treatment
 * that works for all six without altering anyone's logo.
 */
export function PartnerLogos() {
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {PARTNERS.map((p) => (
        <div key={p.slug} className="flex min-h-[6.5rem] items-center justify-center rounded-xl bg-white p-4">
          <img src={`/partners/${p.slug}.png`} alt={p.name} loading="lazy" className="max-h-[4.25rem] w-auto" />
        </div>
      ))}
    </div>
  );
}

/**
 * Testimonials. The partners and their marks are real; no quotes have been
 * collected yet, so a card without one says so rather than carrying invented
 * words under a real organisation's logo. Set `quote` in lib/partners.ts and
 * the tag disappears.
 */
export function PartnerQuotes() {
  return (
    <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PARTNERS.map((p) => (
        <article
          key={p.slug}
          className="snap-start shrink-0 w-[85%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]
                     flex flex-col rounded-[10px] border border-white/10 bg-white/[0.03] p-6"
        >
          <span className="self-start mb-5 flex items-center rounded-[10px] bg-white px-[0.9rem] py-[0.6rem]">
            <img src={`/partners/${p.slug}.png`} alt={p.name} loading="lazy" className="h-10 max-w-[9rem] w-auto object-contain" />
          </span>
          {p.quote ? (
            <p className="flex-1 mb-5 text-[0.9375rem] leading-[1.7] text-gray-300">{p.quote}</p>
          ) : (
            <>
              <span className="self-start mb-[0.9rem] inline-block rounded-full border border-dashed border-white/25 px-[0.7rem] py-[0.3rem] font-heading text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Awaiting copy
              </span>
              <p className="flex-1 mb-5 text-[0.9375rem] leading-[1.7] text-gray-300">
                We’ve asked {p.name} for a few words about working with us. Their quote goes here.
              </p>
            </>
          )}
          <p className="text-sm font-bold text-white">
            {p.name}
            <span className="mt-0.5 block text-[0.8125rem] font-normal text-gray-500">{p.what}</span>
          </p>
        </article>
      ))}
    </div>
  );
}

/** Cross-links at the foot of each Partners page. */
export function PartnerCrossLinks({ cards }: { cards: { href: string; image: string; title: string; desc: string }[] }) {
  return (
    <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
      <Wm src="tru-logo" className="-left-16 -bottom-8 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.05]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Eyebrow>Keep Looking</Eyebrow>
        <H2 accent="Ways In">The Other</H2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="group relative overflow-hidden rounded-[10px] aspect-[5/3] block">
              <img
                src={c.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                  {c.title}
                </h3>
                <p className="text-[12px] text-gray-200 leading-snug">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Full-bleed hero, statement right — the same one the About pages use. */
export function PartnerHero({
  image,
  eyebrow,
  title,
  accent,
  quote,
}: {
  image: string;
  eyebrow: string;
  title: string;
  accent: string;
  quote: string;
}) {
  return (
    <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
      <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
        <div className="max-w-xl text-right">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">{eyebrow}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
            {title}
            <br />
            <span className="text-tru-pink">{accent}</span>
          </h1>
          <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
          <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">{quote}</p>
        </div>
      </div>
    </section>
  );
}
