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

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["url", "headers"]}
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
                  {Array.from(searchParams.entries()).map(([key, value]) => (
                    <div key={key} className="font-mono text-sm">
                      <span className="text-emerald-600 dark:text-emerald-500 break-all">
                        {key}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {hash && (
              <div>
                <h4 className="text-sm font-medium mb-2">Hash Fragment</h4>
                <div className="space-y-1">
                  {Array.from(hashParams.entries()).map(([key, value]) => (
                    <div key={key} className="font-mono text-sm">
                      <span className="text-emerald-600 dark:text-emerald-500 break-all">
                        {key}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="headers">
        <AccordionTrigger>Request Headers</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {request.request.headers.map((header) => (
              <div key={header.name} className="font-mono text-sm">
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
