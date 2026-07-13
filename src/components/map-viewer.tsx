"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function MapViewer({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDistance = useRef(0);
  const lastTouch = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const clamp = (n: number) => Math.min(Math.max(n, 1), 4);
  const zoomIn = () => setScale((s) => clamp(+(s + 0.5).toFixed(2)));
  const zoomOut = () =>
    setScale((s) => {
      const n = clamp(+(s - 0.5).toFixed(2));
      if (n === 1) setTranslate({ x: 0, y: 0 });
      return n;
    });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDistance.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1 && scale > 1) {
      dragging.current = true;
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (lastDistance.current > 0) {
        const newScale = clamp(scale * (distance / lastDistance.current));
        setScale(newScale);
        if (newScale === 1) setTranslate({ x: 0, y: 0 });
      }
      lastDistance.current = distance;
    } else if (e.touches.length === 1 && dragging.current && scale > 1) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      setTranslate({ x: translate.x + dx, y: translate.y + dy });
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    lastDistance.current = 0;
    dragging.current = false;
  };

  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleClose = () => {
    setOpen(false);
    resetZoom();
  };

  // While open: lock background scroll, close on Escape, and (crucially) stop
  // the browser pinch-zooming the whole page — a non-passive touchmove listener
  // on the overlay cancels the native gesture so only the map image zooms.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);

    const el = overlayRef.current;
    const blockPinch = (e: TouchEvent) => {
      if (e.touches.length >= 2) e.preventDefault();
    };
    el?.addEventListener("touchmove", blockPinch, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      el?.removeEventListener("touchmove", blockPinch);
    };
  }, [open]);

  return (
    <>
      {/* Thumbnail with an explicit "explore" CTA */}
      <div
        className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden cursor-pointer group relative"
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} className="w-full h-auto" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 text-tru-navy px-4 py-2 text-xs font-bold uppercase tracking-wider font-heading group-hover:bg-tru-pink group-hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Tap to explore &amp; zoom the route
          </span>
        </div>
      </div>

      {open &&
        createPortal(
          <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center" onClick={handleClose}>
            <div className="absolute inset-0 bg-black/90" />

            {/* Close — always on top, fixed to the viewport */}
            <button
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              aria-label="Close map"
              className="fixed top-4 right-4 z-[130] h-11 w-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoom controls — clear CTA so users know they can zoom */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[130] flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <p className="text-white/80 text-[11px] font-semibold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                Pinch or use +/&minus; to zoom
              </p>
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 p-1.5">
                <button onClick={zoomOut} disabled={scale <= 1} aria-label="Zoom out" className="h-10 w-10 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition disabled:opacity-30">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                </button>
                <button onClick={resetZoom} className="px-3 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold font-heading hover:bg-white/15 transition min-w-[52px]">
                  {Math.round(scale * 100)}%
                </button>
                <button onClick={zoomIn} disabled={scale >= 4} aria-label="Zoom in" className="h-10 w-10 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition disabled:opacity-30">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>

            {/* Map image */}
            <div
              className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden touch-none"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={(e) => setScale((s) => clamp(s - e.deltaY * 0.0015))}
            >
              <img
                src={src}
                alt={alt}
                className="max-w-[92vw] max-h-[80vh] object-contain transition-transform duration-100"
                style={{ transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)` }}
                draggable={false}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
