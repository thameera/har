import { HarRequest } from "./harTypes";

interface RequestDetailURLProps {
  request: HarRequest;
}

export function RequestDetailURL({ request }: RequestDetailURLProps) {
  try {
    const method = request.request.method;
    const url = request.request.url;
    const urlObj = new URL(url);
    const hasQueryParams =
      request._custom?.queryParams && request._custom.queryParams.length > 0;
    const hasHashParams =
      request._custom?.hashParams && request._custom.hashParams.length > 0;

    return (
      <div className="font-mono text-sm break-all">
        <span className="text-gray-900 dark:text-gray-100">{method}</span>
        <span className="text-gray-600 dark:text-gray-400"> </span>
        <span className="text-gray-600 dark:text-gray-400">
          {urlObj.protocol + "//"}
        </span>
        <span className="text-blue-500 dark:text-blue-400 font-medium">
          {urlObj.hostname}
          {urlObj.port ? `:${urlObj.port}` : ""}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          {urlObj.pathname}
        </span>
        {hasQueryParams && (
          <span className="text-gray-600 dark:text-gray-400">
            {request._custom!.queryParams!.map((param, index) => (
              <span key={`${param.name}-${index}`}>
                {index === 0 ? "?" : "&"}
                <span className="text-purple-500 dark:text-purple-400">
                  {param.name}
                </span>
                <span className="text-gray-600 dark:text-gray-400">=</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {param.value}
                </span>
              </span>
            ))}
          </span>
        )}
        {hasHashParams && (
          <span className="text-gray-600 dark:text-gray-400">
            #
            {request._custom!.hashParams!.map((param, index) => (
              <span key={`${param.name}-${index}`}>
                {index === 0 ? "" : "&"}
                <span className="text-purple-500 dark:text-purple-400">
                  {param.name}
                </span>
                <span className="text-gray-600 dark:text-gray-400">=</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {param.value}
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
        <span className="text-gray-900 dark:text-gray-100">
          {request.request.method}
        </span>
        <span className="text-gray-600 dark:text-gray-400"> </span>
        <span className="text-gray-600 dark:text-gray-400">
          {request.request.url}
        </span>
      </div>
    );
  }
}
