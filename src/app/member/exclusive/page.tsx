"use client";

import MemberGate from "@/components/member-gate";
import { stories, trips } from "@/lib/data";

export default function ExclusivePage() {
  return (
    <MemberGate>
      <ExclusiveContent />
    </MemberGate>
  );
}

function ExclusiveContent() {
  const exclusiveStories = stories.filter((s) => s.memberOnly);
  const exclusiveTrips = trips.filter((t) => t.memberOnly);

  return (
    <div className="pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-14">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Members Only</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Exclusive Content</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Stories, guides, and trips available only to TruTravels members. This is the good stuff.
        </p>
      </div>

      {/* Exclusive trips */}
      {exclusiveTrips.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Member-Only Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exclusiveTrips.map((trip) => (
              <div key={trip.id} className="relative overflow-hidden rounded-2xl aspect-[2/1]">
                <img src={trip.image} alt={trip.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-2">
                    Members Only
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-1">{trip.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{trip.tagline}</p>
                  <p className="text-amber-400 font-semibold">{trip.duration} &middot; From &pound;{trip.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Exclusive stories */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Member-Only Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exclusiveStories.map((story) => (
            <article key={story.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
              <img src={story.image} alt={story.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <span className="inline-block bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                  Exclusive
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">{story.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{story.excerpt}</p>
                <p className="text-xs text-gray-500">By {story.author} &middot; {story.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
