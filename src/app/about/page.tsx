import Breadcrumbs from "@/components/breadcrumbs";
import { topCrumbs } from "@/lib/breadcrumbs";
import { ABOUT_PAGES } from "@/lib/about-pages";
import { HubBody, HubCard, HubGrid, HubHero } from "@/components/section-hub";

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
      <HubHero
        image={HERO}
        eyebrow="About TruTravels"
        title="About Us"
        quote="We started this because we wanted to do something we enjoy, with people we love."
      />

      <Breadcrumbs crumbs={topCrumbs("About Us")} />

      <HubBody
        marks={[
          {
            src: "/bg-assets/sun.svg",
            className: "-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06]",
          },
          {
            src: "/bg-assets/bali-flower.svg",
            className: "-left-16 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]",
          },
        ]}
      >
        <HubGrid>
          {PAGES.map((page) => (
            <HubCard key={page.href} {...page} />
          ))}
        </HubGrid>
      </HubBody>
    </>
  );
}
