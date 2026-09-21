import Breadcrumbs from "@/components/breadcrumbs";
import { aboutCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import JobsBoard from "@/components/jobs-board";
import { JOBS, APPLY_EMAIL } from "@/lib/jobs";
import { ABOUT_PAGES } from "@/lib/about-pages";

export const metadata = {
  title: "Join The Crew — Careers At TruTravels",
  description:
    "Open roles at TruTravels — finance, operations and on-tour experience, across Bali, the Philippines and Thailand.",
};

/* A wide group shot with room on the right for the overlay. */
const HERO_IMG = "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg";

/* The three About pages worth reading before you apply. */
const BEFORE_YOU_APPLY = ["/about/our-story", "/about/our-values", "/about/our-impact"];

/**
 * Background icon. Same treatment as the About pages: the brand SVGs knocked
 * back to near-invisible, forced white with brightness-0 invert, and pulled
 * past the section edge. The section it sits in needs `relative overflow-hidden`
 * or it escapes and widens the page.
 */
function Wm({ src, className }: { src: string; className: string }) {
  return (
    <img
      src={`/bg-assets/${src}.svg`}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none absolute brightness-0 invert ${className}`}
    />
  );
}

export default function JoinTheCrewPage() {
  const crossLinks = ABOUT_PAGES.filter((p) => BEFORE_YOU_APPLY.includes(p.href));

  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Careers At Tru
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Join The<br /><span className="text-tru-pink">Crew</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;We started TruTravels because we wanted to do something we enjoy, with people we love. That
              hasn&apos;t changed.&rdquo;
            </p>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={aboutCrumbs("Careers")} />

      {/* ========================================================
          OPENING STATEMENT
          ======================================================== */}
      <section className="relative overflow-hidden pt-24 pb-24">
        <Wm src="sun" className="-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06]" />
        <Wm src="good-vibes" className="-left-16 top-[40%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            We only hire people we&apos;d happily spend{" "}
            <em className="not-italic text-tru-pink">fourteen days on a minibus with</em>.
          </p>
          <p>
            We started TruTravels because we wanted to do something we enjoy and work with people we love. So we&apos;ve
            tried our best over the years to make Tru a fun place to work, and to only hire cool, energetic,
            good-humoured and awesome people.
          </p>
          <p>
            As a result, the Tru family is made up of some of the most amazing people on the planet, who love working
            with each other and love what they do.
          </p>
          <p>
            We have operations in countries all over the world. If you want to live somewhere brilliant{" "}
            <em className="not-italic font-light">and</em>{" "}
            work for a fast-growing company, you have a passion for
            travel, and you can bring something to the table — have a look at what&apos;s open below.
          </p>
          <p className="text-tru-pink text-xl sm:text-2xl font-black uppercase font-heading tracking-[0.025em] leading-tight !mt-8">
            You don&apos;t need to tick every box.
          </p>
        </div>
      </section>

      {/* ========================================================
          OPEN ROLES
          ======================================================== */}
      <section id="roles" className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="mask" className="-left-16 -top-8 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.05]" />
        <Wm src="peru-bird" className="-right-12 -bottom-8 w-[200px] sm:w-[320px] lg:w-[420px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] mb-3 font-heading">Open Roles</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
            What We&apos;re <span className="text-tru-pink">Hiring For</span>
          </h2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            {JOBS.length}{" "}
            roles open right now. Everything you need to decide whether it&apos;s worth your time is on
            the card — open one for the full brief.
          </p>

          <JobsBoard />
        </div>
      </section>

      {/* ========================================================
          SPECULATIVE
          ======================================================== */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="bali-flower" className="-right-16 top-0 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.06]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] mb-3 font-heading">
            Nothing Quite Right?
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
            Tell Us What <span className="text-tru-pink">You&apos;d Do Here</span>
          </h2>
          <p className="text-gray-300 mt-5 mb-6 text-base sm:text-lg leading-relaxed max-w-2xl">
            We&apos;d rather hear from someone brilliant with no matching vacancy than miss them entirely. Send a CV and
            a short note about what you&apos;d want to build, and we&apos;ll keep it on file.
          </p>
          <a
            href={`mailto:${APPLY_EMAIL}?subject=Speculative%20application`}
            className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition"
          >
            Send A Speculative Application
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ========================================================
          BEFORE YOU APPLY
          ======================================================== */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="tru-logo" className="-left-16 -bottom-8 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] mb-3 font-heading">
            Before You Apply
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-10">
            Get To Know <span className="text-tru-pink">Us First</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {crossLinks.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group relative overflow-hidden rounded-[10px] aspect-[5/3] block"
              >
                <img
                  src={page.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                    {page.name}
                  </h3>
                  <p className="text-[12px] text-gray-200 leading-snug">{page.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
