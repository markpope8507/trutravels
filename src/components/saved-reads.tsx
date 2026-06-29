"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { stories, type Story } from "@/lib/data";
import {
  subscribeSavedStories,
  getSavedSnapshot,
  getServerSnapshot,
} from "@/lib/saved-stories";

export default function SavedReads() {
  const raw = useSyncExternalStore(subscribeSavedStories, getSavedSnapshot, getServerSnapshot);
  const ids: string[] = JSON.parse(raw);
  const saved = ids
    .map((id) => stories.find((s) => s.id === id))
    .filter((s): s is Story => Boolean(s));

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-tru-pink text-sm font-semibold uppercase tracking-wider mb-1">Your Reads</p>
          <h2 className="text-2xl font-bold text-white">Saved Reads</h2>
        </div>
        <Link href="/stories" className="text-sm text-tru-pink hover:text-tru-pink-light transition">
          Browse stories &rarr;
        </Link>
      </div>

      {saved.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {saved.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="group flex gap-4 bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition"
            >
              <img
                src={story.image}
                alt={story.title}
                className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading mb-1">
                  {story.category} &middot; {story.readTime} min read
                </p>
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-tru-pink transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2">{story.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <p className="text-gray-400 text-sm mb-3">You haven&apos;t saved any reads yet.</p>
          <Link
            href="/stories"
            className="text-tru-pink hover:text-tru-pink-light text-sm font-semibold uppercase tracking-wider transition"
          >
            Explore stories
          </Link>
        </div>
      )}
    </section>
  );
}
