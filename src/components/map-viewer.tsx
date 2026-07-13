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
        const newScale = Math.min(Math.max(scale * (distance / lastDistance.current), 1), 4);
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

  // Lock background scroll + close on Escape while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div
        className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden cursor-pointer group relative"
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} className="w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={handleClose}>
          <div className="absolute inset-0 bg-black/90" />

          {/* Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {scale > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 sm:hidden">
            <p className="text-gray-400 text-xs bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">Pinch to zoom</p>
          </div>

          {/* Map image */}
          <div
            className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden touch-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-[95vw] max-h-[85vh] object-contain transition-transform duration-100"
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
