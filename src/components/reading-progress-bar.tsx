"use client";

import { useEffect, useState } from "react";

/**
 * Thin reading-progress indicator fixed to the very top of the viewport.
 * Tracks how far the reader has scrolled through the page (0 → 100%).
 */
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const scrolled = window.scrollY || el.scrollTop;
      const pct = max > 0 ? scrolled / max : 0;
      setProgress(Math.min(1, Math.max(0, pct)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-1.5 bg-white/5 pointer-events-none"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-full bg-tru-pink"
        style={{
          width: `${progress * 100}%`,
          boxShadow: "0 0 10px rgba(255, 63, 153, 0.6)",
        }}
      />
    </div>
  );
}
