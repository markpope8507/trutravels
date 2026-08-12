"use client";

import { useState } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { createPortal } from "react-dom";

export default function ShareButtons({
  title,
  itemLabel = "trip",
}: {
  title: string;
  itemLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  useScrollLock(open);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = encodeURIComponent(`Check out this ${itemLabel}: ${title}`);

  const options = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      hoverColor: "hover:bg-[#25D366]",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      label: "Email",
      href: `mailto:?subject=${text}&body=${text}%20${encodeURIComponent(url)}`,
      hoverColor: "hover:bg-tru-pink",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "SMS",
      href: `sms:?&body=${text}%20${encodeURIComponent(url)}`,
      hoverColor: "hover:bg-[#34C759]",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative inline-block">
      {/* Single share trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
        aria-label={`Share this ${itemLabel}`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Modal — portaled to <body> so a transformed/overflow-hidden ancestor
          (e.g. the tour hero) can't trap or clip this fixed overlay */}
      {open && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-72 rounded-[10px] border border-white/10 bg-tru-navy shadow-xl shadow-black/40 p-6 z-10 animate-fade-in">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <svg className="h-10 w-10 text-tru-pink mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <p className="text-white text-base font-semibold mb-1 text-center">Share this {itemLabel}</p>
            <p className="text-gray-400 text-sm mb-5 text-center">Send it to your travel crew</p>

            <div className="space-y-1">
              {/* Copy link — first */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
              >
                <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  {copied ? (
                    <svg className="h-4 w-4 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                </span>
                {copied ? "Copied!" : "Copy link"}
              </button>

              {options.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  target={opt.label !== "Email" ? "_blank" : undefined}
                  rel={opt.label !== "Email" ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:text-white ${opt.hoverColor} transition-all duration-200`}
                >
                  <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    {opt.icon}
                  </span>
                  {opt.label}
                </a>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
