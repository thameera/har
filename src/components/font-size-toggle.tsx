"use client";

import { useCustomTheme } from "./theme-provider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export function FontSizeToggle() {
  const { toggleFontSize, currentfontSize } = useCustomTheme();

  return (
    <ToggleGroup
      type="single"
      value={currentfontSize}
      onValueChange={(value) => {
        if (value && currentfontSize !== value) toggleFontSize();
      }}
      variant="outline"
      className="border border-input"
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
  );
}
