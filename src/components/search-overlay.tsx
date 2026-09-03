"use client";

import { useMemo, useState, useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { trips, stories, countries, regionPages, travelStyleConfig } from "@/lib/data";
import { tripUrl, countryUrl } from "@/lib/utils";

// Viewport-relative rect of the element that opened the search, so the dropdown
// can align to it: the nav pill (full nav width) or the homepage search bar.
export type SearchAnchor = { top: number; left: number; width: number; bottom: number };

type SearchCategory = "Destination" | "Trip" | "Blog" | "Travel Style" | "Deal" | "Page" | "Life Moment";

type SearchItem = {
  title: string;
  href: string;
  category: SearchCategory;
  subtitle?: string;
  keywords?: string;
};

const TRAVEL_STYLE_SLUGS: Record<string, string> = {
  classic: "classic",
  backpacker: "backpacker",
  flashpacker: "flashpacker",
  multi_country: "multi-country",
  limited_edition: "limited-edition",
};

// Well-known cities / islands / landmarks that belong to each country, keyed by
// country id. Attached as search keywords so a place like "Bali" or "Machu Picchu"
// surfaces its country in the Destinations section alongside its trips and stories.
const COUNTRY_ALIASES: Record<string, string> = {
  thailand: "bangkok phuket krabi koh samui koh phangan koh tao chiang mai khao sok phi phi full moon",
  indonesia: "bali lombok gili komodo ubud java sumatra jakarta nusa",
  philippines: "el nido palawan cebu boracay siargao manila coron",
  vietnam: "hanoi ho chi minh saigon hoi an ha long halong sapa hue",
  cambodia: "angkor wat siem reap phnom penh",
  "sri-lanka": "colombo ella kandy sigiriya galle",
  india: "goa delhi mumbai jaipur kerala rajasthan taj mahal himalaya",
  japan: "tokyo kyoto osaka mount fuji",
  china: "beijing shanghai great wall xian",
  mexico: "yucatan cancun tulum oaxaca mexico city day of the dead",
  "costa-rica": "san jose la fortuna arenal manuel antonio monteverde",
  colombia: "bogota medellin cartagena",
  peru: "lima cusco machu picchu inca",
  brazil: "rio de janeiro sao paulo amazon",
  belize: "caye caulker san pedro",
  guatemala: "antigua lake atitlan tikal",
  greece: "athens santorini mykonos crete corfu",
  italy: "rome venice florence amalfi sicily",
  albania: "tirana ksamil saranda",
  morocco: "marrakech fes chefchaouen sahara casablanca",
  jordan: "petra wadi rum amman dead sea",
  "new-zealand": "auckland queenstown rotorua south island",
};

const searchIndex: SearchItem[] = [
  { title: "Home", href: "/", category: "Page" },
  { title: "All Trips", href: "/explore", category: "Page" },
  { title: "About Us", href: "/about", category: "Page" },
  { title: "Stories & Blog", href: "/stories", category: "Page" },
  { title: "Log In", href: "/login", category: "Page" },
  { title: "Sign Up", href: "/signup", category: "Page" },
  { title: "Member Dashboard", href: "/member/dashboard", category: "Page" },

  ...trips.map((t) => ({
    title: t.title,
    href: tripUrl(t),
    category: "Trip" as const,
    subtitle: `${t.destination} · ${t.duration} · From £${t.price}`,
    keywords: t.destination,
  })),

  ...regionPages.map((r) => ({
    title: r.name,
    href: `/destinations/${r.slug}`,
    category: "Destination" as const,
    subtitle: r.tagline,
  })),

  ...countries.map((c) => ({
    title: c.name,
    href: countryUrl(c),
    category: "Destination" as const,
    subtitle: c.tagline,
    keywords: COUNTRY_ALIASES[c.id],
  })),

  ...(Object.keys(travelStyleConfig) as Array<keyof typeof travelStyleConfig>).map((key) => ({
    title: `${travelStyleConfig[key].label} Trips`,
    href: `/travel-styles/${TRAVEL_STYLE_SLUGS[key]}`,
    category: "Travel Style" as const,
  })),

  ...stories.map((s) => ({
    title: s.title,
    href: `/stories/${s.id}`,
    category: "Blog" as const,
    subtitle: `By ${s.author} · ${s.category}`,
    keywords: s.destinations.join(" "),
  })),

  {
    title: "Solo Soul Searcher",
    href: "/life-moments/solo-soul-searcher",
    category: "Life Moment",
    subtitle: "Coming alone? You won't leave that way.",
    keywords: "tours for solo travellers solo travel",
  },
  {
    title: "Just Left Uni",
    href: "/life-moments/just-left-uni",
    category: "Life Moment",
    subtitle: "Three years done. Hat off. Tickets booked.",
    keywords: "post uni graduate",
  },
  {
    title: "Gap Year",
    href: "/life-moments/gap-year",
    category: "Life Moment",
    subtitle: "A whole year on the road.",
    keywords: "gap year",
  },

  { title: "Flash Sale", href: "/deals", category: "Deal", subtitle: "Save up to 30% on 2026 departures" },
  { title: "Last-Minute Deals", href: "/deals", category: "Deal", subtitle: "Trips leaving within 30 days" },
];

const SEARCH_EXAMPLES = [
  "Thailand",
  "Bali Experience",
  "Tours for solo travellers",
  "Best Places to Travel in August",
] as const;

type GroupConfig = {
  category: SearchCategory;
  heading: string;
  cap: number;
  viewAllLabel: (count: number) => string;
  viewAllHref: (query: string, items: SearchItem[]) => string | null;
};

const GROUP_ORDER: GroupConfig[] = [
  {
    category: "Destination",
    heading: "Destination",
    cap: 4,
    viewAllLabel: (n) => `View all ${n} destinations`,
    viewAllHref: () => "/explore",
  },
  {
    category: "Trip",
    heading: "Trips",
    cap: 4,
    viewAllLabel: (n) => `View all ${n} trips`,
    viewAllHref: (query, items) => {
      const match = countries.find((c) => {
        const name = c.name.toLowerCase();
        const q = query.toLowerCase();
        return name === q || name.includes(q) || q.includes(name);
      });
      if (match && items.some((item) => item.subtitle?.toLowerCase().includes(match.name.toLowerCase()))) {
        return `/explore/all-trips?country=${encodeURIComponent(match.name)}`;
      }
      return "/explore";
    },
  },
  {
    category: "Blog",
    heading: "Stories",
    cap: 3,
    viewAllLabel: (n) => `View all ${n} stories`,
    viewAllHref: () => "/stories",
  },
  {
    category: "Life Moment",
    heading: "Life Moments",
    cap: 3,
    viewAllLabel: (n) => `View all ${n} life moments`,
    viewAllHref: () => null,
  },
  {
    category: "Travel Style",
    heading: "Travel Style",
    cap: 3,
    viewAllLabel: (n) => `View all ${n} styles`,
    viewAllHref: () => "/travel-styles",
  },
  {
    category: "Deal",
    heading: "Deals",
    cap: 2,
    viewAllLabel: () => "View all deals",
    viewAllHref: () => "/deals",
  },
  {
    category: "Page",
    heading: "Pages",
    cap: 3,
    viewAllLabel: (n) => `View all ${n} pages`,
    viewAllHref: () => null,
  },
];

// Generic filler + travel words that shouldn't narrow a search down to a single
// literal match. Stripping these lets an example like "Bali Experience" resolve to
// its core entity ("bali") and surface every linked destination, tour and story.
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "of", "for", "in", "on", "to", "at", "with", "by",
  "from", "your", "you", "my", "our", "is", "it", "this", "that", "are", "how",
  "best", "top", "places", "place", "things", "thing", "do", "see", "visit", "need",
  "most", "guide", "travel", "travelling", "traveller", "travellers", "trip", "trips",
  "tour", "tours", "experience", "experiences", "holiday", "holidays",
  "adventure", "adventures",
]);

// Split a query into its meaningful search tokens. If every word is filler
// (e.g. "best places to travel"), fall back to the raw words so we still match.
function tokenize(query: string): string[] {
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const significant = words.filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  return significant.length > 0 ? significant : words;
}

// An item matches when its searchable text contains ANY of the query tokens.
// OR-matching (not AND) is what links a topic across sections: the "Bali"
// destination and a Bali story share only the token "bali", not the full phrase.
function matchesQuery(item: SearchItem, tokens: string[]) {
  const haystack = `${item.title} ${item.subtitle ?? ""} ${item.keywords ?? ""}`.toLowerCase();
  return tokens.some((token) => haystack.includes(token));
}

// Compute the grouped, capped search results for a query. Shared by the nav
// dropdown and the homepage inline search so both behave identically.
export function useSearchGroups(query: string) {
  const trimmed = query.trim();
  const q = trimmed.toLowerCase();
  return useMemo(() => {
    if (!q) return [];
    const tokens = tokenize(trimmed);
    const hits = searchIndex.filter((item) => matchesQuery(item, tokens));
    return GROUP_ORDER.flatMap((config) => {
      const items = hits.filter((item) => item.category === config.category);
      if (items.length === 0) return [];
      return [{
        ...config,
        items: items.slice(0, config.cap),
        total: items.length,
        // "See all" link shown on the heading row; null for groups with no landing page.
        seeAllHref: config.viewAllHref(trimmed, items),
      }];
    });
  }, [q, trimmed]);
}

// The scrollable results body: grouped sections when there's a query, the
// example chips when it's empty. Rendered inside a SearchDropdownCard.
export function SearchResults({
  query,
  onNavigate,
  onExample,
}: {
  query: string;
  onNavigate: () => void;
  onExample: (example: string) => void;
}) {
  const groups = useSearchGroups(query);
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return (
      <div className="px-4 py-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink font-heading">Try searching for</p>
        <div className="flex flex-wrap gap-2">
          {SEARCH_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onExample(example)}
              className="max-w-full text-left text-xs leading-snug text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:text-white hover:border-white/20 transition"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[min(70vh,32rem)] overflow-y-auto">
      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.category} className="border-t border-white/10 first:border-t-0">
            <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink font-heading">
                {group.heading}
              </p>
              {group.seeAllHref && (
                <Link
                  href={group.seeAllHref}
                  onClick={onNavigate}
                  className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-tru-pink hover:text-tru-pink-light font-heading transition-colors"
                >
                  See all
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
            <div>
              {group.items.map((item, i) => (
                <Link
                  key={`${item.href}-${i}`}
                  href={item.href}
                  onClick={onNavigate}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-gray-500 text-xs truncate">{item.subtitle}</p>
                    )}
                  </div>
                  <svg className="h-4 w-4 text-gray-600 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="px-4 py-6 text-center">
          <p className="text-gray-500 text-sm">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

// The floating dropdown card: anchored beneath its trigger, matching its width,
// with the sticker-montage backdrop and dropdown dismiss behaviour (outside
// click, Escape, page scroll/resize). Keeps the page live — no dimming backdrop.
export function SearchDropdownCard({
  isOpen,
  onClose,
  anchor,
  keepOpenRef,
  attached = false,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  anchor?: SearchAnchor | null;
  keepOpenRef?: RefObject<HTMLElement | null>;
  // When true, the panel butts flush against its anchor (no gap, square top,
  // no top border) so it reads as one piece with the search bar above it.
  attached?: boolean;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (keepOpenRef?.current?.contains(target)) return;
      onClose();
    };
    const onDismiss = () => onClose();
    // Defer binding so the click that opened the dropdown doesn't immediately close it.
    const id = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("scroll", onDismiss, { passive: true });
      window.addEventListener("resize", onDismiss);
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onDismiss);
      window.removeEventListener("resize", onDismiss);
    };
  }, [isOpen, onClose, keepOpenRef]);

  if (!isOpen) return null;

  const gap = attached ? 0 : 8;
  const panelStyle: CSSProperties = anchor
    ? { top: anchor.bottom + gap, left: anchor.left, width: anchor.width }
    : { top: "4.75rem", left: "50%", width: "min(92vw, 42rem)", transform: "translateX(-50%)" };
  const shapeClass = attached
    ? "rounded-b-[16px] border border-t-0"
    : "rounded-[16px] border";

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className={`fixed z-[60] origin-top animate-fade-in ${shapeClass} border-white/10 bg-tru-navy/95 backdrop-blur-md shadow-2xl shadow-black/50 overflow-hidden`}
    >
      {/* Background watermark icons — a couple of large stickers for depth, like the nav menus */}
      <img src="/bg-assets/tru-logo.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-10 -right-8 w-56 rotate-[10deg] opacity-[0.06] brightness-0 invert" />
      <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-12 -left-8 w-56 -rotate-[8deg] opacity-[0.06] brightness-0 invert" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Nav-bar search: an icon opens a dropdown that contains its own input.
export default function SearchOverlay({
  isOpen,
  onClose,
  anchor,
}: {
  isOpen: boolean;
  onClose: () => void;
  anchor?: SearchAnchor | null;
}) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setQuery("");
  }

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  return (
    <SearchDropdownCard isOpen={isOpen} onClose={onClose} anchor={anchor}>
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search trips, destinations, blog..."
          className="w-full bg-transparent border-b border-white/10 pl-12 pr-12 py-4 text-white text-sm placeholder:text-gray-500 focus:outline-none transition"
        />
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          aria-label="Close search"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <SearchResults
        query={query}
        onNavigate={onClose}
        onExample={(example) => { setQuery(example); inputRef.current?.focus(); }}
      />
    </SearchDropdownCard>
  );
}
