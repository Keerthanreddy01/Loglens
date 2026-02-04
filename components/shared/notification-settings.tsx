"use client";

import { useLogStore } from "@/store/useLogsStore";
import {
    BellRing,
    ShieldAlert,
    AlertTriangle,
    Info,
    Check
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotificationSettings() {
    const { settings, updateSettings } = useLogStore();

    const toggleSeverity = (severity: 'critical' | 'warning' | 'info') => {
        updateSettings({
            notifications: {
                ...settings.notifications,
                [severity]: !settings.notifications[severity]
            }
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <BellRing className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-64 p-4 bg-card/95 backdrop-blur-xl border-border shadow-2xl">
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <h3 className="font-semibold text-sm">Alert Rules</h3>
                    </div>

                    <div className="space-y-3">
                        {/* Critical */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-destructive" />
                                <Label className="text-xs">Critical</Label>
                            </div>
                            <Switch
                                checked={settings.notifications.critical}
                                onCheckedChange={() => toggleSeverity('critical')}
                            />
                        </div>

                        {/* Warning */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-warning" />
                                <Label className="text-xs">Warning</Label>
                            </div>
                            <Switch
                                checked={settings.notifications.warning}
                                onCheckedChange={() => toggleSeverity('warning')}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                <Label className="text-xs">Info Events</Label>
                            </div>
                            <Switch
                                checked={settings.notifications.info}
                                onCheckedChange={() => toggleSeverity('info')}
                            />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                        <p className="text-[10px] text-muted-foreground leading-tight">
                            Alerts appear as visual banners and optional sound cues based on your dashboard settings.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
