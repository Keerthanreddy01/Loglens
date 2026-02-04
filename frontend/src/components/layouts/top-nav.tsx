"use client";

import React from "react"
import { useRef, useState, useEffect } from "react";
import { Search, Bell, Settings, ChevronRight, Upload, Trash2, Keyboard, FileUp, ClipboardPaste, Database, Save, FileDown, Share2, GitCompare, LogOut, User as UserIcon, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/ui/dialog";
import { Textarea } from "@/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover";
import { useLogStore } from "@/lib/store";
import { DashboardSettings } from "@/components/shared/dashboard-settings";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@workos-inc/node";

export function TopNav({ user }: { user?: User }) {
  const { loadLogs, loadSampleLogs, clearLogs, updateFilter, parsedLogs, stats, saveSession, savedSessions, loadSession, deleteSession, getFilteredLogs, loadLogsForComparison, comparisonLogs, clearComparison } = useLogStore();
  const router = useRouter();

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSaveSessionOpen, setIsSaveSessionOpen] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compareFileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "o" && !isInput) {
        e.preventDefault();
        fileInputRef.current?.click();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "v" && !isInput) {
        e.preventDefault();
        setIsPasteModalOpen(true);
      }

      if (e.key === "?" && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        loadLogs(content);
        toast.success(`Loaded ${content.split("\n").filter(l => l.trim()).length} log lines from ${file.name}`);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleCompareFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        loadLogsForComparison(content);
        toast.success(`Loaded ${content.split("\n").filter(l => l.trim()).length} lines for comparison`);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handlePaste = () => {
    if (pasteContent.trim()) {
      loadLogs(pasteContent);
      const lineCount = pasteContent.split("\n").filter((l) => l.trim()).length;
      toast.success(`Loaded ${lineCount} log lines`);
      setIsPasteModalOpen(false);
      setPasteContent("");
    }
  };

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateFilter({ search: globalSearch });
      toast.info(`Searching for: ${globalSearch}`);
    }
    if (e.key === "Escape") {
      setGlobalSearch("");
      searchInputRef.current?.blur();
    }
  };

  const handleLoadSample = () => {
    loadSampleLogs();
    toast.success("Sample logs loaded");
  };

  const handleClearLogs = () => {
    clearLogs();
    toast.success("All logs cleared");
  };

  const handleSaveSession = () => {
    if (sessionName.trim()) {
      saveSession(sessionName.trim());
      setSessionName("");
      setIsSaveSessionOpen(false);
      toast.success("Session saved");
    } else {
      toast.error("Please enter a session name");
    }
  };

  const handleExportReport = () => {
    if (parsedLogs.length === 0) {
      toast.error("No logs to export");
      return;
    }
    const filtered = getFilteredLogs();
    const report = {
      exportedAt: new Date().toISOString(),
      totalLogs: parsedLogs.length,
      filteredCount: filtered.length,
      stats,
      summary: {
        errors: stats.errorCount,
        warnings: stats.warnCount,
        errorRate: stats.errorRate,
      },
      logs: filtered.slice(0, 1000).map((l) => ({
        timestamp: (l.timestamp instanceof Date ? l.timestamp : new Date(l.timestamp)).toISOString(),
        level: l.level,
        service: l.service,
        message: l.message,
      })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loglens-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported");
  };

  const handleShareReport = () => {
    if (parsedLogs.length === 0) {
      toast.error("No logs to share");
      return;
    }
    const params = new URLSearchParams();
    params.set("logs", parsedLogs.length.toString());
    params.set("errors", stats.errorCount.toString());
    params.set("ts", Date.now().toString());
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    toast.success("Shareable link copied to clipboard");
  };

  const handleSignOut = () => {
    toast.success("Logging out...");
    window.location.href = "/api/auth/logout";
  };

  const userInitial = user?.email?.[0].toUpperCase() ?? "U";

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-7xl h-14 bg-[#0A0A0F]/60 backdrop-blur-2xl border border-white/[0.08] rounded-full flex items-center justify-between px-6 shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity interactive-element group">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <span className="text-black font-extrabold text-sm tracking-tighter">LL</span>
          </div>
          <span className="font-bold text-white tracking-tight hidden sm:inline text-base">LogLens</span>
        </Link>

        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
          <div className="h-2 w-2 rounded-full bg-success ai-indicator-pulse" />
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">System Ready</span>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none group-focus-within:text-white transition-colors" />
          <Input
            ref={searchInputRef}
            placeholder="Search logs, events, or errors..."
            className="pl-11 pr-24 bg-white/5 border-transparent text-sm h-10 rounded-full focus:bg-white/10 focus:border-white/10 transition-all text-zinc-200 placeholder:text-zinc-600"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleGlobalSearch}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40 group-focus-within:opacity-100 transition-opacity">
            <kbd className="px-1.5 py-0.5 text-[9px] bg-white/5 rounded border border-white/10 text-white font-mono">
              {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"}
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[9px] bg-white/5 rounded border border-white/10 text-white font-mono">
              K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full h-10 w-10 transition-all interactive-element"
          onClick={() => setIsShortcutsOpen(true)}
        >
          <Keyboard className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full h-10 w-10 transition-all relative interactive-element">
              <Bell className="w-4 h-4" />
              {stats.errorRate > 5 && (
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-destructive rounded-full ai-indicator-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[340px] mt-4 bg-[#0A0A0F]/90 backdrop-blur-2xl border-white/10 rounded-3xl p-5 shadow-3xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Insights</h3>
                {stats.errorRate > 5 && <span className="px-2 py-1 rounded text-[10px] bg-destructive/10 text-destructive font-bold">CRITICAL</span>}
              </div>
              {stats.errorRate > 5 ? (
                <div className="dashboard-card p-4 border-destructive/20 bg-destructive/5 group cursor-pointer hover:bg-destructive/10">
                  <p className="text-sm font-bold text-white mb-1">High Error Rate Spike</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    System error rate is {stats.errorRate.toFixed(1)}%. Monitoring service reports increased timeout events.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] bg-destructive/20 text-white hover:bg-destructive/30 rounded-full px-4">View Trace</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-zinc-500 hover:text-white rounded-full">Dismiss</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-sm font-semibold text-white">Status Normal</p>
                  <p className="text-xs text-zinc-500 mt-1">Found 0 critical issues in last 30 minutes.</p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Global Action Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full h-10 w-10 transition-all interactive-element">
              <Upload className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 mt-4 bg-[#0A0A0F]/90 backdrop-blur-2xl border-white/10 rounded-2xl p-2 shadow-3xl">
            <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Operations</div>
            <DropdownMenuItem onClick={() => setIsPasteModalOpen(true)} className="gap-3 py-2.5 rounded-xl group">
              <ClipboardPaste className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Paste Logs</span>
                <span className="text-[10px] text-zinc-500">Import raw string data</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-3 py-2.5 rounded-xl group">
              <FileUp className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Upload File</span>
                <span className="text-[10px] text-zinc-500">Load .log or .json</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5 my-2 mx-2" />
            <DropdownMenuItem onClick={handleLoadSample} className="gap-3 py-2.5 rounded-xl group">
              <Database className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Demo Dataset</span>
                <span className="text-[10px] text-zinc-500">Explore platform features</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-white/10 mx-2" />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full group p-0 overflow-hidden border border-white/10 hover:border-white/20 transition-all shadow-lg active:scale-95">
              <Avatar className="h-full w-full bg-gradient-to-br from-indigo-500 to-primary">
                <AvatarFallback className="bg-transparent text-white text-xs font-bold tracking-tighter">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mt-4 bg-[#0A0A0F]/90 backdrop-blur-2xl border-white/10 rounded-2xl p-2 shadow-3xl" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-3">
              <p className="text-sm font-bold text-white leading-none tracking-tight">{user?.email?.split('@')[0]}</p>
              <p className="text-[11px] font-medium text-zinc-500 leading-none mt-1 uppercase tracking-wider">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-white/5 my-1 mx-2" />
            <DropdownMenuItem className="gap-3 py-2.5 rounded-xl group">
              <UserIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium">Organization</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-2.5 rounded-xl group">
              <Settings className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium">System Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5 my-1 mx-2" />
            <DropdownMenuItem className="text-destructive gap-3 py-2.5 rounded-xl group hover:bg-destructive/10 transition-colors" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 transition-colors" />
              <span className="text-sm font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Paste Modal */}
      <Dialog open={isPasteModalOpen} onOpenChange={setIsPasteModalOpen}>
        <DialogContent className="max-w-2xl bg-[#0A0A0F]/95 backdrop-blur-3xl border-white/10 rounded-3xl p-8 shadow-4xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
          <DialogHeader className="mb-6">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6">
              <ClipboardPaste className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">Import Log Stream</DialogTitle>
            <DialogDescription className="text-zinc-500 text-[15px] pt-1 leading-relaxed">
              Paste your raw log data below. LogLens AI will automatically detect format, timestamp patterns, and service identifiers.
            </DialogDescription>
          </DialogHeader>
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none group-focus-within:from-primary/30 group-focus-within:to-indigo-500/10 transition-all duration-500" />
            <Textarea
              placeholder="v1.4.2 [ERROR] Database timeout..."
              className="relative min-h-[350px] font-mono text-xs bg-black/60 border-transparent text-zinc-300 focus:border-transparent focus:ring-0 transition-all rounded-2xl p-6 leading-relaxed selection:bg-primary/40"
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter className="mt-8 gap-4">
            <Button
              variant="ghost"
              onClick={() => setIsPasteModalOpen(false)}
              className="px-8 h-12 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 font-bold transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaste}
              disabled={!pasteContent.trim()}
              className="px-8 h-12 rounded-full bg-white text-black hover:bg-zinc-200 font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              Parse Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Save Session Modal */}
      <Dialog open={isSaveSessionOpen} onOpenChange={setIsSaveSessionOpen}>
        <DialogContent className="max-w-sm bg-card/95 backdrop-blur-xl border-border">
          <DialogHeader>
            <DialogTitle>Save Analysis Session</DialogTitle>
            <DialogDescription>
              Save your current logs and filters to resume later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Session name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveSession()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveSessionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSession} disabled={!sessionName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Session Modal */}
      <Dialog open={isSessionsOpen} onOpenChange={setIsSessionsOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border">
          <DialogHeader>
            <DialogTitle>Load Session</DialogTitle>
            <DialogDescription>
              Select a saved session to restore.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 max-h-60 overflow-y-auto">
            {savedSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No saved sessions</p>
            ) : (
              savedSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.stats.totalLogs} logs · {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => { loadSession(s.id); setIsSessionsOpen(false); toast.success("Session loaded"); }}>
                      Load
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { deleteSession(s.id); toast.success("Session deleted"); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Modal */}
      <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Navigation</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Focus search</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs text-right">/ or Cmd+K</kbd>
                <span className="text-muted-foreground">Navigate logs</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs text-right">j / k or Arrows</kbd>
                <span className="text-muted-foreground">Clear selection</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs text-right">Escape</kbd>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Actions</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Copy selected log</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs text-right">c</kbd>
                <span className="text-muted-foreground">Paste logs</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs text-right">Cmd+V</kbd>
                <span className="text-muted-foreground">Upload file</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs text-right">Cmd+O</kbd>
                <span className="text-muted-foreground">Show shortcuts</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs text-right">?</kbd>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsShortcutsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

