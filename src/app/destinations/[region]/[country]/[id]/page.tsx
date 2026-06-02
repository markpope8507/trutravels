import { trips, getTripExperienceCounts } from "@/lib/data";
import TravelStylePill from "@/components/travel-style-pill";
import TravelStyleBadge from "@/components/travel-style-badge";
import ActivitiesTabs from "@/components/activities-tabs";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/share-buttons";
import FavouriteButton from "@/components/favourite-button";
import TravelStyleInfo from "@/components/travel-style-info";
import CollapsibleItinerary from "@/components/collapsible-itinerary";
import AccommodationCarousel from "@/components/accommodation-carousel";
import MapViewer from "@/components/map-viewer";
import TripBookingWrapper from "@/components/trip-booking-wrapper";
import TrackTripView from "@/components/track-trip-view";
import BackButton from "@/components/back-button";
import HeroBookButton from "@/components/hero-book-button";
import TripReviews from "@/components/trip-reviews";
import TripFaqs from "@/components/trip-faqs";
import RelatedTrips from "@/components/related-trips";

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and");
}

export async function generateStaticParams() {
  return trips.map((trip) => ({
    region: slugify(trip.region),
    country: slugify(trip.destination),
    id: trip.id,
  }));
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ region: string; country: string; id: string }>;
}) {
  const { id } = await params;
  const trip = trips.find((t) => t.id === id);
  if (!trip) notFound();

  const expData = getTripExperienceCounts(trip);
  const placesCount = trip.highlights?.length ?? 0;
  const activitiesCount = expData.total;
  const discountPct = trip.originalPrice
    ? Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)
    : 0;

  return (
    <>
      <TrackTripView tripId={trip.id} />
      <BackButton />
      <TripBookingWrapper
        price={trip.price}
        originalPrice={trip.originalPrice}
        tripTitle={trip.title}
        duration={trip.duration}
        startLocation={trip.startLocation}
        endLocation={trip.endLocation}
        departures={trip.departures || []}
        depositPrice={trip.depositPrice || 150}
      />

      {/* Hero */}
      <section id="trip-hero" className="relative h-screen flex items-end overflow-hidden">
        {trip.video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={trip.image}
            className="absolute inset-0 h-full w-full object-cover scale-105"
          >
            <source src={trip.video} type="video/mp4" />
          </video>
        ) : (
          <img
            src={trip.image}
            alt={trip.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 w-full">
          {/* Top row — travel style badge + member chip */}
          <div className="animate-fade-up flex items-center gap-3 mb-4">
            <TravelStyleBadge style={trip.travelStyle} size="small" />
            {trip.memberOnly && (
              <span className="bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-heading">
                Members Only
              </span>
            )}
          </div>

          {/* Title + Price row */}
          <div className="animate-fade-up delay-100 flex items-end justify-between gap-6 flex-wrap mb-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase font-heading leading-[0.95]">
              {trip.title}
            </h1>
            <div className="flex items-end gap-3 flex-shrink-0 relative">
              {trip.originalPrice && (
                <span className="text-gray-400 text-xl sm:text-2xl line-through">
                  &pound;{trip.originalPrice}
                </span>
              )}
              <span className="text-white text-3xl sm:text-5xl font-black font-heading leading-none">
                &pound;{trip.price}
              </span>
              {discountPct > 0 && (
                <div
                  className="ml-2 h-20 w-20 rounded-full bg-red-600 text-white flex flex-col items-center justify-center font-heading shadow-xl ring-2 ring-red-500/40 flex-shrink-0"
                  style={{ transform: "rotate(-10deg)" }}
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] leading-none mb-0.5 opacity-90">Save</span>
                  <span className="text-2xl font-black leading-none">{discountPct}%</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-0.5">Off</span>
                </div>
              )}
            </div>
          </div>

          {/* Start → End */}
          {trip.startLocation && trip.endLocation && (
            <p className="animate-fade-up delay-200 text-white text-sm sm:text-base mb-3 flex items-center gap-2">
              <svg className="h-4 w-4 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {trip.startLocation} &mdash; {trip.endLocation}
            </p>
          )}

          {/* Rating */}
          {trip.rating && (
            <div className="animate-fade-up delay-200 flex items-center gap-1.5 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-white text-sm font-bold ml-1">{trip.rating}</span>
              <span className="text-gray-400 text-sm">({trip.reviewCount} Reviews)</span>
            </div>
          )}

          {/* Tagline */}
          <p className="animate-fade-up delay-200 text-gray-300 text-base sm:text-lg max-w-2xl mb-4">{trip.tagline}</p>

          {/* Quick facts row */}
          <div className="animate-fade-up delay-300 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-gray-200 text-sm mb-5">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {trip.duration}
            </span>
            {placesCount > 0 && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {placesCount} {placesCount === 1 ? "Place" : "Places"}
              </span>
            )}
            {activitiesCount > 0 && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {activitiesCount} {activitiesCount === 1 ? "Activity" : "Activities"}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="animate-fade-up delay-300 flex items-center gap-3">
            <ShareButtons title={trip.title} />
            <FavouriteButton tripId={trip.id} />
            <HeroBookButton />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-700">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-heading">Scroll</p>
            <div className="w-px h-8 bg-gradient-to-b from-tru-pink to-transparent" />
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-xs text-gray-400">
            <li>
              <Link href="/explore" className="hover:text-white transition-colors">Destinations</Link>
            </li>
            <li><span className="text-gray-600">/</span></li>
            <li>
              <Link href="/explore" className="hover:text-white transition-colors">{trip.region}</Link>
            </li>
            <li><span className="text-gray-600">/</span></li>
            <li>
              <Link href={`/destinations/country/${trip.destination.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-white transition-colors">{trip.destination}</Link>
            </li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <section id="overview" className="mb-12">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{trip.description}</p>

              {/* Travel Style */}
              <TravelStylePill style={trip.travelStyle} />
            </section>

            {/* Inclusions */}
            <section id="inclusions" className="mb-12">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">What&apos;s Included</h2>

              {trip.inclusions ? (
                <div className="space-y-6">
                  {/* Essentials grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {trip.inclusions.accommodation && (
                      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center">
                        <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <p className="text-white text-xs font-semibold mb-1">Accommodation</p>
                        <p className="text-gray-400 text-[11px] leading-tight">{trip.inclusions.accommodation}</p>
                      </div>
                    )}
                    {trip.inclusions.transport && (
                      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center">
                        <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375m11.25 0h3.375c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 00-.879-2.121l-3.496-3.496A2.999 2.999 0 0014.25 8.25H6.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        <p className="text-white text-xs font-semibold mb-1">Transport</p>
                        <p className="text-gray-400 text-[11px] leading-tight">{trip.inclusions.transport}</p>
                      </div>
                    )}
                    {trip.inclusions.meals && (
                      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center">
                        <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                        </svg>
                        <p className="text-white text-xs font-semibold mb-1">Meals</p>
                        <p className="text-gray-400 text-[11px] leading-tight">{trip.inclusions.meals}</p>
                      </div>
                    )}
                    {trip.inclusions.leader && (
                      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center">
                        <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        <p className="text-white text-xs font-semibold mb-1">Tour Leader</p>
                        <p className="text-gray-400 text-[11px] leading-tight">{trip.inclusions.leader}</p>
                      </div>
                    )}
                  </div>

                  {/* Activities with experience tabs */}
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-4">Included Activities</h3>
                    <ActivitiesTabs
                      activities={trip.inclusions.activities}
                      truExclusive={trip.inclusions.truExclusive}
                    />
                  </div>

                  {/* Extras */}
                  {trip.inclusions.extras && trip.inclusions.extras.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {trip.inclusions.extras.map((extra) => (
                        <span key={extra} className="text-gray-400 text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                          + {extra}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Accommodation throughout", "Experienced group leader", "All transport between destinations", "Activities listed in itinerary", "Welcome & farewell meals", "Airport pickup on arrival day"].map((item) => (
                    <div key={item} className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                      <div className="h-8 w-8 rounded-full bg-tru-green/20 flex items-center justify-center flex-shrink-0">
                        <svg className="h-4 w-4 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Itinerary */}
            <section id="itinerary" className="mb-12">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Itinerary</h2>
              <CollapsibleItinerary days={trip.itinerary} />
            </section>

            {/* Map (mobile only) */}
            <div className="lg:hidden">
              <section id="map" className="mb-12">
                <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-4">Map</h2>
                <MapViewer src="https://cdn.trutravels.com/images/thailand-island-hopper-2023.png" alt={`${trip.title} route map`} />
              </section>
            </div>

            {/* Where You'll Stay (mobile only) */}
            <div className="lg:hidden">
              {trip.accommodation && trip.accommodation.length > 0 && (
                <section id="accommodation" className="mb-12">
                  <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Where You&apos;ll Stay</h2>
                  <AccommodationCarousel items={trip.accommodation} />
                </section>
              )}
            </div>

            {/* Reviews */}
            <section id="reviews" className="mb-12">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Reviews</h2>
              <TripReviews />
            </section>

            {/* FAQs */}
            <section id="faqs">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">FAQs</h2>
              <TripFaqs />
            </section>
          </div>

          {/* Sidebar — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Map */}
              <section id="map">
                <h3 className="text-lg font-black text-white uppercase font-heading tracking-wide mb-3">Map</h3>
                <MapViewer src="https://cdn.trutravels.com/images/thailand-island-hopper-2023.png" alt={`${trip.title} route map`} />
              </section>

              {/* Where You'll Stay */}
              {trip.accommodation && trip.accommodation.length > 0 && (
                <section id="accommodation">
                  <h3 className="text-lg font-black text-white uppercase font-heading tracking-wide mb-3">Where You&apos;ll Stay</h3>
                  <AccommodationCarousel items={trip.accommodation} />
                </section>
              )}
            </div>
          </div>

        </div>
      </div>

      <RelatedTrips trips={trips} currentTripId={trip.id} />
    </>
  );
}
