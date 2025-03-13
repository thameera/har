import { ModeToggle } from "../mode-toggle";
import HarView from "./har-view";

export default function HarContainer() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">HAR Analyzer</h1>
        <ModeToggle />
      </div>
      <HarView />
    </div>
  );
}
