"use client";

import { useParams } from "next/navigation";
import AccountGate from "@/components/account-gate";
import TripHub from "@/components/trip-hub";

/* Parked — see ../../README.md. The hub itself lives in components/trip-hub.tsx
   so the shareable demo at /preview/trip-hub can mount the same thing without
   the account gate. Moving this folder back under my-account is all that's
   needed to switch it on. */
export default function TripHubPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  return (
    <AccountGate>
      <TripHub
        bookingId={bookingId}
        links={{
          backHref: "/my-account/dashboard",
          backLabel: "Dashboard",
          chatHref: `/my-account/trip-hub/${bookingId}/chat`,
        }}
      />
    </AccountGate>
  );
}
