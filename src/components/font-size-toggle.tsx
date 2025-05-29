"use client";

import * as React from "react";
import { ALargeSmall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCustomTheme } from "./theme-provider";

export function FontSizeToggle() {
  const { toggleFontSize, currentfontSize } = useCustomTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFontSize}
      className="mr-1"
    >
      <ALargeSmall
        className={`transition-all ${currentfontSize === "small" ? `!h-[1.2rem] !w-[1.2rem]` : `!h-[2rem] !w-[2rem]`}`}
      />
    </Button>
  );
}
