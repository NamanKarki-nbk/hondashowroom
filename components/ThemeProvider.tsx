"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

function ThemeSyncer() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "honda-theme") {
        setTheme(e.newValue ?? "system");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [setTheme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSyncer />
      {children}
    </NextThemesProvider>
  );
}
