import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HarRequest } from "./harTypes";
import { HoverCopyButton } from "./hover-copy-button";

interface CookiesTabProps {
  request: HarRequest;
}

export function CookiesTab({ request }: CookiesTabProps) {
  const { request: req, response } = request;

  // Value container class for consistent styling
  const valueContainerClass =
    "text-gray-600 dark:text-gray-400 break-all group";

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["request-cookies", "response-cookies"]}
    >
      <AccordionItem value="request-cookies">
        <AccordionTrigger>Request Cookies</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {req.cookies.length > 0 ? (
              req.cookies.map((cookie, index) => (
                <div
                  key={`${cookie.name}-${index}`}
                  className="font-mono text-sm"
                >
                  <span className="text-emerald-600 dark:text-emerald-500 break-all">
                    {cookie.name}
                  </span>
                  <span className={valueContainerClass}>
                    <HoverCopyButton value={cookie.value} />
                    {cookie.value}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                No request cookies found
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="response-cookies">
        <AccordionTrigger>Response Cookies</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {response.cookies && response.cookies.length > 0 ? (
              response.cookies.map((cookie, index) => (
                <div
                  key={`${cookie.name}-${index}`}
                  className="font-mono text-sm"
                >
                  <span className="text-emerald-600 dark:text-emerald-500 break-all">
                    {cookie.name}
                  </span>
                  <span className={valueContainerClass}>
                    <HoverCopyButton value={cookie.value} />
                    {cookie.value}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                No response cookies found
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
