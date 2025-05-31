"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useContext, useState } from "react";

interface CustomThemeContextType {
  currentfontSize: string;
  toggleFontSize: () => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(
  undefined,
);

export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fontSize, setFontSize] = useState("small");

  const toggleFontSize = () => {
    setFontSize(fontSize === "small" ? "normal" : "small");
  };

  return (
    <CustomThemeContext.Provider
      value={{ currentfontSize: fontSize, toggleFontSize }}
    >
      {children}
    </CustomThemeContext.Provider>
  );
};

export function useCustomTheme() {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider");
  }
  return context;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </NextThemesProvider>
  );
}
