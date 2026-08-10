"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Suppress React 19 strict warning for next-themes script tag injection
  if (typeof window !== "undefined") {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering React component")) {
        return;
      }
      originalConsoleError(...args);
    };
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
