import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HarRequest } from "./harTypes";

interface RequestTabProps {
  request: HarRequest;
}

export function RequestTab({ request }: RequestTabProps) {
  const url = new URL(request.request.url);
  const searchParams = new URLSearchParams(url.search);
  const hash = url.hash.slice(1); // Remove the # symbol
  const hashParams = new URLSearchParams(hash);
  const isPostRequest = request.request.method.toUpperCase() === "POST";
  const hasFormData =
    isPostRequest &&
    request.request.postData?.params &&
    request.request.postData.params.length > 0;
  const hasRawPostData =
    isPostRequest && request.request.postData?.text && !hasFormData;

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={[
        "url",
        "headers",
        ...(hasFormData ? ["formdata"] : []),
        ...(hasRawPostData ? ["rawpostdata"] : []),
      ]}
    >
      <AccordionItem value="url">
        <AccordionTrigger>URL</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            <div className="flex flex-wrap items-start gap-2">
              <h4 className="text-sm text-emerald-600 dark:text-emerald-500">
                Domain
              </h4>
              <div className="font-mono text-sm break-all">{url.hostname}</div>
            </div>
            {url.port && url.port !== "443" && (
              <div className="flex flex-wrap items-start gap-2">
                <h4 className="text-sm text-emerald-600 dark:text-emerald-500">
                  Port
                </h4>
                <div className="font-mono text-sm break-all">{url.port}</div>
              </div>
            )}
            <div className="flex flex-wrap items-start gap-2">
              <h4 className="text-sm text-emerald-600 dark:text-emerald-500">
                Path
              </h4>
              <div className="font-mono text-sm break-all">{url.pathname}</div>
            </div>
            {searchParams.toString() && (
              <div>
                <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
                <div className="space-y-1">
                  {Array.from(searchParams.entries()).map(
                    ([key, value], index) => (
                      <div
                        key={`${key}-${index}`}
                        className="font-mono text-sm"
                      >
                        <span className="text-emerald-600 dark:text-emerald-500 break-all">
                          {key}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
            {hash && (
              <div>
                <h4 className="text-sm font-medium mb-2">Hash Fragment</h4>
                <div className="space-y-1">
                  {Array.from(hashParams.entries()).map(
                    ([key, value], index) => (
                      <div
                        key={`${key}-${index}`}
                        className="font-mono text-sm"
                      >
                        <span className="text-emerald-600 dark:text-emerald-500 break-all">
                          {key}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {hasFormData && (
        <AccordionItem value="formdata">
          <AccordionTrigger>Form Data</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {request.request.postData?.params?.map((param, index) => (
                <div
                  key={`${param.name}-${index}`}
                  className="font-mono text-sm"
                >
                  <span className="text-emerald-600 dark:text-emerald-500 break-all">
                    {param.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
                    {param.value}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {hasRawPostData && (
        <AccordionItem value="rawpostdata">
          <AccordionTrigger>
            POST Data ({request.request.postData?.mimeType || "Unknown Type"})
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              <pre className="font-mono text-sm whitespace-pre-wrap break-all bg-secondary/30 p-2 rounded">
                {request.request.postData?.text}
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="headers">
        <AccordionTrigger>Request Headers</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {request.request.headers.map((header, index) => (
              <div
                key={`${header.name}-${index}`}
                className="font-mono text-sm"
              >
                <span className="text-emerald-600 dark:text-emerald-500 break-all">
                  {header.name}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
                  {header.value}
                </span>
              </div>
            ))}
            {request.request.headers.length === 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                No headers found
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
