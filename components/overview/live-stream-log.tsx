"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogStore } from "@/lib/store";
import { highlightLogMessage } from "@/lib/log-parser";
import type { ParsedLog, LogLevel } from "@/lib/types";
import {
  Search,
  X,
  Download,
  ChevronDown,
  Copy,
  FileJson,
  FileText,
  Clipboard,
  ArrowDown,
  ArrowUp,
  SearchX,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const levelStyles: Record<LogLevel, { badge: string; bg: string }> = {
  ERROR: { badge: "bg-destructive text-white hover:bg-destructive", bg: "bg-destructive/5" },
  WARN: { badge: "bg-warning text-black hover:bg-warning", bg: "bg-warning/5" },
  INFO: { badge: "bg-primary text-white hover:bg-primary", bg: "" },
  DEBUG: { badge: "bg-muted-foreground text-white hover:bg-muted-foreground", bg: "" },
  TRACE: { badge: "bg-muted text-foreground hover:bg-muted", bg: "" },
};

interface LogEntryProps {
  log: ParsedLog;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: "compact" | "comfortable";
}

const LogEntry = memo(function LogEntry({ log, isSelected, onSelect, viewMode }: LogEntryProps) {
  const styles = levelStyles[log.level];
  const dateObj = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
  const timestamp = dateObj.toLocaleTimeString("en-US", {
    hour12: false,
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  const highlightedMessage = highlightLogMessage(log.message);

  const handleDoubleClick = () => {
    navigator.clipboard.writeText(log.rawLine);
    toast.success("Log copied to clipboard");
  };

  return (
    <button
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "w-full text-left border-b border-border transition-colors",
        viewMode === "compact" ? "px-4 py-1.5 min-h-[32px]" : "px-4 py-3 min-h-[48px]",
        "hover:bg-secondary/50",
        isSelected && "bg-secondary border-l-4 border-l-primary",
        styles.bg
      )}
      style={{ contain: "layout style paint" }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
          {timestamp}
        </span>
        <span className="text-xs font-mono text-primary whitespace-nowrap">
          [{log.service}]
        </span>
        <Badge className={cn("text-[10px] font-semibold px-1.5 py-0 h-5 shrink-0", styles.badge)}>
          {log.level}
        </Badge>
        <span className="text-sm text-foreground flex-1 break-all font-mono">
          {highlightedMessage.map((part, i) => (
            <span
              key={i}
              className={cn(
                part.type === "ip" && "text-primary",
                part.type === "url" && "text-purple-400",
                part.type === "uuid" && "text-cyan-400",
                part.type === "status" && "text-destructive font-semibold"
              )}
            >
              {part.text}
            </span>
          ))}
        </span>
      </div>
    </button>
  );
});

interface LiveStreamLogProps {
  logs: ParsedLog[];
}

export function LiveStreamLog({ logs }: LiveStreamLogProps) {
  const {
    selectedLogId,
    selectLog,
    isLiveTailEnabled,
    viewMode,
    setViewMode,
    filter,
    updateFilter,
    setLevelFilter,
    smartFilters,
    toggleSmartFilter,
  } = useLogStore();

  const [localSearch, setLocalSearch] = useState(filter.search);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle "/" key to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      
      if (e.key === "/" && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // e for errors
      if (e.key === "e" && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setLevelFilter(['ERROR']);
      }
      
      // w for warnings
      if (e.key === "w" && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setLevelFilter(['WARN']);
      }
      
      // a for all
      if (e.key === "a" && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setLevelFilter(['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE']);
      }
      
      // Escape to clear
      if (e.key === "Escape") {
        setLocalSearch("");
        updateFilter({ search: "" });
        searchInputRef.current?.blur();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setLevelFilter, updateFilter]);

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

  // Track scroll position for buttons visibility
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const threshold = 100;
    
    setIsAtTop(scrollTop < threshold);
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < threshold);
    setShowScrollButtons(logs.length > 20);
  }, [logs.length]);

  // Auto-scroll when live tail is enabled
  useEffect(() => {
    if (isLiveTailEnabled && scrollContainerRef.current && isAtBottom) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs.length, isLiveTailEnabled, isAtBottom]);

  // Initial scroll position check
  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const handleExport = useCallback(
    (format: "txt" | "json" | "csv" | "clipboard") => {
      if (logs.length === 0) {
        toast.error("No logs to export");
        return;
      }

      let content = "";
      let filename = `logs-export-${Date.now()}`;

      switch (format) {
        case "txt":
          content = logs.map((l) => l.rawLine).join("\n");
          filename += ".txt";
          break;
        case "json":
          content = JSON.stringify(
            logs.map((l) => {
              const ts = l.timestamp instanceof Date ? l.timestamp : new Date(l.timestamp);
              return {
                timestamp: ts.toISOString(),
                level: l.level,
                service: l.service,
                message: l.message,
                requestId: l.requestId,
                metadata: l.metadata,
              };
            }),
            null,
            2
          );
          filename += ".json";
          break;
        case "csv":
          const headers = "Timestamp,Level,Service,Message,Request ID\n";
          const rows = logs
            .map((l) => {
              const ts = l.timestamp instanceof Date ? l.timestamp : new Date(l.timestamp);
              return `"${ts.toISOString()}","${l.level}","${l.service}","${l.message.replace(/"/g, '""')}","${l.requestId || ""}"`;
            })
            .join("\n");
          content = headers + rows;
          filename += ".csv";
          break;
        case "clipboard":
          content = logs.map((l) => l.rawLine).join("\n");
          navigator.clipboard.writeText(content);
          toast.success(`Copied ${logs.length} logs to clipboard`);
          return;
      }

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${logs.length} logs as ${format.toUpperCase()}`);
    },
    [logs]
  );

  const clearAllFilters = useCallback(() => {
    setLocalSearch("");
    updateFilter({ search: "" });
    setLevelFilter(['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE']);
    // Clear smart filters
    if (smartFilters.criticalOnly) toggleSmartFilter("criticalOnly");
    if (smartFilters.performanceIssues) toggleSmartFilter("performanceIssues");
    if (smartFilters.securityEvents) toggleSmartFilter("securityEvents");
    if (smartFilters.userActions) toggleSmartFilter("userActions");
  }, [setLevelFilter, updateFilter, smartFilters, toggleSmartFilter]);

  const levels: LogLevel[] = ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"];

  return (
    <div className="flex flex-col h-full relative">
      {/* Control Bar - Sticky */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap sticky top-0 z-10 bg-background shrink-0">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search logs... (press / to focus)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 h-8 text-sm bg-secondary border-border"
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

        {/* Level Filters */}
        <div className="flex items-center gap-1">
          <Button
            variant={filter.levels.length === 5 ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setLevelFilter(["ERROR", "WARN", "INFO", "DEBUG", "TRACE"])}
          >
            ALL
          </Button>
          {levels.map((level) => (
            <Button
              key={level}
              variant={
                filter.levels.length === 1 && filter.levels[0] === level
                  ? "secondary"
                  : "ghost"
              }
              size="sm"
              className={cn("h-7 text-xs", {
                "text-destructive": level === "ERROR",
                "text-warning": level === "WARN",
                "text-primary": level === "INFO",
              })}
              onClick={() => setLevelFilter([level])}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 bg-transparent">
              <Download className="w-3 h-3" />
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

      {/* Header - Sticky */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 sticky top-[57px] z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Live Stream</span>
          {isLiveTailEnabled && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs text-success font-medium">LIVE</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "compact" ? "secondary" : "ghost"}
            size="sm"
            className="text-xs h-6"
            onClick={() => setViewMode("compact")}
          >
            Compact
          </Button>
          <Button
            variant={viewMode === "comfortable" ? "secondary" : "ghost"}
            size="sm"
            className="text-xs h-6"
            onClick={() => setViewMode("comfortable")}
          >
            Comfortable
          </Button>
        </div>
      </div>

      {/* Log Entries - Scrollable */}
      <div 
        ref={scrollContainerRef} 
        className="flex-1 overflow-y-auto log-viewer-scroll min-h-0"
        onScroll={handleScroll}
        style={{ scrollBehavior: "smooth" }}
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
            <SearchX className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No logs match your filters</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Try adjusting your search query, level filters, or smart filters to see more results.
            </p>
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
              className="gap-2 bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
              Clear All Filters
            </Button>
          </div>
        ) : (
          logs.map((log) => (
            <LogEntry
              key={log.id}
              log={log}
              isSelected={selectedLogId === log.id}
              onSelect={() => selectLog(log.id)}
              viewMode={viewMode}
            />
          ))
        )}
      </div>

      {/* Floating Scroll Buttons */}
      {showScrollButtons && logs.length > 0 && (
        <div className="absolute bottom-16 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={scrollToTop}
            className={cn(
              "p-2 rounded-lg border transition-all duration-200",
              "bg-card border-border hover:bg-primary hover:border-primary hover:text-white",
              isAtTop ? "opacity-30 pointer-events-none" : "opacity-100"
            )}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={scrollToBottom}
            className={cn(
              "p-2 rounded-lg border transition-all duration-200",
              "bg-card border-border hover:bg-primary hover:border-primary hover:text-white",
              isAtBottom ? "opacity-30 pointer-events-none" : "opacity-100"
            )}
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground bg-muted/30 shrink-0">
        <span>Showing {logs.length} logs</span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-secondary rounded">/</kbd> search
            <span className="mx-2">|</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-secondary rounded">e</kbd> errors
            <span className="mx-2">|</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-secondary rounded">a</kbd> all
            <span className="mx-2">|</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-secondary rounded">Esc</kbd> clear
          </span>
          <span>Double-click to copy</span>
        </div>
      </div>
    </div>
  );
}
