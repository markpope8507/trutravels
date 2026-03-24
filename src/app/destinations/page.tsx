import { trips, regions } from "@/lib/data";
import TripCard from "@/components/trip-card";

export const metadata = {
  title: "Destinations — TruTravels",
  description: "Browse group travel adventures across Southeast Asia, Central America, Africa and beyond.",
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Destinations</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Where Will You Go?</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Handcrafted group adventures for 18-35s. Every trip is designed to take you deeper, not just further.
        </p>
      </div>

      {/* Region tags */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {regions.map((region) => (
          <span
            key={region.name}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-300 hover:border-amber-400 hover:text-amber-400 transition cursor-pointer"
          >
            {region.name} ({region.count})
          </span>
        ))}
      </div>

      {/* Trip grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
