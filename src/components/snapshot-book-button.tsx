"use client";

export default function SnapshotBookButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
      className="w-full mt-6 rounded-[10px] py-3.5 text-sm font-bold uppercase tracking-wider font-heading transition-all duration-200 border"
      style={{
        backgroundColor: "#FFD814",
        borderColor: "#FCD200",
        color: "#0F1111",
      }}
    >
      Check Dates &rarr;
    </button>
  );
}
