"use client";

import React, { useCallback, useRef, useEffect, memo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/badge";
import { toast } from "sonner";
import type { ParsedLog, LogLevel } from "@/lib/types";
import { highlightLogMessage } from "@/lib/log-parser";

const levelStyles: Record<LogLevel, { badge: string; bg: string; text: string; border: string }> = {
    ERROR: {
        badge: "bg-destructive text-white",
        bg: "bg-destructive/5 hover:bg-destructive/10",
        text: "text-destructive",
        border: "border-l-destructive"
    },
    WARN: {
        badge: "bg-warning text-black",
        bg: "bg-warning/5 hover:bg-warning/10",
        text: "text-warning",
        border: "border-l-warning"
    },
    INFO: {
        badge: "bg-primary text-white",
        bg: "hover:bg-primary/5",
        text: "text-primary",
        border: "border-l-primary"
    },
    DEBUG: {
        badge: "bg-muted-foreground text-white",
        bg: "hover:bg-muted/30",
        text: "text-muted-foreground",
        border: "border-l-muted-foreground"
    },
    TRACE: {
        badge: "bg-muted text-foreground",
        bg: "hover:bg-muted/20",
        text: "text-muted-foreground",
        border: "border-l-muted"
    },
};

interface LogEntryProps {
    log: ParsedLog;
    isSelected: boolean;
    onSelect: () => void;
    viewMode: "compact" | "comfortable";
    index: number;
}

const LogEntry = memo(function LogEntry({ log, isSelected, onSelect, viewMode, index }: LogEntryProps) {
    const styles = levelStyles[log.level];
    const dateObj = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
    const timestamp = dateObj.toLocaleTimeString("en-US", {
        hour12: false,
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const highlightedMessage = highlightLogMessage(log.message);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(log.rawLine);
        toast.success("Log copied to clipboard");
    }, [log.rawLine]);

    return (
        <div
            onClick={onSelect}
            onDoubleClick={handleDoubleClick}
            className={cn(
                "w-full text-left border-l-[3px] transition-all duration-75 outline-none cursor-pointer",
                viewMode === "compact" ? "px-3 py-1" : "px-4 py-2",
                isSelected
                    ? "bg-primary/10 border-l-primary"
                    : cn(styles.bg, styles.border, "border-l-transparent hover:border-l-current")
            )}
        >
            <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap tabular-nums shrink-0">
                    {timestamp}
                </span>
                <span className="text-[11px] font-mono text-primary whitespace-nowrap shrink-0 hidden sm:inline">
                    [{log.service}]
                </span>
                <Badge
                    className={cn(
                        "text-[10px] font-semibold px-1.5 py-0 h-[18px] shrink-0 rounded",
                        styles.badge
                    )}
                >
                    {log.level}
                </Badge>
                <span className="text-[12px] sm:text-[13px] text-foreground flex-1 break-words font-mono leading-relaxed min-w-0">
                    {highlightedMessage.map((part, i) => (
                        <span
                            key={i}
                            className={cn(
                                part.type === "ip" && "text-cyan-400",
                                part.type === "url" && "text-purple-400 underline underline-offset-2",
                                part.type === "uuid" && "text-emerald-400",
                                part.type === "status" && "text-destructive font-semibold"
                            )}
                        >
                            {part.text}
                        </span>
                    ))}
                </span>
            </div>
        </div>
    );
});

interface VirtualizedLogStreamProps {
    logs: ParsedLog[];
    selectedLogId: string | null;
    selectLog: (id: string | null) => void;
    viewMode: "compact" | "comfortable";
    isLiveTailEnabled: boolean;
}

export function VirtualizedLogStream({
    logs,
    selectedLogId,
    selectLog,
    viewMode,
    isLiveTailEnabled,
}: VirtualizedLogStreamProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: logs.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => (viewMode === "compact" ? 32 : 48),
        overscan: 10,
    });

    // Auto-scroll logic
    useEffect(() => {
        if (isLiveTailEnabled && logs.length > 0) {
            rowVirtualizer.scrollToIndex(logs.length - 1, { align: "end", behavior: "auto" });
        }
    }, [logs.length, isLiveTailEnabled, rowVirtualizer]);

    return (
        <div
            ref={parentRef}
            className="flex-1 overflow-auto custom-scrollbar bg-background border-t border-border/50"
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                        key={virtualRow.key}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        <LogEntry
                            log={logs[virtualRow.index]}
                            isSelected={selectedLogId === logs[virtualRow.index].id}
                            onSelect={() => selectLog(logs[virtualRow.index].id)}
                            viewMode={viewMode}
                            index={virtualRow.index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
