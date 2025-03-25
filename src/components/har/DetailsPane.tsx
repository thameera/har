import { useHar } from "./har-provider";

export function DetailsPane() {
  const { selectedRequest } = useHar();

  return (
    <div>
      {selectedRequest ? (
        <div>
          {/* Request details will go here */}
          <pre>{JSON.stringify(selectedRequest, null, 2)}</pre>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Select a request to view details
        </div>
      )}
    </div>
  );
}
