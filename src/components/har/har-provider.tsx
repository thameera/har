import { createContext, useContext, useState } from "react";

interface HarContextType {
  harData: any[] | null;
  setHarFile: (data: any[]) => void;
  getAllRequests: () => any[];
}

const HarContext = createContext<HarContextType | undefined>(undefined);

export function HarProvider({ children }: { children: React.ReactNode }) {
  const [harData, setHarFile] = useState<any[] | null>(null);

  const getAllRequests = () => {
    if (!harData?.log?.entries) {
      return [];
    }
    return harData.log.entries;
  };

  return (
    <HarContext.Provider
      value={{
        harData,
        setHarFile,
        getAllRequests,
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
