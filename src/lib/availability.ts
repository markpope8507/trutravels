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
