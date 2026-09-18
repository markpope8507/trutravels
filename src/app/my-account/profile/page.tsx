"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import AccountGate from "@/components/account-gate";
import { useAuth } from "@/lib/auth-context";

const LABEL = "block text-sm font-medium text-gray-400 mb-2";
const INPUT =
  "w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-tru-pink transition";

const NATIONALITIES = ["British", "Irish", "Australian", "New Zealander", "Canadian", "American", "South African"];
const COUNTRIES = ["United Kingdom", "Ireland", "Australia", "New Zealand", "Canada", "United States", "South Africa"];

export default function ProfilePage() {
  return (
    <AccountGate>
      <ProfileContent />
    </AccountGate>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  /* The account stores one `name`; the form wants first and surname. Everything
     before the last space is the first name, so double-barrelled first names
     survive and a single-word name leaves the surname blank rather than
     guessing. */
  const parts = (user?.name ?? "").trim().split(/\s+/);
  const surname = parts.length > 1 ? parts[parts.length - 1] : "";
  const first = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] ?? "";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-28 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/my-account/dashboard" className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition mb-6">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

      {/* Profile card */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
        <div className="flex items-center gap-5 mb-8">
          {/* Profile image with upload */}
          <div className="relative group">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="h-20 w-20 rounded-full object-cover border-2 border-tru-pink" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-tru-pink text-white flex items-center justify-center text-2xl font-bold">
                {user?.avatar}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 h-20 w-20 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-tru-pink text-xs mt-1">Joined Tru Community in {user?.memberSince}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-tru-blue text-[10px] font-semibold uppercase tracking-wider hover:text-white transition mt-2"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {profileImage ? "Change Photo" : "Add Photo"}
            </button>
          </div>
        </div>

        {/* Modify Profile. Mirrors the fields on the live account area, with one
            change: middle name is NOT required there, which it is on the live
            form — plenty of people don't have one, and a required field you
            can't satisfy is a dead end. Optional fields say so rather than
            leaving the asterisk to carry the whole meaning. */}
        <p className="text-gray-400 text-sm mb-5">
          The name and date of birth here have to match your passport — they go on your booking.
        </p>

        <div className="mb-4">
          <label htmlFor="pf-email" className={LABEL}>
            Email Address <span className="text-tru-pink">*</span>
          </label>
          <input id="pf-email" type="email" required defaultValue={user?.email} autoComplete="email" className={INPUT} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <div className="mb-4">
            <label htmlFor="pf-first" className={LABEL}>
              First Name <span className="text-tru-pink">*</span>
            </label>
            <input id="pf-first" type="text" required defaultValue={first} autoComplete="given-name" className={INPUT} />
          </div>
          <div className="mb-4">
            <label htmlFor="pf-middle" className={LABEL}>
              Middle Name <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <input id="pf-middle" type="text" placeholder="As shown on passport" autoComplete="additional-name" className={INPUT} />
          </div>

          <div className="mb-4">
            <label htmlFor="pf-surname" className={LABEL}>
              Surname <span className="text-tru-pink">*</span>
            </label>
            <input id="pf-surname" type="text" required defaultValue={surname} autoComplete="family-name" className={INPUT} />
          </div>
          <div className="mb-4">
            <label htmlFor="pf-gender" className={LABEL}>
              Gender <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <select id="pf-gender" className={INPUT}>
              <option value="">Prefer not to say</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Self-describe</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="pf-nat" className={LABEL}>
              Nationality <span className="text-tru-pink">*</span>
            </label>
            <input id="pf-nat" type="text" required list="pf-nationalities" defaultValue="British" placeholder="Start typing…" className={INPUT} />
          </div>
          <div className="mb-4">
            <label htmlFor="pf-country" className={LABEL}>Country Of Residence</label>
            <input id="pf-country" type="text" list="pf-countries" defaultValue="United Kingdom" placeholder="Start typing…" autoComplete="country-name" className={INPUT} />
          </div>

          <div className="mb-4">
            <label htmlFor="pf-phone" className={LABEL}>Contact Number</label>
            <input id="pf-phone" type="tel" defaultValue="+44 7700 900000" autoComplete="tel" className={INPUT} />
          </div>
          <div className="mb-4">
            <label htmlFor="pf-dob" className={LABEL}>Date Of Birth</label>
            <input id="pf-dob" type="date" defaultValue="1998-07-22" autoComplete="bday" className={`${INPUT} [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50`} />
          </div>
        </div>

        <datalist id="pf-nationalities">
          {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
        </datalist>
        <datalist id="pf-countries">
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </datalist>
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
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-300 hover:border-tru-pink hover:text-tru-pink transition"
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
            <p className="text-2xl font-bold text-tru-pink">0</p>
            <p className="text-gray-400 text-xs">Trips Taken</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-tru-pink">3</p>
            <p className="text-gray-400 text-xs">Saved Trips</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-tru-pink">1</p>
            <p className="text-gray-400 text-xs">Countries</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition uppercase tracking-wider font-heading">
          Save Changes
        </button>
      </div>
    </div>
  );
}
