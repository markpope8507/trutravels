"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { SignupModal } from "@/components/join-community";
import { LoginModal } from "@/components/login-modal";

/* Global auth modal. Any "Log in" / "Join" trigger anywhere in the app opens
   the shared popup (social shortcuts + email/password). openAuth() and
   openLogin() show the log-in view; openSignup() shows the create-account
   view. The two views switch between each other via their CTAs. */
type AuthApi = { openAuth: () => void; openLogin: () => void; openSignup: () => void };
const AuthModalContext = createContext<AuthApi>({ openAuth: () => {}, openLogin: () => {}, openSignup: () => {} });

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"login" | "signup" | null>(null);
  const close = useCallback(() => setMode(null), []);
  const openLogin = useCallback(() => setMode("login"), []);
  const openSignup = useCallback(() => setMode("signup"), []);

  return (
    <AuthModalContext.Provider value={{ openAuth: openLogin, openLogin, openSignup }}>
      {children}
      {mode === "login" && <LoginModal onClose={close} onSignup={openSignup} />}
      {mode === "signup" && <SignupModal onClose={close} onLogin={openLogin} />}
    </AuthModalContext.Provider>
  );
}
