"use client";

import { useState } from "react";
import { experienceTypes } from "@/lib/data";

type Activity = {
  name: string;
  experienceType?: string;
  day?: number;
  image?: string;
  description?: string;
};

export default function ActivitiesTabs({
  activities,
}: {
  activities: Activity[];
}) {
  // Build tabs in the canonical experience-type order (local-lens, rise-up,
  // bucket-list, tru-ly-unique, unplugged), only including types that are
  // actually present in this trip's activities.
  const presentIds = new Set(
    activities.map((a) => a.experienceType).filter(Boolean) as string[],
  );
  const tabs = [
    ...experienceTypes
      .filter((e) => presentIds.has(e.id))
      .map((e) => ({
        id: e.id,
        label: e.name,
        emoji: e.emoji,
        color: e.color,
      })),
    { id: "all", label: "All", emoji: "", color: "#ffffff" },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [openActivity, setOpenActivity] = useState<string | null>(null);

  const filtered =
    activeTab === "all"
      ? activities
      : activities.filter((a) => a.experienceType === activeTab);

  const activeExp = activeTab !== "all" ? experienceTypes.find((e) => e.id === activeTab) : null;

  return (
    <div>
      {/* Intro explainer — same typographic feel as Overview copy */}
      <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.22em] mb-3 font-heading">
        5 Experience Types &middot; 1 Intentional Journey
      </p>
      <p className="text-gray-300 leading-relaxed mb-6">
        Every Tru trip is intentionally designed around five core experience types — each one plays a role in shaping your journey. Pick a type below to see how it shows up on this adventure.
      </p>

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


      {/* Activity list — collapsible rows */}
      <div className="space-y-1.5">
        {filtered.map((activity) => {
          const isOpen = openActivity === activity.name;
          const isExpandable = Boolean(activity.image || activity.description);
          return (
            <div
              key={activity.name}
              className="rounded-[10px] border border-white/5 bg-white/5 overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  isExpandable
                    ? setOpenActivity(isOpen ? null : activity.name)
                    : undefined
                }
                disabled={!isExpandable}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                  isExpandable ? "hover:bg-white/[0.04] transition-colors" : ""
                }`}
                aria-expanded={isExpandable ? isOpen : undefined}
              >
                <div className="h-6 w-6 rounded-full bg-tru-green/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-3 w-3 text-tru-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-200 text-sm flex-1">{activity.name}</span>
                {isExpandable && (
                  <svg
                    className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {isExpandable && (
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:pl-[52px] pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                      {activity.image && (
                        <div className="rounded-lg overflow-hidden mb-3 sm:mb-0 sm:w-44 sm:h-28 sm:flex-shrink-0">
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-full h-40 sm:h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="sm:flex-1">
                        {activity.day && (
                          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider font-heading mb-1">
                            Day {activity.day}
                          </p>
                        )}
                        {activity.description && (
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
