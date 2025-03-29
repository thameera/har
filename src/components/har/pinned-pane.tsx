import { useHar } from "./har-provider";

export function PinnedPane() {
  const { getPinnedRequests } = useHar();
  const pinnedRequests = getPinnedRequests();

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="text-lg font-semibold mb-4">Pinned Requests</div>

        {pinnedRequests.length === 0 ? (
          <div className="text-muted-foreground">
            No pinned requests yet. Click the pin icon on a request to pin it.
          </div>
        ) : (
          <div className="space-y-2">
            {pinnedRequests.map((request, index) => (
              <div
                key={index}
                className="text-sm text-gray-800 dark:text-gray-200"
              >
                {request.request.method} {request.request.url}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
