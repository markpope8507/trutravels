"use client";

import { ReactNode } from "react";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import ThemeToggle from "@/components/theme-toggle";

function ThemeInner({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <div data-theme={theme} className="trip-themed">
      <ThemeToggle />
      {children}
    </div>
  );
}

export default function TripThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeInner>{children}</ThemeInner>
    </ThemeProvider>
  );
}
