import { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onParse: (data: any) => void;
  onError: (error: string) => void;
  onStart: () => void;
}

export function FileUploader({ onParse, onError, onStart }: FileUploaderProps) {
  const workerRef = useRef<Worker | null>(null);

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
      if (success) {
        console.log("Successfully parsed HAR file");
        // We send this as an array, expecting multiple HAR files in the future
        onParse([data]);
      } else {
        console.log(error);
        onError(error);
      }
    };

    worker.onerror = (error) => {
      console.error(error);
      onError("Error processing file");
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    onStart();
    const file = acceptedFiles[0];

    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string;
      console.log("File contents read");
      workerRef.current?.postMessage(fileContent);
    };

    reader.onerror = () => {
      onError("Error reading file");
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
