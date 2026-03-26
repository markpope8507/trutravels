"use client";

import { useEffect } from "react";

export default function TrackTripView({ tripId }: { tripId: string }) {
  useEffect(() => {
    const key = "trutravels-recent";
    const recent: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [tripId, ...recent.filter((id) => id !== tripId)].slice(0, 6);
    localStorage.setItem(key, JSON.stringify(updated));
  }, [tripId]);

  return null;
}
