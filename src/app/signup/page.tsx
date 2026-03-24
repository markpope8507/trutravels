"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const success = signup(name, email, password);
    if (success) {
      router.push("/member/dashboard");
    } else {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="pt-28 flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join TruTravels</h1>
          <p className="text-gray-400">Create your free account and leave ordinary behind</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-8 border border-white/10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition"
              placeholder="Your name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-amber-400 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
          >
            Create Account
          </button>

          <div className="mt-6 space-y-3">
            <p className="text-center text-xs text-gray-500">What you get as a member:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {[
                "Personalised recommendations",
                "Member-only trips",
                "Exclusive stories & guides",
                "Community access",
                "Early access to new trips",
                "Special member deals",
              ].map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <svg className="h-3 w-3 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {perk}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already a member?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 transition">
              Log in
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          This is a prototype — any details will work.
        </p>
      </div>
    </div>
  );
}
