import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy as CopyIcon, Check as CheckIcon } from "lucide-react";

interface HoverCopyButtonProps {
  value: string;
  className?: string;
  position?: "inline" | "code-block";
  size?: "sm" | "default";
}

export function HoverCopyButton({
  value,
  className = "",
  position = "inline",
  size = "sm",
}: HoverCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Position inline with text by default, special case for code blocks
  const positionClasses =
    position === "code-block"
      ? "absolute top-2 right-2 bg-background/80 backdrop-blur-sm shadow-sm rounded-sm z-10"
      : "inline-flex align-bottom";

  return (
    <Button
      variant="ghost"
      onClick={handleCopy}
      aria-label="Copy value"
      className={`${positionClasses} opacity-0 group-hover:opacity-100 transition-opacity !p-0 !m-0 !border-0 ${className}`}
      style={{
        height: size === "sm" ? "18px" : "24px",
        width: size === "sm" ? "18px" : "24px",
        minHeight: "0",
        minWidth: "0",
      }}
    >
      {copied ? (
        <CheckIcon
          style={{
            height: size === "sm" ? "12px" : "16px",
            width: size === "sm" ? "12px" : "16px",
          }}
          className="text-green-500"
        />
      ) : (
        <CopyIcon
          style={{
            height: size === "sm" ? "12px" : "16px",
            width: size === "sm" ? "12px" : "16px",
          }}
        />
      )}
    </Button>
  );
}
