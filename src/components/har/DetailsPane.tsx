import { useHar } from "./har-provider";
import { RequestDetails } from "./RequestDetails";

export function DetailsPane() {
  const { selectedRequest } = useHar();

  return (
    <div>
      {selectedRequest ? (
        <RequestDetails request={selectedRequest} />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Select a request to view details
        </div>
      )}
    </div>
  );
}
