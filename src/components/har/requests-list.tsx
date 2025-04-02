import { useHar } from "./har-provider";
import { PinIcon } from "lucide-react";

const formatRequestTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    return date.toISOString().split("T")[1].substring(0, 12);
  } catch {
    return "(time unknown)";
  }
};

export const RequestsList = () => {
  const {
    getAllRequests,
    selectedRequest,
    selectRequest,
    togglePinRequest,
    isPinned,
  } = useHar();
  const requests = getAllRequests();

  if (requests.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No requests found. Please load a HAR file.
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="space-y-1 p-2">
          {requests.map((request, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded transition-colors duration-150 ${
                selectedRequest === request
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : ""
              }`}
            >
              <div
                className="flex-1 min-w-0"
                onClick={() =>
                  selectRequest(selectedRequest === request ? null : request)
                }
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    {request.request.method}
                  </span>
                  <span className="text-sm truncate text-gray-900 dark:text-gray-100">
                    {(() => {
                      try {
                        const url = new URL(request.request.url);
                        return (
                          <>
                            <span className="text-gray-600 dark:text-gray-400">
                              {url.protocol}//
                            </span>
                            <span className="font-medium text-blue-500 dark:text-blue-200">
                              {url.hostname}
                              {url.port ? `:${url.port}` : ""}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {url.pathname + url.search}
                            </span>
                          </>
                        );
                      } catch {
                        return request.request.url;
                      }
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className={getStatusColor(request.response.status)}>
                    {request.response.status}
                  </span>
                  <span>{formatSize(request.response.content.size)}</span>
                  <span>{formatTime(request.time)}ms</span>
                  <span className="px-1.5 rounded bg-gray-100 dark:bg-gray-700">
                    {formatRequestTime(request.startedDateTime)}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinRequest(request);
                }}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors icon-button ${
                  isPinned(request)
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                title={isPinned(request) ? "Unpin request" : "Pin request"}
              >
                <PinIcon className="h-4 w-4 icon-button" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
