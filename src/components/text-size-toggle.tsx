"use client";

import * as React from "react";
import { Moon, Sun, ALargeSmall } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { _temp_useFont } from "./theme-provider";

export function TextSizeToggle() {
  const { toggleFontSize, fontSize } = _temp_useFont();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFontSize}
      className="mr-1"
    >
      <ALargeSmall
        className=""
        color={fontSize === "small" ? "white" : "pink"}
      />
    </Button>
  );
}
