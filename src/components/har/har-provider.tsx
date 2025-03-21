import { createContext, useContext } from "react";

interface HarContextType {}

const HarContext = createContext<HarContextType | undefined>(undefined);

export function HarProvider({ children }: { children: React.ReactNode }) {
  return <HarContext.Provider value={{}}>{children}</HarContext.Provider>;
}

export function useHar() {
  const context = useContext(HarContext);
  if (context === undefined) {
    throw new Error("useHar must be used within a HarProvider");
  }
  return context;
}
