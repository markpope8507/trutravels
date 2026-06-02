"use client";

import { useState } from "react";
import { experienceTypes } from "@/lib/data";

type Activity = {
  name: string;
  experienceType?: string;
};

type TruExclusive = {
  name: string;
  description: string;
};

export default function ActivitiesTabs({
  activities,
  truExclusive,
}: {
  activities: Activity[];
  truExclusive?: TruExclusive;
}) {
  // Build tabs from experience types present in activities + "All"
  const expTypeIds = [...new Set(activities.map((a) => a.experienceType).filter(Boolean))] as string[];
  const tabs = [
    { id: "all", label: "All", emoji: "", color: "#ffffff" },
    ...expTypeIds.map((id) => {
      const exp = experienceTypes.find((e) => e.id === id);
      return {
        id,
        label: exp?.name || id,
        emoji: exp?.emoji || "",
        color: exp?.color || "#ffffff",
      };
    }),
  ];

  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? activities
      : activities.filter((a) => a.experienceType === activeTab);

  const activeExp = activeTab !== "all" ? experienceTypes.find((e) => e.id === activeTab) : null;

  // Show tru-ly unique tab content with truExclusive detail
  const isTrulyUnique = activeTab === "tru-ly-unique";

  return (
    <div>
      {/* Intro explainer — what the tabs are and why we use them */}
      <div className="rounded-[12px] border border-white/10 bg-white/[0.04] p-5 mb-5">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.22em] mb-2 font-heading">
          The Tru Approach
        </p>
        <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl mb-3 leading-tight">
          5 Experience Types &middot; 1 Intentional Journey
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          Every Tru trip is intentionally designed around five core experience types — each one plays a role in shaping your journey. Tap <span className="text-white font-semibold">All</span> for the full activity list, or pick a type below to see how it shows up on this adventure.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {experienceTypes.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setActiveTab(e.id)}
              className="rounded-[10px] border bg-white/5 px-3 py-2.5 text-center hover:bg-white/10 transition-colors"
              style={{ borderColor: `${e.color}40` }}
            >
              <p className="text-base leading-none">{e.emoji}</p>
              <p
                className="text-[10px] font-bold uppercase tracking-wider font-heading mt-1.5"
                style={{ color: e.color }}
              >
                {e.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-400 bg-white/5 hover:text-white hover:bg-white/10"
            }`}
            style={
              activeTab === tab.id
                ? { background: tab.id === "all" ? "rgba(255,255,255,0.15)" : tab.color }
                : undefined
            }
          >
            {tab.emoji && <span className="mr-1">{tab.emoji}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Experience type description */}
      {activeExp && (
        <div
          className="rounded-[10px] px-4 py-4 mb-4 border"
          style={{ borderColor: `${activeExp.color}30`, background: `${activeExp.color}08` }}
        >
          <p className="text-white text-sm font-semibold mb-1">{activeExp.emoji} {activeExp.name}</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">{activeExp.description}</p>
          <p className="text-gray-400 text-xs italic">{activeExp.message}</p>
        </div>
      )}

      {/* TruExclusive highlight when on tru-ly-unique tab */}
      {isTrulyUnique && truExclusive && (
        <div
          className="rounded-[10px] border border-tru-green/30 bg-tru-green/5 p-5 mb-4"
        >
          <p className="text-[10px] text-tru-green font-bold uppercase tracking-wider font-heading mb-1">
            Tru-ly Unique Experience
          </p>
          <p className="text-white font-semibold text-sm mb-2">{truExclusive.name}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{truExclusive.description}</p>
        </div>
      )}

      {/* Activity list */}
      <div className="space-y-1.5">
        {filtered.map((activity) => {
          const expType = activity.experienceType
            ? experienceTypes.find((e) => e.id === activity.experienceType)
            : null;
          return (
            <div
              key={activity.name}
              className="flex items-center gap-3 rounded-[10px] border border-white/5 bg-white/5 px-4 py-3"
            >
              <div className="h-6 w-6 rounded-full bg-tru-green/20 flex items-center justify-center flex-shrink-0">
                <svg className="h-3 w-3 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-200 text-sm flex-1">{activity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
