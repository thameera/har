import { HoverCopyButton } from "./hover-copy-button";

interface RequestDetailServerIPProps {
  serverIPAddress?: string;
}

export function RequestDetailServerIP({
  serverIPAddress,
}: RequestDetailServerIPProps) {
  if (!serverIPAddress) {
    return null;
  }

  return (
    <div className="text-sm">
      <span className="mr-1">🌐</span>
      <span className="text-emerald-600 dark:text-emerald-500 break-all">
        Server IP
      </span>
      <span className="text-gray-600 dark:text-gray-400 break-all group">
        <HoverCopyButton value={serverIPAddress} />
        {serverIPAddress}
      </span>
    </div>
  );
}
