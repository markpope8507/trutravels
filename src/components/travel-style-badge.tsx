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
    <img
      src={config.logo}
      alt={`${config.label} travel style`}
      className={isSmall ? "h-12" : "h-20"}
      style={{ filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.5))" }}
    />
  );
}
