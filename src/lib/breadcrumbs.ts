/**
 * Breadcrumb trails, defined in one place.
 *
 * WHY A LIB AND NOT MARKUP PER PAGE
 * The trip page used to hand-roll its trail, and it drifted: it never started
 * at Home, it stopped at the country instead of naming the trip, and both
 * "Destinations" and the continent pointed at /explore — two different crumbs,
 * one wrong destination. Defining trails here means a page says what it *is*
 * and the trail follows.
 *
 * THE RULES
 *  1. Every trail starts at Home.
 *  2. Every trail ends at the current page, which is never a link.
 *  3. A crumb with no `href` renders as plain text, not a dead link. Some
 *     ancestors don't exist yet (/destinations, /essentials) — a crumb that
 *     goes nowhere is honest; one that quietly points at /explore instead is
 *     not, and that's the bug this replaces.
 *
 * Mirrored by the same trails in converted/.build/crumbs.py.
 */

export type Crumb = {
  name: string;
  /** Omitted for the current page, and for ancestors that aren't built yet. */
  href?: string;
};

export const HOME: Crumb = { name: "Home", href: "/" };

/**
 * The second level of every trail — taken from the MAIN NAV, so a breadcrumb
 * and the menu never disagree about where a page lives.
 *
 * The nav's shape:
 *   top level   Explore · Deals · Stories
 *   menus       Destinations · Travel Styles · About Us · Essentials
 *
 * Where a page IS in the nav, the nav wins: Deals is top level here even
 * though the footer files it under Explore. Where a page is NOT in the nav —
 * Partners, Careers, Share Your Photos, The Tru Way — it follows its footer
 * column, in the same shape.
 *
 * The Travel Styles menu holds two groups, the styles and the life moments,
 * which is why a life moment sits two deep inside it.
 *
 * A section with no `href` has no page yet. It still belongs in the trail:
 * the structure reads correctly and only the link is missing, so when the
 * page lands you add the href here once and every trail picks it up.
 */
export const DESTINATIONS: Crumb = { name: "Destinations", href: "/destinations" };
export const ESSENTIALS: Crumb = { name: "Essentials", href: "/essentials" };

export const ABOUT: Crumb = { name: "About Us", href: "/about" };
export const EXPLORE: Crumb = { name: "Explore", href: "/explore" };
export const STORIES: Crumb = { name: "Stories", href: "/stories" };
export const TRAVEL_STYLES: Crumb = { name: "Travel Styles", href: "/travel-styles" };
/* A group heading inside the Travel Styles menu, not a page of its own. */
export const LIFE_MOMENTS: Crumb = { name: "Life Moments" };

/* Not in the nav, so these follow the FOOTER's columns instead — same rule,
   same shape: a section node with no page behind it yet.
   No /my-account index either; the dashboard is the landing page. */
export const PARTNERS: Crumb = { name: "Partners" }; // TODO: href "/partners"
export const ACCOUNT: Crumb = { name: "My Account", href: "/my-account/dashboard" };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Home / Destinations / Asia / Thailand / Thailand Island Hopper */
export function tripCrumbs(region: string, country: string, title: string): Crumb[] {
  return [
    HOME,
    DESTINATIONS,
    { name: region, href: `/destinations/${slug(region)}` },
    { name: country, href: `/destinations/${slug(region)}/${slug(country)}` },
    { name: title },
  ];
}

/** Home / Destinations / Asia / Thailand */
export function countryCrumbs(region: string, country: string): Crumb[] {
  return [HOME, DESTINATIONS, { name: region, href: `/destinations/${slug(region)}` }, { name: country }];
}

/** Home / Destinations / Asia */
export function regionCrumbs(region: string): Crumb[] {
  return [HOME, DESTINATIONS, { name: region }];
}

/** Home / About Us / Our Story */
export function aboutCrumbs(page: string): Crumb[] {
  return [HOME, ABOUT, { name: page }];
}

/** Home / Essentials / Travel Insurance */
export function essentialsCrumbs(page: string): Crumb[] {
  return [HOME, ESSENTIALS, { name: page }];
}

/** Home / <page> — for anything hanging directly off the homepage. */
export function topCrumbs(page: string): Crumb[] {
  return [HOME, { name: page }];
}

/** Home / About Us / Our Impact / Bang Lamphu — a project under the hub. */
export function impactCrumbs(project: string): Crumb[] {
  return [HOME, ABOUT, { name: "Our Impact", href: "/about/our-impact" }, { name: project }];
}

/** Home / Travel Styles / Life Moments / Gap Year — the nav nests them. */
export function lifeMomentCrumbs(moment: string): Crumb[] {
  return [HOME, TRAVEL_STYLES, LIFE_MOMENTS, { name: moment }];
}

/** Home / <section> / <page> — the general two-deep case. */
export function sectionCrumbs(section: Crumb, page: string): Crumb[] {
  return [HOME, section, { name: page }];
}
