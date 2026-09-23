"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import { ACCOUNT, sectionCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useAuth } from "@/lib/auth-context";
import AccountGate from "@/components/account-gate";
import { trips, type Trip } from "@/lib/data";
import TripCard from "@/components/trip-card";
import { mockBookings } from "@/components/booking-history";
import SavedReads from "@/components/saved-reads";
import SuggestedReads from "@/components/suggested-reads";
import SectionHeading from "@/components/section-heading";
import PageStickers from "@/components/page-stickers";
import {
  subscribeSavedTrips,
  getSavedTripsSnapshot,
  getServerSnapshot,
  toggleSavedTrip,
} from "@/lib/saved-trips";
import {
  recommendTrips,
  subscribePreferences,
  getPreferencesSnapshot,
  getServerSnapshot as getPrefsServerSnapshot,
} from "@/lib/travel-preferences";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export default function DashboardPage() {
  return (
    <AccountGate>
      <Breadcrumbs noHero crumbs={sectionCrumbs(ACCOUNT, "Dashboard")} />
      <DashboardContent />
    </AccountGate>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const [showBenefits, setShowBenefits] = useState(false);

  // Saved trips come from the same store the heart buttons write to, so the
  // shortlist below updates the moment a trip is saved or removed.
  const savedRaw = useSyncExternalStore(subscribeSavedTrips, getSavedTripsSnapshot, getServerSnapshot);
  const savedIds: string[] = JSON.parse(savedRaw);
  const savedTrips = savedIds
    .map((id) => trips.find((t) => t.id === id))
    .filter((t): t is Trip => Boolean(t));

  // Don't recommend what's already on the shortlist right above it.
  /* Recommendations come from the traveller's stated preferences, not from
     what they've saved. Saves are the shortlist they built; this is what they
     might have missed — two different jobs, so they stay separate. */
  const prefsRaw = useSyncExternalStore(subscribePreferences, getPreferencesSnapshot, getPrefsServerSnapshot);
  const prefs: string[] = JSON.parse(prefsRaw);
  const recommended = recommendTrips(prefs, savedIds, 8);

  return (
    <div className="relative">
      <PageStickers />
      <div className="relative pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome + VIP */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/my-account/profile" className="relative group flex-shrink-0">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-tru-pink text-white flex items-center justify-center text-xl sm:text-2xl font-bold border-2 border-tru-pink/50">
              {user?.avatar}
            </div>
            <div className="absolute inset-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight mb-0.5">
              Hey, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-gray-400 text-sm">
              Joined Tru Community in {user?.memberSince}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex sm:hidden items-center gap-1.5 text-white text-xs hover:text-tru-pink transition self-center"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log Out
          </button>
        </div>

        {/* VIP Status + Travel Credit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* VIP Card */}
          <div className="lg:col-span-2 rounded-[10px] border border-white/10 bg-white/5 p-5">
            <p className="text-white font-black text-sm uppercase font-heading tracking-wider mb-4">VIP Status</p>
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-5 w-5 text-tru-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-tru-green text-sm font-bold font-heading uppercase tracking-wider">Game-Changer (30+ days)</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed mb-4">
              You&apos;ve travelled 42 days with us so far! Only 8 more days until you reach <span className="text-white font-semibold">Icon</span> status and unlock 10% off all full-priced tours.
            </p>

            {/* Progress bar — 4 equal segments: 0→30, 30→50, 50→100, 100→365 */}
            {(() => {
              const days = 42;
              const tiers = [
                { start: 0, end: 30, label: "Game-Changer" },
                { start: 30, end: 50, label: "Icon" },
                { start: 50, end: 100, label: "Legend" },
                { start: 100, end: 365, label: "MVP" },
              ];
              // Each segment is 25% of the bar. Find which segment we're in and how far through it.
              let fillPercent = 0;
              for (let i = 0; i < tiers.length; i++) {
                const t = tiers[i];
                if (days >= t.end) {
                  fillPercent += 25;
                } else if (days > t.start) {
                  fillPercent += 25 * ((days - t.start) / (t.end - t.start));
                  break;
                } else {
                  break;
                }
              }
              return (
                <div className="mb-2">
                  <div className="relative h-4 text-[10px] text-gray-500 mb-1">
                    <span className="absolute -translate-x-1/2" style={{ left: "25%" }}>Game-Changer</span>
                    <span className="absolute -translate-x-1/2" style={{ left: "50%" }}>Icon</span>
                    <span className="absolute -translate-x-1/2" style={{ left: "75%" }}>Legend</span>
                    <span className="absolute right-0">MVP</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-tru-green to-tru-blue transition-all duration-1000" style={{ width: `${fillPercent}%` }} />
                    <div className="absolute top-0 h-full w-px bg-white/30" style={{ left: "25%" }} />
                    <div className="absolute top-0 h-full w-px bg-white/30" style={{ left: "50%" }} />
                    <div className="absolute top-0 h-full w-px bg-white/30" style={{ left: "75%" }} />
                  </div>
                  <div className="relative h-4 text-[10px] text-gray-600 mt-1">
                    <span className="absolute left-0">0</span>
                    <span className="absolute -translate-x-1/2" style={{ left: "25%" }}>30</span>
                    <span className="absolute -translate-x-1/2" style={{ left: "50%" }}>50</span>
                    <span className="absolute -translate-x-1/2" style={{ left: "75%" }}>100</span>
                    <span className="absolute right-0">365 days</span>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-tru-green text-2xl font-black font-heading">42</span>
                <span className="text-white text-xs">Days travelled</span>
              </div>
              <button
                onClick={() => setShowBenefits(!showBenefits)}
                className="flex items-center gap-1 text-tru-green text-[10px] font-semibold uppercase tracking-wider hover:text-tru-green-light transition"
              >
                View My Benefits
                <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${showBenefits ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            {/* Collapsible benefits */}
            <div className={`transition-all duration-300 ease-out overflow-hidden ${showBenefits ? "max-h-[200px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "5% off full-priced tours" },
                  { icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z", label: "\u00a350 travel credit/year" },
                  { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", label: "Early access to sales" },
                  { icon: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0", label: "Quarterly prize draw" },
                ].map((benefit) => (
                  <div key={benefit.label} className="rounded-[10px] bg-tru-green/5 border border-tru-green/15 p-3 flex flex-col items-center text-center gap-2">
                    <svg className="h-5 w-5 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={benefit.icon} /></svg>
                    <p className="text-tru-green text-[10px] sm:text-xs font-semibold leading-tight">{benefit.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/about/vip-programme" className="flex items-center justify-center gap-1.5 text-tru-pink text-[10px] font-semibold uppercase tracking-wider hover:text-tru-pink-light transition mt-3">
                Learn more about our VIP programme
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

          {/* Travel Credit */}
          <div className="rounded-[10px] border border-white/10 bg-white/5 p-3 sm:p-5 flex sm:flex-col items-center sm:items-stretch gap-3 sm:gap-0">
            <div className="hidden sm:block">
              <p className="text-white font-black text-sm uppercase font-heading tracking-wider mb-4">Travel Credit</p>
            </div>
            <div className="sm:flex-1 flex sm:flex-col items-center sm:justify-center gap-2 sm:gap-0">
              <p className="text-tru-green text-2xl sm:text-4xl font-black font-heading sm:mb-1">&pound;50</p>
              <div className="sm:text-center">
                <p className="text-white text-xs">Available credit<span className="text-gray-500 ml-2 sm:hidden">Expires 31 Dec 2026</span></p>
                <p className="text-gray-500 text-xs hidden sm:block mt-1">Expires 31 Dec 2026</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-12">
        {[
          { label: "My Bookings", value: mockBookings.length.toString(), href: "/my-account/bookings", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          { label: "My Profile", value: "Edit", href: "/my-account/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-tru-pink/30 transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-tru-pink/10 flex items-center justify-center">
                <svg className="h-5 w-5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
              </div>
              <span className="text-xs font-semibold text-tru-pink bg-tru-pink/10 px-2 py-0.5 rounded-full">
                {action.value}
              </span>
            </div>
            <p className="text-white font-black text-sm uppercase font-heading tracking-wider group-hover:text-tru-pink transition">{action.label}</p>
          </Link>
        ))}
      </div>


      {/* Saved trips — promoted out of the quick-action tiles so the trips
          themselves are on the dashboard, not just a count behind a link. */}
      <section className="relative mb-12">
        <div className="relative">
        {/* No "Manage saved" link: the heart on each card removes it right
            here, so sending someone to another page to do the same thing was
            a round trip for nothing. The full grid still lives at
            /my-account/saved, reached from the heart in the nav. */}
        <SectionHeading eyebrow="Your Shortlist" title="Saved Trips" />
        {savedTrips.length > 0 ? (
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView={1.2}
            freeMode
            navigation
            breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}
            className="experience-carousel"
          >
            {savedTrips.map((trip) => (
              <SwiperSlide key={trip.id}>
                <TripCard trip={trip} onRemove={toggleSavedTrip} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
            <p className="text-gray-400 text-sm mb-3">You haven&apos;t saved any trips yet.</p>
            <Link
              href="/explore"
              className="text-tru-pink hover:text-tru-pink-light text-sm font-semibold uppercase tracking-wider transition"
            >
              Explore trips
            </Link>
          </div>
        )}
        </div>
      </section>

      {/* Recommended trips */}
      <section className="relative mb-12">
        <div className="relative">
        <SectionHeading
          eyebrow={prefs.length > 0 ? "Based On Your Preferences" : "For You"}
          title="Recommended Trips"
          href="/explore"
        />
        {prefs.length === 0 && (
          <p className="-mt-2 mb-5 text-sm text-gray-400">
            <Link href="/my-account/profile" className="text-tru-pink underline transition hover:text-tru-pink-light">
              Tell us how you like to travel
            </Link>{" "}
            and these become yours. Until then, here&rsquo;s what everyone else rates.
          </p>
        )}
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.2}
          freeMode
          navigation
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
          }}
          className="experience-carousel"
        >
          {recommended.map(({ trip }) => (
            <SwiperSlide key={trip.id}>
              <TripCard trip={trip} />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </section>

      {/* Reads we think you'd like, then the ones you've kept */}
      <SuggestedReads />
      <SavedReads />

      {/* Phase 2 — Messages & Notifications, Exclusive Content and Podcast
          Episodes all sat here. The full layout is kept verbatim at
          src/app/_phase2/dashboard-full/page.tsx. */}

      </div>
    </div>
  );
}
