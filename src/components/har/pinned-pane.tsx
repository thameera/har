import { useEffect, useRef, useState } from "react";
import { useHar } from "./har-provider";
import { RequestDetails } from "./request-details";
import {
  DockviewReact,
  IDockviewPanelProps,
  DockviewApi,
  themeLightSpaced,
  themeAbyssSpaced,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import { useTheme } from "next-themes";

export function PinnedPane() {
  const [key, setKey] = useState(0); // Used to force re-render of dockview
  const dockviewApiRef = useRef<DockviewApi | null>(null);


  const { theme } = useTheme();

  const { pinnedRequests, togglePin } = useHar();


  // Update key whenever pinnedRequests changes to force dockview rebuild
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [pinnedRequests]);

  const RequestDetailsPanel = (props: IDockviewPanelProps) => {
    const { request } = props.params;
    return <RequestDetails request={request} />;
  };

  if (pinnedRequests.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground text-center p-4">
          No pinned requests yet. Click the pin icon on a request to pin it.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ overflow: "hidden" }}>
      <div className="text-lg font-semibold p-2" style={{ flex: "0 0 auto" }}>
        Pinned Requests ({pinnedRequests.length})
      </div>

      <div className="h-full flex flex-col">
        <div className="flex-grow dockview-theme-light border rounded overflow-hidden">
          <div className="h-full">
            <DockviewReact
              key={key}
              components={{
                reqDetail: RequestDetailsPanel,
                // TODO set panel header to path (?)
              }}
              className="h-full"
              theme={theme === "light" ? themeLightSpaced : themeAbyssSpaced}
              onReady={(event) => {
                // Store the API reference
                dockviewApiRef.current = event.api;

                // Create panels for each pinned request with vertical splitting
                let previousPanelId: string | undefined;

                pinnedRequests.forEach((request, index) => {
                  const options: any = {
                    id: request._custom?.id?.toString() ?? "-1",
                    component: "reqDetail",
                    title: request.request.url,
                    params: { request },
                  };

                  // For the first panel, just add it normally
                  if (index === 0) {
                    const panel = event.api.addPanel(options);
                    previousPanelId = panel.id;
                    panel.api.setActive();
                  } else {
                    // For subsequent panels, position them as vertical splits
                    options.position = {
                      referencePanel: previousPanelId,
                      direction: "below",
                    };

                    const panel = event.api.addPanel(options);
                    previousPanelId = panel.id;
                  }
                });

                // Add event listener for panel closing
                event.api.onDidRemovePanel((panel) => {
                  togglePin(parseInt(panel.id));
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
