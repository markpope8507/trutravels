"use client";

import Link from "next/link";

/**
 * "YOUR TRIP HUB" — the panel inside an expanded booking on My Bookings.
 *
 * It's the Access tab of a booking card, and it has two states driven by one
 * thing: whether the balance is cleared.
 *
 *   balance outstanding  padlock, what's waiting inside, and what's left to pay
 *   paid in full         the four things it opens, and the way in
 *
 * THE LOCK IS THE POINT. Paying the balance is the action this panel exists to
 * prompt, so the locked state sells what's behind it rather than just saying
 * no — the four icons are the same four tiles the unlocked state opens with.
 *
 * WHY IT'S A COMPONENT. It was written inline in booking-history.tsx and was
 * dropped when the account area was trimmed to phase 1 (see 9949f70), taking
 * the only copy with it. Out here it can be shown on its own — /preview/trip-hub
 * renders both states — and switched back on by listing the Access tab again.
 */

export default function BookingTripHubAccess({
  balanceDue,
  hubHref,
}: {
  /** Outstanding balance in GBP. Zero or less unlocks the panel. */
  balanceDue: number;
  /** Where "Enter Your Trip Hub" goes. */
  hubHref: string;
}) {
  return (
    <div>
{balanceDue > 0 ? (
        /* Not paid in full — locked */
        <div className="relative rounded-[10px] border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tru-pink/5 via-transparent to-tru-blue/5" />
          <div className="relative text-center py-12 px-6">
            <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
              <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="text-2xl font-black text-white uppercase font-heading tracking-tight mb-2">Your Trip Hub</p>
            <p className="text-lg font-handwriting text-tru-pink mb-4">Unlock the full experience&hellip;</p>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Once you&apos;ve paid in full, you&apos;ll unlock exclusive access to your personal trip hub — a welcome video from your tour leader, group chat with your fellow travellers, pre-departure notes, packing guides, and more.
            </p>
            <div className="flex items-center justify-center gap-6 mb-8 text-gray-500">
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-[9px] uppercase tracking-wider">Video</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-[9px] uppercase tracking-wider">Chat</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <span className="text-[9px] uppercase tracking-wider">Notes</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                </div>
                <span className="text-[9px] uppercase tracking-wider">Group</span>
              </div>
            </div>
            <div className="inline-block rounded-[10px] border border-tru-pink/30 bg-tru-pink/10 px-5 py-2 mb-5">
              <p className="text-tru-pink text-sm font-bold">&pound;{balanceDue} to unlock</p>
            </div>
            <br />
            <button className="rounded-[10px] bg-tru-pink px-8 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider font-heading">
              Make a Payment
            </button>
          </div>
        </div>
      ) : (
        /* Paid in full — unlocked */
        <div className="relative rounded-[10px] border border-tru-green/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tru-green/5 via-transparent to-tru-pink/5" />
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-tru-green/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-black text-base font-heading uppercase">Your Trip Hub</p>
                <p className="text-tru-green text-xs font-semibold">Unlocked &middot; Exclusive Access</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-5">
              Your personal trip hub is ready. Everything you need before you go — meet your tour leader, connect with your group, and get prepped for the adventure of a lifetime.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-[10px] border border-tru-pink/20 bg-tru-pink/5 p-4 text-center hover:bg-tru-pink/10 transition cursor-pointer">
                <svg className="h-6 w-6 text-tru-pink mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <p className="text-white text-xs font-bold">Welcome Video</p>
                <p className="text-gray-500 text-[9px] mt-0.5">From your tour leader</p>
              </div>
              <div className="rounded-[10px] border border-tru-blue/20 bg-tru-blue/5 p-4 text-center hover:bg-tru-blue/10 transition cursor-pointer">
                <svg className="h-6 w-6 text-tru-blue mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p className="text-white text-xs font-bold">Group Chat</p>
                <p className="text-gray-500 text-[9px] mt-0.5">Meet your group</p>
              </div>
              <div className="rounded-[10px] border border-tru-green/20 bg-tru-green/5 p-4 text-center hover:bg-tru-green/10 transition cursor-pointer">
                <svg className="h-6 w-6 text-tru-green mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-white text-xs font-bold">Trip Notes</p>
                <p className="text-gray-500 text-[9px] mt-0.5">Packing &amp; prep</p>
              </div>
              <div className="rounded-[10px] border border-tru-blue/20 bg-tru-blue/5 p-4 text-center hover:bg-tru-blue/10 transition cursor-pointer">
                <svg className="h-6 w-6 text-tru-blue mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                <p className="text-white text-xs font-bold">Your Group</p>
                <p className="text-gray-500 text-[9px] mt-0.5">See who&apos;s coming</p>
              </div>
            </div>

            <Link href={hubHref} className="block w-full rounded-[10px] bg-gradient-to-r from-tru-green to-tru-blue py-3.5 text-sm font-bold text-white hover:opacity-90 transition-all duration-300 uppercase tracking-wider font-heading text-center">
              Enter Your Trip Hub &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
