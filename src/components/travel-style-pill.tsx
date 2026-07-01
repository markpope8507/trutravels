import { TravelStyle, travelStyleConfig } from "@/lib/data";

export default function TravelStylePill({ style }: { style: TravelStyle }) {
  const config = travelStyleConfig[style];

  return (
    <div className="flex items-start gap-4 sm:gap-5">
      <img
        src={config.logo}
        alt={`${config.label} travel style`}
        className="h-20 sm:h-24 w-auto flex-shrink-0"
      />
      <div className="min-w-0 pt-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-heading mb-1">
          Travel Style
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">{config.description}</p>
      </div>
    </div>
  );
}
