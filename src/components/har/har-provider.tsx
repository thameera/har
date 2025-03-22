import { createContext, useContext, useState } from "react";

interface HarContextType {
  harData: any[] | null;
  setHarFile: (data: any[]) => void;
}

const HarContext = createContext<HarContextType | undefined>(undefined);

export function HarProvider({ children }: { children: React.ReactNode }) {
  const [harData, setHarFile] = useState<any[] | null>(null);

  return (
    <HarContext.Provider
      value={{
        harData,
        setHarFile,
      }}
    >
      {children}
    </HarContext.Provider>
  );
}

export function useHar() {
  const context = useContext(HarContext);
  if (context === undefined) {
    throw new Error("useHar must be used within a HarProvider");
  }
  return context;
}
