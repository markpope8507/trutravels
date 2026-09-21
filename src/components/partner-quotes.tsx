"use client";

import { useEffect, useState } from "react";
import { PARTNERS } from "@/lib/partners";

/**
 * Testimonials, image-led — the same shape as a trip card: a photo, the
 * partner's mark overlaid on it, and the words underneath.
 *
 * The logo keeps its white tile even over a photo: two of the six marks are
 * solid black and every one is a different colour, so a mark laid straight onto
 * an image would be unreadable on at least one card. It sits on the scrim at
 * the foot of the photo, where the image is darkest and quietest.
 *
 * A partner with a video gets a play badge and its media becomes a button that
 * opens the lightbox — the same idea as the accommodation cards' zoom. Client
 * component for that reason alone; everything else here is static.
 *
 * !!! THE QUOTES ARE SAMPLE COPY. !!! See lib/partners.ts — nobody at these
 * companies said any of it, and it must be replaced before this page is shown
 * outside the company.
 *
 * Mirrored by .ptn-quote in converted/styles.css.
 */
export default function PartnerQuotes() {
  const [open, setOpen] = useState<string | null>(null);
  const active = PARTNERS.find((p) => p.slug === open) ?? null;

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PARTNERS.map((p) => {
          const media = (
            <>
              <img
                src={p.photo}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/85 via-tru-navy/15 to-transparent" />
              {p.video && (
                /* Always visible, not hover-only — on a touch screen there is no
                   hover, and the badge is the only thing saying this is a video. */
                <span className="absolute inset-0 z-[1] flex items-center justify-center">
                  <span className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-tru-pink/90 shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition group-hover:scale-105">
                    <svg className="ml-[3px] h-[1.375rem] w-[1.375rem] text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              )}
              <span className="absolute bottom-4 left-4 z-[2] flex items-center rounded-[10px] bg-white px-3 py-2">
                <img
                  src={`/partners/${p.slug}.png`}
                  alt={p.name}
                  width={p.w}
                  height={p.h}
                  loading="lazy"
                  className="h-8 max-w-[7.5rem] w-auto object-contain"
                />
              </span>
            </>
          );

          return (
            <article
              key={p.slug}
              className="group snap-start shrink-0 w-[85%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]
                         flex flex-col overflow-hidden rounded-[10px] border border-white/10 bg-tru-navy"
            >
              {p.video ? (
                <button
                  type="button"
                  onClick={() => setOpen(p.slug)}
                  aria-label={`Play the ${p.name} trip video`}
                  className="relative aspect-[5/3] w-full overflow-hidden text-left"
                >
                  {media}
                </button>
              ) : (
                <div className="relative aspect-[5/3] overflow-hidden">{media}</div>
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="flex-1 mb-5 text-[0.9375rem] leading-[1.7] text-gray-300">&ldquo;{p.quote}&rdquo;</p>
                <p className="text-sm font-bold text-white">
                  {p.name}
                  <span className="mt-0.5 block text-[0.8125rem] font-normal text-gray-500">{p.what}</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {active?.video && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 p-4">
          <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute inset-0" />
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative z-[1] w-full max-w-4xl">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            {/* No autoPlay: unmuted autoplay is blocked by every browser and does
                not fall back to muted, so the attribute would just be a lie in
                the markup. The viewer presses play. */}
            <video
              controls
              playsInline
              poster={active.photo}
              className="block max-h-[75vh] w-full rounded-[10px] bg-black"
            >
              <source src={active.video} type="video/mp4" />
            </video>
            <h3 className="mt-4 font-heading text-lg font-bold text-white">{active.name}</h3>
            <p className="text-sm leading-relaxed text-gray-300">{active.what}</p>
          </div>
        </div>
      )}
    </>
  );
}
