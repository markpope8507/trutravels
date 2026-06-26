import Link from "next/link";
import { trips, stories, drops, videoDiaries, experienceTypes, storyPodcasts } from "@/lib/data";
import HeroSlider from "@/components/hero-slider";
import ExperienceCarousel from "@/components/experience-carousel";
import { DesignA as ExperienceTypesCarousel } from "@/components/experience-types-v2";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";
import DropsCarousel from "@/components/drops-carousel";
import DiscoveryPathways from "@/components/discovery-pathways";
import SearchPrompt from "@/components/search-prompt";
import JoinCommunity from "@/components/join-community";

export default function HomePage() {
  const featuredStory = [...stories]
    .filter((s) => !s.memberOnly)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const featuredVideo = videoDiaries[0];
  const featuredPodcast = storyPodcasts[0];

  return (
    <>
      {/* ================================================================
          1. HERO SLIDER — Three rotating video slides with shared CTAs
          ================================================================ */}
      <HeroSlider />

      {/* ================================================================
          TICKER — Brand manifesto strip in hot pink
          ================================================================ */}
      <section className="bg-tru-navy py-3 overflow-hidden border-y border-white/10">
        <div className="animate-ticker flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mx-4 font-heading">
              <span>Leave Ordinary Behind</span>
              <span className="text-tru-pink/40">/</span>
              <span>Find Your Extraordinary</span>
              <span className="text-tru-pink/40">/</span>
              <span>Chase Sunsets Not Schedules</span>
              <span className="text-tru-pink/40">/</span>
              <span>Strangers Who Become Family</span>
              <span className="text-tru-pink/40">/</span>
              <span>Step Into The Unknown</span>
              <span className="text-tru-pink/40">/</span>
              <span>Connect Deeply</span>
              <span className="text-tru-pink/40">/</span>
              <span>Make Every Journey Count</span>
              <span className="text-tru-pink/40">/</span>
              <span>We Don&apos;t Do Average</span>
              <span className="text-tru-pink/40">/</span>
            </span>
          ))}
        </div>
      </section>

      {/* ================================================================
          2. FEATURED EXPERIENCES — Swipeable carousel
          ================================================================ */}
      <section className="relative overflow-hidden py-24">
        <img
          src="/bg-assets/sun.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-10 w-[260px] sm:w-[420px] md:w-[560px] lg:w-[720px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Experiences</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                Find Your<br /><span className="text-gradient">Extraordinary</span>
              </h2>
            </div>
            <Link href="/explore" className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-tru-pink transition group uppercase tracking-wider font-semibold">
              View all
              <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExperienceCarousel trips={(() => {
            const featured = [
              "thailand-island-hopper",
              "bali-experience",
              "philippines-island-hopper",
              "vietnam-explorer",
              "cambodia-explorer",
              "sri-lanka-uncovered",
              "mexico-yucatan-experience",
              "costa-rica-adventure",
              "greece-island-hopper",
              "discover-asia",
            ];
            return featured.map((id) => trips.find((t) => t.id === id)).filter(Boolean) as typeof trips;
          })()} />
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/explore" className="text-sm text-tru-pink font-semibold uppercase tracking-wider">View all experiences &rarr;</Link>
        </div>

      </section>

      {/* ================================================================
          DISCOVERY PATHWAYS — Last-minute, travel styles, life moments
          Bridge inspiration into action.
          ================================================================ */}
      <DiscoveryPathways />

      {/* ================================================================
          THE TRU EXPERIENCE — 5 experience type USPs as swipeable carousel
          "Leave Ordinary Behind has to live in our product."
          ================================================================ */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <img
          src="/bg-assets/komodo-dragon.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-20 sm:-left-32 lg:-left-40 top-10 w-[300px] sm:w-[480px] md:w-[640px] lg:w-[820px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">How It Works</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                The Tru <span className="text-gradient">Experience</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg">
                Every TruTravels trip is built around five intentional experience types. This isn&apos;t just travel — it&apos;s a framework for moments that actually matter.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExperienceTypesCarousel types={experienceTypes} />
        </div>

        {/* Why Choose Our Tours — the Tru difference */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading text-center">The Tru Difference</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading mb-10 text-center">
            Why Choose <span className="text-gradient">Our Trips?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Small Group Adventures */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 0 0-4-4h-1m-4 5H2v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1Zm-2-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6-1a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-sm leading-tight">Small Group Adventures</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Our groups stay between 10&ndash;20 in size, so every experience feels personal.</p>
            </div>

            {/* Local Guides & Experiences */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-sm leading-tight">Local Legends</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Who better to show you around than someone who calls it home?</p>
            </div>

            {/* Logistics Locked In */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-sm leading-tight">Logistics Locked In</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Zero stress, maximum adventure. Every detail is sorted before you even pack your bag.</p>
            </div>

            {/* Community & Connection */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-sm leading-tight">Community &amp; Connection</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">A shared adventure creates bonds that stick long after the trip ends.</p>
            </div>
          </div>
        </div>

        {/* What's Included CTA */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 text-center">
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            Every trip includes all accommodation and transport, activities, some meals, and an awesome TRU leader who feels more like a friend who happens to know the way. Local legends, all of them.
          </p>
          <Link
            href="/whats-included"
            className="inline-flex items-center gap-2 rounded-full bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
          >
            See What&apos;s Included
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </section>

      {/* ================================================================
          3. VIDEO DIARIES — Swipeable vertical video carousel
          Real video content from travellers, creators, and influencers.
          ================================================================ */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <img
          src="/bg-assets/good-vibes.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-6 w-[260px] sm:w-[400px] md:w-[520px] lg:w-[680px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Video Diaries</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                Moments From Our<br className="hidden sm:block" /> <span className="text-tru-pink">Community</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg">
                Real stories from real people. Tap to play — raw, unfiltered moments from travellers, creators, and influencer partners on the road.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden">
          <VideoDiariesCarousel
            diaries={videoDiaries.filter((v) =>
              ["v1", "v4", "v7", "v8", "v9", "v10"].includes(v.id),
            )}
          />
        </div>
      </section>

      {/* ================================================================
          5. THE DROP — Limited experiences & events carousel
          ================================================================ */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-b from-transparent via-tru-green/[0.03] to-transparent">
        <img
          src="/bg-assets/lantern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -bottom-8 w-[240px] sm:w-[380px] md:w-[500px] lg:w-[640px] opacity-[0.08] brightness-0 invert"
        />
        <img
          src="/bg-assets/community.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-6 w-[200px] sm:w-[300px] md:w-[400px] lg:w-[520px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-green text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Coming Soon</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                The Drop
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg">
                Limited spots. Exclusive launches. Members get first access.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DropsCarousel drops={drops} />
        </div>
      </section>

      {/* ================================================================
          6. STORIES — Watch · Read · Listen
          ================================================================ */}
      <section className="relative overflow-hidden py-24">
        <img
          src="/bg-assets/eyes.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-10 w-[220px] sm:w-[340px] md:w-[460px] lg:w-[600px] opacity-[0.08] brightness-0 invert"
        />
        <img
          src="/bg-assets/bali-flower.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-32 -bottom-12 w-[240px] sm:w-[380px] md:w-[500px] lg:w-[640px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Stories</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading leading-[0.95]">
              Watch. <span className="text-tru-green">Read.</span> <span className="text-tru-blue">Listen.</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-lg text-sm sm:text-base">
              Stories from the road in every format. Diaries to lose an afternoon in, long-reads for the train, podcasts for the plane.
            </p>
          </div>
          <Link
            href="/stories"
            className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-tru-pink transition group uppercase tracking-wider font-semibold font-heading"
          >
            All stories
            <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WATCH — featured video diary */}
          <Link
            href="/stories#watch"
            className="group relative overflow-hidden rounded-[10px] aspect-[4/5] block"
          >
            <img
              src={featuredVideo.poster}
              alt={featuredVideo.caption}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/40 to-tru-navy/20" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 bg-tru-green text-tru-navy text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full font-heading">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Watch
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-16 w-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-tru-green/30 group-hover:scale-110 transition-all duration-300">
                <svg className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-tru-green text-[10px] font-bold uppercase tracking-wider mb-2 font-heading">
                Video Diaries &middot; {featuredVideo.location}
              </p>
              <h3 className="text-xl font-black text-white group-hover:text-tru-green transition uppercase font-heading leading-tight">
                {featuredVideo.author}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 mt-2">{featuredVideo.caption}</p>
            </div>
          </Link>

          {/* READ — featured story */}
          <Link
            href="/stories#read"
            className="group relative overflow-hidden rounded-[10px] aspect-[4/5] block"
          >
            <img
              src={featuredStory.image}
              alt={featuredStory.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/40 to-tru-navy/20" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 bg-tru-pink text-white text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full font-heading">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Read
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider mb-2 font-heading">
                {featuredStory.category} &middot; {featuredStory.readTime} min read
              </p>
              <h3 className="text-xl font-black text-white group-hover:text-tru-pink transition uppercase font-heading leading-tight">
                {featuredStory.title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 mt-2">{featuredStory.excerpt}</p>
            </div>
          </Link>

          {/* LISTEN — featured podcast episode */}
          <Link
            href="/stories#listen"
            className="group relative overflow-hidden rounded-[10px] aspect-[4/5] block"
          >
            <img
              src={featuredPodcast.image}
              alt={featuredPodcast.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/40 to-tru-navy/20" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 bg-tru-blue text-white text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full font-heading">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                Listen
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-heading">
                {featuredPodcast.duration}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-16 w-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-tru-blue/30 group-hover:scale-110 transition-all duration-300">
                <svg className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-tru-blue text-[10px] font-bold uppercase tracking-wider mb-2 font-heading">
                Episode {featuredPodcast.episode} &middot; {featuredPodcast.host}
              </p>
              <h3 className="text-xl font-black text-white group-hover:text-tru-blue transition uppercase font-heading leading-tight">
                {featuredPodcast.title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 mt-2">{featuredPodcast.description}</p>
            </div>
          </Link>
        </div>
        </div>
      </section>

      {/* ================================================================
          7. MEMBERSHIP CTA — The big sell.
          Navy background, pink + green brand CTAs.
          ================================================================ */}
      <section className="relative py-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt="Beach at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-tru-navy/85" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-4 font-heading">Join Our Community</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 uppercase font-heading">
                This Is More<br />Than A Trip<br />Company
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                TruTravels is a community. A lifestyle. A way of seeing the world differently. Membership is free — and it unlocks everything.
              </p>
              <JoinCommunity />
            </div>

            {/* Right — member perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  title: "Exclusive Experiences",
                  text: "Member-only trips, early access to new routes, and limited drops before anyone else.",
                },
                {
                  icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                  title: "Personalised For You",
                  text: "Recommendations based on your travel style, saved trips, and where you've been.",
                },
                {
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                  title: "Global Community",
                  text: "Connect with travellers worldwide. Share tips, plan trips together, and make friends before you even leave.",
                },
                {
                  icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
                  title: "Insider Content",
                  text: "Stories, guides, and hidden gems that only members can access. Written by creators, not copywriters.",
                },
              ].map((perk) => (
                <div key={perk.title} className="glass rounded-[10px] p-5 hover:border-tru-pink/20 transition-all duration-300">
                  <div className="h-10 w-10 rounded-full bg-tru-pink/15 flex items-center justify-center mb-3">
                    <svg className="h-5 w-5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={perk.icon} />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1 uppercase font-heading">{perk.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{perk.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof strip */}
          <div className="mt-16 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["SC", "JM", "PK", "TA", "MR"].map((initials, i) => (
                  <div
                    key={initials}
                    className="h-8 w-8 rounded-full border-2 border-tru-navy flex items-center justify-center text-[10px] font-bold text-white"
                    style={{
                      background: i % 2 === 0 ? "var(--tru-pink)" : "var(--tru-green)",
                      zIndex: 5 - i,
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm">
                <span className="text-white font-semibold">50,000+</span> travellers in the community
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-tru-pink" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9/5 average rating
              </span>
              <span>25+ destinations</span>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
