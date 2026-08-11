"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SocialButton, Field, GoogleIcon, FacebookIcon, AppleIcon } from "@/components/join-community";

/* Full-page sign-up — same design as the SignupModal, on a centred card with
   the TruTravels logo above and a link back home. Email + password with live
   validation ticks, social shortcuts, and a CTA to log in. */
export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const longEnough = password.length >= 8;
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const canSubmit = emailValid && longEnough && passwordsMatch && !submitting;

  const finish = (name: string, withEmail: string) => {
    signup(name, withEmail, password || "social-signup");
    router.push("/member/dashboard");
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    finish(email.split("@")[0], email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-6">
        <img src="/logo-white.png" alt="TruTravels" className="h-10" />
      </Link>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1626] shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
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
              style={{ backgroundColor: "#FFD814", borderColor: "#FCD200", color: "#0F1111" }}
            >
              Create Free Account &rarr;
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-gray-500 text-[11px] uppercase tracking-wider font-heading">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* Social sign-up — icon only */}
          <div className="flex items-center justify-center gap-4">
            <SocialButton label="Sign up with Google" onClick={() => finish("Traveller", "traveller@gmail.com")} icon={<GoogleIcon />} />
            <SocialButton label="Sign up with Facebook" onClick={() => finish("Traveller", "traveller@facebook.com")} icon={<FacebookIcon />} />
            <SocialButton label="Sign up with Apple" onClick={() => finish("Traveller", "traveller@icloud.com")} icon={<AppleIcon />} />
          </div>

          <p className="text-center text-gray-500 text-xs mt-5">
            Already a member?{" "}
            <Link href="/login" className="text-tru-pink font-semibold hover:text-tru-pink-light transition">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to TruTravels
      </Link>
    </div>
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
      <span className={met ? "text-tru-pink font-medium" : "text-gray-500"}>{label}</span>
    </li>
  );
}
