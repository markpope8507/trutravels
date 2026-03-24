"use client";

import MemberGate from "@/components/member-gate";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  return (
    <MemberGate>
      <ProfileContent />
    </MemberGate>
  );
}

function ProfileContent() {
  const { user } = useAuth();

  return (
    <div className="pt-28 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

      {/* Profile card */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="h-20 w-20 rounded-full bg-amber-400 text-black flex items-center justify-center text-2xl font-bold">
            {user?.avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-amber-400 text-xs mt-1">Member since {user?.memberSince}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Travel preferences */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Travel Preferences</h3>
        <p className="text-gray-400 text-sm mb-4">
          Help us personalise your experience. Select the types of travel you love.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Beach & Islands",
            "Culture & History",
            "Adventure & Outdoors",
            "Food & Cooking",
            "Nightlife & Parties",
            "Wellness & Yoga",
            "Wildlife & Safari",
            "City Breaks",
            "Off the Beaten Track",
          ].map((pref) => (
            <button
              key={pref}
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-300 hover:border-amber-400 hover:text-amber-400 transition"
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Your Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-amber-400">0</p>
            <p className="text-gray-400 text-xs">Trips Taken</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">3</p>
            <p className="text-gray-400 text-xs">Saved Trips</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">1</p>
            <p className="text-gray-400 text-xs">Countries</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}
