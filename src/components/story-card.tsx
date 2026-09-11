import Link from "next/link";
import { storyArticles, type Story, MEMBER_CONTENT_ENABLED } from "@/lib/data";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function StoryCard({
  story,
  isLoggedIn,
}: {
  story: Story;
  isLoggedIn: boolean;
}) {
  const isLocked = MEMBER_CONTENT_ENABLED && !!story.memberOnly && !isLoggedIn;
  const hasArticle = !!storyArticles[story.id];
  const cardHref = isLocked
    ? "/signup"
    : hasArticle
      ? `/stories/${story.id}`
      : `/stories#${story.id}`;
  return (
    <Link href={cardHref} className="group relative block h-full">
      <div
        className="relative overflow-hidden rounded-[10px] bg-tru-navy border border-white/10 hover:border-tru-pink/30 transition-all duration-300 h-full flex flex-col"
        style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
      >
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={story.image}
            alt={story.title}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isLocked ? "blur-[2px]" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-black/30" />
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
          {MEMBER_CONTENT_ENABLED && story.memberOnly && (
            <span className="absolute top-3 right-3 bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider font-heading px-3 py-1 rounded-full">
              Exclusive
            </span>
          )}
          <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider font-heading px-2.5 py-1 rounded-full">
            {story.readTime} min
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-wider mb-1 font-heading">
            {story.category}
          </p>
          <h3 className="text-lg font-bold text-white group-hover:text-tru-pink transition mb-2 leading-snug">
            {story.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{story.excerpt}</p>
          <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              <span className="text-white font-semibold">{story.author}</span> &middot;{" "}
              {formatDate(story.date)}
            </p>
            <span className="text-xs text-tru-pink font-semibold uppercase tracking-wider group-hover:text-tru-pink-light transition whitespace-nowrap">
              {isLocked ? "Join to read" : "Read story"} &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
