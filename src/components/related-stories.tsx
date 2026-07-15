import { stories } from "@/lib/data";
import StoryCard from "@/components/story-card";

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
        {related.map((story) => (
          <StoryCard key={story.id} story={story} isLoggedIn />
        ))}
      </div>
    </section>
  );
}
