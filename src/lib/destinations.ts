/**
 * The destination tree — regions and the countries under them.
 *
 * Lifted out of navbar.tsx so the nav's Destinations menu and the
 * /destinations landing page read the SAME list. It was only in the navbar,
 * and a second copy for the landing page is exactly how the two would end up
 * disagreeing about which countries exist.
 *
 * KNOWN DATA GAP: Cambodia and India share one photo (the Taj Mahal), which
 * was invisible in the nav's small rows and is obvious on the /destinations
 * cards. Cambodia needs a real Cambodia image — don't substitute another
 * country's, which is the same error in a different direction.
 *
 * COUNTRY LINKS ARE DERIVED, NOT WRITTEN DOWN. Both consumers call
 * `countryHref()`, which asks the country's own data — so a link here can't
 * contradict the page it points at. Every entry nonetheless still carried a
 * hand-typed `href` that nothing read and that had already drifted (Sri Lanka
 * and India pointed at /destinations/asia/… while the data said "South Asia").
 * They are gone; don't add them back.

 * REGIONS MATCH THE LIVE SITE: Asia (Sri Lanka and India included),
 * Africa & Middle East, Europe, Latin & Central America, Oceania. lib/data
 * uses the same five.
 *
 * Region pages are rarer still — only the ones in `regionPages` exist, so use
 * `regionHref()` rather than assuming /destinations/<slug> resolves.
 */
import { countries, regionPages } from "@/lib/data";
import { countryUrl } from "@/lib/utils";

export type DestinationCountry = {
  name: string;
  flag: string;
  tag: string;
  image: string;
};

export type DestinationRegion = { region: string; countries: DestinationCountry[] };

export const slugifyRegion = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const REGION_PAGE_SLUGS = new Set(regionPages.map((r) => r.slug));

/**
 * The line under a country's name in the nav and on /destinations.
 *
 * ONE SOURCE. This list used to carry its own `nickname` per country, and seven
 * of them disagreed with the same country's `tagline` on its hero — a customer
 * read "Emerald of the Equator" in the menu and "Island of the Gods" on the page
 * they landed on. The hero tagline wins; this reads it.
 *
 * NAV_ONLY covers entries that have no Country record — currently just Europe By
 * Rail, which is a multi-country trip rather than a destination.
 */
const NAV_ONLY: Record<string, string> = {
  "Europe By Rail": "Borderless Europe",
};

export function countryNickname(name: string): string {
  return countries.find((x) => x.name === name)?.tagline ?? NAV_ONLY[name] ?? "";
}

/** A country's real URL, derived from its own data. Null if it has no page. */
export function countryHref(name: string): string | null {
  const c = countries.find((x) => x.name === name);
  return c ? countryUrl(c) : null;
}

/** The region's own page, or null when it hasn't been built yet. */
export function regionHref(region: string): string | null {
  const slug = slugifyRegion(region);
  return REGION_PAGE_SLUGS.has(slug) ? `/destinations/${slug}` : null;
}

export const destinations: DestinationRegion[] = [
  {
    region: "Asia",
    countries: [
      { name: "Thailand", flag: "🇹🇭", tag: "Top Seller", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80" },
      { name: "Indonesia", flag: "🇮🇩", tag: "Popular", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80" },
      { name: "Philippines", flag: "🇵🇭", tag: "Popular", image: "https://cdn.trutravels.com/images/philippines.jpg" },
      { name: "Vietnam", flag: "🇻🇳", tag: "Top Seller", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80" },
      { name: "Cambodia", flag: "🇰🇭", tag: "", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80" },
      { name: "Sri Lanka", flag: "🇱🇰", tag: "", image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800&q=80" },
      { name: "India", flag: "🇮🇳", tag: "", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80" },
      { name: "Japan", flag: "🇯🇵", tag: "", image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&q=80" },
      { name: "China", flag: "🇨🇳", tag: "New", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80" },
      { name: "South Korea", flag: "🇰🇷", tag: "New", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80" },
      { name: "Kyrgyzstan", flag: "🇰🇬", tag: "New", image: "https://images.unsplash.com/photo-1526397751294-331021109fbd?w=800&q=80" },
    ],
  },
  {
    region: "Latin & Central America",
    countries: [
      { name: "Mexico", flag: "🇲🇽", tag: "Popular", image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80" },
      { name: "Costa Rica", flag: "🇨🇷", tag: "", image: "https://cdn.trutravels.com/images/costarica.jpg" },
      { name: "Colombia", flag: "🇨🇴", tag: "", image: "https://cdn.trutravels.com/images/colombia-view.jpg" },
      { name: "Peru", flag: "🇵🇪", tag: "", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80" },
      { name: "Brazil", flag: "🇧🇷", tag: "", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80" },
      { name: "Belize", flag: "🇧🇿", tag: "", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" },
      { name: "Guatemala", flag: "🇬🇹", tag: "", image: "https://cdn.trutravels.com/images/mexico-guatemala-belize3.png" },
      { name: "Argentina", flag: "🇦🇷", tag: "New", image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80" },
      { name: "Uruguay", flag: "🇺🇾", tag: "New", image: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=800&q=80" },
      { name: "Galapagos Islands", flag: "🇪🇨", tag: "New", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
    ],
  },
  {
    region: "Europe",
    countries: [
      { name: "Greece", flag: "🇬🇷", tag: "Popular", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" },
      { name: "Italy", flag: "🇮🇹", tag: "", image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80" },
      { name: "Albania", flag: "🇦🇱", tag: "New", image: "https://cdn.trutravels.com/albania/kayaking-1.jpeg" },
      { name: "Bulgaria", flag: "🇧🇬", tag: "New", image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80" },
      /* Not a country — a multi-country rail itinerary sold from this menu, so
         it has no Country entry and countryHref() returns null for it. */
      { name: "Europe By Rail", flag: "🚆", tag: "New", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80" },
    ],
  },
  {
    region: "Africa & Middle East",
    countries: [
      { name: "Morocco", flag: "🇲🇦", tag: "Popular", image: "https://cdn.trutravels.com/morocco-images/morocco-uncovered-marrakech-jardin-group-picture.jpg" },
      { name: "Jordan", flag: "🇯🇴", tag: "", image: "https://cdn.trutravels.com/jordan-tours/jordan-uncovered-desert-petra-walking-tour.jpg" },
      { name: "Egypt", flag: "🇪🇬", tag: "New", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80" },
      { name: "South Africa", flag: "🇿🇦", tag: "New", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80" },
    ],
  },
  {
    region: "Oceania",
    countries: [
      { name: "New Zealand", flag: "🇳🇿", tag: "", image: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80" },
    ],
  },
];

