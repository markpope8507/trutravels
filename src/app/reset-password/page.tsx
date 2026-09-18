"use client";

import Link from "next/link";
import { useState } from "react";
import { Field } from "@/components/join-community";

/* Full-page password reset — the same centred card as /login, reached from
   "Forgot password?" there.
 *
 * The LoginModal handles this as a third view of itself, because someone who
 * opened the modal is mid-task and shouldn't be thrown onto another page. This
 * route exists for the people who arrive at /login directly, and for the link
 * in a reset email to have somewhere to point.
 *
 * NO BACKEND — submit swaps in the confirmation. Wire the real request at the
 * marked line.
 */
export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    /* ---- wire the real request here ------------------------------
       await fetch("/api/password-reset", {
         method: "POST",
         body: JSON.stringify({ email: email.trim() }),
       });
       -------------------------------------------------------------- */
    setSent(true);
  };

  return (
    <div className="pt-28 pb-16 flex items-center justify-center min-h-[80vh] px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1626] shadow-2xl">
        <div className="p-6">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 font-heading">
            No Bother
          </p>
          <h2 className="text-xl font-black text-white uppercase font-heading leading-tight mb-1">
            Reset Your Password
          </h2>

          {!sent ? (
            <>
              <p className="text-gray-400 text-sm mb-5">
                Give us the email you signed up with and we&apos;ll send a link to set a new one.
              </p>
              <form onSubmit={submit} className="space-y-3">
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  disabled={!email.trim()}
                  className="w-full rounded-[10px] bg-tru-pink hover:bg-tru-pink-light disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 text-sm font-bold uppercase tracking-wider font-heading transition"
                >
                  Send Reset Link &rarr;
                </button>
              </form>
            </>
          ) : (
            /* Says "if that address is registered" rather than confirming the
               account exists — telling an anonymous visitor which emails have
               accounts is an account-enumeration leak. */
            <div className="text-center py-4">
              <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full border border-tru-pink/30 bg-tru-pink/15">
                <svg className="h-6 w-6 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-heading text-lg font-black uppercase tracking-tight text-white mb-1.5">
                Check Your Inbox
              </p>
              <p className="text-gray-400 text-[0.8125rem] leading-relaxed">
                If <b className="text-white break-all">{email.trim()}</b> is registered with us, a reset link is on its
                way. It expires in an hour.
              </p>
            </div>
          )}

          <p className="text-center text-gray-500 text-xs mt-5">
            Remembered it?{" "}
            <Link href="/login" className="text-tru-pink font-semibold hover:text-tru-pink-light transition">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
