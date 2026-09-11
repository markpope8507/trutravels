/**
 * Trip add-ons — the single source of truth for what can be added to a trip,
 * what it costs, and the rules around it.
 *
 * Two surfaces sell these and they must offer the same things on the same
 * terms: the checkout (src/app/checkout/checkout-script.ts, mirrored to
 * converted/checkout.html) and the account area's Add-Ons tab on an existing
 * booking (components/booking-addons.tsx).
 *
 * The checkout script has to stay self-contained — it's mirrored verbatim into
 * a static HTML page with no module system — so it carries its own copy of
 * these values. THIS FILE IS THE SPEC: change a price or a rule here and mirror
 * it into checkout-script.ts (and converted/checkout.html) in the same commit.
 */

/** "My own room" supplement, per trip. */
export const ROOM_UPGRADE = 450;

export type RoomType = {
  id: "twin" | "double" | "single" | "dorm";
  name: string;
  /** Per night. Twin share and dorm are per person; double and single are per room. */
  price: number;
  /** How many of the party one unit covers — this is what caps the panel. */
  sleeps: number;
  rate: string;
  note: string;
  /** Only offered when 2+ people are travelling. */
  min2?: boolean;
};

export const ROOM_TYPES: RoomType[] = [
  { id: "twin", name: "Twin share", price: 45, sleeps: 1, rate: "pp / night", note: "A bed in a shared twin room" },
  { id: "double", name: "Double", price: 90, sleeps: 2, rate: "/ night", note: "One double bed for two", min2: true },
  { id: "single", name: "Single", price: 75, sleeps: 1, rate: "/ night", note: "A room to yourself" },
  { id: "dorm", name: "Dorm bed", price: 25, sleeps: 1, rate: "pp / night", note: "A bed in a shared dorm" },
];

export const NIGHTS_RANGE: [number, number] = [1, 14];

/** Cheapest way in, for "from £x" labels. */
export const ROOM_FROM = Math.min(...ROOM_TYPES.map((r) => r.price));

export type Rooming = { nights: number } & Record<RoomType["id"], number>;

export type AddonId = "prenight" | "postnight" | "arrival" | "departure";

export type Addon = {
  id: AddonId;
  category: "Accommodation" | "Transfers";
  name: string;
  /** Flat price for transfers; hotels are priced from the rooming table instead. */
  price: number;
  /** Hotels expand into a nights + rooming panel; transfers are a simple toggle. */
  configurable: boolean;
  /** Where it sits relative to the trip — drives the date shown. */
  on: "start" | "end";
  /** The caveat behind the (i) on transfers. */
  info?: (locations: { start: string; end: string }) => string;
};

export const ADDONS: Addon[] = [
  { id: "prenight", category: "Accommodation", name: "Pre-Night Hotel", price: 45, configurable: true, on: "start" },
  { id: "postnight", category: "Accommodation", name: "Post-Night Hotel", price: 45, configurable: true, on: "end" },
  {
    id: "arrival",
    category: "Transfers",
    name: "Arrival Transfer",
    price: 60,
    configurable: false,
    on: "start",
    info: ({ start }) =>
      `If you are arriving before your tour start date you can still be picked up from ${start} Airport, however you will need to book a pre-night(s) accommodation with us so we have somewhere to take you. If you are arriving on your tour start date, please skip this.`,
  },
  {
    id: "departure",
    category: "Transfers",
    name: "Departure Transfer",
    price: 60,
    configurable: false,
    on: "end",
    info: ({ end }) =>
      `If you are leaving after your tour end date you can still be transferred to ${end} Airport, however you will need to book a post-night(s) accommodation with us. If you are leaving on your tour end date, please skip this.`,
  },
];

export const isHotelAddon = (id: AddonId) => id === "prenight" || id === "postnight";

/** Travellers placed in a bed so far. */
export function roomsPlaced(r: Rooming): number {
  return ROOM_TYPES.reduce((n, t) => n + (r[t.id] || 0) * t.sleeps, 0);
}

export function roomingCost(r: Rooming | null | undefined): number {
  if (!r) return 0;
  return r.nights * ROOM_TYPES.reduce((s, t) => s + (r[t.id] || 0) * t.price, 0);
}

/** Opening position when a hotel add-on is switched on: everyone in twin share. */
export function defaultRooming(pax: number): Rooming {
  return { nights: 1, twin: Math.max(1, pax), double: 0, single: 0, dorm: 0 };
}

/**
 * Keep rooming inside the party size. If travellers are removed after rooms
 * were picked, hand back the last-listed types first so the cheapest survives.
 */
export function clampRooming(r: Rooming, pax: number): Rooming {
  const next: Rooming = { ...r };
  next.nights = Math.max(NIGHTS_RANGE[0], Math.min(NIGHTS_RANGE[1], next.nights || 1));
  ROOM_TYPES.forEach((t) => { next[t.id] = Math.max(0, next[t.id] || 0); });
  for (let i = ROOM_TYPES.length - 1; i >= 0; i--) {
    while (next[ROOM_TYPES[i].id] > 0 && roomsPlaced(next) > pax) next[ROOM_TYPES[i].id]--;
  }
  return next;
}

/** Can another unit of this room type still be placed? */
export function canAddRoom(r: Rooming, type: RoomType, pax: number): boolean {
  return roomsPlaced(r) + type.sleeps <= pax;
}

export const formatMoney = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

/** Shift a date by whole days and format it the way the booking pages do. */
export function shiftDate(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
