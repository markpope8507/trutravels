"use client";

import { useSyncExternalStore } from "react";

/* Shared open/close state for the "Featured on" tour lists on activity cards.
   Toggling one opens/closes every list in the Things To Do carousel, so the
   slides stay the same height as each other. */
let open = false;
const listeners = new Set<() => void>();

export function toggleToursDisclosure() {
  open = !open;
  listeners.forEach((l) => l());
}

export function useToursDisclosure() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );
}
