import { ModeToggle } from "../mode-toggle";
import HarView from "./har-view";
import { HarProvider } from "./har-provider";

export default function HarContainer() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">HAR Analyzer</h1>
        <ModeToggle />
      </div>
      <div>
        <HarProvider>
          <HarView />
        </HarProvider>
      </div>
    </div>
  );
}
