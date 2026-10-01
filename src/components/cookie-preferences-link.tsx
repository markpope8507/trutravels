"use client";

import { useCookieConsent } from "@/lib/cookie-consent";

/** Footer link that reopens the cookie preference centre. */
export default function CookiePreferencesLink() {
  const { openPanel } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openPanel}
      className="text-gray-400 transition hover:text-tru-pink"
    >
      Cookie Preferences
    </button>
  );
}
