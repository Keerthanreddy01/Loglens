"use client";

import { LogFrequencyChart } from "./log-frequency-chart";
import { AIInsightCard } from "./ai-insight-card";
import { LiveStreamLog } from "./live-stream-log";
import { EmptyState } from "./empty-state";
import { useLogStore } from "@/lib/store";

export function OverviewContent() {
  const { parsedLogs, getFilteredLogs } = useLogStore();

  if (parsedLogs.length === 0) {
    return <EmptyState />;
  }

  const filteredLogs = getFilteredLogs();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Log Frequency Chart Section - Fixed height */}
      <div className="p-6 border-b border-border shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Log Frequency</h2>
            <p className="text-sm text-muted-foreground">
              Last 24 hours log distribution across all clusters
            </p>
          </div>
          <AIInsightCard />
        </div>
        <LogFrequencyChart />
      </div>

      {/* Live Stream Section - Flexible height, fills remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <LiveStreamLog logs={filteredLogs} />
      </div>
    </div>
  );
}
