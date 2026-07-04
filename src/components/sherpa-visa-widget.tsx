"use client";

import { useEffect } from "react";

// Embeds the Sherpa visa-requirements widget (same appId as the live site).
const SHERPA_SRC = "https://sdk.joinsherpa.io/widget.js?appId=spA4MzM1Mz&02072026B";

type SherpaGlobal = {
  V2?: { createElement: (type: string) => { mount: (selector: string) => void } };
};

export default function SherpaVisaWidget() {
  useEffect(() => {
    let tries = 0;

    const mount = () => {
      const sherpa = (window as unknown as { sherpa?: SherpaGlobal }).sherpa;
      if (sherpa?.V2) {
        try {
          sherpa.V2.createElement("trip").mount("#sherpa-trip-element");
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
      return;
    }

    const script = document.createElement("script");
    script.src = SHERPA_SRC;
    script.async = true;
    script.onload = mount;
    document.body.appendChild(script);
  }, []);

  return <div id="sherpa-trip-element" />;
}
