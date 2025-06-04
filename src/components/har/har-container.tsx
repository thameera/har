import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelGroupHandle,
} from "react-resizable-panels";
import { useRef, useEffect } from "react";

import HarView from "./har-view";
import { HarProvider } from "./har-provider";
import { useCustomTheme } from "../theme-provider";

export default function HarContainer() {
  const { isSecondPanelVisible } = useCustomTheme();
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

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
    </div>
  );
}
