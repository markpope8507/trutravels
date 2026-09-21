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
 *
 * Same photo cards as /about and /destinations. This page briefly used line
 * icons instead, because the nav's stock images were wrong at card size — but
 * three hubs in two shapes is worse than a bad photo, and the real fix was
 * better photos: each card now carries its own page's hero.
 */

const HERO = "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg";

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
          {/* Two up, not three: four cards in a three-column grid strand the
              last one on its own row. Same card design as /about — only the
              column count differs, because it's fitting the content. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {essentialsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative block aspect-[5/3] overflow-hidden rounded-[10px]"
              >
                <img
                  src={item.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="font-heading text-xl sm:text-2xl font-black uppercase leading-tight text-white transition-colors group-hover:text-tru-pink">
                    {item.name}
                  </h2>
                  <p className="mt-1.5 text-[12px] leading-snug text-gray-200">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
