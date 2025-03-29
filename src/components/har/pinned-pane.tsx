import { useHar } from "./har-provider";
import { RequestDetails } from "./request-details";
import { X } from "lucide-react";

export function PinnedPane() {
  const { getPinnedRequests, togglePinRequest } = useHar();
  const pinnedRequests = getPinnedRequests();

  if (pinnedRequests.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground text-center p-4">
          No pinned requests yet. Click the pin icon on a request to pin it.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ overflow: "hidden" }}>
      <div className="text-lg font-semibold p-2" style={{ flex: "0 0 auto" }}>
        Pinned Requests ({pinnedRequests.length})
      </div>

      {/* Absolute positioned scroll container to ensure proper sizing */}
      <div
        style={{
          position: "absolute",
          top: "48px",
          bottom: "0",
          left: "0",
          right: "0",
          overflowY: "auto",
          padding: "8px",
        }}
      >
        {/* Pinned request items */}
        {pinnedRequests.map((request, index) => (
          <div
            key={`request-${index}`}
            className="mb-4 rounded border border-border"
            style={{
              height: "300px",
              minHeight: "200px",
            }}
          >
            <div className="p-2 h-full flex flex-col bg-background">
              <div className="flex justify-between items-center mb-2 px-1">
                <div className="font-medium truncate flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    {request.request.method}
                  </span>
                  <span className="truncate text-sm">
                    {(() => {
                      try {
                        return new URL(request.request.url).pathname;
                      } catch {
                        return request.request.url.substring(0, 50);
                      }
                    })()}
                  </span>
                </div>
                <button
                  onClick={() => togglePinRequest(request)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 icon-button"
                  title="Unpin request"
                >
                  <X className="h-4 w-4 icon-button" />
                </button>
              </div>
              <div className="flex-1 overflow-auto border-t">
                <RequestDetails request={request} />
              </div>
            </div>
          </div>
        ))}

        {/* Small padding at the bottom to ensure proper scrolling */}
        <div style={{ height: "16px" }}></div>
      </div>
    </div>
  );
}
