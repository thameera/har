import { useHar } from "./har-provider";

export function PinnedPane() {
  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="text-lg font-semibold mb-4">Pinned Requests</div>
        <div className="text-muted-foreground">
          Pinned requests will go here
        </div>
      </div>
    </div>
  );
}
