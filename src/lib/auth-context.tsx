"use client";

// ============================================================
// AUTH CONTEXT — Mock authentication for the prototype.
// In production this would connect to a real auth provider.
// It stores login state in the browser so it survives page
// refreshes (using localStorage).
// ============================================================

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: User = {
  name: "Alex Traveller",
  email: "alex@trutravels.com",
  avatar: "AT",
  memberSince: "2025",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem("trutravels-user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email: string, _password: string): boolean => {
    // Mock: any non-empty email/password works
    if (!email) return false;
    const u = { ...MOCK_USER, email };
    setUser(u);
    localStorage.setItem("trutravels-user", JSON.stringify(u));
    return true;
  };

  const signup = (name: string, email: string, _password: string): boolean => {
    if (!name || !email) return false;
    const u = { ...MOCK_USER, name, email };
    setUser(u);
    localStorage.setItem("trutravels-user", JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("trutravels-user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
