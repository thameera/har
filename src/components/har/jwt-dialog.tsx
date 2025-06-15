import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CopyButton } from "./copy-button";
import { NameValueParam } from "./harTypes";

interface JwtDialogProps {
  token: NameValueParam;
  children: React.ReactNode;
}

export function JwtDialog({ token, children }: JwtDialogProps) {
  const decodeJwt = (tokenValue: string) => {
    try {
      const parts = tokenValue.split(".");
      if (parts.length !== 3) {
        return { header: "Invalid JWT format", payload: "Invalid JWT format" };
      }

      // Convert base64url to base64
      const base64UrlToBase64 = (str: string) => {
        return str.replace(/-/g, "+").replace(/_/g, "/");
      };

      // Add padding if needed
      const addPadding = (str: string) => {
        const pad = str.length % 4;
        if (pad) {
          return str + "=".repeat(4 - pad);
        }
        return str;
      };

      const header = JSON.stringify(
        JSON.parse(atob(addPadding(base64UrlToBase64(parts[0])))),
        null,
        2,
      );
      const payload = JSON.stringify(
        JSON.parse(atob(addPadding(base64UrlToBase64(parts[1])))),
        null,
        2,
      );

      return { header, payload };
    } catch (error) {
      console.error(error);
      return {
        header: "Failed to decode JWT header",
        payload: "Failed to decode JWT payload",
      };
    }
  };

  const decodedJwt = decodeJwt(token.value);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>JWT Token: {token.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Raw JWT */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Raw JWT Token</label>
              <CopyButton text={token.value} />
            </div>
            <textarea
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800 font-mono text-xs resize-none overflow-y-auto"
              rows={3}
              value={token.value}
              readOnly
            />
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Header</label>
              <CopyButton text={decodedJwt.header} />
            </div>
            <textarea
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800 font-mono text-xs"
              rows={6}
              value={decodedJwt.header}
              readOnly
            />
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Payload</label>
              <CopyButton text={decodedJwt.payload} />
            </div>
            <textarea
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800 font-mono text-xs"
              rows={10}
              value={decodedJwt.payload}
              readOnly
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
