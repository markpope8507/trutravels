import Link from "next/link";
import { trips, regions } from "@/lib/data";
import AllTripsBrowser from "@/components/all-trips-browser";

export const metadata = {
  title: "All Trips — TruTravels",
  description:
    "Browse every TruTravels group adventure. Filter by destination, travel style, duration and price to find your perfect trip.",
};

export default function AllTripsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center overflow-hidden">
        <img
          src="/images/explore-hero.jpg"
          alt="TruTravels — browse all trips"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <nav className="flex items-center justify-end gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] font-heading text-gray-300 mb-5">
              <Link href="/explore" className="hover:text-tru-pink transition">Explore</Link>
              <span className="text-gray-500">/</span>
              <span className="text-tru-pink">All Trips</span>
            </nav>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              All<br /><span className="text-tru-pink">Trips</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              Every adventure in one place. Filter by destination, travel style, duration or budget and find the one that fits.
            </p>
          </div>
        </div>
      </section>

      <AllTripsBrowser trips={trips} regions={regions} />
    </>
  );
}
