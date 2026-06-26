import Link from "next/link";
import { stories } from "@/lib/data";

export default function RelatedStories({
  region,
  country,
}: {
  region: string;
  country: string;
}) {
  // Prefer stories tagged with this tour's country; top up with region matches.
  const byCountry = stories.filter((s) => s.destinations.includes(country));
  const byRegion = stories.filter(
    (s) => s.destinations.includes(region) && !s.destinations.includes(country),
  );
  const related = [...byCountry, ...byRegion].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
        Stories · From The Blog
      </p>
      <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-3 leading-[0.95]">
        Read More About <span className="text-tru-pink">{country}</span>
      </h2>
      <p className="text-gray-400 mt-3 max-w-lg text-sm sm:text-base mb-8">
        Guides, tips and tales from the road — get under the skin of {country} before you go.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((story) => {
          return (
            <Link
              key={story.id}
              href={`/stories#${story.id}`}
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
                  {story.category} · {story.readTime} min read
                </p>
                <h3 className="text-white font-black text-lg uppercase font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{story.excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
