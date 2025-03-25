import { HarRequest } from "./harTypes";

interface RequestDetailsProps {
  request: HarRequest;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  return (
    <div>
      <pre>{JSON.stringify(request, null, 2)}</pre>
    </div>
  );
}
