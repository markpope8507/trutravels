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
