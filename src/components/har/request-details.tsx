import { HarRequest } from "./harTypes";
import { RequestDetailURL } from "./request-detail-url";
import { RequestDetailStatus } from "./request-detail-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestTab } from "./request-tab";
import { ResponseTab } from "./response-tab";
import { CookiesTab } from "./cookies-tab";
import { SamlResponseTab } from "./samlresponse-tab";

interface RequestDetailsProps {
  request: HarRequest;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  const { method, url } = request.request;
  const { status } = request.response;

  const isSaml =
    request.request.method.toUpperCase() === "POST" &&
    request.request.postData?.params &&
    request.request.postData.params.length > 0 &&
    request.request.postData.params.some(
      (param) => param.name === "SAMLResponse" || param.name === "SAMLRequest",
    );

  const saml =
    isSaml &&
    request.request.postData?.params?.find(
      (param) => param.name === "SAMLResponse" || param.name === "SAMLRequest",
    );

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-2">
        <div className="mb-2 text-sm text-gray-900 dark:text-gray-100">
          {request.startedDateTime.replace("T", " ")}
        </div>
        <RequestDetailURL method={method} url={url} />
        <RequestDetailStatus status={status} />

        <div className="mt-6">
          <Tabs defaultValue="request" className="w-full">
            <TabsList>
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="cookies">Cookies</TabsTrigger>
              {isSaml && (
                <a
                  href={`https://samltool.io/?${saml?.name}=${saml?.value}`}
                  target="_blank"
                >
                  <TabsTrigger value="saml">Go to Samltool.io</TabsTrigger>
                </a>
              )}
            </TabsList>

            <TabsContent value="request" className="mt-4">
              <RequestTab request={request} />
            </TabsContent>

            <TabsContent value="response" className="mt-4">
              <ResponseTab request={request} />
            </TabsContent>

            <TabsContent value="cookies" className="mt-4">
              <CookiesTab request={request} />
            </TabsContent>

            <TabsContent value="saml" className="mt-4">
              <a
                href={`https://samltool.io/?${saml?.name}=${saml?.value}`}
                target="_blank"
              >
                test
              </a>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
