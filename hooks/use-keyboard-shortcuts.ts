"use client";

import { useEffect, useCallback, RefObject } from "react";
import { useLogStore } from "@/lib/store";
import type { ParsedLog } from "@/lib/types";

interface UseKeyboardShortcutsProps {
  searchInputRef?: RefObject<HTMLInputElement>;
  filteredLogs: ParsedLog[];
}

export function useKeyboardShortcuts({ searchInputRef, filteredLogs }: UseKeyboardShortcutsProps) {
  const {
    selectedLogId,
    selectLog,
    setLevelFilter,
    updateFilter,
  } = useLogStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      
      // "/" - Focus search (unless already in input)
      if (e.key === "/" && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchInputRef?.current?.focus();
        return;
      }

      // Escape - Clear selection and search
      if (e.key === "Escape") {
        e.preventDefault();
        selectLog(null);
        updateFilter({ search: "" });
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      // Only handle these shortcuts when not in an input
      if (isInput) return;

      // "e" - Show errors only
      if (e.key === "e" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setLevelFilter(["ERROR"]);
        return;
      }

      // "w" - Show warnings only
      if (e.key === "w" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setLevelFilter(["WARN"]);
        return;
      }

      // "i" - Show info only
      if (e.key === "i" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setLevelFilter(["INFO"]);
        return;
      }

      // "a" - Show all
      if (e.key === "a" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setLevelFilter(["ERROR", "WARN", "INFO", "DEBUG", "TRACE"]);
        return;
      }

      // Arrow key navigation
      if (e.key === "ArrowDown" && filteredLogs.length > 0) {
        e.preventDefault();
        if (!selectedLogId) {
          selectLog(filteredLogs[0].id);
        } else {
          const currentIndex = filteredLogs.findIndex((l) => l.id === selectedLogId);
          if (currentIndex < filteredLogs.length - 1) {
            selectLog(filteredLogs[currentIndex + 1].id);
          }
        }
        return;
      }

      if (e.key === "ArrowUp" && filteredLogs.length > 0) {
        e.preventDefault();
        if (!selectedLogId) {
          selectLog(filteredLogs[filteredLogs.length - 1].id);
        } else {
          const currentIndex = filteredLogs.findIndex((l) => l.id === selectedLogId);
          if (currentIndex > 0) {
            selectLog(filteredLogs[currentIndex - 1].id);
          }
        }
        return;
      }

      // "j" - Next log (vim-style)
      if (e.key === "j" && filteredLogs.length > 0) {
        e.preventDefault();
        if (!selectedLogId) {
          selectLog(filteredLogs[0].id);
        } else {
          const currentIndex = filteredLogs.findIndex((l) => l.id === selectedLogId);
          if (currentIndex < filteredLogs.length - 1) {
            selectLog(filteredLogs[currentIndex + 1].id);
          }
        }
        return;
      }

      // "k" - Previous log (vim-style)
      if (e.key === "k" && filteredLogs.length > 0) {
        e.preventDefault();
        if (!selectedLogId) {
          selectLog(filteredLogs[filteredLogs.length - 1].id);
        } else {
          const currentIndex = filteredLogs.findIndex((l) => l.id === selectedLogId);
          if (currentIndex > 0) {
            selectLog(filteredLogs[currentIndex - 1].id);
          }
        }
        return;
      }

      // "c" - Copy selected log
      if (e.key === "c" && selectedLogId && !e.ctrlKey && !e.metaKey) {
        const selectedLog = filteredLogs.find((l) => l.id === selectedLogId);
        if (selectedLog) {
          navigator.clipboard.writeText(selectedLog.rawLine);
        }
        return;
      }
    },
    [selectedLogId, selectLog, setLevelFilter, updateFilter, filteredLogs, searchInputRef]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
