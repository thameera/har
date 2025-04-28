import { HarRequest } from "./harTypes";
import { RequestDetailURL } from "./request-detail-url";
import { RequestDetailStatus } from "./request-detail-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestTab } from "./request-tab";
import { ResponseTab } from "./response-tab";
import { CookiesTab } from "./cookies-tab";
import { getSaml } from "@/lib/utils";

interface RequestDetailsProps {
  request: HarRequest;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  const { method, url } = request.request;
  const { status } = request.response;

  const saml = getSaml(request);

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
            </TabsList>

            {saml && (
              <div className="my-1">
                <a
                  href={`https://samltool.io/?${saml.name}=${saml.value}`}
                  target="_blank"
                  className={`my-3 border bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1.5 py-1 rounded cursor-pointer`}
                >
                  open in samltool.io
                </a>
              </div>
            )}

            <TabsContent value="request" className="mt-4">
              <RequestTab request={request} />
            </TabsContent>

            <TabsContent value="response" className="mt-4">
              <ResponseTab request={request} />
            </TabsContent>

            <TabsContent value="cookies" className="mt-4">
              <CookiesTab request={request} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
