"use client";

import { useEffect, useRef } from "react";
import { useLogStore } from "@/lib/store";
import { toast } from "sonner";
import { audioSystem } from "@/lib/audio";

export function useNotifications() {
    const { stats, settings, parsedLogs } = useLogStore();
    const lastErrorCount = useRef(stats.errorCount);
    const lastTotalLogs = useRef(parsedLogs.length);

    useEffect(() => {
        if (!settings.soundsEnabled && !settings.notifications.critical) return;

        // Detect new errors
        if (stats.errorCount > lastErrorCount.current) {
            const newErrors = stats.errorCount - lastErrorCount.current;

            if (settings.notifications.critical) {
                toast.error(`Detected ${newErrors} new critical errors`, {
                    description: "Check the live stream for details.",
                    duration: 4000,
                });
            }

            if (settings.soundsEnabled) {
                const volMap = { low: 0.2, medium: 0.5, high: 0.8 };
                audioSystem?.play('error', volMap[settings.volume]);
            }
        }

        // Detect high error rate spike
        if (stats.errorRate > 15 && lastTotalLogs.current < parsedLogs.length) {
            // Only alert if we just loaded more logs or it's a spike
            if (settings.notifications.critical) {
                toast.warning("High Error Rate Spike", {
                    description: `System error rate is now ${stats.errorRate.toFixed(1)}%`,
                });
            }
        }

        lastErrorCount.current = stats.errorCount;
        lastTotalLogs.current = parsedLogs.length;
    }, [stats.errorCount, stats.errorRate, parsedLogs.length, settings]);
}
