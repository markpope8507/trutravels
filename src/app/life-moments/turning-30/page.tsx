import Breadcrumbs from "@/components/breadcrumbs";
import { lifeMomentCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import {
  trips,
  stories,
  videoDiaries,
} from "@/lib/data";
import TripCarouselSection from "@/components/trip-carousel-section";
import { otherLifeMoments } from "@/lib/life-moments";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";

export const metadata = {
  title: "Turning 30 — TruTravels",
  description:
    "Stamps collected, comfort zones outgrown. Off-the-beaten-path adventures for the next decade.",
};

const TRIP_IDS = [
  "costa-rica-adventure",
  "india-sri-lanka",
  "mexico-belize-guatemala",
  "sri-lanka-uncovered",
  "sumatra-uncovered",
  "northern-thailand-adventure",
  "komodo-island-hopper",
  "mexico-yucatan-experience",
];

const VIDEO_IDS = ["v3", "v5", "v7", "v9", "v1"];
const STORY_IDS = ["why-i-quit-my-job-to-travel", "wellness-reset-bali", "member-secret-itinerary-vietnam"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function Turning30Page() {
  const pageTrips = TRIP_IDS
    .map((id) => trips.find((t) => t.id === id))
    .filter(Boolean) as typeof trips;

  const pageVideos = videoDiaries.filter((v) => VIDEO_IDS.includes(v.id));
  const pageStories = stories.filter((s) => STORY_IDS.includes(s.id));

  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920&q=80"
          alt="Sahara dunes at dusk — the next chapter"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Life Moments
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Turning<br />30
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;You&apos;ve got the stamps. Now collect the stories.&rdquo;
            </p>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={lifeMomentCrumbs("Turning 30")} />

      {/* ========================================================
          TRIPS — off-beaten, adventure-led
          ======================================================== */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <img
          src="/bg-assets/mask.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[420px] lg:w-[600px] opacity-[0.07] brightness-0 invert"
        />
        <img
          src="/bg-assets/peru-bird.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -bottom-10 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.06] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              Off The Tourist Track
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Adventure Over <span className="text-tru-pink">Algorithm</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              You&apos;ve done the islands. You&apos;ve seen the temples. Time to go further — Sahara nights, jungle treks, dragons, and the places your friends haven&apos;t posted from yet.
            </p>
          </div>
          <TripCarouselSection
            id="turning-30-trips"
            label="Recommended"
            title="Further · Wilder · Realer"
            labelColor="#FF3F99"
            trips={pageTrips}
          />
        </div>
      </section>

      {/* ========================================================
          DIARIES — video UGC
          ======================================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <img
          src="/bg-assets/lantern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-6 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.07] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
            Diaries · Same Wonder, Wiser Eyes
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
            The Trips That <span className="text-tru-pink">Hit Different</span>
          </h2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            Less rush, more nuance. Cultural moments, slow rides, real connections. Tap to play.
          </p>
        </div>
        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden relative">
          <VideoDiariesCarousel diaries={pageVideos} />
        </div>
      </section>

      {/* ========================================================
          READ — Articles for the seasoned traveller
          ======================================================== */}
      {pageStories.length > 0 && (
        <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5">
          <img
            src="/bg-assets/eyes.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-10 w-[220px] sm:w-[340px] lg:w-[480px] opacity-[0.06] brightness-0 invert"
          />
          <img
            src="/bg-assets/bali-flower.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -left-12 sm:-left-20 lg:-left-24 -bottom-12 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.06] brightness-0 invert"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
                Read · The Next Chapter
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
                Burnt Out, <span className="text-tru-pink">Then Reborn</span>
              </h2>
              <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
                Stories from people who got to 26, 28, 30 and decided to do something about it.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageStories.map((story) => (
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
          YOU MIGHT LIKE — other life moments
          ======================================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5">
        <img
          src="/bg-assets/sun.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert"
        />
        <img
          src="/bg-assets/good-vibes.svg"
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
            {otherLifeMoments("turning-30").map((moment) => (
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
            Next Decade, Bigger Map
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-6">
            One More Big One. <span className="text-tru-pink">Or The First Of Many.</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
            The good news: thirty is when travel actually gets good. You know what you like. You know what you don&apos;t. Pick the one that scares you a little.
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
