import { decodeSAML } from "@/lib/utils";
import { HarRequest } from "../types/harTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SamlResponseProps {
  request: HarRequest;
}

export function SamlResponseTab({ request }: SamlResponseProps) {
  const isPostRequest = request.request.method.toUpperCase() === "POST";

  const hasFormData =
    isPostRequest &&
    request.request.postData?.params &&
    request.request.postData.params.length > 0;

  const saml = request.request.postData?.params?.find(
    (param) => param.name === "SAMLResponse" || param.name === "SAMLRequest",
  );

  const decodedSaml = saml ? decodeSAML(saml.value) : "no saml found";

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["url", "headers", ...(hasFormData ? ["formdata"] : [])]}
    >
      {hasFormData && (
        <AccordionItem value="formdata">
          <AccordionTrigger>SAML data</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              <div className="font-mono text-sm overflow-x-auto">
                <pre className="text-gray-600 dark:text-gray-400 ml-2 break-all whitespace-pre-wrap break-words">
                  {saml && JSON.stringify(decodedSaml, null, 2)}
                </pre>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
