"use client";

import React from "react";
import { AlertCircle, Clock, Server, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogStore } from "@/lib/store";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  subValueColor?: "success" | "error" | "warning" | "default";
  icon: React.ReactNode;
}

function StatCard({
  label,
  value,
  subValue,
  subValueColor = "default",
  icon,
}: StatCardProps) {
  const colorMap = {
    success: "text-success",
    error: "text-destructive",
    warning: "text-warning",
    default: "text-muted-foreground",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-3xl font-semibold text-foreground tracking-tight">
            {value}
          </p>
          {subValue && (
            <p className={cn("text-xs mt-1", colorMap[subValueColor])}>
              {subValue}
            </p>
          )}
        </div>
        <div className="p-2 rounded-md">{icon}</div>
      </div>
    </div>
  );
}

export function StatsCards() {
  const { stats } = useLogStore();

  const errorRateColor: "success" | "error" | "warning" =
    stats.errorRate > 10 ? "error" : stats.errorRate > 5 ? "warning" : "success";

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Error Rate"
        value={`${stats.errorRate.toFixed(2)}%`}
        subValue={
          stats.errorRate > 5
            ? `${stats.errorCount} errors detected`
            : "Within normal range"
        }
        subValueColor={errorRateColor}
        icon={<AlertCircle className="w-5 h-5 text-destructive" />}
      />
      <StatCard
        label="P99 Latency"
        value={
          stats.avgResponseTime > 0 ? `${stats.avgResponseTime.toFixed(0)}ms` : "N/A"
        }
        subValue={stats.avgResponseTime > 200 ? "Higher than usual" : "Stable latency"}
        subValueColor={stats.avgResponseTime > 200 ? "warning" : "success"}
        icon={<Clock className="w-5 h-5 text-primary" />}
      />
      <StatCard
        label="Total Requests"
        value={
          stats.totalLogs > 1000
            ? `${(stats.totalLogs / 1000).toFixed(1)}K`
            : stats.totalLogs.toString()
        }
        subValue="Stable throughput"
        subValueColor="default"
        icon={<Server className="w-5 h-5 text-muted-foreground" />}
      />
      <StatCard
        label="Active Alerts"
        value={stats.errorCount > 0 ? Math.min(stats.errorCount, 10).toString() : "0"}
        subValue={stats.errorCount > 0 ? "Requires attention" : "All clear"}
        subValueColor={stats.errorCount > 0 ? "warning" : "success"}
        icon={<Bell className="w-5 h-5 text-warning" />}
      />
    </div>
  );
}
