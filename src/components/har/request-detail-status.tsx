import { getReasonPhrase } from "http-status-codes";

interface RequestDetailStatusProps {
  status: number;
}

function getStatusInfo(status: number): { emoji: string; text: string } {
  if (status === 0) {
    return { emoji: "🔴", text: "" };
  }

  const text = getReasonPhrase(status) || "Unknown";

  if (status >= 200 && status < 300) {
    return { emoji: "🟢", text };
  } else if (status >= 300 && status < 400) {
    return { emoji: "🟡", text };
  } else if (status >= 400 && status < 500) {
    return { emoji: "🔴", text };
  } else if (status >= 500) {
    return { emoji: "🔴", text };
  }
  return { emoji: "⚪", text: "Unknown" };
}

export function RequestDetailStatus({ status }: RequestDetailStatusProps) {
  const { emoji, text } = getStatusInfo(status);

  return (
    <div className="text-sm">
      <span className="mr-1">{emoji}</span>
      <span className="text-gray-900 dark:text-gray-100">{status}</span>
      <span className="text-gray-600 dark:text-gray-400 ml-1">{text}</span>
    </div>
  );
}
