import Link from "next/link";
import type { Crumb } from "@/lib/breadcrumbs";

/**
 * The breadcrumb bar. One bar, one place, every page type.
 *
 * PLACEMENT
 * Directly below the hero and above the content, full-bleed with a hairline
 * under it. Every page on this site opens on a full-bleed hero with the nav
 * floating over it, so there is nowhere above the hero to put this. Below it,
 * the bar doubles as the line that separates hero from body — which is why
 * pages that already had that divider don't gain a second one.
 *
 * MOBILE
 * The trail wraps onto a second line when it runs out of room, so the whole
 * path stays visible — nothing is hidden behind a sideways scroll. Each crumb
 * keeps `whitespace-nowrap` so the break lands between crumbs, never inside a
 * name like "Thailand Island Hopper".
 *
 * A crumb with no href renders as plain text. That covers both the current
 * page and ancestors that don't exist yet (/destinations, /essentials).
 *
 * SEO
 * Emits BreadcrumbList JSON-LD. Search engines use it to show the trail in
 * results instead of a bare URL, and it's most of the reason to have
 * breadcrumbs at all beyond orientation. Only crumbs with an href go in —
 * position numbers stay contiguous because the un-built ones are dropped, not
 * numbered and skipped.
 *
 * Mirrored by .crumbs in converted/styles.css.
 */
export default function Breadcrumbs({
  crumbs,
  /** For pages with no hero. The nav floats over the page, so without a hero
   *  beneath it the bar would sit under the nav pill — this clears it. */
  noHero = false,
}: {
  crumbs: Crumb[];
  noHero?: boolean;
}) {
  // The current page is the last crumb and carries no href — it still belongs
  // in the list, as a ListItem with a name and no `item`, which is what Google
  // expects for the page you're on. Ancestors that aren't built yet are
  // dropped: a middle ListItem with no `item` isn't valid, and there is no URL
  // to give it. That leaves a gap in the hierarchy the markup can't express
  // until /destinations exists — fill in the href there and it closes itself.
  const listed = crumbs.filter((c, i) => c.href || i === crumbs.length - 1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listed.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `https://www.trutravels.com${c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={`border-b border-white/5${noHero ? " pt-24 sm:pt-28" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={`${c.name}-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                {i > 0 && <span aria-hidden className="text-gray-500">/</span>}
                {c.href ? (
                  <Link href={c.href} className="text-white transition-colors hover:text-tru-pink">
                    {c.name}
                  </Link>
                ) : (
                  /* Bold marks where you are. An un-built ancestor is also
                     un-linked but is NOT the current page, so it stays regular
                     weight — only the last crumb gets the emphasis. */
                  <span className={last ? "font-bold text-white" : "text-white"} aria-current={last ? "page" : undefined}>
                    {c.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
