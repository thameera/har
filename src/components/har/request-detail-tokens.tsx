import { HarRequest } from "./harTypes";
import { Badge } from "@/components/ui/badge";

interface RequestDetailTokensProps {
  request: HarRequest;
}

export function RequestDetailTokens({ request }: RequestDetailTokensProps) {
  const jwtList = request._custom?.jwtList || [];
  const samlList = request._custom?.samlList || [];

  // If no tokens, don't render anything
  if (jwtList.length === 0 && samlList.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      Tokens detected:
      {jwtList.map((token, index) => (
        <Badge
          key={`jwt-${index}`}
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600"
        >
          jwt: {token.name}
        </Badge>
      ))}
      {samlList.map((token, index) => (
        <Badge key={`saml-${index}`} variant="secondary">
          saml: {token.name}
        </Badge>
      ))}
    </div>
  );
}
