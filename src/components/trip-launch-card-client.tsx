"use client";

import TripLaunchCard from "@/components/trip-launch-card";
import type { Trip } from "@/lib/data";

/**
 * TripLaunchCard from the server-rendered trip page.
 *
 * The page is a server component and the card needs a ticking clock, so this
 * is the boundary. It also means the page passes a whole `trip` and the
 * callbacks are events rather than props — TripBookingWrapper owns the modals
 * and sits far away in the tree, so wiring them by prop would mean threading
 * state through the entire page.
 */
export default function TripLaunchCardClient({ trip }: { trip: Trip }) {
  if (!trip.launch) return null;
  return (
    <TripLaunchCard
      launch={trip.launch}
      tripTitle={trip.title}
      onBookNow={() => window.dispatchEvent(new CustomEvent("open-booking"))}
    />
  );
}
