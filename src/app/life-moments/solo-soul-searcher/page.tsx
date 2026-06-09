import Link from "next/link";
import {
  trips,
  stories,
  videoDiaries,
  storyContentSeries,
  storyPodcasts,
} from "@/lib/data";
import TripCarouselSection from "@/components/trip-carousel-section";
import { otherLifeMoments } from "@/lib/life-moments";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";

export const metadata = {
  title: "Solo Soul Searcher — TruTravels",
  description:
    "Trips, stories and voices for travellers heading out on their own. Find your people, find yourself.",
};

const SOLO_TRIP_IDS = [
  "thailand-island-hopper",
  "bali-experience",
  "vietnam-explorer",
  "philippines-island-hopper",
  "sri-lanka-uncovered",
  "cambodia-explorer",
  "thailand-backpacker",
];

const SOLO_VIDEO_IDS = ["v1", "v3", "v5", "v8", "v10"];
const SOLO_SERIES_IDS = ["scs-bali-beyond", "scs-vietnam-n2s", "scs-island-hopper"];
const SOLO_PODCAST_IDS = ["sp-04"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function SoloSoulSearcherPage() {
  const soloTrips = SOLO_TRIP_IDS
    .map((id) => trips.find((t) => t.id === id))
    .filter(Boolean) as typeof trips;

  const soloVideos = videoDiaries.filter((v) => SOLO_VIDEO_IDS.includes(v.id));
  const soloStories = stories.filter((s) => s.topics.includes("Solo Travel"));
  const soloSeries = storyContentSeries.filter((s) => SOLO_SERIES_IDS.includes(s.id));
  const soloPodcasts = storyPodcasts.filter((p) => SOLO_PODCAST_IDS.includes(p.id));

  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="/images/solo-soul-searcher-hero.jpg"
          alt="Lone traveller on a mountain road at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Life Moments
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Solo Soul<br />Searcher
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;You came alone. You won&apos;t leave that way.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          TRIPS — recommended for solo travellers
          ======================================================== */}
      <section className="relative pt-20 pb-16 overflow-hidden border-t border-white/5">
        <img
          src="/bg-assets/peru-bird.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[420px] lg:w-[600px] opacity-[0.07] brightness-0 invert"
        />
        <img
          src="/bg-assets/bali-flower.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -bottom-10 w-[220px] sm:w-[340px] lg:w-[480px] opacity-[0.06] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              Solo-Friendly Trips
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Built For <span className="text-tru-pink">Going It Alone</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Small groups, local leaders, time to do your own thing. The trips below are the ones our solo travellers come home raving about.
            </p>
          </div>
          <TripCarouselSection
            id="solo-trips"
            label="Recommended"
            title="Best For Solo Soul Searchers"
            labelColor="#FF3F99"
            trips={soloTrips}
          />
        </div>
      </section>

      {/* ========================================================
          WATCH — Video diaries (UGC)
          ======================================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <img
          src="/bg-assets/good-vibes.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-6 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.07] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
            Diaries · In Their Own Words
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
            Solo Travellers <span className="text-tru-pink">On The Road</span>
          </h2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            Real clips from people who came alone — and what happened next. Tap to play.
          </p>
        </div>
        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden relative">
          <VideoDiariesCarousel diaries={soloVideos} />
        </div>
      </section>

      {/* ========================================================
          READ — Articles tagged Solo Travel
          ======================================================== */}
      {soloStories.length > 0 && (
        <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5">
          <img
            src="/bg-assets/eyes.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-10 w-[220px] sm:w-[340px] lg:w-[480px] opacity-[0.06] brightness-0 invert"
          />
          <img
            src="/bg-assets/lantern.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -left-12 sm:-left-20 lg:-left-24 -bottom-12 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.06] brightness-0 invert"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
                Read · Honest Stories
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
                From Other <span className="text-tru-pink">Solo Travellers</span>
              </h2>
              <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
                The stuff that doesn&apos;t make the brochure — first-trip nerves, hostel friendships, and the moments that change everything.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {soloStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories#${story.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-[10px] aspect-[3/2] mb-4">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
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
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          WATCH SERIES
          ======================================================== */}
      {soloSeries.length > 0 && (
        <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5">
          <img
            src="/bg-assets/sun.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -top-8 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.07] brightness-0 invert"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
                Watch · Content Series
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
                Dive <span className="text-tru-pink">Deeper</span>
              </h2>
              <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
                Multi-episode dives into the places solo travellers tend to land.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {soloSeries.map((s) => (
                <div
                  key={s.id}
                  className="group rounded-[10px] border border-white/10 bg-tru-navy overflow-hidden hover:border-tru-pink/30 transition-all duration-300 cursor-pointer"
                >
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
                    <p className="text-gray-400 text-sm line-clamp-2">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          LISTEN — Podcasts
          ======================================================== */}
      {soloPodcasts.length > 0 && (
        <section className="relative pt-12 pb-24 overflow-hidden border-t border-white/5">
          <img
            src="/bg-assets/community.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-8 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.07] brightness-0 invert"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
                Listen · For Your Ears
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
                The <span className="text-tru-pink">Podcasts</span>
              </h2>
              <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
                Long-form chats with people who&apos;ve been where you&apos;re going.
              </p>
            </div>
            <div className="space-y-3">
              {soloPodcasts.map((ep) => (
                <div
                  key={ep.id}
                  className="flex items-center gap-4 rounded-[10px] border border-white/10 bg-tru-navy p-4 sm:p-5 hover:border-tru-blue/40 hover:bg-[#0d2a4e] transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-[10px] overflow-hidden flex-shrink-0">
                    <img src={ep.image} alt={ep.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                      <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
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
          </div>
        </section>
      )}

      {/* ========================================================
          YOU MIGHT LIKE — other life moments
          ======================================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5">
        <img
          src="/bg-assets/komodo-dragon.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert"
        />
        <img
          src="/bg-assets/ramen.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.07] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              You Might Like
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Other <span className="text-tru-pink">Life Moments</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Different chapter, same energy. Pick the one that fits where you are.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherLifeMoments("solo-soul-searcher").map((moment) => (
              <Link
                key={moment.name}
                href={moment.href}
                className="group relative overflow-hidden rounded-[10px] aspect-[5/3] block"
              >
                <img
                  src={moment.image}
                  alt={moment.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-xl mb-2 block">{moment.emoji}</span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                    {moment.name}
                  </h3>
                  <p className="text-[12px] text-gray-200 leading-snug">{moment.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="pt-12 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
            Ready When You Are
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-6">
            Book Solo, <span className="text-tru-pink">Travel Together</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
            Every trip below has space for one. By the time you land, you&apos;ll have a group.
          </p>
          <Link
            href="/explore"
            className="inline-flex rounded-[10px] bg-tru-pink px-8 py-3.5 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider"
          >
            Browse All Trips
          </Link>
        </div>
      </section>
    </>
  );
}
