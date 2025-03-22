import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useHar } from "./har-provider";

export function FileUploader() {
  const workerRef = useRef<Worker | null>(null);
  const { setHarFile, setIsHarFileLoading } = useHar();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const workerCode = `
      self.addEventListener('message', (event) => {
        const fileContent = event.data;

        try {
          const harData = JSON.parse(fileContent);
          self.postMessage({ success: true, data: harData });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      });`;

    const workerBlob = new Blob([workerCode], {
      type: "application/javascript",
    });
    const worker = new Worker(URL.createObjectURL(workerBlob));
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const { success, data, error } = event.data;
      setIsHarFileLoading(false);
      if (success) {
        console.log("Successfully parsed HAR file");
        setHarFile([data]);
        setError(null);
      } else {
        console.log(error);
        setError(error);
      }
    };

    worker.onerror = (error) => {
      console.error(error);
      setIsHarFileLoading(false);
      setError("Error processing file");
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    setIsHarFileLoading(true);
    setError(null);
    const file = acceptedFiles[0];

    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string;
      console.log("File contents read");
      workerRef.current?.postMessage(fileContent);
    };

    reader.onerror = () => {
      setIsHarFileLoading(false);
      setError("Error reading file");
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".har"],
    },
    multiple: false,
  });

  return (
    <>
      {error && (
        <div className="mb-4 p-4 text-sm text-red-500 bg-red-50 rounded-lg">
          <p>There was an error parsing the HAR file</p>
          <p className="mt-1">{error}</p>
        </div>
      )}
      <div
        {...getRootProps()}
        className={`border-dashed border-2 border-border bg-muted/50 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive ? "bg-muted" : ""
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-muted-foreground">Drop the file here ...</p>
        ) : (
          <p className="text-muted-foreground">
            Drag 'n' drop a HAR file here, or click to open file dialog
          </p>
        )}
      </div>
    </>
  );
}
