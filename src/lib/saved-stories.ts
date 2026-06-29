// Lightweight client-side store for "saved reads" (blog stories a member has
// saved to their account). Persists to localStorage and notifies subscribers so
// the dashboard and the save buttons stay in sync. Designed for
// useSyncExternalStore (hydration-safe — server snapshot is an empty list).

const KEY = "trutravels-saved-stories";
const EVENT = "trutravels-saved-stories-change";

export function getSavedStoryIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleSavedStory(id: string): boolean {
  const current = getSavedStoryIds();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
  return next.includes(id);
}

// Raw JSON string snapshot — stable by value so useSyncExternalStore is happy.
export function getSavedSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(KEY) || "[]";
}

export function getServerSnapshot(): string {
  return "[]";
}

export function subscribeSavedStories(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
