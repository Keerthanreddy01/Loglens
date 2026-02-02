"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Download } from "lucide-react";
import { useLogStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function getHeatmapColor(value: number, max: number): string {
  if (value === 0) return "bg-secondary";
  const intensity = value / max;
  if (intensity < 0.2) return "bg-primary/20";
  if (intensity < 0.4) return "bg-primary/40";
  if (intensity < 0.6) return "bg-primary/60";
  if (intensity < 0.8) return "bg-primary/80";
  return "bg-primary";
}

export function ServiceHeatmap() {
  const { parsedLogs, stats, setActiveTab } = useLogStore();

  // Generate heatmap data from actual logs
  const data = useMemo(() => {
    if (parsedLogs.length === 0) return [];

    const services = stats.services.length > 0 ? stats.services : ["unknown"];
    const buckets = 24; // 24 time buckets

    return services.slice(0, 6).map((service) => {
      const serviceLogs = parsedLogs.filter((l) => l.service === service);
      const bucketData: { time: string; count: number }[] = [];

      for (let i = 0; i < buckets; i++) {
        const hour = i.toString().padStart(2, "0") + ":00";
        const count = serviceLogs.filter((l) => {
          const ts = l.timestamp instanceof Date ? l.timestamp : new Date(l.timestamp);
          return ts.getHours() === i;
        }).length;
        bucketData.push({ time: hour, count });
      }

      return { service, data: bucketData };
    });
  }, [parsedLogs, stats.services]);

  // Find max value for color scaling
  const maxValue = useMemo(() => {
    let max = 1;
    for (const service of data) {
      for (const point of service.data) {
        if (point.count > max) max = point.count;
      }
    }
    return max;
  }, [data]);

  // Time labels (every 4 hours)
  const timeLabels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"];

  const handleExportCSV = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Service", ...Array.from({ length: 24 }, (_, i) => `${i}:00`)];
    const rows = data.map((service) => [
      service.service,
      ...service.data.map((d) => d.count),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `service-heatmap-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported heatmap data");
  };

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Log Volume by Service
        </h3>
        <div className="flex items-center justify-center h-[120px] text-muted-foreground text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Log Volume by Service
          </h3>
          <p className="text-xs text-muted-foreground">
            Distribution of events across infrastructure layers (Last 24h)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 bg-transparent"
            onClick={handleExportCSV}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            className="text-xs h-8 bg-primary hover:bg-primary/90"
            onClick={() => setActiveTab("alerts")}
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-1">
        {data.map((service) => (
          <div key={service.service} className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground w-20 text-right truncate">
              {service.service}
            </span>
            <div className="flex-1 flex gap-0.5">
              {service.data.map((point, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex-1 h-6 rounded-sm transition-colors hover:ring-1 hover:ring-primary cursor-pointer",
                    getHeatmapColor(point.count, maxValue)
                  )}
                  title={`${service.service} at ${point.time}: ${point.count} logs`}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Time axis */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-20" />
          <div className="flex-1 flex justify-between text-xs text-muted-foreground">
            {timeLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
