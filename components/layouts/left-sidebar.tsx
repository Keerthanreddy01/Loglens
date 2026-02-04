"use client";

import { cn } from "@/lib/utils";
import { useLogStore } from "@/lib/store";
import { Button } from "@/ui/button";
import {
  Filter,
  AlertCircle,
  Database,
  Shield,
  User,
  Star,
  TrendingUp,
  TrendingDown,
  Trash2,
  X,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export function LeftSidebar() {
  const {
    parsedLogs,
    stats,
    smartFilters,
    toggleSmartFilter,
    savedQueries,
    applySavedQuery,
    removeSavedQuery,
    filter,
    updateFilter,
    setLevelFilter,
    clearLogs,
  } = useLogStore();

  // Determine active state
  const isAllProduction = !smartFilters.criticalOnly && !smartFilters.performanceIssues && !smartFilters.securityEvents && !smartFilters.userActions;

  const resetAllFilters = () => {
    // Reset smart filters
    if (smartFilters.criticalOnly) toggleSmartFilter("criticalOnly");
    if (smartFilters.performanceIssues) toggleSmartFilter("performanceIssues");
    if (smartFilters.securityEvents) toggleSmartFilter("securityEvents");
    if (smartFilters.userActions) toggleSmartFilter("userActions");
    // Reset level filter to all
    setLevelFilter(['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE']);
    // Clear search
    updateFilter({ search: '' });
    toast.success("All filters cleared");
  };

  const handleApplySavedQuery = (query: typeof savedQueries[0]) => {
    applySavedQuery(query);
    toast.success(`Applied filter: ${query.name}`);
  };

  const handleRemoveSavedQuery = (id: string, name: string) => {
    removeSavedQuery(id);
    toast.success(`Removed: ${name}`);
  };

  const handleClearLogs = () => {
    clearLogs();
    toast.success("All logs cleared");
  };

  // Count logs for each filter
  const errorCount = parsedLogs.filter(l => l.level === 'ERROR').length;
  const slowQueryCount = parsedLogs.filter(l =>
    l.rawLine.toLowerCase().includes('slow') ||
    l.rawLine.toLowerCase().includes('timeout')
  ).length;
  const securityCount = parsedLogs.filter(l =>
    l.rawLine.toLowerCase().includes('auth') ||
    l.rawLine.toLowerCase().includes('security')
  ).length;

  return (
    <aside className="w-[280px] bg-transparent flex flex-col shrink-0 overflow-hidden px-4 py-2 relative z-20">
      {/* Quick Stats Grid */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Telemetry
          </h3>
          {parsedLogs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-zinc-600 hover:text-white transition-colors"
              onClick={handleClearLogs}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Major Stat Card */}
        <div className="dashboard-card p-5 border-white/[0.05] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full pointer-events-none" />
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3">Error Velocity</p>
          <div className="flex items-baseline justify-between">
            <h4 className={cn(
              "text-3xl font-bold tracking-tighter tabular-nums",
              stats.errorRate > 5 ? "text-destructive" : "text-white"
            )}>
              {stats.errorRate.toFixed(1)}%
            </h4>
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-full",
              stats.errorRate > 5 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
            )}>
              {stats.errorRate > 5 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(stats.errorRate - 2).toFixed(1)}%
            </div>
          </div>
          {/* Subtle sparkline placeholder or detail */}
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.errorRate * 5, 100)}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                stats.errorRate > 5 ? "bg-destructive" : "bg-success"
              )}
            />
          </div>
        </div>

        {/* Minor Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="dashboard-card p-4 border-white/[0.03]">
            <span className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Logs</span>
            <span className="text-white font-bold text-lg tabular-nums">
              {stats.totalLogs > 1000 ? `${(stats.totalLogs / 1000).toFixed(1)}K` : stats.totalLogs}
            </span>
          </div>
          <div className="dashboard-card p-4 border-white/[0.03]">
            <span className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Services</span>
            <span className="text-white font-bold text-lg tabular-nums">{stats.activeServices}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-8">
        {/* Source Filters */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-2 mb-4">
            Intelligence
          </h3>
          <div className="space-y-1">
            {[
              { id: 'all', label: 'All Traffic', icon: <Database className="w-4 h-4" />, active: isAllProduction, action: resetAllFilters },
              { id: 'critical', label: 'Critical Path', icon: <AlertCircle className="w-4 h-4" />, active: smartFilters.criticalOnly, count: errorCount, color: 'destructive', action: () => toggleSmartFilter("criticalOnly") },
              { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" />, active: smartFilters.performanceIssues, count: slowQueryCount, color: 'warning', action: () => toggleSmartFilter("performanceIssues") },
              { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" />, active: smartFilters.securityEvents, count: securityCount, color: 'purple-400', action: () => toggleSmartFilter("securityEvents") },
            ].map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all group relative overflow-hidden",
                  item.active
                    ? "bg-white/[0.04] text-white border border-white/[0.08]"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] border border-transparent"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  item.active ? "text-primary" : "group-hover:text-white"
                )}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums",
                    item.active ? "bg-white/10 text-white" : "bg-white/[0.03] text-zinc-500"
                  )}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Perspectives */}
        <div>
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Saved Views
            </h3>
          </div>
          <div className="space-y-1">
            {savedQueries.map((query) => (
              <div key={query.id} className="group flex items-center w-full relative">
                <button
                  onClick={() => handleApplySavedQuery(query)}
                  className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-zinc-500 hover:text-white hover:bg-white/[0.02] transition-all"
                >
                  <Star className="w-3.5 h-3.5 text-zinc-600 group-hover:text-warning transition-colors" />
                  <span className="truncate">{query.name}</span>
                </button>
                <button
                  onClick={() => handleRemoveSavedQuery(query.id, query.name)}
                  className="absolute right-2 p-2 text-zinc-600 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {savedQueries.length === 0 && (
              <p className="text-[11px] text-zinc-600 px-4 py-2 font-medium italic">No custom views</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
