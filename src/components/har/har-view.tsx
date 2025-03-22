import { useState } from "react";
import { FileUploader } from "./file-uploader";
import { useHar } from "./har-provider";

export default function HarView() {
  const { harData } = useHar();

  return (
    <div>
      <h2>HAR View</h2>
      {!harData ? (
        <div>
          <FileUploader />
        </div>
      ) : (
        <div>
          <p>HAR file loaded successfully!</p>
        </div>
      )}
    </div>
  );
}
