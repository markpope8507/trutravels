import type { ReactNode } from "react";
import InclusionGallery, { type GalleryImage } from "@/components/inclusion-gallery";

// Alternating image-gallery + text row used on The Tru Way page.
// Mobile order: title (icon + eyebrow + heading) → image gallery → body + bullets.
// Desktop: two columns (gallery one side, title/body stacked the other), alternating.
export default function FeatureRow({
  images,
  alt,
  icon,
  accent,
  eyebrow,
  title,
  body,
  bullets,
  index,
  tinted = false,
  iconBare = false,
  eyebrowAccent = true,
  eyebrowClassName = "text-xs font-bold uppercase tracking-[0.3em] mb-3 font-heading",
  titleClassName = "text-3xl sm:text-4xl font-black text-white uppercase font-heading leading-[1.05]",
}: {
  images: GalleryImage[];
  alt: string;
  icon: ReactNode;
  accent: string;
  eyebrow: ReactNode;
  title: string;
  body: string;
  bullets: string[];
  index: number;
  tinted?: boolean;
  /** Render the icon with no circle behind it. For the brand experience-type
   *  icons, which are white line art already inside their own ring — a tinted
   *  circle around one of those is a circle drawn on a circle. */
  iconBare?: boolean;
  /** Tint the eyebrow with `accent`. Off when the eyebrow sets its own colours
   *  — an inline style beats a class, so the accent would win over them. */
  eyebrowAccent?: boolean;
  eyebrowClassName?: string;
  titleClassName?: string;
}) {
  const imageLeft = index % 2 === 0;
  const textCol = imageLeft ? "lg:col-start-2" : "lg:col-start-1";
  const imgCol = imageLeft ? "lg:col-start-1" : "lg:col-start-2";

  const gridClass = tinted
    ? "grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-4 lg:items-center rounded-[16px] border p-5 sm:p-8 lg:p-10"
    : "grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-4 lg:items-center";

  return (
    <div
      className={gridClass}
      style={tinted ? { background: `${accent}0D`, borderColor: `${accent}33` } : undefined}
    >
      {/* Title */}
      <div className={`order-1 ${textCol} lg:row-start-1 lg:self-end`}>
        {iconBare ? (
          <div className="mb-4">{icon}</div>
        ) : (
          <div
            className="mb-4 h-14 w-14 rounded-full flex items-center justify-center text-2xl"
            style={{ background: `${accent}22`, border: `1px solid ${accent}66` }}
          >
            {icon}
          </div>
        )}
        <p className={eyebrowClassName} style={eyebrowAccent ? { color: accent } : undefined}>
          {eyebrow}
        </p>
        <h3 className={titleClassName}>
          {title}
        </h3>
      </div>

      {/* Gallery */}
      <div className={`order-2 ${imgCol} lg:row-start-1 lg:row-span-2`}>
        <InclusionGallery images={images} alt={alt} />
      </div>

      {/* Body + bullets */}
      <div className={`order-3 ${textCol} lg:row-start-2 lg:self-start`}>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">{body}</p>
        <ul className="space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-gray-300 text-sm">
              <span className="mt-1 h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${accent}26` }}>
                <svg className="h-2.5 w-2.5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
