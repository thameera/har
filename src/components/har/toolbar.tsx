import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  onViewChange?: (view: string) => void;
}

export function Toolbar({ onViewChange }: ToolbarProps) {
  const [view, setView] = useState<string>("all");

  // Notify HarView when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(view);
    }
  }, [view, onViewChange]);

  return (
    <div className="bg-muted/70 p-2 border-b border-border mb-2 flex items-center">
      <div className="mr-4">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => {
            if (value) setView(value);
          }}
          variant="outline"
          className="border border-input"
        >
          <ToggleGroupItem
            value="all"
            className={cn(
              "px-4 font-medium",
              view === "all" &&
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            )}
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem
            value="pinned"
            className={cn(
              "px-4 font-medium",
              view === "pinned" &&
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            )}
          >
            Pinned
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
