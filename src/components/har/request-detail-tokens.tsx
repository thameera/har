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

  const sendSamlToTool = (token: { name: string; value: string }) => {
    // Create a form + input
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://samltool.io/";
    form.target = "_blank";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = token.name;
    input.value = token.value;

    form.appendChild(input);
    document.body.appendChild(form);

    // Submit form + remove it
    form.submit();
    document.body.removeChild(form);
  };

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
        <Badge
          key={`saml-${index}`}
          variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600 cursor-pointer hover:bg-green-600 dark:hover:bg-green-700"
          onClick={() => sendSamlToTool(token)}
        >
          saml: {token.name}
        </Badge>
      ))}
    </div>
  );
}
