"use client";

import React from "react"

import { useState, useCallback } from "react";
import { LogFrequencyChart } from "./log-frequency-chart";
import { AIInsightCard } from "./ai-insight-card";
import { LiveStreamLog } from "./live-stream-log";
import { EmptyState } from "./empty-state";
import { useLogStore } from "../../store/useLogsStore";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronUp, ChevronDown, Maximize2, Minimize2, GripHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";

import { motion, AnimatePresence } from "motion/react";

type PanelMode = "split" | "logs-expanded" | "chart-expanded";

export function OverviewContent() {
  const { parsedLogs, getFilteredLogs, isFocusMode, setFocusMode } = useLogStore();
  const [panelMode, setPanelMode] = useState<PanelMode>("split");
  const [chartHeight, setChartHeight] = useState(240); // Reduced default height
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

  const expandLogs = useCallback(() => {
    setPanelMode((prev) => (prev === "logs-expanded" ? "split" : "logs-expanded"));
  }, []);

  const expandChart = useCallback(() => {
    setPanelMode((prev) => (prev === "chart-expanded" ? "split" : "chart-expanded"));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode(!isFocusMode);
  }, [isFocusMode, setFocusMode]);

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
          height: isLogsExpanded ? 0 : isChartExpanded || isFocusMode ? "100%" : chartHeight,
          opacity: isLogsExpanded ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "border-b border-border shrink-0 overflow-hidden bg-card/10",
          (isChartExpanded || isFocusMode) && "flex-1"
        )}
      >
        <div className="px-4 py-1.5 h-full flex flex-col">
          <div className="flex items-start justify-between mb-2 shrink-0">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                Log Frequency
                {isFocusMode && (
                  <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                    FOCUS MODE
                  </Badge>
                )}
              </h2>
              {!isFocusMode && (
                <p className="text-[11px] text-muted-foreground">
                  Distribution across all clusters
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!isFocusMode && <AIInsightCard />}
              <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.05]">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-[11px] gap-2 hover:bg-white/5",
                    isFocusMode && "text-primary bg-primary/10"
                  )}
                  onClick={toggleFocusMode}
                  title="Toggle Focus Mode"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  {isFocusMode ? "Exit Focus" : "Focus"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-white/5"
                  onClick={expandChart}
                  title={isChartExpanded ? "Restore" : "Expand chart"}
                >
                  {isChartExpanded ? (
                    <Minimize2 className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <LogFrequencyChart />
          </div>
        </div>
      </motion.div>

      {/* Resizer Handle */}
      {!isFocusMode && (
        <AnimatePresence>
          {panelMode === "split" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "h-1.5 bg-border/20 hover:bg-primary/20 cursor-ns-resize flex items-center justify-center transition-colors shrink-0 group",
                isDragging && "bg-primary/40"
              )}
              onMouseDown={handleDragStart}
            >
              <div className="w-8 h-1 rounded-full bg-border group-hover:bg-primary/40 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Panel Mode Controls */}
      {!isFocusMode && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-muted/10 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-6 px-2 text-[11px] gap-1.5", isChartExpanded && "bg-secondary text-primary")}
              onClick={expandChart}
            >
              <ChevronUp className="w-3 h-3" />
              Chart Only
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-6 px-2 text-[11px] gap-1.5", isLogsExpanded && "bg-secondary text-primary")}
              onClick={expandLogs}
            >
              <ChevronDown className="w-3 h-3" />
              Logs Only
            </Button>
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums font-mono uppercase tracking-wider">
            {filteredLogs.length} of {parsedLogs.length} entries matching filters
          </span>
        </div>
      )}

      {/* Live Stream Section */}
      <motion.div
        animate={{
          flex: isChartExpanded || isFocusMode ? 0 : 1,
          height: isChartExpanded || isFocusMode ? 0 : "auto",
          opacity: isChartExpanded || isFocusMode ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-0 overflow-hidden"
      >
        <LiveStreamLog logs={filteredLogs} />
      </motion.div>
    </div>
  );
}

