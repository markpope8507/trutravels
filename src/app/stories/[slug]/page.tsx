import Link from "next/link";
import { notFound } from "next/navigation";
import { stories, storyArticles, trips, unescoTours } from "@/lib/data";
import UnescoToursCarousel from "@/components/unesco-tours-carousel";
import ReadingProgressBar from "@/components/reading-progress-bar";
import BackToTop from "@/components/back-to-top";
import ShareButtons from "@/components/share-buttons";
import SaveStoryButton from "@/components/save-story-button";
import { getAuthorByName } from "@/lib/authors";

export function generateStaticParams() {
  return Object.keys(storyArticles).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = stories.find((s) => s.id === slug);
  if (!story || !storyArticles[slug]) return {};
  return {
    title: `${story.title} — TruTravels`,
    description: story.excerpt,
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default async function StoryArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = stories.find((s) => s.id === slug);
  const article = storyArticles[slug];
  if (!story || !article) notFound();

  const related = stories
    .filter((s) => s.id !== story.id && s.type === story.type)
    .slice(0, 3);

  const tourPool = [...unescoTours, ...trips];
  const tours = (article.tourIds ?? [])
    .map((id) => tourPool.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const author = getAuthorByName(story.author);

  return (
    <article className="pb-24">
      <ReadingProgressBar />

      {/* ===================== HERO ===================== */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        <img
          src={story.image}
          alt={story.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tru-navy via-tru-navy/60 to-tru-navy/20" />

        <div className="relative z-10 w-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-[0.2em] font-heading transition mb-6"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All Stories
          </Link>

          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-4 font-heading">
            {story.category}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase font-heading leading-[0.95] mb-6 max-w-3xl">
            {story.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            {author ? (
              <Link
                href={`/stories/author/${author.slug}`}
                className="text-white font-semibold hover:text-tru-pink transition-colors"
              >
                {story.author}
              </Link>
            ) : (
              <span className="text-white font-semibold">{story.author}</span>
            )}
            <span className="text-gray-500">&middot;</span>
            <span>{formatDate(story.date)}</span>
            <span className="text-gray-500">&middot;</span>
            <span>{story.readTime} min read</span>
          </div>

          {/* Share / Save — consistent with the tour page */}
          <div className="mt-6 flex items-center gap-2">
            <ShareButtons title={story.title} itemLabel="story" />
            <SaveStoryButton storyId={story.id} />
          </div>
        </div>
      </section>

      {/* ===================== INTRO ===================== */}
      <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-14">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-40 lg:-right-72 -top-4 w-[260px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <div className="relative">
          {article.intro.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-xl sm:text-2xl text-white font-light leading-relaxed mb-6"
                  : "text-gray-300 text-lg leading-relaxed mb-6"
              }
            >
              {p}
            </p>
          ))}
          <div className="h-px w-16 bg-tru-pink mt-4" />
        </div>
      </section>

      {/* ===================== SECTIONS ===================== */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12">
        <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-40 lg:-left-72 top-1/4 w-[240px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-40 lg:-right-72 bottom-1/3 w-[240px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <div className="relative space-y-20">
          {article.sections.map((section, i) => (
          <section
            key={section.heading}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Text */}
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              {section.kicker && (
                <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
                  {section.kicker}
                </p>
              )}
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading leading-tight mb-5">
                {section.heading}
              </h2>
              {section.body.map((p, j) => (
                <p
                  key={j}
                  className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Image */}
            {section.image && (
              <div
                className={`relative overflow-hidden rounded-[10px] aspect-[4/3] ${
                  i % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <img
                  src={section.image}
                  alt={section.imageAlt ?? section.heading}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
          </section>
          ))}
        </div>
      </div>

      {/* ===================== TOURS CAROUSEL ===================== */}
      {tours.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-10 border-t-2 border-tru-pink/30" />
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading">
              Tick Them Off
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-4">
            Tours With These <span className="text-tru-pink">Sites</span> In
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mb-10">
            Every one of these group adventures takes you right to a UNESCO World
            Heritage Site on this list. Find your crew and go see them for real.
          </p>
          <UnescoToursCarousel tours={tours} />
        </section>
      )}

      {/* ===================== CTA ===================== */}
      {article.cta && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24">
          <div className="rounded-[14px] border border-white/10 bg-gradient-to-br from-tru-pink/15 via-white/5 to-tru-blue/10 p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading leading-tight mb-4">
              {article.cta.heading}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
              {article.cta.body}
            </p>
            <Link
              href={article.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-tru-pink px-8 py-4 text-sm font-bold uppercase tracking-wider text-white font-heading hover:bg-tru-pink-light transition-all duration-300"
            >
              {article.cta.label} &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ===================== RELATED ===================== */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
            Keep Reading
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-10">
            More Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((s) => {
              const hasArticle = !!storyArticles[s.id];
              return (
                <Link
                  key={s.id}
                  href={hasArticle ? `/stories/${s.id}` : `/stories#${s.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-[10px] aspect-[3/2] mb-4">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-tru-pink text-xs font-bold uppercase tracking-wider mb-1 font-heading">
                    {s.category}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:text-tru-pink transition mb-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {s.excerpt}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ===================== BACK TO TOP ===================== */}
      <div className="pt-12">
        <BackToTop />
      </div>
    </article>
  );
}
