"use client";

import { useState } from "react";
import ExperienceTypeFilter from "@/components/experience-type-filter";
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
  const [activeTab, setActiveTab] = useState("all");
  const [openActivity, setOpenActivity] = useState<string | null>(null);

  const filtered =
    activeTab === "all"
      ? activities
      : activities.filter((a) => a.experienceType === activeTab);

  return (
    <div>
      <ExperienceTypeFilter
        presentIds={presentIds}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

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
                <span className={`text-sm flex-1 transition-colors ${isOpen ? "text-white font-bold" : "text-gray-200"}`}>{activity.name}</span>
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
