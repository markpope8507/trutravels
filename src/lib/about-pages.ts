/**
 * The pages that make up the About section.
 *
 * One list, used by the navbar's About mega-menu and by the cross-links at the
 * foot of each About page — so adding a page here puts it in both places
 * rather than needing two edits that can drift apart.
 */

export type AboutPage = {
  name: string;
  href: string;
  description: string;
  image: string;
};

export const ABOUT_PAGES: AboutPage[] = [
  {
    name: "Our Story",
    href: "/about/our-story",
    description: "How TruTravels started — straight from the founders.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    name: "Our Values",
    href: "/about/our-values",
    description: "What we stand for and how we travel.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  },
  {
    name: "Our Impact",
    href: "/about/our-impact",
    description: "Local guides, Planeterra projects, real change.",
    image: "https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=800&q=80",
  },
  {
    name: "Our Community",
    href: "/about/our-community",
    description: "The travellers, leaders, and creators in our world.",
    image: "https://cdn.trutravels.com/greece/greece-island-hopper-026.jpg",
  },
  {
    name: "Our Brand",
    href: "/about/our-brand",
    description: "Logo, voice, and the look of TruTravels.",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80",
  },
  {
    name: "The Tru Way",
    href: "/the-tru-way",
    description: "How we run trips, and why they feel different.",
    image: "/images/the-tru-way-hero.jpg",
  },
];

/** Every About page except the one you're on — for the cross-link grid. */
export function otherAboutPages(currentHref: string) {
  return ABOUT_PAGES.filter((p) => p.href !== currentHref);
}
