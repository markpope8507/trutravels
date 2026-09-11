// Client-side store for "saved trips" (the heart/favourite on a trip card).
// Same shape as saved-stories.ts, over the existing "trutravels-favourites"
// key that the save buttons and /my-account/saved already write, so nothing
// needs migrating. Designed for useSyncExternalStore — hydration-safe, since
// the server snapshot is an empty list.

const KEY = "trutravels-favourites";
const EVENT = "trutravels-favourites-change";

export function getSavedTripIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleSavedTrip(id: string): boolean {
  const current = getSavedTripIds();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
  return next.includes(id);
}

// Raw JSON string snapshot — stable by value so useSyncExternalStore is happy.
export function getSavedTripsSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(KEY) || "[]";
}

export function getServerSnapshot(): string {
  return "[]";
}

export function subscribeSavedTrips(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
