import { trips, countries } from "@/lib/data";
import { tripUrl, countryUrl } from "@/lib/utils";

// Turn the page the visitor is on into a short note for Tru.D, so "what dates
// run in November?" on a trip page is answered for that trip without asking.

const LIFE_MOMENTS: Record<string, string> = {
  "gap-year": "Gap Year",
  "just-left-uni": "Just Left Uni",
  "looking-to-challenge-myself": "Looking To Challenge Myself",
  "solo-soul-searcher": "Solo Soul Searcher",
  "turning-30": "Turning 30",
  "work-break-recharge": "Work Break Recharge",
};

/** Sanitise a client-supplied path: same-origin, no query, bounded length. */
export function cleanPath(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const p = input.split(/[?#]/)[0].trim();
  if (!p.startsWith("/") || p.startsWith("//") || p.length > 200) return null;
  return p.replace(/\/+$/, "") || "/";
}

export function describePage(path: string | null): string | null {
  if (!path) return null;

  const trip = trips.find((t) => t.departures && tripUrl(t) === path);
  if (trip) {
    const bits = [
      `The visitor is on the trip page for "${trip.title}" (${trip.duration}, ${trip.destination}` +
        (trip.startLocation && trip.endLocation ? `, ${trip.startLocation} to ${trip.endLocation}` : "") +
        `), at ${path}.`,
      `Treat questions about dates, prices, availability, inclusions, meals or the itinerary as being about this trip unless they name another one. For dates or prices call get_departures with trip "${trip.title}".`,
    ];
    return bits.join(" ");
  }

  const country = countries.find((c) => countryUrl(c) === path);
  if (country) {
    return `The visitor is on the ${country.name} destination page (${path}). Assume questions are about ${country.name} trips unless they say otherwise; if they ask about dates or prices, ask which ${country.name} trip (or list them) before calling get_departures.`;
  }

  const lm = path.match(/^\/life-moments\/([a-z0-9-]+)$/);
  if (lm && LIFE_MOMENTS[lm[1]]) {
    return `The visitor is browsing the "${LIFE_MOMENTS[lm[1]]}" life-moment page (${path}).`;
  }

  const named: Record<string, string> = {
    "/": "the homepage",
    "/support": "the Help & Support page",
    "/deals": "the Deals page",
    "/explore": "the Explore (all trips) page",
    "/travel-styles": "the Travel Styles page",
    "/the-tru-way": "The Tru Way page (what's included)",
    "/about/vip-programme": "the VIP Programme page",
    "/host-a-trip": "the Host A Trip page",
    "/affiliates": "the Affiliates page",
    "/travel-insurance": "the Travel Insurance page",
    "/visas-and-passports": "the Visas & Passports page",
    "/terms-conditions": "the Booking Conditions page",
    "/my-account/dashboard": "their account dashboard",
    "/my-account/bookings": "their bookings page (they may have an existing booking; hand off booking-specific questions)",
  };
  if (named[path]) return `The visitor is on ${named[path]} (${path}).`;

  return `The visitor is on ${path}.`;
}
