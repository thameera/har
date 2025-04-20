import { createContext, useContext, useState } from "react";
import { HarContextType, HarData, HarRequest } from "./harTypes";

const HarContext = createContext<HarContextType | undefined>(undefined);

export function HarProvider({ children }: { children: React.ReactNode }) {
  const [harData, setHarFile] = useState<HarData | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HarRequest | null>(
    null,
  );
  const [pinnedRequests, setPinnedRequests] = useState<HarRequest[]>([]);

  const getAllRequests = (): HarRequest[] => {
    if (!harData?.log?.entries) {
      return [];
    }
    return harData.log.entries;
  };

  const selectRequest = (request: HarRequest | null) => {
    setSelectedRequest(request);
  };

  const togglePinRequest = (request: HarRequest) => {
    if (!request._custom) {
      request._custom = {};
    }
    request._custom.pinned = !request._custom.pinned;
    // Force re-render by creating a new state object
    setHarFile({ ...harData! });
    // TODO this is a hack. Must be in order ideally
    setPinnedRequests((prev) => [...prev, request]);
  };

  const isPinned = (request: HarRequest): boolean => {
    return !!request._custom?.pinned;
  };

  const getPinnedRequests = (): HarRequest[] => {
    if (!harData?.log?.entries) {
      return [];
    }
    return harData.log.entries.filter((req) => req._custom?.pinned === true);
  };

  return (
    <HarContext.Provider
      value={{
        harData,
        setHarFile,
        getAllRequests,
        selectedRequest,
        selectRequest,
        togglePinRequest,
        isPinned,
        getPinnedRequests,
        pinnedRequests,
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
