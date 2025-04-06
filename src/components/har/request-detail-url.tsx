interface RequestDetailURLProps {
  method: string;
  url: string;
}

export function RequestDetailURL({ method, url }: RequestDetailURLProps) {
  try {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);
    const hash = urlObj.hash.slice(1); // Remove the # symbol
    const hashParams = new URLSearchParams(hash);

    return (
      <div className="font-mono text-sm break-all">
        <span className="text-gray-900 dark:text-gray-100">{method}</span>
        <span className="text-gray-600 dark:text-gray-400"> </span>
        <span className="text-gray-600 dark:text-gray-400">
          {urlObj.protocol}//
        </span>
        <span className="text-blue-500 dark:text-blue-400 font-medium">
          {urlObj.hostname}
          {urlObj.port ? `:${urlObj.port}` : ""}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          {urlObj.pathname}
        </span>
        {urlObj.search && (
          <span className="text-gray-600 dark:text-gray-400">
            {Array.from(searchParams.entries()).map(([key, value], index) => (
              <span key={key}>
                {index === 0 ? "?" : "&"}
                <span className="text-purple-500 dark:text-purple-400">
                  {key}
                </span>
                <span className="text-gray-600 dark:text-gray-400">=</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {value}
                </span>
              </span>
            ))}
          </span>
        )}
        {hash && (
          <span className="text-gray-600 dark:text-gray-400">
            #
            {Array.from(hashParams.entries()).map(([key, value], index) => (
              <span key={key}>
                {index === 0 ? "" : "&"}
                <span className="text-purple-500 dark:text-purple-400">
                  {key}
                </span>
                <span className="text-gray-600 dark:text-gray-400">=</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {value}
                </span>
              </span>
            ))}
          </span>
        )}
      </div>
    );
  } catch {
    return (
      <div className="font-mono text-sm break-all">
        <span className="text-gray-900 dark:text-gray-100">{method}</span>
        <span className="text-gray-600 dark:text-gray-400"> </span>
        <span className="text-gray-600 dark:text-gray-400">{url}</span>
      </div>
    );
  }
}
