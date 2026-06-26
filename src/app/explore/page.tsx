import { Suspense } from "react";
import { trips } from "@/lib/data";
import TripsBrowser from "@/components/trips-browser";

export const metadata = {
  title: "Explore Trips — TruTravels",
  description: "Browse group travel adventures across Southeast Asia, Central America, Africa and beyond.",
};

export default function DestinationsPage() {
  return (
    <Suspense>
      <TripsBrowser trips={trips} />
    </Suspense>
  );
}
