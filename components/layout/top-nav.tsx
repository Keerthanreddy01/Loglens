"use client";

import React from "react"

import { useRef, useState } from "react";
import { Search, Bell, Settings, ChevronRight, Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogStore } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";

export function TopNav() {
  const { loadLogs, loadSampleLogs, clearLogs, updateFilter, parsedLogs } = useLogStore();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        loadLogs(content);
        toast.success(`Loaded ${content.split("\n").length} log lines from ${file.name}`);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handlePaste = () => {
    if (pasteContent.trim()) {
      loadLogs(pasteContent);
      toast.success(`Loaded ${pasteContent.split("\n").filter((l) => l.trim()).length} log lines`);
      setIsPasteModalOpen(false);
      setPasteContent("");
    }
  };

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateFilter({ search: globalSearch });
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-foreground">LogLens</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer">Projects</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Production</span>
        </nav>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs (e.g. status:500 service:api)"
            className="pl-10 bg-secondary border-border text-sm h-9"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleGlobalSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Upload/Import Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Upload className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsPasteModalOpen(true)}>
              Paste Logs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              Upload File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={loadSampleLogs}>
              Load Sample Data
            </DropdownMenuItem>
            {parsedLogs.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearLogs} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
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

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
        <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400">
          <AvatarFallback className="bg-transparent text-white text-xs">
            JD
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Paste Modal */}
      <Dialog open={isPasteModalOpen} onOpenChange={setIsPasteModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Paste Your Logs</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Paste your logs here...

Example format:
2024-02-01T10:15:23.456Z INFO [server] Application started on port 3000
2024-02-01T10:15:24.123Z ERROR [api] Connection timeout"
            className="min-h-[300px] font-mono text-sm"
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
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
    </header>
  );
}
