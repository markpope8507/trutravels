"use client";

import { useState } from "react";

export type Faq = { q: string; a: string };

function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors duration-200"
      >
        <span className="text-white text-sm sm:text-base font-semibold pr-2">{faq.q}</span>
        <svg
          className={`h-4 w-4 text-tru-pink flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-gray-300 text-sm leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-2.5">
      {faqs.map((faq) => (
        <FaqItem key={faq.q} faq={faq} />
      ))}
    </div>
  );
}
