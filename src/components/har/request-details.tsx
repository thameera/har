import { HarRequest } from "./harTypes";
import { RequestDetailURL } from "./request-detail-url";
import { RequestDetailStatus } from "./request-detail-status";

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
    </div>
  );
}
