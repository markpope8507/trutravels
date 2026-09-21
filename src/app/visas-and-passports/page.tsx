import Breadcrumbs from "@/components/breadcrumbs";
import { sectionCrumbs, ESSENTIALS } from "@/lib/breadcrumbs";
import Link from "next/link";
import DestinationsCarousel from "@/components/destinations-carousel";
import SherpaVisaWidget from "@/components/sherpa-visa-widget";

export const metadata = {
  title: "Visas & Passports — TruTravels",
  description:
    "Everything you need to know about visas and passports before your trip. Check entry requirements with our Sherpa-powered visa checker.",
};

export default function VisasAndPassportsPage() {
  return (
    <>
      {/* HERO — standard right-aligned overlay */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/jordan-tours/jordan-uncovered-desert-petra-walking-tour.jpg"
          alt="Travellers exploring on a TruTravels trip"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Essentials · The Essential Info
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Visas &amp;<br />
              <span className="text-tru-pink">Passports</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Sort the paperwork, then go get lost.&rdquo;
            </p>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={sectionCrumbs(ESSENTIALS, "Visa & Passports")} />

      {/* Content */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Passports & visas */}
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">The Essential Info</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-4">
              Passports &amp; <span className="text-tru-pink">Visas</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              You must carry a valid passport and have obtained all the appropriate visas, permits and certificates for every country you&apos;ll visit on your trip. Visa rules change regularly, so always double-check your own government&apos;s official information before you travel — we keep this as up to date as we can, but we can&apos;t guarantee it&apos;s 100% accurate for every nationality.
            </p>
          </div>

          {/* Visa checker — Sherpa widget */}
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Check Before You Go</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-4">
              Visa <span className="text-tru-pink">Checker</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              Review entry requirements and restrictions using the tool below, powered by Sherpa. Make sure you check the rules for both directions of travel.
            </p>
            {/* The Sherpa embed ships its own light theme, so it needs a white
                surface — the same treatment the checkout's Good to Go embed gets. */}
            <div className="rounded-[16px] border border-white/10 bg-white overflow-hidden p-4 sm:p-6">
              <SherpaVisaWidget />
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mt-4">
              The Sherpa visa portal isn&apos;t associated with TruTravels and is for information purposes only — we recommend applying for any visa through official government channels.
            </p>
          </div>

          {/* Explore CTA */}
          <div className="rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.05] p-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-3">
              Paperwork <span className="text-tru-pink">Sorted?</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto">
              With the admin out of the way, all that&apos;s left is picking the adventure. Browse the trips and find the one calling your name.
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
