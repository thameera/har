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
      <span className="text-gray-600 dark:text-gray-400">Server IP:</span>
      <span className="text-gray-900 dark:text-gray-100 ml-1">
        {serverIPAddress}
      </span>
    </div>
  );
}
