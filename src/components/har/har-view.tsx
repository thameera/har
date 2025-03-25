import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { FileUploader } from "./file-uploader";
import { useHar } from "./har-provider";
import { RequestsList } from "./RequestsList";
import { DetailsPane } from "./DetailsPane";

export default function HarView() {
  const { harData } = useHar();

  return (
    <div>
      {!harData ? (
        <div>
          <FileUploader />
        </div>
      ) : (
        <div className="h-[calc(100vh-12rem)]">
          <PanelGroup direction="horizontal" className="h-full">
            <Panel
              defaultSize={20}
              minSize={10}
              maxSize={50}
              className="bg-muted/50 p-4"
            >
              <RequestsList />
            </Panel>
            <PanelResizeHandle className="w-1 bg-border" />
            <Panel
              defaultSize={40}
              minSize={10}
              maxSize={50}
              className="bg-muted/50 p-4"
            >
              <DetailsPane />
            </Panel>
            <PanelResizeHandle className="w-1 bg-border" />
            <Panel
              defaultSize={40}
              minSize={2}
              maxSize={80}
              className="bg-muted/50 p-4"
            >
              Pinned panel
            </Panel>
          </PanelGroup>
        </div>
      )}
    </div>
  );
}
