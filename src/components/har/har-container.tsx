import { ModeToggle } from "../mode-toggle";
import HarView from "./har-view";
import { HarProvider } from "./har-provider";

export default function HarContainer() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">HAR Analyzer</h1>
        <ModeToggle />
      </div>
      <div className="flex-1">
        <HarProvider>
          <HarView />
        </HarProvider>
      </div>
    </div>
  );
}
