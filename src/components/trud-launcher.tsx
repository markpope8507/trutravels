"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TrudChat from "@/components/trud-chat";

// Floating Tru.D launcher, bottom-right on every page except /support (where
// the chat is inline) and checkout. Styled to match the Tru.D widget in the
// trip hub design: gradient sparkle button that shrinks away when the panel
// opens.

export default function TrudLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

      {open && (
        <div className="fixed z-[110] inset-x-0 bottom-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[380px] h-[80vh] sm:h-[560px] max-h-[calc(100vh-48px)] rounded-t-[10px] sm:rounded-[10px] border border-white/10 bg-tru-navy shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-fade-in">
          <TrudChat variant="panel" onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
