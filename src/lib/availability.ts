/**
 * Single source of truth for departure availability tiers.
 *
 * Both the destination/country page departure rows and the "Check dates"
 * booking modal import from here so the two surfaces can't drift apart.
 * Each surface keeps its own tag *shape* — only the labels, colours and
 * thresholds are shared.
 *
 * Escalation runs calmest -> most urgent: green -> amber -> rose.
 */

export type AvailabilityTierId = "good" | "low" | "almost-full";

/** Departures with this many spots or fewer are "Almost Full". */
export const ALMOST_FULL_MAX_SPOTS = 2;
/** Departures with this many spots or fewer (and above the almost-full cut) are "Less than 5 spots remaining". */
export const LOW_SPOTS_MAX_SPOTS = 4;

export type AvailabilityTier = {
  id: AvailabilityTierId;
  label: string;
  /** Text colour class, for the dot + coloured text treatment. */
  text: string;
  /** Background colour class, for the status dot. */
  dot: string;
};

export const AVAILABILITY_TIERS: Record<AvailabilityTierId, AvailabilityTier> = {
  good: {
    id: "good",
    label: "Good Availability",
    text: "text-tru-green",
    dot: "bg-tru-green",
  },
  low: {
    id: "low",
    label: "Less than 5 spots remaining",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  // red-400 (#ff6467) measures 5.6:1 on the tru-navy card and is ~44% darker
  // than the amber tier. rose-500/red-500 look deeper but only reach ~4.3:1,
  // which fails AA at this 10px size.
  "almost-full": {
    id: "almost-full",
    label: "Almost Full",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

/** Ordered calmest -> most urgent, for legends. */
export const AVAILABILITY_TIER_ORDER: AvailabilityTierId[] = ["good", "low", "almost-full"];

/**
 * Resolve a departure to exactly one availability tier. Tiers are mutually
 * exclusive and evaluated most-urgent-first. When a departure has no spot
 * count, fall back to its coarse status flag.
 */
export function getAvailabilityTier(
  spotsLeft: number | undefined,
  status?: string,
): AvailabilityTier {
  if (spotsLeft !== undefined) {
    if (spotsLeft <= ALMOST_FULL_MAX_SPOTS) return AVAILABILITY_TIERS["almost-full"];
    if (spotsLeft <= LOW_SPOTS_MAX_SPOTS) return AVAILABILITY_TIERS.low;
    return AVAILABILITY_TIERS.good;
  }
  return status === "almost-full" ? AVAILABILITY_TIERS["almost-full"] : AVAILABILITY_TIERS.good;
}

/* ------------------------------------------------------------------------
   Two different reasons a departure can't be booked instantly. They are NOT
   interchangeable, and the UI must never let them read the same way:

   FULL        — every place is gone. Nothing to sell. The traveller joins a
                 waitlist and only hears from us if someone cancels.
   ON REQUEST  — there may well be places, but we can't promise them. Inside
                 ON_REQUEST_DAYS of departure we hand unsold inventory back to
                 our local suppliers, so the seat count we hold is no longer
                 authoritative. Instant book is switched off and the team
                 confirms with the supplier by hand before anything is paid.

   Short version: full = "no space, queue for a cancellation";
                  on request = "maybe space, let us check".
   ------------------------------------------------------------------------ */

/** Inside this many days of departure, instant booking is switched off. */
export const ON_REQUEST_DAYS = 10;

export type DepartureBookingMode = "instant" | "on-request" | "full";

export type DepartureModeCopy = {
  /** Status shown beside the date. */
  label: string;
  /** The call to action on the row and its button. */
  action: string;
  /** One line explaining what the traveller is actually doing. */
  hint: string;
  dot: string;
  text: string;
};

export const DEPARTURE_MODES: Record<Exclude<DepartureBookingMode, "instant">, DepartureModeCopy> = {
  "on-request": {
    label: "On request",
    action: "Check availability",
    hint: "Close to departure, so we confirm places with our local team before you pay.",
    dot: "bg-tru-blue",
    text: "text-tru-blue",
  },
  full: {
    label: "Fully booked",
    action: "Join waitlist",
    hint: "Every place is taken — we'll call you first if a cancellation frees one up.",
    dot: "bg-gray-500",
    text: "text-gray-400",
  },
};

/** Whole days between today and a departure date. Negative once it has left. */
export function daysUntilDeparture(date: string, from: Date = new Date()): number {
  const dep = new Date(date);
  dep.setHours(0, 0, 0, 0);
  const today = new Date(from);
  today.setHours(0, 0, 0, 0);
  return Math.round((dep.getTime() - today.getTime()) / 86_400_000);
}

/**
 * How a departure can be booked. "full" always wins — a sold-out departure
 * close to departure is still sold out, not something we can go and check.
 */
export function getDepartureMode(
  date: string,
  status?: string,
  from: Date = new Date(),
): DepartureBookingMode {
  if (status === "full") return "full";
  const days = daysUntilDeparture(date, from);
  return days >= 0 && days <= ON_REQUEST_DAYS ? "on-request" : "instant";
}
