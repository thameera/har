import { createContext, useContext, useState } from "react";
import { HarContextType, HarData, HarRequest } from "./harTypes";

const HarContext = createContext<HarContextType | undefined>(undefined);

export function HarProvider({ children }: { children: React.ReactNode }) {
  const [harData, setHarData] = useState<HarData | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HarRequest | null>(
    null,
  );
  const [pinnedRequests, setPinnedRequests] = useState<HarRequest[]>([]);

  const setHarFile = (data: HarData) => {
    console.log("setting har file");
    // Set the id for each request
    if (data?.log?.entries) {
      data.log.entries.forEach((request, index) => {
        if (!request._custom) {
          request._custom = {};
        }
        request._custom.id = index;

        // Extract query params
        try {
          const url = new URL(request.request.url);
          const searchParams = new URLSearchParams(url.search);

          if (searchParams.toString()) {
            request._custom.queryParams = Array.from(
              searchParams.entries(),
            ).map(([key, value]) => ({
              name: decodeURIComponent(key),
              value: decodeURIComponent(value),
            }));
          }

          // Extract hash fragments
          const hash = url.hash.slice(1); // Remove the # symbol
          if (hash) {
            const hashParams = new URLSearchParams(hash);
            if (hashParams.toString()) {
              request._custom.hashParams = Array.from(hashParams.entries()).map(
                ([key, value]) => ({
                  name: decodeURIComponent(key),
                  value: decodeURIComponent(value),
                }),
              );
            }
          }

          // Extract form data from POST requests
          const isPostRequest = request.request.method.toUpperCase() === "POST";
          if (
            isPostRequest &&
            request.request.postData?.params &&
            request.request.postData.params.length > 0
          ) {
            request._custom.formData = request.request.postData.params.map(
              (param) => ({
                name: decodeURIComponent(param.name),
                value: decodeURIComponent(param.value),
              }),
            );
          }
        } catch (error) {
          console.error(`Error parsing URL for request ${index}:`, error);
          // Continue processing even if one URL fails to parse
        }
        if (request.request.url.includes("/authorize")) {
          console.log(request);
        }
      });
    }

    setHarData(data);
  };

  const getAllRequests = (): HarRequest[] => {
    if (!harData?.log?.entries) {
      return [];
    }
    return harData.log.entries;
  };

  const selectRequest = (request: HarRequest | null) => {
    setSelectedRequest(request);
  };

  const togglePin = (id: number) => {
    const request: HarRequest | undefined = harData?.log?.entries?.find(
      (req) => req._custom?.id === id,
    );
    if (!request) {
      console.error(`Request with id ${id} not found`);
      return;
    }

    // Toggle the pinned status
    request._custom!.pinned = !request._custom!.pinned;

    // Force re-render by creating a new harData state object
    setHarData({ ...harData! });

    // Update pinnedRequests while maintaining original order
    if (harData?.log?.entries) {
      const orderedPinnedRequests = harData.log.entries.filter(
        (req) => req._custom?.pinned,
      );
      setPinnedRequests(orderedPinnedRequests);
    }
  };

  const isPinned = (request: HarRequest): boolean => {
    return !!request._custom?.pinned;
  };

  return (
    <HarContext.Provider
      value={{
        harData,
        setHarFile,
        getAllRequests,
        selectedRequest,
        selectRequest,
        togglePin,
        isPinned,
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
