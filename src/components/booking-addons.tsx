"use client";

import { useState } from "react";
import {
  ADDONS,
  ROOM_TYPES,
  ROOM_UPGRADE,
  ROOM_FROM,
  NIGHTS_RANGE,
  isHotelAddon,
  roomsPlaced,
  roomingCost,
  defaultRooming,
  clampRooming,
  canAddRoom,
  formatMoney,
  shiftDate,
  type AddonId,
  type Rooming,
} from "@/lib/addons";

/**
 * Add-Ons on an existing booking. Offers exactly what the checkout offers and
 * on the same terms — the pre/post-night hotels expand into the same nights +
 * rooming panel, capped at the travellers on this booking, and the transfers
 * carry the same (i) caveat about needing a hotel night either side.
 *
 * Prices and rules come from lib/addons.ts so the two surfaces can't drift.
 * Anything already on the booking shows as booked rather than sellable.
 */
export default function BookingAddons({
  booking,
}: {
  booking: {
    travellers: number;
    startLocation: string;
    endLocation: string;
    departureDate: string;
    endDate: string;
    extras?: { preNightHotel?: boolean; airportTransfer?: boolean; ownRoom?: boolean };
  };
}) {
  const pax = booking.travellers || 1;
  const locations = { start: booking.startLocation, end: booking.endLocation };

  // What's already on the booking — shown as booked, not offered again.
  const alreadyBooked: Partial<Record<AddonId, boolean>> = {
    prenight: !!booking.extras?.preNightHotel,
    arrival: !!booking.extras?.airportTransfer,
  };

  const [rooming, setRooming] = useState<Partial<Record<AddonId, Rooming>>>({});
  const [selected, setSelected] = useState<Partial<Record<AddonId, boolean>>>({});
  const [openInfo, setOpenInfo] = useState<AddonId | null>(null);

  const toggle = (id: AddonId) => {
    setSelected((s) => {
      const on = !s[id];
      if (on && isHotelAddon(id)) {
        setRooming((r) => ({ ...r, [id]: defaultRooming(pax) }));
      }
      return { ...s, [id]: on };
    });
  };

  const step = (id: AddonId, key: "nights" | (typeof ROOM_TYPES)[number]["id"], dir: 1 | -1) => {
    setRooming((r) => {
      const current = r[id];
      if (!current) return r;
      const next: Rooming = { ...current };
      if (key === "nights") {
        next.nights = Math.max(NIGHTS_RANGE[0], Math.min(NIGHTS_RANGE[1], next.nights + dir));
      } else {
        const type = ROOM_TYPES.find((t) => t.id === key)!;
        // never place more travellers in beds than are on the booking
        if (dir < 0 ? next[key] > 0 : canAddRoom(next, type, pax)) next[key] += dir;
      }
      return { ...r, [id]: clampRooming(next, pax) };
    });
  };

  const checkinFor = (id: AddonId, r?: Rooming) =>
    id === "prenight"
      ? shiftDate(booking.departureDate, -(r?.nights ?? 1))
      : shiftDate(booking.endDate, 0);

  const running = ADDONS.reduce((sum, a) => {
    if (!selected[a.id] || alreadyBooked[a.id]) return sum;
    return sum + (isHotelAddon(a.id) ? roomingCost(rooming[a.id]) : a.price);
  }, 0);

  const stepper = (
    id: AddonId,
    key: "nights" | (typeof ROOM_TYPES)[number]["id"],
    value: number,
    canDec: boolean,
    canInc: boolean,
  ) => (
    <span className="inline-flex items-center gap-2 flex-shrink-0">
      <button
        type="button"
        onClick={() => step(id, key, -1)}
        disabled={!canDec}
        aria-label="One fewer"
        className="h-8 w-8 rounded-full border-[1.5px] border-white/20 bg-white/5 text-white grid place-items-center hover:border-tru-pink hover:text-tru-pink disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white transition"
      >
        &minus;
      </button>
      <span className="min-w-[2.25rem] h-8 grid place-items-center rounded-lg border border-white/15 bg-tru-navy font-heading font-extrabold tabular-nums text-sm text-white">
        {value}
      </span>
      <button
        type="button"
        onClick={() => step(id, key, 1)}
        disabled={!canInc}
        aria-label="One more"
        className="h-8 w-8 rounded-full border-[1.5px] border-white/20 bg-white/5 text-white grid place-items-center hover:border-tru-pink hover:text-tru-pink disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white transition"
      >
        +
      </button>
    </span>
  );

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-xs mb-2">
        Everything you could add at checkout, you can still add here. Extras are confirmed by the team and
        charged to your booking &mdash; nothing is taken until they&apos;re confirmed.
      </p>

      {(["Accommodation", "Transfers"] as const).map((category) => (
        <div key={category}>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.18em] font-heading mt-4 mb-2">
            {category}
          </p>

          {ADDONS.filter((a) => a.category === category).map((addon) => {
            const booked = !!alreadyBooked[addon.id];
            const on = !!selected[addon.id] && !booked;
            const r = rooming[addon.id];
            const cost = isHotelAddon(addon.id) ? roomingCost(r) : addon.price;
            const placed = r ? roomsPlaced(r) : 0;
            const left = pax - placed;

            return (
              <div
                key={addon.id}
                className={`rounded-[10px] border mb-2 transition ${
                  on ? "border-tru-pink/40 bg-tru-pink/[0.06]" : "border-white/10 bg-white/5"
                }`}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold flex items-center gap-1.5">
                      {addon.name}
                      {addon.info && (
                        <span className="relative inline-flex">
                          <button
                            type="button"
                            onClick={() => setOpenInfo(openInfo === addon.id ? null : addon.id)}
                            aria-label={`More about the ${addon.name}`}
                            aria-expanded={openInfo === addon.id}
                            className="text-gray-400 hover:text-tru-pink transition"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <circle cx="12" cy="12" r="9" />
                              <path strokeLinecap="round" d="M12 11.25v4.75" />
                              <circle cx="12" cy="7.9" r="1" fill="currentColor" stroke="none" />
                            </svg>
                          </button>
                          {openInfo === addon.id && (
                            <span
                              role="tooltip"
                              className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-20 w-[260px] max-w-[70vw] rounded-[10px] border border-white/15 bg-tru-navy p-3 text-[11px] font-normal leading-relaxed text-gray-300 shadow-xl"
                            >
                              {addon.info(locations)}
                            </span>
                          )}
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {addon.on === "start" ? booking.startLocation : booking.endLocation}
                      {" · "}
                      {addon.id === "arrival"
                        ? `Pick-up from ${booking.startLocation} Airport`
                        : addon.id === "departure"
                          ? `Drop-off to ${booking.endLocation} Airport`
                          : shiftDate(
                              addon.on === "start" ? booking.departureDate : booking.endDate,
                              addon.on === "start" ? -1 : 0,
                            )}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-white text-sm font-semibold">
                      {isHotelAddon(addon.id)
                        ? on && cost > 0
                          ? formatMoney(cost)
                          : `from £${ROOM_FROM}`
                        : formatMoney(addon.price)}
                    </p>
                    {booked ? (
                      <span className="text-tru-green text-[9px] font-bold uppercase">Booked ✓</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggle(addon.id)}
                        className={`mt-1 rounded-[10px] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition ${
                          on
                            ? "border border-tru-green text-tru-green"
                            : "bg-tru-pink text-white hover:bg-tru-pink-light"
                        }`}
                      >
                        {on ? "Added" : "Add"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Hotel nights + rooming — the same panel as checkout */}
                {on && isHotelAddon(addon.id) && r && (
                  <div className="border-t border-white/10 px-4 py-4">
                    <div className="flex items-center gap-3 py-1">
                      {stepper(addon.id, "nights", r.nights, r.nights > NIGHTS_RANGE[0], r.nights < NIGHTS_RANGE[1])}
                      <span className="text-sm text-white">
                        Nights at{" "}
                        <strong className="font-semibold">
                          TruTravels {addon.on === "start" ? booking.startLocation : booking.endLocation} Hotel
                        </strong>
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px] mb-2">
                      Check-in <span className="text-white font-semibold">{checkinFor(addon.id, r)}</span>
                    </p>

                    <div className="flex items-baseline justify-between gap-3 mt-3 mb-1">
                      <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.18em] font-heading">
                        Rooming
                      </p>
                      <p className={`text-[11px] font-bold tabular-nums ${left > 0 ? "text-amber-400" : "text-tru-green"}`}>
                        {placed} of {pax} traveller{pax === 1 ? "" : "s"} placed
                      </p>
                    </div>

                    {ROOM_TYPES.filter((t) => !t.min2 || pax > 1).map((t) => (
                      <div key={t.id} className="flex items-center gap-3 py-1.5">
                        {stepper(addon.id, t.id, r[t.id], r[t.id] > 0, left >= t.sleeps)}
                        <span className="min-w-0">
                          <span className="block text-sm text-white">
                            {t.name}
                            <span className="ml-1.5 text-xs font-semibold text-white">£{t.price} {t.rate}</span>
                          </span>
                          <span className="block text-[11px] text-gray-400">{t.note}</span>
                        </span>
                      </div>
                    ))}

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3 text-sm">
                      {cost > 0 ? (
                        <>
                          <span className="text-gray-400">
                            {r.nights} night{r.nights > 1 ? "s" : ""} · {placed} traveller{placed === 1 ? "" : "s"}
                          </span>
                          <strong className="font-heading font-extrabold text-white tabular-nums">
                            {formatMoney(cost)}
                          </strong>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Choose how your group is rooming to include this stay.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Own room upgrade — the same supplement the checkout charges */}
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.18em] font-heading mt-4 mb-2">
        Rooming on the trip
      </p>
      <div className="rounded-[10px] border border-white/10 bg-white/5 p-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">My Own Room Upgrade</p>
          <p className="text-gray-400 text-xs">
            Upgrade from twin-share to your own private room for the whole trip. Subject to availability.
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-white text-sm font-semibold">{formatMoney(ROOM_UPGRADE)}</p>
          <p className="text-gray-500 text-[9px] uppercase tracking-wider">per person</p>
          <button
            type="button"
            className="mt-1 rounded-[10px] bg-tru-pink px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-tru-pink-light transition"
          >
            Request
          </button>
        </div>
      </div>

      {running > 0 && (
        <div className="mt-4 rounded-[10px] border border-tru-pink/30 bg-tru-pink/[0.08] p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-white text-sm font-semibold">Extras to add</p>
            <p className="text-gray-400 text-xs">We&apos;ll confirm availability before anything is charged.</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-heading font-extrabold text-lg text-white tabular-nums">{formatMoney(running)}</p>
            <button
              type="button"
              className="mt-1 rounded-[10px] bg-tru-pink px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-tru-pink-light transition"
            >
              Request extras
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
