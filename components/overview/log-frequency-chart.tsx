"use client";

import { useMemo, useCallback } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceDot,
} from "recharts";
import { useLogStore } from "@/lib/store";
import { generateTimelineData } from "@/lib/log-parser";
import { toast } from "sonner";

export function LogFrequencyChart() {
  const { parsedLogs, updateFilter } = useLogStore();

  const data = useMemo(() => {
    if (parsedLogs.length === 0) return [];
    return generateTimelineData(parsedLogs);
  }, [parsedLogs]);

  const handleChartClick = useCallback((chartData: { activePayload?: Array<{ payload: { timestamp: Date } }> }) => {
    if (chartData?.activePayload?.[0]?.payload) {
      const clickedTime = chartData.activePayload[0].payload.timestamp;
      const clickedDate = clickedTime instanceof Date ? clickedTime : new Date(clickedTime);
      const hour = clickedDate.getHours().toString().padStart(2, '0');
      toast.info(`Filtering logs around ${hour}:00`);
    }
  }, []);

  // Compute colors in JS - CSS variables won't work with Recharts
  const chartColors = {
    stroke: "#0070f3",
    fill: "rgba(0, 112, 243, 0.1)",
    errorStroke: "#ef4444",
    errorFill: "rgba(239, 68, 68, 0.3)",
  };

  // Find error spikes (points with errors > 0)
  const errorSpikes = data.filter((point) => point.errors > 0);

  if (data.length === 0) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onClick={handleChartClick}
          style={{ cursor: "pointer" }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.stroke}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={chartColors.stroke}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#525252"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#525252"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
            }
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #262626",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#a1a1aa" }}
            formatter={(value: number, name: string) => [
              value,
              name === "total"
                ? "Total"
                : name === "errors"
                  ? "Errors"
                  : name,
            ]}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke={chartColors.stroke}
            strokeWidth={2}
            fill="url(#colorTotal)"
            dot={false}
            activeDot={{
              r: 4,
              fill: chartColors.stroke,
              stroke: "#000",
              strokeWidth: 2,
            }}
          />
          {/* Error spikes as reference dots */}
          {errorSpikes.map((point, index) => (
            <ReferenceDot
              key={`error-${index}`}
              x={point.time}
              y={point.total}
              r={5}
              fill="#ef4444"
              stroke="#000"
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
