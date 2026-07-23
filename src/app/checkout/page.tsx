"use client";

import { useEffect, useRef } from "react";
import "./checkout.css";
import { CHECKOUT_HTML } from "./checkout-markup";
import { runCheckout } from "./checkout-script";

const PROTO_CART_KEY = "trutravels-cart"; // CartProvider (localStorage)
const CHECKOUT_CART_KEY = "truCart"; // what the checkout script reads (sessionStorage)

/* The CartProvider stores the departure date as a raw ISO string ("2026-04-12").
   Format it the same way the static checkout does ("Sun, 12 Apr 2026") so the
   checkout's dates read consistently instead of showing raw ISO. */
function fmtDate(v: unknown): unknown {
  if (typeof v !== "string") return v;
  const d = new Date(v);
  if (isNaN(d.getTime())) return v; // already a formatted string — leave it
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/* Bridge the prototype cart into the shape the (embedded) checkout expects.
   If the cart is empty the checkout seeds its own demo cart. */
function bridgeCart() {
  try {
    const raw = localStorage.getItem(PROTO_CART_KEY);
    if (!raw) return;
    const items = JSON.parse(raw);
    if (!Array.isArray(items) || items.length === 0) return;
    const mapped = items.map((it: Record<string, unknown>) => ({
      tripTitle: it.tripTitle,
      image: it.image,
      date: fmtDate(it.date),
      endDate: fmtDate(it.endDate),
      duration: it.duration,
      startLocation: it.startLocation,
      endLocation: it.endLocation,
      travellers: (it.travellers as number) || 1,
      price: it.pricePerPerson,
      orig: it.originalPricePerPerson,
      deposit: it.depositPerPerson,
      room: "shared",
      addons: {},
    }));
    sessionStorage.setItem(CHECKOUT_CART_KEY, JSON.stringify(mapped));
  } catch {
    /* ignore — checkout will seed a demo cart */
  }
}

export default function CheckoutPage() {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return; // guard React strict-mode double-invoke
    started.current = true;
    bridgeCart();
    runCheckout();
  }, []);

  return (
    <div className="co-body" dangerouslySetInnerHTML={{ __html: CHECKOUT_HTML }} />
  );
}
