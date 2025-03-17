import { useState } from "react";
import { FileUploader } from "./file-uploader";
import { Button } from "@/components/ui/button";

export default function HarView() {
  const [har, setHar] = useState<any | null>(null);
  const [minimized, setMinimized] = useState(false);

  const handleParse = (data: any) => {
    setHar(data);
  };

  const handleError = (error: string) => {
    console.error(error);
  };

  const handleStart = () => {
    // Maybe show a loading indicator?
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="p-4">HAR View</h2>
      <div className="flex-1 h-full">
        {!har ? (
          <div className="h-full">
            <FileUploader
              onParse={handleParse}
              onError={handleError}
              onStart={handleStart}
            />
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
