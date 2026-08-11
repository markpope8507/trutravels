"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SocialButton, Field, GoogleIcon, FacebookIcon, AppleIcon } from "@/components/join-community";

/* Full-page login — same design as the LoginModal, on a centred card with the
   TruTravels logo above and a link back home. Social shortcuts (Google /
   Facebook / Apple), email + password, remember me, and a CTA to create an
   account. */
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && password.length > 0 && !submitting;

  const finish = (withEmail: string) => {
    login(withEmail, password || "social-login");
    router.push("/member/dashboard");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    finish(email);
  };

  return (
    <div className="pt-28 pb-16 flex items-center justify-center min-h-[80vh] px-4">
      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1626] shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
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
              <button type="button" className="text-xs text-tru-pink hover:text-tru-pink-light transition">
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
            <Link href="/signup" className="text-tru-pink font-semibold hover:text-tru-pink-light transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
