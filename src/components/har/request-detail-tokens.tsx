import { HarRequest } from "./harTypes";
import { Badge } from "@/components/ui/badge";
import { JwtDialog } from "./jwt-dialog";

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
        <JwtDialog key={`jwt-${index}`} token={token}>
          <Badge
            variant="secondary"
            className="bg-blue-500 text-white dark:bg-blue-600 cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            jwt: {token.name}
          </Badge>
        </JwtDialog>
      ))}
      {samlList.map((token, index) => (
        <Badge key={`saml-${index}`} variant="secondary">
          saml: {token.name}
        </Badge>
      ))}
    </div>
  );
}
