"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  Pause,
  Play,
  ChevronDown,
  FileText,
  FileJson,
  Clipboard,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LogLevel, ParsedLog } from "@/lib/types";
import { EmptyState } from "@/components/overview/empty-state";

const levelConfig: Record<
  LogLevel,
  { label: string; color: string; activeColor: string }
> = {
  ERROR: { label: "ERROR", color: "text-destructive", activeColor: "bg-destructive text-white" },
  WARN: { label: "WARN", color: "text-warning", activeColor: "bg-warning text-black" },
  INFO: { label: "INFO", color: "text-primary", activeColor: "bg-primary text-white" },
  DEBUG: { label: "DEBUG", color: "text-muted-foreground", activeColor: "bg-muted-foreground text-white" },
  TRACE: { label: "TRACE", color: "text-muted", activeColor: "bg-muted text-foreground" },
};

function LogRow({
  log,
  isSelected,
  onSelect,
}: {
  log: ParsedLog;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const levelStyle = levelConfig[log.level];
  const timestamp = log.timestamp.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  const handleDoubleClick = () => {
    navigator.clipboard.writeText(log.rawLine);
    toast.success("Log copied to clipboard");
  };

  return (
    <button
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "w-full text-left flex items-start gap-4 px-4 py-2 font-mono text-sm border-b border-border transition-colors",
        "hover:bg-secondary/50",
        isSelected && "bg-primary/5 border-l-4 border-l-primary"
      )}
    >
      <span className="text-muted-foreground text-xs shrink-0 w-6 text-right">
        {log.lineNumber}
      </span>
      <span className="text-muted-foreground text-xs shrink-0">{timestamp}</span>
      <Badge className={cn("text-xs px-1.5 py-0 shrink-0", levelStyle.activeColor)}>
        {log.level}
      </Badge>
      <span className="text-primary text-xs shrink-0">[{log.service}]</span>
      <span className="text-foreground flex-1 break-all text-xs">{log.message}</span>
    </button>
  );
}

export function LiveStreamContent() {
  const {
    parsedLogs,
    filter,
    updateFilter,
    toggleLevel,
    selectedLogId,
    selectLog,
    isLiveTailEnabled,
    setLiveTail,
    getFilteredLogs,
  } = useLogStore();

  const [isPaused, setIsPaused] = useState(false);
  const [localSearch, setLocalSearch] = useState(filter.search);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      updateFilter({ search: localSearch });
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localSearch, updateFilter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "/":
          e.preventDefault();
          document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus();
          break;
        case "e":
          updateFilter({ levels: ["ERROR"] });
          toast.info("Showing errors only");
          break;
        case "w":
          updateFilter({ levels: ["WARN"] });
          toast.info("Showing warnings only");
          break;
        case "a":
          updateFilter({ levels: ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"] });
          toast.info("Showing all logs");
          break;
        case "Escape":
          selectLog(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [updateFilter, selectLog]);

  const filteredLogs = getFilteredLogs();

  const handleExport = useCallback(
    (format: "txt" | "json" | "csv" | "clipboard") => {
      if (filteredLogs.length === 0) {
        toast.error("No logs to export");
        return;
      }

      let content = "";
      let filename = `logs-export-${Date.now()}`;

      switch (format) {
        case "txt":
          content = filteredLogs.map((l) => l.rawLine).join("\n");
          filename += ".txt";
          break;
        case "json":
          content = JSON.stringify(
            filteredLogs.map((l) => ({
              timestamp: l.timestamp.toISOString(),
              level: l.level,
              service: l.service,
              message: l.message,
              requestId: l.requestId,
              metadata: l.metadata,
            })),
            null,
            2
          );
          filename += ".json";
          break;
        case "csv":
          const headers = "Timestamp,Level,Service,Message,Request ID\n";
          const rows = filteredLogs
            .map(
              (l) =>
                `"${l.timestamp.toISOString()}","${l.level}","${l.service}","${l.message.replace(/"/g, '""')}","${l.requestId || ""}"`
            )
            .join("\n");
          content = headers + rows;
          filename += ".csv";
          break;
        case "clipboard":
          content = filteredLogs.map((l) => l.rawLine).join("\n");
          navigator.clipboard.writeText(content);
          toast.success(`Copied ${filteredLogs.length} logs to clipboard`);
          return;
      }

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${filteredLogs.length} logs as ${format.toUpperCase()}`);
    },
    [filteredLogs]
  );

  // Show empty state if no logs
  if (parsedLogs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Control Bar */}
      <div className="p-4 border-b border-border space-y-3">
        {/* Search and Actions Row */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs... (press / to focus)"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  updateFilter({ search: "" });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="regex"
              checked={filter.useRegex}
              onCheckedChange={(checked) => updateFilter({ useRegex: checked })}
            />
            <Label htmlFor="regex" className="text-sm text-muted-foreground">
              Regex
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="case"
              checked={filter.caseSensitive}
              onCheckedChange={(checked) =>
                updateFilter({ caseSensitive: checked })
              }
            />
            <Label htmlFor="case" className="text-sm text-muted-foreground">
              Case
            </Label>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="gap-2"
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
              {isPaused ? "Resume" : "Pause"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("txt")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download as .txt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  <FileJson className="w-4 h-4 mr-2" />
                  Download as .json
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download as .csv
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("clipboard")}>
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy to clipboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">Level:</span>
          {(Object.keys(levelConfig) as LogLevel[]).map((level) => {
            const config = levelConfig[level];
            const isActive = filter.levels.includes(level);
            return (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium transition-colors",
                  isActive
                    ? config.activeColor
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {config.label}
              </button>
            );
          })}
          <span className="ml-auto text-xs text-muted-foreground">
            Showing {filteredLogs.length} of {parsedLogs.length} logs
          </span>
        </div>
      </div>

      {/* Live Indicator */}
      {isLiveTailEnabled && !isPaused && (
        <div className="px-4 py-2 bg-success/10 border-b border-success/20 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-xs text-success font-medium">
            Live streaming enabled
          </span>
        </div>
      )}

      {/* Log Viewer */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-card">
        {filteredLogs.map((log) => (
          <LogRow
            key={log.id}
            log={log}
            isSelected={selectedLogId === log.id}
            onSelect={() => selectLog(log.id)}
          />
        ))}

        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Filter className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm">No logs match your filters</p>
            <Button
              variant="link"
              onClick={() =>
                updateFilter({
                  search: "",
                  levels: ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"],
                })
              }
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground bg-muted/30">
        <span>
          Keyboard: / search, e errors, w warnings, a all, Esc clear
        </span>
        <span>Double-click to copy</span>
      </div>
    </div>
  );
}
