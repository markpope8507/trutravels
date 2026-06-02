"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  stories,
  videoDiaries,
  storyTopics,
  storyLifeMoments,
  storyTypes,
  type Story,
  type StoryType,
} from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";

const allDestinations = Array.from(
  new Set(stories.flatMap((s) => s.destinations)),
).sort();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function StoriesPage() {
  const { isLoggedIn } = useAuth();
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<StoryType | "all">("all");
  const [destination, setDestination] = useState("");
  const [topic, setTopic] = useState("");
  const [lifeMoment, setLifeMoment] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const sorted = useMemo(
    () =>
      [...stories].sort((a, b) =>
        sort === "latest"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [sort],
  );

  const featured = sorted[0];
  const rest = sorted.slice(1);

  const filtered = useMemo(
    () =>
      rest.filter((s) => {
        if (activeType !== "all" && s.type !== activeType) return false;
        if (destination && !s.destinations.includes(destination)) return false;
        if (topic && !s.topics.includes(topic)) return false;
        if (lifeMoment && !s.lifeMoments.includes(lifeMoment)) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          if (
            !s.title.toLowerCase().includes(q) &&
            !s.excerpt.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      }),
    [rest, activeType, destination, topic, lifeMoment, query],
  );

  const hasActiveFilters =
    activeType !== "all" || destination || topic || lifeMoment || query.trim();

  const clearAll = () => {
    setActiveType("all");
    setDestination("");
    setTopic("");
    setLifeMoment("");
    setQuery("");
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
          alt="Travellers chasing horizons"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Stories
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Where Stories<br />Come To Life
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Every journey writes a story worth telling. The
              connections with local people, the shared laughs, the unexpected
              moments — stories that shape who you are.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* COMMUNITY CAROUSEL */}
      <section className="py-24 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Video Diaries</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                Moments From Our<br className="hidden sm:block" /> <span className="text-tru-pink">Community</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg">
                Diaries from travellers, guides, partners, and the Planeterra projects we support. Real moments, on the road, in their own words.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden">
          <VideoDiariesCarousel diaries={videoDiaries} />
        </div>
      </section>

      {/* FEATURED STORY */}
      {featured && (
        <section className="py-20 lg:py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
              Featured
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight mb-10">
              The Latest Story
            </h2>
            <FeaturedCard story={featured} isLoggedIn={isLoggedIn} />
          </div>
        </section>
      )}

      {/* BROWSE */}
      <section className="py-20 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
              Browse
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight mb-4 leading-[0.95]">
              Find Your Next Read
            </h2>
            <p className="text-gray-400 max-w-xl">
              Search by destination, topic, or where you are in life. There&apos;s
              a story here for every chapter of the journey.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stories, guides, destinations…"
              className="w-full bg-white/5 border border-white/10 rounded-[10px] pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <FilterSelect
              label="Destination"
              value={destination}
              onChange={setDestination}
              options={allDestinations}
            />
            <FilterSelect
              label="Topic"
              value={topic}
              onChange={setTopic}
              options={storyTopics as unknown as string[]}
            />
            <FilterSelect
              label="Life Moment"
              value={lifeMoment}
              onChange={setLifeMoment}
              options={storyLifeMoments as unknown as string[]}
            />
          </div>

          {/* Type tabs + sort + clear */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={() => setActiveType("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-heading transition ${
                activeType === "all"
                  ? "bg-tru-pink text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              All
            </button>
            {storyTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setActiveType(t.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-heading transition ${
                  activeType === t.value
                    ? "bg-tru-pink text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-tru-pink uppercase tracking-wider font-semibold transition"
                >
                  Clear all
                </button>
              )}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
                className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-xs text-gray-300 font-semibold uppercase tracking-wider focus:outline-none focus:border-tru-pink/50 cursor-pointer"
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-6">
            Showing {filtered.length} of {rest.length}{" "}
            {filtered.length === 1 ? "story" : "stories"}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[10px] border border-dashed border-white/10 py-20 text-center">
              <p className="text-gray-400 mb-4">
                No stories match those filters yet.
              </p>
              <button
                onClick={clearAll}
                className="text-tru-pink hover:text-tru-pink-light text-sm font-semibold uppercase tracking-wider transition"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-white/5 border border-white/10 rounded-[10px] px-4 py-3 text-sm focus:outline-none focus:border-tru-pink/50 transition cursor-pointer ${
          value ? "text-white" : "text-gray-500"
        }`}
      >
        <option value="">{label}: Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

function FeaturedCard({
  story,
  isLoggedIn,
}: {
  story: Story;
  isLoggedIn: boolean;
}) {
  const isLocked = !!story.memberOnly && !isLoggedIn;
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className="lg:col-span-7 relative overflow-hidden rounded-[10px] aspect-[16/10]">
        <img
          src={story.image}
          alt={story.title}
          className={`absolute inset-0 h-full w-full object-cover ${
            isLocked ? "blur-[3px]" : ""
          }`}
        />
        {story.memberOnly && (
          <span className="absolute top-4 right-4 bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider font-heading px-3 py-1 rounded-full">
            Exclusive
          </span>
        )}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="h-10 w-10 text-amber-400 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-white text-sm font-semibold">Members Only</p>
            </div>
          </div>
        )}
      </div>
      <div className="lg:col-span-5">
        <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
          {story.category} &middot; {story.readTime} min read
        </p>
        <h3 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading leading-tight mb-4">
          {story.title}
        </h3>
        <p className="text-gray-300 leading-relaxed mb-6">{story.excerpt}</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-gray-400">
            <span className="text-white font-semibold">{story.author}</span>{" "}
            &middot; {formatDate(story.date)}
          </p>
          <Link
            href={isLocked ? "/signup" : `/stories#${story.id}`}
            className="text-sm text-tru-pink font-semibold uppercase tracking-wider hover:text-tru-pink-light transition"
          >
            {isLocked ? "Join to read" : "Read story"} &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

function StoryCard({
  story,
  isLoggedIn,
}: {
  story: Story;
  isLoggedIn: boolean;
}) {
  const isLocked = !!story.memberOnly && !isLoggedIn;
  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-[10px] aspect-[3/2] mb-4">
        <img
          src={story.image}
          alt={story.title}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isLocked ? "blur-[2px]" : ""
          }`}
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="h-8 w-8 text-amber-400 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-white text-sm font-semibold">Members Only</p>
            </div>
          </div>
        )}
        {story.memberOnly && (
          <span className="absolute top-3 right-3 bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider font-heading px-3 py-1 rounded-full">
            Exclusive
          </span>
        )}
        <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider font-heading px-2.5 py-1 rounded-full">
          {story.readTime} min
        </span>
      </div>
      <p className="text-tru-pink text-xs font-bold uppercase tracking-wider mb-1 font-heading">
        {story.category}
      </p>
      <h3 className="text-lg font-bold text-white group-hover:text-tru-pink transition mb-2 leading-snug">
        {story.title}
      </h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{story.excerpt}</p>
      <p className="text-xs text-gray-500">
        {story.author} &middot; {formatDate(story.date)}
      </p>
      {isLocked && (
        <Link
          href="/signup"
          className="inline-block mt-3 text-sm text-tru-pink hover:text-tru-pink-light transition font-semibold uppercase tracking-wider"
        >
          Join to unlock &rarr;
        </Link>
      )}
    </article>
  );
}
