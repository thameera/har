import { HarRequest } from "./harTypes";
import { RequestDetailURL } from "./request-detail-url";
import { RequestDetailStatus } from "./request-detail-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <div className="text-muted-foreground">Request details</div>
          </TabsContent>

          <TabsContent value="response" className="mt-4">
            <div className="text-muted-foreground">Response details</div>
          </TabsContent>

          <TabsContent value="cookies" className="mt-4">
            <div className="text-muted-foreground">Cookie details</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
