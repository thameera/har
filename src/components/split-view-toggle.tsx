import { Columns2 } from "lucide-react";
import { useCustomTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function SplitViewToggle() {
  const { toggleSecondPanel, isSecondPanelVisible } = useCustomTheme();
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={toggleSecondPanel}
      title={isSecondPanelVisible ? "Hide right panel" : "Show right panel"}
    >
      <Columns2 className="!w-[1.4rem] !h-[1.4rem]" />
    </Button>
  );
}
