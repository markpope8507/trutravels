import Link from "next/link";
import { storyArticles, type Story, MEMBER_CONTENT_ENABLED } from "@/lib/data";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Wide featured story card — image left, content right. Shared by the homepage
    and the stories listing page. */
export default function FeaturedStoryCard({
  story,
  isLoggedIn,
}: {
  story: Story;
  isLoggedIn: boolean;
}) {
  const isLocked = MEMBER_CONTENT_ENABLED && !!story.memberOnly && !isLoggedIn;
  const hasArticle = !!storyArticles[story.id];
  const readHref = isLocked
    ? "/signup"
    : hasArticle
      ? `/stories/${story.id}`
      : `/stories#${story.id}`;
  return (
    <article>
      <Link href={readHref} className="group block">
        <div
          className="relative overflow-hidden rounded-[10px] bg-tru-navy border border-white/10 hover:border-tru-pink/30 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
          style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
        >
          {/* Image */}
          <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[320px]">
            <img
              src={story.image}
              alt={story.title}
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isLocked ? "blur-[3px]" : ""
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-black/30" />
            {MEMBER_CONTENT_ENABLED && story.memberOnly && (
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

          {/* Content */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
              {story.category} &middot; {story.readTime} min read
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading leading-tight mb-4 group-hover:text-tru-pink transition-colors">
              {story.title}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6 line-clamp-4">{story.excerpt}</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">{story.author}</span> &middot;{" "}
                {formatDate(story.date)}
              </p>
              <span className="text-sm text-tru-pink font-semibold uppercase tracking-wider group-hover:text-tru-pink-light transition">
                {isLocked ? "Join to read" : "Read story"} &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
