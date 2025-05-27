import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useHar } from "./har-provider";
import { DomainFilter } from "./domain-filter";
import { MethodFilter } from "./method-filter";
import { TextFilter } from "./text-filter";

interface ToolbarProps {
  onViewChange?: (view: string) => void;
}

export function Toolbar({ onViewChange }: ToolbarProps) {
  const [view, setView] = useState<string>("all");
  const { pinnedRequests, searchText, setSearchText } = useHar();
  const hasPinnedRequests = pinnedRequests.length > 0;

  // Notify HarView when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(view);
    }
  }, [view, onViewChange]);

  return (
    <div className="bg-muted/70 p-2 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-4">
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
              "px-4 font-medium relative",
              view === "pinned" &&
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            )}
          >
            Pinned
            {hasPinnedRequests && view !== "pinned" && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </ToggleGroupItem>
        </ToggleGroup>

        <DomainFilter />
        <MethodFilter />
        <TextFilter
          value={searchText}
          onChange={setSearchText}
          placeholder="Search URLs..."
          className="min-w-[200px]"
        />
      </div>
    </div>
  );
}
