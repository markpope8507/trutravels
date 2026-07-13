import { useEffect } from "react";

/**
 * Lock background page scroll while a popup/overlay is open.
 * Pass the overlay's visibility flag; scroll is restored on close/unmount.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}
