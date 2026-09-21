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
 * COUNTRY LINKS ARE DERIVED, NOT WRITTEN DOWN. Each entry used to carry a
 * hand-typed `href`, and four of them disagreed with the country's own data:
 * the list filed Sri Lanka and India under Asia and Morocco and Jordan under
 * "africa-and-middle-east", while the data says "South Asia" and "Africa". The
 * route matches on the data's region, so those four 404'd — in the nav as well
 * as here. `countryHref()` asks the data instead, so a link can't contradict
 * the page it points at.
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
  href?: string;
  nickname: string;
  image: string;
};

export type DestinationRegion = { region: string; countries: DestinationCountry[] };

export const slugifyRegion = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const REGION_PAGE_SLUGS = new Set(regionPages.map((r) => r.slug));

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

export const destinations: { region: string; countries: { name: string; flag: string; tag: string; href?: string; nickname: string; image: string }[] }[] = [
  {
    region: "Asia",
    countries: [
      { name: "Thailand", flag: "🇹🇭", tag: "Top Seller", href: "/destinations/asia/thailand", nickname: "The Land of Smiles", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80" },
      { name: "Indonesia", flag: "🇮🇩", tag: "Popular", href: "/destinations/asia/indonesia", nickname: "Emerald of the Equator", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80" },
      { name: "Philippines", flag: "🇵🇭", tag: "Popular", href: "/destinations/asia/philippines", nickname: "Pearl of the Orient Seas", image: "https://cdn.trutravels.com/images/philippines.jpg" },
      { name: "Vietnam", flag: "🇻🇳", tag: "Top Seller", href: "/destinations/asia/vietnam", nickname: "Land of the Ascending Dragon", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80" },
      { name: "Cambodia", flag: "🇰🇭", tag: "", href: "/destinations/asia/cambodia", nickname: "Kingdom of Wonder", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80" },
      { name: "Sri Lanka", flag: "🇱🇰", tag: "", href: "/destinations/asia/sri-lanka", nickname: "Pearl of the Indian Ocean", image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800&q=80" },
      { name: "India", flag: "🇮🇳", tag: "", href: "/destinations/asia/india", nickname: "Land of a Thousand Cultures", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80" },
      { name: "Japan", flag: "🇯🇵", tag: "", href: "/destinations/asia/japan", nickname: "Land of the Rising Sun", image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&q=80" },
      { name: "China", flag: "🇨🇳", tag: "New", href: "/destinations/asia/china", nickname: "The Middle Kingdom", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80" },
    ],
  },
  {
    region: "Central & South America",
    countries: [
      { name: "Mexico", flag: "🇲🇽", tag: "Popular", href: "/destinations/central-and-south-america/mexico", nickname: "Land of Colour", image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80" },
      { name: "Costa Rica", flag: "🇨🇷", tag: "", href: "/destinations/central-and-south-america/costa-rica", nickname: "Pura Vida", image: "https://cdn.trutravels.com/images/costarica.jpg" },
      { name: "Colombia", flag: "🇨🇴", tag: "", href: "/destinations/central-and-south-america/colombia", nickname: "Land of Magical Realism", image: "https://cdn.trutravels.com/images/colombia-view.jpg" },
      { name: "Peru", flag: "🇵🇪", tag: "", href: "/destinations/central-and-south-america/peru", nickname: "Land of the Incas", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80" },
      { name: "Brazil", flag: "🇧🇷", tag: "", href: "/destinations/central-and-south-america/brazil", nickname: "Land of Carnival", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80" },
      { name: "Belize", flag: "🇧🇿", tag: "", href: "/destinations/central-and-south-america/belize", nickname: "Jewel of the Caribbean", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" },
      { name: "Guatemala", flag: "🇬🇹", tag: "", href: "/destinations/central-and-south-america/guatemala", nickname: "Land of Eternal Spring", image: "https://cdn.trutravels.com/images/mexico-guatemala-belize3.png" },
    ],
  },
  {
    region: "Europe",
    countries: [
      { name: "Greece", flag: "🇬🇷", tag: "Popular", href: "/destinations/europe/greece", nickname: "Cradle of Civilization", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" },
      { name: "Italy", flag: "🇮🇹", tag: "", href: "/destinations/europe/italy", nickname: "Il Bel Paese", image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80" },
      { name: "Albania", flag: "🇦🇱", tag: "New", href: "/destinations/europe/albania", nickname: "Land of the Eagles", image: "https://cdn.trutravels.com/albania/kayaking-1.jpeg" },
      { name: "Europe By Rail", flag: "🚆", tag: "New", nickname: "Borderless Europe", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80" },
    ],
  },
  {
    region: "Africa & Middle East",
    countries: [
      { name: "Morocco", flag: "🇲🇦", tag: "Popular", href: "/destinations/africa-and-middle-east/morocco", nickname: "Gateway to Africa", image: "https://cdn.trutravels.com/morocco-images/morocco-uncovered-marrakech-jardin-group-picture.jpg" },
      { name: "Jordan", flag: "🇯🇴", tag: "", href: "/destinations/africa-and-middle-east/jordan", nickname: "Cradle of Petra", image: "https://cdn.trutravels.com/jordan-tours/jordan-uncovered-desert-petra-walking-tour.jpg" },
    ],
  },
  {
    region: "Oceania",
    countries: [
      { name: "New Zealand", flag: "🇳🇿", tag: "", href: "/destinations/oceania/new-zealand", nickname: "Land of the Long White Cloud", image: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80" },
    ],
  },
];

