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
      defaultValue={["url", "headers", "other"]}
    >
      <AccordionItem value="url">
        <AccordionTrigger>URL</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Domain:</h4>
              <div className="font-mono text-sm">{url.hostname}</div>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Path:</h4>
              <div className="font-mono text-sm">{url.pathname}</div>
            </div>
            {searchParams.toString() && (
              <div>
                <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
                <div className="space-y-1">
                  {Array.from(searchParams.entries()).map(([key, value]) => (
                    <div key={key} className="font-mono text-sm">
                      <span className="text-purple-500 dark:text-purple-400">
                        {key}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {" "}
                        ={" "}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
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
                      <span className="text-purple-500 dark:text-purple-400">
                        {key}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {" "}
                        ={" "}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
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
        <AccordionContent>Request headers details</AccordionContent>
      </AccordionItem>

      <AccordionItem value="other">
        <AccordionTrigger>Other</AccordionTrigger>
        <AccordionContent>Other request details</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
