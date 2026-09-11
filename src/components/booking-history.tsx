"use client";

import { useState } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";
import Link from "next/link";
import BookingAddons from "@/components/booking-addons";

const mockBookings = [
  {
    id: "b1",
    tripId: "thailand-island-hopper",
    tripTitle: "Thailand Island Hopper",
    travelStyle: "classic" as const,
    duration: "14 Days",
    description: "From the neon buzz of Bangkok to the crystal waters of the Andaman Sea. Explore hidden lagoons, sleep under stars on the beach, and discover why Thailand is every traveller's first love.",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    departureDate: "2026-04-12",
    endDate: "2026-04-25",
    startLocation: "Bangkok",
    endLocation: "Phuket",
    status: "upcoming" as const,
    goodToGo: {
      flightDetails: true,
      travelInsurance: true,
      dietaryRequirements: true,
      emergencyContact: true,
      passportDetails: true,
      visaCheck: true,
    },
    extras: {
      preNightHotel: true,
      airportTransfer: true,
    },
    flight: {
      airline: "Thai Airways",
      flightNo: "TG917",
      departs: "London Heathrow (LHR) Sat 11 Apr 2026 at 21:30",
      arrives: "Bangkok Suvarnabhumi (BKK) Sun 12 Apr 2026 at 15:30",
    },
    transfer: {
      type: "Airport arrival transfer",
      pickupTime: "Sun 12 Apr 2026 at 15:30",
      flightNo: "TG917",
    },
    insurance: {
      policyNo: "TRV-2026-88421",
      provider: "World Nomads",
      type: "Explorer Plan",
    },
    pricePaid: 1727,
    depositPaid: 300,
    balanceDue: 0,
    balanceDueDate: "",
    paymentsMade: 1727,
    travellers: 2,
    passengers: ["Alex Traveller", "Sarah Traveller"],
    bookingRef: "TRU-2026-04871",
    tourLeader: "Tommy",
    promo: { code: "BLACKFRIDAY", discount: 150, originalPrice: 1877 },
  },
  {
    id: "b2",
    tripId: "vietnam-explorer",
    tripTitle: "Vietnam Explorer",
    travelStyle: "classic" as const,
    duration: "13 Days",
    description: "13 days exploring Vietnam's highlights and hidden gems from south to north.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
    departureDate: "2026-07-05",
    endDate: "2026-07-17",
    startLocation: "Ho Chi Minh City",
    endLocation: "Hanoi",
    status: "upcoming" as const,
    goodToGo: {
      flightDetails: false,
      travelInsurance: false,
      dietaryRequirements: false,
      emergencyContact: false,
      passportDetails: false,
      visaCheck: false,
    },
    extras: { preNightHotel: false, airportTransfer: false },
    pricePaid: 875,
    depositPaid: 875,
    paymentsMade: 875,
    balanceDue: 0,
    balanceDueDate: "",
    travellers: 1,
    bookingRef: "TRU-2026-05912",
    tourLeader: "TBC",
  },
  {
    id: "b3",
    tripId: "costa-rica-adventure",
    tripTitle: "Costa Rica Adventure",
    travelStyle: "classic" as const,
    duration: "10 Days",
    description: "10 days exploring Costa Rica's hotspots. Zip-lining, volcanic hot springs, wildlife safaris, and Pacific beaches.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    departureDate: "2026-11-12",
    endDate: "2026-11-21",
    startLocation: "San José",
    endLocation: "Santa Teresa",
    status: "upcoming" as const,
    goodToGo: {
      flightDetails: false,
      travelInsurance: false,
      dietaryRequirements: false,
      emergencyContact: false,
      passportDetails: false,
      visaCheck: false,
    },
    extras: { preNightHotel: false, airportTransfer: false },
    pricePaid: 945,
    depositPaid: 150,
    paymentsMade: 150,
    balanceDue: 795,
    balanceDueDate: "2026-09-12",
    travellers: 2,
    bookingRef: "TRU-2026-07341",
    tourLeader: "TBC",
  },
  {
    id: "b4",
    tripId: "bali-experience",
    tripTitle: "Bali Experience",
    travelStyle: "classic" as const,
    duration: "10 Days",
    description: "The essential Bali experience. Surf, temples, rice terraces, and the Gili Islands.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    departureDate: "2025-09-15",
    endDate: "2025-09-24",
    startLocation: "Canggu",
    endLocation: "Gili Trawangan",
    status: "completed" as const,
    pricePaid: 487,
    depositPaid: 487,
    paymentsMade: 487,
    balanceDue: 0,
    balanceDueDate: "",
    travellers: 2,
    bookingRef: "TRU-2025-03214",
    tourLeader: "Milin",
    reviewLeft: false,
    feedbackCompleted: false,
  },
  {
    id: "b5",
    tripId: "jordan-explorer",
    tripTitle: "Jordan Explorer",
    travelStyle: "classic" as const,
    duration: "8 Days",
    description: "From the ancient city of Petra to floating in the Dead Sea and camping under the stars in Wadi Rum.",
    image: "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800&q=80",
    departureDate: "2026-06-20",
    endDate: "2026-06-27",
    startLocation: "Amman",
    endLocation: "Aqaba",
    status: "cancelled" as const,
    pricePaid: 695,
    depositPaid: 200,
    paymentsMade: 695,
    balanceDue: 0,
    balanceDueDate: "",
    travellers: 1,
    bookingRef: "TRU-2026-06183",
    tourLeader: "TBC",
    cancellation: {
      dateBooked: "3 Jan 2026",
      dateCancelled: "18 Mar 2026",
      reason: "Change of personal circumstances",
      refundAmount: 495,
      nonRefundableDeposit: 200,
      refundStatus: "Refunded",
      refundDate: "25 Mar 2026",
    },
  },
];

function BookingTimeline({ booking }: { booking: typeof mockBookings[0] }) {
  const isUpcoming = booking.status === "upcoming";
  const isPaid = booking.balanceDue === 0;
  const goodToGoTotal = booking.goodToGo ? Object.keys(booking.goodToGo).length : 0;
  const goodToGoDone = booking.goodToGo ? Object.values(booking.goodToGo).filter(Boolean).length : 0;
  const isGoodToGo = goodToGoDone === goodToGoTotal && goodToGoTotal > 0;

  const steps = [
    { label: "Confirmed", done: true },
    { label: "Paid in Full", done: isPaid },
    { label: "Good to Go", done: isGoodToGo },
  ];

  return (
    <div className="w-full">
      <div className="flex items-start w-full">
        {steps.map((step, i) => (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {i > 0 && (
              <div className={`absolute top-3.5 right-1/2 w-full h-0.5 ${steps[i - 1].done && step.done ? "bg-tru-green" : "bg-white/10"}`} />
            )}
            {/* Circle */}
            <div className={`relative z-10 h-7 w-7 rounded-full flex items-center justify-center ${step.done ? "bg-tru-green" : "bg-[#1a2538]"}`}>
              {step.done ? (
                <svg className="h-4 w-4 text-tru-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <span className="text-gray-500 text-[10px] font-bold">{i + 1}</span>
              )}
            </div>
            {/* Label */}
            <p className={`text-[9px] mt-1.5 font-semibold uppercase tracking-wider text-center ${step.done ? "text-tru-green" : "text-gray-500"}`}>{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingHistory() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [manageTab, setManageTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [videoReviewOpen, setVideoReviewOpen] = useState<string | null>(null);
  useScrollLock(!!videoReviewOpen);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [formData, setFormData] = useState({
    flightAirline: "",
    flightNo: "",
    flightDeparts: "",
    flightArrives: "",
    insuranceProvider: "",
    insuranceType: "",
    insurancePolicyNo: "",
    passportName: "",
    passportNumber: "",
    passportExpiry: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelationship: "",
    dietary: "",
    arrivalCard: "",
  });

  const handleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setManageTab("overview");
      setEditing(false);
    }
  };

  const startEditing = (booking: typeof mockBookings[0]) => {
    setFormData({
      flightAirline: booking.flight?.airline || "",
      flightNo: booking.flight?.flightNo || "",
      flightDeparts: booking.flight?.departs || "",
      flightArrives: booking.flight?.arrives || "",
      insuranceProvider: booking.insurance?.provider || "",
      insuranceType: booking.insurance?.type || "",
      insurancePolicyNo: booking.insurance?.policyNo || "",
      passportName: "",
      passportNumber: "",
      passportExpiry: "",
      emergencyName: "Sarah Traveller",
      emergencyPhone: "+44 7700 900123",
      emergencyRelationship: "Mother",
      dietary: "No allergies · Vegetarian",
      arrivalCard: "",
    });
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const statusStyles = {
    upcoming: { label: "CONFIRMED", color: "text-tru-green" },
    completed: { label: "Completed", color: "bg-gray-500 text-white" },
    cancelled: { label: "Cancelled", color: "bg-red-500 text-white" },
  };

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function daysUntil(dateStr: string) {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  return (
    <section className="mb-12">
      <div className="space-y-6">
        {mockBookings.map((booking) => {
          const status = statusStyles[booking.status];
          const isExpanded = expandedId === booking.id;
          const isUpcoming = booking.status === "upcoming";

          return (
            <div key={booking.id} className={`rounded-[10px] border overflow-hidden ${booking.status === "cancelled" ? "border-red-500/30 bg-white/[0.02]" : "border-white/10 bg-white/5"}`}>
              {/* Card header — tour card style */}
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative sm:w-64 sm:flex-shrink-0">
                  <img src={booking.image} alt={booking.tripTitle} className="w-full h-40 sm:absolute sm:inset-0 sm:h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {booking.status === "cancelled" && (
                    <>
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Cancelled</span>
                      </div>
                    </>
                  )}
                  {/* Bottom-left: date + countdown */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-lg font-black font-heading leading-none">{new Date(booking.departureDate).getDate()} {new Date(booking.departureDate).toLocaleDateString("en-GB", { month: "short" })} {new Date(booking.departureDate).getFullYear()}</p>
                    {isUpcoming && (
                      <p className="text-tru-green text-[10px] font-bold mt-1">{daysUntil(booking.departureDate)} days to go</p>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 p-4 sm:p-5 sm:min-h-[220px] flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading mb-0.5">{booking.duration}</p>
                      <h3 className="text-base sm:text-lg font-black text-white uppercase font-heading">{booking.tripTitle}</h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                        <svg className="h-3 w-3 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {booking.startLocation} &rarr; {booking.endLocation}
                      </div>
                      <p className="text-white text-xs font-semibold mt-1">{booking.bookingRef}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4 hidden sm:block">
                      <p className="text-white font-black text-xl font-heading">&pound;{booking.pricePaid}</p>
                      {booking.balanceDue > 0 && (
                        <div>
                          <p className="text-tru-pink text-xs font-semibold">&pound;{booking.balanceDue} due in {daysUntil(booking.balanceDueDate)} days</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  {isUpcoming && <BookingTimeline booking={booking} />}

                  {/* Completed trip CTAs */}
                  {booking.status === "completed" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {!booking.feedbackCompleted && (
                        <span className="flex items-center gap-1.5 rounded-full border border-tru-pink/30 bg-tru-pink/10 px-3 py-1 text-[10px] font-semibold text-tru-pink">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          Feedback needed
                        </span>
                      )}
                      {!booking.reviewLeft && (
                        <span className="flex items-center gap-1.5 rounded-full border border-tru-green/30 bg-tru-green/10 px-3 py-1 text-[10px] font-semibold text-tru-green">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                          Leave an online review
                        </span>
                      )}
                    </div>
                  )}

                  {/* Manage + Action buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-4">
                    {booking.status !== "completed" && booking.status !== "cancelled" && (
                      <button
                        onClick={() => handleExpand(booking.id)}
                        className="rounded-[10px] border border-white/20 px-5 py-2.5 text-[10px] font-semibold text-white hover:border-white/40 hover:bg-white/5 transition uppercase tracking-wider font-heading flex items-center justify-center gap-2"
                      >
                        {isExpanded ? "Close" : "Manage Booking"}
                        <svg className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    )}
                    {booking.status === "cancelled" && (
                      <button
                        onClick={() => handleExpand(booking.id)}
                        className="rounded-[10px] border border-red-500/30 px-5 py-2.5 text-[10px] font-semibold text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition uppercase tracking-wider font-heading flex items-center justify-center gap-2"
                      >
                        {isExpanded ? "Close" : "View Details"}
                        <svg className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    )}
                    {booking.status === "completed" && <div />}
                    {isUpcoming && booking.balanceDue > 0 && (
                      <button className="rounded-[10px] bg-tru-pink px-5 py-2.5 text-[10px] font-semibold text-white hover:bg-tru-pink-light transition uppercase tracking-wider font-heading text-center">
                        Make a Payment
                      </button>
                    )}
                    {booking.status === "completed" && (
                      <button
                        onClick={() => { setVideoReviewOpen(booking.id); setRecording(false); setRecorded(false); }}
                        className="rounded-[10px] bg-gradient-to-r from-tru-pink to-tru-blue px-5 py-2.5 text-[10px] font-semibold text-white hover:opacity-90 transition uppercase tracking-wider font-heading flex items-center justify-center gap-2"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Leave a Video Review
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded — cancelled overview */}
              {booking.status === "cancelled" && (booking as any).cancellation && (
                <div className={`transition-all duration-300 ease-out overflow-hidden ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="border-t border-red-500/20 px-4 pb-5 pt-4 space-y-4">
                    <div className="rounded-[10px] border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">Booking Cancelled</p>
                        <p className="text-gray-400 text-xs mt-0.5">This booking has been cancelled and a refund has been processed minus the non-refundable deposit.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-[10px] bg-white/5 p-3">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Date Booked</p>
                        <p className="text-white text-sm font-semibold">{(booking as any).cancellation.dateBooked}</p>
                      </div>
                      <div className="rounded-[10px] bg-white/5 p-3">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Date Cancelled</p>
                        <p className="text-red-400 text-sm font-semibold">{(booking as any).cancellation.dateCancelled}</p>
                      </div>
                      <div className="rounded-[10px] bg-white/5 p-3 col-span-2">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Reason</p>
                        <p className="text-white text-sm font-semibold">{(booking as any).cancellation.reason}</p>
                      </div>
                    </div>

                    <div className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
                      <p className="text-white font-bold text-sm font-heading uppercase tracking-wider px-4 py-3 border-b border-white/5">Refund Summary</p>
                      <div className="divide-y divide-white/5">
                        <div className="flex items-center justify-between px-4 py-3">
                          <p className="text-gray-400 text-xs">Total Paid</p>
                          <p className="text-white text-xs font-semibold">&pound;{booking.paymentsMade}</p>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <p className="text-gray-400 text-xs">Non-refundable Deposit</p>
                          <p className="text-red-400 text-xs font-semibold">-&pound;{(booking as any).cancellation.nonRefundableDeposit}</p>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-tru-green/5">
                          <p className="text-white text-xs font-bold">Refund Amount</p>
                          <p className="text-tru-green text-xs font-bold">&pound;{(booking as any).cancellation.refundAmount}</p>
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
                        <p className="text-gray-500 text-xs">Refund Status</p>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-tru-green" />
                          <p className="text-tru-green text-xs font-semibold">{(booking as any).cancellation.refundStatus} &middot; {(booking as any).cancellation.refundDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div>
                      <p className="text-white font-bold text-sm font-heading uppercase tracking-wider mb-3">Payment History</p>
                      <div className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
                        <div className="hidden sm:grid sm:grid-cols-5 gap-2 px-4 py-2 border-b border-white/5 text-[9px] text-gray-500 uppercase tracking-wider font-heading">
                          <span>Date</span>
                          <span>Description</span>
                          <span>Reference</span>
                          <span>Amount</span>
                          <span className="text-right">Balance</span>
                        </div>
                        {[
                          { date: (booking as any).cancellation.dateBooked, desc: "Deposit payment", ref: "2504891", amount: `£${(booking as any).cancellation.nonRefundableDeposit}`, amountColor: "text-tru-green", balance: `£${booking.pricePaid - (booking as any).cancellation.nonRefundableDeposit}` },
                          { date: "20 Jan 2026", desc: "Balance payment", ref: "2511247", amount: `£${booking.pricePaid - (booking as any).cancellation.nonRefundableDeposit}`, amountColor: "text-tru-green", balance: "£0" },
                          { date: (booking as any).cancellation.dateCancelled, desc: "Booking cancelled", ref: "2538102", amount: "—", amountColor: "text-red-400", balance: "£0" },
                          { date: (booking as any).cancellation.refundDate, desc: "Refund processed", ref: "2542679", amount: `+£${(booking as any).cancellation.refundAmount}`, amountColor: "text-tru-green", balance: "£0" },
                        ].map((row, i) => (
                          <div key={i} className={`grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 border-b border-white/5 last:border-0 ${row.desc === "Booking cancelled" ? "bg-red-500/5" : row.desc === "Refund processed" ? "bg-tru-green/5" : ""}`}>
                            <div>
                              <p className="text-gray-500 text-[9px] uppercase sm:hidden">Date</p>
                              <p className="text-white text-xs">{row.date}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[9px] uppercase sm:hidden">Description</p>
                              <p className={`text-xs font-semibold ${row.desc === "Booking cancelled" ? "text-red-400" : "text-gray-300"}`}>{row.desc}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[9px] uppercase sm:hidden">Reference</p>
                              <p className="text-gray-400 text-xs">{row.ref}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[9px] uppercase sm:hidden">Amount</p>
                              <p className={`text-xs font-semibold ${row.amountColor}`}>{row.amount}</p>
                            </div>
                            <div className="sm:text-right">
                              <p className="text-gray-500 text-[9px] uppercase sm:hidden">Balance</p>
                              <p className="text-gray-400 text-xs">{row.balance}</p>
                            </div>
                          </div>
                        ))}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-3 bg-white/5">
                          <p className="text-white text-xs font-bold">Net Result</p>
                          <p className="text-gray-300 text-xs font-semibold">Non-refundable deposit</p>
                          <p className="text-red-400 text-xs font-bold">-&pound;{(booking as any).cancellation.nonRefundableDeposit}</p>
                          <p className="text-tru-green text-xs font-bold sm:text-right">&pound;{(booking as any).cancellation.refundAmount} refunded</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Expanded — tabbed interface */}
              {booking.status !== "cancelled" && (
              <div className={`transition-all duration-300 ease-out overflow-hidden ${isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}`}>
                {/* Tabs */}
                <div className="border-t border-b border-white/5 flex">
                  {[
                    { id: "overview", label: "Overview" },
                    ...(isUpcoming && booking.goodToGo ? [{ id: "goodtogo", label: "Good to Go" }] : []),
                    ...(isUpcoming ? [{ id: "addons", label: "Add-Ons" }] : []),
                    ...(booking.status === "completed" ? [{ id: "feedback", label: "Feedback" }] : []),
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setManageTab(tab.id)}
                      className={`flex-1 py-3 px-1 text-[10px] font-semibold uppercase tracking-wide font-heading transition-all border-b-2 text-center whitespace-nowrap ${
                        manageTab === tab.id ? "text-tru-pink border-tru-pink" : "text-gray-500 border-transparent hover:text-white"
                      }`}
                    >
                      {tab.label}
                      {tab.id === "goodtogo" && booking.goodToGo && (() => {
                        const done = Object.values(booking.goodToGo).filter(Boolean).length;
                        const total = Object.keys(booking.goodToGo).length;
                        return done < total ? <span className="ml-1.5 bg-tru-pink text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{done}/{total}</span> : <span className="ml-1.5 text-tru-green">✓</span>;
                      })()}
                    </button>
                  ))}
                </div>

                <div className="px-4 pb-5 pt-4">
                  {/* OVERVIEW TAB */}
                  {manageTab === "overview" && (
                    <div className="space-y-5">
                      {/* Booking Overview */}
                      <div className="rounded-[10px] border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden">
                        <div className="px-4 py-3">
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Booking Ref</p>
                          <p className="text-white text-sm font-semibold">{booking.bookingRef}</p>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Date Booked</p>
                          <p className="text-white text-sm font-semibold">{(booking as any).cancellation?.dateBooked || "12 Jan 2026"}</p>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Tour</p>
                          <p className="text-white text-sm font-semibold">{booking.tripTitle} &middot; {booking.duration}</p>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-white/5">
                          <div className="px-4 py-3">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Start</p>
                            <p className="text-white text-sm font-semibold">{formatDate(booking.departureDate)}</p>
                            <p className="text-gray-500 text-[10px]">{booking.startLocation}</p>
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">End</p>
                            <p className="text-white text-sm font-semibold">{formatDate(booking.endDate)}</p>
                            <p className="text-gray-500 text-[10px]">{booking.endLocation}</p>
                          </div>
                        </div>

                        {/* Passengers */}
                        {((booking as any).passengers || ["Alex Traveller"]).map((name: string, pi: number) => {
                          const emails = ["alex@trutravels.com", "sarah@trutravels.com"];
                          return (
                            <div key={pi} className="grid grid-cols-2 divide-x divide-white/5">
                              <div className="px-4 py-3">
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">{booking.travellers > 1 ? `Passenger ${pi + 1}` : "Passenger"}</p>
                                <p className="text-white text-sm font-semibold">{name}</p>
                              </div>
                              <div className="px-4 py-3">
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Email</p>
                                <p className="text-white text-sm font-semibold">{emails[pi] || `pax${pi + 1}@email.com`}</p>
                              </div>
                            </div>
                          );
                        })}

                        <div className="grid grid-cols-3 divide-x divide-white/5">
                          <div className="px-4 py-3">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Total Price</p>
                            <p className="text-white text-sm font-semibold">&pound;{booking.pricePaid}</p>
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Paid</p>
                            <p className="text-tru-green text-sm font-semibold">&pound;{booking.paymentsMade || booking.depositPaid}</p>
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Balance</p>
                            <p className={`text-sm font-semibold ${booking.balanceDue > 0 ? "text-tru-pink" : "text-tru-green"}`}>
                              {booking.balanceDue > 0 ? `£${booking.balanceDue}` : "£0 ✓"}
                            </p>
                          </div>
                        </div>

                        {(booking as any).promo && (
                          <div className="px-4 py-3 bg-tru-green/5 flex items-center gap-2">
                            <svg className="h-4 w-4 text-tru-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
                            <p className="text-tru-green text-xs font-semibold">{(booking as any).promo.code} &middot; -&pound;{(booking as any).promo.discount} off <span className="text-gray-500 font-normal line-through">&pound;{(booking as any).promo.originalPrice}</span></p>
                          </div>
                        )}
                      </div>

                      {/* Apply travel credit */}
                      {isUpcoming && booking.balanceDue > 0 && (
                        <div className="rounded-[10px] border border-tru-green/20 bg-tru-green/5 p-4 flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-tru-green/20 flex items-center justify-center flex-shrink-0">
                            <svg className="h-5 w-5 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold">You have &pound;50 travel credit</p>
                            <p className="text-gray-400 text-xs">Apply towards your remaining balance of &pound;{booking.balanceDue}</p>
                          </div>
                          <button className="rounded-[10px] bg-tru-green px-4 py-2.5 text-[10px] font-semibold text-tru-navy hover:bg-tru-green-light transition uppercase tracking-wider font-heading flex-shrink-0">
                            Apply Credit
                          </button>
                        </div>
                      )}

                      {/* Booking actions */}
                      {isUpcoming && (
                        <div className="rounded-[10px] border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden">
                          <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition text-left group">
                            <div className="h-9 w-9 rounded-full bg-tru-blue/20 flex items-center justify-center flex-shrink-0">
                              <svg className="h-4 w-4 text-tru-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-semibold group-hover:text-tru-blue transition">Request Date Change</p>
                              <p className="text-gray-500 text-[10px]">Move your trip to a different departure date</p>
                            </div>
                            <svg className="h-4 w-4 text-gray-500 group-hover:text-white transition flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-500/5 transition text-left group">
                            <div className="h-9 w-9 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                              <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-semibold group-hover:text-red-400 transition">Request Cancellation</p>
                              <p className="text-gray-500 text-[10px]">Cancel your booking &middot; £{booking.depositPaid} non-refundable deposit applies</p>
                            </div>
                            <svg className="h-4 w-4 text-gray-500 group-hover:text-red-400 transition flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </div>
                      )}

                      {/* Booked Extras */}
                      {(booking.extras?.preNightHotel || booking.extras?.airportTransfer) && (
                        <div className="mt-4">
                          <p className="text-white font-bold text-sm font-heading uppercase tracking-wider mb-3">Booked Extras</p>
                          <div className="space-y-2">
                            {booking.extras?.preNightHotel && (
                              <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-[10px] bg-tru-blue/20 flex items-center justify-center flex-shrink-0">
                                  <svg className="h-5 w-5 text-tru-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-semibold">Pre-Night Hotel</p>
                                  <p className="text-gray-400 text-xs">NapPark Hostel, {booking.startLocation} &middot; <span className="text-white">{booking.travellers > 1 ? "Twin Room" : "Single Room"}</span> &middot; {booking.travellers} PAX</p>
                                  <p className="text-gray-500 text-[10px]">Check-in: 11 Apr 2026 &middot; Booked 28 Jan 2026</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-white text-sm font-semibold">&pound;45</p>
                                  <span className="text-tru-green text-[9px] font-bold uppercase">Booked</span>
                                </div>
                              </div>
                            )}
                            {booking.extras?.airportTransfer && (
                              <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-[10px] bg-tru-blue/20 flex items-center justify-center flex-shrink-0">
                                  <svg className="h-5 w-5 text-tru-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375m11.25 0h3.375c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 00-.879-2.121l-3.496-3.496A2.999 2.999 0 0014.25 8.25H6.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125z" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-semibold">Airport Arrival Transfer</p>
                                  <p className="text-gray-400 text-xs">Pickup from {booking.startLocation} airport to NapPark Hostel</p>
                                  <p className="text-gray-500 text-[10px]">Flight TG917 &middot; Arriving 12 Apr 2026 at 15:30 &middot; Booked 3 Feb 2026</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-white text-sm font-semibold">&pound;60</p>
                                  <span className="text-tru-green text-[9px] font-bold uppercase">Booked</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment History */}
                      <div className="mt-6">
                        <p className="text-white font-bold text-sm font-heading uppercase tracking-wider mb-3">Payment History</p>
                        <div className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
                          <div className="hidden sm:grid sm:grid-cols-5 gap-2 px-4 py-2 border-b border-white/5 text-[9px] text-gray-500 uppercase tracking-wider font-heading">
                            <span>Date</span>
                            <span>Description</span>
                            <span>Amount</span>
                            <span>Reference</span>
                            <span className="text-right">Balance After</span>
                          </div>
                          {[
                            { date: "12 Jan 2026", amount: booking.depositPaid, ref: "PAY-04871-001", balance: booking.pricePaid - booking.depositPaid, desc: `Deposit (${booking.travellers} PAX)` },
                            ...(booking.extras?.preNightHotel ? [{ date: "28 Jan 2026", amount: 45, ref: `PAY-${booking.bookingRef.split("-")[2]}-002`, balance: booking.pricePaid - booking.depositPaid - 45, desc: "Pre-Night Hotel" }] : []),
                            ...(booking.extras?.airportTransfer ? [{ date: "3 Feb 2026", amount: 60, ref: `PAY-${booking.bookingRef.split("-")[2]}-003`, balance: booking.pricePaid - booking.depositPaid - (booking.extras?.preNightHotel ? 45 : 0) - 60, desc: "Airport Transfer" }] : []),
                            ...(booking.paymentsMade && booking.paymentsMade > booking.depositPaid ? [{ date: "15 Feb 2026", amount: booking.pricePaid - booking.depositPaid - (booking.extras?.preNightHotel ? 45 : 0) - (booking.extras?.airportTransfer ? 60 : 0), ref: `PAY-${booking.bookingRef.split("-")[2]}-004`, balance: 0, desc: "Final Balance" }] : []),
                          ].map((payment, i) => (
                            <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 border-b border-white/5 last:border-0">
                              <div>
                                <p className="text-gray-500 text-[9px] uppercase sm:hidden">Date</p>
                                <p className="text-white text-xs">{payment.date}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-[9px] uppercase sm:hidden">Description</p>
                                <p className="text-gray-300 text-xs">{(payment as any).desc || "Payment"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-[9px] uppercase sm:hidden">Amount</p>
                                <p className="text-tru-green text-xs font-semibold">&pound;{payment.amount}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-[9px] uppercase sm:hidden">Reference</p>
                                <p className="text-gray-300 text-xs">{payment.ref}</p>
                              </div>
                              <div className="sm:text-right">
                                <p className="text-gray-500 text-[9px] uppercase sm:hidden">Balance</p>
                                <p className={`text-xs font-semibold ${payment.balance > 0 ? "text-tru-pink" : "text-tru-green"}`}>&pound;{payment.balance}</p>
                              </div>
                            </div>
                          ))}
                          {/* Total row */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 bg-white/5">
                            <p className="text-white text-xs font-bold">Total Paid</p>
                            <p className="hidden sm:block" />
                            <p className="text-tru-green text-xs font-bold">&pound;{booking.paymentsMade || booking.depositPaid}</p>
                            <p className="hidden sm:block" />
                            <p className={`text-xs font-bold sm:text-right ${booking.balanceDue > 0 ? "text-tru-pink" : "text-tru-green"}`}>
                              {booking.balanceDue > 0 ? `£${booking.balanceDue} remaining` : "Paid in full ✓"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GOOD TO GO TAB */}
                  {manageTab === "goodtogo" && isUpcoming && booking.goodToGo && (() => {
                    const items = [
                      { key: "flightDetails", label: "Flight Details", detail: booking.flight ? `${booking.flight.airline} · ${booking.flight.flightNo}\nDeparts: ${booking.flight.departs}\nArrives: ${booking.flight.arrives}` : null },
                      { key: "travelInsurance", label: "Travel Insurance", detail: booking.insurance ? `Provider: ${booking.insurance.provider}\nPlan: ${booking.insurance.type}\nPolicy No: ${booking.insurance.policyNo}` : null },
                      { key: "passportDetails", label: "Passport Details", detail: null },
                      { key: "emergencyContact", label: "Emergency Contact", detail: "Sarah Traveller · +44 7700 900123 · Mother" },
                      { key: "dietaryRequirements", label: "Dietary Requirements", detail: "No allergies · Vegetarian" },
                      { key: "visaCheck", label: "Visa & Entry Requirements", detail: null },
                    ];
                    const completed = items.filter((item) => (booking.goodToGo as any)[item.key]).length;
                    const total = items.length;

                    if (editing) {
                      const inputClass = "w-full bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-tru-pink/50 transition";
                      return (
                        <div className="space-y-5">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-bold text-sm font-heading uppercase tracking-wider">Edit Good to Go</p>
                            <button onClick={() => setEditing(false)} className="text-gray-500 text-[10px] hover:text-white transition">Cancel</button>
                          </div>

                          {/* Flight Details */}
                          <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 space-y-3">
                            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading">Flight Details</p>
                            <div className="grid grid-cols-2 gap-3">
                              <input className={inputClass} placeholder="Airline" value={formData.flightAirline} onChange={(e) => updateField("flightAirline", e.target.value)} />
                              <input className={inputClass} placeholder="Flight No." value={formData.flightNo} onChange={(e) => updateField("flightNo", e.target.value)} />
                            </div>
                            <input className={inputClass} placeholder="Departs from (e.g. London Heathrow, Sat 11 Apr at 21:30)" value={formData.flightDeparts} onChange={(e) => updateField("flightDeparts", e.target.value)} />
                            <input className={inputClass} placeholder="Arrives at (e.g. Bangkok BKK, Sun 12 Apr at 15:30)" value={formData.flightArrives} onChange={(e) => updateField("flightArrives", e.target.value)} />
                          </div>

                          {/* Travel Insurance */}
                          <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 space-y-3">
                            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading">Travel Insurance</p>
                            <div className="grid grid-cols-2 gap-3">
                              <input className={inputClass} placeholder="Provider" value={formData.insuranceProvider} onChange={(e) => updateField("insuranceProvider", e.target.value)} />
                              <input className={inputClass} placeholder="Plan type" value={formData.insuranceType} onChange={(e) => updateField("insuranceType", e.target.value)} />
                            </div>
                            <input className={inputClass} placeholder="Policy number" value={formData.insurancePolicyNo} onChange={(e) => updateField("insurancePolicyNo", e.target.value)} />
                          </div>

                          {/* Passport */}
                          <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 space-y-3">
                            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading">Passport Details</p>
                            <input className={inputClass} placeholder="Full name (as on passport)" value={formData.passportName} onChange={(e) => updateField("passportName", e.target.value)} />
                            <div className="grid grid-cols-2 gap-3">
                              <input className={inputClass} placeholder="Passport number" value={formData.passportNumber} onChange={(e) => updateField("passportNumber", e.target.value)} />
                              <input className={inputClass} placeholder="Expiry date" value={formData.passportExpiry} onChange={(e) => updateField("passportExpiry", e.target.value)} />
                            </div>
                          </div>

                          {/* Emergency Contact */}
                          <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 space-y-3">
                            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading">Emergency Contact</p>
                            <input className={inputClass} placeholder="Full name" value={formData.emergencyName} onChange={(e) => updateField("emergencyName", e.target.value)} />
                            <div className="grid grid-cols-2 gap-3">
                              <input className={inputClass} placeholder="Phone number" value={formData.emergencyPhone} onChange={(e) => updateField("emergencyPhone", e.target.value)} />
                              <input className={inputClass} placeholder="Relationship" value={formData.emergencyRelationship} onChange={(e) => updateField("emergencyRelationship", e.target.value)} />
                            </div>
                          </div>

                          {/* Dietary */}
                          <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 space-y-3">
                            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading">Dietary Requirements</p>
                            <input className={inputClass} placeholder="Allergies, dietary preferences etc." value={formData.dietary} onChange={(e) => updateField("dietary", e.target.value)} />
                          </div>

                          {/* Visa & Entry Requirements */}
                          <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 space-y-3">
                            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading">Visa &amp; Entry Requirements</p>
                            <p className="text-gray-400 text-xs leading-relaxed">Check your visa requirements for this destination using the Sherpa travel tool below.</p>
                            <div id="sherpa-trip-element" className="rounded-[10px] overflow-hidden bg-white min-h-[300px]">
                              <iframe
                                src="https://apply.joinsherpa.com/travel-restrictions?affiliateId=trutravels&language=en-US"
                                className="w-full min-h-[400px] border-0"
                                title="Visa & Entry Requirements"
                                allow="camera; microphone"
                              />
                            </div>
                            <p className="text-gray-600 text-[10px] italic">Powered by Sherpa. This portal should be used for information purposes only and is not associated with TruTravels.</p>
                          </div>

                          {/* Save */}
                          <div className="flex gap-3">
                            <button onClick={() => setEditing(false)} className="flex-1 rounded-[10px] border border-white/20 py-2.5 text-xs text-white hover:border-white/40 transition text-center font-heading uppercase tracking-wider">Cancel</button>
                            <button onClick={handleSave} className="flex-1 rounded-[10px] bg-tru-green py-2.5 text-xs font-semibold text-tru-navy hover:bg-tru-green-light transition text-center font-heading uppercase tracking-wider">Save All</button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${completed === total ? "bg-tru-green text-tru-navy" : "bg-tru-pink text-white"}`}>{completed}/{total} complete</span>
                            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(completed / total) * 100}%`, background: completed === total ? "#6BD495" : "#FF3F99" }} />
                            </div>
                          </div>
                          <button onClick={() => startEditing(booking)} className="rounded-[10px] border border-white/20 px-4 py-2 text-[10px] font-semibold text-white hover:border-white/40 hover:bg-white/5 transition uppercase tracking-wider font-heading flex items-center gap-1.5">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Edit
                          </button>
                        </div>
                        <div className="rounded-[10px] border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden">
                          {items.map((item) => {
                            const done = (booking.goodToGo as any)[item.key];
                            return (
                              <div key={item.key} className="px-4 py-3 flex items-center gap-3">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-tru-green/20" : "bg-white/10"}`}>
                                  {done ? <svg className="h-3.5 w-3.5 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold ${done ? "text-tru-green" : "text-white"}`}>{item.label}</p>
                                  {done && item.detail ? (
                                    <div className="text-gray-300 text-[10px] mt-0.5">
                                      {item.detail.split("\n").map((line, li) => <p key={li}>{line}</p>)}
                                    </div>
                                  ) : !done && (
                                    <p className="text-tru-pink text-[10px] font-semibold">Incomplete</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ADD-ONS TAB */}
                  {manageTab === "addons" && isUpcoming && (
                    <BookingAddons booking={booking} />
                  )}

                  {/* ACCESS TAB */}

                  {/* FEEDBACK TAB */}
                  {manageTab === "feedback" && booking.status === "completed" && (
                    <div className="space-y-4">
                      {!booking.feedbackCompleted && (
                        <div className="rounded-[10px] border border-tru-pink/30 bg-tru-blue/5 p-5 text-center">
                          <svg className="h-10 w-10 text-tru-blue mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          <p className="text-white font-semibold text-sm mb-1">Feedback form incomplete</p>
                          <p className="text-gray-400 text-xs mb-4">Help us improve by sharing your experience</p>
                          <button className="rounded-[10px] bg-tru-pink px-6 py-2.5 text-xs font-semibold text-white hover:bg-tru-pink-light transition uppercase tracking-wider font-heading">Complete Feedback</button>
                        </div>
                      )}
                      {!booking.reviewLeft && (
                        <div className="rounded-[10px] border border-tru-green/30 bg-tru-green/5 p-5 text-center">
                          <svg className="h-10 w-10 text-tru-green mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                          <p className="text-white font-semibold text-sm mb-1">Leave a review</p>
                          <p className="text-gray-400 text-xs mb-4">Loved your trip? Help others decide</p>
                          <button className="rounded-[10px] bg-tru-green px-6 py-2.5 text-xs font-semibold text-tru-navy hover:bg-tru-green-light transition uppercase tracking-wider font-heading">Write a Review</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Review Modal */}
      {videoReviewOpen && (() => {
        const reviewBooking = mockBookings.find((b) => b.id === videoReviewOpen);
        return (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setVideoReviewOpen(null)}>
            <div className="w-full max-w-md rounded-[10px] border border-white/10 bg-tru-navy overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="relative bg-gradient-to-r from-tru-pink/20 to-tru-blue/20 px-6 pt-6 pb-5">
                <button onClick={() => setVideoReviewOpen(null)} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-tru-pink to-tru-blue flex items-center justify-center mb-4">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-white text-lg font-black font-heading uppercase tracking-wide">Share Your Experience</h3>
                <p className="text-gray-300 text-sm mt-1">{reviewBooking?.tripTitle}</p>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {!recording && !recorded && (
                  <>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Record a <span className="text-white font-semibold">10-20 second video</span> sharing your favourite moment, what surprised you, or why someone should book this trip. Your review will inspire future travellers on the trip page!
                    </p>

                    <div className="rounded-[10px] bg-white/5 border border-white/10 p-4 space-y-3">
                      <p className="text-white text-xs font-bold font-heading uppercase tracking-wider">Tips for a great review</p>
                      <div className="space-y-2">
                        {[
                          { icon: "🎯", text: "Keep it short — 10-20 seconds is perfect" },
                          { icon: "😊", text: "Be yourself — authentic beats polished" },
                          { icon: "🌟", text: "Share a highlight or favourite moment" },
                          { icon: "💡", text: "Film vertically for best results" },
                        ].map((tip) => (
                          <div key={tip.text} className="flex items-start gap-2">
                            <span className="text-sm flex-shrink-0">{tip.icon}</span>
                            <p className="text-gray-400 text-xs">{tip.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <label className="w-full rounded-[10px] bg-gradient-to-r from-tru-pink to-tru-blue py-3.5 text-sm font-bold text-white hover:opacity-90 transition uppercase tracking-wider font-heading flex items-center justify-center gap-2 cursor-pointer">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Upload Video
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={() => { setRecording(false); setRecorded(true); }}
                      />
                    </label>
                  </>
                )}

                {recorded && (
                  <div className="text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-tru-green/20 flex items-center justify-center mx-auto">
                      <svg className="h-10 w-10 text-tru-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-white text-lg font-bold font-heading uppercase">Video Submitted!</p>
                      <p className="text-gray-400 text-sm mt-1">Thanks for sharing your experience. Your review will appear on the {reviewBooking?.tripTitle} page once approved.</p>
                    </div>
                    <button
                      onClick={() => setVideoReviewOpen(null)}
                      className="w-full rounded-[10px] border border-white/20 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition uppercase tracking-wider font-heading"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}

export { mockBookings };
export default BookingHistory;
