import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HarRequest } from "./harTypes";
import { HoverCopyButton } from "./hover-copy-button";

interface ResponseTabProps {
  request: HarRequest;
}

export function ResponseTab({ request }: ResponseTabProps) {
  const { response } = request;

  // Value container class for consistent styling
  const valueContainerClass = "font-mono text-sm break-all group";

  // Determine if content can be displayed as text
  const canDisplayAsText = (content: { mimeType: string; text?: string }) => {
    if (!content.text) return false;

    const textBasedTypes = [
      "text/",
      "application/json",
      "application/xml",
      "application/javascript",
      "application/x-javascript",
      "application/ecmascript",
      "application/x-ecmascript",
      "application/ld+json",
      "application/html",
    ];

    return textBasedTypes.some((type) =>
      content.mimeType.toLowerCase().includes(type),
    );
  };

  // Prettify JSON content
  const getPrettifiedContent = (content: {
    mimeType: string;
    text?: string;
  }) => {
    if (!content.text) return "";

    if (content.mimeType.toLowerCase().includes("json")) {
      try {
        return JSON.stringify(JSON.parse(content.text), null, 2);
      } catch (_) {
        return `// Invalid JSON format\n${content.text}`;
      }
    }

    // Return original content for non-JSON types
    return content.text;
  };

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
            <div className="font-mono text-sm">
              <span className="text-emerald-600 dark:text-emerald-500 break-all">
                MIME Type
              </span>
              <span className="text-gray-600 dark:text-gray-400 break-all group">
                <HoverCopyButton value={response.content.mimeType} />
                {response.content.mimeType}
              </span>
            </div>
            <div className="font-mono text-sm">
              <span className="text-emerald-600 dark:text-emerald-500 break-all">
                Size
              </span>
              <span className="text-gray-600 dark:text-gray-400 break-all group">
                <HoverCopyButton value={`${response.content.size} bytes`} />
                {response.content.size} bytes
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm text-emerald-600 dark:text-emerald-500 mb-2">
                Content
              </h4>
              {canDisplayAsText(response.content) ? (
                <div className="group relative">
                  <pre className="font-mono text-sm p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 overflow-x-auto whitespace-pre-wrap break-words max-h-96 overflow-y-auto pr-10">
                    {getPrettifiedContent(response.content)}
                  </pre>
                  <HoverCopyButton
                    value={getPrettifiedContent(response.content)}
                    position="code-block"
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400 italic break-words">
                  {response.content.text
                    ? "Content cannot be displayed (binary or unsupported format)"
                    : "No content available"}
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="headers">
        <AccordionTrigger>Response Headers</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {response.headers.map((header, index) => (
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
