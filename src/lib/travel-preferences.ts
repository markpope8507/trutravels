import { Trip, trips } from "@/lib/data";

/**
 * Travel preferences — the pills on the profile page, and the thing
 * recommendations are built from.
 *
 * WHY NOT OFF SAVED TRIPS. Recommending from saves means the first save
 * decides everything you're shown afterwards, and it tells you nothing before
 * you've saved anything. Preferences are the traveller saying outright what
 * they want, which is both stable and available from day one — so saves and
 * recommendations stay separate: one is the shortlist you built, the other is
 * what we think you've missed.
 *
 * Same store shape as saved-trips.ts: localStorage plus an event, for
 * useSyncExternalStore. The server snapshot is empty, so it hydrates cleanly.
 */

const KEY = "trutravels-travel-preferences";
const EVENT = "trutravels-travel-preferences-change";

/** The options offered on the profile page, in the order they appear there. */
export const TRAVEL_PREFERENCES = [
  "Beach & Islands",
  "Culture & History",
  "Adventure & Outdoors",
  "Food & Cooking",
  "Nightlife & Parties",
  "Wellness & Yoga",
  "Wildlife & Safari",
  "City Breaks",
  "Off the Beaten Track",
] as const;

export type TravelPreference = (typeof TRAVEL_PREFERENCES)[number];

export function getPreferences(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function togglePreference(pref: string): boolean {
  const current = getPreferences();
  const next = current.includes(pref) ? current.filter((p) => p !== pref) : [...current, pref];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
  return next.includes(pref);
}

export function getPreferencesSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(KEY) || "[]";
}

export function getServerSnapshot(): string {
  return "[]";
}

export function subscribePreferences(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// ------------------------------------------------------------ matching

/**
 * What each preference looks like in a trip's own words.
 *
 * Keyword matching over title, tagline, description, highlights and
 * destination — the fields every trip actually has. Only one trip in lib/data
 * carries `inclusions.activities`, so there's no structured activity data to
 * match on; don't write a rule here that needs a field the trips don't have.
 */
const PREFERENCE_WORDS: Record<string, string[]> = {
  "Beach & Islands": ["beach", "island", "snorkel", "coast", "bay", "lagoon", "sail", "dive", "sand", "hopper"],
  "Culture & History": ["temple", "ancient", "history", "culture", "tradition", "heritage", "palace", "ruins", "angkor"],
  "Adventure & Outdoors": ["trek", "hike", "climb", "surf", "raft", "kayak", "zip", "volcano", "summit", "adventure"],
  "Food & Cooking": ["food", "cook", "street food", "market", "cuisine", "eat", "pad thai", "pho"],
  "Nightlife & Parties": ["party", "full moon", "nightlife", "rooftop", "bar", "buzz", "boat party"],
  "Wellness & Yoga": ["yoga", "wellness", "retreat", "spa", "sunrise", "unwind", "relax"],
  "Wildlife & Safari": ["wildlife", "elephant", "orangutan", "sanctuary", "jungle", "rainforest", "safari", "turtle"],
  "City Breaks": ["city", "bangkok", "hanoi", "saigon", "urban", "seoul", "tokyo", "capital"],
  "Off the Beaten Track": ["hidden", "off the beaten", "remote", "secret", "uncovered", "lesser-known", "local"],
};

function haystack(trip: Trip) {
  return `${trip.title} ${trip.tagline} ${trip.description} ${trip.highlights.join(" ")} ${trip.destination}`.toLowerCase();
}

export type PreferenceMatch = { trip: Trip; matched: string[] };

/**
 * Trips for the recommendations rail, best match first.
 *
 * With no preferences set this returns the highest-rated trips rather than
 * nothing — an empty rail is a worse answer than a sensible default, and the
 * caller can tell the two apart by checking `prefs.length`.
 *
 * `exclude` drops trips already on the shortlist: recommending something
 * someone has already saved is the one thing a recommendation must not do.
 */
export function recommendTrips(prefs: string[], exclude: string[] = [], count = 8): PreferenceMatch[] {
  const pool = trips.filter((t) => !exclude.includes(t.id));

  if (prefs.length === 0) {
    return pool
      .slice()
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      .slice(0, count)
      .map((trip) => ({ trip, matched: [] }));
  }

  return pool
    .map((trip) => {
      const text = haystack(trip);
      const matched = prefs.filter((p) => (PREFERENCE_WORDS[p] ?? []).some((w) => text.includes(w)));
      return { trip, matched };
    })
    .filter((m) => m.matched.length > 0)
    .sort(
      (a, b) =>
        b.matched.length - a.matched.length ||
        (b.trip.rating ?? 0) - (a.trip.rating ?? 0) ||
        (b.trip.reviewCount ?? 0) - (a.trip.reviewCount ?? 0),
    )
    .slice(0, count);
}
