"use client";

import { useState } from "react";
import { experienceTypes } from "@/lib/data";
import ImageSlider from "@/components/image-slider";

type Activity = {
  name: string;
  experienceType?: string;
  day?: number;
  image?: string;
  images?: string[];
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
        icon: e.icon,
        color: e.color,
      })),
    { id: "all", label: "All", icon: "", color: "#ffffff" },
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
      <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
        5 Experience Types &middot; 1 Intentional Journey
      </p>
      <p className="text-gray-300 leading-relaxed mb-6">
        Every Tru trip is intentionally designed around five core experience types — each one plays a role in shaping your journey. Pick a type below to see how it shows up on this adventure.
      </p>

      {/* Experience-type selector — icon above label, mirroring the inclusion cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-[10px] border p-3 flex flex-col items-center gap-2.5 text-center transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "border-white/10 bg-white/5 text-gray-400 hover:text-white hover:[border-color:var(--exp)] hover:[background-color:var(--exp-tint)]"
              }`}
              style={
                isActive
                  ? { borderColor: tab.color, background: `${tab.color}1f` }
                  : ({ "--exp": tab.color, "--exp-tint": `${tab.color}1f` } as React.CSSProperties)
              }
            >
              <span className="h-10 w-10 flex items-center justify-center">
                {tab.icon ? (
                  <img src={tab.icon} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
                ) : (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider font-heading leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Experience type description */}
      {activeExp && (
        <div
          className="rounded-[10px] px-4 py-5 mb-4 border flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
          style={{ borderColor: `${activeExp.color}30`, background: `${activeExp.color}08` }}
        >
          <div className="flex flex-col items-start sm:w-44 sm:flex-shrink-0">
            <img src={activeExp.icon} alt="" aria-hidden="true" className="h-10 w-10 object-contain mb-2.5" />
            <p className="text-white text-lg font-black uppercase font-heading tracking-tight leading-tight">{activeExp.name}</p>
            <p className="text-tru-pink text-xs font-light uppercase tracking-[0.2em] font-heading mt-1">Experiences</p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed flex-1">{activeExp.description}</p>
        </div>
      )}


      {/* Activity list — collapsible rows */}
      <div className="space-y-1.5">
        {filtered.map((activity) => {
          const isOpen = openActivity === activity.name;
          const activityImages = activity.images?.length ? activity.images : activity.image ? [activity.image] : [];
          const isExpandable = Boolean(activityImages.length || activity.description);
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
                    isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:pl-[52px] pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      {activityImages.length > 0 && (
                        <ImageSlider images={activityImages} alt={activity.name} />
                      )}
                      <div className="sm:flex-1">
                        {activity.day && (
                          <p className="text-tru-pink text-sm font-semibold uppercase tracking-wider font-heading mb-1">
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
