import { HarRequest } from "./harTypes";
import { FancyURL } from "./FancyURL";

interface RequestDetailsProps {
  request: HarRequest;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  const { method, url } = request.request;

  return (
    <div className="p-4 space-y-2">
      <FancyURL method={method} url={url} />
    </div>
  );
}
