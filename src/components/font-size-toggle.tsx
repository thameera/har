"use client";

import { useCustomTheme } from "./theme-provider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function FontSizeToggle() {
  const { toggleFontSize, currentfontSize } = useCustomTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroup
          type="single"
          value={currentfontSize}
          onValueChange={(value) => {
            if (value && currentfontSize !== value) toggleFontSize();
          }}
          variant="outline"
        >
          <ToggleGroupItem
            value="small"
            className={cn(
              "px-3 font-medium",
              currentfontSize === "small" &&
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            )}
          >
            <span className="text-sm font-semibold select-none">Aa</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="normal"
            className={cn(
              "px-3 font-medium",
              currentfontSize === "normal" &&
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            )}
          >
            <span className="text-lg font-semibold select-none">Aa</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </TooltipTrigger>
      <TooltipContent>
        <p>Change text size</p>
      </TooltipContent>
    </Tooltip>
  );
}
