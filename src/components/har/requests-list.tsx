import { useHar } from "./har-provider";
import { PinIcon } from "lucide-react";
import { memo, useMemo, useCallback } from "react";
import { HarRequest } from "./harTypes";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const formatRequestTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    return date.toISOString().split("T")[1].substring(0, 12);
  } catch {
    return "(time unknown)";
  }
};

interface RequestsListProps {
  view: string;
}

// Memoized individual request item component with custom equality check
const RequestItem = memo(
  ({
    request,
    isSelected,
    onSelect,
    onTogglePin,
    isPinned,
  }: {
    request: HarRequest;
    isSelected: boolean;
    onSelect: () => void;
    onTogglePin: (e: React.MouseEvent) => void;
    isPinned: boolean;
  }) => {
    return (
      <div
        className={`flex items-center gap-2 p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/30 cursor-pointer rounded transition-all duration-200 ${
          isSelected ? "bg-blue-100 dark:bg-blue-900/30" : ""
        } border border-black dark:border-gray-600 mb-1 rounded-md`}
        onClick={onSelect}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              {request.request.method}
            </span>
            <span className="text-sm truncate text-gray-900 dark:text-gray-100">
              {(() => {
                if (request._custom && request._custom.urlObj) {
                  const url = request._custom.urlObj;
                  return (
                    <>
                      <span className="text-gray-600 dark:text-gray-400">
                        {url.protocol + "//"}
                      </span>
                      <span
                        className={`font-medium ${request._custom.domainColor}`}
                      >
                        {url.hostname}
                        {url.port ? `:${url.port}` : ""}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {url.pathname + url.search}
                      </span>
                    </>
                  );
                } else {
                  // Fallback to original URL if urlObj is null
                  return request.request.url;
                }
              })()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className={getStatusColor(request.response.status)}>
              {request.response.status}
            </span>
            <span className="px-1.5 rounded bg-gray-100 dark:bg-gray-700">
              {formatRequestTime(request.startedDateTime)}
            </span>
            <span>{formatSize(request.response.content.size)}</span>
            <span>{formatTime(request.time)}ms</span>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onTogglePin}
              className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors icon-button ${
                isPinned
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <PinIcon className="h-4 w-4 icon-button" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPinned ? "Unpin request" : "Pin request"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  },
  // Custom equality check to minimize renders
  (prevProps, nextProps) => {
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isPinned === nextProps.isPinned &&
      prevProps.request === nextProps.request
    );
  },
);

RequestItem.displayName = "RequestItem";

export const RequestsList = memo(({ view }: RequestsListProps) => {
  const {
    getFilteredRequests,
    selectedRequest,
    selectRequest,
    togglePin,
    isPinned,
  } = useHar();

  // Memoize the filtered requests
  const requests = useMemo(() => {
    console.log("Recalculating requests in RequestsList - view:", view);
    return getFilteredRequests(view);
  }, [getFilteredRequests, view]);

  // Memoize the toggle pin handler factory to maintain reference stability
  const createTogglePinHandler = useCallback(
    (id: number) => {
      return (e: React.MouseEvent) => {
        e.stopPropagation();
        togglePin(id);
      };
    },
    [togglePin],
  );

  // Memoize the select handler factory to maintain reference stability
  const createSelectHandler = useCallback(
    (request: HarRequest) => {
      return () => selectRequest(request);
    },
    [selectRequest],
  );

  if (requests.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-lg">
        No requests match the selected filter.
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="p-2">
          {requests.map((request) => {
            // Create stable callback references for each item
            const requestId = request._custom?.id;
            const handleSelect = createSelectHandler(request);
            const handleTogglePin =
              requestId !== undefined
                ? createTogglePinHandler(requestId)
                : (e: React.MouseEvent) => {
                    e.stopPropagation();
                  };
            const isItemSelected = selectedRequest === request;
            const isItemPinned = isPinned(request);

            return (
              <RequestItem
                key={requestId || Math.random()}
                request={request}
                isSelected={isItemSelected}
                onSelect={handleSelect}
                onTogglePin={handleTogglePin}
                isPinned={isItemPinned}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

RequestsList.displayName = "RequestsList";

const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) {
    return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1.5 rounded";
  } else if (status >= 300 && status < 400) {
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 rounded";
  } else if (status >= 400 && status < 500) {
    return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-1.5 rounded";
  } else if (status >= 500) {
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-1.5 rounded";
  }
  return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-1.5 rounded";
};

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const formatTime = (ms: number): string => {
  return ms.toFixed(0);
};
