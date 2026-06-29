"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function FavouriteButton({ tripId }: { tripId: string }) {
  const { isLoggedIn } = useAuth();
  const [saved, setSaved] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowPrompt(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load saved state from localStorage
  useEffect(() => {
    if (!isLoggedIn) return;
    const favs: string[] = JSON.parse(localStorage.getItem("trutravels-favourites") || "[]");
    setSaved(favs.includes(tripId));
  }, [isLoggedIn, tripId]);

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowPrompt(true);
      return;
    }

    const favs: string[] = JSON.parse(localStorage.getItem("trutravels-favourites") || "[]");
    let updated: string[];
    if (favs.includes(tripId)) {
      updated = favs.filter((id) => id !== tripId);
      setSaved(false);
    } else {
      updated = [...favs, tripId];
      setSaved(true);
    }
    localStorage.setItem("trutravels-favourites", JSON.stringify(updated));
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={handleClick}
        className="p-1 transition-colors duration-200 group"
        aria-label={saved ? "Remove from favourites" : "Save to favourites"}
      >
        {saved ? (
          <svg className="h-5 w-5 text-tru-pink" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-gray-400 group-hover:text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        )}
      </button>

      {/* Login prompt modal — portaled so it isn't clipped by transformed ancestors */}
      {showPrompt && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPrompt(false)} />
          <div className="relative w-72 rounded-[10px] border border-white/10 bg-tru-navy shadow-xl shadow-black/40 p-6 z-10 animate-fade-in text-center">
            <button
              onClick={() => setShowPrompt(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <svg className="h-10 w-10 text-tru-pink mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <p className="text-white text-base font-semibold mb-1">Save to favourites</p>
            <p className="text-gray-400 text-sm mb-5">Log in to save trips you love</p>
            <Link
              href="/login"
              onClick={() => setShowPrompt(false)}
              className="block w-full rounded-[10px] bg-tru-pink px-4 py-2.5 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-200 uppercase tracking-wider"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setShowPrompt(false)}
              className="block mt-3 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
