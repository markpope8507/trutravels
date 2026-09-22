import Link from "next/link";

/**
 * The shared parts of a section hub — /destinations, /essentials, /about and
 * /partners.
 *
 * All four are the same page: a full-bleed hero, a breadcrumb, and a grid of
 * photo cards. They were four copies of that markup, which is how "make the
 * cards the same size as the About ones" became a thing anyone had to ask
 * for. One definition means a change to a card lands on every hub.
 *
 * The BREADCRUMB is not in here. It sits between the hero and the body in the
 * page, because each hub passes its own trail and putting it behind a prop
 * would hide the one line worth reading on these pages.
 *
 * Mirrored by converted/.build/build_hubs.py.
 */

export function HubHero({
  image,
  eyebrow,
  title,
  quote,
}: {
  image: string;
  eyebrow: string;
  title: React.ReactNode;
  quote: string;
}) {
  return (
    <section className="relative flex h-[75vh] min-h-[540px] items-center overflow-hidden">
      <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl text-right">
          <p className="mb-5 font-heading text-xs font-bold uppercase tracking-[0.3em] text-tru-pink">{eyebrow}</p>
          <h1 className="mb-6 font-heading text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <div className="mb-6 ml-auto h-px w-16 bg-tru-pink" />
          <p className="ml-auto max-w-md text-base font-light italic leading-relaxed text-gray-200 sm:text-lg">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

/** The two background marks behind a hub's card grid. */
export function HubBody({
  marks,
  children,
}: {
  marks: [{ src: string; className: string }, { src: string; className: string }];
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-16 pb-24">
      {marks.map((m) => (
        <img
          key={m.src}
          src={m.src}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute select-none brightness-0 invert ${m.className}`}
        />
      ))}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/** Three across on desktop, on the same max-w-7xl container, on every hub —
 *  which is what keeps the cards one size from section to section. */
export function HubGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">{children}</div>;
}

export function HubCard({
  href,
  image,
  name,
  description,
  external,
}: {
  href: string;
  image: string;
  name: string;
  description: string;
  /** Leaves the site — renders a plain <a> and says so on the card. */
  external?: boolean;
}) {
  const inner = (
    <>
      <img
        src={image}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
      {external && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-tru-navy/80 px-2.5 py-1 font-heading text-[9px] font-bold uppercase tracking-[0.15em] text-gray-200 backdrop-blur-sm">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5L10 14M18 14v5H5V6h5" />
          </svg>
          External
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h2 className="font-heading text-xl font-black uppercase leading-tight text-white transition-colors group-hover:text-tru-pink sm:text-2xl">
          {name}
        </h2>
        <p className="mt-1.5 text-[12px] leading-snug text-gray-200">{description}</p>
      </div>
    </>
  );

  const className = "group relative block aspect-[5/3] overflow-hidden rounded-[10px]";

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
