import { getMatches, type Answers } from "@/lib/inspire-me-quiz";

/**
 * Travel preferences — and they ARE the Inspire Me answers.
 *
 * ONE SET OF QUESTIONS, TWO PLACES TO ANSWER THEM. The quiz asks them one at a
 * time in a modal; the profile page shows all five at once under "Travel
 * Preferences". Finishing the quiz while logged in fills the profile in, and
 * editing the profile changes what the quiz would have told you — because
 * they're the same stored answers, not two lists that mean roughly the same
 * thing.
 *
 * WHY NOT OFF SAVED TRIPS. Recommending from saves means the first save
 * decides everything shown afterwards, and it says nothing before the first
 * save. Preferences are the traveller stating what they want: stable, and
 * there from day one. The shortlist and the suggestions are different jobs.
 *
 * Same store shape as saved-trips.ts — localStorage plus an event, for
 * useSyncExternalStore. The server snapshot is empty, so it hydrates cleanly.
 */

const KEY = "trutravels-travel-preferences";
const EVENT = "trutravels-travel-preferences-change";

export function getPreferences(): Answers {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "{}");
    /* An earlier version stored a flat array of labels. Anything that isn't
       the current shape is dropped rather than migrated — it held nine
       made-up categories that no longer map onto a question. */
    return parsed && !Array.isArray(parsed) && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function setPreferences(a: Answers) {
  localStorage.setItem(KEY, JSON.stringify(a));
  window.dispatchEvent(new Event(EVENT));
}

export function getPreferencesSnapshot(): string {
  if (typeof window === "undefined") return "{}";
  return localStorage.getItem(KEY) || "{}";
}

export function getServerSnapshot(): string {
  return "{}";
}

export function subscribePreferences(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Parse a snapshot, tolerating the old array shape. */
export function parsePreferences(snapshot: string): Answers {
  try {
    const parsed = JSON.parse(snapshot);
    return parsed && !Array.isArray(parsed) && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Trips for a recommendations rail, best match first.
 *
 * The quiz's own scorer does the work — one matcher, so the trips the quiz
 * recommends and the trips the dashboard recommends are ranked the same way.
 *
 * `exclude` drops what's already on the shortlist: recommending something
 * someone has already saved is the one thing a recommendation must not do.
 * With nothing answered, `getMatches` still returns its best-rated ordering,
 * so the rail is never empty — the caller can tell the two apart with
 * `hasAnswers`.
 */
export function recommendTrips(prefs: Answers, exclude: string[] = [], count = 8) {
  return getMatches(prefs, count + exclude.length)
    .filter((m) => !exclude.includes(m.trip.id))
    .slice(0, count);
}

/** Human-readable answers, for "matched to: beaches, bucket list". */
export function preferenceLabels(prefs: Answers, steps: { questions: { id: string; options: { value: string; label: string }[] }[] }[]): string[] {
  const out: string[] = [];
  for (const step of steps) {
    for (const q of step.questions) {
      for (const v of prefs[q.id] ?? []) {
        const label = q.options.find((o) => o.value === v)?.label;
        if (label && v !== "any") out.push(label);
      }
    }
  }
  return out;
}
