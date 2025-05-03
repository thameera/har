import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HarRequest } from "./harTypes";
import { HoverCopyButton } from "./hover-copy-button";

interface RequestTabProps {
  request: HarRequest;
}

export function RequestTab({ request }: RequestTabProps) {
  const url = new URL(request.request.url);
  const hash = url.hash.slice(1); // Remove the # symbol
  const hashParams = new URLSearchParams(hash);
  const isPostRequest = request.request.method.toUpperCase() === "POST";
  const hasFormData =
    isPostRequest &&
    request.request.postData?.params &&
    request.request.postData.params.length > 0;
  const hasRawPostData =
    isPostRequest && request.request.postData?.text && !hasFormData;

  const hasQueryParams =
    request._custom?.queryParams && request._custom.queryParams.length > 0;

  // Value container class for consistent styling
  const valueContainerClass = "font-mono text-sm break-all group";

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
            <div className="font-mono text-sm">
              <span className="text-emerald-600 dark:text-emerald-500 break-all">
                Domain
              </span>
              <span className="text-gray-600 dark:text-gray-400 break-all group">
                <HoverCopyButton value={url.hostname} />
                {url.hostname}
              </span>
            </div>
            {url.port && url.port !== "443" && (
              <div className="font-mono text-sm">
                <span className="text-emerald-600 dark:text-emerald-500 break-all">
                  Port
                </span>
                <span className="text-gray-600 dark:text-gray-400 break-all group">
                  <HoverCopyButton value={url.port} />
                  {url.port}
                </span>
              </div>
            )}
            <div className="font-mono text-sm">
              <span className="text-emerald-600 dark:text-emerald-500 break-all">
                Path
              </span>
              <span className="text-gray-600 dark:text-gray-400 break-all group">
                <HoverCopyButton value={url.pathname} />
                {url.pathname}
              </span>
            </div>
            {hasQueryParams && (
              <div>
                <h4 className="text-sm text-blue-600 dark:text-blue-500 mt-2 mb-1">
                  Query Parameters:
                </h4>
                <div className="space-y-1">
                  {request._custom!.queryParams!.map((param, index) => (
                    <div
                      key={`${param.name}-${index}`}
                      className="font-mono text-sm"
                    >
                      <span className="text-emerald-600 dark:text-emerald-500 break-all">
                        {param.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 break-all group">
                        <HoverCopyButton value={param.value} />
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {hash && (
              <div>
                <h4 className="text-sm text-blue-600 dark:text-blue-500 mt-2 mb-1">
                  Hash Fragment:
                </h4>
                <div className="space-y-1">
                  {Array.from(hashParams.entries()).map(
                    ([key, value], index) => (
                      <div
                        key={`${key}-${index}`}
                        className="font-mono text-sm"
                      >
                        <span className="text-emerald-600 dark:text-emerald-500 break-all">
                          {decodeURIComponent(key)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 break-all group">
                          <HoverCopyButton value={decodeURIComponent(value)} />
                          {decodeURIComponent(value)}
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
                    {decodeURIComponent(param.name)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 break-all group">
                    <HoverCopyButton value={decodeURIComponent(param.value)} />
                    {decodeURIComponent(param.value)}
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
              <div className="group relative">
                <pre className="font-mono text-sm whitespace-pre-wrap break-all bg-secondary/30 p-2 rounded pr-10">
                  {request.request.postData?.text}
                </pre>
                <HoverCopyButton
                  value={request.request.postData?.text || ""}
                  position="code-block"
                />
              </div>
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
                <span className="text-gray-600 dark:text-gray-400 break-all group">
                  <HoverCopyButton value={header.value} />
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
