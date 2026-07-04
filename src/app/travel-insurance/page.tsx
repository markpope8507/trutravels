import Link from "next/link";
import DestinationsCarousel from "@/components/destinations-carousel";

export const metadata = {
  title: "Travel Insurance — TruTravels",
  description:
    "Travel insurance is compulsory on every Tru trip. Cover for adventure activities, emergency medical, lost luggage and trip cancellation — wherever you're headed.",
};

const QUOTE_URL = "https://www.anrdoezrs.net/click-101301337-15403748";

const COVER = [
  "Emergency medical care & repatriation",
  "150+ adventure activities — trekking, diving, surfing and more",
  "Lost, stolen or damaged gear",
  "Trip cancellation & curtailment",
  "24/7 emergency assistance",
  "Cover for the full length of your trip",
];

export default function TravelInsurancePage() {
  return (
    <>
      {/* HERO — standard right-aligned overlay */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/indonesia-images/surfing-lesson-bali.jpg"
          alt="Adventure activity on a TruTravels trip"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Essentials · The Serious Stuff
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Travel<br />
              <span className="text-tru-pink">Insurance</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Cover you can count on — wherever the road takes you.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Why it matters */}
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Non-Negotiable</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-4">
              Don&apos;t Skip <span className="text-tru-pink">The Cover</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Travel insurance is compulsory on every Tru trip — and for good reason. It&apos;s the one thing you hope you never need, and the one thing you&apos;ll be seriously glad you have if you do. Whatever you go for, make sure it covers your whole trip and doesn&apos;t leave you paying out of pocket before you can claim. Cheapest isn&apos;t always best.
            </p>
          </div>

          {/* What good cover looks like */}
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">The Checklist</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-6">
              What Good Cover <span className="text-tru-pink">Looks Like</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COVER.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-[10px] border border-white/10 bg-white/5 p-4 text-gray-200 text-sm">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-tru-pink/15 flex items-center justify-center flex-shrink-0">
                    <svg className="h-3 w-3 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* World Nomads card */}
          <div className="rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.05] p-8 sm:p-10">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Our Partner</p>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-4">
              World Nomads
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              We&apos;ve teamed up with World Nomads, who cover more than 150 adventure activities plus emergency medical, lost luggage, trip cancellation and more. Buy before you go or top up while you&apos;re travelling, and claim online from anywhere in the world.
            </p>
            <a
              href={QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
            >
              Get A Quote Here
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <p className="text-gray-500 text-xs leading-relaxed mt-6">
              We receive a fee when you get a quote from World Nomads using this link. We don&apos;t represent World Nomads, and this isn&apos;t a recommendation to buy travel insurance — just a good place to start.
            </p>
          </div>

          {/* Vaccinations — global, no NHS reference */}
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Health &amp; Jabs</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-4">
              Vaccinations <span className="text-tru-pink">&amp; Health</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Some destinations recommend specific vaccinations. Check your own country&apos;s official travel-health guidance, or pop into a travel clinic well before you fly — they&apos;ll give you the most up-to-date advice for wherever you&apos;re headed.
            </p>
          </div>

          {/* Explore CTA */}
          <div className="rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.05] p-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-3">
              Sorted? Now The <span className="text-tru-pink">Fun Part</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto">
              Cover in hand — all that&apos;s left is picking the adventure. Browse the trips and find the one calling your name.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
            >
              Find Your Trip
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* You Might Like */}
      <DestinationsCarousel />
    </>
  );
}
