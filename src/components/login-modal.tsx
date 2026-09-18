"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SocialButton, Field, GoogleIcon, FacebookIcon, AppleIcon } from "@/components/join-community";

/* Log-in popup — same styling as the join/sign-up modal. Social shortcuts
   (Google / Facebook / Apple), email + password, remember me, and a CTA to
   create an account (switches to the sign-up modal via onSignup). */
export function LoginModal({ onClose, onSignup }: { onClose: () => void; onSignup: () => void }) {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  /* "reset" is a third view of this modal, not a separate route — the person is
     mid-login, so bouncing them to another page loses that context. */
  const [reset, setReset] = useState<null | "form" | "sent">(null);

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && password.length > 0 && !submitting;

  const finish = (withEmail: string) => {
    login(withEmail, password || "social-login");
    onClose();
    router.push("/my-account/dashboard");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    finish(email);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Log in to TruTravels"
    >
      {/* Backdrop */}
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-tru-navy/80 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1626] shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Reset view. Replaces the login card rather than sitting beside it,
              so the person isn't looking at two forms at once. Says "if that
              address is registered" rather than confirming the account exists —
              telling an anonymous visitor which emails have accounts is an
              account-enumeration leak. */}
          {reset && (
            <>
              <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 font-heading">
                No Bother
              </p>
              <h2 className="text-xl font-black text-white uppercase font-heading leading-tight mb-1">
                Reset Your Password
              </h2>

              {reset === "form" ? (
                <>
                  <p className="text-gray-400 text-sm mb-5">
                    Give us the email you signed up with and we&apos;ll send a link to set a new one.
                  </p>
                  <form
                    onSubmit={(e) => { e.preventDefault(); if (email.trim()) setReset("sent"); }}
                    className="space-y-3"
                  >
                    <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
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
                    If <b className="text-white break-all">{email.trim()}</b> is registered with us, a reset link is on
                    its way. It expires in an hour.
                  </p>
                </div>
              )}

              <p className="text-center text-xs text-gray-400 mt-5">
                Remembered it?{" "}
                <button type="button" onClick={() => setReset(null)} className="text-tru-pink hover:text-tru-pink-light font-semibold transition">
                  Back to log in
                </button>
              </p>
            </>
          )}

          {!reset && (
          <>
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 font-heading">
            Welcome Back
          </p>
          <h2 className="text-xl font-black text-white uppercase font-heading leading-tight mb-1">
            Log In
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            Pick up right where you left off.
          </p>

          {/* Social login — icon only */}
          <div className="flex items-center justify-center gap-4">
            <SocialButton label="Log in with Google" onClick={() => finish("traveller@gmail.com")} icon={<GoogleIcon />} />
            <SocialButton label="Log in with Facebook" onClick={() => finish("traveller@facebook.com")} icon={<FacebookIcon />} />
            <SocialButton label="Log in with Apple" onClick={() => finish("traveller@icloud.com")} icon={<AppleIcon />} />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-gray-500 text-[11px] uppercase tracking-wider font-heading">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* Email + password */}
          <form onSubmit={handleLogin} className="space-y-3">
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Your password"
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-tru-pink rounded"
                />
                <span className="text-xs text-gray-300">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setReset("form")}
                className="text-xs text-tru-pink hover:text-tru-pink-light transition"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-[10px] py-3 text-sm font-bold uppercase tracking-wider font-heading border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FFD814", borderColor: "#FCD200", color: "#0F1111" }}
            >
              Log In &rarr;
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-5">
            New to TruTravels?{" "}
            <button onClick={onSignup} className="text-tru-pink font-semibold hover:text-tru-pink-light transition">
              Create an account
            </button>
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
