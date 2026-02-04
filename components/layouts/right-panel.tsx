"use client";

import { X, Copy, ExternalLink, Clock, Link2, ChevronLeft, ChevronRight, Bookmark, BookmarkPlus, Sparkles, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLogStore } from "@/store/useLogsStore";
import { getRelatedLogs } from "@/lib/log-parser";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

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
    toast.success(`Copied ${label}`);
  };

  return (
    <div className="flex justify-between items-center py-2.5 gap-2 group">
      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "text-xs font-mono truncate transition-colors",
            highlight ? "text-primary font-bold" : "text-zinc-300"
          )}
          title={value}
        >
          {value}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="text-zinc-600 hover:text-white shrink-0 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function RightPanel() {
  const { selectedLogId, parsedLogs, isDetailsPanelOpen, toggleDetailsPanel, selectLog, addSavedQuery, filter } =
    useLogStore();

  const selectedLog = parsedLogs.find((log) => log.id === selectedLogId);
  const selectedIndex = selectedLog ? parsedLogs.findIndex(l => l.id === selectedLogId) : -1;
  const relatedLogs = selectedLog?.requestId
    ? getRelatedLogs(parsedLogs, selectedLog.requestId).filter(
      (l) => l.id !== selectedLogId
    )
    : [];

  // Navigation handlers
  const goToPrevious = () => {
    if (selectedIndex > 0) {
      selectLog(parsedLogs[selectedIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (selectedIndex < parsedLogs.length - 1) {
      selectLog(parsedLogs[selectedIndex + 1].id);
    }
  };

  if (!isDetailsPanelOpen) {
    return (
      <button
        onClick={toggleDetailsPanel}
        className="w-12 border-l border-white/[0.04] bg-[#0A0A0F]/60 backdrop-blur-xl flex flex-col items-center py-8 gap-6 hover:bg-white/[0.02] transition-all shrink-0 relative z-20 group"
        aria-label="Show details panel"
      >
        <ChevronLeft className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
        <div className="[writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 group-hover:text-zinc-400 rotate-180">
          Context Inspector
        </div>
      </button>
    );
  }

  if (!selectedLog) {
    return (
      <aside className="w-[380px] border-l border-white/[0.05] bg-transparent flex flex-col shrink-0 relative z-20">
        <div className="noise-overlay opacity-[0.02]" />
        <div className="p-6 flex items-center justify-between border-b border-white/[0.05]">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            Context Inspector
          </h2>
          <Button variant="ghost" size="icon" onClick={toggleDetailsPanel} className="h-8 w-8 text-zinc-500 hover:text-white rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
            <Sparkles className="w-8 h-8 text-zinc-700 relative z-10" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">No entry selected</h3>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-[200px] mx-auto">
            Select an event from the stream to analyze its full lifecycle and metadata.
          </p>
          <div className="mt-12 flex flex-col gap-3">
            <div className="px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.04] text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Shortcuts: <span className="text-zinc-400 font-mono">J / K</span> to Navigate
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const levelColors: Record<string, string> = {
    ERROR: "bg-destructive/10 text-destructive border-destructive/20",
    WARN: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    INFO: "bg-primary/10 text-primary border-primary/20",
    DEBUG: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    TRACE: "bg-zinc-800/10 text-zinc-500 border-zinc-800/20",
  };

  const handleCopyLog = () => {
    navigator.clipboard.writeText(selectedLog.rawLine);
    toast.success("Raw entry copied");
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
    toast.success("Full JSON payload copied");
  };

  const handleSaveAsQuery = () => {
    const queryName = `${selectedLog.service} - ${selectedLog.level}`;
    addSavedQuery({
      id: Date.now().toString(),
      name: queryName,
      filter: {
        ...filter,
        search: selectedLog.service,
        levels: [selectedLog.level],
      },
      icon: 'star',
    });
    toast.success(`Perspective saved: ${queryName}`);
  };

  return (
    <aside className="w-[380px] border-l border-white/[0.05] bg-transparent flex flex-col overflow-hidden shrink-0 relative z-20">
      <div className="noise-overlay opacity-[0.02]" />

      {/* Header */}
      <div className="p-6 border-b border-white/[0.05] shrink-0 bg-[#0A0A0F]/20 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary ai-indicator-pulse" />
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
              Inspector
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] rounded-full p-1 border border-white/[0.05]">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
              onClick={goToPrevious}
              disabled={selectedIndex <= 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-[11px] font-bold text-zinc-400 tabular-nums px-2">
              {selectedIndex + 1}<span className="text-zinc-600 mx-1">/</span>{parsedLogs.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
              onClick={goToNext}
              disabled={selectedIndex >= parsedLogs.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all" onClick={toggleDetailsPanel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={cn("px-3 py-1 text-[10px] font-bold tracking-widest border", levelColors[selectedLog.level])}>
            {selectedLog.level}
          </Badge>
          <span className="text-xs font-bold text-white tracking-tight">
            {selectedLog.service}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLogId}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-8"
          >
            {/* Timestamp Section */}
            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-4 transition-colors group">
                <Clock className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Temporal Signature</span>
              </div>
              <p className="text-base font-medium text-white font-mono bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
                {(selectedLog.timestamp instanceof Date ? selectedLog.timestamp : new Date(selectedLog.timestamp)).toLocaleString()}
              </p>
            </div>

            {/* Message Block */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Entry Data</span>
                </div>
                <button onClick={() => navigator.clipboard.writeText(selectedLog.message)} className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest transition-colors">Copy</button>
              </div>
              <div className="dashboard-card p-5 border-white/[0.05] bg-black/40">
                <pre className="text-[13px] font-mono text-zinc-300 whitespace-pre-wrap break-all leading-relaxed selection:bg-primary/30">
                  {selectedLog.message}
                </pre>
              </div>
            </div>

            {/* Attribute Stack */}
            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-4">
                <Database className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-widest">System Metadata</span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 divide-y divide-white/[0.04]">
                {selectedLog.requestId && (
                  <MetadataRow label="Trace ID" value={selectedLog.requestId} copyable />
                )}
                <MetadataRow label="Origin" value={selectedLog.service} highlight />
                {selectedLog.metadata?.ip && (
                  <MetadataRow label="Client IP" value={selectedLog.metadata.ip} copyable />
                )}
                {selectedLog.metadata?.statusCode && (
                  <MetadataRow label="Status" value={selectedLog.metadata.statusCode} />
                )}
                {selectedLog.metadata?.duration && (
                  <MetadataRow label="Runtime" value={selectedLog.metadata.duration} />
                )}
                {selectedLog.metadata?.url && (
                  <MetadataRow label="Endpoint" value={selectedLog.metadata.url} copyable />
                )}
              </div>
            </div>

            {/* Related Events */}
            {relatedLogs.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-2 text-zinc-500 mb-4">
                  <Link2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Related Stream ({relatedLogs.length})</span>
                </div>
                <div className="space-y-3">
                  {relatedLogs.slice(0, 4).map((log) => (
                    <button
                      key={log.id}
                      onClick={() => selectLog(log.id)}
                      className="dashboard-card w-full text-left p-4 p-4 border-white/[0.03] hover:border-primary/30 bg-white/[0.01] hover:bg-white/[0.03] group transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={cn("text-[8px] h-4 font-bold tracking-widest border-0 opacity-80", levelColors[log.level])}>
                          {log.level}
                        </Badge>
                        <span className="text-[10px] text-zinc-600 font-bold font-mono">
                          {(log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp)).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors truncate">
                        {log.message}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistence Controls */}
      <div className="p-6 border-t border-white/[0.05] shrink-0 bg-[#0A0A0F]/20 backdrop-blur-md space-y-3">
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={handleSaveAsQuery} className="flex-1 h-10 rounded-xl bg-white/[0.03] hover:bg-white/5 border border-white/[0.05] text-[11px] font-bold uppercase tracking-widest">
            <BookmarkPlus className="w-3.5 h-3.5 mr-2 text-zinc-500" />
            Save Pivot
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopyLog} className="flex-1 h-10 rounded-xl bg-white/[0.03] hover:bg-white/5 border border-white/[0.05] text-[11px] font-bold uppercase tracking-widest">
            <Copy className="w-3.5 h-3.5 mr-2 text-zinc-500" />
            Raw Log
          </Button>
        </div>
        <Button
          className="w-full h-12 gap-2 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold uppercase tracking-[0.15em] text-[11px] shadow-2xl transition-all active:scale-[0.98]"
          onClick={handleInspectJSON}
        >
          <ExternalLink className="w-4 h-4" />
          Export JSON Schema
        </Button>
      </div>
    </aside>
  );
}
