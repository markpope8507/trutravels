"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TrudChat, { SparkIcon } from "@/components/trud-chat";

// Floating "Ask Tru.D" launcher, bottom-right on every page except /support
// (where the chat is inline) and checkout.

export default function TrudLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!pathname || pathname.startsWith("/support") || pathname.startsWith("/checkout")) return null;

  return (
    <>
      {open && (
        <div className="fixed z-[110] inset-x-0 bottom-0 sm:inset-auto sm:right-5 sm:bottom-5 sm:w-[400px] h-[85vh] sm:h-[620px] max-h-[calc(100vh-40px)] rounded-t-[16px] sm:rounded-[16px] border border-white/10 bg-tru-navy shadow-2xl shadow-black/60 overflow-hidden">
          <TrudChat variant="panel" onClose={() => setOpen(false)} />
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close Ask Tru.D" : "Open Ask Tru.D"}
        className={`fixed z-[111] right-4 sm:right-5 bottom-4 sm:bottom-5 inline-flex items-center gap-2 rounded-full bg-tru-pink hover:bg-tru-pink-light text-white pl-3 pr-4 py-2.5 text-xs font-bold uppercase tracking-wider font-heading shadow-lg shadow-black/40 transition ${open ? "sm:hidden" : ""}`}
      >
        <SparkIcon className="h-4 w-4" />
        Ask Tru.D
      </button>
    </>
  );
}
