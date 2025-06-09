import { Columns2 } from "lucide-react";
import { useCustomTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

export function SplitViewToggle() {
  const { toggleSecondPanel, isSecondPanelVisible } = useCustomTheme();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline" onClick={toggleSecondPanel}>
          <Columns2 className="!w-[1.4rem] !h-[1.4rem]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{isSecondPanelVisible ? "Hide right panel" : "Show right panel"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
