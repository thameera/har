import { useState } from "react";
import { FileUploader } from "./file-uploader";

export default function HarView() {
  const [har, setHar] = useState<any | null>(null);

  const handleParse = (data: any) => {
    setHar(data);
  };

  const handleError = (error: string) => {
    console.error(error);
  };

  const handleStart = () => {
    // You can add loading state here if needed
  };

  return (
    <div>
      <h2>HAR View</h2>
      {!har ? (
        <FileUploader
          onParse={handleParse}
          onError={handleError}
          onStart={handleStart}
        />
      ) : (
        <div>
          {/* We'll add the HAR viewer content here later */}
          <p>HAR file loaded successfully!</p>
        </div>
      )}
    </div>
  );
}
