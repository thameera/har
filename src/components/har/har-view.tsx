import { useState } from "react";
import { FileUploader } from "./file-uploader";
import { Button } from "@/components/ui/button";
import { useHar } from "./har-provider";

export default function HarView() {
  const [minimized, setMinimized] = useState(false);
  const { harData } = useHar();

  return (
    <div className="flex flex-col h-full">
      <h2 className="p-4">HAR View</h2>
      <div className="flex-1 h-full">
        {!harData ? (
          <div className="h-full">
            <FileUploader />
          </div>
        ) : (
          <div className="h-full">
            <div className="flex h-full">
              {/* Left column: always visible */}
              <div className="flex-1 p-4 bg-blue-100">left</div>
              {/* Right column: toggles width */}
              <div
                className={`flex flex-col items-center transition-all duration-300 overflow-hidden
                ${minimized ? "w-12" : "w-64"} bg-green-100`}
              >
                <Button onClick={() => setMinimized(!minimized)}>
                  {minimized ? "<" : ">"}
                </Button>
                {minimized ? "Minimized" : "Expanded"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
