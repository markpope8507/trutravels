import { TravelStyle, travelStyleConfig } from "@/lib/data";

export default function TravelStyleBadge({
  style,
  size = "default",
}: {
  style: TravelStyle;
  size?: "default" | "small";
}) {
  const config = travelStyleConfig[style];
  const isSmall = size === "small";

  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        background: config.color,
        filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.5))",
      }}
    >
      <svg
        className={isSmall ? "h-3 w-3" : "h-3.5 w-3.5"}
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
      </svg>
      <span
        className={`text-white font-bold uppercase tracking-wider font-heading ${
          isSmall ? "text-[8px]" : "text-[9px]"
        }`}
      >
        {config.label}
      </span>
    </div>
  );
}
