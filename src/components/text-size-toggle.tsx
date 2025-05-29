"use client";

import * as React from "react";
import { ALargeSmall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFont } from "./theme-provider";

export function TextSizeToggle() {
  const { toggleFontSize, fontSize } = useFont();

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
