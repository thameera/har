export interface HarRequest {
  startedDateTime: string;
  time: number;
  request: {
    method: string;
    url: string;
    httpVersion: string;
    headers: Array<{ name: string; value: string }>;
    queryString: Array<{ name: string; value: string }>;
    cookies: Array<{ name: string; value: string }>;
    headersSize: number;
    bodySize: number;
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
    pinned?: boolean;
  };
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
  getAllRequests: () => HarRequest[];
  selectedRequest: HarRequest | null;
  selectRequest: (request: HarRequest | null) => void;
  togglePinRequest: (request: HarRequest) => void;
  isPinned: (request: HarRequest) => boolean;
  getPinnedRequests: () => HarRequest[];
}
