"use client";

import { cn } from "@/lib/utils";
import { useLogStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

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
  };

  return (
    <aside className="w-[250px] border-r border-border bg-background flex flex-col h-full shrink-0">
      {/* Quick Stats - Fixed at top */}
      <div className="border-b border-border p-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Quick Stats
          </h3>
          {parsedLogs.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              onClick={clearLogs}
              title="Clear all logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Logs (24h)</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-foreground">
                {stats.totalLogs > 1000
                  ? `${(stats.totalLogs / 1000).toFixed(1)}K`
                  : stats.totalLogs || '0'}
              </p>
              {stats.totalLogs > 0 && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                  <TrendingUp className="h-3 w-3" />
                  +{Math.min(100, Math.round(stats.totalLogs / 10))}%
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Error Rate</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-foreground">
                {stats.errorRate.toFixed(2)}%
              </p>
              <span className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                stats.errorRate > 5 ? "text-destructive" : "text-success"
              )}>
                {stats.errorRate > 5 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stats.errorRate > 5 ? '+' : '-'}{Math.abs(stats.errorRate - 2).toFixed(0)}%
              </span>
            </div>
          </div>
          
          {/* Additional Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Count</span>
              <span className="text-foreground font-medium text-destructive">{stats.errorCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Warning Count</span>
              <span className="text-foreground font-medium text-warning">{stats.warnCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Services</span>
              <span className="text-foreground font-medium">{stats.activeServices}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto log-viewer-scroll min-h-0">
        {/* Smart Filters */}
        <div className="border-b border-border p-4">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Smart Filters
          </h3>
          <div className="space-y-1">
            <button
              onClick={resetAllFilters}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                isAllProduction
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Filter className="w-4 h-4 text-primary" />
              <span>All Production</span>
            </button>

            <button
              onClick={() => toggleSmartFilter("criticalOnly")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                smartFilters.criticalOnly
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Critical Errors</span>
              {smartFilters.criticalOnly && (
                <span className="ml-auto text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">
                  {parsedLogs.filter(l => l.level === 'ERROR').length}
                </span>
              )}
            </button>

            <button
              onClick={() => toggleSmartFilter("performanceIssues")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                smartFilters.performanceIssues
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Database className="w-4 h-4" />
              <span>DB Slow Queries</span>
            </button>

            <button
              onClick={() => toggleSmartFilter("securityEvents")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                smartFilters.securityEvents
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Shield className="w-4 h-4" />
              <span>Security Events</span>
            </button>

            <button
              onClick={() => toggleSmartFilter("userActions")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                smartFilters.userActions
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <User className="w-4 h-4" />
              <span>User Actions</span>
            </button>
          </div>
        </div>

        {/* Saved Queries */}
        <div className="p-4">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Saved Queries
          </h3>
          <div className="space-y-1">
            {savedQueries.map((query) => (
              <div
                key={query.id}
                className="group flex items-center w-full"
              >
                <button
                  onClick={() => applySavedQuery(query)}
                  className="flex-1 flex items-center gap-3 px-3 py-2 rounded-l-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left"
                >
                  <Star className="w-4 h-4 text-warning" />
                  <span>{query.name}</span>
                </button>
                <button
                  onClick={() => removeSavedQuery(query.id)}
                  className="p-2 rounded-r-md text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove query"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {savedQueries.length === 0 && (
              <p className="text-sm text-muted-foreground px-3 py-2">No saved queries</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
