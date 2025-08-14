"use client";

import { Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PrivacyTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="inline-flex items-center gap-1 text-xs opacity-80 hover:opacity-100 bg-yellow-300 text-yellow-900 rounded-full px-3 py-1 font-semibold">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Privacy</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs leading-snug">
          HAR files can contain sensitive information - be careful where you
          upload them. This site does not store or transmit the HAR files
          outside of the browser. All the processing happens in the browser.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
