"use client";

/**
 * A two-handle range slider on one track.
 *
 * WHY IT'S HAND-BUILT. `<input type="range">` has exactly one thumb, so a
 * min/max range has to be two of them. Stacking them as two separate rows —
 * a "Min" slider above a "Max" slider — is the easy version and the wrong
 * one: it reads as two unrelated controls, and you can't see the span you've
 * selected. These two inputs sit on top of each other over a single track,
 * with a filled bar between the handles, so it reads as one thing.
 *
 * HOW THE OVERLAY WORKS. Both inputs are full width and transparent; only
 * their thumbs take pointer events, so a click on the bare track falls
 * through to whichever input is underneath rather than being swallowed. The
 * lower input is raised above the upper one once the handles meet at the top
 * of the range — otherwise the max thumb sits on top of the min thumb and the
 * min one can never be dragged back down.
 *
 * Values are clamped against each other on change, so the handles can touch
 * but never cross.
 */

const THUMB =
  "pointer-events-none absolute inset-x-0 top-1/2 m-0 h-5 w-full -translate-y-1/2 appearance-none bg-transparent " +
  "focus:outline-none " +
  // WebKit
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-tru-pink " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-tru-navy " +
  "[&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.5)] " +
  "[&::-webkit-slider-thumb]:active:cursor-grabbing " +
  // Firefox
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-tru-pink " +
  "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-tru-navy " +
  "[&::-moz-range-track]:bg-transparent";

export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  format = String,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  step?: number;
  /** Used for the two handles' accessible names, e.g. "trip length". */
  label: string;
  /** Renders a value for the aria-valuetext, e.g. `(n) => `£${n}``. */
  format?: (n: number) => string;
}) {
  const [lo, hi] = value;
  const span = max - min || 1;
  const pct = (v: number) => ((v - min) / span) * 100;

  return (
    <div className="relative h-5 select-none">
      {/* Track */}
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/10" />
      {/* The selected span */}
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-tru-pink"
        style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        aria-label={`Minimum ${label}`}
        aria-valuetext={format(lo)}
        onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
        /* Raised once both handles are at the top, or the max thumb covers it
           and the min handle is stuck there. */
        className={THUMB}
        style={{ zIndex: lo >= max ? 4 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        aria-label={`Maximum ${label}`}
        aria-valuetext={format(hi)}
        onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
        className={THUMB}
        style={{ zIndex: 3 }}
      />
    </div>
  );
}
