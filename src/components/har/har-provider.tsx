import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  HarContextType,
  HarData,
  HarRequest,
  NameValueParam,
} from "./harTypes";

// Colors for the domain color map
const DOMAIN_COLORS = [
  "text-red-500 dark:text-red-400",
  "text-orange-500 dark:text-orange-400",
  "text-green-500 dark:text-green-400",
  "text-teal-500 dark:text-teal-400",
  "text-cyan-500 dark:text-cyan-400",
  "text-blue-500 dark:text-blue-400",
  "text-indigo-500 dark:text-indigo-400",
  "text-purple-500 dark:text-purple-400",
  "text-pink-500 dark:text-pink-400",
];

const HarContext = createContext<HarContextType | undefined>(undefined);

export function HarProvider({ children }: { children: React.ReactNode }) {
  const [harData, setHarData] = useState<HarData | null>(null);
  const [harFileName, setHarFileName] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HarRequest | null>(
    null,
  );
  const [pinnedRequests, setPinnedRequests] = useState<HarRequest[]>([]);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isFullSearch, setIsFullSearch] = useState<boolean>(false);

  // Debounce search text to avoid excessive filtering
  // Use longer delay for full search due to performance impact
  const searchDelay = isFullSearch ? 500 : 300;
  const debouncedSearchText = useDebounce(searchText, searchDelay);

  // Helper functions for full text search
  const searchHeaders = (
    headers: Array<{ name: string; value: string }>,
    term: string,
  ): boolean => {
    return headers.some(
      (header) =>
        header.name.toLowerCase().includes(term) ||
        header.value.toLowerCase().includes(term),
    );
  };

  const searchKeyValuePairs = (
    pairs: Array<{ name: string; value: string }> | undefined,
    term: string,
  ): boolean => {
    if (!pairs) return false;
    return pairs.some(
      (pair) =>
        pair.name.toLowerCase().includes(term) ||
        pair.value.toLowerCase().includes(term),
    );
  };

  const searchRequestBody = (
    postData: { text?: string } | undefined,
    term: string,
  ): boolean => {
    if (!postData?.text) return false;
    // Limit search to prevent performance issues
    const maxSearchLength = 10000; // 10KB limit for request body
    const searchText =
      postData.text.length > maxSearchLength
        ? postData.text.substring(0, maxSearchLength)
        : postData.text;
    return searchText.toLowerCase().includes(term);
  };

  const searchResponseBody = (
    content: { text?: string } | undefined,
    term: string,
  ): boolean => {
    if (!content?.text) return false;
    // Limit search to prevent performance issues with large responses
    const maxSearchLength = 50000; // 50KB limit for response body
    const searchText =
      content.text.length > maxSearchLength
        ? content.text.substring(0, maxSearchLength)
        : content.text;
    return searchText.toLowerCase().includes(term);
  };

  const searchAllFields = useCallback(
    (request: HarRequest, searchTerm: string): boolean => {
      const searchLower = searchTerm.toLowerCase();

      // URL search (fastest, check first)
      if (request.request.url.toLowerCase().includes(searchLower)) return true;

      // Method search
      if (request.request.method.toLowerCase().includes(searchLower))
        return true;

      // Headers search (request & response)
      if (searchHeaders(request.request.headers, searchLower)) return true;
      if (searchHeaders(request.response.headers, searchLower)) return true;

      // Form data search
      if (searchKeyValuePairs(request._custom?.formData, searchLower))
        return true;

      // Query params search
      if (searchKeyValuePairs(request._custom?.queryParams, searchLower))
        return true;

      // Hash params search
      if (searchKeyValuePairs(request._custom?.hashParams, searchLower))
        return true;

      // Cookies search
      if (searchKeyValuePairs(request.request.cookies, searchLower))
        return true;
      if (searchKeyValuePairs(request.response.cookies, searchLower))
        return true;

      // Request body search
      if (searchRequestBody(request.request.postData, searchLower)) return true;

      // Response body search (most expensive, check last)
      if (searchResponseBody(request.response.content, searchLower))
        return true;

      return false;
    },
    [],
  );

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

  // Extract methods to build availableMethods set
  const extractMethods = (entries: HarRequest[]) => {
    const methods = new Set<string>();
    entries.forEach((entry) => {
      if (entry.request.method) {
        methods.add(entry.request.method.toUpperCase());
      }
    });
    return Array.from(methods).sort();
  };

  const setHarFile = (data: HarData, fileName?: string) => {
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

    const safeDecodeURIComponent = (value: string) => {
      try {
        return decodeURIComponent(value);
      } catch {
        console.warn(`could not decode value: , `, value);
      }
      return value;
    };

    data.log.entries.forEach((request, index) => {
      // Initialize the custom data object
      request._custom = {
        id: index,
        samlList: [],
        jwtList: [],
        urlObj: null,
        domain: "",
        domainColor: "text-blue-500 dark:text-blue-200", // Default color
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
              name: safeDecodeURIComponent(key),
              value: safeDecodeURIComponent(value),
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
                name: safeDecodeURIComponent(key),
                value: safeDecodeURIComponent(value),
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
              name: safeDecodeURIComponent(param.name),
              value: safeDecodeURIComponent(param.value),
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

    // Extract and set available domains
    const domains = extractDomains(data.log.entries);
    setAvailableDomains(domains);

    // Create a color map for domains for easier visual scanning
    const domainColorMap: Record<string, string> = {};
    domains.forEach((domain, index) => {
      domainColorMap[domain] = DOMAIN_COLORS[index % DOMAIN_COLORS.length];
    });

    // Second pass to assign the calculated color
    data.log.entries.forEach((request) => {
      if (request._custom?.domain) {
        const color = domainColorMap[request._custom.domain];
        if (color) {
          request._custom.domainColor = color;
        }
      }
    });
    setHarData(data);
    setHarFileName(fileName ?? null);

    // Extract and set available methods
    const methods = extractMethods(data.log.entries);
    setAvailableMethods(methods);

    // Reset selected domains, methods, search text, and full search when loading a new file
    setSelectedDomains([]);
    setSelectedMethods([]);
    setSearchText("");
    setIsFullSearch(false);
  };

  // Memoize getAllRequests to maintain stable reference
  const getAllRequests = useCallback((): HarRequest[] => {
    if (!harData?.log?.entries) {
      return [];
    }
    return harData.log.entries;
  }, [harData]);

  // Cache for filtered requests to avoid recalculation on every render
  const filteredRequestsCache = useMemo(() => {
    console.log(
      "Recalculating filteredRequestsCache - selectedDomains:",
      selectedDomains.length,
      "selectedMethods:",
      selectedMethods.length,
      "searchText:",
      debouncedSearchText.length > 0 ? `"${debouncedSearchText}"` : "none",
      "isFullSearch:",
      isFullSearch,
    );
    // Create a map of view mode to filtered requests
    const cache: Record<string, HarRequest[]> = {
      all: [],
      pinned: [],
      "all-with-filters": [], // Special key for all + filtering
    };

    // Get all requests once
    const allRequests = getAllRequests();

    // Fill cache with filtered results
    cache.all = allRequests;

    // Pinned requests
    cache.pinned = allRequests.filter((req) => req._custom?.pinned);

    // Apply combined filtering (domains, methods, and text)
    const hasDomainFilter = selectedDomains.length > 0;
    const hasMethodFilter = selectedMethods.length > 0;
    const hasTextFilter = debouncedSearchText.trim().length > 0;

    if (hasDomainFilter || hasMethodFilter || hasTextFilter) {
      cache["all-with-filters"] = allRequests.filter((req) => {
        // Domain filtering
        const domainMatch =
          !hasDomainFilter ||
          (req._custom &&
            req._custom.domain &&
            selectedDomains.includes(req._custom.domain));

        // Method filtering
        const methodMatch =
          !hasMethodFilter ||
          selectedMethods.includes(req.request.method.toUpperCase());

        // Text filtering (URL-only or full text search)
        const textMatch =
          !hasTextFilter ||
          (isFullSearch
            ? searchAllFields(req, debouncedSearchText.trim())
            : req.request.url
                .toLowerCase()
                .includes(debouncedSearchText.toLowerCase()));

        return domainMatch && methodMatch && textMatch;
      });
    } else {
      cache["all-with-filters"] = allRequests; // No filtering
    }

    return cache;
  }, [
    selectedDomains,
    selectedMethods,
    debouncedSearchText,
    isFullSearch,
    getAllRequests,
    searchAllFields,
  ]);

  // Memoize the getFilteredRequests function itself to maintain stable reference
  const getFilteredRequests = useMemo(() => {
    console.log("Recalculating getFilteredRequests function");
    // Return a stable function reference
    return (viewMode: string): HarRequest[] => {
      // Return pre-calculated results from cache
      if (viewMode === "pinned") {
        // For pinned view, always use the pinned cache (ignore filtering)
        return filteredRequestsCache.pinned;
      } else if (
        selectedDomains.length > 0 ||
        selectedMethods.length > 0 ||
        debouncedSearchText.trim().length > 0
      ) {
        // For all view with filtering applied
        return filteredRequestsCache["all-with-filters"];
      } else {
        // For all view with no filtering
        return filteredRequestsCache.all;
      }
    };
  }, [
    filteredRequestsCache,
    selectedDomains.length,
    selectedMethods.length,
    debouncedSearchText,
    isFullSearch,
  ]);

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

  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method],
    );
  };

  const clearMethodSelection = () => {
    setSelectedMethods([]);
  };

  const clearAllFilters = () => {
    setSelectedDomains([]);
    setSelectedMethods([]);
    setSearchText("");
    setIsFullSearch(false);
  };

  const clearHarData = () => {
    setHarData(null);
    setHarFileName(null);
    setSelectedRequest(null);
    setPinnedRequests([]);
    setAvailableDomains([]);
    setSelectedDomains([]);
    setAvailableMethods([]);
    setSelectedMethods([]);
    setSearchText("");
    setIsFullSearch(false);
  };

  return (
    <HarContext.Provider
      value={{
        harData,
        harFileName,
        setHarFile,
        clearHarData,
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
        availableMethods,
        selectedMethods,
        toggleMethod,
        clearMethodSelection,
        searchText,
        setSearchText,
        isFullSearch,
        setIsFullSearch,
        clearAllFilters,
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
