"use client";

import { useSyncExternalStore } from "react";

/* Shared open/close state for the "TRU Experience Types" disclosures.
   Toggling one opens/closes every disclosure on the page — across all
   trip-card and deal-card carousels. */
let open = false;
const listeners = new Set<() => void>();

export function toggleExpDisclosure() {
  open = !open;
  listeners.forEach((l) => l());
}

export function useExpDisclosure() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );
}
