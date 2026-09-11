"use client";

import Link from "next/link";
import AccountGate from "@/components/account-gate";
import { useAuth } from "@/lib/auth-context";

const mockPosts = [
  {
    id: 1,
    author: "Sophie Chen",
    avatar: "SC",
    time: "2 hours ago",
    content: "Just got back from the Thailand Island Hopper — honestly life-changing. The Full Moon Party was next level and the snorkelling at Koh Tao was unreal. Already planning my next one!",
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    author: "Jake Morrison",
    avatar: "JM",
    time: "5 hours ago",
    content: "Anyone done the Bali trip? Thinking about booking for September. Would love to hear your highlights!",
    likes: 12,
    comments: 15,
  },
  {
    id: 3,
    author: "Priya Kapoor",
    avatar: "PK",
    time: "1 day ago",
    content: "Pro tip for anyone heading to Vietnam: bring a packable rain jacket. The Ha Long Bay cruise in light rain is actually incredible — misty limestone towers, zero crowds.",
    likes: 38,
    comments: 6,
  },
  {
    id: 4,
    author: "Tom Ashworth",
    avatar: "TA",
    time: "2 days ago",
    content: "Just booked the Morocco Nomad trip! Who else is going in October? Would be great to connect before we go.",
    likes: 19,
    comments: 11,
  },
];

export default function CommunityPage() {
  return (
    <AccountGate>
      <CommunityContent />
    </AccountGate>
  );
}

function CommunityContent() {
  const { user } = useAuth();

  return (
    <div className="pt-28 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/my-account/dashboard" className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition mb-6">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </Link>
      <div className="text-center mb-10">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Community</p>
        <h1 className="text-4xl font-bold text-white mb-4">The TruTravels Crew</h1>
        <p className="text-gray-400">
          Connect with fellow travellers, share stories, and plan your next adventure together.
        </p>
      </div>

      {/* New post */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-amber-400 text-black flex items-center justify-center text-sm font-bold">
            {user?.avatar}
          </div>
          <span className="text-white font-semibold">{user?.name}</span>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-gray-500 text-sm cursor-text border border-white/5">
          Share something with the community...
        </div>
        <div className="flex justify-end mt-3">
          <button className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-300 transition">
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <article key={post.id} className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center text-sm font-bold">
                {post.avatar}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{post.author}</p>
                <p className="text-gray-500 text-xs">{post.time}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-6 text-gray-500 text-xs">
              <button className="flex items-center gap-1 hover:text-amber-400 transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-amber-400 transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.comments}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
