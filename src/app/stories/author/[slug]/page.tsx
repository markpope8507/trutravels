import Link from "next/link";
import { notFound } from "next/navigation";
import { stories, storyArticles } from "@/lib/data";
import { authors, getAuthorBySlug, getAuthorByName } from "@/lib/authors";
import BackToTop from "@/components/back-to-top";

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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

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
              {authored.map((story) => {
                const href = storyArticles[story.id] ? `/stories/${story.id}` : `/stories#${story.id}`;
                return (
                  <Link
                    key={story.id}
                    href={href}
                    className="group block rounded-[12px] overflow-hidden border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-2">
                        {story.category} &middot; {story.readTime} min read
                      </p>
                      <h3 className="text-white font-black text-lg uppercase font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">{story.excerpt}</p>
                      <p className="text-gray-500 text-xs">{formatDate(story.date)}</p>
                    </div>
                  </Link>
                );
              })}
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
