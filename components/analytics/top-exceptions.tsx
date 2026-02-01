"use client";

import { useMemo } from "react";
import { useLogStore } from "@/lib/store";
import { toast } from "sonner";

export function TopExceptions() {
  const { patterns, parsedLogs } = useLogStore();

  const exceptions = useMemo(() => {
    if (patterns.length === 0) {
      // Generate from error logs if no patterns
      const errorLogs = parsedLogs.filter((l) => l.level === "ERROR");
      const grouped: Map<string, number> = new Map();

      for (const log of errorLogs) {
        // Extract exception type from message
        const match = log.message.match(
          /(timeout|connection|error|exception|failed|refused)/i
        );
        const type = match
          ? `${match[1].charAt(0).toUpperCase()}${match[1].slice(1).toLowerCase()}: ${log.service}`
          : `Error: ${log.service}`;
        grouped.set(type, (grouped.get(type) || 0) + 1);
      }

      return Array.from(grouped.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    return patterns.slice(0, 5).map((p) => ({
      type: p.pattern.substring(0, 50) + (p.pattern.length > 50 ? "..." : ""),
      count: p.count,
    }));
  }, [patterns, parsedLogs]);

  const handleViewStack = (type: string) => {
    toast.info(`Viewing stack trace for: ${type.substring(0, 30)}...`);
  };

  if (exceptions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Top Exceptions
        </h3>
        <div className="flex items-center justify-center h-[120px] text-muted-foreground text-sm">
          No exceptions detected
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Top Exceptions
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="text-xs text-muted-foreground font-medium pb-3 pr-4">
                Exception Type
              </th>
              <th className="text-xs text-muted-foreground font-medium pb-3 pr-4 text-right">
                Count
              </th>
              <th className="text-xs text-muted-foreground font-medium pb-3 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {exceptions.map((exception, index) => (
              <tr key={index}>
                <td className="py-3 pr-4">
                  <span className="text-sm font-mono text-foreground">
                    {exception.type}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right">
                  <span className="text-sm font-semibold text-foreground">
                    {exception.count.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => handleViewStack(exception.type)}
                    className="text-sm text-primary hover:underline"
                  >
                    View Stack
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
