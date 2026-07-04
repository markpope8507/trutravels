import Link from "next/link";
import { FAQ_GROUPS } from "@/lib/faqs";
import FaqSection from "@/components/faq-section";
import StoriesFeature from "@/components/stories-feature";

export const metadata = {
  title: "FAQs — TruTravels",
  description:
    "Everything you need to know before you go — group sizes, what's included, payments, insurance, visas and more.",
};

export default function FaqsPage() {
  return (
    <>
      {/* HERO — standard right-aligned overlay */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg"
          alt="TruTravels group at a viewpoint"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Essentials · Need To Know
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Got<br />
              <span className="text-tru-pink">Questions?</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Everything you need to know before you go. Can&apos;t find it? Just ask.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* FAQ groups */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-white/10">
            {FAQ_GROUPS.map((group) => (
              <FaqSection
                key={group.category}
                title={group.category}
                description={group.description}
                faqs={group.faqs}
              />
            ))}
          </div>

          {/* Still stuck CTA */}
          <div className="mt-14 rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.05] p-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-3">
              Still Not <span className="text-tru-pink">Sure?</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto">
              The best way to picture it is to find the trip that&apos;s calling your name. Browse the adventures and the rest falls into place.
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

      {/* Stories From The Road */}
      <StoriesFeature />
    </>
  );
}
