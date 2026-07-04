"use client";

import { useState } from "react";

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-[10px] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  if (sent) {
    return (
      <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-10 text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center">
          <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-white uppercase font-heading tracking-tight mb-2">
          Message <span className="text-tru-pink">Sent</span>
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          Thanks for reaching out{form.name ? `, ${form.name.split(" ")[0]}` : ""} — one of the team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-5"
    >
      <div>
        <label htmlFor="name" className="block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">
          Name <span className="text-gray-500">*</span>
        </label>
        <input id="name" type="text" required value={form.name} onChange={update("name")} placeholder="Your name" className={inputClass} />
      </div>

      <div>
        <label htmlFor="email" className="block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">
          Email <span className="text-gray-500">*</span>
        </label>
        <input id="email" type="email" required value={form.email} onChange={update("email")} placeholder="you@email.com" className={inputClass} />
      </div>

      <div>
        <label htmlFor="phone" className="block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">
          Contact Number <span className="text-gray-500">*</span>
        </label>
        <input id="phone" type="tel" required value={form.phone} onChange={update("phone")} placeholder="+44 …" className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">
          Message
        </label>
        <textarea id="message" rows={5} value={form.message} onChange={update("message")} placeholder="What's on your mind? There are no stupid questions — ask away." className={`${inputClass} resize-none`} />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-8 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
      >
        Submit
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
