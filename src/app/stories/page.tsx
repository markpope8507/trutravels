"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import {
  stories,
  videoDiaries,
  storyTopics,
  storyLifeMoments,
  storyLifeMomentEmojis,
  storyTopicEmojis,
  storyTypes,
  storyContentSeries,
  storyPodcasts,
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
  const [showFilters, setShowFilters] = useState(false);

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

  const activeFilterCount =
    (activeType !== "all" ? 1 : 0) +
    (destination ? 1 : 0) +
    (topic ? 1 : 0) +
    (lifeMoment ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0 || query.trim().length > 0;

  const destinationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of allDestinations) {
      counts[d] = rest.filter((s) => s.destinations.includes(d)).length;
    }
    return counts;
  }, [rest]);

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

      {/* =========================================================
          WATCH — video diaries + content series
          ========================================================= */}
      <PillarHeader
        pillar="Watch"
        eyebrow="Press Play"
        title="Stories You Can Watch"
        description="Diaries from the road and deep-dive video series. Get comfortable — these are the ones you'll want to disappear into."
        accent="tru-green"
        icon={<WatchIcon />}
      />

      {/* Sub-section: Video Diaries */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
            Video Diaries
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-heading">
            Moments From Our <span className="text-tru-pink">Community</span>
          </h3>
          <p className="text-gray-400 mt-3 max-w-lg text-sm sm:text-base">
            Travellers, guides, partners, and the Planeterra projects we support — in their own words.
          </p>
        </div>
        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden">
          <VideoDiariesCarousel diaries={videoDiaries} />
        </div>
      </section>

      {/* Sub-section: Content Series */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
            Content Series
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-heading">
            Watch &amp; <span className="text-tru-pink">Learn</span>
          </h3>
          <p className="text-gray-400 mt-3 max-w-lg text-sm sm:text-base">
            Multi-episode dives into places, dishes, and adventures we couldn&apos;t fit into a single video.
          </p>
        </div>
        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden">
          <div className="content-series-carousel relative">
            <Swiper
              modules={[Navigation, FreeMode]}
              spaceBetween={16}
              slidesPerView={1.2}
              freeMode={{ enabled: true, sticky: false }}
              navigation={{
                nextEl: ".cs-next",
                prevEl: ".cs-prev",
              }}
              breakpoints={{
                480: { slidesPerView: 1.8 },
                640: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3.2, spaceBetween: 20 },
                1280: { slidesPerView: 3.7, spaceBetween: 20 },
              }}
              speed={600}
              className="!overflow-visible"
            >
              {storyContentSeries.map((s) => (
                <SwiperSlide key={s.id}>
                  <div className="group rounded-[10px] border border-white/10 bg-white/5 overflow-hidden hover:border-tru-pink/30 transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 bg-tru-pink text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-heading">
                        {s.tag}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {s.episodes} episodes
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-white text-base font-bold font-heading group-hover:text-tru-pink transition-colors mb-1.5">
                        {s.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="cs-prev absolute top-[28%] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="cs-next absolute top-[28%] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          READ — featured story + browse grid
          ========================================================= */}
      <PillarHeader
        pillar="Read"
        eyebrow="Long Form"
        title="Stories Worth Reading"
        description="Honest, in-depth pieces from the road. Travellers, guides, and our team — sharing the moments that stayed with them."
        accent="tru-pink"
        icon={<ReadIcon />}
      />

      {/* Featured */}
      {featured && (
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
              Featured
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-10">
              The Latest Story
            </h3>
            <FeaturedCard story={featured} isLoggedIn={isLoggedIn} />
          </div>
        </section>
      )}

      {/* Browse */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
              Browse
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-4">
              Find Your Next Read
            </h3>
            <p className="text-gray-400 max-w-xl text-sm sm:text-base">
              Search by destination, topic, or where you are in life. There&apos;s
              a story here for every chapter of the journey.
            </p>
          </div>

          {/* Search + Filter button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
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
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-white/15 hover:border-tru-pink/50 bg-white/5 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-white font-heading transition relative"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h18M6 12h12M10 20h4"
                />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-tru-pink text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Results count + sort */}
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <p className="text-sm text-gray-500">
              Showing {filtered.length} of {rest.length}{" "}
              {filtered.length === 1 ? "story" : "stories"}
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="ml-3 text-tru-pink hover:text-tru-pink-light text-xs font-semibold uppercase tracking-wider transition"
                >
                  Clear all
                </button>
              )}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
              className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-xs text-gray-300 font-semibold uppercase tracking-wider focus:outline-none focus:border-tru-pink/50 cursor-pointer"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

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

      {/* =========================================================
          LISTEN — podcast episodes
          ========================================================= */}
      <PillarHeader
        pillar="Listen"
        eyebrow="Hit Play"
        title="Stories For Your Ears"
        description="The TruTravels podcast. Long-form conversations with travellers, guides, and the people building the best stuff on the road."
        accent="tru-blue"
        icon={<ListenIcon />}
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {storyPodcasts.map((ep) => (
              <div
                key={ep.id}
                className="flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/5 p-4 sm:p-5 hover:border-tru-blue/40 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-[10px] overflow-hidden flex-shrink-0">
                  <img
                    src={ep.image}
                    alt={ep.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                    <svg
                      className="h-7 w-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-tru-blue text-[10px] font-bold uppercase tracking-wider font-heading mb-1">
                    Ep. {ep.episode} &middot; {ep.host}
                  </p>
                  <p className="text-white text-sm sm:text-base font-bold font-heading group-hover:text-tru-blue transition-colors truncate">
                    {ep.title}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-1 mt-0.5">
                    {ep.description}
                  </p>
                </div>
                <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0 font-semibold">
                  {ep.duration}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-tru-blue hover:text-tru-blue/80 text-sm font-bold uppercase tracking-wider font-heading transition"
            >
              Subscribe on Spotify &amp; Apple Podcasts &rarr;
            </a>
          </div>
        </div>
      </section>

      <StoriesFilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        destinations={allDestinations}
        destinationCounts={destinationCounts}
        activeType={activeType}
        setActiveType={setActiveType}
        destination={destination}
        setDestination={setDestination}
        topic={topic}
        setTopic={setTopic}
        lifeMoment={lifeMoment}
        setLifeMoment={setLifeMoment}
        filteredCount={filtered.length}
        onClear={clearAll}
      />
    </>
  );
}

/* ============================================================
   FILTER DRAWER — slide-in from the left, sticky footer
   ============================================================ */
function StoriesFilterDrawer({
  isOpen,
  onClose,
  destinations,
  destinationCounts,
  activeType,
  setActiveType,
  destination,
  setDestination,
  topic,
  setTopic,
  lifeMoment,
  setLifeMoment,
  filteredCount,
  onClear,
}: {
  isOpen: boolean;
  onClose: () => void;
  destinations: string[];
  destinationCounts: Record<string, number>;
  activeType: StoryType | "all";
  setActiveType: (v: StoryType | "all") => void;
  destination: string;
  setDestination: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
  lifeMoment: string;
  setLifeMoment: (v: string) => void;
  filteredCount: number;
  onClear: () => void;
}) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-start">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm sm:block hidden transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />
      <div
        className={`relative w-full sm:w-[420px] lg:w-[480px] bg-tru-navy flex flex-col h-full shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
          closing ? "-translate-x-full" : "animate-slide-in-left"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-black text-lg uppercase font-heading tracking-wider">
            Filters
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Content Type */}
          <div>
            <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">
              Content Type
            </p>
            <div className="flex flex-wrap gap-2">
              <ChipButton
                active={activeType === "all"}
                onClick={() => setActiveType("all")}
              >
                All
              </ChipButton>
              {storyTypes.map((t) => (
                <ChipButton
                  key={t.value}
                  active={activeType === t.value}
                  onClick={() => setActiveType(t.value)}
                >
                  {t.label}
                </ChipButton>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div>
            <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">
              Destination
            </p>
            <div className="flex flex-wrap gap-2">
              {destinations.map((d) => (
                <ChipButton
                  key={d}
                  active={destination === d}
                  onClick={() => setDestination(destination === d ? "" : d)}
                >
                  {d}
                  <span
                    className={`ml-1 ${
                      destination === d ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    ({destinationCounts[d] ?? 0})
                  </span>
                </ChipButton>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">
              Topic
            </p>
            <div className="flex flex-wrap gap-2">
              {storyTopics.map((t) => (
                <ChipButton
                  key={t}
                  active={topic === t}
                  onClick={() => setTopic(topic === t ? "" : t)}
                >
                  <span>{storyTopicEmojis[t]}</span>
                  <span className="font-heading text-[11px] font-semibold uppercase tracking-wider">
                    {t}
                  </span>
                </ChipButton>
              ))}
            </div>
          </div>

          {/* Life Moment */}
          <div>
            <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">
              Life Moment
            </p>
            <div className="flex flex-wrap gap-2">
              {storyLifeMoments.map((m) => (
                <ChipButton
                  key={m}
                  active={lifeMoment === m}
                  onClick={() => setLifeMoment(lifeMoment === m ? "" : m)}
                >
                  <span>{storyLifeMomentEmojis[m]}</span>
                  <span className="font-heading text-[11px] font-semibold uppercase tracking-wider">
                    {m}
                  </span>
                </ChipButton>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center gap-3">
          <button
            onClick={onClear}
            className="flex-1 rounded-[10px] border border-white/20 py-3 text-sm text-white hover:border-white/40 transition text-center font-heading uppercase tracking-wider"
          >
            Clear All
          </button>
          <button
            onClick={handleClose}
            className="flex-1 rounded-[10px] bg-tru-pink py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 text-center font-heading uppercase tracking-wider"
          >
            Show {filteredCount} Stor{filteredCount === 1 ? "y" : "ies"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-all duration-200 flex items-center gap-2 ${
        active
          ? "bg-tru-pink text-white"
          : "border border-white/15 text-gray-300 hover:border-white/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   PILLAR HEADER — big section divider for WATCH / READ / LISTEN
   ============================================================ */
function PillarHeader({
  pillar,
  eyebrow,
  title,
  description,
  accent,
  icon,
}: {
  pillar: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: "tru-pink" | "tru-green" | "tru-blue";
  icon: React.ReactNode;
}) {
  const anchorId = pillar.toLowerCase();
  const accentText: Record<typeof accent, string> = {
    "tru-pink": "text-tru-pink",
    "tru-green": "text-tru-green",
    "tru-blue": "text-tru-blue",
  };
  const accentBorder: Record<typeof accent, string> = {
    "tru-pink": "border-tru-pink/30",
    "tru-green": "border-tru-green/30",
    "tru-blue": "border-tru-blue/30",
  };
  return (
    <section id={anchorId} className="pt-24 pb-12 border-t border-white/5 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <div className="flex-1 min-w-0 max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`h-px w-10 ${accentBorder[accent]} border-t-2`}
              />
              <p
                className={`${accentText[accent]} text-[11px] font-bold uppercase tracking-[0.3em] font-heading`}
              >
                {pillar} &middot; {eyebrow}
              </p>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className={accentText[accent]}>
                {title.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="text-gray-400 mt-5 text-sm sm:text-base max-w-xl">
              {description}
            </p>
          </div>
          <div
            className={`${accentText[accent]} hidden md:block flex-shrink-0`}
          >
            {icon}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LIFESTYLE SVG ICONS — playful line-art for each pillar
   ============================================================ */
function WatchIcon() {
  return (
    <svg
      width="140"
      height="120"
      viewBox="0 0 140 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* TV body */}
      <rect x="10" y="18" width="120" height="78" rx="10" />
      {/* Screen inside */}
      <rect x="20" y="28" width="100" height="58" rx="4" opacity="0.4" />
      {/* Play triangle */}
      <path d="M60 47 L60 67 L82 57 Z" fill="currentColor" stroke="none" />
      {/* Antennae */}
      <line x1="50" y1="6" x2="62" y2="18" />
      <line x1="90" y1="6" x2="78" y2="18" />
      {/* Stand */}
      <line x1="48" y1="108" x2="92" y2="108" />
      <line x1="60" y1="96" x2="56" y2="108" />
      <line x1="80" y1="96" x2="84" y2="108" />
    </svg>
  );
}

function ReadIcon() {
  return (
    <svg
      width="140"
      height="120"
      viewBox="0 0 140 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Open book spine */}
      <line x1="70" y1="24" x2="70" y2="104" />
      {/* Left page */}
      <path d="M70 24 Q 50 18 18 24 L 18 100 Q 50 94 70 100 Z" />
      {/* Right page */}
      <path d="M70 24 Q 90 18 122 24 L 122 100 Q 90 94 70 100 Z" />
      {/* Lines on pages */}
      <line x1="28" y1="40" x2="58" y2="38" opacity="0.6" />
      <line x1="28" y1="52" x2="58" y2="50" opacity="0.6" />
      <line x1="28" y1="64" x2="50" y2="62" opacity="0.6" />
      <line x1="82" y1="38" x2="112" y2="40" opacity="0.6" />
      <line x1="82" y1="50" x2="112" y2="52" opacity="0.6" />
      <line x1="82" y1="62" x2="104" y2="64" opacity="0.6" />
      {/* Bookmark */}
      <path
        d="M95 22 L95 56 L102 50 L109 56 L109 22"
        fill="currentColor"
        stroke="none"
        opacity="0.85"
      />
    </svg>
  );
}

function ListenIcon() {
  return (
    <svg
      width="140"
      height="120"
      viewBox="0 0 140 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Headphone arc */}
      <path d="M22 70 V 56 C 22 30, 44 12, 70 12 C 96 12, 118 30, 118 56 V 70" />
      {/* Left ear cup */}
      <rect x="14" y="68" width="22" height="34" rx="6" />
      <line x1="20" y1="76" x2="20" y2="94" opacity="0.6" />
      {/* Right ear cup */}
      <rect x="104" y="68" width="22" height="34" rx="6" />
      <line x1="120" y1="76" x2="120" y2="94" opacity="0.6" />
      {/* Sound waves */}
      <path d="M50 96 q 6 -8 0 -16" opacity="0.7" />
      <path d="M58 102 q 12 -14 0 -28" opacity="0.5" />
      <path d="M90 96 q -6 -8 0 -16" opacity="0.7" />
      <path d="M82 102 q -12 -14 0 -28" opacity="0.5" />
    </svg>
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
