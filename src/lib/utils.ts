import { Trip } from "@/lib/data";

export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and");
}

export function tripUrl(trip: Trip) {
  return `/destinations/${slugify(trip.region)}/${slugify(trip.destination)}/${trip.id}`;
}
