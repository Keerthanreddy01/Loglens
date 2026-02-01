"use client";

import { X, Copy, ExternalLink, Clock, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLogStore } from "@/lib/store";
import { getRelatedLogs } from "@/lib/log-parser";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function MetadataRow({
  label,
  value,
  highlight,
  copyable,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  copyable?: boolean;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied ${label} to clipboard`);
  };

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-muted-foreground font-mono">{label}:</span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-sm font-mono",
            highlight ? "text-primary" : "text-foreground"
          )}
        >
          {value}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function RightPanel() {
  const { selectedLogId, parsedLogs, isDetailsPanelOpen, toggleDetailsPanel, selectLog } =
    useLogStore();

  const selectedLog = parsedLogs.find((log) => log.id === selectedLogId);
  const relatedLogs = selectedLog?.requestId
    ? getRelatedLogs(parsedLogs, selectedLog.requestId).filter(
        (l) => l.id !== selectedLogId
      )
    : [];

  if (!isDetailsPanelOpen || !selectedLog) {
    return null;
  }

  const levelColors: Record<string, string> = {
    ERROR: "bg-destructive text-white",
    WARN: "bg-warning text-black",
    INFO: "bg-primary text-white",
    DEBUG: "bg-muted-foreground text-white",
    TRACE: "bg-muted text-foreground",
  };

  const handleCopyLog = () => {
    navigator.clipboard.writeText(selectedLog.rawLine);
    toast.success("Log copied to clipboard");
  };

  const handleInspectJSON = () => {
    const ts = selectedLog.timestamp instanceof Date ? selectedLog.timestamp : new Date(selectedLog.timestamp);
    const json = JSON.stringify(
      {
        timestamp: ts.toISOString(),
        level: selectedLog.level,
        service: selectedLog.service,
        message: selectedLog.message,
        requestId: selectedLog.requestId,
        metadata: selectedLog.metadata,
        rawLine: selectedLog.rawLine,
      },
      null,
      2
    );
    navigator.clipboard.writeText(json);
    toast.success("Full JSON copied to clipboard");
  };

  return (
    <aside className="w-[320px] border-l border-border bg-card flex flex-col overflow-hidden shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Log Context
          </h2>
          <p className="text-xs text-muted-foreground">
            Detailed properties for selected entry
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleDetailsPanel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto log-viewer-scroll p-4 space-y-6">
        {/* Overview */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <Badge className={cn("px-2 py-1", levelColors[selectedLog.level])}>
              {selectedLog.level}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              [{selectedLog.service}]
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {(selectedLog.timestamp instanceof Date ? selectedLog.timestamp : new Date(selectedLog.timestamp)).toLocaleString()}
          </p>
        </section>

        {/* Metadata */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Metadata
          </h3>
          <div className="bg-secondary rounded-lg p-3 divide-y divide-border">
            {selectedLog.requestId && (
              <MetadataRow
                label="Request ID"
                value={selectedLog.requestId}
                copyable
              />
            )}
            <MetadataRow label="Service" value={selectedLog.service} highlight />
            {selectedLog.metadata?.ip && (
              <MetadataRow label="IP Address" value={selectedLog.metadata.ip} />
            )}
            {selectedLog.metadata?.statusCode && (
              <MetadataRow
                label="Status"
                value={selectedLog.metadata.statusCode}
              />
            )}
            {selectedLog.metadata?.duration && (
              <MetadataRow
                label="Duration"
                value={selectedLog.metadata.duration}
              />
            )}
            {selectedLog.metadata?.url && (
              <MetadataRow label="URL" value={selectedLog.metadata.url} copyable />
            )}
            <MetadataRow label="Environment" value="production" />
          </div>
        </section>

        {/* Message */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Message
          </h3>
          <div className="bg-secondary rounded-lg p-3">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-all leading-relaxed">
              {selectedLog.message}
            </pre>
          </div>
        </section>

        {/* Related Logs */}
        {relatedLogs.length > 0 && (
          <section>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Link2 className="w-3 h-3" />
              Related Logs ({relatedLogs.length})
            </h3>
            <div className="space-y-2">
              {relatedLogs.slice(0, 5).map((log) => (
                <button
                  key={log.id}
                  onClick={() => selectLog(log.id)}
                  className="w-full text-left bg-secondary rounded-lg p-2 hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={cn(
                        "text-[10px] px-1 py-0",
                        levelColors[log.level]
                      )}
                    >
                      {log.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {(log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp)).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-foreground truncate">
                    {log.message}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopyLog}>
              <Copy className="w-3 h-3 mr-1" />
              Copy Log
            </Button>
          </div>
        </section>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-border">
        <Button
          className="w-full bg-secondary hover:bg-secondary/80 text-foreground gap-2"
          onClick={handleInspectJSON}
        >
          <ExternalLink className="w-4 h-4" />
          Inspect Full JSON
        </Button>
      </div>
    </aside>
  );
}
