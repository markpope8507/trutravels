"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CartDrawer() {
  const {
    items,
    count,
    total,
    totalDeposit,
    totalSavings,
    drawerOpen,
    closeDrawer,
    removeItem,
    updateTravellers,
  } = useCart();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      closeDrawer();
    }, 300);
  };

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />
      <div
        className={`relative w-full sm:w-[440px] lg:w-[480px] bg-tru-navy flex flex-col h-full shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
          closing ? "translate-x-full" : "animate-slide-in-right"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-black text-lg uppercase font-heading tracking-wider">
              Your Trips
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {items.length === 0
                ? "Cart is empty"
                : `${items.length} trip${items.length === 1 ? "" : "s"} · ${count} traveller${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close cart"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="h-14 w-14 text-gray-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <p className="text-white font-semibold text-sm mb-2">
                No trips in your cart yet
              </p>
              <p className="text-gray-400 text-xs max-w-xs mx-auto mb-6">
                Browse adventures and tap &ldquo;Add to Cart&rdquo; on a date to start
                planning a multi-trip booking.
              </p>
              <Link
                href="/explore"
                onClick={handleClose}
                className="inline-block rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition uppercase tracking-wider font-heading"
              >
                Explore Trips
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const lineSave = item.originalPricePerPerson
                  ? (item.originalPricePerPerson - item.pricePerPerson) *
                    item.travellers
                  : 0;

                return (
                <div
                  key={item.id}
                  className="rounded-[12px] border border-white/10 bg-white/[0.04] overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    <div className="h-20 w-20 rounded-[8px] overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.tripTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold font-heading leading-snug truncate">
                        {item.tripTitle}
                      </p>
                      <p className="text-gray-300 text-[11px] mt-1 flex items-center gap-1.5">
                        <svg className="h-3 w-3 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(item.date)}
                      </p>
                      <p className="text-gray-300 text-[11px] mt-0.5 flex items-center gap-1.5">
                        <svg className="h-3 w-3 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="9" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                        </svg>
                        {item.duration}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-400 transition flex-shrink-0"
                      aria-label="Remove from cart"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateTravellers(item.id, item.travellers - 1)
                        }
                        className="h-7 w-7 rounded-full border border-white/15 flex items-center justify-center text-white hover:border-white/40 transition text-xs"
                      >
                        −
                      </button>
                      <span className="text-white text-sm font-bold w-6 text-center">
                        {item.travellers}
                      </span>
                      <button
                        onClick={() =>
                          updateTravellers(item.id, item.travellers + 1)
                        }
                        className="h-7 w-7 rounded-full border border-white/15 flex items-center justify-center text-white hover:border-white/40 transition text-xs"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2 justify-end">
                        {item.originalPricePerPerson && (
                          <span className="text-gray-500 text-[11px] line-through">
                            &pound;{item.originalPricePerPerson * item.travellers}
                          </span>
                        )}
                        <p className="text-white text-base font-black font-heading">
                          &pound;{item.pricePerPerson * item.travellers}
                        </p>
                      </div>
                      {lineSave > 0 && (
                        <p className="text-tru-pink text-[10px] font-semibold uppercase tracking-wider font-heading mt-0.5">
                          Save &pound;{lineSave}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5 space-y-3 bg-white/[0.02]">
            {totalSavings > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-tru-pink">You save</span>
                <span className="text-tru-pink font-bold">&pound;{totalSavings}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="text-white text-2xl font-black font-heading">
                &pound;{total}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Or deposit today</span>
              <span className="text-white font-bold">&pound;{totalDeposit}</span>
            </div>
            <button
              className="w-full rounded-[10px] py-3.5 text-sm font-bold uppercase tracking-wider font-heading transition-all duration-200 border mt-2"
              style={{
                backgroundColor: "#FFD814",
                borderColor: "#FCD200",
                color: "#0F1111",
              }}
            >
              Proceed To Checkout &rarr;
            </button>
            <p className="text-center text-[10px] text-gray-500 uppercase tracking-wider font-heading">
              Free date change up to 60 days before departure
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
