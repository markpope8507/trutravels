"use client";

import Link from "next/link";
import MemberGate from "@/components/member-gate";
import BookingHistory from "@/components/booking-history";

function BookingsContent() {
  return (
    <div className="pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/member/dashboard" className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition mb-6">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </Link>

      <div className="mb-8">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Your Account</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight">My Bookings</h1>
      </div>

      <BookingHistory />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <MemberGate>
      <BookingsContent />
    </MemberGate>
  );
}
