import HarView from "./har-view";
import { HarProvider } from "./har-provider";

export default function HarContainer() {
  return (
    <div className="flex-1 min-h-0">
      <HarProvider>
        <HarView />
      </HarProvider>
    </div>
  );
}
