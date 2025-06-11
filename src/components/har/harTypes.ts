export interface HarRequest {
  startedDateTime: string;
  time: number;
  serverIPAddress?: string;
  request: {
    method: string;
    url: string;
    httpVersion: string;
    headers: Array<{ name: string; value: string }>;
    queryString: Array<{ name: string; value: string }>;
    cookies: Array<{ name: string; value: string }>;
    headersSize: number;
    bodySize: number;
    postData?: {
      mimeType: string;
      params?: Array<{ name: string; value: string }>;
      text?: string;
    };
  };
  response: {
    status: number;
    statusText: string;
    httpVersion: string;
    headers: Array<{ name: string; value: string }>;
    cookies: Array<{ name: string; value: string }>;
    content: {
      size: number;
      mimeType: string;
      text?: string;
    };
    redirectURL: string;
    headersSize: number;
    bodySize: number;
  };
  cache: Record<string, unknown>;
  timings: {
    send: number;
    wait: number;
    receive: number;
  };
  _custom?: {
    id: number;
    pinned?: boolean;
    queryParams?: Array<NameValueParam>;
    hashParams?: Array<NameValueParam>;
    formData?: Array<NameValueParam>;
    samlList: Array<NameValueParam>;
    jwtList: Array<NameValueParam>;
    urlObj: URL | null;
    domain: string;
  };
}

export interface NameValueParam {
  name: string;
  value: string;
  isSaml?: boolean;
  isJwt?: boolean;
}

export interface HarLog {
  version: string;
  creator: {
    name: string;
    version: string;
  };
  entries: HarRequest[];
}

export interface HarData {
  log: HarLog;
}

export interface HarContextType {
  harData: HarData | null;
  setHarFile: (data: HarData) => void;
  clearHarData: () => void;
  getAllRequests: () => HarRequest[];
  getFilteredRequests: (viewMode: string) => HarRequest[];
  selectedRequest: HarRequest | null;
  selectRequest: (request: HarRequest | null) => void;
  togglePin: (id: number) => void;
  isPinned: (request: HarRequest) => boolean;
  pinnedRequests: HarRequest[];
  availableDomains: string[];
  selectedDomains: string[];
  toggleDomain: (domain: string) => void;
  clearDomainSelection: () => void;
  availableMethods: string[];
  selectedMethods: string[];
  toggleMethod: (method: string) => void;
  clearMethodSelection: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
  isFullSearch: boolean;
  setIsFullSearch: (enabled: boolean) => void;
  clearAllFilters: () => void;
}
