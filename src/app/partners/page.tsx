import Breadcrumbs from "@/components/breadcrumbs";
import { topCrumbs } from "@/lib/breadcrumbs";
import { HubBody, HubCard, HubGrid, HubHero } from "@/components/section-hub";
import { PARTNER_PAGES, PARTNERS_HERO } from "@/lib/partner-pages";

export const metadata = {
  title: "Partners — Host A Trip, Affiliates & Travel Agents | TruTravels",
  description:
    "Every way to work with TruTravels: host your own group trip, join the Tru Affiliates programme, or register a booking as a travel agent.",
};

/**
 * The Partners landing page.
 *
 * Partners was the last section with a footer column, a breadcrumb crumb and
 * no page behind either — so /partners 404'd while everything under it
 * worked, and the Partners crumb on four pages was dead text. It now links.
 *
 * The five come from lib/partner-pages, the same list the footer's Partners
 * column reads. Partners isn't in the main nav, so the footer is the
 * authority here — the rule the breadcrumbs follow too.
 *
 * Same hero, grid and cards as /about, /essentials and /destinations, from
 * components/section-hub. Mirrored by converted/.build/build_hubs.py.
 */

export default function PartnersPage() {
  return (
    <>
      <HubHero
        image={PARTNERS_HERO}
        eyebrow="Work With Tru"
        title="Partners"
        quote="Bring us your community, your audience or your clients — we'll bring the trip."
      />

      <Breadcrumbs crumbs={topCrumbs("Partners")} />

      <HubBody
        marks={[
          {
            src: "/bg-assets/good-vibes.svg",
            className: "-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[520px] opacity-[0.06]",
          },
          {
            src: "/bg-assets/sun.svg",
            className: "-left-16 bottom-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]",
          },
        ]}
      >
        <HubGrid>
          {PARTNER_PAGES.map((p) => (
            <HubCard key={p.href} {...p} />
          ))}
        </HubGrid>
      </HubBody>
    </>
  );
}
