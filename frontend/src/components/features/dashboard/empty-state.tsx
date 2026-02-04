"use client";

import React from "react";
import { useState, useRef } from "react";
import { useLogStore } from "@/lib/store";
import {
  ClipboardPaste,
  FileUp,
  Sparkles,
  Terminal,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";

export function EmptyState() {
  const { loadLogs, loadSampleLogs } = useLogStore();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        loadLogs(content);
        toast.success(`Loaded logs from ${file.name}`);
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
      toast.success("Logs imported successfully");
      setIsPasteModalOpen(false);
      setPasteContent("");
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#050507] overflow-y-auto relative">
      <div className="noise-overlay" />

      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[30%] h-[30%] bg-purple-500/3 blur-[100px] rounded-full" />
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto px-8 py-12 relative z-10">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="relative mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A0A0F] border border-white/[0.08] shadow-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#050507] border border-white/10">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
            No logs yet
          </h1>

          <p className="text-sm text-zinc-500 max-w-md">
            Import logs to start analyzing your infrastructure
          </p>
        </motion.div>

        {/* Action Cards - Horizontal Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Paste Logs */}
          <button
            onClick={() => setIsPasteModalOpen(true)}
            className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
                <ClipboardPaste className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">Paste Logs</div>
                <div className="text-xs text-zinc-500">Copy & paste log data</div>
              </div>
            </div>
          </button>

          {/* Upload File */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
                <FileUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">Upload File</div>
                <div className="text-xs text-zinc-500">JSON, text, or log files</div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".log,.txt,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>

          {/* Load Sample */}
          <button
            onClick={() => {
              loadSampleLogs();
              toast.success("Sample logs loaded");
            }}
            className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
                <Terminal className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">Load Sample</div>
                <div className="text-xs text-zinc-500">Try with demo data</div>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-6 text-xs text-zinc-600"
        >
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-emerald-400" />
            <span>Real-time analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-blue-400" />
            <span>AI-powered insights</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-purple-400" />
            <span>Instant alerts</span>
          </div>
        </motion.div>
      </div>

      {/* Paste Modal */}
      <Dialog open={isPasteModalOpen} onOpenChange={setIsPasteModalOpen}>
        <DialogContent className="bg-[#0A0A0F] border-white/[0.08] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Paste Log Data</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste your log data here (JSON, plain text, or structured logs)..."
              className="min-h-[300px] bg-black/40 border-white/[0.08] text-white placeholder:text-zinc-600 font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsPasteModalOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaste}
              disabled={!pasteContent.trim()}
              className="bg-white text-black hover:bg-zinc-100"
            >
              Import Logs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
