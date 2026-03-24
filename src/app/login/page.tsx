"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const success = login(email, password);
    if (success) {
      router.push("/member/dashboard");
    } else {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="pt-28 flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Log in to your TruTravels account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-8 border border-white/10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

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
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-amber-400 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
          >
            Log In
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-amber-400 hover:text-amber-300 transition">
              Join free
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          This is a prototype — any email and password will work.
        </p>
      </div>
    </div>
  );
}
