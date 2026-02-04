"use client";

import React, { useMemo } from "react";
import { useLogStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Activity, Cpu, Database, Globe } from "lucide-react";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

export function SreDashboard() {
    const { stats } = useLogStore();

    // Simulate some SRE metrics based on the current logs
    const metricsData = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            time: `${i}:00`,
            latency: 120 + Math.random() * 80 + (i > 15 ? 100 : 0),
            ingestion: stats.totalLogs / 24 + Math.random() * 100,
            cpu: 40 + Math.random() * 20,
        }));
    }, [stats.totalLogs]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-background/50 backdrop-blur-sm border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                        Ingestion Latency
                    </CardTitle>
                    <Activity className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">142ms</div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                        <span className="text-emerald-500 font-medium">↓ 12%</span> from last hour
                    </p>
                    <div className="h-[40px] mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metricsData}>
                                <Area
                                    type="monotone"
                                    dataKey="latency"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                        Cluster CPU Load
                    </CardTitle>
                    <Cpu className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">54.2%</div>
                    <p className="text-[10px] text-muted-foreground mt-1 text-emerald-500">
                        Healthy
                    </p>
                    <div className="h-[40px] mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metricsData}>
                                <Line
                                    type="monotone"
                                    dataKey="cpu"
                                    stroke="#3b82f6"
                                    dot={false}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                        Storage Usage
                    </CardTitle>
                    <Database className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1.2 TB</div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                        Retention: 30 days hot
                    </p>
                    <div className="w-full bg-secondary h-1.5 rounded-full mt-6 overflow-hidden">
                        <div className="bg-amber-500 h-full w-[65%]" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                        Active Regions
                    </CardTitle>
                    <Globe className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">us-east-1</div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                        Primary + 2 replicas
                    </p>
                    <div className="flex gap-1 mt-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="us-east-1" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="eu-west-1" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="ap-southeast-1" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
