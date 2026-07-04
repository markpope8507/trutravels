"use client";

import { useState } from "react";
import FaqAccordion, { type Faq } from "@/components/faq-accordion";

// A collapsible FAQ category — big two-tone heading + description, expands to the
// question accordion.
export default function FaqSection({
  title,
  description,
  faqs,
  defaultOpen = false,
}: {
  title: string;
  description: string;
  faqs: Faq[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const words = title.split(" ");
  const accent = words.pop();
  const pre = words.join(" ");

  return (
    <div className="py-10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left group flex items-start justify-between gap-5"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-3">
            {pre} <span className="text-tru-pink">{accent}</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">{description}</p>
        </div>
        <span className="mt-1.5 h-9 w-9 flex-shrink-0 rounded-full border border-tru-pink/40 flex items-center justify-center text-tru-pink group-hover:bg-tru-pink group-hover:text-white transition-colors">
          <svg className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  );
}
