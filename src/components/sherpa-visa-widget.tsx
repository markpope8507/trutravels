"use client";

import { useEffect } from "react";

// Embeds the Sherpa visa-requirements widget (same appId as the live site).
const SHERPA_SRC = "https://sdk.joinsherpa.io/widget.js?appId=spA4MzM1Mz&02072026B";

const MOUNT_ID = "sherpa-trip-element";

type SherpaGlobal = {
  V2?: { createElement: (type: string) => { mount: (selector: string) => void } };
};

/**
 * Two things about this SDK that are easy to get wrong:
 *
 *  1. It publishes itself as `window.$sherpa`, not `window.sherpa`, and does so
 *     a beat after the script's onload fires — hence the short poll.
 *  2. Mounting into the same node twice leaves the widget's iframe stuck at
 *     height 0. StrictMode runs effects twice in dev, so the container is
 *     checked for an existing mount before calling mount() again.
 *
 * The static mirror in converted/.build/build_essentials.py carries the same
 * logic; keep the two in step.
 */
export default function SherpaVisaWidget() {
  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    const mount = () => {
      if (cancelled) return;

      const host = document.getElementById(MOUNT_ID);
      if (!host || host.childElementCount > 0) return; // already mounted

      const sherpa = (window as unknown as { $sherpa?: SherpaGlobal }).$sherpa;
      if (sherpa?.V2) {
        try {
          sherpa.V2.createElement("trip").mount(`#${MOUNT_ID}`);
        } catch {
          /* widget handles its own errors */
        }
      } else if (tries < 25) {
        tries += 1;
        setTimeout(mount, 200);
      }
    };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SHERPA_SRC}"]`);
    if (existing) {
      mount();
    } else {
      const script = document.createElement("script");
      script.src = SHERPA_SRC;
      script.async = true;
      script.onload = mount;
      script.onerror = () => { /* leave the container empty rather than half-render */ };
      document.body.appendChild(script);
    }

    return () => { cancelled = true; };
  }, []);

  // min-height so the panel doesn't collapse while the embed sizes itself
  return <div id={MOUNT_ID} className="min-h-[320px]" />;
}
