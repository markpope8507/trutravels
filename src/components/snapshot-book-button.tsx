"use client";

export default function SnapshotBookButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
      className="w-full mt-6 rounded-[10px] bg-tru-pink py-3.5 text-sm font-bold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider font-heading"
    >
      Book Now &rarr;
    </button>
  );
}
