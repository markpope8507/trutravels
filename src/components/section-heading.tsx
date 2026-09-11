import type { ReactNode } from "react";
import PillButton from "@/components/pill-button";

/**
 * The site's standard section header — pink eyebrow in spaced caps above a
 * Montserrat Black uppercase title, with an optional PillButton on the right
 * (the same "view all / see all" pill the homepage uses).
 *
 * Spacing mirrors the explore page's in-page section header (the "Recently
 * Viewed" row above its carousel): 11px eyebrow at 0.22em tracking, tight
 * leading on the title, mb-5 on the block. Kept in one component so interior
 * pages don't drift into their own styling.
 */
export default function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  href?: string;
  linkLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.22em] font-heading mb-1">
          {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
          {title}
        </h2>
        {children}
      </div>
      {href && (
        <PillButton href={href} className="flex-shrink-0">
          {linkLabel}
        </PillButton>
      )}
    </div>
  );
}
