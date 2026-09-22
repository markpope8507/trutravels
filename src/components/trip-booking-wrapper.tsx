"use client";

import { useState, useEffect } from "react";
import TripStickyNav from "@/components/trip-sticky-nav";
import BookingModal from "@/components/booking-modal";

type Departure = {
  date: string;
  price: number;
  originalPrice?: number;
  status: "available" | "almost-full" | "full" | "discount";
  discount?: string;
};

export default function TripBookingWrapper({
  price,
  originalPrice,
  tripId,
  tripTitle,
  tripImage,
  duration,
  startLocation,
  endLocation,
  departures,
  depositPrice,
}: {
  price: number;
  originalPrice?: number;
  tripId: string;
  tripTitle: string;
  tripImage: string;
  duration: string;
  startLocation?: string;
  endLocation?: string;
  departures: Departure[];
  depositPrice: number;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const handler = () => setBookingOpen(true);
    window.addEventListener("open-booking", handler);
    // Deep link: /destinations/.../trip#check-dates opens the modal on load
    // (used by Tru.D's "Check dates" link from other pages).
    let deepLink: ReturnType<typeof setTimeout> | undefined;
    if (window.location.hash === "#check-dates") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      deepLink = setTimeout(() => window.dispatchEvent(new CustomEvent("open-booking")), 150);
    }
    return () => {
      window.removeEventListener("open-booking", handler);
      if (deepLink) clearTimeout(deepLink);
    };
  }, []);

  return (
    <>
      <TripStickyNav
        price={price}
        originalPrice={originalPrice}
        tripTitle={tripTitle}
        onBookNow={() => setBookingOpen(true)}
      />
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        tripId={tripId}
        tripTitle={tripTitle}
        tripImage={tripImage}
        duration={duration}
        startLocation={startLocation}
        endLocation={endLocation}
        departures={departures}
        depositPrice={depositPrice}
      />
    </>
  );
}
