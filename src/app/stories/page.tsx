"use client";

import { stories } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function StoriesPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Stories</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">From the Road</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Real stories from real travellers. Inspiration, tips, and the moments that make it all worth it.
        </p>
      </div>

      {/* Stories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => {
          const isLocked = story.memberOnly && !isLoggedIn;

          return (
            <article key={story.id} className="group relative">
              <div className="relative overflow-hidden rounded-xl aspect-[3/2] mb-4">
                <img
                  src={story.image}
                  alt={story.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLocked ? "blur-[2px]" : ""}`}
                />
                {isLocked && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="h-8 w-8 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-white text-sm font-semibold">Members Only</p>
                    </div>
                  </div>
                )}
                {story.memberOnly && (
                  <span className="absolute top-3 right-3 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Exclusive
                  </span>
                )}
              </div>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                {story.category} &middot; {story.author}
              </p>
              <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition mb-2">
                {story.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">{story.excerpt}</p>
              {isLocked && (
                <Link href="/signup" className="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300 transition">
                  Join to unlock &rarr;
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
