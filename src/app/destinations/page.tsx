import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import { topCrumbs } from "@/lib/breadcrumbs";
import { countryHref, destinations, regionHref } from "@/lib/destinations";
import { trips as allTrips } from "@/lib/data";
import { HubBody, HubHero } from "@/components/section-hub";

export const metadata = {
  title: "Destinations — Small Group Tours In 35+ Countries | TruTravels",
  description:
    "Every country TruTravels runs small group adventures in, by continent — Asia, Central & South America, Europe, Africa & the Middle East and Oceania.",
};

/**
 * The Destinations landing page.
 *
 * It existed in the URL structure and in every breadcrumb but had no page, so
 * /destinations 404'd while /destinations/asia/thailand worked — the middle of
 * the hierarchy was missing.
 *
 * Regions and countries come from lib/destinations, the same list the nav's
 * mega menu reads. A second copy for this page is how the two would end up
 * disagreeing about which countries exist.
 *
 * A region heading links to its own page only where one exists (Asia today) —
 * `regionHref` returns null otherwise and the heading renders as plain text,
 * the same rule the nav applies. Country cards always link: every country
 * route resolves.
 */

const HERO = "https://cdn.trutravels.com/morocco-images/morocco-uncovered-desert-group-picture.jpg";

function tripCount(countryName: string) {
  return allTrips.filter((t) => t.destination === countryName).length;
}

export default function DestinationsPage() {
  const totalCountries = destinations.reduce((n, r) => n + r.countries.length, 0);

  return (
    <>
      <HubHero
        image={HERO}
        eyebrow="Where We Go"
        title={<>Destin&shy;ations</>}
        quote={`${totalCountries} countries across five continents, and a Local Legend in every one.`}
      />

      <Breadcrumbs crumbs={topCrumbs("Destinations")} />

      {/* Each region: heading, then its countries as image cards. Smaller
          cards than the other hubs on purpose — 23 countries, not five
          pages — so this one takes the shared hero and body but its own
          grid. */}
      <HubBody
        marks={[
          {
            src: "/bg-assets/sun.svg",
            className: "-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06]",
          },
          {
            src: "/bg-assets/peru-bird.svg",
            className: "-left-16 top-1/3 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]",
          },
        ]}
      >
        <div className="space-y-16">
          {destinations.map((region) => {
            const href = regionHref(region.region);
            return (
              <div key={region.region}>
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-white/10 pb-4">
                  {/* Plain text where the region has no page of its own — the
                      same rule the nav menu uses, rather than a link that
                      404s. */}
                  {href ? (
                    <Link
                      href={href}
                      className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white transition-colors hover:text-tru-pink"
                    >
                      {region.region}
                    </Link>
                  ) : (
                    <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                      {region.region}
                    </h2>
                  )}
                  <p className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    {region.countries.length} {region.countries.length === 1 ? "country" : "countries"}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {region.countries.map((c) => {
                    const trips = tripCount(c.name);
                    return (
                      <Link
                        key={c.name}
                        href={countryHref(c.name) ?? "/explore"}
                        className="group relative block aspect-[4/3] overflow-hidden rounded-[10px]"
                      >
                        <img
                          src={c.image}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/40 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                          <p className="font-heading text-base sm:text-lg font-black uppercase leading-tight text-white transition-colors group-hover:text-tru-pink">
                            {c.name}
                          </p>
                          <p className="mt-0.5 text-[11px] leading-snug text-gray-300">
                            {trips > 0 ? `${trips} ${trips === 1 ? "trip" : "trips"}` : c.nickname}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
      </HubBody>
    </>
  );
}
