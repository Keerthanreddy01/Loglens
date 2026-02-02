"use client";

import { Sparkles } from "lucide-react";
import { useLogStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export function AIInsightCard() {
  const { insights, stats, patterns } = useLogStore();

  // Get the most relevant insight
  const primaryInsight = insights[0];
  const topPattern = patterns[0];

  // Fallback content if no insights
  if (!primaryInsight && stats.totalLogs === 0) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            AI Insight
          </p>
          <p className="text-sm text-muted-foreground">
            Load some logs to get AI-powered insights and recommendations.
          </p>
        </div>
      </div>
    );
  }

  // Generate dynamic insight content
  let title = "Analysis Complete";
  let description = `Analyzed ${stats.totalLogs} log entries.`;
  let recommendation = "No critical issues detected.";
  let linkText = "";

  if (primaryInsight) {
    title = primaryInsight.title;
    description = primaryInsight.description;
    recommendation = primaryInsight.recommendation || "Review the logs for more details.";

    // Try to extract service name from the insight
    if (topPattern && topPattern.examples[0]) {
      const serviceMatch = topPattern.examples[0].match(/\[([a-zA-Z0-9_-]+)\]/);
      if (serviceMatch) {
        linkText = serviceMatch[1];
      }
    }
  } else if (stats.errorCount > 0) {
    title = `${stats.errorCount} Errors`;
    description = `Detected ${stats.errorRate.toFixed(1)}% error rate`;

    if (topPattern) {
      const patternPreview = topPattern.pattern.substring(0, 40);
      recommendation = `Most common: "${patternPreview}..."`;

      const serviceMatch = topPattern.examples[0]?.match(/\[([a-zA-Z0-9_-]+)\]/);
      if (serviceMatch) {
        linkText = serviceMatch[1];
      }
    }
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
      <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          AI Insight
        </p>
        <p className="text-sm text-foreground">
          {description}
          {title && (
            <>
              {" "}
              <span className="font-semibold">{title}</span>
            </>
          )}
          {linkText && (
            <>
              {" "}
              originating from{" "}
              <span className="text-primary font-medium">{linkText}</span>.
            </>
          )}
        </p>
        {recommendation && (
          <p className="text-sm text-muted-foreground">
            Recommendation: {recommendation}
          </p>
        )}
        {topPattern && (topPattern.confidenceScore ?? 0) > 0 && (
          <Badge variant="outline" className="mt-2 text-[10px] font-normal">
            Confidence: {(topPattern.confidenceScore ?? 0)}%
          </Badge>
        )}
      </div>
    </div>
  );
}
