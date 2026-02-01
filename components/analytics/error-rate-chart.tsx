"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLogStore } from "@/lib/store";
import { generateTimelineData } from "@/lib/log-parser";

export function ErrorRateChart() {
  const { parsedLogs } = useLogStore();

  const data = useMemo(() => {
    if (parsedLogs.length === 0) return [];

    const timeline = generateTimelineData(parsedLogs);
    return timeline.map((point) => ({
      time: point.time,
      rate: point.total > 0 ? ((point.errors / point.total) * 100).toFixed(1) : 0,
      errors: point.errors,
    }));
  }, [parsedLogs]);

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Error Rate Over Time
        </h3>
        <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Error Rate Over Time
        </h3>
        <span className="text-xs text-muted-foreground">Real-time update</span>
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="time"
              stroke="#525252"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#525252"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={30}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #262626",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: number) => [`${value}%`, "Error Rate"]}
            />
            <Bar dataKey="rate" fill="#b45309" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
