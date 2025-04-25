import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Toolbar() {
  const [view, setView] = useState<string>("all");

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
        >
          <ToggleGroupItem value="all" className="px-4">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="pinned" className="px-4">
            Pinned
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
