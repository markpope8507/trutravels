"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * "Join Our Community" CTA buttons + signup modal for the home page.
 * Offers one-tap social sign-up (Google / Facebook / Apple) plus a simple
 * email + password / confirm-password form with live, pink validation ticks.
 */
export default function JoinCommunity() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded-[10px] bg-tru-green px-8 py-3.5 text-sm font-semibold text-tru-navy hover:bg-tru-green-light transition-all duration-300 text-center uppercase tracking-wider"
        >
          Join Free Today
        </button>
        <button
          onClick={() => setOpen(true)}
          className="rounded-[10px] border border-tru-pink px-8 py-3.5 text-sm font-semibold text-tru-pink hover:bg-tru-pink hover:text-white transition-all duration-300 text-center uppercase tracking-wider"
        >
          Already a member? Log in
        </button>
      </div>

      {open && <SignupModal onClose={() => setOpen(false)} />}
    </>
  );
}

export function SignupModal({ onClose }: { onClose: () => void }) {
  const { signup } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
  const longEnough = password.length >= 8;
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const canSubmit = emailValid && longEnough && passwordsMatch && !submitting;

  const finish = (name: string, withEmail: string) => {
    signup(name, withEmail, password || "social-signup");
    onClose();
    router.push("/member/dashboard");
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    finish(email.split("@")[0], email);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Join the TruTravels community"
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-tru-navy/80 backdrop-blur-sm"
      />

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

          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 font-heading">
            Join Our Community
          </p>
          <h2 className="text-xl font-black text-white uppercase font-heading leading-tight mb-1">
            Create Your Free Account
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            One free account unlocks everything. No catch.
          </p>

          {/* Email + password form */}
          <form onSubmit={handleEmailSignup} className="space-y-3">
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
              placeholder="Create a password"
              autoComplete="new-password"
            />
            <Field
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />

            {/* Pink validation ticks */}
            <ul className="space-y-1 pt-0.5">
              <Requirement met={longEnough} label="At least 8 characters" />
              <Requirement met={passwordsMatch} label="Passwords match" />
            </ul>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-[10px] py-3 text-sm font-bold uppercase tracking-wider font-heading border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#FFD814",
                borderColor: "#FCD200",
                color: "#0F1111",
              }}
            >
              Create Free Account &rarr;
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-gray-500 text-[11px] uppercase tracking-wider font-heading">
              or
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* Social sign-up — icon only */}
          <div className="flex items-center justify-center gap-4">
            <SocialButton
              label="Sign up with Google"
              onClick={() => finish("Traveller", "traveller@gmail.com")}
              icon={<GoogleIcon />}
            />
            <SocialButton
              label="Sign up with Facebook"
              onClick={() => finish("Traveller", "traveller@facebook.com")}
              icon={<FacebookIcon />}
            />
            <SocialButton
              label="Sign up with Apple"
              onClick={() => finish("Traveller", "traveller@icloud.com")}
              icon={<AppleIcon />}
            />
          </div>

          <p className="text-center text-gray-500 text-xs mt-5">
            Already a member?{" "}
            <button
              onClick={() => {
                onClose();
                router.push("/login");
              }}
              className="text-tru-pink font-semibold hover:text-tru-pink-light transition"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function SocialButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="h-12 w-12 rounded-full bg-tru-navy border border-white/10 flex items-center justify-center hover:border-tru-pink/40 hover:scale-105 transition-all duration-200"
    >
      <span className="h-6 w-6 flex items-center justify-center">{icon}</span>
    </button>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 font-heading mb-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-[10px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-tru-pink/60 focus:bg-white/10 transition"
      />
    </label>
  );
}

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <span
        className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          met ? "bg-tru-pink" : "bg-white/10"
        }`}
      >
        <svg
          className={`h-2.5 w-2.5 ${met ? "text-white" : "text-gray-500"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className={met ? "text-tru-pink font-medium" : "text-gray-500"}>
        {label}
      </span>
    </li>
  );
}

/* ---------------- Brand icons ---------------- */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#fff">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.04.28.04.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
  );
}
