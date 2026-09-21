import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import { topCrumbs } from "@/lib/breadcrumbs";
import { ABOUT_PAGES } from "@/lib/about-pages";

export const metadata = {
  title: "About Us — Who TruTravels Are | TruTravels",
  description:
    "How TruTravels started, what we stand for, the impact we're trying to have, the community around us, and the brand itself.",
};

/**
 * The About Us landing page — a hub for the five About pages, matching
 * /destinations and /essentials.
 *
 * It used to carry its own hero, a retelling of the founder story, a stats
 * row, the brand-pillars carousel and the creators carousel. Every one of
 * those already lived on the page it belonged to: pillars on Our Brand,
 * creators on Our Community, the story on Our Story. A hub that restates its
 * children isn't a hub, it's a sixth page competing with them — and it meant
 * editing the same content twice.
 *
 * The five come from ABOUT_PAGES minus The Tru Way, which is exactly what the
 * nav's About menu shows. The Tru Way sits elsewhere in the hierarchy.
 */

const HERO = "https://cdn.trutravels.com/morocco-images/morocco-uncovered-marrakech-jardin-group-picture.jpg";

const PAGES = ABOUT_PAGES.filter((p) => p.href !== "/the-tru-way");

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img src={HERO} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              About TruTravels
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              About Us
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;We started this because we wanted to do something we enjoy, with people we love.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs crumbs={topCrumbs("About Us")} />

      <section className="relative overflow-hidden pt-16 pb-24">
        <img
          src="/bg-assets/sun.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert"
        />
        <img
          src="/bg-assets/bali-flower.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Photo cards, unlike Essentials: these five are people, places and
              stories, so there IS something to photograph. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group relative block aspect-[5/3] overflow-hidden rounded-[10px]"
              >
                <img
                  src={page.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="font-heading text-xl sm:text-2xl font-black uppercase leading-tight text-white transition-colors group-hover:text-tru-pink">
                    {page.name}
                  </h2>
                  <p className="mt-1.5 text-[12px] leading-snug text-gray-200">{page.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
