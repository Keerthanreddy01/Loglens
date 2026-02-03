"use client";

import { Sparkles } from "lucide-react";
import { useLogStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

export function AIInsightCard() {
  const { insights, stats, patterns } = useLogStore();

  // Get the most relevant insight
  const primaryInsight = insights[0];
  const topPattern = patterns[0];

  // Fallback content if no insights
  if (!primaryInsight && stats.totalLogs === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card shadow-sm"
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        </motion.div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            AI Insight
          </p>
          <p className="text-sm text-muted-foreground">
            Load some logs to get AI-powered insights and recommendations.
          </p>
        </div>
      </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-3 p-3 rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm bg-gradient-to-br from-primary/10 to-transparent shadow-md hover:border-primary/40 transition-colors"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
      </motion.div>
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-bold text-primary/80 uppercase tracking-[0.1em]">
          AI Insight
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          {description}
          {title && (
            <>
              {" "}
              <span className="font-bold text-foreground">{title}</span>
            </>
          )}
          {linkText && (
            <>
              {" "}
              originating from{" "}
              <span className="text-primary font-bold underline decoration-primary/20 text-glow">{linkText}</span>.
            </>
          )}
        </p>
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {recommendation && (
            <p className="text-[13px] text-muted-foreground italic">
              Recommendation: {recommendation}
            </p>
          )}
          {topPattern && (topPattern.confidenceScore ?? 0) > 0 && (
            <Badge variant="outline" className="mt-2 text-[10px] font-black uppercase tracking-tighter border-primary/30 text-primary/80">
              Confidence: {(topPattern.confidenceScore ?? 0)}%
            </Badge>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
