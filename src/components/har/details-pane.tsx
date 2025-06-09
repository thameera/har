import { useHar } from "./har-provider";
import { RequestDetails } from "./request-details";

export function DetailsPane() {
  const { selectedRequest } = useHar();

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        {selectedRequest ? (
          <RequestDetails request={selectedRequest} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-lg">
            Select a request to view details
          </div>
        )}
      </div>
    </div>
  );
}
