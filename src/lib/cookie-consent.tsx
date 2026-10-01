"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Cookie consent — the stored decision, and the way to reopen the choice.
 *
 * FOUR CATEGORIES, because that's what the whole competitor set uses and what
 * a visitor is already trained to read: strictly necessary, performance,
 * functional, marketing. G Adventures, Flash Pack and Intro all land on the
 * same four (Flash Pack calls performance "analytics"). Inventing our own
 * taxonomy would only make it harder to skim.
 *
 * NECESSARY IS NOT A CHOICE and isn't presented as one — it's shown locked
 * rather than pre-ticked, so nobody thinks they've been opted into something.
 *
 * REJECT IS AS EASY AS ACCEPT. Both are one click from the banner, which is
 * the rule under UK/EU guidance and also just honest. No pre-ticked optional
 * boxes: everything optional starts off.
 *
 * VERSIONED. Bump CONSENT_VERSION when the categories or the vendors behind
 * them change and everyone is asked again — a stored decision about a
 * different set of cookies isn't consent to this one.
 *
 * NO BACKEND. The decision lives in localStorage; a real deployment would also
 * need the tag manager to read `consent` before firing anything.
 */

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "trutravels-cookie-consent";

export type ConsentCategory = "necessary" | "performance" | "functional" | "marketing";

export type Consent = Record<ConsentCategory, boolean>;

export const CATEGORIES: {
  id: ConsentCategory;
  name: string;
  locked?: boolean;
  summary: string;
  examples: string;
}[] = [
  {
    id: "necessary",
    name: "Strictly Necessary",
    locked: true,
    summary:
      "Needed for the site to work — signing in, holding your cart, remembering this very choice. Can't be switched off.",
    examples: "Session, cart, security, consent record",
  },
  {
    id: "performance",
    name: "Performance",
    summary:
      "Counts visits and shows us which pages people actually use, so we know what to fix. Never used to identify you.",
    examples: "Google Analytics, page timing, error tracking",
  },
  {
    id: "functional",
    name: "Functional",
    summary:
      "Remembers your currency, recently viewed trips and saved wishlist between visits. Turn these off and the site still works, it just forgets you.",
    examples: "Currency, recently viewed, saved trips, live chat",
  },
  {
    id: "marketing",
    name: "Marketing",
    summary:
      "Lets us show you our trips on other sites, and tells us which ads actually led somewhere. This is the one most people are here to switch off.",
    examples: "Meta, Google Ads, TikTok, affiliate tracking",
  },
];

export const ALL_OFF: Consent = {
  necessary: true,
  performance: false,
  functional: false,
  marketing: false,
};

export const ALL_ON: Consent = {
  necessary: true,
  performance: true,
  functional: true,
  marketing: true,
};

type Stored = { version: number; consent: Consent; decidedAt: string };

type ConsentContextValue = {
  /** Null until a decision is read or made — the banner shows on null. */
  consent: Consent | null;
  /** True once we've checked storage, so the banner can't flash on a repeat visit. */
  ready: boolean;
  /** The preference centre is open. */
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  save: (next: Consent) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    // A decision about an older set of categories isn't a decision about this one.
    if (parsed.version !== CONSENT_VERSION) return null;
    return { ...ALL_OFF, ...parsed.consent, necessary: true };
  } catch {
    // Private mode, blocked storage, corrupted value — ask again rather than assume.
    return null;
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  /* Read on the client only. Rendering the banner from the server would put it
     in the HTML for people who decided months ago. */
  useEffect(() => {
    setConsent(read());
    setReady(true);
  }, []);

  const save = useCallback((next: Consent) => {
    const value: Consent = { ...next, necessary: true };
    setConsent(value);
    setPanelOpen(false);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: CONSENT_VERSION, consent: value, decidedAt: new Date().toISOString() } satisfies Stored),
      );
    } catch {
      /* Storage unavailable — the choice holds for this page view and we ask again next time. */
    }
  }, []);

  const value = useMemo(
    () => ({
      consent,
      ready,
      panelOpen,
      openPanel: () => setPanelOpen(true),
      closePanel: () => setPanelOpen(false),
      save,
    }),
    [consent, ready, panelOpen, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useCookieConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  return ctx;
}
