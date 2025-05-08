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
          request._custom.queryParams = Array.from(searchParams.entries()).map(
            ([key, value]) => {
              const queryObj: NameValueParam = {
                name: decodeURIComponent(key),
                value: decodeURIComponent(value),
              };

              //check if query params is a SAML request or response
              if (key === "SAMLResponse" || key === "SAMLRequest") {
                //add to samlList for the current request

                request._custom?.samlList?.push(queryObj);

                return {
                  ...queryObj,
                  isSaml: true,
                };
              }

              return {
                ...queryObj,
                isSaml: false,
              };
            },
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
        if (
          isPostRequest &&
          request.request.postData?.params &&
          request.request.postData.params.length > 0
        ) {
          request._custom.formData = request.request.postData.params.map(
            (param) => {
              const paramObj: NameValueParam = {
                name: decodeURIComponent(param.name),
                value: decodeURIComponent(param.value),
              };

              //check if formdata params is a SAML request or response
              if (
                param.name === "SAMLResponse" ||
                param.name === "SAMLRequest"
              ) {
                //add to samlList for the current request
                request._custom?.samlList?.push(paramObj);

                return {
                  ...paramObj,
                  isSaml: true,
                };
              }
              return {
                ...paramObj,
                isSaml: false,
              };
            },
          );
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
