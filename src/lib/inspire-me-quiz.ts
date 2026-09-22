import { Trip, trips } from "@/lib/data";

/**
 * The Inspire Me quiz — questions, and the matching behind them.
 *
 * Kept out of the component so the questions can be read and changed without
 * scrolling past a modal, and so the scoring can be reasoned about on its own.
 *
 * FOUR STEPS, FIVE QUESTIONS. Step one asks two things — where and how long —
 * because they're the pair everyone already has an answer to, and splitting
 * them made the quiz feel longer than it is. The old version asked six
 * questions including budget, which every trip answered the same way.
 *
 * SCORING, NOT FILTERING. Every answer adds points; nothing excludes a trip.
 * A filter on sparse data returns an empty page, and an empty page is the
 * worst possible answer to "inspire me". The weights below say how much each
 * answer is worth, and `matchReasons` reports which ones actually fired so
 * the results can show their working.
 *
 * WHAT THE DATA ACTUALLY SUPPORTS. Only one trip in lib/data carries
 * `inclusions.activities`, so there's no activity-density signal to read for
 * pace — Q4 leans on `travelStyle` plus wording instead. Don't add a rule
 * here that needs a field the trips don't have; it scores zero for everyone
 * and reads as broken.
 */

export type Option = {
  label: string;
  value: string;
  /** Picking this clears the others — "Surprise me" and friends. */
  wildcard?: boolean;
};

export type Question = {
  id: string;
  question: string;
  hint: string;
  type: "single" | "multi";
  /** Cap for a multi — Q2 is "pick up to 2". */
  max?: number;
  options: Option[];
};

export type Step = { id: string; questions: Question[] };

export const STEPS: Step[] = [
  {
    id: "where-when",
    questions: [
      {
        id: "regions",
        question: "Where do you want to wake up?",
        hint: "Pick as many as you like.",
        type: "multi",
        options: [
          { label: "Asia", value: "asia" },
          { label: "Central & South America", value: "latam" },
          { label: "Africa", value: "africa" },
          { label: "Oceania", value: "oceania" },
          { label: "Europe", value: "europe" },
          { label: "Surprise me", value: "any", wildcard: true },
        ],
      },
      {
        id: "duration",
        question: "How long have you got?",
        hint: "Pick one.",
        type: "single",
        options: [
          { label: "Under 10 days", value: "short" },
          { label: "10–14 days", value: "mid" },
          { label: "2 weeks +", value: "long" },
        ],
      },
    ],
  },
  {
    id: "alive",
    questions: [
      {
        id: "alive",
        question: "Where do you feel most alive?",
        hint: "Pick up to 2.",
        type: "multi",
        max: 2,
        options: [
          { label: "In a buzzing city", value: "city" },
          { label: "On the beach or the islands", value: "beach" },
          { label: "Up in the mountains", value: "mountains" },
          { label: "Surrounded by nature and wildlife", value: "nature" },
          { label: "Wherever the trip takes me", value: "any", wildcard: true },
        ],
      },
    ],
  },
  {
    id: "experience",
    questions: [
      {
        id: "experience",
        question: "What do you want to experience?",
        hint: "Pick as many as you like.",
        type: "multi",
        /* These five ARE the Tru Experience Types, in the same order they
           appear on the tour pages — so an answer here and a tag on a trip
           page mean the same thing. Keep them aligned. */
        options: [
          { label: "Stepping out of my comfort zone and pushing my limits", value: "rise-up" },
          { label: "Disconnecting from the outside world", value: "unplugged" },
          { label: "Connecting with locals and different cultures", value: "local-lens" },
          { label: "Ticking off bucket-list locations", value: "bucket-list" },
          { label: "Experiencing something completely unique", value: "tru-ly-unique" },
        ],
      },
    ],
  },
  {
    id: "vibe",
    questions: [
      {
        id: "vibe",
        question: "What's your vibe?",
        hint: "Pick one.",
        type: "single",
        options: [
          { label: "I'm up for anything!", value: "any", wildcard: true },
          { label: "Full-on, I want to see and do it all", value: "full" },
          { label: "A good mix of go and chill", value: "mix" },
          { label: "Relaxed, slow mornings and downtime", value: "slow" },
        ],
      },
    ],
  },
];

export type Answers = Record<string, string[]>;

// ------------------------------------------------------------------ matching

/** Quiz region -> the `region` values in lib/data that belong to it. */
const REGION_MAP: Record<string, string[]> = {
  asia: ["Asia", "South Asia"],
  latam: ["Central & South America"],
  africa: ["Africa", "Africa & Middle East"],
  oceania: ["Oceania"],
  europe: ["Europe"],
};

/** Regions we offer but don't run trips in yet — worth saying out loud. */
export function regionsWithoutTrips(picked: string[]): string[] {
  const labels: Record<string, string> = {
    asia: "Asia",
    latam: "Central & South America",
    africa: "Africa",
    oceania: "Oceania",
    europe: "Europe",
  };
  return picked
    .filter((r) => r !== "any")
    .filter((r) => !trips.some((t) => (REGION_MAP[r] ?? []).includes(t.region)))
    .map((r) => labels[r]);
}

const ALIVE_WORDS: Record<string, string[]> = {
  city: ["city", "bangkok", "hanoi", "saigon", "urban", "rooftop", "nightlife", "market", "street"],
  beach: ["beach", "island", "snorkel", "coast", "bay", "lagoon", "sail", "dive", "sand"],
  mountains: ["mountain", "trek", "hike", "summit", "peak", "volcano", "highland", "andes", "himalaya"],
  nature: ["jungle", "wildlife", "rainforest", "national park", "elephant", "orangutan", "sanctuary", "lake", "waterfall"],
};

const EXPERIENCE_WORDS: Record<string, string[]> = {
  "rise-up": ["trek", "climb", "summit", "challenge", "hike", "raft", "surf", "zip", "kayak"],
  unplugged: ["sunrise", "sunset", "peaceful", "remote", "hammock", "stargaz", "slow", "escape", "quiet"],
  "local-lens": ["local", "homestay", "family", "cook", "village", "tradition", "artisan", "culture", "temple"],
  "bucket-list": ["iconic", "famous", "legendary", "must-see", "angkor", "ha long", "machu", "taj", "wonder"],
  "tru-ly-unique": ["exclusive", "truexclusive", "private", "secret", "hidden", "only", "unique", "full moon"],
};

const VIBE_WORDS: Record<string, string[]> = {
  full: ["ultimate", "everything", "packed", "action", "non-stop", "every highlight", "epic"],
  mix: ["balance", "mix", "culture", "adventure", "best of"],
  slow: ["relax", "chill", "slow", "unwind", "beach", "hammock", "downtime", "laid-back"],
};

/** Travel styles that suit each pace, since activity counts aren't in the data. */
const VIBE_STYLES: Record<string, string[]> = {
  full: ["multi_country", "backpacker"],
  mix: ["classic"],
  slow: ["flashpacker", "classic"],
};

function haystack(trip: Trip) {
  return `${trip.title} ${trip.tagline} ${trip.description} ${trip.highlights.join(" ")} ${trip.destination}`.toLowerCase();
}

function hits(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
}

export type Match = { trip: Trip; score: number; reasons: string[] };

/**
 * Score one trip. Weights are deliberate: where you go and how long for are
 * the hard constraints people actually plan around, so they're worth the most;
 * the feel questions nudge the order within that.
 */
function score(trip: Trip, a: Answers): Match {
  const text = haystack(trip);
  const days = parseInt(trip.duration, 10) || 0;
  let total = 0;
  const reasons: string[] = [];

  // Q1a — region
  const regions = a.regions ?? [];
  if (regions.includes("any") || regions.length === 0) {
    total += 10;
  } else if (regions.some((r) => (REGION_MAP[r] ?? []).includes(trip.region))) {
    total += 40;
    reasons.push(trip.region);
  }

  // Q1b — duration. The buckets overlap at 14 days on purpose: a fortnight is
  // both "10–14" and "2 weeks", and scoring lets a trip sit in both.
  const duration = a.duration?.[0];
  if (duration === "short" && days > 0 && days < 10) { total += 25; reasons.push(trip.duration); }
  if (duration === "mid" && days >= 10 && days <= 14) { total += 25; reasons.push(trip.duration); }
  if (duration === "long" && days >= 14) { total += 25; reasons.push(trip.duration); }

  // Q2 — where you feel most alive
  const alive = a.alive ?? [];
  if (alive.includes("any") || alive.length === 0) {
    total += 5;
  } else {
    alive.forEach((k) => {
      if (hits(text, ALIVE_WORDS[k] ?? [])) {
        total += 15;
        reasons.push({ city: "City life", beach: "Beaches & islands", mountains: "Mountains", nature: "Nature & wildlife" }[k] as string);
      }
    });
  }

  // Q3 — the Tru Experience Types
  (a.experience ?? []).forEach((k) => {
    if (hits(text, EXPERIENCE_WORDS[k] ?? [])) {
      total += 12;
      reasons.push({
        "rise-up": "Rise Up",
        unplugged: "Unplugged",
        "local-lens": "Local Lens",
        "bucket-list": "Bucket List",
        "tru-ly-unique": "Tru-ly Unique",
      }[k] as string);
    }
  });

  // Q4 — pace
  const vibe = a.vibe?.[0];
  if (vibe && vibe !== "any") {
    if ((VIBE_STYLES[vibe] ?? []).includes(trip.travelStyle)) total += 10;
    if (hits(text, VIBE_WORDS[vibe] ?? [])) total += 8;
  }

  return { trip, score: total, reasons: [...new Set(reasons)] };
}

/**
 * Top matches, best first.
 *
 * Sparse data means a lot of ties, and a tie broken by array order puts the
 * same three trips in front of everyone. Rating then review count then price
 * breaks them by something a traveller would actually care about.
 */
export function getMatches(a: Answers, count = 3): Match[] {
  return trips
    .map((t) => score(t, a))
    .sort(
      (x, y) =>
        y.score - x.score ||
        (y.trip.rating ?? 0) - (x.trip.rating ?? 0) ||
        (y.trip.reviewCount ?? 0) - (x.trip.reviewCount ?? 0) ||
        x.trip.price - y.trip.price,
    )
    .slice(0, count);
}
