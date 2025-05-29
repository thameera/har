"use client";

import HarContainer from "@/components/har/har-container";
import { ModeToggle } from "@/components/mode-toggle";
import { FontSizeToggle } from "@/components/font-size-toggle";

export default function Home() {
  /*
   * We keep the main component in /components/har to make it compatible with
   * the Toolbox project layout.
   */
  return (
    <div className="min-h-screen p-8">
      <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
        <div className="grid grid-cols-2">
          <h1 className="text-xl font-bold">HAR Analyzer</h1>
          <div className="justify-self-end flex">
            <FontSizeToggle />
            <ModeToggle />
          </div>
        </div>
        <HarContainer />
      </div>
    </div>
  );
}
