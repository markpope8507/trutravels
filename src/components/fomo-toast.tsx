"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Rotating social-proof / FOMO toast for trip pages. Cycles through live-viewer,
   added-to-basket, scarcity and save nudges in the bottom-left. Dismissible for
   the session. Aggregate counts only — no named individuals (GDPR). Mirrors the
   static converted/ version. */

type Variant = "live" | "basket" | "spots" | "save";
type Msg = { v: Variant; icon: ReactNode; title: ReactNode; meta: string };

const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

const PulseDot = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tru-green opacity-70" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tru-green" />
  </span>
);
/* Shopping basket — same icon as the main nav bar */
const CartIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);
const BoltIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const HeartIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const accentWrap: Record<Variant, string> = {
  live: "bg-tru-green/15 text-tru-green",
  basket: "bg-tru-pink/15 text-tru-pink",
  spots: "bg-tru-pink/15 text-tru-pink",
  save: "bg-tru-blue/20 text-tru-blue",
};

function buildQueue(): Msg[] {
  return [
    { v: "live", icon: <PulseDot />, title: (<><b className="font-extrabold text-tru-green">{rand(14, 36)}</b> people are viewing this trip</>), meta: "Right now" },
    { v: "basket", icon: <CartIcon />, title: (<><b className="font-extrabold text-tru-pink">{rand(4, 11)}</b> added this to their basket</>), meta: "In the last hour" },
    { v: "spots", icon: <BoltIcon />, title: (<>Only <b className="font-extrabold text-tru-pink">{rand(3, 6)}</b> spots left on 12 Apr</>), meta: `${rand(78, 92)}% full for this departure` },
    { v: "save", icon: <HeartIcon />, title: (<><b className="font-extrabold text-tru-blue">{rand(9, 24)}</b> travellers saved this today</>), meta: "In the last 24 hours" },
  ];
}

export default function FomoToast() {
  const [current, setCurrent] = useState<Msg | null>(null);
  const [visible, setVisible] = useState(false);
  const [gone, setGone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("truFomoDismissed") === "1") { setGone(true); return; }

    let queue = buildQueue();
    let idx = 0;
    const wait = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

    const next = () => {
      if (idx >= queue.length) { queue = buildQueue(); idx = 0; }
      setCurrent(queue[idx++]);
      wait(() => setVisible(true), 30);
      wait(() => { setVisible(false); wait(next, 700); }, 5500);
    };

    wait(next, 3500); // let the page settle first
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, []);

  const dismiss = () => {
    timers.current.forEach(clearTimeout);
    setVisible(false);
    try { sessionStorage.setItem("truFomoDismissed", "1"); } catch {}
    setTimeout(() => setGone(true), 500);
  };

  if (gone) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-5 z-[60] flex w-[330px] max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1626]/90 py-3 pl-3 pr-9 text-white shadow-2xl backdrop-blur-md transition-all duration-500 max-[640px]:left-3 max-[640px]:right-3 max-[640px]:w-auto ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-[0.97] opacity-0"
      }`}
    >
      {current && (
        <>
          <div className={`flex h-[2.6rem] w-[2.6rem] shrink-0 items-center justify-center rounded-full ${accentWrap[current.v]}`}>
            {current.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[0.82rem] font-bold leading-tight">{current.title}</p>
            <p className="mt-0.5 text-[0.66rem] font-semibold uppercase tracking-wider text-gray-400">{current.meta}</p>
          </div>
        </>
      )}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
