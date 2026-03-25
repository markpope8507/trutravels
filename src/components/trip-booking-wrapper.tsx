"use client";

import { useState } from "react";
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
  tripTitle,
  duration,
  startLocation,
  endLocation,
  departures,
  depositPrice,
}: {
  price: number;
  originalPrice?: number;
  tripTitle: string;
  duration: string;
  startLocation?: string;
  endLocation?: string;
  departures: Departure[];
  depositPrice: number;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <TripStickyNav
        price={price}
        originalPrice={originalPrice}
        onBookNow={() => setBookingOpen(true)}
      />
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        tripTitle={tripTitle}
        duration={duration}
        startLocation={startLocation}
        endLocation={endLocation}
        departures={departures}
        depositPrice={depositPrice}
      />
    </>
  );
}
