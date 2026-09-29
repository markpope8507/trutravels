"use client";

import TripHub from "@/components/trip-hub";

/* The Trip Hub, open to anyone with the link.
   No AccountGate: the product version sits behind a login, which is exactly
   what a shared preview link can't do. Same component either way. */
export default function TripHubDemo() {
  return (
    <TripHub
      bookingId="b1"
      links={{
        backHref: "/preview/trip-hub",
        backLabel: "Back to overview",
        chatHref: "/preview/trip-hub/demo/chat",
      }}
    />
  );
}
