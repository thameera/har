import { HarRequest } from "./harTypes";
import { RequestDetailURL } from "./request-detail-url";
import { RequestDetailStatus } from "./request-detail-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestTab } from "./request-tab";
import { ResponseTab } from "./response-tab";

interface RequestDetailsProps {
  request: HarRequest;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  const { method, url } = request.request;
  const { status } = request.response;

  return (
    <div className="p-4 space-y-2">
      <RequestDetailURL method={method} url={url} />
      <RequestDetailStatus status={status} />

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
            <div className="text-muted-foreground">Cookie details</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
