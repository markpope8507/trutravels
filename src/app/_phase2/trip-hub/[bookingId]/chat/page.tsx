"use client";

import { useParams } from "next/navigation";
import AccountGate from "@/components/account-gate";
import TripHubChat from "@/components/trip-hub-chat";

/* Parked — see ../../../README.md. */
export default function ChatPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  return (
    <AccountGate>
      <TripHubChat bookingId={bookingId} hubHref={`/my-account/trip-hub/${bookingId}`} />
    </AccountGate>
  );
}
