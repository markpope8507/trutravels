"use client";

import { useAuth } from "@/lib/auth-context";
import { useAuthModal } from "@/lib/auth-modal";
import { ReactNode } from "react";

export default function AccountGate({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const { openLogin, openSignup } = useAuthModal();

  if (isLoggedIn) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-tru-pink/20 flex items-center justify-center mb-6">
        <svg className="h-8 w-8 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide font-heading">Log In To Continue</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Your account area holds your bookings, saved trips and profile. Create one free, or log in if you already have one.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={openSignup}
          className="rounded-[10px] bg-tru-green px-6 py-3 text-sm font-semibold text-tru-navy hover:bg-tru-green-light transition"
        >
          Join Free
        </button>
        <button
          type="button"
          onClick={openLogin}
          className="rounded-[10px] border border-tru-pink px-6 py-3 text-sm font-semibold text-tru-pink hover:bg-tru-pink hover:text-white transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
