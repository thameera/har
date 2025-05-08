import { createContext, useContext, useState } from "react";
import {
  HarContextType,
  HarData,
  HarRequest,
  NameValueParam,
} from "./harTypes";

const HarContext = createContext<HarContextType | undefined>(undefined);

export function HarProvider({ children }: { children: React.ReactNode }) {
  const [harData, setHarData] = useState<HarData | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HarRequest | null>(
    null,
  );
  const [pinnedRequests, setPinnedRequests] = useState<HarRequest[]>([]);

  const setHarFile = (data: HarData) => {
    console.log("setting har file");
    const SAML_KEYS = new Set(["SAMLResponse", "SAMLRequest"]);

    data.log.entries.forEach((request, index) => {
      // Initialize the custom data object
      request._custom = {
        id: index,
        samlList: [],
      };

      // Extract query params
      try {
        const url = new URL(request.request.url);
        const searchParams = new URLSearchParams(url.search);

        if (searchParams.toString()) {
          const queryParams = Array.from(searchParams.entries()).map(
            ([key, value]) => ({
              name: decodeURIComponent(key),
              value: decodeURIComponent(value),
              isSaml: SAML_KEYS.has(key),
            }),
          );

          request._custom.queryParams = queryParams;
          request._custom.samlList = queryParams.filter(
            (param) => param.isSaml,
          );
        }

        // Extract hash fragments
        const hash = url.hash.slice(1); // Remove the # symbol
        if (hash) {
          const hashParams = new URLSearchParams(hash);
          if (hashParams.toString()) {
            request._custom.hashParams = Array.from(hashParams.entries()).map(
              ([key, value]): NameValueParam => ({
                name: decodeURIComponent(key),
                value: decodeURIComponent(value),
              }),
            );
          }
        }

        // Extract form data from POST requests
        const isPostRequest = request.request.method.toUpperCase() === "POST";
        const hasFormData =
          isPostRequest &&
          request.request.postData?.params &&
          request.request.postData.params.length > 0;

        if (hasFormData) {
          const formData = request.request.postData!.params!.map(
            (param): NameValueParam => ({
              name: decodeURIComponent(param.name),
              value: decodeURIComponent(param.value),
              isSaml: SAML_KEYS.has(param.name),
            }),
          );

          request._custom.formData = formData;

          const samlFormData = formData.filter((param) => param.isSaml);
          request._custom.samlList = [
            ...request._custom.samlList,
            ...samlFormData,
          ];
        }
      } catch (error) {
        console.error(`Error parsing URL for request ${index}:`, error);
        // Continue processing even if one URL fails to parse
      }
    });

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
