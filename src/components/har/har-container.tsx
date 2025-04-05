import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelGroupHandle,
} from "react-resizable-panels";
import { useState, useCallback, useRef, useEffect } from "react";
import { PlusIcon, MinusIcon } from "lucide-react";

import HarView from "./har-view";
import { HarProvider } from "./har-provider";

export default function HarContainer() {
  const [isSecondPanelVisible, setIsSecondPanelVisible] = useState(false);
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const toggleSecondPanel = useCallback(() => {
    setIsSecondPanelVisible((prev) => !prev);
  }, []);

  // Set initial panel sizes when visibility changes
  useEffect(() => {
    if (panelGroupRef.current) {
      const panels = panelGroupRef.current.getLayout();

      // Only update sizes when needed
      if (isSecondPanelVisible && panels[0] > 0.9) {
        panelGroupRef.current.setLayout([0.5, 0.5]);
      } else if (!isSecondPanelVisible && panels.length > 1) {
        panelGroupRef.current.setLayout([1, 0]);
      }
    }
  }, [isSecondPanelVisible]);

  return (
    <div className="flex-1 min-h-0 relative">
      <PanelGroup ref={panelGroupRef} direction="horizontal" className="h-full">
        <Panel
          id="left-panel"
          minSize={30}
          className="transition-all duration-300"
        >
          <HarProvider>
            <HarView />
          </HarProvider>
        </Panel>

        <PanelResizeHandle
          className={`w-1 mx-2 bg-primary/30 hover:bg-primary transition-all duration-300 ${
            !isSecondPanelVisible ? "opacity-0" : "opacity-100"
          }`}
        />

        <Panel
          id="right-panel"
          minSize={0}
          defaultSize={0}
          style={{
            overflow: "hidden",
            maxWidth: isSecondPanelVisible ? "100%" : "0%",
            opacity: isSecondPanelVisible ? 1 : 0,
            transition: "max-width 300ms, opacity 300ms",
          }}
        >
          <HarProvider>
            <HarView />
          </HarProvider>
        </Panel>
      </PanelGroup>

      {/* Toggle button for second panel */}
      <button
        onClick={toggleSecondPanel}
        className="absolute right-4 top-4 bg-muted hover:bg-muted/80 p-2 rounded-md border border-border transition-colors z-20 shadow-sm flex items-center justify-center"
        title={isSecondPanelVisible ? "Hide right panel" : "Show right panel"}
      >
        {isSecondPanelVisible ? (
          <MinusIcon className="h-4 w-4" />
        ) : (
          <PlusIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
