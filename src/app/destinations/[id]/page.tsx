import { trips } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return trips.map((trip) => ({ id: trip.id }));
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = trips.find((t) => t.id === id);
  if (!trip) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <img
          src={trip.image}
          alt={trip.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 w-full">
          {trip.memberOnly && (
            <span className="inline-block bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">
              Members Only
            </span>
          )}
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">
            {trip.region} &middot; {trip.duration} &middot; From &pound;{trip.price}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{trip.title}</h1>
          <p className="text-gray-300 text-lg max-w-2xl">{trip.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">About This Trip</h2>
              <p className="text-gray-300 leading-relaxed">{trip.description}</p>
            </section>

            {/* Highlights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trip.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                    <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                      <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-200 text-sm">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {trip.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-400 text-black flex items-center justify-center text-sm font-bold">
                      {day.day}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-white font-semibold">{day.title}</h3>
                      <p className="text-gray-400 text-sm">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-3xl font-bold text-white mb-1">
                &pound;{trip.price}
              </p>
              <p className="text-gray-400 text-sm mb-6">per person &middot; {trip.duration}</p>
              <Link
                href="/signup"
                className="block w-full rounded-full bg-amber-400 py-3 text-center text-sm font-semibold text-black hover:bg-amber-300 transition mb-3"
              >
                Book This Trip
              </Link>
              <Link
                href="/destinations"
                className="block w-full rounded-full border border-white/20 py-3 text-center text-sm text-white hover:border-white/40 transition"
              >
                Browse More Trips
              </Link>
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold text-sm mb-3">Trip Includes</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Accommodation throughout</li>
                  <li>Experienced group leader</li>
                  <li>All transport between destinations</li>
                  <li>Activities listed in itinerary</li>
                  <li>Welcome &amp; farewell meals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
