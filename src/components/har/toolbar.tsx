import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useHar } from "./har-provider";
import { DomainFilter } from "./domain-filter";
import { MethodFilter } from "./method-filter";
import { TextFilter } from "./text-filter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  onViewChange?: (view: string) => void;
}

export function Toolbar({ onViewChange }: ToolbarProps) {
  const [view, setView] = useState<string>("all");
  const {
    pinnedRequests,
    searchText,
    setSearchText,
    isFullSearch,
    setIsFullSearch,
    selectedDomains,
    selectedMethods,
    clearAllFilters,
    clearHarData,
    harFileName,
  } = useHar();
  const hasPinnedRequests = pinnedRequests.length > 0;

  // Check if any filters are applied
  const hasActiveFilters =
    selectedDomains.length > 0 ||
    selectedMethods.length > 0 ||
    searchText.trim().length > 0;

  // Notify HarView when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(view);
    }
  }, [view, onViewChange]);

  return (
    <div className="bg-muted/70 p-2 border-b border-border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => {
              if (value) setView(value);
            }}
            variant="outline"
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
            isFullSearch={isFullSearch}
            onFullSearchToggle={setIsFullSearch}
            className="min-w-[200px] flex-shrink"
          />

          {hasActiveFilters && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 h-9"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all filters</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHarData}
              className="flex items-center gap-2 h-9 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close HAR file</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
