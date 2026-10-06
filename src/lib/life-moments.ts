export type LifeMoment = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  href: string;
  image: string;
};

export const LIFE_MOMENTS: LifeMoment[] = [
  {
    slug: "solo-soul-searcher",
    name: "Solo Soul Searcher",
    emoji: "🧭",
    description: "Coming alone? You won't leave that way.",
    href: "/life-moments/solo-soul-searcher",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    slug: "just-left-uni",
    name: "Just Left Uni",
    emoji: "🎓",
    description: "Three years done. Hat off. Tickets booked.",
    href: "/life-moments/just-left-uni",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
  },
  {
    slug: "work-break-recharge",
    name: "Work Break Recharge",
    emoji: "🔋",
    description: "Two weeks. No emails. Pure reset.",
    href: "/life-moments/work-break-recharge",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
  },
  {
    slug: "gap-year",
    name: "Gap Year",
    emoji: "🌍",
    description: "A whole year on the road. The University of Life.",
    href: "/life-moments/gap-year",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
  },
  {
    slug: "turning-30",
    name: "Turning 30",
    emoji: "🎂",
    description: "Stamps collected. Now collect the stories.",
    href: "/life-moments/turning-30",
    image: "https://cdn.trutravels.com/africa/morocco-images/morocco-uncovered-day-3-road-trip-viewpoint.jpg",
  },
  {
    slug: "looking-to-challenge-myself",
    name: "Looking To Challenge Myself",
    emoji: "🏔️",
    description: "Treks, summits, jungle climbs — be tested.",
    href: "/life-moments/looking-to-challenge-myself",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
];

export const otherLifeMoments = (currentSlug: string) =>
  LIFE_MOMENTS.filter((m) => m.slug !== currentSlug);

/**
 * The same six moments as above, with the longer copy the listings use.
 *
 * KEPT SEPARATE FROM LIFE_MOMENTS ON PURPOSE. That one carries a one-line
 * description and the emoji the nav preview and the "other moments" cards
 * render; these are the fuller blurbs (and in two cases a different emoji)
 * written for a card with room for them. Both /travel-styles and /life-moments
 * read this one, so the listing copy lives in exactly one place.
 */
export type LifeMomentCard = {
  slug: string;
  title: string;
  snippet: string;
  image: string;
  emoji: string;
};

export const LIFE_MOMENT_CARDS: LifeMomentCard[] = [
  {
    slug: "gap-year",
    title: "Gap Year",
    snippet:
      "The University of Life. Long itineraries, multi-country adventures, and the trips that shape who you become.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    emoji: "🌍",
  },
  {
    slug: "just-left-uni",
    title: "Just Left Uni",
    snippet:
      "First taste of freedom. Big trips, full moons, hostel mates and the best year of your life — engineered.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
    emoji: "🎓",
  },
  {
    slug: "looking-to-challenge-myself",
    title: "Looking To Challenge Myself",
    snippet:
      "Treks, summits, jungle climbs and the recovery on the other side. Trips for travellers who want to be tested.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    emoji: "🏔️",
  },
  {
    slug: "solo-soul-searcher",
    title: "Solo Soul Searcher",
    snippet:
      "Trips, stories and voices for travellers heading out on their own. Find your people, find yourself.",
    image: "/images/solo-soul-searcher-hero.jpg",
    emoji: "🚶",
  },
  {
    slug: "turning-30",
    title: "Turning 30",
    snippet:
      "Stamps collected, comfort zones outgrown. Off-the-beaten-path adventures for the next decade.",
    image: "https://cdn.trutravels.com/africa/morocco-images/morocco-uncovered-day-3-road-trip-viewpoint.jpg",
    emoji: "🎂",
  },
  {
    slug: "work-break-recharge",
    title: "Work Break Recharge",
    snippet:
      "Two weeks. Out of office. Full reset. Hand-picked trips under 14 days for the 9-to-5 escape.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    emoji: "🌴",
  },
];
