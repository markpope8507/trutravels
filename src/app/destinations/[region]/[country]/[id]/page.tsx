import { trips, getTripExperienceCounts, videoDiaries, MEMBER_CONTENT_ENABLED } from "@/lib/data";
import TravelStylePill from "@/components/travel-style-pill";
import ActivitiesTabs from "@/components/activities-tabs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { slugify } from "@/lib/utils";
import ShareButtons from "@/components/share-buttons";
import FavouriteButton from "@/components/favourite-button";
import TravelStyleInfo from "@/components/travel-style-info";
import CollapsibleItinerary from "@/components/collapsible-itinerary";
import AccommodationCarousel from "@/components/accommodation-carousel";
import MapViewer from "@/components/map-viewer";
import TripBookingWrapper from "@/components/trip-booking-wrapper";
import TrackTripView from "@/components/track-trip-view";
import TripPricingCard from "@/components/trip-pricing-card";
import TripLaunchCardClient from "@/components/trip-launch-card-client";
import TripReviews from "@/components/trip-reviews";
import TripFaqs from "@/components/trip-faqs";
import RelatedTrips from "@/components/related-trips";
import TripVideoPlayer from "@/components/trip-video-player";
import Breadcrumbs from "@/components/breadcrumbs";
import { tripCrumbs } from "@/lib/breadcrumbs";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";
import BackToTop from "@/components/back-to-top";
import FomoToast from "@/components/fomo-toast";

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

  const customerDiaries = videoDiaries.filter((v) =>
    ["Traveller", "Creator", "Influencer", "Community"].includes(v.tag),
  );
  const destinationDiaries = customerDiaries.filter((v) =>
    v.location.toLowerCase().includes(trip.destination.toLowerCase()),
  );
  const diariesToShow = destinationDiaries.length >= 3 ? destinationDiaries : customerDiaries;

  /* A trip that hasn't run has no travellers, so it has no clips "from the
     road" and no reviews. Both sections fall back to other trips' content
     when a trip has none of its own, which reads as borrowed on a normal page
     and as untrue on a pre-launch one. */
  const preLaunch = trip.launch ? new Date(trip.launch.onSale).getTime() > Date.now() : false;

  /* The Map section hardcoded the Thailand Island Hopper route image on every
     trip page — a South Africa trip showing a map of Bangkok. It uses the
     trip's own map now, and the section is dropped when there isn't one.
     THE FALLBACK IS DELIBERATE: the 36 trips that have always shown that
     image keep it, because removing a map from every page is a bigger change
     than this fix; give a trip a `mapImage` and it stops being wrong. */
  const mapImage =
    trip.mapImage ?? (preLaunch ? undefined : "https://cdn.trutravels.com/images/thailand-island-hopper-2023.png");

  return (
    <>
      <TrackTripView tripId={trip.id} />
      <TripBookingWrapper
        price={trip.price}
        originalPrice={trip.originalPrice}
        tripId={trip.id}
        tripTitle={trip.title}
        tripImage={trip.image}
        duration={trip.duration}
        startLocation={trip.startLocation}
        endLocation={trip.endLocation}
        departures={trip.departures || []}
        depositPrice={trip.depositPrice || 200}
        launch={trip.launch}
      />

      {/* Hero */}
      <section id="trip-hero" className="relative h-screen flex items-end overflow-hidden">
        <img
          src={trip.image}
          alt={trip.title}
          className="absolute inset-0 h-full w-full object-cover object-[40%_50%] sm:object-center"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 w-full">
          {MEMBER_CONTENT_ENABLED && trip.memberOnly && (
            <span className="animate-fade-up inline-block bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-heading mb-4">
              Members Only
            </span>
          )}

          {/* Title */}
          <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase font-heading leading-[0.95] mb-3">
            {trip.title}
          </h1>

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

          {/* Share / Favourite — booking and price live in the snapshot section below */}
          <div className="animate-fade-up delay-300 flex items-center gap-2">
            <ShareButtons title={trip.title} />
            <FavouriteButton tripId={trip.id} />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-700">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-heading">Scroll</p>
            <div className="w-px h-8 bg-gradient-to-b from-tru-pink to-transparent" />
          </div>
        </div>
      </section>

      {/* Breadcrumbs — Home / Destinations / Asia / Thailand / <trip>.
          Was: Destinations / Asia / Thailand, with no Home, no trip name, and
          both Destinations and the continent pointing at /explore. */}
      <Breadcrumbs crumbs={tripCrumbs(trip.region, trip.destination, trip.title)} />

      {/* Full-width container with background watermarks bleeding to viewport edges */}
      <div className="relative overflow-hidden">
        <img src="/bg-assets/tru-logo.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-10 sm:-right-16 lg:-right-20 top-[2%] w-[180px] sm:w-[280px] lg:w-[380px] opacity-[0.07] brightness-0 invert" />
        <img src="/bg-assets/peru-bird.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[12%] w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-[22%] w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[33%] w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-[44%] w-[220px] sm:w-[340px] lg:w-[480px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-12 sm:-left-20 lg:-left-24 top-[55%] w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.07] brightness-0 invert" />
        <img src="/bg-assets/komodo-dragon.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-14 sm:-right-24 lg:-right-32 top-[64%] w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/eyes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-12 sm:-left-20 lg:-left-24 top-[74%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-[84%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-12 sm:-left-20 lg:-left-24 top-[92%] w-[200px] sm:w-[320px] lg:w-[420px] opacity-[0.06] brightness-0 invert" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 lg:pt-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Mobile-only pricing card — sits above the Overview on mobile so the
                sticky nav kicks in immediately once the user scrolls past it. */}
            <section id="mobile-pricing" className="lg:hidden mb-12">
              {/* A trip that hasn't gone on sale gets a countdown and a
                  notify-me CTA instead of the price-and-check-dates box. */}
              {trip.launch ? (
                <TripLaunchCardClient trip={trip} />
              ) : (
                <TripPricingCard
                  price={trip.price}
                  originalPrice={trip.originalPrice}
                  duration={trip.duration}
                  departures={trip.departures}
                  depositPrice={trip.depositPrice ?? 200}
                />
              )}
            </section>

            {/* Overview */}
            <section id="overview" className="mb-12">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{trip.description}</p>

              {/* Trip video — opens full screen on click */}
              {trip.video && (
                <div className="mb-6">
                  <TripVideoPlayer video={trip.video} poster={trip.image} title={trip.title} />
                </div>
              )}

              {/* Travel Style */}
              <TravelStylePill style={trip.travelStyle} />
            </section>

            {/* Inclusions */}
            <section id="inclusions" className="mb-12">
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">What You Get</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading leading-[1.05] mb-6">
                Included <span className="text-tru-pink">As Standard</span>
              </h2>

              {trip.inclusions ? (
                <div className="space-y-6">
                  {/* Essentials grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-fr gap-3">
                    {trip.inclusions.accommodation && (
                      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center h-full">
                        <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <p className="text-white text-sm font-semibold mb-1">Accommodation</p>
                        <p className="text-gray-400 text-[11px] leading-tight">{trip.inclusions.accommodation}</p>
                      </div>
                    )}
                    {trip.inclusions.transport && (
                      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center h-full">
                        <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375m11.25 0h3.375c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 00-.879-2.121l-3.496-3.496A2.999 2.999 0 0014.25 8.25H6.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        <p className="text-white text-sm font-semibold mb-1">Transport</p>
                        <p className="text-gray-400 text-[11px] leading-tight">{trip.inclusions.transport}</p>
                      </div>
                    )}
                    {trip.inclusions.meals && (
                      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center h-full">
                        <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3a2 2 0 004 0V3" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 3c-2 0-3 2-3 4.5s1 4.5 3 4.5" />
                        </svg>
                        <p className="text-white text-sm font-semibold mb-1">Meals</p>
                        <p className="text-gray-400 text-[11px] leading-tight">{trip.inclusions.meals}</p>
                      </div>
                    )}
                    {trip.inclusions.leader && (
                      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center h-full">
                        <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        <p className="text-white text-sm font-semibold mb-1">Local Legend</p>
                        <p className="text-gray-400 text-[11px] leading-tight">{trip.inclusions.leader}</p>
                      </div>
                    )}
                  </div>

                  {/* Activities with experience tabs */}
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-4">Included Activities</h3>
                    <ActivitiesTabs activities={trip.inclusions.activities} />
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
                  {["Accommodation throughout", "A Local Legend who knows the way (not just a guide)", "All transport between destinations", "Activities listed in itinerary", "Welcome & farewell meals", "Airport pickup on arrival day"].map((item) => (
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

            {/* Real customer moments — UGC video carousel */}
            {!preLaunch && diariesToShow.length > 0 && (
              <section id="real-moments" className="mb-12">
                <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
                  Diaries · From The Road
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-3 leading-[0.95]">
                  Real Moments <span className="text-tru-pink">From Tour</span>
                </h2>
                <p className="text-gray-400 mt-3 max-w-lg text-sm sm:text-base mb-6">
                  Clips from past travellers — the activities, the people, the bits that make the trip. Tap to play.
                </p>
                <div className="-mr-4 sm:-mr-6 lg:mr-0 lg:w-[152%] overflow-hidden">
                  <VideoDiariesCarousel diaries={diariesToShow} />
                </div>
              </section>
            )}

            {/* Itinerary */}
            <section id="itinerary" className="mb-12">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Itinerary</h2>
              <CollapsibleItinerary days={trip.itinerary} activities={trip.inclusions?.activities} />
            </section>

            {/* Map (mobile only) */}
            {mapImage && (
              <div className="lg:hidden">
                <section id="map" className="mb-12">
                  <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-4">Map</h2>
                  <MapViewer src={mapImage} alt={`${trip.title} route map`} />
                </section>
              </div>
            )}

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
            {!preLaunch && (
              <section id="reviews" className="mb-12">
                <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Reviews</h2>
                <TripReviews />
              </section>
            )}

            {/* FAQs */}
            <section id="faqs">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">FAQs</h2>
              <TripFaqs />
            </section>
          </div>

          {/* Sidebar — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Pricing card */}
              <section id="booking">
                {trip.launch ? (
                  <TripLaunchCardClient trip={trip} />
                ) : (
                  <TripPricingCard
                    price={trip.price}
                    originalPrice={trip.originalPrice}
                    duration={trip.duration}
                    departures={trip.departures}
                    depositPrice={trip.depositPrice ?? 200}
                  />
                )}
              </section>

              {/* Map */}
              {mapImage && (
                <section id="map">
                  <h3 className="text-lg font-black text-white uppercase font-heading tracking-wide mb-3">Map</h3>
                  <MapViewer src={mapImage} alt={`${trip.title} route map`} />
                </section>
              )}

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
      </div>

      <RelatedTrips trips={trips} currentTripId={trip.id} />

      <BackToTop />
      <FomoToast />
    </>
  );
}

