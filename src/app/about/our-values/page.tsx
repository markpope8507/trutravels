import Link from "next/link";
import { otherAboutPages } from "@/lib/about-pages";

export const metadata = {
  title: "Our Values — TruTravels",
  description: "What we stand for and how we travel — the TruTravels mission.",
};

export default function OurValuesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
          alt="A map, a camera and a passport — the gear of every journey"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Our Values
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              What We<br />Stand For
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;To make a positive difference.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          MISSION STATEMENT
          ======================================================== */}
      <section className="pt-24 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading">
            Our Mission
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase font-heading leading-[0.95] !mt-3">
            <span className="block text-white">Change Lives</span>
            <span className="block text-tru-pink">Through Travel</span>
          </h2>

          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight !mt-8">
            Our mission is simple.
          </p>

          <p>
            To create life-changing group travel experiences which truly benefit all those involved — customers, staff, suppliers, partners and local communities.
          </p>

          <p>
            To do what we love, and to use our energy and experience to give our customers the best time of their lives.
          </p>

          {/* The force-for-good commitment is the one we lead on — given its own
              panel rather than sitting as the third paragraph in a run. */}
          <div className="!mt-10 rounded-[16px] border border-tru-green/25 bg-tru-green/[0.06] p-6 sm:p-8">
            <p className="text-tru-green text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-4">
              Business As A Force For Good
            </p>
            <p className="text-white text-xl sm:text-2xl font-bold font-heading leading-snug mb-4">
              To use our business as a force for good.
            </p>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              One that leverages the travel industry&apos;s huge potential to alter perspective
              and to address issues of inequality, ethics, social and environmental
              responsibility.
            </p>
          </div>

          <p className="text-white text-xl sm:text-2xl font-bold font-heading !mt-10">
            And above all else,
          </p>

          <p className="border-l-2 border-tru-pink pl-6 my-8 text-4xl sm:text-5xl font-black uppercase font-heading leading-[0.95]">
            <span className="block text-white">To make a</span>
            <span className="block text-tru-pink">positive difference.</span>
          </p>
        </div>
      </section>

      {/* ========================================================
          VALUES GRID
          ======================================================== */}
      <section className="pb-24 border-t border-white/5 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              What We Live By
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Our Core <span className="text-tru-pink">Values</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Our values are what guide us in our decision-making and how we show up for one another.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-10 lg:gap-y-14">
            {/* Value 1 — We Don't Do Average */}
            <div>
              <h3 className="font-heading mb-4 leading-[0.95]">
                <span className="block text-3xl sm:text-4xl font-black uppercase text-white">We Don&apos;t Do</span>
                <span className="inline-block text-3xl sm:text-4xl font-black uppercase text-tru-pink underline decoration-tru-pink decoration-wavy decoration-2 underline-offset-[6px]">Average</span>
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                We only do mind-blowingly awesome. We pride ourselves on excellence and go over and above to provide life-changing experiences for all our customers every time. We are always striving to innovate and improve our services and our trips so we can provide the best value for our customers.
              </p>
            </div>

            {/* Value 2 — For The Benefit Of All */}
            <div>
              <h3 className="font-heading mb-4 leading-[0.95]">
                <span className="block text-3xl sm:text-4xl font-black uppercase text-white">For The</span>
                <span className="inline-block text-3xl sm:text-4xl font-black uppercase text-tru-pink border-2 border-tru-pink rounded-full px-4 py-0.5 my-1.5">Benefit</span>
                <span className="block text-3xl sm:text-4xl font-black uppercase text-white">Of All</span>
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                We do what we do for the good of our customers, staff, partners and the communities where we work. We want to make the world a better place — whether that&apos;s by spreading good vibes and making people happy or by helping development in areas that need it. We believe business should be used as a force for good.
              </p>
            </div>

            {/* Value 3 — Create Opportunity */}
            <div>
              <h3 className="font-heading mb-4 leading-[0.85]">
                <span className="block text-3xl sm:text-4xl font-black uppercase text-white">Create</span>
                <span className="block text-5xl sm:text-6xl font-handwriting text-tru-green">Opportunity</span>
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                We believe in providing the opportunity for our customers to have the time of their lives, for our staff to be the best they can be, and for our partners and communities to use tourism as a chance to improve their lives. Together we promote equality through social enterprise and responsible travel.
              </p>
            </div>

            {/* Value 4 — We Are Family */}
            <div>
              <h3 className="font-heading mb-4 leading-[0.95]">
                <span className="block text-3xl sm:text-4xl font-black uppercase text-white">We Are</span>
                <span className="inline-flex items-center gap-2 text-3xl sm:text-4xl font-black uppercase text-tru-pink">
                  <svg className="h-7 w-7 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  Family
                </span>
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Our people are what make us so unique. Everyone at Tru is part of the family — we work, play and party together. The TruFam is an amazing bunch of individuals who share our passion for spreading good vibes and changing lives through travel. Everyone who comes on tour with us becomes part of the Tru Family for life.
              </p>
            </div>

            {/* Value 5 — Live The Dream */}
            <div>
              <h3 className="font-heading mb-4 leading-[0.95]">
                <span className="block text-3xl sm:text-4xl font-black uppercase text-white">Live The</span>
                <span className="inline-flex items-center gap-2 text-3xl sm:text-4xl font-black uppercase text-tru-blue">
                  <svg className="h-7 w-7 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22V11" />
                    <path d="M12 11 Q 6 6 2 9" />
                    <path d="M12 11 Q 18 6 22 9" />
                    <path d="M12 11 Q 9 4 6 3" />
                    <path d="M12 11 Q 15 4 18 3" />
                    <path d="M12 11 Q 12 5 12 2" />
                  </svg>
                  Dream
                </span>
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Love what you do and you&apos;ll never work a day in your life. Fun is built into everything we do — if we&apos;re not enjoying ourselves, we can&apos;t give our customers the best experience. We aim to inspire people to live the dream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MORE ABOUT US — same card treatment as Life Moments
          ======================================================== */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.07] brightness-0 invert" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              More About Us
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              The Rest Of <span className="text-tru-pink">The Story</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Values are only half of it. Here&apos;s where we came from, the work we back, the
              people in our world and how we actually run a trip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAboutPages("/about/our-values").map((page) => (
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
