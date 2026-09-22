import Breadcrumbs from "@/components/breadcrumbs";
import { topCrumbs } from "@/lib/breadcrumbs";
import { essentialsNav } from "@/lib/essentials";
import { HubBody, HubCard, HubGrid, HubHero } from "@/components/section-hub";

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
 * Same photo cards as /about, /destinations and /partners — all four now
 * share components/section-hub, so "the same size as the About ones" is a
 * property of the code rather than something to keep re-checking. This page
 * briefly used line icons instead, because the nav's stock images were wrong
 * at card size; the real fix was better photos, and each card now carries its
 * own page's hero.
 */

const HERO = "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg";

export default function EssentialsPage() {
  return (
    <>
      <HubHero
        image={HERO}
        eyebrow="Before You Go"
        title="Essentials"
        quote="The boring bits, in one place, so they stay boring."
      />

      <Breadcrumbs crumbs={topCrumbs("Essentials")} />

      <HubBody
        marks={[
          {
            src: "/bg-assets/lantern.svg",
            className: "-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[520px] opacity-[0.06]",
          },
          {
            src: "/bg-assets/good-vibes.svg",
            className: "-left-16 bottom-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]",
          },
        ]}
      >
        <HubGrid>
          {essentialsNav.map((item) => (
            <HubCard key={item.href} {...item} />
          ))}
        </HubGrid>
      </HubBody>
    </>
  );
}
