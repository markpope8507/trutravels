/**
 * The pages that make up the Partners section.
 *
 * One list, read by the /partners landing page and the footer's Partners
 * column — so adding a page here puts it in both rather than needing two
 * edits that drift apart. Same shape and same job as lib/essentials.ts and
 * lib/about-pages.ts; the three hubs are one design.
 *
 * STRUCTURE COMES FROM THE FOOTER. Partners isn't in the main nav at all, so
 * the footer's Partners column is the authority for what's in this section —
 * the same rule lib/breadcrumbs.ts follows.
 *
 * `image` is each page's OWN hero, so a card shows the page it opens. If you
 * change a hero, change it here too.
 *
 * ONE CARD LEAVES THE SITE. Agents Login is G Adventures' Sherpa portal, not
 * a page we own — `external` marks it so the card can say so and the link can
 * carry the right rel/target. Everything else is a route in this app.
 */

export type PartnerPage = {
  name: string;
  href: string;
  description: string;
  image: string;
  external?: boolean;
};

export const PARTNER_PAGES: PartnerPage[] = [
  {
    name: "Partner With Us",
    href: "/partner-with-us",
    description: "Not sure which route fits? Start here and tell us about your community.",
    image: "https://cdn.trutravels.com/morocco-images/morocco-uncovered-desert-group-picture.jpg",
  },
  {
    name: "Tru Affiliates",
    href: "/affiliates",
    description: "Your own trackable links and a minimum 5% commission.",
    image: "https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg",
  },
  {
    name: "Host A Trip",
    href: "/host-a-trip",
    description: "Bring your community in person. We handle everything else.",
    image: "https://cdn.trutravels.com/morocco-images/morocco-uncovered-marrakech-jardin-group-picture.jpg",
  },
  {
    name: "Agent Registration",
    href: "/agent-registration",
    description: "Travel agents: register a booking you've made for a client.",
    image: "https://cdn.trutravels.com/south-korea/seoul-day-4.jpg",
  },
  {
    name: "Agents Login",
    href: "https://sherpa.gtravelcommunity.com/login/",
    description: "Sign in to Sherpa for live availability, bookings and commission.",
    image: "https://cdn.trutravels.com/thailand/longtail-boat.jpg",
    external: true,
  },
];

/** The Partners hub's own hero — deliberately not any card's image. */
export const PARTNERS_HERO =
  "https://cdn.trutravels.com/africa/morocco-images/morocco-uncovered-day-3-road-trip-viewpoint.jpg";

/** Where agents log in. Referenced from the footer and /agent-registration too,
 *  so the URL is written once. */
export const AGENT_PORTAL_URL = "https://sherpa.gtravelcommunity.com/login/";
