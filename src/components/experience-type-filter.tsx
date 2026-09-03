"use client";

import { experienceTypes } from "@/lib/data";

export type ExperienceTab = {
  id: string;
  label: string;
  icon: string;
  color: string;
};

export function experienceTabsForIds(presentIds: Set<string>): ExperienceTab[] {
  return [
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
}

export default function ExperienceTypeFilter({
  presentIds,
  activeTab,
  onChange,
  intro = "Every Tru trip is intentionally designed around five core experience types — each one plays a role in shaping your journey. Pick a type below to see how it shows up on this adventure.",
}: {
  presentIds: Set<string>;
  activeTab: string;
  onChange: (id: string) => void;
  intro?: string;
}) {
  const tabs = experienceTabsForIds(presentIds);
  const activeExp =
    activeTab !== "all" ? experienceTypes.find((e) => e.id === activeTab) : null;

  return (
    <div>
      <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-tru-pink">
        5 Experience Types &middot; 1 Intentional Journey
      </p>
      <p className="mb-6 leading-relaxed text-gray-300">{intro}</p>

      <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-2.5 rounded-[10px] border p-3 text-center transition-all duration-200 ${
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
              <span className="flex h-10 w-10 items-center justify-center">
                {tab.icon ? (
                  <img src={tab.icon} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
                ) : (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </span>
              <span className="font-heading text-[10px] font-semibold uppercase leading-tight tracking-wider sm:text-[11px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {activeExp && (
        <div
          className="mb-4 flex flex-col gap-4 rounded-[10px] border px-4 py-5 sm:flex-row sm:items-center sm:gap-6"
          style={{ borderColor: `${activeExp.color}30`, background: `${activeExp.color}08` }}
        >
          <div className="flex flex-col items-start sm:w-44 sm:flex-shrink-0">
            <img src={activeExp.icon} alt="" aria-hidden="true" className="mb-2.5 h-10 w-10 object-contain" />
            <p className="font-heading text-lg font-black uppercase leading-tight tracking-tight text-white">
              {activeExp.name}
            </p>
            <p className="mt-1 font-heading text-xs font-light uppercase tracking-[0.2em] text-tru-pink">
              Experiences
            </p>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-gray-300">{activeExp.description}</p>
        </div>
      )}
    </div>
  );
}
