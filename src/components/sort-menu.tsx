"use client";

import { useState, useRef, useEffect } from "react";

/* "Sort By" button that opens a small dropdown of options — the trigger always
   reads "Sort By" (rather than the current value), matching the filter buttons. */
export default function SortMenu({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/20 hover:border-tru-pink/50 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white font-heading transition"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h12M3 12h9M3 17h6M17 7v10m0 0l-3-3m3 3l3-3" />
        </svg>
        Sort By
        <svg className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-[10px] border border-white/10 bg-tru-navy shadow-xl shadow-black/40 z-30 p-1">
          {options.map((o) => {
            const active = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full text-left rounded-[8px] px-3 py-2 text-sm flex items-center justify-between transition ${
                  active ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {o.label}
                {active && (
                  <svg className="h-4 w-4 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
