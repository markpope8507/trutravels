"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { SignupModal } from "@/components/join-community";

/* Global auth/join modal. Any "Log in" / "Join" trigger anywhere in the app can
   call openAuth() to pop the shared sign-in modal (email + Google/Facebook/Apple),
   instead of routing to /login or /signup. */
const AuthModalContext = createContext<{ openAuth: () => void }>({ openAuth: () => {} });

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openAuth = useCallback(() => setOpen(true), []);
  return (
    <AuthModalContext.Provider value={{ openAuth }}>
      {children}
      {open && <SignupModal onClose={() => setOpen(false)} />}
    </AuthModalContext.Provider>
  );
}
