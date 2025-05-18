import { createContext, useContext, useState, useMemo } from "react";
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
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  // Extract domains to build availableDomains set
  const extractDomains = (entries: HarRequest[]) => {
    const domains = new Set<string>();
    entries.forEach((entry) => {
      // Only add non-empty domains
      if (entry._custom && entry._custom.domain) {
        domains.add(entry._custom.domain);
      }
    });
    return Array.from(domains).sort();
  };

  const setHarFile = (data: HarData) => {
    console.log("setting har file");
    const SAML_KEYS = new Set(["SAMLResponse", "SAMLRequest"]);
    const JWT_KEYS = new Set(["access_token", "id_token"]);
    const JWT_LENGTH = 3;

    const hasJwtStructure = (token: unknown): boolean => {
      return (
        Boolean(token) &&
        typeof token === "string" &&
        token.startsWith("eyJ") &&
        token.split(".").length === JWT_LENGTH
      );
    };

    data.log.entries.forEach((request, index) => {
      // Initialize the custom data object
      request._custom = {
        id: index,
        samlList: [],
        jwtList: [],
        urlObj: null,
        domain: "",
      };

      try {
        const urlObj = new URL(request.request.url);
        request._custom.urlObj = urlObj;
        request._custom.domain = urlObj.hostname;

        // Extract query params
        const searchParams = urlObj.searchParams;

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
        const hash = urlObj.hash.slice(1); // Remove the # symbol
        if (hash) {
          const hashParams = new URLSearchParams(hash);
          if (hashParams.toString()) {
            request._custom.hashParams = Array.from(hashParams.entries()).map(
              ([key, value]): NameValueParam => ({
                name: decodeURIComponent(key),
                value: decodeURIComponent(value),
                isJwt: JWT_KEYS.has(key) && hasJwtStructure(value),
              }),
            );
            request._custom.jwtList = request._custom.hashParams.filter(
              (param) => param.isJwt,
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
              isJwt: JWT_KEYS.has(param.name) && hasJwtStructure(param.value),
            }),
          );

          request._custom.formData = formData;

          const samlFormData = formData.filter((param) => param.isSaml);
          request._custom.samlList = [
            ...request._custom.samlList,
            ...samlFormData,
          ];

          const jwtFormData = formData.filter((param) => param.isJwt);
          request._custom.jwtList = [
            ...request._custom.jwtList,
            ...jwtFormData,
          ];
        }

        //testing for jwt tokens in content in response
        if (
          request.response.content.mimeType.startsWith("application/json") &&
          request.response.content.text
        ) {
          let jsonPayload: Record<string, unknown> = {};

          try {
            jsonPayload = JSON.parse(request.response.content.text);
          } catch (err) {
            console.log(`Error parsing JSON for request ${index}:`, err);
          }

          const jwts = Array.from(JWT_KEYS).flatMap((name) => {
            const token = jsonPayload[name];

            return hasJwtStructure(token)
              ? [{ name, value: token as string }]
              : [];
          });

          request._custom.jwtList = [...request._custom.jwtList, ...jwts];
        }
      } catch (error) {
        console.error(`Error parsing URL for request ${index}:`, error);
        // Continue processing even if one URL fails to parse
      }
    });

    setHarData(data);

    // Extract and set available domains
    const domains = extractDomains(data.log.entries);
    setAvailableDomains(domains);

    // Reset selected domains when loading a new file
    setSelectedDomains([]);
  };

  const getAllRequests = (): HarRequest[] => {
    if (!harData?.log?.entries) {
      return [];
    }
    return harData.log.entries;
  };

  // Cache for filtered requests to avoid recalculation on every render
  const filteredRequestsCache = useMemo(() => {
    console.log("Recalculating filteredRequestsCache");
    // Create a map of view mode to filtered requests
    const cache: Record<string, HarRequest[]> = {
      all: [],
      pinned: [],
      "all-with-domains": [], // Special key for all + domain filtering
    };

    // Get all requests once
    const allRequests = getAllRequests();

    // Fill cache with filtered results
    cache.all = allRequests;

    // Pinned requests
    cache.pinned = allRequests.filter((req) => req._custom?.pinned);

    // Domain-filtered requests (all view)
    if (selectedDomains.length > 0) {
      cache["all-with-domains"] = allRequests.filter(
        (req) =>
          req._custom &&
          req._custom.domain &&
          selectedDomains.includes(req._custom.domain),
      );
    } else {
      cache["all-with-domains"] = allRequests; // No domain filtering
    }

    return cache;
  }, [harData, selectedDomains, getAllRequests]);

  // Memoize the getFilteredRequests function itself to maintain stable reference
  const getFilteredRequests = useMemo(() => {
    // Return a stable function reference
    return (viewMode: string): HarRequest[] => {
      // Return pre-calculated results from cache
      if (viewMode === "pinned") {
        // For pinned view, always use the pinned cache (ignore domain filtering)
        return filteredRequestsCache.pinned;
      } else if (selectedDomains.length > 0) {
        // For all view with domain filtering
        return filteredRequestsCache["all-with-domains"];
      } else {
        // For all view with no domain filtering
        return filteredRequestsCache.all;
      }
    };
  }, [filteredRequestsCache, selectedDomains.length]);

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

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain],
    );
  };

  const clearDomainSelection = () => {
    setSelectedDomains([]);
  };

  return (
    <HarContext.Provider
      value={{
        harData,
        setHarFile,
        getAllRequests,
        getFilteredRequests,
        selectedRequest,
        selectRequest,
        togglePin,
        isPinned,
        pinnedRequests,
        availableDomains,
        selectedDomains,
        toggleDomain,
        clearDomainSelection,
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
