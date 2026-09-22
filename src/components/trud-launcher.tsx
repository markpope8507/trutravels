"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import TrudChat from "@/components/trud-chat";

// Floating Tru.D launcher, bottom-right on every page except /support (where
// the chat is inline) and checkout. Styled to match the Tru.D widget in the
// trip hub design: gradient sparkle button that shrinks away when the panel
// opens.


/**
 * Fit the mobile panel to the part of the screen the keyboard leaves behind.
 *
 * WHY dvh ISN'T ENOUGH. `dvh` accounts for browser chrome that comes and goes
 * — the URL bar — but on iOS it does NOT shrink for the on-screen keyboard.
 * And a `position: fixed` element is placed against the LAYOUT viewport,
 * which the keyboard doesn't change either. So `bottom-0` pinned the panel
 * behind the keyboard, iOS scrolled the page up to reveal the focused input,
 * and the top of the chat — the question you just asked — went off screen.
 *
 * visualViewport is the only thing that reports what's actually visible.
 * `window.innerHeight - height - offsetTop` is the strip hidden below it,
 * which in practice is the keyboard.
 *
 * Returns undefined on desktop and when there's no visualViewport, so the
 * Tailwind classes stay in charge there.
 */
function useKeyboardFit(open: boolean): CSSProperties | undefined {
  const [style, setStyle] = useState<CSSProperties>();

  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!open || !vv) {
      setStyle(undefined);
      return;
    }

    const apply = () => {
      // The desktop panel is a fixed-size corner widget; leave it alone.
      if (window.innerWidth >= 640) {
        setStyle(undefined);
        return;
      }
      const hidden = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      // A small strip is browser chrome, not a keyboard. Only take the whole
      // visible area once something big has opened.
      const keyboardUp = hidden > 120;
      setStyle({
        bottom: hidden,
        height: keyboardUp ? vv.height : Math.round(vv.height * 0.8),
        maxHeight: vv.height,
      });
    };

    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, [open]);

  return style;
}

export default function TrudLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const keyboardFit = useKeyboardFit(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClose = () => setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("trud-close", onClose);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("trud-close", onClose);
    };
  }, [open]);

  if (!pathname || pathname.startsWith("/support") || pathname.startsWith("/checkout")) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ask Tru.D"
        aria-expanded={open}
        className={`fixed bottom-6 right-6 z-[111] h-14 w-14 rounded-full bg-gradient-to-br from-tru-pink to-tru-blue flex items-center justify-center text-2xl shadow-lg shadow-black/30 hover:scale-105 transition-all duration-200 ${open ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
      >
        <span aria-hidden="true">✨</span>
      </button>

      {/* The dvh classes handle the URL bar; `keyboardFit` handles the
          keyboard, and wins because an inline style beats a class. */}
      {open && (
        <div
          style={keyboardFit}
          className="fixed z-[110] inset-x-0 bottom-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[380px] h-[80dvh] sm:h-[560px] max-h-[calc(100dvh-48px)] rounded-t-[10px] sm:rounded-[10px] border border-white/10 bg-tru-navy shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-fade-in"
        >
          <TrudChat variant="panel" onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
