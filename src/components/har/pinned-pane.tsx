import { useEffect, useRef, useState, useMemo, memo } from "react";
import { useHar } from "./har-provider";
import { RequestDetails } from "./request-details";
import {
  DockviewReact,
  IDockviewPanelProps,
  DockviewApi,
  themeLightSpaced,
  themeAbyssSpaced,
  AddPanelOptions,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import { useTheme } from "next-themes";
import { HarRequest } from "./harTypes";

interface PinnedPaneProps {
  view: string;
}

// Memoized panel that doesn't re-render when irrelevant props change
const DockviewContent = memo(
  ({
    pinnedRequests,
    togglePin,
    theme,
  }: {
    pinnedRequests: HarRequest[];
    togglePin: (id: number) => void;
    theme: string;
  }) => {
    const [key, setKey] = useState(0);
    const dockviewApiRef = useRef<DockviewApi | null>(null);

    // Update key whenever pinnedRequests changes to force dockview rebuild
    useEffect(() => {
      setKey((prev) => prev + 1);
    }, [pinnedRequests]);

    const RequestDetailsPanel = (props: IDockviewPanelProps) => {
      const { request } = props.params;
      return <RequestDetails request={request} />;
    };

    return (
      <DockviewReact
        key={key}
        components={{
          reqDetail: RequestDetailsPanel,
        }}
        className="h-full"
        theme={theme === "light" ? themeLightSpaced : themeAbyssSpaced}
        onReady={(event) => {
          // Store the API reference
          dockviewApiRef.current = event.api;

          // Create panels for each pinned request with vertical splitting
          let previousPanelId: string | undefined;

          pinnedRequests.forEach((request, index) => {
            const id = request._custom!.id;

            // Use pre-parsed URL if available
            let path = "";
            let truncatedPath = "";

            if (request._custom && request._custom.urlObj) {
              path = request._custom.urlObj.pathname;
              truncatedPath =
                path.length > 30 ? path.slice(0, 30) + "..." : path;
            } else {
              // Fallback if URL parsing failed
              truncatedPath = "Unknown path";
            }

            const options: AddPanelOptions = {
              id: id.toString(),
              component: "reqDetail",
              title: `${id + 1}. ${truncatedPath}`,
              params: { request },
            };

            // For the first panel, just add it normally
            if (index === 0) {
              const panel = event.api.addPanel(options);
              previousPanelId = panel.id;
              panel.api.setActive();
            } else {
              // For subsequent panels, position them horizontally to the right
              options.position = {
                referencePanel: previousPanelId,
                direction: "right",
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
    );
  },
);

DockviewContent.displayName = "DockviewContent";

export function PinnedPane({ view }: PinnedPaneProps) {
  const { theme } = useTheme();
  const { getFilteredRequests, togglePin } = useHar();

  // Memoize the filtered requests to prevent unnecessary recalculations
  const pinnedRequests = useMemo(() => {
    console.log("Recalculating pinnedRequests in PinnedPane");
    return getFilteredRequests(view);
  }, [getFilteredRequests, view]);

  // No pinned requests to show
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
            <DockviewContent
              pinnedRequests={pinnedRequests}
              togglePin={togglePin}
              theme={theme || "light"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
