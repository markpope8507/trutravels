"use client";

import { useState, useEffect } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

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
  tripId: string;
  tripTitle: string;
  tripImage: string;
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
  tripId,
  tripTitle,
  tripImage,
  duration,
  startLocation,
  endLocation,
  departures,
  depositPrice,
}: BookingModalProps) {
  const { isLoggedIn } = useAuth();
  const { addItem, openDrawer } = useCart();
  const [selected, setSelected] = useState<Departure | null>(null);
  const [notifySignedUp, setNotifySignedUp] = useState(false);
  const [travellers, setTravellers] = useState(1);
  const [step, setStep] = useState<"dates" | "confirm" | "waitlist">("dates");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [waitlist, setWaitlist] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
      setTravellers(1);
      setStep("dates");
      setSelectedYear(2026);
      setNotifySignedUp(false);
      setWaitlistDone(false);
      setWaitlist({ name: "", email: "", phone: "", message: "" });
    }
  }, [isOpen]);

  useScrollLock(isOpen);

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
    setSelected(dep);
    if (dep.status === "full") {
      setWaitlistDone(false);
      setStep("waitlist");
    } else {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    setStep("dates");
  };

  const updateWaitlist =
    (key: keyof typeof waitlist) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setWaitlist((w) => ({ ...w, [key]: e.target.value }));

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prototype: in production this posts the enquiry to the sales team's CRM
    // so they can offer the spot if a cancellation frees up on this date.
    setWaitlistDone(true);
  };

  const waitlistInput =
    "w-full bg-white/5 border border-white/10 rounded-[10px] px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition";

  const totalPrice = selected ? selected.price * travellers : 0;
  const totalDeposit = depositPrice * travellers;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] mx-4 bg-tru-navy rounded-[10px] border border-white/10 overflow-hidden flex flex-col z-10 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-white font-bold text-base">{step === "dates" ? "Choose Your Date" : step === "waitlist" ? "Join The Waitlist" : "Confirm Booking"}</p>
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
              {/* Year tabs */}
              <div className="flex gap-2 mb-6">
                {[2026, 2027].map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold font-heading uppercase tracking-wider transition-all duration-200 ${
                      selectedYear === year
                        ? "bg-tru-pink text-white"
                        : "border border-white/15 text-gray-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

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
                <span className="text-[11px] text-white bg-white/[0.06] border border-white/15 rounded-full px-3 py-1 font-semibold">
                  Deposit from &pound;{depositPrice}
                </span>
                <span className="text-[11px] text-white bg-white/[0.06] border border-white/15 rounded-full px-3 py-1 font-semibold">
                  Free date change up to 60 days
                </span>
              </div>

              {/* Departure list grouped by month */}
              {(() => {
                const yearDeps = Object.entries(grouped)
                  .filter(([, deps]) => deps.some((d) => new Date(d.date).getFullYear() === selectedYear))
                  .map(([month, deps]) => ({ month, deps: deps.filter((d) => new Date(d.date).getFullYear() === selectedYear) }));

                if (yearDeps.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <svg className="h-12 w-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <p className="text-white font-semibold text-sm mb-2">{selectedYear} dates coming soon</p>
                      <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">
                        Dates for {selectedYear} haven&apos;t been released yet. Be the first to know when they drop.
                      </p>
                      {notifySignedUp ? (
                        <div className="flex items-center justify-center gap-2 text-tru-green text-sm font-semibold">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          You&apos;ll be notified!
                        </div>
                      ) : isLoggedIn ? (
                        <button
                          onClick={() => setNotifySignedUp(true)}
                          className="rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider font-heading"
                        >
                          Notify Me
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            href="/signup"
                            onClick={onClose}
                            className="block rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider font-heading text-center"
                          >
                            Sign Up to Get Notified
                          </Link>
                          <p className="text-gray-500 text-xs">
                            Already have an account?{" "}
                            <Link href="/login" onClick={onClose} className="text-tru-pink hover:text-tru-pink-light transition">Log in</Link>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {yearDeps.map(({ month, deps }) => (
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
                            className={`w-full flex items-center justify-between rounded-[10px] border px-4 py-3 transition-all duration-200 text-left ${
                              isFull
                                ? "border-white/10 bg-white/[0.03] hover:border-tru-pink/40 hover:bg-tru-pink/[0.06]"
                                : selected?.date === dep.date
                                ? "border-tru-pink bg-tru-pink/10"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${config.dot}`} />
                              <div>
                                <p className={`text-sm font-medium ${isFull ? "text-gray-300" : "text-white"}`}>{formatDate(dep.date)}</p>
                                <p className="text-gray-400 text-[11px]">
                                  {config.label}
                                  {isFull && <span className="text-tru-pink ml-1.5">&middot; Join the waitlist</span>}
                                  {dep.discount && (
                                    <span className="text-tru-pink ml-1.5">
                                      &middot; {dep.discount}
                                      {dep.originalPrice && dep.originalPrice !== dep.price && (
                                        <> &middot; Save &pound;{dep.originalPrice - dep.price}</>
                                      )}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {isFull ? (
                                <span className="inline-flex items-center gap-1 text-tru-pink text-[11px] font-bold uppercase tracking-wider font-heading">
                                  Request Spot
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </span>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 justify-end">
                                    {dep.originalPrice && dep.originalPrice !== dep.price && (
                                      <span className="text-gray-500 text-xs line-through">&pound;{dep.originalPrice}</span>
                                    )}
                                    <span className="font-bold text-sm text-white">
                                      &pound;{dep.price}
                                    </span>
                                  </div>
                                  <p className="text-gray-500 text-[10px]">per person</p>
                                </>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                  </div>
                );
              })()}
            </div>
          ) : step === "waitlist" && selected ? (
            /* Waitlist step — request a spot on a full date */
            <div className="p-6">
              <button onClick={handleBack} className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm mb-6">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to dates
              </button>

              {waitlistDone ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center">
                    <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase font-heading tracking-tight mb-2">
                    You&apos;re On The <span className="text-tru-pink">Waitlist</span>
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
                    Thanks{waitlist.name ? `, ${waitlist.name.split(" ")[0]}` : ""} — {formatDate(selected.date)} is currently full, but we&apos;ve passed your details to the team. If a spot frees up from a cancellation, you&apos;ll be the first we call.
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-[10px] border border-tru-pink/25 bg-tru-pink/[0.06] p-4 mb-6">
                    <p className="text-white text-sm font-bold">{formatDate(selected.date)} &middot; Full</p>
                    <p className="text-gray-300 text-xs leading-relaxed mt-1">
                      This departure is fully booked. Leave your details and we&apos;ll keep them on file — if a spot opens up from a cancellation, you&apos;ll be first to know.
                    </p>
                  </div>

                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">Name <span className="text-gray-500">*</span></label>
                      <input type="text" required value={waitlist.name} onChange={updateWaitlist("name")} placeholder="Your name" className={waitlistInput} />
                    </div>
                    <div>
                      <label className="block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">Email <span className="text-gray-500">*</span></label>
                      <input type="email" required value={waitlist.email} onChange={updateWaitlist("email")} placeholder="you@email.com" className={waitlistInput} />
                    </div>
                    <div>
                      <label className="block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">Contact Number <span className="text-gray-500">*</span></label>
                      <input type="tel" required value={waitlist.phone} onChange={updateWaitlist("phone")} placeholder="+44 …" className={waitlistInput} />
                    </div>
                    <div>
                      <label className="block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">Message</label>
                      <textarea rows={3} value={waitlist.message} onChange={updateWaitlist("message")} placeholder="Anything we should know? (flexible on dates, group size, etc.)" className={`${waitlistInput} resize-none`} />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
                    >
                      Request A Spot
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </form>
                </>
              )}
            </div>
          ) : step === "confirm" && selected ? (
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

        {/* Footer CTAs */}
        {step === "confirm" && selected && (
          <div className="px-6 py-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  addItem({
                    tripId,
                    tripTitle,
                    image: tripImage,
                    date: selected.date,
                    duration,
                    startLocation,
                    endLocation,
                    travellers,
                    pricePerPerson: selected.price,
                    originalPricePerPerson: selected.originalPrice,
                    depositPerPerson: depositPrice,
                  });
                  onClose();
                  openDrawer();
                }}
                className="rounded-[10px] border border-white/20 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/10 transition-all duration-200 uppercase tracking-wider font-heading"
              >
                Add To Cart
              </button>
              <button
                className="rounded-[10px] px-4 py-3.5 text-sm font-bold uppercase tracking-wider font-heading transition-all duration-200 border"
                style={{
                  backgroundColor: "#FFD814",
                  borderColor: "#FCD200",
                  color: "#0F1111",
                }}
              >
                Book Now
              </button>
            </div>
            <p className="text-gray-500 text-[10px] text-center mt-2">
              Deposit &pound;{totalDeposit} &middot; Free date change up to 60 days before departure
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
