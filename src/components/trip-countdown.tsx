"use client";

import { useEffect, useState } from "react";

/**
 * The countdown to a trip going on sale.
 *
 * ONE HOOK, TWO SIZES. The launch card shows it as four labelled boxes; the
 * sticky bar shows the same numbers in a single line. Both read `useCountdown`,
 * so they can never disagree about how long is left.
 *
 * HYDRATION. The server has no idea what time it is in the visitor's browser,
 * so rendering a live figure on the server guarantees a mismatch. `useCountdown`
 * returns null until the first client tick and the callers render a placeholder
 * of the same shape — no flash, no hydration error.
 *
 * It ticks once a second and stops itself at zero, then reports `done` so the
 * page can swap to whatever comes next rather than sitting on 00:00:00:00.
 */

export type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

export function useCountdown(iso: string): TimeLeft | null {
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(iso).getTime();

    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) {
        setLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
        return true;
      }
      const s = Math.floor(ms / 1000);
      setLeft({
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
        done: false,
      });
      return false;
    };

    if (tick()) return;
    const id = setInterval(() => {
      if (tick()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [iso]);

  return left;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Four labelled boxes — the launch card's version. */
export function CountdownBoxes({ iso }: { iso: string }) {
  const left = useCountdown(iso);
  const parts: [string, string][] = [
    ["Days", left ? String(left.days) : "—"],
    ["Hrs", left ? pad(left.hours) : "—"],
    ["Mins", left ? pad(left.minutes) : "—"],
    ["Secs", left ? pad(left.seconds) : "—"],
  ];

  return (
    <div className="grid grid-cols-4 gap-2" aria-live="off">
      {parts.map(([label, value]) => (
        <div key={label} className="rounded-[10px] border border-white/10 bg-white/5 py-3 text-center">
          <p className="font-heading text-2xl font-black leading-none text-white tabular-nums sm:text-3xl">{value}</p>
          <p className="mt-1.5 font-heading text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
}

/** One line — the sticky bar's version. Drops days once inside 24 hours,
 *  because at that point the hours are the interesting part. */
export function CountdownInline({ iso, className = "" }: { iso: string; className?: string }) {
  const left = useCountdown(iso);
  if (!left) return <span className={`tabular-nums ${className}`}>--:--:--</span>;
  if (left.done) return <span className={className}>Live now</span>;
  return (
    <span className={`tabular-nums ${className}`}>
      {left.days > 0 && `${left.days}d `}
      {pad(left.hours)}:{pad(left.minutes)}:{pad(left.seconds)}
    </span>
  );
}
