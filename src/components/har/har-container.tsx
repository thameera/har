import { ModeToggle } from "../mode-toggle";
import HarView from "./har-view";
import { HarProvider } from "./har-provider";

export default function HarContainer() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">HAR Analyzer</h1>
        <ModeToggle />
      </div>
      <div className="flex-1 min-h-0">
        <HarProvider>
          <HarView />
        </HarProvider>
      </div>
    </div>
  );
}
