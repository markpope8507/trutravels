"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/lib/use-scroll-lock";
import NewsletterFields from "@/components/newsletter-fields";

/**
 * The footer's mailing-list sign-up, as a popup.
 *
 * The list asks for four things — email, first and last name, nationality —
 * and four fields in the footer strip would crowd it. So the strip keeps a
 * single email-shaped field, and clicking it opens this with the full form.
 *
 * Same fields and copy as /email-sign-up (both use NewsletterFields), so a
 * sign-up looks the same whichever way someone came in.
 *
 * NO BACKEND — `onSubmit` is where the POST goes.
 *
 * Mirrored by converted/components/mailing-list-modal.html.
 */
export default function MailingListModal({
  onClose,
  onSubscribed,
}: {
  onClose: () => void;
  onSubscribed: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => setMounted(true), []);
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Join the mailing list"
        className="relative mx-4 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-[10px] border border-white/10 bg-tru-navy"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="min-w-0">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">Newsletter</p>
            <p className="truncate font-heading text-sm font-black uppercase tracking-tight text-white">
              Join The TruCrew
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 transition hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {done ? (
            <div className="py-6 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-tru-pink/30 bg-tru-pink/15">
                <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h3 className="mb-2 font-heading text-xl font-black uppercase tracking-tight text-white">
                You&rsquo;re In The <span className="text-tru-pink">TruCrew</span>
              </h3>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-300">
                Check your inbox — there&rsquo;s a welcome email on its way, and the next drop lands there first.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-[10px] bg-tru-pink px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light"
              >
                Done
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
                onSubscribed();
              }}
            >
              <p className="mb-6 text-sm leading-relaxed text-gray-300">
                Be the first to hear about new tours, deals and destinations. No account needed.
              </p>
              <NewsletterFields idPrefix="ml" autoFocusEmail />
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
