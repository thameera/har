"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useContext, useState } from "react";

interface FontSizeContext {
  fontSize: string;
  toggleFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContext | undefined>(undefined);

export const FontSizeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fontSize, setFontSize] = useState("small");

  const toggleFontSize = () => {
    setFontSize(fontSize === "small" ? "normal" : "small");
  };
  return (
    <FontSizeContext.Provider value={{ fontSize, toggleFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export function _temp_useFont() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useHar must be used within a HarProvider");
  }
  return context;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <FontSizeProvider>{children}</FontSizeProvider>
    </NextThemesProvider>
  );
}
