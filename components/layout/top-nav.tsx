"use client";

import React from "react"
import { useRef, useState, useEffect } from "react";
import { Search, Bell, Settings, ChevronRight, Upload, Trash2, Keyboard, FileUp, ClipboardPaste, Database, Save, FileDown, Share2, GitCompare, LogOut, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogStore } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function TopNav() {
  const { loadLogs, loadSampleLogs, clearLogs, updateFilter, parsedLogs, stats, saveSession, savedSessions, loadSession, deleteSession, getFilteredLogs, loadLogsForComparison, comparisonLogs, clearComparison } = useLogStore();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const userInitial = user?.email?.[0].toUpperCase() ?? "U";

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity interactive-element">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">LogLens</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">Projects</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Production</span>
        </nav>
      </div>

      <div className="flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            placeholder="Search logs..."
            className="pl-10 pr-20 bg-secondary border-border text-sm h-9 focus:border-primary"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleGlobalSearch}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-muted rounded border border-border text-muted-foreground">
            {navigator.platform?.includes("Mac") ? "Cmd" : "Ctrl"}+K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Upload/Import Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground interactive-element">
              <Upload className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setIsPasteModalOpen(true)} className="gap-2">
              <ClipboardPaste className="w-4 h-4" />
              Paste Logs
              <DropdownMenuShortcut>{navigator.platform?.includes("Mac") ? "Cmd" : "Ctrl"}+V</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2">
              <FileUp className="w-4 h-4" />
              Upload File
              <DropdownMenuShortcut>{navigator.platform?.includes("Mac") ? "Cmd" : "Ctrl"}+O</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => compareFileInputRef.current?.click()} className="gap-2">
              <GitCompare className="w-4 h-4" />
              Compare with File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLoadSample} className="gap-2">
              <Database className="w-4 h-4" />
              Load Sample Data
            </DropdownMenuItem>
            {parsedLogs.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsSaveSessionOpen(true)} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Session
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSessionsOpen(true)} className="gap-2">
                  <Database className="w-4 h-4" />
                  Load Session ({savedSessions.length})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportReport} className="gap-2">
                  <FileDown className="w-4 h-4" />
                  Export Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareReport} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Copy Share Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClearLogs} className="text-destructive gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear All Logs
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          ref={fileInputRef}
          type="file"
          accept=".log,.txt,.json"
          className="hidden"
          onChange={handleFileUpload}
        />
        <input
          ref={compareFileInputRef}
          type="file"
          accept=".log,.txt,.json"
          className="hidden"
          onChange={handleCompareFileUpload}
        />

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative interactive-element">
              <Bell className="w-5 h-5" />
              {stats.errorRate > 5 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {stats.errorRate > 5 ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-destructive">High Error Rate Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Error rate is currently at {stats.errorRate.toFixed(1)}% which exceeds the 5% threshold.
                  </p>
                </div>
              ) : parsedLogs.length > 0 ? (
                <p className="text-sm text-muted-foreground">All systems operating normally.</p>
              ) : (
                <p className="text-sm text-muted-foreground">No notifications. Load some logs to get started.</p>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Keyboard Shortcuts */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground interactive-element"
          onClick={() => setIsShortcutsOpen(true)}
        >
          <Keyboard className="w-5 h-5" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground interactive-element"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
              <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-400">
                <AvatarFallback className="bg-transparent text-white text-xs font-medium">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0]}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <UserIcon className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive gap-2" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Paste Modal */}
      <Dialog open={isPasteModalOpen} onOpenChange={setIsPasteModalOpen}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-border">
          <DialogHeader>
            <DialogTitle>Paste Your Logs</DialogTitle>
            <DialogDescription>
              Paste raw log content below. Supported formats: standard logs, JSON, Apache/Nginx access logs.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Paste your logs here..."
            className="min-h-[300px] font-mono text-sm bg-secondary border-border"
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaste} disabled={!pasteContent.trim()}>
              Parse Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your LogLens preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Settings panel coming soon. This will include theme options, log parsing preferences, and notification settings.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Close
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
