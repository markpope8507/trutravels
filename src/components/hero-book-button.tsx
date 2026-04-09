"use client";

export default function HeroBookButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
      className="ml-auto rounded-[10px] bg-tru-green px-5 py-2 text-[11px] font-semibold text-tru-navy hover:bg-tru-green-light transition-all duration-300 uppercase tracking-wider font-heading"
    >
      Book Now
    </button>
  );
}
