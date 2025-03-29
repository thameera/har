"use client";

import HarContainer from "@/components/har/har-container";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  /*
   * We keep the main component in /components/har to make it compatible with
   * the Toolbox project layout.
   */
  return (
    <div className="min-h-screen p-8">
      <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">HAR Analyzer</h1>
          <ModeToggle />
        </div>
        <HarContainer />
      </div>
    </div>
  );
}
