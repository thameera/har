"use client";

import * as React from "react";
import { ALargeSmall } from "lucide-react";

import { Button } from "@/components/ui/button";
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
          "px-4 font-medium",
          currentfontSize === "small" &&
            "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        )}
      >
        <ALargeSmall className={`transition-all !h-[1.4rem] !w-[1.4rem]`} />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="normal"
        className={cn(
          "px-4 font-medium",
          currentfontSize === "normal" &&
            "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        )}
      >
        <ALargeSmall className={`transition-all !h-[2rem] !w-[2rem]`} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
