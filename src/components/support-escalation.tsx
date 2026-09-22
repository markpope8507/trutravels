"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ContactForm from "@/components/contact-form";

// NOTE: international numbers below (except the UK line) are placeholders —
// swap in the real regional numbers when available.
const PHONE_NUMBERS = [
  { country: "United Kingdom", flag: "🇬🇧", number: "+44 203 542 2463", tel: "+442035422463" },
  { country: "Australia", flag: "🇦🇺", number: "+61 2 8320 0000", tel: "+61283200000" },
  { country: "New Zealand", flag: "🇳🇿", number: "+64 9 801 0000", tel: "+6498010000" },
  { country: "USA & Canada", flag: "🇺🇸", number: "+1 888 000 0000", tel: "+18880000000" },
  { country: "Rest of the World", flag: "🌍", number: "+44 203 542 2463", tel: "+442035422463" },
];

const OPTIONS = [
  {
    key: "chat" as const,
    label: "Live Chat",
    value: "9:30am–5pm GMT · Mon–Sat",
    action: "Start a chat",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 3v-3z",
  },
  {
    key: "email" as const,
    label: "Email Us",
    value: "Drop us a message anytime",
    action: "Send a message",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    key: "call" as const,
    label: "Call Us",
    value: "Global numbers · schedule a call",
    action: "See the options",
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
];

type Modal = null | "email" | "call";

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg my-8 rounded-[16px] border border-white/10 bg-tru-navy shadow-2xl shadow-black/50 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-heading tracking-tight">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition flex-shrink-0">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default function SupportEscalation() {
  const [modal, setModal] = useState<Modal>(null);

  const open = (key: "chat" | "email" | "call") => setModal(key === "call" ? "call" : "email");

  return (
    <section id="talk-to-a-human" className="relative overflow-hidden pb-24 scroll-mt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.05] p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Still Stuck?</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight">
              Talk To A <span className="text-tru-pink">Human</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-3 max-w-md mx-auto">
              Can&apos;t find what you&apos;re after? Our team is happy to help — take your pick.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {OPTIONS.map((c) => (
              <button
                key={c.key}
                onClick={() => open(c.key)}
                className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6 text-center hover:border-tru-pink/30 hover:bg-white/[0.05] transition-all duration-200 group"
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                  </svg>
                </div>
                <p className="text-white font-black uppercase font-heading text-sm tracking-wide mb-1">{c.label}</p>
                <p className="text-gray-400 text-xs mb-3">{c.value}</p>
                <span className="text-tru-pink text-[11px] font-bold uppercase tracking-wider font-heading group-hover:text-tru-pink-light transition">{c.action} &rarr;</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email / message modal */}
      {modal === "email" && (
        <ModalShell title="Send Us A Message" onClose={() => setModal(null)}>
          <ContactForm />
        </ModalShell>
      )}

      {/* Call modal */}
      {modal === "call" && (
        <ModalShell title="Call Us" onClose={() => setModal(null)}>
          <p className="text-gray-400 text-sm mb-5">Pick your region and give us a ring — or schedule a call and we&apos;ll come to you.</p>
          <div className="space-y-2 mb-6">
            {PHONE_NUMBERS.map((p) => (
              <a
                key={p.country}
                href={`tel:${p.tel}`}
                className="flex items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-tru-pink/30 hover:bg-white/[0.05] transition group"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="text-lg">{p.flag}</span>
                  <span className="text-white text-sm font-semibold truncate">{p.country}</span>
                </span>
                <span className="text-gray-300 text-sm font-semibold group-hover:text-tru-pink transition whitespace-nowrap">{p.number}</span>
              </a>
            ))}
          </div>
          <div className="rounded-[12px] border border-tru-pink/25 bg-tru-pink/[0.06] p-5 text-center">
            <p className="text-white text-sm font-bold uppercase font-heading tracking-wide mb-1">Prefer We Call You?</p>
            <p className="text-gray-400 text-xs mb-4">Leave your number and a good time — we&apos;ll ring you back.</p>
            <button
              onClick={() => setModal("email")}
              className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider font-heading transition"
            >
              Schedule A Call
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </ModalShell>
      )}
    </section>
  );
}
