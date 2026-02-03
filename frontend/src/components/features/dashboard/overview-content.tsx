"use client";

import React from "react"

import { useState, useCallback } from "react";
import { LogFrequencyChart } from "./log-frequency-chart";
import { AIInsightCard } from "./ai-insight-card";
import { LiveStreamLog } from "./live-stream-log";
import { EmptyState } from "./empty-state";
import { useLogStore } from "@/lib/store";
import { Button } from "@/ui/button";
import { ChevronUp, ChevronDown, Maximize2, Minimize2, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "motion/react";

type PanelMode = "split" | "logs-expanded" | "chart-expanded";

export function OverviewContent() {
  const { parsedLogs, getFilteredLogs } = useLogStore();
  const [panelMode, setPanelMode] = useState<PanelMode>("split");
  const [chartHeight, setChartHeight] = useState(280);
  const [isDragging, setIsDragging] = useState(false);

  const filteredLogs = getFilteredLogs();

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startY = e.clientY;
    const startHeight = chartHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.min(Math.max(startHeight + deltaY, 120), 500);
      setChartHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [chartHeight]);

  const togglePanelMode = useCallback(() => {
    setPanelMode((prev) => {
      if (prev === "split") return "logs-expanded";
      if (prev === "logs-expanded") return "chart-expanded";
      return "split";
    });
  }, []);

  const expandLogs = useCallback(() => {
    setPanelMode((prev) => (prev === "logs-expanded" ? "split" : "logs-expanded"));
  }, []);

  const expandChart = useCallback(() => {
    setPanelMode((prev) => (prev === "chart-expanded" ? "split" : "chart-expanded"));
  }, []);

  if (parsedLogs.length === 0) {
    return <EmptyState />;
  }

  const isLogsExpanded = panelMode === "logs-expanded";
  const isChartExpanded = panelMode === "chart-expanded";

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Log Frequency Chart Section */}
      <motion.div
        animate={{
          height: isLogsExpanded ? 0 : isChartExpanded ? "100%" : chartHeight,
          opacity: isLogsExpanded ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "border-b border-border shrink-0 overflow-hidden",
          isChartExpanded && "flex-1"
        )}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3 shrink-0">
            <div>
              <h2 className="text-base font-semibold text-foreground">Log Frequency</h2>
              <p className="text-xs text-muted-foreground">
                Last 24 hours log distribution across all clusters
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AIInsightCard />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={expandChart}
                title={isChartExpanded ? "Restore" : "Expand chart"}
              >
                {isChartExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <LogFrequencyChart />
          </div>
        </div>
      </motion.div>

      {/* Resizer Handle */}
      <AnimatePresence>
        {panelMode === "split" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "h-2 bg-border/50 hover:bg-primary/30 cursor-ns-resize flex items-center justify-center transition-colors shrink-0 group",
              isDragging && "bg-primary/50"
            )}
            onMouseDown={handleDragStart}
          >
            <GripHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Mode Controls */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-muted/30 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-6 px-2 text-xs gap-1", isChartExpanded && "bg-secondary")}
            onClick={expandChart}
          >
            <ChevronUp className="w-3 h-3" />
            Chart
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-6 px-2 text-xs gap-1", isLogsExpanded && "bg-secondary")}
            onClick={expandLogs}
          >
            <ChevronDown className="w-3 h-3" />
            Logs
          </Button>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {filteredLogs.length} of {parsedLogs.length} logs
        </span>
      </div>

      {/* Live Stream Section */}
      <motion.div
        animate={{
          flex: isChartExpanded ? 0 : 1,
          height: isChartExpanded ? 0 : "auto",
          opacity: isChartExpanded ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-0 overflow-hidden"
      >
        <LiveStreamLog logs={filteredLogs} />
      </motion.div>
    </div>
  );
}

