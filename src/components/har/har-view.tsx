import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, PinIcon } from "lucide-react";

import { FileUploader } from "./file-uploader";
import { useHar } from "./har-provider";
import { RequestsList } from "./requests-list";
import { DetailsPane } from "./details-pane";
import { PinnedPane } from "./pinned-pane";

export default function HarView() {
  const { harData } = useHar();
  const [isPinnedPanelExpanded, setIsPinnedPanelExpanded] = useState(false);

  // Force re-render of panel group when state changes
  const handlePanelToggle = useCallback(() => {
    setIsPinnedPanelExpanded(!isPinnedPanelExpanded);
  }, [isPinnedPanelExpanded]);

  return (
    <div className="h-full">
      {!harData ? (
        <div className="h-full">
          <FileUploader />
        </div>
      ) : (
        <div className="h-full">
          {/* Using key to force complete re-render */}
          <PanelGroup
            key={`panel-group-${isPinnedPanelExpanded ? "expanded" : "collapsed"}`}
            direction="horizontal"
            className="h-full"
          >
            <Panel
              defaultSize={isPinnedPanelExpanded ? 15 : 50}
              minSize={10}
              maxSize={70}
              className="bg-muted/50 p-4"
            >
              <RequestsList />
            </Panel>
            <PanelResizeHandle className="w-1 bg-border" />
            <Panel
              defaultSize={isPinnedPanelExpanded ? 35 : 48}
              minSize={10}
              maxSize={90}
              className="bg-muted/50 p-4"
            >
              <DetailsPane />
            </Panel>
            <PanelResizeHandle
              className={`w-1 bg-border ${!isPinnedPanelExpanded && "opacity-0"}`}
            />
            {/* Conditionally render different sized panel based on state */}
            <Panel
              defaultSize={isPinnedPanelExpanded ? 50 : 2}
              minSize={2}
              maxSize={80}
              className="bg-muted/50 p-4 relative transition-all duration-300"
              style={{ overflow: "hidden" }}
            >
              <div className="relative h-full">
                <button
                  onClick={handlePanelToggle}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 bg-muted hover:bg-muted/80 py-2 px-2 rounded-r-lg border border-l-0 border-border transition-colors z-10 shadow-sm flex flex-col items-center gap-2 h-auto"
                >
                  <PinIcon className="h-4 w-4" />
                  {isPinnedPanelExpanded ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
                <div
                  className={`${isPinnedPanelExpanded ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ml-4`}
                >
                  <PinnedPane />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      )}
    </div>
  );
}
