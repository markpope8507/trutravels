"use client";

import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";

/* Shared secondary CTA pill — used for "view all / see all / show more" style
   actions across the site. Outline-pink on desktop (fills on hover); solid pink
   on mobile, since touch devices have no hover state to reveal the fill. */
const PILL_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border px-6 py-2.5 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200 " +
  "border-tru-pink bg-tru-pink text-white active:bg-tru-pink-light " +
  "sm:border-tru-pink/40 sm:bg-transparent sm:text-tru-pink sm:hover:bg-tru-pink sm:hover:text-white sm:hover:border-tru-pink";

function ArrowIcon({ dir }: { dir: "right" | "down" }) {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={dir === "down" ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function PillButton({
  href,
  onClick,
  children,
  className = "",
  arrow = "right",
}: {
  href?: string;
  onClick?: MouseEventHandler;
  children: ReactNode;
  className?: string;
  arrow?: "right" | "down" | "none";
}) {
  const content = (
    <>
      {children}
      {arrow !== "none" && <ArrowIcon dir={arrow} />}
    </>
  );
  const classes = `${PILL_CLASS} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
