import { HarRequest } from "./harTypes";
import { RequestDetailURL } from "./request-detail-url";
import { RequestDetailStatus } from "./request-detail-status";
import { RequestDetailServerIP } from "./request-detail-server-ip";
import { RequestDetailTokens } from "./request-detail-tokens";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestTab } from "./request-tab";
import { ResponseTab } from "./response-tab";
import { CookiesTab } from "./cookies-tab";

interface RequestDetailsProps {
  request: HarRequest;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-2">
        <div className="mb-2 text-sm text-gray-900 dark:text-gray-100">
          {request.startedDateTime.replace("T", " ")}
        </div>
        <RequestDetailURL request={request} />
        <RequestDetailStatus status={request.response.status} />
        <RequestDetailServerIP serverIPAddress={request.serverIPAddress} />
        <RequestDetailTokens request={request} />

        <div className="mt-6">
          <Tabs defaultValue="request" className="w-full">
            <TabsList>
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="cookies">Cookies</TabsTrigger>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}
