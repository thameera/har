import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState } from "react";

import { FileUploader } from "./file-uploader";
import { useHar } from "./har-provider";
import { RequestsList } from "./requests-list";
import { DetailsPane } from "./details-pane";
import { PinnedPane } from "./pinned-pane";
import { Toolbar } from "./toolbar";

function PanelsContainer() {
  return (
    <PanelGroup direction="horizontal" className="flex-1">
      <Panel
        defaultSize={40}
        minSize={20}
        maxSize={80}
        className="bg-muted/50 p-4"
      >
        <RequestsList />
      </Panel>
      <PanelResizeHandle className="w-1 bg-border" />
      <Panel
        defaultSize={60}
        minSize={20}
        maxSize={80}
        className="bg-muted/50 p-4"
      >
        <DetailsPane />
      </Panel>
    </PanelGroup>
  );
}

export default function HarView() {
  const { harData } = useHar();
  const [currentView, setCurrentView] = useState<string>("all");

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="h-full har-view-small-font">
      {!harData ? (
        <div className="h-full">
          <FileUploader />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Toolbar */}
          <Toolbar onViewChange={handleViewChange} />

          {/* Render content based on current view */}
          {currentView === "all" ? (
            <PanelsContainer />
          ) : (
            <div className="flex-1 bg-muted/50 p-4">
              <PinnedPane />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
