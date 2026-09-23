"use client";

import { useState, useEffect } from "react";
import TripStickyNav from "@/components/trip-sticky-nav";
import BookingModal from "@/components/booking-modal";
import RegisterInterestModal from "@/components/register-interest-modal";
import type { TripLaunch } from "@/lib/data";

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
  launch,
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
  /** Pre-launch trip — see components/trip-launch-card.tsx. */
  launch?: TripLaunch;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);

  useEffect(() => {
    const handler = () => setBookingOpen(true);
    const interest = () => setInterestOpen(true);
    window.addEventListener("open-booking", handler);
    /* The launch card and the sticky bar both open this, and they don't know
       about each other — an event keeps it to one modal either way. */
    window.addEventListener("register-interest", interest);
    // Deep link: /destinations/.../trip#check-dates opens the modal on load
    // (used by Tru.D's "Check dates" link from other pages).
    let deepLink: ReturnType<typeof setTimeout> | undefined;
    if (window.location.hash === "#check-dates") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      deepLink = setTimeout(() => window.dispatchEvent(new CustomEvent("open-booking")), 150);
    }
    return () => {
      window.removeEventListener("open-booking", handler);
      window.removeEventListener("register-interest", interest);
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
        launch={launch}
        onRegisterInterest={() => setInterestOpen(true)}
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
      {interestOpen && launch && (
        <RegisterInterestModal
          tripTitle={tripTitle}
          onSaleLabel={new Date(launch.onSale).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          onClose={() => setInterestOpen(false)}
        />
      )}
    </>
  );
}
