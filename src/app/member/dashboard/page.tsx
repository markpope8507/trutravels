"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import MemberGate from "@/components/member-gate";
import { trips, stories } from "@/lib/data";
import TripCard from "@/components/trip-card";
import { mockBookings } from "@/components/booking-history";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export default function DashboardPage() {
  return (
    <MemberGate>
      <DashboardContent />
    </MemberGate>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const [showBenefits, setShowBenefits] = useState(false);
  const recommendedTrips = trips.slice(0, 8);
  const exclusiveStories = stories.filter((s) => s.memberOnly);

  return (
    <div className="pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome + VIP */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/member/profile" className="relative group flex-shrink-0">
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
              Member since {user?.memberSince}
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
        {[
          { label: "My Bookings", value: mockBookings.length.toString(), href: "/member/bookings", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          { label: "Saved Trips", value: "3", href: "/member/saved", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
          { label: "Community", value: "Active", href: "/member/community", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
          { label: "My Profile", value: "Edit", href: "/member/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
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
            <p className="text-white font-semibold group-hover:text-tru-pink transition">{action.label}</p>
          </Link>
        ))}
      </div>

      {/* Messages & Notifications */}
      <NotificationsSection />

      {/* Recommended trips */}
      <section className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-tru-pink text-sm font-semibold uppercase tracking-wider mb-1">For You</p>
            <h2 className="text-2xl font-bold text-white">Recommended Trips</h2>
          </div>
          <Link href="/explore" className="text-sm text-tru-pink hover:text-tru-pink-light transition">
            View all &rarr;
          </Link>
        </div>
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
          {recommendedTrips.map((trip) => (
            <SwiperSlide key={trip.id}>
              <TripCard trip={trip} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Exclusive content */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-tru-pink text-sm font-semibold uppercase tracking-wider mb-1">Members Only</p>
            <h2 className="text-2xl font-bold text-white">Exclusive Content</h2>
          </div>
          <Link href="/member/exclusive" className="text-sm text-tru-pink hover:text-tru-pink-light transition">
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exclusiveStories.map((story) => (
            <article key={story.id} className="flex gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
              <img
                src={story.image}
                alt={story.title}
                className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
              />
              <div>
                <span className="inline-block bg-tru-pink text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                  Exclusive
                </span>
                <h3 className="text-white font-semibold text-sm mb-1">{story.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{story.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Podcast Episodes */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-tru-blue text-sm font-semibold uppercase tracking-wider mb-1">Listen</p>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">Podcast Episodes <svg className="h-6 w-6 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg></h2>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { id: "ep1", title: "Why Thailand is Still the Best First Trip", description: "We break down why Thailand remains the #1 destination for solo travellers and first-timers.", duration: "32 min", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80" },
            { id: "ep2", title: "Full Moon Party: Worth the Hype?", description: "Our honest take on Koh Phangan's legendary party — plus tips to make it unforgettable.", duration: "28 min", image: "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg" },
            { id: "ep3", title: "How to Travel Solo for the First Time", description: "Everything you need to know about your first solo trip — from packing to making friends on day one.", duration: "35 min", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80" },
            { id: "ep4", title: "Bali: Hype vs Reality", description: "Is Bali still worth it in 2026? We give you the real talk.", duration: "29 min", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
          ].map((ep) => (
            <div key={ep.id} className="flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/5 p-4 hover:border-tru-blue/30 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                <img src={ep.image} alt={ep.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold group-hover:text-tru-blue transition-colors truncate">{ep.title}</p>
                <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{ep.description}</p>
              </div>
              <span className="text-gray-500 text-xs flex-shrink-0">{ep.duration}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const mockMessages = [
  {
    id: "m1",
    type: "leader" as const,
    from: "Tommy — Tour Leader",
    avatar: "T",
    avatarColor: "#FF3F99",
    subject: "See you in Bangkok! 🇹🇭",
    body: "Hey! I'm Tommy, your tour leader for the Thailand Island Hopper. Just wanted to introduce myself and say I can't wait to meet you all. Make sure you've got your Digital Arrival Card sorted before you land. Any questions, drop me a message. See you at the hotel on Day 1!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "m2",
    type: "sales" as const,
    from: "TruTravels Team",
    avatar: "TT",
    avatarColor: "#2172D5",
    subject: "We need your flight details ✈️",
    body: "Hi! Your trip is just around the corner and we still need your flight details so we can arrange your airport pickup. Please log in to your account and update your flight info, or reply to this message with your arrival time and flight number.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "m3",
    type: "promo" as const,
    from: "TruTravels",
    avatar: "🎉",
    avatarColor: "#6BD495",
    subject: "Flash Sale: 30% off all 2026 trips!",
    body: "For this week only, we're offering 30% off all remaining 2026 departures. If you've been eyeing up another trip, now's the time. Use code TRU30 at checkout or just book through your dashboard.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "m4",
    type: "leader" as const,
    from: "Milin — Tour Leader",
    avatar: "M",
    avatarColor: "#FF3F99",
    subject: "Packing tips for Thailand 🎒",
    body: "Quick heads up — pack light! You'll be moving between islands and trust me, you don't want a massive suitcase. A backpack is ideal. Bring reef-safe suncream, a reusable water bottle, and something warm for the overnight train. Mosquito spray is a must. See you soon!",
    time: "5 days ago",
    read: true,
  },
];

function NotificationsSection() {
  const [listOpen, setListOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messages, setMessages] = useState(mockMessages);

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setMessages(messages.map((m) => m.id === id ? { ...m, read: true } : m));
  };

  const typeIcon: Record<string, string> = {
    leader: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    sales: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    promo: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  };

  return (
    <section className="mb-12">
      <button
        onClick={() => setListOpen(!listOpen)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-tru-pink text-sm font-semibold uppercase tracking-wider mb-1">Messages</p>
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>
          {unreadCount > 0 && (
            <span className="bg-tru-pink text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${listOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`transition-all duration-300 ease-out overflow-hidden ${listOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
            <button
              onClick={() => handleExpand(msg.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
            >
              {/* Avatar */}
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: msg.avatarColor }}
              >
                {msg.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">{msg.from}</span>
                  {!msg.read && <span className="h-2 w-2 rounded-full bg-tru-pink flex-shrink-0" />}
                </div>
                <p className={`text-sm truncate ${msg.read ? "text-gray-300" : "text-white font-semibold"}`}>
                  {msg.subject}
                </p>
              </div>

              {/* Time + chevron */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-gray-500 text-[10px] hidden sm:block">{msg.time}</span>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${expandedId === msg.id ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded body */}
            <div className={`transition-all duration-300 ease-out overflow-hidden ${expandedId === msg.id ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="px-5 pb-5 pl-19">
                <div className="ml-14">
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{msg.body}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">{msg.time}</span>
                    <svg className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={typeIcon[msg.type]} />
                    </svg>
                    <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                      {msg.type === "leader" ? "Tour Leader" : msg.type === "sales" ? "Support" : "Promotion"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

