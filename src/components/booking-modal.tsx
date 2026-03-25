"use client";

import { useState, useEffect } from "react";

type Departure = {
  date: string;
  price: number;
  originalPrice?: number;
  status: "available" | "almost-full" | "full" | "discount";
  discount?: string;
};

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  duration: string;
  startLocation?: string;
  endLocation?: string;
  departures: Departure[];
  depositPrice: number;
};

const statusConfig = {
  available: { label: "Available", color: "bg-tru-green", dot: "bg-tru-green" },
  "almost-full": { label: "Almost Full", color: "bg-amber-500", dot: "bg-amber-500" },
  full: { label: "Full", color: "bg-gray-500", dot: "bg-gray-500" },
  discount: { label: "On Sale", color: "bg-tru-pink", dot: "bg-tru-pink" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function getEndDate(startDate: string, duration: string) {
  const days = parseInt(duration) || 12;
  const d = new Date(startDate);
  d.setDate(d.getDate() + days - 1);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function getMonthYear(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function BookingModal({
  isOpen,
  onClose,
  tripTitle,
  duration,
  startLocation,
  endLocation,
  departures,
  depositPrice,
}: BookingModalProps) {
  const [selected, setSelected] = useState<Departure | null>(null);
  const [travellers, setTravellers] = useState(1);
  const [step, setStep] = useState<"dates" | "confirm">("dates");

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
      setTravellers(1);
      setStep("dates");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const available = departures.filter((d) => d.status !== "full");

  // Group by month
  const grouped = departures.reduce<Record<string, Departure[]>>((acc, dep) => {
    const key = getMonthYear(dep.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(dep);
    return acc;
  }, {});

  const handleSelect = (dep: Departure) => {
    if (dep.status === "full") return;
    setSelected(dep);
    setStep("confirm");
  };

  const handleBack = () => {
    setStep("dates");
  };

  const totalPrice = selected ? selected.price * travellers : 0;
  const totalDeposit = depositPrice * travellers;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] mx-4 bg-tru-navy rounded-[10px] border border-white/10 overflow-hidden flex flex-col z-10 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-white font-bold text-base">{step === "dates" ? "Choose Your Date" : "Confirm Booking"}</p>
            <p className="text-gray-400 text-xs">{tripTitle} &middot; {duration}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === "dates" ? (
            <div className="p-6">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6">
                {Object.entries(statusConfig).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${val.dot}`} />
                    <span className="text-gray-400 text-[11px]">{val.label}</span>
                  </div>
                ))}
              </div>

              {/* USPs */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-[11px] text-tru-green bg-tru-green/10 border border-tru-green/20 rounded-full px-3 py-1 font-semibold">
                  Deposit from &pound;{depositPrice}
                </span>
                <span className="text-[11px] text-tru-pink bg-tru-pink/10 border border-tru-pink/20 rounded-full px-3 py-1 font-semibold">
                  Free date change up to 60 days
                </span>
              </div>

              {/* Departure list grouped by month */}
              <div className="space-y-6">
                {Object.entries(grouped).map(([month, deps]) => (
                  <div key={month}>
                    <h3 className="text-white font-semibold text-sm mb-3 font-heading uppercase tracking-wider">{month}</h3>
                    <div className="space-y-2">
                      {deps.map((dep) => {
                        const config = statusConfig[dep.status];
                        const isFull = dep.status === "full";
                        return (
                          <button
                            key={dep.date}
                            onClick={() => handleSelect(dep)}
                            disabled={isFull}
                            className={`w-full flex items-center justify-between rounded-[10px] border px-4 py-3 transition-all duration-200 text-left ${
                              isFull
                                ? "border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed"
                                : selected?.date === dep.date
                                ? "border-tru-pink bg-tru-pink/10"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${config.dot}`} />
                              <div>
                                <p className="text-white text-sm font-medium">{formatDate(dep.date)}</p>
                                <p className="text-gray-400 text-[11px]">
                                  {config.label}
                                  {dep.discount && <span className="text-tru-pink ml-1.5">&middot; {dep.discount}</span>}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                {dep.originalPrice && dep.originalPrice !== dep.price && (
                                  <span className="text-gray-500 text-xs line-through">&pound;{dep.originalPrice}</span>
                                )}
                                <span className={`font-bold text-sm ${dep.status === "discount" ? "text-tru-pink" : "text-white"}`}>
                                  &pound;{dep.price}
                                </span>
                              </div>
                              <p className="text-gray-500 text-[10px]">per person</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selected ? (
            /* Confirm step */
            <div className="p-6">
              <button onClick={handleBack} className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm mb-6">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Change date
              </button>

              {/* Selected date summary */}
              <div className="rounded-[10px] border border-white/10 bg-white/5 p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white font-bold text-sm">{formatDate(selected.date)}</p>
                  {selected.discount && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-tru-pink px-2 py-0.5 rounded-full">
                      {selected.discount}
                    </span>
                  )}
                </div>

                {/* Route */}
                {startLocation && endLocation && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-tru-green" />
                      <span className="text-gray-300 text-xs">{startLocation}</span>
                    </div>
                    <div className="flex-1 border-t border-dashed border-white/20" />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 text-xs">{endLocation}</span>
                      <div className="h-2 w-2 rounded-full bg-tru-pink" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Departs: {formatDate(selected.date)}</span>
                  <span>Returns: {getEndDate(selected.date, duration)}</span>
                </div>
              </div>

              {/* Travellers */}
              <div className="mb-6">
                <label className="text-white text-sm font-semibold block mb-2">Number of Travellers</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTravellers(Math.max(1, travellers - 1))}
                    className="h-10 w-10 rounded-[10px] border border-white/20 flex items-center justify-center text-white hover:border-white/40 transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-white font-bold text-lg w-8 text-center">{travellers}</span>
                  <button
                    onClick={() => setTravellers(Math.min(10, travellers + 1))}
                    className="h-10 w-10 rounded-[10px] border border-white/20 flex items-center justify-center text-white hover:border-white/40 transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="rounded-[10px] border border-white/10 bg-white/5 p-5 mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    &pound;{selected.price} &times; {travellers} traveller{travellers > 1 ? "s" : ""}
                  </span>
                  <span className="text-white font-semibold">&pound;{totalPrice}</span>
                </div>
                {selected.originalPrice && selected.originalPrice !== selected.price && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-tru-pink">You save</span>
                    <span className="text-tru-pink font-semibold">
                      &pound;{(selected.originalPrice - selected.price) * travellers}
                    </span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-white font-bold">Total Price</span>
                  <span className="text-white font-black text-xl font-heading">&pound;{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Or pay a deposit today</span>
                  <span className="text-tru-green font-bold">&pound;{totalDeposit}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer CTA */}
        {step === "confirm" && selected && (
          <div className="px-6 py-4 border-t border-white/10">
            <button className="w-full rounded-[10px] bg-tru-green px-6 py-3.5 text-sm font-semibold text-tru-navy hover:bg-tru-green-light transition-all duration-300 uppercase tracking-wider font-heading">
              Book Now &middot; &pound;{totalDeposit} Deposit
            </button>
            <p className="text-gray-500 text-[10px] text-center mt-2">
              Free date change up to 60 days before departure
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
