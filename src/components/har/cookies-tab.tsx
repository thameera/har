import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HarRequest } from "../types/harTypes";

interface CookiesTabProps {
  request: HarRequest;
}

export function CookiesTab({ request }: CookiesTabProps) {
  const { request: req, response } = request;

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
                  <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
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
                  <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
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
