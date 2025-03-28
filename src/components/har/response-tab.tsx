import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HarRequest } from "./harTypes";

interface ResponseTabProps {
  request: HarRequest;
}

export function ResponseTab({ request }: ResponseTabProps) {
  const { response } = request;

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["content", "headers"]}
    >
      <AccordionItem value="content">
        <AccordionTrigger>Response Content</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm text-emerald-600 dark:text-emerald-500">
                MIME Type
              </h4>
              <div className="font-mono text-sm">
                {response.content.mimeType}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm text-emerald-600 dark:text-emerald-500">
                Size
              </h4>
              <div className="font-mono text-sm">
                {response.content.size} bytes
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="headers">
        <AccordionTrigger>Response Headers</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {response.headers.map((header) => (
              <div key={header.name} className="font-mono text-sm">
                <span className="text-emerald-600 dark:text-emerald-500">
                  {header.name}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {header.value}
                </span>
              </div>
            ))}
            {response.headers.length === 0 && (
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
