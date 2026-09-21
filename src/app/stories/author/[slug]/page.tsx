import Breadcrumbs from "@/components/breadcrumbs";
import { STORIES, sectionCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stories } from "@/lib/data";
import { authors, getAuthorBySlug, getAuthorByName } from "@/lib/authors";
import BackToTop from "@/components/back-to-top";
import StoryCard from "@/components/story-card";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: `${author.name} — TruTravels`,
    description: author.bio,
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const authored = stories.filter((s) => getAuthorByName(s.author)?.slug === author.slug);
  const firstName = author.name.split(" ")[0];

  return (
    <div className="pb-24">
      <Breadcrumbs noHero crumbs={sectionCrumbs(STORIES, author.name)} />
      {/* ===================== HERO ===================== */}
      <section className="relative pt-28 sm:pt-32 pb-12 overflow-clip">
        <img
          src="/bg-assets/tru-logo.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 -top-4 w-[260px] sm:w-[420px] opacity-[0.05] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-[0.2em] font-heading transition mb-8"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All Stories
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={author.image}
              alt={author.name}
              className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover border-2 border-tru-pink/40 flex-shrink-0"
            />
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-2 font-heading">
                {author.role}
              </p>
              <h1 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading leading-[0.95] mb-4">
                {author.name}
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {author.bio}
              </p>

              {author.socials && (
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
                  {author.socials.website && (
                    <a
                      href={author.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${author.name}'s blog`}
                      title="Their blog"
                      className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-tru-pink hover:bg-tru-pink/10 transition"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 12h17M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18" />
                      </svg>
                    </a>
                  )}
                  {author.socials.instagram && (
                    <a
                      href={author.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${author.name} on Instagram`}
                      className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-tru-pink hover:bg-tru-pink/10 transition"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-.75a1 1 0 100 2 1 1 0 000-2z" />
                      </svg>
                    </a>
                  )}
                  {author.socials.linkedin && (
                    <a
                      href={author.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${author.name} on LinkedIn`}
                      className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-tru-pink hover:bg-tru-pink/10 transition"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 17V10.5H6.17V17h2.17zM7.25 9.31a1.26 1.26 0 100-2.52 1.26 1.26 0 000 2.52zM18 17v-3.57c0-1.9-.41-3.36-2.63-3.36-1.07 0-1.79.59-2.08 1.14h-.03V10.5h-2.08V17h2.17v-3.21c0-.85.16-1.67 1.21-1.67 1.04 0 1.05.97 1.05 1.73V17H18z" />
                      </svg>
                    </a>
                  )}
                  {author.socials.tiktok && (
                    <a
                      href={author.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${author.name} on TikTok`}
                      className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-tru-pink hover:bg-tru-pink/10 transition"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ARTICLES ===================== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="h-px bg-white/10 mb-8" />
        {authored.length > 0 ? (
          <>
            <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">
              Words by <span className="text-tru-pink">{firstName}</span>
              <span className="text-gray-500 text-sm font-normal ml-3">
                {authored.length} {authored.length === 1 ? "story" : "stories"}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {authored.map((story) => (
                <StoryCard key={story.id} story={story} isLoggedIn />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-400">Check back soon for stories from {author.name}.</p>
        )}
      </section>

      <BackToTop />
    </div>
  );
}
