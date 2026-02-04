import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useLogStore } from "@/lib/store";
import { Badge } from "@/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/ui/button";

export function AIInsightCard() {
  const { insights, stats, patterns, isAiInsightCollapsed, toggleAiInsightCollapsed, settings } = useLogStore();

  if (!settings.showAiInsights) return null;

  // Get the most relevant insight
  const primaryInsight = insights[0];
  const topPattern = patterns[0];

  // Fallback content if no insights
  if (!primaryInsight && stats.totalLogs === 0) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg border border-border bg-card/30">
        <Sparkles className="w-3.5 h-3.5 text-muted-foreground/50" />
        <p className="text-xs text-muted-foreground">
          Waiting for logs to generate AI insights...
        </p>
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

  const confidence = topPattern?.confidenceScore ?? 0;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isAiInsightCollapsed ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onClick={toggleAiInsightCollapsed}
            className="group flex items-center justify-between px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <p className="text-xs text-zinc-400 truncate">
                <span className="font-medium text-zinc-300 mr-2">AI Insight:</span>
                {description} {title}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              {confidence > 0 && (
                <span className="text-[10px] text-zinc-500 font-mono">
                  {confidence}% confidence
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative flex flex-col gap-3 p-4 rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-md bg-primary/10">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      AI System Insight
                    </p>
                    {confidence > 0 && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        • {confidence}% confidence
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {title}
                  </h3>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAiInsightCollapsed();
                }}
                className="h-6 w-6 text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="pl-9 space-y-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                {description}
                {linkText && (
                  <>
                    {" "}
                    originating from{" "}
                    <span className="text-primary/90 font-semibold">{linkText}</span>.
                  </>
                )}
              </p>

              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <p className="text-[13px] text-zinc-300">
                  <span className="text-primary/70 font-medium mr-2">Recommendation:</span>
                  {recommendation}
                </p>
              </div>

              {topPattern && (
                <div className="flex items-center gap-2">
                  <div className="text-[10px] text-zinc-500">
                    Based on {topPattern.count} similar patterns
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

