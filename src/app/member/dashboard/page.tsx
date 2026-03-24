"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import MemberGate from "@/components/member-gate";
import { trips, stories } from "@/lib/data";
import TripCard from "@/components/trip-card";

export default function DashboardPage() {
  return (
    <MemberGate>
      <DashboardContent />
    </MemberGate>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const recommendedTrips = trips.slice(0, 3);
  const exclusiveStories = stories.filter((s) => s.memberOnly);

  return (
    <div className="pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-gray-400">
          Your personalised travel hub. Member since {user?.memberSince}.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Saved Trips", value: "3", href: "/destinations", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
          { label: "Exclusive Content", value: "New", href: "/member/exclusive", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
          { label: "Community", value: "Active", href: "/member/community", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
          { label: "My Profile", value: "Edit", href: "/member/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-amber-400/30 transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-amber-400/10 flex items-center justify-center">
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
              </div>
              <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                {action.value}
              </span>
            </div>
            <p className="text-white font-semibold group-hover:text-amber-400 transition">{action.label}</p>
          </Link>
        ))}
      </div>

      {/* Recommended trips */}
      <section className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-1">For You</p>
            <h2 className="text-2xl font-bold text-white">Recommended Trips</h2>
          </div>
          <Link href="/destinations" className="text-sm text-amber-400 hover:text-amber-300 transition">
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      {/* Exclusive content */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-1">Members Only</p>
            <h2 className="text-2xl font-bold text-white">Exclusive Content</h2>
          </div>
          <Link href="/member/exclusive" className="text-sm text-amber-400 hover:text-amber-300 transition">
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
                <span className="inline-block bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                  Exclusive
                </span>
                <h3 className="text-white font-semibold text-sm mb-1">{story.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{story.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
