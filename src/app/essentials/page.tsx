import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import { topCrumbs } from "@/lib/breadcrumbs";
import { essentialsNav } from "@/lib/essentials";

export const metadata = {
  title: "Essentials — Insurance, Visas, Booking Conditions & Support | TruTravels",
  description:
    "The practical side of travelling with TruTravels: travel insurance, visa and passport requirements, booking conditions, and help when you need it.",
};

/**
 * The Essentials landing page.
 *
 * It was a nav menu and a breadcrumb crumb with no page behind either, so
 * /essentials 404'd while everything under it worked.
 *
 * The four come from lib/essentials, the same list the nav menu reads — NOT
 * the footer's Essentials column, which also lists Book With Confidence, Share
 * Your Photos and Package Travel Regulations. Those live elsewhere in the
 * hierarchy, and the nav is the rule the breadcrumbs follow too.
 */

const HERO = "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg";

/**
 * Icons, not photographs. The nav data carries a stock image per item, which
 * works at menu-thumbnail size and falls apart at card size: Booking
 * Conditions was a photo of US tax forms and Visa & Passports a stock portrait
 * of a stranger. These four are documents and services rather than places, so
 * there is nothing to photograph — line icons at the site's own weight say
 * more and cannot be wrong about the subject.
 */
const ICONS: Record<string, React.ReactNode> = {
  // shield with a tick — cover
  "Travel Insurance": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3 4.5 6v6c0 4.4 3.1 8.3 7.5 9.4 4.4-1.1 7.5-5 7.5-9.4V6L12 3Zm-2.6 8.8 2 2 4.2-4.4"
    />
  ),
  // a passport — photo page and lines
  "Visa & Passports": (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 3.5h9.5a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5H6a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z"
      />
      <circle cx="11.5" cy="10" r="2.5" />
      <path strokeLinecap="round" d="M8.5 15.5h6" />
    </>
  ),
  // a signed document
  "Booking Conditions": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 14.5 2 2 4-4.5" />
    </>
  ),
  // a question in a speech bubble
  "Help & Support": (
    <>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.3-1L3 20.5l1.7-4.4A8.3 8.3 0 0 1 3.6 11.5C3.6 6.8 7.4 3 12 3s9 3.8 9 8.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 9.3a2.2 2.2 0 0 1 4.2.8c0 1.5-2.1 1.9-2.1 3.1" />
      <path strokeLinecap="round" d="M12 16.2h.01" />
    </>
  ),
};

export default function EssentialsPage() {
  return (
    <>
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img src={HERO} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Before You Go
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Essentials
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;The boring bits, in one place, so they stay boring.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs crumbs={topCrumbs("Essentials")} />

      <section className="relative overflow-hidden pt-16 pb-24">
        <img
          src="/bg-assets/lantern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[520px] opacity-[0.06] brightness-0 invert"
        />
        <img
          src="/bg-assets/good-vibes.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 bottom-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-12">
            Cover, paperwork, the terms you&rsquo;re agreeing to, and a person to ask when something isn&rsquo;t
            obvious. None of it is the exciting part of a trip — all of it is the part you&rsquo;ll be glad was
            sorted.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {essentialsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-tru-pink/45 hover:bg-white/[0.05]"
              >
                <span className="mb-[0.9rem] block h-7 w-7 sm:h-8 sm:w-8 text-tru-pink">
                  <svg className="block h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                    {ICONS[item.name]}
                  </svg>
                </span>
                <h2 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight text-white mb-2">
                  {item.name}
                </h2>
                <p className="flex-1 text-sm leading-relaxed text-gray-400 mb-5">{item.description}</p>
                <span className="inline-flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.1em] text-tru-pink">
                  Read More
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
