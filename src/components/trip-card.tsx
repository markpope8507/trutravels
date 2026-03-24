import Link from "next/link";
import { Trip } from "@/lib/data";
import TravelStyleBadge from "@/components/travel-style-badge";

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link href={`/destinations/${trip.id}`} className="group block">
      <div className="relative overflow-hidden rounded-[10px] aspect-[4/5]">
        {/* Image */}
        <img
          src={trip.image}
          alt={trip.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Travel style badge — top left */}
        <div className="absolute top-3 left-3">
          <TravelStyleBadge style={trip.travelStyle} />
        </div>

        {/* Member badge — top right */}
        {trip.memberOnly && (
          <div className="absolute top-3 right-3 bg-tru-pink text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-heading" style={{ filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.5))" }}>
            Members Only
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider mb-1.5 font-heading">
            {trip.region} &middot; {trip.duration}
          </p>
          <h3 className="text-lg font-bold text-white mb-2 font-heading leading-tight">{trip.title}</h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{trip.tagline}</p>
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-white text-xs">From</span>
            {trip.originalPrice && (
              <span className="text-gray-400 text-sm line-through">&pound;{trip.originalPrice}</span>
            )}
            <span className="text-tru-green font-bold text-lg">&pound;{trip.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
