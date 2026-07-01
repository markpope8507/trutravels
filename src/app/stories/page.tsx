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
  storyArticles,
  videoDiaries,
  storyTopics,
  storyLifeMoments,
  storyTypes,
  storyContentSeries,
  storyPodcasts,
  type Story,
} from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";
import FilterSection from "@/components/filter-section";
import StoryCard from "@/components/story-card";
import FeaturedStoryCard from "@/components/featured-story-card";
import PillButton from "@/components/pill-button";

// Region → countries taxonomy for the nested Destination filter (mirrors the
// site's destination structure). Tagging will populate these against stories.
const STORY_REGIONS: { region: string; countries: string[] }[] = [
  { region: "Asia", countries: ["Thailand", "Indonesia", "Vietnam", "Philippines", "Cambodia", "Sri Lanka", "India", "Japan", "China", "South Korea"] },
  { region: "Latin America", countries: ["Mexico", "Costa Rica", "Colombia", "Peru", "Brazil", "Belize", "Guatemala"] },
  { region: "Europe", countries: ["Greece", "Italy", "Albania"] },
  { region: "Africa & Middle East", countries: ["Morocco", "Jordan"] },
  { region: "Oceania", countries: ["New Zealand"] },
];

// Combined "Topics" facet = content types + editorial topics.
const TOPIC_OPTIONS: { id: string; label: string }[] = [
  ...storyTypes.map((t) => ({ id: t.value as string, label: t.label })),
  ...storyTopics.map((t) => ({ id: t, label: t })),
];

const countryStoryCount = (country: string) =>
  stories.filter((s) => s.destinations.includes(country)).length;

const STORIES_PAGE_SIZE = 6;

export default function StoriesPage() {
  const { isLoggedIn } = useAuth();
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(STORIES_PAGE_SIZE);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [selectedMoments, setSelectedMoments] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["topics"]));
  const [openRegions, setOpenRegions] = useState<Set<string>>(new Set());

  // Lock background scroll while the mobile filter drawer is open.
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // Slide in the fixed filter/sort bar once the in-flow bar scrolls out of view
  // (mobile) — same behaviour as the tour & explore sticky menus.
  const [navSticky, setNavSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const bar = document.getElementById("stories-bar");
      if (!bar) return;
      setNavSticky(bar.getBoundingClientRect().bottom < 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        if (
          selectedTags.size &&
          !(selectedTags.has(s.type) || s.topics.some((t) => selectedTags.has(t)))
        )
          return false;
        if (selectedCountries.size && !s.destinations.some((d) => selectedCountries.has(d)))
          return false;
        if (selectedMoments.size && !s.lifeMoments.some((m) => selectedMoments.has(m)))
          return false;
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
    [rest, selectedTags, selectedCountries, selectedMoments, query],
  );

  const activeFilterCount = selectedTags.size + selectedCountries.size + selectedMoments.size;
  const hasActiveFilters = activeFilterCount > 0 || query.trim().length > 0;

  // Reset the visible count back to one page whenever the filters/sort change.
  const filterKey = JSON.stringify([
    [...selectedTags].sort(),
    [...selectedCountries].sort(),
    [...selectedMoments].sort(),
    query.trim(),
    sort,
  ]);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(STORIES_PAGE_SIZE);
  }

  const makeToggle =
    (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (value: string) =>
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return next;
      });
  const toggleTag = makeToggle(setSelectedTags);
  const toggleCountry = makeToggle(setSelectedCountries);
  const toggleMoment = makeToggle(setSelectedMoments);
  const toggleSection = makeToggle(setOpenSections);
  const toggleRegion = makeToggle(setOpenRegions);

  const clearAll = () => {
    setSelectedTags(new Set());
    setSelectedCountries(new Set());
    setSelectedMoments(new Set());
    setQuery("");
  };

  const rowClass = (checked: boolean) =>
    `flex items-center gap-3 cursor-pointer rounded-[8px] px-3 py-2 transition ${
      checked ? "bg-tru-pink/15 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
    }`;

  const mobileBarContent = (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories…"
          className="w-full bg-white/5 border border-white/15 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition"
        />
      </div>
      <button
        onClick={() => setShowFilters(true)}
        className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-tru-pink/50 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white font-heading transition"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-tru-pink text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );

  const FilterPanel = (
    <div className="space-y-4">
      {/* Sort By — matches the Deals filter */}
      <div>
        <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">Sort By</p>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
            className="w-full appearance-none bg-tru-navy border border-white/15 rounded-[10px] px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-tru-pink/50 cursor-pointer"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Topics — content types + editorial topics, combined */}
      <FilterSection
        title="Topics"
        count={selectedTags.size}
        open={openSections.has("topics")}
        onToggle={() => toggleSection("topics")}
      >
        <div className="space-y-1.5">
          {TOPIC_OPTIONS.map((opt) => {
            const checked = selectedTags.has(opt.id);
            return (
              <label key={opt.id} className={rowClass(checked)}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTag(opt.id)}
                  className="h-4 w-4 accent-tru-pink rounded"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Destination — region → countries (nested) */}
      <FilterSection
        title="Destination"
        count={selectedCountries.size}
        open={openSections.has("destination")}
        onToggle={() => toggleSection("destination")}
      >
        <div className="space-y-1">
          {STORY_REGIONS.map(({ region, countries }) => {
            const visibleCountries = countries.filter((c) => countryStoryCount(c) > 0);
            if (visibleCountries.length === 0) return null;
            const regionOpen = openRegions.has(region);
            const regionCount = visibleCountries.filter((c) => selectedCountries.has(c)).length;
            return (
              <div key={region}>
                <button
                  type="button"
                  onClick={() => toggleRegion(region)}
                  className="w-full flex items-center justify-between gap-2 rounded-[8px] px-3 py-2 text-gray-200 hover:bg-white/5 hover:text-white transition"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {region}
                    {regionCount > 0 && (
                      <span className="bg-tru-pink text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                        {regionCount}
                      </span>
                    )}
                  </span>
                  <svg
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform ${regionOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {regionOpen && (
                  <div className="mt-1 space-y-1.5">
                    {visibleCountries.map((c) => {
                      const checked = selectedCountries.has(c);
                      return (
                        <label key={c} className={rowClass(checked)}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCountry(c)}
                            className="h-4 w-4 accent-tru-pink rounded"
                          />
                          <span className="text-sm flex-1">{c}</span>
                          <span className="text-xs text-gray-500">{countryStoryCount(c)}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </FilterSection>

      {/* Life Moments */}
      <FilterSection
        title="Life Moments"
        count={selectedMoments.size}
        open={openSections.has("moment")}
        onToggle={() => toggleSection("moment")}
      >
        <div className="space-y-1.5">
          {storyLifeMoments.map((m) => {
            const checked = selectedMoments.has(m);
            return (
              <label key={m} className={rowClass(checked)}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMoment(m)}
                  className="h-4 w-4 accent-tru-pink rounded"
                />
                <span className="text-sm">{m}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {activeFilterCount > 0 && (
        <>
          <div className="h-px bg-white/10" />
          <button
            onClick={clearAll}
            className="w-full inline-flex items-center justify-center gap-2 rounded-[10px] border border-white/20 py-2.5 text-xs font-bold text-white hover:border-tru-pink hover:text-tru-pink transition uppercase tracking-wider font-heading"
          >
            Clear Filters ({activeFilterCount})
          </button>
        </>
      )}
    </div>
  );

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
        accent="tru-pink"
        icon={<WatchIcon />}
      />

      {/* Sub-section: Video Diaries */}
      <section className="pb-16">
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
        <section className="relative pb-20 overflow-clip">
          <img src="/bg-assets/peru-bird.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-4 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
              Featured
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-10">
              The Latest Story
            </h3>
            <FeaturedStoryCard story={featured} isLoggedIn={isLoggedIn} />
          </div>
        </section>
      )}

      {/* Browse */}
      <section className="relative pb-24 overflow-x-clip">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-10 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          {/* Sidebar + results */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-6 rounded-[12px] border border-white/10 bg-tru-navy/60 backdrop-blur-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white text-sm font-black uppercase font-heading tracking-wider">Filters</p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-tru-pink text-[11px] font-bold uppercase tracking-wider font-heading hover:text-tru-pink-light transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-gray-400 text-xs mb-5">
                  <span className="text-white font-bold">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "story" : "stories"}
                </p>
                {FilterPanel}
              </div>
            </aside>

            {/* Results */}
            <div className="min-w-0">
              {/* Mobile: search + filters (in flow; gate for the sticky duplicate) */}
              <div id="stories-bar" className="lg:hidden mb-6">
                {mobileBarContent}
              </div>

              {/* Desktop: search (sort + filters live in the sidebar) */}
              <div className="relative hidden lg:block mb-6">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stories, guides, destinations…"
                  className="w-full bg-white/5 border border-white/10 rounded-[10px] pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition"
                />
              </div>

              {/* Count */}
              <p className="text-sm text-gray-500 mb-6">
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}{" "}
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

              {/* Grid */}
              {filtered.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {filtered.slice(0, visibleCount).map((story) => (
                      <StoryCard key={story.id} story={story} isLoggedIn={isLoggedIn} />
                    ))}
                  </div>
                  {visibleCount < filtered.length && (
                    <div className="pt-10 text-center">
                      <PillButton onClick={() => setVisibleCount((n) => n + STORIES_PAGE_SIZE)} arrow="down">
                        Show More Stories
                      </PillButton>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-[10px] border border-dashed border-white/10 py-20 text-center">
                  <p className="text-gray-400 mb-4">No stories match those filters yet.</p>
                  <button
                    onClick={clearAll}
                    className="text-tru-pink hover:text-tru-pink-light text-sm font-semibold uppercase tracking-wider transition"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>
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

      <section className="relative pb-24 overflow-clip">
        <img src="/bg-assets/community.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-28 top-6 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex justify-end lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="relative w-full sm:w-[420px] bg-tru-navy flex flex-col h-full shadow-2xl shadow-black/50 animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-black text-lg uppercase font-heading tracking-wider">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white transition">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{FilterPanel}</div>
            <div className="px-6 py-4 border-t border-white/10">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full rounded-[10px] bg-tru-pink py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 text-center font-heading uppercase tracking-wider"
              >
                Show {filtered.length} Stor{filtered.length === 1 ? "y" : "ies"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky duplicate — slides in once the in-flow bar scrolls past (mobile) */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-[60] bg-tru-navy/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
          navSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          {mobileBarContent}
        </div>
      </div>
    </>
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

// StoryCard now lives in @/components/story-card (shared with country pages).
